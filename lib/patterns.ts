export type Pattern = "shuffle" | "text" | "employeer" | "hobbichi";
export type WeekPart = "full" | "mon_fri" | "mon_sat" | "weekends" | "weekdays";
export type Density = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type ContributionMap = Record<string, number>;

export const ALL_MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export interface CommitConfig {
  year: number;
  pattern: Pattern;
  density: Density;
  /** Selected months 0=Yan … 11=Dek */
  months: number[];
  weekPart: WeekPart;
  text?: string;
  textCommitsPerDay?: number;
  workdayDensity?: 0 | Density;
  /** employeer/hobbichi: weekend intensity 0-5 */
  weekendDensity?: 0 | Density;
  workWeekEnds?: "fri" | "sat";
  seed?: number;
}

const GLYPHS: Record<string, number[]> = {
  " ": [0, 0, 0],
  A: [0b1111110, 0b0001001, 0b0001001, 0b1111110],
  B: [0b1111111, 0b1001001, 0b1001001, 0b0110110],
  C: [0b0111110, 0b1000001, 0b1000001, 0b0100010],
  D: [0b1111111, 0b1000001, 0b1000001, 0b0111110],
  E: [0b1111111, 0b1001001, 0b1001001, 0b1000001],
  F: [0b1111111, 0b0001001, 0b0001001, 0b0000001],
  G: [0b0111110, 0b1000001, 0b1001001, 0b0111010],
  H: [0b1111111, 0b0001000, 0b0001000, 0b1111111],
  I: [0b1000001, 0b1111111, 0b1000001],
  J: [0b0100000, 0b1000001, 0b0111111, 0b0000001],
  K: [0b1111111, 0b0001100, 0b0010010, 0b1100001],
  L: [0b1111111, 0b1000000, 0b1000000],
  M: [0b1111111, 0b0000010, 0b0000100, 0b0000010, 0b1111111],
  N: [0b1111111, 0b0000010, 0b0000100, 0b0001000, 0b1111111],
  O: [0b0111110, 0b1000001, 0b1000001, 0b0111110],
  P: [0b1111111, 0b0001001, 0b0001001, 0b0000110],
  Q: [0b0111110, 0b1000001, 0b1010001, 0b0100001, 0b1011110],
  R: [0b1111111, 0b0001001, 0b0011001, 0b1100110],
  S: [0b1000110, 0b1001001, 0b1001001, 0b0110001],
  T: [0b0000001, 0b1111111, 0b0000001],
  U: [0b0111111, 0b1000000, 0b1000000, 0b0111111],
  V: [0b0011111, 0b0100000, 0b1000000, 0b0100000, 0b0011111],
  W: [0b1111111, 0b0100000, 0b0011000, 0b0100000, 0b1111111],
  X: [0b1100011, 0b0010100, 0b0001000, 0b0010100, 0b1100011],
  Y: [0b0000011, 0b0000100, 0b1111000, 0b0000100, 0b0000011],
  Z: [0b1100001, 0b1010001, 0b1001001, 0b1000101, 0b1000011],
  "0": [0b0111110, 0b1001001, 0b1000101, 0b0111110],
  "1": [0b1000010, 0b1111111, 0b1000000],
  "2": [0b1100010, 0b1010001, 0b1001001, 0b1000110],
  "3": [0b1000001, 0b1001001, 0b1001001, 0b0110110],
  "4": [0b0001100, 0b0001010, 0b1111111, 0b0001000],
  "5": [0b0100111, 0b1000101, 0b1000101, 0b0111001],
  "6": [0b0111110, 0b1001001, 0b1001001, 0b0110000],
  "7": [0b0000001, 0b1111001, 0b0000101, 0b0000011],
  "8": [0b0110110, 0b1001001, 0b1001001, 0b0110110],
  "9": [0b0000110, 0b1001001, 0b1001001, 0b0111110],
  "!": [0b1011111],
  "?": [0b0000010, 0b0000001, 0b1011001, 0b0000110],
  ".": [0b1000000],
  "-": [0b0001000, 0b0001000, 0b0001000],
};

