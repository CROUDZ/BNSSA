"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
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

function DailyTooltip({ active, payload }: TooltipContentProps) {
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
      <p className="text-muted">
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
          Courbe de réussite et volume de réponses
        </p>
      </div>

      {stats.length ? (
        <div
          className="mt-5 h-72 w-full"
          aria-label="Pourcentage de bonnes réponses par jour"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={stats}
              margin={{ top: 10, right: 8, bottom: 0, left: -12 }}
              accessibilityLayer
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted)", fontSize: 12 }}
                tickFormatter={(value: string) => value.slice(0, 6)}
              />
              <YAxis
                yAxisId="pct"
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted)", fontSize: 12 }}
                tickFormatter={(value: number) => `${value}%`}
              />
              <YAxis
                yAxisId="total"
                orientation="right"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted)", fontSize: 12 }}
              />
              <Tooltip
                content={(props) => <DailyTooltip {...props} />}
                cursor={{ fill: "rgba(45, 212, 191, 0.08)" }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ color: "var(--muted)", fontSize: 12 }}
              />
              <Bar
                yAxisId="total"
                dataKey="total"
                name="Réponses"
                fill="rgba(45, 212, 191, 0.22)"
                radius={[8, 8, 0, 0]}
                maxBarSize={34}
              />
              <Line
                yAxisId="pct"
                type="monotone"
                dataKey="pct"
                name="Réussite"
                stroke="var(--accent)"
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: "var(--accent)",
                  stroke: "var(--surface-strong)",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 7 }}
                unit="%"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="mt-5 rounded-2xl border border-soft bg-surface-veil p-4 text-sm text-muted">
          Réponds à quelques questions pour faire apparaître le graphe.
        </p>
      )}
    </div>
  );
}
