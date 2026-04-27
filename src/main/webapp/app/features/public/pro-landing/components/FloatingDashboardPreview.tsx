import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  FileSignature,
  Wallet,
  Target,
  ArrowUpRight,
} from 'lucide-react';

const KPIS = [
  { icon: TrendingUp, label: 'CA réalisé', value: '74 200 €', delta: '+12%', tone: 'text-emerald-600' },
  { icon: FileSignature, label: 'Mandats', value: '17', delta: '+2', tone: 'text-emerald-600' },
  { icon: Wallet, label: 'CA pipe pondéré', value: '286 450 €', delta: '+18%', tone: 'text-emerald-600' },
  { icon: Target, label: 'Part de marché', value: '0,87 %', delta: '+0,12 pt', tone: 'text-emerald-600' },
];

const PRIORITIES = [
  { urgency: 'bg-rose-500', label: 'Relancer M. Dupont', sub: 'Mandat expire dans 12j', tag: 'Urgent' },
  { urgency: 'bg-amber-500', label: 'RDV estimation', sub: '14h30 · Rue Lecourbe', tag: "Aujourd'hui" },
  { urgency: 'bg-amber-300', label: 'Signer compromis Lyon', sub: 'Dossier Pinel · Lyon 3e', tag: "Aujourd'hui" },
];

const REPORTS = [
  { client: 'Mme Martin', type: 'Avis de valeur', opens: 3, state: 'chaud' },
  { client: 'M. Prévost', type: 'Avis de valeur', opens: 5, state: 'tres_chaud' },
  { client: 'Projet Lyon', type: 'Dossier invest', opens: 4, state: 'tres_chaud' },
];

const FloatingDashboardPreview: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    className="relative w-full"
  >
    {/* Main dashboard card — sober, no float-slow */}
    <div className="relative rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-neutral-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
          </div>
          <span className="ml-3 text-[11px] text-neutral-400">
            app.propsight.fr/tableau-de-bord
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-5 px-1.5 rounded bg-propsight-50 border border-propsight-100 text-[9.5px] font-semibold text-propsight-700 flex items-center">
            PRO
          </span>
        </div>
      </div>

      {/* Dashboard body */}
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[15px] font-semibold text-neutral-900">Tableau de bord</div>
            <div className="text-[11px] text-neutral-500">30 derniers jours · Paris 15e</div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-6 px-2 rounded border border-neutral-200 text-[10.5px] text-neutral-600 flex items-center">
              30 jours
            </span>
            <span className="h-6 px-2 rounded bg-propsight-600 text-[10.5px] font-medium text-white flex items-center gap-1">
              + Action
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {KPIS.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: 0.5 + i * 0.05 }}
                className="rounded-lg border border-neutral-200 bg-white p-2.5"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9.5px] text-neutral-500 font-medium">{kpi.label}</span>
                  <Icon size={10} className="text-neutral-400" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[13px] font-semibold text-neutral-900 tabular-nums">
                    {kpi.value}
                  </span>
                  <span className={`text-[9px] font-semibold ${kpi.tone}`}>{kpi.delta}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Two-column: priorities + reports */}
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-2">
          {/* Priorities */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
            className="rounded-lg border border-neutral-200 bg-white p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-900">Mes priorités</span>
              <span className="h-4 px-1 rounded bg-neutral-100 text-[9px] font-semibold text-neutral-600 flex items-center tabular-nums">
                14
              </span>
            </div>
            <div className="space-y-1.5">
              {PRIORITIES.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-md hover:bg-neutral-50 px-1.5 py-1.5"
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.urgency}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10.5px] font-semibold text-neutral-900 truncate">
                      {p.label}
                    </div>
                    <div className="text-[9.5px] text-neutral-500 truncate">{p.sub}</div>
                  </div>
                  <span className="text-[9px] font-medium px-1.5 h-[14px] rounded bg-neutral-100 text-neutral-600 flex items-center">
                    {p.tag}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reports engagement */}
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
            className="rounded-lg border border-neutral-200 bg-white p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-900">Rapports · engagement</span>
              <span className="h-4 px-1 rounded bg-propsight-50 text-[9px] font-semibold text-propsight-700 flex items-center">
                23
              </span>
            </div>
            <div className="space-y-1.5">
              {REPORTS.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-md px-1.5 py-1.5 ${
                    r.state === 'tres_chaud' ? 'bg-rose-50/50' : ''
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-propsight-100 text-propsight-700 text-[8.5px] font-semibold flex items-center justify-center flex-shrink-0">
                    {r.client
                      .split(' ')
                      .map(s => s[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10.5px] font-semibold text-neutral-900 truncate">
                      {r.client}
                    </div>
                    <div className="text-[9.5px] text-neutral-500 truncate">{r.type}</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 4 }).map((_, k) => (
                      <span
                        key={k}
                        className={`w-1 h-1 rounded-full ${
                          k < Math.min(r.opens, 4)
                            ? r.state === 'tres_chaud'
                              ? 'bg-rose-500'
                              : r.state === 'chaud'
                              ? 'bg-amber-500'
                              : 'bg-propsight-500'
                            : 'bg-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-medium text-neutral-600 tabular-nums w-4 text-right">
                    {r.opens}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>

    {/* Floating alert badge — bottom left, no infinite pulse */}
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 1.05 }}
      className="hidden md:flex absolute -bottom-5 -left-5 items-center gap-2 rounded-lg border border-neutral-200 bg-white shadow-sm px-3 py-2.5 z-10"
    >
      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50">
        <ArrowUpRight size={13} className="text-emerald-600" />
      </span>
      <div>
        <div className="text-[10.5px] font-semibold text-neutral-900">Nouveau mandat signé</div>
        <div className="text-[9.5px] text-neutral-500">Rue Convention · commission 8 400 €</div>
      </div>
    </motion.div>

    {/* Floating alert — top right */}
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
      className="hidden md:flex absolute -top-3 -right-3 items-center gap-2 rounded-lg border border-neutral-200 bg-white shadow-sm px-3 py-2.5 z-10"
    >
      <span className="w-7 h-7 rounded-lg bg-propsight-50 text-propsight-700 flex items-center justify-center">
        <TrendingUp size={13} />
      </span>
      <div>
        <div className="text-[10.5px] font-semibold text-neutral-900">Rapport rouvert 4 fois</div>
        <div className="text-[9.5px] text-neutral-500">M. Bernard · à relancer</div>
      </div>
    </motion.div>
  </motion.div>
);

export default FloatingDashboardPreview;
