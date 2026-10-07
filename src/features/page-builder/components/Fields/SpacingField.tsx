// src/features/page-builder/components/Fields/SpacingField.tsx

'use client';

import { useState } from 'react';

export interface SpacingFieldProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

const PRESET_SPACINGS = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

export function SpacingField({
  value,
  onChange,
  label = 'فاصله',
  min = 0,
  max = 200,
  step = 4,
  unit = 'px',
}: SpacingFieldProps) {
  const safeValue = typeof value === 'number' ? value : 0;

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-medium text-neutral-300">
            {label}
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={safeValue}
              onChange={(e) => onChange(Number(e.target.value))}
              min={min}
              max={max}
              step={step}
              className="w-16 h-7 rounded-md border border-neutral-800 bg-neutral-950 px-2 text-[11px] text-white text-center font-mono focus:outline-none focus:border-amber-500/50"
            />
            <span className="text-[10px] text-neutral-500 font-mono">
              {unit}
            </span>
          </div>
        </div>
      )}

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full bg-neutral-800 appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-amber-500
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-neutral-900
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-amber-500
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-neutral-900
          [&::-moz-range-thumb]:cursor-pointer"
      />

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-1">
        {PRESET_SPACINGS.filter((s) => s >= min && s <= max).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
              safeValue === s
                ? 'bg-amber-500 text-black'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}