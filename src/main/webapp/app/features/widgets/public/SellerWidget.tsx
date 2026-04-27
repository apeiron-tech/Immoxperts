import React, { useState } from 'react';
import {
  MapPin,
  LocateFixed,
  Home,
  Building2,
  Trees,
  Car,
  ShieldCheck,
  BadgeCheck,
  BarChart3,
  Check,
  ArrowRight,
  ArrowLeft,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import PublicShell from './PublicShell';
import { MOCK_SELLER_VALUATION } from '../_mocks/strategy';

const STEPS = [
  { id: 'intro', name: 'Intro' },
  { id: 'adresse', name: 'Adresse du bien' },
  { id: 'bien', name: 'Caractéristiques' },
  { id: 'details', name: 'Détails' },
  { id: 'resultat', name: 'Résultat' },
  { id: 'contact', name: 'Contact' },
  { id: 'fin', name: 'Terminé' },
];

const SellerWidget: React.FC = () => {
  const [step, setStep] = useState(1); // 1..7

  const next = () => setStep(s => Math.min(STEPS.length, s + 1));
  const prev = () => setStep(s => Math.max(1, s - 1));

  return (
    <PublicShell steps={STEPS} currentIndex={step}>
      {step === 1 && <IntroScreen onNext={next} />}
      {step === 2 && <AddressScreen onNext={next} onPrev={prev} />}
      {step === 3 && <PropertyScreen onNext={next} onPrev={prev} />}
      {step === 4 && <DetailsScreen onNext={next} onPrev={prev} />}
      {step === 5 && <ResultContactScreen onNext={next} onPrev={prev} />}
      {step === 6 && <ConfirmationScreen />}
      {step === 7 && <ConfirmationScreen />}
    </PublicShell>
  );
};

// ——— Screens

const IntroScreen: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="max-w-2xl mx-auto text-center space-y-6 py-6">
    <p className="text-sm text-slate-500">
      Une première estimation basée sur les caractéristiques de votre bien et les données du marché local.
    </p>
    <button
      onClick={onNext}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-propsight-600 text-white font-medium hover:bg-propsight-700 transition-colors"
    >
      Commencer mon estimation
      <ArrowRight size={16} />
    </button>
    <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200">
        <Check size={12} className="text-emerald-600" /> Gratuit
      </span>
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200">
        <Check size={12} className="text-emerald-600" /> Sans engagement
      </span>
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200">
        <ShieldCheck size={12} className="text-emerald-600" /> Confidentiel
      </span>
    </div>
  </div>
);

const AddressScreen: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
  const [address, setAddress] = useState('');
  return (
    <div className="grid md:grid-cols-[1.2fr_1fr] gap-10">
      <div>
        <h2 className="text-[22px] font-serif text-slate-900">Commençons par l'adresse de votre bien</h2>
        <p className="text-sm text-slate-500 mt-2">
          Indiquez l'adresse exacte de votre bien pour obtenir une estimation basée sur les données du marché local.
        </p>
        <div className="mt-6">
          <label className="text-sm font-medium text-slate-700 block mb-2">Adresse de votre bien</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Saisissez l'adresse de votre bien"
              className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-lg focus:border-propsight-500 focus:ring-2 focus:ring-propsight-100 focus:outline-none text-sm"
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">Ex : 22 rue de la Pompe, 75116 Paris</span>
            <button className="text-xs text-propsight-600 hover:text-propsight-700 inline-flex items-center gap-1 font-medium">
              <LocateFixed size={12} />
              Utiliser ma position
            </button>
          </div>
        </div>

        <button
          onClick={onNext}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-propsight-600 text-white font-medium hover:bg-propsight-700"
        >
          Commencer mon estimation
          <ArrowRight size={15} />
        </button>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-md border border-slate-200 text-xs text-slate-600">
            <Check size={12} className="text-emerald-600" /> Gratuit
          </div>
          <div className="inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-md border border-slate-200 text-xs text-slate-600">
            <Check size={12} className="text-emerald-600" /> Sans engagement
          </div>
          <div className="inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-md border border-slate-200 text-xs text-slate-600">
            <ShieldCheck size={12} className="text-emerald-600" /> Confidentiel
          </div>
        </div>
        <div className="mt-4 flex items-center justify-start">
          <button onClick={onPrev} className="text-sm text-slate-500 inline-flex items-center gap-1 hover:text-slate-700">
            <ArrowLeft size={13} /> Retour
          </button>
        </div>
      </div>

      <SidebarPreview />
    </div>
  );
};

