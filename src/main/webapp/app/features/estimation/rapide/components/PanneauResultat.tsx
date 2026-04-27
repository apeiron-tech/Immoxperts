import React from 'react';
import { TrendingUp, ArrowUpRight, Bookmark, FileText, Users, Star } from 'lucide-react';
import { AvmResult, EstimationFormData } from '../../types';
import BlocSolvabilite from '../../components/shared/BlocSolvabilite';

interface Props {
  avm: AvmResult | null;
  loading: boolean;
  bien: Partial<EstimationFormData>;
  onPromouvoir: () => void;
}

const SkeletonLine: React.FC<{ w?: string }> = ({ w = 'w-full' }) => (
  <div className={`h-3 ${w} bg-slate-200 rounded animate-pulse`} />
);

const PanneauResultat: React.FC<Props> = ({ avm, loading, bien, onPromouvoir }) => {
  if (!avm && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16 text-slate-400">
        <TrendingUp size={32} className="mb-3 opacity-30" />
        <p className="text-sm font-medium mb-1">Estimation AVM</p>
        <p className="text-xs">Commencez par saisir l'adresse et les caractéristiques du bien pour calculer une estimation.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-5 space-y-4">
        <SkeletonLine w="w-1/3" />
        <div className="space-y-2">
          <SkeletonLine w="w-2/3" />
          <SkeletonLine w="w-1/2" />
          <SkeletonLine w="w-3/4" />
        </div>
        <SkeletonLine />
        <SkeletonLine w="w-4/5" />
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-200 rounded animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!avm) return null;

  const { prix, loyer, ajustements, comparables, marche_reference } = avm;
  const confidenceDots = Math.round(prix.confiance * 5);
  const confidenceColor =
    prix.confiance_label === 'fort' ? 'text-green-600' : prix.confiance_label === 'bon' ? 'text-orange-500' : 'text-red-500';

  const ecartColor = marche_reference.ecart_vs_marche_pct >= 0 ? 'text-green-600' : 'text-red-500';
  const ecartSign = marche_reference.ecart_vs_marche_pct >= 0 ? '+' : '';

  return (
    <div className="p-5 space-y-5">
      {/* Prix estimé */}
      <div>
        <p className="text-xs text-slate-500 mb-1">Prix estimé</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900">{prix.estimation.toLocaleString('fr-FR')} €</span>
          <span className="text-sm text-slate-500">{prix.prix_m2.toLocaleString('fr-FR')} €/m²</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs text-slate-400">
            {prix.fourchette_basse.toLocaleString('fr-FR')} – {prix.fourchette_haute.toLocaleString('fr-FR')} €
          </span>
          <span className="text-slate-300">·</span>
          <div className={`flex gap-0.5 ${confidenceColor}`}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= confidenceDots ? 'bg-current' : 'bg-slate-200'}`} />
            ))}
          </div>
          <span className={`text-xs capitalize ${confidenceColor}`}>Fiabilité {prix.confiance_label}</span>
        </div>
      </div>

      {/* Loyer estimé */}
      <div className="border border-slate-200 rounded-md p-3 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Loyer estimé</p>
            <p className="text-lg font-semibold text-slate-900">{loyer.estimation.toLocaleString('fr-FR')} €/mois</p>
            <p className="text-xs text-slate-400">{loyer.loyer_m2} €/m² · Rendement brut {loyer.rendement_brut}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Fourchette</p>
            <p className="text-xs text-slate-600">{loyer.fourchette_basse.toLocaleString('fr-FR')} – {loyer.fourchette_haute.toLocaleString('fr-FR')} €</p>
          </div>
        </div>
      </div>

      {/* Marché référence */}
      <div className="text-xs text-slate-500">
        Marché : {marche_reference.prix_m2_bas.toLocaleString('fr-FR')} – {marche_reference.prix_m2_haut.toLocaleString('fr-FR')} €/m²
        (médiane {marche_reference.prix_m2_median.toLocaleString('fr-FR')}) ·{' '}
        <span className={ecartColor}>{ecartSign}{marche_reference.ecart_vs_marche_pct}% vs marché</span>
      </div>

      {/* Ajustements */}
      {ajustements.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ajustements</p>
          <div className="space-y-1">
            {ajustements.slice(0, 5).map((adj, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{adj.libelle}</span>
                <span className={`font-medium ${adj.positif ? 'text-green-600' : 'text-red-500'}`}>
                  {adj.positif ? '+' : ''}{adj.delta_m2 > 0 ? adj.delta_m2.toLocaleString('fr-FR') : adj.delta_m2.toLocaleString('fr-FR')} €/m²
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Solvabilité compacte */}
      {bien.ville && prix.estimation > 0 && (
        <div className="border border-slate-200 rounded-md p-3 bg-white">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Solvabilité acheteurs</p>
          <BlocSolvabilite prix={prix.estimation} ville={bien.ville || 'Paris'} />
        </div>
      )}

      {/* Comparables */}
      {comparables.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Comparables</p>
          <div className="space-y-2">
            {comparables.slice(0, 5).map(comp => (
              <div
                key={comp.id}
                className="flex items-center gap-2 border border-slate-200 rounded-md p-2 bg-white hover:border-slate-300 transition-colors cursor-pointer"
              >
                <img src={comp.photo_url} alt="" className="w-12 h-9 object-cover rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate">{comp.adresse}</p>
                  <p className="text-xs text-slate-400">{comp.surface}m² · {comp.nb_pieces}P · DPE {comp.dpe} · {comp.type === 'dvf' ? 'DVF' : 'Annonce'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-900">{comp.prix.toLocaleString('fr-FR')} €</p>
                  <p className="text-xs text-slate-400">{comp.prix_m2.toLocaleString('fr-FR')} €/m²</p>
                  <p className="text-xs text-propsight-500">{Math.round(comp.score_similarite * 100)}% sim.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="border-t border-slate-200 pt-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Actions rapides</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onPromouvoir}
            className="flex items-center gap-1.5 px-3 py-2 text-xs bg-propsight-600 text-white rounded-md hover:bg-propsight-700 transition-colors font-medium"
          >
            <ArrowUpRight size={13} />
            Promouvoir en AdV
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors">
            <FileText size={13} />
            Étude locative
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors">
            <Users size={13} />
            Créer un lead
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors">
            <Bookmark size={13} />
            Suivre ce bien
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanneauResultat;
