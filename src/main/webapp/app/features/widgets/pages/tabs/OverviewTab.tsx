import React from 'react';
import { ArrowRight, Calendar, GitBranch, Globe } from 'lucide-react';
import type { WidgetInstance, WidgetTab } from '../../types';
import KpiCard from '../../components/KpiCard';
import WidgetPreviewThumb from '../../components/WidgetPreviewThumb';
import ActivityTimeline from '../../components/ActivityTimeline';
import EmbedCodeBlock from '../../components/EmbedCodeBlock';
import { HUB_KPI } from '../../_mocks/kpi';
import { RECENT_ACTIVITY } from '../../_mocks/activity';

interface Props {
  widget: WidgetInstance;
  onNavigate: (t: WidgetTab) => void;
}

const OverviewTab: React.FC<Props> = ({ widget, onNavigate }) => {
  const embed = `<div id="propsight-widget-${widget.type}"></div>
<script src="https://widget.propsight.fr/loader.js"
        data-agent-id="ag_xxx"
        data-type="${widget.type}"
        data-mode="inline"></script>`;

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-md px-5 py-4 grid grid-cols-4 gap-6 text-sm">
        <div>
          <div className="text-xs text-slate-500">Statut</div>
          <div className="flex items-center gap-1.5 mt-1 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium">Actif</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Globe size={12} /> Domaine
          </div>
          <a href={widget.domainUrl} className="text-slate-900 hover:text-propsight-600 font-medium mt-1 block truncate">
            {widget.domain}
          </a>
        </div>
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <GitBranch size={12} /> Version
          </div>
          <div className="text-slate-900 font-medium mt-1">{widget.version}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Calendar size={12} /> Dernière soumission
          </div>
          <div className="text-slate-900 font-medium mt-1">{widget.lastActivity}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {HUB_KPI.map((k, i) => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            deltaUnit={k.deltaUnit as '%' | 'pts'}
            hint={k.hint}
            format={k.format}
            icon={(['views', 'starts', 'leads', 'completion'] as const)[i]}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Aperçu du rendu public</h3>
            <a
              href={`/widget/${widget.type === 'estimation_vendeur' ? 'estimation' : 'investissement'}?preview=1`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-propsight-600 hover:text-propsight-700 font-medium inline-flex items-center gap-1"
            >
              Voir en conditions réelles <ArrowRight size={11} />
            </a>
          </div>
          <div className="flex justify-center">
            <div className="w-64">
              <WidgetPreviewThumb type={widget.type} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Intégration rapide</h3>
            <button
              onClick={() => onNavigate('integration')}
              className="text-xs text-propsight-600 hover:text-propsight-700 font-medium inline-flex items-center gap-1"
            >
              Configuration détaillée <ArrowRight size={11} />
            </button>
          </div>
          <EmbedCodeBlock code={embed} label="Snippet minifié" />
          <p className="text-xs text-slate-500 mt-3">
            Collez ce code juste avant la fermeture de <code className="text-[11px] bg-slate-100 px-1 rounded">&lt;/body&gt;</code>. Le widget se charge automatiquement.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md">
        <div className="px-5 py-3.5 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Activité récente</h3>
        </div>
        <div className="px-2 py-1">
          <ActivityTimeline entries={RECENT_ACTIVITY} showWidget={false} />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