function dayOfWeek(d: Date): number {
  return d.getUTCDay(); // 0 Sun … 6 Sat (GitHub)
}
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toKey(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** Bugungi UTC sana (YYYY-MM-DD) — undan keyinga commit yo'q. */
function utcTodayKey(): string {
  return toKey(new Date());
}

function isNotAfterToday(d: Date): boolean {
  return toKey(d) <= utcTodayKey();
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}
/** First Sunday on or before Jan 1 */
function gridStart(year: number): Date {
  const jan1 = new Date(Date.UTC(year, 0, 1));
  return addDays(jan1, -dayOfWeek(jan1));
}
function yearDays(year: number): Date[] {
  const days: Date[] = [];
  let d = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year, 11, 31));
  while (d <= end) {
    days.push(new Date(d));
    d = addDays(d, 1);
  }
  return days;
}
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Daraja: kunlar foizi + kundagi max commit (intensivlik mustaqilroq). */
const LEVEL_CONFIG: Record<
  Density,
  { fill: number; maxCommits: number }
> = {
  1: { fill: 0.05, maxCommits: 3 }, // Juda kam — kam kun, lekin 1–3 commit
  2: { fill: 0.09, maxCommits: 3 }, // Kam
  3: { fill: 0.14, maxCommits: 4 }, // Yengil
  4: { fill: 0.22, maxCommits: 4 }, // O'rtacha
  5: { fill: 0.32, maxCommits: 5 }, // Faol
  6: { fill: 0.45, maxCommits: 6 }, // Ko'p
  7: { fill: 0.6, maxCommits: 8 }, // Juda ko'p
};

function levelConfig(density: 0 | Density) {
  if (!density) return { fill: 0, maxCommits: 0 };
  return LEVEL_CONFIG[density];
}

/** Kundagi commitlar: 1 … maxCommits (past darajada ham faqat 1 bo‘lib qolmaydi). */
function commitsForDay(density: Density, rand: () => number): number {
  const { maxCommits } = LEVEL_CONFIG[density];
  // Engil bias pastga, lekin range to‘liq ishlatiladi
  const t = rand() * rand(); // biroz pastga og‘ish
  return 1 + Math.floor(t * maxCommits);
}
function inSelectedMonths(d: Date, months: number[]): boolean {
  if (!months.length) return false;
  return months.includes(d.getUTCMonth());
}
function matchesWeekPart(d: Date, weekPart: WeekPart): boolean {
  const dow = dayOfWeek(d);
  switch (weekPart) {
    case "full":
      return true;
    case "weekdays":
    case "mon_fri":
      return dow >= 1 && dow <= 5;
    case "mon_sat":
      return dow >= 1 && dow <= 6;
    case "weekends":
      return dow === 0 || dow === 6;
    default:
      return true;
  }
}
function textToColumns(text: string): number[] {
  const cols: number[] = [];
  const upper = text.toUpperCase().slice(0, 40);
  for (let i = 0; i < upper.length; i++) {
    const ch = upper[i];
    const g = GLYPHS[ch] ?? GLYPHS["?"];
    cols.push(...g);
    // Harflar orasida 1 katak; bo'shliq atrofida gap qo'shilmasin (aks holda 3→5 bo'ladi)
    if (i < upper.length - 1 && ch !== " " && upper[i + 1] !== " ") {
      cols.push(0);
    }
  }
  return cols;
}

