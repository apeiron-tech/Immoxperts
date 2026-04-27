import React, { useMemo, useState } from 'react';
import {
  Filter,
  ImagePlus,
  LayoutGrid,
  List,
  Plus,
  Search,
  Sparkles,
  Star,
  Upload,
} from 'lucide-react';
import StudioLayout from '../layout/StudioLayout';
import KpiTile from '../shared/KpiTile';
import ChannelBadge from '../shared/ChannelBadge';
import { LIBRARY_ITEMS, type LibraryItem } from '../_mocks/marketing';

type Tab = 'tous' | 'kits' | 'assets' | 'templates' | 'visuels' | 'plans_adv' | 'archives';

const TABS: { id: Tab; label: string; predicate: (i: LibraryItem) => boolean }[] = [
  { id: 'tous', label: 'Tous les contenus', predicate: () => true },
  { id: 'kits', label: 'Kits', predicate: i => i.type === 'kit' },
  { id: 'assets', label: 'Assets', predicate: i => i.type === 'asset' },
  { id: 'templates', label: 'Templates', predicate: i => i.type === 'template' },
  { id: 'visuels', label: 'Visuels', predicate: i => i.type === 'visuel' },
  { id: 'plans_adv', label: 'Plans AdV', predicate: i => i.type === 'plan_adv' },
  { id: 'archives', label: 'Archives', predicate: () => false },
];

const KPIS = [
  { id: 'contenus', label: 'Contenus', value: '132', delta: '+18 ce mois', trend: 'up' as const },
  { id: 'kits', label: 'Kits', value: '24', delta: '+4', trend: 'up' as const },
  { id: 'templates', label: 'Templates org.', value: '38', delta: '12 obligatoires', trend: 'flat' as const },
  { id: 'reuse', label: 'Réutilisations 30j', value: '186', delta: '+22 %', trend: 'up' as const },
];

const TYPE_LABEL: Record<LibraryItem['type'], string> = {
  kit: 'Kit',
  asset: 'Asset',
  template: 'Template',
  visuel: 'Visuel',
  plan_adv: 'Plan AdV',
};

const TYPE_TONE: Record<LibraryItem['type'], string> = {
  kit: 'bg-propsight-50 text-propsight-700',
  asset: 'bg-neutral-100 text-neutral-700',
  template: 'bg-info-50 text-info-700',
  visuel: 'bg-amber-50 text-amber-700',
  plan_adv: 'bg-success-50 text-success-700',
};

