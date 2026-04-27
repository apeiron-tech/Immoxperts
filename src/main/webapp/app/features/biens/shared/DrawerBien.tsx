import React, { useEffect, useState } from 'react';
import {
  X,
  Heart,
  Calculator,
  Target,
  Layers,
  Plus,
  Link2,
  MoreHorizontal,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Bien } from '../types';
import { formatEuros, formatEurosM2, formatDate, typeBienLabel, relativeTime } from '../utils/format';
import StatutBadge from './StatutBadge';
import SourceBadge from './SourceBadge';
import BienLinksBlock from './BienLinksBlock';
import FavoriteButton from './FavoriteButton';

interface Props {
  bien: Bien | null;
  sourceContext?: 'portefeuille' | 'annonces' | 'dvf';
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenFicheComplete: (id: string) => void;
}

const DrawerBien: React.FC<Props> = ({ bien, sourceContext = 'portefeuille', onClose, onToggleFavorite, onOpenFicheComplete }) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'contexte' | 'liens' | 'activite'>('resume');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!bien) return null;

  const primaryAnnonce = bien.annonces[0];
  const prix = primaryAnnonce?.prix_affiche || bien.avm?.prix_estime || 0;
  const prixM2 = bien.surface_m2 > 0 ? prix / bien.surface_m2 : 0;

  return (
    <div className="flex flex-col h-full bg-white w-full max-w-[420px] border-l border-slate-200 shadow-[-8px_0_32px_rgba(0,0,0,0.08)]">
      {/* Header photo */}
      <div className="relative flex-shrink-0">
        <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
          <img src={bien.photo_principale} alt={bien.adresse} className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <FavoriteButton active={bien.suivi} onToggle={() => onToggleFavorite(bien.id)} size="sm" />
            <button className="w-7 h-7 rounded-md bg-white/95 border border-slate-200 hover:bg-white flex items-center justify-center">
              <MoreHorizontal size={13} className="text-slate-600" />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md bg-white/95 border border-slate-200 hover:bg-white flex items-center justify-center"
            >
              <X size={13} className="text-slate-600" />
            </button>
          </div>
          {bien.photos.length > 1 && (
            <div className="absolute bottom-2 right-3 px-2 h-5 bg-black/60 text-white text-[10px] rounded flex items-center gap-1">
              {bien.photos.length} photos
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-[15px] font-semibold text-slate-900 leading-tight">
          {typeBienLabel(bien.type)}{bien.pieces ? ` T${bien.pieces}` : ''}
        </h2>
        <p className="text-[12px] text-slate-500 mt-0.5">{bien.adresse}, {bien.code_postal} {bien.ville}</p>

        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          {bien.statut_commercial && <StatutBadge statut={bien.statut_commercial} />}
          {bien.source_principale === 'annonce' && primaryAnnonce && (
            <span className="inline-flex items-center gap-1 px-2 h-5 rounded bg-green-50 text-green-700 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Annonce active
            </span>
          )}
          {primaryAnnonce && <SourceBadge source={primaryAnnonce.source} />}
          {bien.source_principale === 'dvf' && (
            <span className="px-2 h-5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">Vendu (DVF)</span>
          )}
        </div>

        {/* Key info grid */}
        <div className="grid grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Prix</div>
            <div className="text-[14px] font-bold text-slate-900 tabular-nums">{formatEuros(prix, true)}</div>
            {prixM2 > 0 && <div className="text-[10px] text-slate-500 tabular-nums">{formatEurosM2(Math.round(prixM2))}</div>}
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Surface</div>
            <div className="text-[14px] font-bold text-slate-900 tabular-nums">{bien.surface_m2} m²</div>
          </div>
          {bien.pieces != null && (
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Pièces</div>
              <div className="text-[14px] font-bold text-slate-900 tabular-nums">{bien.pieces}</div>
            </div>
          )}
          {bien.etage != null && (
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Étage</div>
              <div className="text-[14px] font-bold text-slate-900 tabular-nums">
                {bien.etage === 0 ? 'RDC' : `${bien.etage}${bien.nb_etages ? `/${bien.nb_etages}` : 'e'}`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 px-4 flex-shrink-0">
        {(['resume', 'contexte', 'liens', 'activite'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2.5 mr-5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-propsight-700 border-propsight-500'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            {tab === 'resume' ? 'Résumé' : tab === 'contexte' ? 'Contexte' : tab === 'liens' ? 'Liens' : 'Activité'}
          </button>
        ))}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'resume' && (
          <div className="p-4 space-y-4">
            {/* Actions rapides */}
            <section>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Actions rapides</div>
              <div className="grid grid-cols-3 gap-1.5">
                <QuickAction icon={<Calculator size={12} />} label="Estimer" />
                <QuickAction icon={<Target size={12} />} label="Analyser invest." />
                <QuickAction icon={<Layers size={12} />} label="Comparer" />
                <QuickAction icon={<Plus size={12} />} label="Créer action" />
                <QuickAction icon={<Link2 size={12} />} label="Rattacher lead" />
                <QuickAction icon={<MoreHorizontal size={12} />} label="Plus" />
              </div>
            </section>

            {/* Liens inter-modules */}
            <section>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Liens inter-modules</div>
              <BienLinksBlock bien={bien} compact />
            </section>

            {/* Recommandation IA */}
            <section className="border border-propsight-100 bg-gradient-to-br from-propsight-50/80 to-white rounded-md p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={12} className="text-propsight-600" />
                <span className="text-[12px] font-semibold text-propsight-900">Recommandation IA</span>
                <span className="text-[9px] px-1 h-4 rounded bg-propsight-200/60 text-propsight-800 font-semibold flex items-center">BÊTA</span>
              </div>
              <div className="space-y-1.5">
                {bien.avm && bien.avm.score_confiance >= 75 && (
                  <div className="flex items-start gap-1.5 text-[11px] text-slate-700">
                    <Heart size={10} className="text-propsight-500 mt-0.5 flex-shrink-0" />
                    <span>Fort potentiel locatif : demande élevée pour ce secteur.</span>
                  </div>
                )}
                {primaryAnnonce && bien.avm && primaryAnnonce.prix_affiche < bien.avm.prix_estime && (
                  <div className="flex items-start gap-1.5 text-[11px] text-slate-700">
                    <TrendingUp size={10} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Estimation optimiste : +{Math.round((bien.avm.prix_estime / primaryAnnonce.prix_affiche - 1) * 100)}% vs médiane du quartier.</span>
                  </div>
                )}
                {bien.signaux.includes('baisse_prix') && (
                  <div className="flex items-start gap-1.5 text-[11px] text-slate-700">
                    <TrendingUp size={10} className="text-amber-500 mt-0.5 flex-shrink-0 rotate-180" />
                    <span>Baisse détectée cette semaine — fenêtre d'opportunité.</span>
                  </div>
                )}
              </div>
            </section>

            {/* Timeline */}
            {bien.evenements.length > 0 && (
              <section>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Activité récente</div>
                <div className="space-y-2">
                  {bien.evenements.slice(0, 3).map(e => (
                    <div key={e.id} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-propsight-400 mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] text-slate-900">{e.titre}</div>
                        <div className="text-[10px] text-slate-400">{relativeTime(e.date)}{e.user ? ` · ${e.user}` : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'contexte' && (
          <div className="p-4 space-y-3 text-[13px] text-slate-600">
            <SectionTitle>Contexte marché</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <StatRow label="Niveau marché" value="Tendu" accent="text-amber-600" />
              <StatRow label="Prix/m² médian zone" value="12 847 €/m²" />
              <StatRow label="Évolution 12m" value="+3,2 %" accent="text-green-600" />
              <StatRow label="Délai médian" value="18 j" />
            </div>
            <SectionTitle>Caractéristiques</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <StatRow label="Année construction" value={bien.annee_construction?.toString() || '—'} />
              <StatRow label="DPE" value={bien.dpe || '—'} />
              <StatRow label="Type acquéreur" value="Particulier" />
              <StatRow label="Géocodage" value={bien.geocoding_confidence} />
            </div>
          </div>
        )}

        {activeTab === 'liens' && (
          <div className="p-4 space-y-3">
            <BienLinksBlock bien={bien} compact={false} />
          </div>
        )}

        {activeTab === 'activite' && (
          <div className="p-4 space-y-3">
            {bien.evenements.length === 0 ? (
              <p className="text-[12px] text-slate-400 text-center py-6">Aucune activité enregistrée.</p>
            ) : (
              <div className="space-y-3">
                {bien.evenements.map(e => (
                  <div key={e.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-propsight-500" />
                      <div className="w-px flex-1 bg-slate-200" />
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="text-[12px] text-slate-900 font-medium">{e.titre}</div>
                      <div className="text-[11px] text-slate-500">{formatDate(e.date)}{e.user ? ` · ${e.user}` : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 bg-white flex-shrink-0">
        <button
          onClick={() => onOpenFicheComplete(bien.id)}
          className="w-full h-9 bg-propsight-600 hover:bg-propsight-700 text-white text-[13px] font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors"
        >
          Voir la fiche complète <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};

const QuickAction: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="flex items-center justify-center gap-1.5 h-8 px-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-medium text-slate-700 transition-colors">
    <span className="text-slate-500">{icon}</span>
    <span className="truncate">{label}</span>
  </button>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{children}</div>
);

const StatRow: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent }) => (
  <div className="flex flex-col p-2 rounded-md bg-slate-50 border border-slate-100">
    <span className="text-[10px] uppercase tracking-wide text-slate-500">{label}</span>
    <span className={`text-[13px] font-semibold tabular-nums ${accent || 'text-slate-900'}`}>{value}</span>
  </div>
);

export default DrawerBien;