export function generateContributionMap(config: CommitConfig): ContributionMap {
  const rand = mulberry32(config.seed ?? Date.now());
  const map: ContributionMap = {};

  if (config.pattern === "text") {
    const cols = textToColumns(config.text || "HELLO");
    const start = gridStart(config.year);
    const perDay = config.textCommitsPerDay ?? Math.max(1, config.density);
    const offset = Math.max(0, Math.floor((53 - cols.length) / 2));
    for (let c = 0; c < cols.length; c++) {
      for (let row = 0; row < 7; row++) {
        if ((cols[c] >> row) & 1) {
          const date = addDays(start, (offset + c) * 7 + row);
          if (date.getUTCFullYear() !== config.year) continue;
          if (!isNotAfterToday(date)) continue;
          map[toKey(date)] = perDay;
        }
      }
    }
    return map;
  }

  if (config.pattern === "hobbichi") {
    const workDensity = (config.workdayDensity ?? 0) as 0 | Density;
    const restDensity = (config.weekendDensity ?? config.density) as 0 | Density;
    const restFill = levelConfig(restDensity).fill;
    const workFill = levelConfig(workDensity).fill * 0.4;
    for (const d of yearDays(config.year)) {
      if (!isNotAfterToday(d)) continue;
      if (!inSelectedMonths(d, config.months)) continue;
      const dow = dayOfWeek(d);
      const isWeekend = dow === 0 || dow === 6;
      if (isWeekend) {
        if (restDensity > 0 && rand() < restFill) {
          map[toKey(d)] = commitsForDay(restDensity as Density, rand);
        }
      } else if (workDensity > 0 && rand() < workFill) {
        map[toKey(d)] = commitsForDay(
          Math.min(workDensity, 3) as Density,
          rand,
        );
      }
    }
    return map;
  }

  if (config.pattern === "employeer") {
    const ends = config.workWeekEnds ?? "fri";
    const workDensity = (config.workdayDensity ?? config.density) as 0 | Density;
    const restDensity = (config.weekendDensity ?? 1) as 0 | Density;
    const workFill = levelConfig(workDensity).fill;
    const restFill = levelConfig(restDensity).fill * 0.45;
    for (const d of yearDays(config.year)) {
      if (!isNotAfterToday(d)) continue;
      if (!inSelectedMonths(d, config.months)) continue;
      const dow = dayOfWeek(d);
      const isWork = ends === "sat" ? dow >= 1 && dow <= 6 : dow >= 1 && dow <= 5;
      if (isWork) {
        if (workDensity > 0 && rand() < workFill) {
          map[toKey(d)] = commitsForDay(workDensity as Density, rand);
        }
      } else if (restDensity > 0 && rand() < restFill) {
        map[toKey(d)] = commitsForDay(
          Math.min(restDensity, 3) as Density,
          rand,
        );
      }
    }
    return map;
  }

  // shuffle
  const fillRate = levelConfig(config.density).fill;
  for (const d of yearDays(config.year)) {
    if (!isNotAfterToday(d)) continue;
    if (!inSelectedMonths(d, config.months)) continue;
    if (!matchesWeekPart(d, config.weekPart)) continue;
    if (rand() > fillRate) continue;
    map[toKey(d)] = commitsForDay(config.density, rand);
  }
  return map;
}

export function summarizeMap(map: ContributionMap) {
  const days = Object.keys(map).filter((k) => map[k] > 0);
  return {
    dayCount: days.length,
    commitCount: days.reduce((s, k) => s + map[k], 0),
  };
}

export function intensityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export function buildCalendarGrid(year: number, map: ContributionMap) {
  const start = gridStart(year);
  const weeks: Array<Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>> = [];
  let cursor = new Date(start);
  for (let w = 0; w < 53; w++) {
    const week: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }> = [];
    for (let d = 0; d < 7; d++) {
      const key = toKey(cursor);
      const count = cursor.getUTCFullYear() === year ? map[key] ?? 0 : 0;
      week.push({ date: key, count, level: intensityLevel(count) });
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export const MONTH_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "Yanvar" },
  { value: 1, label: "Fevral" },
  { value: 2, label: "Mart" },
  { value: 3, label: "Aprel" },
  { value: 4, label: "May" },
  { value: 5, label: "Iyun" },
  { value: 6, label: "Iyul" },
  { value: 7, label: "Avgust" },
  { value: 8, label: "Sentabr" },
  { value: 9, label: "Oktabr" },
  { value: 10, label: "Noyabr" },
  { value: 11, label: "Dekabr" },
];

export const WEEK_PART_OPTIONS: { value: WeekPart; label: string }[] = [
  { value: "full", label: "Butun hafta bo'yicha" },
  { value: "mon_fri", label: "Dushanba–Juma" },
  { value: "mon_sat", label: "Dushanba–Shanba" },
  { value: "weekends", label: "Dam olish kunlari" },
];

export const DENSITY_OPTIONS: { value: Density; label: string }[] = [
  { value: 1, label: "1 — Juda kam" },
  { value: 2, label: "2 — Kam" },
  { value: 3, label: "3 — Yengil" },
  { value: 4, label: "4 — O'rtacha" },
  { value: 5, label: "5 — Faol" },
  { value: 6, label: "6 — Ko'p" },
  { value: 7, label: "7 — Juda ko'p" },
];

export const PATTERN_OPTIONS: { value: Pattern; label: string }[] = [
  { value: "shuffle", label: "Shuffle" },
  { value: "text", label: "Text" },
  { value: "employeer", label: "Employeer" },
  { value: "hobbichi", label: "Hobbichi" },
];
