import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_TEMPERATURE = 0.3;
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX_ENTRIES = 200;

type ExplainPayload = {
  quizTitle?: string;
  question: string;
  answers: Record<string, string>;
  correctAnswers: string[];
  selectedAnswers?: string[];
};

type ExplainPayloadInput = Partial<ExplainPayload>;

type ModelSpec = {
  id: string;
  timeoutMs: number;
  maxTokens: number;
};

type CacheEntry = {
  text: string;
  model: string;
  createdAt: number;
};

const MODEL_PRIORITY: ModelSpec[] = [
  { id: "llama-3.3-70b-versatile", timeoutMs: 12000, maxTokens: 360 },
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    timeoutMs: 10000,
    maxTokens: 360,
  },
  { id: "openai/gpt-oss-120b", timeoutMs: 12000, maxTokens: 360 },
  { id: "qwen/qwen3-32b", timeoutMs: 9000, maxTokens: 360 },
  { id: "llama-3.1-8b-instant", timeoutMs: 8000, maxTokens: 320 },
  { id: "groq/compound", timeoutMs: 8000, maxTokens: 320 },
  { id: "groq/compound-mini", timeoutMs: 8000, maxTokens: 320 },
  { id: "groq/prompt-guard", timeoutMs: 8000, maxTokens: 320 },
];

const responseCache = new Map<string, CacheEntry>();

const jsonResponse = (status: number, payload: Record<string, unknown>) =>
  NextResponse.json(payload, { status });

const formatAnswers = (answers: Record<string, string> | undefined) =>
  Object.entries(answers ?? {})
    .filter(([, text]) => typeof text === "string" && text.trim().length > 0)
    .map(([key, text]) => `${key}: ${text}`)
    .join("\n");

const buildPrompt = (payload: ExplainPayload) => {
  const quiz = payload.quizTitle ? `QCM: ${payload.quizTitle}\n` : "";
  const answers = formatAnswers(payload.answers);
  const correct = payload.correctAnswers.join(", ");
  const selected = payload.selectedAnswers?.length
    ? payload.selectedAnswers.join(", ")
    : "Aucune";

const buildPrompt = (payload: ExplainPayload) => {
  const quiz = payload.quizTitle ? `QCM: ${payload.quizTitle}\n` : "";
  const answers = formatAnswers(payload.answers);
  const correct = payload.correctAnswers.join(", ");
  const selected = payload.selectedAnswers?.length
    ? payload.selectedAnswers.join(", ")
    : "Aucune";

  return (
    `${quiz}` +
    `Question: ${payload.question}\n` +
    `Propositions:\n${answers}\n\n` +
    `Bonnes reponses: ${correct}\n` +
    `Reponses de l'utilisateur: ${selected}\n\n` +
    "Tu es formateur BNSSA. Tu tutoies l'utilisateur.\n" +
    "But: expliquer VRAIMENT, pas reformuler.\n\n" +

    "Regles anti-repetition (STRICT):\n" +
    "- Ne reprends pas mot pour mot les phrases de l'utilisateur ni les tiennes.\n" +
    "- Ne dis pas 'car ...' en repetant juste une localisation/phrase du QCM.\n" +
    "- N'invente aucun fait externe (lieu, chiffre, nom, contexte) non deduit de la question/propositions.\n" +
    "- Si l'info manque pour justifier un fait, reste general (regle/condition) au lieu d'inventer.\n\n" +

    "Structure obligatoire en 4 phrases MAX (courtes):\n" +
    "1) Verdict + lettres: 'Incorrect/Partiellement/Correct' en citant 1 lettre choisie et 1 bonne lettre.\n" +
    "2) Justification des bonnes lettres: pour CHAQUE bonne lettre, donne le critere/regle qui la rend correcte (definition, condition, seuil, obligation/interdiction).\n" +
    "3) Diagnostic de l'erreur: pour CHAQUE lettre choisie fausse, explique le critere precis non rempli ou la confusion typique (ex: 'tu confonds X avec Y', 'condition A manque', 'generalisation abusive').\n" +
    "4) Correction finale: 'Il fallait cocher: ...' (lettres uniquement) + 1 rappel de regle en 8 mots max.\n\n" +

    "Contraintes:\n" +
    "- Utilise uniquement les lettres (A, B, C...).\n" +
    "- Ne recopie pas les intitules des propositions.\n" +
    "- Ne developpe pas les sigles.\n" +
    "- Ne mentionne pas que tu es une IA.\n"
  );
};
};

const isValidPayload = (
  payload: ExplainPayloadInput,
): payload is ExplainPayload =>
  typeof payload.question === "string" &&
  payload.question.trim().length > 0 &&
  typeof payload.answers === "object" &&
  payload.answers !== null &&
  !Array.isArray(payload.answers) &&
  Array.isArray(payload.correctAnswers) &&
  payload.correctAnswers.length > 0;

const getMaxAttempts = () => {
  const raw = process.env.GROQ_MAX_ATTEMPTS;
  if (!raw) return Math.min(3, MODEL_PRIORITY.length);
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return Math.min(3, MODEL_PRIORITY.length);
  }
  return Math.min(parsed, MODEL_PRIORITY.length);
};

const createCacheKey = (prompt: string) =>
  crypto.createHash("sha256").update(prompt).digest("hex");

const pruneCache = () => {
  const now = Date.now();
  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.createdAt > CACHE_TTL_MS) {
      responseCache.delete(key);
    }
  }
  if (responseCache.size <= CACHE_MAX_ENTRIES) return;
  const entries = Array.from(responseCache.entries());
  entries.sort((a, b) => a[1].createdAt - b[1].createdAt);
  for (let i = 0; i < entries.length - CACHE_MAX_ENTRIES; i += 1) {
    responseCache.delete(entries[i][0]);
  }
};

