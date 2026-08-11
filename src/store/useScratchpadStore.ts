import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'id' | 'json';
  createdAt: number;
}

interface ScratchpadState {
  isOpen: boolean;
  notes: NoteItem[];
  stagedValue: string | null; // مقداری که آماده‌ی Paste شدن درون فرم‌هاست
  toggleOpen: () => void;
  addNote: (title: string, content: string, type?: NoteItem['type']) => void;
  removeNote: (id: string) => void;
  clearAll: () => void;
  setStagedValue: (value: string | null) => void;
}

export const useScratchpadStore = create<ScratchpadState>()(
  persist(
    (set) => ({
      isOpen: false,
      notes: [
        {
          id: 'default-1',
          title: 'الگوی ساختار استاندارد نام کالا',
          content: 'نام کالا + برند + مدل + مناسب برای',
          type: 'text',
          createdAt: Date.now(),
        },
      ],
      stagedValue: null,

      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

      addNote: (title, content, type = 'text') =>
        set((state) => ({
          notes: [
            { id: Date.now().toString(), title, content, type, createdAt: Date.now() },
            ...state.notes,
          ],
        })),

      removeNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      clearAll: () => set({ notes: [] }),

      setStagedValue: (value) => set({ stagedValue: value }),
    }),
    {
      name: 'yadakchi-scratchpad-storage', // ذخیره خودکار در LocalStorage
    }
  )
);