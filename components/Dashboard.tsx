"use client";

import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { clearApiToken, createActionStream, deleteActionStream, fetchActions, fetchGithubMeta, type ActionDto, type ProgressEvent } from "@/lib/api";
import {
    ALL_MONTHS,
    DENSITY_OPTIONS,
    generateContributionMap,
    PATTERN_OPTIONS,
    summarizeMap,
    type CommitConfig,
    type Density,
    type Pattern,
} from "@/lib/patterns";
import { ContributionGrid } from "./ContributionGrid";
import { MonthMultiSelect } from "./MonthMultiSelect";
import { ProgressModal } from "./ProgressModal";
import { ConfirmModal } from "./ConfirmModal";

export function Dashboard() {
    const { data: session } = useSession();
    const currentYear = new Date().getFullYear();
    const [joinedYear, setJoinedYear] = useState(2010);
    const [year, setYear] = useState(currentYear);
    const [pattern, setPattern] = useState<Pattern>("shuffle");
    const [density, setDensity] = useState<Density>(4);
    const [months, setMonths] = useState<number[]>([...ALL_MONTHS]);
    const [text, setText] = useState("HELLO");
    const [textCommitsPerDay, setTextCommitsPerDay] = useState<number | "">(4);
    const [workWeekEnds, setWorkWeekEnds] = useState<"fri" | "sat">("fri");
    const [workdayDensity, setWorkdayDensity] = useState<0 | Density>(4);
    const [weekendDensity, setWeekendDensity] = useState<0 | Density>(1);
    const [seed, setSeed] = useState(() => Date.now());
    const [actions, setActions] = useState<ActionDto[]>([]);
    const [actionsLoading, setActionsLoading] = useState(true);
    const [modal, setModal] = useState<{
        open: boolean;
        title: string;
        step: string;
        message: string;
        current?: number;
        total?: number;
        error?: string | null;
        canClose?: boolean;
    }>({
        open: false,
        title: "",
        step: "validating",
        message: "",
    });
    const [confirmCommitOpen, setConfirmCommitOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const years = useMemo(() => {
        const list: number[] = [];
        for (let y = currentYear; y >= joinedYear; y--) list.push(y);
        return list;
    }, [joinedYear, currentYear]);

    const config: CommitConfig = useMemo(
        () => ({
            year,
            pattern,
            density,
            months: pattern === "text" ? [...ALL_MONTHS] : months,
            weekPart: pattern === "hobbichi" ? "weekends" : "full",
            text,
            textCommitsPerDay: typeof textCommitsPerDay === "number" && textCommitsPerDay > 0 ? textCommitsPerDay : 0,
            workWeekEnds,
            workdayDensity,
            weekendDensity,
            seed,
        }),
        [year, pattern, density, months, text, textCommitsPerDay, workWeekEnds, workdayDensity, weekendDensity, seed],
    );

    const map = useMemo(() => generateContributionMap(config), [config]);
    const summary = useMemo(() => summarizeMap(map), [map]);

    const commitDisabled =
        summary.commitCount === 0 ||
        summary.commitCount > 2000 ||
        (pattern !== "text" && months.length === 0) ||
        (pattern === "text" && (textCommitsPerDay === "" || typeof textCommitsPerDay !== "number" || textCommitsPerDay <= 0));

    const commitDisabledReason =
        summary.commitCount > 2000
            ? "Commitlar soni 2000 dan oshmasligi kerak"
            : pattern !== "text" && months.length === 0
              ? "Kamida bitta oy tanlang"
              : pattern === "text" && (textCommitsPerDay === "" || typeof textCommitsPerDay !== "number" || textCommitsPerDay <= 0)
                ? "Kundagi commitlar musbat son bo'lishi kerak"
                : summary.commitCount === 0
                  ? "Commit hosil bo'lmadi"
                  : undefined;

    const loadActions = useCallback(async () => {
        try {
            const data = await fetchActions();
            setActions(data.actions);
        } catch {
            /* ignore */
        } finally {
            setActionsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchGithubMeta().then((m) => setJoinedYear(m.joinedYear || 2010));
        void loadActions();
    }, [loadActions]);

    function applyProgress(e: ProgressEvent) {
        setModal((m) => ({
            ...m,
            step: e.step,
            message: e.message,
            current: e.current,
            total: e.total,
            error: e.error ?? null,
            canClose: e.step === "done" || e.step === "error",
        }));
    }

    async function handleCommit() {
        setConfirmCommitOpen(false);
        setModal({
            open: true,
            title: "Commit jarayoni",
            step: "validating",
            message: "Boshlanmoqda...",
            canClose: false,
            error: null,
        });
        const result = await createActionStream(config, applyProgress);
        if (!result.ok) {
            setModal((m) => ({
                ...m,
                step: "error",
                message: result.error || "Xato",
                error: result.error,
                canClose: true,
            }));
        } else {
            setModal((m) => ({
                ...m,
                step: "done",
                message: "Tayyor!",
                canClose: true,
            }));
            await loadActions();
        }
    }

    async function handleDelete(id: string) {
        setDeleteConfirmId(null);
        setModal({
            open: true,
            title: "Bekor qilish",
            step: "reverting",
            message: "Commitlar o'chirilmoqda...",
            canClose: false,
            error: null,
        });
        const result = await deleteActionStream(id, applyProgress);
        if (!result.ok) {
            setModal((m) => ({
                ...m,
                step: "error",
                message: result.error || "Xato",
                error: result.error,
                canClose: true,
            }));
        } else {
            setModal((m) => ({
                ...m,
                step: "done",
                message: "Bekor qilindi",
                canClose: true,
            }));
            await loadActions();
        }
    }

    const username = session?.username || session?.user?.name || "user";
    const avatar = session?.user?.image;

    function handlePatternChange(p: Pattern) {
        setPattern(p);
        if (p === "hobbichi") {
            setWeekendDensity(4);
            setWorkdayDensity(0);
        } else if (p === "employeer") {
            setWorkdayDensity(4);
            setWeekendDensity(1);
        }
    }

    const yearField = (
        <Field label="Yil">
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="select">
                {years.map((y) => (
                    <option key={y} value={y}>
                        {y}
                    </option>
                ))}
            </select>
        </Field>
    );

    const turField = (
        <Field label="Tur">
            <select value={pattern} onChange={(e) => handlePatternChange(e.target.value as Pattern)} className="select">
                {PATTERN_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </Field>
    );

    return (
        <div className="flex min-h-screen flex-col">
            <header className="app-header">
                <div className="app-header__inner">
                    <div className="app-header__brand">
                        <h1 className="app-header__logo">githubchi</h1>
                        {/* <span className="app-header__tagline">yashil nuqtalar</span> */}
                    </div>
                    <div className="app-header__user">
                        {avatar && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatar} alt="" className="app-header__avatar" />
                        )}
                        <span className="app-header__name">@{username}</span>
                        <button
                            type="button"
                            className="app-header__logout"
                            onClick={() => {
                                clearApiToken();
                                void signOut({ callbackUrl: "/login" });
                            }}
                        >
                            Chiqish
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
                <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
                    <div className="grid lg:grid-cols-[minmax(0,1fr)_16rem]">
                        <div className="relative z-10 min-w-0 overflow-visible p-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {yearField}
                                {turField}

                                {pattern === "shuffle" && (
                                    <>
                                        <Field label="Daraja">
                                            <select value={density} onChange={(e) => setDensity(Number(e.target.value) as Density)} className="select">
                                                {DENSITY_OPTIONS.map((o) => (
                                                    <option key={o.value} value={o.value}>
                                                        {o.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                        <Field label="Yil qismi">
                                            <MonthMultiSelect value={months} onChange={setMonths} allMonths={ALL_MONTHS} />
                                        </Field>
                                        <FieldSlot />
                                        <FieldSlot />
                                    </>
                                )}

                                {pattern === "text" && (
                                    <>
                                        <Field label="Text">
                                            <input
                                                value={text}
                                                onChange={(e) => setText(e.target.value.toUpperCase())}
                                                className="select uppercase tracking-wider"
                                                placeholder="HELLO WORLD"
                                                maxLength={40}
                                            />
                                        </Field>
                                        <Field label="Kuniga">
                                            <input
                                                type="number"
                                                value={textCommitsPerDay}
                                                onChange={(e) => {
                                                    const raw = e.target.value;
                                                    if (raw === "") {
                                                        setTextCommitsPerDay("");
                                                        return;
                                                    }
                                                    const n = Number(raw);
                                                    if (!Number.isFinite(n)) return;
                                                    setTextCommitsPerDay(Math.floor(n));
                                                }}
                                                className="select"
                                            />
                                        </Field>
                                        <FieldSlot />
                                        <FieldSlot />
                                    </>
                                )}

                                {pattern === "employeer" && (
                                    <>
                                        <Field label="Ish haftasi">
                                            <select value={workWeekEnds} onChange={(e) => setWorkWeekEnds(e.target.value as "fri" | "sat")} className="select">
                                                <option value="fri">Dushanba–Juma</option>
                                                <option value="sat">Dushanba–Shanba</option>
                                            </select>
                                        </Field>
                                        <Field label="Yil qismi">
                                            <MonthMultiSelect value={months} onChange={setMonths} allMonths={ALL_MONTHS} />
                                        </Field>
                                        <Field label="Ish kuni">
                                            <select
                                                value={workdayDensity}
                                                onChange={(e) => setWorkdayDensity(Number(e.target.value) as 0 | Density)}
                                                className="select"
                                            >
                                                <option value={0}>0 — Yo&apos;q</option>
                                                {DENSITY_OPTIONS.map((o) => (
                                                    <option key={o.value} value={o.value}>
                                                        {o.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                        <Field label="Dam olish">
                                            <select
                                                value={weekendDensity}
                                                onChange={(e) => setWeekendDensity(Number(e.target.value) as 0 | Density)}
                                                className="select"
                                            >
                                                <option value={0}>0 — Yo&apos;q</option>
                                                {DENSITY_OPTIONS.map((o) => (
                                                    <option key={o.value} value={o.value}>
                                                        {o.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                    </>
                                )}

                                {pattern === "hobbichi" && (
                                    <>
                                        <Field label="Yil qismi">
                                            <MonthMultiSelect value={months} onChange={setMonths} allMonths={ALL_MONTHS} />
                                        </Field>
                                        <Field label="Ish kuni">
                                            <select
                                                value={workdayDensity}
                                                onChange={(e) => setWorkdayDensity(Number(e.target.value) as 0 | Density)}
                                                className="select"
                                            >
                                                <option value={0}>0 — Yo&apos;q</option>
                                                {DENSITY_OPTIONS.map((o) => (
                                                    <option key={o.value} value={o.value}>
                                                        {o.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                        <Field label="Dam olish">
                                            <select
                                                value={weekendDensity}
                                                onChange={(e) => setWeekendDensity(Number(e.target.value) as 0 | Density)}
                                                className="select"
                                            >
                                                <option value={0}>0 — Yo&apos;q</option>
                                                {DENSITY_OPTIONS.map((o) => (
                                                    <option key={o.value} value={o.value}>
                                                        {o.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                        <FieldSlot />
                                    </>
                                )}
                            </div>
                        </div>

                        <aside className="flex flex-col justify-between gap-5 border-t border-[var(--border)] bg-[var(--background)] p-5 lg:rounded-r-xl lg:border-l lg:border-t-0">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5">
                                    <p className="font-mono text-xl font-semibold tabular-nums text-[#238636]">{summary.commitCount}</p>
                                    <p className="text-[11px] text-[var(--fg-muted)]">commit</p>
                                </div>
                                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5">
                                    <p className="font-mono text-xl font-semibold tabular-nums text-[var(--fg)]">{summary.dayCount}</p>
                                    <p className="text-[11px] text-[var(--fg-muted)]">kun</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSeed(Date.now())}
                                    disabled={pattern === "text"}
                                    tabIndex={pattern === "text" ? -1 : undefined}
                                    aria-hidden={pattern === "text"}
                                    className={`h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-medium text-[var(--fg)] hover:bg-[var(--hover)] disabled:pointer-events-none ${
                                        pattern === "text" ? "invisible" : ""
                                    }`}
                                >
                                    Qayta aralashtirish
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmCommitOpen(true)}
                                    disabled={commitDisabled}
                                    className="h-11 w-full rounded-md bg-[#238636] px-3 text-sm font-semibold text-white hover:bg-[#2ea043] disabled:opacity-40"
                                    title={commitDisabledReason}
                                >
                                    Commit qilish
                                </button>
                            </div>
                        </aside>
                    </div>
                </section>

                <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-semibold text-[var(--fg)]">Preview — {year}</h2>
                        <span className="font-mono text-xs text-[var(--fg-muted)]">
                            {summary.dayCount} / {year % 4 === 0 ? 366 : 365} kun
                        </span>
                    </div>
                    <ContributionGrid year={year} map={map} />
                </section>

                <section className="mt-8">
                    <h2 className="mb-4 text-lg font-semibold text-[var(--fg)]">Harakatlar tarixi</h2>
                    {actionsLoading ? (
                        <HistorySkeleton />
                    ) : (
                        <>
                            {actions.length === 0 && (
                                <p className="text-sm text-[var(--fg-muted)]">Hali harakat yo&apos;q.</p>
                            )}
                            <ul className="space-y-3">
                                {actions.map((a) => {
                                    const cancelled = a.status === "cancelled";
                                    const failed = a.status === "failed";
                                    return (
                                        <li
                                            key={a.id}
                                            className={`rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 ${cancelled ? "opacity-50" : ""}`}
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <p className={`font-mono text-sm ${cancelled ? "line-through" : "text-[var(--fg)]"}`}>
                                                        {a.pattern === "text" && a.text
                                                            ? `Text "${a.text}" — ${a.year}`
                                                            : `${a.pattern} — ${a.year} — ${a.commitCount} commit`}
                                                        {cancelled && (
                                                            <span className="ml-2 no-underline">(bekor qilingan)</span>
                                                        )}
                                                        {failed && <span className="ml-2 text-red-400">(failed)</span>}
                                                    </p>
                                                    <p className="mt-1 text-[11px] text-[var(--fg-muted)]">
                                                        {formatActionDate(a.createdAt)}
                                                    </p>
                                                    {a.errorMessage && (
                                                        <p className="mt-1 text-xs text-red-400">{a.errorMessage}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {username && !cancelled && (
                                                        <a
                                                            href={`https://github.com/${username}?tab=overview&from=${a.year}-01-01&to=${a.year}-12-31`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--hover)]"
                                                        >
                                                            GitHubda ko&apos;rish
                                                        </a>
                                                    )}
                                                    {a.status === "completed" && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeleteConfirmId(a.id)}
                                                            className="rounded-lg bg-red-600/90 px-3 py-1.5 text-sm text-white hover:bg-red-600"
                                                        >
                                                            O&apos;chirish
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {a.preview && (
                                                <div className="mt-3 overflow-x-auto">
                                                    <ContributionGrid
                                                        year={a.year}
                                                        map={a.preview}
                                                        showLegend={false}
                                                    />
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    )}
                </section>
            </div>

            <ConfirmModal
                open={confirmCommitOpen}
                title="Commitni tasdiqlaysizmi?"
                confirmLabel="Ha, commit qilish"
                cancelLabel="Bekor qilish"
                onCancel={() => setConfirmCommitOpen(false)}
                onConfirm={() => void handleCommit()}
                description={
                    <>
                        <span className="confirm-stat">{summary.commitCount}</span> ta
                        commit yaratiladi ({year} yil).
                    </>
                }
                note={
                    <>
                        Keyinchalik commitni rebase qilish mumkin. Bu 5 minutdan 24
                        soatgacha vaqt oladi, lekin ba&apos;zida GitHubdagi yashil
                        nuqtalar o&apos;chmasligi mumkin.
                    </>
                }
            />

            <ConfirmModal
                open={deleteConfirmId !== null}
                title="O'chirishni tasdiqlaysizmi?"
                confirmLabel="Ha, o'chirish"
                cancelLabel="Bekor qilish"
                danger
                onCancel={() => setDeleteConfirmId(null)}
                onConfirm={() => {
                    if (deleteConfirmId) void handleDelete(deleteConfirmId);
                }}
                description={
                    <>
                        Harakat bekor qilinadi — commitlar repodan olib tashlanadi
                        (force push).
                    </>
                }
                note={
                    <>
                        GitHubdagi yashil nuqtalar o&apos;chishi 5 minutdan 24
                        soatgacha vaqt olishi mumkin, ba&apos;zan esa butunlay
                        o&apos;chmasligi ham mumkin.
                    </>
                }
            />

            <ProgressModal
                open={modal.open}
                title={modal.title}
                step={modal.step}
                message={modal.message}
                current={modal.current}
                total={modal.total}
                error={modal.error}
                canClose={modal.canClose}
                onClose={() => setModal((m) => ({ ...m, open: false }))}
            />
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block text-sm">
            <span className="mb-1.5 block text-[var(--fg-muted)]">{label}</span>
            {children}
        </label>
    );
}

const MONTH_SHORT = [
    "yan",
    "fev",
    "mar",
    "apr",
    "may",
    "iyun",
    "iyul",
    "avg",
    "sen",
    "okt",
    "noy",
    "dek",
];

function formatActionDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;

    const tz = "Asia/Tashkent";
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(d);
    const get = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((p) => p.type === type)?.value ?? "";

    const day = get("day");
    const monthIdx = Number(get("month")) - 1;
    const year = get("year");
    const time = `${get("hour")}:${get("minute")}`;

    const nowParts = new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        day: "numeric",
        month: "numeric",
        year: "numeric",
    }).formatToParts(new Date());
    const nowGet = (type: Intl.DateTimeFormatPartTypes) =>
        nowParts.find((p) => p.type === type)?.value ?? "";

    const isToday =
        day === nowGet("day") &&
        get("month") === nowGet("month") &&
        year === nowGet("year");
    if (isToday) return time;

    const month = MONTH_SHORT[monthIdx];
    if (year === nowGet("year")) return `${day}-${month}, ${time}`;
    return `${day}-${month} ${year}, ${time}`;
}

/** Bo'sh katak — form balandligi Tur o'zgarganda saqlansin */
function FieldSlot() {
    return (
        <div className="invisible pointer-events-none" aria-hidden>
            <Field label="—">
                <div className="select">&nbsp;</div>
            </Field>
        </div>
    );
}

function HistorySkeleton() {
    return (
        <ul className="space-y-3" aria-busy="true" aria-label="Tarix yuklanmoqda">
            {Array.from({ length: 2 }).map((_, i) => (
                <li
                    key={i}
                    className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
                >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <div className="skeleton-bone h-3.5 w-52" />
                            <div className="skeleton-bone mt-1.5 h-[11px] w-16" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <div className="skeleton-bone h-[34px] w-[7.5rem] rounded-lg" />
                            <div className="skeleton-bone h-[34px] w-[5.25rem] rounded-lg" />
                        </div>
                    </div>
                    <div className="mt-3 flex overflow-hidden" style={{ gap: 3 }}>
                        {Array.from({ length: 36 }).map((_, wi) => (
                            <div key={wi} className="flex flex-col" style={{ gap: 3 }}>
                                {Array.from({ length: 7 }).map((_, di) => (
                                    <div
                                        key={di}
                                        className="skeleton-bone h-[11px] w-[11px] !rounded-[2px]"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </li>
            ))}
        </ul>
    );
}
