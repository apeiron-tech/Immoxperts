import React, { useState } from 'react';
import {
  Building2,
  Check,
  ClipboardList,
  FileText,
  RefreshCw,
  Save,
  Sparkles,
} from 'lucide-react';
import { useAtelierStore } from '../store/atelierStore';
import type { PlanMarketingPack, PlanMandatType, PlanMarketingSection, PlanMarketingSectionId } from '../types';
import { formatEuros } from 'app/features/biens/utils/format';

interface Props {
  onChangeSource: () => void;
}

const DEFAULT_SECTIONS: PlanMarketingSection[] = [
  {
    id: 'cible',
    title: "Cible d'acquéreurs",
    enabled: true,
    content: `Foyers solvables zone : 1 240
Profil dominant : jeunes actifs cadres, revenus 4 800 € - 7 200 €/mois
Distance moyenne de recherche : 25 min
Tension marché : 7,8/10 (forte)
Délai moyen de vente zone : 38 jours`,
  },
  {
    id: 'canaux',
    title: 'Canaux de diffusion',
    enabled: true,
    content: `✓ Portails immobiliers (Leboncoin, SeLoger, Bien'ici)
✓ Site agence Horizon avec landing dédiée
✓ Réseaux sociaux Instagram + Facebook (3 publications/semaine)
✓ LinkedIn (1 publication patrimoniale)
✓ Reel Instagram + TikTok pour visibilité jeune actif
✓ Email à notre base de 156 leads acquéreurs Paris 15e
✓ Google Business Profile (post Quartier)`,
  },
  {
    id: 'budget',
    title: 'Budget recommandé',
    enabled: true,
    content: `Pack Mandat Exclusif Premium
• Diffusion organique multi-canal : Inclus
• Boost Meta Ads ciblage local : 250 €
• Boost SeLoger Pack Privilège : Inclus dans abonnement
• Total budget pub : 250 € sur 14 jours`,
  },
  {
    id: 'exemples',
    title: 'Exemples de publications',
    enabled: true,
    content: `Aperçu post Instagram :
"📍 Paris 15e | Appartement T3 lumineux à 720 000 € · ✨ Pourquoi ce quartier ? • 47 ventes en 12 mois…"

Aperçu post Facebook :
"Nouveau bien à découvrir : T3 de 65 m² avec ascenseur, double exposition, vue dégagée sur les toits…"`,
  },
  {
    id: 'reporting',
    title: 'Reporting',
    enabled: true,
    content: `Vous recevrez chaque vendredi un rapport hebdomadaire incluant :
• Vues totales par canal
• Demandes de visite reçues
• Profil des prospects intéressés
• Recommandations d'ajustements`,
  },
];

