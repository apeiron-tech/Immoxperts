import React from 'react';
import {
  MoreHorizontal,
  Heart,
  Home,
  TrendingUp,
  TrendingDown,
  Briefcase,
  UserPlus,
  Bell,
  Layers,
  FolderOpen,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import DrawerShell, { DrawerCloseButton } from './DrawerShell';
import {
  DpeBadge,
  ScoreInteretBadge,
  AnnonceStatusBadge,
  FreshnessLabel,
  AiSuggestionBloc,
  SectionTitle,
  InterModuleChip,
  DangerButton,
  SecondaryButton,
} from '../shared/primitives';
import { BienSuivi } from '../../types';
import { fmtEuro, fmtEuroM2, fmtPct, fmtSurface } from '../../utils/format';
import { useToast } from '../shared/Toast';

interface Props {
  bien: BienSuivi;
  onClose: () => void;
  onRetirer: () => void;
}

const DrawerBienSuivi: React.FC<Props> = ({ bien, onClose, onRetirer }) => {
  const toast = useToast();
  const act = (msg: string) => toast.push({ message: msg, kind: 'info' });

  return (
    <DrawerShell onClose={onClose} width={440}>
      {/* Photo header */}
      <div className="relative flex-shrink-0">
        <div className="h-[180px] bg-slate-200 relative overflow-hidden">
          {bien.photo_url ? (
            <img src={bien.photo_url} alt={bien.adresse} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <Home size={32} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <button className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-white/90 backdrop-blur shadow-sm text-rose-500 hover:bg-white">
              <Heart size={13} className="fill-rose-500" />
            </button>
            <button className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-white/90 backdrop-blur shadow-sm text-slate-600 hover:bg-white">
              <MoreHorizontal size={13} />
            </button>
            <button
              onClick={onClose}
              className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-white/90 backdrop-blur shadow-sm text-slate-600 hover:bg-white"
            >
              <DrawerCloseButton onClose={onClose} />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <button className="h-6 w-6 inline-flex items-center justify-center rounded-md bg-white/90 backdrop-blur shadow-sm text-slate-600 hover:bg-white">
              <ChevronLeft size={12} />
            </button>
            <span className="text-[10px] text-white bg-slate-900/60 rounded px-1.5 py-0.5">1/12</span>
            <button className="h-6 w-6 inline-flex items-center justify-center rounded-md bg-white/90 backdrop-blur shadow-sm text-slate-600 hover:bg-white">
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Titre */}
      <div className="px-4 py-3 border-b border-slate-200">
        <h3 className="text-[15px] font-semibold text-slate-900 leading-tight">
          {bien.type_bien} {bien.pieces ? `T${bien.pieces}` : ''} · {fmtSurface(bien.surface)}
        </h3>
        <p className="text-[11.5px] text-slate-500 mt-0.5">
          {bien.adresse}, {bien.code_postal} {bien.ville}
        </p>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
        {/* Infos clés */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <div className="grid grid-cols-4 gap-2 mb-3">
            <InfoTile label="Type" value={bien.type_bien} />
            <InfoTile label="Surface" value={fmtSurface(bien.surface)} />
            <InfoTile label="Étage" value={bien.etage ?? '—'} />
            <InfoTile label="Année" value={bien.annee_construction ? String(bien.annee_construction) : '—'} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <InfoTile label="Prix" value={fmtEuro(bien.prix_actuel)} strong />
            <InfoTile
              label="Variation"
              value={
                bien.variation_pct !== undefined ? (
                  <span
                    className={`inline-flex items-center gap-0.5 ${
                      bien.variation_pct < 0
                        ? 'text-rose-600'
                        : bien.variation_pct > 0
                          ? 'text-emerald-600'
                          : 'text-slate-500'
                    }`}
                  >
                    {bien.variation_pct < 0 ? (
                      <TrendingDown size={11} />
                    ) : bien.variation_pct > 0 ? (
                      <TrendingUp size={11} />
                    ) : null}
                    {fmtPct(bien.variation_pct)}
                  </span>
                ) : (
                  '—'
                )
              }
            />
            <InfoTile label="DPE" value={<DpeBadge classe={bien.dpe} size="sm" />} />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <AnnonceStatusBadge status={bien.statut_annonce} />
            <ScoreInteretBadge score={bien.score_interet} label={bien.score_label} />
          </div>
        </div>

        {/* Historique prix (mini chart SVG) */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Historique des prix (6 mois)</SectionTitle>
          <PriceHistoryChart bien={bien} />
          <div className="mt-2 grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <MiniStat label="Prix moyen zone" value="9 250 €/m²" />
            <MiniStat label="Délai moyen" value="45 j" />
            <MiniStat label="Tension" value="Forte" accent="emerald" />
          </div>
        </div>

        {/* Score breakdown */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <SectionTitle>Score d&apos;intérêt</SectionTitle>
            <ScoreInteretBadge score={bien.score_interet} label={bien.score_label} />
          </div>
          <div className="space-y-1">
            {bien.score_breakdown.map(c => (
              <div key={c.key} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-600">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[10.5px]">{c.detail}</span>
                  <span
                    className={`font-semibold tabular-nums w-8 text-right ${
                      c.contribution > 15 ? 'text-emerald-600' : c.contribution > 5 ? 'text-amber-600' : 'text-slate-400'
                    }`}
                  >
                    +{c.contribution}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Actions rapides</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <ActionCard icon={<Home size={12} />} label="Fiche bien" onClick={() => act('Fiche bien')} />
            <ActionCard icon={<TrendingUp size={12} />} label="Analyse invest" onClick={() => act('Analyse invest')} />
            <ActionCard icon={<Layers size={12} />} label="Estimer" onClick={() => act('Estimation lancée')} />
            <ActionCard icon={<Briefcase size={12} />} label="Créer action" onClick={() => act('Action créée')} />
            <ActionCard icon={<UserPlus size={12} />} label="Créer lead" onClick={() => act('Lead créé')} />
            <ActionCard icon={<Bell size={12} />} label="Créer alerte" onClick={() => act('Alerte créée')} />
          </div>
        </div>

        {/* Liens inter-modules */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Liens inter-modules</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {bien.estimation_valeur !== undefined && (
              <InterModuleChip
                label={`Estimation ${fmtEuro(bien.estimation_valeur)}`}
                onClick={() => act('Estimation')}
              />
            )}
            {bien.analyse_tri_pct !== undefined && (
              <InterModuleChip
                label={`Analyse invest · TRI ${fmtPct(bien.analyse_tri_pct)}`}
                onClick={() => act('Analyse')}
              />
            )}
            <InterModuleChip
              label="Leads associés"
              count={bien.leads_count}
              icon={<UserPlus size={10} />}
              onClick={() => act('Leads')}
            />
            {bien.dossier_name && (
              <InterModuleChip
                label={`Dossier · ${bien.dossier_name}`}
                icon={<FolderOpen size={10} />}
                onClick={() => act('Dossier')}
              />
            )}
          </div>
        </div>

        {/* Chronologie */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Chronologie</SectionTitle>
          <ul className="space-y-1.5">
            {bien.last_event_at && (
              <TimelineItem label={bien.last_event_label ?? 'Dernier événement'} date={bien.last_event_at} dot="violet" />
            )}
            <TimelineItem label="Bien ajouté au suivi" date={bien.created_at} dot="slate" />
          </ul>
        </div>

        {/* AI */}
        <AiSuggestionBloc
          insight={
            bien.variation_pct !== undefined && bien.variation_pct < -3
              ? `Le prix a baissé de ${Math.abs(bien.variation_pct).toFixed(1)} % et reste 4 % sous le prix estimé du marché. Bonne opportunité d'achat. Contact recommandé dans les 3 prochains jours.`
              : `Score d'intérêt de ${bien.score_interet}/100. Surveillance active recommandée.`
          }
          onCtaClick={() => act('Analyse complète')}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
        <SecondaryButton onClick={onClose}>Fermer</SecondaryButton>
        <DangerButton
          onClick={() => {
            onRetirer();
            act('Bien retiré du suivi');
          }}
        >
          <Trash2 size={13} />
          Retirer du suivi
        </DangerButton>
      </div>
    </DrawerShell>
  );
};

/* --- Atomes locaux --- */

const InfoTile: React.FC<{ label: string; value: React.ReactNode; strong?: boolean }> = ({ label, value, strong }) => (
  <div>
    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
    <div className={`text-[12px] mt-0.5 ${strong ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{value}</div>
  </div>
);

const MiniStat: React.FC<{ label: string; value: string; accent?: 'emerald' | 'amber' }> = ({ label, value, accent }) => (
  <div className="text-center">
    <div className="text-[9.5px] text-slate-500 uppercase tracking-wide">{label}</div>
    <div
      className={`text-[12px] font-semibold mt-0.5 ${
        accent === 'emerald' ? 'text-emerald-600' : accent === 'amber' ? 'text-amber-600' : 'text-slate-800'
      }`}
    >
      {value}
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
      <span className="text-slate-700 truncate">{label}</span>
      <FreshnessLabel iso={date} />
    </div>
  </li>
);

const PriceHistoryChart: React.FC<{ bien: BienSuivi }> = ({ bien }) => {
  // Données simulées : 6 points de prix
  const current = bien.prix_actuel;
  const prev = bien.prix_precedent ?? current;
  const base = prev + Math.abs(prev - current) * 2;
  const series = [base, base - 8000, base - 12000, prev + 5000, prev, current];
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = max - min || 1;
  const W = 380;
  const H = 100;
  const pts = series.map((v, i) => {
    const x = (i / (series.length - 1)) * (W - 20) + 10;
    const y = H - 20 - ((v - min) / range) * (H - 40);
    return { x, y, v };
  });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${path} L ${pts[pts.length - 1].x} ${H - 10} L ${pts[0].x} ${H - 10} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[100px]">
      <defs>
        <linearGradient id="price-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 1, 2, 3].map(i => (
        <line
          key={i}
          x1="10"
          x2={W - 10}
          y1={20 + i * ((H - 40) / 3)}
          y2={20 + i * ((H - 40) / 3)}
          stroke="#F1F5F9"
          strokeWidth="1"
        />
      ))}
      <path d={areaPath} fill="url(#price-grad)" />
      <path d={path} fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 3 : 1.8} fill="#7C3AED" />
      ))}
      <text x={pts[pts.length - 1].x + 4} y={pts[pts.length - 1].y - 4} className="text-[9px]" fill="#6D28D9" fontWeight="600">
        {fmtEuro(current)}
      </text>
      {/* Mois labels */}
      {['déc.', 'janv.', 'févr.', 'mars', 'avr.', 'mai'].map((m, i) => (
        <text
          key={m}
          x={(i / 5) * (W - 20) + 10}
          y={H - 2}
          className="text-[9px]"
          fill="#94A3B8"
          textAnchor="middle"
        >
          {m}
        </text>
      ))}
    </svg>
  );
};

export default DrawerBienSuivi;
