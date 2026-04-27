import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ShieldCheck,
  FileSignature,
  Send,
  Hash,
  Calendar,
  User,
  MapPin,
  Building,
  Ruler,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  Lock,
} from 'lucide-react';
import { StatusBadge } from '../components/shared/StatusBadge';
import { MethodeExpertise, FinaliteExpertise, ReferentielExpertise, Estimation } from '../types';
import { useExpert, expertStore } from './store/expertStore';
import ConformiteBadge from './components/ConformiteBadge';

const METHODE_LABEL: Record<MethodeExpertise, string> = {
  comparaison_directe: 'Comparaison directe',
  capitalisation_revenus: 'Capitalisation des revenus',
  cout_remplacement: 'Coût de remplacement',
  sol_constructible: 'Méthode du sol et de la construction',
};

const METHODE_DESCRIPTION: Record<MethodeExpertise, string> = {
  comparaison_directe: 'Analyse des transactions DVF récentes et annonces comparables, ajustées sur les caractéristiques du bien.',
  capitalisation_revenus: 'Évaluation par capitalisation des revenus locatifs nets, sur la base d\'un taux de rendement de marché.',
  cout_remplacement: 'Estimation du coût de reconstruction à neuf déduction faite de la dépréciation.',
  sol_constructible: 'Valorisation séparée du foncier et du bâti, méthode adaptée aux biens atypiques.',
};

const FINALITE_LABEL: Record<FinaliteExpertise, string> = {
  cession: 'Cession',
  succession: 'Succession',
  donation: 'Donation',
  apport_societe: 'Apport en société',
  garantie_bancaire: 'Garantie bancaire',
  litige: 'Litige / contentieux',
  audit_patrimoine: 'Audit patrimonial',
};

const REFERENTIEL_FULL: Record<ReferentielExpertise, string> = {
  RICS: 'Royal Institution of Chartered Surveyors',
  TEGOVA: 'The European Group of Valuers\' Associations',
  RICS_TEGOVA: 'RICS & TEGOVA',
};

const ExpertDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const rapport = useExpert(id);
  const [valeurEdit, setValeurEdit] = useState<string>('');

  const handleRetour = useCallback(() => navigate('/app/estimation/expert'), [navigate]);

  const handleEnregistrerValeur = useCallback(() => {
    if (!rapport) return;
    const prix = Number(valeurEdit.replace(/\s/g, ''));
    if (!Number.isFinite(prix) || prix <= 0) return;
    expertStore.update(rapport.id, {
      valeur_retenue: prix,
      valeur_retenue_detail: { prix, honoraires_pct: 0, charge_honoraires: 'vendeur' },
    });
    setValeurEdit('');
  }, [rapport, valeurEdit]);

  const handleFinaliser = useCallback(() => {
    if (!rapport) return;
    expertStore.update(rapport.id, { statut: 'finalisee' });
  }, [rapport]);

  const handleEnvoyer = useCallback(() => {
    if (!rapport || !rapport.expert?.donneur_ordre) return;
    const now = new Date().toISOString();
    expertStore.update(rapport.id, {
      statut: 'envoyee',
      envoi: {
        envoye_le: now,
        email_destinataire: rapport.expert.donneur_ordre.email,
        nom_destinataire: `${rapport.expert.donneur_ordre.civilite} ${rapport.expert.donneur_ordre.prenom} ${rapport.expert.donneur_ordre.nom}`.trim(),
        objet: `Rapport d'expertise — ${rapport.bien.adresse}`,
        message: 'Veuillez trouver ci-joint le rapport d\'expertise conforme RICS / TEGOVA.',
        ouvertures: [],
        token_public: `exp_${rapport.id}_${Date.now()}`,
      },
    });
  }, [rapport]);

  const handleNouvelleVersion = useCallback(() => {
    if (!rapport) return;
    const newId = `exp_v${(rapport.version || 1) + 1}_${Date.now()}`;
    const now = new Date().toISOString();
    expertStore.add({
      ...rapport,
      id: newId,
      statut: 'brouillon',
      envoi: undefined,
      version: (rapport.version || 1) + 1,
      versions_precedentes: [...(rapport.versions_precedentes || []), rapport.id],
      created_at: now,
      updated_at: now,
    });
    navigate(`/app/estimation/expert/${newId}`);
  }, [rapport, navigate]);

  if (!rapport) {
    return (
      <div className="p-8">
        <button onClick={handleRetour} className="text-propsight-600 hover:text-propsight-700 text-sm flex items-center gap-1 mb-4">
          <ChevronLeft size={14} /> Retour à la liste
        </button>
        <p className="text-sm text-slate-500">Rapport introuvable.</p>
      </div>
    );
  }

  const expert = rapport.expert;
  const prix = rapport.valeur_retenue_detail?.prix ?? rapport.valeur_retenue ?? rapport.avm?.prix.estimation;
  const finalisee = rapport.statut === 'finalisee' || rapport.statut === 'envoyee' || rapport.statut === 'ouverte';
  const editable = rapport.statut === 'brouillon';

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <DetailHeader
        rapport={rapport}
        expert={expert}
        prix={prix}
        finalisee={finalisee}
        editable={editable}
        onRetour={handleRetour}
        onFinaliser={handleFinaliser}
        onEnvoyer={handleEnvoyer}
        onNouvelleVersion={handleNouvelleVersion}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
          {/* Bandeau conformité */}
          {expert && (
            <div className="bg-white border border-propsight-200 rounded-md overflow-hidden">
              <div className="h-[3px]" style={{ background: 'var(--ps-signature-gradient)' }} />
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-propsight-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={18} className="text-propsight-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-slate-900">Rapport conforme {REFERENTIEL_FULL[expert.referentiel]}</h2>
                    <ConformiteBadge referentiel={expert.referentiel} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Valeur de marché établie selon les normes professionnelles européennes d&apos;expertise immobilière.
                  </p>
                </div>
                {expert.declaration_independance && (
                  <div className="hidden md:flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 ring-1 ring-inset ring-green-200 px-2 py-1 rounded">
                    <CheckCircle2 size={11} />
                    Indépendance déclarée
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Méta-données du dossier */}
          {expert && (
            <Section title="Méta-données du dossier" icon={<Hash size={14} />}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                <Field label="Numéro de dossier" value={expert.numero_dossier ?? '—'} mono />
                <Field label="Finalité" value={FINALITE_LABEL[expert.finalite]} />
                <Field label="Date de visite" value={formatDate(expert.date_visite)} />
                <Field label="Date de valeur" value={formatDate(expert.date_valeur)} />
              </div>
            </Section>
          )}

          {/* Donneur d'ordre */}
          {expert?.donneur_ordre && (
            <Section title="Donneur d'ordre" icon={<User size={14} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <Field label="Identité" value={`${expert.donneur_ordre.civilite} ${expert.donneur_ordre.prenom} ${expert.donneur_ordre.nom}`} />
                <Field label="Email" value={expert.donneur_ordre.email} />
                <Field label="Téléphone" value={expert.donneur_ordre.telephone} />
              </div>
            </Section>
          )}

          {/* Bien évalué */}
          <Section title="Bien évalué" icon={<Building size={14} />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 aspect-[4/3] rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                {rapport.photo_url ? (
                  <img src={rapport.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Building size={40} />
                  </div>
                )}
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-x-6 gap-y-3">
                <Field
                  label="Adresse"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={11} className="text-slate-400" />
                      {rapport.bien.adresse}, {rapport.bien.code_postal} {rapport.bien.ville}
                    </span>
                  }
                />
                <Field label="Type" value={rapport.bien.type_bien.charAt(0).toUpperCase() + rapport.bien.type_bien.slice(1)} />
                <Field
                  label="Surface habitable"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <Ruler size={11} className="text-slate-400" />
                      {rapport.bien.surface > 0 ? `${rapport.bien.surface} m²` : '—'}
                    </span>
                  }
                />
                <Field label="Pièces" value={rapport.bien.nb_pieces > 0 ? rapport.bien.nb_pieces : '—'} />
                <Field label="DPE / GES" value={`${rapport.bien.dpe} / ${rapport.bien.ges}`} />
                <Field label="Année de construction" value={rapport.bien.annee_construction || '—'} />
                {rapport.bien.surface_terrain > 0 && (
                  <Field label="Surface terrain" value={`${rapport.bien.surface_terrain} m²`} />
                )}
                <Field label="État" value={rapport.bien.etat.replace(/_/g, ' ')} />
              </div>
            </div>
            {rapport.bien.points_forts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-2">Points forts</p>
                <div className="flex flex-wrap gap-1.5">
                  {rapport.bien.points_forts.map(p => (
                    <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-200">
                      <CheckCircle2 size={10} />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Méthodologie */}
          {expert && (
            <Section title="Méthodologie d'évaluation" icon={<FileSignature size={14} />}>
              <div className="space-y-3">
                <div className="rounded-md border border-propsight-200 bg-propsight-50/40 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-propsight-700">Méthode principale</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{METHODE_LABEL[expert.methode_principale]}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{METHODE_DESCRIPTION[expert.methode_principale]}</p>
                </div>
                {expert.methodes_complementaires.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {expert.methodes_complementaires.map(m => (
                      <div key={m} className="rounded-md border border-slate-200 bg-white p-3">
                        <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Méthode complémentaire</div>
                        <p className="text-sm font-medium text-slate-900">{METHODE_LABEL[m]}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{METHODE_DESCRIPTION[m]}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* AVM / Comparables */}
          {rapport.avm && (
            <Section title="Marché de référence" icon={<TrendingUp size={14} />}>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <MarketStat label="Borne basse" value={`${rapport.avm.marche_reference.prix_m2_bas.toLocaleString('fr-FR')} €/m²`} />
                <MarketStat label="Médiane" value={`${rapport.avm.marche_reference.prix_m2_median.toLocaleString('fr-FR')} €/m²`} highlight />
                <MarketStat label="Borne haute" value={`${rapport.avm.marche_reference.prix_m2_haut.toLocaleString('fr-FR')} €/m²`} />
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Estimation AVM</span>
                  <span className="text-[10px] text-slate-500">à titre indicatif — valeur retenue par l&apos;expert ci-dessous</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-slate-900 tabular-nums">
                    {rapport.avm.prix.estimation.toLocaleString('fr-FR')} €
                  </span>
                  <span className="text-xs text-slate-500">
                    fourchette {rapport.avm.prix.fourchette_basse.toLocaleString('fr-FR')} – {rapport.avm.prix.fourchette_haute.toLocaleString('fr-FR')} €
                  </span>
                </div>
                {rapport.avm.comparables.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-2">
                    Basée sur {rapport.avm.comparables.length} biens comparables (DVF + annonces).
                  </p>
                )}
              </div>
            </Section>
          )}

          {/* Hypothèses spéciales */}
          {expert?.hypotheses_speciales && expert.hypotheses_speciales.length > 0 && (
            <Section title="Hypothèses spéciales / Réserves" icon={<AlertTriangle size={14} />}>
              <ul className="space-y-2">
                {expert.hypotheses_speciales.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
                    <AlertTriangle size={12} className="text-amber-500 mt-1 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Valeur retenue */}
          <Section title="Valeur retenue par l'expert" icon={<TrendingUp size={14} />} accent>
            {prix ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-slate-900 tabular-nums">{prix.toLocaleString('fr-FR')} €</span>
                {rapport.bien.surface > 0 && (
                  <span className="text-sm text-slate-500">
                    soit {Math.round(prix / rapport.bien.surface).toLocaleString('fr-FR')} €/m²
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Aucune valeur retenue à ce jour.</p>
            )}
            {editable && (
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  value={valeurEdit}
                  onChange={e => setValeurEdit(e.target.value)}
                  placeholder="Saisir la valeur (€)"
                  className="px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-propsight-400 w-56"
                />
                <button
                  onClick={handleEnregistrerValeur}
                  className="inline-flex items-center h-8 px-3 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-xs font-medium transition-colors"
                >
                  Enregistrer la valeur
                </button>
                <span className="text-[11px] text-slate-400">Valeur de marché à la date de valeur</span>
              </div>
            )}
          </Section>

          {/* Signature */}
          {expert?.expert_signature && (
            <Section title="Signature de l'expert" icon={<FileSignature size={14} />}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-propsight-100 text-propsight-700 flex items-center justify-center text-base font-semibold flex-shrink-0">
                  {expert.expert_signature.nom
                    .split(' ')
                    .map(s => s[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{expert.expert_signature.nom}</p>
                  <p className="text-xs text-slate-500">{expert.expert_signature.qualification}</p>
                  {expert.expert_signature.numero_agrement && (
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">N° agrément : {expert.expert_signature.numero_agrement}</p>
                  )}
                  {expert.declaration_independance && (
                    <p className="text-[11px] text-green-700 mt-2 flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      L&apos;expert déclare n&apos;avoir aucun conflit d&apos;intérêt direct ou indirect avec le bien évalué ou le donneur d&apos;ordre.
                    </p>
                  )}
                </div>
              </div>
            </Section>
          )}

          {/* Historique d'envoi */}
          {rapport.envoi && (
            <Section title="Transmission" icon={<Send size={14} />}>
              <div className="text-sm text-slate-700 space-y-1">
                <p>
                  Transmis à <span className="font-medium">{rapport.envoi.nom_destinataire}</span> le{' '}
                  <span className="font-medium">{formatDateLong(rapport.envoi.envoye_le)}</span>
                </p>
                {rapport.envoi.ouvertures.length > 0 ? (
                  <p className="text-xs text-green-700">
                    Rapport ouvert {rapport.envoi.ouvertures.length} fois — dernière consultation le{' '}
                    {rapport.envoi.derniere_ouverture ? formatDateLong(rapport.envoi.derniere_ouverture) : '—'}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">En attente d&apos;ouverture.</p>
                )}
              </div>
            </Section>
          )}

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
};

type DetailHeaderProps = {
  rapport: Estimation;
  expert: Estimation['expert'];
  prix: number | undefined;
  finalisee: boolean;
  editable: boolean;
  onRetour: () => void;
  onFinaliser: () => void;
  onEnvoyer: () => void;
  onNouvelleVersion: () => void;
};

const DetailHeader: React.FC<DetailHeaderProps> = ({
  rapport,
  expert,
  prix,
  finalisee,
  editable,
  onRetour,
  onFinaliser,
  onEnvoyer,
  onNouvelleVersion,
}) => (
  <div className="sticky top-0 z-10 bg-white border-b border-slate-200 flex-shrink-0">
    <div className="px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onRetour}
          className="text-slate-500 hover:text-slate-900 text-sm flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={14} /> Retour
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-slate-900 truncate">
              {expert?.numero_dossier ?? rapport.id}
            </h1>
            <StatusBadge statut={rapport.statut} />
            {expert && <ConformiteBadge referentiel={expert.referentiel} size="sm" />}
            {rapport.version && rapport.version > 1 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-propsight-100 text-propsight-700">
                v{rapport.version}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {rapport.bien.adresse} · {rapport.bien.ville} {rapport.bien.code_postal}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {finalisee && (
          <button
            onClick={onNouvelleVersion}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
          >
            <GitBranch size={12} />
            Nouvelle version
          </button>
        )}
        {editable && (
          <button
            onClick={onFinaliser}
            disabled={!prix}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={!prix ? 'Définir une valeur retenue avant de finaliser' : 'Finaliser le rapport'}
          >
            <Lock size={12} />
            Finaliser
          </button>
        )}
        {rapport.statut === 'finalisee' && (
          <button
            onClick={onEnvoyer}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-xs font-medium transition-colors"
          >
            <Send size={12} />
            Transmettre au donneur d&apos;ordre
          </button>
        )}
      </div>
    </div>
  </div>
);

const Section: React.FC<{
  title: string;
  icon?: React.ReactNode;
  accent?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, accent, children }) => (
  <section className={`bg-white border rounded-md ${accent ? 'border-propsight-300 ring-1 ring-propsight-100' : 'border-slate-200'}`}>
    <header className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2">
      {icon && <span className={accent ? 'text-propsight-600' : 'text-slate-500'}>{icon}</span>}
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">{title}</h3>
    </header>
    <div className="p-4">{children}</div>
  </section>
);

const Field: React.FC<{ label: string; value: React.ReactNode; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="min-w-0">
    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-0.5">{label}</p>
    <p className={`text-sm text-slate-900 truncate ${mono ? 'font-mono' : ''}`}>{value}</p>
  </div>
);

const MarketStat: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className={`rounded-md border p-3 ${highlight ? 'border-propsight-200 bg-propsight-50/30' : 'border-slate-200 bg-white'}`}>
    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</p>
    <p className={`text-base font-semibold tabular-nums mt-0.5 ${highlight ? 'text-propsight-700' : 'text-slate-900'}`}>{value}</p>
  </div>
);

function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default ExpertDetail;
