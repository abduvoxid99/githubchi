"use client";

import { intensityLevel } from "@/lib/patterns";

const LEVEL_COLORS = [
  "var(--contrib-0)",
  "var(--contrib-1)",
  "var(--contrib-2)",
  "var(--contrib-3)",
  "var(--contrib-4)",
];

const MONTHS = [
  "Yan",
  "Fev",
  "Mar",
  "Apr",
  "May",
  "Iyun",
  "Iyul",
  "Avg",
  "Sen",
  "Okt",
  "Noy",
  "Dek",
];

type Cell = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  inYear: boolean;
};

type Props = {
  year: number;
  map: Record<string, number>;
  compact?: boolean;
  showLegend?: boolean;
  className?: string;
};

function buildWeeks(year: number, map: Record<string, number>): Cell[][] {
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const start = new Date(jan1);
  start.setUTCDate(start.getUTCDate() - jan1.getUTCDay()); // first Sunday on/before Jan 1

  const weeks: Cell[][] = [];
  const cursor = new Date(start);
  for (let w = 0; w < 53; w++) {
    const week: Cell[] = [];
    for (let d = 0; d < 7; d++) {
      const inYear = cursor.getUTCFullYear() === year;
      const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}-${String(cursor.getUTCDate()).padStart(2, "0")}`;
      const count = inYear ? map[key] ?? 0 : 0;
      week.push({
        date: key,
        count,
        level: intensityLevel(count),
        inYear,
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function monthLabels(weeks: Cell[][], year: number) {
  const labels: { week: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const mid = week[3];
    const [y, m] = mid.date.split("-").map(Number);
    if (y !== year) return;
    if (m - 1 !== lastMonth) {
      labels.push({ week: wi, label: MONTHS[m - 1] });
      lastMonth = m - 1;
    }
  });
  return labels;
}

export function ContributionGrid({
  year,
  map,
  compact,
  showLegend = true,
  className,
}: Props) {
  const weeks = buildWeeks(year, map);
  const labels = monthLabels(weeks, year);
  const size = compact ? 8 : 11;
  const gap = compact ? 2 : 3;

  return (
    <div className={className}>
      {!compact && (
        <div
          className="relative mb-1 ml-7 h-4 text-[10px] text-[var(--fg-muted)]"
          style={{ width: weeks.length * (size + gap) }}
        >
          {labels.map((l) => (
            <span
              key={`${l.week}-${l.label}`}
              className="absolute"
              style={{ left: l.week * (size + gap) }}
            >
              {l.label}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-1">
        {!compact && (
          <div
            className="flex flex-col justify-between py-[2px] pr-1 text-[9px] text-[var(--fg-muted)]"
            style={{ height: 7 * (size + gap) - gap }}
          >
            <span />
            <span>Du</span>
            <span />
            <span>Chor</span>
            <span />
            <span>Ju</span>
            <span />
          </div>
        )}
        <div className="flex overflow-x-auto" style={{ gap }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap }}>
              {week.map((cell) =>
                cell.inYear ? (
                  <div
                    key={cell.date}
                    title={`${cell.date}: ${cell.count} commit`}
                    style={{
                      width: size,
                      height: size,
                      borderRadius: 2,
                      background: LEVEL_COLORS[cell.level],
                    }}
                  />
                ) : (
                  <div
                    key={cell.date}
                    aria-hidden
                    style={{
                      width: size,
                      height: size,
                      visibility: "hidden",
                    }}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      {!compact && showLegend && (
        <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-[var(--fg-muted)]">
          <span>Kam</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span
              key={l}
              style={{
                width: size,
                height: size,
                borderRadius: 2,
                background: LEVEL_COLORS[l],
                display: "inline-block",
              }}
            />
          ))}
          <span>Ko&apos;p</span>
        </div>
      )}
    </div>
  );
}
