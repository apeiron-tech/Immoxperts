import React from 'react';
import { PenTool, Sparkles } from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';
import { MOCK_DRAFTS_RECENT } from '../../_mocks/drafts';
import { formatRelativeShort } from '../../utils/helpers';
import { MOCK_BIENS_SOURCES } from '../../_mocks/sources';
import { MOCK_SNAPSHOT } from '../../_mocks/snapshot';

interface Props {
  onChooseSource: () => void;
}

const EmptyStateNoSource: React.FC<Props> = ({ onChooseSource }) => {
  const setSource = useAtelierStore(s => s.setSource);
  const setSnapshot = useAtelierStore(s => s.setSnapshot);

  const handleResume = (label: string) => {
    const fallback = MOCK_BIENS_SOURCES[0];
    setSource({ ...fallback, label }, label);
    setSnapshot(MOCK_SNAPSHOT);
  };

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="max-w-xl w-full">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-propsight-50 text-propsight-600 flex items-center justify-center mb-4">
            <PenTool size={26} />
          </div>
          <h2 className="text-[20px] font-semibold text-neutral-900 mb-2">
            Bienvenue dans l&apos;Atelier Studio Marketing
          </h2>
          <p className="text-[13px] text-neutral-600 max-w-md leading-relaxed">
            Sélectionnez une source pour générer votre kit marketing complet — descriptifs portails, posts sociaux, scripts vidéos, emails — en 30 secondes, ancrés dans la donnée Propsight.
          </p>
          <button
            onClick={onChooseSource}
            className="mt-5 h-11 px-5 inline-flex items-center gap-2 text-[14px] font-semibold text-white bg-propsight-600 rounded-lg hover:bg-propsight-700 transition-colors shadow-sm"
          >
            <Sparkles size={15} />
            Choisir une source
          </button>
        </div>

        {MOCK_DRAFTS_RECENT.length > 0 && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-[11px] uppercase tracking-wide text-neutral-400">ou</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>
            <div>
              <h3 className="text-[12px] font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                Brouillons en cours ({MOCK_DRAFTS_RECENT.length})
              </h3>
              <ul className="bg-white border border-neutral-200 rounded-lg overflow-hidden divide-y divide-neutral-100">
                {MOCK_DRAFTS_RECENT.map(d => (
                  <li key={d.draft_id}>
                    <button
                      onClick={() => handleResume(d.source_label)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-neutral-50 transition-colors"
                    >
                      <span className="text-[13px] text-neutral-800">{d.source_label}</span>
                      <span className="text-[11px] text-neutral-500">{formatRelativeShort(d.updated_at)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmptyStateNoSource;
