import React from 'react';
import {
  MoreHorizontal,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  EyeOff,
  ArrowRight,
  Copy,
} from 'lucide-react';
import DrawerShell, { DrawerCloseButton } from './DrawerShell';
import {
  NotifPriorityBadge,
  NotifStatusBadge,
  FreshnessLabel,
  AiSuggestionBloc,
  SectionTitle,
  InterModuleChip,
  SecondaryButton,
  PrimaryButton,
  GhostButton,
} from '../shared/primitives';
import { NotificationVeille, RecommendedAction } from '../../types';
import { fmtEuro, fmtPct } from '../../utils/format';
import { useToast } from '../shared/Toast';

interface Props {
  notification: NotificationVeille;
  onClose: () => void;
  onMarkDone: () => void;
  onIgnore: () => void;
}

const ACTION_LABEL: Record<RecommendedAction, string> = {
  ouvrir_bien: 'Ouvrir le bien',
  ouvrir_annonce: "Ouvrir l'annonce",
  ouvrir_zone: 'Ouvrir la zone',
  creer_action: 'Créer une action',
  creer_lead: 'Créer un lead',
  rattacher_lead: 'Rattacher un lead',
  lancer_estimation: 'Lancer une estimation',
  ouvrir_analyse: "Ouvrir l'analyse invest",
  creer_alerte: 'Créer une alerte',
  ouvrir_observatoire: "Ouvrir l'observatoire",
  ajouter_comparatif: 'Ajouter au comparatif',
  creer_dossier: 'Créer un dossier',
  preparer_message: 'Préparer relance',
  mettre_a_jour_suivi: 'Mettre à jour suivi',
  ignorer: 'Ignorer',
};

