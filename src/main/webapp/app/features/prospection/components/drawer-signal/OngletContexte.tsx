import React from 'react';
import { SignalProspection, MetaSignalRadar } from '../../types';
import Sparkline from '../shared/Sparkline';
import { formatPrixM2, formatPct } from '../../utils/formatters';

interface Props {
  signal: SignalProspection | MetaSignalRadar;
}

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-lg border border-slate-200 bg-white">
    <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
      {title}
    </div>
    <div className="p-3">{children}</div>
  </div>
);

const Cell: React.FC<{ label: string; value: React.ReactNode; sublabel?: string }> = ({
  label,
  value,
  sublabel,
}) => (
  <div>
    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
    <div className="text-[13px] text-slate-900 font-medium mt-0.5">{value}</div>
    {sublabel && <div className="text-[10px] text-slate-500 mt-0.5">{sublabel}</div>}
  </div>
);

const OngletContexte: React.FC<Props> = ({ signal }) => {
  const isMeta = 'children' in signal;
  const prixMedian = !isMeta && signal.source === 'dvf' ? signal.dvf_payload.prix_median_secteur : 10820;
  const ecart =
    !isMeta && signal.source === 'dvf' && signal.dvf_payload.ecart_vs_marche_pct !== undefined
      ? signal.dvf_payload.ecart_vs_marche_pct
      : 3.4;

  return (
    <div className="space-y-3">
      <Card title="Contexte marché">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Cell
            label="Prix / m² médian"
            value={formatPrixM2(prixMedian)}
            sublabel={`Évolution 12 mois : ${formatPct(ecart)}`}
          />
          <Cell label="Volume mutations 90j" value="156" sublabel="+21% vs période précédente" />
          <Cell label="Délai médian vente" value="46 j" sublabel="Moyenne locale" />
          <Cell
            label="Tension du marché"
            value={
              <span className="inline-flex items-center gap-1.5 text-rose-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Forte
              </span>
            }
          />
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Évolution prix/m²</div>
          <Sparkline data={[96, 98, 100, 103, 104, 108, 110, 112, 111, 114, 117, 120]} width={260} height={40} />
        </div>
      </Card>

      <Card title="Profil de demande">
        <div className="grid grid-cols-2 gap-3">
          <Cell label="Type dominant" value="Résidence principale" />
          <Cell label="Profondeur demande" value="Élevée" />
          <Cell label="Revenu indicatif" value="> 4 200 € / mois" />
          <Cell label="Niveau de confiance" value="Élevé" />
        </div>
      </Card>

      <Card title="Contexte urbanisme">
        <div className="grid grid-cols-2 gap-3">
          <Cell label="Projets urbains" value="2 en cours" sublabel="Impact positif" />
          <Cell label="Risques PLU" value="Aucun" />
        </div>
      </Card>
    </div>
  );
};

export default OngletContexte;
