import React, { useState, useMemo, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, MapPin, TrendingUp, Users, Wallet } from 'lucide-react';
import { ProjetInvestisseur, StrategyType, PropertyType, OccupancyMode, FiscalRegime } from '../../types';
import { computeMensualite, formatPrice, formatPct } from '../../utils/finances';
import { labelStrategy } from '../../utils/persona';
import { MOCK_VILLES } from '../../_mocks/villes';

interface Props {
  onClose: () => void;
  onCreate: (projet: ProjetInvestisseur) => void;
}

type StepId = 'projet' | 'acquisition' | 'finance' | 'revenus' | 'fiscalite' | 'resultats';

const STEPS: { id: StepId; label: string; sublabel: string }[] = [
  { id: 'projet', label: 'Projet', sublabel: 'Informations clés' },
  { id: 'acquisition', label: 'Acquisition', sublabel: 'Prix et frais' },
  { id: 'finance', label: 'Finance', sublabel: 'Financement' },
  { id: 'revenus', label: 'Revenus & charges', sublabel: 'Loyers et dépenses' },
  { id: 'fiscalite', label: 'Fiscalité', sublabel: 'Régime fiscal' },
  { id: 'resultats', label: 'Résultats', sublabel: 'Synthèse' },
];

const WizardCreationProjet: React.FC<Props> = ({ onClose, onCreate }) => {
  const [step, setStep] = useState<StepId>('projet');
  const [form, setForm] = useState({
    name: '',
    ville: 'Paris 15e',
    strategy: 'rendement' as StrategyType,
    budget: 600000,
    apport: 120000,
    surface: 50,
    rendementCible: 5,
    cashflowCible: 300,
    regime: 'lmnp_reel' as FiscalRegime,
    propertyType: 't2' as PropertyType,
    occupancyMode: 'meuble' as OccupancyMode,
    duree: 10,
    tmi: 30,
    vacance: 5,
    travaux: 40000,
    taux: 3.6,
    dureeCredit: 20,
    loyer: 1850,
    chargesNonRecup: 60,
    taxeFonciere: 1200,
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const stepIdx = STEPS.findIndex(s => s.id === step);

  // Simulation live
  const sim = useMemo(() => {
    const emprunte = form.budget - form.apport + form.budget * 0.075;
    const mens = computeMensualite(emprunte, form.taux, form.dureeCredit);
    const loyerAn = form.loyer * 12 * (1 - form.vacance / 100);
    const charges = (form.chargesNonRecup * 12) + form.taxeFonciere;
    const cashflowBI = loyerAn - charges - mens * 12;
    const rendement = (loyerAn - charges) / form.budget * 100;
    const cashflowApres = cashflowBI * 0.85;
    const tri = rendement + 2;
    const patrimoine10 = form.budget * Math.pow(1.02, 10);
    return {
      mensualite: Math.round(mens),
      cashflow_mens: Math.round(cashflowApres / 12),
      rendement: Number(rendement.toFixed(1)),
      tri: Number(tri.toFixed(1)),
      patrimoine10: Math.round(patrimoine10),
      revenuRequis: Math.round(form.loyer * 3),
    };
  }, [form]);

  const update = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));

  const canNext = stepIdx < STEPS.length - 1;
  const canPrev = stepIdx > 0;

  const handleCreate = () => {
    const p: ProjetInvestisseur = {
      project_id: `proj_new_${Date.now()}`,
      name: form.name || `Projet ${form.ville} — ${labelStrategy(form.strategy)}`,
      owner_user_id: 'user_me',
      porteur_type: 'self',
      target_zones: [form.ville],
      budget_min: Math.round(form.budget * 0.8),
      budget_max: form.budget,
      down_payment_target: form.apport,
      strategy_type: form.strategy,
      yield_target: form.rendementCible,
      cashflow_target: form.cashflowCible,
      holding_period: form.duree,
      preferred_property_types: [form.propertyType],
      occupancy_mode_target: form.occupancyMode,
      works_tolerance: 'legers',
      risk_tolerance: 'equilibre',
      taux_effort_reference: 0.33,
      tmi: form.tmi,
      nombre_parts: 2,
      notes: '',
      status: 'actif',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      nb_opportunites: 0,
      progression_pct: 5,
    };
    console.warn('[WizardCreationProjet] Projet créé', p);
    onCreate(p);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-[60] flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-[1100px] max-h-[min(calc(100vh-48px),860px)] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-base font-bold text-slate-900">Nouveau projet investisseur</h2>
              <p className="text-xs text-slate-500">Créez votre projet vierge et simulez sa performance</p>
            </div>
            <button type="button" onClick={onClose} className="p-1 rounded hover:bg-slate-100">
              <X size={16} />
            </button>
          </div>

          {/* Stepper */}
          <div className="px-4 pt-3 pb-2 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-1">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                  <button
                    type="button"
                    onClick={() => setStep(s.id)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs ${
                      s.id === step ? 'bg-propsight-50 text-propsight-700' : i < stepIdx ? 'text-slate-500 hover:bg-slate-50' : 'text-slate-400'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${s.id === step ? 'bg-propsight-600 text-white' : i < stepIdx ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {i + 1}
                    </span>
                    <span>
                      <div className="font-medium">{s.label}</div>
                      <div className="text-[10px] opacity-70">{s.sublabel}</div>
                    </span>
                  </button>
                  {i < STEPS.length - 1 && <span className="text-slate-300 mx-1">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Body split 65/35 */}
          <div className="grid grid-cols-[1fr_320px] flex-1 overflow-hidden">
            <div className="p-5 space-y-4 overflow-y-auto">
              {step === 'projet' && <StepProjet form={form} update={update} />}
              {step === 'acquisition' && <StepAcquisition form={form} update={update} />}
              {step === 'finance' && <StepFinance form={form} update={update} />}
              {step === 'revenus' && <StepRevenus form={form} update={update} />}
              {step === 'fiscalite' && <StepFiscalite form={form} update={update} />}
              {step === 'resultats' && <StepResultats form={form} sim={sim} />}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => canPrev && setStep(STEPS[stepIdx - 1].id)}
                  disabled={!canPrev}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 disabled:opacity-40"
                >
                  <ChevronLeft size={12} />
                  Précédent
                </button>
                {canNext ? (
                  <button
                    type="button"
                    onClick={() => setStep(STEPS[stepIdx + 1].id)}
                    className="inline-flex items-center gap-1 rounded-md bg-propsight-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-propsight-700"
                  >
                    Suivant
                    <ChevronRight size={12} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-emerald-700"
                  >
                    Créer le projet
                  </button>
                )}
              </div>
            </div>

            {/* Right panel sticky */}
            <div className="border-l border-slate-200 bg-slate-50/50 p-4 space-y-3 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={13} className="text-propsight-600" />
                <h3 className="text-xs font-semibold text-slate-900">Simulation en temps réel</h3>
              </div>

              <LiveStat icon={<Wallet size={12} />} label="Mensualité crédit" value={`${sim.mensualite.toLocaleString('fr-FR')} €/mois`} />
              <LiveStat label="Cash-flow après impôt" value={`${sim.cashflow_mens >= 0 ? '+' : ''}${sim.cashflow_mens} €/mois`} positive={sim.cashflow_mens >= 0} />
              <LiveStat label="Rendement net-net" value={formatPct(sim.rendement)} />
              <LiveStat label="TRI à 10 ans" value={formatPct(sim.tri)} />
              <LiveStat label="Patrimoine à 10 ans" value={formatPrice(sim.patrimoine10)} />
              <LiveStat icon={<Users size={12} />} label="Profil locataire cible" value={`CSP+ / ${sim.revenuRequis} € rev.`} />

              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="flex items-center gap-1.5 mb-2 text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                  <MapPin size={10} />
                  Zones & contexte
                </div>
                <div className="rounded-md bg-white border border-slate-200 p-2.5">
                  <div className="text-xs font-medium text-slate-900">{form.ville}</div>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-slate-600">Tension</span>
                    <span className="inline-flex items-center rounded px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium">Forte</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-slate-600">Évolution prix 1 an</span>
                    <span className="text-emerald-700">+2,1%</span>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">Zones similaires suggérées</div>
                  {MOCK_VILLES.slice(1, 4).map(v => (
                    <div key={v.id} className="flex items-center justify-between text-[11px] rounded px-2 py-1 hover:bg-white cursor-pointer">
                      <span className="text-slate-700">{v.nom}</span>
                      <span className="text-slate-500">Rdt {v.rendement_median}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-md bg-propsight-50 border border-propsight-100 p-2.5">
                <div className="text-[10px] font-semibold text-propsight-700">Conseil Propsight</div>
                <p className="text-[11px] text-slate-700 mt-1">
                  Un rendement net-net supérieur à 4% dans cette zone est considéré comme bon.
                </p>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

// ============ STEPS ============

const Field: React.FC<{ label: string; children: React.ReactNode; hint?: string }> = ({ label, children, hint }) => (
  <div>
    <label className="block text-[11px] font-medium text-slate-700 mb-1">{label}</label>
    {children}
    {hint && <div className="text-[10px] text-slate-500 mt-0.5">{hint}</div>}
  </div>
);

const Inp: React.FC<{ value: string | number; onChange: (v: any) => void; type?: string; placeholder?: string; suffix?: string }> = ({ value, onChange, type = 'text', placeholder, suffix }) => (
  <div className="relative">
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-propsight-500"
    />
    {suffix && <span className="absolute right-2.5 top-1.5 text-xs text-slate-400">{suffix}</span>}
  </div>
);

const Sel: React.FC<{ value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }> = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-propsight-500 bg-white">
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const StepProjet: React.FC<any> = ({ form, update }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-900 mb-3">Informations générales</h3>
    <div className="grid grid-cols-2 gap-3">
      <Field label="Nom du projet">
        <Inp value={form.name} onChange={v => update('name', v)} placeholder="Ex: Paris 15e — Rendement locatif" />
      </Field>
      <Field label="Ville / Zone">
        <Inp value={form.ville} onChange={v => update('ville', v)} />
      </Field>
      <Field label="Stratégie d'investissement">
        <Sel value={form.strategy} onChange={v => update('strategy', v)} options={[
          { value: 'rendement', label: 'Rendement locatif' },
          { value: 'cashflow', label: 'Cash-flow positif' },
          { value: 'patrimonial', label: 'Patrimonial' },
          { value: 'travaux', label: 'Travaux / décote' },
          { value: 'colocation', label: 'Colocation' },
          { value: 'meuble', label: 'Meublé' },
        ]} />
      </Field>
      <Field label="Budget total (acquisition + travaux)" hint="Frais inclus">
        <Inp type="number" value={form.budget} onChange={v => update('budget', v)} suffix="€" />
      </Field>
      <Field label="Apport personnel" hint={`${((form.apport / form.budget) * 100).toFixed(0)}% du budget`}>
        <Inp type="number" value={form.apport} onChange={v => update('apport', v)} suffix="€" />
      </Field>
      <Field label="Type de bien">
        <Sel value={form.propertyType} onChange={v => update('propertyType', v)} options={[
          { value: 'studio', label: 'Studio' },
          { value: 't1', label: 'T1' },
          { value: 't2', label: 'T2' },
          { value: 't3', label: 'T3' },
          { value: 't4_plus', label: 'T4+' },
          { value: 'maison', label: 'Maison' },
          { value: 'immeuble', label: 'Immeuble' },
        ]} />
      </Field>
      <Field label="Surface cible">
        <Inp type="number" value={form.surface} onChange={v => update('surface', v)} suffix="m²" />
      </Field>
      <Field label="Rendement cible">
        <Inp type="number" value={form.rendementCible} onChange={v => update('rendementCible', v)} suffix="%" />
      </Field>
    </div>
  </div>
);

const StepAcquisition: React.FC<any> = ({ form, update }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-900 mb-3">Acquisition</h3>
    <div className="grid grid-cols-2 gap-3">
      <Field label="Budget d'acquisition">
        <Inp type="number" value={form.budget} onChange={v => update('budget', v)} suffix="€" />
      </Field>
      <Field label="Apport personnel">
        <Inp type="number" value={form.apport} onChange={v => update('apport', v)} suffix="€" />
      </Field>
      <Field label="Frais de notaire" hint="~7,5% du prix">
        <Inp value={`${Math.round(form.budget * 0.075).toLocaleString('fr-FR')} €`} onChange={() => {}} />
      </Field>
      <Field label="Travaux additionnels">
        <Inp type="number" value={form.travaux} onChange={v => update('travaux', v)} suffix="€" />
      </Field>
    </div>
  </div>
);

const StepFinance: React.FC<any> = ({ form, update }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-900 mb-3">Financement</h3>
    <div className="grid grid-cols-2 gap-3">
      <Field label="Taux du crédit">
        <Inp type="number" value={form.taux} onChange={v => update('taux', v)} suffix="%" />
      </Field>
      <Field label="Durée du prêt">
        <Inp type="number" value={form.dureeCredit} onChange={v => update('dureeCredit', v)} suffix="ans" />
      </Field>
      <Field label="Montant emprunté" hint="Calculé automatiquement">
        <Inp value={`${(form.budget + form.budget * 0.075 - form.apport).toLocaleString('fr-FR')} €`} onChange={() => {}} />
      </Field>
      <Field label="Assurance emprunteur">
        <Inp type="number" value={0.36} onChange={() => {}} suffix="%" />
      </Field>
    </div>
  </div>
);

const StepRevenus: React.FC<any> = ({ form, update }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-900 mb-3">Revenus & charges</h3>
    <div className="grid grid-cols-2 gap-3">
      <Field label="Loyer mensuel HC">
        <Inp type="number" value={form.loyer} onChange={v => update('loyer', v)} suffix="€/mois" />
      </Field>
      <Field label="Charges non récupérables">
        <Inp type="number" value={form.chargesNonRecup} onChange={v => update('chargesNonRecup', v)} suffix="€/mois" />
      </Field>
      <Field label="Taxe foncière annuelle">
        <Inp type="number" value={form.taxeFonciere} onChange={v => update('taxeFonciere', v)} suffix="€/an" />
      </Field>
      <Field label="Vacance locative estimée">
        <Inp type="number" value={form.vacance} onChange={v => update('vacance', v)} suffix="%" />
      </Field>
    </div>
  </div>
);

const StepFiscalite: React.FC<any> = ({ form, update }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-900 mb-3">Régime fiscal envisagé</h3>
    <div className="grid grid-cols-2 gap-3">
      <Field label="Régime fiscal">
        <Sel value={form.regime} onChange={v => update('regime', v)} options={[
          { value: 'micro_foncier', label: 'Micro-foncier (nu)' },
          { value: 'reel_foncier', label: 'Réel foncier (nu)' },
          { value: 'lmnp_micro', label: 'LMNP micro-BIC' },
          { value: 'lmnp_reel', label: 'LMNP réel (amortissement)' },
        ]} />
      </Field>
      <Field label="TMI">
        <Inp type="number" value={form.tmi} onChange={v => update('tmi', v)} suffix="%" />
      </Field>
      <Field label="Mode d'exploitation">
        <Sel value={form.occupancyMode} onChange={v => update('occupancyMode', v)} options={[
          { value: 'nu', label: 'Location nue' },
          { value: 'meuble', label: 'Location meublée' },
          { value: 'colocation', label: 'Colocation' },
          { value: 'courte_duree', label: 'Courte durée' },
        ]} />
      </Field>
      <Field label="Durée de détention envisagée">
        <Inp type="number" value={form.duree} onChange={v => update('duree', v)} suffix="ans" />
      </Field>
    </div>
  </div>
);

const StepResultats: React.FC<any> = ({ form, sim }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-900 mb-3">Synthèse du projet</h3>
    <div className="rounded-md border border-emerald-200 bg-emerald-50/40 p-4 mb-3">
      <div className="text-sm font-semibold text-emerald-800">Projet cohérent avec votre stratégie</div>
      <p className="text-xs text-slate-700 mt-1">
        Sur la base de vos hypothèses, ce projet atteint un rendement net-net de {sim.rendement}% et un cash-flow de {sim.cashflow_mens >= 0 ? '+' : ''}{sim.cashflow_mens}€/mois.
      </p>
    </div>
    <div className="grid grid-cols-4 gap-3">
      <StatCard label="Mensualité" value={`${sim.mensualite.toLocaleString('fr-FR')} €`} />
      <StatCard label="Cash-flow" value={`${sim.cashflow_mens >= 0 ? '+' : ''}${sim.cashflow_mens} €`} />
      <StatCard label="Rendement" value={formatPct(sim.rendement)} />
      <StatCard label="TRI 10 ans" value={formatPct(sim.tri)} />
    </div>
    <p className="text-[10px] text-slate-400 italic mt-3">Les résultats présentés sont des estimations et ne constituent pas un conseil en investissement.</p>
  </div>
);

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md border border-slate-200 bg-white p-2.5">
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="text-sm font-bold text-slate-900">{value}</div>
  </div>
);

const LiveStat: React.FC<{ icon?: React.ReactNode; label: string; value: string; positive?: boolean }> = ({ icon, label, value, positive }) => (
  <div className="rounded-md bg-white border border-slate-200 p-2.5">
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-500">
      {icon}
      {label}
    </div>
    <div className={`text-sm font-semibold tabular-nums mt-0.5 ${positive === true ? 'text-emerald-600' : positive === false ? 'text-rose-600' : 'text-slate-900'}`}>
      {value}
    </div>
  </div>
);

export default WizardCreationProjet;
