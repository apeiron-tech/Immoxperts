import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, User, Clock } from 'lucide-react';
import { Estimation } from '../../types';
import { StatusBadge } from '../../components/shared/StatusBadge';

interface Props {
  estimation: Estimation;
  onClick: (id: string) => void;
  onDupliquer: (id: string) => void;
  onArchiver: (id: string) => void;
  onSupprimer: (id: string) => void;
  onPromouvoir: (id: string) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days}j`;
  return `il y a ${Math.floor(days / 30)} mois`;
}

const TYPE_LABELS: Record<string, string> = {
  appartement: 'Appt.',
  maison: 'Maison',
  terrain: 'Terrain',
  parking: 'Parking',
};

const EstimationRapideCard: React.FC<Props> = ({ estimation, onClick, onDupliquer, onArchiver, onSupprimer, onPromouvoir }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const prixEstime = estimation.avm?.prix.estimation || estimation.valeur_retenue;
  const prixM2 = estimation.avm?.prix.prix_m2;

  return (
    <div
      className="bg-white border border-slate-200 rounded-md overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col"
      onClick={() => onClick(estimation.id)}
    >
      {/* Photo */}
      <div className="relative h-36 bg-slate-100 flex-shrink-0">
        {estimation.photo_url ? (
          <img src={estimation.photo_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <StatusBadge statut={estimation.statut} />
        </div>
        <div
          className="absolute top-2 right-2"
          ref={menuRef}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-6 h-6 bg-white/90 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-colors shadow-sm"
          >
            <MoreHorizontal size={13} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 bg-white border border-slate-200 rounded-md shadow-sm py-1 z-10 w-48">
              <button
                onClick={() => { onPromouvoir(estimation.id); setMenuOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                Promouvoir en avis de valeur
              </button>
              <button
                onClick={() => { onDupliquer(estimation.id); setMenuOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                Dupliquer
              </button>
              <button
                onClick={() => { onArchiver(estimation.id); setMenuOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
              >
                Archiver
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => { onSupprimer(estimation.id); setMenuOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div>
          <p className="text-sm font-medium text-slate-900 truncate">{estimation.bien.adresse}</p>
          <p className="text-xs text-slate-500">{estimation.bien.ville} · {estimation.bien.code_postal}</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>{TYPE_LABELS[estimation.bien.type_bien] || estimation.bien.type_bien}</span>
          {estimation.bien.surface > 0 && (
            <>
              <span className="text-slate-300">·</span>
              <span>{estimation.bien.surface} m²</span>
            </>
          )}
          {estimation.bien.nb_pieces > 0 && (
            <>
              <span className="text-slate-300">·</span>
              <span>{estimation.bien.nb_pieces}P</span>
            </>
          )}
        </div>

        {prixEstime ? (
          <div>
            <p className="text-base font-semibold text-slate-900">{prixEstime.toLocaleString('fr-FR')} €</p>
            {prixM2 && <p className="text-xs text-slate-400">{prixM2.toLocaleString('fr-FR')} €/m²</p>}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Pas d'estimation calculée</p>
        )}

        {estimation.client && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <User size={11} className="flex-shrink-0" />
            <span className="truncate">{estimation.client.civilite} {estimation.client.prenom} {estimation.client.nom}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-auto pt-1 border-t border-slate-100">
          <Clock size={11} className="flex-shrink-0" />
          <span>{timeAgo(estimation.updated_at)}</span>
          <span className="text-slate-300">·</span>
          <span className="truncate">{estimation.auteur}</span>
        </div>
      </div>
    </div>
  );
};

export default EstimationRapideCard;
