import React from 'react';
import { ArrowRight, FolderPlus, MoreHorizontal } from 'lucide-react';
import { ProjetInvestisseur } from '../../types';
import { formatPrice } from '../../utils/finances';
import { labelStrategy } from '../../utils/persona';
import ProfilLocatairePill from '../../shared/ProfilLocatairePill';

interface Props {
  projet: ProjetInvestisseur;
  onOpen: () => void;
  onCreateDossier: () => void;
}

const ProjetCard: React.FC<Props> = ({ projet, onOpen, onCreateDossier }) => {
  const statusColor = projet.status === 'actif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : projet.status === 'pause' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200';

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 hover:border-propsight-300 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border capitalize ${statusColor}`}>
              {projet.status === 'actif' ? 'Actif' : projet.status === 'pause' ? 'En pause' : 'Archivé'}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900">{projet.name}</h3>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {projet.target_zones.join(', ')} · {formatPrice(projet.budget_max)} · {labelStrategy(projet.strategy_type)}
          </div>
        </div>
        <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">
          <MoreHorizontal size={13} />
        </button>
      </div>

      {/* Progression */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
          <span>Étape actuelle : comparer des biens</span>
          <span>{projet.progression_pct}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-propsight-500 rounded-full" style={{ width: `${projet.progression_pct}%` }} />
        </div>
      </div>

      {/* Compteurs */}
      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
        <Counter value={projet.nb_opportunites} label="Opportunités" />
        <Counter value={projet.target_zones.length} label="Villes" />
        <Counter value={1} label="Dossier" />
      </div>

      {projet.profil_locataire_cible && <ProfilLocatairePill profil={projet.profil_locataire_cible} compact className="mb-3" />}

      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <button type="button" onClick={onOpen} className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-propsight-600 text-white text-xs font-medium py-1.5 hover:bg-propsight-700">
          <ArrowRight size={12} />
          Ouvrir le projet
        </button>
        <button type="button" onClick={onCreateDossier} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 px-2.5 py-1.5 hover:bg-slate-50">
          <FolderPlus size={12} />
          Créer dossier
        </button>
      </div>
    </div>
  );
};

const Counter: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="rounded bg-slate-50 p-2 text-center">
    <div className="text-sm font-bold text-slate-900">{value}</div>
    <div className="text-[10px] text-slate-500">{label}</div>
  </div>
);

export default ProjetCard;
