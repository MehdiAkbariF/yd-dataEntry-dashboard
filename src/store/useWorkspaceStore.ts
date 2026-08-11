import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SplitModeType = 'none' | 'internal' | 'external';

interface WorkspaceState {
  splitMode: SplitModeType;
  internalUrl: string;
  externalUrl: string;
  splitRatio: number;
  setSplitMode: (mode: SplitModeType) => void;
  setInternalUrl: (url: string) => void;
  setExternalUrl: (url: string) => void;
  setSplitRatio: (ratio: number) => void;
  closeSplit: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      splitMode: 'none',
      internalUrl: '/products',
      externalUrl: 'https://www.google.com',
      splitRatio: 50,

      setSplitMode: (mode) => set({ splitMode: mode }),
      setInternalUrl: (url) => set({ internalUrl: url, splitMode: 'internal' }),
      setExternalUrl: (url) => set({ externalUrl: url, splitMode: 'external' }),
      setSplitRatio: (ratio) => set({ splitRatio: ratio }),
      closeSplit: () => set({ splitMode: 'none' }),
    }),
    {
      name: 'yadakchi-workspace-v3',
    }
  )
);