const DrawerNotification: React.FC<Props> = ({ notification: n, onClose, onMarkDone, onIgnore }) => {
  const toast = useToast();
  const act = (msg: string) => toast.push({ message: msg, kind: 'info' });

  const variationPct = (n.metadata as any).variation_pct as number | undefined;
  const prixAvant = (n.metadata as any).prix_avant as number | undefined;
  const prixApres = (n.metadata as any).prix_apres as number | undefined;
  const portail = (n.metadata as any).portail as string | undefined;

  const TrendIcon = variationPct !== undefined ? (variationPct < 0 ? TrendingDown : TrendingUp) : null;

  return (
    <DrawerShell onClose={onClose} width={440}>
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <NotifPriorityBadge priority={n.priority} />
            <NotifStatusBadge status={n.status} />
            {n.is_aggregated && (
              <span className="text-[10px] font-semibold text-propsight-700 bg-propsight-50 ring-1 ring-propsight-200 px-1.5 py-0.5 rounded">
                Agrégé ·{n.aggregate_count}
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <button className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-100 text-slate-500">
              <MoreHorizontal size={15} />
            </button>
            <DrawerCloseButton onClose={onClose} />
          </div>
        </div>
        <h3 className="text-[15px] font-semibold text-slate-900 leading-tight">{n.title}</h3>
        <p className="text-[11.5px] text-slate-500 mt-1">
          {(n.metadata as any).type_bien || (n.metadata as any).bien || (n.metadata as any).zone || 'Objet'}{' '}
          {portail ? `· ${portail}` : ''}
        </p>
        <div className="text-[11px] text-slate-400 mt-1">Reçu <FreshnessLabel iso={n.event_at} /></div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
        {/* Résumé événement */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Résumé événement</SectionTitle>
          <p className="text-[12px] text-slate-800 leading-relaxed">{n.message}</p>
          {prixAvant !== undefined && prixApres !== undefined && (
            <div className="mt-3 flex items-center gap-2 p-2.5 rounded-md bg-slate-50 border border-slate-200">
              <span className="text-[13px] font-semibold text-slate-500 line-through">{fmtEuro(prixAvant)}</span>
              <ArrowRight size={14} className="text-slate-400" />
              <span className="text-[14px] font-semibold text-slate-900">{fmtEuro(prixApres)}</span>
              {variationPct !== undefined && TrendIcon && (
                <span
                  className={`ml-auto inline-flex items-center gap-1 text-[12px] font-semibold ${
                    variationPct < 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  <TrendIcon size={12} />
                  {fmtPct(variationPct)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Impact métier */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Impact métier</SectionTitle>
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-[11.5px] text-slate-700 leading-relaxed">{n.explanation}</p>
          </div>
          <p className="text-[11.5px] text-slate-800 font-medium leading-relaxed">{n.business_impact}</p>
        </div>

        {/* Actions recommandées */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Actions recommandées</SectionTitle>
          <PrimaryButton
            className="w-full justify-center"
            onClick={() => {
              act(`${ACTION_LABEL[n.recommended_action]} (démo)`);
              onMarkDone();
            }}
          >
            {ACTION_LABEL[n.recommended_action]}
            <ArrowRight size={13} />
          </PrimaryButton>
          {n.secondary_actions.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {n.secondary_actions.map(a => (
                <SecondaryButton key={a} className="justify-center" onClick={() => act(`${ACTION_LABEL[a]} (démo)`)}>
                  {ACTION_LABEL[a]}
                </SecondaryButton>
              ))}
            </div>
          )}
          <GhostButton className="w-full mt-2 justify-center" onClick={onIgnore}>
            <EyeOff size={11} />
            Ignorer cet événement
          </GhostButton>
        </div>

        {/* Contexte */}
        {Object.keys(n.metadata).length > 0 && (
          <div className="bg-white rounded-md border border-slate-200 p-3">
            <SectionTitle>Contexte</SectionTitle>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {renderMetadata(n.metadata)}
            </div>
          </div>
        )}

        {/* Liens inter-modules */}
        {n.links.length > 0 && (
          <div className="bg-white rounded-md border border-slate-200 p-3">
            <SectionTitle>Liens inter-modules</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {n.links.map(l => (
                <InterModuleChip
                  key={l.label}
                  label={l.label}
                  count={l.count}
                  icon={<ExternalLink size={10} />}
                  onClick={() => act(`Naviguer vers ${l.route} (démo)`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <SectionTitle>Chronologie</SectionTitle>
          <ul className="space-y-1.5">
            <TimelineItem label={n.title} date={n.event_at} dot="violet" />
            {prixAvant !== undefined && (
              <TimelineItem
                label={`Prix modifié : ${fmtEuro(prixAvant)} → ${fmtEuro(prixApres ?? 0)}`}
                date={n.event_at}
                dot="slate"
              />
            )}
          </ul>
        </div>

        {/* AI SUGGESTION */}
        <AiSuggestionBloc
          insight={
            variationPct !== undefined && variationPct < 0
              ? `Cette baisse pourrait augmenter la probabilité de vente de +18 % et améliorer la compétitivité vs le marché local.`
              : `Action suggérée : relancer le contact ou mettre à jour le suivi pour capitaliser sur ce signal.`
          }
          onCtaClick={() => act('Analyse IA détaillée')}
        />

        {/* Footer info */}
        <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-1">
          <div className="inline-flex items-center gap-1">
            Événement ID {n.id.toUpperCase()}
            <button className="hover:text-slate-600" onClick={() => act('Copié')}>
              <Copy size={10} />
            </button>
          </div>
          <button className="hover:text-slate-700">Envoyer un feedback</button>
        </div>
      </div>

      {/* FOOTER bulk */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white flex items-center gap-2">
        <SecondaryButton className="flex-1 justify-center" onClick={onIgnore}>
          <EyeOff size={12} />
          Ignorer
        </SecondaryButton>
        <PrimaryButton className="flex-1 justify-center" onClick={onMarkDone}>
          <CheckCircle2 size={12} />
          Marquer traité
        </PrimaryButton>
      </div>
    </DrawerShell>
  );
};

const renderMetadata = (m: Record<string, unknown>): React.ReactNode[] => {
  const LABELS: Record<string, string> = {
    prix_avant: 'Prix avant',
    prix_apres: 'Prix après',
    variation_pct: 'Variation',
    prix_m2: 'Prix au m²',
    surface: 'Surface',
    dpe: 'DPE',
    adresse: 'Adresse',
    portail: 'Portail',
    type_bien: 'Type',
    zone: 'Zone',
    agence_concurrente: 'Agence',
    prix_mandat: 'Prix mandat',
    prix_concurrent: 'Prix concurrent',
    ecart_pct: 'Écart',
    rendement_pct: 'Rendement',
    client: 'Client',
    stock_avant: 'Stock avant',
    stock_apres: 'Stock après',
    biens_count: 'Nombre de biens',
    score: 'Score',
  };
  const entries = Object.entries(m).filter(([k]) => k !== 'bien_ids');
  return entries.map(([k, v]) => {
    const label = LABELS[k] ?? k;
    let display: string;
    if (typeof v === 'number') {
      if (k.includes('pct') || k.includes('ecart')) display = fmtPct(v);
      else if (k.includes('prix') && !k.includes('pct')) display = fmtEuro(v);
      else display = v.toLocaleString('fr-FR');
    } else if (typeof v === 'string') {
      display = v;
    } else {
      display = '—';
    }
    return (
      <React.Fragment key={k}>
        <span className="text-[10.5px] text-slate-500">{label}</span>
        <span className="text-[11.5px] text-slate-800 text-right truncate">{display}</span>
      </React.Fragment>
    );
  });
};

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

export default DrawerNotification;
