import { create } from 'zustand';
import type {
  AtelierAudience,
  AtelierEnrichmentMode,
  AtelierSpecialMode,
  AtelierTone,
  AtelierTransactionType,
  DataAnchorSnapshot,
  MarketingAsset,
  MarketingAssetType,
  ModuleStatus,
  SourceItem,
} from '../types';

export type AtelierStatus = 'empty' | 'configuring' | 'generating' | 'ready' | 'error';

interface AtelierState {
  status: AtelierStatus;
  draft_id?: string;
  source?: SourceItem;
  source_label?: string;

  transaction_type: AtelierTransactionType;
  audience: AtelierAudience;
  tone: AtelierTone;
  template_ids: string[];
  special_mode?: AtelierSpecialMode;

  snapshot?: DataAnchorSnapshot;
  modules: ModuleStatus;
  enrichment_mode: AtelierEnrichmentMode;
  data_points_used: string[];

  outputs: MarketingAsset[];
  active_asset_type: MarketingAssetType;
  generation_progress: number;
  generation_step_label: string;
  generation_error?: string;

  generated_at?: string;
  auto_saved_at?: string;

  variantsModalAssetId?: string;

  setSource: (source: SourceItem | undefined, label?: string) => void;
  setTransactionType: (t: AtelierTransactionType) => void;
  setAudience: (a: AtelierAudience) => void;
  setTone: (t: AtelierTone) => void;
  toggleTemplate: (id: string) => void;
  setSpecialMode: (m: AtelierSpecialMode | undefined) => void;
  setSnapshot: (s: DataAnchorSnapshot | undefined) => void;
  setModules: (m: ModuleStatus) => void;
  setEnrichment: (mode: AtelierEnrichmentMode, used: string[]) => void;
  startGeneration: (draftId: string) => void;
  setProgress: (percent: number, label: string) => void;
  setOutputs: (assets: MarketingAsset[]) => void;
  appendOutput: (asset: MarketingAsset) => void;
  patchOutput: (assetId: string, patch: Partial<MarketingAsset>) => void;
  finishGeneration: () => void;
  failGeneration: (error: string) => void;
  setActiveAssetType: (t: MarketingAssetType) => void;
  openVariants: (assetId: string) => void;
  closeVariants: () => void;
  reset: () => void;
}

const DEFAULT_MODULES: ModuleStatus = {
  observatoire: 'active',
  estimation: 'active',
  leads: 'active',
  veille: 'active',
  investissement: 'active',
};

export const useAtelierStore = create<AtelierState>(set => ({
  status: 'empty',
  transaction_type: 'vente',
  audience: 'acquereur',
  tone: 'warm',
  template_ids: ['tpl_001'],
  special_mode: undefined,
  modules: DEFAULT_MODULES,
  enrichment_mode: 'premium',
  data_points_used: [],
  outputs: [],
  active_asset_type: 'titre_court',
  generation_progress: 0,
  generation_step_label: '',

  setSource: (source, label) =>
    set(() => ({
      source,
      source_label: label ?? source?.label,
      status: source ? 'configuring' : 'empty',
    })),
  setTransactionType: t => set({ transaction_type: t }),
  setAudience: a => set({ audience: a }),
  setTone: t => set({ tone: t }),
  toggleTemplate: id =>
    set(s => ({
      template_ids: s.template_ids.includes(id)
        ? s.template_ids.filter(x => x !== id)
        : [...s.template_ids, id],
    })),
  setSpecialMode: m => set({ special_mode: m }),
  setSnapshot: s => set({ snapshot: s }),
  setModules: m => set({ modules: m }),
  setEnrichment: (mode, used) =>
    set({ enrichment_mode: mode, data_points_used: used }),

  startGeneration: draftId =>
    set({
      status: 'generating',
      draft_id: draftId,
      outputs: [],
      generation_progress: 0,
      generation_step_label: 'Récupération des datapoints…',
      generation_error: undefined,
    }),
  setProgress: (percent, label) =>
    set({ generation_progress: percent, generation_step_label: label }),
  setOutputs: assets => set({ outputs: assets }),
  appendOutput: asset =>
    set(s => ({
      outputs: s.outputs.some(o => o.asset_id === asset.asset_id)
        ? s.outputs.map(o => (o.asset_id === asset.asset_id ? asset : o))
        : [...s.outputs, asset],
    })),
  patchOutput: (assetId, patch) =>
    set(s => ({
      outputs: s.outputs.map(o =>
        o.asset_id === assetId
          ? { ...o, ...patch, updated_at: new Date().toISOString() }
          : o,
      ),
      auto_saved_at: new Date().toISOString(),
    })),
  finishGeneration: () =>
    set({
      status: 'ready',
      generation_progress: 100,
      generation_step_label: 'Kit prêt',
      generated_at: new Date().toISOString(),
    }),
  failGeneration: error =>
    set({ status: 'error', generation_error: error, generation_progress: 0 }),

  setActiveAssetType: t => set({ active_asset_type: t }),
  openVariants: assetId => set({ variantsModalAssetId: assetId }),
  closeVariants: () => set({ variantsModalAssetId: undefined }),

  reset: () =>
    set({
      status: 'empty',
      draft_id: undefined,
      source: undefined,
      source_label: undefined,
      outputs: [],
      generation_progress: 0,
      generation_step_label: '',
      generation_error: undefined,
      generated_at: undefined,
      auto_saved_at: undefined,
      variantsModalAssetId: undefined,
      special_mode: undefined,
    }),
}));