const SidebarPreview: React.FC = () => (
  <aside className="bg-slate-50 rounded-lg border border-slate-200 p-5 h-fit">
    <h3 className="text-sm font-semibold text-slate-900">Votre estimation à venir</h3>
    <div className="mt-4 space-y-4">
      <FeatureLine icon={<Home size={14} />} title="Estimation fiable" desc="Une fourchette de prix basée sur les données du marché local." />
      <FeatureLine icon={<BarChart3 size={14} />} title="Analyses clés" desc="Prix au m², tendances locales et biens comparables récents." />
      <FeatureLine icon={<ShieldCheck size={14} />} title="Rapide et sécurisé" desc="Obtenez votre estimation en quelques étapes, sans engagement." />
    </div>
    <div className="mt-5 pt-5 border-t border-slate-200">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">Estimation indicative</span>
        <span className="px-1.5 py-0.5 rounded bg-propsight-100 text-propsight-700 text-[10px] font-semibold">Aperçu</span>
      </div>
      <div className="text-xl font-semibold text-propsight-700 mt-2">
        {MOCK_SELLER_VALUATION.min.toLocaleString('fr-FR')} € – {MOCK_SELLER_VALUATION.max.toLocaleString('fr-FR')} €
      </div>
      <div className="text-xs text-slate-500 mt-0.5">
        Soit {MOCK_SELLER_VALUATION.median_per_sqm_min.toLocaleString('fr-FR')} € – {MOCK_SELLER_VALUATION.median_per_sqm_max.toLocaleString('fr-FR')} €/m²
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-1.5 rounded bg-slate-200" />
        <div className="h-1.5 rounded bg-slate-100 w-3/4" />
      </div>
    </div>
  </aside>
);

const FeatureLine: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-md bg-propsight-50 text-propsight-600 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-sm font-medium text-slate-900">{title}</div>
      <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
    </div>
  </div>
);

