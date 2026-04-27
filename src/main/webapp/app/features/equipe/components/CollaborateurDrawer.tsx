import React from 'react';
import { X, Activity, Calendar, BarChart3, ArrowUpRight, Settings, Users, Mail, Phone } from 'lucide-react';
import {
  Avatar,
  Chip,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  WorkloadBadge,
  formatEuro,
  formatRelativeDate,
} from './primitives';
import type { Collaborateur } from '../types';

interface Props {
  collab: Collaborateur | null;
  onClose: () => void;
}

const ROLE_LABEL: Record<string, string> = {
  OWNER: 'Responsable',
  ADMIN: 'Manager',
  AGENT: 'Consultant',
  VIEWER: 'Lecteur',
};

const CollaborateurDrawer: React.FC<Props> = ({ collab, onClose }) => {
  if (!collab) return null;
  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 z-[400]" onClick={onClose} />
      <aside className="fixed right-0 top-0 bottom-0 w-[400px] bg-white shadow-2xl border-l border-slate-200 z-[401] flex flex-col">
        <div className="flex items-start justify-between gap-2 px-4 py-3 border-b border-slate-200">
          <div className="flex items-start gap-2.5 min-w-0">
            <Avatar initials={collab.initials} color={collab.avatar_color} size={42} />
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-slate-900 truncate">{collab.display_name}</div>
              <div className="text-[11px] text-slate-500">{ROLE_LABEL[collab.role]} · {collab.role}</div>
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {collab.zones.map(z => (
                  <Chip key={z.zone_id} tone="violet">{z.label}</Chip>
                ))}
                {collab.specialites.slice(0, 2).map(s => (
                  <Chip key={s} tone="slate">{s}</Chip>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-3 text-[11px] text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Mail size={11} /> {collab.email}
              </span>
              {collab.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone size={11} /> {collab.phone}
                </span>
              )}
            </div>
            <div className="text-[10.5px] text-slate-500 mt-1">
              Dernière connexion · {formatRelativeDate(collab.last_seen_at)}
            </div>
          </div>

          <div className="px-4 py-3 border-b border-slate-100">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
              KPI période (30 j)
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Leads actifs', value: collab.leads_actifs },
                { label: 'Actions retard', value: collab.actions_retard },
                { label: 'RDV semaine', value: collab.rdv_semaine },
                { label: 'Mandats', value: collab.mandats },
                { label: 'CA pipe', value: formatEuro(collab.ca_pipe) },
                { label: 'Estimations', value: collab.estimations_30j },
                { label: 'AdV envoyés', value: collab.avis_envoyes_30j },
                { label: 'Études', value: collab.etudes_locatives_30j },
                { label: 'Rapports ouv.', value: collab.rapports_ouverts },
              ].map(k => (
                <div key={k.label} className="bg-slate-50 rounded-md p-2">
                  <div className="text-[9.5px] text-slate-500">{k.label}</div>
                  <div className="text-[14px] font-bold text-slate-800 tabular-nums">{k.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-400">
                Charge
              </div>
              <WorkloadBadge score={collab.workload_score} status={collab.workload_status} compact />
            </div>
            <ProgressBar
              value={collab.workload_score}
              tone={
                collab.workload_status === 'surcharge'
                  ? 'red'
                  : collab.workload_status === 'charge'
                    ? 'orange'
                    : collab.workload_status === 'normal'
                      ? 'slate'
                      : 'emerald'
              }
              height={6}
            />
            <div className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
              Calculé à partir des actions ouvertes, retards, RDV, visites, rapports à relancer, dossiers
              actifs. Temps dispo agenda = V1.5.
            </div>
          </div>

          <div className="px-4 py-3 border-b border-slate-100">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
              Objets portés
            </div>
            <div className="space-y-1.5">
              <a
                href={`/app/activite/leads?owner=${collab.user_id}`}
                className="flex items-center justify-between px-2 py-1.5 rounded-md border border-slate-200 hover:border-propsight-300 hover:bg-slate-50 transition-colors"
              >
                <span className="text-[11.5px] text-slate-700 flex items-center gap-1.5">
                  <Users size={11} />
                  Leads assignés · {collab.leads_actifs}
                </span>
                <ArrowUpRight size={12} className="text-slate-400" />
              </a>
              <a
                href={`/app/equipe/portefeuille?collaborateur=${collab.user_id}`}
                className="flex items-center justify-between px-2 py-1.5 rounded-md border border-slate-200 hover:border-propsight-300 hover:bg-slate-50 transition-colors"
              >
                <span className="text-[11.5px] text-slate-700 flex items-center gap-1.5">
                  <BarChart3 size={11} />
                  Portefeuille · {collab.mandats} mandats
                </span>
                <ArrowUpRight size={12} className="text-slate-400" />
              </a>
              <a
                href={`/app/equipe/agenda?collaborateur=${collab.user_id}`}
                className="flex items-center justify-between px-2 py-1.5 rounded-md border border-slate-200 hover:border-propsight-300 hover:bg-slate-50 transition-colors"
              >
                <span className="text-[11.5px] text-slate-700 flex items-center gap-1.5">
                  <Calendar size={11} />
                  Agenda · {collab.rdv_semaine} RDV cette semaine
                </span>
                <ArrowUpRight size={12} className="text-slate-400" />
              </a>
              <a
                href={`/app/equipe/activite?collaborateur=${collab.user_id}`}
                className="flex items-center justify-between px-2 py-1.5 rounded-md border border-slate-200 hover:border-propsight-300 hover:bg-slate-50 transition-colors"
              >
                <span className="text-[11.5px] text-slate-700 flex items-center gap-1.5">
                  <Activity size={11} />
                  Activité commerciale
                </span>
                <ArrowUpRight size={12} className="text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-2.5 border-t border-slate-200 bg-slate-50">
          <PrimaryButton size="sm">Planifier coaching</PrimaryButton>
          <SecondaryButton size="sm">Réassigner</SecondaryButton>
          <SecondaryButton
            size="sm"
            icon={<Settings size={10} />}
            onClick={() =>
              (window.location.href = `/app/parametres/membres?edit=${collab.user_id}`)
            }
          >
            Éditer
          </SecondaryButton>
        </div>
      </aside>
    </>
  );
};

export default CollaborateurDrawer;
