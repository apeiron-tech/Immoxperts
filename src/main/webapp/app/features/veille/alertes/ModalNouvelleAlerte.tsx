import React, { useState } from 'react';
import { X, Home, MapPin, Search, Building2, Check, ArrowRight, ArrowLeft, Mail, Bell } from 'lucide-react';
import { Alerte, AlerteChannel, AlerteDomain, AlerteFrequency, AlertePriority, AlerteTargetType } from '../types';
import { PrimaryButton, SecondaryButton, GhostButton, DomainBadge } from '../components/shared/primitives';

interface Props {
  onClose: () => void;
  onCreate: (a: Alerte) => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

const ModalNouvelleAlerte: React.FC<Props> = ({ onClose, onCreate }) => {
  const [step, setStep] = useState<Step>(1);
  const [target, setTarget] = useState<AlerteTargetType>('zone');
  const [perimeter, setPerimeter] = useState('Paris 15e');
  const [domain, setDomain] = useState<AlerteDomain>('prix');
  const [priceThreshold, setPriceThreshold] = useState(500000);
  const [priceDropPct, setPriceDropPct] = useState(3);
  const [channels, setChannels] = useState<AlerteChannel[]>(['in_app', 'email']);
  const [frequency, setFrequency] = useState<AlerteFrequency>('immediate');
  const [priority, setPriority] = useState<AlertePriority>('moyenne');
  const [name, setName] = useState('');
  const [domainChecks, setDomainChecks] = useState<Record<string, boolean>>({
    price_drop: true,
    price_below: true,
    new_listing: true,
    republish: true,
    dpe_fg: true,
    pc_depose: true,
  });

  const goNext = () => setStep(s => (Math.min(5, s + 1) as Step));
  const goPrev = () => setStep(s => (Math.max(1, s - 1) as Step));

  const toggleChannel = (c: AlerteChannel) =>
    setChannels(prev => (prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]));

  const summary = () => {
    const freqLabel = frequency === 'immediate' ? 'immédiatement' : frequency === 'daily' ? 'chaque jour' : 'chaque semaine';
    if (domain === 'prix') {
      return `Propsight vous notifiera ${freqLabel} lorsqu'un bien ${perimeter ? `à ${perimeter}` : ''} passera sous ${priceThreshold.toLocaleString('fr-FR')} € ou baissera de plus de ${priceDropPct} %, avec une priorité ${priority}.`;
    }
    if (domain === 'dpe') return `Propsight vous notifiera ${freqLabel} lors de la détection d'un DPE F ou G à ${perimeter}.`;
    if (domain === 'urbanisme') return `Propsight vous notifiera ${freqLabel} lors de dépôts PC / DP / PA à ${perimeter}.`;
    if (domain === 'marche') return `Propsight vous notifiera ${freqLabel} sur les évolutions marché à ${perimeter}.`;
    if (domain === 'concurrence') return `Propsight vous notifiera ${freqLabel} des annonces concurrentes à ${perimeter}.`;
    return `Propsight vous notifiera ${freqLabel} des nouvelles annonces à ${perimeter}.`;
  };

  const autoName = `${domain === 'prix' ? `Alerte prix ${perimeter}` : `${domain.toUpperCase()} · ${perimeter}`}`;

  const handleCreate = () => {
    const finalName = name.trim() || autoName;
    const now = new Date().toISOString();
    const alerte: Alerte = {
      id: 'al_' + Math.random().toString(36).slice(2, 9),
      created_by: 'user_001',
      assigned_to: 'user_001',
      name: finalName,
      domain,
      target_type: target,
      target_id: perimeter.toLowerCase().replace(/\s+/g, '_'),
      target_label: perimeter,
      conditions:
        domain === 'prix'
          ? [
              { field: 'prix', operator: 'less_than', value: priceThreshold, label: `prix < ${priceThreshold.toLocaleString('fr-FR')} €` },
              { field: 'prix', operator: 'decreased_by', value: priceDropPct, label: `baisse ≥ ${priceDropPct} %` },
            ]
          : [{ field: domain, operator: 'changed', value: null, label: 'condition personnalisée' }],
      frequency,
      channels,
      priority,
      status: 'active',
      triggers_count_7d: 0,
      triggers_count_30d: 0,
      treated_rate_30d: 0,
      source_module: 'veille',
      health_status: 'healthy',
      created_at: now,
      updated_at: now,
    };
    // eslint-disable-next-line no-console
    console.log('[Veille] Alerte créée', alerte);
    onCreate(alerte);
  };

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-slate-900/40 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-[880px] max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-[15px] font-semibold text-slate-900">Nouvelle alerte</h2>
              <p className="text-[11.5px] text-slate-500 mt-0.5">Étape {step} sur 5</p>
            </div>
            <button
              onClick={onClose}
              className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-100 text-slate-500"
            >
              <X size={15} />
            </button>
          </div>

