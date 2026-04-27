import React from 'react';
import { MoreHorizontal, Share2, Copy, FolderOpen } from 'lucide-react';
import { DossierInvestissement } from '../../types';
import { formatPrice, formatSigned, formatPct } from '../../utils/finances';
import { StatutDossierBadge } from '../../shared/StatutBadge';
import ProfilLocatairePill from '../../shared/ProfilLocatairePill';

interface Props {
  dossier: DossierInvestissement;
  onOpen: () => void;
  onDuplicate: () => void;
  onShare: () => void;
}

const DossierCard: React.FC<Props> = ({ dossier, onOpen, onDuplicate, onShare }) => {
  return (
    <div className="rounded-md border border-slate-200 bg-white overflow-hidden hover:border-propsight-300 transition-all">
      <div className="relative aspect-[16/9] bg-slate-100">
        <img src={dossier.photo_url} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute top-2 right-2">
          <StatutDossierBadge status={dossier.status} />
        </div>
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/60 text-white">v{dossier.version}</span>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{dossier.title}</h3>
          {dossier.subtitle && <div className="text-[11px] text-slate-500 mt-0.5">{dossier.subtitle}</div>}
        </div>

        <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100">
          <Kpi label="Prix total" value={formatPrice(dossier.kpis.prix_total)} />
          <Kpi label="Cash-flow" value={formatSigned(dossier.kpis.cashflow_atf, '€')} tone={dossier.kpis.cashflow_atf >= 0 ? 'emerald' : 'rose'} />
          <Kpi label="Net-net" value={formatPct(dossier.kpis.rendement_net_net)} />
          <Kpi label="Score" value={dossier.kpis.score > 0 ? `${dossier.kpis.score}/100` : '—'} />
        </div>

        <ProfilLocatairePill profil={dossier.profil_cible} compact className="w-fit" />

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
          <span>MAJ : {new Date(dossier.updated_at).toLocaleDateString('fr-FR')}</span>
          <span>Par {dossier.auteur_nom}</span>
        </div>

        <div className="flex items-center gap-1 pt-1">
          <button
            type="button"
            onClick={onOpen}
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-propsight-600 text-white text-xs font-medium py-1.5 hover:bg-propsight-700"
          >
            <FolderOpen size={12} />
            Ouvrir
          </button>
          <button type="button" onClick={onDuplicate} title="Dupliquer" className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
            <Copy size={13} />
          </button>
          <button type="button" onClick={onShare} title="Partager" className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
            <Share2 size={13} />
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
            <MoreHorizontal size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Kpi: React.FC<{ label: string; value: string; tone?: 'emerald' | 'rose' | 'violet' }> = ({ label, value, tone }) => (
  <div>
    <div className="text-[10px] text-slate-500">{label}</div>
    <div className={`text-xs font-semibold tabular-nums ${tone === 'emerald' ? 'text-emerald-600' : tone === 'rose' ? 'text-rose-600' : 'text-slate-900'}`}>
      {value}
    </div>
  </div>
);

export default DossierCard;
