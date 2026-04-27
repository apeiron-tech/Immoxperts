import React, { useState } from 'react';
import {
  TrendingUp,
  Building2,
  Coins,
  PieChart,
  MapPin,
  Sofa,
  Grid3x3,
  Users,
  Hammer,
  Target,
  ShieldCheck,
  LineChart,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CalendarPlus,
  Gauge,
  Euro,
  Home,
  AlertTriangle,
} from 'lucide-react';
import PublicShell from './PublicShell';
import { MOCK_INVESTOR_STRATEGY } from '../_mocks/strategy';

const STEPS = [
  { id: 'projet', name: 'Projet' },
  { id: 'budget', name: 'Budget' },
  { id: 'zone', name: 'Zone & bien' },
  { id: 'strategie', name: 'Stratégie' },
  { id: 'contact', name: 'Contact' },
  { id: 'fin', name: 'Terminé' },
];

const InvestorWidget: React.FC = () => {
  const [step, setStep] = useState(1);
  const next = () => setStep(s => Math.min(STEPS.length, s + 1));
  const prev = () => setStep(s => Math.max(1, s - 1));

  return (
    <PublicShell steps={STEPS} currentIndex={step} agencyName="BELLERIVE">
      {step === 1 && <ProjectBudgetScreen onNext={next} onPrev={prev} />}
      {step === 2 && <ProjectBudgetScreen onNext={next} onPrev={prev} />}
      {step === 3 && <ZoneTypeScreen onNext={next} onPrev={prev} />}
      {step === 4 && <StrategyScreen onNext={next} onPrev={prev} />}
      {step === 5 && <StrategyScreen onNext={next} onPrev={prev} />}
      {step === 6 && <ConfirmationScreen />}
    </PublicShell>
  );
};

