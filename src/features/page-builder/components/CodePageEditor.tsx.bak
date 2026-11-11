// src/features/page-builder/components/CodePageEditor.tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Eye,
  Code2,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Save,
  Loader2,
  ArrowRight,
  Maximize2,
  Minimize2,
  Columns2,
} from 'lucide-react';
import { toast } from 'sonner';
import { CodeMirrorEditor } from './CodeMirrorEditor';
import { buildPreviewDoc } from '../lib/buildPreviewDoc';

interface CodePageEditorProps {
  initialHtml?: string;
  initialCss?: string;
  onSave: (data: { html: string; css: string }) => Promise<void>;
  isSaving?: boolean;
  headerTitle?: string;
  headerActions?: React.ReactNode;
  onBack?: () => void;
}

type Device = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'split' | 'html-only' | 'css-only' | 'preview-only';

const DEVICE_WIDTH: Record<Device, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

const DEFAULT_HTML = `<!-- شروع کدنویسی -->
<div class="page-wrap">
  <h1>صفحه جدید</h1>
  <p>کد HTML خود را اینجا بنویسید.</p>
</div>`;

const DEFAULT_CSS = `/* استایل‌های سفارشی */
.page-wrap {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.page-wrap h1 {
  color: #f59e0b;
  font-size: 28px;
  margin-bottom: 12px;
}`;

export function CodePageEditor({
  initialHtml = '',
  initialCss = '',
  onSave,
  isSaving = false,
  headerTitle = 'ادیتور کد',
  headerActions,
  onBack,
}: CodePageEditorProps) {
  const [html, setHtml] = useState(initialHtml || DEFAULT_HTML);
  const [css, setCss] = useState(initialCss || DEFAULT_CSS);
  const [device, setDevice] = useState<Device>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // نگه داشتن مقادیر برای جلوگیری از پرش و ریلود متوالی
  const [debouncedContent, setDebouncedContent] = useState({ html, css });

  useEffect(() => {
    if (!autoRefresh) return;
    const t = setTimeout(() => {
      setDebouncedContent({ html, css });
    }, 400);
    return () => clearTimeout(t);
  }, [html, css, autoRefresh]);

  const srcDoc = useMemo(
    () => buildPreviewDoc(debouncedContent),
    [debouncedContent]
  );

  const handleManualRefresh = useCallback(() => {
    setDebouncedContent({ html, css });
  }, [html, css]);

  const [fullscreenPreview, setFullscreenPreview] = useState(false);

  const handleSave = async () => {
    try {
      await onSave({ html, css });
    } catch (e: any) {
      toast.error(e?.message || 'خطا در ذخیره');
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-neutral-950" dir="rtl">
      {/* ─────────── Top Bar ─────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 bg-neutral-900 shrink-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-amber-500" />
          <h1 className="text-sm font-bold text-white">{headerTitle}</h1>
        </div>

        <div className="flex-1" />

        {headerActions}

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 disabled:opacity-50 transition-all"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>در حال ذخیره...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>ذخیره</span>
            </>
          )}
        </button>
      </div>

      {/* ─────────── Toolbar ─────────── */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800 bg-neutral-900/50 shrink-0 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-950 border border-neutral-800">
          <ToolbarBtn
            active={viewMode === 'split'}
            onClick={() => setViewMode('split')}
            icon={<Columns2 className="h-3.5 w-3.5" />}
            title="دو ستون"
          />
          <ToolbarBtn
            active={viewMode === 'html-only'}
            onClick={() => setViewMode('html-only')}
            icon={<Code2 className="h-3.5 w-3.5" />}
            title="فقط HTML"
          />
          <ToolbarBtn
            active={viewMode === 'css-only'}
            onClick={() => setViewMode('css-only')}
            icon={<Code2 className="h-3.5 w-3.5" />}
            title="فقط CSS"
          />
          <ToolbarBtn
            active={viewMode === 'preview-only'}
            onClick={() => setViewMode('preview-only')}
            icon={<Eye className="h-3.5 w-3.5" />}
            title="فقط پیش‌نمایش"
          />
        </div>

        <div className="w-px h-6 bg-neutral-800" />

        <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-950 border border-neutral-800">
          <ToolbarBtn
            active={device === 'desktop'}
            onClick={() => setDevice('desktop')}
            icon={<Monitor className="h-3.5 w-3.5" />}
            title="دسکتاپ"
          />
          <ToolbarBtn
            active={device === 'tablet'}
            onClick={() => setDevice('tablet')}
            icon={<Tablet className="h-3.5 w-3.5" />}
            title="تبلت"
          />
          <ToolbarBtn
            active={device === 'mobile'}
            onClick={() => setDevice('mobile')}
            icon={<Smartphone className="h-3.5 w-3.5" />}
            title="موبایل"
          />
        </div>

        <div className="w-px h-6 bg-neutral-800" />

        <label className="flex items-center gap-2 text-[11px] text-neutral-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500"
          />
          <span>پیش‌نمایش خودکار</span>
        </label>

        <button
          type="button"
          onClick={handleManualRefresh}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
        >
          <RefreshCw className="h-3 w-3" />
          <span>رفرش</span>
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => setFullscreenPreview(true)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-all"
        >
          <Maximize2 className="h-3 w-3" />
          <span>تمام صفحه</span>
        </button>
      </div>

      {/* ─────────── Main Area ─────────── */}
      <div className="flex-1 min-h-0 overflow-hidden flex gap-3 p-3">
        {/* HTML Panel */}
        {(viewMode === 'split' || viewMode === 'html-only') && (
          <div className="flex flex-col flex-1 min-h-0 min-w-0">
            <CodeMirrorEditor
              value={html}
              onChange={setHtml}
              language="html"
              label="HTML"
            />
          </div>
        )}

        {/* CSS Panel */}
        {(viewMode === 'split' || viewMode === 'css-only') && (
          <div className="flex flex-col flex-1 min-h-0 min-w-0">
            <CodeMirrorEditor
              value={css}
              onChange={setCss}
              language="css"
              label="CSS"
            />
          </div>
        )}

        {/* Preview Panel - کادر اصلاح شده با ارتفاع ۱۰۰٪ واقعی */}
        {(viewMode === 'split' || viewMode === 'preview-only') && (
          <div className="flex flex-col flex-1 min-h-0 min-w-0 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-neutral-900 shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold text-white">
                  پیش‌نمایش
                </span>
                <span className="text-[9px] font-mono text-neutral-500">
                  {DEVICE_WIDTH[device]}
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-0 w-full overflow-hidden bg-neutral-950 p-2 flex justify-center items-stretch">
              <div
                className="bg-white h-full w-full transition-all rounded-lg overflow-hidden flex flex-col shadow-xl"
                style={{ width: DEVICE_WIDTH[device], maxWidth: '100%' }}
              >
                <iframe
                  srcDoc={srcDoc}
                  title="preview"
                  className="w-full h-full flex-1 border-none bg-white block"
                  sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─────────── Fullscreen Preview ─────────── */}
      {fullscreenPreview && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-neutral-800 bg-neutral-900 shrink-0">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">
                پیش‌نمایش تمام صفحه
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFullscreenPreview(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-white text-xs hover:bg-neutral-700"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              <span>بستن</span>
            </button>
          </div>
          <div className="flex-1 min-h-0 bg-white">
            <iframe
              srcDoc={srcDoc}
              title="preview-fullscreen"
              className="w-full h-full border-none bg-white block"
              sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarBtn({
  active,
  onClick,
  icon,
  title,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-all ${
        active
          ? 'bg-amber-500 text-black'
          : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}