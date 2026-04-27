import React, { useCallback } from 'react';
import { Building2, Home, Trees, ParkingCircle } from 'lucide-react';
import { EstimationFormData, TypeBien, EtatBien } from '../../types';
import { DPESelector } from '../../components/shared/DPESelector';

interface Props {
  value: Partial<EstimationFormData>;
  onChange: (field: keyof EstimationFormData, val: unknown) => void;
}

const TYPE_OPTIONS: { value: TypeBien; label: string; icon: React.ReactNode }[] = [
  { value: 'appartement', label: 'Appartement', icon: <Building2 size={16} /> },
  { value: 'maison', label: 'Maison', icon: <Home size={16} /> },
  { value: 'terrain', label: 'Terrain', icon: <Trees size={16} /> },
  { value: 'parking', label: 'Parking', icon: <ParkingCircle size={16} /> },
];

const ETATS: { value: EtatBien; label: string }[] = [
  { value: 'neuf', label: 'Neuf / VEFA' },
  { value: 'refait_a_neuf', label: 'Refait à neuf' },
  { value: 'bon', label: 'Bon état' },
  { value: 'a_rafraichir', label: 'À rafraîchir' },
  { value: 'a_renover', label: 'À rénover' },
  { value: 'a_restructurer', label: 'À restructurer' },
];

const CARACTERISTIQUES = [
  'balcon', 'terrasse', 'parking', 'cave', 'ascenseur', 'gardien', 'piscine', 'jardin', 'vue', 'calme', 'cheminée', 'fibre',
];

const FormulaireEstimation: React.FC<Props> = ({ value, onChange }) => {
  const toggleCarac = useCallback(
    (c: string) => {
      const current = value.caracteristiques || [];
      if (current.includes(c)) {
        onChange('caracteristiques', current.filter(x => x !== c));
      } else {
        onChange('caracteristiques', [...current, c]);
      }
    },
    [value.caracteristiques, onChange],
  );

  const field = (label: string, content: React.ReactNode) => (
    <div>
      <label className="text-xs text-slate-500 block mb-1">{label}</label>
      {content}
    </div>
  );

  const inputCls = 'w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400 bg-white';
  const numInput = (f: keyof EstimationFormData, placeholder?: string) => (
    <input
      type="number"
      value={(value[f] as number) || ''}
      onChange={e => onChange(f, Number(e.target.value))}
      placeholder={placeholder}
      className={inputCls}
      min={0}
    />
  );

  return (
    <div className="space-y-6">
      {/* Localisation */}
      <section>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Localisation</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-3">
            {field('Adresse',
              <input
                type="text"
                value={value.adresse || ''}
                onChange={e => onChange('adresse', e.target.value)}
                placeholder="12 rue du Hameau"
                className={inputCls}
              />
            )}
          </div>
          <div className="col-span-2">
            {field('Ville',
              <input
                type="text"
                value={value.ville || ''}
                onChange={e => onChange('ville', e.target.value)}
                placeholder="Paris"
                className={inputCls}
              />
            )}
          </div>
          <div>
            {field('Code postal',
              <input
                type="text"
                value={value.code_postal || ''}
                onChange={e => onChange('code_postal', e.target.value)}
                placeholder="75015"
                className={inputCls}
              />
            )}
          </div>
        </div>
      </section>

      {/* Type de bien */}
      <section>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Type de bien</p>
        <div className="grid grid-cols-4 gap-2">
          {TYPE_OPTIONS.map(({ value: v, label, icon }) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange('type_bien', v)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-md border text-xs font-medium transition-all ${
                value.type_bien === v
                  ? 'border-propsight-400 bg-propsight-50 text-propsight-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Caractéristiques */}
      <section>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Caractéristiques</p>
        <div className="grid grid-cols-3 gap-3">
          {field('Surface (m²)', numInput('surface'))}
          {field('Pièces', numInput('nb_pieces'))}
          {field('Chambres', numInput('nb_chambres'))}
          {field('Étage',
            <input
              type="number"
              value={value.etage ?? ''}
              onChange={e => onChange('etage', Number(e.target.value))}
              className={inputCls}
            />
          )}
          {field('Nb étages (imm.)', numInput('nb_etages'))}
          {value.type_bien === 'maison' && field('Surface terrain (m²)', numInput('surface_terrain'))}
        </div>
      </section>

      {/* Année, DPE, GES, État */}
      <section>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Qualité & DPE</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <DPESelector value={value.dpe || 'D'} onChange={v => onChange('dpe', v)} label="DPE" />
            <DPESelector value={value.ges || 'D'} onChange={v => onChange('ges', v)} label="GES" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('État général',
              <select
                value={value.etat || 'bon'}
                onChange={e => onChange('etat', e.target.value as EtatBien)}
                className={inputCls}
              >
                {ETATS.map(({ value: v, label }) => (
                  <option key={v} value={v}>{label}</option>
                ))}
              </select>
            )}
            {field('Année de construction',
              <input
                type="number"
                value={value.annee_construction || ''}
                onChange={e => onChange('annee_construction', Number(e.target.value))}
                placeholder="1985"
                min={1800}
                max={2026}
                className={inputCls}
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('Exposition',
              <select
                value={value.exposition || ''}
                onChange={e => onChange('exposition', e.target.value)}
                className={inputCls}
              >
                <option value="">Non renseigné</option>
                <option>Nord</option>
                <option>Sud</option>
                <option>Est</option>
                <option>Ouest</option>
                <option>Sud-Est</option>
                <option>Sud-Ouest</option>
                <option>Nord-Est</option>
                <option>Nord-Ouest</option>
              </select>
            )}
            {field('Charges mensuelles (€)',
              <input
                type="number"
                value={value.charges_mensuelles || ''}
                onChange={e => onChange('charges_mensuelles', Number(e.target.value))}
                min={0}
                className={inputCls}
              />
            )}
          </div>
        </div>
      </section>

      {/* Équipements */}
      <section>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Équipements</p>
        <div className="flex flex-wrap gap-2">
          {CARACTERISTIQUES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCarac(c)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all capitalize ${
                (value.caracteristiques || []).includes(c)
                  ? 'border-propsight-400 bg-propsight-50 text-propsight-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FormulaireEstimation;
