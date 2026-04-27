import React, { useMemo, useState } from 'react';
import { Building2, FileEdit, MapPin, Newspaper, Search, Sparkles, TrendingUp, X } from 'lucide-react';
import { useAtelierStore } from '../store/atelierStore';
import {
  MOCK_ANNONCES_SOURCES,
  MOCK_BIENS_SOURCES,
  MOCK_ESTIMATIONS_SOURCES,
  MOCK_LEADS_SOURCES,
  MOCK_OPPORTUNITES_SOURCES,
} from '../_mocks/sources';
import { MOCK_SNAPSHOT } from '../_mocks/snapshot';
import type { SourceItem } from '../types';
import { formatEuros } from 'app/features/biens/utils/format';

type TabId = 'biens' | 'annonces' | 'leads' | 'estimations' | 'opportunites' | 'manuel';

interface Tab {
  id: TabId;
  label: string;
  count?: number;
  requiresModule?: 'observatoire' | 'estimation' | 'leads' | 'investissement';
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const SourceSelectorModal: React.FC<Props> = ({ open, onClose }) => {
  const setSource = useAtelierStore(s => s.setSource);
  const setSnapshot = useAtelierStore(s => s.setSnapshot);
  const modules = useAtelierStore(s => s.modules);

  const [activeTab, setActiveTab] = useState<TabId>('biens');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const tabs: Tab[] = useMemo(
    () => [
      { id: 'biens', label: 'Mes biens', count: MOCK_BIENS_SOURCES.length },
      { id: 'annonces', label: 'Annonces marché', count: MOCK_ANNONCES_SOURCES.length },
      { id: 'leads', label: 'Leads vendeurs', count: MOCK_LEADS_SOURCES.length, requiresModule: 'leads' },
      { id: 'estimations', label: 'Estimations', count: MOCK_ESTIMATIONS_SOURCES.length, requiresModule: 'estimation' },
      { id: 'opportunites', label: 'Opportunités invest', count: MOCK_OPPORTUNITES_SOURCES.length, requiresModule: 'investissement' },
      { id: 'manuel', label: 'Saisie manuelle' },
    ],
    [],
  );

  if (!open) return null;

  const items: SourceItem[] = (() => {
    switch (activeTab) {
      case 'biens': return MOCK_BIENS_SOURCES;
      case 'annonces': return MOCK_ANNONCES_SOURCES;
      case 'leads': return MOCK_LEADS_SOURCES;
      case 'estimations': return MOCK_ESTIMATIONS_SOURCES;
      case 'opportunites': return MOCK_OPPORTUNITES_SOURCES;
      default: return [];
    }
  })();

  const filtered = items.filter(i =>
    !search.trim() ||
    i.label.toLowerCase().includes(search.toLowerCase()) ||
    i.sublabel.toLowerCase().includes(search.toLowerCase()),
  );

  const handleConfirm = () => {
    if (activeTab === 'manuel') {
      setSource(
        { id: 'manuel_' + Date.now(), type: 'bien', label: 'Saisie manuelle', sublabel: '', ville: '' },
        'Saisie manuelle',
      );
      setSnapshot(MOCK_SNAPSHOT);
      onClose();
      return;
    }
    const item = filtered.find(i => i.id === selectedId);
    if (!item) return;
    setSource(item, item.label);
    setSnapshot(MOCK_SNAPSHOT);
    onClose();
  };

  const tabIcon = (id: TabId) => {
    switch (id) {
      case 'biens': return <Building2 size={13} />;
      case 'annonces': return <Newspaper size={13} />;
      case 'leads': return <MapPin size={13} />;
      case 'estimations': return <Sparkles size={13} />;
      case 'opportunites': return <TrendingUp size={13} />;
      case 'manuel': return <FileEdit size={13} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-6">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <div className="text-[16px] font-semibold text-neutral-900">
              Choisissez une source pour démarrer
            </div>
            <div className="text-[12px] text-neutral-500">
              L&apos;Atelier injectera automatiquement les datapoints disponibles dans le snapshot.
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800 p-1.5 rounded-md hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-shrink-0 px-5 py-3 border-b border-neutral-100">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un bien, une annonce, un lead…"
              className="w-full pl-9 pr-3 h-9 text-[13px] bg-neutral-50 border border-neutral-200 rounded-md focus:outline-none focus:bg-white focus:border-propsight-300 transition-colors"
            />
          </div>
        </div>

        <div className="flex-shrink-0 px-5 border-b border-neutral-200 flex items-center gap-1 overflow-x-auto">
          {tabs.map(t => {
            const disabled = !!(t.requiresModule && modules[t.requiresModule] !== 'active');
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => !disabled && setActiveTab(t.id)}
                disabled={disabled}
                title={disabled ? `Module ${t.requiresModule} requis` : undefined}
                className={`relative flex items-center gap-1.5 px-3 h-10 text-[12px] font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'text-propsight-700 border-propsight-600'
                    : 'text-neutral-600 border-transparent hover:text-neutral-900'
                } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {tabIcon(t.id)}
                {t.label}
                {t.count != null && (
                  <span
                    className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-propsight-100 text-propsight-700' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
          {activeTab === 'manuel' ? (
            <ManualEntryForm />
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-neutral-500">
              Aucun résultat.
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map(item => {
                const isSelected = selectedId === item.id;
                const price = 'prix' in item ? item.prix : 'avm_estimation' in item ? item.avm_estimation : undefined;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md border text-left transition-colors ${
                      isSelected
                        ? 'bg-propsight-50 border-propsight-300'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
                        isSelected ? 'border-propsight-600 bg-propsight-600' : 'border-neutral-300'
                      }`}
                    >
                      {isSelected && (
                        <span className="block w-1 h-1 m-auto mt-[3px] rounded-full bg-white" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-neutral-900 truncate">
                        {item.label}
                      </div>
                      <div className="text-[11.5px] text-neutral-500 truncate">{item.sublabel}</div>
                    </div>
                    {price != null && (
                      <div className="text-[12px] font-semibold text-neutral-700 flex-shrink-0">
                        {formatEuros(price, true)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 px-5 py-3 border-t border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="text-[11.5px] text-neutral-500">
            {activeTab === 'manuel'
              ? 'Mode Lite — 1 datapoint requis (DVF public).'
              : selectedId
                ? '1 source sélectionnée — prête pour démarrer.'
                : 'Sélectionnez une source pour continuer.'}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-8 px-3 text-[12px] font-medium text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={activeTab !== 'manuel' && !selectedId}
              className="h-8 px-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-white bg-propsight-600 rounded-md hover:bg-propsight-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles size={12} />
              Démarrer l&apos;Atelier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManualEntryForm: React.FC = () => (
  <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto py-2">
    {[
      { label: 'Type de bien', placeholder: 'Appartement / Maison / Terrain' },
      { label: 'Surface (m²)', placeholder: '65' },
      { label: 'Pièces', placeholder: '3' },
      { label: 'Étage / nb étages', placeholder: '4 / 8' },
      { label: 'DPE', placeholder: 'D' },
      { label: 'Prix (€)', placeholder: '720 000' },
      { label: 'Adresse', placeholder: '8 avenue Suffren', span: true },
      { label: 'Code postal', placeholder: '75015' },
      { label: 'Ville', placeholder: 'Paris 15e' },
    ].map(f => (
      <div key={f.label} className={f.span ? 'col-span-2' : ''}>
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-500 mb-1">
          {f.label}
        </label>
        <input
          type="text"
          placeholder={f.placeholder}
          className="w-full h-9 px-3 text-[13px] bg-white border border-neutral-200 rounded-md focus:outline-none focus:border-propsight-300"
        />
      </div>
    ))}
  </div>
);

export default SourceSelectorModal;
