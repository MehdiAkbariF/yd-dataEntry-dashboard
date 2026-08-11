'use client';

import { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import {
  X,
  ExternalLink,
  Columns,
  MoveHorizontal,
  RefreshCw,
  Globe,
  Search,
  Package,
  Cpu,
  Sliders,
  Layers,
  FileText,
  Car,
  Award,
  Tag,
  MessageSquare,
  HelpCircle,
  Plus
} from 'lucide-react';
import clsx from 'clsx';

interface SplitWorkspaceProps {
  children: React.ReactNode;
}

// لیست کامل صفحات داخلی پنل جهت انتخاب سریع در پنجره مرجع
const INTERNAL_PAGES = [
  { title: 'لیست محصولات', url: '/products', category: 'محصولات', icon: Package },
  { title: 'ثبت محصول جدید', url: '/products/new', category: 'محصولات', icon: Plus },
  { title: 'لیست قطعات پایه (Part)', url: '/parts', category: 'قطعات', icon: Cpu },
  { title: 'تعریف قطعه پایه جدید', url: '/parts/new', category: 'قطعات', icon: Plus },
  { title: 'ویژگی‌های قطعات (Properties)', url: '/properties', category: 'ویژگی‌ها', icon: Sliders },
  { title: 'دسته‌بندی قطعات', url: '/parts/categories', category: 'دسته‌بندی', icon: Layers },
  { title: 'توضیحات تخصصی قطعه-خودرو', url: '/part-descriptions', category: 'توضیحات', icon: FileText },
  { title: 'ثبت توضیحات قطعه-خودرو جدید', url: '/part-descriptions/new', category: 'توضیحات', icon: Plus },
  { title: 'مدیریت خودروها (Cars)', url: '/cars', category: 'خودروها', icon: Car },
  { title: 'تعریف مدل خودرو جدید', url: '/cars/new', category: 'خودروها', icon: Plus },
  { title: 'برندها (Brands)', url: '/brands', category: 'برندها', icon: Award },
  { title: 'تعریف برند جدید', url: '/brands/new', category: 'برندها', icon: Plus },
  { title: 'مدیریت برچسب‌ها (Tags)', url: '/tags', category: 'تگ‌ها', icon: Tag },
  { title: 'نظرات کاربران', url: '/comments', category: 'تعاملات', icon: MessageSquare },
  { title: 'پرسش و پاسخ‌ها', href: '/inquiries', url: '/inquiries', category: 'تعاملات', icon: HelpCircle },
];

export default function SplitWorkspace({ children }: SplitWorkspaceProps) {
  const {
    splitMode,
    internalUrl,
    externalUrl,
    splitRatio,
    setSplitRatio,
    closeSplit,
    setInternalUrl,
    setExternalUrl,
  } = useWorkspaceStore();

  const [inputUrl, setInputUrl] = useState(
    splitMode === 'internal' ? internalUrl : externalUrl
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setInputUrl(splitMode === 'internal' ? internalUrl : externalUrl);
  }, [splitMode, internalUrl, externalUrl]);

  // بستن دراپ‌داون هنگام کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // کشیدن خط وسط (Resize)
  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const offset = e.clientX - rect.left;
      const percentage = (offset / rect.width) * 100;

      if (percentage > 20 && percentage < 80) {
        setSplitRatio(percentage);
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setSplitRatio]);

  // اصلاح آدرس سایت‌های خارجی جهت جلوگیری از ارور
  const formatExternalUrl = (url: string) => {
    let formatted = url.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    return formatted;
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    if (splitMode === 'internal') {
      setInternalUrl(inputUrl);
    } else {
      const formatted = formatExternalUrl(inputUrl);
      setInputUrl(formatted);
      setExternalUrl(formatted);
      if (iframeRef.current) {
        iframeRef.current.src = formatted;
      }
    }
  };

  const handleSelectPage = (url: string) => {
    setInputUrl(url);
    setInternalUrl(url);
    setShowDropdown(false);
  };

  const handleRefreshIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = getTargetUrl();
    }
  };

  const getTargetUrl = () => {
    if (splitMode === 'internal') {
      const url = internalUrl || '/products';
      return url.includes('?') ? `${url}&embed=true` : `${url}?embed=true`;
    }
    return formatExternalUrl(externalUrl || 'https://www.google.com');
  };

  if (splitMode === 'none') {
    return <>{children}</>;
  }

  // فیلتر لیست صفحات بر اساس تایپ
  const filteredPages = INTERNAL_PAGES.filter(
    (p) =>
      p.title.includes(inputUrl) ||
      p.url.includes(inputUrl) ||
      p.category.includes(inputUrl)
  );

  return (
    <div ref={containerRef} className="relative flex h-full w-full overflow-hidden select-none">
      {/* پنجره اصلی کار (سمت راست) */}
      <div
        style={{ width: `${splitRatio}%` }}
        className="h-full overflow-y-auto border-l border-neutral-800 bg-neutral-950 p-4 transition-all"
      >
        {children}
      </div>

      {/* خط جداکننده کشویی (Resizable Bar) */}
      <div
        onMouseDown={handleMouseDown}
        className="relative z-30 flex w-2 cursor-col-resize items-center justify-center bg-neutral-900 hover:bg-amber-500 transition-colors group"
      >
        <div className="flex h-8 w-4 items-center justify-center rounded bg-neutral-800 text-neutral-400 group-hover:bg-amber-500 group-hover:text-black shadow-md">
          <MoveHorizontal className="h-3 w-3" />
        </div>
      </div>

      {/* پنجره دوم (مرجع) */}
      <div
        style={{ width: `${100 - splitRatio}%` }}
        className="flex h-full flex-col bg-neutral-900/90 backdrop-blur-xl"
      >
        {/* نوار کنترل بالای پنجره مرجع */}
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950 p-2 text-xs relative z-40">
          <div className="flex items-center gap-1.5 text-amber-500 font-bold pl-2 border-l border-neutral-800 shrink-0">
            {splitMode === 'internal' ? (
              <>
                <Columns className="h-4 w-4" />
                <span>مرجع پنل</span>
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400">مرورگر همراه</span>
              </>
            )}
          </div>

          {/* فرم آدرس‌بار و سرچ لیست صفحات */}
          <div ref={dropdownRef} className="relative flex-1">
            <form onSubmit={handleUrlSubmit} className="flex items-center gap-1">
              <input
                type="text"
                value={inputUrl}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setShowDropdown(true);
                }}
                placeholder={
                  splitMode === 'internal'
                    ? 'برای دیدن لیست صفحات کلیک کنید یا تایپ کنید...'
                    : 'آدرس اینترنتی (مثلاً: wikipedia.org)...'
                }
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none font-mono dir-ltr text-left"
              />
              <button
                type="submit"
                className="rounded-lg bg-neutral-800 p-1.5 text-neutral-300 hover:bg-amber-500 hover:text-black transition-all shrink-0"
                title="بارگذاری آدرس"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* ⚠️ لیست کشویی کامل تمام صفحات پنل موقع کلیک روی باکس سرچ */}
            {splitMode === 'internal' && showDropdown && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900 p-2 shadow-2xl backdrop-blur-2xl">
                <div className="px-2 py-1 text-[10px] font-bold text-amber-500 border-b border-neutral-800 mb-1">
                  انتخاب سریع صفحات مرجع پنل:
                </div>
                {filteredPages.length === 0 ? (
                  <div className="p-2 text-center text-[11px] text-neutral-500">صفحه‌ای یافت نشد.</div>
                ) : (
                  filteredPages.map((page) => {
                    const Icon = page.icon;
                    return (
                      <div
                        key={page.url}
                        onClick={() => handleSelectPage(page.url)}
                        className="flex items-center justify-between cursor-pointer rounded-lg px-2.5 py-2 text-xs text-neutral-200 hover:bg-neutral-800 hover:text-amber-400 transition-all mb-0.5"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-neutral-500" />
                          <span>{page.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500 dir-ltr">{page.url}</span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* دکمه باز کردن در تب مجزای مرورگر در صورت عدم اجازه iframe */}
          {splitMode === 'external' && (
            <a
              href={formatExternalUrl(inputUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-neutral-800 p-1.5 text-neutral-400 hover:text-white"
              title="باز کردن مستقیم در تب جداگانه مرورگر"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          <button
            onClick={handleRefreshIframe}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            title="رفرش"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={closeSplit}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-500/20 hover:text-red-400"
            title="بستن"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* آی‌فریم نمایش پنجره مرجع */}
        <div className="flex-1 overflow-hidden bg-neutral-950 relative">
          <iframe
            ref={iframeRef}
            src={getTargetUrl()}
            className="h-full w-full border-none"
            title="مرجع ورود اطلاعات"
          />
        </div>
      </div>
    </div>
  );
}