import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Phone, MoreHorizontal } from 'lucide-react';
import type { DashboardRapportItem } from '../types';
import PanelCard from './PanelCard';
import OpensDots from './OpensDots';

type SortKey = 'engagement' | 'sent' | 'opens';

const SORT_LABELS: Record<SortKey, string> = {
  engagement: 'Engagement',
  sent: 'Date envoi',
  opens: 'Ouvertures',
};

const CTA_TONE: Record<string, string> = {
  Relancer: 'bg-propsight-600 text-white hover:bg-propsight-700 border-propsight-600',
  Appeler: 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600',
  Renvoyer: 'bg-amber-500 text-white hover:bg-amber-600 border-amber-500',
  Archiver: 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200',
  Ouvrir: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200',
};

interface Props {
  rapports: DashboardRapportItem[];
  totalCount: number;
}

const RapportsEngagementPanel: React.FC<Props> = ({ rapports, totalCount }) => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey>('engagement');
  const [sortOpen, setSortOpen] = useState(false);

  const sorted = useMemo(() => {
    const arr = [...rapports];
    switch (sortKey) {
      case 'sent':
        return arr.sort((a, b) => b.sent_at.localeCompare(a.sent_at));
      case 'opens':
        return arr.sort((a, b) => b.opens_count - a.opens_count);
      case 'engagement':
      default:
        return arr.sort((a, b) => b.priority_engagement_score - a.priority_engagement_score);
    }
  }, [rapports, sortKey]);

  const handleCta = (item: DashboardRapportItem) => {
    const cta = item.cta_primary;
    if (cta.action === 'open_route' && cta.href) navigate(cta.href);
    // eslint-disable-next-line no-console
    else console.log('[dashboard] CTA rapport', cta);
  };

  return (
    <PanelCard
      title="Rapports envoyés & engagement"
      subtitle="90 derniers jours"
      right={
        <>
          <span className="inline-flex items-center h-[18px] px-1.5 rounded bg-slate-100 text-[10.5px] font-medium text-slate-600">
            {totalCount}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen(o => !o)}
              className="h-7 px-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[11.5px] text-slate-700 flex items-center gap-1 transition-colors"
            >
              Trier : {SORT_LABELS[sortKey]}
              <ChevronDown size={11} className="text-slate-400" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 z-20 min-w-[160px] bg-white border border-slate-200 rounded-md shadow-lg py-1">
                {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => { setSortKey(k); setSortOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-[12.5px] hover:bg-slate-50 ${
                      sortKey === k ? 'text-propsight-700 font-medium' : 'text-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      }
      footer={
        <button
          type="button"
          onClick={() => navigate('/app/estimation/avis-valeur')}
          className="w-full flex items-center justify-between text-[12px] text-propsight-600 hover:text-propsight-700 font-medium"
        >
          <span>Voir tous les rapports</span>
          <ArrowRight size={12} />
        </button>
      }
      bodyClassName="overflow-auto"
    >
      <table className="w-full text-[12px] table-fixed">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="text-left text-[11px] font-medium text-slate-500 border-b border-slate-100">
            <th className="pl-3 pr-1.5 py-1.5 w-[24%]">Client</th>
            <th className="px-1.5 py-1.5 w-[22%]">Type</th>
            <th className="px-1.5 py-1.5 w-[11%]">Envoyé</th>
            <th className="px-1.5 py-1.5 w-[13%]">Ouvertures</th>
            <th className="px-1.5 py-1.5 w-[13%]">Dernier accès</th>
            <th className="px-1.5 py-1.5 w-[17%] text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map(item => {
            const hot = item.engagement_state === 'tres_chaud' || item.engagement_state === 'chaud';
            const ctaTone = CTA_TONE[item.cta_primary.label] ?? CTA_TONE.Ouvrir;
            return (
              <tr
                key={item.id}
                className={`hover:bg-slate-50/50 transition-colors ${hot ? 'bg-rose-50/20' : ''}`}
              >
                <td className="pl-3 pr-1.5 py-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-propsight-100 text-propsight-700 text-[9.5px] font-semibold flex items-center justify-center">
                      {item.client.name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                    <span className="text-[12px] text-slate-900 font-medium truncate">
                      {item.client.name}
                    </span>
                  </div>
                </td>
                <td className="px-1.5 py-1.5 text-slate-600 truncate">{item.type_label}</td>
                <td className="px-1.5 py-1.5 text-slate-500 text-[11px] whitespace-nowrap truncate">{item.sent_label}</td>
                <td className="px-1.5 py-1.5">
                  <OpensDots count={item.opens_count} />
                </td>
                <td className="px-1.5 py-1.5 text-slate-500 text-[11px] whitespace-nowrap truncate">
                  {item.last_opened_label ?? '—'}
                </td>
                <td className="px-1.5 py-1.5">
                  <div className="flex items-center justify-end gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleCta(item)}
                      className={`h-6 px-2 rounded-md border text-[11px] font-medium inline-flex items-center gap-1 transition-colors ${ctaTone}`}
                    >
                      {item.cta_primary.label === 'Appeler' && <Phone size={10} />}
                      {item.cta_primary.label}
                    </button>
                    <button
                      type="button"
                      className="w-6 h-6 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
                      aria-label="Plus d'actions"
                    >
                      <MoreHorizontal size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </PanelCard>
  );
};

export default RapportsEngagementPanel;
