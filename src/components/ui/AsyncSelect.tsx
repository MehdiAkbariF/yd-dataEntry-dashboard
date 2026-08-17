'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2, X, ChevronDown } from 'lucide-react';

interface AsyncSelectOption {
  value: string;
  label: string;
}

interface AsyncSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  initialLabel?: string;
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
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ⚠️ همگام‌سازی هوشمند لیبل با مقدار value یا initialLabel
  useEffect(() => {
    if (initialLabel) {
      setSelectedLabel(initialLabel);
    } else if (value) {
      // اول چک می‌کنیم بین گزینه‌های لودشده فعلی هست یا خیر
      const foundInCurrent = options.find((o) => o.value === value);
      if (foundInCurrent) {
        setSelectedLabel(foundInCurrent.label);
      } else {
        // اگر نبود، از سرور با جستجوی خالی یا آیدی پیدا می‌کنیم
        fetchOptions('').then((opts) => {
          const found = opts.find((o) => o.value === value);
          if (found) {
            setSelectedLabel(found.label);
          }
        });
      }
    } else {
      setSelectedLabel('');
    }
  }, [value, initialLabel, fetchOptions, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadOptions = useCallback(
    async (query: string) => {
      setLoading(true);
      try {
        const data = await fetchOptions(query);
        setOptions(data);
      } catch (e) {
        console.error('AsyncSelect fetch error:', e);
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

  useEffect(() => {
    setHighlightedIndex(-1);
    optionRefs.current = new Array(options.length).fill(null);
  }, [options]);

  // اسکرول اتوماتیک به سمت گزینه هایلایت‌شده با کیبورد
  useEffect(() => {
    if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedIndex]);

  const handleSelect = (option: AsyncSelectOption) => {
    setSelectedLabel(option.label); // 👈 فوراً روی دکمه اعمال می‌شود
    onChange(option.value);         // 👈 مقدار جدید به فرم والد ارسال می‌شود
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLabel('');
    onChange('');
    setSearch('');
  };

  // کنترل ناوبری با کیبورد (UX پیشرفته)
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
          handleSelect(options[highlightedIndex]);
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

      {/* باکس اصلی سلکت */}
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white hover:border-neutral-700 transition-all shadow-sm"
      >
        <span className={selectedLabel ? 'text-white font-medium' : 'text-neutral-500'}>
          {selectedLabel || placeholder}
        </span>

        <div className="flex items-center gap-1.5 shrink-0 text-neutral-500">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="hover:text-red-400 transition-colors p-0.5"
              title="پاک کردن انتخاب"
            >
              <X className="h-3.5 w-3.5" />
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
              placeholder="تایپ جهت جستجو... (با کلیدهای جهت‌نما حرکت کنید)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 pl-9 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          </div>

          <div ref={listRef} className="max-h-52 overflow-y-auto space-y-1 pr-0.5">
            {loading ? (
              <div className="flex items-center justify-center p-4 text-neutral-500 text-xs gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                <span>در حال دریافت...</span>
              </div>
            ) : options.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-500">موردی یافت نشد.</div>
            ) : (
              options.map((opt, index) => {
                const isSelected = value === opt.value;
                const isHighlighted = highlightedIndex === index;

                return (
                  <div
                    key={opt.value}
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`cursor-pointer rounded-xl px-3.5 py-2.5 text-xs transition-all ${
                      isHighlighted
                        ? 'bg-neutral-800 text-amber-400 font-bold'
                        : 'text-neutral-200 hover:bg-neutral-800/60'
                    } ${isSelected ? 'bg-amber-500/10 text-amber-400 font-semibold' : ''}`}
                  >
                    {opt.label}
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