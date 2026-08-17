'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2, X, ChevronDown, Check, Trash2 } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface MultiAsyncSelectProps {
  label?: string;
  placeholder?: string;
  selectedValues: string[];
  initialOptions?: SelectOption[];
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
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  // ⚠️ رفرنس برای نگهداری تگ‌های گزینه‌ها جهت اسکرول اتوماتیک
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ست کردن آیتم‌های اولیه در حالت ویرایش
  useEffect(() => {
    if (initialOptions && initialOptions.length > 0) {
      setSelectedItems(initialOptions);
    }
  }, [initialOptions]);

  // بستن منو با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // لود گزینه‌ها با دیبانس
  const loadOptions = useCallback(
    async (query: string) => {
      setLoading(true);
      try {
        const data = await fetchOptions(query);
        setOptions(data);
      } catch (e) {
        console.error('MultiAsyncSelect fetch error:', e);
      } finally {
        setLoading(false);
      }
    },
    [fetchOptions]
  );

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      loadOptions(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, isOpen, loadOptions]);

  // ریست کردن ایندکس‌های هایلایت هنگام تغییر آپشن‌ها
  useEffect(() => {
    setHighlightedIndex(-1);
    optionRefs.current = new Array(options.length).fill(null);
  }, [options]);

  // ⚠️ اسکرول اتوماتیک به سمت گزینه هایلایت‌شده با کیبورد
  useEffect(() => {
    if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedIndex]);

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

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== value));
    setSelectedItems(selectedItems.filter((i) => i.value !== value));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setSelectedItems([]);
  };

  // کنترل کامل کیبورد همراه با اسکرول خودکار
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleToggleSelect(options[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-1.5" tabIndex={0} onKeyDown={handleKeyDown}>
      {label && <label className="block text-xs font-medium text-neutral-300">{label}</label>}

      {/* باکس نمایش موارد انتخاب شده */}
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="flex min-h-[42px] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950 p-2 text-xs text-white hover:border-neutral-700 focus:border-amber-500 transition-all shadow-sm"
      >
        {selectedItems.length === 0 ? (
          <span className="text-neutral-500 px-1">{placeholder}</span>
        ) : (
          selectedItems.map((item) => (
            <span
              key={item.value}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400 font-medium animate-fadeIn"
            >
              <span>{item.label}</span>
              <button
                type="button"
                onClick={(e) => handleRemove(item.value, e)}
                className="hover:text-red-400 transition-colors"
                title="حذف این مورد"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        )}

        <div className="mr-auto flex items-center gap-1 shrink-0 text-neutral-500">
          {selectedItems.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1 hover:text-red-400 transition-colors"
              title="پاک کردن همه"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* منوی دراپ‌داون */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-full rounded-2xl border border-neutral-800 bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-xl animate-scaleIn">
          <div className="relative mb-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="تایپ جهت سرچ... (با کلیدهای جهت‌نما حرکت کنید و Enter بزنید)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 pl-9 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          </div>

          <div ref={listRef} className="max-h-52 overflow-y-auto space-y-1 pr-0.5">
            {loading ? (
              <div className="flex items-center justify-center p-4 text-neutral-500 text-xs gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                <span>در حال جستجو...</span>
              </div>
            ) : options.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-500">موردی پیدا نشد.</div>
            ) : (
             options.map((opt, index) => {
  const isSelected = selectedValues.includes(opt.value);
  const isHighlighted = highlightedIndex === index;

  return (
    <div
      key={opt.value}
      ref={(el) => {
        optionRefs.current[index] = el;
      }} // 👈 اصلاح شد تا خطا برطرف شود
      onClick={() => handleToggleSelect(opt)}
      onMouseEnter={() => setHighlightedIndex(index)}
      className={`flex items-center justify-between cursor-pointer rounded-xl px-3 py-2.5 text-xs transition-all ${
        isHighlighted
          ? 'bg-neutral-800 text-amber-400 font-bold'
          : 'text-neutral-200 hover:bg-neutral-800/60'
      } ${isSelected ? 'bg-amber-500/10 text-amber-400 font-semibold' : ''}`}
    >
      <span>{opt.label}</span>
      {isSelected && <Check className="h-4 w-4 text-amber-500" />}
    </div>
  );
})            )}
          </div>
        </div>
      )}
    </div>
  );
}