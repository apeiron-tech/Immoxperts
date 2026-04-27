import React, { useState } from 'react';
import { Zap, Mail, MessageCircle, Bell, Users, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import type { WidgetInstance } from '../../types';
import { AUTOMATION_TIMELINE } from '../../_mocks/activity';
import ActivityTimeline from '../../components/ActivityTimeline';

interface Props {
  widget: WidgetInstance;
}

const AutomationTab: React.FC<Props> = ({ widget }) => {
  const [openClaw, setOpenClaw] = useState(false);
  const [assign, setAssign] = useState('round-robin');
  const [priorityChannel, setPriorityChannel] = useState('whatsapp');
  const [delay1, setDelay1] = useState('15min');
  const [delay2, setDelay2] = useState('24h');
  const [maxRelances, setMaxRelances] = useState(2);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-4">
      {/* Règles */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Règles d'automatisation</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Activez et paramétrez chaque étape du parcours lead.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          <Rule icon={<Users size={15} />} label="Créer automatiquement un lead" desc="Chaque soumission crée un lead dans le CRM." defaultOn />
          <Rule icon={<Zap size={15} />} label="Créer une action prioritaire" desc="Tâche de suivi pour l'équipe." defaultOn />
          <Rule icon={<Bell size={15} />} label="Envoyer une notification OpenClaw" desc="Alerte envoyée au canal #leads." defaultOn />
          <Rule icon={<MessageCircle size={15} />} label="Préparer un message WhatsApp" desc="Prépare un message personnalisé prêt à envoyer." defaultOn />
          <Rule icon={<Mail size={15} />} label="Préparer un email avec avis de valeur" desc="Génère un email contenant l'avis de valeur en PDF." defaultOn />

          <SelectRow label="Assignation" value={assign} onChange={setAssign} options={[
            { value: 'round-robin', label: 'Round-robin' },
            { value: 'secteur', label: 'Par secteur' },
            { value: 'default', label: 'Collaborateur par défaut' },
            { value: 'manuel', label: 'Manuel' },
          ]} />
          <SelectRow label="Stage d'entrée" value="nouveau" onChange={() => {}} options={[
            { value: 'nouveau', label: 'Nouveau' },
            { value: 'qualifier', label: 'À qualifier' },
          ]} />
          <SelectRow label="Canal prioritaire" value={priorityChannel} onChange={setPriorityChannel} options={[
            { value: 'email', label: 'Email' },
            { value: 'tel', label: 'Téléphone' },
            { value: 'whatsapp', label: 'WhatsApp' },
            { value: 'email-wa', label: 'Email + WhatsApp' },
          ]} />
          <SelectRow label="Délai de relance initial" value={delay1} onChange={setDelay1} options={[
            { value: 'immediat', label: 'Immédiat' },
            { value: '15min', label: '15 min' },
            { value: '1h', label: '1 h' },
            { value: '24h', label: '24 h' },
          ]} />
          <SelectRow label="Délai de relance secondaire" value={delay2} onChange={setDelay2} options={[
            { value: '24h', label: '24 h' },
            { value: '48h', label: '48 h' },
            { value: '72h', label: '72 h' },
            { value: '7j', label: '7 j' },
          ]} />
          <SelectRow
            label="Nombre max de relances"
            value={String(maxRelances)}
            onChange={v => setMaxRelances(Number(v))}
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '5', label: '5' },
            ]}
          />
        </div>

        {/* OpenClaw */}
        <div className="border-t border-slate-200">
          <button
            onClick={() => setOpenClaw(o => !o)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-propsight-500 to-indigo-600 text-white flex items-center justify-center">
                <TrendingUp size={14} />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-900">Orchestration avancée (OpenClaw)</div>
                <div className="text-xs text-slate-500">Enchaînements automatiques propulsés par IA.</div>
              </div>
            </div>
            {openClaw ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {openClaw && (
            <div className="px-5 pb-4 space-y-2 bg-slate-50/50 border-t border-slate-100">
              <div className="py-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="relative w-9 h-5 bg-slate-200 peer-checked:bg-propsight-500 rounded-full transition-colors">
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                  <span className="text-sm text-slate-900 font-medium">Activer OpenClaw</span>
                </label>
              </div>
              <Rule icon={<Bell size={14} />} label="Notifier l'agent / équipe" desc="Slack · email · in-app" defaultOn compact />
              <Rule icon={<MessageCircle size={14} />} label="Préparer un message WhatsApp" desc="Lien wa.me avec variables pré-remplies" defaultOn compact />
              <Rule icon={<Users size={14} />} label="Générer un brief RDV automatique" desc="Visible dans la fiche lead" defaultOn compact />
              <Rule icon={<Zap size={14} />} label="Enrichir le lead avec insights pack" desc="Marché, tension, comparables" defaultOn compact />
              <Rule icon={<TrendingUp size={14} />} label="Proposer une relance automatique" desc="Si pas de réponse sous X h" defaultOn compact />
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden h-fit">
        <div className="px-5 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Dernières automatisations</h3>
          <p className="text-xs text-slate-500 mt-0.5">10 derniers événements exécutés.</p>
        </div>
        <div className="px-5 py-4">
          <ActivityTimeline entries={AUTOMATION_TIMELINE} variant="timeline" />
        </div>
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
          <a href="#" className="text-xs text-propsight-600 hover:text-propsight-700 font-medium">
            Voir tout l'historique →
          </a>
        </div>
      </div>
    </div>
  );
};

const Rule: React.FC<{
  icon: React.ReactNode;
  label: string;
  desc: string;
  defaultOn?: boolean;
  compact?: boolean;
}> = ({ icon, label, desc, defaultOn, compact }) => (
  <div className={`flex items-center justify-between gap-3 ${compact ? 'px-0 py-2' : 'px-5 py-3'}`}>
    <div className="flex items-center gap-2.5 min-w-0">
      <div className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} rounded-md bg-propsight-50 text-propsight-600 flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm text-slate-900 truncate">{label}</div>
        <div className="text-xs text-slate-500 truncate">{desc}</div>
      </div>
    </div>
    <label className="flex items-center cursor-pointer flex-shrink-0">
      <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
      <div className="relative w-9 h-5 bg-slate-200 peer-checked:bg-propsight-500 rounded-full transition-colors">
        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
      </div>
    </label>
  </div>
);

const SelectRow: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}> = ({ label, value, onChange, options }) => (
  <div className="flex items-center justify-between gap-3 px-5 py-2.5">
    <span className="text-sm text-slate-700">{label}</span>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="text-sm border border-slate-200 rounded px-2.5 py-1 focus:border-propsight-400 focus:ring-1 focus:ring-propsight-200 focus:outline-none bg-white"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export default AutomationTab;
