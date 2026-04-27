import { useSyncExternalStore } from 'react';
import { Estimation } from '../../types';
import { MOCK_EXPERTISE } from '../../_mocks/expertise';

let store: Estimation[] = [...MOCK_EXPERTISE];
const listeners = new Set<() => void>();

function emit() {
  store = [...store];
  listeners.forEach(l => l());
}

export const expertStore = {
  getAll: () => store,
  get: (id: string) => store.find(a => a.id === id),
  add(rapport: Estimation) {
    store = [rapport, ...store];
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

export function useExpertList(): Estimation[] {
  return useSyncExternalStore(expertStore.subscribe, expertStore.getAll, expertStore.getAll);
}

export function useExpert(id: string | undefined): Estimation | undefined {
  return useSyncExternalStore(
    expertStore.subscribe,
    () => (id ? expertStore.get(id) : undefined),
    () => undefined,
  );
}
