"use client";

type Props = {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  note?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmDisabled?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  note,
  confirmLabel = "Tasdiqlash",
  cancelLabel = "Bekor qilish",
  confirmDisabled,
  danger,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="confirm-overlay"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className={`confirm-modal ${danger ? "confirm-modal--danger" : "confirm-modal--commit"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-modal__accent" aria-hidden />

        <div className="confirm-modal__icon" aria-hidden>
          {danger ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6 9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <h2 id="confirm-title" className="confirm-modal__title">
          {title}
        </h2>

        {description && (
          <div className="confirm-modal__desc">{description}</div>
        )}

        {note && (
          <div className="confirm-modal__note">
            <span className="confirm-modal__note-label">Eslatma</span>
            <div className="confirm-modal__note-body">{note}</div>
          </div>
        )}

        <div className="confirm-modal__actions">
          <button
            type="button"
            onClick={onCancel}
            className="confirm-modal__btn confirm-modal__btn--ghost"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            className={`confirm-modal__btn ${
              danger
                ? "confirm-modal__btn--danger"
                : "confirm-modal__btn--primary"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
