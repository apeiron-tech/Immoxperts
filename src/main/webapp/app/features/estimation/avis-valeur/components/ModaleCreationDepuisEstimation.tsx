import React, { useState, useMemo } from 'react';
import { X, Search, Zap, ChevronRight, User } from 'lucide-react';
import { MOCK_ESTIMATIONS } from '../../_mocks/estimations';
import { Estimation } from '../../types';

type Periode = '7' | '30' | '90' | 'all';

const PERIODES: { value: Periode; label: string }[] = [
  { value: '7', label: '7 derniers jours' },
  { value: '30', label: '30 derniers jours' },
  { value: '90', label: '90 derniers jours' },
  { value: 'all', label: 'Toutes' },
];

const TYPE_LABEL: Record<string, string> = {
  appartement: 'Appartement',
  maison: 'Maison',
  terrain: 'Terrain',
  parking: 'Parking',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "aujourd'hui";
  if (days === 1) return 'hier';
  if (days < 30) return `il y a ${days}j`;
  if (days < 365) return `il y a ${Math.floor(days / 30)} mois`;
  return `il y a ${Math.floor(days / 365)} an${days >= 730 ? 's' : ''}`;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUtiliser: (estimation: Estimation) => void;
}

const ModaleCreationDepuisEstimation: React.FC<Props> = ({ isOpen, onClose, onUtiliser }) => {
  const [search, setSearch] = useState('');
  const [periode, setPeriode] = useState<Periode>('30');
  const [periodeOpen, setPeriodeOpen] = useState(false);

  const estimationsRapides = useMemo(() => MOCK_ESTIMATIONS.filter(e => e.type === 'rapide' && e.statut !== 'archivee'), []);

  const filtered = useMemo(() => {
    let list = [...estimationsRapides];

    // Filtre période
    if (periode !== 'all') {
      const limite = Date.now() - parseInt(periode, 10) * 24 * 60 * 60 * 1000;
      list = list.filter(e => new Date(e.created_at).getTime() >= limite);
    }

    // Filtre recherche
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        e =>
          e.bien.adresse.toLowerCase().includes(q) ||
          e.bien.ville.toLowerCase().includes(q) ||
          (e.client?.nom || '').toLowerCase().includes(q) ||
          (e.client?.prenom || '').toLowerCase().includes(q),
      );
    }

    // Tri par date desc
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  }, [estimationsRapides, periode, search]);

  if (!isOpen) return null;

  const periodeLabel = PERIODES.find(p => p.value === periode)?.label || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-md shadow-sm w-full max-w-2xl max-h-[85vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-propsight-600" />
            <h2 className="text-sm font-semibold text-slate-900">Nouvel avis de valeur depuis une estimation rapide</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Filtres */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2 flex-shrink-0">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher adresse, ville, client…"
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setPeriodeOpen(o => !o)}
              onBlur={() => setTimeout(() => setPeriodeOpen(false), 150)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span className="text-xs text-slate-400">Période :</span>
              <span className="font-medium">{periodeLabel}</span>
              <ChevronRight size={11} className={`transition-transform ${periodeOpen ? 'rotate-90' : ''} text-slate-400`} />
            </button>
            {periodeOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-sm py-1 z-10 w-44">
                {PERIODES.map(p => (
                  <button
                    key={p.value}
                    onMouseDown={() => {
                      setPeriode(p.value);
                      setPeriodeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs ${periode === p.value ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Liste */}
        <div className="px-5 py-2 text-xs text-slate-500 flex-shrink-0">
          Résultats ({filtered.length})
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <p className="text-sm font-medium mb-1">Aucune estimation rapide</p>
              <p className="text-xs text-center max-w-xs">
                Modifiez la période ou créez d'abord une estimation rapide depuis l'onglet Estimation rapide.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(est => {
                const prix = est.valeur_retenue ?? est.avm?.prix.estimation;
                const photo = est.photo_url || `https://picsum.photos/seed/${est.id}/120/90`;
                return (
                  <div
                    key={est.id}
                    className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-md hover:border-propsight-300 hover:bg-propsight-50/30 transition-colors group"
                  >
                    <img src={photo} alt="" className="w-16 h-16 rounded object-cover flex-shrink-0 border border-slate-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {TYPE_LABEL[est.bien.type_bien]} {est.bien.surface > 0 ? `${est.bien.surface}m²` : ''}
                          {est.bien.nb_pieces > 0 ? ` · ${est.bien.nb_pieces}p` : ''}
                        </p>
                      </div>
                      <p className="text-xs text-slate-600 truncate">
                        {est.bien.adresse}, {est.bien.code_postal} {est.bien.ville}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        {prix && <span className="font-semibold text-slate-700 tabular-nums">{prix.toLocaleString('fr-FR')} €</span>}
                        <span className="text-slate-300">·</span>
                        <span>{timeAgo(est.created_at)}</span>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <User size={10} />
                          {est.client ? `${est.client.civilite} ${est.client.prenom} ${est.client.nom}` : <span className="italic text-slate-400">pas renseigné</span>}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onUtiliser(est)}
                      className="px-3 py-1.5 bg-propsight-600 text-white rounded text-xs font-medium hover:bg-propsight-700 transition-colors flex items-center gap-1 flex-shrink-0 opacity-90 group-hover:opacity-100"
                    >
                      Utiliser
                      <ChevronRight size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <span>L'avis de valeur reprendra toutes les caractéristiques + valeur AVM de l'estimation source.</span>
          <button onClick={onClose} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModaleCreationDepuisEstimation;
