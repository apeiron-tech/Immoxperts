import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Upload, Download, Bell, Inbox, AlertTriangle, EyeOff, MoreHorizontal, Heart } from 'lucide-react';
import {
  PageHeader,
  KpiRow,
  KpiTileConfig,
  Tabs,
  TabConfig,
  FiltersBar,
  SearchInput,
  FilterDropdown,
  PrimaryButton,
  SecondaryButton,
  AlerteStatusBadge,
  AlertePriorityBadge,
  FrequencyBadge,
  DomainBadge,
  AssigneeAvatar,
  FreshnessLabel,
  Sparkline,
  EmptyState,
} from '../components/shared/primitives';
import { ALERTES } from '../_mocks/alertes';
import { findUser } from '../_mocks/users';
import { Alerte, AlerteDomain, AlerteStatus, AlerteTargetType } from '../types';
import DrawerAlerte from '../components/drawer/DrawerAlerte';
import ModalNouvelleAlerte from './ModalNouvelleAlerte';
import SanteAlertesDrawer from './SanteAlertesDrawer';
import { useToast } from '../components/shared/Toast';

type TabKey = 'toutes' | 'zones' | 'biens' | 'prix' | 'dpe' | 'urbanisme' | 'concurrents' | 'en_pause';

const AlertesPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [alertes, setAlertes] = useState<Alerte[]>(ALERTES);
  const [tab, setTab] = useState<TabKey>('toutes');
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [filterTarget, setFilterTarget] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssigne, setFilterAssigne] = useState('all');
  const [showModalNouvelle, setShowModalNouvelle] = useState(false);
  const [showSante, setShowSante] = useState(false);
  const toast = useToast();

  const drawerId = params.get('alerte');

  const openDrawer = (id: string) =>
    setParams(p => {
      const np = new URLSearchParams(p);
      np.set('alerte', id);
      return np;
    });
  const closeDrawer = () => {
    setParams(p => {
      const np = new URLSearchParams(p);
      np.delete('alerte');
      return np;
    });
  };

  const counts = useMemo(() => {
    const countByFn = (pred: (a: Alerte) => boolean) => alertes.filter(pred).length;
    return {
      total_not_archived: countByFn(a => a.status !== 'archived'),
      zones: countByFn(a => a.target_type === 'zone'),
      biens: countByFn(a => a.target_type === 'bien'),
      prix: countByFn(a => a.domain === 'prix'),
      dpe: countByFn(a => a.domain === 'dpe'),
      urbanisme: countByFn(a => a.domain === 'urbanisme'),
      concurrents: countByFn(a => a.target_type === 'agence' || a.domain === 'concurrence'),
      paused: countByFn(a => a.status === 'paused'),
      active: countByFn(a => a.status === 'active'),
      silent: countByFn(a => a.health_status === 'silent'),
      noisy: countByFn(a => a.health_status === 'noisy'),
      error: countByFn(a => a.health_status === 'error'),
    };
  }, [alertes]);

  const santeCount = counts.silent + counts.noisy + counts.error;

  const filteredAlertes = useMemo(() => {
    return alertes.filter(a => {
      if (tab === 'zones' && a.target_type !== 'zone') return false;
      if (tab === 'biens' && a.target_type !== 'bien') return false;
      if (tab === 'prix' && a.domain !== 'prix') return false;
      if (tab === 'dpe' && a.domain !== 'dpe') return false;
      if (tab === 'urbanisme' && a.domain !== 'urbanisme') return false;
      if (tab === 'concurrents' && a.target_type !== 'agence' && a.domain !== 'concurrence') return false;
      if (tab === 'en_pause' && a.status !== 'paused') return false;
      if (tab === 'toutes' && a.status === 'archived') return false;

      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.target_label.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (filterSource !== 'all' && a.source_module !== filterSource) return false;
      if (filterTarget !== 'all' && a.target_type !== filterTarget) return false;
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (filterAssigne === 'me' && a.assigned_to !== 'user_001') return false;
      if (filterAssigne === 'none' && a.assigned_to) return false;
      return true;
    });
  }, [alertes, tab, search, filterSource, filterTarget, filterStatus, filterAssigne]);

  const kpis: KpiTileConfig[] = [
    {
      id: 'actives',
      icon: <Bell size={15} />,
      iconBg: 'bg-propsight-100',
      iconFg: 'text-propsight-600',
      label: 'Alertes actives',
      value: counts.active,
      delta: '+3 vs 7 derniers jours',
      deltaTone: 'up',
      active: filterStatus === 'active',
      onClick: () => setFilterStatus(filterStatus === 'active' ? 'all' : 'active'),
    },
    {
      id: 'declench',
      icon: <Inbox size={15} />,
      iconBg: 'bg-sky-100',
      iconFg: 'text-sky-600',
      label: 'Déclenchements 7j',
      value: alertes.reduce((s, a) => s + a.triggers_count_7d, 0),
      delta: '+18 vs 7 derniers jours',
      deltaTone: 'up',
    },
    {
      id: 'traiter',
      icon: <AlertTriangle size={15} />,
      iconBg: 'bg-amber-100',
      iconFg: 'text-amber-600',
      label: 'À traiter',
      value: Math.round(alertes.reduce((s, a) => s + a.triggers_count_30d * (1 - a.treated_rate_30d), 0)),
      delta: '+4 vs 7 derniers jours',
      deltaTone: 'up',
    },
    {
      id: 'silent',
      icon: <EyeOff size={15} />,
      iconBg: 'bg-slate-100',
      iconFg: 'text-slate-600',
      label: 'Silencieuses',
      value: counts.silent,
      delta: '-2 vs 7 derniers jours',
      deltaTone: 'down',
    },
  ];

  const tabs: TabConfig[] = [
    { key: 'toutes', label: 'Toutes', count: counts.total_not_archived },
    { key: 'zones', label: 'Zones', count: counts.zones },
    { key: 'biens', label: 'Biens', count: counts.biens },
    { key: 'prix', label: 'Prix', count: counts.prix },
    { key: 'dpe', label: 'DPE', count: counts.dpe },
    { key: 'urbanisme', label: 'Urbanisme', count: counts.urbanisme },
    { key: 'concurrents', label: 'Concurrents', count: counts.concurrents },
    { key: 'en_pause', label: 'En pause', count: counts.paused },
  ];

  const currentAlerte = alertes.find(a => a.id === drawerId);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Mes alertes"
        count={counts.total_not_archived}
        subtitle="Configurez les zones, biens, recherches et concurrents que Propsight doit surveiller."
        actions={
          <>
            {santeCount > 0 && (
              <SecondaryButton onClick={() => setShowSante(true)}>
                <AlertTriangle size={12} className="text-amber-600" />
                Santé de mes alertes ·{santeCount}
              </SecondaryButton>
            )}
            <SecondaryButton onClick={() => toast.push({ message: 'Import de zone (démo)' })}>
              <Upload size={12} />
              Importer une zone
            </SecondaryButton>
            <SecondaryButton onClick={() => toast.push({ message: 'Export CSV (démo)' })}>
              <Download size={12} />
              Exporter
            </SecondaryButton>
            <PrimaryButton onClick={() => setShowModalNouvelle(true)}>
              <Plus size={13} />
              Nouvelle alerte
            </PrimaryButton>
          </>
        }
      />

      <FiltersBar>
        <SearchInput placeholder="Rechercher une alerte…" value={search} onChange={setSearch} width="w-[240px]" />
        <FilterDropdown
          label="Type"
          value={filterTarget}
          onChange={setFilterTarget}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'bien', label: 'Bien' },
            { value: 'zone', label: 'Zone' },
            { value: 'recherche', label: 'Recherche' },
            { value: 'agence', label: 'Agence' },
          ]}
        />
        <FilterDropdown
          label="Source"
          value={filterSource}
          onChange={setFilterSource}
          options={[
            { value: 'all', label: 'Toutes' },
            { value: 'veille', label: 'Veille' },
            { value: 'biens', label: 'Biens' },
            { value: 'prospection', label: 'Prospection' },
            { value: 'observatoire', label: 'Observatoire' },
            { value: 'investissement', label: 'Investissement' },
          ]}
        />
        <FilterDropdown
          label="Statut"
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'active', label: 'Active' },
            { value: 'paused', label: 'En pause' },
            { value: 'archived', label: 'Archivée' },
          ]}
        />
        <FilterDropdown
          label="Assigné"
          value={filterAssigne}
          onChange={setFilterAssigne}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'me', label: 'Moi' },
            { value: 'none', label: 'Non assigné' },
          ]}
        />
      </FiltersBar>

      <KpiRow tiles={kpis} />

      <Tabs tabs={tabs} active={tab} onChange={k => setTab(k as TabKey)} />

      {filteredAlertes.length === 0 ? (
        <EmptyState
          icon={<Bell size={20} />}
          title="Aucune alerte ne correspond à vos filtres"
          description="Essayez d'élargir vos critères ou de réinitialiser les filtres."
          primary={{
            label: 'Réinitialiser',
            onClick() {
              setSearch('');
              setFilterSource('all');
              setFilterTarget('all');
              setFilterStatus('all');
              setFilterAssigne('all');
              setTab('toutes');
            },
          }}
        />
      ) : (
        <AlertesTable
          rows={filteredAlertes}
          onRowClick={openDrawer}
          highlightId={drawerId}
          onToggleStatus={id =>
            setAlertes(prev => prev.map(a => (a.id === id ? { ...a, status: a.status === 'paused' ? 'active' : 'paused' } : a)))
          }
          onDelete={id => setAlertes(prev => prev.filter(a => a.id !== id))}
        />
      )}

      {/* Drawer */}
      {currentAlerte && (
        <DrawerAlerte
          alerte={currentAlerte}
          onClose={closeDrawer}
          onToggleStatus={() =>
            setAlertes(prev =>
              prev.map(a =>
                a.id === currentAlerte.id ? { ...a, status: a.status === 'paused' ? 'active' : 'paused' } : a,
              ),
            )
          }
          onDelete={() => {
            setAlertes(prev => prev.filter(a => a.id !== currentAlerte.id));
            closeDrawer();
          }}
        />
      )}

      {/* Wizard */}
      {showModalNouvelle && (
        <ModalNouvelleAlerte
          onClose={() => setShowModalNouvelle(false)}
          onCreate={alerte => {
            setAlertes(prev => [alerte, ...prev]);
            setShowModalNouvelle(false);
            toast.push({ message: `Alerte "${alerte.name}" créée`, kind: 'success' });
          }}
        />
      )}

      {/* Santé drawer */}
      {showSante && (
        <SanteAlertesDrawer
          alertes={alertes.filter(a => a.health_status !== 'healthy')}
          onClose={() => setShowSante(false)}
          onOpenAlerte={id => {
            setShowSante(false);
            openDrawer(id);
          }}
        />
      )}
    </div>
  );
};

