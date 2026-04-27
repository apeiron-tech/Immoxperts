import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MoreVertical, Settings, Eye, Code2, Power, Users, Percent, Clock } from 'lucide-react';
import type { WidgetInstance } from '../types';
import WidgetPreviewThumb from './WidgetPreviewThumb';

interface Props {
  widget: WidgetInstance;
  onCopyEmbed?: (w: WidgetInstance) => void;
}

const WidgetCard: React.FC<Props> = ({ widget, onCopyEmbed }) => {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = widget.status === 'active';

  const handleCopy = () => {
    const embed = `<div id="propsight-widget-${widget.type}"></div>\n<script src="https://widget.propsight.fr/loader.js" data-agent-id="ag_xxx" data-type="${widget.type}"></script>`;
    navigator.clipboard?.writeText(embed).catch(() => {
      /* noop mock */
    });
    setCopied(true);
    onCopyEmbed?.(widget);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-md overflow-hidden ${isActive ? '' : 'opacity-70'}`}>
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-slate-900">{widget.title}</h3>
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              {isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <a
            href={widget.domainUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-propsight-600 hover:text-propsight-700 inline-flex items-center gap-1 mt-1"
          >
            <span>&lt;/&gt;</span>
            {widget.domain}
            <ExternalLink size={11} />
          </a>
        </div>
        <div className="relative">
          <button
            className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-50"
            onClick={() => setMenuOpen(o => !o)}
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-10 text-sm">
              <button className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700">Dupliquer</button>
              <button className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700">Historique des versions</button>
              <button className="w-full text-left px-3 py-2 hover:bg-slate-50 text-rose-600 flex items-center gap-2">
                <Power size={13} />
                Désactiver
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 mt-4 flex items-stretch gap-5">
        <div className="w-[200px] flex-shrink-0">
          <WidgetPreviewThumb type={widget.type} />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-2.5 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Users size={14} className="text-slate-400" />
            <span className="text-slate-500">Leads générés (30j)</span>
            <span className="ml-auto font-semibold text-slate-900 tabular-nums">{widget.leadsLast30d}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Percent size={14} className="text-slate-400" />
            <span className="text-slate-500">Taux de conversion</span>
            <span className="ml-auto font-semibold text-slate-900 tabular-nums">
              {widget.conversionRate.toString().replace('.', ',')} %
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock size={14} className="text-slate-400" />
            <span className="text-slate-500">Dernière activité</span>
            <span className="ml-auto text-slate-700">{widget.lastActivity}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 mt-4 border-t border-slate-100 flex items-center gap-2">
        {isActive ? (
          <>
            <Link
              to={`/app/widgets/${widget.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-propsight-600 text-white hover:bg-propsight-700 transition-colors"
            >
              <Settings size={14} />
              Configurer
            </Link>
            <a
              href={`/widget/${widget.type === 'estimation_vendeur' ? 'estimation' : 'investissement'}?preview=1`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Eye size={14} />
              Aperçu
            </a>
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Code2 size={14} />
              {copied ? 'Copié ✓' : 'Copier le code'}
            </button>
          </>
        ) : (
          <button className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-propsight-600 text-white hover:bg-propsight-700">
            <Power size={14} />
            Activer le widget
          </button>
        )}
      </div>
    </div>
  );
};

export default WidgetCard;
