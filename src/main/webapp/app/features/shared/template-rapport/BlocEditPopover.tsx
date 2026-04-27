import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { BlocConfig, BlocId, RapportData } from './types';
import { BLOCS_REGISTRY } from './BlocsRegistry';

interface Props {
  blocId: BlocId;
  blocConfig: BlocConfig;
  data: RapportData;
  onClose: () => void;
  onSave: (content: Record<string, unknown>) => void;
}

const BlocEditPopover: React.FC<Props> = ({ blocId, blocConfig, data, onClose, onSave }) => {
  const def = BLOCS_REGISTRY[blocId];
  const [draft, setDraft] = useState<Record<string, unknown>>(blocConfig.customContent || {});

  const update = (k: string, v: unknown) => setDraft(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-6 no-print" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 flex-shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Éditer · {def.label}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Les modifications s'appliquent uniquement à ce rapport.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {renderEditor(blocId, draft, update, data)}
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors">
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-xs font-medium bg-propsight-600 text-white rounded hover:bg-propsight-700 transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

function renderEditor(
  blocId: BlocId,
  draft: Record<string, unknown>,
  update: (k: string, v: unknown) => void,
  data: RapportData,
): React.ReactNode {
  switch (blocId) {
    case 'couverture':
      return (
        <div className="space-y-3">
          <Field label="Surtitre">
            <input
              type="text"
              value={(draft.surtitre as string) ?? ''}
              placeholder="Avis de valeur"
              onChange={e => update('surtitre', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-propsight-400"
            />
          </Field>
          <Field label="Titre principal">
            <input
              type="text"
              value={(draft.titre as string) ?? ''}
              placeholder={`${data.estimation.bien.adresse}, ${data.estimation.bien.code_postal} ${data.estimation.bien.ville}`}
              onChange={e => update('titre', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-propsight-400"
            />
          </Field>
          <Field label="Sous-titre">
            <input
              type="text"
              value={(draft.sous_titre as string) ?? ''}
              placeholder="À l'attention de…"
              onChange={e => update('sous_titre', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-propsight-400"
            />
          </Field>
        </div>
      );

    case 'agence':
      return (
        <Field label="Description de l'agence">
          <textarea
            value={(draft.description as string) ?? ''}
            placeholder={data.agence.description}
            rows={6}
            onChange={e => update('description', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-propsight-400 resize-none"
          />
        </Field>
      );

    case 'conseiller':
      return (
        <Field label="Bio du conseiller">
          <textarea
            value={(draft.bio as string) ?? ''}
            placeholder={data.conseiller.bio}
            rows={5}
            onChange={e => update('bio', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-propsight-400 resize-none"
          />
        </Field>
      );

    case 'points':
      return (
        <div className="space-y-4">
          <Field label="Points forts">
            <ListeEditable
              items={(draft.points_forts as string[]) ?? data.estimation.bien.points_forts}
              onChange={v => update('points_forts', v)}
              placeholder="Ajouter un point fort…"
              tone="positif"
            />
          </Field>
          <Field label="Points à défendre">
            <ListeEditable
              items={(draft.points_defendre as string[]) ?? data.estimation.bien.points_defendre}
              onChange={v => update('points_defendre', v)}
              placeholder="Ajouter un point à défendre…"
              tone="negatif"
            />
          </Field>
        </div>
      );

    case 'conclusion':
      return (
        <Field label="Texte d'introduction de la conclusion">
          <textarea
            value={(draft.texte as string) ?? ''}
            placeholder="À l'issue de cette analyse…"
            rows={6}
            onChange={e => update('texte', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-propsight-400 resize-none"
          />
          <p className="text-[11px] text-slate-500 mt-2">
            Le bloc valeur retenue (prix / honoraires / net vendeur) s'édite directement dans la preview.
          </p>
        </Field>
      );

    case 'bien':
    case 'photos':
    case 'comp_vente':
    case 'comp_vendus':
    case 'comp_location':
    case 'comp_loues':
    case 'focus_comp':
    case 'projet_invest':
    case 'annexes':
      return (
        <div className="text-sm text-slate-500 space-y-2">
          <p>Les données de ce bloc sont alimentées automatiquement par l'estimation.</p>
          <p className="text-xs text-slate-400">Édition fine (sélection des comparables, upload photos, etc.) sera disponible dans une prochaine itération.</p>
        </div>
      );

    default:
      return (
        <p className="text-sm text-slate-500">Ce bloc n'est pas éditable. Désactivez-le depuis le panneau Contenu si vous ne souhaitez pas l'inclure.</p>
      );
  }
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">{label}</label>
    {children}
  </div>
);

const ListeEditable: React.FC<{
  items: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  tone: 'positif' | 'negatif';
}> = ({ items, onChange, placeholder, tone }) => {
  const [nouveau, setNouveau] = useState('');
  const ajouter = () => {
    if (!nouveau.trim()) return;
    onChange([...items, nouveau.trim()]);
    setNouveau('');
  };
  const supprimer = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded border ${tone === 'positif' ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40'}`}>
          <span className={tone === 'positif' ? 'text-emerald-600' : 'text-amber-600'}>{tone === 'positif' ? '+' : '!'}</span>
          <input
            type="text"
            value={item}
            onChange={e => onChange(items.map((it, j) => (j === i ? e.target.value : it)))}
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <button onClick={() => supprimer(i)} className="text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          type="text"
          value={nouveau}
          onChange={e => setNouveau(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), ajouter())}
          placeholder={placeholder}
          className="flex-1 px-2 py-1.5 border border-dashed border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-propsight-400"
        />
        <button onClick={ajouter} className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition-colors">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

export default BlocEditPopover;
