import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Zone {
  id: string;
  label: string;
  type: 'city' | 'district' | 'custom';
  geometry?: unknown;
}

interface ZoneState {
  current: Zone | null;
  recents: Zone[];
  setZone: (z: Zone) => void;
  clearZone: () => void;
}

export const useZoneStore = create<ZoneState>()(
  persist(
    set => ({
      current: null,
      recents: [],
      setZone: z =>
        set(s => ({
          current: z,
          recents: [z, ...s.recents.filter(r => r.id !== z.id)].slice(0, 5),
        })),
      clearZone: () => set({ current: null }),
    }),
    { name: 'propsight.zone' },
  ),
);

export const useZone = () => useZoneStore(s => s.current);