/* ========== TABLE ========== */

interface TableProps {
  rows: Alerte[];
  onRowClick: (id: string) => void;
  highlightId: string | null;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const AlertesTable: React.FC<TableProps> = ({ rows, onRowClick, highlightId }) => {
  return (
    <div className="flex-1 overflow-auto bg-white">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
          <tr className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            <th className="text-left px-4 py-2 font-semibold">Nom</th>
            <th className="text-left px-2 py-2 font-semibold">Type</th>
            <th className="text-left px-2 py-2 font-semibold">Périmètre</th>
            <th className="text-left px-2 py-2 font-semibold">Condition</th>
            <th className="text-left px-2 py-2 font-semibold">Fréquence</th>
            <th className="text-left px-2 py-2 font-semibold">Dernier déclenchement</th>
            <th className="text-left px-2 py-2 font-semibold">Événements 30j</th>
            <th className="text-left px-2 py-2 font-semibold">Priorité</th>
            <th className="text-left px-2 py-2 font-semibold">Statut</th>
            <th className="text-left px-2 py-2 font-semibold">Assigné</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {rows.map(a => {
            const assignee = findUser(a.assigned_to);
            const isHighlight = a.id === highlightId;
            // série sparkline fake stable
            const spark = Array.from({ length: 7 }, (_, i) => Math.max(0, a.triggers_count_7d - (6 - i) * (Math.random() * 2 - 1)));
            return (
              <tr
                key={a.id}
                onClick={() => onRowClick(a.id)}
                className={`border-b border-slate-100 cursor-pointer transition-colors ${
                  isHighlight ? 'bg-propsight-50/60' : 'hover:bg-slate-50'
                }`}
              >
                <td className="px-4 py-2.5">
                  <div className="text-[12.5px] font-medium text-slate-900">{a.name}</div>
                  {a.description && (
                    <div className="text-[10.5px] text-slate-500 truncate max-w-[260px]">{a.description}</div>
                  )}
                </td>
                <td className="px-2 py-2.5">
                  <DomainBadge domain={a.domain} />
                </td>
                <td className="px-2 py-2.5">
                  <div className="text-[11.5px] text-slate-700">{a.target_label}</div>
                  {a.target_secondary_label && (
                    <div className="text-[10px] text-slate-500">{a.target_secondary_label}</div>
                  )}
                </td>
                <td className="px-2 py-2.5">
                  <span className="text-[11px] text-slate-600 line-clamp-2">
                    {a.conditions.map(c => c.label).join(' · ')}
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <FrequencyBadge frequency={a.frequency} />
                </td>
                <td className="px-2 py-2.5">
                  {a.last_triggered_at ? (
                    <FreshnessLabel iso={a.last_triggered_at} />
                  ) : (
                    <span className="text-[11px] text-slate-400">—</span>
                  )}
                </td>
                <td className="px-2 py-2.5">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-800 tabular-nums">{a.triggers_count_30d}</span>
                    <Sparkline data={spark} />
                  </div>
                </td>
                <td className="px-2 py-2.5">
                  <AlertePriorityBadge priority={a.priority} />
                </td>
                <td className="px-2 py-2.5">
                  <AlerteStatusBadge status={a.status} />
                </td>
                <td className="px-2 py-2.5">
                  <AssigneeAvatar user={assignee} />
                </td>
                <td className="px-1 py-2.5">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onRowClick(a.id);
                    }}
                    className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-slate-100 text-slate-400"
                  >
                    <MoreHorizontal size={13} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AlertesPage;
