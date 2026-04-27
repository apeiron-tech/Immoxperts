import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BlocComponentProps } from '../types';

const BlocPrixMarche: React.FC<BlocComponentProps> = ({ data }) => {
  const { estimation } = data;
  const ref = estimation.avm?.marche_reference;

  if (!ref) {
    return (
      <div className="rapport-bloc px-10 py-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-4">Prix du marché secteur</h2>
        <p className="text-sm text-slate-400 italic">Données AVM non disponibles.</p>
      </div>
    );
  }

  const ecart = ref.ecart_vs_marche_pct;
  const positionnement = ecart > 5 ? 'surcote' : ecart < -5 ? 'decote' : 'aligne';
  const Icon = positionnement === 'surcote' ? TrendingUp : positionnement === 'decote' ? TrendingDown : Minus;
  const couleur = positionnement === 'surcote' ? 'text-amber-600' : positionnement === 'decote' ? 'text-emerald-600' : 'text-slate-500';
  const message =
    positionnement === 'surcote'
      ? `Surcote de +${ecart.toFixed(1)}% par rapport au prix de référence du secteur`
      : positionnement === 'decote'
      ? `Décote de ${ecart.toFixed(1)}% par rapport au prix de référence du secteur`
      : `Estimation alignée avec le prix de référence du secteur (écart ${ecart > 0 ? '+' : ''}${ecart.toFixed(1)}%)`;

  // Mini courbe SVG simulée 12 mois
  const points = [85, 87, 86, 88, 89, 91, 92, 90, 93, 94, 95, 97];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const W = 320;
  const H = 60;
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * W;
      const y = H - ((v - min) / (max - min)) * (H - 8) - 4;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="rapport-bloc rapport-prix-marche px-10 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-4">Prix du marché secteur</h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card label="Fourchette basse" value={`${ref.prix_m2_bas.toLocaleString('fr-FR')} €/m²`} sub="10e percentile" tone="low" />
        <Card label="Prix médian" value={`${ref.prix_m2_median.toLocaleString('fr-FR')} €/m²`} sub="50e percentile" tone="median" highlight />
        <Card label="Fourchette haute" value={`${ref.prix_m2_haut.toLocaleString('fr-FR')} €/m²`} sub="90e percentile" tone="high" />
      </div>

      <div className={`flex items-center gap-2 px-4 py-3 rounded-md border bg-slate-50 ${couleur} mb-6`}>
        <Icon size={16} />
        <p className="text-sm font-medium text-slate-700">{message}</p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Évolution sur 12 mois (€/m²)</p>
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <svg width={W} height={H} className="overflow-visible">
            <defs>
              <linearGradient id="curve-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6D4DE8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#6D4DE8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${path} L${W},${H} L0,${H} Z`} fill="url(#curve-grad)" />
            <path d={path} fill="none" stroke="#6D4DE8" strokeWidth="2" />
            {points.map((v, i) => {
              const x = (i / (points.length - 1)) * W;
              const y = H - ((v - min) / (max - min)) * (H - 8) - 4;
              return <circle key={i} cx={x} cy={y} r={2.5} fill="#6D4DE8" />;
            })}
          </svg>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Mai 2025</span>
            <span>Avr 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ label: string; value: string; sub: string; tone: 'low' | 'median' | 'high'; highlight?: boolean }> = ({ label, value, sub, highlight }) => (
  <div className={`rounded-md border px-4 py-3 ${highlight ? 'border-propsight-300 bg-propsight-50/50' : 'border-slate-200 bg-white'}`}>
    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1">{label}</p>
    <p className={`text-base font-bold tabular-nums ${highlight ? 'text-propsight-700' : 'text-slate-900'}`}>{value}</p>
    <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
  </div>
);

export default BlocPrixMarche;
