import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Menu, X, Eye, Share2, Download, FileText, MoreHorizontal, RefreshCw, GripVertical, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { MOCK_DOSSIERS } from '../_mocks/dossiers';
import { DossierInvestissement } from '../types';
import { formatPrice, formatSigned, formatPct } from '../utils/finances';
import { labelRegime, labelLocataire, labelProfondeur, labelStrategy } from '../utils/persona';
import { StatutDossierBadge, DPEBadge } from '../shared/StatutBadge';
import ScoreCircle from '../shared/ScoreCircle';
import ProfilLocataireCard from '../shared/ProfilLocataireCard';

interface BlocDef {
  id: string;
  label: string;
  subtitle: string;
  required?: boolean;
  visible: boolean;
}

const INITIAL_BLOCS: BlocDef[] = [
  { id: 'couverture', label: 'Couverture', subtitle: 'Page titre', required: true, visible: true },
  { id: 'sommaire', label: 'Sommaire', subtitle: 'Table des matières', visible: true },
  { id: 'bien', label: 'Présentation du bien', subtitle: 'Identité & photos', required: true, visible: true },
  { id: 'profil_cible', label: 'Profil cible', subtitle: 'Profondeur de marché', required: true, visible: true },
  { id: 'marche', label: 'Marché local', subtitle: 'Prix & loyers', visible: true },
  { id: 'rendement', label: 'Rendement', subtitle: 'Cash-flow & rendements', visible: true },
  { id: 'finance', label: 'Analyse financière', subtitle: 'Plan de financement', required: true, visible: true },
  { id: 'fiscalite', label: 'Fiscalité', subtitle: 'Régime retenu', required: true, visible: true },
  { id: 'urbanisme', label: 'Urbanisme / PLU', subtitle: 'Potentiel long terme', visible: true },
  { id: 'conclusion', label: 'Conclusion', subtitle: 'Verdict & recommandation', required: true, visible: true },
];

