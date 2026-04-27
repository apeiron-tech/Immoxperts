import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle2, Calendar, FileText, Euro, LucideIcon } from 'lucide-react';
import KpiCard from 'app/shared/ui/KpiCard';
import { KpiIcon } from '../../types';
import { MOCK_KPI } from '../../_mocks/pilotage';

const ICONS: Record<KpiIcon, LucideIcon> = {
  users: Users,
  'check-circle': CheckCircle2,
  calendar: Calendar,
  'file-text': FileText,
  euro: Euro,
};

const KpiBandeau: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-5 gap-2 flex-shrink-0">
      {MOCK_KPI.map(tile => {
        const Icon = ICONS[tile.icon];
        const direction = tile.trend === 'up' ? 'up' : 'down';
        const href = tile.href;
        return (
          <KpiCard
            key={tile.label}
            label={tile.label}
            value={tile.value}
            icon={Icon}
            iconVariant="default"
            iconLayout="topRight"
            density="default"
            trend={{ value: tile.delta, direction }}
            trendCompare={tile.deltaLabel}
            onClick={href ? () => navigate(href) : undefined}
          />
        );
      })}
    </div>
  );
};

export default KpiBandeau;
