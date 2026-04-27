import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Lock, GitBranch, History, Zap, ExternalLink, CheckCircle2, X } from 'lucide-react';
import TemplateRapport from 'app/features/shared/template-rapport/TemplateRapport';
import { PROPSIGHT_AGENCE, DEMO_CONSEILLER } from 'app/features/shared/template-rapport/_mocks/agence';
import { RapportConfig } from 'app/features/shared/template-rapport/types';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EnvoiInfo } from '../types';
import { useAvis, avisStore } from './store/avisStore';
import { buildInitialConfig, extractValeurRetenue } from './utils/rapportConfig';
import HistoriqueEnvois from './components/HistoriqueEnvois';
import ModaleEnvoi from './components/ModaleEnvoi';

const AvisValeurDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const avis = useAvis(id);
  const [showHistorique, setShowHistorique] = useState(false);
  const [modaleEnvoiOpen, setModaleEnvoiOpen] = useState(false);
  const [toast, setToast] = useState<{ token: string; nom: string } | null>(null);

  const initialConfig: RapportConfig | undefined = useMemo(() => (avis ? buildInitialConfig(avis) : undefined), [avis]);

  // Auto-dismiss toast après 8s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 8000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleConfigChange = useCallback(
    (config: RapportConfig) => {
      if (!avis) return;
      const vr = extractValeurRetenue(config);
      if (!vr) return;
      const currentDetail = avis.valeur_retenue_detail;
      const changed =
        !currentDetail ||
        currentDetail.prix !== vr.prix ||
        currentDetail.honoraires_pct !== vr.honoraires_pct ||
        currentDetail.charge_honoraires !== vr.charge_honoraires ||
        currentDetail.justification_ecart !== vr.justification_ecart;
      if (changed) {
        avisStore.update(avis.id, {
          valeur_retenue: vr.prix,
          valeur_retenue_detail: vr,
        });
      }
    },
    [avis],
  );

  const handleRetour = useCallback(() => navigate('/app/estimation/avis-valeur'), [navigate]);

  const handleEnvoyer = useCallback(() => setModaleEnvoiOpen(true), []);

  const handleConfirmerEnvoi = useCallback(
    (envoi: EnvoiInfo) => {
      if (!avis) return;
      avisStore.update(avis.id, {
        statut: 'envoyee',
        envoi,
      });
      setModaleEnvoiOpen(false);
      setToast({ token: envoi.token_public, nom: envoi.nom_destinataire });
      console.warn(`[AvisValeurDetail] Avis envoyé → /rapport/${envoi.token_public}`);
    },
    [avis],
  );

  const handleRenvoyer = useCallback(() => {
    if (!avis?.envoi) return;
    setModaleEnvoiOpen(true);
  }, [avis]);

  const handleNouvelleVersion = useCallback(() => {
    if (!avis) return;
    const newId = `adv_v${(avis.version || 1) + 1}_${Date.now()}`;
    const now = new Date().toISOString();
    const next = {
      ...avis,
      id: newId,
      statut: 'brouillon' as const,
      envoi: undefined,
      version: (avis.version || 1) + 1,
      versions_precedentes: [...(avis.versions_precedentes || []), avis.id],
      created_at: now,
      updated_at: now,
    };
    avisStore.add(next);
    console.warn('[AvisValeurDetail] Nouvelle version', avis.id, '→', newId, `(v${next.version})`);
    navigate(`/app/estimation/avis-valeur/${newId}`);
  }, [avis, navigate]);

  if (!avis || !initialConfig) {
    return (
      <div className="p-8">
        <button onClick={handleRetour} className="text-propsight-600 hover:text-propsight-700 text-sm flex items-center gap-1 mb-4">
          <ChevronLeft size={14} /> Retour à la liste
        </button>
        <p className="text-sm text-slate-500">Avis de valeur introuvable (ou supprimé).</p>
      </div>
    );
  }

  const isLocked = avis.statut === 'envoyee' || avis.statut === 'ouverte' || avis.statut === 'archivee';
  const isEnvoyee = avis.statut === 'envoyee' || avis.statut === 'ouverte';

  const headerBadge = (
    <div className="flex items-center gap-1.5">
      <StatusBadge statut={avis.statut} />
      {avis.version && avis.version > 1 && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-propsight-100 text-propsight-700">
          v{avis.version}
        </span>
      )}
      {avis.source === 'estimation_rapide' && avis.parent_estimation_id && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700" title={`Issu de ${avis.parent_estimation_id}`}>
          <Zap size={9} /> estim. rapide
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
      {isEnvoyee && avis.envoi && (
        <button
          onClick={() => {
            const envoi = avis.envoi;
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
              {avis.statut === 'archivee' ? (
                <span>Cet avis de valeur est archivé. L'édition est désactivée.</span>
              ) : avis.envoi?.ouvertures.length ? (
                <span>
                  Ce rapport a été envoyé le {new Date(avis.envoi.envoye_le).toLocaleDateString('fr-FR')} et ouvert {avis.envoi.ouvertures.length} fois. Pour modifier, créez une nouvelle version.
                </span>
              ) : (
                <span>
                  Ce rapport a été envoyé le {avis.envoi ? new Date(avis.envoi.envoye_le).toLocaleDateString('fr-FR') : '—'}. Pour modifier, créez une nouvelle version.
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

        {/* Toast succès post-envoi */}
        {toast && (
          <div className="bg-green-50 border-b border-green-200 px-6 py-2.5 flex items-center justify-between gap-3 flex-shrink-0 no-print">
            <div className="flex items-center gap-2 text-xs text-green-800 flex-1 min-w-0">
              <CheckCircle2 size={14} className="flex-shrink-0 text-green-600" />
              <span>
                Avis envoyé à <strong>{toast.nom}</strong>. Lien public :
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
            key={avis.id}
            data={{
              type: 'avis_valeur',
              estimation: avis,
              agence: PROPSIGHT_AGENCE,
              conseiller: DEMO_CONSEILLER,
              date_rapport: avis.updated_at,
            }}
            initialConfig={initialConfig}
            titreHeader="Avis de valeur"
            badge={headerBadge}
            onRetour={handleRetour}
            onConfigChange={handleConfigChange}
            onSend={isLocked ? undefined : handleEnvoyer}
            readOnly={isLocked}
            actions={headerActions}
          />
        </div>
      </div>

      {/* Panel latéral Historique */}
      {showHistorique && isEnvoyee && avis.envoi && (
        <div className="w-[320px] flex-shrink-0 border-l border-slate-200 bg-slate-50 overflow-y-auto p-4 no-print">
          <HistoriqueEnvois envoi={avis.envoi} onRenvoyer={handleRenvoyer} />
        </div>
      )}

      {/* Modale envoi */}
      <ModaleEnvoi
        isOpen={modaleEnvoiOpen}
        avis={avis}
        onClose={() => setModaleEnvoiOpen(false)}
        onEnvoyer={handleConfirmerEnvoi}
      />
    </div>
  );
};

export default AvisValeurDetail;
