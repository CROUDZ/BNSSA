"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

export type DailySuccessStat = {
  date: string;
  label: string;
  total: number;
  correct: number;
  wrong: number;
  pct: number;
};

type Props = {
  stats: DailySuccessStat[];
};

const SYNC_ID = "daily-success";

function PctTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload.length) return null;

  const stat = payload[0]?.payload as DailySuccessStat | undefined;
  if (!stat) return null;

  return (
    <div className="rounded-2xl border border-soft bg-surface-strong p-3 text-sm shadow-hero">
      <p className="font-black text-foreground">{stat.label}</p>
      <p className="mt-2 text-muted">
        Réussite:{" "}
        <span className="font-mono font-black text-emerald-300">
          {stat.pct}%
        </span>
      </p>
    </div>
  );
}

function VolumeTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload.length) return null;

  const stat = payload[0]?.payload as DailySuccessStat | undefined;
  if (!stat) return null;

  return (
    <div className="rounded-2xl border border-soft bg-surface-strong p-3 text-sm shadow-hero">
      <p className="font-black text-foreground">{stat.label}</p>
      <p className="mt-2 text-muted">
        {stat.correct} correcte{stat.correct > 1 ? "s" : ""}, {stat.wrong}{" "}
        erreur{stat.wrong > 1 ? "s" : ""} sur {stat.total}
      </p>
    </div>
  );
}

export function DailySuccessChart({ stats }: Props) {
  return (
    <div className="rounded-3xl border border-soft bg-surface p-6 shadow-hero">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Réussite quotidienne
          </p>
          <h2 className="mt-2 font-display text-2xl">
            Bonnes réponses par jour
          </h2>
        </div>
        <p className="text-sm text-muted">
          Taux de réussite et volume de réponses, jour par jour
        </p>
      </div>

      {stats.length ? (
        <div className="mt-5 flex flex-col gap-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">
              Taux de réussite
            </p>
            <div className="h-32 w-full" aria-label="Taux de réussite par jour">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  syncId={SYNC_ID}
                  data={stats}
                  margin={{ top: 6, right: 8, bottom: 0, left: -12 }}
                  accessibilityLayer
                >
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" hide />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 50, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted)", fontSize: 12 }}
                    tickFormatter={(value: number) => `${value}%`}
                  />
                  <Tooltip
                    content={(props) => <PctTooltip {...props} />}
                    cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pct"
                    name="Réussite"
                    stroke="#2dd4bf"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "#2dd4bf",
                      stroke: "var(--surface-strong)",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6 }}
                    unit="%"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">
              Volume de réponses
            </p>
            <div className="h-32 w-full" aria-label="Nombre de réponses par jour">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  syncId={SYNC_ID}
                  data={stats}
                  margin={{ top: 6, right: 8, bottom: 0, left: -12 }}
                  accessibilityLayer
                >
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted)", fontSize: 12 }}
                    tickFormatter={(value: string) => value.slice(0, 6)}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted)", fontSize: 12 }}
                  />
                  <Tooltip
                    content={(props) => <VolumeTooltip {...props} />}
                    cursor={{ fill: "rgba(45, 212, 191, 0.08)" }}
                  />
                  <Bar
                    dataKey="total"
                    name="Réponses"
                    fill="rgba(45, 212, 191, 0.45)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-2xl border border-soft bg-surface-veil p-4 text-sm text-muted">
          Réponds à quelques questions pour faire apparaître le graphe.
        </p>
      )}
    </div>
  );
}
