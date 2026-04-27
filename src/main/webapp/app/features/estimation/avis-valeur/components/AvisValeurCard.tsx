import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, User, Clock, Eye, EyeOff, Copy, Archive, Trash2, GitBranch, Edit } from 'lucide-react';
import { Estimation } from '../../types';
import { StatusBadge } from '../../components/shared/StatusBadge';

interface Props {
  avis: Estimation;
  onClick: (id: string) => void;
  onEditer: (id: string) => void;
  onDupliquer: (id: string) => void;
  onNouvelleVersion: (id: string) => void;
  onArchiver: (id: string) => void;
  onSupprimer: (id: string) => void;
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

const AvisValeurCard: React.FC<Props> = ({ avis, onClick, onEditer, onDupliquer, onNouvelleVersion, onArchiver, onSupprimer }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const prix = avis.valeur_retenue_detail?.prix ?? avis.valeur_retenue ?? avis.avm?.prix.estimation;
  const envoye = avis.statut === 'envoyee' || avis.statut === 'ouverte';
  const ouvert = avis.statut === 'ouverte' && (avis.envoi?.ouvertures.length || 0) > 0;
  const nbOuvertures = avis.envoi?.ouvertures.length || 0;

  return (
    <div
      className="bg-white border border-slate-200 rounded-md overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col"
      onClick={() => onClick(avis.id)}
    >
      <div className="relative h-36 bg-slate-100 flex-shrink-0">
        {avis.photo_url ? (
          <img src={avis.photo_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <StatusBadge statut={avis.statut} />
          {envoye && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                ouvert ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'
              }`}
              title={ouvert ? `Ouvert ${nbOuvertures} fois` : 'Envoyé, pas encore ouvert'}
            >
              {ouvert ? <Eye size={10} /> : <EyeOff size={10} />}
              {ouvert ? nbOuvertures : ''}
            </span>
          )}
          {avis.version && avis.version > 1 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-propsight-100 text-propsight-700">
              v{avis.version}
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2" ref={menuRef} onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-6 h-6 bg-white/90 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-colors shadow-sm"
          >
            <MoreHorizontal size={13} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 bg-white border border-slate-200 rounded-md shadow-sm py-1 z-10 w-52">
              <MenuItem icon={<Edit size={12} />} label="Éditer" onClick={() => { onEditer(avis.id); setMenuOpen(false); }} disabled={avis.statut === 'envoyee' || avis.statut === 'ouverte' || avis.statut === 'archivee'} />
              <MenuItem icon={<Copy size={12} />} label="Dupliquer" onClick={() => { onDupliquer(avis.id); setMenuOpen(false); }} />
              {envoye && (
                <MenuItem icon={<GitBranch size={12} />} label="Nouvelle version" onClick={() => { onNouvelleVersion(avis.id); setMenuOpen(false); }} />
              )}
              <MenuItem icon={<Archive size={12} />} label="Archiver" onClick={() => { onArchiver(avis.id); setMenuOpen(false); }} />
              <div className="border-t border-slate-100 my-1" />
              <MenuItem icon={<Trash2 size={12} />} label="Supprimer" onClick={() => { onSupprimer(avis.id); setMenuOpen(false); }} danger />
            </div>
          )}
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div>
          <p className="text-sm font-medium text-slate-900 truncate">{avis.bien.adresse}</p>
          <p className="text-xs text-slate-500">{avis.bien.ville} · {avis.bien.code_postal}</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>{TYPE_LABELS[avis.bien.type_bien] || avis.bien.type_bien}</span>
          {avis.bien.surface > 0 && <><span className="text-slate-300">·</span><span>{avis.bien.surface} m²</span></>}
          {avis.bien.nb_pieces > 0 && <><span className="text-slate-300">·</span><span>{avis.bien.nb_pieces}P</span></>}
        </div>

        {prix ? (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Prix retenu</p>
            <p className="text-base font-semibold text-slate-900 tabular-nums">{prix.toLocaleString('fr-FR')} €</p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Prix non fixé</p>
        )}

        {/* Client - obligatoire sur AdV, mis en valeur */}
        {avis.client && (
          <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-propsight-50/60 px-2 py-1 rounded border border-propsight-100">
            <User size={11} className="text-propsight-500 flex-shrink-0" />
            <span className="truncate font-medium">{avis.client.civilite} {avis.client.prenom} {avis.client.nom}</span>
          </div>
        )}

        {/* Info ouverture si applicable */}
        {ouvert && avis.envoi?.derniere_ouverture && (
          <p className="text-[11px] text-green-700">
            Ouvert {timeAgo(avis.envoi.derniere_ouverture)}{nbOuvertures > 1 ? ` · ${nbOuvertures} vues` : ''}
          </p>
        )}
        {avis.mandat_signe && (
          <p className="text-[11px] text-propsight-700 font-medium">✓ Mandat signé</p>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-auto pt-1 border-t border-slate-100">
          <Clock size={11} className="flex-shrink-0" />
          <span>{timeAgo(avis.updated_at)}</span>
          <span className="text-slate-300">·</span>
          <span className="truncate">{avis.auteur}</span>
        </div>
      </div>
    </div>
  );
};

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean }> = ({ icon, label, onClick, disabled, danger }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
      disabled
        ? 'text-slate-300 cursor-not-allowed'
        : danger
        ? 'text-red-500 hover:bg-red-50'
        : 'text-slate-700 hover:bg-slate-50'
    }`}
  >
    <span className={disabled ? 'text-slate-300' : danger ? 'text-red-400' : 'text-slate-400'}>{icon}</span>
    {label}
  </button>
);

export default AvisValeurCard;
