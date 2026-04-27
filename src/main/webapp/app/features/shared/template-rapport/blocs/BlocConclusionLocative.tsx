import React, { useMemo } from 'react';
import { Home, Tag, Coins, BarChart2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { BlocComponentProps } from '../types';
import { getReglementations } from 'app/features/estimation/_mocks/reglementations';

type UniteLoyer = 'eur' | 'eur_m2';

interface ConclusionLocativeContent {
  texte?: string;
  loyer_hc?: number;
  unite_loyer?: UniteLoyer;
  charges_mensuelles?: number;
  honoraires?: number;
  justification_ecart?: string;
}

const BlocConclusionLocative: React.FC<BlocComponentProps> = ({ data, blocConfig, onContentChange }) => {
  const { estimation } = data;
  const avm = estimation.avm;
  const content = (blocConfig.customContent || {}) as ConclusionLocativeContent;

  const loyerAvm = avm?.loyer.estimation || 0;
  const surface = estimation.bien.surface || 1;

  const loyerHc = content.loyer_hc ?? loyerAvm;
  const uniteLoyer: UniteLoyer = content.unite_loyer || 'eur';
  const charges = content.charges_mensuelles ?? (estimation.bien.charges_mensuelles ? Math.round(estimation.bien.charges_mensuelles / 3) : 0);
  const honoraires = content.honoraires ?? loyerHc;

  const loyerM2 = useMemo(() => (surface > 0 ? loyerHc / surface : 0), [loyerHc, surface]);
  const loyerCc = loyerHc + charges;
  const loyerCcM2 = surface > 0 ? loyerCc / surface : 0;

  const ecartPct = loyerAvm ? ((loyerHc - loyerAvm) / loyerAvm) * 100 : 0;
  const ecartCritique = Math.abs(ecartPct) > 10;

  const reg = useMemo(
    () => getReglementations(estimation.bien.code_postal, surface, estimation.bien.dpe),
    [estimation.bien.code_postal, surface, estimation.bien.dpe],
  );
  const encadrement = reg.encadrement.zone_tendue ? reg.encadrement : null;

  const textePardefaut =
    "À l'issue de notre analyse du marché locatif local, des tensions de demande et des comparables à la location, nous recommandons une mise en location dans la fourchette indiquée ci-dessous.";
  const texte = content.texte ?? textePardefaut;

  return (
    <div className="rapport-bloc rapport-conclusion-locative px-10 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-4">Conclusion et loyer retenu</h2>

      <div className="bg-slate-50 rounded-lg p-5 mb-6 border-l-4 border-propsight-500">
        <p className="text-sm text-slate-700 leading-relaxed italic">{texte}</p>
      </div>

      <div className="rounded-lg border-2 border-propsight-200 bg-gradient-to-br from-propsight-50/50 to-white p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-4 flex items-center gap-2">
          <BarChart2 size={14} /> Notre estimation locative
        </div>

        {/* Loyer HC */}
        <Ligne icon={<Coins size={16} className="text-propsight-600" />} label="Loyer hors charges">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={uniteLoyer === 'eur' ? Math.round(loyerHc) : Math.round(loyerM2 * 100) / 100}
              onChange={e => {
                const v = parseFloat(e.target.value) || 0;
                onContentChange({ loyer_hc: uniteLoyer === 'eur' ? v : Math.round(v * surface) });
              }}
              step={uniteLoyer === 'eur' ? 1 : 0.1}
              className="w-32 text-right tabular-nums px-2 py-1 border border-slate-200 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
            />
            <UniteToggle
              value={uniteLoyer}
              options={[{ value: 'eur', label: '€' }, { value: 'eur_m2', label: '€/m²' }]}
              onChange={v => onContentChange({ unite_loyer: v as UniteLoyer })}
            />
          </div>
        </Ligne>
        <p className="text-xs text-slate-500 ml-7 mb-3 tabular-nums">
          {uniteLoyer === 'eur' ? `${loyerM2.toFixed(2)} €/m²` : `${Math.round(loyerHc).toLocaleString('fr-FR')} €`}
        </p>

        {/* Conformité encadrement */}
        {encadrement && loyerHc > 0 && (
          <div className="ml-7 mb-4">
            <BadgeConformite
              loyerM2={loyerM2}
              loyerMin={encadrement.loyer_minore_m2}
              loyerMax={encadrement.loyer_majore_m2}
              loyerRef={encadrement.loyer_reference_m2}
              surface={surface}
            />
          </div>
        )}

        {/* Charges */}
        <Ligne icon={<Tag size={16} className="text-propsight-600" />} label="Charges mensuelles">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={charges}
              onChange={e => onContentChange({ charges_mensuelles: parseFloat(e.target.value) || 0 })}
              className="w-32 text-right tabular-nums px-2 py-1 border border-slate-200 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
            />
            <span className="text-xs text-slate-500 w-12">€</span>
          </div>
        </Ligne>
        <p className="text-xs text-slate-500 ml-7 mb-4">Provision forfaitaire mensuelle (eau, entretien communs, ascenseur…).</p>

        <div className="my-4 border-t border-slate-200" />

        {/* Loyer CC — calculé */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Home size={18} className="text-emerald-600" />
            <span className="text-sm font-semibold text-slate-900">Loyer charges comprises</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-emerald-700 tabular-nums">
              {Math.round(loyerCc).toLocaleString('fr-FR')} €
            </span>
            <p className="text-[11px] text-slate-500 tabular-nums">{loyerCcM2.toFixed(2)} €/m²</p>
          </div>
        </div>

        <div className="my-4 border-t border-slate-200" />

        {/* Honoraires */}
        <Ligne icon={<Tag size={16} className="text-propsight-600" />} label="Honoraires de location">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={Math.round(honoraires)}
              onChange={e => onContentChange({ honoraires: parseFloat(e.target.value) || 0 })}
              className="w-32 text-right tabular-nums px-2 py-1 border border-slate-200 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
            />
            <span className="text-xs text-slate-500 w-12">€ TTC</span>
          </div>
        </Ligne>
        <p className="text-xs text-slate-500 ml-7">
          Équivalent à {loyerHc > 0 ? (honoraires / loyerHc).toFixed(2) : '—'} mois de loyer hors charges
          {' '}<span className="text-slate-400">(plafond légal : 1 mois pour la part bailleur).</span>
        </p>

        {/* Justification écart AVM */}
        {ecartCritique && avm && (
          <div className="mt-5 pt-4 border-t border-amber-200 bg-amber-50/40 -mx-6 -mb-6 px-6 pb-5 rounded-b-lg">
            <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
              <AlertTriangle size={12} />
              Votre loyer dévie de {ecartPct > 0 ? '+' : ''}{ecartPct.toFixed(1)}% par rapport à l'AVM ({Math.round(loyerAvm).toLocaleString('fr-FR')} €).
              Justification :
            </p>
            <textarea
              value={content.justification_ecart || ''}
              onChange={e => onContentChange({ justification_ecart: e.target.value })}
              rows={2}
              placeholder="Expliquez cet écart (ex : meublé haut-de-gamme, demande spécifique, équipements exceptionnels...)"
              className="w-full text-xs px-3 py-2 border border-amber-400 bg-white rounded resize-none focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Ligne: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
  <div className="flex items-center justify-between mb-1">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
    {children}
  </div>
);

const UniteToggle: React.FC<{
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}> = ({ value, options, onChange }) => (
  <div className="inline-flex rounded border border-slate-200 overflow-hidden">
    {options.map(o => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={`px-2 py-1 text-xs font-medium transition-colors ${
          value === o.value ? 'bg-propsight-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const BadgeConformite: React.FC<{
  loyerM2: number;
  loyerMin: number;
  loyerMax: number;
  loyerRef: number;
  surface: number;
}> = ({ loyerM2, loyerMin, loyerMax, loyerRef, surface }) => {
  const loyerMinEur = Math.round(loyerMin * surface);
  const loyerMaxEur = Math.round(loyerMax * surface);
  const loyerRefEur = Math.round(loyerRef * surface);

  let style = 'bg-green-50 border-green-200 text-green-800';
  let icon = <CheckCircle2 size={12} className="text-green-600 flex-shrink-0" />;
  let label = `Dans l'encadrement (${loyerMinEur.toLocaleString('fr-FR')} – ${loyerMaxEur.toLocaleString('fr-FR')} €)`;

  if (loyerM2 > loyerMax) {
    style = 'bg-red-50 border-red-200 text-red-800';
    icon = <XCircle size={12} className="text-red-600 flex-shrink-0" />;
    label = `Dépasse le plafond majoré de ${((loyerM2 - loyerMax) / loyerMax * 100).toFixed(1)}% — complément de loyer à justifier`;
  } else if (loyerM2 < loyerMin) {
    style = 'bg-amber-50 border-amber-200 text-amber-800';
    icon = <AlertTriangle size={12} className="text-amber-600 flex-shrink-0" />;
    label = `Sous le loyer minoré (${loyerMinEur.toLocaleString('fr-FR')} €) — marge de revalorisation`;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] font-medium ${style}`}>
      {icon}
      <span>
        {label}
        {' '}<span className="opacity-70">· Réf. {loyerRefEur.toLocaleString('fr-FR')} €</span>
      </span>
    </div>
  );
};

export default BlocConclusionLocative;
