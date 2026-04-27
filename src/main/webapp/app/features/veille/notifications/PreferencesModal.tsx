import React, { useState } from 'react';
import { X, Check, Mail, Bell, Volume2, Moon } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/shared/primitives';
import { useToast } from '../components/shared/Toast';

interface Props {
  onClose: () => void;
}

const PreferencesModal: React.FC<Props> = ({ onClose }) => {
  const [emailFreq, setEmailFreq] = useState<'instant' | 'daily' | 'weekly'>('daily');
  const [prioThreshold, setPrioThreshold] = useState<'info' | 'moyenne' | 'haute'>('moyenne');
  const [inApp, setInApp] = useState(true);
  const [email, setEmail] = useState(true);
  const [aggregate, setAggregate] = useState(true);
  const [throttle, setThrottle] = useState(true);
  const [silenceStart, setSilenceStart] = useState('20:00');
  const [silenceEnd, setSilenceEnd] = useState('08:00');
  const [bellCounter, setBellCounter] = useState(true);
  const [bellPopover, setBellPopover] = useState(true);
  const toast = useToast();

  const save = () => {
    // eslint-disable-next-line no-console
    console.log('[Veille] Prefs notif', {
      emailFreq,
      prioThreshold,
      inApp,
      email,
      aggregate,
      throttle,
      silenceStart,
      silenceEnd,
      bellCounter,
      bellPopover,
    });
    toast.push({ message: 'Préférences enregistrées', kind: 'success' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-[620px] max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-[15px] font-semibold text-slate-900">Préférences notifications</h2>
          <button onClick={onClose} className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-100">
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <Section title="Canaux par défaut" icon={<Bell size={12} />}>
            <CheckRow checked={inApp} onChange={() => setInApp(!inApp)} label="In-app (toujours actif)" locked />
            <CheckRow checked={email} onChange={() => setEmail(!email)} label="Email" />
          </Section>

          <Section title="Fréquence email" icon={<Mail size={12} />}>
            <RadioGroup
              value={emailFreq}
              onChange={v => setEmailFreq(v as 'instant' | 'daily' | 'weekly')}
              options={[
                { value: 'instant', label: 'Instantané' },
                { value: 'daily', label: 'Digest quotidien 9h' },
                { value: 'weekly', label: 'Digest hebdo lundi 9h' },
              ]}
            />
          </Section>

          <Section title="Seuil priorité pour email">
            <RadioGroup
              value={prioThreshold}
              onChange={v => setPrioThreshold(v as 'info' | 'moyenne' | 'haute')}
              options={[
                { value: 'info', label: 'Info et plus' },
                { value: 'moyenne', label: 'Moyenne et plus' },
                { value: 'haute', label: 'Haute uniquement' },
              ]}
            />
          </Section>

          <Section title="Règles anti-bruit" icon={<Volume2 size={12} />}>
            <CheckRow
              checked={aggregate}
              onChange={() => setAggregate(!aggregate)}
              label="Agréger événements similaires (≥ 3 en 1h → 1 notif)"
            />
            <CheckRow
              checked={throttle}
              onChange={() => setThrottle(!throttle)}
              label="Throttler alertes immédiates (max 1 notif/h/alerte)"
            />
          </Section>

          <Section title="Heures de silence" icon={<Moon size={12} />}>
            <div className="flex items-center gap-2 text-[12px] text-slate-700">
              <span>Ne pas envoyer d&apos;email entre</span>
              <input
                type="time"
                value={silenceStart}
                onChange={e => setSilenceStart(e.target.value)}
                className="h-8 px-2 rounded border border-slate-200 text-[12px]"
              />
              <span>et</span>
              <input
                type="time"
                value={silenceEnd}
                onChange={e => setSilenceEnd(e.target.value)}
                className="h-8 px-2 rounded border border-slate-200 text-[12px]"
              />
            </div>
          </Section>

          <Section title="Bell icon">
            <CheckRow checked={bellCounter} onChange={() => setBellCounter(!bellCounter)} label="Afficher compteur rouge" />
            <CheckRow checked={bellPopover} onChange={() => setBellPopover(!bellPopover)} label="Afficher popover au clic" />
          </Section>
        </div>
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 flex-shrink-0">
          <SecondaryButton onClick={onClose}>Annuler</SecondaryButton>
          <PrimaryButton onClick={save}>Enregistrer</PrimaryButton>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-2">
      {icon && <span className="text-slate-500">{icon}</span>}
      <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">{title}</span>
    </div>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const CheckRow: React.FC<{ checked: boolean; onChange: () => void; label: string; locked?: boolean }> = ({
  checked,
  onChange,
  label,
  locked,
}) => (
  <label className={`flex items-center gap-2 ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
    <span
      className={`h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 ${
        checked ? 'bg-propsight-600 border-propsight-600 text-white' : 'border-slate-300 bg-white'
      }`}
      onClick={e => {
        if (locked) return;
        e.preventDefault();
        onChange();
      }}
    >
      {checked && <Check size={10} />}
    </span>
    <span className="text-[12px] text-slate-700">{label}</span>
  </label>
);

const RadioGroup: React.FC<{ value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }> = ({
  value,
  onChange,
  options,
}) => (
  <div className="flex flex-col gap-1.5">
    {options.map(o => (
      <label key={o.value} className="flex items-center gap-2 cursor-pointer">
        <span
          className={`h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
            value === o.value ? 'border-propsight-600' : 'border-slate-300'
          }`}
          onClick={e => {
            e.preventDefault();
            onChange(o.value);
          }}
        >
          {value === o.value && <span className="h-2 w-2 rounded-full bg-propsight-600" />}
        </span>
        <span className="text-[12px] text-slate-700">{o.label}</span>
      </label>
    ))}
  </div>
);

export default PreferencesModal;
