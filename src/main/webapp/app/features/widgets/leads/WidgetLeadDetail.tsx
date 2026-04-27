import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  UserCircle,
  BarChart3,
  AlertTriangle,
  Target,
  CalendarPlus,
  Mail,
  MessageCircle,
  RefreshCw,
  Phone,
  CheckCircle2,
  UserPlus,
} from 'lucide-react';
import { MOCK_WIDGET_LEAD, OBJECTIONS } from '../_mocks/leads-widget';
import { AUTOMATION_TIMELINE } from '../_mocks/activity';
import MessagePreview from '../components/MessagePreview';
import { SELLER_TEMPLATES } from '../_mocks/templates';
import ActivityTimeline from '../components/ActivityTimeline';

const WidgetLeadDetail: React.FC = () => {
  const lead = MOCK_WIDGET_LEAD;
  const isSeller = lead.source === 'estimation_vendeur';

  const briefRegenerate = () => {
    console.warn('[lead] regenerate brief RDV (mock)');
  };

  return (
    <div className="min-h-full bg-slate-50">
      {/* Sticky top bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center gap-4">
          <Link to="/app/activite/leads" className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1">
            <ArrowLeft size={14} />
            Leads
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-900 font-medium">
            {lead.firstName} {lead.lastName}
          </span>
          <span className="inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-propsight-50 text-propsight-700 text-xs font-medium border border-propsight-100">
            <span>{'</>'}</span>
            Widget {isSeller ? 'estimation vendeur' : 'projet investisseur'}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50">
              <Phone size={13} />
              Appeler
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-propsight-600 text-white hover:bg-propsight-700">
              <CalendarPlus size={13} />
              Proposer un RDV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-6 grid grid-cols-[1fr_420px] gap-5">
        {/* Main column */}
        <div className="space-y-5">
          {/* Soumission widget */}
          <section className="bg-white border border-slate-200 rounded-md">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Soumission widget</h2>
              <span className="text-xs text-slate-500">
                Reçue le {new Date(lead.createdAt).toLocaleString('fr-FR')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 px-5 py-4 text-sm">
              <KV k="Nom" v={`${lead.firstName} ${lead.lastName}`} />
              <KV k="Email" v={lead.email} />
              <KV k="Téléphone" v={lead.phone} />
              <KV k="Préférence contact" v="WhatsApp" />
              <KV k="Bien" v={`${lead.property.type} ${lead.property.surface} m² — ${lead.property.rooms} pièces`} />
              <KV k="Adresse" v={lead.property.address} />
              <KV k="DPE" v="D" />
              <KV k="Délai envisagé" v="3–6 mois" />
            </div>
          </section>

          {/* Insights agent */}
          <section className="bg-white border border-slate-200 rounded-md">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Insights agent (réservés)</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium border border-sky-100">
                <BarChart3 size={11} />
                Confidentiel
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 px-5 py-4 text-sm">
              <KV k="Prix médian secteur" v={`${lead.insights.medianPricePerSqm.toLocaleString('fr-FR')} €/m²`} />
              <KV k="Évolution 6 mois" v={`+${lead.insights.trend6m.toString().replace('.', ',')} %`} />
              <KV k="Délai de vente estimé" v={`${lead.insights.daysOnMarket} jours`} />
              <KV k="Comparables récents" v={`${lead.insights.comparablesCount} biens`} />
              <KV k="Point fort principal" v={lead.insights.mainStrength} />
              <KV k="Point de vigilance" v={lead.insights.mainWarning} />
              <KV k="Maturité vendeur" v="Haute (prête à mandater)" />
              <KV k="Tension locale" v="Élevée" />
            </div>
          </section>

          {/* Messages préparés */}
          <section className="bg-white border border-slate-200 rounded-md">
            <div className="px-5 py-3.5 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Messages préparés</h2>
              <p className="text-xs text-slate-500 mt-0.5">Les templates sont pré-remplis avec les données du lead.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 p-5">
              <div>
                <MessagePreview
                  variant="email"
                  subject={SELLER_TEMPLATES.email_initial.subject}
                  body={SELLER_TEMPLATES.email_initial.body}
                  hasAttachment
                />
                <button className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-md bg-propsight-600 text-white hover:bg-propsight-700">
                  <Mail size={13} />
                  Envoyer l'email
                </button>
              </div>
              <div>
                <MessagePreview variant="whatsapp" body={SELLER_TEMPLATES.whatsapp_initial.body} />
                <a
                  href={`https://wa.me/${lead.phone.replace(/\s/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <MessageCircle size={13} />
                  Ouvrir WhatsApp
                </a>
              </div>
            </div>
          </section>

          {/* Timeline événements widget */}
          <section className="bg-white border border-slate-200 rounded-md">
            <div className="px-5 py-3.5 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Timeline événements widget</h2>
            </div>
            <div className="px-5 py-4">
              <ActivityTimeline entries={AUTOMATION_TIMELINE} variant="timeline" />
            </div>
          </section>
        </div>

        {/* Side column — Brief RDV */}
        <div className="space-y-4">
          <section className="bg-white border border-slate-200 rounded-md">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Brief RDV</h2>
              <button
                onClick={briefRegenerate}
                className="inline-flex items-center gap-1 text-xs text-propsight-600 hover:text-propsight-700 font-medium"
              >
                <RefreshCw size={11} />
                Générer un brief
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              <BriefBlock icon={<MapPin size={13} className="text-propsight-600" />} title="Bien">
                <div className="text-sm text-slate-900">
                  {lead.property.type} {lead.property.surface} m² — {lead.property.rooms} pièces
                </div>
                <div className="text-xs text-slate-500">{lead.property.address}</div>
              </BriefBlock>
              <BriefBlock icon={<UserCircle size={13} className="text-propsight-600" />} title="Lead">
                <div className="text-sm text-slate-900">
                  {lead.firstName} {lead.lastName}
                </div>
                <div className="text-xs text-slate-500">
                  Source : Widget {isSeller ? 'estimation vendeur' : 'projet investisseur'}
                </div>
                <div className="text-xs text-slate-500">
                  Date : {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </BriefBlock>
              <BriefBlock icon={<BarChart3 size={13} className="text-propsight-600" />} title="Insights lead">
                <ul className="text-sm space-y-1">
                  <li className="flex items-center justify-between">
                    <span className="text-slate-600">Prix médian secteur</span>
                    <span className="text-slate-900 font-medium">{lead.insights.medianPricePerSqm.toLocaleString('fr-FR')} €/m²</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-slate-600">Évolution 6 mois</span>
                    <span className="text-slate-900 font-medium">+{lead.insights.trend6m.toString().replace('.', ',')} %</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-slate-600">Délai de vente estimé</span>
                    <span className="text-slate-900 font-medium">{lead.insights.daysOnMarket} jours</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-slate-600">Comparables récents</span>
                    <span className="text-slate-900 font-medium">{lead.insights.comparablesCount} biens</span>
                  </li>
                </ul>
              </BriefBlock>
              <BriefBlock icon={<AlertTriangle size={13} className="text-amber-600" />} title="Objections probables">
                <ul className="text-sm space-y-1 list-disc pl-4 text-slate-700">
                  {OBJECTIONS.map(o => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
                <button className="mt-2 text-xs text-propsight-600 hover:text-propsight-700 font-medium">
                  Voir comment y répondre →
                </button>
              </BriefBlock>
              <BriefBlock icon={<Target size={13} className="text-propsight-600" />} title="Prochaine meilleure action">
                <div className="p-2.5 rounded-md bg-propsight-50 border border-propsight-100">
                  <div className="text-sm font-semibold text-propsight-900">{lead.insights.nextBestAction}</div>
                  <div className="text-xs text-propsight-700 mt-0.5">
                    Le lead est chaud. Proposez un échange pour approfondir.
                  </div>
                  <button className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-propsight-600 text-white hover:bg-propsight-700">
                    <CalendarPlus size={12} />
                    Proposer un RDV
                  </button>
                </div>
              </BriefBlock>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-md p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <div className="text-xs text-slate-600">
              Email avis de valeur préparé et WhatsApp prêt à l'envoi · 2 relances planifiées.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const KV: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div>
    <div className="text-xs text-slate-500">{k}</div>
    <div className="text-sm text-slate-900 mt-0.5">{v}</div>
  </div>
);

const BriefBlock: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({
  icon,
  title,
  children,
}) => (
  <div className="px-5 py-4">
    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
      {icon}
      {title}
    </div>
    {children}
  </div>
);

export default WidgetLeadDetail;
