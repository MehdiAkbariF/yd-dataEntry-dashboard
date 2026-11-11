'use client';

import { createPortal } from 'react-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen, title, description, isLoading, onConfirm, onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center px-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-xl border border-default bg-surface-3 p-6 shadow-token-xl z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[color:var(--danger-subtle)] text-[color:var(--danger-fg)]">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-primary">{title}</h3>
        </div>

        <p className="text-sm leading-relaxed text-secondary">{description}</p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} disabled={isLoading} className="btn btn-secondary">
            انصراف
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="btn btn-danger">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>حذف قطعی</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}