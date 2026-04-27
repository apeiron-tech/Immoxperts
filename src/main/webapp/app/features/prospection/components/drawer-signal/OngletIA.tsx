import React from 'react';
import { Lightbulb, AlertTriangle, Target } from 'lucide-react';
import { SignalProspection, MetaSignalRadar } from '../../types';

interface Props {
  signal: SignalProspection | MetaSignalRadar;
}

const Bloc: React.FC<{ icon: React.ReactNode; title: string; content: string; color: string }> = ({
  icon,
  title,
  content,
  color,
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3">
    <div className="flex items-center gap-2 mb-1.5">
      <span className={`h-6 w-6 rounded-md flex items-center justify-center ${color}`}>{icon}</span>
      <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">{title}</span>
    </div>
    <p className="text-[12px] text-slate-700 leading-relaxed">{content}</p>
  </div>
);

const OngletIA: React.FC<Props> = ({ signal }) => {
  const isMeta = 'children' in signal;
  const source = isMeta ? signal.children[0].source : signal.source;

  const angle =
    source === 'annonce'
      ? 'Contactez en mettant en avant la baisse récente et le délai de vente. Approche directe recommandée.'
      : source === 'dvf'
        ? 'Contactez le propriétaire sur l\'angle de la valorisation actuelle de son bien. Préparez 3 comparables récents.'
        : 'Contactez le propriétaire sur l\'angle DPE / rénovation énergétique. Préparez un estimatif de travaux.';

  const objection =
    source === 'dpe'
      ? 'Le coût des travaux peut être perçu comme excessif. Préparer un scénario avec aides MaPrimeRénov\' et revalorisation post-travaux.'
      : 'Le prix reste au-dessus du marché. Préparer 3 comparables récents sous la médiane du secteur.';

  const nba =
    source === 'dpe'
      ? 'Créer un lead bailleur + proposer un audit énergétique sous 7 jours.'
      : 'Créer un lead vendeur + RDV d\'estimation sous 7 jours.';

  return (
    <div className="space-y-3">
      <Bloc
        icon={<Lightbulb size={13} className="text-white" />}
        title="Angle de contact suggéré"
        content={angle}
        color="bg-propsight-500"
      />
      <Bloc
        icon={<AlertTriangle size={13} className="text-white" />}
        title="Objection probable"
        content={objection}
        color="bg-amber-500"
      />
      <Bloc
        icon={<Target size={13} className="text-white" />}
        title="Next best action"
        content={nba}
        color="bg-emerald-500"
      />
      <p className="text-[10px] text-slate-400 text-center italic">
        Suggestions contextuelles — branchement LLM en V1.5
      </p>
    </div>
  );
};

export default OngletIA;
