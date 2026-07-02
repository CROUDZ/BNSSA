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

function getProgressTime(progress: QcmProgress | null | undefined) {
  return progress?.completedAt ? new Date(progress.completedAt).getTime() : 0;
}

function mergeSessions(local: SessionData, remote: SessionData): SessionData {
  const merged = { ...local };

  for (const [qcmId, remoteProgress] of Object.entries(remote)) {
    const localProgress = merged[Number(qcmId)];
    merged[Number(qcmId)] =
      getProgressTime(remoteProgress) >= getProgressTime(localProgress)
        ? remoteProgress
        : localProgress;
  }

  return merged;
}

async function saveRemoteProgress(progress: QcmProgress) {
  await fetch("/api/qcm-progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(progress),
  }).catch(() => undefined);
}

async function clearRemoteProgress(qcmId?: number) {
  await fetch("/api/qcm-progress", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(typeof qcmId === "number" ? { qcmId } : {}),
  }).catch(() => undefined);
}

export function useQcmSession() {
  const [session, setSession] = useState<SessionData>({});

  useEffect(() => {
    const localSession = loadSession();
    setSession(localSession);

    fetch("/api/qcm-progress")
      .then((response) => (response.ok ? response.json() : null))
      .then((remoteSession: SessionData | null) => {
        if (!remoteSession) return;

        setSession((currentSession) => {
          const merged = mergeSessions(currentSession, remoteSession);
          saveSession(merged);
          return merged;
        });
      })
      .catch(() => undefined);
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
    void saveRemoteProgress(progress);
  }, []);

  const clearProgress = useCallback((qcmId: number) => {
    setSession((prev) => {
      const next = { ...prev };
      delete next[qcmId];
      saveSession(next);
      return next;
    });
    void clearRemoteProgress(qcmId);
  }, []);

  const clearAll = useCallback(() => {
    setSession({});
    saveSession({});
    void clearRemoteProgress();
  }, []);

  return { session, getProgress, saveProgress, clearProgress, clearAll };
}
