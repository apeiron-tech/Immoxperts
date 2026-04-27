import React from 'react';
import { ArrowRight } from 'lucide-react';
import { KPICard } from '../../components/shared/KPICard';
import { Estimation } from '../../types';

interface Props {
  etudes: Estimation[];
}

const KPIRowEtudeLocative: React.FC<Props> = ({ etudes }) => {
  // KPI 1 : En cours (brouillon + finalisée + envoyée + ouverte)
  const enCours = etudes.filter(
    e => e.statut === 'brouillon' || e.statut === 'finalisee' || e.statut === 'envoyee' || e.statut === 'ouverte',
  ).length;

  // KPI 2 : Taux d'ouverture bailleur sur 30 derniers jours
  const il30j = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const envoyesRecents = etudes.filter(e => e.envoi && new Date(e.envoi.envoye_le).getTime() > il30j);
  const ouvertsRecents = envoyesRecents.filter(e => (e.envoi?.ouvertures.length || 0) > 0);
  const tauxOuverture = envoyesRecents.length > 0 ? Math.round((ouvertsRecents.length / envoyesRecents.length) * 100) : 0;

  // KPI 3 : Ce mois-ci
  const now = new Date();
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const debutMoisPrec = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
  const ceMois = etudes.filter(e => new Date(e.created_at).getTime() >= debutMois).length;
  const moisPrec = etudes.filter(
    e => new Date(e.created_at).getTime() >= debutMoisPrec && new Date(e.created_at).getTime() < debutMois,
  ).length;
  const delta = ceMois - moisPrec;

  // Leads à relancer
  const il7j = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const leadsARelancer = etudes.filter(
    e => e.statut === 'envoyee' && e.envoi && new Date(e.envoi.envoye_le).getTime() < il7j,
  ).length;

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-stretch">
      <KPICard
        label="En cours"
        value={enCours}
        sub="brouillons + envoyés non signés"
        highlight
      />
      <KPICard
        label="Taux d'ouverture bailleur"
        value={`${tauxOuverture}%`}
        sub={`${ouvertsRecents.length}/${envoyesRecents.length} ouverts sur 30 derniers jours`}
      />
      <KPICard
        label="Ce mois"
        value={ceMois}
        sub={moisPrec > 0 ? `${moisPrec} au mois précédent` : 'aucune au mois précédent'}
        trend={delta !== 0 ? { value: `${delta > 0 ? '+' : ''}${delta} vs M-1`, positive: delta >= 0 } : undefined}
      />

      <button
        onClick={() => console.warn('[EtudeLocative] Ouverture pipeline commercial (à venir)')}
        className="rounded-md border border-dashed border-propsight-200 bg-propsight-50/40 hover:bg-propsight-50 hover:border-propsight-300 transition-colors px-4 py-3 text-left flex flex-col justify-between min-w-[180px]"
      >
        <div>
          <p className="text-xs text-propsight-500 font-medium">À relancer</p>
          <p className="text-xl font-semibold text-propsight-700 tabular-nums mt-1">{leadsARelancer}</p>
          <p className="text-xs text-propsight-600/70 mt-0.5">bailleurs en attente</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-propsight-600 font-medium mt-2">
          Mon pipeline <ArrowRight size={11} />
        </div>
      </button>
    </div>
  );
};

export default KPIRowEtudeLocative;
