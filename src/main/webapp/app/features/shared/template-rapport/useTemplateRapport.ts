import { useCallback, useState } from 'react';
import { BlocConfig, BlocId, RapportConfig, RapportType, StyleRapport } from './types';
import { getDefaultConfig } from './BlocsRegistry';

export type TemplateMode = 'edit' | 'preview';

export interface UseTemplateRapportOptions {
  rapportType: RapportType;
  initialConfig?: RapportConfig;
}

function buildInitialConfig(rapportType: RapportType, initial?: RapportConfig): RapportConfig {
  if (initial) return initial;
  return {
    rapportType,
    style: 'style_1',
    blocs: getDefaultConfig(rapportType),
    metadata: {},
  };
}

export function useTemplateRapport(options: UseTemplateRapportOptions) {
  const [config, setConfig] = useState<RapportConfig>(() => buildInitialConfig(options.rapportType, options.initialConfig));
  const [mode, setMode] = useState<TemplateMode>('edit');
  const [editingBlocId, setEditingBlocId] = useState<BlocId | null>(null);
  const [showPanneau, setShowPanneau] = useState(true);

  const toggleBloc = useCallback((id: BlocId) => {
    setConfig(prev => ({
      ...prev,
      blocs: prev.blocs.map(b => (b.id === id ? { ...b, active: !b.active } : b)),
    }));
  }, []);

  const reorderBlocs = useCallback((sourceId: BlocId, targetId: BlocId) => {
    setConfig(prev => {
      const sorted = [...prev.blocs].sort((a, b) => a.order - b.order);
      const sourceIdx = sorted.findIndex(b => b.id === sourceId);
      const targetIdx = sorted.findIndex(b => b.id === targetId);
      if (sourceIdx === -1 || targetIdx === -1) return prev;
      const [moved] = sorted.splice(sourceIdx, 1);
      sorted.splice(targetIdx, 0, moved);
      const reindexed = sorted.map((b, i) => ({ ...b, order: i }));
      return { ...prev, blocs: reindexed };
    });
  }, []);

  const updateBlocContent = useCallback((id: BlocId, content: Record<string, unknown>) => {
    setConfig(prev => ({
      ...prev,
      blocs: prev.blocs.map(b => (b.id === id ? { ...b, customContent: { ...(b.customContent || {}), ...content } } : b)),
    }));
  }, []);

  const setStyle = useCallback((style: StyleRapport) => {
    setConfig(prev => ({ ...prev, style }));
  }, []);

  const openEditBloc = useCallback((id: BlocId) => setEditingBlocId(id), []);
  const closeEditBloc = useCallback(() => setEditingBlocId(null), []);

  const resetToDefault = useCallback(() => {
    setConfig(prev => ({ ...prev, blocs: getDefaultConfig(prev.rapportType) }));
  }, []);

  const saveAsTemplate = useCallback(() => {
    console.warn('[TemplateRapport] saveAsTemplate (mock démo)', config);
  }, [config]);

  const exportPDF = useCallback(() => {
    setMode('preview');
    setTimeout(() => window.print(), 100);
  }, []);

  const togglePanneau = useCallback(() => setShowPanneau(p => !p), []);

  const getBlocConfig = useCallback((id: BlocId): BlocConfig | undefined => config.blocs.find(b => b.id === id), [config]);

  return {
    config,
    mode,
    editingBlocId,
    showPanneau,
    setMode,
    actions: {
      toggleBloc,
      reorderBlocs,
      updateBlocContent,
      setStyle,
      openEditBloc,
      closeEditBloc,
      resetToDefault,
      saveAsTemplate,
      exportPDF,
      togglePanneau,
    },
    getBlocConfig,
  };
}