const Card: React.FC<{ item: LibraryItem }> = ({ item }) => (
  <article className="bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col hover:border-propsight-300 transition-colors group">
    <div className="aspect-[16/9] bg-gradient-to-br from-neutral-100 to-neutral-50 border-b border-neutral-100 flex items-center justify-center text-neutral-300">
      <ImagePlus size={24} />
    </div>
    <div className="p-3 flex-1 flex flex-col">
      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${TYPE_TONE[item.type]}`}>
          {TYPE_LABEL[item.type]}
        </span>
        {item.channel && <ChannelBadge channel={item.channel} />}
        {item.used > 20 && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700">
            <Star size={9} className="fill-current" /> Top
          </span>
        )}
      </div>
      <h4 className="text-[12.5px] font-semibold text-neutral-900 leading-snug mb-1 line-clamp-2">{item.title}</h4>
      {item.bien && <p className="text-[11px] text-neutral-500 mb-1.5">📍 {item.bien}</p>}
      <div className="text-[10.5px] text-neutral-500 space-y-0.5 mt-auto">
        <div>Utilisé <strong className="text-neutral-700">{item.used}</strong> fois</div>
        {item.bestOn && <div>Meilleur sur : {item.bestOn}</div>}
        {item.perfHint && <div className="text-success-700">{item.perfHint}</div>}
      </div>
      <div className="mt-2 flex items-center justify-between pt-2 border-t border-neutral-100">
        <span className="text-[10.5px] text-neutral-400">{item.author} · {item.updatedAt}</span>
        <button className="text-[11px] font-medium text-propsight-700 hover:text-propsight-900">Réutiliser</button>
      </div>
    </div>
  </article>
);

const Row: React.FC<{ item: LibraryItem }> = ({ item }) => (
  <tr className="hover:bg-neutral-50/60 cursor-pointer">
    <td className="py-2 pl-3">
      <div className="font-medium text-neutral-900">{item.title}</div>
      {item.bien && <div className="text-[10.5px] text-neutral-500">{item.bien}</div>}
    </td>
    <td className="py-2 px-2">
      <span className={`text-[10.5px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${TYPE_TONE[item.type]}`}>
        {TYPE_LABEL[item.type]}
      </span>
    </td>
    <td className="py-2 px-2">
      {item.channel ? <ChannelBadge channel={item.channel} withLabel /> : <span className="text-neutral-400">—</span>}
    </td>
    <td className="py-2 px-2 text-right tabular-nums font-medium text-neutral-900">{item.used}</td>
    <td className="py-2 px-2 text-[11.5px] text-success-700">{item.perfHint ?? '—'}</td>
    <td className="py-2 px-2 text-[11.5px] text-neutral-700">{item.author}</td>
    <td className="py-2 px-2 text-[11.5px] text-neutral-500">{item.updatedAt}</td>
    <td className="py-2 pr-3 text-right">
      <button className="text-[11px] font-medium text-propsight-700 hover:text-propsight-900">Réutiliser</button>
    </td>
  </tr>
);

const BibliothequePage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('tous');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const items = useMemo(() => {
    const tabPredicate = TABS.find(t => t.id === tab)?.predicate ?? (() => true);
    return LIBRARY_ITEMS.filter(i => {
      if (!tabPredicate(i)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return i.title.toLowerCase().includes(q) || i.tags.some(t => t.includes(q));
      }
      return true;
    });
  }, [tab, search]);

  return (
    <StudioLayout
      title="Bibliothèque"
      breadcrumbCurrent="Bibliothèque"
      headerRight={
        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1.5 text-[12.5px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
            <Upload size={13} />
            Importer
          </button>
          <button className="px-3 py-1.5 text-[12.5px] font-medium rounded-md text-white bg-propsight-600 hover:bg-propsight-700 inline-flex items-center gap-1.5">
            <Plus size={13} />
            Nouveau template
          </button>
        </div>
      }
    >
      <div className="h-full overflow-y-auto p-5 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {KPIS.map(k => (
            <KpiTile key={k.id} label={k.label} value={k.value} delta={k.delta} trend={k.trend} />
          ))}
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg">
          <div className="px-3 py-2.5 border-b border-neutral-100 flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher (titre, tag, bien)…"
                className="w-full pl-8 pr-3 py-1.5 text-[12.5px] border border-neutral-200 rounded-md focus:outline-none focus:border-propsight-400 focus:ring-2 focus:ring-propsight-100 bg-white"
              />
            </div>
            <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
              <Filter size={12} /> Canal
            </button>
            <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
              <Filter size={12} /> Type bien
            </button>
            <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
              <Sparkles size={12} /> Performance
            </button>
            <div className="ml-auto inline-flex items-center border border-neutral-200 rounded-md overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 ${view === 'grid' ? 'bg-propsight-50 text-propsight-700' : 'text-neutral-500'}`}
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 border-l border-neutral-200 ${view === 'list' ? 'bg-propsight-50 text-propsight-700' : 'text-neutral-500'}`}
              >
                <List size={13} />
              </button>
            </div>
          </div>

          <div className="px-3 pt-2 flex items-center gap-1 border-b border-neutral-100 overflow-x-auto">
            {TABS.map(t => {
              const count = LIBRARY_ITEMS.filter(i => t.predicate(i)).length;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 text-[12px] font-medium border-b-2 -mb-px whitespace-nowrap ${
                    active
                      ? 'text-propsight-700 border-propsight-600'
                      : 'text-neutral-600 border-transparent hover:text-neutral-900'
                  }`}
                >
                  {t.label}
                  <span className={`ml-1.5 text-[10.5px] ${active ? 'text-propsight-600' : 'text-neutral-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3">
            {view === 'grid' ? (
              <div className="grid grid-cols-3 gap-3">
                {items.map(i => <Card key={i.id} item={i} />)}
                {items.length === 0 && (
                  <div className="col-span-3 py-12 text-center text-[12px] text-neutral-500">Aucun contenu pour ce filtre.</div>
                )}
              </div>
            ) : (
              <table className="w-full text-[12px]">
                <thead className="bg-neutral-50/50">
                  <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                    <th className="py-2 pl-3 font-semibold">Titre</th>
                    <th className="py-2 px-2 font-semibold">Type</th>
                    <th className="py-2 px-2 font-semibold">Canal</th>
                    <th className="py-2 px-2 text-right font-semibold">Utilisé</th>
                    <th className="py-2 px-2 font-semibold">Performance</th>
                    <th className="py-2 px-2 font-semibold">Auteur</th>
                    <th className="py-2 px-2 font-semibold">Mis à jour</th>
                    <th className="py-2 pr-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {items.map(i => <Row key={i.id} item={i} />)}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </StudioLayout>
  );
};

export default BibliothequePage;
