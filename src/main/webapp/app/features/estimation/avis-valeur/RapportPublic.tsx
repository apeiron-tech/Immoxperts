import React, { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, Phone, Mail, Globe, Download, Lock } from 'lucide-react';
import { avisStore } from './store/avisStore';
import { etudeStore } from 'app/features/estimation/etude-locative/store/etudeStore';
import { buildInitialConfig as buildAdvConfig } from './utils/rapportConfig';
import { buildInitialConfig as buildEtudeConfig } from 'app/features/estimation/etude-locative/utils/rapportConfig';
import { detectDevice } from './utils/tracking';
import { PROPSIGHT_AGENCE, DEMO_CONSEILLER } from 'app/features/shared/template-rapport/_mocks/agence';
import { getBlocsOrdered } from 'app/features/shared/template-rapport/BlocsRegistry';
import BlocRenderer from 'app/features/shared/template-rapport/BlocRenderer';
import 'app/features/shared/template-rapport/print.css';

const RapportPublic: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const trackedRef = useRef(false);

  // Trouve le rapport via le token public — cherche dans AdV puis dans études locatives
  const found = useMemo(() => {
    if (!token) return undefined;
    const adv = avisStore.getAll().find(a => a.envoi?.token_public === token);
    if (adv) return { item: adv, source: 'avis_valeur' as const };
    const etl = etudeStore.getAll().find(e => e.envoi?.token_public === token);
    if (etl) return { item: etl, source: 'etude_locative' as const };
    return undefined;
  }, [token]);

  const avis = found?.item;
  const source = found?.source;

  // Log automatique de l'ouverture au mount
  useEffect(() => {
    if (!avis || !avis.envoi || !source || trackedRef.current) return;
    trackedRef.current = true;

    const device = detectDevice();
    const now = new Date().toISOString();
    const newOuverture = { date: now, user_agent: device };
    const store = source === 'etude_locative' ? etudeStore : avisStore;

    store.update(avis.id, prev => ({
      ...prev,
      statut: prev.statut === 'envoyee' ? 'ouverte' : prev.statut,
      envoi: prev.envoi
        ? {
            ...prev.envoi,
            ouvertures: [...prev.envoi.ouvertures, newOuverture],
            derniere_ouverture: now,
          }
        : undefined,
    }));

    console.warn(`[RapportPublic] Ouverture loggée pour ${avis.id} (${source}) depuis ${device}`);
  }, [avis, source]);

  if (!avis || !avis.envoi) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-amber-700" />
          </div>
          <h1 className="text-base font-semibold text-slate-900 mb-1">Rapport introuvable</h1>
          <p className="text-sm text-slate-500 mb-4">
            Ce lien n'est plus valide ou a expiré. Le rapport a peut-être été retiré ou archivé par son auteur.
          </p>
          <p className="text-xs text-slate-400 font-mono">Token : {token}</p>
        </div>
      </div>
    );
  }

  const config = source === 'etude_locative' ? buildEtudeConfig(avis) : buildAdvConfig(avis);
  const blocs = getBlocsOrdered(config.blocs).filter(b => b.active);
  const data = {
    type: source === 'etude_locative' ? ('etude_locative' as const) : ('avis_valeur' as const),
    estimation: avis,
    agence: PROPSIGHT_AGENCE,
    conseiller: DEMO_CONSEILLER,
    date_rapport: avis.envoi.envoye_le,
  };
  const typeLabel = source === 'etude_locative' ? 'étude locative' : 'avis de valeur';

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header branded */}
      <header className="bg-white border-b border-slate-200 no-print">
        <div className="max-w-[820px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-propsight-100 flex items-center justify-center flex-shrink-0">
              <Building2 size={18} className="text-propsight-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{PROPSIGHT_AGENCE.nom}</p>
              <p className="text-[11px] text-slate-500">
                {PROPSIGHT_AGENCE.adresse}, {PROPSIGHT_AGENCE.code_postal} {PROPSIGHT_AGENCE.ville}
              </p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-propsight-600 text-white rounded hover:bg-propsight-700 transition-colors"
          >
            <Download size={12} /> Télécharger en PDF
          </button>
        </div>
      </header>

      {/* Bandeau accueil destinataire */}
      <div className="bg-propsight-50 border-b border-propsight-100 no-print">
        <div className="max-w-[820px] mx-auto px-6 py-3 text-xs text-propsight-900 leading-relaxed">
          {avis.envoi.nom_destinataire && (
            <>
              Bonjour <strong>{avis.envoi.nom_destinataire}</strong>,&nbsp;
            </>
          )}
          voici l'{typeLabel} réalisée par <strong>{DEMO_CONSEILLER.prenom} {DEMO_CONSEILLER.nom}</strong> ({PROPSIGHT_AGENCE.nom}) pour le bien situé{' '}
          <strong>{avis.bien.adresse}, {avis.bien.code_postal} {avis.bien.ville}</strong>.
          Vous pouvez le consulter en ligne ou le télécharger en PDF via le bouton en haut.
        </div>
      </div>

      {/* Corps : blocs du rapport */}
      <main className="max-w-[820px] mx-auto px-4 py-6 space-y-4 print-container">
        {blocs.map(b => (
          <BlocRenderer
            key={b.id}
            data={data}
            blocConfig={b}
            isEditing={false}
            onEdit={() => undefined}
            onContentChange={() => undefined}
            showEditButton={false}
          />
        ))}
      </main>

      {/* Footer branded + mentions légales */}
      <footer className="bg-white border-t border-slate-200 no-print">
        <div className="max-w-[820px] mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-6 mb-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Agence</p>
              <p className="text-xs font-medium text-slate-700">{PROPSIGHT_AGENCE.nom}</p>
              <p className="text-[11px] text-slate-500 mt-1">{PROPSIGHT_AGENCE.adresse}</p>
              <p className="text-[11px] text-slate-500">{PROPSIGHT_AGENCE.code_postal} {PROPSIGHT_AGENCE.ville}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Contact</p>
              <p className="text-[11px] text-slate-600 flex items-center gap-1.5"><Phone size={10} /> {PROPSIGHT_AGENCE.telephone}</p>
              <p className="text-[11px] text-slate-600 flex items-center gap-1.5"><Mail size={10} /> {PROPSIGHT_AGENCE.email}</p>
              <p className="text-[11px] text-slate-600 flex items-center gap-1.5"><Globe size={10} /> {PROPSIGHT_AGENCE.site}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Mentions légales</p>
              <p className="text-[11px] text-slate-500">SIRET : {PROPSIGHT_AGENCE.siret}</p>
              <p className="text-[11px] text-slate-500">Carte T : {PROPSIGHT_AGENCE.carte_t}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-400 leading-relaxed">
            <p className="mb-1">
              Ce document est confidentiel et destiné exclusivement à son destinataire. Les valeurs présentées constituent une estimation basée sur les données de marché disponibles à la date de
              rédaction et n'ont pas valeur d'expertise au sens de l'article 1592 du Code civil. Elles peuvent évoluer en fonction du contexte économique et de l'état réel du bien constaté lors d'une
              visite physique. Document généré le {new Date(avis.envoi.envoye_le).toLocaleDateString('fr-FR')}, version {avis.version || 1}.
            </p>
            <p>© {new Date().getFullYear()} {PROPSIGHT_AGENCE.nom}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RapportPublic;
