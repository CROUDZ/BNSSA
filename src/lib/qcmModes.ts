import type { QcmMode } from "@/types/qcm";

export const TRAINING_QCM_ID = "training" satisfies QcmMode;
export const EXAM_QCM_ID = "exam" satisfies QcmMode;

export const QCM_MODE_DB_IDS: Record<QcmMode, number> = {
  [TRAINING_QCM_ID]: 1,
  [EXAM_QCM_ID]: 2,
};

export function qcmModeFromDbId(dbId: number): QcmMode | null {
  const entry = Object.entries(QCM_MODE_DB_IDS).find(
    ([, value]) => value === dbId,
  );

  return (entry?.[0] as QcmMode | undefined) ?? null;
}
