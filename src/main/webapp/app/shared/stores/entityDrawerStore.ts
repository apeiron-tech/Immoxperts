import { create } from 'zustand';

export type EntityDrawerType =
  | 'lead'
  | 'bien'
  | 'action'
  | 'estimation'
  | 'rapport'
  | 'signal'
  | 'opportunite'
  | 'dossier'
  | 'alerte'
  | 'notification'
  | 'zone'
  | 'collaborateur'
  | 'rdv';

interface EntityDrawerState {
  openType: EntityDrawerType | null;
  openId: string | null;
  open: (type: EntityDrawerType, id: string) => void;
  close: () => void;
}

export const useEntityDrawerStore = create<EntityDrawerState>(set => ({
  openType: null,
  openId: null,
  open: (type, id) => set({ openType: type, openId: id }),
  close: () => set({ openType: null, openId: null }),
}));
