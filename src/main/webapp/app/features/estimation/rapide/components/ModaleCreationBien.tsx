import React, { useState } from 'react';
import { X, Search, Building2 } from 'lucide-react';
import { MOCK_BIENS_PORTEFEUILLE } from '../../_mocks/biens';
import { BienPortefeuille } from '../../types';

const DPE_COLORS: Record<string, string> = {
  A: 'bg-green-600',
  B: 'bg-green-400',
  C: 'bg-yellow-400',
  D: 'bg-orange-400',
  E: 'bg-orange-500',
  F: 'bg-red-500',
  G: 'bg-red-700',
  inconnu: 'bg-slate-300',
};

const TYPE_LABELS: Record<string, string> = {
  appartement: 'Appt.',
  maison: 'Maison',
  terrain: 'Terrain',
  parking: 'Parking',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bien: BienPortefeuille) => void;
}

const ModaleCreationBien: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_BIENS_PORTEFEUILLE.filter(b => {
    const q = search.toLowerCase();
    return (
      b.adresse.toLowerCase().includes(q) ||
      b.ville.toLowerCase().includes(q) ||
      b.code_postal.includes(q) ||
      b.auteur.toLowerCase().includes(q) ||
      b.statut_mandat.toLowerCase().includes(q)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-md shadow-sm w-full max-w-xl max-h-[80vh] flex flex-col border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Building2 size={15} className="text-propsight-600" />
            <h2 className="text-sm font-semibold text-slate-900">Sélectionner un bien du portefeuille</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par adresse, ville, auteur…"
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">{filtered.length} bien{filtered.length > 1 ? 's' : ''}</p>
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-slate-400 text-sm">Aucun bien trouvé</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map(bien => (
                <button
                  key={bien.id}
                  onClick={() => onSelect(bien)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <img
                    src={bien.photo_url}
                    alt=""
                    className="w-14 h-10 object-cover rounded flex-shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 truncate">{bien.adresse}</p>
                      <span
                        className={`flex-shrink-0 w-4 h-4 rounded text-white text-xs font-bold flex items-center justify-center ${DPE_COLORS[bien.dpe] || 'bg-slate-300'}`}
                      >
                        {bien.dpe === 'inconnu' ? '?' : bien.dpe}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{bien.ville} · {bien.code_postal}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">{TYPE_LABELS[bien.type_bien]} · {bien.surface} m² · {bien.nb_pieces}P</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      bien.statut_mandat === 'Mandat exclusif' ? 'bg-propsight-50 text-propsight-700' :
                      bien.statut_mandat === 'Mandat simple' ? 'bg-blue-50 text-blue-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {bien.statut_mandat}
                    </span>
                    <span className="text-xs text-slate-400">{bien.auteur}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModaleCreationBien;
