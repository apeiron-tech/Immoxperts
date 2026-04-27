import React from 'react';
import { Pencil } from 'lucide-react';
import { BlocComponentProps, BlocId } from './types';
import { BLOCS_REGISTRY } from './BlocsRegistry';
import BlocCouverture from './blocs/BlocCouverture';
import BlocAgence from './blocs/BlocAgence';
import BlocConseiller from './blocs/BlocConseiller';
import BlocBien from './blocs/BlocBien';
import BlocPhotos from './blocs/BlocPhotos';
import BlocPoints from './blocs/BlocPoints';
import BlocPrixMarche from './blocs/BlocPrixMarche';
import BlocCompVendus from './blocs/BlocCompVendus';
import BlocSynthese3Methodes from './blocs/BlocSynthese3Methodes';
import BlocConclusion from './blocs/BlocConclusion';
import BlocConclusionLocative from './blocs/BlocConclusionLocative';
import BlocReglementations from './blocs/BlocReglementations';
import BlocPlaceholder from './blocs/BlocPlaceholder';

const BLOCS_COMPONENTS: Partial<Record<BlocId, React.ComponentType<BlocComponentProps>>> = {
  couverture: BlocCouverture,
  agence: BlocAgence,
  conseiller: BlocConseiller,
  bien: BlocBien,
  photos: BlocPhotos,
  points: BlocPoints,
  prix_marche: BlocPrixMarche,
  comp_vendus: BlocCompVendus,
  synthese_3_methodes: BlocSynthese3Methodes,
  conclusion: BlocConclusion,
  reglementations: BlocReglementations,
};

const BlocRenderer: React.FC<BlocComponentProps & { showEditButton?: boolean }> = props => {
  const { blocConfig, isEditing, onEdit, showEditButton = true, data } = props;
  const def = BLOCS_REGISTRY[blocConfig.id];
  // Le bloc Conclusion a une variante locative pour les études locatives
  const Component =
    blocConfig.id === 'conclusion' && data.type === 'etude_locative'
      ? BlocConclusionLocative
      : BLOCS_COMPONENTS[blocConfig.id] || BlocPlaceholder;

  return (
    <div
      id={`bloc-${blocConfig.id}`}
      data-bloc-id={blocConfig.id}
      className={`relative group bg-white rounded-md ${def.pageBreakBefore ? 'page-break-before' : ''} ${
        isEditing ? 'ring-1 ring-slate-200 hover:ring-propsight-300 transition-all' : ''
      }`}
    >
      {isEditing && showEditButton && def.editable && (
        <button
          onClick={onEdit}
          className="no-print absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-propsight-600 text-white text-xs font-medium px-2 py-1 rounded shadow-md hover:bg-propsight-700 flex items-center gap-1"
          title="Éditer ce bloc"
        >
          <Pencil size={11} /> Éditer
        </button>
      )}
      <Component {...props} />
    </div>
  );
};

export default BlocRenderer;
