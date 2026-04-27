import React from 'react';
import { X, RotateCcw } from 'lucide-react';

export interface FiltresState {
  prix_max: number;
  surface_min: number;
  surface_max: number;
  rendement_min: number;
  cashflow_min: number;
  dpe_exclus: string[];
  tension: string[];
  profil: string[];
  coherence_min: number;
  nouveauxSeuls: boolean;
}

export const DEFAULT_FILTRES: FiltresState = {
  prix_max: 700000,
  surface_min: 20,
  surface_max: 120,
  rendement_min: 0,
  cashflow_min: -500,
  dpe_exclus: [],
  tension: [],
  profil: [],
  coherence_min: 0,
  nouveauxSeuls: false,
};

interface Props {
  open: boolean;
  filtres: FiltresState;
  onChange: (f: FiltresState) => void;
  onClose: () => void;
}

const FiltresDrawer: React.FC<Props> = ({ open, filtres, onChange, onClose }) => {
  if (!open) return null;
  const reset = () => onChange(DEFAULT_FILTRES);

  const toggle = (key: 'dpe_exclus' | 'tension' | 'profil', value: string) => {
    const arr = filtres[key];
    onChange({ ...filtres, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] });
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/30 z-40" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-[380px] bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Filtres</h3>
          <div className="flex items-center gap-2">
            <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700">
              <RotateCcw size={12} />
              Réinitialiser
            </button>
            <button type="button" onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-5 text-xs">
          <Section title="Prix">
            <label className="block mb-2">
              <span className="text-slate-600">Prix max : <strong>{filtres.prix_max.toLocaleString('fr-FR')} €</strong></span>
              <input
                type="range"
                min={100000}
                max={1200000}
                step={10000}
                value={filtres.prix_max}
                onChange={e => onChange({ ...filtres, prix_max: Number(e.target.value) })}
                className="w-full mt-1 accent-propsight-600"
              />
            </label>
          </Section>

          <Section title="Surface">
            <div className="grid grid-cols-2 gap-2">
              <label>
                <span className="text-slate-600 text-[10px]">Min</span>
                <input
                  type="number"
                  value={filtres.surface_min}
                  onChange={e => onChange({ ...filtres, surface_min: Number(e.target.value) })}
                  className="w-full mt-0.5 border border-slate-200 rounded px-2 py-1"
                />
              </label>
              <label>
                <span className="text-slate-600 text-[10px]">Max</span>
                <input
                  type="number"
                  value={filtres.surface_max}
                  onChange={e => onChange({ ...filtres, surface_max: Number(e.target.value) })}
                  className="w-full mt-0.5 border border-slate-200 rounded px-2 py-1"
                />
              </label>
            </div>
          </Section>

          <Section title="Rendement & Cash-flow">
            <label className="block mb-2">
              <span className="text-slate-600">Rendement net-net min : <strong>{filtres.rendement_min}%</strong></span>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={filtres.rendement_min}
                onChange={e => onChange({ ...filtres, rendement_min: Number(e.target.value) })}
                className="w-full mt-1 accent-propsight-600"
              />
            </label>
            <label className="block">
              <span className="text-slate-600">Cash-flow min : <strong>{filtres.cashflow_min} €/mois</strong></span>
              <input
                type="range"
                min={-500}
                max={500}
                step={50}
                value={filtres.cashflow_min}
                onChange={e => onChange({ ...filtres, cashflow_min: Number(e.target.value) })}
                className="w-full mt-1 accent-propsight-600"
              />
            </label>
          </Section>

          <Section title="DPE exclus">
            <div className="flex gap-1 flex-wrap">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => toggle('dpe_exclus', d)}
                  className={`px-2 py-1 text-[10px] rounded border ${
                    filtres.dpe_exclus.includes(d)
                      ? 'bg-rose-50 text-rose-700 border-rose-300 line-through'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Tension locative">
            <div className="flex gap-1 flex-wrap">
              {['faible', 'moyenne', 'elevee', 'tres_elevee'].map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggle('tension', t)}
                  className={`px-2 py-1 text-[10px] rounded border capitalize ${
                    filtres.tension.includes(t)
                      ? 'bg-propsight-50 text-propsight-700 border-propsight-300'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Profil locataire">
            <div className="flex gap-1 flex-wrap">
              {['etudiant', 'jeune_actif', 'couple_sans_enfant', 'famille', 'senior'].map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => toggle('profil', p)}
                  className={`px-2 py-1 text-[10px] rounded border capitalize ${
                    filtres.profil.includes(p)
                      ? 'bg-propsight-50 text-propsight-700 border-propsight-300'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {p.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Cohérence projet">
            <label>
              <span className="text-slate-600">Cohérence min : <strong>{filtres.coherence_min}%</strong></span>
              <input
                type="range"
                min={0}
                max={100}
                step={10}
                value={filtres.coherence_min}
                onChange={e => onChange({ ...filtres, coherence_min: Number(e.target.value) })}
                className="w-full mt-1 accent-propsight-600"
              />
            </label>
          </Section>

          <Section title="Divers">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={filtres.nouveauxSeuls}
                onChange={e => onChange({ ...filtres, nouveauxSeuls: e.target.checked })}
                className="rounded"
              />
              <span className="text-slate-700">Nouveautés (7 derniers jours)</span>
            </label>
          </Section>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-3">
          <button type="button" onClick={onClose} className="w-full rounded-md bg-propsight-600 text-white text-sm font-medium py-2 hover:bg-propsight-700">
            Appliquer
          </button>
        </div>
      </div>
    </>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">{title}</h4>
    {children}
  </div>
);

export default FiltresDrawer;
