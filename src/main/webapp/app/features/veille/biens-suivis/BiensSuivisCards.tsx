import React from 'react';
import { Heart, TrendingDown, TrendingUp, Bell, UserPlus, Layers, MoreHorizontal } from 'lucide-react';
import { BienSuivi } from '../types';
import {
  DpeBadge,
  ScoreInteretBadge,
  AnnonceStatusBadge,
  FreshnessLabel,
} from '../components/shared/primitives';
import { fmtEuro, fmtEuroM2, fmtPct, fmtSurface } from '../utils/format';

interface Props {
  rows: BienSuivi[];
  onRowClick: (id: string) => void;
}

const BiensSuivisCards: React.FC<Props> = ({ rows, onRowClick }) => (
  <div className="flex-1 overflow-auto bg-slate-50 p-3">
    <div className="grid grid-cols-3 gap-3">
      {rows.map(b => (
        <button
          key={b.id}
          onClick={() => onRowClick(b.id)}
          className="bg-white rounded-md border border-slate-200 overflow-hidden text-left hover:border-propsight-300 hover:shadow-md transition-all"
        >
          {/* Photo */}
          <div className="relative h-[140px] bg-slate-200">
            {b.photo_url ? <img src={b.photo_url} alt={b.adresse} className="h-full w-full object-cover" /> : null}
            <button className="absolute top-2 right-2 h-7 w-7 rounded-md bg-white/90 backdrop-blur shadow-sm inline-flex items-center justify-center text-rose-500">
              <Heart size={13} className="fill-rose-500" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex items-start justify-between gap-1 mb-1">
              <h4 className="text-[12.5px] font-semibold text-slate-900 leading-tight">
                {b.type_bien} {b.pieces ? `T${b.pieces}` : ''} · {b.ville}
              </h4>
              <DpeBadge classe={b.dpe} size="sm" />
            </div>
            <p className="text-[10.5px] text-slate-500 mb-2 truncate">
              {fmtSurface(b.surface)} · {b.adresse}
            </p>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[15px] font-semibold text-slate-900 tabular-nums">{fmtEuro(b.prix_actuel)}</span>
              <span className="text-[10.5px] text-slate-500">· {fmtEuroM2(b.prix_m2)}</span>
            </div>
            {b.variation_pct !== undefined && b.variation_pct !== 0 && (
              <div
                className={`text-[11px] font-medium inline-flex items-center gap-0.5 mb-2 ${
                  b.variation_pct < 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {b.variation_pct < 0 ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                {fmtPct(b.variation_pct)}
              </div>
            )}

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
              <AnnonceStatusBadge status={b.statut_annonce} />
              <ScoreInteretBadge score={b.score_interet} label={b.score_label} compact />
            </div>

            <div className="mt-2 flex items-center gap-3 text-[10.5px] text-slate-500">
              {b.last_event_at && (
                <span>
                  Événement : <FreshnessLabel iso={b.last_event_at} />
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-[10.5px] text-slate-500">
              {b.alertes_actives.length > 0 && (
                <span className="inline-flex items-center gap-0.5">
                  <Bell size={10} className="text-propsight-500" />
                  {b.alertes_actives.length}
                </span>
              )}
              {b.leads_count > 0 && (
                <span className="inline-flex items-center gap-0.5">
                  <UserPlus size={10} />
                  {b.leads_count} lead
                </span>
              )}
              {b.analyse_tri_pct && (
                <span className="inline-flex items-center gap-0.5">
                  <Layers size={10} />
                  Analyse
                </span>
              )}
              <span className="ml-auto">
                <MoreHorizontal size={12} />
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default BiensSuivisCards;
