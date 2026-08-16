'use client';

import { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import * as XLSX from 'xlsx';
import {
  X,
  ExternalLink,
  Columns,
  MoveHorizontal,
  RefreshCw,
  Globe,
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
  Plus,
  FileSpreadsheet
} from 'lucide-react';
import clsx from 'clsx';

interface SplitWorkspaceProps {
  children: React.ReactNode;
}

const INTERNAL_PAGES = [
  { title: 'لیست محصولات', url: '/products', category: 'محصولات', icon: Package },
  { title: 'ثبت محصول جدید', url: '/products/new', category: 'محصولات', icon: Plus },
  { title: 'لیست قطعات پایه (Part)', url: '/parts', category: 'قطعات', icon: Cpu },
  { title: 'تعریف قطعه پایه جدید', url: '/parts/new', category: 'قطعات', icon: Plus },
  { title: 'ویژگی‌های قطعات (Properties)', url: '/properties', category: 'ویژگی‌ها', icon: Sliders },
  { title: 'دسته‌بندی قطعات', url: '/parts/categories', category: 'دسته‌بندی', icon: Layers },
  { title: 'توضیحات تخصصی قطعه-خودرو', url: '/part-descriptions', category: 'توضیحات', icon: FileText },
  { title: 'ثبت توضیحات قطعه-خودرو جدید', url: '/part-descriptions/new', category: 'توضیحات', icon: Plus },
  { title: 'لیست خودروها', url: '/cars', category: 'خودروها', icon: Car },
  { title: 'تعریف مدل خودرو جدید', url: '/cars/new', category: 'خودروها', icon: Plus },
  { title: 'لیست برندها', url: '/brands', category: 'برندها', icon: Award },
  { title: 'تعریف برند جدید', url: '/brands/new', category: 'برندها', icon: Plus },
  { title: 'مدیریت برچسب‌ها (Tags)', url: '/tags', category: 'تگ‌ها', icon: Tag },
  { title: 'نظرات کاربران', url: '/comments', category: 'تعاملات', icon: MessageSquare },
  { title: 'پرسش و پاسخ‌ها', url: '/inquiries', category: 'تعاملات', icon: HelpCircle },
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

  // ⚠️ استیت مربوط به فایل اکسل خوانده شده
  const [excelData, setExcelData] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setInputUrl(splitMode === 'internal' ? internalUrl : externalUrl);
    // در صورتی که مود عوض شد یا URL جدید اومد و اکسل نبود، دیتای اکسل پاک بشه
    if (!externalUrl.startsWith('excel:')) {
      setExcelData(null);
    }
  }, [splitMode, internalUrl, externalUrl]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // ⚠️ خوانش اختصاصی فایل اکسل و تبدیل آن به HTML
  useEffect(() => {
    const loadExcelFile = async () => {
      if (externalUrl.startsWith('excel:')) {
        try {
          const actualUrl = externalUrl.replace('excel:', '');
          const response = await fetch(actualUrl);
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // تبدیل به HTML Table برای رندر راحت‌تر
          const htmlString = XLSX.utils.sheet_to_html(worksheet, { id: 'excel-table' });
          setExcelData(htmlString);
        } catch (error) {
          console.error('Error reading excel file:', error);
          setExcelData('خطا در خواندن فایل اکسل.');
        }
      }
    };

    loadExcelFile();
  }, [externalUrl]);

  const formatExternalUrl = (url: string) => {
    let formatted = url.trim();
    if (formatted.startsWith('blob:') || formatted.startsWith('excel:')) {
      return formatted;
    }
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
      if (iframeRef.current && !formatted.startsWith('excel:')) {
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
    if (iframeRef.current && !inputUrl.startsWith('excel:')) {
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
    return (
      <div className="h-full w-full overflow-y-auto p-4 md:p-6 bg-neutral-950">
        {children}
      </div>
    );
  }

  const filteredPages = INTERNAL_PAGES.filter(
    (p) =>
      p.title.includes(inputUrl) ||
      p.url.includes(inputUrl) ||
      p.category.includes(inputUrl)
  );

  const isLocalFile = inputUrl.startsWith('blob:') || inputUrl.startsWith('excel:');

  return (
    <div ref={containerRef} className="relative flex h-full w-full overflow-hidden select-none">
      {/* پنجره اصلی سمت راست */}
      <div
        style={{ width: `${splitRatio}%` }}
        className="h-full overflow-y-auto border-l border-neutral-800 bg-neutral-950 p-4 md:p-6 transition-all"
      >
        {children}
      </div>

      {/* خط جداکننده کشویی */}
      <div
        onMouseDown={handleMouseDown}
        className="relative z-30 flex w-2 cursor-col-resize items-center justify-center bg-neutral-900 hover:bg-amber-500 transition-colors group"
      >
        <div className="flex h-8 w-4 items-center justify-center rounded bg-neutral-800 text-neutral-400 group-hover:bg-amber-500 group-hover:text-black shadow-md">
          <MoveHorizontal className="h-3 w-3" />
        </div>
      </div>

      {/* پنجره دوم مرجع */}
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
            ) : inputUrl.startsWith('excel:') ? (
              <>
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">فایل اکسل (Local)</span>
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400">
                  {isLocalFile ? 'فایل سیستم' : 'مرورگر همراه'}
                </span>
              </>
            )}
          </div>

          <div ref={dropdownRef} className="relative flex-1">
            <form onSubmit={handleUrlSubmit} className="flex items-center gap-1">
              <input
                type="text"
                value={isLocalFile ? 'فایل در حال نمایش از حافظه سیستم شماست...' : inputUrl}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setShowDropdown(true);
                }}
                readOnly={isLocalFile}
                placeholder={
                  splitMode === 'internal'
                    ? 'برای دیدن لیست صفحات کلیک کنید یا تایپ کنید...'
                    : 'آدرس اینترنتی (مثلاً: wikipedia.org)...'
                }
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none font-mono dir-ltr text-left disabled:opacity-50"
              />
              <button
                type="submit"
                className="rounded-lg bg-neutral-800 p-1.5 text-neutral-300 hover:bg-amber-500 hover:text-black transition-all shrink-0"
                title="بارگذاری آدرس"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </form>

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

          {!isLocalFile && splitMode === 'external' && (
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

        {/* ⚠️ رندر فایل‌های سیستم و آی‌فریم */}
        <div className="flex-1 overflow-hidden bg-neutral-900 relative">
          {inputUrl.startsWith('excel:') && excelData ? (
            <div
              className="h-full w-full overflow-auto bg-white p-4 text-black text-sm excel-preview"
              dangerouslySetInnerHTML={{ __html: excelData }}
            />
          ) : (
            <iframe
              ref={iframeRef}
              src={getTargetUrl()}
              className="h-full w-full border-none bg-white"
              title="مرجع ورود اطلاعات"
            />
          )}
        </div>
      </div>

      {/* استایل داخلی برای فرمت‌دهی جدول اکسل */}
      <style dangerouslySetInnerHTML={{__html: `
        .excel-preview table { width: 100%; border-collapse: collapse; text-align: right; direction: rtl; font-family: Tahoma, sans-serif; }
        .excel-preview th, .excel-preview td { border: 1px solid #d4d4d4; padding: 6px 10px; }
        .excel-preview th { background-color: #f5f5f5; font-weight: bold; }
        .excel-preview tr:hover { background-color: #f9f9f9; }
      `}} />
    </div>
  );
}