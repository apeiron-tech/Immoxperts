import React, { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, X, Save, RotateCcw } from 'lucide-react';
import { BlocConfig, BlocId, BlocGroup, StyleRapport } from './types';
import { BLOCS_REGISTRY, BLOC_GROUP_LABEL, getBlocsOrdered } from './BlocsRegistry';

interface Props {
  blocs: BlocConfig[];
  style: StyleRapport;
  onToggle: (id: BlocId) => void;
  onReorder: (sourceId: BlocId, targetId: BlocId) => void;
  onSetStyle: (style: StyleRapport) => void;
  onSaveAsTemplate: () => void;
  onResetDefault: () => void;
  onClose: () => void;
}

const STYLE_OPTIONS: { value: StyleRapport; label: string }[] = [
  { value: 'style_1', label: 'Style 1 — Classique' },
  { value: 'style_2', label: 'Style 2 — Moderne' },
  { value: 'style_3', label: 'Style 3 — Minimaliste' },
];

const PanneauContenu: React.FC<Props> = ({ blocs, style, onToggle, onReorder, onSetStyle, onSaveAsTemplate, onResetDefault, onClose }) => {
  const ordered = getBlocsOrdered(blocs);
  const actifs = ordered.filter(b => b.active);
  const disponibles = ordered.filter(b => !b.active);

  const [groupesOuverts, setGroupesOuverts] = useState<Set<BlocGroup>>(
    new Set(['identity', 'bien', 'marche', 'comparables', 'synthese', 'reglementations', 'conclusion']),
  );
  const [draggedId, setDraggedId] = useState<BlocId | null>(null);

  const toggleGroupe = (g: BlocGroup) => {
    setGroupesOuverts(prev => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  };

  // Regrouper les blocs disponibles par groupe
  const dispoParGroupe = disponibles.reduce<Record<BlocGroup, BlocConfig[]>>((acc, b) => {
    const g = BLOCS_REGISTRY[b.id].group;
    if (!acc[g]) acc[g] = [];
    acc[g].push(b);
    return acc;
  }, {} as Record<BlocGroup, BlocConfig[]>);

  return (
    <aside className="w-[300px] flex-shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden no-print">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-sm font-semibold text-slate-900">Contenu</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-slate-100">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Style du rapport</label>
          <select
            value={style}
            onChange={e => onSetStyle(e.target.value as StyleRapport)}
            className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-propsight-400"
          >
            {STYLE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2 px-1">
            Blocs actifs ({actifs.length})
          </p>
          <p className="text-[10px] text-slate-400 mb-3 px-1">Glissez les blocs pour les réordonner.</p>

          <div className="space-y-1">
            {actifs.map(b => {
              const def = BLOCS_REGISTRY[b.id];
              return (
                <div
                  key={b.id}
                  draggable
                  onDragStart={() => setDraggedId(b.id)}
                  onDragEnd={() => setDraggedId(null)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => {
                    if (draggedId && draggedId !== b.id) onReorder(draggedId, b.id);
                  }}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded border bg-white hover:bg-propsight-50 hover:border-propsight-200 transition-colors cursor-move group ${
                    draggedId === b.id ? 'opacity-40 border-propsight-400' : 'border-slate-200'
                  }`}
                >
                  <GripVertical size={12} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0" />
                  <input
                    type="checkbox"
                    checked
                    onChange={() => onToggle(b.id)}
                    onClick={e => e.stopPropagation()}
                    className="w-3 h-3 accent-propsight-600 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs text-slate-700 flex-1 truncate">{def.label}</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 flex-shrink-0">{BLOC_GROUP_LABEL[def.group]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3 border-t border-slate-100">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2 px-1">
            Blocs disponibles ({disponibles.length})
          </p>

          <div className="space-y-1.5">
            {(Object.keys(dispoParGroupe) as BlocGroup[]).map(g => {
              const liste = dispoParGroupe[g];
              const ouvert = groupesOuverts.has(g);
              return (
                <div key={g}>
                  <button
                    onClick={() => toggleGroupe(g)}
                    className="w-full flex items-center gap-1 px-1 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {ouvert ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                    <span className="uppercase tracking-wider">{BLOC_GROUP_LABEL[g]}</span>
                    <span className="text-slate-300 normal-case font-normal ml-1">({liste.length})</span>
                  </button>
                  {ouvert && (
                    <div className="ml-3 space-y-0.5 mt-0.5">
                      {liste.map(b => {
                        const def = BLOCS_REGISTRY[b.id];
                        return (
                          <label
                            key={b.id}
                            className="flex items-center gap-2 px-2 py-1 rounded text-xs text-slate-500 hover:bg-slate-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => onToggle(b.id)}
                              className="w-3 h-3 accent-propsight-600 cursor-pointer flex-shrink-0"
                            />
                            <span className="flex-1 truncate">{def.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 p-3 space-y-1.5 flex-shrink-0 bg-slate-50">
        <button
          onClick={onSaveAsTemplate}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded transition-colors"
        >
          <Save size={11} /> Sauver comme modèle
        </button>
        <button
          onClick={onResetDefault}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
        >
          <RotateCcw size={11} /> Réinitialiser par défaut
        </button>
      </div>
    </aside>
  );
};

export default PanneauContenu;
