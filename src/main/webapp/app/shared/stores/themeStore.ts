import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const applyTheme = (t: Theme) => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', t === 'dark');
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light' as Theme,
      setTheme(t: Theme) {
        applyTheme(t);
        set({ theme: t });
      },
      toggle() {
        const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        set({ theme: next });
      },
    }),
    {
      name: 'propsight.theme',
      onRehydrateStorage: () => state => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);

export const useTheme = () => useThemeStore(s => s.theme);
