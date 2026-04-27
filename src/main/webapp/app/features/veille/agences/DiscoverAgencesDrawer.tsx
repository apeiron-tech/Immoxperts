import React, { useState } from 'react';
import { Compass, Plus } from 'lucide-react';
import DrawerShell, { DrawerCloseButton } from '../components/drawer/DrawerShell';
import { DISCOVER_AGENCES } from '../_mocks/agences';
import { AgenceConcurrente } from '../types';
import { Pill } from '../components/shared/primitives';

interface Props {
  onClose: () => void;
  onFollow: (a: AgenceConcurrente) => void;
}

const DiscoverAgencesDrawer: React.FC<Props> = ({ onClose, onFollow }) => {
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  const followable = DISCOVER_AGENCES.filter(a => !followedIds.includes(a.id));

  return (
    <DrawerShell onClose={onClose} width={420}>
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-slate-900 flex items-center gap-1.5">
            <Compass size={14} className="text-propsight-600" />
            Agences actives sur vos zones
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Agences actives que vous ne suivez pas encore.</p>
        </div>
        <DrawerCloseButton onClose={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
        <Section label="Paris 15e" count={followable.length}>
          {followable.map(a => (
            <DiscoverRow
              key={a.id}
              agence={a}
              onFollow={() => {
                setFollowedIds(prev => [...prev, a.id]);
                onFollow(a);
              }}
              following={followedIds.includes(a.id)}
            />
          ))}
        </Section>
      </div>
    </DrawerShell>
  );
};

const Section: React.FC<{ label: string; count: number; children: React.ReactNode }> = ({ label, count, children }) => (
  <div>
    <div className="mb-2 flex items-center gap-1.5">
      <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
        {label} <span className="text-slate-400">· {count} agences actives</span>
      </span>
    </div>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const DiscoverRow: React.FC<{ agence: AgenceConcurrente; onFollow: () => void; following: boolean }> = ({
  agence,
  onFollow,
  following,
}) => {
  const partMarche = agence.zones[0]?.part_de_marche ? Math.round(agence.zones[0].part_de_marche * 100) : null;
  return (
    <div className="bg-white rounded-md border border-slate-200 p-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <div
            className="h-9 w-9 rounded-md flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0"
            style={{ backgroundColor: agence.logo_color }}
          >
            {agence.logo_initials}
          </div>
          <div className="min-w-0">
            <div className="text-[12.5px] font-medium text-slate-900 truncate">{agence.name}</div>
            <div className="text-[10.5px] text-slate-500 mt-0.5">
              {agence.stock_actif} biens actifs
              {partMarche !== null && <> · part de marché {partMarche} %</>}
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {agence.zones.slice(0, 3).map(z => (
                <Pill key={z.zone_id} className="bg-slate-50 text-slate-700 ring-slate-200">
                  {z.label}
                </Pill>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onFollow}
          disabled={following}
          className={`h-7 px-2.5 rounded-md text-[11px] font-medium inline-flex items-center gap-1 ${
            following
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-propsight-600 text-white hover:bg-propsight-700'
          }`}
        >
          {following ? 'Suivie' : (<><Plus size={11} />Suivre</>)}
        </button>
      </div>
    </div>
  );
};

export default DiscoverAgencesDrawer;
