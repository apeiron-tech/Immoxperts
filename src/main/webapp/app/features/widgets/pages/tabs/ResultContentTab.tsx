import React, { useState } from 'react';
import type { WidgetInstance } from '../../types';
import { SELLER_RESULT_FIELDS, INVESTOR_RESULT_FIELDS } from '../../_mocks/widgets';
import FieldVisibilityToggle from '../../components/FieldVisibilityToggle';
import PreviewPane from '../../components/PreviewPane';
import WidgetStepPreview from '../../components/WidgetStepPreview';
import { SELLER_STEPS, INVESTOR_STEPS } from '../../_mocks/widgets';

interface Props {
  widget: WidgetInstance;
}

const ResultContentTab: React.FC<Props> = ({ widget }) => {
  const isSeller = widget.type === 'estimation_vendeur';
  const [fields, setFields] = useState(isSeller ? SELLER_RESULT_FIELDS : INVESTOR_RESULT_FIELDS);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const steps = isSeller ? SELLER_STEPS : INVESTOR_STEPS;
  const resultStep = steps.find(s => s.id === (isSeller ? 'resultat' : 'strategie')) ?? steps[0];

  return (
    <div className="grid grid-cols-[minmax(0,480px)_1fr] gap-4 h-[calc(100vh-220px)]">
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden flex flex-col">
        <div className="px-5 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Éléments de résultat</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Choisissez ce qui est affiché au public et ce qui reste réservé à l'agent.
          </p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-slate-200 bg-slate-50 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-sm bg-propsight-500" />
            <span className="text-slate-600">Public</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-sm bg-sky-500" />
            <span className="text-slate-600">Agent</span>
          </div>
          <div className="ml-auto text-slate-500">
            {fields.filter(f => f.visiblePublic).length} publics · {fields.filter(f => f.visibleAgent).length} agents
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {fields.map(f => (
            <FieldVisibilityToggle
              key={f.id}
              field={f}
              onChange={next => setFields(prev => prev.map(x => (x.id === f.id ? next : x)))}
            />
          ))}
        </div>
      </div>

      <PreviewPane
        device={device}
        onDeviceChange={setDevice}
        title="Aperçu résultat public"
        footerNote="Seuls les éléments marqués 'Public' apparaissent ici."
      >
        <WidgetStepPreview widget={widget} step={resultStep} stepsCount={steps.length} />
      </PreviewPane>
    </div>
  );
};

export default ResultContentTab;
