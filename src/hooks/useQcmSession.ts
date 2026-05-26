"use client";

import { useCallback, useEffect, useState } from "react";
import type { SessionData, QcmProgress } from "@/types/qcm";

const SESSION_KEY = "bnssa_progress";

function loadSession(): SessionData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSession(data: SessionData) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {}
}

export function useQcmSession() {
  const [session, setSession] = useState<SessionData>({});

  useEffect(() => {
    setSession(loadSession());
  }, []);

  const getProgress = useCallback(
    (qcmId: number): QcmProgress | null => session[qcmId] ?? null,
    [session],
  );

  const saveProgress = useCallback((progress: QcmProgress) => {
    setSession((prev) => {
      const next = { ...prev, [progress.qcmId]: progress };
      saveSession(next);
      return next;
    });
  }, []);

  const clearProgress = useCallback((qcmId: number) => {
    setSession((prev) => {
      const next = { ...prev };
      delete next[qcmId];
      saveSession(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSession({});
    saveSession({});
  }, []);

  return { session, getProgress, saveProgress, clearProgress, clearAll };
}
