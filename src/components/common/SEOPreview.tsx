'use client';

import { Globe } from 'lucide-react';

interface SEOPreviewProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

export default function SEOPreview({ title, description, canonicalUrl }: SEOPreviewProps) {
  const displayTitle = title || 'عنوان سئوی محصول در گوگل قرار می‌گیرد';
  const displayUrl = canonicalUrl
    ? `https://yadakchi.com/product/${canonicalUrl}`
    : 'https://yadakchi.com/product/example-url';
  const displayDesc = description || 'توضیحات سئوی محصول در این قسمت نمایش داده می‌شود. سعی کنید بین ۱۲۰ تا ۱۶۰ کاراکتر باشد.';

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-2">
        <Globe className="h-4 w-4" />
        <span>پیش‌نمایش زنده نتیجه در گوگل (SEO Snippet Preview)</span>
      </div>

      <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4 space-y-1 text-right">
        {/* آدرس URL */}
        <div className="text-[11px] text-emerald-400 font-mono truncate dir-ltr text-right">
          {displayUrl}
        </div>

        {/* عنوان گوگل */}
        <h3 className="text-sm font-bold text-blue-400 hover:underline cursor-pointer leading-snug line-clamp-1">
          {displayTitle}
        </h3>

        {/* توضیحات گوگل */}
        <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
          {displayDesc}
        </p>
      </div>
    </div>
  );
}