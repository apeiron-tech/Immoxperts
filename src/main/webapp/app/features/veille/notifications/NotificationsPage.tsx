import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CheckCheck,
  Settings,
  Download,
  Inbox,
  Flame,
  Zap,
  EyeOff,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import {
  PageHeader,
  KpiRow,
  KpiTileConfig,
  Tabs,
  FiltersBar,
  SearchInput,
  FilterDropdown,
  PrimaryButton,
  SecondaryButton,
  EmptyState,
} from '../components/shared/primitives';
import { NOTIFICATIONS } from '../_mocks/notifications';
import { NotificationVeille } from '../types';
import { dateBucket, BUCKET_LABELS } from '../utils/freshness';
import NotificationRow from './NotificationRow';
import DrawerNotification from '../components/drawer/DrawerNotification';
import PreferencesModal from './PreferencesModal';
import { useToast } from '../components/shared/Toast';

type TabKey = 'toutes' | 'non_lues' | 'a_traiter';

const NotificationsPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [notifications, setNotifications] = useState<NotificationVeille[]>(NOTIFICATIONS);
  const [tab, setTab] = useState<TabKey>('toutes');
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('7j');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const toast = useToast();

  const drawerId = params.get('notification');
  const currentNotif = notifications.find(n => n.id === drawerId);

  const openDrawer = (id: string) => {
    setParams(p => {
      const np = new URLSearchParams(p);
      np.set('notification', id);
      return np;
    });
    // mark as read automatically
    setNotifications(prev => prev.map(n => (n.id === id && n.status === 'unread' ? { ...n, status: 'read', read_at: new Date().toISOString() } : n)));
  };
  const closeDrawer = () => {
    setParams(p => {
      const np = new URLSearchParams(p);
      np.delete('notification');
      return np;
    });
  };

  const counts = useMemo(() => {
    return {
      total: notifications.length,
      unread: notifications.filter(n => n.status === 'unread').length,
      read: notifications.filter(n => n.status === 'read').length,
      todo: notifications.filter(n => n.status === 'todo').length,
      done: notifications.filter(n => n.status === 'done').length,
      ignored: notifications.filter(n => n.status === 'ignored').length,
      haute: notifications.filter(n => n.priority === 'haute' && n.status !== 'done' && n.status !== 'ignored').length,
    };
  }, [notifications]);

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      if (tab === 'non_lues' && n.status !== 'unread') return false;
      if (tab === 'a_traiter' && n.status !== 'todo') return false;
      if (search) {
        const s = search.toLowerCase();
        if (!n.title.toLowerCase().includes(s) && !n.message.toLowerCase().includes(s)) return false;
      }
      if (filterPriority !== 'all' && n.priority !== filterPriority) return false;
      if (filterSource !== 'all' && n.source_type !== filterSource) return false;
      if (filterStatus !== 'all' && n.status !== filterStatus) return false;
      return true;
    });
  }, [notifications, tab, search, filterPriority, filterSource, filterStatus]);

  // Group by date bucket
  const groups = useMemo(() => {
    const map: Record<string, NotificationVeille[]> = {};
    for (const n of filtered) {
      const b = dateBucket(n.event_at);
      if (!map[b]) map[b] = [];
      map[b].push(n);
    }
    return (['aujourdhui', 'hier', 'cette_semaine', 'plus_ancien'] as const)
      .map(k => ({ key: k, items: map[k] ?? [] }))
      .filter(g => g.items.length > 0);
  }, [filtered]);

  const kpis: KpiTileConfig[] = [
    {
      id: 'unread',
      icon: <Inbox size={15} />,
      iconBg: 'bg-propsight-100',
      iconFg: 'text-propsight-600',
      label: 'Non lues',
      value: counts.unread,
      delta: '+12 vs 7 derniers jours',
      deltaTone: 'up',
      active: tab === 'non_lues',
      onClick: () => setTab('non_lues'),
    },
    {
      id: 'haute',
      icon: <Flame size={15} />,
      iconBg: 'bg-rose-100',
      iconFg: 'text-rose-600',
      label: 'Haute priorité',
      value: counts.haute,
      delta: '+3 vs 7 derniers jours',
      deltaTone: 'up',
      active: filterPriority === 'haute',
      onClick: () => setFilterPriority(filterPriority === 'haute' ? 'all' : 'haute'),
    },
    {
      id: 'todo',
      icon: <Zap size={15} />,
      iconBg: 'bg-amber-100',
      iconFg: 'text-amber-600',
      label: 'Actions suggérées',
      value: counts.todo,
      delta: '+6 vs 7 derniers jours',
      deltaTone: 'up',
      active: tab === 'a_traiter',
      onClick: () => setTab('a_traiter'),
    },
    {
      id: 'ignored',
      icon: <EyeOff size={15} />,
      iconBg: 'bg-slate-100',
      iconFg: 'text-slate-500',
      label: 'Ignorées 7j',
      value: counts.ignored,
      delta: '-2 vs 7 derniers jours',
      deltaTone: 'down',
    },
  ];

  const markDone = (id: string) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, status: 'done', done_at: new Date().toISOString() } : n)));

  const ignore = (id: string) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, status: 'ignored', ignored_at: new Date().toISOString() } : n)));

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => (n.status === 'unread' ? { ...n, status: 'read', read_at: new Date().toISOString() } : n)));
    toast.push({ message: 'Toutes les notifications marquées comme lues', kind: 'success' });
  };

  const bulkAction = (action: 'read' | 'done' | 'ignore') => {
    const ids = new Set(selected);
    setNotifications(prev =>
      prev.map(n => {
        if (!ids.has(n.id)) return n;
        const now = new Date().toISOString();
        if (action === 'read') return { ...n, status: 'read', read_at: now };
        if (action === 'done') return { ...n, status: 'done', done_at: now };
        return { ...n, status: 'ignored', ignored_at: now };
      }),
    );
    setSelected([]);
    toast.push({ message: `${selected.length} notification(s) mises à jour`, kind: 'success' });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Notifications"
        count={`${counts.unread} non lues`}
        subtitle="Suivez les événements importants détectés sur vos biens, zones, alertes et concurrents."
        actions={
          <>
            <SecondaryButton onClick={markAllRead}>
              <CheckCheck size={12} />
              Marquer tout lu
            </SecondaryButton>
            <SecondaryButton onClick={() => setShowPrefs(true)}>
              <Settings size={12} />
              Préférences
            </SecondaryButton>
            <SecondaryButton onClick={() => toast.push({ message: 'Export (démo)' })}>
              <Download size={12} />
              Exporter
            </SecondaryButton>
          </>
        }
      />

      <FiltersBar>
        <SearchInput placeholder="Rechercher une notification…" value={search} onChange={setSearch} width="w-[240px]" />
        <FilterDropdown
          label="Priorité"
          value={filterPriority}
          onChange={setFilterPriority}
          options={[
            { value: 'all', label: 'Toutes' },
            { value: 'haute', label: 'Haute' },
            { value: 'moyenne', label: 'Moyenne' },
            { value: 'info', label: 'Info' },
          ]}
        />
        <FilterDropdown
          label="Source"
          value={filterSource}
          onChange={setFilterSource}
          options={[
            { value: 'all', label: 'Toutes' },
            { value: 'alerte', label: 'Alertes' },
            { value: 'bien_suivi', label: 'Biens suivis' },
            { value: 'observatoire', label: 'Observatoire' },
            { value: 'prospection', label: 'Prospection' },
            { value: 'investissement', label: 'Investissement' },
            { value: 'agence_concurrente', label: 'Concurrents' },
            { value: 'estimation', label: 'Estimation' },
          ]}
        />
        <FilterDropdown
          label="Statut"
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'unread', label: 'Non lues' },
            { value: 'read', label: 'Lues' },
            { value: 'todo', label: 'À traiter' },
            { value: 'done', label: 'Traitées' },
            { value: 'ignored', label: 'Ignorées' },
          ]}
        />
        <FilterDropdown
          label="Période"
          value={filterPeriod}
          onChange={setFilterPeriod}
          options={[
            { value: 'today', label: "Aujourd'hui" },
            { value: '7j', label: '7 jours' },
            { value: '30j', label: '30 jours' },
            { value: 'all', label: 'Tout' },
          ]}
        />
      </FiltersBar>

      <KpiRow tiles={kpis} />

      <Tabs
        tabs={[
          { key: 'toutes', label: 'Toutes', count: counts.total },
          { key: 'non_lues', label: 'Non lues', count: counts.unread },
          { key: 'a_traiter', label: 'À traiter', count: counts.todo },
        ]}
        active={tab}
        onChange={k => setTab(k as TabKey)}
        right={
          <button
            onClick={() => setShowAdvanced(a => !a)}
            className={`h-7 px-2.5 rounded-md border inline-flex items-center gap-1.5 text-[11.5px] transition-colors ${
              showAdvanced
                ? 'border-propsight-300 bg-propsight-50 text-propsight-700'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50 bg-white'
            }`}
          >
            <SlidersHorizontal size={11} />
            Filtres avancés
          </button>
        }
      />

      {/* Bulk bar */}
      {selected.length > 0 && (
        <div className="px-4 py-2 bg-propsight-50 border-b border-propsight-200 flex items-center gap-2 flex-shrink-0">
          <span className="text-[12px] font-medium text-propsight-900">{selected.length} sélectionnée(s)</span>
          <button onClick={() => bulkAction('read')} className="h-7 px-2.5 rounded text-[11px] text-slate-700 hover:bg-white">
            Marquer lu
          </button>
          <button onClick={() => bulkAction('done')} className="h-7 px-2.5 rounded text-[11px] text-slate-700 hover:bg-white">
            Marquer traité
          </button>
          <button onClick={() => bulkAction('ignore')} className="h-7 px-2.5 rounded text-[11px] text-slate-700 hover:bg-white">
            Ignorer
          </button>
          <button onClick={() => setSelected([])} className="ml-auto h-7 px-2.5 rounded text-[11px] text-slate-500 hover:bg-white">
            Annuler la sélection
          </button>
        </div>
      )}

      {/* Feed */}
      <div className="flex-1 overflow-auto bg-slate-50">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Inbox size={20} />}
            title={tab === 'non_lues' ? 'Tout est à jour' : 'Rien à afficher'}
            description="Propsight vous préviendra dès qu'un événement sera détecté sur vos objets suivis."
            primary={{
              label: 'Voir mes alertes actives',
              onClick: () => (window.location.href = '/app/veille/alertes'),
            }}
            secondary={{ label: 'Tout afficher', onClick: () => setTab('toutes') }}
          />
        ) : (
          <div className="p-2">
            {groups.map(g => (
              <div key={g.key} className="mb-3">
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-propsight-500" />
                  <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                    {BUCKET_LABELS[g.key]} <span className="text-slate-400 font-normal">· {g.items.length}</span>
                  </span>
                </div>
                <div className="space-y-1">
                  {g.items.map(n => (
                    <NotificationRow
                      key={n.id}
                      notification={n}
                      active={n.id === drawerId}
                      selected={selected.includes(n.id)}
                      onSelectChange={checked =>
                        setSelected(prev => (checked ? [...prev, n.id] : prev.filter(x => x !== n.id)))
                      }
                      onClick={() => openDrawer(n.id)}
                      onMarkDone={() => markDone(n.id)}
                      onIgnore={() => ignore(n.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      {currentNotif && (
        <DrawerNotification
          notification={currentNotif}
          onClose={closeDrawer}
          onMarkDone={() => {
            markDone(currentNotif.id);
            closeDrawer();
          }}
          onIgnore={() => {
            ignore(currentNotif.id);
            closeDrawer();
          }}
        />
      )}

      {/* Prefs */}
      {showPrefs && <PreferencesModal onClose={() => setShowPrefs(false)} />}

      {/* Advanced filters popover */}
      {showAdvanced && (
        <AdvancedFiltersPanel
          onClose={() => setShowAdvanced(false)}
          filters={{ filterPriority, filterSource, filterStatus }}
          onApply={() => setShowAdvanced(false)}
        />
      )}
    </div>
  );
};

const AdvancedFiltersPanel: React.FC<{
  onClose: () => void;
  filters: { filterPriority: string; filterSource: string; filterStatus: string };
  onApply: () => void;
}> = ({ onClose, onApply }) => (
  <>
    <div className="fixed inset-0 z-[90] bg-slate-900/20" onClick={onClose} />
    <aside className="fixed top-0 right-0 bottom-0 z-[100] w-[380px] bg-white border-l border-slate-200 shadow-2xl flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-slate-900">Filtres avancés</h3>
        <button onClick={onClose} className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-100 text-slate-500">
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        <Section title="Presets sauvegardés">
          {['Haute priorité', 'Rapports ouverts cette semaine', 'Concurrents uniquement'].map(p => (
            <button
              key={p}
              onClick={onApply}
              className="flex items-center justify-between w-full p-2 rounded-md bg-white border border-slate-200 text-[11.5px] text-slate-700 hover:bg-propsight-50 hover:border-propsight-200"
            >
              <span>{p}</span>
              <span className="text-[11px] font-medium text-propsight-700">Appliquer</span>
            </button>
          ))}
        </Section>
        <Section title="Type d'objet">
          <div className="flex flex-wrap gap-1.5">
            {['Bien', 'Zone', 'Agence', 'Rapport', 'Opportunité'].map(c => (
              <span key={c} className="h-7 px-2.5 rounded-md border border-slate-200 bg-white text-[11px] text-slate-700 inline-flex items-center">
                {c}
              </span>
            ))}
          </div>
        </Section>
        <Section title="Assigné">
          <div className="text-[11px] text-slate-500">Sélection via dropdown (démo)</div>
        </Section>
      </div>
      <div className="px-4 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
        <button onClick={onClose} className="h-8 px-3 rounded-md text-[12px] text-slate-600 hover:bg-slate-100">
          Réinitialiser
        </button>
        <PrimaryButton onClick={onApply}>
          <Check size={12} />
          Appliquer
        </PrimaryButton>
      </div>
    </aside>
  </>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</div>
    <div className="space-y-1.5">{children}</div>
  </div>
);

export default NotificationsPage;
