import { useSyncExternalStore } from 'react';
import { Estimation } from '../../types';
import { MOCK_AVIS_VALEUR } from '../../_mocks/avisValeur';

let store: Estimation[] = [...MOCK_AVIS_VALEUR];
const listeners = new Set<() => void>();

function emit() {
  store = [...store];
  listeners.forEach(l => l());
}

export const avisStore = {
  getAll: () => store,
  get: (id: string) => store.find(a => a.id === id),
  add(avis: Estimation) {
    store = [avis, ...store];
    emit();
  },
  update(id: string, patch: Partial<Estimation> | ((prev: Estimation) => Estimation)) {
    store = store.map(a => {
      if (a.id !== id) return a;
      const next = typeof patch === 'function' ? patch(a) : { ...a, ...patch };
      return { ...next, updated_at: new Date().toISOString() };
    });
    emit();
  },
  remove(id: string) {
    store = store.filter(a => a.id !== id);
    emit();
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

export function useAvisList(): Estimation[] {
  return useSyncExternalStore(avisStore.subscribe, avisStore.getAll, avisStore.getAll);
}

export function useAvis(id: string | undefined): Estimation | undefined {
  return useSyncExternalStore(
    avisStore.subscribe,
    () => (id ? avisStore.get(id) : undefined),
    () => undefined,
  );
}
