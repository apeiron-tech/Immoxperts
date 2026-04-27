import React from 'react';
import { Users } from 'lucide-react';
import { LocataireProfile } from '../types';
import { labelLocataire, labelProfondeur } from '../utils/persona';

interface Props {
  profil: LocataireProfile;
  compact?: boolean;
  className?: string;
}

const ProfilLocatairePill: React.FC<Props> = ({ profil, compact = false, className = '' }) => {
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700 ${className}`}>
        <Users size={12} className="text-slate-400" />
        {labelLocataire(profil.type_dominant)}
      </span>
    );
  }
  return (
    <div className={`inline-flex items-center gap-2 rounded-md border border-propsight-100 bg-propsight-50/50 px-2.5 py-1 text-xs ${className}`}>
      <Users size={13} className="text-propsight-600" />
      <span className="text-slate-700">
        Demande : <span className="font-medium text-slate-900">{labelProfondeur(profil.profondeur_demande)}</span> · {labelLocataire(profil.type_dominant)}
      </span>
    </div>
  );
};

export default ProfilLocatairePill;
