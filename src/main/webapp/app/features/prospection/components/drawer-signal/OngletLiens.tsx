import React from 'react';
import { ChevronRight, Home, FileText, Users, Eye, Bell, Briefcase, TrendingUp, Map } from 'lucide-react';
import { SignalProspection, MetaSignalRadar } from '../../types';

interface Props {
  signal: SignalProspection | MetaSignalRadar;
}

const Link: React.FC<{ icon: React.ReactNode; label: string; sub?: string; onClick?: () => void }> = ({
  icon,
  label,
  sub,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors text-left"
  >
    <span className="h-7 w-7 rounded-md bg-propsight-50 text-propsight-600 flex items-center justify-center flex-shrink-0">
      {icon}
    </span>
    <div className="flex-1 min-w-0">
      <div className="text-[13px] font-medium text-slate-900">{label}</div>
      {sub && <div className="text-[11px] text-slate-500 truncate">{sub}</div>}
    </div>
    <ChevronRight size={14} className="text-slate-400" />
  </button>
);

const OngletLiens: React.FC<Props> = ({ signal }) => {
  const isMeta = 'children' in signal;
  const bienId = isMeta ? signal.bien_id : signal.bien_id;
  return (
    <div className="space-y-2">
      {bienId && (
        <Link
          icon={<Home size={14} />}
          label="Ouvrir la fiche bien"
          sub={`Bien ${bienId}`}
          onClick={() => console.warn('[demo] open fiche bien', bienId)}
        />
      )}
      {!isMeta && signal.source === 'annonce' && signal.annonce_id && (
        <Link
          icon={<FileText size={14} />}
          label="Annonce liée"
          sub="Voir dans Biens > Annonces"
          onClick={() => console.warn('[demo] open annonce', signal.annonce_id)}
        />
      )}
      {!isMeta && signal.source === 'dvf' && (
        <Link
          icon={<FileText size={14} />}
          label="Ouvrir la vente DVF"
          sub="Voir dans Biens > Biens vendus"
          onClick={() => console.warn('[demo] open dvf')}
        />
      )}
      {'lead_id' in signal && signal.lead_id && (
        <Link icon={<Users size={14} />} label="Lead lié" sub="Voir dans Mon activité > Leads" />
      )}
      {'action_id' in signal && signal.action_id && (
        <Link icon={<Briefcase size={14} />} label="Action liée" sub="Voir dans Mon activité" />
      )}
      {'estimation_id' in signal && signal.estimation_id && (
        <Link icon={<TrendingUp size={14} />} label="Estimation liée" />
      )}
      {'alerte_id' in signal && signal.alerte_id && (
        <Link icon={<Bell size={14} />} label="Alerte liée" sub="Voir dans Veille > Alertes" />
      )}
      <Link
        icon={<Eye size={14} />}
        label="Suivre ce bien"
        sub="Ajouter à Veille > Biens suivis"
        onClick={() => console.warn('[demo] suivre bien')}
      />
      <Link
        icon={<Map size={14} />}
        label="Voir le contexte local"
        sub="Observatoire du secteur"
        onClick={() => console.warn('[demo] observatoire')}
      />
    </div>
  );
};

export default OngletLiens;
