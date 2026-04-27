import React from 'react';
import { Heart, MoreHorizontal, TrendingUp } from 'lucide-react';
import { Opportunity } from '../../types';
import { formatPrice } from '../../utils/finances';
import ScoreCircle from '../../shared/ScoreCircle';
import CoherencePill from '../../shared/CoherencePill';
import { DPEBadge } from '../../shared/StatutBadge';
import { labelLocataire, labelProfondeur } from '../../utils/persona';

interface Props {
  opp: Opportunity;
  onOpenAnalyse: () => void;
  onToggleFavori: () => void;
}

const SIGNAL_COLORS: Record<string, string> = {
  'Cash-flow+': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Sous-prix': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Baisse prix': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'PLU fort': 'bg-propsight-50 text-propsight-700 border-propsight-200',
  'Zone tendue': 'bg-propsight-50 text-propsight-700 border-propsight-200',
  Travaux: 'bg-amber-50 text-amber-700 border-amber-200',
  'DPE F/G': 'bg-rose-50 text-rose-700 border-rose-200',
  Lumineux: 'bg-sky-50 text-sky-700 border-sky-200',
  'DPE C': 'bg-lime-50 text-lime-700 border-lime-200',
};

const PLATFORM_COLORS: Record<string, string> = {
  SeLoger: 'bg-rose-100 text-rose-700',
  Leboncoin: 'bg-orange-100 text-orange-700',
  MeilleursAgents: 'bg-sky-100 text-sky-700',
  "Bien'ici": 'bg-amber-100 text-amber-700',
  LogicImmo: 'bg-emerald-100 text-emerald-700',
};

const OpportuniteCard: React.FC<Props> = ({ opp, onOpenAnalyse, onToggleFavori }) => {
  const coherence = opp.score_breakdown.coherence_projet;
  const rendementPct = (opp.loyer_estime * 12) / opp.prix_affiche * 100;

  return (
    <div className="group rounded-md border border-slate-200 bg-white overflow-hidden hover:border-propsight-300 hover:shadow-sm transition-all">
      {/* Photo + overlays */}
      <div className="relative aspect-[4/3] bg-slate-100">
        <img src={opp.bien.photo_url} alt={opp.bien.adresse} className="w-full h-full object-cover" loading="lazy" />
        {/* Platform badge top-left */}
        {opp.bien.source_plateforme && (
          <span className={`absolute top-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 rounded ${PLATFORM_COLORS[opp.bien.source_plateforme] ?? 'bg-slate-100 text-slate-700'}`}>
            {opp.bien.source_plateforme}
          </span>
        )}
        {/* Actions top-right */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onToggleFavori(); }}
            className="h-7 w-7 rounded-full bg-white/95 flex items-center justify-center hover:bg-white shadow-sm"
          >
            <Heart size={13} className={opp.favori ? 'text-rose-500 fill-rose-500' : 'text-slate-600'} />
          </button>
          <button
            type="button"
            onClick={e => e.stopPropagation()}
            className="h-7 w-7 rounded-full bg-white/95 flex items-center justify-center hover:bg-white shadow-sm"
          >
            <MoreHorizontal size={13} className="text-slate-600" />
          </button>
        </div>
        {/* Bottom-left new badge */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {opp.status === 'nouveau' && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-propsight-600 text-white">Nouveau</span>}
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/60 text-white">il y a {opp.ancienneté_annonce_jours}j</span>
        </div>
      </div>

      <div className="p-3 space-y-2.5">
        {/* Adresse */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">{opp.bien.adresse}</div>
              <div className="text-[11px] text-slate-500">{opp.bien.code_postal} {opp.bien.ville}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-base font-bold text-slate-900 tabular-nums">{formatPrice(opp.prix_affiche)}</div>
              <div className="text-[11px] text-slate-500 tabular-nums">{opp.prix_m2.toLocaleString('fr-FR')} €/m²</div>
            </div>
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>{opp.bien.surface} m²</span>
          <span className="text-slate-300">·</span>
          <span>{opp.bien.pieces} pièces</span>
          <span className="text-slate-300">·</span>
          <DPEBadge value={opp.bien.dpe} />
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100">
          <div>
            <div className="text-[10px] text-slate-500">Surface</div>
            <div className="text-sm font-semibold text-slate-900 tabular-nums">{opp.bien.surface} m²</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Rendement</div>
            <div className="text-sm font-semibold text-slate-900 tabular-nums">{rendementPct.toFixed(1)} %</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Cash-flow/mois</div>
            <div className="text-sm font-semibold text-emerald-600 tabular-nums">+{Math.round(opp.loyer_estime * 0.15)} €</div>
          </div>
        </div>

        {/* Profil cible + Cohérence */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
          <span className="inline-flex items-center gap-1 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600">
            <TrendingUp size={10} />
            Demande : {labelProfondeur(opp.profil_cible.profondeur_demande)} · {labelLocataire(opp.profil_cible.type_dominant)}
          </span>
          <CoherencePill pct={coherence} size="sm" />
        </div>

        {/* Signaux */}
        {opp.bien.signaux.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {opp.bien.signaux.slice(0, 3).map(s => (
              <span key={s} className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${SIGNAL_COLORS[s] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Score + CTA */}
        <div className="flex items-center gap-2 pt-1">
          <ScoreCircle score={opp.score_overall} size={44} />
          <button
            type="button"
            onClick={onOpenAnalyse}
            className="flex-1 inline-flex items-center justify-center rounded-md bg-propsight-600 text-white text-xs font-medium py-2 hover:bg-propsight-700"
          >
            Ouvrir l'analyse
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportuniteCard;