          {/* Progress */}
          <div className="px-5 pt-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} className="flex-1 flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${
                      n < step
                        ? 'bg-propsight-600 text-white'
                        : n === step
                          ? 'bg-propsight-600 text-white ring-4 ring-propsight-100'
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {n < step ? <Check size={13} /> : n}
                  </div>
                  {n < 5 && <div className={`h-0.5 flex-1 ${n < step ? 'bg-propsight-600' : 'bg-slate-200'}`} />}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {['Cible', 'Périmètre', 'Condition', 'Notification', 'Récap'].map((l, i) => (
                <div
                  key={l}
                  className={`text-[10px] text-center ${i + 1 === step ? 'text-propsight-700 font-semibold' : 'text-slate-500'}`}
                >
                  {l}
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {step === 1 && <StepTarget target={target} onChange={setTarget} />}
            {step === 2 && <StepPerimeter target={target} value={perimeter} onChange={setPerimeter} />}
            {step === 3 && (
              <StepConditions
                domain={domain}
                onDomainChange={setDomain}
                priceThreshold={priceThreshold}
                onPriceThresholdChange={setPriceThreshold}
                priceDropPct={priceDropPct}
                onPriceDropPctChange={setPriceDropPct}
                checks={domainChecks}
                onChecksChange={setDomainChecks}
              />
            )}
            {step === 4 && (
              <StepNotification
                channels={channels}
                onToggleChannel={toggleChannel}
                frequency={frequency}
                onFrequencyChange={setFrequency}
                priority={priority}
                onPriorityChange={setPriority}
              />
            )}
            {step === 5 && <StepRecap summary={summary()} name={name} onNameChange={setName} autoName={autoName} />}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
            {step > 1 ? (
              <SecondaryButton onClick={goPrev}>
                <ArrowLeft size={12} />
                Retour
              </SecondaryButton>
            ) : (
              <GhostButton onClick={onClose}>Annuler</GhostButton>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Étape {step}/5</span>
              {step < 5 ? (
                <PrimaryButton onClick={goNext}>
                  Continuer
                  <ArrowRight size={12} />
                </PrimaryButton>
              ) : (
                <PrimaryButton onClick={handleCreate}>
                  <Check size={13} />
                  Créer l&apos;alerte
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* === STEPS === */

const TARGET_OPTIONS: { value: AlerteTargetType; icon: React.ReactNode; title: string; desc: string }[] = [
  { value: 'bien', icon: <Home size={18} />, title: 'Un bien', desc: 'Un bien précis de votre portefeuille ou suivi.' },
  { value: 'zone', icon: <MapPin size={18} />, title: 'Une zone', desc: 'Une commune, un quartier ou une zone dessinée.' },
  { value: 'recherche', icon: <Search size={18} />, title: 'Une recherche', desc: 'Une recherche annonces sauvegardée.' },
  { value: 'agence', icon: <Building2 size={18} />, title: 'Une agence', desc: 'Une agence concurrente à suivre.' },
];

const StepTarget: React.FC<{ target: AlerteTargetType; onChange: (t: AlerteTargetType) => void }> = ({
  target,
  onChange,
}) => (
  <div>
    <h3 className="text-[14px] font-semibold text-slate-900 mb-1">Que voulez-vous surveiller ?</h3>
    <p className="text-[12px] text-slate-500 mb-4">Choisissez le type d&apos;objet à surveiller.</p>
    <div className="grid grid-cols-4 gap-3">
      {TARGET_OPTIONS.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-md border-2 p-3 text-left transition-colors ${
            target === o.value
              ? 'border-propsight-500 bg-propsight-50/60'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div
            className={`inline-flex items-center justify-center h-8 w-8 rounded-md mb-2 ${
              target === o.value ? 'bg-propsight-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {o.icon}
          </div>
          <div className="text-[12.5px] font-semibold text-slate-900">{o.title}</div>
          <p className="text-[10.5px] text-slate-500 mt-1 leading-snug">{o.desc}</p>
        </button>
      ))}
    </div>
  </div>
);

const StepPerimeter: React.FC<{ target: AlerteTargetType; value: string; onChange: (v: string) => void }> = ({
  target,
  value,
  onChange,
}) => {
  const suggestions =
    target === 'zone'
      ? ['Paris 15e', 'Paris 16e', 'Boulogne-Billancourt', 'Lyon 3e', 'Marseille 2e']
      : target === 'bien'
        ? ['Appartement T2 · Paris 15e', 'Studio 22m² · Paris 14e', 'Maison · Boulogne']
        : target === 'recherche'
          ? ['Paris 15e · 2-3 pièces · < 600k', 'Recherche investisseur · Paris 11e']
          : ['Agence Métropole', 'Orpi Convention', 'Century 21 Grenelle'];
  return (
    <div>
      <h3 className="text-[14px] font-semibold text-slate-900 mb-1">Périmètre</h3>
      <p className="text-[12px] text-slate-500 mb-4">
        {target === 'zone'
          ? 'Sélectionnez une ville, un quartier ou dessinez une zone.'
          : target === 'bien'
            ? 'Cherchez dans votre portefeuille ou vos biens suivis.'
            : target === 'recherche'
              ? 'Choisissez une recherche sauvegardée.'
              : 'Cherchez une agence (annuaire SIRENE).'}
      </p>
      <div className="relative max-w-[560px]">
        <Search size={13} className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 bg-white text-[13px] focus:outline-none focus:border-propsight-300 focus:ring-1 focus:ring-propsight-200"
          placeholder="Saisir un nom…"
        />
      </div>
      <div className="mt-4">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Suggestions</div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => onChange(s)}
              className={`h-8 px-3 rounded-md border text-[11.5px] transition-colors ${
                value === s
                  ? 'border-propsight-300 bg-propsight-50 text-propsight-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const DOMAIN_OPTIONS: { value: AlerteDomain; label: string }[] = [
  { value: 'prix', label: 'Prix' },
  { value: 'annonce', label: 'Annonce' },
  { value: 'dpe', label: 'DPE' },
  { value: 'urbanisme', label: 'Urbanisme' },
  { value: 'marche', label: 'Marché' },
  { value: 'concurrence', label: 'Concurrence' },
];

const StepConditions: React.FC<{
  domain: AlerteDomain;
  onDomainChange: (d: AlerteDomain) => void;
  priceThreshold: number;
  onPriceThresholdChange: (n: number) => void;
  priceDropPct: number;
  onPriceDropPctChange: (n: number) => void;
  checks: Record<string, boolean>;
  onChecksChange: (c: Record<string, boolean>) => void;
}> = ({ domain, onDomainChange, priceThreshold, onPriceThresholdChange, priceDropPct, onPriceDropPctChange, checks, onChecksChange }) => {
  const toggle = (k: string) => onChecksChange({ ...checks, [k]: !checks[k] });
  return (
    <div>
      <h3 className="text-[14px] font-semibold text-slate-900 mb-1">Conditions</h3>
      <p className="text-[12px] text-slate-500 mb-4">Définissez les critères qui déclencheront cette alerte.</p>
      <div className="mb-4">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Domaine</div>
        <div className="flex flex-wrap gap-2">
          {DOMAIN_OPTIONS.map(d => (
            <button
              key={d.value}
              onClick={() => onDomainChange(d.value)}
              className={`h-8 px-3 rounded-md border text-[11.5px] inline-flex items-center gap-1.5 transition-colors ${
                domain === d.value
                  ? 'border-propsight-300 bg-propsight-50 text-propsight-700 font-medium'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <DomainBadge domain={d.value} size="sm" />
              {d.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-slate-50 rounded-md border border-slate-200 p-4 space-y-3">
        {domain === 'prix' && (
          <>
            <Row>
              <label className="text-[12px] text-slate-700 flex-1">Prix passe sous</label>
              <NumberInput value={priceThreshold} onChange={onPriceThresholdChange} step={10000} suffix="€" />
            </Row>
            <Row>
              <label className="text-[12px] text-slate-700 flex-1">Prix baisse de plus de</label>
              <NumberInput value={priceDropPct} onChange={onPriceDropPctChange} step={1} suffix="%" max={100} />
            </Row>
          </>
        )}
        {domain === 'annonce' && (
          <>
            <Check2 id="new_listing" checked={!!checks.new_listing} onChange={() => toggle('new_listing')} label="Nouvelle annonce détectée" />
            <Check2 id="republish" checked={!!checks.republish} onChange={() => toggle('republish')} label="Remise en ligne" />
            <Check2 id="old_listing" checked={!!checks.old_listing} onChange={() => toggle('old_listing')} label="Annonce active depuis plus de 90 jours" />
          </>
        )}
        {domain === 'dpe' && (
          <>
            <Check2 id="dpe_fg" checked={!!checks.dpe_fg} onChange={() => toggle('dpe_fg')} label="Nouveau DPE F/G détecté" />
            <Check2 id="dpe_upgrade" checked={!!checks.dpe_upgrade} onChange={() => toggle('dpe_upgrade')} label="Amélioration DPE détectée" />
          </>
        )}
        {domain === 'urbanisme' && (
          <>
            <Check2 id="pc_depose" checked={!!checks.pc_depose} onChange={() => toggle('pc_depose')} label="PC déposé (permis de construire)" />
            <Check2 id="dp_depose" checked={!!checks.dp_depose} onChange={() => toggle('dp_depose')} label="DP déposée" />
            <Check2 id="pa_depose" checked={!!checks.pa_depose} onChange={() => toggle('pa_depose')} label="PA déposé" />
          </>
        )}
        {domain === 'marche' && (
          <>
            <Row>
              <label className="text-[12px] text-slate-700 flex-1">Stock zone augmente de plus de</label>
              <NumberInput value={15} onChange={() => void 0} suffix="%" step={5} />
            </Row>
            <Row>
              <label className="text-[12px] text-slate-700 flex-1">Délai moyen dépasse</label>
              <NumberInput value={75} onChange={() => void 0} suffix="jours" step={5} />
            </Row>
          </>
        )}
        {domain === 'concurrence' && (
          <>
            <Check2 id="concurrent_listing" checked={!!checks.concurrent_listing} onChange={() => toggle('concurrent_listing')} label="Concurrent publie bien similaire" />
            <Check2 id="price_below" checked={!!checks.price_below} onChange={() => toggle('price_below')} label="Prix concurrent inférieur au mien" />
            <Check2 id="mandat_pression" checked={!!checks.mandat_pression} onChange={() => toggle('mandat_pression')} label="Mandat simple sous pression détecté" />
          </>
        )}
      </div>
    </div>
  );
};

const StepNotification: React.FC<{
  channels: AlerteChannel[];
  onToggleChannel: (c: AlerteChannel) => void;
  frequency: AlerteFrequency;
  onFrequencyChange: (f: AlerteFrequency) => void;
  priority: AlertePriority;
  onPriorityChange: (p: AlertePriority) => void;
}> = ({ channels, onToggleChannel, frequency, onFrequencyChange, priority, onPriorityChange }) => (
  <div className="space-y-4 max-w-[620px]">
    <h3 className="text-[14px] font-semibold text-slate-900 mb-1">Notification</h3>
    <p className="text-[12px] text-slate-500">Définissez comment Propsight doit vous prévenir.</p>

    <div>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Canaux</div>
      <div className="flex gap-2">
        <button
          onClick={() => onToggleChannel('in_app')}
          className={`h-9 px-3 rounded-md border inline-flex items-center gap-2 text-[12px] transition-colors ${
            channels.includes('in_app')
              ? 'border-propsight-300 bg-propsight-50 text-propsight-700'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Bell size={12} />
          Notification in-app
          {channels.includes('in_app') && <Check size={12} />}
        </button>
        <button
          onClick={() => onToggleChannel('email')}
          className={`h-9 px-3 rounded-md border inline-flex items-center gap-2 text-[12px] transition-colors ${
            channels.includes('email')
              ? 'border-propsight-300 bg-propsight-50 text-propsight-700'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Mail size={12} />
          Email
          {channels.includes('email') && <Check size={12} />}
        </button>
      </div>
    </div>

    <div>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Fréquence</div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: 'immediate', label: 'Immédiat' },
          { value: 'daily', label: 'Quotidien · 9h' },
          { value: 'weekly', label: 'Hebdo · lundi 9h' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => onFrequencyChange(f.value as AlerteFrequency)}
            className={`h-10 rounded-md border text-[12px] transition-colors ${
              frequency === f.value
                ? 'border-propsight-300 bg-propsight-50 text-propsight-700 font-medium'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>

    <div>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Priorité</div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: 'info', label: 'Info', cls: 'border-slate-200' },
          { value: 'moyenne', label: 'Moyenne', cls: 'border-amber-200' },
          { value: 'haute', label: 'Haute', cls: 'border-rose-200' },
        ].map(p => (
          <button
            key={p.value}
            onClick={() => onPriorityChange(p.value as AlertePriority)}
            className={`h-10 rounded-md border-2 text-[12px] transition-colors ${
              priority === p.value ? `${p.cls} bg-propsight-50/30 font-medium` : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const StepRecap: React.FC<{ summary: string; name: string; onNameChange: (v: string) => void; autoName: string }> = ({
  summary,
  name,
  onNameChange,
  autoName,
}) => (
  <div className="max-w-[620px]">
    <h3 className="text-[14px] font-semibold text-slate-900 mb-1">Récapitulatif</h3>
    <p className="text-[12px] text-slate-500 mb-4">Dernière étape avant de créer l&apos;alerte.</p>
    <div className="rounded-md bg-propsight-50/60 border border-propsight-200 p-4 mb-4">
      <p className="text-[12.5px] text-slate-700 leading-relaxed">{summary}</p>
    </div>
    <div>
      <label className="text-[11.5px] font-medium text-slate-700 mb-1 block">Nom de l&apos;alerte</label>
      <input
        type="text"
        value={name}
        onChange={e => onNameChange(e.target.value)}
        placeholder={autoName}
        className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[13px] focus:outline-none focus:border-propsight-300 focus:ring-1 focus:ring-propsight-200"
      />
      <p className="text-[10.5px] text-slate-400 mt-1">Si vide, le nom sera : {autoName}</p>
    </div>
  </div>
);

/* Atomes */

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 bg-white p-2.5 rounded-md border border-slate-200">{children}</div>
);

const NumberInput: React.FC<{
  value: number;
  onChange: (v: number) => void;
  step?: number;
  max?: number;
  suffix?: string;
}> = ({ value, onChange, step = 1, max, suffix }) => (
  <div className="inline-flex items-center gap-1">
    <input
      type="number"
      value={value}
      step={step}
      max={max}
      onChange={e => onChange(Number(e.target.value))}
      className="h-8 w-[140px] px-2 rounded border border-slate-200 bg-white text-[12px] text-right focus:outline-none focus:border-propsight-300"
    />
    {suffix && <span className="text-[11px] text-slate-500 w-8">{suffix}</span>}
  </div>
);

const Check2: React.FC<{ id: string; checked: boolean; onChange: () => void; label: string }> = ({
  id,
  checked,
  onChange,
  label,
}) => (
  <label htmlFor={id} className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded border border-slate-200 hover:bg-slate-50">
    <span
      className={`h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 ${
        checked ? 'bg-propsight-600 border-propsight-600 text-white' : 'border-slate-300 bg-white'
      }`}
    >
      {checked && <Check size={10} />}
    </span>
    <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
    <span className="text-[12px] text-slate-700">{label}</span>
  </label>
);

export default ModalNouvelleAlerte;
