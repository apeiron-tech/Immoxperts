import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import StudioLayout from '../layout/StudioLayout';
import AtelierHeader from './AtelierHeader';
import AtelierInputsPanel from './AtelierInputsPanel';
import AtelierPreviewPanel from './AtelierPreviewPanel';
import AtelierContextSidebar from './AtelierContextSidebar';
import SourceSelectorModal from '../source-modal/SourceSelectorModal';
import OutputVariantsModal from './outputs/OutputVariantsModal';
import PlanMarketingWorkspace from '../plan-marketing-adv/PlanMarketingWorkspace';
import { useAtelierStore } from '../store/atelierStore';
import { computeEnrichmentMode } from '../utils/helpers';
import { MOCK_BIENS_SOURCES } from '../_mocks/sources';
import { MOCK_SNAPSHOT } from '../_mocks/snapshot';
import { useViewportTooSmall } from '../hooks/useViewportTooSmall';

const AtelierPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const tooSmall = useViewportTooSmall();

  const setSource = useAtelierStore(s => s.setSource);
  const setSnapshot = useAtelierStore(s => s.setSnapshot);
  const setEnrichment = useAtelierStore(s => s.setEnrichment);
  const setSpecialMode = useAtelierStore(s => s.setSpecialMode);
  const setActiveAssetType = useAtelierStore(s => s.setActiveAssetType);
  const setTone = useAtelierStore(s => s.setTone);
  const status = useAtelierStore(s => s.status);
  const snapshot = useAtelierStore(s => s.snapshot);
  const modules = useAtelierStore(s => s.modules);
  const outputs = useAtelierStore(s => s.outputs);
  const variantsAssetId = useAtelierStore(s => s.variantsModalAssetId);
  const specialMode = useAtelierStore(s => s.special_mode);

  useEffect(() => {
    const bien = searchParams.get('bien');
    const estimation = searchParams.get('estimation');
    const type = searchParams.get('type');
    const draft = searchParams.get('draft');

    if (estimation || type === 'plan_marketing_adv') {
      setSource(
        { id: estimation || 'est_001', type: 'estimation', label: 'AdV en cours — T3 Paris 15e', sublabel: 'AVM 718 000 €', avm_estimation: 718000 },
        'AdV en cours — T3 Paris 15e',
      );
      setSnapshot(MOCK_SNAPSHOT);
      setSpecialMode('plan_marketing_adv');
      setActiveAssetType('plan_marketing_adv');
      return;
    }
    if (bien) {
      const found = MOCK_BIENS_SOURCES.find(b => b.id === bien) ?? MOCK_BIENS_SOURCES[0];
      setSource(found, found.label);
      setSnapshot(MOCK_SNAPSHOT);
      if (found.mandat_type === 'exclusif') setTone('luxury');
      return;
    }
    if (draft) {
      const found = MOCK_BIENS_SOURCES[0];
      setSource(found, found.label);
      setSnapshot(MOCK_SNAPSHOT);
    }
  }, []);

  useEffect(() => {
    const { mode, usedKeys } = computeEnrichmentMode(modules, snapshot);
    setEnrichment(mode, usedKeys);
  }, [modules, snapshot, setEnrichment]);

  useEffect(() => {
    if (outputs.length > 0 && status === 'ready') {
      const firstAvailable = outputs[0].asset_type;
      // only switch if the active type isn't part of generated outputs
      const stillExists = outputs.some(o => o.asset_type === useAtelierStore.getState().active_asset_type);
      if (!stillExists) setActiveAssetType(firstAvailable);
    }
  }, [outputs, status, setActiveAssetType]);

  if (tooSmall) {
    return (
      <StudioLayout title="Atelier" breadcrumbCurrent="Atelier" showBreadcrumb={false}>
        <ViewportTooSmall />
      </StudioLayout>
    );
  }

  return (
    <StudioLayout title="Atelier" breadcrumbCurrent="Atelier" showBreadcrumb={false}>
      <div className="h-full flex flex-col">
        <AtelierHeader
          onSaveDraft={() => undefined}
          onSaveKit={() => undefined}
          onOpenVariants={() => {
            const active = outputs.find(o => o.asset_type === useAtelierStore.getState().active_asset_type);
            if (active) useAtelierStore.getState().openVariants(active.asset_id);
          }}
        />
        <div className="flex-1 min-h-0 flex">
          {specialMode === 'plan_marketing_adv' ? (
            <PlanMarketingWorkspace onChangeSource={() => setSourceModalOpen(true)} />
          ) : (
            <>
              <AtelierInputsPanel onChangeSource={() => setSourceModalOpen(true)} />
              <AtelierPreviewPanel onChooseSource={() => setSourceModalOpen(true)} />
              <AtelierContextSidebar />
            </>
          )}
        </div>
      </div>

      <SourceSelectorModal open={sourceModalOpen} onClose={() => setSourceModalOpen(false)} />
      {variantsAssetId && <OutputVariantsModal />}
    </StudioLayout>
  );
};

const ViewportTooSmall: React.FC = () => (
  <div className="h-full flex items-center justify-center p-8">
    <div className="text-center max-w-md">
      <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-500 inline-flex items-center justify-center mb-3">
        <Monitor size={22} />
      </div>
      <h2 className="text-[16px] font-semibold text-neutral-900 mb-1">
        Studio Marketing Atelier nécessite un écran plus grand
      </h2>
      <p className="text-[13px] text-neutral-600">
        Travaillez sur un ordinateur (1280px minimum) pour accéder au workspace 3 panneaux.
      </p>
    </div>
  </div>
);

export default AtelierPage;
