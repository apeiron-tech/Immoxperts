import React, { useState } from 'react';
import { StatusBadge } from 'app/features/estimation/components/shared/StatusBadge';
import { RapportType } from '../types';
import TemplateRapport from '../TemplateRapport';
import { PROPSIGHT_AGENCE, DEMO_CONSEILLER } from '../_mocks/agence';
import { DEMO_ESTIMATION } from '../_mocks/estimationDemo';

const TestTemplate: React.FC = () => {
  const [type, setType] = useState<RapportType>('avis_valeur');

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between no-print">
        <div>
          <h1 className="text-sm font-semibold text-slate-900">Template Rapport — page de test</h1>
          <p className="text-xs text-slate-500">Validation visuelle de l'infrastructure mutualisée (avis de valeur, étude locative, dossier invest).</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Type :</label>
          <div className="inline-flex border border-slate-200 rounded overflow-hidden">
            {(['avis_valeur', 'etude_locative', 'dossier_invest'] as RapportType[]).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  type === t ? 'bg-propsight-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {t === 'avis_valeur' ? 'Avis de valeur' : t === 'etude_locative' ? 'Étude locative' : 'Dossier invest'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <TemplateRapport
          key={type}
          data={{
            type,
            estimation: { ...DEMO_ESTIMATION, type: type === 'dossier_invest' ? 'avis_valeur' : type },
            agence: PROPSIGHT_AGENCE,
            conseiller: DEMO_CONSEILLER,
            date_rapport: new Date().toISOString(),
          }}
          titreHeader={type === 'avis_valeur' ? 'Avis de valeur' : type === 'etude_locative' ? 'Étude locative' : 'Dossier invest'}
          badge={<StatusBadge statut="brouillon" />}
          onRetour={() => window.history.back()}
          onSend={() => console.warn('[TestTemplate] onSend clicked')}
        />
      </div>
    </div>
  );
};

export default TestTemplate;
