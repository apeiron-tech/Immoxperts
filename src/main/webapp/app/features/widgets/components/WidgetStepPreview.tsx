import React from 'react';
import { Check } from 'lucide-react';
import type { WidgetInstance, WidgetStep } from '../types';

interface Props {
  widget: WidgetInstance;
  step: WidgetStep;
  stepsCount: number;
  agencyName?: string;
}

// Aperçu simplifié (non interactif) d'une étape du widget, utilisé dans PreviewPane
const WidgetStepPreview: React.FC<Props> = ({ widget, step, stepsCount, agencyName = "Maison d'Exception" }) => {
  const isSeller = widget.type === 'estimation_vendeur';

  return (
    <div className="p-6">
      {/* Progress bar mini */}
      <div className="flex items-center justify-center gap-1.5 mb-5">
        {Array.from({ length: stepsCount }).map((_, i) => {
          const idx = i + 1;
          const active = idx === step.index;
          const done = idx < step.index;
          return (
            <div
              key={i}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                active ? 'bg-propsight-600 text-white' : done ? 'bg-propsight-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {done ? <Check size={10} /> : idx}
            </div>
          );
        })}
      </div>

      {/* Contenu selon l'étape */}
      {step.id === 'resultat' && isSeller ? (
        <>
          <h3 className="text-base font-semibold text-slate-900 text-center">Estimez votre bien en quelques minutes</h3>
          <p className="text-xs text-slate-500 text-center mt-1">
            Voici une estimation indicative de votre bien.
          </p>
          <div className="mt-4 bg-propsight-50 border border-propsight-100 rounded-md p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Estimation indicative</span>
              <span className="px-1.5 py-0.5 rounded bg-propsight-200 text-propsight-900 text-[10px] font-medium">Aperçu</span>
            </div>
            <div className="mt-2 text-xl font-semibold text-propsight-700">482 000 € – 515 000 €</div>
            <div className="text-xs text-slate-500 mt-0.5">Soit 8 310 € – 8 880 €/m²</div>
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 rounded bg-slate-200" />
              <div className="h-1.5 rounded bg-slate-100 w-3/4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-3">
            Cette estimation n'a pas de valeur contractuelle. Pour affiner, échangeons ensemble.
          </p>
          <button disabled className="mt-3 w-full px-3 py-2 bg-propsight-600 text-white text-xs font-medium rounded">
            Continuer ›
          </button>
        </>
      ) : step.id === 'strategie' && !isSeller ? (
        <>
          <h3 className="text-base font-semibold text-slate-900 text-center">Votre stratégie recommandée</h3>
          <div className="mt-3 bg-propsight-50 border border-propsight-200 rounded-md p-3">
            <div className="text-xs font-semibold text-propsight-900">T2 meublé en zone tendue</div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Équilibre rendement, sécurité, demande locative
            </div>
            <div className="grid grid-cols-3 gap-1.5 mt-3">
              <div className="bg-white border border-propsight-100 rounded p-1.5 text-center">
                <div className="text-[9px] text-slate-500">Loyer</div>
                <div className="text-[11px] font-semibold text-slate-900">930 €</div>
              </div>
              <div className="bg-white border border-propsight-100 rounded p-1.5 text-center">
                <div className="text-[9px] text-slate-500">Rendement</div>
                <div className="text-[11px] font-semibold text-slate-900">5,2 %</div>
              </div>
              <div className="bg-white border border-propsight-100 rounded p-1.5 text-center">
                <div className="text-[9px] text-slate-500">Tension</div>
                <div className="text-[11px] font-semibold text-slate-900">Élevée</div>
              </div>
            </div>
          </div>
          <button disabled className="mt-3 w-full px-3 py-2 bg-propsight-600 text-white text-xs font-medium rounded">
            Continuer ›
          </button>
        </>
      ) : (
        <>
          <h3 className="text-base font-semibold text-slate-900 text-center">
            {step.id === 'intro' && isSeller && 'Estimez votre bien en quelques minutes'}
            {step.id === 'intro' && !isSeller && 'Décrivez votre projet investisseur'}
            {step.id === 'adresse' && "Commençons par l'adresse de votre bien"}
            {step.id === 'bien' && 'Parlons de votre bien'}
            {step.id === 'details' && 'Quelques détails supplémentaires'}
            {step.id === 'projet' && 'Décrivez votre projet'}
            {step.id === 'budget' && 'Votre budget d\'investissement'}
            {step.id === 'zone-type' && 'Zones et types de biens'}
            {step.id === 'contact' && 'Recevez votre estimation détaillée'}
            {step.id === 'confirmation' && 'Votre demande a bien été transmise'}
          </h3>
          <p className="text-xs text-slate-500 text-center mt-1">{step.subtitle}</p>

          {step.formFields && step.formFields.length > 0 && (
            <div className="mt-4 space-y-2">
              {step.formFields.slice(0, 4).map(f => (
                <div key={f}>
                  <div className="text-[10px] text-slate-500 mb-1 capitalize">{f.replace(/_/g, ' ')}</div>
                  <div className="h-8 rounded border border-slate-200 bg-slate-50" />
                </div>
              ))}
            </div>
          )}

          <button disabled className="mt-4 w-full px-3 py-2 bg-propsight-600 text-white text-xs font-medium rounded">
            {step.id === 'confirmation' ? 'Retour au site' : 'Continuer ›'}
          </button>
        </>
      )}

      <div className="mt-4 text-center text-[9px] text-slate-400">Powered by Propsight · {agencyName}</div>
    </div>
  );
};

export default WidgetStepPreview;
