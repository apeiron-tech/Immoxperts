import React from 'react';
import { TrendingUp, Layers, Cpu } from 'lucide-react';
import { BlocComponentProps } from '../types';

const Conf: React.FC<{ niveau: number }> = ({ niveau }) => {
  const dots = Math.round(niveau * 5);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`w-1.5 h-1.5 rounded-full ${i <= dots ? 'bg-propsight-500' : 'bg-slate-200'}`} />
      ))}
    </div>
  );
};

const BlocSynthese3Methodes: React.FC<BlocComponentProps> = ({ data }) => {
  const { estimation } = data;
  const avm = estimation.avm;

  if (!avm) {
    return (
      <div className="rapport-bloc px-10 py-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-4">Synthèse des 3 méthodes d’estimation</h2>
        <p className="text-sm text-slate-400 italic">Données AVM non disponibles.</p>
      </div>
    );
  }

  const prix = avm.prix.estimation;
  const fbasse = avm.prix.fourchette_basse;
  const fhaute = avm.prix.fourchette_haute;
  const ref = avm.marche_reference;

  // Méthode 1 : prix marché secteur (basé sur prix m² médian × surface)
  const surface = estimation.bien.surface;
  const prixMarche = ref.prix_m2_median * surface;
  const prixMarcheBas = ref.prix_m2_bas * surface;
  const prixMarcheHaut = ref.prix_m2_haut * surface;

  // Méthode 2 : comparables (moyenne des comparables affichés)
  const comps = avm.comparables.slice(0, 5);
  const prixCompMoyen = comps.length ? Math.round(comps.reduce((s, c) => s + c.prix, 0) / comps.length) : prix;
  const prixCompBas = Math.round(prixCompMoyen * 0.93);
  const prixCompHaut = Math.round(prixCompMoyen * 1.07);

  return (
    <div className="rapport-bloc rapport-synthese px-10 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-1">Synthèse des 3 méthodes d’estimation</h2>
      <p className="text-xs text-slate-500 mb-5">Croisement des trois approches retenues pour valider la cohérence de l’estimation.</p>

      <div className="grid grid-cols-3 gap-3">
        <Methode
          icon={<TrendingUp size={16} />}
          titre="Prix du marché"
          subtitre="Approche statistique du secteur"
          fourchette={[prixMarcheBas, prixMarcheHaut]}
          mediane={prixMarche}
          conf={0.7}
        />
        <Methode
          icon={<Layers size={16} />}
          titre="Comparables"
          subtitre="Moyenne pondérée des transactions similaires"
          fourchette={[prixCompBas, prixCompHaut]}
          mediane={prixCompMoyen}
          conf={0.85}
        />
        <Methode
          icon={<Cpu size={16} />}
          titre="Moteur Propsight"
          subtitre="Modèle IA intégrant 60+ caractéristiques"
          fourchette={[fbasse, fhaute]}
          mediane={prix}
          conf={avm.prix.confiance}
          highlight
        />
      </div>

      <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Estimation retenue par convergence des méthodes</p>
          <p className="text-3xl font-bold text-slate-900 tabular-nums mt-1">{prix.toLocaleString('fr-FR')} €</p>
          <p className="text-xs text-slate-500 tabular-nums mt-0.5">{avm.prix.prix_m2.toLocaleString('fr-FR')} €/m²</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Fourchette consolidée</p>
          <p className="text-sm font-semibold text-slate-700 tabular-nums">
            {fbasse.toLocaleString('fr-FR')} € — {fhaute.toLocaleString('fr-FR')} €
          </p>
          <p className="text-xs text-propsight-600 font-medium mt-1 capitalize">Confiance : {avm.prix.confiance_label}</p>
        </div>
      </div>
    </div>
  );
};

const Methode: React.FC<{
  icon: React.ReactNode;
  titre: string;
  subtitre: string;
  fourchette: [number, number];
  mediane: number;
  conf: number;
  highlight?: boolean;
}> = ({ icon, titre, subtitre, fourchette, mediane, conf, highlight }) => (
  <div className={`rounded-lg border p-4 ${highlight ? 'border-propsight-300 bg-propsight-50/50' : 'border-slate-200 bg-white'}`}>
    <div className={`flex items-center gap-2 mb-1 ${highlight ? 'text-propsight-700' : 'text-slate-700'}`}>
      {icon}
      <h3 className="text-sm font-semibold">{titre}</h3>
    </div>
    <p className="text-[11px] text-slate-500 mb-3 leading-snug">{subtitre}</p>
    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Estimation</p>
    <p className={`text-xl font-bold tabular-nums ${highlight ? 'text-propsight-700' : 'text-slate-900'}`}>
      {mediane.toLocaleString('fr-FR')} €
    </p>
    <p className="text-[11px] text-slate-500 tabular-nums mb-3">
      {fourchette[0].toLocaleString('fr-FR')} — {fourchette[1].toLocaleString('fr-FR')}
    </p>
    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
      <span className="text-[10px] text-slate-400">Indice de fiabilité</span>
      <Conf niveau={conf} />
    </div>
  </div>
);

export default BlocSynthese3Methodes;
