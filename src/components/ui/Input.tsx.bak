'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="block text-xs font-medium text-neutral-300">{label}</label>}
        <div className="relative">
          <input
            ref={ref}
            className={clsx(
              'w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none transition-all disabled:opacity-50',
              icon && 'pl-9',
              error && 'border-red-500/50 focus:border-red-500',
              className
            )}
            {...props}
          />
          {icon && <div className="absolute left-3 top-2.5 text-neutral-500">{icon}</div>}
        </div>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';