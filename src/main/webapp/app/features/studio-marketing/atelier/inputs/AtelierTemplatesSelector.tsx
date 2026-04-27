import React from 'react';
import { Bookmark } from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';
import { MOCK_TEMPLATES } from '../../_mocks/templates';

const AtelierTemplatesSelector: React.FC = () => {
  const selected = useAtelierStore(s => s.template_ids);
  const toggle = useAtelierStore(s => s.toggleTemplate);

  if (MOCK_TEMPLATES.length === 0) {
    return (
      <div className="text-[11px] text-neutral-500 italic px-2.5 py-2 bg-neutral-50 rounded-md border border-dashed border-neutral-200">
        Aucun template — créez-en depuis Bibliothèque.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {MOCK_TEMPLATES.map(t => {
        const checked = selected.includes(t.template_id);
        return (
          <label
            key={t.template_id}
            className={`flex items-start gap-2 px-2.5 py-1.5 rounded-md border cursor-pointer transition-colors ${
              checked
                ? 'bg-propsight-50 border-propsight-200'
                : 'bg-white border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(t.template_id)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-neutral-300 text-propsight-600 focus:ring-propsight-500"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Bookmark size={11} className="text-propsight-500 flex-shrink-0" />
                <span className="text-[11.5px] font-medium text-neutral-900 truncate">
                  {t.name}
                </span>
              </div>
              {t.description && (
                <div className="text-[10.5px] text-neutral-500 line-clamp-1">
                  {t.description}
                </div>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default AtelierTemplatesSelector;
