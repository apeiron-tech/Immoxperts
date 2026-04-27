import React, { useEffect, useState } from 'react';
import { X, Send, Mail, User, FileText, Eye, Paperclip, Calendar, Lock } from 'lucide-react';
import { Estimation, EnvoiInfo } from '../../types';
import { PROPSIGHT_AGENCE, DEMO_CONSEILLER } from 'app/features/shared/template-rapport/_mocks/agence';

interface Props {
  isOpen: boolean;
  avis: Estimation;
  onClose: () => void;
  onEnvoyer: (envoi: EnvoiInfo) => void;
  rapportType?: 'avis_valeur' | 'etude_locative';
}

function generateToken(): string {
  return Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 8);
}

function buildDefaultMessage(avis: Estimation, rapportType: 'avis_valeur' | 'etude_locative'): string {
  const civNom = avis.client ? `${avis.client.civilite} ${avis.client.nom}` : 'Madame, Monsieur';
  const adresse = `${avis.bien.adresse}, ${avis.bien.code_postal} ${avis.bien.ville}`;
  const intro =
    rapportType === 'etude_locative'
      ? `Veuillez trouver ci-joint l'étude locative que nous avons réalisée pour votre bien situé ${adresse}.

Vous y trouverez une analyse du marché locatif local, des comparables à la location, les réglementations applicables (encadrement, permis de louer, logement décent), ainsi que notre loyer recommandé argumenté.`
      : `Veuillez trouver ci-joint l'avis de valeur que nous avons réalisé pour votre bien situé ${adresse}.

Vous y trouverez une analyse détaillée du marché local, des biens comparables récents, ainsi que notre estimation argumentée.`;
  return `Bonjour ${civNom},

${intro} Le rapport est consultable directement en ligne via le lien sécurisé inclus dans ce mail, et également téléchargeable en PDF.

Je reste à votre entière disposition pour toute question ou pour convenir d'un rendez-vous afin d'échanger sur ce dossier.

Cordialement,
${DEMO_CONSEILLER.prenom} ${DEMO_CONSEILLER.nom}
${DEMO_CONSEILLER.titre}
${PROPSIGHT_AGENCE.nom}
${DEMO_CONSEILLER.telephone} · ${DEMO_CONSEILLER.email}`;
}

const ModaleEnvoi: React.FC<Props> = ({ isOpen, avis, onClose, onEnvoyer, rapportType = 'avis_valeur' }) => {
  const labelType = rapportType === 'etude_locative' ? 'étude locative' : 'avis de valeur';
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [objet, setObjet] = useState('');
  const [message, setMessage] = useState('');
  const [trackerOuverture, setTrackerOuverture] = useState(true);
  const [pdfAttache, setPdfAttache] = useState(true);
  const [programmer, setProgrammer] = useState(false);

  // Réinitialise depuis le client de l'AdV à chaque ouverture
  useEffect(() => {
    if (!isOpen) return;
    const c = avis.client;
    const fullName = c ? `${c.civilite} ${c.prenom} ${c.nom}`.trim() : '';
    setNom(fullName);
    setEmail(c?.email || '');
    setObjet(`Votre ${labelType} · ${avis.bien.adresse}, ${avis.bien.ville}`);
    setMessage(buildDefaultMessage(avis, rapportType));
    setTrackerOuverture(true);
    setPdfAttache(true);
    setProgrammer(false);
  }, [isOpen, avis]);

  if (!isOpen) return null;

  const peutEnvoyer = nom.trim().length > 0 && /^\S+@\S+\.\S+$/.test(email) && objet.trim().length > 0 && message.trim().length > 0;

  const handleSubmit = () => {
    if (!peutEnvoyer) return;
    const envoi: EnvoiInfo = {
      envoye_le: new Date().toISOString(),
      email_destinataire: email.trim(),
      nom_destinataire: nom.trim(),
      objet: objet.trim(),
      message: message.trim(),
      ouvertures: [],
      derniere_ouverture: undefined,
      token_public: generateToken(),
    };
    console.warn('[ModaleEnvoi] Envoi simulé', { id: avis.id, type: rapportType, envoi });
    onEnvoyer(envoi);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-md shadow-sm w-full max-w-xl max-h-[90vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Send size={15} className="text-propsight-600" />
            <h2 className="text-sm font-semibold text-slate-900">Envoyer cette {labelType}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Destinataire */}
          <div>
            <SectionLabel icon={<User size={11} />}>Destinataire</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="M. Prévost"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-propsight-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="prevost@example.com"
                  className={`w-full px-2.5 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 ${
                    email && !/^\S+@\S+\.\S+$/.test(email)
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-slate-200 focus:ring-propsight-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Objet */}
          <div>
            <SectionLabel icon={<Mail size={11} />}>Objet du mail</SectionLabel>
            <input
              type="text"
              value={objet}
              onChange={e => setObjet(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-propsight-400"
            />
          </div>

          {/* Message */}
          <div>
            <SectionLabel icon={<FileText size={11} />}>Message</SectionLabel>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-propsight-400 resize-none font-mono leading-relaxed"
              style={{ fontFamily: 'inherit' }}
            />
            <p className="text-[10px] text-slate-400 mt-1">Modèle préchargé depuis Paramètres &gt; Organisation &gt; Communication.</p>
          </div>

          {/* Options */}
          <div>
            <SectionLabel icon={<Eye size={11} />}>Options</SectionLabel>
            <div className="space-y-2 bg-slate-50 rounded p-3 border border-slate-100">
              <Option
                checked={trackerOuverture}
                onChange={setTrackerOuverture}
                icon={<Eye size={12} />}
                label="Tracker l'ouverture du rapport"
                sub="Vous serez notifié dès que le destinataire consultera le lien."
              />
              <Option
                checked={pdfAttache}
                onChange={setPdfAttache}
                icon={<Paperclip size={12} />}
                label="Envoyer aussi une version PDF attachée"
                sub="Joint la version imprimable au mail (pratique pour archivage client)."
              />
              <Option
                checked={programmer}
                onChange={setProgrammer}
                disabled
                icon={<Calendar size={12} />}
                label="Programmer l'envoi"
                sub="Disponible en V2."
              />
            </div>
          </div>

          {/* Aperçu */}
          <div className="bg-propsight-50 border border-propsight-100 rounded-md px-3 py-2.5 flex items-start gap-2">
            <Lock size={12} className="text-propsight-500 mt-0.5 flex-shrink-0" />
            <div className="text-[11px] text-propsight-900 leading-relaxed">
              Le destinataire recevra un lien vers une <strong>version web sécurisée</strong> du rapport (URL avec token unique)
              {pdfAttache ? ' + un PDF attaché' : ''}. Une fois envoyé, l'éditeur passera en lecture seule. Pour modifier, vous créerez une nouvelle version.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!peutEnvoyer}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-propsight-600 text-white rounded hover:bg-propsight-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={11} /> Envoyer maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionLabel: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
    {icon}
    {children}
  </div>
);

const Option: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
  disabled?: boolean;
}> = ({ checked, onChange, icon, label, sub, disabled }) => (
  <label className={`flex items-start gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      disabled={disabled}
      className="mt-0.5 w-3.5 h-3.5 accent-propsight-600 cursor-pointer disabled:cursor-not-allowed"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-slate-500">{icon}</span>
        <span className="text-xs font-medium text-slate-800">{label}</span>
      </div>
      <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
    </div>
  </label>
);

export default ModaleEnvoi;
