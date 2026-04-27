import React from 'react';
import { Building2, Phone, Mail, Globe } from 'lucide-react';
import { BlocComponentProps } from '../types';

const BlocAgence: React.FC<BlocComponentProps> = ({ data, blocConfig }) => {
  const { agence } = data;
  const description = (blocConfig.customContent?.description as string) || agence.description;

  return (
    <div className="rapport-bloc rapport-agence px-10 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-4">Présentation de l’agence</h2>

      <div className="flex gap-6 items-start">
        <div className="w-20 h-20 rounded-lg bg-propsight-100 flex items-center justify-center flex-shrink-0">
          <Building2 size={32} className="text-propsight-600" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{agence.nom}</h3>
          <p className="text-sm text-slate-500 mb-3">{agence.adresse}, {agence.code_postal} {agence.ville}</p>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">{description}</p>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Phone size={12} className="text-slate-400" />
              {agence.telephone}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Mail size={12} className="text-slate-400" />
              {agence.email}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Globe size={12} className="text-slate-400" />
              {agence.site}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex gap-6 text-xs text-slate-400">
            <span>SIRET : {agence.siret}</span>
            <span>Carte T : {agence.carte_t}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlocAgence;
