import { create } from 'zustand';

interface AIDrawerState {
  isOpen: boolean;
  context: string | null;
  open: (context?: string) => void;
  close: () => void;
}

export const useAIDrawerStore = create<AIDrawerState>(set => ({
  isOpen: false,
  context: null,
  open: context => set({ isOpen: true, context: context ?? null }),
  close: () => set({ isOpen: false, context: null }),
}));
