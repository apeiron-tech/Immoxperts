import React from 'react';
import { Info } from 'lucide-react';
import KpiCard from 'app/shared/ui/KpiCard';
import { Hypotheses, MarcheZone } from '../../types';
import { MarcheCalcs, formatEur } from '../../_utils/calculs';
import { PART_CAPTEE_ACTUELLE } from '../../_mocks/performance';

interface Props {
  zone: MarcheZone;
  hypotheses: Hypotheses;
  calcs: MarcheCalcs;
}

const InfoTip: React.FC<{ tooltip: string }> = ({ tooltip }) => (
  <button type="button" title={tooltip} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
    <Info size={11} />
  </button>
);

const MarcheTiles: React.FC<Props> = ({ zone, hypotheses, calcs }) => (
  <div className="grid grid-cols-4 gap-2">
    <KpiCard
      label="Marché adressable"
      value={formatEur(calcs.marcheAdressable)}
      density="compact"
      labelSuffix={
        <InfoTip
          tooltip={`Volume DVF (${zone.transactions}) × Panier (${formatEur(hypotheses.panierMoyen)}) × Commission (${hypotheses.commissionMoyenne} %)`}
        />
      }
      subtitle={`${zone.transactions} × ${(hypotheses.panierMoyen / 1000).toFixed(0)} k€ × ${hypotheses.commissionMoyenne.toFixed(1)}%`}
    />

    <KpiCard
      label="Part de marché captée"
      value={`${PART_CAPTEE_ACTUELLE.toFixed(2)} %`}
      density="compact"
      labelSuffix={<InfoTip tooltip="Mes mandats signés zone / Total transactions zone" />}
      trend={{ value: '+0,12 pt', direction: 'up' }}
      trendCompare="vs 0,75 %"
    />

    <KpiCard
      label="Potentiel CA cible"
      value={formatEur(calcs.potentielCible)}
      density="compact"
      valueClassName="text-propsight-700"
      labelSuffix={<InfoTip tooltip={`${hypotheses.partCaptableCible} % × Marché adressable`} />}
      subtitle={`à ${hypotheses.partCaptableCible.toFixed(1)} % de part de marché`}
    />

    <EcartTile ecart={calcs.ecartAuPotentiel} partCible={hypotheses.partCaptableCible} />
  </div>
);

interface EcartProps {
  ecart: number;
  partCible: number;
}

const EcartTile: React.FC<EcartProps> = ({ ecart, partCible }) => (
  <div className="bg-propsight-50 border border-propsight-200 rounded-lg px-3 py-2 flex flex-col justify-between">
    <p className="text-[10px] font-semibold text-propsight-700 uppercase tracking-wider leading-tight">Écart au potentiel</p>
    <p className="text-[10px] text-slate-700 leading-tight">
      Si vous captiez {partCible.toFixed(1)} % du marché, vous auriez :
    </p>
    <p className="text-lg font-semibold text-propsight-700 leading-tight tabular-nums">
      +{ecart.toLocaleString('fr-FR')} €
    </p>
    <p className="text-[10px] text-slate-700 leading-tight">de CA annuel</p>
  </div>
);

export default MarcheTiles;
