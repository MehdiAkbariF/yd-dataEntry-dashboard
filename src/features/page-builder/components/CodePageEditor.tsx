'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Eye, Code2, Monitor, Smartphone, Tablet, RefreshCw, Save,
  Loader2, ArrowRight, Maximize2, Minimize2, Columns2,
} from 'lucide-react';
import { toast } from 'sonner';
import { CodeMirrorEditor } from './CodeMirrorEditor';
import { buildPreviewDoc } from '../lib/buildPreviewDoc';
import { cn } from '@/lib/utils';

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
  const [debouncedContent, setDebouncedContent] = useState({ html, css });

  useEffect(() => {
    if (!autoRefresh) return;
    const t = setTimeout(() => setDebouncedContent({ html, css }), 400);
    return () => clearTimeout(t);
  }, [html, css, autoRefresh]);

  const srcDoc = useMemo(() => buildPreviewDoc(debouncedContent), [debouncedContent]);

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
    <div className="editor-shell h-full w-full flex flex-col" dir="rtl">
      {/* Top Bar */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-default bg-surface-1 shrink-0">
        {onBack && (
          <button type="button" onClick={onBack} className="btn btn-ghost btn-icon">
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-[color:var(--accent-fg)]" />
          <h1 className="text-sm font-bold text-primary">{headerTitle}</h1>
        </div>

        <div className="flex-1" />
        {headerActions}

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary"
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

      {/* Toolbar */}
      <div className="editor-toolbar flex items-center gap-2 px-4 py-2 shrink-0 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-md bg-surface-2 border border-default">
          <ToolbarBtn active={viewMode === 'split'} onClick={() => setViewMode('split')} icon={<Columns2 className="h-4 w-4" />} title="دو ستون" />
          <ToolbarBtn active={viewMode === 'html-only'} onClick={() => setViewMode('html-only')} icon={<Code2 className="h-4 w-4" />} title="فقط HTML" />
          <ToolbarBtn active={viewMode === 'css-only'} onClick={() => setViewMode('css-only')} icon={<Code2 className="h-4 w-4" />} title="فقط CSS" />
          <ToolbarBtn active={viewMode === 'preview-only'} onClick={() => setViewMode('preview-only')} icon={<Eye className="h-4 w-4" />} title="فقط پیش‌نمایش" />
        </div>

        <div className="w-px h-6 bg-[color:var(--border-default)]" />

        <div className="flex items-center gap-1 p-1 rounded-md bg-surface-2 border border-default">
          <ToolbarBtn active={device === 'desktop'} onClick={() => setDevice('desktop')} icon={<Monitor className="h-4 w-4" />} title="دسکتاپ" />
          <ToolbarBtn active={device === 'tablet'} onClick={() => setDevice('tablet')} icon={<Tablet className="h-4 w-4" />} title="تبلت" />
          <ToolbarBtn active={device === 'mobile'} onClick={() => setDevice('mobile')} icon={<Smartphone className="h-4 w-4" />} title="موبایل" />
        </div>

        <div className="w-px h-6 bg-[color:var(--border-default)]" />

        <label className="flex items-center gap-2 text-xs text-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="w-4 h-4 rounded border-default bg-surface-2 accent-[color:var(--accent)]"
          />
          <span>پیش‌نمایش خودکار</span>
        </label>

        <button type="button" onClick={handleManualRefresh} className="btn btn-ghost btn-sm">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>رفرش</span>
        </button>

        <div className="flex-1" />

        <button type="button" onClick={() => setFullscreenPreview(true)} className="btn btn-ghost btn-sm">
          <Maximize2 className="h-3.5 w-3.5" />
          <span>تمام صفحه</span>
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 min-h-0 overflow-hidden flex gap-3 p-3">
        {(viewMode === 'split' || viewMode === 'html-only') && (
          <div className="flex flex-col flex-1 min-h-0 min-w-0">
            <CodeMirrorEditor value={html} onChange={setHtml} language="html" label="HTML" />
          </div>
        )}

        {(viewMode === 'split' || viewMode === 'css-only') && (
          <div className="flex flex-col flex-1 min-h-0 min-w-0">
            <CodeMirrorEditor value={css} onChange={setCss} language="css" label="CSS" />
          </div>
        )}

        {(viewMode === 'split' || viewMode === 'preview-only') && (
          <div className="editor-panel flex flex-col flex-1 min-h-0 min-w-0">
            <div className="editor-panel-header">
              <div className="flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-[color:var(--success-fg)]" />
                <span className="text-xs font-bold text-primary">پیش‌نمایش</span>
                <span className="text-2xs font-mono text-tertiary">{DEVICE_WIDTH[device]}</span>
              </div>
            </div>

            <div className="flex-1 min-h-0 w-full overflow-hidden bg-[color:var(--surface-0)] p-2 flex justify-center items-stretch">
              <div
                className="bg-[color:var(--preview-bg)] h-full w-full transition-all rounded-md overflow-hidden flex flex-col shadow-token-lg"
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

      {/* Fullscreen Preview */}
      {fullscreenPreview && (
        <div className="fixed inset-0 z-[var(--z-modal)] bg-black/95 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-default bg-surface-1 shrink-0">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[color:var(--success-fg)]" />
              <span className="text-sm font-bold text-primary">پیش‌نمایش تمام صفحه</span>
            </div>
            <button type="button" onClick={() => setFullscreenPreview(false)} className="btn btn-secondary btn-sm">
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
  active, onClick, icon, title,
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
      className={cn(
        'p-2 rounded-md transition-colors',
        active
          ? 'bg-[color:var(--accent)] text-[color:var(--accent-contrast)]'
          : 'text-tertiary hover:bg-[color:var(--surface-3)] hover:text-primary'
      )}
    >
      {icon}
    </button>
  );
}