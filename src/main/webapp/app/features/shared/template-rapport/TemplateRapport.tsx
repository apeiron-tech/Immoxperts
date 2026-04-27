import React, { useEffect, useRef } from 'react';
import { ChevronLeft, Eye, Pencil, FileDown, PanelRightOpen, PanelRightClose, Send, MoreVertical } from 'lucide-react';
import { RapportConfig, RapportData } from './types';
import { useTemplateRapport } from './useTemplateRapport';
import { BLOCS_REGISTRY, getBlocsOrdered } from './BlocsRegistry';
import BlocRenderer from './BlocRenderer';
import PanneauContenu from './PanneauContenu';
import BlocEditPopover from './BlocEditPopover';
import './print.css';

interface Props {
  data: RapportData;
  initialConfig?: RapportConfig;
  titreHeader?: string;
  badge?: React.ReactNode;
  onRetour?: () => void;
  onConfigChange?: (config: RapportConfig) => void;
  onSend?: () => void;
  readOnly?: boolean;
  actions?: React.ReactNode;
}

const TemplateRapport: React.FC<Props> = ({
  data,
  initialConfig,
  titreHeader,
  badge,
  onRetour,
  onConfigChange,
  onSend,
  readOnly = false,
  actions,
}) => {
  const { config, mode, editingBlocId, showPanneau, setMode, actions: act, getBlocConfig } = useTemplateRapport({
    rapportType: data.type,
    initialConfig,
  });

  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  const ordered = getBlocsOrdered(config.blocs).filter(b => b.active);
  const blocEnEdition = editingBlocId ? getBlocConfig(editingBlocId) : null;

  // Scroll synchronisé : clic sur un bloc dans la liste éditeur → scroll vers la preview
  const scrollVersBloc = (id: string) => {
    const el = previewRef.current?.querySelector(`#bloc-${id}`);
    if (el && previewRef.current) {
      const top = (el as HTMLElement).offsetTop - 12;
      previewRef.current.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-slate-200 flex-shrink-0 no-print">
        <div className="flex items-center gap-3 min-w-0">
          {onRetour && (
            <button onClick={onRetour} className="text-slate-400 hover:text-slate-700 transition-colors">
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-slate-900 truncate">{titreHeader || 'Rapport'}</h1>
              {badge}
            </div>
            <p className="text-xs text-slate-500 truncate">
              {data.estimation.bien.adresse}, {data.estimation.bien.code_postal} {data.estimation.bien.ville}
              {data.estimation.client && ` · ${data.estimation.client.civilite} ${data.estimation.client.prenom} ${data.estimation.client.nom}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Toggle mode édition / preview */}
          <div className="inline-flex border border-slate-200 rounded-md overflow-hidden">
            <button
              onClick={() => setMode('edit')}
              className={`px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                mode === 'edit' ? 'bg-propsight-50 text-propsight-700' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Pencil size={12} /> Édition
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                mode === 'preview' ? 'bg-propsight-50 text-propsight-700' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Eye size={12} /> Aperçu
            </button>
          </div>

          {actions}

          <button
            onClick={act.exportPDF}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors flex items-center gap-1.5"
          >
            <FileDown size={12} /> Exporter PDF
          </button>

          {onSend && (
            <button
              onClick={onSend}
              disabled={readOnly}
              className="px-3 py-1 text-xs font-medium bg-propsight-600 text-white rounded hover:bg-propsight-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              <Send size={12} /> Envoyer
            </button>
          )}

          <button className="text-slate-400 hover:text-slate-700 p-1 transition-colors">
            <MoreVertical size={14} />
          </button>

          <button
            onClick={act.togglePanneau}
            className="text-slate-400 hover:text-slate-700 p-1 transition-colors"
            title={showPanneau ? 'Masquer le panneau Contenu' : 'Afficher le panneau Contenu'}
          >
            {showPanneau ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {mode === 'edit' ? (
          <>
            {/* Liste éditeur compacte */}
            <div ref={editorRef} className="w-[280px] flex-shrink-0 border-r border-slate-200 bg-white overflow-y-auto no-print">
              <div className="p-3 border-b border-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Plan du rapport</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{ordered.length} blocs actifs</p>
              </div>
              <div className="p-2 space-y-1">
                {ordered.map(b => {
                  const def = BLOCS_REGISTRY[b.id];
                  return (
                    <button
                      key={b.id}
                      onClick={() => scrollVersBloc(b.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-propsight-50 hover:text-propsight-700 transition-colors text-xs text-slate-600"
                    >
                      <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-500 flex-shrink-0">
                        {b.order + 1}
                      </span>
                      <span className="truncate">{def.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview live */}
            <div ref={previewRef} className="flex-1 overflow-y-auto bg-slate-100 px-8 py-6">
              <div className="max-w-[820px] mx-auto space-y-4 print-container">
                {ordered.length === 0 ? (
                  <div className="bg-white rounded-md border border-slate-200 p-12 text-center">
                    <p className="text-sm font-medium text-slate-700 mb-1">Aucun bloc actif</p>
                    <p className="text-xs text-slate-500">Activez des blocs depuis le panneau Contenu pour construire votre rapport.</p>
                  </div>
                ) : (
                  ordered.map(b => (
                    <BlocRenderer
                      key={b.id}
                      data={data}
                      blocConfig={b}
                      isEditing={!readOnly}
                      onEdit={() => act.openEditBloc(b.id)}
                      onContentChange={c => act.updateBlocContent(b.id, c)}
                    />
                  ))
                )}
              </div>
            </div>

            {showPanneau && (
              <PanneauContenu
                blocs={config.blocs}
                style={config.style}
                onToggle={act.toggleBloc}
                onReorder={act.reorderBlocs}
                onSetStyle={act.setStyle}
                onSaveAsTemplate={act.saveAsTemplate}
                onResetDefault={act.resetToDefault}
                onClose={act.togglePanneau}
              />
            )}
          </>
        ) : (
          // Mode preview plein écran
          <div className="flex-1 overflow-y-auto bg-slate-200 px-8 py-8">
            <div className="max-w-[820px] mx-auto space-y-4 print-container">
              {ordered.map(b => (
                <BlocRenderer
                  key={b.id}
                  data={data}
                  blocConfig={b}
                  isEditing={false}
                  onEdit={() => undefined}
                  onContentChange={() => undefined}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Édition popover */}
      {blocEnEdition && (
        <BlocEditPopover
          blocId={blocEnEdition.id}
          blocConfig={blocEnEdition}
          data={data}
          onClose={act.closeEditBloc}
          onSave={c => act.updateBlocContent(blocEnEdition.id, c)}
        />
      )}
    </div>
  );
};

export default TemplateRapport;
