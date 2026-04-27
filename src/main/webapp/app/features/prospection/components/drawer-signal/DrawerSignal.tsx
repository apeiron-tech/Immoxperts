import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MoreHorizontal, MapPin, TrendingUp, Heart, EyeOff, Bell, Briefcase } from 'lucide-react';
import { SignalProspection, MetaSignalRadar } from '../../types';
import { BadgeSource, BadgeStatut, BadgeScore } from '../shared/Badges';
import { getCtaRecommande } from '../../utils/ctaRecommande';
import { labelDvf, labelDpe, labelAnnonce } from '../../utils/formatters';
import OngletResume from './OngletResume';
import OngletContexte from './OngletContexte';
import OngletLiens from './OngletLiens';
import OngletHistorique from './OngletHistorique';
import OngletIA from './OngletIA';
import AssigneDropdown from '../shared/AssigneDropdown';
import { useToast } from '../shared/Toast';

type TabKey = 'resume' | 'contexte' | 'liens' | 'historique' | 'ia';

interface Props {
  signal: SignalProspection | MetaSignalRadar | null;
  onClose: () => void;
  onCreerLead?: (s: SignalProspection | MetaSignalRadar) => void;
  onCreerAction?: (s: SignalProspection | MetaSignalRadar) => void;
  onCreerAlerte?: (s: SignalProspection | MetaSignalRadar) => void;
  onIgnorer?: (s: SignalProspection | MetaSignalRadar) => void;
  onSuivre?: (s: SignalProspection | MetaSignalRadar) => void;
  onAssign?: (signalId: string, userId: string | undefined) => void;
}

const typeLabel = (signal: SignalProspection | MetaSignalRadar): string => {
  if ('children' in signal) {
    return 'Méta-signal';
  }
  if (signal.source === 'dvf') return labelDvf[signal.type];
  if (signal.source === 'dpe') return labelDpe[signal.type];
  if (signal.source === 'annonce') return labelAnnonce[signal.type];
  return (signal as { title?: string }).title || 'Signal';
};

