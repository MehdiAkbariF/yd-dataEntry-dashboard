'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { BlogPostCommentListItem } from '../types';
import { Reply, Loader2, X, Send } from 'lucide-react';
import { toast } from 'sonner';

interface BlogCommentReplyModalProps {
  isOpen: boolean;
  comment: BlogPostCommentListItem | null;
  isLoading: boolean;
  onSendReply: (commentId: string, replyText: string) => void;
  onClose: () => void;
}

export default function BlogCommentReplyModal({
  isOpen,
  comment,
  isLoading,
  onSendReply,
  onClose,
}: BlogCommentReplyModalProps) {
  const [replyText, setReplyText] = useState('');

  if (!isOpen || !comment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error('متن پاسخ نمی‌تواند خالی باشد.');
      return;
    }
    onSendReply(comment.id, replyText.trim());
    setReplyText('');
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Reply className="h-4 w-4" />
            <span>پاسخ به دیدگاه کاربر</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-1">
          <span className="text-xs font-bold text-neutral-300">{comment.commentCreator}:</span>
          <p className="text-xs text-neutral-400 leading-relaxed">{comment.comment}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              متن پاسخ شما (به عنوان کارشناس یدک‌چی) *
            </label>
            <textarea
              rows={4}
              placeholder="پاسخ خود را بنویسید..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none leading-relaxed"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>در حال ارسال...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>ارسال پاسخ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}