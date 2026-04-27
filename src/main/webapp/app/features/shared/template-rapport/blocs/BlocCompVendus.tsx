import React from 'react';
import { Calendar } from 'lucide-react';
import { BlocComponentProps } from '../types';

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const months = Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
  if (months < 1) return 'récemment';
  if (months < 12) return `il y a ${months} mois`;
  const y = Math.round(months / 12);
  return `il y a ${y} an${y > 1 ? 's' : ''}`;
}

const BlocCompVendus: React.FC<BlocComponentProps> = ({ data }) => {
  const { estimation } = data;
  const all = estimation.avm?.comparables || [];
  const dvf = all.filter(c => c.type === 'dvf');
  // Si pas assez de DVF dans l'avm, on affiche tous les comparables
  const liste = (dvf.length >= 4 ? dvf : all).slice(0, 8);

  return (
    <div className="rapport-bloc rapport-comp-vendus px-10 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-1">Biens comparables vendus</h2>
      <p className="text-xs text-slate-500 mb-4">Source : DVF (data.gouv.fr) — sélection des transactions les plus similaires sur 24 mois.</p>

      {liste.length === 0 ? (
        <p className="text-sm text-slate-400 italic py-8 text-center">Aucun comparable disponible.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {liste.map(c => (
            <div key={c.id} className="rounded-md border border-slate-200 overflow-hidden bg-white hover:border-propsight-300 transition-colors">
              <div className="flex">
                <img src={c.photo_url} alt="" className="w-24 h-24 object-cover flex-shrink-0" />
                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-semibold text-slate-900 truncate">{c.adresse}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      c.score_similarite >= 0.85 ? 'bg-emerald-100 text-emerald-700'
                      : c.score_similarite >= 0.7 ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-500'
                    }`}>
                      {Math.round(c.score_similarite * 100)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    {c.surface} m² · {c.nb_pieces}p · ét. {c.etage} · DPE {c.dpe}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 tabular-nums">{c.prix.toLocaleString('fr-FR')} €</p>
                      <p className="text-[11px] text-slate-500 tabular-nums">{c.prix_m2.toLocaleString('fr-FR')} €/m²</p>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar size={9} /> {timeAgo(c.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlocCompVendus;