const DossierEditeur: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dossier = MOCK_DOSSIERS.find(d => d.dossier_id === id);
  const [structureOpen, setStructureOpen] = useState(true);
  const [selectedBloc, setSelectedBloc] = useState<string>('conclusion');
  const [blocs, setBlocs] = useState<BlocDef[]>(INITIAL_BLOCS);
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  if (!dossier) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Dossier introuvable. <Link to="/app/investissement/dossiers" className="text-propsight-700">Retour</Link>
      </div>
    );
  }

  const selected = blocs.find(b => b.id === selectedBloc);

  const toggleBlocVisible = (bId: string) => {
    setBlocs(prev => prev.map(b => (b.id === bId ? { ...b, visible: !b.visible } : b)));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/app/investissement/dossiers')} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900">
            <ArrowLeft size={12} />
            Retour
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-propsight-600" />
            <div>
              <div className="text-sm font-semibold text-slate-900">{dossier.title}</div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <StatutDossierBadge status={dossier.status} />
                <span>v{dossier.version}</span>
                <span>·</span>
                <span>par {dossier.auteur_nom}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 px-2.5 py-1.5 hover:bg-slate-50">
            <Eye size={13} />
            Aperçu PDF
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShareOpen(!shareOpen)}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 px-2.5 py-1.5 hover:bg-slate-50"
            >
              <Share2 size={13} />
              Partager
            </button>
            {shareOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 rounded-md border border-slate-200 bg-white shadow-lg z-30 py-1">
                {['Banquier', 'Courtier', 'Conjoint', 'Comptable', 'Autre'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      console.warn('[DossierEditeur] Partager avec', p);
                      setShareOpen(false);
                    }}
                    className="w-full text-left text-xs px-3 py-1.5 hover:bg-slate-50"
                  >
                    Partager avec {p}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen(!exportOpen)}
              className="inline-flex items-center gap-1.5 rounded-md bg-propsight-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-propsight-700"
            >
              <Download size={13} />
              Exporter
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 rounded-md border border-slate-200 bg-white shadow-lg z-30 p-2">
                <button type="button" onClick={() => { console.warn('[Export] Complet'); setExportOpen(false); }} className="w-full text-left rounded-md px-3 py-2 hover:bg-slate-50">
                  <div className="text-xs font-semibold text-slate-900">Complet (PDF ~28 pages)</div>
                  <div className="text-[10px] text-slate-500">Version détaillée client</div>
                </button>
                <button type="button" onClick={() => { console.warn('[Export] Synthèse'); setExportOpen(false); }} className="w-full text-left rounded-md px-3 py-2 hover:bg-slate-50">
                  <div className="text-xs font-semibold text-slate-900">Synthèse (PDF ~8 pages)</div>
                  <div className="text-[10px] text-slate-500">Version courte banquier</div>
                </button>
              </div>
            )}
          </div>
          <button type="button" className="p-1.5 rounded hover:bg-slate-100">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </header>

      {/* Band info snapshot */}
      <div className="border-b border-slate-200 bg-propsight-50/40 px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="font-medium">📌 Créé depuis {dossier.created_from === 'projet_vierge' ? 'un projet vierge' : `l'opportunité "${dossier.created_from_label}"`} le {new Date(dossier.created_at).toLocaleDateString('fr-FR')}</span>
          <span className="text-slate-400">·</span>
          <span>Données marché : <strong className="text-slate-900">live</strong> (sync il y a 2j)</span>
          <span className="text-slate-400">·</span>
          <span>Hypothèses : <strong className="text-slate-900">figées</strong></span>
        </div>
        <button type="button" className="inline-flex items-center gap-1 text-xs text-propsight-700 hover:text-propsight-800 font-medium">
          <RefreshCw size={11} />
          Rafraîchir
        </button>
      </div>

      {/* Main split */}
      <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: structureOpen ? '240px 1fr 320px' : '40px 1fr 320px' }}>
        {/* STRUCTURE */}
        <aside className="border-r border-slate-200 bg-white overflow-y-auto">
          {structureOpen ? (
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Structure</span>
                <button type="button" onClick={() => setStructureOpen(false)} className="p-0.5 rounded hover:bg-slate-100">
                  <X size={12} />
                </button>
              </div>
              <div className="space-y-0.5">
                {blocs.map((b, i) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBloc(b.id)}
                    className={`w-full flex items-center gap-1.5 rounded px-2 py-1.5 text-xs text-left ${
                      selectedBloc === b.id ? 'bg-propsight-50 text-propsight-700' : 'text-slate-700 hover:bg-slate-50'
                    } ${!b.visible ? 'opacity-50' : ''}`}
                  >
                    <GripVertical size={10} className="text-slate-300" />
                    <span className="w-4 text-center text-[10px] text-slate-400">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`truncate ${b.required ? 'font-medium' : ''}`}>{b.label}</div>
                      <div className="text-[9px] text-slate-400 truncate">{b.subtitle}</div>
                    </div>
                    {b.required && <span className="text-[9px] text-propsight-500">●</span>}
                  </button>
                ))}
              </div>
              <button type="button" className="w-full mt-3 text-xs text-propsight-700 hover:text-propsight-800 font-medium py-1.5 border border-dashed border-propsight-300 rounded-md">
                + Ajouter une section
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setStructureOpen(true)} className="w-full h-10 flex items-center justify-center hover:bg-slate-50 border-b border-slate-200">
              <Menu size={14} className="text-slate-500" />
            </button>
          )}
        </aside>

        {/* PREVIEW */}
        <main className="overflow-y-auto bg-slate-200/50 p-6">
          <div className="mx-auto max-w-[780px] space-y-6">
            {blocs.filter(b => b.visible).map((b, i) => (
              <div key={b.id} id={`bloc-${b.id}`} className={`bg-white rounded-md shadow-sm overflow-hidden ${selectedBloc === b.id ? 'ring-2 ring-propsight-400' : ''}`}>
                <BlocPreview bloc={b} dossier={dossier} index={i + 1} />
              </div>
            ))}
          </div>
        </main>

        {/* CONTENT PANEL */}
        <aside className="border-l border-slate-200 bg-white overflow-y-auto p-4">
          <div className="mb-3 pb-2 border-b border-slate-100">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Contenu du bloc</span>
          </div>
          {selected ? (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Titre</label>
                <input
                  type="text"
                  defaultValue={selected.label}
                  className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-propsight-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Sous-titre</label>
                <input
                  type="text"
                  defaultValue={selected.subtitle}
                  className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-propsight-500"
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-slate-100">
                <span className="text-slate-700">Visibilité</span>
                <button
                  type="button"
                  onClick={() => toggleBlocVisible(selected.id)}
                  disabled={selected.required}
                  className={`relative w-9 h-5 rounded-full transition ${selected.visible ? 'bg-propsight-600' : 'bg-slate-300'} disabled:opacity-50`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${selected.visible ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
              {selected.required && <div className="text-[10px] text-propsight-600">Bloc obligatoire (ne peut pas être masqué)</div>}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Style</label>
                <Sel options={[{ value: 'default', label: 'Thème par défaut' }, { value: 'minimal', label: 'Minimal' }]} />
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">Sélectionnez un bloc pour voir ses options.</div>
          )}
        </aside>
      </div>
    </div>
  );
};

