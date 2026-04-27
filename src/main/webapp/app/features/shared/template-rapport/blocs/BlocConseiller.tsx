import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { BlocComponentProps } from '../types';

const BlocConseiller: React.FC<BlocComponentProps> = ({ data, blocConfig }) => {
  const { conseiller } = data;
  const bio = (blocConfig.customContent?.bio as string) || conseiller.bio;

  return (
    <div className="rapport-bloc rapport-conseiller px-10 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-4">Votre interlocuteur</h2>

      <div className="flex gap-5 items-start">
        <img
          src={conseiller.photo_url}
          alt={`${conseiller.prenom} ${conseiller.nom}`}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-propsight-50"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{conseiller.prenom} {conseiller.nom}</h3>
          <p className="text-sm text-propsight-600 font-medium mb-2">{conseiller.titre}</p>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">{bio}</p>
          <div className="flex gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" />{conseiller.telephone}</span>
            <span className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400" />{conseiller.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlocConseiller;