const PropertyScreen: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
  const [type, setType] = useState('appartement');

  return (
    <div className="grid md:grid-cols-[1.3fr_1fr] gap-10">
      <div>
        <h2 className="text-[22px] font-serif text-slate-900">Parlons de votre bien</h2>
        <p className="text-sm text-slate-500 mt-2">Ces informations affinent votre estimation.</p>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {[
            { id: 'appartement', label: 'Appartement', Icon: Building2 },
            { id: 'maison', label: 'Maison', Icon: Home },
            { id: 'terrain', label: 'Terrain', Icon: Trees },
            { id: 'parking', label: 'Parking', Icon: Car },
          ].map(o => (
            <button
              key={o.id}
              onClick={() => setType(o.id)}
              className={`px-3 py-4 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                type === o.id ? 'border-propsight-500 bg-propsight-50 text-propsight-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <o.Icon size={20} />
              <span className="text-xs font-medium">{o.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <NumberField label="Surface (m²)" defaultValue={85} />
          <NumberField label="Pièces" defaultValue={4} />
          <NumberField label="Chambres" defaultValue={2} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <SelectField label="Étage" options={['RDC', '1er', '2e', '3e+']} />
          <SelectField label="Année de construction" options={['Avant 1949', '1950-1970', '1971-1990', '1991-2010', 'Après 2011']} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <SelectField label="État général" options={['Neuf', 'Bon état', 'À rafraîchir', 'À rénover']} />
          <SelectField label="DPE" options={['A', 'B', 'C', 'D', 'E', 'F', 'G']} />
        </div>
        <div className="mt-3">
          <label className="text-xs text-slate-500 block mb-1.5">Équipements</label>
          <div className="flex flex-wrap gap-1.5">
            {['Balcon', 'Terrasse', 'Ascenseur', 'Cave', 'Jardin', 'Parking'].map(c => (
              <button key={c} className="px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-600 hover:bg-slate-50">
                {c}
              </button>
            ))}
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
            Continuer
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <aside className="bg-slate-50 rounded-lg border border-slate-200 p-5 h-fit">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Récapitulatif</div>
        <div className="text-sm text-slate-900 font-medium">22 rue de la Pompe, 75116 Paris</div>
        <button className="mt-1 text-xs text-propsight-600 hover:text-propsight-700 font-medium">Modifier</button>
        <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-600">
          <div className="font-semibold text-slate-700 mb-2">Étapes restantes</div>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-propsight-600 text-white text-[9px] font-bold flex items-center justify-center">
                3
              </span>
              <span>Détails complémentaires</span>
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <span className="w-4 h-4 rounded-full border border-slate-300 text-[9px] font-bold flex items-center justify-center">
                4
              </span>
              <span>Résultat + contact</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

const DetailsScreen: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-[22px] font-serif text-slate-900">Quelques détails supplémentaires</h2>
    <p className="text-sm text-slate-500 mt-2">Dernière étape avant votre estimation.</p>

    <div className="mt-6 grid grid-cols-2 gap-3">
      <SelectField label="Occupation du bien" options={['Libre', 'Loué', 'Occupé par le propriétaire']} />
      <SelectField label="Travaux récents" options={['Aucun', 'Rafraîchissement', 'Rénovation partielle', 'Rénovation complète']} />
    </div>
    <div className="mt-3">
      <label className="text-xs text-slate-500 block mb-1.5">Prestations spécifiques</label>
      <div className="flex flex-wrap gap-1.5">
        {['Piscine', 'Vue dégagée', 'Double exposition', 'Climatisation', 'Proche écoles', 'Proche transports'].map(c => (
          <button key={c} className="px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-600 hover:bg-slate-50">
            {c}
          </button>
        ))}
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
        Voir mon estimation
        <ArrowRight size={14} />
      </button>
    </div>
  </div>
);

const ResultContactScreen: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
  const v = MOCK_SELLER_VALUATION;
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="w-10 h-10 rounded-md bg-propsight-50 text-propsight-600 flex items-center justify-center mb-3">
          <Home size={18} />
        </div>
        <h2 className="text-sm font-medium text-slate-500">Votre estimation</h2>
        <div className="text-3xl md:text-4xl font-semibold text-propsight-600 mt-2 leading-tight">
          {v.min.toLocaleString('fr-FR')} €<br />— {v.max.toLocaleString('fr-FR')} €
        </div>
        <div className="text-sm text-slate-500 mt-2">
          Soit {v.median_per_sqm_min.toLocaleString('fr-FR')} € – {v.median_per_sqm_max.toLocaleString('fr-FR')} €/m²
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
          <BadgeCheck size={13} />
          Fiabilité forte
        </div>
        <p className="text-sm text-slate-600 mt-4">
          Cette estimation est basée sur les caractéristiques que vous avez saisies et sur les transactions récentes de biens comparables dans votre secteur.
        </p>

        <ul className="mt-5 space-y-2.5 text-sm">
          <li className="flex items-center gap-2">
            <BarChart3 size={14} className="text-propsight-600" />
            <span className="text-slate-700">
              Marché local <span className="font-semibold">dynamique</span>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Check size={14} className="text-emerald-600" />
            <span className="text-slate-700">
              Délai de vente estimé : <span className="font-semibold">{v.days_on_market} jours</span>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Home size={14} className="text-propsight-600" />
            <span className="text-slate-700">
              <span className="font-semibold">3 ventes récentes</span> à proximité
            </span>
          </li>
        </ul>

        <div className="mt-5 p-3 rounded-lg bg-propsight-50 border border-propsight-100 text-sm text-propsight-900">
          Un conseiller peut affiner cette estimation avec vous.
        </div>
      </div>

      <aside className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-base font-semibold text-slate-900">Recevoir mon avis de valeur</h3>
        <p className="text-xs text-slate-500 mt-1">Un expert vous contactera sous 24h.</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={e => {
            e.preventDefault();
            console.warn('[widget seller] submit lead (mock)');
            onNext();
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Prénom" placeholder="Sophie" />
            <TextField label="Nom" placeholder="Martin" />
          </div>
          <TextField label="Email" type="email" placeholder="sophie.martin@example.com" />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Téléphone" type="tel" placeholder="06 12 34 56 78" />
            <SelectField label="Projet" options={['Vendre maintenant', 'Estimer pour info', 'Vendre dans 6 mois']} />
          </div>
          <SelectField label="Préférence de contact" options={['Email', 'Téléphone', 'WhatsApp']} />

          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input type="checkbox" defaultChecked className="mt-0.5 rounded text-propsight-600" />
            <span>
              J'accepte d'être contacté par Maison d'Exception concernant ma demande d'estimation.
            </span>
          </label>
          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input type="checkbox" defaultChecked className="mt-0.5 rounded text-propsight-600" />
            <span>J'accepte la politique de confidentialité et le traitement de mes données personnelles.</span>
          </label>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-propsight-600 text-white font-medium hover:bg-propsight-700"
          >
            Recevoir mon avis de valeur
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-propsight-200 text-propsight-700 font-medium hover:bg-propsight-50"
          >
            <Phone size={13} />
            Être rappelé
          </button>
        </form>
        <div className="mt-4 flex items-center justify-start">
          <button onClick={onPrev} className="text-xs text-slate-500 inline-flex items-center gap-1 hover:text-slate-700">
            <ArrowLeft size={12} /> Modifier mes informations
          </button>
        </div>
      </aside>
    </div>
  );
};

const ConfirmationScreen: React.FC = () => (
  <div className="max-w-md mx-auto text-center py-8">
    <div className="w-16 h-16 rounded-full bg-propsight-100 text-propsight-600 flex items-center justify-center mx-auto">
      <CheckCircle2 size={32} />
    </div>
    <h2 className="text-2xl font-serif text-slate-900 mt-5">Votre demande a bien été transmise</h2>
    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
      Un conseiller peut vous recontacter pour affiner votre avis de valeur. Réponse sous 24h.
    </p>

    <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4 text-left flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-propsight-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
        TL
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-900">Thomas Lemoine</div>
        <div className="text-xs text-slate-500">Consultant — Maison d'Exception</div>
        <div className="text-xs text-slate-500 mt-1">thomas.lemoine@maisondexception.fr · 01 45 78 12 00</div>
      </div>
    </div>

    <div className="mt-6 flex gap-2">
      <a href="#" className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50">
        Retour au site
      </a>
      <a href="#" className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-propsight-600 text-white text-sm font-medium hover:bg-propsight-700">
        Voir nos biens
      </a>
    </div>
  </div>
);

// Helpers
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

const NumberField: React.FC<{ label: string; defaultValue?: number }> = ({ label, defaultValue }) => (
  <div>
    <label className="text-xs text-slate-500 block mb-1">{label}</label>
    <input
      type="number"
      defaultValue={defaultValue}
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

export default SellerWidget;
