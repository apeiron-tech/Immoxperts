import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Map as MapIcon, Table2, Download, ChevronRight, Copy, X,
  Calculator, Layers, Target, MapPinned, MoreHorizontal, ArrowRight,
} from 'lucide-react';
import BiensLayout from '../layout/BiensLayout';
import KpiBar from '../shared/KpiBar';
import ViewToggle from '../shared/ViewToggle';
import FiltersBar from '../shared/FiltersBar';
import DvfMap from './DvfMap';
import { MOCK_VENTES_DVF, DVF_KPIS } from '../_mocks/ventesDvf';
import { VenteDVF, PeriodeKpi } from '../types';
import { formatEuros, formatEurosM2, formatDate } from '../utils/format';
import { MOCK_BIENS } from '../_mocks/biens';
import FicheBienModal from '../shared/FicheBienModal';

const DvfPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ventes] = useState<VenteDVF[]>(MOCK_VENTES_DVF);
  const [biens, setBiens] = useState(MOCK_BIENS);
  const [vue, setVue] = useState<'carte' | 'table'>('carte');
  const [period, setPeriod] = useState<PeriodeKpi>('12m');
  const [selectedId, setSelectedId] = useState<string | null>('dvf_001');
  const [search, setSearch] = useState('');

  const modalBienId = searchParams.get('bien');
  const modalBien = modalBienId ? biens.find(b => b.id === modalBienId) || null : null;

  const toggleFavorite = (id: string) =>
    setBiens(prev => prev.map(b => b.id === id ? { ...b, suivi: !b.suivi } : b));

  const filtered = useMemo(() => {
    if (!search.trim()) return ventes;
    const q = search.toLowerCase();
    return ventes.filter(v =>
      v.adresse.toLowerCase().includes(q) ||
      v.code_postal.includes(q) ||
      v.ville.toLowerCase().includes(q),
    );
  }, [ventes, search]);

  const selected = ventes.find(v => v.id === selectedId) || null;
  const linkedBien = selected?.bien_id ? biens.find(b => b.id === selected.bien_id) : null;

  return (
    <BiensLayout
      title="Biens vendus (DVF)"
      breadcrumbCurrent="Biens vendus (DVF)"
    >
      <div className="flex flex-col h-full min-h-0 overflow-hidden">
        {/* KPI + actions */}
        <div className="px-6 py-4 flex-shrink-0 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <KpiBar
                period={period}
                periodOptions={['30j', '90j', '12m', '24m']}
                onPeriodChange={setPeriod}
                items={[
                  {
                    label: 'Ventes trouvées',
                    value: DVF_KPIS.total.toLocaleString('fr-FR'),
                    sub: 'Dans vos critères',
                    highlight: true,
                  },
                  {
                    label: 'Prix/m² médian',
                    value: `${DVF_KPIS.prix_m2_median.toLocaleString('fr-FR')} €/m²`,
                    sub: 'Zone sélectionnée',
                  },
                  {
                    label: 'Évolution 12m',
                    value: `+${DVF_KPIS.evolution_12m}%`,
                    accent: 'green',
                    sub: 'vs 12m précédents',
                  },
                  {
                    label: 'Délai médian entre ventes',
                    value: `${DVF_KPIS.delai_median} j`,
                    sub: 'Rotation du secteur',
                  },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FiltersBar
              search={search}
              searchPlaceholder="Rechercher une adresse, un quartier…"
              onSearchChange={setSearch}
              filters={[
                { id: 'loc', label: 'Localisation', value: 'Paris 10e' },
                { id: 'periode', label: 'Période de vente', value: '01/05/2023 – 30/04/2024' },
                { id: 'type', label: 'Type de bien', value: 'Tous' },
                { id: 'surface', label: 'Surface', value: 'Tous' },
                { id: 'prix', label: 'Prix', value: 'Tous' },
              ]}
              onMoreFiltersClick={() => {}}
              moreFiltersCount={3}
              rightActions={
                <>
                  <ViewToggle
                    current={vue}
                    onChange={v => setVue(v as 'carte' | 'table')}
                    views={[
                      { id: 'table', label: 'Table', icon: <Table2 size={13} /> },
                      { id: 'carte', label: 'Carte', icon: <MapIcon size={13} /> },
                    ]}
                  />
                  <button className="h-8 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[12px] font-medium text-slate-700 flex items-center gap-1.5">
                    <Download size={12} /> Exporter
                  </button>
                </>
              }
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
          {vue === 'carte' ? (
            <div className="h-full flex gap-4">
              {/* Liste gauche */}
              <div className="w-[340px] flex-shrink-0 bg-white border border-slate-200 rounded-lg flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-semibold text-slate-900">Dernières ventes (DVF)</h3>
                    <select className="text-[11px] text-slate-500 bg-transparent border-0 focus:outline-none">
                      <option>Les plus récentes</option>
                      <option>Prix ↑</option>
                      <option>Prix ↓</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{DVF_KPIS.total.toLocaleString('fr-FR')} résultats</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filtered.map(v => {
                    const isActive = v.id === selectedId;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedId(v.id)}
                        className={`w-full text-left px-3 py-2.5 border-b border-slate-100 flex gap-2.5 hover:bg-slate-50 transition-colors ${isActive ? 'bg-propsight-50/60 border-l-2 border-l-violet-500 pl-2.5' : 'border-l-2 border-l-transparent'}`}
                      >
                        <div className="w-11 h-11 rounded bg-slate-100 flex-shrink-0 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${v.id}/64/64`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-[12px] font-semibold text-slate-900 truncate">{v.adresse}</p>
                            <ChevronRight size={11} className="text-slate-300 flex-shrink-0" />
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{v.code_postal} {v.ville}</p>
                          <div className="flex items-center gap-1 mt-1 text-[10px]">
                            <span className="px-1 h-3.5 rounded bg-slate-100 text-slate-600 font-medium flex items-center">Vendu (DVF)</span>
                            <span className="text-slate-400">Vendu {formatDate(v.date_vente)}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1 text-[11px]">
                            <span className="font-semibold text-slate-900 tabular-nums">{formatEuros(v.prix_vente, true)}</span>
                            <span className="text-slate-500 tabular-nums">{v.surface_m2} m² · {v.prix_m2.toLocaleString('fr-FR')} €/m²</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-slate-200 p-2 flex-shrink-0">
                  <button className="w-full h-8 rounded-md border border-propsight-200 bg-propsight-50 hover:bg-propsight-100 text-propsight-700 text-[12px] font-medium">
                    Voir toutes les ventes ({DVF_KPIS.total.toLocaleString('fr-FR')}) →
                  </button>
                </div>
              </div>

              {/* Carte + détail */}
              <div className="flex-1 flex gap-4 min-w-0">
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <DvfMap ventes={filtered} selectedId={selectedId} onSelect={setSelectedId} />
                  <div className="flex items-center gap-3 px-1 text-[11px] text-slate-500">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded accent-propsight-600" />
                      Afficher les clusters
                    </label>
                    <span className="inline-flex items-center gap-1.5">
                      <Layers size={11} /> Filtres appliqués (3)
                    </span>
                  </div>
                </div>

                {/* Drawer détail vente */}
                {selected && (
                  <div className="w-[360px] flex-shrink-0 bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col max-h-full">
                    <div className="relative">
                      <img
                        src={`https://picsum.photos/seed/${selected.id}/600/340`}
                        alt=""
                        className="w-full aspect-[16/10] object-cover"
                      />
                      <button
                        onClick={() => setSelectedId(null)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-md bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
                      >
                        <X size={13} className="text-slate-600" />
                      </button>
                    </div>

                    <div className="p-4 border-b border-slate-100">
                      <h3 className="text-[14px] font-semibold text-slate-900">{selected.adresse}</h3>
                      <p className="text-[12px] text-slate-500">{selected.code_postal} {selected.ville}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="px-2 h-5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">Vendu (DVF)</span>
                        <span className="text-[11px] text-slate-500 tabular-nums">{formatDate(selected.date_vente)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                        <span>Réf. DVF : {selected.ref_dvf}</span>
                        <button className="ml-1 text-slate-400 hover:text-slate-700"><Copy size={11} /></button>
                      </div>
                    </div>

                    <div className="px-4 py-3 grid grid-cols-4 gap-2 border-b border-slate-100">
                      <div>
                        <div className="text-[10px] uppercase text-slate-500 tracking-wide">Prix de vente</div>
                        <div className="text-[13px] font-bold text-slate-900 tabular-nums">{formatEuros(selected.prix_vente, true)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-500 tracking-wide">Surface</div>
                        <div className="text-[13px] font-bold text-slate-900 tabular-nums">{selected.surface_m2} m²</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-500 tracking-wide">Prix/m²</div>
                        <div className="text-[13px] font-bold text-slate-900 tabular-nums">{selected.prix_m2.toLocaleString('fr-FR')} €</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-500 tracking-wide">Type</div>
                        <div className="text-[13px] font-bold text-slate-900 capitalize">{selected.type}</div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-slate-200 px-4 flex-shrink-0">
                      <div className="flex gap-5">
                        {['Résumé', 'Contexte', 'Comparables 12', 'Liens', 'Activité'].map((t, i) => (
                          <button
                            key={t}
                            className={`py-2.5 text-[12px] font-medium border-b-2 -mb-px ${i === 0 ? 'text-propsight-700 border-propsight-500' : 'text-slate-500 border-transparent'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <section>
                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Actions rapides</div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <QA icon={<Layers size={12} />} label="Ajouter au comparatif" />
                          <QA icon={<Layers size={12} />} label="Utiliser comme comparable" />
                          <QA icon={<Calculator size={12} />} label="Lancer estimation" />
                          <QA icon={<MapPinned size={12} />} label="Voir secteur" />
                          <QA icon={<Target size={12} />} label="Voir annonces similaires" />
                          <QA icon={<MoreHorizontal size={12} />} label="Plus" />
                        </div>
                      </section>

                      <section>
                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Liens inter-modules</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <LinkTile label="Estimations" value="3" />
                          <LinkTile label="Analyse invest." value="2" />
                          <LinkTile label="Observatoire" value="12" />
                          <LinkTile label="Bien suivi" value="Oui" />
                        </div>
                      </section>
                    </div>

                    <div className="p-3 border-t border-slate-200 flex-shrink-0">
                      <button
                        onClick={() => linkedBien && setSearchParams({ bien: linkedBien.id })}
                        disabled={!linkedBien}
                        className={`w-full h-9 rounded-md text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors ${
                          linkedBien ? 'bg-propsight-600 hover:bg-propsight-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {linkedBien ? (<>Voir la fiche complète <ArrowRight size={13} /></>) : 'Pas de bien canonique rattaché'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-auto h-full">
                <table className="w-full text-[12px]">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr className="border-b border-slate-200">
                      {['Adresse', 'Localisation', 'Type', 'Surface', 'Date vente', 'Prix de vente', 'Prix/m²', 'Acquéreur', 'Comparable'].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(v => (
                      <tr key={v.id} onClick={() => setSelectedId(v.id)} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer h-11">
                        <td className="px-3 py-2 font-medium text-slate-900">{v.adresse}</td>
                        <td className="px-3 py-2 text-slate-600">{v.code_postal} {v.ville}</td>
                        <td className="px-3 py-2 capitalize text-slate-700">{v.type}</td>
                        <td className="px-3 py-2 tabular-nums text-slate-700">{v.surface_m2} m²</td>
                        <td className="px-3 py-2 tabular-nums text-slate-600">{formatDate(v.date_vente)}</td>
                        <td className="px-3 py-2 tabular-nums font-semibold text-slate-900">{formatEuros(v.prix_vente, true)}</td>
                        <td className="px-3 py-2 tabular-nums text-slate-700">{v.prix_m2.toLocaleString('fr-FR')} €</td>
                        <td className="px-3 py-2 text-slate-600 capitalize">{v.type_acquereur.replace('_', ' ')}</td>
                        <td className="px-3 py-2">
                          {v.utilise_comme_comparable ? (
                            <span className="px-2 h-5 rounded bg-green-50 text-green-700 text-[11px] font-medium inline-flex items-center">Oui</span>
                          ) : (
                            <span className="px-2 h-5 rounded bg-slate-100 text-slate-500 text-[11px] font-medium inline-flex items-center">Non</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalBien && (
        <FicheBienModal
          bien={modalBien}
          onClose={() => { const n = new URLSearchParams(searchParams); n.delete('bien'); setSearchParams(n); }}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </BiensLayout>
  );
};

const QA: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="flex items-center justify-center gap-1.5 h-8 px-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-medium text-slate-700 transition-colors">
    <span className="text-slate-500">{icon}</span>
    <span className="truncate">{label}</span>
  </button>
);

const LinkTile: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <button className="flex items-center justify-between p-2 rounded-md border border-slate-200 bg-white hover:border-propsight-300 hover:bg-propsight-50/30 transition-colors">
    <span className="text-[11px] text-slate-500">{label}</span>
    <span className="text-[12px] font-semibold text-slate-900">{value}</span>
  </button>
);

export default DvfPage;
