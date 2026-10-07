// src/features/page-builder/components/Fields/ColorPickerField.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { X, Palette } from 'lucide-react';

export interface ColorPickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

/**
 * Preset رنگ‌های آماده برند
 */
const PRESET_COLORS = [
  '#F56D3C', // رنگ برند
  '#09090B', // تیره
  '#FAFAFA', // روشن
  '#22c55e', // سبز
  '#ef4444', // قرمز
  '#f59e0b', // نارنجی
  '#3b82f6', // آبی
  '#8b5cf6', // بنفش
  '#ec4899', // صورتی
  '#14b8a6', // فیروزه‌ای
  '#6b7280', // خاکستری
  '#fbbf24', // طلایی
];

export function ColorPickerField({
  value,
  onChange,
  label = 'رنگ',
}: ColorPickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeColor = value || '#000000';

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-medium text-neutral-300 mb-1.5">
          {label}
        </label>
      )}

      {/* دکمه فعلی */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center gap-2 h-10 px-3 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-amber-500/50 transition-all flex-1"
        >
          <div
            className="w-6 h-6 rounded-md border border-neutral-700 shrink-0"
            style={{ backgroundColor: value || 'transparent' }}
          />
          <span className="text-xs font-mono text-white flex-1 text-right" dir="ltr">
            {value || 'بدون رنگ'}
          </span>
          <Palette className="h-3.5 w-3.5 text-neutral-500" />
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-500/50 transition-all"
            title="حذف رنگ"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Popup */}
      {isOpen && (
        <div className="absolute z-50 top-full mt-2 right-0 w-[280px] bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-2xl">
          {/* Color Wheel */}
          <div className="color-picker-wrapper">
            <HexColorPicker
              color={safeColor}
              onChange={(c) => onChange(c.toUpperCase())}
            />
          </div>

          {/* Preset Colors */}
          <div className="mt-4">
            <span className="text-[10px] font-bold text-neutral-400 block mb-2">
              رنگ‌های آماده
            </span>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    onChange(color);
                    setIsOpen(false);
                  }}
                  className="w-full aspect-square rounded-md border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor:
                      value === color ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Input Hex دستی */}
          <div className="mt-4">
            <span className="text-[10px] font-bold text-neutral-400 block mb-2">
              یا وارد کنید
            </span>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value.toUpperCase())}
              placeholder="#FFFFFF"
              dir="ltr"
              className="w-full h-9 rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-xs text-white font-mono focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>
      )}

      {/* استایل کلی برای Color Picker */}
      <style jsx global>{`
        .color-picker-wrapper .react-colorful {
          width: 100%;
          height: 180px;
        }
        .color-picker-wrapper .react-colorful__saturation {
          border-radius: 12px 12px 0 0;
        }
        .color-picker-wrapper .react-colorful__hue {
          border-radius: 0 0 12px 12px;
          height: 24px;
        }
        .color-picker-wrapper .react-colorful__pointer {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </div>
  );
}