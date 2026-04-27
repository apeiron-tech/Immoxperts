import React, { useState, useEffect } from 'react';
import { ArrowLeft, GitCompare, FolderPlus, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Opportunity, ProjetInvestisseur, ScenarioInvest } from '../../types';
import { getScenariosForOpp, getDefaultScenarioForOpp } from '../../_mocks/scenarios';
import { formatPrice, formatSigned, formatPct } from '../../utils/finances';
import ScoreCircle from '../../shared/ScoreCircle';
import CoherencePill from '../../shared/CoherencePill';
import { StatutOppBadge, DPEBadge } from '../../shared/StatutBadge';
import { labelLocataire, labelProfondeur } from '../../utils/persona';
import TabAnnonce from '../analyse/TabAnnonce';
import TabVilleMarche from '../analyse/TabVilleMarche';
import TabRendement from '../analyse/TabRendement';
import TabFinance from '../analyse/TabFinance';
import TabFiscalite from '../analyse/TabFiscalite';
import TabPotentielPLU from '../analyse/TabPotentielPLU';
import TabRecap from '../analyse/TabRecap';

type TabId = 'annonce' | 'marche' | 'rendement' | 'finance' | 'fiscalite' | 'potentiel' | 'recap';

const TABS: { id: TabId; label: string }[] = [
  { id: 'annonce', label: 'Annonce' },
  { id: 'marche', label: 'Ville / Marché' },
  { id: 'rendement', label: 'Rendement' },
  { id: 'finance', label: 'Finance' },
  { id: 'fiscalite', label: 'Fiscalité' },
  { id: 'potentiel', label: 'Potentiel / PLU' },
  { id: 'recap', label: 'Récap' },
];

interface Props {
  opportunity: Opportunity;
  projet: ProjetInvestisseur | null;
  onClose: () => void;
}

const AnalyseModal: React.FC<Props> = ({ opportunity, projet, onClose }) => {
  const scenarios = getScenariosForOpp(opportunity.opportunity_id);
  const [scenarioId, setScenarioId] = useState<string>(getDefaultScenarioForOpp(opportunity.opportunity_id)?.scenario_id ?? scenarios[0]?.scenario_id);
  const [tab, setTab] = useState<TabId>('recap');
  const [scenarioOpen, setScenarioOpen] = useState(false);

  const scenario = scenarios.find(s => s.scenario_id === scenarioId) ?? scenarios[0];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!scenario) return null;
  const r = scenario.results;

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-3">
      <div className="w-full max-w-[1400px] h-[calc(100vh-24px)] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-200 px-4 py-3 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft size={14} />
                Retour aux opportunités
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 px-2.5 py-1.5 hover:bg-slate-50"
                >
                  <GitCompare size={13} />
                  Comparer
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setScenarioOpen(!scenarioOpen)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 px-2.5 py-1.5 hover:bg-slate-50"
                  >
                    Scénario : {scenario.label}
                    <ChevronDown size={11} />
                  </button>
                  {scenarioOpen && (
                    <div className="absolute right-0 top-full mt-1 w-64 rounded-md border border-slate-200 bg-white shadow-lg z-10 py-1">
                      {scenarios.map(s => (
                        <button
                          key={s.scenario_id}
                          type="button"
                          onClick={() => {
                            setScenarioId(s.scenario_id);
                            setScenarioOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${s.scenario_id === scenarioId ? 'text-propsight-700 font-medium' : 'text-slate-700'}`}
                        >
                          {s.label}
                        </button>
                      ))}
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button type="button" className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
                          + Dupliquer ce scénario
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md bg-propsight-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-propsight-700"
                >
                  <FolderPlus size={13} />
                  Créer un dossier
                </button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-100">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>

            {/* Hero header */}
            <div className="flex items-center gap-3 mt-1">
              <img src={opportunity.bien.photo_url} alt="" className="w-14 h-14 rounded-md object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 truncate">{opportunity.bien.adresse}, {opportunity.bien.code_postal} {opportunity.bien.ville}</h2>
                  <StatutOppBadge status={opportunity.status} />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-0.5">
                  <span>Appartement</span>
                  <span className="text-slate-300">·</span>
                  <span>{opportunity.bien.surface} m²</span>
                  <span className="text-slate-300">·</span>
                  <span>{opportunity.bien.pieces} pièces</span>
                  <span className="text-slate-300">·</span>
                  <span>étage {opportunity.bien.etage}/{opportunity.bien.nb_etages}</span>
                  <span className="text-slate-300">·</span>
                  <DPEBadge value={opportunity.bien.dpe} />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <CoherencePill pct={opportunity.score_breakdown.coherence_projet} size="sm" />
                <ScoreCircle score={opportunity.score_overall} size={44} />
              </div>
            </div>

            {/* Sticky 5 KPIs compacts */}
            <div className="grid grid-cols-5 gap-2 mt-2.5">
              <StickyKpi label="Prix total projet" value={formatPrice(r.prix_total_projet)} />
              <StickyKpi label="Cash-flow ATF" value={formatSigned(r.cashflow_apres_impot_mensuel, '€/mois')} positive={r.cashflow_apres_impot_mensuel >= 0} />
              <StickyKpi label="Rendement net-net" value={formatPct(r.rendement_net_net)} />
              <StickyKpi label="TRI 10 ans" value={formatPct(r.tri_10_ans)} />
              <StickyKpi label="Score" value={`${opportunity.score_overall}/100`} />
            </div>

            {/* Ligne contextuelle profil */}
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="text-slate-500">Cible :</span>
              <span className="font-medium text-slate-900">{labelLocataire(opportunity.profil_cible.type_dominant)}</span>
              <span className="text-slate-300">·</span>
              <span>Profondeur <span className="font-medium">{labelProfondeur(opportunity.profil_cible.profondeur_demande)}</span></span>
              <span className="text-slate-300">·</span>
              <span>Revenu requis <span className="font-medium">{opportunity.profil_cible.revenu_indicatif_requis.toLocaleString('fr-FR')} €/mois</span></span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 px-4 shrink-0">
            <nav className="flex gap-0">
              {TABS.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
                    tab === t.id ? 'text-propsight-700 border-propsight-600' : 'text-slate-600 border-transparent hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content scroll zone */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            {tab === 'annonce' && <TabAnnonce opp={opportunity} />}
            {tab === 'marche' && <TabVilleMarche opp={opportunity} />}
            {tab === 'rendement' && <TabRendement scenario={scenario} />}
            {tab === 'finance' && <TabFinance scenario={scenario} />}
            {tab === 'fiscalite' && <TabFiscalite scenario={scenario} />}
            {tab === 'potentiel' && <TabPotentielPLU opp={opportunity} />}
            {tab === 'recap' && <TabRecap opp={opportunity} scenario={scenario} projet={projet} />}
          </div>
      </div>
    </div>
  );
};

const StickyKpi: React.FC<{ label: string; value: string; positive?: boolean }> = ({ label, value, positive }) => (
  <div className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5">
    <div className="text-[9px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className={`text-sm font-semibold tabular-nums leading-tight ${positive === false ? 'text-rose-600' : positive === true ? 'text-emerald-600' : 'text-slate-900'}`}>
      {value}
    </div>
  </div>
);

export default AnalyseModal;
