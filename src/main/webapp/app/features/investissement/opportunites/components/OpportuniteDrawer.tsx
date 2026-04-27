import React from 'react';
import { X, Heart, GitCompare, FolderPlus, Bell, ExternalLink, FileText } from 'lucide-react';
import { Opportunity, ProjetInvestisseur, ScenarioInvest } from '../../types';
import { formatPrice, formatSigned, formatPct } from '../../utils/finances';
import ScoreCircle from '../../shared/ScoreCircle';
import CoherencePill from '../../shared/CoherencePill';
import ProfilLocatairePill from '../../shared/ProfilLocatairePill';
import { StatutOppBadge, DPEBadge } from '../../shared/StatutBadge';

interface Props {
  opp: Opportunity;
  scenario: ScenarioInvest | undefined;
  projet: ProjetInvestisseur | null;
  onClose: () => void;
  onOpenAnalyse: () => void;
  onCompare: () => void;
  onToggleFavori: () => void;
  onCreateDossier: () => void;
}

const OpportuniteDrawer: React.FC<Props> = ({ opp, scenario, projet, onClose, onOpenAnalyse, onCompare, onToggleFavori, onCreateDossier }) => {
  const r = scenario?.results;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <img src={opp.bien.photo_url} alt="" className="w-12 h-12 rounded object-cover" />
              <div>
                <div className="text-sm font-semibold text-slate-900">{opp.bien.adresse}</div>
                <div className="text-[11px] text-slate-500">{opp.bien.code_postal} {opp.bien.ville} · {opp.bien.pieces}p · {opp.bien.surface}m²</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <StatutOppBadge status={opp.status} />
                  <DPEBadge value={opp.bien.dpe} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ScoreCircle score={opp.score_overall} size={48} />
              <button type="button" onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
                <X size={16} />
              </button>
            </div>
          </div>
          <CoherencePill pct={opp.score_breakdown.coherence_projet} />
        </div>

        <div className="p-4 space-y-4">
          {/* KPIs sticky */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border border-slate-200 p-2.5">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Prix total projet</div>
              <div className="text-sm font-semibold text-slate-900 tabular-nums">{formatPrice(r?.prix_total_projet ?? opp.prix_affiche)}</div>
            </div>
            <div className="rounded-md border border-slate-200 p-2.5">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Cash-flow ATF</div>
              <div className={`text-sm font-semibold tabular-nums ${(r?.cashflow_apres_impot_mensuel ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatSigned(r?.cashflow_apres_impot_mensuel ?? 0, '€/mois')}
              </div>
            </div>
            <div className="rounded-md border border-slate-200 p-2.5">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Rendement net-net</div>
              <div className="text-sm font-semibold text-slate-900 tabular-nums">{formatPct(r?.rendement_net_net ?? 0)}</div>
            </div>
            <div className="rounded-md border border-slate-200 p-2.5">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">TRI 10 ans</div>
              <div className="text-sm font-semibold text-slate-900 tabular-nums">{formatPct(r?.tri_10_ans ?? 0)}</div>
            </div>
          </div>

          {/* Profil locataire */}
          <ProfilLocatairePill profil={opp.profil_cible} />

          {/* Cohérence */}
          <section>
            <h4 className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">Cohérence avec le projet actif</h4>
            <div className="rounded-md border border-slate-200 p-3 text-xs space-y-1.5">
              <div className="font-medium text-slate-900 mb-1">{projet?.name ?? 'Aucun projet'}</div>
              <Check label="Budget" ok={projet ? opp.prix_affiche <= projet.budget_max : false} />
              <Check label="Zone" ok={projet ? projet.target_zones.some(z => opp.bien.ville.toLowerCase().includes(z.toLowerCase())) : false} />
              <Check label="Type de bien" ok={projet ? projet.preferred_property_types.includes(opp.bien.type) : false} />
              <Check label="Rendement cible atteint" ok={(r?.rendement_net_net ?? 0) >= (projet?.yield_target ?? 0)} />
            </div>
          </section>

          {/* Signaux */}
          {opp.bien.signaux.length > 0 && (
            <section>
              <h4 className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">Signaux clés</h4>
              <div className="flex flex-wrap gap-1.5">
                {opp.bien.signaux.map(s => (
                  <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Actions */}
          <section className="pt-2 space-y-2">
            <button
              type="button"
              onClick={onOpenAnalyse}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-propsight-600 text-white text-sm font-medium py-2.5 hover:bg-propsight-700"
            >
              <ExternalLink size={14} />
              Ouvrir l'analyse
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onCompare}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 py-2 hover:bg-slate-50"
              >
                <GitCompare size={13} />
                Ajouter au comparatif
              </button>
              <button
                type="button"
                onClick={onToggleFavori}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 py-2 hover:bg-slate-50"
              >
                <Heart size={13} className={opp.favori ? 'text-rose-500 fill-rose-500' : ''} />
                {opp.favori ? 'Suivi' : 'Suivre'}
              </button>
              <button
                type="button"
                onClick={onCreateDossier}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 py-2 hover:bg-slate-50"
              >
                <FolderPlus size={13} />
                Créer un dossier
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 py-2 hover:bg-slate-50"
              >
                <Bell size={13} />
                Créer une alerte
              </button>
            </div>
          </section>

          {/* Timeline simplifiée */}
          <section>
            <h4 className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">Historique</h4>
            <div className="rounded-md border border-slate-200 p-3 text-xs space-y-1.5 text-slate-600">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>Détectée il y a {opp.ancienneté_annonce_jours}j
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>Dernière analyse : il y a 2j
              </div>
              {opp.baisse_prix && (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">•</span>Baisse de prix détectée
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

const Check: React.FC<{ label: string; ok: boolean }> = ({ label, ok }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-600">{label}</span>
    <span className={`text-[11px] font-medium ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>{ok ? '✓' : '–'}</span>
  </div>
);

export default OpportuniteDrawer;
