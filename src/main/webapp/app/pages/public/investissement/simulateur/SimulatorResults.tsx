import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { SimulatorInput, SimulatorResult, buildWarnings, WARNING_MESSAGES } from './lib/calcInvest';
import SimulatorLeadForm from './SimulatorLeadForm';

interface Props {
  state: SimulatorInput;
  result: SimulatorResult;
}

const fmtEuro = (n: number) => {
  const sign = n < 0 ? '-' : '';
  const v = Math.round(Math.abs(n));
  return `${sign}${v.toLocaleString('fr-FR')} €`;
};

const fmtPct = (n: number) => `${n.toFixed(1).replace('.', ',')} %`;

const KpiPrimary: React.FC<{ label: string; value: React.ReactNode; note?: string; tone?: 'default' | 'positive' | 'negative' }> = ({
  label,
  value,
  note,
  tone = 'default',
}) => (
  <div className="rounded-md border border-slate-200 bg-white p-4">
    <div className="text-[13px] text-slate-600">{label}</div>
    <div
      className={`mt-1 text-[28px] md:text-[32px] font-medium tabular-nums leading-tight ${
        tone === 'positive' ? 'text-emerald-700' : tone === 'negative' ? 'text-rose-700' : 'text-propsight-700'
      }`}
    >
      {value}
    </div>
    {note ? <div className="mt-1 text-[11.5px] text-slate-500">{note}</div> : null}
  </div>
);

const KpiSecondary: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md border border-slate-200 bg-white p-3">
    <div className="text-[12px] text-slate-600">{label}</div>
    <div className="mt-0.5 text-[18px] font-medium text-slate-900 tabular-nums">{value}</div>
  </div>
);

const SimulatorResults: React.FC<Props> = ({ state, result }) => {
  const modeLabel = state.modeLocation === 'nu' ? 'Location nue (micro-foncier)' : 'Location meublée (micro-BIC)';
  const warnings = buildWarnings(state, result);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 lg:p-8 lg:sticky lg:top-[88px]">
      <div className="text-[13px] text-slate-600">
        Projet à <span className="text-slate-900 font-medium">{state.ville ?? '—'}</span>
        {' · '}
        <span>{modeLabel}</span>
        {' · Apport '}
        <span className="tabular-nums">{fmtEuro(state.apport)}</span>
        {' · Taux '}
        <span className="tabular-nums">{state.tauxPct.toFixed(2).replace('.', ',')} %</span>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <KpiPrimary label="Rendement brut" value={fmtPct(result.rendementBrutPct)} note="% par an" />
        <KpiPrimary label="Rendement net" value={fmtPct(result.rendementNetPct)} note="après charges" />
        <KpiPrimary
          label="Cash-flow mensuel"
          value={fmtEuro(result.cashflowMensuelAvantImpot)}
          note="avant impôt"
          tone={result.cashflowMensuelAvantImpot >= 0 ? 'positive' : 'negative'}
        />
        <KpiPrimary
          label="Effort mensuel"
          value={result.effortMensuelApresImpot >= 0 ? 'Autofinancé ✓' : fmtEuro(result.effortMensuelApresImpot)}
          note="après impôt"
          tone={result.effortMensuelApresImpot >= 0 ? 'positive' : 'negative'}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KpiSecondary label="Mensualité de prêt" value={fmtEuro(result.mensualite)} />
        <KpiSecondary label="Coût total du crédit" value={fmtEuro(result.coutTotalCredit)} />
        <KpiSecondary label="Impôt annuel" value={fmtEuro(result.impotAnnuel)} />
      </div>

      {warnings.length > 0 ? (
        <div className="mt-5 space-y-2">
          {warnings.map(w => (
            <div key={w} className="flex gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-800">
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-600" />
              <span>{WARNING_MESSAGES[w]}</span>
            </div>
          ))}
        </div>
      ) : null}

      <SimulatorLeadForm simulationState={state} simulationResult={result} />
    </div>
  );
};

export default SimulatorResults;