const ProjectBudgetScreen: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
  const [goal, setGoal] = useState('rendement');
  return (
    <div className="grid md:grid-cols-[1.3fr_1fr] gap-10">
      <div>
        <div className="mb-6">
          <h2 className="text-[22px] font-serif text-slate-900">Décrivez votre projet investisseur</h2>
          <p className="text-sm text-slate-500 mt-2">
            Répondez à quelques questions pour obtenir une stratégie d'investissement sur-mesure.
          </p>
        </div>

        <section>
          <h3 className="text-sm font-medium text-slate-900 mb-3">Quel est votre objectif principal ?</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'rendement', label: 'Rendement', sub: 'Maximiser la performance locative', Icon: TrendingUp },
              { id: 'patrimonial', label: 'Patrimonial', sub: 'Construire et valoriser mon patrimoine', Icon: Building2 },
              { id: 'cashflow', label: 'Cash-flow', sub: 'Générer un revenu mensuel complémentaire', Icon: Coins },
              { id: 'diversification', label: 'Diversification', sub: 'Diversifier mes actifs et réduire les risques', Icon: PieChart },
            ].map(g => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={`px-3 py-4 rounded-lg border text-left flex flex-col gap-2 transition-colors ${
                  goal === g.id ? 'border-propsight-500 bg-propsight-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${goal === g.id ? 'bg-propsight-100 text-propsight-700' : 'bg-slate-100 text-slate-600'}`}>
                  <g.Icon size={15} />
                </div>
                <div>
                  <div className={`text-sm font-semibold ${goal === g.id ? 'text-propsight-900' : 'text-slate-900'}`}>{g.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{g.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 bg-slate-50 rounded-lg border border-slate-200 p-5">
          <h3 className="text-sm font-medium text-slate-900 mb-3">Votre enveloppe et vos objectifs</h3>
          <div className="grid grid-cols-3 gap-3">
            <LabeledField label="Budget total" prefix="€" value="250 000" />
            <LabeledField label="Apport" prefix="€" value="50 000" />
            <LabeledField label="Rendement visé (brut)" suffix="%" value="5,0" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <LabeledField label="Effort mensuel max." suffix="€ / mois" value="900" />
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Horizon d'investissement</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white">
                <option>5 ans</option>
                <option>10 ans</option>
                <option>15 ans</option>
                <option>20 ans</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-sm font-medium text-slate-900 mb-2">Où souhaitez-vous investir ?</h3>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'paris', label: 'Paris', active: false },
              { id: 'lyon', label: 'Lyon', active: true },
              { id: 'bordeaux', label: 'Bordeaux', active: false },
              { id: 'marseille', label: 'Marseille', active: false },
            ].map(z => (
              <button
                key={z.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs ${
                  z.active ? 'bg-propsight-600 border-propsight-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MapPin size={11} />
                {z.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h3 className="text-sm font-medium text-slate-900 mb-2">Vos préférences immobilières</h3>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'meuble', label: 'Meublé', Icon: Sofa, active: true },
              { id: 'nu', label: 'Nu', Icon: Grid3x3 },
              { id: 'colocation', label: 'Colocation', Icon: Users },
              { id: 'travaux', label: 'Travaux acceptés', Icon: Hammer },
            ].map(p => (
              <button
                key={p.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs ${
                  p.active
                    ? 'bg-propsight-50 border-propsight-300 text-propsight-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <p.Icon size={11} />
                {p.label}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={onPrev} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
            <ArrowLeft size={13} /> Retour
          </button>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-propsight-600 text-white font-medium hover:bg-propsight-700"
          >
            Voir ma stratégie
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Sidebar "Ce que vous allez obtenir" */}
      <aside className="bg-slate-50 rounded-lg border border-slate-200 p-5 h-fit">
        <h3 className="text-sm font-semibold text-slate-900">Ce que vous allez obtenir</h3>
        <div className="mt-4 space-y-4">
          <FeatureLine
            icon={<Target size={14} />}
            title="Une stratégie recommandée"
            desc="Une approche d'investissement adaptée à vos objectifs et à votre profil."
          />
          <FeatureLine
            icon={<LineChart size={14} />}
            title="Un rendement réaliste"
            desc="Des estimations basées sur les données de marché actuelles."
          />
          <FeatureLine
            icon={<Gauge size={14} />}
            title="La tension locative"
            desc="L'analyse de la demande locative dans les zones sélectionnées."
          />
          <FeatureLine
            icon={<ShieldCheck size={14} />}
            title="Les points de vigilance"
            desc="Les risques et contraintes à anticiper pour sécuriser votre investissement."
          />
        </div>
        <div className="mt-5 pt-5 border-t border-slate-200 flex items-start gap-2">
          <Lock size={14} className="text-slate-400 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-slate-700">Données sécurisées</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Vos informations restent privées et ne sont jamais partagées.
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

const FeatureLine: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-md bg-propsight-50 text-propsight-600 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-sm font-medium text-slate-900">{title}</div>
      <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</div>
    </div>
  </div>
);

const LabeledField: React.FC<{ label: string; prefix?: string; suffix?: string; value: string }> = ({
  label,
  prefix,
  suffix,
  value,
}) => (
  <div>
    <label className="text-xs text-slate-500 mb-1 block">{label}</label>
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{prefix}</span>}
      <input
        defaultValue={value}
        className={`w-full ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-14' : 'pr-3'} py-2 border border-slate-200 rounded-md text-sm bg-white focus:border-propsight-500 focus:ring-2 focus:ring-propsight-100 focus:outline-none`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{suffix}</span>
      )}
    </div>
  </div>
);

const ZoneTypeScreen: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-[22px] font-serif text-slate-900">Affinons votre zone et vos préférences</h2>
    <p className="text-sm text-slate-500 mt-2">
      Quelques précisions sur le type de bien et la zone pour une recommandation pertinente.
    </p>

    <div className="mt-6 space-y-4">
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Ville précise (ou arrondissement)</label>
        <input
          type="text"
          placeholder="ex. Lyon 3e, Paris 11e"
          className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:border-propsight-500 focus:ring-2 focus:ring-propsight-100 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1.5 block">Type de bien recherché</label>
        <div className="flex flex-wrap gap-1.5">
          {['Studio', 'T1', 'T2', 'T3+', 'Immeuble'].map((t, i) => (
            <button
              key={t}
              className={`px-3 py-1.5 rounded-full border text-xs ${
                i === 2 ? 'bg-propsight-50 border-propsight-300 text-propsight-700' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1.5 block">Type de location</label>
        <div className="flex flex-wrap gap-1.5">
          {['Meublé', 'Nu', 'Colocation', 'Saisonnier'].map((t, i) => (
            <button
              key={t}
              className={`px-3 py-1.5 rounded-full border text-xs ${
                i === 0 ? 'bg-propsight-50 border-propsight-300 text-propsight-700' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-6 flex items-center justify-between">
      <button onClick={onPrev} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft size={13} /> Retour
      </button>
      <button
        onClick={onNext}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-propsight-600 text-white font-medium hover:bg-propsight-700"
      >
        Voir ma stratégie
        <ArrowRight size={14} />
      </button>
    </div>
  </div>
);

const StrategyScreen: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
  const s = MOCK_INVESTOR_STRATEGY;
  return (
    <div className="grid md:grid-cols-[1.3fr_1fr] gap-8">
      <div>
        <h2 className="text-sm font-medium text-slate-500 mb-3">Votre stratégie recommandée</h2>

        <div className="rounded-lg border border-propsight-200 bg-propsight-50/60 p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-md bg-propsight-200 text-propsight-700 flex items-center justify-center">
              <TrendingUp size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-slate-900">{s.strategy_primary.title}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-propsight-600 text-white text-[10px] font-semibold">
                  {s.strategy_primary.badge}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{s.strategy_primary.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <KpiChip icon={<Euro size={13} />} label="Loyer cible" value={`${s.strategy_primary.kpi.target_rent} €/mois`} />
            <KpiChip icon={<TrendingUp size={13} />} label="Rendement brut estimé" value={`${s.strategy_primary.kpi.gross_yield.toString().replace('.', ',')} %`} />
            <KpiChip icon={<Users size={13} />} label="Tension locative" value={s.strategy_primary.kpi.rental_tension} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {s.scenarios.map(sc => (
            <div key={sc.id} className="border border-slate-200 rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
                  {sc.id === 'patrimonial' ? <Building2 size={14} /> : <LineChart size={14} />}
                </div>
                <h4 className="text-sm font-semibold text-slate-900">{sc.title}</h4>
              </div>
              <p className="text-xs text-slate-500 mt-2">{sc.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {sc.tags.map(t => (
                  <span key={t} className="inline-flex items-center px-1.5 py-0.5 rounded bg-propsight-50 text-propsight-700 text-[10px] font-medium">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-slate-500">Loyer cible</div>
                  <div className="font-semibold text-slate-900">{sc.kpi.target_rent} €/mois</div>
                </div>
                <div>
                  <div className="text-slate-500">Rendement brut estimé</div>
                  <div className="font-semibold text-slate-900">{sc.kpi.gross_yield.toString().replace('.', ',')} %</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Points clés à retenir</h3>
          <div className="grid grid-cols-3 gap-3">
            {s.key_points.map(kp => {
              const Icon = kp.severity === 'success' ? (kp.type === 'low_vacancy' ? Home : Euro) : AlertTriangle;
              const color =
                kp.severity === 'success' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50';
              return (
                <div key={kp.type} className="border border-slate-200 rounded-lg p-3 bg-white">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-2">{kp.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">{kp.text}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 p-3 rounded-lg bg-propsight-50 border border-propsight-100 text-sm text-propsight-900 flex items-center justify-between gap-3">
          <span>Un conseiller peut vous proposer une sélection de biens adaptée à votre stratégie.</span>
          <ArrowRight size={15} className="text-propsight-600 flex-shrink-0" />
        </div>

        <div className="mt-5 flex items-center justify-start">
          <button onClick={onPrev} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
            <ArrowLeft size={13} /> Retour
          </button>
        </div>
      </div>

      <aside className="bg-white border border-slate-200 rounded-lg p-5 h-fit">
        <h3 className="text-base font-semibold text-slate-900">Recevoir une sélection de biens</h3>
        <p className="text-xs text-slate-500 mt-1">
          Recevez une sélection personnalisée de biens correspondant à votre stratégie.
        </p>

        <form
          className="mt-4 space-y-3"
          onSubmit={e => {
            e.preventDefault();
            console.warn('[widget investor] submit (mock)');
            onNext();
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Prénom" placeholder="Jean" />
            <TextField label="Nom" placeholder="Dupont" />
          </div>
          <TextField label="Email" type="email" placeholder="jean.dupont@email.com" />
          <TextField label="Téléphone" type="tel" placeholder="06 12 34 56 78" />
          <SelectField label="Préférence de contact" options={['Email', 'Téléphone', 'WhatsApp']} />
          <SelectField label="Disponibilité" options={['Sous une semaine', 'Sous 2 semaines', 'Ce mois-ci', 'Plus tard']} />

          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input type="checkbox" defaultChecked className="mt-0.5 rounded text-propsight-600" />
            <span>J'accepte d'être contacté par Bellerive Immobilier concernant ma demande de sélection de biens.</span>
          </label>
          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input type="checkbox" defaultChecked className="mt-0.5 rounded text-propsight-600" />
            <span>J'accepte la politique de confidentialité et le traitement de mes données personnelles.</span>
          </label>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-propsight-600 text-white font-medium hover:bg-propsight-700"
          >
            Recevoir une sélection de biens
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-propsight-200 text-propsight-700 font-medium hover:bg-propsight-50"
          >
            <CalendarPlus size={13} />
            Planifier un échange
          </button>
        </form>
      </aside>
    </div>
  );
};

const KpiChip: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white rounded-md border border-propsight-100 px-3 py-2">
    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-sm font-semibold text-slate-900 mt-0.5 capitalize">{value}</div>
  </div>
);

const ConfirmationScreen: React.FC = () => (
  <div className="max-w-md mx-auto text-center py-8">
    <div className="w-16 h-16 rounded-full bg-propsight-100 text-propsight-600 flex items-center justify-center mx-auto">
      <CheckCircle2 size={32} />
    </div>
    <h2 className="text-2xl font-serif text-slate-900 mt-5">Votre demande est bien transmise</h2>
    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
      Un conseiller vous proposera une sélection de biens adaptée à votre stratégie sous 48h.
    </p>
    <div className="mt-6 flex gap-2">
      <a href="#" className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50">
        Retour au site
      </a>
      <a href="#" className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-propsight-600 text-white text-sm font-medium hover:bg-propsight-700">
        Voir notre sélection
      </a>
    </div>
  </div>
);

// Helpers réutilisés
const TextField: React.FC<{ label: string; type?: string; placeholder?: string }> = ({ label, type = 'text', placeholder }) => (
  <div>
    <label className="text-xs text-slate-500 block mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:border-propsight-500 focus:ring-2 focus:ring-propsight-100 focus:outline-none"
    />
  </div>
);

const SelectField: React.FC<{ label: string; options: string[] }> = ({ label, options }) => (
  <div>
    <label className="text-xs text-slate-500 block mb-1">{label}</label>
    <select className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white focus:border-propsight-500 focus:ring-2 focus:ring-propsight-100 focus:outline-none">
      {options.map(o => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

export default InvestorWidget;
