import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { amortizationMonthly } from './lib/calcAmortization';
import { INVEST_MINI_CALC_DEFAULTS, INVEST_MINI_CALC_LIMITS } from './constants';

const formatEuro = (n: number): string => {
  const sign = n < 0 ? '-' : '';
  const v = Math.round(Math.abs(n));
  return `${sign}${v.toLocaleString('fr-FR')} €`;
};

const formatPct = (n: number): string => `${n.toFixed(1).replace('.', ',')} %`;

interface SliderRowProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}

const SliderRow: React.FC<SliderRowProps> = ({ label, value, onChange, min, max, step }) => {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState<string>(String(value));

  React.useEffect(() => {
    if (!focused) {
      setDraft(String(value));
    }
  }, [value, focused]);

  const commitDraft = () => {
    const parsed = parseInt(draft.replace(/\D/g, ''), 10);
    if (Number.isFinite(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
      setDraft(String(clamped));
    } else {
      setDraft(String(value));
    }
    setFocused(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <label className="text-[14px] font-medium text-slate-700">{label}</label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={focused ? draft : formatEuro(value).replace(/\s€$/, ' €')}
            onChange={e => setDraft(e.target.value)}
            onFocus={() => {
              setFocused(true);
              setDraft(String(value));
            }}
            onBlur={commitDraft}
            onKeyDown={e => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
            className="w-32 h-9 px-3 text-right text-[14px] tabular-nums rounded-md border border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500 outline-none bg-white"
            aria-label={label}
          />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-slate-200 cursor-pointer accent-propsight-600"
        aria-label={`Slider ${label}`}
      />
    </div>
  );
};

const KpiCard: React.FC<{ label: string; value: string; tone?: 'default' | 'positive' }> = ({ label, value, tone = 'default' }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-5">
    <div className="text-[13px] text-slate-600">{label}</div>
    <div
      className={`mt-1 text-[32px] md:text-[36px] font-medium tabular-nums leading-tight ${
        tone === 'positive' ? 'text-emerald-700' : 'text-propsight-700'
      }`}
    >
      {value}
    </div>
  </div>
);

const InvestMiniCalculator: React.FC = () => {
  const [prix, setPrix] = useState(INVEST_MINI_CALC_DEFAULTS.prix);
  const [loyer, setLoyer] = useState(INVEST_MINI_CALC_DEFAULTS.loyer);
  const [apport, setApport] = useState(INVEST_MINI_CALC_DEFAULTS.apport);

  const { rendementBrut, cashflowMensuel, effortMensuel, autofinance } = useMemo(() => {
    const charges = loyer * INVEST_MINI_CALC_DEFAULTS.chargesPct;
    const montantEmprunte = Math.max(0, prix - apport);
    const m = amortizationMonthly(montantEmprunte, INVEST_MINI_CALC_DEFAULTS.tauxEmprunt, INVEST_MINI_CALC_DEFAULTS.dureeAnnees);
    const rb = prix > 0 ? ((loyer * 12) / prix) * 100 : 0;
    const cf = loyer - m - charges;
    return {
      rendementBrut: rb,
      cashflowMensuel: cf,
      effortMensuel: cf < 0 ? cf : 0,
      autofinance: cf >= 0,
    };
  }, [prix, loyer, apport]);

  return (
    <section id="exemple" className="bg-white py-20">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <div className="text-center max-w-[640px] mx-auto mb-10">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.32 }}
            className="text-[11px] font-semibold text-propsight-600 uppercase tracking-[0.12em]"
          >
            Essayez tout de suite
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, delay: 0.04 }}
            className="mt-2 text-[28px] md:text-[36px] font-medium text-slate-900 leading-[1.15] tracking-[-0.02em]"
          >
            Jouez avec les chiffres.
          </motion.h2>
        </div>

        <div className="max-w-[900px] mx-auto">
          <div className="rounded-lg border border-slate-200 bg-white p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-6">
                <SliderRow
                  label="Prix d'achat"
                  value={prix}
                  onChange={setPrix}
                  min={INVEST_MINI_CALC_LIMITS.prix.min}
                  max={INVEST_MINI_CALC_LIMITS.prix.max}
                  step={INVEST_MINI_CALC_LIMITS.prix.step}
                />
                <SliderRow
                  label="Loyer mensuel"
                  value={loyer}
                  onChange={setLoyer}
                  min={INVEST_MINI_CALC_LIMITS.loyer.min}
                  max={INVEST_MINI_CALC_LIMITS.loyer.max}
                  step={INVEST_MINI_CALC_LIMITS.loyer.step}
                />
                <SliderRow
                  label="Apport"
                  value={apport}
                  onChange={setApport}
                  min={INVEST_MINI_CALC_LIMITS.apport.min}
                  max={INVEST_MINI_CALC_LIMITS.apport.max}
                  step={INVEST_MINI_CALC_LIMITS.apport.step}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-3">
                <KpiCard label="Rendement brut" value={formatPct(rendementBrut)} />
                <KpiCard label="Cash-flow mensuel" value={formatEuro(cashflowMensuel)} />
                <KpiCard
                  label="Effort mensuel"
                  value={autofinance ? 'Autofinancé ✓' : formatEuro(effortMensuel)}
                  tone={autofinance ? 'positive' : 'default'}
                />
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-[12px] text-slate-500 leading-relaxed">
            Simulation pédagogique. Taux de 3,8 % sur 25 ans, charges simplifiées à 8 % du loyer, fiscalité non prise en compte. Pour un calcul
            précis, utilisez le simulateur complet.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/investissement/simulateur"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-propsight-600 hover:bg-propsight-700 text-white text-[14px] font-semibold transition-colors"
            >
              Ouvrir le simulateur complet
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestMiniCalculator;
