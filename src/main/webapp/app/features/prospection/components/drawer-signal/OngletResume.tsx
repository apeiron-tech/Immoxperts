import React, { useState } from 'react';
import { Check, TrendingUp, TrendingDown, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { SignalProspection, MetaSignalRadar } from '../../types';
import { ClasseDPEBadge } from '../shared/Badges';
import {
  formatEuro,
  formatPrixM2,
  formatPct,
  formatDate,
  formatDureeDetention,
} from '../../utils/formatters';
import { getCtaRecommande } from '../../utils/ctaRecommande';

interface Props {
  signal: SignalProspection | MetaSignalRadar;
}

const Card: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`rounded-lg border border-slate-200 bg-white ${className}`}>
    {title && (
      <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
        {title}
      </div>
    )}
    <div className="p-3">{children}</div>
  </div>
);

const DataCell: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
    <div className="text-[13px] text-slate-900 font-medium mt-0.5">{value}</div>
  </div>
);

const OngletResume: React.FC<Props> = ({ signal }) => {
  const [showFullBreakdown, setShowFullBreakdown] = useState(false);
  const isMeta = 'children' in signal;
  const cta = getCtaRecommande(signal);

  const reasons = isMeta ? signal.reasons_short : [signal.explanation_short];
  const computeExtras = (): string[] => {
    if (isMeta) return [];
    if (signal.source === 'dpe') {
      return [
        signal.dpe_payload.classe_dpe && `Classe DPE ${signal.dpe_payload.classe_dpe}`,
        signal.dpe_payload.zone_tendue && 'En zone tendue',
        signal.dpe_payload.potentiel_gain_classe && `Gain ${signal.dpe_payload.potentiel_gain_classe} classes possible`,
        signal.dpe_payload.loyer_ou_valeur_apres_travaux_pct &&
          `Revalorisation estimée +${signal.dpe_payload.loyer_ou_valeur_apres_travaux_pct}%`,
      ].filter(Boolean).map(String);
    }
    if (signal.source === 'dvf') {
      return [
        signal.dvf_payload.ecart_vs_marche_pct !== undefined &&
          `Écart marché : ${formatPct(signal.dvf_payload.ecart_vs_marche_pct)}`,
        signal.dvf_payload.nb_mutations_10_ans !== undefined &&
          `${signal.dvf_payload.nb_mutations_10_ans} mutations sur 10 ans`,
      ].filter(Boolean).map(String);
    }
    if (signal.source === 'annonce') {
      return [
        signal.annonce_payload.variation_pct !== undefined &&
          `Variation ${formatPct(signal.annonce_payload.variation_pct)}`,
        signal.annonce_payload.age_jours !== undefined &&
          `En ligne depuis ${signal.annonce_payload.age_jours} jours`,
      ].filter(Boolean).map(String);
    }
    return [];
  };
  const extraReasons = computeExtras();

  const allReasons = [...reasons, ...extraReasons].slice(0, 5);

  const breakdown = isMeta
    ? signal.children[0].score_breakdown
    : signal.score_breakdown;
  const score = isMeta ? signal.score_agrege : signal.score;

  return (
    <div className="space-y-3">
      {/* Bloc Pourquoi ça remonte */}
      <Card title="Pourquoi ce signal remonte">
        <ul className="space-y-2">
          {allReasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-slate-700">
              <Check size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Action recommandée */}
      <div className="rounded-lg border border-propsight-200 bg-propsight-50/60 p-3">
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="text-propsight-600 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Action recommandée
            </div>
            <div className="text-[13px] font-medium text-slate-900">{cta.label}</div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {cta.primary === 'lead_vendeur' && 'Contactez le propriétaire pour initier un projet de mise en vente.'}
              {cta.primary === 'lead_bailleur' &&
                'Contactez le bailleur pour proposer un arbitrage ou un plan de travaux.'}
              {cta.primary === 'estimer' && 'Ouvrez une estimation pour préparer le RDV commercial.'}
              {cta.primary === 'analyser_invest' &&
                'Ouvrez l\'analyse d\'investissement pour chiffrer rendement et scénarios.'}
              {cta.primary === 'action' &&
                'Planifiez une action commerciale (appel, RDV terrain, prise de contact).'}
              {cta.primary === 'lead_acquereur' && 'Contactez l\'acquéreur potentiel identifié dans cette zone.'}
            </p>
          </div>
        </div>
      </div>

      {/* Données clés — variables par source */}
      {!isMeta && signal.source === 'dpe' && (
        <Card title="Données DPE">
          <div className="grid grid-cols-2 gap-3">
            <DataCell
              label="Classe DPE"
              value={
                signal.dpe_payload.classe_dpe ? (
                  <ClasseDPEBadge classe={signal.dpe_payload.classe_dpe} size="md" />
                ) : (
                  '—'
                )
              }
            />
            <DataCell label="Validité" value={formatDate(signal.dpe_payload.date_dpe)} />
            <DataCell
              label="Consommation"
              value={
                signal.dpe_payload.conso_energie_kwh_m2_an
                  ? `${signal.dpe_payload.conso_energie_kwh_m2_an} kWh/m².an`
                  : '—'
              }
            />
            <DataCell label="Type bien" value={signal.dpe_payload.type_bien === 'maison' ? 'Maison' : 'Appartement'} />
            <DataCell
              label="GES"
              value={signal.dpe_payload.ges_kgco2_m2_an ? `${signal.dpe_payload.ges_kgco2_m2_an} kgCO₂/m².an` : '—'}
            />
            <DataCell
              label="Surface"
              value={signal.dpe_payload.surface_m2 ? `${signal.dpe_payload.surface_m2} m²` : '—'}
            />
            <DataCell label="Zone tendue" value={signal.dpe_payload.zone_tendue ? 'Oui' : 'Non'} />
            <DataCell
              label="Usage probable"
              value={
                signal.dpe_payload.usage_probable === 'locatif'
                  ? 'Locatif'
                  : signal.dpe_payload.usage_probable === 'residence_principale'
                    ? 'Résidence principale'
                    : signal.dpe_payload.usage_probable === 'vacant'
                      ? 'Vacant'
                      : '—'
              }
            />
            {signal.dpe_payload.travaux_estimes_euros && (
              <DataCell
                label="Travaux estimés"
                value={formatEuro(signal.dpe_payload.travaux_estimes_euros)}
              />
            )}
          </div>
        </Card>
      )}

      {!isMeta && signal.source === 'dvf' && (
        <Card title="Données DVF">
          <div className="grid grid-cols-2 gap-3">
            <DataCell label="Date vente" value={formatDate(signal.dvf_payload.date_vente)} />
            <DataCell label="Prix vente" value={formatEuro(signal.dvf_payload.prix_vente)} />
            <DataCell label="Prix / m²" value={formatPrixM2(signal.dvf_payload.prix_m2)} />
            <DataCell
              label="Surface"
              value={signal.dvf_payload.surface_m2 ? `${signal.dvf_payload.surface_m2} m²` : '—'}
            />
            <DataCell
              label="Type bien"
              value={signal.dvf_payload.type_bien === 'maison' ? 'Maison' : 'Appartement'}
            />
            <DataCell
              label="Type acquéreur"
              value={
                signal.dvf_payload.type_acquereur === 'sci'
                  ? 'SCI'
                  : signal.dvf_payload.type_acquereur === 'personne_morale'
                    ? 'Personne morale'
                    : 'Particulier'
              }
            />
            <DataCell
              label="Durée détention"
              value={formatDureeDetention(
                signal.dvf_payload.duree_detention_ans,
                signal.dvf_payload.duree_detention_mois
              )}
            />
            <DataCell
              label="Mutations / 10 ans"
              value={signal.dvf_payload.nb_mutations_10_ans ?? '—'}
            />
          </div>
        </Card>
      )}

      {!isMeta && signal.source === 'annonce' && (
        <Card title="Données annonce">
          <div className="grid grid-cols-2 gap-3">
            <DataCell label="Prix actuel" value={formatEuro(signal.annonce_payload.prix_actuel)} />
            {signal.annonce_payload.prix_initial && (
              <DataCell label="Prix initial" value={formatEuro(signal.annonce_payload.prix_initial)} />
            )}
            {signal.annonce_payload.variation_pct !== undefined && (
              <DataCell
                label="Variation"
                value={
                  <span
                    className={`inline-flex items-center gap-1 ${
                      signal.annonce_payload.variation_pct < 0 ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {signal.annonce_payload.variation_pct < 0 ? (
                      <TrendingDown size={12} />
                    ) : (
                      <TrendingUp size={12} />
                    )}
                    {formatPct(signal.annonce_payload.variation_pct)}
                  </span>
                }
              />
            )}
            <DataCell label="Âge annonce" value={`${signal.annonce_payload.age_jours} jours`} />
            {signal.annonce_payload.prix_m2 && (
              <DataCell label="Prix / m²" value={formatPrixM2(signal.annonce_payload.prix_m2)} />
            )}
          </div>
        </Card>
      )}

      {/* Score breakdown */}
      <Card title={`Score ${score}/100`}>
        <ul className="space-y-2">
          {(showFullBreakdown ? breakdown : breakdown.slice(0, 3)).map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-[12px]">
              <span
                className={`inline-flex items-center justify-center min-w-[38px] px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold ${
                  b.contribution >= 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {b.contribution > 0 ? `+${b.contribution}` : b.contribution}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-slate-900 font-medium">{b.label}</div>
                {b.detail && <div className="text-[11px] text-slate-500 mt-0.5">{b.detail}</div>}
              </div>
            </li>
          ))}
        </ul>
        {breakdown.length > 3 && (
          <button
            onClick={() => setShowFullBreakdown(v => !v)}
            className="mt-2 text-[11px] font-medium text-propsight-600 hover:underline inline-flex items-center gap-1"
          >
            {showFullBreakdown ? (
              <>
                <ChevronUp size={11} /> Réduire
              </>
            ) : (
              <>
                <ChevronDown size={11} /> Voir le détail complet
              </>
            )}
          </button>
        )}
      </Card>
    </div>
  );
};

export default OngletResume;
