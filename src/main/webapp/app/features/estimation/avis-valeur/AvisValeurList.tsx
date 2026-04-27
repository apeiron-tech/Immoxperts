import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List, X, Eye, EyeOff } from 'lucide-react';
import { Estimation, StatutEstimation, EstimationFormData, ClientInfo, BienPortefeuille } from '../types';
import { StatusBadge } from '../components/shared/StatusBadge';
import { computeAvm } from '../utils/avmEngine';
import WizardCreation from '../components/shared/WizardCreation';
import ModaleCreationUrl from '../rapide/components/ModaleCreationUrl';
import ModaleCreationBien from '../rapide/components/ModaleCreationBien';
import AvisValeurCard from './components/AvisValeurCard';
import KPIRowAvisValeur from './components/KPIRowAvisValeur';
import SplitButtonCreationAdV from './components/SplitButtonCreationAdV';
import ModaleCreationDepuisEstimation from './components/ModaleCreationDepuisEstimation';
import { avisStore, useAvisList } from './store/avisStore';

const STATUTS: StatutEstimation[] = ['brouillon', 'finalisee', 'envoyee', 'ouverte', 'archivee'];

type SourceCreation = 'estimation_rapide' | 'bien_portefeuille' | 'annonce_url' | 'manuel';

const AvisValeurList: React.FC = () => {
  const navigate = useNavigate();
  const avisList = useAvisList();
  const [search, setSearch] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<StatutEstimation[]>([]);
  const [filtreOuverture, setFiltreOuverture] = useState<'all' | 'ouvert' | 'non_ouvert'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // État des modales
  const [modaleEstimationOpen, setModaleEstimationOpen] = useState(false);
  const [modaleUrlOpen, setModaleUrlOpen] = useState(false);
  const [modalePortefeuilleOpen, setModalePortefeuilleOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardSource, setWizardSource] = useState<SourceCreation>('manuel');
  const [wizardInitialBien, setWizardInitialBien] = useState<Partial<EstimationFormData> | undefined>(undefined);
  const [wizardInitialClient, setWizardInitialClient] = useState<ClientInfo | null>(null);

  // Création AdV centralisée (utilisée par les 4 modes)
  const creerAvis = (
    bien: Partial<EstimationFormData>,
    client: ClientInfo | null,
    source: SourceCreation,
    parentEstimationId?: string,
    photoUrl?: string | null,
  ): Estimation => {
    const id = `adv_new_${Date.now()}`;
    const now = new Date().toISOString();
    const fullBien: EstimationFormData = {
      adresse: bien.adresse || '',
      ville: bien.ville || '',
      code_postal: bien.code_postal || '',
      lat: bien.lat || 0,
      lon: bien.lon || 0,
      type_bien: bien.type_bien || 'appartement',
      surface: bien.surface || 0,
      nb_pieces: bien.nb_pieces || 0,
      nb_chambres: bien.nb_chambres || 0,
      etage: bien.etage || 0,
      nb_etages: bien.nb_etages || 0,
      surface_terrain: bien.surface_terrain || 0,
      annee_construction: bien.annee_construction || 0,
      dpe: bien.dpe || 'D',
      ges: bien.ges || 'D',
      etat: bien.etat || 'bon',
      exposition: bien.exposition || '',
      caracteristiques: bien.caracteristiques || [],
      description: bien.description || '',
      points_forts: bien.points_forts || [],
      points_defendre: bien.points_defendre || [],
      charges_mensuelles: bien.charges_mensuelles || 0,
      taxe_fonciere: bien.taxe_fonciere || 0,
    };
    return {
      id,
      type: 'avis_valeur',
      statut: 'brouillon',
      source,
      parent_estimation_id: parentEstimationId,
      version: 1,
      created_at: now,
      updated_at: now,
      auteur: 'Sophie Leroy',
      client,
      bien: fullBien,
      avm: computeAvm(fullBien),
      valeur_retenue: null,
      photo_url: photoUrl ?? null,
    };
  };

  // === Mode 1 : Depuis estimation rapide (prioritaire) ===
  const handleDepuisEstimation = () => setModaleEstimationOpen(true);

  const handleUtiliserEstimation = (est: Estimation) => {
    const newAdv = creerAvis(est.bien, est.client, 'estimation_rapide', est.id, est.photo_url);
    avisStore.add(newAdv);
    setModaleEstimationOpen(false);
    console.warn('[AvisValeur] Création AdV depuis estimation rapide', est.id, '→', newAdv.id);
    navigate(`/app/estimation/avis-valeur/${newAdv.id}`);
  };

  // === Mode 2 : Depuis bien portefeuille ===
  const handleDepuisPortefeuille = () => setModalePortefeuilleOpen(true);

  const handleSelectionBien = (bien: BienPortefeuille) => {
    setWizardInitialBien({
      adresse: bien.adresse,
      ville: bien.ville,
      code_postal: bien.code_postal,
      type_bien: bien.type_bien,
      surface: bien.surface,
      nb_pieces: bien.nb_pieces,
      etage: bien.etage,
      dpe: bien.dpe,
    });
    setWizardInitialClient(null);
    setWizardSource('bien_portefeuille');
    setModalePortefeuilleOpen(false);
    setWizardOpen(true);
  };

  // === Mode 3 : Depuis annonce URL ===
  const handleDepuisAnnonce = () => setModaleUrlOpen(true);

  const handleSubmitFromUrl = (data: { bien: Partial<EstimationFormData>; client: ClientInfo | null }) => {
    const newAdv = creerAvis(data.bien, data.client, 'annonce_url');
    avisStore.add(newAdv);
    setModaleUrlOpen(false);
    console.warn('[AvisValeur] Création AdV depuis annonce URL →', newAdv.id);
    navigate(`/app/estimation/avis-valeur/${newAdv.id}`);
  };

  // === Mode 4 : Saisie manuelle ===
  const handleSaisieManuelle = () => {
    setWizardInitialBien(undefined);
    setWizardInitialClient(null);
    setWizardSource('manuel');
    setWizardOpen(true);
  };

  // Soumission wizard (modes 2 et 4)
  const handleWizardSubmit = (data: { bien: Partial<EstimationFormData>; client: ClientInfo | null }) => {
    const newAdv = creerAvis(data.bien, data.client, wizardSource);
    avisStore.add(newAdv);
    setWizardOpen(false);
    setWizardInitialBien(undefined);
    setWizardInitialClient(null);
    console.warn(`[AvisValeur] Création AdV depuis wizard (${wizardSource}) →`, newAdv.id);
    navigate(`/app/estimation/avis-valeur/${newAdv.id}`);
  };

  // === Actions card ===
  const handleEditer = (id: string) => navigate(`/app/estimation/avis-valeur/${id}`);

  const handleDupliquer = (id: string) => {
    const o = avisList.find(a => a.id === id);
    if (!o) return;
    const newId = `adv_dup_${Date.now()}`;
    const now = new Date().toISOString();
    const dup: Estimation = { ...o, id: newId, statut: 'brouillon', envoi: undefined, version: 1, created_at: now, updated_at: now };
    console.warn('[AvisValeur] Duplication', id, '→', newId);
    avisStore.add(dup);
  };

  const handleNouvelleVersion = (id: string) => {
    const o = avisList.find(a => a.id === id);
    if (!o) return;
    const newId = `adv_v${(o.version || 1) + 1}_${Date.now()}`;
    const now = new Date().toISOString();
    const v: Estimation = {
      ...o,
      id: newId,
      statut: 'brouillon',
      envoi: undefined,
      version: (o.version || 1) + 1,
      versions_precedentes: [...(o.versions_precedentes || []), o.id],
      created_at: now,
      updated_at: now,
    };
    console.warn('[AvisValeur] Nouvelle version', id, '→', newId, `(v${v.version})`);
    avisStore.add(v);
    navigate(`/app/estimation/avis-valeur/${newId}`);
  };

  const handleArchiver = (id: string) => {
    console.warn('[AvisValeur] Archivage', id);
    avisStore.update(id, { statut: 'archivee' });
  };

  const handleSupprimer = (id: string) => {
    console.warn('[AvisValeur] Suppression', id);
    avisStore.remove(id);
  };

  // === Filtres ===
  const toggleStatut = (s: StatutEstimation) => {
    setFiltreStatut(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));
  };

  const filtered = avisList.filter(a => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.bien.adresse.toLowerCase().includes(q) ||
      a.bien.ville.toLowerCase().includes(q) ||
      (a.client?.nom || '').toLowerCase().includes(q) ||
      (a.client?.prenom || '').toLowerCase().includes(q) ||
      a.auteur.toLowerCase().includes(q);
    const matchStatut = filtreStatut.length === 0 || filtreStatut.includes(a.statut);
    let matchOuverture = true;
    if (filtreOuverture === 'ouvert') matchOuverture = a.statut === 'ouverte';
    else if (filtreOuverture === 'non_ouvert') matchOuverture = a.statut === 'envoyee' && (!a.envoi || a.envoi.ouvertures.length === 0);
    return matchSearch && matchStatut && matchOuverture;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-slate-900">Avis de valeur</h1>
          <span className="text-xs text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded">{avisList.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher adresse, client, auteur…"
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400 w-64"
            />
          </div>
          <div className="flex border border-slate-200 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 transition-colors ${viewMode === 'cards' ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="Vue cartes"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 transition-colors ${viewMode === 'table' ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="Vue tableau"
            >
              <List size={14} />
            </button>
          </div>
          <SplitButtonCreationAdV
            onDepuisEstimation={handleDepuisEstimation}
            onDepuisPortefeuille={handleDepuisPortefeuille}
            onDepuisAnnonce={handleDepuisAnnonce}
            onSaisieManuelle={handleSaisieManuelle}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 space-y-5">
          <KPIRowAvisValeur avisList={avisList} />

          {/* Filtres */}
          <div className="flex flex-col gap-2">
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
              <span className="mx-1 h-4 w-px bg-slate-200" />
              <span className="text-xs text-slate-500">Ouverture :</span>
              <FilterPill active={filtreOuverture === 'all'} onClick={() => setFiltreOuverture('all')}>Toutes</FilterPill>
              <FilterPill active={filtreOuverture === 'ouvert'} onClick={() => setFiltreOuverture('ouvert')}>
                <Eye size={10} /> Ouvert
              </FilterPill>
              <FilterPill active={filtreOuverture === 'non_ouvert'} onClick={() => setFiltreOuverture('non_ouvert')}>
                <EyeOff size={10} /> Non ouvert
              </FilterPill>
              {(filtreStatut.length > 0 || filtreOuverture !== 'all' || search) && (
                <button
                  onClick={() => {
                    setFiltreStatut([]);
                    setFiltreOuverture('all');
                    setSearch('');
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X size={11} /> Effacer
                </button>
              )}
            </div>
            {(filtreStatut.length > 0 || filtreOuverture !== 'all' || search) && (
              <p className="text-xs text-slate-500">
                {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Liste */}
          {filtered.length === 0 ? (
            <EmptyState
              vide={avisList.length === 0}
              onDepuisEstimation={handleDepuisEstimation}
              onDepuisPortefeuille={handleDepuisPortefeuille}
              onDepuisAnnonce={handleDepuisAnnonce}
              onSaisieManuelle={handleSaisieManuelle}
            />
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-4 gap-4">
              {filtered.map(a => (
                <AvisValeurCard
                  key={a.id}
                  avis={a}
                  onClick={id => navigate(`/app/estimation/avis-valeur/${id}`)}
                  onEditer={handleEditer}
                  onDupliquer={handleDupliquer}
                  onNouvelleVersion={handleNouvelleVersion}
                  onArchiver={handleArchiver}
                  onSupprimer={handleSupprimer}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <Th>Adresse</Th>
                    <Th>Client</Th>
                    <Th>Prix retenu</Th>
                    <Th>Statut</Th>
                    <Th>Ouverture</Th>
                    <Th>Auteur</Th>
                    <Th>Modifié</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, idx) => {
                    const envoye = a.statut === 'envoyee' || a.statut === 'ouverte';
                    const ouvert = a.statut === 'ouverte';
                    const nb = a.envoi?.ouvertures.length || 0;
                    const prix = a.valeur_retenue_detail?.prix ?? a.valeur_retenue ?? a.avm?.prix.estimation;
                    return (
                      <tr
                        key={a.id}
                        onClick={() => navigate(`/app/estimation/avis-valeur/${a.id}`)}
                        className={`cursor-pointer hover:bg-slate-50 transition-colors ${idx < filtered.length - 1 ? 'border-b border-slate-100' : ''}`}
                      >
                        <td className="px-4 py-2.5">
                          <p className="font-medium text-slate-900 truncate max-w-[220px]">{a.bien.adresse}</p>
                          <p className="text-xs text-slate-400">{a.bien.ville}</p>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-700">
                          {a.client ? `${a.client.civilite} ${a.client.prenom} ${a.client.nom}` : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="px-4 py-2.5">
                          {prix ? (
                            <span className="font-semibold text-slate-900 text-xs tabular-nums">{prix.toLocaleString('fr-FR')} €</span>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge statut={a.statut} />
                        </td>
                        <td className="px-4 py-2.5">
                          {envoye ? (
                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${ouvert ? 'text-green-700' : 'text-slate-400'}`}>
                              {ouvert ? <Eye size={11} /> : <EyeOff size={11} />}
                              {ouvert ? `${nb} vue${nb > 1 ? 's' : ''}` : 'Non ouvert'}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-500">{a.auteur}</td>
                        <td className="px-4 py-2.5 text-xs text-slate-500">{new Date(a.updated_at).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modales de création */}
      <ModaleCreationDepuisEstimation
        isOpen={modaleEstimationOpen}
        onClose={() => setModaleEstimationOpen(false)}
        onUtiliser={handleUtiliserEstimation}
      />
      <ModaleCreationBien
        isOpen={modalePortefeuilleOpen}
        onClose={() => setModalePortefeuilleOpen(false)}
        onSelect={handleSelectionBien}
      />
      <ModaleCreationUrl
        isOpen={modaleUrlOpen}
        onClose={() => setModaleUrlOpen(false)}
        onSubmit={handleSubmitFromUrl}
      />
      <WizardCreation
        isOpen={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          setWizardInitialBien(undefined);
          setWizardInitialClient(null);
        }}
        onSubmit={handleWizardSubmit}
        initialData={wizardInitialBien}
        initialClient={wizardInitialClient}
        titre="Nouvel avis de valeur"
        submitLabel="Créer l'avis de valeur"
      />
    </div>
  );
};

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{children}</th>
);

const FilterPill: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
      active ? 'bg-propsight-100 text-propsight-700 ring-1 ring-propsight-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
    }`}
  >
    {children}
  </button>
);

const EmptyState: React.FC<{
  vide: boolean;
  onDepuisEstimation: () => void;
  onDepuisPortefeuille: () => void;
  onDepuisAnnonce: () => void;
  onSaisieManuelle: () => void;
}> = ({ vide, onDepuisEstimation, onDepuisPortefeuille, onDepuisAnnonce, onSaisieManuelle }) => {
  if (!vide) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <p className="text-sm font-medium mb-1">Aucun résultat</p>
        <p className="text-xs">Modifiez vos filtres pour voir plus d'avis de valeur.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center text-center py-16 max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-full bg-propsight-50 flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-propsight-500">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>
      <h2 className="text-base font-semibold text-slate-900 mb-1">Vous n'avez encore aucun avis de valeur</h2>
      <p className="text-sm text-slate-500 mb-6">
        Créez votre premier avis de valeur pour générer un rapport professionnel envoyable à votre vendeur. 4 façons de commencer :
      </p>
      <div className="grid grid-cols-2 gap-2 w-full">
        <CtaButton onClick={onDepuisEstimation} label="Depuis une estimation rapide" primary />
        <CtaButton onClick={onDepuisPortefeuille} label="Depuis un bien du portefeuille" />
        <CtaButton onClick={onDepuisAnnonce} label="Depuis une annonce" />
        <CtaButton onClick={onSaisieManuelle} label="Saisie manuelle" />
      </div>
      <button
        onClick={() => console.warn('[AvisValeur] Voir un exemple (à venir)')}
        className="mt-4 text-xs text-propsight-600 hover:text-propsight-700 font-medium"
      >
        → Voir un exemple d'avis de valeur
      </button>
    </div>
  );
};

const CtaButton: React.FC<{ label: string; onClick: () => void; primary?: boolean }> = ({ label, onClick, primary }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
      primary ? 'bg-propsight-600 text-white hover:bg-propsight-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
    }`}
  >
    {label}
  </button>
);

export default AvisValeurList;
