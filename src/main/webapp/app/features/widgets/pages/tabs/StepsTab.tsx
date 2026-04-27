import React, { useMemo, useState } from 'react';
import { Plus, Info, ChevronDown, ChevronRight } from 'lucide-react';
import type { WidgetInstance } from '../../types';
import { SELLER_STEPS, INVESTOR_STEPS } from '../../_mocks/widgets';
import StepListItem from '../../components/StepListItem';
import PreviewPane from '../../components/PreviewPane';
import WidgetStepPreview from '../../components/WidgetStepPreview';

interface Props {
  widget: WidgetInstance;
}

const INVESTOR_SCENARIOS = [
  { id: 'rendement', label: 'Rendement locatif', checked: true },
  { id: 'patrimonial', label: 'Valorisation patrimoniale', checked: true },
  { id: 'durable', label: 'Impact & durabilité', checked: true },
  { id: 'diversification', label: 'Diversification', checked: false },
];

const INVESTOR_KPI_CHIPS = [
  { id: 'revenus', label: 'Revenus réguliers', checked: true },
  { id: 'cashflow', label: 'Cashflow', checked: true },
  { id: 'plus-value', label: 'Plus-value', checked: true },
  { id: 'long-terme', label: 'Long terme', checked: true },
  { id: 'esg', label: 'ESG', checked: false },
];

