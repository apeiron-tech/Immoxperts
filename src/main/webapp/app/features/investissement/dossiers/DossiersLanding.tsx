import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List, Plus, FileEdit, Send, Eye, Bell, FolderOpen, PieChart, TrendingUp } from 'lucide-react';
import { MOCK_DOSSIERS } from '../_mocks/dossiers';
import { MOCK_PROJETS } from '../_mocks/projets';
import { DossierInvestissement, DossierStatus } from '../types';
import KpiCard from '../shared/KpiCard';
import DossierCard from './components/DossierCard';
import DossiersTable from './components/DossiersTable';
import ProjetCard from './components/ProjetCard';

type Tab = 'dossiers' | 'projets';
type ViewMode = 'cards' | 'table';
type KpiFilter = 'all' | 'brouillon' | 'a_envoyer' | 'ouvert' | 'relance' | null;

const DossiersLanding: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dossiers');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [kpiFilter, setKpiFilter] = useState<KpiFilter>(null);
  const [dossiers] = useState<DossierInvestissement[]>(MOCK_DOSSIERS);

  const stats = useMemo(() => ({
    total: dossiers.length,
    brouillons: dossiers.filter(d => d.status === 'brouillon').length,
    aEnvoyer: dossiers.filter(d => d.status === 'finalise' || d.status === 'analyse_prete').length,
    ouverts: dossiers.filter(d => d.status === 'ouvert').length,
    aRelancer: dossiers.filter(d => d.status === 'ouvert' || d.status === 'envoye').length,
  }), [dossiers]);

  const filtered = useMemo(() => {
    let list = dossiers;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => d.title.toLowerCase().includes(q) || d.ville.toLowerCase().includes(q));
    }
    if (kpiFilter === 'brouillon') list = list.filter(d => d.status === 'brouillon');
    if (kpiFilter === 'a_envoyer') list = list.filter(d => d.status === 'finalise' || d.status === 'analyse_prete');
    if (kpiFilter === 'ouvert') list = list.filter(d => d.status === 'ouvert');
    if (kpiFilter === 'relance') list = list.filter(d => d.status === 'ouvert' || d.status === 'envoye');
    return list;
  }, [dossiers, search, kpiFilter]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dossiers d'investissement</h1>
          <p className="text-xs text-slate-500">Pilotage éditorial et commercial de vos dossiers</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un dossier, projet, adresse…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-72 pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-propsight-500"
            />
            <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-propsight-600 text-white text-sm font-medium px-3 py-1.5 hover:bg-propsight-700"
          >
            <Plus size={14} />
            Nouveau dossier
          </button>
        </div>
      </div>

      {/* Switch segmented */}
      <div className="mb-4 inline-flex border border-slate-200 rounded-md bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setTab('dossiers')}
          className={`px-4 py-1.5 text-sm font-medium ${tab === 'dossiers' ? 'bg-propsight-50 text-propsight-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Dossiers
          <span className="ml-1.5 text-[10px] text-slate-500">{dossiers.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('projets')}
          className={`px-4 py-1.5 text-sm font-medium border-l border-slate-200 ${tab === 'projets' ? 'bg-propsight-50 text-propsight-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Projets
          <span className="ml-1.5 text-[10px] text-slate-500">{MOCK_PROJETS.length}</span>
        </button>
      </div>

      {tab === 'dossiers' ? (
        <>
          {/* KPI row — sticky pour rester visible au scroll */}
          <div className="sticky top-0 z-20 bg-slate-50 -mx-6 px-6 pt-2 pb-3 mb-4 border-b border-slate-200">
            <div className="grid grid-cols-5 gap-3">
              <KpiCard
                icon={<FolderOpen size={16} />}
                label="Total"
                value={stats.total}
                variant="violet"
                trend={{ value: '+12%', positive: true }}
                onClick={() => setKpiFilter(null)}
                active={kpiFilter === null}
              />
              <KpiCard
                icon={<FileEdit size={16} />}
                label="Brouillons"
                value={stats.brouillons}
                subtitle="En cours"
                onClick={() => setKpiFilter(kpiFilter === 'brouillon' ? null : 'brouillon')}
                active={kpiFilter === 'brouillon'}
              />
              <KpiCard
                icon={<Send size={16} />}
                label="À envoyer"
                value={stats.aEnvoyer}
                subtitle="Finalisés non partagés"
                variant="emerald"
                onClick={() => setKpiFilter(kpiFilter === 'a_envoyer' ? null : 'a_envoyer')}
                active={kpiFilter === 'a_envoyer'}
              />
              <KpiCard
                icon={<Eye size={16} />}
                label="Ouverts"
                value={stats.ouverts}
                subtitle="Consultés"
                variant="amber"
                trend={{ value: '+27%', positive: true }}
                onClick={() => setKpiFilter(kpiFilter === 'ouvert' ? null : 'ouvert')}
                active={kpiFilter === 'ouvert'}
              />
              <KpiCard
                icon={<Bell size={16} />}
                label="À suivre"
                value={stats.aRelancer}
                subtitle="Signal dossier"
                variant="rose"
                onClick={() => setKpiFilter(kpiFilter === 'relance' ? null : 'relance')}
                active={kpiFilter === 'relance'}
              />
            </div>
          </div>

          {/* Toggle cards/table */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-slate-500">
              {filtered.length} dossier{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
            </div>
            <div className="inline-flex border border-slate-200 rounded-md bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 ${viewMode === 'cards' ? 'bg-propsight-50 text-propsight-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 border-l border-slate-200 ${viewMode === 'table' ? 'bg-propsight-50 text-propsight-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <List size={14} />
              </button>
            </div>
          </div>

          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map(d => (
                <DossierCard
                  key={d.dossier_id}
                  dossier={d}
                  onOpen={() => navigate(`/app/investissement/dossiers/${d.dossier_id}`)}
                  onDuplicate={() => console.warn('[Dossiers] Dupliquer', d.dossier_id)}
                  onShare={() => console.warn('[Dossiers] Partager', d.dossier_id)}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-12 text-sm text-slate-500">
                  Aucun dossier ne correspond aux filtres.
                </div>
              )}
            </div>
          ) : (
            <DossiersTable dossiers={filtered} onOpen={id => navigate(`/app/investissement/dossiers/${id}`)} />
          )}
        </>
      ) : (
        <>
          <div className="sticky top-0 z-20 bg-slate-50 -mx-6 px-6 pt-2 pb-3 mb-4 border-b border-slate-200">
            <div className="grid grid-cols-3 gap-3">
              <KpiCard icon={<FolderOpen size={16} />} label="Total projets" value={MOCK_PROJETS.length} variant="violet" />
              <KpiCard icon={<TrendingUp size={16} />} label="Actifs" value={MOCK_PROJETS.filter(p => p.status === 'actif').length} variant="emerald" />
              <KpiCard icon={<PieChart size={16} />} label="Progression moyenne" value={`${Math.round(MOCK_PROJETS.reduce((s, p) => s + p.progression_pct, 0) / MOCK_PROJETS.length)}%`} variant="amber" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MOCK_PROJETS.map(p => (
              <ProjetCard
                key={p.project_id}
                projet={p}
                onOpen={() => navigate(`/app/investissement/dossiers/projets/${p.project_id}`)}
                onCreateDossier={() => console.warn('[Projets] Créer dossier', p.project_id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DossiersLanding;
