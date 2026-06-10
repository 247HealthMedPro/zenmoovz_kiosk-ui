"use client";

import { useState } from "react";
import { handleKioskInputFocus } from "@/lib/utils/kioskKeyboard";
import { cn } from "@/shared/utils/cn";

function sanitizeInput(raw, integer) {
  if (integer) return raw.replace(/[^\d]/g, "");
  const cleaned = raw.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  return `${parts[0]}.${parts.slice(1).join("")}`;
}

function parseValue(raw, integer) {
  if (raw.trim() === "") return null;
  const n = integer ? parseInt(raw, 10) : parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

export function KioskSlider({
  label,
  suffix,
  value,
  min,
  max,
  onChange,
  error,
  id,
  integer = false,
}) {
  const numId = `${id}-num`;
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const [rangeError, setRangeError] = useState(null);

  const safeValue = Number.isFinite(Number(value)) ? Number(value) : min;
  const sliderValue = Math.min(max, Math.max(min, safeValue));
  const rangeHint = `Enter a value between ${min} and ${max}`;
  const showError = rangeError || error;

  const handleFocus = (e) => {
    handleKioskInputFocus(e);
    setFocused(true);
    setDraft("");
    setRangeError(null);
  };

  const handleInputChange = (e) => {
    const raw = sanitizeInput(e.target.value, integer);
    setDraft(raw);

    if (raw.trim() === "") {
      setRangeError(null);
      return;
    }

    const parsed = parseValue(raw, integer);
    if (parsed === null) {
      setRangeError("Enter a valid number");
      return;
    }

    if (parsed < min || parsed > max) {
      setRangeError(rangeHint);
      onChange(parsed);
      return;
    }

    setRangeError(null);
    onChange(parsed);
  };

  const handleBlur = () => {
    setFocused(false);

    if (draft.trim() === "") {
      setDraft("");
      setRangeError(null);
      return;
    }

    const parsed = parseValue(draft, integer);
    if (parsed === null || parsed < min || parsed > max) {
      setRangeError(rangeHint);
      setDraft("");
      return;
    }

    setRangeError(null);
    setDraft("");
    onChange(parsed);
  };

  return (
    <div className="ui-card p-5 tablet:p-6">
      <div className="mb-4 flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <span className="text-section">{label}</span>
        <div className="flex items-center gap-3">
          <input
            id={numId}
            type="text"
            inputMode={integer ? "numeric" : "decimal"}
            enterKeyHint="done"
            autoComplete="off"
            value={focused ? draft : String(safeValue)}
            placeholder={String(min)}
            onFocus={handleFocus}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={cn(
              "kiosk-touch w-24 rounded-xl border-2 bg-surface-subtle text-center text-xl font-semibold text-brand outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent",
              showError ? "border-error" : "border-border"
            )}
            aria-label={`${label} value`}
            aria-invalid={Boolean(showError)}
          />
          <span className="text-base text-text-muted">{suffix}</span>
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={sliderValue}
        onChange={(e) => {
          const next = Number(e.target.value);
          setRangeError(null);
          setDraft("");
          setFocused(false);
          onChange(next);
        }}
        className="h-3 w-full cursor-pointer accent-accent kiosk:h-4"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={sliderValue}
        aria-label={label}
      />
      {showError ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {rangeError || error}
        </p>
      ) : null}
    </div>
  );
}
