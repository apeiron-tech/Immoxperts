import React from 'react';
import { MessageCircle, Mail, Paperclip, Check } from 'lucide-react';

interface Props {
  variant: 'email' | 'whatsapp';
  subject?: string;
  body: string;
  agencyName?: string;
  agentName?: string;
  hasAttachment?: boolean;
}

// Remplace grossièrement quelques variables pour la preview (maquette)
const mockReplace = (s: string): string =>
  s
    .replace(/\{\{first_name\}\}/g, 'Sophie')
    .replace(/\{\{last_name\}\}/g, 'Martin')
    .replace(/\{\{property_address\}\}/g, '22 rue de la Pompe, 75116 Paris')
    .replace(/\{\{agent_name\}\}/g, 'Thomas Lemoine')
    .replace(/\{\{agency_name\}\}/g, 'Maison d\'Exception')
    .replace(/\{\{valuation_min\}\}/g, '482 000')
    .replace(/\{\{valuation_max\}\}/g, '515 000')
    .replace(/\{\{median_price\}\}/g, '8 650')
    .replace(/\{\{market_trend\}\}/g, '2,3')
    .replace(/\{\{days_on_market\}\}/g, '43')
    .replace(/\{\{comparables_count\}\}/g, '12')
    .replace(/\{\{recommended_strategy\}\}/g, 'T2 meublé en zone tendue')
    .replace(/\{\{target_zone\}\}/g, 'Lyon')
    .replace(/\{\{estimated_yield\}\}/g, '5,2')
    .replace(/\{\{target_rent\}\}/g, '930')
    .replace(/\{\{rental_tension\}\}/g, 'élevée')
    .replace(/\{\{budget\}\}/g, '250 000')
    .replace(/\{\{phone\}\}/g, '+33 6 12 34 56 78')
    .replace(/\{\{email\}\}/g, 'sophie.martin@example.com');

const MessagePreview: React.FC<Props> = ({ variant, subject, body, agencyName = 'Maison d\'Exception', hasAttachment }) => {
  const displayBody = mockReplace(body);
  const displaySubject = subject ? mockReplace(subject) : undefined;

  if (variant === 'whatsapp') {
    return (
      <div className="rounded-md border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border-b border-emerald-100">
          <MessageCircle size={14} className="text-emerald-600" />
          <span className="text-xs font-medium text-emerald-900">Aperçu WhatsApp</span>
        </div>
        <div className="bg-[#e7e3db] p-4 min-h-[240px] flex flex-col items-end">
          <div className="max-w-[85%] bg-[#dcf8c6] rounded-lg rounded-br-sm px-3 py-2 shadow-sm">
            <pre className="text-[13px] text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">{displayBody}</pre>
            <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 mt-1">
              <span>10:42</span>
              <Check size={11} className="text-sky-500" />
              <Check size={11} className="-ml-2.5 text-sky-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 overflow-hidden bg-white">
      <div className="flex items-center gap-2 px-3 py-2 bg-propsight-50 border-b border-propsight-100">
        <Mail size={14} className="text-propsight-600" />
        <span className="text-xs font-medium text-propsight-900">Aperçu email</span>
      </div>
      <div className="p-4">
        <div className="pb-3 border-b border-slate-100 mb-3">
          <div className="text-xs text-slate-500">De : {agencyName}</div>
          {displaySubject && <div className="text-sm font-semibold text-slate-900 mt-1">{displaySubject}</div>}
        </div>
        <pre className="text-[13px] text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{displayBody}</pre>
        {hasAttachment && (
          <div className="mt-3 pt-3 border-t border-slate-100 inline-flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded">
            <Paperclip size={12} />
            avis-de-valeur.pdf
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePreview;
