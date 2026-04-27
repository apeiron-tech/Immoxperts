import React, { useState } from 'react';
import { Send, RefreshCw, Download, ShieldCheck, Eye, Check, X } from 'lucide-react';
import type { WidgetInstance } from '../../types';
import EmbedCodeBlock from '../../components/EmbedCodeBlock';
import { MOCK_WEBHOOK_HISTORY } from '../../_mocks/leads-widget';

interface Props {
  widget: WidgetInstance;
}

const IntegrationTab: React.FC<Props> = ({ widget }) => {
  const [mode, setMode] = useState<'inline' | 'popin' | 'hero' | 'float'>('inline');
  const [domains, setDomains] = useState<string[]>([widget.domain, 'www.maisondexception.fr']);
  const [newDomain, setNewDomain] = useState('');
  const [webhookOn, setWebhookOn] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://api.maisondexception.fr/hooks/propsight');
  const [secret, setSecret] = useState('sk_wh_a9f3b7c2');
  const [events, setEvents] = useState<string[]>(['lead.created']);
  const [testResult, setTestResult] = useState<'idle' | 'ok'>('idle');
  const [testMode, setTestMode] = useState(false);

  const embed = `<div id="propsight-widget-${widget.type}"></div>
<script src="https://widget.propsight.fr/loader.js"
        data-agent-id="ag_xxx"
        data-theme="default"
        data-type="${widget.type}"
        data-mode="${mode}"></script>`;

  const eventOptions = ['widget.viewed', 'widget.started', 'widget.completed', 'lead.created', 'action.created'];

  const toggleEvent = (e: string) => {
    setEvents(prev => (prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]));
  };

  return (
    <div className="space-y-5">
      {/* Code embed */}
      <div className="bg-white border border-slate-200 rounded-md p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Code embed</h3>
        <p className="text-xs text-slate-500 mb-3">
          Collez ce code juste avant la fermeture de <code className="text-[11px] bg-slate-100 px-1 rounded">&lt;/body&gt;</code>.
        </p>
        <div className="flex items-center gap-3 mb-3">
          <label className="text-xs text-slate-500">Mode d'affichage</label>
          <select
            value={mode}
            onChange={e => setMode(e.target.value as typeof mode)}
            className="text-sm border border-slate-200 rounded px-2.5 py-1 focus:border-propsight-400 focus:ring-1 focus:ring-propsight-200 focus:outline-none bg-white"
          >
            <option value="inline">Inline</option>
            <option value="popin">Pop-in</option>
            <option value="hero">Bloc hero</option>
            <option value="float">Bouton flottant</option>
          </select>
        </div>
        <EmbedCodeBlock code={embed} />
      </div>

      {/* Domaines autorisés */}
      <div className="bg-white border border-slate-200 rounded-md p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Domaines autorisés</h3>
        <p className="text-xs text-slate-500 mb-3">Le widget ne se chargera que sur ces domaines (CORS).</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {domains.map(d => (
            <span key={d} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-propsight-50 text-propsight-700 text-sm">
              {d}
              <button
                onClick={() => setDomains(prev => prev.filter(x => x !== d))}
                className="text-propsight-400 hover:text-propsight-700"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="ex. www.mon-site.fr"
            value={newDomain}
            onChange={e => setNewDomain(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && newDomain) {
                setDomains(prev => [...prev, newDomain]);
                setNewDomain('');
              }
            }}
            className="flex-1 px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-propsight-400 focus:ring-1 focus:ring-propsight-200 focus:outline-none"
          />
          <button
            onClick={() => {
              if (newDomain) {
                setDomains(prev => [...prev, newDomain]);
                setNewDomain('');
              }
            }}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Webhook */}
      <div className="bg-white border border-slate-200 rounded-md p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Webhook sortant</h3>
            <p className="text-xs text-slate-500 mt-0.5">Envoyez les événements vers votre backend ou CRM.</p>
          </div>
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" checked={webhookOn} onChange={e => setWebhookOn(e.target.checked)} className="sr-only peer" />
            <div className="relative w-9 h-5 bg-slate-200 peer-checked:bg-propsight-500 rounded-full transition-colors">
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
          </label>
        </div>

        <div className={webhookOn ? '' : 'opacity-50 pointer-events-none'}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">URL cible (https)</label>
              <input
                type="text"
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-propsight-400 focus:ring-1 focus:ring-propsight-200 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Secret</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={secret}
                  onChange={e => setSecret(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-propsight-400 focus:ring-1 focus:ring-propsight-200 focus:outline-none font-mono"
                />
                <button
                  onClick={() => setSecret(`sk_wh_${Math.random().toString(36).slice(2, 10)}`)}
                  className="w-8 h-8 rounded border border-slate-200 text-slate-500 hover:text-propsight-600 hover:border-propsight-300 flex items-center justify-center"
                  title="Régénérer"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs text-slate-500 mb-1 block">Événements écoutés</label>
            <div className="flex flex-wrap gap-1.5">
              {eventOptions.map(e => {
                const on = events.includes(e);
                return (
                  <button
                    key={e}
                    onClick={() => toggleEvent(e)}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border transition-colors font-mono ${
                      on ? 'bg-propsight-50 border-propsight-200 text-propsight-700' : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    {on && <Check size={10} />}
                    {e}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTestResult('ok');
                setTimeout(() => setTestResult('idle'), 4000);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Send size={13} />
              Envoyer un événement test
            </button>
            {testResult === 'ok' && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
                <Check size={12} /> 200 OK · payload envoyé
              </span>
            )}
          </div>

          {/* Historique */}
          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Historique des envois</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                  <th className="py-2 font-medium">Événement</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_WEBHOOK_HISTORY.map((h, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 font-mono text-xs text-slate-700">{h.event}</td>
                    <td className="py-2">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                          h.status < 400 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td className="py-2 text-slate-500 text-xs tabular-nums">{h.timestamp.replace('T', ' ').slice(0, 16)}</td>
                    <td className="py-2 text-right">
                      <button className="text-xs text-propsight-600 hover:text-propsight-700 inline-flex items-center gap-1">
                        <Eye size={11} /> Payload
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export CSV */}
      <div className="bg-white border border-slate-200 rounded-md p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Export CSV</h3>
        <div className="flex items-center gap-3">
          <select className="text-sm border border-slate-200 rounded px-2.5 py-1.5 bg-white">
            <option>30 derniers jours</option>
            <option>7 derniers jours</option>
            <option>90 derniers jours</option>
            <option>Sur mesure</option>
          </select>
          <button
            onClick={() => console.warn('[widget] export CSV (mock)')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-propsight-600 text-white hover:bg-propsight-700"
          >
            <Download size={13} />
            Télécharger CSV
          </button>
        </div>
      </div>

      {/* CRM */}
      <div className="bg-white border border-slate-200 rounded-md p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Compatibilité CRM</h3>
        <p className="text-xs text-slate-500 mb-3">Compatible avec les principales plateformes françaises.</p>
        <div className="grid grid-cols-5 gap-2">
          {[
            { name: 'Hektor', status: 'Via webhook' },
            { name: 'Apimo', status: 'Via webhook' },
            { name: 'Netty', status: 'Via webhook' },
            { name: 'Zapier', status: 'Via Zapier' },
            { name: 'Make', status: 'Via Make' },
          ].map(c => (
            <div key={c.name} className="border border-slate-200 rounded-md p-3 text-center">
              <div className="text-sm font-semibold text-slate-900">{c.name}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{c.status}</div>
            </div>
          ))}
        </div>
        <a href="#" className="inline-flex items-center gap-1 mt-3 text-xs text-propsight-600 hover:text-propsight-700 font-medium">
          <ShieldCheck size={12} />
          Voir le guide d'intégration →
        </a>
      </div>

      {/* Mode test */}
      <div className="bg-white border border-slate-200 rounded-md p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Mode test / production</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              En mode test, les leads sont taggés <code className="bg-slate-100 px-1 rounded">[TEST]</code> et exclus des stats.
            </p>
          </div>
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" checked={testMode} onChange={e => setTestMode(e.target.checked)} className="sr-only peer" />
            <div className="relative w-9 h-5 bg-slate-200 peer-checked:bg-amber-400 rounded-full transition-colors">
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTab;
