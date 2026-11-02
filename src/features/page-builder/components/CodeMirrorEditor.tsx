// src/features/page-builder/components/CodeMirrorEditor.tsx
'use client';

import { useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { Code2, WrapText, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';

// استفاده از پکیج محلی به جای دانلود از CDN (رفع مشکل لود نشدن و صفحه سیاه)
loader.config({ monaco });

interface CodeMirrorEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: 'html' | 'css';
  label?: string;
}

export function CodeMirrorEditor({
  value,
  onChange,
  language = 'html',
  label,
}: CodeMirrorEditorProps) {
  const [copied, setCopied] = useState(false);
  const [wrap, setWrap] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-4 z-[999] shadow-2xl flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden'
          : 'flex flex-col h-full w-full bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden'
      }
    >
      {/* Header (RTL مناسب فارسی) */}
      <div 
        dir="rtl" 
        className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-neutral-900 shrink-0"
      >
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-[11px] font-bold text-white">{label}</span>
          <span className="text-[9px] font-mono text-neutral-500 uppercase px-1.5 py-0.5 rounded bg-neutral-800">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setWrap((w) => !w)}
            className={`p-1.5 rounded-md ${
              wrap ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
            }`}
            title="Word Wrap"
          >
            <WrapText className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white"
            title="کپی"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setFullscreen((f) => !f)}
            className="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white"
            title={fullscreen ? 'خروج' : 'تمام صفحه'}
          >
            {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Container - حتماً باید LTR باشد تا تایپ و کلیک کار کند */}
      <div className="flex-1 min-h-0 relative" dir="ltr">
        <Editor
          height="100%"
          width="100%"
          language={language}
          value={value}
          onChange={(v) => onChange(v || '')}
          theme="vs-dark"
          loading={
            <div className="flex items-center justify-center h-full text-neutral-400 text-xs gap-2 bg-neutral-950">
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span>در حال بارگذاری ادیتور...</span>
            </div>
          }
          options={{
            fontSize: 13,
            fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
            minimap: { enabled: false },
            wordWrap: wrap ? 'on' : 'off',
            scrollBeyondLastLine: false,
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
          }}
        />
      </div>
    </div>
  );
}