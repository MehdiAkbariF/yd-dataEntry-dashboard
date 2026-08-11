'use client';

import { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { Link as TiptapLink } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Youtube } from '@tiptap/extension-youtube';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import {TextStyle} from '@tiptap/extension-text-style';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import { useScratchpadStore } from '@/store/useScratchpadStore';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3, Heading4,
  AlignRight, AlignCenter, AlignLeft, AlignJustify, List, ListOrdered, ListChecks, Table as TableIcon,
  ImageIcon, Link as LinkIcon, Undo, Redo, Eraser, Maximize2, Minimize2, StickyNote, Highlighter,
  Quote, Minus, Subscript as SubIcon, Superscript as SuperIcon, Video, CodeXml, Copy, Check, Upload,
  Palette
} from 'lucide-react';
import clsx from 'clsx';

interface ProEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const PRESET_COLORS = [
  '#ffffff', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'
];

export default function ProEditor({ value, onChange, placeholder = 'شروع به نوشتن محتوا کنید...' }: ProEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHtmlInspector, setShowHtmlInspector] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { stagedValue } = useScratchpadStore();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TiptapImage.configure({ inline: true, allowBase64: true }),
      TiptapLink.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Youtube.configure({ controls: true }),
      CharacterCount,
      Placeholder.configure({ placeholder }),
      BubbleMenu,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setHtmlCode(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none text-xs leading-relaxed text-neutral-100',
      },
    },
  });

  if (!editor) return null;

  const chain = () => editor.chain().focus() as any;

  // آپلود عکس از کامپیوتر
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (base64Url) {
          chain().setImage({ src: base64Url }).run();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageUrl = () => {
    const url = window.prompt('آدرس اینترنتی تصویر (Image URL) را وارد کنید:');
    if (url) {
      chain().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('آدرس لینک ویدیو (YouTube/Embed URL) را وارد کنید:');
    if (url) {
      chain().setYoutubeVideo({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('آدرس اینترنتی لینک (URL) را وارد کنید:');
    if (url) {
      chain().setLink({ href: url, target: '_blank' }).run();
    }
  };

  const handlePasteStagedNote = () => {
    if (stagedValue) {
      chain().insertContent(stagedValue).run();
    } else {
      alert('هیچ متنی از دفترچه کپی نشده است.');
    }
  };

  const handleCopyHtml = () => {
    const currentHtml = editor.getHTML();
    navigator.clipboard.writeText(currentHtml);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      className={clsx(
        'rounded-2xl border border-neutral-800 bg-neutral-950 transition-all overflow-hidden flex flex-col',
        isFullscreen && 'fixed inset-0 z-[999] rounded-none border-none h-screen w-screen'
      )}
    >
      {/* 🟢 ۱. نوار ابزار اصلی (Toolbar) */}
      <div className="flex flex-wrap items-center gap-1 border-b border-neutral-800 bg-neutral-900/90 p-2 backdrop-blur-md">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-l border-neutral-800 pr-1 pl-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-30"
            title="بازگشت (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-30"
            title="جلو (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        {/* فرمت فونت */}
        <div className="flex items-center gap-0.5 border-l border-neutral-800 pr-1 pl-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('bold') && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="ضخیم (Bold)"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('italic') && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="مورب (Italic)"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => chain().toggleUnderline().run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('underline') && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="خط زیرین (Underline)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('strike') && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="خط روی متن (Strike)"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          {/* پالت رنگ متن */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              title="رنگ متن"
            >
              <Palette className="h-4 w-4" />
            </button>
            {showColorPicker && (
              <div className="absolute right-0 top-full z-50 mt-1 flex gap-1 rounded-xl border border-neutral-800 bg-neutral-900 p-2 shadow-xl">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      chain().setColor(c).run();
                      setShowColorPicker(false);
                    }}
                    className="h-5 w-5 rounded-full border border-neutral-700 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* هایلایت */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHighlightPicker(!showHighlightPicker)}
              className={clsx(
                'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
                editor.isActive('highlight') && 'bg-amber-500/20 text-amber-400 font-bold'
              )}
              title="هایلایت متن"
            >
              <Highlighter className="h-4 w-4" />
            </button>
            {showHighlightPicker && (
              <div className="absolute right-0 top-full z-50 mt-1 flex gap-1 rounded-xl border border-neutral-800 bg-neutral-900 p-2 shadow-xl">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      chain().toggleHighlight({ color: c }).run();
                      setShowHighlightPicker(false);
                    }}
                    className="h-5 w-5 rounded-full border border-neutral-700 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => chain().toggleSubscript().run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('subscript') && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="زیرنویس (Subscript)"
          >
            <SubIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => chain().toggleSuperscript().run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('superscript') && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="بالانویس (Superscript)"
          >
            <SuperIcon className="h-4 w-4" />
          </button>
        </div>

        {/* تیترها (H1 تا H4) */}
        <div className="flex items-center gap-0.5 border-l border-neutral-800 pr-1 pl-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('heading', { level: 1 }) && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="تیتر ۱ (H1)"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('heading', { level: 2 }) && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="تیتر ۲ (H2)"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('heading', { level: 3 }) && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="تیتر ۳ (H3)"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('heading', { level: 4 }) && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="تیتر ۴ (H4)"
          >
            <Heading4 className="h-4 w-4" />
          </button>
        </div>

        {/* تراز متن */}
        <div className="flex items-center gap-0.5 border-l border-neutral-800 pr-1 pl-1">
          <button
            type="button"
            onClick={() => chain().setTextAlign('right').run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive({ textAlign: 'right' }) && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="راست‌چین (فارسی)"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => chain().setTextAlign('center').run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive({ textAlign: 'center' }) && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="وسط‌چین"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => chain().setTextAlign('left').run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive({ textAlign: 'left' }) && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="چپ‌چین (انگلیسی)"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => chain().setTextAlign('justify').run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive({ textAlign: 'justify' }) && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="تراز کامل (Justify)"
          >
            <AlignJustify className="h-4 w-4" />
          </button>
        </div>

        {/* لیست‌ها و عناصر ساختاری */}
        <div className="flex items-center gap-0.5 border-l border-neutral-800 pr-1 pl-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('bulletList') && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="لیست نقطه‌ای"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('orderedList') && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="لیست عددی"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => chain().toggleTaskList().run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('taskList') && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="چک‌لیست تعاملی"
          >
            <ListChecks className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('blockquote') && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="کادر نقل‌قول / نکته"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            title="خط جداکننده افقی"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        {/* درج رسانه، جدول و لینک */}
        <div className="flex items-center gap-0.5 border-l border-neutral-800 pr-1 pl-1">
          <button
            type="button"
            onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            title="درج جدول ۳x۳"
          >
            <TableIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            title="آپلود تصویر از کامپیوتر"
          >
            <Upload className="h-4 w-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={addImageUrl}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            title="درج تصویر با لینک URL"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={addYoutubeVideo}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            title="درج ویدیوی یوتیوب/آپارات"
          >
            <Video className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={addLink}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white',
              editor.isActive('link') && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="درج لینک"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-500/10 hover:text-red-400"
            title="پاکسازی تمام فرمت‌ها"
          >
            <Eraser className="h-4 w-4" />
          </button>
        </div>

        {/* ابزارهای اختصاصی Data Entry */}
        <div className="flex items-center gap-1.5 mr-auto">
          {stagedValue && (
            <button
              type="button"
              onClick={handlePasteStagedNote}
              className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-400 hover:bg-amber-500/20 transition-all"
              title="Paste متنی که از دفترچه کپی شده"
            >
              <StickyNote className="h-3.5 w-3.5" />
              <span>Paste از دفترچه</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowHtmlInspector(!showHtmlInspector)}
            className={clsx(
              'rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all',
              showHtmlInspector && 'bg-amber-500/20 text-amber-400 font-bold'
            )}
            title="سورس کد HTML"
          >
            <CodeXml className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
            title={isFullscreen ? 'خروج از تمام صفحه' : 'حالت تمام صفحه (تمرکز)'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 🟢 ۲. نوار ابزار مدیریت جدول (فقط در صورت انتخاب جدول) */}
      {editor.isActive('table') && (
        <div className="flex flex-wrap items-center gap-2 border-b border-amber-500/20 bg-amber-500/10 p-2 text-xs text-amber-400">
          <span className="font-bold text-[11px] border-l border-amber-500/30 pl-2">مدیریت جدول:</span>
          <button
            type="button"
            onClick={() => chain().addColumnAfter().run()}
            className="rounded bg-neutral-900 px-2 py-0.5 text-[10px] hover:bg-neutral-800"
          >
            + ستون بعد
          </button>
          <button
            type="button"
            onClick={() => chain().deleteColumn().run()}
            className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] text-red-400 hover:bg-red-500/30"
          >
            حذف ستون
          </button>
          <button
            type="button"
            onClick={() => chain().addRowAfter().run()}
            className="rounded bg-neutral-900 px-2 py-0.5 text-[10px] hover:bg-neutral-800"
          >
            + سطر بعد
          </button>
          <button
            type="button"
            onClick={() => chain().deleteRow().run()}
            className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] text-red-400 hover:bg-red-500/30"
          >
            حذف سطر
          </button>
          <button
            type="button"
            onClick={() => chain().mergeCells().run()}
            className="rounded bg-neutral-900 px-2 py-0.5 text-[10px] hover:bg-neutral-800"
          >
            ادغام سلول‌ها
          </button>
          <button
            type="button"
            onClick={() => chain().splitCell().run()}
            className="rounded bg-neutral-900 px-2 py-0.5 text-[10px] hover:bg-neutral-800"
          >
            تفکیک سلول
          </button>
          <button
            type="button"
            onClick={() => chain().deleteTable().run()}
            className="rounded bg-red-600 text-white px-2 py-0.5 text-[10px] hover:bg-red-700 mr-auto font-bold"
          >
            حذف کامل جدول
          </button>
        </div>
      )}

      {/* 🟢 ۳. نمایشگر کد HTML یا محیط تایپ */}
      {showHtmlInspector ? (
        <div className="flex-1 bg-neutral-950 p-4 font-mono text-xs text-emerald-400 dir-ltr text-left overflow-y-auto min-h-[350px]">
          <textarea
            value={htmlCode || editor.getHTML()}
            onChange={(e) => {
              setHtmlCode(e.target.value);
              editor.commands.setContent(e.target.value);
            }}
            className="w-full h-full min-h-[320px] bg-transparent text-emerald-400 focus:outline-none resize-none font-mono text-xs leading-relaxed"
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} />
        </div>
      )}

      {/* 🟢 ۴. فوتر ادیتور: آمار کلمات و کاراکترها */}
      <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900/50 px-4 py-2 text-[10px] text-neutral-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyHtml}
            className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-1 text-neutral-300 hover:bg-neutral-700 transition-all font-mono"
          >
            {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copiedCode ? 'کپی شد!' : 'کپی سورس HTML'}</span>
          </button>
        </div>

        <div className="flex items-center gap-4 font-mono dir-ltr">
          <span>{editor.storage.characterCount?.words?.() || editor.getText().split(/\s+/).filter(Boolean).length} کلمه</span>
          <span>{editor.getText().length} کاراکتر</span>
        </div>
      </div>
    </div>
  );
}