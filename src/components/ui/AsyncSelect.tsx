'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, ChevronDown } from 'lucide-react';

interface AsyncSelectOption {
  value: string;
  label: string;
}

interface AsyncSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  initialLabel?: string; // ⚠️ برای پیش‌فرض حالت ویرایش
  onChange: (value: string) => void;
  fetchOptions: (searchQuery: string) => Promise<AsyncSelectOption[]>;
}

export function AsyncSelect({
  label,
  placeholder = 'جستجو و انتخاب...',
  value,
  initialLabel,
  onChange,
  fetchOptions,
}: AsyncSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<AsyncSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>(initialLabel || '');

  const containerRef = useRef<HTMLDivElement>(null);

  // ست کردن عنوان اولیه در حالت ویرایش
  useEffect(() => {
    if (initialLabel) {
      setSelectedLabel(initialLabel);
    }
  }, [initialLabel]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchOptions(search);
        setOptions(data);
      } catch (e) {
        console.error('AsyncSelect fetch error:', e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, isOpen, fetchOptions]);

  const handleSelect = (option: AsyncSelectOption) => {
    onChange(option.value);
    setSelectedLabel(option.label);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSelectedLabel('');
    setSearch('');
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-1.5">
      {label && <label className="block text-xs font-medium text-neutral-300">{label}</label>}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white hover:border-neutral-700 transition-all"
      >
        <span className={selectedLabel ? 'text-white font-medium' : 'text-neutral-500'}>
          {selectedLabel || placeholder}
        </span>

        <div className="flex items-center gap-1.5">
          {value && (
            <button onClick={handleClear} className="text-neutral-500 hover:text-red-400">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <ChevronDown className="h-4 w-4 text-neutral-500" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2 shadow-2xl backdrop-blur-xl">
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="تایپ جهت جستجو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 pl-8 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
              autoFocus
            />
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-500" />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1">
            {loading ? (
              <div className="flex items-center justify-center p-3 text-neutral-500 text-xs gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                <span>در حال دریافت...</span>
              </div>
            ) : options.length === 0 ? (
              <div className="p-3 text-center text-xs text-neutral-500">موردی یافت نشد.</div>
            ) : (
              options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className="cursor-pointer rounded-lg px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 hover:text-amber-400 transition-all"
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}