const PlanMarketingWorkspace: React.FC<Props> = ({ onChangeSource }) => {
  const sourceLabel = useAtelierStore(s => s.source_label);
  const snapshot = useAtelierStore(s => s.snapshot);
  const [sections, setSections] = useState<PlanMarketingSection[]>(DEFAULT_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState<PlanMarketingSectionId>('cible');
  const [pack, setPack] = useState<PlanMarketingPack>('premium');
  const [mandat, setMandat] = useState<PlanMandatType>('exclusif');
  const [budget, setBudget] = useState(250);

  const activeSection = sections.find(s => s.id === activeSectionId);

  const toggleSection = (id: PlanMarketingSectionId) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));

  const updateContent = (id: PlanMarketingSectionId, content: string) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, content } : s));

  return (
    <>
      {/* Inputs panel */}
      <aside className="w-[320px] flex-shrink-0 border-r border-neutral-200 bg-white overflow-y-auto">
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">
              Estimation source
            </h3>
            <div className="bg-white border border-neutral-200 rounded-md p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-propsight-600" />
                <span className="text-[12.5px] font-semibold text-neutral-900 truncate">
                  {sourceLabel ?? 'AdV en cours'}
                </span>
              </div>
              {snapshot?.bien?.prix && (
                <div className="text-[11.5px] text-neutral-600">
                  Prix de présentation : {formatEuros(snapshot.bien.prix)}
                </div>
              )}
              {snapshot?.estimation?.avm_estimation && (
                <div className="text-[11.5px] text-neutral-600">
                  AVM : {formatEuros(snapshot.estimation.avm_estimation)} (indice {snapshot.estimation.avm_indice_confiance} %)
                </div>
              )}
              <button
                onClick={onChangeSource}
                className="mt-1.5 w-full h-7 inline-flex items-center justify-center gap-1.5 text-[11px] font-medium text-neutral-700 bg-neutral-50 border border-neutral-200 rounded hover:bg-neutral-100"
              >
                <RefreshCw size={11} />
                Changer
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">
              Type de mandat
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {(['exclusif', 'simple'] as PlanMandatType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setMandat(t)}
                  className={`h-8 rounded-md border text-[11.5px] font-medium ${
                    mandat === t
                      ? 'bg-propsight-600 border-propsight-600 text-white'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {t === 'exclusif' ? 'Exclusif' : 'Simple'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">
              Pack proposé
            </h3>
            <div className="space-y-1">
              {(['standard', 'premium', 'sur_mesure'] as PlanMarketingPack[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPack(p)}
                  className={`w-full h-8 inline-flex items-center justify-center text-[11.5px] font-medium rounded-md border ${
                    pack === p
                      ? 'bg-propsight-50 border-propsight-300 text-propsight-800'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {p === 'standard' ? 'Standard' : p === 'premium' ? 'Premium' : 'Sur-mesure'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">
              Budget pub
            </h3>
            <input
              type="range"
              min={0}
              max={1000}
              step={50}
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="w-full accent-propsight-600"
            />
            <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-0.5">
              <span>0 €</span>
              <span className="text-propsight-700 font-semibold">{budget} €</span>
              <span>1 000 €</span>
            </div>
          </div>

          <button className="w-full h-10 inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold text-white bg-propsight-600 rounded-md hover:bg-propsight-700">
            <Sparkles size={14} />
            Générer le plan
          </button>
        </div>
      </aside>

      {/* Editor */}
      <main className="flex-1 min-w-0 bg-neutral-50 flex flex-col overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-200 bg-white flex items-center gap-2">
          <ClipboardList size={15} className="text-propsight-600" />
          <h2 className="text-[14px] font-semibold text-neutral-900">Plan marketing pour AdV</h2>
          <span className="ml-auto text-[11px] text-neutral-500">5 sections actives</span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          <div className="max-w-3xl mx-auto grid grid-cols-12 gap-4">
            <div className="col-span-4 bg-white border border-neutral-200 rounded-lg overflow-hidden h-fit sticky top-0">
              <div className="px-3 py-2.5 border-b border-neutral-100">
                <h3 className="text-[12px] font-semibold text-neutral-900">Sections du plan</h3>
              </div>
              <ul>
                {sections.map(s => (
                  <li key={s.id}>
                    <button
                      onClick={() => setActiveSectionId(s.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[12px] text-left transition-colors border-l-2 ${
                        activeSectionId === s.id
                          ? 'bg-propsight-50 border-propsight-600 text-propsight-800 font-medium'
                          : 'border-transparent text-neutral-800 hover:bg-neutral-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={s.enabled}
                        onChange={e => { e.stopPropagation(); toggleSection(s.id); }}
                        onClick={e => e.stopPropagation()}
                        className="h-3.5 w-3.5 rounded border-neutral-300 text-propsight-600 focus:ring-propsight-500"
                      />
                      <span className="flex-1 truncate">{s.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-8 space-y-3">
              {activeSection && activeSection.enabled ? (
                <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="text-[13px] font-semibold text-neutral-900">{activeSection.title}</h3>
                    <button className="text-[11px] inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900">
                      <RefreshCw size={11} /> Régénérer section
                    </button>
                  </div>
                  <textarea
                    value={activeSection.content}
                    onChange={e => updateContent(activeSection.id, e.target.value)}
                    className="w-full min-h-[280px] p-4 text-[13px] leading-relaxed text-neutral-800 font-sans resize-y focus:outline-none whitespace-pre-wrap"
                  />
                  <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50/40 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500">
                      Datapoints : profondeur solvable · tension · délai · médiane
                    </span>
                    <button className="h-7 inline-flex items-center gap-1 px-2.5 text-[11.5px] font-medium text-propsight-700 bg-propsight-50 border border-propsight-200 rounded-md hover:bg-propsight-100">
                      <Sparkles size={11} /> Variantes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-dashed border-neutral-200 rounded-lg p-8 text-center text-[13px] text-neutral-500">
                  Cette section est désactivée. Réactivez-la depuis la liste à gauche.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Preview PDF panel */}
      <aside className="w-[320px] flex-shrink-0 border-l border-neutral-200 bg-white overflow-y-auto">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-propsight-600" />
            <h3 className="text-[12px] font-semibold text-neutral-900">Preview du rapport AdV</h3>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map(p => (
              <div key={p} className="aspect-[1/1.414] bg-neutral-50 border border-neutral-200 rounded-md overflow-hidden flex flex-col">
                <div className="h-3 bg-propsight-500 flex-shrink-0" />
                <div className="p-2.5 space-y-1.5 flex-1">
                  <div className="h-1.5 bg-neutral-200 rounded w-3/4" />
                  <div className="h-1.5 bg-neutral-200 rounded w-1/2" />
                  <div className="h-px bg-neutral-200 my-1.5" />
                  <div className="h-1 bg-neutral-100 rounded" />
                  <div className="h-1 bg-neutral-100 rounded" />
                  <div className="h-1 bg-neutral-100 rounded w-5/6" />
                  <div className="h-1 bg-neutral-100 rounded w-2/3" />
                  <div className="text-[8px] text-neutral-400 mt-2">Page {p}/3</div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-neutral-100 space-y-1.5">
            <button className="w-full h-9 inline-flex items-center justify-center gap-1.5 text-[12px] font-medium text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50">
              <RefreshCw size={12} /> Régénérer
            </button>
            <button className="w-full h-9 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold text-white bg-propsight-600 rounded-md hover:bg-propsight-700">
              <Save size={12} /> Sauver dans rapport
            </button>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">
              Données sources
            </h4>
            <ul className="text-[11px] text-neutral-600 space-y-0.5">
              <li className="flex items-center gap-1.5"><Check size={10} className="text-success-700" /> Observatoire (tension, profondeur)</li>
              <li className="flex items-center gap-1.5"><Check size={10} className="text-success-700" /> DVF (médiane, ventes 12 m)</li>
              <li className="flex items-center gap-1.5"><Check size={10} className="text-success-700" /> Estimation AVM</li>
              <li className="flex items-center gap-1.5"><Check size={10} className="text-success-700" /> Base leads (156 leads)</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 mb-1.5 flex items-center gap-1">
              <Building2 size={11} /> Pack {pack}
            </h4>
            <div className="text-[11px] text-neutral-600">
              Mandat {mandat} · budget pub {budget} €
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PlanMarketingWorkspace;
