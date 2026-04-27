import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ReferentielExpertise } from '../../types';

interface Props {
  referentiel: ReferentielExpertise;
  size?: 'sm' | 'md';
}

const LABELS: Record<ReferentielExpertise, string> = {
  RICS: 'RICS',
  TEGOVA: 'TEGOVA',
  RICS_TEGOVA: 'RICS · TEGOVA',
};

const ConformiteBadge: React.FC<Props> = ({ referentiel, size = 'md' }) => {
  const isSm = size === 'sm';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-semibold uppercase tracking-wider bg-propsight-100 text-propsight-700 ring-1 ring-inset ring-propsight-200 ${
        isSm ? 'px-1.5 h-[18px] text-[9px]' : 'px-2 h-5 text-[10px]'
      }`}
      title={`Rapport conforme ${LABELS[referentiel]}`}
    >
      <ShieldCheck size={isSm ? 9 : 10} />
      {LABELS[referentiel]}
    </span>
  );
};

export default ConformiteBadge;
