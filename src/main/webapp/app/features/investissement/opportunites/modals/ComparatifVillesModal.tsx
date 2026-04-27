import React, { useEffect } from 'react';
import { X, Save, MapPin, Trophy } from 'lucide-react';
import { Ville, ProjetInvestisseur } from '../../types';
import { MOCK_VILLES } from '../../_mocks/villes';
import { labelTension, labelProfondeur, labelLocataire } from '../../utils/persona';
import { formatPrice } from '../../utils/finances';

interface Props {
  villeIds: string[];
  projet: ProjetInvestisseur | null;
  onClose: () => void;
}

const ComparatifVillesModal: React.FC<Props> = ({ villeIds, projet, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const villes = MOCK_VILLES.filter(v => villeIds.includes(v.id));
  if (villes.length === 0) return null;

  const best = villes.reduce((a, b) => (b.rendement_median > a.rendement_median ? b : a));

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4">
        <div className="w-full max-w-[1300px] bg-white rounded-lg shadow-2xl my-4 overflow-hidden">
          <div className="border-b border-slate-200 p-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 inline-flex items-center gap-2">
                <MapPin size={16} className="text-propsight-600" />
                Comparaison de zones
              </h2>
              <p className="text-xs text-slate-500">
                Projet actif : {projet?.name ?? 'Aucun'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 px-2.5 py-1.5 hover:bg-slate-50">
                <Save size={13} />
                Enregistrer
              </button>
              <button type="button" onClick={onClose} className="p-1 rounded hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-4">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left py-2 text-[10px] uppercase tracking-wider font-semibold text-slate-500 w-48">Critère</th>
                  {villes.map(v => (
                    <th key={v.id} className={`text-left py-2 px-3 ${v.id === best.id ? 'bg-propsight-50' : ''}`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="font-semibold text-slate-900">{v.nom}</div>
                        {v.id === best.id && <Trophy size={12} className="text-propsight-600" />}
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">{v.code_postal} · {v.distance ?? ''}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <SectionRow cols={villes.length} title="Prix & marché" />
                <VRow label="Prix m² médian" values={villes.map(v => `${v.prix_m2_median.toLocaleString('fr-FR')} €/m²`)} villes={villes} best={best} />
                <VRow label="Évolution prix 5 ans" values={villes.map(v => `+${v.evol_prix_5a}%`)} villes={villes} best={best} />
                <VRow label="Loyer m² médian" values={villes.map(v => `${v.loyer_m2_median.toFixed(1)} €/m²`)} villes={villes} best={best} />
                <VRow label="Évolution loyers 5 ans" values={villes.map(v => `+${v.evol_loyers_5a}%`)} villes={villes} best={best} />

                <SectionRow cols={villes.length} title="Rendement & demande" />
                <VRow label="Rendement médian" values={villes.map(v => `${v.rendement_median}%`)} villes={villes} best={best} highlight />
                <VRow label="Tension locative" values={villes.map(v => labelTension(v.tension))} villes={villes} best={best} />
                <VRow label="Vacance" values={villes.map(v => `${v.vacance_pct}%`)} villes={villes} best={best} />
                <VRow label="Profondeur demande" values={villes.map(v => labelProfondeur(v.profondeur))} villes={villes} best={best} />

                <SectionRow cols={villes.length} title="Profil & contexte" />
                <VRow label="Profil dominant" values={villes.map(v => labelLocataire(v.profil_dominant))} villes={villes} best={best} />
                <VRow label="Part CSP+" values={villes.map(v => `${v.part_csp_plus}%`)} villes={villes} best={best} />
                <VRow label="Signal PLU" values={villes.map(v => v.signal_plu)} villes={villes} best={best} />
                <VRow label="Avis habitants" values={villes.map(v => `${v.avis_note}/5`)} villes={villes} best={best} />

                <SectionRow cols={villes.length} title="Compatibilité projet" />
                <VRow label="Budget compatible" values={villes.map(v => `≥ ${formatPrice(v.budget_min_compatible)}`)} villes={villes} best={best} />
              </tbody>
            </table>

            <div className="mt-4 rounded-md bg-propsight-50 border border-propsight-200 p-3">
              <div className="text-[10px] uppercase tracking-wide font-semibold text-propsight-700 mb-1">Recommandation Propsight</div>
              <p className="text-xs text-slate-800">
                <strong>{best.nom}</strong> offre le meilleur équilibre rendement/tension pour votre projet. Profondeur de marché {labelProfondeur(best.profondeur).toLowerCase()} et profil dominant {labelLocataire(best.profil_dominant).toLowerCase()}.
              </p>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button type="button" className="rounded-md bg-propsight-600 text-white text-xs font-medium py-2 hover:bg-propsight-700">
                Choisir comme cible du projet
              </button>
              <button type="button" className="rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 py-2 hover:bg-slate-50">
                Voir les opportunités de cette zone
              </button>
              <button type="button" className="rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 py-2 hover:bg-slate-50">
                Suivre cette zone
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionRow: React.FC<{ cols: number; title: string }> = ({ cols, title }) => (
  <tr>
    <td colSpan={cols + 1} className="pt-4 pb-1 text-[10px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
      {title}
    </td>
  </tr>
);

const VRow: React.FC<{ label: string; values: string[]; villes: Ville[]; best: Ville; highlight?: boolean }> = ({ label, values, villes, best, highlight }) => (
  <tr className="border-b border-slate-50">
    <td className="py-2 text-slate-600">{label}</td>
    {values.map((v, i) => (
      <td key={i} className={`py-2 px-3 tabular-nums ${villes[i].id === best.id ? 'bg-propsight-50/40 font-semibold text-propsight-700' : highlight ? 'font-semibold text-slate-900' : 'text-slate-900 font-medium'}`}>
        {v}
      </td>
    ))}
  </tr>
);

export default ComparatifVillesModal;