const StepsTab: React.FC<Props> = ({ widget }) => {
  const isSeller = widget.type === 'estimation_vendeur';
  const steps = useMemo(() => (isSeller ? SELLER_STEPS : INVESTOR_STEPS), [isSeller]);
  const [selectedId, setSelectedId] = useState(isSeller ? 'resultat' : 'strategie');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [behaviorOpen, setBehaviorOpen] = useState(false);

  const [scenarios, setScenarios] = useState(INVESTOR_SCENARIOS);
  const [chips, setChips] = useState(INVESTOR_KPI_CHIPS);

  const selected = steps.find(s => s.id === selectedId) ?? steps[0];

  const [title, setTitle] = useState('Estimez votre bien en quelques minutes');
  const [subtitle, setSubtitle] = useState('Voici une estimation indicative de votre bien');
  const [desc, setDesc] = useState('Cette estimation est basée sur les informations que vous avez fournies et les données du marché local.');
  const [cta, setCta] = useState('Continuer');
  const [reassurance, setReassurance] = useState("Cette estimation n'a pas de valeur contractuelle.");

  const isResult = selected.id === 'resultat' || selected.id === 'strategie';
  const isStrategie = selected.id === 'strategie' && !isSeller;

  const activeScenarios = scenarios.filter(s => s.checked).length;
  const activeChips = chips.filter(c => c.checked).length;

  return (
    <div className="grid grid-cols-[280px_1fr_360px] gap-4 h-[calc(100vh-220px)]">
      {/* Colonne gauche — liste */}
      <div className="bg-white border border-slate-200 rounded-md flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Étapes du widget</h3>
          <p className="text-xs text-slate-500 mt-0.5">Glissez-déposez pour réorganiser.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {steps.map(s => (
            <StepListItem key={s.id} step={s} selected={s.id === selectedId} onSelect={() => setSelectedId(s.id)} />
          ))}
        </div>
        <div className="p-3 border-t border-slate-200">
          <button
            disabled
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-md border border-dashed border-slate-300 text-slate-400 cursor-not-allowed"
          >
            <Plus size={14} />
            Ajouter une étape
          </button>
        </div>
      </div>

      {/* Colonne centre — preview */}
      <PreviewPane
        device={device}
        onDeviceChange={setDevice}
        title="Aperçu de l'étape"
        footerNote="Aperçu non interactif. Le rendu final peut varier selon votre site."
      >
        <WidgetStepPreview widget={widget} step={selected} stepsCount={steps.length} />
      </PreviewPane>

      {/* Colonne droite — config */}
      <div className="bg-white border border-slate-200 rounded-md flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Configuration de l'étape</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
            Étape {selected.index} sur {steps.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {/* Statut */}
          <div className="px-4 py-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Statut de l'étape</div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="relative w-9 h-5 bg-slate-200 peer-checked:bg-propsight-500 rounded-full transition-colors">
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-sm text-slate-700">Étape active</span>
            </label>
          </div>

          {/* Contenu */}
          <div className="px-4 py-4 space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contenu</div>
            <FieldInput label="Titre" value={title} onChange={setTitle} max={80} />
            <FieldInput label="Sous-titre" value={subtitle} onChange={setSubtitle} max={100} />
            <FieldTextarea label="Texte descriptif" value={desc} onChange={setDesc} max={200} />
            <FieldInput label="CTA principal" value={cta} onChange={setCta} max={30} />
            {isResult && <FieldInput label="Texte de réassurance" value={reassurance} onChange={setReassurance} max={100} />}
          </div>

          {/* Champs */}
          {selected.formFields && selected.formFields.length > 0 && (
            <div className="px-4 py-4 space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Champs</div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Champs visibles</label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-md border border-slate-200 min-h-9">
                  {selected.formFields.map(f => (
                    <span key={f} className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] rounded bg-propsight-50 text-propsight-700">
                      {f.replace(/_/g, ' ')}
                      <button className="text-propsight-400 hover:text-propsight-700">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Champs obligatoires</label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-md border border-slate-200 min-h-9">
                  <span className="text-xs text-slate-400">Aucun champ obligatoire</span>
                </div>
              </div>
              <button className="text-xs text-propsight-600 hover:text-propsight-700 font-medium">
                Gérer les champs disponibles →
              </button>
            </div>
          )}

          {/* Résultat vendeur — bloc spécifique */}
          {selected.id === 'resultat' && isSeller && (
            <div className="px-4 py-4 space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Visibilité de la fourchette</div>
              <Toggle label="Afficher l'estimation indicative" defaultChecked />
              <Toggle label="Afficher le prix au m²" />
              <Toggle label="Afficher l'indice de confiance" defaultChecked />
            </div>
          )}

          {/* Scénarios affichés (investisseur, étape Stratégie) */}
          {isStrategie && (
            <>
              <div className="px-4 py-4 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Scénarios affichés</div>
                  <span className="text-[10px] text-slate-400">{activeScenarios}/{scenarios.length} sélectionnés</span>
                </div>
                {scenarios.map(s => (
                  <label key={s.id} className="flex items-center gap-2 text-sm py-1 group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.checked}
                      onChange={() =>
                        setScenarios(prev => prev.map(x => (x.id === s.id ? { ...x, checked: !x.checked } : x)))
                      }
                      className="rounded text-propsight-600"
                    />
                    <span className={s.checked ? 'text-slate-900' : 'text-slate-500'}>{s.label}</span>
                  </label>
                ))}
                <button disabled className="text-xs text-slate-400 font-medium mt-1 cursor-not-allowed">
                  + Ajouter un scénario
                </button>
              </div>

              <div className="px-4 py-4 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Chips KPI visibles</div>
                  <span className="text-[10px] text-slate-400">{activeChips}/{chips.length} sélectionnés</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {chips.map(c => (
                    <button
                      key={c.id}
                      onClick={() =>
                        setChips(prev => prev.map(x => (x.id === c.id ? { ...x, checked: !x.checked } : x)))
                      }
                      className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                        c.checked
                          ? 'bg-propsight-50 border-propsight-200 text-propsight-700'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Boutons d'action */}
          <div className="px-4 py-4 space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Boutons d'action</div>
            <FieldInput label="Texte bouton précédent" value="← Retour" onChange={() => {}} />
            <FieldInput label="Texte bouton suivant" value="Continuer →" onChange={() => {}} />
          </div>

          {/* Comportement */}
          <div className="px-4 py-4">
            <button
              onClick={() => setBehaviorOpen(o => !o)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wide"
            >
              Comportement
              {behaviorOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
            {behaviorOpen && (
              <div className="mt-3 space-y-2.5">
                <Toggle label="Autoriser la sélection d'un seul scénario" defaultChecked={isStrategie} />
                <Toggle label="Afficher les icônes des scénarios" defaultChecked />
                <Toggle
                  label="Rendre cette étape optionnelle"
                  help={
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Info size={11} />
                      L'utilisateur peut sauter cette étape.
                    </span>
                  }
                />
              </div>
            )}
          </div>

          {/* Avancé */}
          <div className="px-4 py-4">
            <button
              onClick={() => setAdvancedOpen(o => !o)}
              className="w-full text-xs text-propsight-600 hover:text-propsight-700 font-medium flex items-center justify-between"
            >
              Options avancées
              {advancedOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
            {advancedOpen && (
              <div className="mt-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5">
                <div>• Animation d'entrée : fade-in</div>
                <div>• Conditions d'affichage : aucune</div>
                <div>• Webhook à l'arrivée sur cette étape : non</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Petits composants internes pour les champs
const FieldInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; max?: number }> = ({
  label,
  value,
  onChange,
  max,
}) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <label className="text-xs text-slate-500">{label}</label>
      {max && <span className="text-[10px] text-slate-400">{value.length}/{max}</span>}
    </div>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      maxLength={max}
      className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-propsight-400 focus:ring-1 focus:ring-propsight-200 focus:outline-none"
    />
  </div>
);

const FieldTextarea: React.FC<{ label: string; value: string; onChange: (v: string) => void; max?: number }> = ({
  label,
  value,
  onChange,
  max,
}) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <label className="text-xs text-slate-500">{label}</label>
      {max && <span className="text-[10px] text-slate-400">{value.length}/{max}</span>}
    </div>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      maxLength={max}
      rows={3}
      className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-propsight-400 focus:ring-1 focus:ring-propsight-200 focus:outline-none resize-none"
    />
  </div>
);

const Toggle: React.FC<{ label: string; defaultChecked?: boolean; help?: React.ReactNode }> = ({
  label,
  defaultChecked,
  help,
}) => (
  <label className="flex items-start gap-2 cursor-pointer">
    <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
    <div className="relative w-9 h-5 bg-slate-200 peer-checked:bg-propsight-500 rounded-full transition-colors flex-shrink-0 mt-0.5">
      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
    </div>
    <div className="text-sm text-slate-700">
      {label}
      {help && <div className="mt-0.5 text-xs">{help}</div>}
    </div>
  </label>
);

export default StepsTab;
