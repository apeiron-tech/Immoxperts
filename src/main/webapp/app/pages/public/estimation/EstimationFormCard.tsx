import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import AddressAutocomplete from 'app/shared/AddressAutocomplete';
import {
  CONDITIONS,
  EstimationFormErrors,
  EstimationFormValues,
  ROOM_OPTIONS,
  toApiRequest,
  validateEstimation,
} from './lib/schema';
import { EstimationResult, postEstimation } from './lib/api';

interface Props {
  onResult: (result: EstimationResult, request: ReturnType<typeof toApiRequest>) => void;
  initial?: Partial<EstimationFormValues>;
}

const DEFAULT_VALUES: EstimationFormValues = {
  address: null,
  propertyType: 'appartement',
  surface: '',
  rooms: '',
  condition: 'bon',
};

const EstimationFormCard: React.FC<Props> = ({ onResult, initial }) => {
  const [values, setValues] = useState<EstimationFormValues>({ ...DEFAULT_VALUES, ...(initial ?? {}) });
  const [errors, setErrors] = useState<EstimationFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = <K extends keyof EstimationFormValues>(key: K, v: EstimationFormValues[K]) => {
    setValues(s => ({ ...s, [key]: v }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const errs = validateEstimation(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const request = toApiRequest(values);
    setLoading(true);
    try {
      const result = await postEstimation(request);
      onResult(result, request);
    } catch (err) {
      const apiError = err as { kind?: string; message?: string };
      if (apiError.kind === 'insufficient_data') {
        setServerError(
          apiError.message ||
            'Pas assez de transactions récentes dans ce secteur pour produire une estimation fiable.',
        );
      } else {
        setServerError("Impossible d'estimer votre bien pour le moment. Réessayez dans quelques instants.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-lg border border-slate-200 bg-white p-6 lg:p-8 w-full"
      aria-label="Formulaire d’estimation"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="estim-address" className="block text-[13px] font-medium text-slate-700 mb-1.5">
            Adresse du bien
          </label>
          <AddressAutocomplete
            id="estim-address"
            value={values.address}
            onChange={a => set('address', a)}
            placeholder="22 rue de la Pompe, 75116 Paris"
            invalid={!!errors.address}
          />
          {errors.address ? <p className="mt-1 text-[12px] text-rose-600">{errors.address}</p> : null}
        </div>

        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Type de bien</label>
          <div className="grid grid-cols-2 gap-2">
            {(['appartement', 'maison'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => set('propertyType', t)}
                className={`h-10 rounded-md border text-[13.5px] font-medium transition-colors ${
                  values.propertyType === t
                    ? 'border-propsight-500 bg-propsight-50 text-propsight-700'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t === 'appartement' ? 'Appartement' : 'Maison'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="estim-surface" className="block text-[13px] font-medium text-slate-700 mb-1.5">
              Surface
            </label>
            <div className="relative">
              <input
                id="estim-surface"
                type="number"
                inputMode="numeric"
                min={9}
                max={1000}
                value={values.surface}
                onChange={e => set('surface', e.target.value)}
                placeholder="Surface en m²"
                aria-invalid={!!errors.surface}
                className={`w-full h-11 px-3 pr-10 text-[14px] tabular-nums rounded-md border bg-white outline-none transition-colors ${
                  errors.surface
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-slate-400">m²</span>
            </div>
            {errors.surface ? <p className="mt-1 text-[12px] text-rose-600">{errors.surface}</p> : null}
          </div>
          <div>
            <label htmlFor="estim-rooms" className="block text-[13px] font-medium text-slate-700 mb-1.5">
              Pièces
            </label>
            <select
              id="estim-rooms"
              value={values.rooms}
              onChange={e => set('rooms', e.target.value)}
              aria-invalid={!!errors.rooms}
              className={`w-full h-11 px-3 text-[14px] rounded-md border bg-white outline-none transition-colors ${
                errors.rooms
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500'
              }`}
            >
              <option value="" disabled>
                Nombre de pièces
              </option>
              {ROOM_OPTIONS.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.rooms ? <p className="mt-1 text-[12px] text-rose-600">{errors.rooms}</p> : null}
          </div>
        </div>

        <div>
          <label htmlFor="estim-condition" className="block text-[13px] font-medium text-slate-700 mb-1.5">
            État du bien
          </label>
          <select
            id="estim-condition"
            value={values.condition}
            onChange={e => set('condition', e.target.value as EstimationFormValues['condition'])}
            className="w-full h-11 px-3 text-[14px] rounded-md border border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500 outline-none bg-white"
          >
            {CONDITIONS.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {serverError ? (
          <div role="alert" className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">
            {serverError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-[14.5px] font-semibold transition-colors disabled:opacity-60"
        >
          {loading ? 'Estimation en cours…' : 'Estimer mon bien'}
          {!loading ? <ChevronRight size={15} /> : null}
        </button>

        <p className="text-[12px] text-slate-500 leading-relaxed">
          Estimation indicative générée à partir des données publiques DVF. Ne constitue pas un avis de valeur officiel.
        </p>
      </div>
    </form>
  );
};

export default EstimationFormCard;
