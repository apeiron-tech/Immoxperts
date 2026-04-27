import React from 'react';
import { MapPin } from 'lucide-react';
import { BlocComponentProps } from '../types';

const DPE_COLORS: Record<string, string> = {
  A: 'bg-[#008F3D] text-white',
  B: 'bg-[#4CB849] text-white',
  C: 'bg-[#C7D933] text-slate-900',
  D: 'bg-[#F5E93B] text-slate-900',
  E: 'bg-[#F9B233] text-white',
  F: 'bg-[#EC7D2A] text-white',
  G: 'bg-[#E30613] text-white',
  inconnu: 'bg-slate-200 text-slate-500',
};

const TYPE_LABEL: Record<string, string> = {
  appartement: 'Appartement',
  maison: 'Maison',
  terrain: 'Terrain',
  parking: 'Parking',
};

const BlocBien: React.FC<BlocComponentProps> = ({ data }) => {
  const { estimation } = data;
  const b = estimation.bien;

  const carac = b.caracteristiques || [];

  return (
    <div className="rapport-bloc rapport-bien px-10 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-4">Le bien</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg overflow-hidden bg-slate-100 aspect-[4/3]">
          <img
            src={estimation.photo_url || `https://picsum.photos/seed/${estimation.id}/600/450`}
            alt="Photo principale"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 aspect-[4/3] relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #94a3b8 0, #94a3b8 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, #94a3b8 0, #94a3b8 1px, transparent 1px, transparent 30px)',
          }} />
          <div className="bg-propsight-600 text-white rounded-full p-2 shadow-lg z-10">
            <MapPin size={20} />
          </div>
          <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur rounded px-2 py-1.5 text-xs text-slate-700 shadow-sm">
            <p className="font-medium truncate">{b.adresse}</p>
            <p className="text-slate-500">{b.code_postal} {b.ville}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat label="Type" value={TYPE_LABEL[b.type_bien] || b.type_bien} />
        <Stat label="Surface" value={`${b.surface} m²`} />
        <Stat label="Pièces" value={String(b.nb_pieces)} />
        <Stat label="Chambres" value={String(b.nb_chambres || '—')} />
        <Stat label="Étage" value={b.etage > 0 ? `${b.etage}/${b.nb_etages || '—'}` : 'RDC'} />
        <Stat label="Année" value={b.annee_construction ? String(b.annee_construction) : '—'} />
        <Stat label="Exposition" value={b.exposition || '—'} />
        <Stat label="État" value={(b.etat || '').replace(/_/g, ' ')} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <DpeRow label="DPE" value={b.dpe} />
        <DpeRow label="GES" value={b.ges} />
      </div>

      {carac.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Caractéristiques</p>
          <div className="flex flex-wrap gap-1.5">
            {carac.map(c => (
              <span key={c} className="px-2 py-0.5 bg-propsight-50 text-propsight-700 text-xs rounded-md font-medium capitalize">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {b.description && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</p>
          <p className="text-sm text-slate-700 leading-relaxed">{b.description}</p>
        </div>
      )}
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md border border-slate-200 px-3 py-2">
    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{label}</p>
    <p className="text-sm font-semibold text-slate-900 capitalize">{value}</p>
  </div>
);

const DpeRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 w-10">{label}</span>
    <div className="flex gap-1">
      {(['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const).map(letter => (
        <div
          key={letter}
          className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center transition-all ${
            letter === value ? `${DPE_COLORS[letter]} ring-2 ring-propsight-500 ring-offset-1 scale-110` : 'bg-slate-100 text-slate-300'
          }`}
        >
          {letter}
        </div>
      ))}
    </div>
  </div>
);

export default BlocBien;
