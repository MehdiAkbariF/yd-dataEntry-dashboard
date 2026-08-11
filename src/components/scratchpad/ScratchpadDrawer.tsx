'use client';

import { useState } from 'react';
import { useScratchpadStore } from '@/store/useScratchpadStore';
import { Notebook, X, Plus, Copy, Trash2, Check, StickyNote, FileCode, CheckCircle2 } from 'lucide-react';

export default function ScratchpadDrawer() {
  const { isOpen, toggleOpen, notes, addNote, removeNote, setStagedValue } = useScratchpadStore();
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    addNote(newTitle || 'یادداشت بدون عنوان', newContent);
    setNewTitle('');
    setNewContent('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setStagedValue(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* دکمه شناور باز کردن دفترچه در گوشه پایین سمت چپ */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-amber-500 px-4 py-3 text-neutral-950 shadow-xl shadow-amber-500/20 hover:bg-amber-400 font-bold transition-all active:scale-95"
      >
        <Notebook className="h-5 w-5" />
        <span className="text-xs">دفترچه همراه</span>
        {notes.length > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-[10px] text-amber-400 font-extrabold">
            {notes.length}
          </span>
        )}
      </button>

      {/* پنل کشویی کشیده از سمت چپ */}
      {isOpen && (
        <div className="fixed inset-y-0 left-0 z-50 flex w-full max-w-md flex-col border-r border-neutral-800 bg-neutral-900/95 p-6 shadow-2xl backdrop-blur-2xl transition-all">
          {/* هدر دفترچه */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2 text-amber-500">
              <StickyNote className="h-5 w-5" />
              <h2 className="font-bold text-white text-base">دفترچه یادداشت Data Entry</h2>
            </div>
            <button
              onClick={toggleOpen}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* فرم افزودن یادداشت جدید */}
          <form onSubmit={handleCreateNote} className="mt-4 space-y-3 rounded-xl border border-neutral-800 bg-neutral-950 p-3">
            <input
              type="text"
              placeholder="عنوان (مثلاً: شناسه برندهای پرکاربرد)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
            />
            <textarea
              rows={2}
              placeholder="متن، شناسه، یا توضیحات الگو..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none resize-none"
            />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-neutral-800 py-2 text-xs font-semibold text-amber-400 hover:bg-neutral-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>افزودن به دفترچه</span>
            </button>
          </form>

          {/* لیست یادداشت‌های ذخیره‌شده */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
            {notes.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-neutral-500 text-xs gap-2">
                <FileCode className="h-8 w-8 opacity-40" />
                <span>دفترچه شما خالی است</span>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="group relative rounded-xl border border-neutral-800 bg-neutral-950/70 p-3.5 hover:border-neutral-700 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-amber-400">{note.title}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(note.id, note.content)}
                        title="کپی متن"
                        className="rounded-md p-1 text-neutral-400 hover:bg-amber-500/10 hover:text-amber-400 transition-all"
                      >
                        {copiedId === note.id ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => removeNote(note.id)}
                        title="حذف"
                        className="rounded-md p-1 text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-neutral-300 font-mono dir-ltr text-right select-all">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}