import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { computeSolvabilite } from '../../utils/avmEngine';

interface Props {
  prix: number;
  ville: string;
}

const BlocSolvabilite: React.FC<Props> = ({ prix, ville }) => {
  const [sliderPrix, setSliderPrix] = useState(prix);
  const [hypothesesOpen, setHypothesesOpen] = useState(false);

  useEffect(() => {
    setSliderPrix(prix);
  }, [prix]);

  const data = computeSolvabilite(sliderPrix, ville);

  const positionnement =
    data.part_eligible >= data.benchmark + 0.05
      ? 'au_dessus_mediane'
      : data.part_eligible >= data.benchmark - 0.05
        ? 'proche_mediane'
        : 'en_dessous_mediane';

  const positionnementColor =
    positionnement === 'au_dessus_mediane' ? 'text-green-600' : positionnement === 'proche_mediane' ? 'text-orange-500' : 'text-red-500';

  const positionnementMsg =
    positionnement === 'au_dessus_mediane'
      ? 'Le bien est accessible à une large part des ménages de ce secteur.'
      : positionnement === 'proche_mediane'
        ? 'Le bien est dans la moyenne d\'accessibilité du quartier.'
        : 'Le bien est peu accessible — public cible restreint, délais de vente potentiellement plus longs.';

  const markerPct = Math.round(data.benchmark * 100);
  const eligiblePct = Math.round(data.part_eligible * 100);

  const PROFILS = [
    { label: 'Couple', value: data.repartition.couple },
    { label: 'Personne seule', value: data.repartition.personne_seule },
    { label: 'Famille', value: data.repartition.famille },
    { label: 'Monoparental', value: data.repartition.monoparental },
  ];

  const minPrix = Math.round(sliderPrix * 0.5);
  const maxPrix = Math.round(sliderPrix * 2.0);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-xs text-slate-500 mb-1">Part de ménages éligibles</p>
        <p className={`text-4xl font-bold ${positionnementColor}`}>{eligiblePct}%</p>
        <p className={`text-xs mt-1 ${positionnementColor}`}>{positionnementMsg}</p>
      </div>

      {/* Barre avec marker */}
      <div className="relative">
        <div className="h-3 bg-gradient-to-r from-red-200 via-orange-200 to-green-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${positionnement === 'au_dessus_mediane' ? 'bg-green-500' : positionnement === 'proche_mediane' ? 'bg-orange-400' : 'bg-red-400'}`}
            style={{ width: `${Math.min(100, eligiblePct)}%` }}
          />
        </div>
        <div
          className="absolute top-0 h-3 w-0.5 bg-slate-700"
          style={{ left: `${Math.min(95, markerPct)}%` }}
        />
        <div
          className="absolute -top-5 text-xs text-slate-500 -translate-x-1/2"
          style={{ left: `${Math.min(95, markerPct)}%` }}
        >
          médiane
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>{minPrix.toLocaleString('fr-FR')} €</span>
          <span className="font-medium text-slate-700">{sliderPrix.toLocaleString('fr-FR')} €</span>
          <span>{maxPrix.toLocaleString('fr-FR')} €</span>
        </div>
        <input
          type="range"
          min={minPrix}
          max={maxPrix}
          step={Math.round(sliderPrix * 0.01)}
          value={sliderPrix}
          onChange={e => setSliderPrix(Number(e.target.value))}
          className="w-full accent-propsight-600"
        />
        <p className="text-xs text-slate-400 text-center">Ajustez le prix pour voir l'impact sur l'accessibilité</p>
      </div>

      {/* Répartition profils */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Répartition par profil</p>
        {PROFILS.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-xs text-slate-600 w-28 flex-shrink-0">{label}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-propsight-400 rounded-full"
                style={{ width: `${Math.min(100, Math.round(value * 100))}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 w-8 text-right">{Math.round(value * 100)}%</span>
          </div>
        ))}
      </div>

      {/* Hypothèses dépliables */}
      <div className="border border-slate-200 rounded-md overflow-hidden">
        <button
          type="button"
          onClick={() => setHypothesesOpen(o => !o)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <span className="font-medium">Hypothèses de calcul</span>
          {hypothesesOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
        {hypothesesOpen && (
          <div className="border-t border-slate-200 px-3 py-2 bg-slate-50 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-slate-400">Taux</p>
              <p className="text-xs font-medium text-slate-700">3,63% (25 ans)</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Apport</p>
              <p className="text-xs font-medium text-slate-700">10%</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Taux d'endettement</p>
              <p className="text-xs font-medium text-slate-700">33%</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Revenu nécessaire</p>
              <p className="text-xs font-medium text-slate-700">{data.revenu_necessaire.toLocaleString('fr-FR')} €/mois</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlocSolvabilite;
