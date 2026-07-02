import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { QcmProgress, QuestionResult, SessionData } from "@/types/qcm";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function toProgressMap(
  rows: Awaited<ReturnType<typeof prisma.userQcmProgress.findMany>>,
) {
  return rows.reduce<SessionData>((acc, row) => {
    const results = row.results as QuestionResult[];

    acc[row.qcmId] = {
      qcmId: row.qcmId,
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
    typeof progress.qcmId !== "number" ||
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
        qcmId: progress.qcmId,
      },
    },
    create: {
      userId,
      qcmId: progress.qcmId,
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

  const body = (await request.json().catch(() => ({}))) as { qcmId?: number };

  await prisma.userQcmProgress.deleteMany({
    where: {
      userId,
      ...(typeof body.qcmId === "number" ? { qcmId: body.qcmId } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
