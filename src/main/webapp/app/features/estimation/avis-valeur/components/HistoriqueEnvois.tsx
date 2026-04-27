import React from 'react';
import { Send, Eye, Smartphone, Monitor, Tablet, RotateCw, ExternalLink } from 'lucide-react';
import { EnvoiInfo, OuvertureEvent } from '../../types';

interface Props {
  envoi: EnvoiInfo;
  onRenvoyer?: () => void;
}

function copyToClipboard(text: string): void {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      console.warn('[HistoriqueEnvois] Impossible de copier dans le presse-papier');
    });
  }
}

const DEVICE_ICON: Record<OuvertureEvent['user_agent'], React.ReactNode> = {
  mobile: <Smartphone size={11} />,
  desktop: <Monitor size={11} />,
  tablette: <Tablet size={11} />,
};

function formatDate(s: string): string {
  const d = new Date(s);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(s: string): string {
  const d = new Date(s);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

const HistoriqueEnvois: React.FC<Props> = ({ envoi, onRenvoyer }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
        <Send size={12} className="text-propsight-500" />
        <h3 className="text-xs font-semibold text-slate-700">Historique des envois</h3>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs text-slate-500">Envoyé le</p>
          <p className="text-sm font-medium text-slate-900">
            {formatDate(envoi.envoye_le)} à {formatTime(envoi.envoye_le)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            À : <span className="text-slate-700">{envoi.email_destinataire}</span>
            {envoi.nom_destinataire && <span className="text-slate-500"> · {envoi.nom_destinataire}</span>}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Eye size={11} className={envoi.ouvertures.length > 0 ? 'text-green-600' : 'text-slate-400'} />
            <p className="text-xs font-semibold text-slate-700">
              {envoi.ouvertures.length} ouverture{envoi.ouvertures.length !== 1 ? 's' : ''}
            </p>
          </div>

          {envoi.ouvertures.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Le destinataire n'a pas encore ouvert le rapport.</p>
          ) : (
            <div className="space-y-1.5">
              {envoi.ouvertures.map((o, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded px-2 py-1">
                  <span className="text-slate-400 flex-shrink-0">{DEVICE_ICON[o.user_agent]}</span>
                  <span className="flex-1">
                    {formatDate(o.date)} à {formatTime(o.date)}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">{o.user_agent}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-1.5">
          <button
            onClick={() => window.open(`/rapport/${envoi.token_public}`, '_blank')}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-propsight-700 border border-propsight-200 bg-propsight-50 rounded hover:bg-propsight-100 transition-colors"
          >
            <ExternalLink size={11} /> Ouvrir la version publique
          </button>
          {onRenvoyer && (
            <button
              onClick={onRenvoyer}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            >
              <RotateCw size={11} /> Renvoyer le rapport
            </button>
          )}
        </div>

        <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="font-mono truncate">Token : {envoi.token_public}</span>
          <button
            onClick={() => copyToClipboard(`${window.location.origin}/rapport/${envoi.token_public}`)}
            className="text-propsight-600 hover:text-propsight-800 transition-colors flex-shrink-0"
            title="Copier l'URL publique"
          >
            Copier l'URL
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoriqueEnvois;
