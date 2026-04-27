import React, { useMemo, useState } from 'react';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import { Eye, ChevronDown } from 'lucide-react';
import type { WidgetSlug, WidgetTab } from '../types';
import { MOCK_WIDGETS } from '../_mocks/widgets';
import OverviewTab from './tabs/OverviewTab';
import StepsTab from './tabs/StepsTab';
import AppearanceTab from './tabs/AppearanceTab';
import FormTab from './tabs/FormTab';
import ResultContentTab from './tabs/ResultContentTab';
import AutomationTab from './tabs/AutomationTab';
import TemplatesTab from './tabs/TemplatesTab';
import IntegrationTab from './tabs/IntegrationTab';
import PerformanceTab from './tabs/PerformanceTab';

const TABS: Array<{ id: WidgetTab; label: string }> = [
  { id: 'vue-ensemble', label: "Vue d'ensemble" },
  { id: 'etapes', label: 'Étapes' },
  { id: 'apparence', label: 'Apparence' },
  { id: 'formulaire', label: 'Formulaire' },
  { id: 'contenu-resultat', label: 'Contenu résultat' },
  { id: 'automatisations', label: 'Automatisations' },
  { id: 'templates', label: 'Templates' },
  { id: 'integration', label: 'Intégration' },
  { id: 'performance', label: 'Performance' },
];

const WidgetPage: React.FC = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = (params.slug as WidgetSlug) ?? 'estimation-vendeur';
  const activeTab = (searchParams.get('tab') as WidgetTab) ?? 'vue-ensemble';
  const [saveOpen, setSaveOpen] = useState(false);

  const widget = useMemo(() => MOCK_WIDGETS.find(w => w.slug === slug), [slug]);

  const setTab = (tab: WidgetTab) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  if (!widget) {
    return (
      <div className="p-10 text-slate-500">
        Widget introuvable — vérifiez l'URL. <NavLink to="/app/widgets" className="text-propsight-600">Retour au hub</NavLink>
      </div>
    );
  }

  const previewUrl = `/widget/${widget.type === 'estimation_vendeur' ? 'estimation' : 'investissement'}?preview=1`;

  const renderTab = () => {
    switch (activeTab) {
      case 'vue-ensemble':
        return <OverviewTab widget={widget} onNavigate={setTab} />;
      case 'etapes':
        return <StepsTab widget={widget} />;
      case 'apparence':
        return <AppearanceTab widget={widget} />;
      case 'formulaire':
        return <FormTab widget={widget} />;
      case 'contenu-resultat':
        return <ResultContentTab widget={widget} />;
      case 'automatisations':
        return <AutomationTab widget={widget} />;
      case 'templates':
        return <TemplatesTab widget={widget} />;
      case 'integration':
        return <IntegrationTab widget={widget} />;
      case 'performance':
        return <PerformanceTab widget={widget} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header sticky */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-8 pt-5 pb-0">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-slate-900">{widget.title}</h1>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Actif
                </span>
              </div>
              <a
                href={widget.domainUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-propsight-600 hover:text-propsight-700 inline-flex items-center gap-1 mt-1"
              >
                &lt;/&gt; {widget.domain}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Eye size={14} />
                Aperçu du widget
              </a>
              <div className="relative flex">
                <button
                  onClick={() => {
                    console.warn('[widget] save (mock)', widget.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-l-md bg-propsight-600 text-white hover:bg-propsight-700"
                >
                  Enregistrer les modifications
                </button>
                <button
                  onClick={() => setSaveOpen(o => !o)}
                  className="inline-flex items-center justify-center px-2 py-2 text-sm rounded-r-md bg-propsight-600 text-white hover:bg-propsight-700 border-l border-propsight-500"
                >
                  <ChevronDown size={14} />
                </button>
                {saveOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-20 text-sm">
                    <button
                      onClick={() => {
                        console.warn('[widget] save + publish (mock)', widget.id);
                        setSaveOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      Enregistrer et publier
                    </button>
                    <button
                      onClick={() => {
                        console.warn('[widget] draft (mock)', widget.id);
                        setSaveOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      Enregistrer comme brouillon
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div className="mt-5 flex items-center gap-1 overflow-x-auto -mx-1 px-1">
            {TABS.map(t => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
                    isActive ? 'text-propsight-700 font-medium' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                  {isActive && <div className="absolute left-2 right-2 bottom-0 h-0.5 bg-propsight-600 rounded-t" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-6">{renderTab()}</div>
    </div>
  );
};

export default WidgetPage;
