import React from 'react';
import AtelierSourceCard from './inputs/AtelierSourceCard';
import AtelierTransactionType from './inputs/AtelierTransactionType';
import AtelierAudienceSelector from './inputs/AtelierAudienceSelector';
import AtelierToneSelector from './inputs/AtelierToneSelector';
import AtelierTemplatesSelector from './inputs/AtelierTemplatesSelector';
import AtelierGenerateButton from './inputs/AtelierGenerateButton';
import InputSection from './inputs/InputSection';

interface Props {
  onChangeSource: () => void;
}

const AtelierInputsPanel: React.FC<Props> = ({ onChangeSource }) => (
  <aside className="w-[320px] flex-shrink-0 border-r border-neutral-200 bg-white overflow-y-auto">
    <div className="p-4 space-y-4">
      <InputSection title="Source">
        <AtelierSourceCard onChangeSource={onChangeSource} />
      </InputSection>

      <InputSection title="Type de transaction">
        <AtelierTransactionType />
      </InputSection>

      <InputSection title="Public visé">
        <AtelierAudienceSelector />
      </InputSection>

      <InputSection title="Ton & style">
        <AtelierToneSelector />
      </InputSection>

      <InputSection title="Modules à inclure" hint="Bibliothèque">
        <AtelierTemplatesSelector />
      </InputSection>

      <div className="pt-2 border-t border-neutral-100">
        <AtelierGenerateButton />
      </div>
    </div>
  </aside>
);

export default AtelierInputsPanel;
