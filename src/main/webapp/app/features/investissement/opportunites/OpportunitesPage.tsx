import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, LayoutGrid, List, Plus, Filter, SlidersHorizontal, ChevronDown, GitCompare, X } from 'lucide-react';
import { MOCK_PROJETS, ACTIVE_PROJECT_ID_DEFAULT } from '../_mocks/projets';
import { MOCK_OPPORTUNITES } from '../_mocks/opportunites';
import { getDefaultScenarioForOpp } from '../_mocks/scenarios';
import { Opportunity, Preset, TriOpp, ViewMode } from '../types';
import ProjetActifBand from '../shared/ProjetActifBand';
import KpiRowOpportunites from './components/KpiRowOpportunites';
import OpportuniteCard from './components/OpportuniteCard';
import OpportunitesListe from './components/OpportunitesListe';
import OpportuniteDrawer from './components/OpportuniteDrawer';
import FiltresDrawer, { FiltresState, DEFAULT_FILTRES } from './components/FiltresDrawer';
import AnalyseModal from './modals/AnalyseModal';
import WizardCreationProjet from './modals/WizardCreationProjet';
import ComparatifBiensModal from './modals/ComparatifBiensModal';
import ComparatifVillesModal from './modals/ComparatifVillesModal';

const PRESETS: { id: Preset; label: string }[] = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'cashflow', label: 'Cash-flow' },
  { id: 'patrimonial', label: 'Patrimonial' },
  { id: 'travaux_decote', label: 'Travaux/décote' },
  { id: 'zone_potentiel', label: 'Zone à potentiel' },
  { id: 'risque_eleve', label: 'Risque élevé' },
  { id: 'suivis', label: 'Mes suivis' },
];

const TRI_OPTIONS: { id: TriOpp; label: string }[] = [
  { id: 'date_desc', label: 'Date d\'entrée' },
  { id: 'score_desc', label: 'Score' },
  { id: 'coherence_desc', label: 'Cohérence projet' },
  { id: 'cashflow_desc', label: 'Cash-flow' },
  { id: 'rendement_desc', label: 'Rendement net-net' },
  { id: 'prix_asc', label: 'Prix croissant' },
  { id: 'prix_m2_asc', label: 'Prix/m² croissant' },
];

const OpportunitesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const analyseId = searchParams.get('analyse');
  const comparatifIds = searchParams.get('comparatif')?.split(',').filter(Boolean) ?? [];
  const comparatifZones = searchParams.get('comparatif-zones')?.split(',').filter(Boolean) ?? [];

  const [projets, setProjets] = useState(MOCK_PROJETS);
  const [activeProjectId, setActiveProjectId] = useState(ACTIVE_PROJECT_ID_DEFAULT);
  const [opportunites, setOpportunites] = useState<Opportunity[]>(MOCK_OPPORTUNITES);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [search, setSearch] = useState('');
  const [preset, setPreset] = useState<Preset>('toutes');
  const [tri, setTri] = useState<TriOpp>('date_desc');
  const [filtres, setFiltres] = useState<FiltresState>(DEFAULT_FILTRES);
  const [filtresOpen, setFiltresOpen] = useState(false);
  const [triOpen, setTriOpen] = useState(false);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [kpiFilter, setKpiFilter] = useState<'all' | 'nouveau' | 'a_qualifier' | 'dossier' | null>(null);
  const [rechercheLibre, setRechercheLibre] = useState(false);

  const activeProject = projets.find(p => p.project_id === activeProjectId) ?? null;

  const filtered = useMemo(() => {
    let list = rechercheLibre ? [...opportunites] : opportunites.filter(o => o.project_id === activeProjectId);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o => o.bien.adresse.toLowerCase().includes(q) || o.bien.ville.toLowerCase().includes(q) || o.bien.quartier.toLowerCase().includes(q));
    }

    if (kpiFilter === 'nouveau') list = list.filter(o => o.status === 'nouveau');
    if (kpiFilter === 'a_qualifier') list = list.filter(o => o.status === 'a_qualifier');

    switch (preset) {
      case 'cashflow':
        list = list.filter(o => o.bien.signaux.includes('Cash-flow+'));
        break;
      case 'patrimonial':
        list = list.filter(o => o.score_breakdown.coherence_projet >= 70);
        break;
      case 'travaux_decote':
        list = list.filter(o => o.bien.signaux.includes('Travaux') || o.bien.signaux.includes('Sous-prix'));
        break;
      case 'zone_potentiel':
        list = list.filter(o => o.bien.signaux.includes('PLU fort'));
        break;
      case 'risque_eleve':
        list = list.filter(o => o.bien.signaux.includes('DPE F/G'));
        break;
      case 'suivis':
        list = list.filter(o => o.favori);
        break;
      default:
        break;
    }

    // filtres drawer
    list = list.filter(o => {
      if (o.prix_affiche > filtres.prix_max) return false;
      if (o.bien.surface < filtres.surface_min || o.bien.surface > filtres.surface_max) return false;
      if (filtres.dpe_exclus.includes(o.bien.dpe)) return false;
      if (filtres.coherence_min && o.score_breakdown.coherence_projet < filtres.coherence_min) return false;
      if (filtres.nouveauxSeuls && o.ancienneté_annonce_jours > 7) return false;
      return true;
    });

    // tri
    list = [...list].sort((a, b) => {
      switch (tri) {
        case 'score_desc':
          return b.score_overall - a.score_overall;
        case 'coherence_desc':
          return b.score_breakdown.coherence_projet - a.score_breakdown.coherence_projet;
        case 'cashflow_desc':
          return b.loyer_estime - a.loyer_estime;
        case 'rendement_desc':
          return (b.loyer_estime / b.prix_affiche) - (a.loyer_estime / a.prix_affiche);
        case 'prix_asc':
          return a.prix_affiche - b.prix_affiche;
        case 'prix_m2_asc':
          return a.prix_m2 - b.prix_m2;
        default:
          return a.ancienneté_annonce_jours - b.ancienneté_annonce_jours;
      }
    });

    return list;
  }, [opportunites, activeProjectId, search, preset, tri, filtres, kpiFilter, rechercheLibre]);

  const stats = useMemo(() => {
    const all = rechercheLibre ? opportunites : opportunites.filter(o => o.project_id === activeProjectId);
    return {
      total: all.length,
      nouveaux: all.filter(o => o.status === 'nouveau').length,
      aAnalyser: all.filter(o => o.status === 'a_qualifier' || o.status === 'a_arbitrer').length,
      enDossier: all.filter(o => o.dossier_id).length || 4,
    };
  }, [opportunites, activeProjectId, rechercheLibre]);

  const toggleSelect = (id: string) => {
    setSelected(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(o => o.opportunity_id)));
  };

  const openAnalyse = (id: string) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('analyse', id);
      return p;
    });
  };

  const closeAnalyse = () => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.delete('analyse');
      return p;
    });
  };

  const openComparatif = (ids: string[]) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('comparatif', ids.join(','));
      return p;
    });
  };

  const closeComparatif = () => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.delete('comparatif');
      return p;
    });
  };

  const closeComparatifZones = () => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.delete('comparatif-zones');
      return p;
    });
  };

  const toggleFavori = (id: string) => {
    setOpportunites(prev => prev.map(o => (o.opportunity_id === id ? { ...o, favori: !o.favori } : o)));
  };

  const drawerOpp = drawerId ? opportunites.find(o => o.opportunity_id === drawerId) : null;
  const analyseOpp = analyseId ? opportunites.find(o => o.opportunity_id === analyseId) : null;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Opportunités</h1>
          <p className="text-xs text-slate-500">Biens à potentiel investissement, priorisés par rentabilité et contexte</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une adresse, ville, quartier…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-72 pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-propsight-500 focus:border-propsight-500"
            />
            <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
          </div>
          <button
            type="button"
            onClick={() => setWizardOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-propsight-600 text-white text-sm font-medium px-3 py-1.5 hover:bg-propsight-700"
          >
            <Plus size={14} />
            Nouvelle opportunité
          </button>
        </div>
      </div>

      {/* Toggle recherche libre / projet actif */}
      <div className="mb-4 flex items-center gap-2">
        <div className="inline-flex border border-slate-200 rounded-md bg-white overflow-hidden text-xs font-medium">
          <button
            type="button"
            onClick={() => setRechercheLibre(false)}
            className={`px-3 py-1.5 ${!rechercheLibre ? 'bg-propsight-50 text-propsight-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Depuis mon projet
          </button>
          <button
            type="button"
            onClick={() => setRechercheLibre(true)}
            className={`px-3 py-1.5 border-l border-slate-200 ${rechercheLibre ? 'bg-propsight-50 text-propsight-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Recherche libre
          </button>
        </div>
        {!rechercheLibre && (
          <div className="flex-1">
            <ProjetActifBand
              projets={projets}
              activeProjectId={activeProjectId}
              onChangeProject={setActiveProjectId}
              onNewProject={() => setWizardOpen(true)}
              compact
            />
          </div>
        )}
        {rechercheLibre && (
          <div className="flex-1 text-xs text-slate-500 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 border border-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              Mode libre : toutes les annonces, sans contexte projet
            </span>
          </div>
        )}
      </div>

      {/* KPI + Barre sticky (collés ensemble pour rester fixes au scroll) */}
      <div className="sticky top-0 z-20 bg-slate-50 -mx-6 px-6 mb-3 border-b border-slate-200">
        <div className="py-3">
          <KpiRowOpportunites
            total={stats.total}
            nouveaux={stats.nouveaux}
            aAnalyser={stats.aAnalyser}
            enDossier={stats.enDossier}
            onFilterStatus={(s) => setKpiFilter(kpiFilter === s ? null : s)}
            activeFilter={kpiFilter}
          />
        </div>
        <div className="flex items-center justify-between gap-3 pb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESETS.map(p => (
              <button
                type="button"
                key={p.id}
                onClick={() => setPreset(p.id)}
                className={`text-xs px-2.5 py-1 rounded-md border ${
                  preset === p.id
                    ? 'bg-propsight-600 text-white border-propsight-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setFiltresOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 px-2.5 py-1 hover:bg-slate-50"
            >
              <Filter size={12} />
              Filtres
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setTriOpen(!triOpen)}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 px-2.5 py-1 hover:bg-slate-50"
              >
                <SlidersHorizontal size={12} />
                Trier
                <ChevronDown size={11} />
              </button>
              {triOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 rounded-md border border-slate-200 bg-white shadow-lg z-30 py-1">
                  {TRI_OPTIONS.map(t => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => {
                        setTri(t.id);
                        setTriOpen(false);
                      }}
                      className={`w-full text-left text-xs px-3 py-1.5 hover:bg-slate-50 ${tri === t.id ? 'text-propsight-700 font-medium' : 'text-slate-700'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="inline-flex border border-slate-200 rounded-md bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 ${viewMode === 'cards' ? 'bg-propsight-50 text-propsight-700' : 'text-slate-500 hover:bg-slate-50'}`}
                title="Vue cards"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('liste')}
                className={`p-1.5 border-l border-slate-200 ${viewMode === 'liste' ? 'bg-propsight-50 text-propsight-700' : 'text-slate-500 hover:bg-slate-50'}`}
                title="Vue liste"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Résultats */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(opp => (
            <div key={opp.opportunity_id} onClick={() => setDrawerId(opp.opportunity_id)} className="cursor-pointer">
              <OpportuniteCard
                opp={opp}
                onOpenAnalyse={() => openAnalyse(opp.opportunity_id)}
                onToggleFavori={() => toggleFavori(opp.opportunity_id)}
              />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-500 text-sm">Aucune opportunité ne correspond à vos filtres.</div>
          )}
        </div>
      ) : (
        <OpportunitesListe
          opportunites={filtered}
          selected={selected}
          onToggleSelect={toggleSelect}
          onToggleAll={toggleAll}
          onOpenAnalyse={openAnalyse}
          onOpenDrawer={setDrawerId}
        />
      )}

      {/* Multi-select floating bar */}
      {selected.size >= 2 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 rounded-md bg-slate-900 text-white shadow-lg px-4 py-2 text-xs">
          <span className="font-medium">{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
          <button
            type="button"
            onClick={() => {
              openComparatif(Array.from(selected).slice(0, 4));
              setSelected(new Set());
            }}
            className="inline-flex items-center gap-1 bg-propsight-600 rounded px-2 py-1 hover:bg-propsight-700"
          >
            <GitCompare size={12} />
            Comparer ({Math.min(selected.size, 4)})
          </button>
          <button type="button" onClick={() => setSelected(new Set())} className="p-1 hover:bg-white/10 rounded">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Drawers & modals */}
      {drawerOpp && (
        <OpportuniteDrawer
          opp={drawerOpp}
          scenario={getDefaultScenarioForOpp(drawerOpp.opportunity_id)}
          projet={activeProject}
          onClose={() => setDrawerId(null)}
          onOpenAnalyse={() => {
            openAnalyse(drawerOpp.opportunity_id);
            setDrawerId(null);
          }}
          onCompare={() => {
            openComparatif([drawerOpp.opportunity_id]);
            setDrawerId(null);
          }}
          onToggleFavori={() => toggleFavori(drawerOpp.opportunity_id)}
          onCreateDossier={() => {
            console.warn('[Opportunités] Créer dossier depuis', drawerOpp.opportunity_id);
            window.location.href = `/app/investissement/dossiers`;
          }}
        />
      )}

      {filtresOpen && <FiltresDrawer open={filtresOpen} filtres={filtres} onChange={setFiltres} onClose={() => setFiltresOpen(false)} />}

      {analyseOpp && <AnalyseModal opportunity={analyseOpp} projet={activeProject} onClose={closeAnalyse} />}

      {comparatifIds.length > 0 && (
        <ComparatifBiensModal
          opportunites={opportunites.filter(o => comparatifIds.includes(o.opportunity_id))}
          projet={activeProject}
          onClose={closeComparatif}
        />
      )}

      {comparatifZones.length > 0 && <ComparatifVillesModal villeIds={comparatifZones} projet={activeProject} onClose={closeComparatifZones} />}

      {wizardOpen && (
        <WizardCreationProjet
          onClose={() => setWizardOpen(false)}
          onCreate={projet => {
            setProjets(prev => [...prev, projet]);
            setActiveProjectId(projet.project_id);
            setWizardOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default OpportunitesPage;