const Sel: React.FC<{ options: { value: string; label: string }[] }> = ({ options }) => (
  <select className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-propsight-500">
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

// ====== BLOCS PREVIEW ======

const BlocPreview: React.FC<{ bloc: BlocDef; dossier: DossierInvestissement; index: number }> = ({ bloc, dossier, index }) => {
  const header = (
    <div className="border-b border-slate-100 bg-slate-50 px-4 py-1.5 flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
      <span className="text-propsight-600">{index}</span>
      {bloc.label}
    </div>
  );

  switch (bloc.id) {
    case 'couverture':
      return (
        <>
          {header}
          <div className="p-10 text-center relative min-h-[280px] bg-gradient-to-br from-propsight-50 via-white to-emerald-50">
            <div className="inline-block px-3 py-1 bg-propsight-600 text-white text-[10px] font-semibold rounded mb-6">DOSSIER D'INVESTISSEMENT</div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{dossier.title}</h1>
            {dossier.subtitle && <p className="text-sm text-slate-600 mb-6">{dossier.subtitle}</p>}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-600 mt-10">
              <span>Par {dossier.auteur_nom}</span>
              <span>·</span>
              <span>{new Date(dossier.updated_at).toLocaleDateString('fr-FR')}</span>
              <span>·</span>
              <span>v{dossier.version}</span>
            </div>
          </div>
        </>
      );
    case 'sommaire':
      return (
        <>
          {header}
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Sommaire</h2>
            <ol className="space-y-1.5 text-sm">
              {INITIAL_BLOCS.filter(b => b.id !== 'sommaire').map((b, i) => (
                <li key={b.id} className="flex items-center gap-2 text-slate-700">
                  <span className="text-slate-400 tabular-nums w-5">{i + 1}.</span>
                  <span>{b.label}</span>
                  <span className="flex-1 border-b border-dotted border-slate-300 mx-2" />
                  <span className="text-slate-500 tabular-nums">{2 + i * 2}</span>
                </li>
              ))}
            </ol>
          </div>
        </>
      );
    case 'bien':
      return (
        <>
          {header}
          <div className="p-6 grid grid-cols-2 gap-4">
            <img src={dossier.photo_url} alt="" className="w-full aspect-[4/3] rounded object-cover" />
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{dossier.bien_label}</h3>
              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex justify-between"><span>Ville</span><span className="font-medium">{dossier.ville}</span></div>
                <div className="flex justify-between"><span>Stratégie</span><span className="font-medium">{labelStrategy(dossier.strategy)}</span></div>
                <div className="flex justify-between"><span>Régime fiscal</span><span className="font-medium">{labelRegime(dossier.regime_principal)}</span></div>
                <div className="flex justify-between"><span>DPE</span><DPEBadge value="D" /></div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <ScoreCircle score={dossier.kpis.score > 0 ? dossier.kpis.score : 75} size={40} />
                <div className="text-xs">
                  <div className="font-semibold">Score Propsight</div>
                  <div className="text-slate-500">Évaluation globale</div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    case 'profil_cible':
      return (
        <>
          {header}
          <div className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Users size={15} className="text-propsight-600" />
              Profil cible & profondeur de marché
            </h3>
            <ProfilLocataireCard profil={dossier.profil_cible} title="Le profil locataire identifié" />
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Calcul de solvabilité</div>
                <div>Loyer cible : <strong>{formatPrice(dossier.kpis.prix_total * 0.004)} /mois HC</strong></div>
                <div>Taux d'effort : <strong>33%</strong></div>
                <div>Revenu indicatif requis : <strong>{dossier.profil_cible.revenu_indicatif_requis.toLocaleString('fr-FR')} €/mois</strong></div>
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Profondeur de la demande</div>
                <div>Part population compatible : <strong>{Math.round(dossier.profil_cible.part_population_eligible * 100)}%</strong></div>
                <div>Niveau : <strong>{labelProfondeur(dossier.profil_cible.profondeur_demande)}</strong></div>
                <div>Confiance : <strong>{dossier.profil_cible.niveau_confiance}</strong></div>
              </div>
            </div>
          </div>
        </>
      );
    case 'finance':
      return (
        <>
          {header}
          <div className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">Analyse financière</h3>
            <div className="grid grid-cols-4 gap-3 text-xs">
              <KpiPDF label="Prix total projet" value={formatPrice(dossier.kpis.prix_total)} />
              <KpiPDF label="Cash-flow ATF" value={formatSigned(dossier.kpis.cashflow_atf, '€')} />
              <KpiPDF label="Rendement net-net" value={formatPct(dossier.kpis.rendement_net_net)} />
              <KpiPDF label="TRI 10 ans" value={formatPct(dossier.kpis.tri_10_ans)} />
            </div>
            <p className="text-xs text-slate-600 mt-4 leading-relaxed">
              Le plan de financement est calibré pour optimiser le rendement net-net tout en préservant un cash-flow positif. La mensualité
              et les paramètres de prêt permettent un équilibre entre endettement raisonnable et effort d'épargne maîtrisé.
            </p>
          </div>
        </>
      );
    case 'fiscalite':
      return (
        <>
          {header}
          <div className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">Fiscalité retenue</h3>
            <div className="rounded-md border border-propsight-200 bg-propsight-50/40 p-3 mb-3">
              <div className="text-[10px] uppercase tracking-wide text-propsight-700 font-semibold">Régime recommandé</div>
              <div className="text-sm font-bold text-propsight-900">{labelRegime(dossier.regime_principal)}</div>
            </div>
            <p className="text-xs text-slate-600">
              Ce régime permet d'optimiser le rendement net-net grâce à une meilleure déductibilité fiscale et une base imposable réduite.
              Un suivi annuel via un expert-comptable est recommandé pour sécuriser les bénéfices.
            </p>
          </div>
        </>
      );
    case 'conclusion':
      return (
        <>
          {header}
          <div className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">Conclusion & recommandation</h3>
            <div className="rounded-md border border-emerald-200 bg-emerald-50/40 p-3 mb-4">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-1">
                <CheckCircle2 size={14} />
                Très bonne opportunité — Score {dossier.kpis.score}/100
              </div>
              <p className="text-xs text-slate-700">
                Le projet présente un excellent équilibre rendement/sécurité/potentiel. Rendement net-net supérieur à la moyenne de zone,
                demande locative très soutenue et signaux urbanisme favorables.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="text-xs font-semibold text-emerald-700 mb-1.5 flex items-center gap-1"><CheckCircle2 size={12} />Points forts</h4>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Emplacement recherché et bien desservi</li>
                  <li>• Rendement net-net attractif</li>
                  <li>• Demande locative très soutenue</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-amber-700 mb-1.5 flex items-center gap-1"><AlertTriangle size={12} />Vigilances</h4>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Travaux énergétiques à prévoir (DPE)</li>
                  <li>• Charges copropriété à valider</li>
                  <li>• Copropriété ancienne</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      );
    default:
      return (
        <>
          {header}
          <div className="p-6 text-xs text-slate-500 italic">Contenu du bloc "{bloc.label}" — aperçu simplifié en mode démo.</div>
        </>
      );
  }
};

const KpiPDF: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5">
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="text-sm font-bold text-slate-900 tabular-nums">{value}</div>
  </div>
);

export default DossierEditeur;
