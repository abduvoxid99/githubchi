"use client";

type Props = {
  open: boolean;
  title: string;
  step: string;
  message: string;
  current?: number;
  total?: number;
  error?: string | null;
  onClose?: () => void;
  canClose?: boolean;
};

const STEP_LABELS: Record<string, string> = {
  validating: "Tekshirish",
  cloning: "Tekshirish",
  committing: "Commit",
  pushing: "Push",
  saving: "Saqlash",
  reverting: "Revert",
  done: "Saqlash",
  error: "Xato",
};

/** UI ko‘rinishi — backend step nomlari o‘zgarmaydi */
const ORDER = ["validating", "committing", "pushing", "saving"];
const REVERT_ORDER = ["reverting", "pushing", "done"];

function uiStep(step: string): string {
  if (step === "cloning") return "validating";
  if (step === "done") return "saving";
  return step;
}

export function ProgressModal({
  open,
  title,
  step,
  message,
  current,
  total,
  error,
  onClose,
  canClose,
}: Props) {
  if (!open) return null;

  const progress =
    typeof current === "number" && typeof total === "number" && total > 0
      ? Math.round((current / total) * 100)
      : null;

  const isRevert =
    title.toLowerCase().includes("bekor") || step === "reverting";
  const isError = step === "error";
  const isDone = step === "done";
  const steps = isRevert ? REVERT_ORDER : ORDER;
  const displayStep = isRevert
    ? step === "done"
      ? "done"
      : step
    : uiStep(step);
  const activeIdx = steps.indexOf(isError ? "pushing" : displayStep);

  const variant = isError
    ? "error"
    : isDone
      ? "done"
      : isRevert
        ? "revert"
        : "commit";

  const statusLabel = isError
    ? "Xato"
    : isDone
      ? "Tayyor"
      : isRevert
        ? "O'chirilmoqda"
        : "Jarayonda";

  return (
    <div className="progress-overlay" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-title"
        className={`progress-modal progress-modal--${variant}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="progress-modal__accent" aria-hidden />

        <div className="progress-modal__head">
          <div>
            <p className="progress-modal__eyebrow">{statusLabel}</p>
            <h2 id="progress-title" className="progress-modal__title">
              {title}
            </h2>
          </div>
          {progress !== null && step === "committing" && (
            <div className="progress-modal__pct" aria-live="polite">
              {progress}
              <span>%</span>
            </div>
          )}
        </div>

        <p className="progress-modal__message">{message}</p>

        {progress !== null && step === "committing" && (
          <div className="progress-modal__bar" aria-hidden>
            <div
              className="progress-modal__bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {!isDone && !isError && step === "committing" && total != null && (
          <p className="progress-modal__meta">
            <span className="font-mono">
              {current ?? 0}/{total}
            </span>{" "}
            commit
          </p>
        )}

        <ol className="progress-steps">
          {steps.map((s, i) => {
            const done = activeIdx > i || isDone;
            const active =
              displayStep === s || (isError && s === "pushing" && activeIdx === i);
            const state = done ? "done" : active ? "active" : "todo";
            return (
              <li key={s} className={`progress-step progress-step--${state}`}>
                <span className="progress-step__dot">
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6 9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : active && !isError ? (
                    <span className="progress-step__pulse" />
                  ) : (
                    <span className="progress-step__num">{i + 1}</span>
                  )}
                </span>
                <span className="progress-step__label">{STEP_LABELS[s]}</span>
                {i < steps.length - 1 && (
                  <span className="progress-step__line" aria-hidden />
                )}
              </li>
            );
          })}
        </ol>

        {error && (
          <div className="progress-modal__error" role="alert">
            {error}
          </div>
        )}

        {canClose && (
          <button
            type="button"
            onClick={onClose}
            className="progress-modal__close"
          >
            Yopish
          </button>
        )}
      </div>
    </div>
  );
}
