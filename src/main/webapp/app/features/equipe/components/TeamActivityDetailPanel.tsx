import React from 'react';
import { X, ExternalLink, User, MapPin, Tag, Clock, ArrowUpRight } from 'lucide-react';
import { Chip, PrimaryButton, SecondaryButton, formatRelativeDate } from './primitives';
import type { TeamActivityItem } from '../types';

interface Props {
  item: TeamActivityItem | null;
  onClose: () => void;
}

const TeamActivityDetailPanel: React.FC<Props> = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div className="flex flex-col min-h-0 h-full bg-white border border-slate-200 rounded-md overflow-hidden">
      <div className="flex items-start justify-between gap-2 px-3 py-2 border-b border-slate-200 flex-shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Chip tone="violet">{item.source_label}</Chip>
            <Chip tone="slate">{item.type}</Chip>
            <span className="text-[10px] text-slate-400">
              Créé le {new Date(item.event_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="text-[13px] font-bold text-slate-900 mt-1 truncate">{item.title}</div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={13} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-md p-2">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              <User size={10} />
              Âge du lead
            </div>
            <div className="text-[14px] font-bold text-slate-800 mt-0.5">
              {item.age_days ? `${item.age_days} jours` : '—'}
            </div>
          </div>
          <div className="bg-slate-50 rounded-md p-2">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              <Clock size={10} />
              Confiance
            </div>
            <div className="text-[14px] font-bold text-emerald-600 mt-0.5">83 %</div>
          </div>
          <div className="bg-slate-50 rounded-md p-2">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              <MapPin size={10} />
              Bien / adresse
            </div>
            <div className="text-[11px] text-slate-800 mt-0.5 leading-snug">{item.adresse ?? '—'}</div>
            {item.zone_label && <div className="text-[10px] text-slate-500">{item.zone_label}</div>}
          </div>
          <div className="bg-slate-50 rounded-md p-2">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              <Tag size={10} />
              Prochaine action
            </div>
            <div className="text-[11px] text-propsight-700 font-semibold mt-0.5 leading-snug">
              {item.prochaine_action_label ?? '—'}
            </div>
            {item.prochaine_action_at && (
              <div className="text-[10px] text-slate-500">
                {new Date(item.prochaine_action_at).toLocaleDateString('fr-FR')}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
            Collaborateur
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-md">
            <div className="text-[11.5px] text-slate-700">
              {item.collaborator_label && item.collaborator_label !== 'Non assigné'
                ? item.collaborator_label
                : 'Non assigné'}
            </div>
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
            Actions rapides
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <SecondaryButton size="sm">Appeler</SecondaryButton>
            <SecondaryButton size="sm">Envoyer un email</SecondaryButton>
            <SecondaryButton size="sm">Ajouter une note</SecondaryButton>
            <SecondaryButton size="sm">Créer relance</SecondaryButton>
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
            Historique
          </div>
          <div className="space-y-1.5">
            {[
              { label: 'Appel sortant', by: item.collaborator_label ?? '—', at: item.derniere_action_at },
              { label: 'Lead créé', by: 'Système', at: item.event_at },
            ]
              .filter(h => h.at)
              .map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-propsight-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-slate-800">{h.label}</div>
                    <div className="text-slate-500 text-[10px]">
                      {h.by} · {h.at && formatRelativeDate(h.at)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <button className="mt-2 text-[10.5px] text-propsight-700 hover:underline inline-flex items-center gap-0.5">
            Voir tout l’historique
            <ArrowUpRight size={10} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-2 border-t border-slate-200 bg-slate-50 flex-shrink-0">
        <PrimaryButton size="sm" icon={<ExternalLink size={10} />}>
          Ouvrir fiche complète
        </PrimaryButton>
        <SecondaryButton size="sm">Réassigner</SecondaryButton>
      </div>
    </div>
  );
};

export default TeamActivityDetailPanel;
