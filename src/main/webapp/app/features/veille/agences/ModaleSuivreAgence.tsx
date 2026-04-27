import React, { useState } from 'react';
import { X, Search, Check, MapPin } from 'lucide-react';
import { AgenceConcurrente } from '../types';
import { SIRENE_RESULTS } from '../_mocks/agences';
import { PrimaryButton, SecondaryButton } from '../components/shared/primitives';

interface Props {
  onClose: () => void;
  onFollow: (a: AgenceConcurrente) => void;
}

const ModaleSuivreAgence: React.FC<Props> = ({ onClose, onFollow }) => {
  const [query, setQuery] = useState('');
  const [selectedSiren, setSelectedSiren] = useState<string | null>(null);
  const [options, setOptions] = useState({
    new_listings: true,
    price_drops: true,
    similar_biens: false,
    mandats: false,
  });
  const [frequency, setFrequency] = useState<'immediate' | 'daily' | 'weekly'>('daily');

  const results = query
    ? SIRENE_RESULTS.filter(
        r => r.name.toLowerCase().includes(query.toLowerCase()) || r.siren.includes(query) || r.ville.toLowerCase().includes(query.toLowerCase()),
      )
    : SIRENE_RESULTS.slice(0, 3);

  const selected = SIRENE_RESULTS.find(r => r.siren === selectedSiren);

  const handleFollow = () => {
    if (!selected) return;
    const ag: AgenceConcurrente = {
      id: 'ag_' + Math.random().toString(36).slice(2, 9),
      name: selected.name,
      siren: selected.siren,
      carte_t: selected.carte_t,
      adresse: selected.adresse,
      ville: selected.ville,
      code_postal: selected.code_postal,
      logo_initials: selected.name
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase(),
      logo_color: '#7C3AED',
      zones: [{ zone_id: 'z_new', label: selected.ville, strength: 'moyenne', stock_actif: 0 }],
      zone_principale: selected.ville,
      stock_actif: 0,
      nouvelles_annonces_7d: 0,
      nouvelles_annonces_30d: 0,
      baisses_prix_30d: 0,
      annonces_anciennes_count: 0,
      types_biens_dominants: [],
      biens_similaires_count: 0,
      mandats_simples_concurrents_count: 0,
      has_mandat_simple_sous_pression: false,
      followed: true,
      status_suivi: 'Sous surveillance',
      alertes_actives: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    // eslint-disable-next-line no-console
    console.log('[Veille] Agence suivie', { ag, options, frequency });
    onFollow(ag);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-[620px] max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-[15px] font-semibold text-slate-900">Suivre une agence concurrente</h2>
          <button onClick={onClose} className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-100">
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Search */}
          <div>
            <label className="text-[11.5px] font-medium text-slate-700 mb-1 block">
              Rechercher par nom, SIREN, SIRET ou ville
            </label>
            <div className="relative">
              <Search size={13} className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Agence Métropole"
                className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 bg-white text-[13px] focus:outline-none focus:border-propsight-300 focus:ring-1 focus:ring-propsight-200"
              />
            </div>
          </div>

          {/* Résultats */}
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
              Résultats (source INSEE SIRENE)
            </div>
            <div className="space-y-1.5">
              {results.map(r => (
                <button
                  key={r.siren}
                  onClick={() => setSelectedSiren(r.siren)}
                  className={`w-full text-left p-2.5 rounded-md border transition-colors ${
                    selectedSiren === r.siren
                      ? 'border-propsight-300 bg-propsight-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <span
                        className={`h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedSiren === r.siren ? 'border-propsight-600' : 'border-slate-300'
                        }`}
                      >
                        {selectedSiren === r.siren && <span className="h-2 w-2 rounded-full bg-propsight-600" />}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-medium text-slate-900">
                          {r.name} · {r.ville}
                        </div>
                        <div className="text-[10.5px] text-slate-500 mt-0.5">
                          SIREN {r.siren}
                          {r.carte_t && <> · Carte T {r.carte_t}</>}
                        </div>
                        <div className="text-[10.5px] text-slate-500 inline-flex items-center gap-1 mt-0.5">
                          <MapPin size={9} />
                          {r.adresse}, {r.code_postal} {r.ville}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Activité NAF : {r.naf}</div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {results.length === 0 && (
                <div className="text-[11.5px] text-slate-400 italic px-2">Aucun résultat.</div>
              )}
            </div>
          </div>

          {/* Config du suivi */}
          <div className="border-t border-slate-200 pt-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Configuration du suivi</div>
            <div className="space-y-1.5">
              <CheckRow checked={options.new_listings} onChange={() => setOptions(o => ({ ...o, new_listings: !o.new_listings }))} label="Nouvelles annonces" />
              <CheckRow checked={options.price_drops} onChange={() => setOptions(o => ({ ...o, price_drops: !o.price_drops }))} label="Baisses de prix" />
              <CheckRow
                checked={options.similar_biens}
                onChange={() => setOptions(o => ({ ...o, similar_biens: !o.similar_biens }))}
                label="Biens similaires à mon portefeuille (V1.5)"
                disabled
              />
              <CheckRow
                checked={options.mandats}
                onChange={() => setOptions(o => ({ ...o, mandats: !o.mandats }))}
                label="Mandats simples en concurrence (V1.5)"
                disabled
              />
            </div>

            <div className="mt-3">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Fréquence</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'immediate', label: 'Immédiat' },
                  { value: 'daily', label: 'Quotidien' },
                  { value: 'weekly', label: 'Hebdo' },
                ].map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFrequency(f.value as 'immediate' | 'daily' | 'weekly')}
                    className={`h-9 rounded-md border text-[12px] transition-colors ${
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
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 flex-shrink-0">
          <SecondaryButton onClick={onClose}>Annuler</SecondaryButton>
          <PrimaryButton onClick={handleFollow} disabled={!selected}>
            <Check size={12} />
            Suivre cette agence
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

const CheckRow: React.FC<{ checked: boolean; onChange: () => void; label: string; disabled?: boolean }> = ({
  checked,
  onChange,
  label,
  disabled,
}) => (
  <label className={`flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
    <span
      className={`h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 ${
        checked && !disabled ? 'bg-propsight-600 border-propsight-600 text-white' : 'border-slate-300 bg-white'
      }`}
      onClick={e => {
        if (disabled) return;
        e.preventDefault();
        onChange();
      }}
    >
      {checked && <Check size={10} />}
    </span>
    <span className="text-[12px] text-slate-700">{label}</span>
  </label>
);

export default ModaleSuivreAgence;
