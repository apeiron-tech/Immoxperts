import React from 'react';
import { MoreHorizontal, Image as ImageIcon, Layers } from 'lucide-react';
import { Bien } from '../types';
import { formatEuros, formatEurosM2, relativeTime } from '../utils/format';
import FavoriteButton from './FavoriteButton';
import SourceBadge from './SourceBadge';
import AVMBadge from './AVMBadge';

interface Props {
  bien: Bien;
  onClick: (b: Bien) => void;
  onToggleFavorite: (id: string) => void;
}

const flagStyle = (flag: Bien['flag']) => {
  switch (flag) {
    case 'nouveau': return { bg: 'bg-propsight-600', text: 'Nouveau' };
    case 'baisse_prix': return { bg: 'bg-green-600', text: 'Baisse de prix' };
    case 'opportunite': return { bg: 'bg-amber-500', text: 'Opportunité' };
    case 'remise_en_ligne': return { bg: 'bg-slate-700', text: 'Remise en ligne' };
    default: return null;
  }
};

const typeBienLabel = (t: string, pieces: number | null): string => {
  if (t === 'appartement') return `Appartement${pieces ? ` T${pieces}` : ''}`;
  if (t === 'maison') return `Maison${pieces ? ` ${pieces}p` : ''}`;
  if (t === 'local') return 'Local commercial';
  if (t === 'parking') return 'Parking';
  if (t === 'terrain') return 'Terrain';
  return t;
};

const CardBien: React.FC<Props> = ({ bien, onClick, onToggleFavorite }) => {
  const primaryAnnonce = bien.annonces[0];
  const fb = flagStyle(bien.flag);
  const nbSources = bien.annonces.length;

  return (
    <div
      onClick={() => onClick(bien)}
      className="group cursor-pointer bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-slate-300 transition-all"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {bien.photo_principale ? (
          <img
            src={bien.photo_principale}
            alt={bien.adresse}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <ImageIcon size={32} />
          </div>
        )}

        {fb && (
          <div className={`absolute top-2 left-2 px-2 h-5 rounded flex items-center text-[10px] font-semibold text-white ${fb.bg}`}>
            {fb.text}
          </div>
        )}

        <div className="absolute top-2 right-2 flex items-center gap-1">
          <FavoriteButton
            active={bien.suivi}
            onToggle={() => onToggleFavorite(bien.id)}
            size="sm"
          />
          <button
            onClick={e => e.stopPropagation()}
            className="w-7 h-7 rounded-md bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500"
          >
            <MoreHorizontal size={13} />
          </button>
        </div>

        {nbSources >= 2 && (
          <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur px-1.5 h-5 rounded flex items-center gap-1 text-[10px] font-medium text-slate-700 shadow-sm">
            <Layers size={9} />
            {nbSources} sources
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[13px] font-semibold text-slate-900 truncate">
              {typeBienLabel(bien.type, bien.pieces)}
            </h3>
          </div>
          <p className="text-[12px] text-slate-500 truncate">{bien.adresse}, {bien.code_postal} {bien.ville.replace(/Paris \d+e/i, m => m)}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[16px] font-bold text-slate-900 tabular-nums">
            {formatEuros(primaryAnnonce?.prix_affiche || bien.avm?.prix_estime || 0)}
          </span>
          {primaryAnnonce && (
            <span className="text-[11px] text-slate-500 tabular-nums">{formatEurosM2(primaryAnnonce.prix_m2)}</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-600">
          {bien.surface_m2 > 0 && <span><span className="tabular-nums">{bien.surface_m2}</span> m²</span>}
          {bien.pieces != null && bien.pieces > 0 && <span>{bien.pieces} pièce{bien.pieces > 1 ? 's' : ''}</span>}
          {bien.etage != null && bien.etage > 0 && <span>{bien.etage}e étage</span>}
          {bien.etage === 0 && <span>RDC</span>}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {bien.publie_il_y_a && (
              <span className="text-[11px] text-slate-500">Publié il y a {bien.publie_il_y_a}</span>
            )}
            {primaryAnnonce && <SourceBadge source={primaryAnnonce.source} size="sm" />}
          </div>
          <AVMBadge avm={bien.avm} compact />
        </div>
      </div>
    </div>
  );
};

export default CardBien;
