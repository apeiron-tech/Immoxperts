import React from 'react';
import { ArrowRight } from 'lucide-react';
import { KPICard } from '../../components/shared/KPICard';
import { Estimation } from '../../types';

interface Props {
  avisList: Estimation[];
}

const KPIRowAvisValeur: React.FC<Props> = ({ avisList }) => {
  // KPI 1 : En cours = brouillons + envoyées + ouvertes (sans signature de mandat)
  const enCours = avisList.filter(
    a =>
      (a.statut === 'brouillon' || a.statut === 'finalisee' || a.statut === 'envoyee' || a.statut === 'ouverte') &&
      !a.mandat_signe,
  ).length;

  // KPI 2 : Taux d'ouverture vendeur sur 30 derniers jours
  const il30j = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const envoyesRecents = avisList.filter(a => a.envoi && new Date(a.envoi.envoye_le).getTime() > il30j);
  const ouvertsRecents = envoyesRecents.filter(a => (a.envoi?.ouvertures.length || 0) > 0);
  const tauxOuverture = envoyesRecents.length > 0 ? Math.round((ouvertsRecents.length / envoyesRecents.length) * 100) : 0;

  // KPI 3 : Signés en mandat ce mois
  const now = new Date();
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const signesCeMois = avisList.filter(
    a => a.mandat_signe && a.mandat_signe_le && new Date(a.mandat_signe_le).getTime() > debutMois,
  ).length;

  // Leads à relancer = envoyés non ouverts depuis >7j (mock)
  const il7j = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const leadsARelancer = avisList.filter(
    a => a.statut === 'envoyee' && a.envoi && new Date(a.envoi.envoye_le).getTime() < il7j,
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
        label="Taux d'ouverture vendeur"
        value={`${tauxOuverture}%`}
        sub={`${ouvertsRecents.length}/${envoyesRecents.length} ouverts sur 30 derniers jours`}
        trend={envoyesRecents.length > 0 ? { value: '+8pts vs M-1', positive: true } : undefined}
      />
      <KPICard
        label="Signés en mandat ce mois"
        value={signesCeMois}
        sub={signesCeMois > 0 ? 'mandats convertis' : 'aucun mandat signé ce mois'}
      />

      {/* Lien pipeline commercial */}
      <button
        onClick={() => console.warn('[AvisValeur] Ouverture pipeline commercial (à venir)')}
        className="rounded-md border border-dashed border-propsight-200 bg-propsight-50/40 hover:bg-propsight-50 hover:border-propsight-300 transition-colors px-4 py-3 text-left flex flex-col justify-between min-w-[180px]"
      >
        <div>
          <p className="text-xs text-propsight-500 font-medium">À relancer</p>
          <p className="text-xl font-semibold text-propsight-700 tabular-nums mt-1">{leadsARelancer}</p>
          <p className="text-xs text-propsight-600/70 mt-0.5">leads en attente</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-propsight-600 font-medium mt-2">
          Mon pipeline <ArrowRight size={11} />
        </div>
      </button>
    </div>
  );
};

export default KPIRowAvisValeur;
