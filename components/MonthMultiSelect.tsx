"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MONTH_OPTIONS } from "@/lib/patterns";

type Props = {
  value: number[];
  onChange: (months: number[]) => void;
  allMonths: readonly number[];
};

export function MonthMultiSelect({ value, onChange, allMonths }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const allSelected = value.length === allMonths.length;
  const label =
    value.length === 0
      ? "Oy tanlang"
      : allSelected
        ? "Barcha oylar"
        : value.length <= 3
          ? value
              .slice()
              .sort((a, b) => a - b)
              .map((m) => MONTH_OPTIONS.find((o) => o.value === m)?.label ?? m)
              .join(", ")
          : `${value.length} oy tanlangan`;

  function toggle(month: number) {
    onChange(
      value.includes(month)
        ? value.filter((m) => m !== month)
        : [...value, month].sort((a, b) => a - b),
    );
  }

  return (
    <div className="month-select" ref={rootRef}>
      <button
        type="button"
        className="month-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="month-select__label">{label}</span>
        <span className="month-select__chevron" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className="month-select__panel" id={listId} role="listbox" aria-multiselectable>
          <div className="month-select__toolbar">
            <button
              type="button"
              className="month-select__link"
              onClick={() => onChange([...allMonths])}
            >
              Hammasi
            </button>
            <button
              type="button"
              className="month-select__link"
              onClick={() => onChange([])}
            >
              Tozalash
            </button>
          </div>
          <ul className="month-select__list">
            {MONTH_OPTIONS.map((o) => {
              const checked = value.includes(o.value);
              return (
                <li key={o.value}>
                  <label className={`month-select__option${checked ? " is-on" : ""}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(o.value)}
                    />
                    <span>{o.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
