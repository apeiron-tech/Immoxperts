import React from 'react';
import { X, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { ZoneRadar } from '../types';
import { BadgeScore, BadgeSource, Pill } from '../components/shared/Badges';

interface Props {
  zone: ZoneRadar | null;
  onClose: () => void;
  onVoirSignaux: () => void;
  onCreerAlerte: () => void;
}

const priorityLabel = (p: ZoneRadar['priorite']) => (p === 'chaude' ? 'Zone chaude' : p === 'interessante' ? 'Intéressante' : 'Froide');
const priorityColor = (p: ZoneRadar['priorite']) =>
  p === 'chaude' ? 'bg-rose-50 text-rose-700 ring-rose-200' : p === 'interessante' ? 'bg-propsight-50 text-propsight-700 ring-propsight-200' : 'bg-slate-100 text-slate-600 ring-slate-200';

const DrawerZone: React.FC<Props> = ({ zone, onClose, onVoirSignaux, onCreerAlerte }) => {
  if (!zone) return null;
  const TrendIcon = zone.tendance_30j === 'hausse' ? TrendingUp : zone.tendance_30j === 'baisse' ? TrendingDown : Minus;
  const trendColor =
    zone.tendance_30j === 'hausse'
      ? 'text-emerald-600'
      : zone.tendance_30j === 'baisse'
        ? 'text-rose-600'
        : 'text-slate-500';

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-slate-900/10" onClick={onClose} />
      <aside className="fixed top-0 right-0 bottom-0 z-[100] w-[380px] bg-white border-l border-slate-200 shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Pill className={priorityColor(zone.priorite)}>{priorityLabel(zone.priorite)}</Pill>
            </div>
            <button onClick={onClose} className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-100">
              <X size={15} />
            </button>
          </div>
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-slate-900">Zone sélectionnée</h3>
              <div className="text-sm text-slate-900 font-medium mt-0.5">{zone.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {zone.code_postal} {zone.ville}
              </div>
            </div>
            <BadgeScore score={zone.score_zone} size="lg" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Signaux" value={zone.nb_signaux_total} />
            <Stat label="À traiter" value={Math.floor(zone.nb_signaux_total * 0.35)} />
            <Stat label="Sources" value={4} />
            <Stat
              label="Tendance 7j"
              value={
                <span className={`inline-flex items-center gap-1 ${trendColor}`}>
                  <TrendIcon size={12} />
                  {zone.evolution_pct !== undefined ? `+${zone.evolution_pct}%` : zone.tendance_30j}
                </span>
              }
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
              Top types de signaux
            </div>
            <div className="p-2 space-y-1">
              <TypeRow source="annonce" label="Annonces · Nouveaux biens" count={zone.nb_signaux_annonce} />
              <TypeRow source="dvf" label="DVF · Détentions longues" count={zone.nb_signaux_dvf} />
              <TypeRow source="dpe" label="DPE · Passoires thermiques" count={zone.nb_signaux_dpe} />
              <TypeRow source="zone" label="Zone · Autres signaux" count={zone.nb_biens_concernes - zone.nb_signaux_total > 0 ? 3 : 0} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Pourquoi cette zone est prioritaire
            </div>
            <ul className="space-y-1.5">
              {zone.reasons.map((r, i) => (
                <li key={i} className="text-[12px] text-slate-700 flex items-start gap-2">
                  <span className="h-1 w-1 mt-2 rounded-full bg-propsight-500 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white p-3 space-y-2">
          <button
            onClick={onVoirSignaux}
            className="w-full h-9 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-[13px] font-medium inline-flex items-center justify-center gap-2"
          >
            Voir les signaux ({zone.nb_signaux_total})
          </button>
          <button
            onClick={onCreerAlerte}
            className="w-full h-8 rounded-md border border-slate-200 hover:bg-slate-50 text-[12px] text-slate-700"
          >
            Créer une alerte sur cette zone
          </button>
          <button className="w-full text-[11px] text-slate-500 hover:underline py-1">
            Gérer mes zones dans Veille › Alertes
          </button>
        </div>
      </aside>
    </>
  );
};

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
    <div className="text-[14px] font-semibold text-slate-900 mt-0.5 tabular-nums">{value}</div>
  </div>
);

const TypeRow: React.FC<{ source: 'annonce' | 'dvf' | 'dpe' | 'zone'; label: string; count: number }> = ({
  source,
  label,
  count,
}) => (
  <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-50 cursor-pointer">
    <div className="flex items-center gap-2 min-w-0">
      <BadgeSource source={source} size="xs" showLabel={false} />
      <span className="text-[11px] text-slate-700 truncate">{label}</span>
    </div>
    <div className="flex items-center gap-1 text-[11px] text-slate-500">
      <span className="tabular-nums">{count}</span>
      <ChevronRight size={11} />
    </div>
  </div>
);

export default DrawerZone;
