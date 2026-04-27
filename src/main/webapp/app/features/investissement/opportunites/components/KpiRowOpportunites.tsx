import React from 'react';
import { Building2, TrendingUp, PieChart, FolderOpen } from 'lucide-react';
import KpiCard from '../../shared/KpiCard';

interface Props {
  total: number;
  nouveaux: number;
  aAnalyser: number;
  enDossier: number;
  onFilterStatus?: (status: 'all' | 'nouveau' | 'a_qualifier' | 'dossier') => void;
  activeFilter?: 'all' | 'nouveau' | 'a_qualifier' | 'dossier' | null;
}

const KpiRowOpportunites: React.FC<Props> = ({ total, nouveaux, aAnalyser, enDossier, onFilterStatus, activeFilter }) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      <KpiCard
        icon={<Building2 size={16} />}
        label="Total détectées"
        value={total}
        subtitle="Opportunités détectées"
        variant="violet"
        onClick={() => onFilterStatus?.('all')}
        active={activeFilter === 'all'}
      />
      <KpiCard
        icon={<TrendingUp size={16} />}
        label="Nouvelles"
        value={nouveaux}
        subtitle="7 derniers jours"
        variant="emerald"
        trend={{ value: '+27%', positive: true }}
        onClick={() => onFilterStatus?.('nouveau')}
        active={activeFilter === 'nouveau'}
      />
      <KpiCard
        icon={<PieChart size={16} />}
        label="À analyser"
        value={aAnalyser}
        subtitle="En cours"
        variant="amber"
        trend={{ value: '+12%', positive: false }}
        onClick={() => onFilterStatus?.('a_qualifier')}
        active={activeFilter === 'a_qualifier'}
      />
      <KpiCard
        icon={<FolderOpen size={16} />}
        label="En dossier"
        value={enDossier}
        subtitle="Sous revue"
        onClick={() => onFilterStatus?.('dossier')}
        active={activeFilter === 'dossier'}
        trend={{ value: '+8%', positive: true }}
      />
    </div>
  );
};

export default KpiRowOpportunites;
