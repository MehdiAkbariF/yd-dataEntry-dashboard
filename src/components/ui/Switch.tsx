'use client';

import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function Switch({ checked, onChange, label, disabled, isLoading }: SwitchProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled || isLoading}
          className="sr-only"
        />
        <div
          className={clsx(
            'h-6 w-11 rounded-full transition-colors border',
            checked ? 'bg-emerald-500 border-emerald-400' : 'bg-neutral-800 border-neutral-700'
          )}
        />
        <div
          className={clsx(
            'absolute top-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition-transform',
            checked && 'translate-x-5'
          )}
        >
          {isLoading && <Loader2 className="h-2.5 w-2.5 animate-spin text-neutral-900" />}
        </div>
      </div>
      {label && <span className="text-xs font-medium text-neutral-300">{label}</span>}
    </label>
  );
}