const getCached = (key: string) => {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return entry;
};

const setCached = (key: string, value: CacheEntry) => {
  responseCache.set(key, value);
  pruneCache();
};

const isRetryableStatus = (status: number) =>
  status === 408 ||
  status === 409 ||
  status === 429 ||
  status === 500 ||
  status === 502 ||
  status === 503 ||
  status === 504 ||
  status === 522 ||
  status === 524;

const isTokenLimit = (text: string) =>
  /context_length|maximum context|token|max_tokens|too many tokens/i.test(text);

const shouldRetry = (status: number, text: string) =>
  isRetryableStatus(status) || isTokenLimit(text);

const streamFromText = (text: string) => {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      const chunkSize = 160;
      for (let i = 0; i < text.length; i += chunkSize) {
        controller.enqueue(encoder.encode(text.slice(i, i + chunkSize)));
      }
      controller.close();
    },
  });
};

const streamGroqResponse = (
  response: Response,
  onComplete: (text: string) => void,
) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let fullText = "";
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let hasError = false;
      try {
        if (!response.body) {
          controller.close();
          return;
        }
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed?.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length > 0) {
                fullText += delta;
                controller.enqueue(encoder.encode(delta));
              }
            } catch {
              continue;
            }
          }
        }

        const tail = buffer.trim();
        if (tail.startsWith("data:")) {
          const data = tail.slice(5).trim();
          if (data && data !== "[DONE]") {
            try {
              const parsed = JSON.parse(data);
              const delta = parsed?.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length > 0) {
                fullText += delta;
                controller.enqueue(encoder.encode(delta));
              }
            } catch {
              // ignore tail
            }
          }
        }
      } catch (error) {
        hasError = true;
        controller.error(error);
      } finally {
        if (!hasError && fullText) onComplete(fullText);
        if (!hasError) controller.close();
      }
    },
  });
};

type AttemptResult =
  | { ok: true; response: Response; model: ModelSpec; elapsedMs: number }
  | {
      ok: false;
      retryable: boolean;
      model: ModelSpec;
      elapsedMs: number;
      status?: number;
      body?: string;
      error?: unknown;
    };

const fetchGroqStream = async (
  model: ModelSpec,
  prompt: string,
  apiKey: string,
): Promise<AttemptResult> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), model.timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model.id,
        temperature: DEFAULT_TEMPERATURE,
        max_tokens: model.maxTokens,
        stream: true,
        messages: [
          {
            role: "system",
            content:
              "Tu es un formateur BNSSA. Tu t'adresses directement a l'utilisateur en le tutoyant. Tu expliques brievement pourquoi ses choix sont bons ou mauvais. Tu donnes des explications claires, factuelles et non paraphrasees. N'invente pas d'informations et ne developpe pas les sigles.",
          },
          { role: "user", content: prompt },
        ],
      }),
      signal: controller.signal,
    });

    const elapsedMs = Date.now() - startedAt;
    if (response.ok) {
      console.info("Groq model success", {
        model: model.id,
        elapsedMs,
      });
      return { ok: true, response, model, elapsedMs };
    }

    const body = await response.text();
    const retryable = shouldRetry(response.status, body);
    console.warn("Groq model failure", {
      model: model.id,
      status: response.status,
      retryable,
      elapsedMs,
    });
    return {
      ok: false,
      retryable,
      model,
      elapsedMs,
      status: response.status,
      body,
    };
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    console.warn("Groq model error", {
      model: model.id,
      elapsedMs,
      error: error instanceof Error ? error.message : "unknown",
    });
    return {
      ok: false,
      retryable: true,
      model,
      elapsedMs,
      error,
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

export async function POST(request: Request) {
  let payload: ExplainPayloadInput;

  try {
    payload = (await request.json()) as ExplainPayloadInput;
  } catch {
    return jsonResponse(400, { error: "Invalid JSON payload" });
  }

  if (!isValidPayload(payload)) {
    return jsonResponse(400, { error: "Invalid request body" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: "Missing GROQ_API_KEY" });
  }

  const prompt = buildPrompt(payload);
  const useCache = request.headers.get("x-use-cache") === "1";
  const cacheKey = useCache ? createCacheKey(prompt) : null;

  if (cacheKey) {
    const cached = getCached(cacheKey);
    if (cached) {
      return new Response(streamFromText(cached.text), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Model-Used": cached.model,
          "X-Cache": "HIT",
        },
      });
    }
  }

  const maxAttempts = getMaxAttempts();
  let attempts = 0;
  let lastFailure: AttemptResult | null = null;

  for (const model of MODEL_PRIORITY) {
    if (attempts >= maxAttempts) break;
    attempts += 1;
    const result = await fetchGroqStream(model, prompt, apiKey);
    if (!result.ok) {
      lastFailure = result;
      if (result.retryable) continue;
      const status = result.status ?? 502;
      return jsonResponse(status, {
        error: "Groq request failed",
        model: model.id,
      });
    }

    const stream = streamGroqResponse(result.response, (text) => {
      if (!cacheKey) return;
      setCached(cacheKey, {
        text,
        model: model.id,
        createdAt: Date.now(),
      });
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Model-Used": model.id,
        "X-Cache": cacheKey ? "MISS" : "BYPASS",
      },
    });
  }

  if (lastFailure && !lastFailure.ok) {
    const status = lastFailure.status ?? 502;
    return jsonResponse(status, {
      error: "Groq providers unavailable",
    });
  }

  return jsonResponse(502, { error: "AI providers unavailable" });
}
