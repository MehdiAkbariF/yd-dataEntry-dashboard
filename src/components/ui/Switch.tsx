'use client';

import { cn } from '@/lib/utils';
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
    <label
      className={cn(
        'inline-flex items-center gap-2.5 cursor-pointer select-none',
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled || isLoading}
          className="sr-only"
        />
        <div
          className={cn(
            'h-6 w-11 rounded-full transition-colors border',
            checked
              ? 'bg-[color:var(--success)] border-[color:var(--success)]'
              : 'bg-[color:var(--surface-3)] border-[color:var(--border-default)]'
          )}
          style={{ transitionDuration: 'var(--duration-fast)' }}
        />
        <div
          className={cn(
            'absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-token-sm transition-transform',
            checked && '-translate-x-5'
          )}
          style={{ transitionDuration: 'var(--duration-fast)' }}
        >
          {isLoading && <Loader2 className="h-2.5 w-2.5 animate-spin text-[color:var(--text-secondary)]" />}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-secondary">{label}</span>}
    </label>
  );
}