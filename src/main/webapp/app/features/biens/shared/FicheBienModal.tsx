import React, { useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Share2,
  MoreHorizontal,
  Calculator,
  Target,
  Layers,
  Plus,
  Link2,
  Sparkles,
} from 'lucide-react';
import { Bien } from '../types';
import { formatEuros, formatEurosM2, typeBienLabel, formatDate } from '../utils/format';
import StatutBadge from './StatutBadge';
import SourceBadge from './SourceBadge';
import DPEBadge from './DPEBadge';
import BienLinksBlock from './BienLinksBlock';
import AVMBadge from './AVMBadge';
import FavoriteButton from './FavoriteButton';

interface Props {
  bien: Bien | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

const FicheBienModal: React.FC<Props> = ({ bien, onClose, onToggleFavorite }) => {
  const [tab, setTab] = React.useState<'resume' | 'contexte' | 'liens' | 'activite' | 'documents'>('resume');

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  if (!bien) return null;

  const primaryAnnonce = bien.annonces[0];
  const prix = primaryAnnonce?.prix_affiche || bien.avm?.prix_estime || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-xl w-full h-full max-w-[1400px] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-3.5 border-b border-slate-200 flex items-center gap-3">
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center">
            <ArrowLeft size={14} className="text-slate-600" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold text-slate-900 truncate">
                {typeBienLabel(bien.type)}{bien.pieces ? ` T${bien.pieces}` : ''} · {bien.adresse}, {bien.code_postal} {bien.ville}
              </h1>
            </div>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {bien.statut_commercial && <StatutBadge statut={bien.statut_commercial} size="sm" />}
              {primaryAnnonce && (
                <span className="inline-flex items-center gap-1 px-2 h-5 rounded bg-green-50 text-green-700 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Annonce active
                </span>
              )}
              {primaryAnnonce && <SourceBadge source={primaryAnnonce.source} />}
              {bien.suivi && (
                <span className="inline-flex items-center gap-1 px-2 h-5 rounded bg-propsight-50 text-propsight-700 text-[11px] font-medium">
                  Bien suivi
                </span>
              )}
              {bien.estimations_count > 0 && (
                <span className="inline-flex items-center px-2 h-5 rounded bg-blue-50 text-blue-700 text-[11px] font-medium">
                  {bien.estimations_count} estimation{bien.estimations_count > 1 ? 's' : ''}
                </span>
              )}
              {bien.opportunites_count > 0 && (
                <span className="inline-flex items-center px-2 h-5 rounded bg-amber-50 text-amber-700 text-[11px] font-medium">Opportunité</span>
              )}
              {bien.dossier_ref && (
                <span className="inline-flex items-center px-2 h-5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                  Dossier {bien.dossier_ref}
                </span>
              )}
              {bien.actions_count > 0 && (
                <span className="inline-flex items-center px-2 h-5 rounded bg-red-50 text-red-600 text-[11px] font-medium">
                  {bien.actions_count} action{bien.actions_count > 1 ? 's' : ''} ouverte{bien.actions_count > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <FavoriteButton active={bien.suivi} onToggle={() => onToggleFavorite(bien.id)} size="md" />
          <button className="w-8 h-8 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
            <MoreHorizontal size={14} className="text-slate-600" />
          </button>
          <button className="h-8 px-3 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 text-[12px] font-medium text-slate-700">
            <Share2 size={13} /> Partager
          </button>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center">
            <X size={14} className="text-slate-600" />
          </button>
        </div>

        {/* Quick actions bar */}
        <div className="flex-shrink-0 px-5 py-2.5 border-b border-slate-200 bg-slate-50/60 flex items-center gap-2">
          <QuickBtn icon={<Calculator size={12} />} label="Estimer" />
          <QuickBtn icon={<Target size={12} />} label="Analyse invest." />
          <QuickBtn icon={<Layers size={12} />} label="Comparer" />
          <QuickBtn icon={<Plus size={12} />} label="Créer action" />
          <QuickBtn icon={<Link2 size={12} />} label="Rattacher lead" />
          <QuickBtn icon={<MoreHorizontal size={12} />} label="Plus" />
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 px-5 border-b border-slate-200 flex items-center">
          {(['resume', 'contexte', 'liens', 'activite', 'documents'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 mr-6 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
                tab === t ? 'text-propsight-700 border-propsight-500' : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              {t === 'resume' ? 'Résumé' : t === 'contexte' ? 'Contexte' : t === 'liens' ? 'Liens' : t === 'activite' ? 'Activité' : 'Documents'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto bg-slate-50/40">
          {tab === 'resume' && (
            <div className="p-5 grid grid-cols-12 gap-5">
              {/* Bloc 1 — Synthèse */}
              <div className="col-span-12 bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img src={bien.photo_principale} alt={bien.adresse} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Prix affiché</div>
                      <div className="text-[28px] font-bold text-slate-900 tabular-nums">{formatEuros(prix, true)}</div>
                      {primaryAnnonce && (
                        <div className="text-[12px] text-slate-500 tabular-nums">{formatEurosM2(primaryAnnonce.prix_m2)}</div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">AVM vente</div>
                        <AVMBadge avm={bien.avm} type="prix" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">AVM loyer</div>
                        <AVMBadge avm={bien.avm} type="loyer" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                      <KV label="Surface" value={`${bien.surface_m2} m²`} />
                      <KV label="Type" value={typeBienLabel(bien.type)} />
                      <KV label="Pièces" value={bien.pieces?.toString() || '—'} />
                      <KV label="Étage" value={bien.etage == null ? '—' : bien.etage === 0 ? 'RDC' : `${bien.etage}${bien.nb_etages ? `/${bien.nb_etages}` : ''}`} />
                      <KV label="Année" value={bien.annee_construction?.toString() || '—'} />
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">DPE</div>
                        <DPEBadge value={bien.dpe} size="md" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloc 2 — Sources & statuts */}
              <div className="col-span-6 bg-white rounded-lg border border-slate-200 p-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Sources & statuts</div>
                <div className="space-y-2">
                  {bien.annonces.length > 0 ? bien.annonces.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-2.5 rounded-md border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <SourceBadge source={a.source} />
                        <span className="text-[12px] text-slate-700">{a.statut === 'active' ? 'Active' : a.statut === 'baisse_prix' ? 'Baisse prix' : 'Remise'}</span>
                      </div>
                      <span className="text-[13px] font-semibold text-slate-900 tabular-nums">{formatEuros(a.prix_affiche, true)}</span>
                    </div>
                  )) : <p className="text-[12px] text-slate-400">Aucune annonce active.</p>}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-slate-500">Comparables DVF proches</span>
                    <span className="font-semibold text-slate-900">{bien.ventes_dvf_ids.length} ventes</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] mt-1.5">
                    <span className="text-slate-500">Estimations créées</span>
                    <span className="font-semibold text-slate-900">{bien.estimations_count}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] mt-1.5">
                    <span className="text-slate-500">Veille &gt; Biens suivis</span>
                    <span className={`font-semibold ${bien.suivi ? 'text-propsight-600' : 'text-slate-400'}`}>{bien.suivi ? 'Oui' : 'Non'}</span>
                  </div>
                </div>
              </div>

              {/* Bloc 3 — Liens inter-modules */}
              <div className="col-span-6 bg-white rounded-lg border border-slate-200 p-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Liens inter-modules</div>
                <BienLinksBlock bien={bien} />
              </div>

              {/* Bloc 4 — Contexte marché */}
              <div className="col-span-6 bg-white rounded-lg border border-slate-200 p-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Contexte marché</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] text-slate-500">Niveau de marché</div>
                    <div className="text-[13px] font-semibold text-amber-600">Tendu</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Prix/m² médian zone</div>
                    <div className="text-[13px] font-semibold text-slate-900 tabular-nums">12 847 €/m²</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Évolution 12m</div>
                    <div className="text-[13px] font-semibold text-green-600">+3,2 %</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Comparables dans 500m</div>
                    <div className="text-[13px] font-semibold text-slate-900 tabular-nums">{bien.ventes_dvf_ids.length} ventes</div>
                  </div>
                </div>
              </div>

              {/* Bloc 5 — Timeline */}
              <div className="col-span-6 bg-white rounded-lg border border-slate-200 p-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Timeline</div>
                <div className="space-y-3 max-h-40 overflow-auto">
                  {bien.evenements.length === 0 && <p className="text-[12px] text-slate-400">Aucun événement.</p>}
                  {bien.evenements.map(e => (
                    <div key={e.id} className="flex gap-2.5">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-propsight-500 mt-1" />
                        <div className="w-px flex-1 bg-slate-200 mt-1" />
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="text-[12px] text-slate-900">{e.titre}</div>
                        <div className="text-[11px] text-slate-500">{formatDate(e.date)}{e.user ? ` · ${e.user}` : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloc 6 — IA */}
              <div className="col-span-12 bg-gradient-to-br from-propsight-50 to-white border border-propsight-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={13} className="text-propsight-600" />
                  <span className="text-[13px] font-semibold text-propsight-900">Recommandation IA</span>
                  <span className="text-[9px] px-1.5 h-4 rounded bg-propsight-200/60 text-propsight-800 font-semibold flex items-center">BÊTA</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="text-[12px] text-slate-700">
                    <div className="font-medium mb-1">Positionnement</div>
                    <p className="text-slate-600">{bien.avm ? `Estimation optimiste : +${Math.round((bien.avm.prix_estime / (primaryAnnonce?.prix_affiche || bien.avm.prix_estime) - 1) * 100)}% vs médiane` : 'Estimation indisponible'}</p>
                  </div>
                  <div className="text-[12px] text-slate-700">
                    <div className="font-medium mb-1">Demande</div>
                    <p className="text-slate-600">Fort potentiel locatif : demande élevée pour ce secteur.</p>
                  </div>
                  <div className="text-[12px] text-slate-700">
                    <div className="font-medium mb-1">Actions conseillées</div>
                    <p className="text-slate-600">Promouvoir en avis de valeur · Créer une opportunité investisseur.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'contexte' && (
            <div className="p-5">
              <div className="bg-white border border-slate-200 rounded-lg p-6 text-[13px] text-slate-500">
                Détails contexte local : POIs, transports, écoles, PLU, démographie, tension locative.
                <p className="text-[12px] text-slate-400 mt-2">(Données mockées — branchement Observatoire à venir)</p>
              </div>
            </div>
          )}

          {tab === 'liens' && (
            <div className="p-5">
              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <BienLinksBlock bien={bien} />
              </div>
            </div>
          )}

          {tab === 'activite' && (
            <div className="p-5">
              <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
                {bien.evenements.map(e => (
                  <div key={e.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-propsight-500" />
                      <div className="w-px flex-1 bg-slate-200" />
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="text-[13px] text-slate-900 font-medium">{e.titre}</div>
                      <div className="text-[11px] text-slate-500">{formatDate(e.date)}{e.user ? ` · ${e.user}` : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'documents' && (
            <div className="p-5">
              <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-slate-400 text-sm">
                Aucun document rattaché.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickBtn: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="h-7 px-2.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[12px] text-slate-700 font-medium flex items-center gap-1.5">
    <span className="text-slate-500">{icon}</span>
    {label}
  </button>
);

const KV: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{label}</div>
    <div className="text-[13px] font-semibold text-slate-900 tabular-nums">{value}</div>
  </div>
);

export default FicheBienModal;
