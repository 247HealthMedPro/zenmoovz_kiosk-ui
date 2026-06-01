"use client";

export function KioskSlider({
  label,
  suffix,
  value,
  min,
  max,
  onChange,
  onNumberChange,
  error,
  id,
}) {
  const numId = `${id}-num`;

  return (
    <div className="ui-card p-5 tablet:p-6">
      <div className="mb-4 flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <span className="text-section">{label}</span>
        <div className="flex items-center gap-3">
          <input
            id={numId}
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onNumberChange(Number(e.target.value))}
            className="kiosk-touch w-24 rounded-xl border-2 border-border bg-surface-subtle text-center text-xl font-semibold text-brand outline-none focus:border-accent"
            aria-label={`${label} value`}
          />
          <span className="text-base text-text-muted">{suffix}</span>
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-3 w-full cursor-pointer accent-accent kiosk:h-4"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
      />
      {error ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
