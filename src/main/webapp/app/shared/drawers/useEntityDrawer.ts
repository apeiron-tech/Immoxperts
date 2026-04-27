import { useEntityDrawerStore, type EntityDrawerType } from 'app/shared/stores/entityDrawerStore';

export const useEntityDrawer = () => {
  const open = useEntityDrawerStore(s => s.open);
  const close = useEntityDrawerStore(s => s.close);
  const openType = useEntityDrawerStore(s => s.openType);
  const openId = useEntityDrawerStore(s => s.openId);
  return { open, close, openType, openId };
};

export type { EntityDrawerType };
