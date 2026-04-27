import React from 'react';
import { Bell, MoreHorizontal, Edit3, Pause, Play, Copy, Zap, Trash2, Mail } from 'lucide-react';
import DrawerShell, { DrawerCloseButton } from './DrawerShell';
import {
  AlerteStatusBadge,
  AlertePriorityBadge,
  FrequencyBadge,
  AssigneeAvatar,
  FreshnessLabel,
  AiSuggestionBloc,
  SectionTitle,
  InterModuleChip,
  DangerButton,
  SecondaryButton,
} from '../shared/primitives';
import { Alerte } from '../../types';
import { findUser } from '../../_mocks/users';
import { useToast } from '../shared/Toast';

interface Props {
  alerte: Alerte;
  onClose: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

const DrawerAlerte: React.FC<Props> = ({ alerte, onClose, onToggleStatus, onDelete }) => {
  const toast = useToast();
  const assignee = findUser(alerte.assigned_to);

  const act = (msg: string) => toast.push({ message: msg, kind: 'info' });

  return (
    <DrawerShell onClose={onClose}>
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <Bell size={11} className="text-propsight-600" />
            Alerte
          </div>
          <div className="flex items-center gap-0.5">
            <button className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-100 text-slate-500">
              <MoreHorizontal size={15} />
            </button>
            <DrawerCloseButton onClose={onClose} />
          </div>
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-slate-900 leading-tight">{alerte.name}</h3>
          <AlerteStatusBadge status={alerte.status} />
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          ID {alerte.id.toUpperCase()} · Créée le {new Date(alerte.created_at).toLocaleDateString('fr-FR')}
        </p>
        {alerte.description && <p className="text-[11.5px] text-slate-600 mt-2 leading-snug">{alerte.description}</p>}
      </div>

      {/* CONTENT scroll */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
        {/* KEY INFO */}
        <div className="bg-white rounded-md border border-slate-200 p-3 space-y-2">
          <SectionTitle>Informations clés</SectionTitle>
          <FieldRow label="Périmètre">
            <div className="text-[11.5px] text-slate-800">
              {alerte.target_label}
              {alerte.target_secondary_label && (
                <div className="text-[10.5px] text-slate-500">{alerte.target_secondary_label}</div>
              )}
            </div>
          </FieldRow>
          <FieldRow label="Condition">
            <div className="text-[11.5px] text-slate-800">
              {alerte.conditions.map(c => c.label).join(' · ')}
            </div>
          </FieldRow>
          <FieldRow label="Fréquence">
            <FrequencyBadge frequency={alerte.frequency} />
          </FieldRow>
          <FieldRow label="Canaux">
            <div className="flex items-center gap-1.5">
              {alerte.channels.includes('in_app') && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-700">
                  <Bell size={11} />
                  In-app
                </span>
              )}
              {alerte.channels.includes('email') && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-700">
                  <Mail size={11} />
                  Email
                </span>
              )}
            </div>
          </FieldRow>
          <FieldRow label="Priorité">
            <AlertePriorityBadge priority={alerte.priority} />
          </FieldRow>
          <FieldRow label="Assigné">
            {assignee ? (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700">
                <AssigneeAvatar user={assignee} size={18} />
                {assignee.name}
              </span>
            ) : (
              <span className="text-[11.5px] text-slate-400">Non assigné</span>
            )}
          </FieldRow>
        </div>

        {/* PERFORMANCE KPIs */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Performance 30 derniers jours</SectionTitle>
          <div className="grid grid-cols-4 gap-2">
            <KpiTile label="Événements" value={alerte.triggers_count_30d} />
            <KpiTile
              label="À traiter"
              value={Math.round(alerte.triggers_count_30d * (1 - alerte.treated_rate_30d))}
            />
            <KpiTile label="Traités" value={`${Math.round(alerte.treated_rate_30d * 100)} %`} />
            <KpiTile label="Temps moyen" value={alerte.avg_treatment_time_hours ? `${alerte.avg_treatment_time_hours} h` : '—'} />
          </div>
        </div>

        {/* ACTIONS RAPIDES */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Actions rapides</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <ActionCard icon={<Edit3 size={12} />} label="Modifier" onClick={() => act('Édition alerte (démo)')} />
            <ActionCard
              icon={alerte.status === 'paused' ? <Play size={12} /> : <Pause size={12} />}
              label={alerte.status === 'paused' ? 'Réactiver' : 'Mettre en pause'}
              onClick={() => {
                onToggleStatus();
                act(alerte.status === 'paused' ? 'Alerte réactivée' : 'Alerte mise en pause');
              }}
            />
            <ActionCard icon={<Bell size={12} />} label="Voir notifications" onClick={() => act('Ouverture notifications…')} />
            <ActionCard icon={<Copy size={12} />} label="Dupliquer" onClick={() => act('Alerte dupliquée')} />
            <ActionCard icon={<Zap size={12} />} label="Tester maintenant" onClick={() => act('Test déclenchement OK')} />
          </div>
        </div>

        {/* LIENS INTER-MODULES */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Liens inter-modules</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            <InterModuleChip label="Biens correspondants" count={12} onClick={() => act('Biens correspondants')} />
            {alerte.target_type === 'recherche' && (
              <InterModuleChip label="Recherches associées" count={3} onClick={() => act('Recherches')} />
            )}
            <InterModuleChip label="Actions liées" count={4} onClick={() => act('Actions')} />
          </div>
        </div>

        {/* CHRONOLOGIE */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Chronologie</SectionTitle>
          <ul className="space-y-1.5">
            {alerte.last_triggered_at && (
              <TimelineItem
                label={`Déclenchement · ${alerte.last_trigger_label}`}
                date={alerte.last_triggered_at}
                dot="violet"
              />
            )}
            <TimelineItem label="Alerte créée" date={alerte.created_at} dot="slate" />
          </ul>
          <button className="mt-2 text-[11px] font-medium text-propsight-700 hover:text-propsight-900">
            Voir toute l'activité →
          </button>
        </div>

        {/* AI SUGGESTION */}
        <AiSuggestionBloc
          insight={
            alerte.health_status === 'silent'
              ? `Cette alerte n'a déclenché aucun événement depuis 30+ jours. Envisagez d'élargir la zone ou d'ajuster le seuil.`
              : alerte.health_status === 'noisy'
                ? `Volume élevé de déclenchements (${alerte.triggers_count_30d}/30j). Augmentez le seuil pour mieux filtrer le bruit.`
                : `Le volume de nouvelles annonces a augmenté de 22% sur ${alerte.target_label.split(' · ')[0]} ces 7 derniers jours. Envisagez d'ajuster le filtre prix.`
          }
          onCtaClick={() => act('Suggestion IA détaillée')}
        />
      </div>

      {/* FOOTER */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
        <SecondaryButton onClick={onClose}>Fermer</SecondaryButton>
        <DangerButton
          onClick={() => {
            onDelete();
            act('Alerte supprimée');
          }}
        >
          <Trash2 size={13} />
          Supprimer
        </DangerButton>
      </div>
    </DrawerShell>
  );
};

/* ----- Atomes locaux ----- */

const FieldRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-start justify-between gap-3 py-1 border-b border-slate-100 last:border-0">
    <span className="text-[11px] text-slate-500">{label}</span>
    <div className="text-right">{children}</div>
  </div>
);

const KpiTile: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="text-center">
    <div className="text-[16px] font-semibold text-slate-900 tabular-nums">{value}</div>
    <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
  </div>
);

const ActionCard: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({
  icon,
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="h-9 px-2.5 rounded-md border border-slate-200 bg-white text-[11.5px] text-slate-700 hover:bg-propsight-50 hover:border-propsight-200 hover:text-propsight-700 inline-flex items-center gap-1.5 transition-colors"
  >
    {icon}
    {label}
  </button>
);

const TimelineItem: React.FC<{ label: string; date: string; dot: 'violet' | 'slate' }> = ({ label, date, dot }) => (
  <li className="flex items-start gap-2 text-[11px]">
    <span
      className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${dot === 'violet' ? 'bg-propsight-500' : 'bg-slate-300'}`}
    />
    <div className="flex-1 flex items-center justify-between gap-2">
      <span className="text-slate-700">{label}</span>
      <FreshnessLabel iso={date} />
    </div>
  </li>
);

export default DrawerAlerte;
