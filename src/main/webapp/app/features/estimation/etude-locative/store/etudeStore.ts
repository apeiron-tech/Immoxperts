import { useSyncExternalStore } from 'react';
import { Estimation } from '../../types';
import { MOCK_ETUDES_LOCATIVES } from '../../_mocks/etudesLocatives';

let store: Estimation[] = [...MOCK_ETUDES_LOCATIVES];
const listeners = new Set<() => void>();

function emit() {
  store = [...store];
  listeners.forEach(l => l());
}

export const etudeStore = {
  getAll: () => store,
  get: (id: string) => store.find(a => a.id === id),
  add(etude: Estimation) {
    store = [etude, ...store];
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

export function useEtudesList(): Estimation[] {
  return useSyncExternalStore(etudeStore.subscribe, etudeStore.getAll, etudeStore.getAll);
}

export function useEtude(id: string | undefined): Estimation | undefined {
  return useSyncExternalStore(
    etudeStore.subscribe,
    () => (id ? etudeStore.get(id) : undefined),
    () => undefined,
  );
}
