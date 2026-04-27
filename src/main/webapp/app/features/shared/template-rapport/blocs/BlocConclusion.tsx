import React, { useMemo } from 'react';
import { Home, Tag, BarChart2, RefreshCw } from 'lucide-react';
import { BlocComponentProps } from '../types';

type UnitePrix = 'eur' | 'eur_m2';
type UniteHonoraires = 'eur' | 'pct';
type ChargeHonoraires = 'acquereur' | 'vendeur';

interface ConclusionContent {
  texte?: string;
  prix_retenu?: number;
  unite_prix?: UnitePrix;
  honoraires_pct?: number;
  unite_honoraires?: UniteHonoraires;
  charge_honoraires?: ChargeHonoraires;
  justification_ecart?: string;
}

const BlocConclusion: React.FC<BlocComponentProps> = ({ data, blocConfig, onContentChange }) => {
  const { estimation } = data;
  const avm = estimation.avm;
  const content = (blocConfig.customContent || {}) as ConclusionContent;

  const prixAvm = avm?.prix.estimation || 0;
  const surface = estimation.bien.surface || 1;

  const prixRetenu = content.prix_retenu ?? prixAvm;
  const unitePrix: UnitePrix = content.unite_prix || 'eur';
  const honorairesPct = content.honoraires_pct ?? 6;
  const uniteHonoraires: UniteHonoraires = content.unite_honoraires || 'pct';
  const charge: ChargeHonoraires = content.charge_honoraires || 'acquereur';

  const prixM2 = useMemo(() => Math.round(prixRetenu / surface), [prixRetenu, surface]);
  const honorairesEur = useMemo(() => Math.round((prixRetenu * honorairesPct) / 100), [prixRetenu, honorairesPct]);
  const netVendeur = useMemo(() => prixRetenu - honorairesEur, [prixRetenu, honorairesEur]);

  const ecartPct = prixAvm ? ((prixRetenu - prixAvm) / prixAvm) * 100 : 0;
  const ecartCritique = Math.abs(ecartPct) > 5;

  const textePardefaut =
    "À l'issue de cette analyse croisée des données de marché, des transactions comparables et de notre modèle d'estimation propriétaire, nous recommandons une mise en marché dans la fourchette indiquée ci-dessous.";
  const texte = content.texte ?? textePardefaut;

  return (
    <div className="rapport-bloc rapport-conclusion px-10 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-4">Conclusion et valeur retenue</h2>

      <div className="bg-slate-50 rounded-lg p-5 mb-6 border-l-4 border-propsight-500">
        <p className="text-sm text-slate-700 leading-relaxed italic">{texte}</p>
      </div>

      <div className="rounded-lg border-2 border-propsight-200 bg-gradient-to-br from-propsight-50/50 to-white p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-4 flex items-center gap-2">
          <BarChart2 size={14} /> Notre estimation
        </div>

        {/* Prix de vente */}
        <Ligne icon={<BarChart2 size={16} className="text-propsight-600" />} label="Prix de vente">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={unitePrix === 'eur' ? prixRetenu : prixM2}
              onChange={e => {
                const v = parseFloat(e.target.value) || 0;
                onContentChange({ prix_retenu: unitePrix === 'eur' ? v : v * surface });
              }}
              className="w-32 text-right tabular-nums px-2 py-1 border border-slate-200 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
            />
            <UniteToggle
              value={unitePrix}
              options={[{ value: 'eur', label: '€' }, { value: 'eur_m2', label: '€/m²' }]}
              onChange={v => onContentChange({ unite_prix: v as UnitePrix })}
            />
          </div>
        </Ligne>
        <p className="text-xs text-slate-500 ml-7 mb-4 tabular-nums">
          {unitePrix === 'eur' ? `${prixM2.toLocaleString('fr-FR')} €/m²` : `${prixRetenu.toLocaleString('fr-FR')} €`}
        </p>

        {/* Honoraires */}
        <Ligne icon={<Tag size={16} className="text-propsight-600" />} label="Honoraires">
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              value={uniteHonoraires === 'pct' ? honorairesPct : honorairesEur}
              onChange={e => {
                const v = parseFloat(e.target.value) || 0;
                if (uniteHonoraires === 'pct') {
                  onContentChange({ honoraires_pct: v });
                } else {
                  onContentChange({ honoraires_pct: prixRetenu > 0 ? (v / prixRetenu) * 100 : 0 });
                }
              }}
              className="w-32 text-right tabular-nums px-2 py-1 border border-slate-200 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
            />
            <UniteToggle
              value={uniteHonoraires}
              options={[{ value: 'eur', label: '€' }, { value: 'pct', label: '%' }]}
              onChange={v => onContentChange({ unite_honoraires: v as UniteHonoraires })}
            />
          </div>
        </Ligne>
        <div className="ml-7 mb-2 flex items-center gap-3">
          <p className="text-xs text-slate-500 tabular-nums">{honorairesEur.toLocaleString('fr-FR')} € TTC</p>
          <span className="text-xs text-slate-400">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">À la charge de</span>
            <select
              value={charge}
              onChange={e => onContentChange({ charge_honoraires: e.target.value as ChargeHonoraires })}
              className="text-xs border border-slate-200 rounded px-1.5 py-0.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-propsight-400"
            >
              <option value="acquereur">l'Acquéreur</option>
              <option value="vendeur">le Vendeur</option>
            </select>
          </div>
        </div>

        <div className="my-4 border-t border-slate-200" />

        {/* Net vendeur */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home size={18} className="text-emerald-600" />
            <span className="text-sm font-semibold text-slate-900">Net vendeur</span>
          </div>
          <span className="text-2xl font-bold text-emerald-700 tabular-nums">{netVendeur.toLocaleString('fr-FR')} €</span>
        </div>

        {/* Justification écart si > 5% */}
        {ecartCritique && avm && (
          <div className="mt-5 pt-4 border-t border-amber-200 bg-amber-50/40 -mx-6 -mb-6 px-6 pb-5 rounded-b-lg">
            <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
              <RefreshCw size={12} />
              Votre estimation dévie de {ecartPct > 0 ? '+' : ''}{ecartPct.toFixed(1)}% par rapport à l'AVM ({prixAvm.toLocaleString('fr-FR')} €).
              Justification obligatoire :
            </p>
            <textarea
              value={content.justification_ecart || ''}
              onChange={e => onContentChange({ justification_ecart: e.target.value })}
              rows={2}
              placeholder="Expliquez pourquoi votre prix dévie de l'AVM (ex : travaux récents, contexte urgent, demande locale spécifique...)"
              className={`w-full text-xs px-3 py-2 border rounded resize-none focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                content.justification_ecart ? 'border-amber-300 bg-white' : 'border-amber-400 bg-white'
              }`}
            />
            <p className="text-[10px] text-slate-500 mt-1.5 italic">Cette justification est conservée dans la timeline mais n'apparaît pas dans le PDF envoyé au client.</p>
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

export default BlocConclusion;
