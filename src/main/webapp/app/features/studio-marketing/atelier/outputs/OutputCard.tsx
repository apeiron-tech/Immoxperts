import React, { useEffect, useState } from 'react';
import {
  Bookmark,
  CalendarDays,
  Maximize2,
  Pencil,
  RefreshCw,
  Sparkles,
  Tag,
} from 'lucide-react';
import type { MarketingAsset } from '../../types';
import { useAtelierStore } from '../../store/atelierStore';
import { CHANNEL_GROUP_ICONS, CHANNEL_GROUP_LABELS } from '../../utils/outputCatalog';
import VisualPreview from './VisualPreview';
import { useAtelierGenerate } from '../../hooks/useAtelierGenerate';

interface Props {
  asset: MarketingAsset;
}

const OutputCard: React.FC<Props> = ({ asset }) => {
  const Icon = CHANNEL_GROUP_ICONS[asset.channel_group];
  const groupLabel = CHANNEL_GROUP_LABELS[asset.channel_group];
  const patchOutput = useAtelierStore(s => s.patchOutput);
  const openVariants = useAtelierStore(s => s.openVariants);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(asset.content);
  const { generate } = useAtelierGenerate();

  useEffect(() => {
    setDraft(asset.content);
  }, [asset.content]);

  const handleSave = () => {
    patchOutput(asset.asset_id, { content: draft, is_edited_by_user: true });
    setEditing(false);
  };

  const isLong = ['description_portail', 'description_site_agence', 'post_linkedin', 'email_base_leads'].includes(asset.asset_type);

  return (
    <article className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <header className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-7 h-7 rounded-md bg-propsight-50 text-propsight-700 flex items-center justify-center flex-shrink-0">
            <Icon size={14} />
          </span>
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold text-neutral-900 truncate">
              {asset.title}
            </div>
            <div className="text-[11px] text-neutral-500">
              {groupLabel}
              {asset.is_edited_by_user && (
                <span className="ml-1.5 inline-flex items-center gap-0.5 text-propsight-700">
                  · <Pencil size={9} /> Édité par vous
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <IconButton title="Régénérer" onClick={() => generate(true)}>
            <RefreshCw size={13} />
          </IconButton>
          <IconButton title={editing ? 'Sauvegarder' : 'Éditer'} onClick={() => editing ? handleSave() : setEditing(true)} active={editing}>
            <Pencil size={13} />
          </IconButton>
          <IconButton title="Aperçu plein écran">
            <Maximize2 size={13} />
          </IconButton>
        </div>
      </header>

      <div className="p-4 space-y-3">
        {editing ? (
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className={`w-full ${isLong ? 'min-h-[280px]' : 'min-h-[120px]'} text-[13px] text-neutral-800 leading-relaxed bg-neutral-50 border border-neutral-200 rounded-md p-3 focus:outline-none focus:border-propsight-300 focus:bg-white whitespace-pre-wrap font-sans resize-y`}
          />
        ) : (
          <pre className={`whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-neutral-800 ${
            isLong ? '' : 'max-h-[400px] overflow-y-auto'
          }`}>
            {asset.content}
          </pre>
        )}

        {asset.visual_format && <VisualPreview asset={asset} />}

        {asset.legal_mentions.length > 0 && (
          <div className="text-[11px] text-neutral-500 bg-neutral-50 rounded-md px-2.5 py-2 border border-neutral-100">
            <span className="font-semibold">Mentions légales : </span>
            {asset.legal_mentions.map(m => m.text).join(' · ')}
          </div>
        )}

        {asset.data_points_cited.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap text-[11px]">
            <Tag size={11} className="text-neutral-400" />
            <span className="text-neutral-500">Datapoints cités :</span>
            {asset.data_points_cited.map(dp => (
              <Chip key={dp}>{dp}</Chip>
            ))}
          </div>
        )}
      </div>

      <footer className="px-4 py-2.5 border-t border-neutral-100 bg-neutral-50/40 flex items-center justify-end gap-1.5 flex-wrap">
        <FooterButton icon={<RefreshCw size={12} />} label="Régénérer" onClick={() => generate(true)} />
        <FooterButton icon={<Sparkles size={12} />} label="3 variantes" onClick={() => openVariants(asset.asset_id)} />
        <FooterButton icon={<Bookmark size={12} />} label="Sauver" />
        <FooterButton icon={<CalendarDays size={12} />} label="Programmer" primary />
      </footer>
    </article>
  );
};

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-propsight-50 text-propsight-700 text-[10.5px] font-medium border border-propsight-100">
    {children}
  </span>
);

const IconButton: React.FC<{
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
  active?: boolean;
}> = ({ children, title, onClick, active }) => (
  <button
    title={title}
    onClick={onClick}
    className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
      active
        ? 'bg-propsight-600 text-white'
        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
    }`}
  >
    {children}
  </button>
);

const FooterButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  primary?: boolean;
}> = ({ icon, label, onClick, primary }) => (
  <button
    onClick={onClick}
    className={`h-7 inline-flex items-center gap-1 px-2.5 text-[11.5px] font-medium rounded-md transition-colors ${
      primary
        ? 'bg-propsight-600 text-white hover:bg-propsight-700'
        : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default OutputCard;
