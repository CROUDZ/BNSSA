import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { QCM_MODE_DB_IDS, qcmModeFromDbId } from "@/lib/qcmModes";
import { prisma } from "@/lib/prisma";
import type {
  QcmMode,
  QcmProgress,
  QuestionResult,
  SessionData,
} from "@/types/qcm";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function toProgressMap(
  rows: Awaited<ReturnType<typeof prisma.userQcmProgress.findMany>>,
) {
  return rows.reduce<SessionData>((acc, row) => {
    const qcmId = qcmModeFromDbId(row.qcmId);

    if (!qcmId) return acc;

    const results = row.results as QuestionResult[];

    acc[qcmId] = {
      qcmId,
      results,
      answeredQuestionIds: Array.isArray(row.answeredQuestionIds)
        ? (row.answeredQuestionIds as string[])
        : [...new Set(results.map((result) => result.questionId))],
      completedAt: row.completedAt?.toISOString() ?? null,
      score: row.score,
      total: row.total,
    };

    return acc;
  }, {});
}

function isQcmMode(value: unknown): value is QcmMode {
  return value === "training" || value === "exam";
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return unauthorized();

  const progress = await prisma.userQcmProgress.findMany({
    where: { userId },
    orderBy: { qcmId: "asc" },
  });

  return NextResponse.json(toProgressMap(progress));
}

export async function PUT(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return unauthorized();

  const progress = (await request.json()) as QcmProgress;

  if (
    !isQcmMode(progress.qcmId) ||
    !Array.isArray(progress.results) ||
    typeof progress.score !== "number" ||
    typeof progress.total !== "number"
  ) {
    return NextResponse.json({ error: "Invalid progress" }, { status: 400 });
  }

  const completedAt = progress.completedAt
    ? new Date(progress.completedAt)
    : null;

  await prisma.userQcmProgress.upsert({
    where: {
      userId_qcmId: {
        userId,
        qcmId: QCM_MODE_DB_IDS[progress.qcmId],
      },
    },
    create: {
      userId,
      qcmId: QCM_MODE_DB_IDS[progress.qcmId],
      results: progress.results as unknown as Prisma.InputJsonValue,
      answeredQuestionIds:
        progress.answeredQuestionIds as unknown as Prisma.InputJsonValue,
      completedAt,
      score: progress.score,
      total: progress.total,
    },
    update: {
      results: progress.results as unknown as Prisma.InputJsonValue,
      answeredQuestionIds:
        progress.answeredQuestionIds as unknown as Prisma.InputJsonValue,
      completedAt,
      score: progress.score,
      total: progress.total,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return unauthorized();

  const body = (await request.json().catch(() => ({}))) as {
    qcmId?: unknown;
  };
  const hasQcmId = Object.prototype.hasOwnProperty.call(body, "qcmId");

  if (hasQcmId && !isQcmMode(body.qcmId)) {
    return NextResponse.json(
      { error: "Invalid progress mode" },
      { status: 400 },
    );
  }

  const qcmId = isQcmMode(body.qcmId) ? QCM_MODE_DB_IDS[body.qcmId] : undefined;

  await prisma.userQcmProgress.deleteMany({
    where: {
      userId,
      ...(qcmId ? { qcmId } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
