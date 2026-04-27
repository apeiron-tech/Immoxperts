import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List, X } from 'lucide-react';
import { MOCK_ESTIMATIONS } from '../_mocks/estimations';
import { Estimation, StatutEstimation, EstimationFormData, ClientInfo, BienPortefeuille } from '../types';
import EstimationRapideCard from './components/EstimationRapideCard';
import KPIRowRapide from './components/KPIRowRapide';
import SplitButtonCreation from './components/SplitButtonCreation';
import ModaleCreationUrl from './components/ModaleCreationUrl';
import ModaleCreationBien from './components/ModaleCreationBien';
import WizardCreation from '../components/shared/WizardCreation';
import { StatusBadge } from '../components/shared/StatusBadge';
import { computeAvm } from '../utils/avmEngine';

const STATUTS: StatutEstimation[] = ['brouillon', 'finalisee', 'envoyee', 'ouverte', 'archivee'];

const EstimationRapideList: React.FC = () => {
  const navigate = useNavigate();
  const [estimations, setEstimations] = useState<Estimation[]>([...MOCK_ESTIMATIONS]);
  const [search, setSearch] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<StatutEstimation[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showModaleUrl, setShowModaleUrl] = useState(false);
  const [showModaleManuel, setShowModaleManuel] = useState(false);
  const [showModalePortefeuille, setShowModalePortefeuille] = useState(false);
  const [portefeuillePreselect, setPortefeuillePreselect] = useState<BienPortefeuille | null>(null);

  const handleCreer = (data: { bien: Partial<EstimationFormData>; client: ClientInfo | null }) => {
    const id = `est_new_${Date.now()}`;
    const now = new Date().toISOString();
    const newEst: Estimation = {
      id,
      type: 'rapide',
      statut: 'brouillon',
      source: 'manuel',
      created_at: now,
      updated_at: now,
      auteur: 'Sophie Leroy',
      client: data.client,
      bien: {
        adresse: data.bien.adresse || '',
        ville: data.bien.ville || '',
        code_postal: data.bien.code_postal || '',
        lat: 0,
        lon: 0,
        type_bien: data.bien.type_bien || 'appartement',
        surface: data.bien.surface || 0,
        nb_pieces: data.bien.nb_pieces || 0,
        nb_chambres: data.bien.nb_chambres || 0,
        etage: data.bien.etage || 0,
        nb_etages: data.bien.nb_etages || 0,
        surface_terrain: data.bien.surface_terrain || 0,
        annee_construction: data.bien.annee_construction || 0,
        dpe: data.bien.dpe || 'D',
        ges: data.bien.ges || 'D',
        etat: data.bien.etat || 'bon',
        exposition: data.bien.exposition || '',
        caracteristiques: data.bien.caracteristiques || [],
        description: data.bien.description || '',
        points_forts: data.bien.points_forts || [],
        points_defendre: data.bien.points_defendre || [],
        charges_mensuelles: data.bien.charges_mensuelles || 0,
        taxe_fonciere: data.bien.taxe_fonciere || 0,
      },
      avm: computeAvm(data.bien),
      valeur_retenue: null,
      photo_url: null,
    };
    console.warn('[EstimationRapideList] Nouvelle estimation créée', id);
    setEstimations(prev => [newEst, ...prev]);
    navigate(`/app/estimation/rapide/${id}`);
  };

  const handlePortefeuilleSelect = (bien: BienPortefeuille) => {
    setPortefeuillePreselect(bien);
    setShowModalePortefeuille(false);
    setShowModaleManuel(true);
  };

  const handleDupliquer = (id: string) => {
    const original = estimations.find(e => e.id === id);
    if (!original) return;
    const newId = `est_dup_${Date.now()}`;
    const now = new Date().toISOString();
    const dup: Estimation = { ...original, id: newId, statut: 'brouillon', created_at: now, updated_at: now };
    console.warn('[EstimationRapideList] Duplication', id, '->', newId);
    setEstimations(prev => [dup, ...prev]);
  };

  const handleArchiver = (id: string) => {
    console.warn('[EstimationRapideList] Archivage', id);
    setEstimations(prev => prev.map(e => e.id === id ? { ...e, statut: 'archivee' } : e));
  };

  const handleSupprimer = (id: string) => {
    console.warn('[EstimationRapideList] Suppression', id);
    setEstimations(prev => prev.filter(e => e.id !== id));
  };

  const handlePromouvoir = (id: string) => {
    console.warn('[EstimationRapideList] Promotion avis de valeur', id);
  };

  const toggleStatut = (s: StatutEstimation) => {
    setFiltreStatut(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const filtered = estimations.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      e.bien.adresse.toLowerCase().includes(q) ||
      e.bien.ville.toLowerCase().includes(q) ||
      (e.client?.nom || '').toLowerCase().includes(q) ||
      e.auteur.toLowerCase().includes(q);
    const matchStatut = filtreStatut.length === 0 || filtreStatut.includes(e.statut);
    return matchSearch && matchStatut;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-slate-900">Estimation rapide</h1>
          <span className="text-xs text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded">{estimations.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400 w-48"
            />
          </div>
          <div className="flex border border-slate-200 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 transition-colors ${viewMode === 'cards' ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 transition-colors ${viewMode === 'table' ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={14} />
            </button>
          </div>
          <div className="relative">
            <SplitButtonCreation
              onUrl={() => setShowModaleUrl(true)}
              onManuel={() => setShowModaleManuel(true)}
              onPortefeuille={() => setShowModalePortefeuille(true)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 space-y-5">
          {/* KPIs */}
          <KPIRowRapide />

          {/* Filtres statut */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500">Statut :</span>
            {STATUTS.map(s => (
              <button
                key={s}
                onClick={() => toggleStatut(s)}
                className={`transition-all ${filtreStatut.includes(s) ? 'ring-2 ring-propsight-400 ring-offset-1' : ''}`}
              >
                <StatusBadge statut={s} />
              </button>
            ))}
            {filtreStatut.length > 0 && (
              <button
                onClick={() => setFiltreStatut([])}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={11} /> Effacer
              </button>
            )}
          </div>

          {/* Chips filtres actifs */}
          {(search || filtreStatut.length > 0) && (
            <p className="text-xs text-slate-500">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</p>
          )}

          {/* Liste */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <p className="text-sm font-medium mb-1">Aucune estimation</p>
              <p className="text-xs">Modifiez vos filtres ou créez une nouvelle estimation.</p>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-4 gap-4">
              {filtered.map(est => (
                <EstimationRapideCard
                  key={est.id}
                  estimation={est}
                  onClick={id => navigate(`/app/estimation/rapide/${id}`)}
                  onDupliquer={handleDupliquer}
                  onArchiver={handleArchiver}
                  onSupprimer={handleSupprimer}
                  onPromouvoir={handlePromouvoir}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Adresse</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Surface</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimation</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Auteur</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((est, idx) => (
                    <tr
                      key={est.id}
                      onClick={() => navigate(`/app/estimation/rapide/${est.id}`)}
                      className={`cursor-pointer hover:bg-slate-50 transition-colors ${idx < filtered.length - 1 ? 'border-b border-slate-100' : ''}`}
                    >
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-slate-900 truncate max-w-[200px]">{est.bien.adresse}</p>
                        <p className="text-xs text-slate-400">{est.bien.ville}</p>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-600 capitalize">{est.bien.type_bien}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-600">{est.bien.surface > 0 ? `${est.bien.surface} m²` : '—'}</td>
                      <td className="px-4 py-2.5">
                        {est.avm ? (
                          <div>
                            <p className="font-semibold text-slate-900 text-xs">{est.avm.prix.estimation.toLocaleString('fr-FR')} €</p>
                            <p className="text-xs text-slate-400">{est.avm.prix.prix_m2.toLocaleString('fr-FR')} €/m²</p>
                          </div>
                        ) : <span className="text-slate-400 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-2.5"><StatusBadge statut={est.statut} /></td>
                      <td className="px-4 py-2.5 text-xs text-slate-600">
                        {est.client ? `${est.client.prenom} ${est.client.nom}` : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-500">{est.auteur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ModaleCreationUrl
        isOpen={showModaleUrl}
        onClose={() => setShowModaleUrl(false)}
        onSubmit={handleCreer}
      />

      <WizardCreation
        isOpen={showModaleManuel}
        onClose={() => { setShowModaleManuel(false); setPortefeuillePreselect(null); }}
        onSubmit={handleCreer}
        initialData={
          portefeuillePreselect
            ? {
                adresse: portefeuillePreselect.adresse,
                ville: portefeuillePreselect.ville,
                code_postal: portefeuillePreselect.code_postal,
                type_bien: portefeuillePreselect.type_bien,
                surface: portefeuillePreselect.surface,
                nb_pieces: portefeuillePreselect.nb_pieces,
                etage: portefeuillePreselect.etage,
                dpe: portefeuillePreselect.dpe,
              }
            : undefined
        }
      />

      <ModaleCreationBien
        isOpen={showModalePortefeuille}
        onClose={() => setShowModalePortefeuille(false)}
        onSelect={handlePortefeuilleSelect}
      />
    </div>
  );
};

export default EstimationRapideList;
