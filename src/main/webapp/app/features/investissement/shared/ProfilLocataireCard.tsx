import React from 'react';
import { Users } from 'lucide-react';
import { LocataireProfile } from '../types';
import { labelLocataire, labelProfondeur } from '../utils/persona';
import { formatEuro } from '../utils/finances';

interface Props {
  profil: LocataireProfile;
  title?: string;
  className?: string;
}

const ProfilLocataireCard: React.FC<Props> = ({ profil, title = 'Profil locataire cible & profondeur de demande', className = '' }) => {
  return (
    <div className={`rounded-md border border-propsight-100 bg-gradient-to-br from-propsight-50/60 to-white p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Users size={14} className="text-propsight-600" />
        <h4 className="text-xs font-semibold text-slate-700">{title}</h4>
      </div>
      <div className="grid grid-cols-3 gap-4 text-xs">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5">Cible dominante</div>
          <div className="text-sm font-semibold text-slate-900">{labelLocataire(profil.type_dominant)}</div>
          {profil.types_secondaires.length > 0 && (
            <div className="text-[11px] text-slate-500 mt-0.5">+ {profil.types_secondaires.map(labelLocataire).join(', ')}</div>
          )}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5">Profondeur</div>
          <div className="text-sm font-semibold text-slate-900">{labelProfondeur(profil.profondeur_demande)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5">Revenu indicatif requis</div>
          <div className="text-sm font-semibold text-slate-900">{formatEuro(profil.revenu_indicatif_requis, '/mois')}</div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-propsight-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Taux d'effort : {Math.round(profil.taux_effort_reference * 100)}% · Part compatible : {Math.round(profil.part_population_eligible * 100)}%</span>
        <span>Confiance : {profil.niveau_confiance}</span>
      </div>
    </div>
  );
};

export default ProfilLocataireCard;