const DrawerSignal: React.FC<Props> = ({
  signal,
  onClose,
  onCreerLead,
  onCreerAction,
  onCreerAlerte,
  onIgnorer,
  onSuivre,
  onAssign,
}) => {
  const [tab, setTab] = useState<TabKey>('resume');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (signal) setTab('resume');
  }, [signal]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  if (!signal) return null;

  const isMeta = 'children' in signal;
  const source = isMeta ? signal.children[0].source : signal.source;
  const score = isMeta ? signal.score_agrege : signal.score;
  const status = isMeta ? signal.status_agrege : signal.status;
  const adresse = isMeta ? signal.adresse : signal.adresse;
  const ville = isMeta ? signal.ville : signal.ville;
  const cp = isMeta ? signal.code_postal : signal.code_postal;
  const assigneeId = isMeta ? signal.assignee_id : signal.assignee_id;
  const signalId = 'signal_id' in signal ? signal.signal_id : signal.meta_id;

  const geoPrecision = isMeta ? 'exacte' : signal.geo_precision;
  const precisionLabel =
    geoPrecision === 'exacte'
      ? 'Précision exacte'
      : geoPrecision === 'adresse_approx'
        ? 'Adresse approx.'
        : geoPrecision === 'quartier'
          ? 'Quartier'
          : geoPrecision === 'iris'
            ? 'IRIS'
            : 'Zone';

  const cta = getCtaRecommande(signal);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'resume', label: 'Résumé' },
    { key: 'contexte', label: 'Contexte' },
    { key: 'liens', label: 'Liens' },
    { key: 'historique', label: 'Historique' },
    { key: 'ia', label: 'IA' },
  ];

  const handleEstimer = () => {
    if (cta.estimationPath) {
      navigate(`${cta.estimationPath}?signal_id=${signalId}&prefill=1`);
    }
  };

  const handleAnalyserInvest = () => {
    const url = new URL(window.location.href);
    const bienId = isMeta ? signal.bien_id : signal.bien_id;
    if (bienId) {
      url.searchParams.set('analyse', bienId);
      navigate(`${url.pathname}?${url.searchParams.toString()}`);
    }
    toast.push({ message: `Analyse d'investissement ouverte pour ${bienId}`, type: 'info' });
  };

  return (
    <>
      {/* Overlay léger (clic ferme) */}
      <div className="fixed inset-0 z-[90] bg-slate-900/10" onClick={onClose} />
      <aside className="fixed top-0 right-0 bottom-0 z-[100] w-[420px] bg-white border-l border-slate-200 shadow-2xl flex flex-col">
        {/* Header sticky */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <BadgeSource source={source} />
              <span className="text-[11px] font-medium text-slate-600">{typeLabel(signal)}</span>
              <BadgeStatut status={status} />
            </div>
            <div className="flex items-center gap-1">
              <button className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-100">
                <MoreHorizontal size={15} className="text-slate-500" />
              </button>
              <button
                onClick={onClose}
                className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-100"
                aria-label="Fermer"
              >
                <X size={15} className="text-slate-500" />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-semibold text-slate-900 leading-tight truncate">
                {adresse || `Signal — ${ville}`}
              </h3>
              <div className="mt-0.5 text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                <MapPin size={11} />
                <span>
                  {cp} {ville}
                </span>
                <span className="text-slate-300">·</span>
                <span>{precisionLabel}</span>
              </div>
            </div>
            <BadgeScore score={score} size="lg" />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">Assigné</span>
            <AssigneDropdown
              assigneeId={assigneeId}
              onChange={uid => onAssign?.(signalId, uid)}
            />
          </div>
        </div>

        {/* Onglets */}
        <div className="border-b border-slate-200 bg-white px-2 flex-shrink-0">
          <div className="flex gap-0.5">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-2 text-[12px] font-medium transition-colors relative ${
                  tab === t.key ? 'text-propsight-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
                {tab === t.key && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-propsight-600 rounded-t" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {tab === 'resume' && <OngletResume signal={signal} />}
          {tab === 'contexte' && <OngletContexte signal={signal} />}
          {tab === 'liens' && <OngletLiens signal={signal} />}
          {tab === 'historique' && <OngletHistorique signal={signal} />}
          {tab === 'ia' && <OngletIA signal={signal} />}
        </div>

        {/* Actions rapides sticky */}
        <div className="border-t border-slate-200 bg-white p-3 space-y-2">
          {cta.primary === 'estimer' ? (
            <button
              onClick={handleEstimer}
              className="w-full h-9 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-[13px] font-medium transition-colors inline-flex items-center justify-center gap-2"
            >
              <TrendingUp size={14} />
              {cta.label}
            </button>
          ) : cta.primary === 'analyser_invest' ? (
            <button
              onClick={handleAnalyserInvest}
              className="w-full h-9 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-[13px] font-medium transition-colors"
            >
              {cta.label}
            </button>
          ) : cta.primary === 'action' ? (
            <button
              onClick={() => onCreerAction?.(signal)}
              className="w-full h-9 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-[13px] font-medium transition-colors"
            >
              {cta.label}
            </button>
          ) : (
            <button
              onClick={() => onCreerLead?.(signal)}
              className="w-full h-9 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-[13px] font-medium transition-colors"
            >
              {cta.label}
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            {cta.primary !== 'action' && (
              <button
                onClick={() => onCreerAction?.(signal)}
                className="h-8 rounded-md border border-slate-200 hover:bg-slate-50 text-[12px] text-slate-700 inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <Briefcase size={12} />
                Créer une action
              </button>
            )}
            {cta.primary !== 'estimer' && cta.estimationPath && (
              <button
                onClick={handleEstimer}
                className="h-8 rounded-md border border-slate-200 hover:bg-slate-50 text-[12px] text-slate-700 inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <TrendingUp size={12} />
                Estimer
              </button>
            )}
            <button
              onClick={() => onSuivre?.(signal)}
              className="h-8 rounded-md border border-slate-200 hover:bg-slate-50 text-[12px] text-slate-700 inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <Heart size={12} />
              Suivre
            </button>
            <button
              onClick={() => onCreerAlerte?.(signal)}
              className="h-8 rounded-md border border-slate-200 hover:bg-slate-50 text-[12px] text-slate-700 inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <Bell size={12} />
              Créer une alerte
            </button>
          </div>

          <button
            onClick={() => onIgnorer?.(signal)}
            className="w-full h-7 inline-flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 transition-colors"
          >
            <EyeOff size={11} />
            Ignorer ce signal
          </button>
        </div>
      </aside>
    </>
  );
};

export default DrawerSignal;
