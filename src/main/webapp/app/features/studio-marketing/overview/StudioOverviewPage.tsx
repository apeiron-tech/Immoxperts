import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import StudioLayout from '../layout/StudioLayout';
import KpiTile from '../shared/KpiTile';
import SectionCard from '../shared/SectionCard';
import ChannelBadge from '../shared/ChannelBadge';
import { proRoutes } from 'app/config/proRoutes';
import {
  ACTIVE_CAMPAIGNS,
  CHANNEL_PERFORMANCE,
  FUNNEL_STEPS,
  formatEuros,
  formatNumber,
  INTERACTION_SOURCE_META,
  OVERVIEW_KPIS,
  PROPERTY_POTENTIAL,
  RECENT_INTERACTIONS,
  RECOMMENDATIONS,
  SCHEDULED_THIS_WEEK,
} from '../_mocks/marketing';

const PRIORITY_TONE: Record<string, string> = {
  critical: 'border-l-danger-500',
  high: 'border-l-propsight-500',
  medium: 'border-l-amber-500',
  low: 'border-l-neutral-300',
};

const PRIORITY_BADGE: Record<string, string> = {
  critical: 'bg-danger-50 text-danger-700',
  high: 'bg-propsight-50 text-propsight-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-neutral-100 text-neutral-600',
};

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const;
const DAYS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'] as const;

const HeaderToolbar: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="relative">
      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        placeholder="Bien, contact, campagne…"
        className="w-64 pl-8 pr-3 py-1.5 text-[12.5px] border border-neutral-200 rounded-md focus:outline-none focus:border-propsight-400 focus:ring-2 focus:ring-propsight-100 bg-white"
      />
    </div>
    <button className="px-2.5 py-1.5 text-[12.5px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
      <Calendar size={13} />
      19 – 25 mai 2026
    </button>
    <Link
      to={proRoutes.studioMarketing.atelier}
      className="px-3 py-1.5 text-[12.5px] font-medium border border-neutral-200 rounded-md text-neutral-800 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5"
    >
      <Plus size={13} />
      Créer un kit
    </Link>
    <Link
      to={proRoutes.studioMarketing.diffusion}
      className="px-3 py-1.5 text-[12.5px] font-medium rounded-md text-white bg-propsight-600 hover:bg-propsight-700 inline-flex items-center gap-1.5"
    >
      <Sparkles size={13} />
      Lancer une campagne
    </Link>
  </div>
);

