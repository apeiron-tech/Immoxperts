import React, { useMemo, useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import type { WidgetInstance, TemplateChannel } from '../../types';
import { SELLER_TEMPLATES, INVESTOR_TEMPLATES, COMMON_VARIABLES, SELLER_VARIABLES, INVESTOR_VARIABLES } from '../../_mocks/templates';
import MessagePreview from '../../components/MessagePreview';
import VariableInserter from '../../components/VariableInserter';

interface Props {
  widget: WidgetInstance;
}

const CHANNEL_TABS: Array<{ id: TemplateChannel; label: string }> = [
  { id: 'email_initial', label: 'Email initial' },
  { id: 'email_relance', label: 'Email relance' },
  { id: 'whatsapp_initial', label: 'WhatsApp initial' },
  { id: 'whatsapp_relance', label: 'WhatsApp relance' },
  { id: 'confirmation_interne', label: 'Confirmation interne (équipe)' },
];

const TemplatesTab: React.FC<Props> = ({ widget }) => {
  const isSeller = widget.type === 'estimation_vendeur';
  const TEMPLATES = useMemo(() => (isSeller ? SELLER_TEMPLATES : INVESTOR_TEMPLATES), [isSeller]);

  const [active, setActive] = useState<TemplateChannel>('whatsapp_initial');
  const current = TEMPLATES[active];

  const [subject, setSubject] = useState(current.subject ?? '');
  const [body, setBody] = useState(current.body);
  const [attach, setAttach] = useState(true);

  // quand on change d'onglet secondaire, on recharge le template
  React.useEffect(() => {
    setSubject(TEMPLATES[active].subject ?? '');
    setBody(TEMPLATES[active].body);
  }, [active, TEMPLATES]);

  const isWhatsApp = active.startsWith('whatsapp');
  const isEmail = active.startsWith('email') || active === 'confirmation_interne';

  const variableGroups = [
    { label: 'Communes', variables: COMMON_VARIABLES },
    {
      label: isSeller ? 'Vendeur' : 'Investisseur',
      variables: isSeller ? SELLER_VARIABLES : INVESTOR_VARIABLES,
    },
  ];

  const handleInsertVariable = (v: string) => {
    setBody(b => b + v);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-md">
        <div className="flex items-center gap-1 px-4 overflow-x-auto border-b border-slate-200">
          {CHANNEL_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`relative px-3 py-3 text-sm whitespace-nowrap transition-colors ${
                active === t.id ? 'text-propsight-700 font-medium' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
              {active === t.id && <div className="absolute left-2 right-2 bottom-0 h-0.5 bg-propsight-600 rounded-t" />}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5 p-5">
          {/* Éditeur */}
          <div className="space-y-3">
            {isEmail && (
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Objet</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-propsight-400 focus:ring-1 focus:ring-propsight-200 focus:outline-none"
                />
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-500">
                  {isWhatsApp ? 'Message WhatsApp' : 'Corps du message'}
                </label>
                <VariableInserter groups={variableGroups} onInsert={handleInsertVariable} />
              </div>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={isWhatsApp ? 14 : 12}
                maxLength={isWhatsApp ? 1024 : undefined}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded focus:border-propsight-400 focus:ring-1 focus:ring-propsight-200 focus:outline-none font-sans resize-none"
              />
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>{isWhatsApp ? `${body.length}/1024 caractères` : `${body.length} caractères`}</span>
                {isWhatsApp && (
                  <span>
                    Ouvert via un lien wa.me avec le numéro du lead · envoi manuellement confirmé par l'agent.
                  </span>
                )}
              </div>
            </div>
            {isEmail && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attach}
                  onChange={e => setAttach(e.target.checked)}
                  className="rounded text-propsight-600"
                />
                <span className="text-sm text-slate-700 inline-flex items-center gap-1.5">
                  <Paperclip size={13} />
                  {isSeller ? "Joindre l'avis de valeur PDF" : 'Joindre la fiche projet PDF'}
                </span>
              </label>
            )}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50">
                <Send size={13} />
                Envoyer un test à moi-même
              </button>
              <button className="text-xs text-slate-400 hover:text-slate-600 ml-auto">Voir le modèle complet ↗</button>
            </div>
          </div>

          {/* Preview */}
          <div>
            <MessagePreview
              variant={isWhatsApp ? 'whatsapp' : 'email'}
              subject={isEmail ? subject : undefined}
              body={body}
              hasAttachment={isEmail && attach}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesTab;
