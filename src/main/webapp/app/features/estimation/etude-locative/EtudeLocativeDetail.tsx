import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Lock, GitBranch, History, ExternalLink, CheckCircle2, X } from 'lucide-react';
import TemplateRapport from 'app/features/shared/template-rapport/TemplateRapport';
import { PROPSIGHT_AGENCE, DEMO_CONSEILLER } from 'app/features/shared/template-rapport/_mocks/agence';
import { RapportConfig } from 'app/features/shared/template-rapport/types';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EnvoiInfo } from '../types';
import { useEtude, etudeStore } from './store/etudeStore';
import { buildInitialConfig, extractValeurRetenueLocatif } from './utils/rapportConfig';
import HistoriqueEnvois from '../avis-valeur/components/HistoriqueEnvois';
import ModaleEnvoi from '../avis-valeur/components/ModaleEnvoi';

const EtudeLocativeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const etude = useEtude(id);
  const [showHistorique, setShowHistorique] = useState(false);
  const [modaleEnvoiOpen, setModaleEnvoiOpen] = useState(false);
  const [toast, setToast] = useState<{ token: string; nom: string } | null>(null);

  const initialConfig: RapportConfig | undefined = useMemo(
    () => (etude ? buildInitialConfig(etude) : undefined),
    [etude],
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 8000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleConfigChange = useCallback(
    (config: RapportConfig) => {
      if (!etude) return;
      const vr = extractValeurRetenueLocatif(config);
      if (!vr) return;
      const current = etude.valeur_retenue_locatif;
      const changed =
        !current ||
        current.loyer_hc !== vr.loyer_hc ||
        current.charges_mensuelles !== vr.charges_mensuelles ||
        current.honoraires !== vr.honoraires ||
        current.justification_ecart !== vr.justification_ecart;
      if (changed) {
        etudeStore.update(etude.id, {
          valeur_retenue: vr.loyer_hc,
          valeur_retenue_locatif: vr,
        });
      }
    },
    [etude],
  );

  const handleRetour = useCallback(() => navigate('/app/estimation/etude-locative'), [navigate]);
  const handleEnvoyer = useCallback(() => setModaleEnvoiOpen(true), []);

  const handleConfirmerEnvoi = useCallback(
    (envoi: EnvoiInfo) => {
      if (!etude) return;
      etudeStore.update(etude.id, { statut: 'envoyee', envoi });
      setModaleEnvoiOpen(false);
      setToast({ token: envoi.token_public, nom: envoi.nom_destinataire });
      console.warn(`[EtudeLocativeDetail] Étude envoyée → /rapport/${envoi.token_public}`);
    },
    [etude],
  );

  const handleRenvoyer = useCallback(() => {
    if (!etude?.envoi) return;
    setModaleEnvoiOpen(true);
  }, [etude]);

  const handleNouvelleVersion = useCallback(() => {
    if (!etude) return;
    const newId = `etl_v${(etude.version || 1) + 1}_${Date.now()}`;
    const now = new Date().toISOString();
    etudeStore.add({
      ...etude,
      id: newId,
      statut: 'brouillon',
      envoi: undefined,
      version: (etude.version || 1) + 1,
      versions_precedentes: [...(etude.versions_precedentes || []), etude.id],
      created_at: now,
      updated_at: now,
    });
    console.warn('[EtudeLocativeDetail] Nouvelle version', etude.id, '→', newId);
    navigate(`/app/estimation/etude-locative/${newId}`);
  }, [etude, navigate]);

  if (!etude || !initialConfig) {
    return (
      <div className="p-8">
        <button onClick={handleRetour} className="text-propsight-600 hover:text-propsight-700 text-sm flex items-center gap-1 mb-4">
          <ChevronLeft size={14} /> Retour à la liste
        </button>
        <p className="text-sm text-slate-500">Étude locative introuvable (ou supprimée).</p>
      </div>
    );
  }

  const isLocked = etude.statut === 'envoyee' || etude.statut === 'ouverte' || etude.statut === 'archivee';
  const isEnvoyee = etude.statut === 'envoyee' || etude.statut === 'ouverte';

  const headerBadge = (
    <div className="flex items-center gap-1.5">
      <StatusBadge statut={etude.statut} />
      {etude.version && etude.version > 1 && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-propsight-100 text-propsight-700">
          v{etude.version}
        </span>
      )}
    </div>
  );

  const headerActions = (
    <>
      {isEnvoyee && (
        <button
          onClick={() => setShowHistorique(s => !s)}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            showHistorique ? 'bg-propsight-50 text-propsight-700' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History size={12} /> Historique
        </button>
      )}
      {isEnvoyee && etude.envoi && (
        <button
          onClick={() => {
            const envoi = etude.envoi;
            if (envoi) window.open(`/rapport/${envoi.token_public}`, '_blank');
          }}
          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors flex items-center gap-1.5"
        >
          <ExternalLink size={12} /> Version publique
        </button>
      )}
      {isEnvoyee && (
        <button
          onClick={handleNouvelleVersion}
          className="px-2.5 py-1 text-xs font-medium text-propsight-700 border border-propsight-200 bg-propsight-50 hover:bg-propsight-100 rounded transition-colors flex items-center gap-1.5"
        >
          <GitBranch size={12} /> Nouvelle version
        </button>
      )}
    </>
  );

  return (
    <div className="relative h-full flex">
      <div className="flex-1 min-w-0 flex flex-col">
        {isLocked && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between gap-3 flex-shrink-0 no-print">
            <div className="flex items-center gap-2 text-xs text-amber-800">
              <Lock size={12} />
              {etude.statut === 'archivee' ? (
                <span>Cette étude locative est archivée. L'édition est désactivée.</span>
              ) : (
                <span>
                  Ce rapport a été envoyé le {etude.envoi ? new Date(etude.envoi.envoye_le).toLocaleDateString('fr-FR') : '—'}. Pour modifier, créez une nouvelle version.
                </span>
              )}
            </div>
            {isEnvoyee && (
              <button
                onClick={handleNouvelleVersion}
                className="px-2.5 py-1 text-xs font-medium bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors flex items-center gap-1.5"
              >
                <GitBranch size={11} /> Créer une nouvelle version
              </button>
            )}
          </div>
        )}

        {toast && (
          <div className="bg-green-50 border-b border-green-200 px-6 py-2.5 flex items-center justify-between gap-3 flex-shrink-0 no-print">
            <div className="flex items-center gap-2 text-xs text-green-800 flex-1 min-w-0">
              <CheckCircle2 size={14} className="flex-shrink-0 text-green-600" />
              <span>
                Étude envoyée à <strong>{toast.nom}</strong>. Lien public :
                <button
                  onClick={() => window.open(`/rapport/${toast.token}`, '_blank')}
                  className="ml-1 underline hover:no-underline font-mono text-[11px] inline-flex items-center gap-0.5"
                >
                  /rapport/{toast.token.slice(0, 12)}…
                  <ExternalLink size={10} />
                </button>
              </span>
            </div>
            <button onClick={() => setToast(null)} className="text-green-600 hover:text-green-800">
              <X size={13} />
            </button>
          </div>
        )}

        <div className="flex-1 min-h-0">
          <TemplateRapport
            key={etude.id}
            data={{
              type: 'etude_locative',
              estimation: etude,
              agence: PROPSIGHT_AGENCE,
              conseiller: DEMO_CONSEILLER,
              date_rapport: etude.updated_at,
            }}
            initialConfig={initialConfig}
            titreHeader="Étude locative"
            badge={headerBadge}
            onRetour={handleRetour}
            onConfigChange={handleConfigChange}
            onSend={isLocked ? undefined : handleEnvoyer}
            readOnly={isLocked}
            actions={headerActions}
          />
        </div>
      </div>

      {showHistorique && isEnvoyee && etude.envoi && (
        <div className="w-[320px] flex-shrink-0 border-l border-slate-200 bg-slate-50 overflow-y-auto p-4 no-print">
          <HistoriqueEnvois envoi={etude.envoi} onRenvoyer={handleRenvoyer} />
        </div>
      )}

      <ModaleEnvoi
        isOpen={modaleEnvoiOpen}
        avis={etude}
        onClose={() => setModaleEnvoiOpen(false)}
        onEnvoyer={handleConfirmerEnvoi}
        rapportType="etude_locative"
      />
    </div>
  );
};

export default EtudeLocativeDetail;
