import React from 'react';
import { ArrowRight, Bot } from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';
import { buildSuggestion } from '../../utils/helpers';

const SuggestionPropsightCard: React.FC = () => {
  const snapshot = useAtelierStore(s => s.snapshot);
  const modules = useAtelierStore(s => s.modules);

  if (!snapshot) return null;

  const suggestion = buildSuggestion(snapshot, modules);

  return (
    <div className="rounded-lg bg-propsight-50 border border-propsight-200 p-3 space-y-2">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-propsight-700">
        <Bot size={13} />
        Suggestion Propsight
      </div>
      <div className="text-[12px] font-semibold text-propsight-900">{suggestion.title}</div>
      <p className="text-[11.5px] text-propsight-900/80 leading-relaxed">{suggestion.body}</p>
      <button className="inline-flex items-center gap-1 text-[11px] font-medium text-propsight-700 hover:text-propsight-800">
        {suggestion.cta_label}
        <ArrowRight size={11} />
      </button>
    </div>
  );
};

export default SuggestionPropsightCard;
