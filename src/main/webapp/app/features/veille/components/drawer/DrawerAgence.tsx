import React from 'react';
import {
  MoreHorizontal,
  MapPin,
  Bell,
  Building2,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Trash2,
  FileText,
  Search,
} from 'lucide-react';
import DrawerShell, { DrawerCloseButton } from './DrawerShell';
import {
  SectionTitle,
  InterModuleChip,
  AiSuggestionBloc,
  FreshnessLabel,
  SecondaryButton,
  DangerButton,
  Pill,
} from '../shared/primitives';
import { AgenceConcurrente } from '../../types';
import { fmtEuroM2, fmtInt, fmtPct } from '../../utils/format';
import { useToast } from '../shared/Toast';

interface Props {
  agence: AgenceConcurrente;
  onClose: () => void;
  onUnfollow: () => void;
}

const DrawerAgence: React.FC<Props> = ({ agence, onClose, onUnfollow }) => {
  const toast = useToast();
  const act = (msg: string) => toast.push({ message: msg, kind: 'info' });

  const isPression = agence.has_mandat_simple_sous_pression;

  return (
    <DrawerShell onClose={onClose} width={440}>
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div
              className="h-9 w-9 rounded-md flex items-center justify-center text-white font-bold text-[12px] flex-shrink-0"
              style={{ backgroundColor: agence.logo_color }}
            >
              {agence.logo_initials}
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-slate-900 leading-tight">{agence.name}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 inline-flex items-center gap-1">
                <MapPin size={10} />
                {agence.ville}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-100 text-slate-500">
              <MoreHorizontal size={15} />
            </button>
            <DrawerCloseButton onClose={onClose} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPression ? (
            <Pill className="bg-rose-50 text-rose-700 ring-rose-200">
              <AlertTriangle size={10} />
              Mandat simple sous pression
            </Pill>
          ) : (
            <Pill className="bg-sky-50 text-sky-700 ring-sky-200">Sous surveillance</Pill>
          )}
        </div>
        <div className="text-[10.5px] text-slate-400 mt-2">
          {agence.siren && <>SIREN {agence.siren}</>}
          {agence.carte_t && <> · Carte T {agence.carte_t}</>}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
        {/* Pression alerte */}
        {isPression && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle size={13} className="text-rose-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[12px] font-semibold text-rose-900">Mandat simple sous pression détecté</div>
                <p className="text-[11px] text-rose-700 mt-1 leading-relaxed">
                  Votre mandat <strong>Studio 24 m² · Paris 15e</strong> est affiché <strong>6,2 %</strong> plus cher
                  que le bien concurrent similaire de cette agence.
                </p>
                <button
                  onClick={() => act('Ouverture du mandat (démo)')}
                  className="mt-2 text-[11px] font-medium text-rose-700 hover:text-rose-900"
                >
                  Voir le mandat en détail →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Indicateurs clés</SectionTitle>
          <div className="grid grid-cols-5 gap-2">
            <KpiBlock label="Stock actif" value={agence.stock_actif} suffix="biens" />
            <KpiBlock label="Nouvelles 7j" value={agence.nouvelles_annonces_7d} />
            <KpiBlock label="Baisses 30j" value={agence.baisses_prix_30d} />
            <KpiBlock
              label="Prix moyen"
              value={agence.prix_moyen_m2 ? fmtEuroM2(agence.prix_moyen_m2) : '—'}
              large
            />
            <KpiBlock
              label="Délai moyen"
              value={agence.delai_moyen_jours ? `${agence.delai_moyen_jours} j` : '—'}
            />
          </div>
        </div>

        {/* Zones principales */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Zones principales</SectionTitle>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {agence.zones.slice(0, 5).map(z => (
              <Pill key={z.zone_id} className="bg-slate-50 text-slate-700 ring-slate-200">
                {z.label}
              </Pill>
            ))}
            {agence.zones.length > 5 && (
              <Pill className="bg-slate-100 text-slate-500 ring-slate-200">+{agence.zones.length - 5}</Pill>
            )}
          </div>
          <MiniMap />
          <button
            onClick={() => act('Voir sur la carte')}
            className="mt-2 text-[11px] font-medium text-propsight-700 hover:text-propsight-900"
          >
            Voir sur la carte →
          </button>
        </div>

        {/* Parts de marché */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Parts de marché par zone</SectionTitle>
          <div className="space-y-1.5">
            {agence.zones.slice(0, 4).map(z => {
              const evol = z.evolution_part_30d ?? 0;
              const EvolIcon = evol > 0 ? TrendingUp : evol < 0 ? TrendingDown : Minus;
              const evolColor = evol > 0 ? 'text-emerald-600' : evol < 0 ? 'text-rose-600' : 'text-slate-400';
              return (
                <div key={z.zone_id} className="flex items-center justify-between text-[11.5px]">
                  <span className="text-slate-700">{z.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900 tabular-nums w-10 text-right">
                      {z.part_de_marche !== undefined ? `${Math.round(z.part_de_marche * 100)} %` : '—'}
                    </span>
                    <span className={`inline-flex items-center gap-0.5 w-16 justify-end ${evolColor}`}>
                      <EvolIcon size={11} />
                      {evol !== 0 ? `${evol > 0 ? '+' : ''}${evol.toFixed(1)} pts` : '0'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Actions rapides</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <ActionCard icon={<Bell size={12} />} label="Créer alerte concurrent" onClick={() => act('Alerte créée')} />
            <ActionCard
              icon={<Eye size={12} />}
              label={`Voir annonces (${agence.stock_actif})`}
              onClick={() => act('Voir annonces')}
            />
            <ActionCard
              icon={<Building2 size={12} />}
              label="Comparer à mon portefeuille"
              onClick={() => act('Comparaison')}
            />
            <ActionCard icon={<Search size={12} />} label="Voir opportunités" onClick={() => act('Prospection')} />
          </div>
        </div>

        {/* Liens inter-modules */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Liens inter-modules</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            <InterModuleChip
              label="Biens similaires"
              count={agence.biens_similaires_count}
              onClick={() => act('Biens similaires')}
            />
            {agence.mandats_simples_concurrents_count > 0 && (
              <InterModuleChip
                label="Mandats en concurrence"
                count={agence.mandats_simples_concurrents_count}
                variant="danger"
                onClick={() => act('Mandats concurrents')}
              />
            )}
            <InterModuleChip
              label="Alertes actives"
              count={agence.alertes_actives.length}
              icon={<Bell size={10} />}
              onClick={() => act('Alertes')}
            />
            <InterModuleChip
              label="Notes internes"
              count={1}
              icon={<FileText size={10} />}
              onClick={() => act('Notes')}
            />
          </div>
        </div>

        {/* Chronologie */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Derniers mouvements</SectionTitle>
          <ul className="space-y-1.5">
            {agence.last_event_at && (
              <TimelineItem
                label={`${agence.last_event_label ?? 'Événement'} · Paris 15e`}
                date={agence.last_event_at}
                dot="violet"
              />
            )}
            <TimelineItem
              label="Nouvelle annonce 3 pièces 68 m² · 8 900 000 €"
              date={new Date(Date.now() - 30 * 3_600_000).toISOString()}
              dot="slate"
            />
            <TimelineItem
              label="Baisse de prix sur 1 bien (-1,2 %)"
              date={new Date(Date.now() - 48 * 3_600_000).toISOString()}
              dot="slate"
            />
          </ul>
        </div>

        {/* AI */}
        <AiSuggestionBloc
          insight={
            isPression
              ? `1 de vos mandats est sous pression. Le mandat Studio 24 m² · Paris 15e est affiché 6,2 % plus cher que le bien concurrent similaire de cette agence.`
              : `${agence.name} a augmenté sa part de marché sur ${agence.zone_principale} de +1,2 pts ces 30 derniers jours.`
          }
          onCtaClick={() => act('Analyse IA')}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
        <SecondaryButton onClick={onClose}>Fermer</SecondaryButton>
        <DangerButton
          onClick={() => {
            onUnfollow();
            act('Agence retirée du suivi');
          }}
        >
          <Trash2 size={13} />
          Ne plus suivre
        </DangerButton>
      </div>
    </DrawerShell>
  );
};

const KpiBlock: React.FC<{ label: string; value: React.ReactNode; suffix?: string; large?: boolean }> = ({
  label,
  value,
  suffix,
  large,
}) => (
  <div>
    <div className="text-[9.5px] text-slate-500 uppercase tracking-wide truncate">{label}</div>
    <div className={`${large ? 'text-[11px]' : 'text-[14px]'} font-semibold text-slate-900 mt-0.5 tabular-nums`}>
      {typeof value === 'number' ? fmtInt(value) : value}
      {suffix && <span className="text-[9px] text-slate-500 font-normal ml-0.5">{suffix}</span>}
    </div>
  </div>
);

const ActionCard: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({
  icon,
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="h-9 px-2.5 rounded-md border border-slate-200 bg-white text-[11.5px] text-slate-700 hover:bg-propsight-50 hover:border-propsight-200 hover:text-propsight-700 inline-flex items-center gap-1.5 transition-colors text-left"
  >
    {icon}
    <span className="truncate">{label}</span>
  </button>
);

const TimelineItem: React.FC<{ label: string; date: string; dot: 'violet' | 'slate' }> = ({ label, date, dot }) => (
  <li className="flex items-start gap-2 text-[11px]">
    <span
      className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${dot === 'violet' ? 'bg-propsight-500' : 'bg-slate-300'}`}
    />
    <div className="flex-1 flex items-center justify-between gap-2">
      <span className="text-slate-700 truncate">{label}</span>
      <FreshnessLabel iso={date} />
    </div>
  </li>
);

/* Mini carte SVG stylisée */
const MiniMap: React.FC = () => (
  <svg viewBox="0 0 380 130" className="w-full h-[110px] rounded-md border border-slate-200 bg-slate-50">
    <defs>
      <pattern id="mini-grid" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#E2E8F0" strokeWidth="0.4" />
      </pattern>
    </defs>
    <rect width="380" height="130" fill="url(#mini-grid)" />
    <path d="M 0 90 Q 80 80 160 85 T 380 80" stroke="#BFDBFE" strokeWidth="3" fill="none" />
    <ellipse cx="120" cy="65" rx="60" ry="38" fill="#DDD6FE" opacity="0.5" />
    <ellipse cx="230" cy="50" rx="45" ry="28" fill="#DDD6FE" opacity="0.35" />
    <ellipse cx="310" cy="80" rx="30" ry="20" fill="#DDD6FE" opacity="0.25" />
    <circle cx="120" cy="65" r="4" fill="#7C3AED" />
    <circle cx="230" cy="50" r="4" fill="#7C3AED" />
    <circle cx="310" cy="80" r="3" fill="#7C3AED" />
    <text x="120" y="60" fontSize="8" fill="#6D28D9" textAnchor="middle" fontWeight="600">
      15e
    </text>
    <text x="230" y="45" fontSize="8" fill="#6D28D9" textAnchor="middle" fontWeight="600">
      16e
    </text>
  </svg>
);

export default DrawerAgence;
