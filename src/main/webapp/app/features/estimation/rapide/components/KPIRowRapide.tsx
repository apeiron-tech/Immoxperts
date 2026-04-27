import React from 'react';
import { KPICard } from '../../components/shared/KPICard';

const KPIRowRapide: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <KPICard
        label="Ce mois-ci"
        value={8}
        sub="estimations rapides créées"
        trend={{ value: '+3 vs mois dernier', positive: true }}
        highlight
      />
      <KPICard
        label="Converties en avis de valeur"
        value="37%"
        sub="3 sur 8 estimations"
        trend={{ value: '+5pts vs M-1', positive: true }}
      />
      <KPICard
        label="Via widget public"
        value={2}
        sub="demandes entrantes ce mois"
        trend={{ value: '-1 vs mois dernier', positive: false }}
      />
    </div>
  );
};

export default KPIRowRapide;
