import React from 'react';
import { Building2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';
import { formatEuros } from 'app/features/biens/utils/format';

interface Props {
  onChangeSource: () => void;
}

const AtelierSourceCard: React.FC<Props> = ({ onChangeSource }) => {
  const source = useAtelierStore(s => s.source);
  const snapshot = useAtelierStore(s => s.snapshot);

  if (!source) {
    return (
      <button
        onClick={onChangeSource}
        className="w-full px-3 py-4 text-left bg-white border border-dashed border-neutral-300 rounded-lg hover:border-propsight-400 hover:bg-propsight-50/40 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-neutral-100 group-hover:bg-propsight-100 flex items-center justify-center text-neutral-400 group-hover:text-propsight-600 transition-colors">
            <ImageIcon size={18} />
          </div>
          <div>
            <div className="text-[13px] font-medium text-neutral-900 group-hover:text-propsight-700">
              Aucune source
            </div>
            <div className="text-[11px] text-neutral-500">Cliquez pour choisir</div>
          </div>
        </div>
      </button>
    );
  }

  const bien = snapshot?.bien;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div className="aspect-[4/3] bg-gradient-to-br from-propsight-50 to-neutral-100 flex items-center justify-center text-neutral-400">
        <Building2 size={36} strokeWidth={1.4} />
      </div>
      <div className="p-3 space-y-1">
        <div className="text-[13px] font-semibold text-neutral-900 leading-tight">
          {bien?.type ?? source.label}
        </div>
        {bien && (
          <>
            <div className="text-[11.5px] text-neutral-600">
              {bien.adresse}, {bien.ville}
            </div>
            <div className="text-[11px] text-neutral-500">
              {bien.surface} m² · {bien.pieces} pces
              {bien.etage != null && ` · ${bien.etage}e/8`}
              {bien.dpe && ` · DPE ${bien.dpe}`}
            </div>
            {bien.prix && (
              <div className="text-[11.5px] text-neutral-700 font-medium pt-0.5">
                {formatEuros(bien.prix)}
                {bien.prix_m2 && (
                  <span className="text-neutral-400 font-normal">
                    {' '}({bien.prix_m2.toLocaleString('fr-FR')} €/m²)
                  </span>
                )}
              </div>
            )}
          </>
        )}
        <button
          onClick={onChangeSource}
          className="mt-2 w-full h-7 inline-flex items-center justify-center gap-1.5 text-[11.5px] font-medium text-neutral-700 bg-neutral-50 border border-neutral-200 rounded hover:bg-neutral-100 transition-colors"
        >
          <RefreshCw size={11} />
          Changer la source
        </button>
      </div>
    </div>
  );
};

export default AtelierSourceCard;
