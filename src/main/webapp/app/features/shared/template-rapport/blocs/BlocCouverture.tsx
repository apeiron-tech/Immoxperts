import React from 'react';
import { BlocComponentProps } from '../types';

const RAPPORT_LABEL: Record<string, string> = {
  avis_valeur: 'Avis de valeur',
  etude_locative: 'Étude locative',
  dossier_invest: 'Dossier d’investissement',
};

const BlocCouverture: React.FC<BlocComponentProps> = ({ data, blocConfig }) => {
  const { estimation, agence, conseiller, type, date_rapport } = data;
  const surtitre = (blocConfig.customContent?.surtitre as string) || RAPPORT_LABEL[type];
  const titre =
    (blocConfig.customContent?.titre as string) ||
    `${estimation.bien.adresse}, ${estimation.bien.code_postal} ${estimation.bien.ville}`;
  const sousTitre =
    (blocConfig.customContent?.sous_titre as string) ||
    (estimation.client ? `À l'attention de ${estimation.client.civilite} ${estimation.client.prenom} ${estimation.client.nom}` : '');
  const dateLisible = new Date(date_rapport).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="rapport-bloc rapport-couverture flex flex-col items-center justify-center text-center px-12 py-16 min-h-[600px] bg-gradient-to-br from-propsight-50 via-white to-propsight-50">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-propsight-600 mb-3">{surtitre}</div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2 max-w-2xl leading-snug">{titre}</h1>
      {sousTitre && <p className="text-sm text-slate-600 mb-10">{sousTitre}</p>}

      <div className="w-20 h-px bg-propsight-300 mb-10" />

      <div className="grid grid-cols-2 gap-12 max-w-xl w-full text-left">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Présenté par</p>
          <p className="text-sm font-semibold text-slate-900">{conseiller.prenom} {conseiller.nom}</p>
          <p className="text-xs text-slate-500">{conseiller.titre}</p>
          <p className="text-xs text-slate-500 mt-2">{agence.nom}</p>
          <p className="text-xs text-slate-400">{agence.adresse}, {agence.code_postal} {agence.ville}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Date du rapport</p>
          <p className="text-sm font-semibold text-slate-900">{dateLisible}</p>
          <p className="text-xs text-slate-500 mt-2">Référence</p>
          <p className="text-xs text-slate-400 font-mono">{estimation.id.slice(0, 12).toUpperCase()}</p>
        </div>
      </div>

      <div className="mt-12 text-[10px] text-slate-400 uppercase tracking-wider">{agence.nom} · {agence.site}</div>
    </div>
  );
};

export default BlocCouverture;
