'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface MultiAsyncSelectProps {
  label?: string;
  placeholder?: string;
  selectedValues: string[];
  initialOptions?: SelectOption[]; // ⚠️ برای پیش‌فرض‌های حالت ویرایش
  onChange: (values: string[]) => void;
  fetchOptions: (searchQuery: string) => Promise<SelectOption[]>;
}

export function MultiAsyncSelect({
  label,
  placeholder = 'جستجو و انتخاب چندتایی...',
  selectedValues = [],
  initialOptions = [],
  onChange,
  fetchOptions,
}: MultiAsyncSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectOption[]>(initialOptions);

  const containerRef = useRef<HTMLDivElement>(null);

  // ست کردن آیتم‌های اولیه در حالت ویرایش
  useEffect(() => {
    if (initialOptions && initialOptions.length > 0) {
      setSelectedItems(initialOptions);
    }
  }, [initialOptions]);

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
        console.error('MultiAsyncSelect fetch error:', e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, isOpen, fetchOptions]);

  const handleToggleSelect = (option: SelectOption) => {
    const exists = selectedValues.includes(option.value);
    let newValues: string[];
    let newItems: SelectOption[];

    if (exists) {
      newValues = selectedValues.filter((v) => v !== option.value);
      newItems = selectedItems.filter((i) => i.value !== option.value);
    } else {
      newValues = [...selectedValues, option.value];
      newItems = [...selectedItems, option];
    }

    onChange(newValues);
    setSelectedItems(newItems);
  };

  const handleRemove = (value: string) => {
    onChange(selectedValues.filter((v) => v !== value));
    setSelectedItems(selectedItems.filter((i) => i.value !== value));
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-1.5">
      {label && <label className="block text-xs font-medium text-neutral-300">{label}</label>}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[42px] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950 p-2 text-xs text-white hover:border-neutral-700 transition-all"
      >
        {selectedItems.length === 0 ? (
          <span className="text-neutral-500 px-1">{placeholder}</span>
        ) : (
          selectedItems.map((item) => (
            <span
              key={item.value}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-400 font-medium"
            >
              <span>{item.label}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.value);
                }}
                className="hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        )}

        <ChevronDown className="mr-auto h-4 w-4 text-neutral-500 shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2 shadow-2xl backdrop-blur-xl">
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="تایپ جهت سرچ..."
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
                <span>در حال جستجو...</span>
              </div>
            ) : options.length === 0 ? (
              <div className="p-3 text-center text-xs text-neutral-500">موردی پیدا نشد.</div>
            ) : (
              options.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleToggleSelect(opt)}
                    className="flex items-center justify-between cursor-pointer rounded-lg px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 transition-all"
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-amber-500" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}