import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, FolderPlus, GitCompare, Share2 } from 'lucide-react';
import { Opportunity, ScenarioInvest, ProjetInvestisseur } from '../../types';
import { formatPrice, formatSigned, formatPct } from '../../utils/finances';
import { labelRegime, labelLocataire } from '../../utils/persona';
import ScoreCircle from '../../shared/ScoreCircle';
import ProfilLocataireCard from '../../shared/ProfilLocataireCard';
import CoherencePill from '../../shared/CoherencePill';

interface Props {
  opp: Opportunity;
  scenario: ScenarioInvest;
  projet: ProjetInvestisseur | null;
}

const TabRecap: React.FC<Props> = ({ opp, scenario, projet }) => {
  const r = scenario.results;
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Verdict global */}
      <div className="col-span-2 rounded-md border border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white p-5">
        <div className="flex items-start gap-5">
          <ScoreCircle score={opp.score_overall} size={80} />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-emerald-800 mb-1">Très bonne opportunité</h3>
            <p className="text-xs text-slate-700 mb-2">
              Le projet présente un excellent équilibre entre rendement, sécurité locative et potentiel de valorisation.
            </p>
            <div className="flex items-center gap-2 flex-wrap text-xs mb-3">
              <CoherencePill pct={opp.score_breakdown.coherence_projet} />
              <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-0.5">
                Scénario retenu : {scenario.label}
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <DriverLine label="Rendement attractif pour le secteur" />
              <DriverLine label="Demande locative très soutenue" />
              <DriverLine label="Potentiel de valorisation à 5 ans" />
            </div>
          </div>
        </div>
      </div>

      {/* Indicateurs clés */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Indicateurs clés</h3>
        <div className="space-y-2 text-xs">
          <Kv label="Prix total projet" value={formatPrice(r.prix_total_projet)} />
          <Kv label="Loyer cible" value={`${scenario.assumptions.loyer_mensuel_hc} €/mois HC`} />
          <Kv label="Mensualité crédit" value={`${r.mensualite.toLocaleString('fr-FR')} €`} />
          <Kv label="Cash-flow ATF" value={formatSigned(r.cashflow_apres_impot_mensuel, '€/mois')} strong />
          <Kv label="Rendement net-net" value={formatPct(r.rendement_net_net)} />
          <Kv label="TRI 10 ans" value={formatPct(r.tri_10_ans)} />
          <Kv label="Régime fiscal" value={labelRegime(scenario.fiscal_regime)} />
        </div>
      </div>

      {/* Profil cible */}
      <div className="col-span-3">
        <ProfilLocataireCard profil={opp.profil_cible} />
      </div>

      {/* Forces / Vigilances */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-emerald-700 mb-3 flex items-center gap-1.5">
          <CheckCircle2 size={13} />
          Points forts
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-700">
          <li>• Rendement net-net supérieur à la moyenne du secteur</li>
          <li>• Demande locative très soutenue (profondeur forte)</li>
          <li>• Emplacement recherché et bien desservi</li>
          <li>• Faibles charges non récupérables</li>
          <li>• Potentiel de valorisation à 5 ans : +10 à +14 %</li>
        </ul>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-amber-700 mb-3 flex items-center gap-1.5">
          <AlertTriangle size={13} />
          Points de vigilance
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-700">
          <li>• Copropriété ancienne — travaux façade à moyen terme</li>
          <li>• DPE E — risque de contraintes réglementaires (2034)</li>
          <li>• Cuisine & salle de bain à budgéter</li>
          <li>• Fiscalité à optimiser selon votre situation</li>
        </ul>
      </div>

      {/* Checklist */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Checklist avant décision</h3>
        <div className="grid grid-cols-1 gap-y-1 text-xs">
          {['Visite réalisée', 'Étude de marché validée', 'Financement validé', 'Devis travaux obtenus', 'Règlement de copro analysé', 'Projection locative validée', 'Diagnostics techniques reçus', 'Assurance PNO étudiée'].map(item => (
            <label key={item} className="inline-flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-slate-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="col-span-3 rounded-md border border-propsight-200 bg-gradient-to-br from-propsight-50/50 to-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-propsight-600" />
          <h3 className="text-xs font-semibold text-slate-900">Prochaines étapes recommandées</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button type="button" className="rounded-md bg-propsight-600 text-white text-sm font-medium py-3 hover:bg-propsight-700 inline-flex items-center justify-center gap-2">
            <FolderPlus size={14} />
            Créer le dossier
          </button>
          <button type="button" className="rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 py-3 hover:bg-slate-50 inline-flex items-center justify-center gap-2">
            <GitCompare size={14} />
            Ajouter au comparatif
          </button>
          <button type="button" className="rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 py-3 hover:bg-slate-50 inline-flex items-center justify-center gap-2">
            <Share2 size={14} />
            Partager l'analyse
          </button>
        </div>
      </div>
    </div>
  );
};

const Kv: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-600">{label}</span>
    <span className={`tabular-nums ${strong ? 'text-sm font-semibold text-propsight-700' : 'font-medium text-slate-900'}`}>{value}</span>
  </div>
);

const DriverLine: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 text-xs text-slate-700">
    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
    {label}
  </div>
);

export default TabRecap;