const StudioOverviewPage: React.FC = () => (
  <StudioLayout title="Vue d'ensemble" breadcrumbCurrent="Vue d'ensemble" headerRight={<HeaderToolbar />}>
    <div className="h-full overflow-y-auto p-5 space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-6 gap-3">
        {OVERVIEW_KPIS.map(k => (
          <KpiTile
            key={k.id}
            label={k.label}
            value={k.value}
            delta={k.delta}
            trend={k.trend}
            hint={k.hint}
            invertTrendSemantics={k.id === 'cpl'}
          />
        ))}
      </div>

      {/* Grille principale 1 — Recommandations / Campagnes / Interactions */}
      <div className="grid grid-cols-12 gap-3">
        <SectionCard
          className="col-span-4"
          title="Actions recommandées"
          subtitle="Hiérarchisées par impact business"
          action={
            <span className="text-[11.5px] text-neutral-500">{RECOMMENDATIONS.length} suggestions</span>
          }
        >
          <ul className="divide-y divide-neutral-100 -mx-1">
            {RECOMMENDATIONS.map(r => (
              <li
                key={r.id}
                className={`px-3 py-2.5 border-l-2 ${PRIORITY_TONE[r.priority]} hover:bg-neutral-50 transition-colors group`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${PRIORITY_BADGE[r.priority]}`}>
                        {r.priority === 'critical' ? 'Critique' : r.priority === 'high' ? 'Haute' : r.priority === 'medium' ? 'Moyenne' : 'Faible'}
                      </span>
                      <span className="text-[10.5px] text-neutral-400">{r.source}</span>
                    </div>
                    <h4 className="text-[12.5px] font-medium text-neutral-900 leading-snug">{r.title}</h4>
                    <p className="text-[11.5px] text-neutral-600 mt-0.5 leading-snug">{r.detail}</p>
                    <p className="text-[11px] text-success-700 mt-1 font-medium">→ {r.impact}</p>
                  </div>
                  <button className="flex-shrink-0 px-2 py-1 text-[11.5px] font-medium text-propsight-700 bg-propsight-50 hover:bg-propsight-100 rounded transition-colors">
                    {r.cta}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          className="col-span-5"
          title="Campagnes actives"
          subtitle={`${ACTIVE_CAMPAIGNS.filter(c => c.status === 'active').length} en diffusion`}
          action={
            <Link to={proRoutes.studioMarketing.diffusion} className="text-[11.5px] text-propsight-700 hover:underline inline-flex items-center gap-1">
              Voir toutes <ChevronRight size={11} />
            </Link>
          }
        >
          <div className="overflow-hidden">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                  <th className="py-1.5 pr-2 font-semibold">Campagne</th>
                  <th className="py-1.5 px-2 font-semibold">Canal</th>
                  <th className="py-1.5 px-2 text-right font-semibold">Dépense</th>
                  <th className="py-1.5 px-2 text-right font-semibold">Leads</th>
                  <th className="py-1.5 px-2 text-right font-semibold">CPL</th>
                  <th className="py-1.5 pl-2 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {ACTIVE_CAMPAIGNS.map(c => (
                  <tr key={c.id} className="hover:bg-neutral-50 group">
                    <td className="py-2 pr-2">
                      <div className="font-medium text-neutral-900 truncate max-w-[180px]">{c.name}</div>
                      <div className="text-[10.5px] text-neutral-500 truncate max-w-[180px]">{c.bien}</div>
                    </td>
                    <td className="py-2 px-2">
                      <ChannelBadge channel={c.channel} />
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums text-neutral-900">{formatEuros(c.spend)}</td>
                    <td className="py-2 px-2 text-right tabular-nums font-medium text-neutral-900">{c.leads}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-neutral-700">{c.cpl.toFixed(1)} €</td>
                    <td className="py-2 pl-2">
                      <span
                        className={`text-[10.5px] font-medium px-1.5 py-0.5 rounded ${
                          c.status === 'active'
                            ? 'bg-success-50 text-success-700'
                            : c.status === 'paused'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {c.status === 'active' ? 'Active' : c.status === 'paused' ? 'En pause' : c.status === 'pending_review' ? 'En revue' : 'Terminée'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          className="col-span-3"
          title="Interactions récentes"
          subtitle="À traiter"
          action={
            <Link to={proRoutes.studioMarketing.interactions} className="text-[11.5px] text-propsight-700 hover:underline">
              Inbox
            </Link>
          }
        >
          <ul className="-mx-1 divide-y divide-neutral-100">
            {RECENT_INTERACTIONS.slice(0, 5).map(i => {
              const meta = INTERACTION_SOURCE_META[i.source];
              const Icon = meta.icon;
              return (
                <li key={i.id} className="px-2 py-2 flex items-start gap-2 hover:bg-neutral-50">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center">
                    <Icon size={13} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[12px] font-medium text-neutral-900 truncate">{i.contactName}</span>
                      <span className="text-[10.5px] text-neutral-400 flex-shrink-0">{i.receivedAgo}</span>
                    </div>
                    <p className="text-[11.5px] text-neutral-600 line-clamp-1">{i.message}</p>
                    <span className="text-[10.5px] text-neutral-400">{meta.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>

      {/* Grille principale 2 — Calendrier / Biens à fort potentiel / Performance */}
      <div className="grid grid-cols-12 gap-3">
        <SectionCard
          className="col-span-4"
          title="À publier cette semaine"
          subtitle="6 contenus planifiés · 1 trou jeudi PM"
          action={
            <Link to={proRoutes.studioMarketing.diffusion} className="text-[11.5px] text-propsight-700 hover:underline inline-flex items-center gap-1">
              Voir le calendrier <ChevronRight size={11} />
            </Link>
          }
        >
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS.map((d, idx) => {
              const items = SCHEDULED_THIS_WEEK.filter(s => s.day === d);
              return (
                <div key={d} className="flex flex-col">
                  <div className="text-[10.5px] font-semibold text-neutral-500 mb-1">{DAY_LABELS[idx]}</div>
                  <div className="space-y-1 min-h-[120px]">
                    {items.length === 0 && (
                      <div className="border border-dashed border-neutral-200 rounded h-full min-h-[110px] flex items-center justify-center">
                        <span className="text-[10px] text-neutral-300">—</span>
                      </div>
                    )}
                    {items.map(it => (
                      <div
                        key={it.id}
                        className="bg-propsight-50 border border-propsight-200/60 rounded px-1 py-1 text-left"
                        title={it.bien}
                      >
                        <div className="flex items-center gap-1">
                          <ChannelBadge channel={it.channel} />
                        </div>
                        <div className="text-[10px] text-neutral-700 mt-0.5 truncate">{it.bien}</div>
                        <div className="text-[9.5px] text-neutral-500">{it.hour}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          className="col-span-4"
          title="Biens à fort potentiel marketing"
          subtitle="Top recommandations Propsight"
          action={
            <Link to={proRoutes.studioMarketing.annonces} className="text-[11.5px] text-propsight-700 hover:underline inline-flex items-center gap-1">
              Mes annonces <ChevronRight size={11} />
            </Link>
          }
        >
          <ul className="divide-y divide-neutral-100">
            {PROPERTY_POTENTIAL.map(p => (
              <li key={p.id} className="py-2.5 first:pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-medium text-neutral-900 truncate">{p.bien}</div>
                    <div className="text-[11.5px] text-neutral-600 mt-0.5">{p.reason}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <ChannelBadge channel={p.channelHint} withLabel />
                      <span className="text-[11px] text-success-700 font-medium">→ {p.expectedImpact}</span>
                    </div>
                  </div>
                  <button className="flex-shrink-0 inline-flex items-center gap-1 text-[11.5px] font-medium text-propsight-700 hover:text-propsight-900">
                    Lancer
                    <ArrowRight size={12} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          className="col-span-4"
          title="Performance par canal"
          subtitle="30 derniers jours"
          action={
            <Link to={proRoutes.studioMarketing.performance} className="text-[11.5px] text-propsight-700 hover:underline inline-flex items-center gap-1">
              Performance <ChevronRight size={11} />
            </Link>
          }
        >
          <table className="w-full text-[11.5px]">
            <thead>
              <tr className="text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                <th className="py-1.5 text-left">Canal</th>
                <th className="py-1.5 text-right">Vues</th>
                <th className="py-1.5 text-right">Leads</th>
                <th className="py-1.5 text-right">RDV</th>
                <th className="py-1.5 text-right">Mandats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {CHANNEL_PERFORMANCE.slice(0, 8).map(p => (
                <tr key={p.channel} className="hover:bg-neutral-50">
                  <td className="py-1.5">
                    <ChannelBadge channel={p.channel} withLabel />
                  </td>
                  <td className="py-1.5 text-right tabular-nums">{formatNumber(p.impressions)}</td>
                  <td className="py-1.5 text-right tabular-nums font-medium text-neutral-900">{p.leads}</td>
                  <td className="py-1.5 text-right tabular-nums">{p.rdv}</td>
                  <td className="py-1.5 text-right tabular-nums text-propsight-700 font-medium">{p.mandats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>

      {/* Funnel attribution */}
      <SectionCard
        title="Funnel d'attribution"
        subtitle="Publications → vues → clics → leads → RDV → estimations → mandats"
        action={
          <Link to={proRoutes.studioMarketing.performance} className="text-[11.5px] text-propsight-700 hover:underline inline-flex items-center gap-1">
            <TrendingUp size={11} />
            Voir le détail
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <div className="flex items-stretch gap-2 min-w-[820px]">
            {FUNNEL_STEPS.map((step, idx) => {
              const max = FUNNEL_STEPS[0].value;
              const widthPct = Math.max(12, (step.value / max) * 100);
              const isLast = idx === FUNNEL_STEPS.length - 1;
              return (
                <div key={step.id} className="flex-1 flex items-center gap-2">
                  <div className="flex-1">
                    <div className="text-[11px] font-medium text-neutral-600 mb-1">{step.label}</div>
                    <div
                      className={`h-9 rounded flex items-center px-2 ${
                        isLast ? 'bg-propsight-600 text-white' : 'bg-propsight-100 text-propsight-900'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    >
                      <span className="text-[12px] font-semibold tabular-nums">{formatNumber(step.value)}</span>
                    </div>
                    <div className="text-[10.5px] text-neutral-500 mt-1">
                      {step.conversion !== undefined && (
                        <span className="text-success-700 font-medium">{step.conversion.toFixed(1)} %</span>
                      )}
                      {step.costPerUnit !== undefined && (
                        <span className="ml-2">· coût {step.costPerUnit} €</span>
                      )}
                    </div>
                  </div>
                  {!isLast && <ArrowRight size={12} className="text-neutral-300 flex-shrink-0 mt-5" />}
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>
    </div>
  </StudioLayout>
);

export default StudioOverviewPage;
