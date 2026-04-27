import React, { useEffect } from 'react';
import { X, Save, Heart, ExternalLink, Trophy } from 'lucide-react';
import { Opportunity, ProjetInvestisseur } from '../../types';
import { getDefaultScenarioForOpp } from '../../_mocks/scenarios';
import { formatPrice, formatSigned, formatPct } from '../../utils/finances';
import ScoreCircle from '../../shared/ScoreCircle';
import { labelRegime } from '../../utils/persona';

interface Props {
  opportunites: Opportunity[];
  projet: ProjetInvestisseur | null;
  onClose: () => void;
}

const ComparatifBiensModal: React.FC<Props> = ({ opportunites, projet, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const withScn = opportunites.map(o => ({ opp: o, scn: getDefaultScenarioForOpp(o.opportunity_id) }));
  const best = withScn.reduce((a, b) => (b.opp.score_overall > a.opp.score_overall ? b : a));

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4">
        <div className="w-full max-w-[1400px] bg-white rounded-lg shadow-2xl my-4 overflow-hidden">
          <div className="border-b border-slate-200 p-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Comparaison d'opportunités</h2>
              <p className="text-xs text-slate-500">
                Projet actif : {projet?.name ?? 'Aucun'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 px-2.5 py-1.5 hover:bg-slate-50">
                <Save size={13} />
                Enregistrer
              </button>
              <button type="button" onClick={onClose} className="p-1 rounded hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_280px]">
            <div className="p-4 overflow-x-auto">
              {/* Biens header */}
              <div className={`grid gap-3 mb-3`} style={{ gridTemplateColumns: `160px repeat(${opportunites.length}, minmax(180px, 1fr))` }}>
                <div />
                {withScn.map(({ opp }) => (
                  <div key={opp.opportunity_id} className={`rounded-md border p-3 ${opp.opportunity_id === best.opp.opportunity_id ? 'border-propsight-300 bg-propsight-50/40' : 'border-slate-200'}`}>
                    <div className="relative">
                      <img src={opp.bien.photo_url} alt="" className="w-full aspect-[4/3] rounded object-cover mb-2" />
                      {opp.opportunity_id === best.opp.opportunity_id && (
                        <div className="absolute top-1 right-1 bg-propsight-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                          <Trophy size={10} />
                          Gagnant
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-900 truncate flex-1">{opp.bien.adresse}</div>
                      <ScoreCircle score={opp.score_overall} size={40} />
                    </div>
                    <div className="text-[11px] text-slate-500">{opp.bien.code_postal} · {opp.bien.surface}m² · {opp.bien.pieces}p</div>
                    <div className="text-base font-bold text-slate-900 mt-1 tabular-nums">{formatPrice(opp.prix_affiche)}</div>
                  </div>
                ))}
              </div>

              {/* Rows */}
              <Section title="Acquisition" />
              <Row label="Prix d'acquisition" cells={withScn.map(({ opp }) => formatPrice(opp.prix_affiche))} cols={withScn.length} />
              <Row label="Prix/m²" cells={withScn.map(({ opp }) => `${opp.prix_m2.toLocaleString('fr-FR')} €`)} cols={withScn.length} />
              <Row label="Surface" cells={withScn.map(({ opp }) => `${opp.bien.surface} m²`)} cols={withScn.length} />
              <Row label="Ancienneté annonce" cells={withScn.map(({ opp }) => `${opp.ancienneté_annonce_jours} jours`)} cols={withScn.length} />

              <Section title="Rendement" />
              <Row label="Rendement brut" cells={withScn.map(({ scn }) => scn ? formatPct(scn.results.rendement_brut) : '—')} cols={withScn.length} />
              <Row label="Rendement net-net" cells={withScn.map(({ scn }) => scn ? formatPct(scn.results.rendement_net_net) : '—')} cols={withScn.length} highlight />
              <Row label="TRI 10 ans" cells={withScn.map(({ scn }) => scn ? formatPct(scn.results.tri_10_ans) : '—')} cols={withScn.length} />

              <Section title="Cash-flow" />
              <Row label="Cash-flow ATF" cells={withScn.map(({ scn }) => scn ? formatSigned(scn.results.cashflow_apres_impot_mensuel, '€/mois') : '—')} cols={withScn.length} highlight />
              <Row label="Cash-on-cash" cells={withScn.map(({ scn }) => scn ? formatPct(scn.results.cash_on_cash) : '—')} cols={withScn.length} />

              <Section title="Fiscalité" />
              <Row label="Régime" cells={withScn.map(({ scn }) => scn ? labelRegime(scn.fiscal_regime) : '—')} cols={withScn.length} />
              <Row label="Impôt annuel" cells={withScn.map(({ scn }) => scn ? formatPrice(scn.results.impot_annuel) : '—')} cols={withScn.length} />

              <Section title="Finance" />
              <Row label="Apport requis" cells={withScn.map(({ scn }) => scn ? formatPrice(scn.financing.apport) : '—')} cols={withScn.length} />
              <Row label="Mensualité" cells={withScn.map(({ scn }) => scn ? `${scn.results.mensualite.toLocaleString('fr-FR')} €` : '—')} cols={withScn.length} />
              <Row label="DSCR" cells={withScn.map(({ scn }) => scn ? scn.results.dscr.toFixed(2) : '—')} cols={withScn.length} />
            </div>

            {/* Verdict panel */}
            <div className="border-l border-slate-200 bg-slate-50 p-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-900 mb-2">Verdict Propsight</h3>
              <VerdictLine label="Meilleur score" value={best.opp.bien.adresse} detail={`${best.opp.score_overall}/100`} />
              <VerdictLine label="Meilleur rendement" value={withScn.reduce((a, b) => ((b.scn?.results.rendement_net_net ?? 0) > (a.scn?.results.rendement_net_net ?? 0) ? b : a)).opp.bien.adresse} detail="" />
              <VerdictLine label="Meilleur cash-flow" value={withScn.reduce((a, b) => ((b.scn?.results.cashflow_apres_impot_mensuel ?? 0) > (a.scn?.results.cashflow_apres_impot_mensuel ?? 0) ? b : a)).opp.bien.adresse} detail="" />
              <div className="mt-4 rounded-md bg-propsight-50 border border-propsight-200 p-3">
                <div className="text-[10px] uppercase tracking-wide text-propsight-700 font-semibold mb-1">Recommandation</div>
                <div className="text-sm font-semibold text-propsight-900">{best.opp.bien.adresse}</div>
                <p className="text-xs text-slate-700 mt-1">
                  Meilleur équilibre score/cohérence pour votre projet. À prioriser.
                </p>
              </div>
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <button type="button" className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-propsight-600 text-white text-xs font-medium py-2 hover:bg-propsight-700">
                  <ExternalLink size={12} />
                  Ouvrir l'analyse détaillée
                </button>
                <button type="button" className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 py-2 hover:bg-slate-50">
                  <Heart size={12} />
                  Ajouter aux biens suivis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string }> = ({ title }) => (
  <div className="pt-3 pb-1 text-[10px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-100">
    {title}
  </div>
);

const Row: React.FC<{ label: string; cells: string[]; cols: number; highlight?: boolean }> = ({ label, cells, cols, highlight }) => (
  <div className={`grid gap-3 py-1.5 border-b border-slate-50 text-xs ${highlight ? 'bg-propsight-50/20' : ''}`} style={{ gridTemplateColumns: `160px repeat(${cols}, minmax(180px, 1fr))` }}>
    <div className="text-slate-600">{label}</div>
    {cells.map((c, i) => (
      <div key={i} className={`${highlight ? 'font-semibold text-propsight-700' : 'font-medium text-slate-900'} tabular-nums`}>{c}</div>
    ))}
  </div>
);

const VerdictLine: React.FC<{ label: string; value: string; detail: string }> = ({ label, value, detail }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="text-sm font-medium text-slate-900">{value}</div>
    {detail && <div className="text-[10px] text-slate-500">{detail}</div>}
  </div>
);

export default ComparatifBiensModal;
