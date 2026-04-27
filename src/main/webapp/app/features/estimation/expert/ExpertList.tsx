import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List, X, Eye, EyeOff, ShieldCheck, Plus } from 'lucide-react';
import {
  Estimation,
  StatutEstimation,
  EstimationFormData,
  ClientInfo,
  ReferentielExpertise,
} from '../types';
import { StatusBadge } from '../components/shared/StatusBadge';
import WizardCreation from '../components/shared/WizardCreation';
import { computeAvm } from '../utils/avmEngine';
import ExpertCard from './components/ExpertCard';
import KPIRowExpert from './components/KPIRowExpert';
import ConformiteBadge from './components/ConformiteBadge';
import { expertStore, useExpertList } from './store/expertStore';

const STATUTS: StatutEstimation[] = ['brouillon', 'finalisee', 'envoyee', 'ouverte', 'archivee'];
const REFERENTIELS: ReferentielExpertise[] = ['RICS', 'TEGOVA', 'RICS_TEGOVA'];

const ExpertList: React.FC = () => {
  const navigate = useNavigate();
  const rapports = useExpertList();
  const [search, setSearch] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<StatutEstimation[]>([]);
  const [filtreReferentiel, setFiltreReferentiel] = useState<ReferentielExpertise[]>([]);
  const [filtreOuverture, setFiltreOuverture] = useState<'all' | 'ouvert' | 'non_ouvert'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [wizardOpen, setWizardOpen] = useState(false);

  const creerRapport = (
    bien: Partial<EstimationFormData>,
    client: ClientInfo | null,
  ): Estimation => {
    const id = `exp_new_${Date.now()}`;
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
    const numero = `EXP-${new Date().getFullYear()}-${String(rapports.length + 1).padStart(4, '0')}`;
    return {
      id,
      type: 'expertise_rics_tegova',
      statut: 'brouillon',
      source: 'manuel',
      version: 1,
      created_at: now,
      updated_at: now,
      auteur: 'Sophie Leroy',
      client,
      bien: fullBien,
      avm: computeAvm(fullBien),
      valeur_retenue: null,
      photo_url: null,
      expert: {
        referentiel: 'RICS_TEGOVA',
        methode_principale: 'comparaison_directe',
        methodes_complementaires: [],
        finalite: 'cession',
        donneur_ordre: client,
        numero_dossier: numero,
        expert_signature: {
          nom: 'Sophie Leroy',
          qualification: 'Expert immobilier agréé',
          numero_agrement: 'RICS-FR-2018-2241',
        },
        hypotheses_speciales: [],
        declaration_independance: true,
      },
    };
  };

  const handleNouveauRapport = () => setWizardOpen(true);

  const handleWizardSubmit = (data: { bien: Partial<EstimationFormData>; client: ClientInfo | null }) => {
    const nouveau = creerRapport(data.bien, data.client);
    expertStore.add(nouveau);
    setWizardOpen(false);
    navigate(`/app/estimation/expert/${nouveau.id}`);
  };

  const handleEditer = (id: string) => navigate(`/app/estimation/expert/${id}`);

  const handleDupliquer = (id: string) => {
    const o = rapports.find(a => a.id === id);
    if (!o) return;
    const newId = `exp_dup_${Date.now()}`;
    const now = new Date().toISOString();
    const dup: Estimation = { ...o, id: newId, statut: 'brouillon', envoi: undefined, version: 1, created_at: now, updated_at: now };
    expertStore.add(dup);
  };

  const handleNouvelleVersion = (id: string) => {
    const o = rapports.find(a => a.id === id);
    if (!o) return;
    const newId = `exp_v${(o.version || 1) + 1}_${Date.now()}`;
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
    expertStore.add(v);
    navigate(`/app/estimation/expert/${newId}`);
  };

  const handleArchiver = (id: string) => {
    expertStore.update(id, { statut: 'archivee' });
  };

  const handleSupprimer = (id: string) => {
    expertStore.remove(id);
  };

  const toggleStatut = (s: StatutEstimation) => {
    setFiltreStatut(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));
  };

  const toggleReferentiel = (r: ReferentielExpertise) => {
    setFiltreReferentiel(prev => (prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]));
  };

  const filtered = rapports.filter(a => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.bien.adresse.toLowerCase().includes(q) ||
      a.bien.ville.toLowerCase().includes(q) ||
      (a.client?.nom || '').toLowerCase().includes(q) ||
      (a.client?.prenom || '').toLowerCase().includes(q) ||
      (a.expert?.numero_dossier || '').toLowerCase().includes(q) ||
      a.auteur.toLowerCase().includes(q);
    const matchStatut = filtreStatut.length === 0 || filtreStatut.includes(a.statut);
    const matchRef = filtreReferentiel.length === 0 || (a.expert && filtreReferentiel.includes(a.expert.referentiel));
    let matchOuverture = true;
    if (filtreOuverture === 'ouvert') matchOuverture = a.statut === 'ouverte';
    else if (filtreOuverture === 'non_ouvert')
      matchOuverture = a.statut === 'envoyee' && (!a.envoi || a.envoi.ouvertures.length === 0);
    return matchSearch && matchStatut && matchRef && matchOuverture;
  });

  const filtersActive = filtreStatut.length > 0 || filtreReferentiel.length > 0 || filtreOuverture !== 'all' || search;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-slate-900">Rapports d&apos;expertise</h1>
          <span className="text-xs text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded">{rapports.length}</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-propsight-700 bg-propsight-50 ring-1 ring-inset ring-propsight-200 px-2 h-5 rounded">
            <ShieldCheck size={10} />
            Conformes RICS · TEGOVA
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="N° dossier, adresse, donneur d'ordre…"
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400 w-72"
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
          <button
            onClick={handleNouveauRapport}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-xs font-medium transition-colors"
          >
            <Plus size={13} />
            Nouveau rapport
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 space-y-5">
          <KPIRowExpert rapports={rapports} />

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
              <span className="text-xs text-slate-500">Référentiel :</span>
              {REFERENTIELS.map(r => (
                <button
                  key={r}
                  onClick={() => toggleReferentiel(r)}
                  className={`transition-all ${filtreReferentiel.includes(r) ? 'ring-2 ring-propsight-400 ring-offset-1' : ''}`}
                >
                  <ConformiteBadge referentiel={r} size="sm" />
                </button>
              ))}
              <span className="mx-1 h-4 w-px bg-slate-200" />
              <span className="text-xs text-slate-500">Ouverture :</span>
              <FilterPill active={filtreOuverture === 'all'} onClick={() => setFiltreOuverture('all')}>
                Toutes
              </FilterPill>
              <FilterPill active={filtreOuverture === 'ouvert'} onClick={() => setFiltreOuverture('ouvert')}>
                <Eye size={10} /> Ouvert
              </FilterPill>
              <FilterPill active={filtreOuverture === 'non_ouvert'} onClick={() => setFiltreOuverture('non_ouvert')}>
                <EyeOff size={10} /> Non ouvert
              </FilterPill>
              {filtersActive && (
                <button
                  onClick={() => {
                    setFiltreStatut([]);
                    setFiltreReferentiel([]);
                    setFiltreOuverture('all');
                    setSearch('');
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X size={11} /> Effacer
                </button>
              )}
            </div>
            {filtersActive && (
              <p className="text-xs text-slate-500">
                {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Liste */}
          {filtered.length === 0 ? (
            <EmptyState vide={rapports.length === 0} onNouveauRapport={handleNouveauRapport} />
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-4 gap-4">
              {filtered.map(r => (
                <ExpertCard
                  key={r.id}
                  rapport={r}
                  onClick={id => navigate(`/app/estimation/expert/${id}`)}
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
                    <Th>N° dossier</Th>
                    <Th>Adresse</Th>
                    <Th>Donneur d&apos;ordre</Th>
                    <Th>Référentiel</Th>
                    <Th>Valeur retenue</Th>
                    <Th>Statut</Th>
                    <Th>Auteur</Th>
                    <Th>Modifié</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, idx) => {
                    const prix = a.valeur_retenue_detail?.prix ?? a.valeur_retenue ?? a.avm?.prix.estimation;
                    return (
                      <tr
                        key={a.id}
                        onClick={() => navigate(`/app/estimation/expert/${a.id}`)}
                        className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                          idx < filtered.length - 1 ? 'border-b border-slate-100' : ''
                        }`}
                      >
                        <td className="px-4 py-2.5 text-xs text-slate-700 font-mono">
                          {a.expert?.numero_dossier ?? <span className="text-slate-400">—</span>}
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="font-medium text-slate-900 truncate max-w-[220px]">{a.bien.adresse}</p>
                          <p className="text-xs text-slate-400">{a.bien.ville}</p>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-700">
                          {a.client ? (
                            `${a.client.civilite} ${a.client.prenom} ${a.client.nom}`
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          {a.expert ? <ConformiteBadge referentiel={a.expert.referentiel} size="sm" /> : <span className="text-slate-400 text-xs">—</span>}
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

      <WizardCreation
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSubmit={handleWizardSubmit}
        titre="Nouveau rapport d'expertise"
        submitLabel="Créer le rapport"
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

const EmptyState: React.FC<{ vide: boolean; onNouveauRapport: () => void }> = ({ vide, onNouveauRapport }) => {
  if (!vide) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <p className="text-sm font-medium mb-1">Aucun résultat</p>
        <p className="text-xs">Modifiez vos filtres pour voir plus de rapports d&apos;expertise.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center text-center py-16 max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-full bg-propsight-50 flex items-center justify-center mb-4">
        <ShieldCheck size={28} className="text-propsight-500" />
      </div>
      <h2 className="text-base font-semibold text-slate-900 mb-1">Aucun rapport d&apos;expertise pour l&apos;instant</h2>
      <p className="text-sm text-slate-500 mb-6">
        Générez des rapports d&apos;expertise immobilière conformes aux référentiels RICS et TEGOVA, prêts à transmettre à un notaire,
        une banque ou un tribunal.
      </p>
      <button
        onClick={onNouveauRapport}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-propsight-600 text-white text-sm font-medium hover:bg-propsight-700 transition-colors"
      >
        <Plus size={14} />
        Créer mon premier rapport d&apos;expertise
      </button>
    </div>
  );
};

export default ExpertList;
