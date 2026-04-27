import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List, X, AlertTriangle } from 'lucide-react';
import { Estimation, StatutEstimation, EstimationFormData, ClientInfo, BienPortefeuille } from '../types';
import { StatusBadge } from '../components/shared/StatusBadge';
import { computeAvm } from '../utils/avmEngine';
import WizardCreation from '../components/shared/WizardCreation';
import ModaleCreationUrl from '../rapide/components/ModaleCreationUrl';
import ModaleCreationBien from '../rapide/components/ModaleCreationBien';
import ModaleCreationDepuisEstimation from '../avis-valeur/components/ModaleCreationDepuisEstimation';
import EtudeLocativeCard from './components/EtudeLocativeCard';
import KPIRowEtudeLocative from './components/KPIRowEtudeLocative';
import SplitButtonCreationEtude from './components/SplitButtonCreationEtude';
import { etudeStore, useEtudesList } from './store/etudeStore';
import { isZoneTendue } from '../_mocks/reglementations';

const STATUTS: StatutEstimation[] = ['brouillon', 'finalisee', 'envoyee', 'ouverte', 'archivee'];

type SourceCreation = 'estimation_rapide' | 'bien_portefeuille' | 'annonce_url' | 'manuel';

const EtudeLocativeList: React.FC = () => {
  const navigate = useNavigate();
  const etudes = useEtudesList();
  const [search, setSearch] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<StatutEstimation[]>([]);
  const [filtreZone, setFiltreZone] = useState<'all' | 'tendue' | 'non_tendue'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const [modaleEstimationOpen, setModaleEstimationOpen] = useState(false);
  const [modaleUrlOpen, setModaleUrlOpen] = useState(false);
  const [modalePortefeuilleOpen, setModalePortefeuilleOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardSource, setWizardSource] = useState<SourceCreation>('manuel');
  const [wizardInitialBien, setWizardInitialBien] = useState<Partial<EstimationFormData> | undefined>(undefined);
  const [wizardInitialClient, setWizardInitialClient] = useState<ClientInfo | null>(null);

  const creerEtude = (
    bien: Partial<EstimationFormData>,
    client: ClientInfo | null,
    source: SourceCreation,
    parentEstimationId?: string,
    photoUrl?: string | null,
  ): Estimation => {
    const id = `etl_new_${Date.now()}`;
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
      type: 'etude_locative',
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

  // Mode 1 prioritaire : depuis annonce
  const handleDepuisAnnonce = () => setModaleUrlOpen(true);

  const handleSubmitFromUrl = (data: { bien: Partial<EstimationFormData>; client: ClientInfo | null }) => {
    const n = creerEtude(data.bien, data.client, 'annonce_url');
    etudeStore.add(n);
    setModaleUrlOpen(false);
    console.warn('[EtudeLocative] Création depuis annonce URL →', n.id);
    navigate(`/app/estimation/etude-locative/${n.id}`);
  };

  // Mode 2 : bien portefeuille
  const handleDepuisPortefeuille = () => setModalePortefeuilleOpen(true);

  const handleSelectionBien = (bien: BienPortefeuille) => {
    setWizardInitialBien({
      adresse: bien.adresse, ville: bien.ville, code_postal: bien.code_postal,
      type_bien: bien.type_bien, surface: bien.surface, nb_pieces: bien.nb_pieces, etage: bien.etage, dpe: bien.dpe,
    });
    setWizardInitialClient(null);
    setWizardSource('bien_portefeuille');
    setModalePortefeuilleOpen(false);
    setWizardOpen(true);
  };

  // Mode 3 : depuis estimation existante (rapide)
  const handleDepuisEstimation = () => setModaleEstimationOpen(true);

  const handleUtiliserEstimation = (est: Estimation) => {
    const n = creerEtude(est.bien, est.client, 'estimation_rapide', est.id, est.photo_url);
    etudeStore.add(n);
    setModaleEstimationOpen(false);
    console.warn('[EtudeLocative] Création depuis estimation rapide', est.id, '→', n.id);
    navigate(`/app/estimation/etude-locative/${n.id}`);
  };

  // Mode 4 : saisie manuelle
  const handleSaisieManuelle = () => {
    setWizardInitialBien(undefined);
    setWizardInitialClient(null);
    setWizardSource('manuel');
    setWizardOpen(true);
  };

  const handleWizardSubmit = (data: { bien: Partial<EstimationFormData>; client: ClientInfo | null }) => {
    const n = creerEtude(data.bien, data.client, wizardSource);
    etudeStore.add(n);
    setWizardOpen(false);
    setWizardInitialBien(undefined);
    setWizardInitialClient(null);
    console.warn(`[EtudeLocative] Création via wizard (${wizardSource}) →`, n.id);
    navigate(`/app/estimation/etude-locative/${n.id}`);
  };

  const handleEditer = (id: string) => navigate(`/app/estimation/etude-locative/${id}`);

  const handleDupliquer = (id: string) => {
    const o = etudes.find(a => a.id === id);
    if (!o) return;
    const newId = `etl_dup_${Date.now()}`;
    const now = new Date().toISOString();
    etudeStore.add({ ...o, id: newId, statut: 'brouillon', envoi: undefined, version: 1, created_at: now, updated_at: now });
    console.warn('[EtudeLocative] Duplication', id, '→', newId);
  };

  const handleNouvelleVersion = (id: string) => {
    const o = etudes.find(a => a.id === id);
    if (!o) return;
    const newId = `etl_v${(o.version || 1) + 1}_${Date.now()}`;
    const now = new Date().toISOString();
    etudeStore.add({
      ...o,
      id: newId,
      statut: 'brouillon',
      envoi: undefined,
      version: (o.version || 1) + 1,
      versions_precedentes: [...(o.versions_precedentes || []), o.id],
      created_at: now,
      updated_at: now,
    });
    console.warn('[EtudeLocative] Nouvelle version', id, '→', newId);
    navigate(`/app/estimation/etude-locative/${newId}`);
  };

  const handleArchiver = (id: string) => { console.warn('[EtudeLocative] Archivage', id); etudeStore.update(id, { statut: 'archivee' }); };
  const handleSupprimer = (id: string) => { console.warn('[EtudeLocative] Suppression', id); etudeStore.remove(id); };

  const toggleStatut = (s: StatutEstimation) =>
    setFiltreStatut(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));

  const filtered = etudes.filter(e => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.bien.adresse.toLowerCase().includes(q) ||
      e.bien.ville.toLowerCase().includes(q) ||
      (e.client?.nom || '').toLowerCase().includes(q) ||
      (e.client?.prenom || '').toLowerCase().includes(q) ||
      e.auteur.toLowerCase().includes(q);
    const matchStatut = filtreStatut.length === 0 || filtreStatut.includes(e.statut);
    const tendue = isZoneTendue(e.bien.code_postal);
    const matchZone =
      filtreZone === 'all' ? true : filtreZone === 'tendue' ? tendue : !tendue;
    return matchSearch && matchStatut && matchZone;
  });

  const hasFiltres = filtreStatut.length > 0 || filtreZone !== 'all' || !!search;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-slate-900">Étude locative</h1>
          <span className="text-xs text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded">{etudes.length}</span>
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
          <SplitButtonCreationEtude
            onDepuisAnnonce={handleDepuisAnnonce}
            onDepuisPortefeuille={handleDepuisPortefeuille}
            onDepuisEstimation={handleDepuisEstimation}
            onSaisieManuelle={handleSaisieManuelle}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 space-y-5">
          <KPIRowEtudeLocative etudes={etudes} />

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
              <span className="text-xs text-slate-500">Zone :</span>
              <FilterPill active={filtreZone === 'all'} onClick={() => setFiltreZone('all')}>Toutes</FilterPill>
              <FilterPill active={filtreZone === 'tendue'} onClick={() => setFiltreZone('tendue')}>
                <AlertTriangle size={10} /> Zone tendue
              </FilterPill>
              <FilterPill active={filtreZone === 'non_tendue'} onClick={() => setFiltreZone('non_tendue')}>
                Hors zone tendue
              </FilterPill>
              {hasFiltres && (
                <button
                  onClick={() => { setFiltreStatut([]); setFiltreZone('all'); setSearch(''); }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X size={11} /> Effacer
                </button>
              )}
            </div>
            {hasFiltres && (
              <p className="text-xs text-slate-500">
                {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              vide={etudes.length === 0}
              onDepuisAnnonce={handleDepuisAnnonce}
              onDepuisPortefeuille={handleDepuisPortefeuille}
              onDepuisEstimation={handleDepuisEstimation}
              onSaisieManuelle={handleSaisieManuelle}
            />
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-4 gap-4">
              {filtered.map(e => (
                <EtudeLocativeCard
                  key={e.id}
                  etude={e}
                  onClick={id => navigate(`/app/estimation/etude-locative/${id}`)}
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
                    <Th>Zone</Th>
                    <Th>Client</Th>
                    <Th>Loyer HC</Th>
                    <Th>Statut</Th>
                    <Th>Auteur</Th>
                    <Th>Modifié</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, idx) => {
                    const tendue = isZoneTendue(e.bien.code_postal);
                    const loyer = e.valeur_retenue_locatif?.loyer_hc ?? e.valeur_retenue ?? e.avm?.loyer.estimation;
                    return (
                      <tr
                        key={e.id}
                        onClick={() => navigate(`/app/estimation/etude-locative/${e.id}`)}
                        className={`cursor-pointer hover:bg-slate-50 transition-colors ${idx < filtered.length - 1 ? 'border-b border-slate-100' : ''}`}
                      >
                        <td className="px-4 py-2.5">
                          <p className="font-medium text-slate-900 truncate max-w-[220px]">{e.bien.adresse}</p>
                          <p className="text-xs text-slate-400">{e.bien.ville}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          {tendue ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                              <AlertTriangle size={9} /> Tendue
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-700">
                          {e.client ? `${e.client.civilite} ${e.client.prenom} ${e.client.nom}` : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="px-4 py-2.5">
                          {loyer ? (
                            <span className="font-semibold text-slate-900 text-xs tabular-nums">{Math.round(loyer).toLocaleString('fr-FR')} €</span>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5"><StatusBadge statut={e.statut} /></td>
                        <td className="px-4 py-2.5 text-xs text-slate-500">{e.auteur}</td>
                        <td className="px-4 py-2.5 text-xs text-slate-500">{new Date(e.updated_at).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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
        titre="Nouvelle étude locative"
        submitLabel="Créer l'étude locative"
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
  onDepuisAnnonce: () => void;
  onDepuisPortefeuille: () => void;
  onDepuisEstimation: () => void;
  onSaisieManuelle: () => void;
}> = ({ vide, onDepuisAnnonce, onDepuisPortefeuille, onDepuisEstimation, onSaisieManuelle }) => {
  if (!vide) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <p className="text-sm font-medium mb-1">Aucun résultat</p>
        <p className="text-xs">Modifiez vos filtres pour voir plus d'études locatives.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center text-center py-16 max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-full bg-propsight-50 flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-propsight-500">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <h2 className="text-base font-semibold text-slate-900 mb-1">Vous n'avez encore aucune étude locative</h2>
      <p className="text-sm text-slate-500 mb-6">
        Créez votre première étude locative pour produire un rapport professionnel à envoyer à votre bailleur. 4 façons de commencer :
      </p>
      <div className="grid grid-cols-2 gap-2 w-full">
        <CtaButton onClick={onDepuisAnnonce} label="Depuis une annonce" primary />
        <CtaButton onClick={onDepuisPortefeuille} label="Depuis un bien du portefeuille" />
        <CtaButton onClick={onDepuisEstimation} label="Depuis une estimation existante" />
        <CtaButton onClick={onSaisieManuelle} label="Saisie manuelle" />
      </div>
      <button
        onClick={() => console.warn('[EtudeLocative] Voir un exemple (à venir)')}
        className="mt-4 text-xs text-propsight-600 hover:text-propsight-700 font-medium"
      >
        → Voir un exemple d'étude locative
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

export default EtudeLocativeList;
