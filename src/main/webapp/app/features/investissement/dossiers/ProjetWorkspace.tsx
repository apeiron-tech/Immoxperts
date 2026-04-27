import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, FolderPlus, Share2, Edit3, CheckCircle2, Circle, GitCompare, MapPin, Clock, FileText, FileSearch, Layers, X, ExternalLink, Copy, Star } from 'lucide-react';
import { MOCK_PROJETS } from '../_mocks/projets';
import { MOCK_OPPORTUNITES } from '../_mocks/opportunites';
import { MOCK_DOSSIERS } from '../_mocks/dossiers';
import { MOCK_COMPARATIFS } from '../_mocks/comparatifs';
import { MOCK_VILLES } from '../_mocks/villes';
import { MOCK_SCENARIOS } from '../_mocks/scenarios';
import { ScenarioInvest } from '../types';
import { formatPrice, formatSigned, formatPct } from '../utils/finances';
import { labelStrategy, labelTension, labelLocataire, labelProfondeur, labelRegime } from '../utils/persona';
import ProfilLocatairePill from '../shared/ProfilLocatairePill';
import { StatutOppBadge, StatutDossierBadge } from '../shared/StatutBadge';

const ProjetWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projet = MOCK_PROJETS.find(p => p.project_id === id);
  const [scenarioDetail, setScenarioDetail] = useState<ScenarioInvest | null>(null);

  if (!projet) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Projet introuvable. <Link to="/app/investissement/dossiers" className="text-propsight-700">Retour</Link>
      </div>
    );
  }

  const opportunitesProjet = MOCK_OPPORTUNITES.filter(o => o.project_id === projet.project_id).slice(0, 4);
  const dossiersProjet = MOCK_DOSSIERS.filter(d => d.project_id === projet.project_id);
  const comparatifsProjet = MOCK_COMPARATIFS.filter(c => c.project_id === projet.project_id);

  // Récupérer quelques scénarios liés au projet
  const scenariosProjet = MOCK_SCENARIOS.filter(s => {
    const opp = MOCK_OPPORTUNITES.find(o => o.opportunity_id === s.opportunity_id);
    return opp?.project_id === projet.project_id;
  }).slice(0, 6);

  const checklist = [
    { label: 'Définir la ville principale', done: true, detail: `${projet.target_zones.length} zone(s) ciblée(s) : ${projet.target_zones.join(', ')}`, action: null },
    { label: 'Comparer 2 villes ou plus', done: true, detail: `${comparatifsProjet.filter(c => c.type === 'villes').length} comparatif(s) villes sauvegardé(s)`, action: 'Voir comparatifs' },
    { label: 'Sauvegarder une recherche', done: true, detail: '2 recherches sauvegardées', action: null },
    { label: 'Suivre au moins 3 biens', done: true, detail: `${opportunitesProjet.length} biens dans le projet · 4 favoris`, action: 'Voir favoris' },
    { label: 'Analyser 1 bien', done: true, detail: '5 analyses détaillées lancées · 3 scénarios comparés', action: null },
    { label: 'Comparer 2 scénarios', done: false, detail: `${scenariosProjet.length} scénarios disponibles · aucun comparatif scénarios`, action: 'Créer un comparatif' },
    { label: 'Créer le dossier', done: dossiersProjet.length > 0, detail: `${dossiersProjet.length} dossier(s) dérivé(s)`, action: 'Créer dossier' },
  ];

  const doneCount = checklist.filter(c => c.done).length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-4">
        <button type="button" onClick={() => navigate('/app/investissement/dossiers')} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 mb-2">
          <ArrowLeft size={12} />
          Retour aux projets
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{projet.name}</h1>
            <div className="text-xs text-slate-600 mt-1">
              {projet.target_zones.join(', ')} · {formatPrice(projet.budget_max)} · {labelStrategy(projet.strategy_type)} · Progression {projet.progression_pct}%
            </div>
            <div className="mt-2">
              {projet.profil_locataire_cible && <ProfilLocatairePill profil={projet.profil_locataire_cible} />}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 px-2.5 py-1.5 hover:bg-slate-50">
              <Edit3 size={13} />
              Modifier
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 px-2.5 py-1.5 hover:bg-slate-50">
              <Share2 size={13} />
              Partager
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-md bg-propsight-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-propsight-700">
              <FolderPlus size={13} />
              Créer dossier
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* LEFT COLUMN */}
        <div className="col-span-2 space-y-4">
          {/* Bloc 1 — Résumé */}
          <Section title="Résumé du projet">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <KvBlock label="Ville(s) cible" value={projet.target_zones.join(', ')} />
              <KvBlock label="Budget" value={`${formatPrice(projet.budget_min)} – ${formatPrice(projet.budget_max)}`} />
              <KvBlock label="Apport disponible" value={formatPrice(projet.down_payment_target)} />
              <KvBlock label="Stratégie" value={labelStrategy(projet.strategy_type)} />
              <KvBlock label="Mode d'exploitation" value={projet.occupancy_mode_target} />
              <KvBlock label="Horizon" value={`${projet.holding_period} ans`} />
              <KvBlock label="Rendement cible" value={`${projet.yield_target}% net-net`} />
              <KvBlock label="Cash-flow cible" value={`${projet.cashflow_target} €/mois`} />
              <KvBlock label="TMI" value={`${projet.tmi}%`} />
            </div>
          </Section>

          {/* Bloc 2 — Étapes */}
          <Section
            title="Étapes de la simulation"
            action={<span className="text-[10px] text-slate-500">{doneCount} / {checklist.length} étapes · {Math.round((doneCount / checklist.length) * 100)}% progression</span>}
          >
            <div className="mb-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-propsight-500 rounded-full transition-all" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
            </div>
            <ol className="space-y-0">
              {checklist.map((c, i) => (
                <li key={i} className={`flex items-start gap-3 py-2 border-b border-slate-50 last:border-0 ${!c.done ? 'bg-amber-50/30 -mx-2 px-2 rounded' : ''}`}>
                  <div className="shrink-0 mt-0.5">
                    {c.done ? <CheckCircle2 size={15} className="text-emerald-500" /> : <Circle size={15} className="text-amber-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${c.done ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                        Étape {i + 1} — {c.label}
                      </span>
                      {!c.done && <span className="text-[9px] font-semibold uppercase text-amber-600 bg-amber-100 px-1 py-0.5 rounded">À faire</span>}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{c.detail}</div>
                  </div>
                  {c.action && (
                    <button type="button" className="shrink-0 text-[11px] font-medium text-propsight-700 hover:text-propsight-800 whitespace-nowrap">
                      {c.action} →
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </Section>

          {/* Bloc 3 — Opportunités */}
          <Section title="Opportunités suggérées" action={<Link to="/app/investissement/opportunites" className="text-xs text-propsight-700 hover:text-propsight-800">Voir toutes →</Link>}>
            <div className="grid grid-cols-2 gap-2">
              {opportunitesProjet.slice(0, 4).map(opp => (
                <div key={opp.opportunity_id} className="rounded border border-slate-200 p-2 flex items-center gap-2 hover:border-propsight-300">
                  <img src={opp.bien.photo_url} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-slate-900 truncate">{opp.bien.adresse}</div>
                    <div className="text-[10px] text-slate-500">
                      {formatPrice(opp.prix_affiche)} · {opp.bien.surface}m² · Score {opp.score_overall}/100
                    </div>
                  </div>
                  <StatutOppBadge status={opp.status} />
                </div>
              ))}
            </div>
          </Section>

          {/* Bloc 4 — Recherches sauvegardées */}
          <Section title="Recherches sauvegardées">
            <div className="space-y-1.5">
              {['T2 Paris 15 — budget 500k', 'Studios Paris 15 — rendement > 4,5%'].map((name, i) => (
                <div key={i} className="flex items-center justify-between rounded border border-slate-100 p-2 hover:border-propsight-200">
                  <div>
                    <div className="text-xs font-medium text-slate-900">{name}</div>
                    <div className="text-[10px] text-slate-500">Dernière exécution : il y a 2j · 14 résultats</div>
                  </div>
                  <button type="button" className="text-xs text-propsight-700 hover:text-propsight-800 font-medium">Rouvrir →</button>
                </div>
              ))}
            </div>
          </Section>

          {/* Bloc 5 — Villes suivies */}
          <Section
            title="Villes suivies / proches"
            action={
              <button type="button" className="inline-flex items-center gap-1 text-xs text-propsight-700 hover:text-propsight-800 font-medium">
                <GitCompare size={11} />
                Comparer ces zones
              </button>
            }
          >
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] uppercase text-slate-500 border-b border-slate-100">
                  <th className="text-left py-1.5">Ville</th>
                  <th className="text-right">Prix m²</th>
                  <th className="text-right">Loyer m²</th>
                  <th className="text-right">Rdt</th>
                  <th className="text-center">Tension</th>
                  <th className="text-center">Profondeur</th>
                  <th>Profil</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_VILLES.slice(0, 5).map(v => (
                  <tr key={v.id} className="border-b border-slate-50">
                    <td className="py-1.5 font-medium text-slate-900 flex items-center gap-1"><MapPin size={10} className="text-slate-400" />{v.nom}</td>
                    <td className="text-right tabular-nums">{v.prix_m2_median.toLocaleString('fr-FR')} €</td>
                    <td className="text-right tabular-nums">{v.loyer_m2_median.toFixed(1)} €</td>
                    <td className="text-right tabular-nums">{v.rendement_median}%</td>
                    <td className="text-center text-[10px]">{labelTension(v.tension)}</td>
                    <td className="text-center text-[10px]">{labelProfondeur(v.profondeur)}</td>
                    <td className="text-[10px]">{labelLocataire(v.profil_dominant)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* Bloc 6 — Comparatifs */}
          <Section title="Comparatifs sauvegardés">
            <div className="space-y-1.5">
              {comparatifsProjet.map(c => (
                <div key={c.comparison_id} className="flex items-center justify-between rounded border border-slate-100 p-2 hover:border-propsight-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <GitCompare size={13} className="text-propsight-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-900 truncate">{c.name}</div>
                      <div className="text-[10px] text-slate-500">{c.type} · {c.items.length} items · {new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                  <button type="button" className="text-xs text-propsight-700 hover:text-propsight-800 font-medium">Rouvrir →</button>
                </div>
              ))}
              {comparatifsProjet.length === 0 && <div className="text-xs text-slate-500 text-center py-2">Aucun comparatif.</div>}
            </div>
          </Section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Bloc 7 — Scénarios */}
          <Section
            title="Scénarios sauvegardés"
            action={<span className="text-[10px] text-slate-500">{scenariosProjet.length} scénarios</span>}
          >
            {scenariosProjet.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4">Aucun scénario enregistré.</div>
            ) : (
              <div className="space-y-1.5">
                {scenariosProjet.map(s => {
                  const opp = MOCK_OPPORTUNITES.find(o => o.opportunity_id === s.opportunity_id);
                  return (
                    <button
                      key={s.scenario_id}
                      type="button"
                      onClick={() => setScenarioDetail(s)}
                      className="w-full text-left rounded-md border border-slate-100 p-2.5 hover:border-propsight-200 hover:bg-propsight-50/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Layers size={12} className="text-propsight-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-slate-900 truncate flex items-center gap-1.5">
                            {s.is_default && <Star size={10} className="text-amber-500 fill-amber-500" />}
                            {s.label}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {opp?.bien.adresse ?? 'Bien'} · {labelRegime(s.fiscal_regime)}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-xs font-semibold tabular-nums ${s.results.cashflow_apres_impot_mensuel >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {formatSigned(s.results.cashflow_apres_impot_mensuel, '€')}
                          </div>
                          <div className="text-[10px] text-slate-500">Rdt {formatPct(s.results.rendement_net_net)}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-1 mt-2 pt-2 border-t border-slate-100 text-[10px]">
                        <MiniKpi label="Apport" value={formatPrice(s.financing.apport)} />
                        <MiniKpi label="Mensu." value={`${s.results.mensualite} €`} />
                        <MiniKpi label="DSCR" value={s.results.dscr.toFixed(2)} />
                        <MiniKpi label="TRI" value={formatPct(s.results.tri_10_ans)} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            <button type="button" className="mt-3 w-full text-xs text-propsight-700 hover:text-propsight-800 font-medium py-1.5 border border-dashed border-propsight-300 rounded-md">
              + Nouveau scénario
            </button>
          </Section>

          {/* Bloc 8 — Dossiers dérivés */}
          <Section title="Dossiers dérivés">
            <div className="space-y-1.5">
              {dossiersProjet.map(d => (
                <Link key={d.dossier_id} to={`/app/investissement/dossiers/${d.dossier_id}`} className="block rounded border border-slate-100 p-2 hover:border-propsight-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={12} className="text-propsight-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-900 truncate">{d.title}</div>
                        <div className="text-[10px] text-slate-500">v{d.version} · Score {d.kpis.score}/100</div>
                      </div>
                    </div>
                    <StatutDossierBadge status={d.status} />
                  </div>
                </Link>
              ))}
              {dossiersProjet.length === 0 && <div className="text-xs text-slate-500 text-center py-2">Aucun dossier dérivé.</div>}
            </div>
          </Section>

          {/* Bloc 9 — Timeline */}
          <Section title="Timeline">
            <ul className="space-y-2 text-xs">
              <TimelineItem icon={<FileText size={11} />} label="Dossier créé" detail="Paris 15 — Lecourbe" time="il y a 2h" />
              <TimelineItem icon={<GitCompare size={11} />} label="Comparatif sauvegardé" detail="3 biens Paris 15" time="il y a 5h" />
              <TimelineItem icon={<Share2 size={11} />} label="Lien partagé" detail="Banquier · Rue Lecourbe" time="hier" />
              <TimelineItem icon={<FileSearch size={11} />} label="Projet ouvert" detail="Consulté 15 minutes" time="hier" />
              <TimelineItem icon={<MapPin size={11} />} label="Zone ajoutée" detail="Paris 14e" time="il y a 2j" />
            </ul>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <textarea
                rows={3}
                placeholder="Note interne…"
                className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-propsight-500"
              />
            </div>
          </Section>
        </div>
      </div>

      {scenarioDetail && <ScenarioDetailDrawer scenario={scenarioDetail} onClose={() => setScenarioDetail(null)} />}
    </div>
  );
};

// ============ Scenario detail drawer ============

const ScenarioDetailDrawer: React.FC<{ scenario: ScenarioInvest; onClose: () => void }> = ({ scenario, onClose }) => {
  const opp = MOCK_OPPORTUNITES.find(o => o.opportunity_id === scenario.opportunity_id);
  const r = scenario.results;
  const a = scenario.assumptions;
  const f = scenario.financing;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-[520px] bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4 flex items-start justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Layers size={14} className="text-propsight-600" />
              <h3 className="text-sm font-semibold text-slate-900 truncate">{scenario.label}</h3>
              {scenario.is_default && <Star size={11} className="text-amber-500 fill-amber-500" />}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {opp?.bien.adresse} · {labelRegime(scenario.fiscal_regime)} · {scenario.occupancy_mode}
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-slate-100 shrink-0">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* KPIs principaux */}
          <div className="grid grid-cols-2 gap-2">
            <KpiBox label="Prix total projet" value={formatPrice(r.prix_total_projet)} />
            <KpiBox label="Cash-flow ATF" value={formatSigned(r.cashflow_apres_impot_mensuel, '€/mois')} tone={r.cashflow_apres_impot_mensuel >= 0 ? 'emerald' : 'rose'} />
            <KpiBox label="Rendement net-net" value={formatPct(r.rendement_net_net)} />
            <KpiBox label="TRI 10 ans" value={formatPct(r.tri_10_ans)} />
            <KpiBox label="Cash-on-cash" value={formatPct(r.cash_on_cash)} />
            <KpiBox label="DSCR" value={r.dscr.toFixed(2)} />
          </div>

          {/* Financement */}
          <section>
            <h4 className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">Financement</h4>
            <div className="rounded-md border border-slate-200 p-3 space-y-1.5 text-xs">
              <Kv label="Apport" value={formatPrice(f.apport)} />
              <Kv label="Montant emprunté" value={formatPrice(f.montant_emprunte)} />
              <Kv label="Taux" value={`${f.taux}%`} />
              <Kv label="Durée" value={`${f.duree_annees} ans`} />
              <Kv label="Mensualité" value={`${r.mensualite.toLocaleString('fr-FR')} €/mois`} strong />
              <Kv label="Coût total crédit" value={formatPrice(r.mensualite * f.duree_annees * 12 - f.montant_emprunte)} />
            </div>
          </section>

          {/* Exploitation */}
          <section>
            <h4 className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">Exploitation</h4>
            <div className="rounded-md border border-slate-200 p-3 space-y-1.5 text-xs">
              <Kv label="Loyer mensuel HC" value={`${a.loyer_mensuel_hc} €`} />
              <Kv label="Charges non récup." value={`${a.charges_non_recup} €/mois`} />
              <Kv label="Taxe foncière" value={`${a.taxe_fonciere} €/an`} />
              <Kv label="Vacance" value={`${a.vacance_mois_par_an} mois/an`} />
              <Kv label="Gestion" value={`${a.gestion_locative_pct}%`} />
              <Kv label="GLI" value={`${a.gli_pct}%`} />
              <Kv label="Revalo. loyer" value={`${a.revalorisation_loyer_annuelle}%/an`} />
              <Kv label="Horizon" value={`${a.horizon_annees} ans`} />
            </div>
          </section>

          {/* Fiscalité */}
          <section>
            <h4 className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">Fiscalité</h4>
            <div className="rounded-md border border-slate-200 p-3 space-y-1.5 text-xs">
              <Kv label="Régime" value={labelRegime(scenario.fiscal_regime)} />
              <Kv label="Structure" value={scenario.holding_structure === 'nom_propre' ? 'Nom propre' : scenario.holding_structure.toUpperCase()} />
              <Kv label="TMI" value={`${scenario.tmi}%`} />
              <Kv label="Parts" value={String(scenario.nombre_parts)} />
              <Kv label="Impôt annuel" value={formatPrice(r.impot_annuel)} strong />
              <Kv label="Millésime" value={String(scenario.millesime_fiscal)} />
            </div>
          </section>

          {/* Projection 10 ans */}
          <section>
            <h4 className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">Projection 10 ans</h4>
            <div className="rounded-md border border-slate-200 p-3 space-y-1.5 text-xs">
              <Kv label="Cash-flow cumulé" value={formatPrice(r.cashflow_apres_impot_mensuel * 12 * 10)} />
              <Kv label="Patrimoine net" value={formatPrice(r.patrimoine_net_10ans)} strong />
              <Kv label="Revalo. prix cumul." value={`+${((Math.pow(1 + a.revalorisation_prix_annuelle / 100, 10) - 1) * 100).toFixed(1)}%`} />
            </div>
          </section>

          <div className="flex items-center gap-2 pt-2">
            {opp && (
              <Link
                to={`/app/investissement/opportunites?analyse=${opp.opportunity_id}`}
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-propsight-600 text-white text-xs font-medium py-2 hover:bg-propsight-700"
              >
                <ExternalLink size={12} />
                Ouvrir l'analyse
              </Link>
            )}
            <button type="button" className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 px-3 py-2 hover:bg-slate-50">
              <Copy size={12} />
              Dupliquer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const KpiBox: React.FC<{ label: string; value: string; tone?: 'emerald' | 'rose' }> = ({ label, value, tone }) => (
  <div className="rounded-md border border-slate-200 p-2.5">
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className={`text-sm font-semibold tabular-nums ${tone === 'emerald' ? 'text-emerald-600' : tone === 'rose' ? 'text-rose-600' : 'text-slate-900'}`}>
      {value}
    </div>
  </div>
);

const MiniKpi: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-slate-500 uppercase tracking-wide text-[9px]">{label}</div>
    <div className="font-medium text-slate-900 tabular-nums truncate">{value}</div>
  </div>
);

const Kv: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-600">{label}</span>
    <span className={`tabular-nums ${strong ? 'text-sm font-semibold text-propsight-700' : 'font-medium text-slate-900'}`}>{value}</span>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <section className="rounded-md border border-slate-200 bg-white p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xs font-semibold text-slate-900">{title}</h3>
      {action}
    </div>
    {children}
  </section>
);

const KvBlock: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="font-medium text-slate-900">{value}</div>
  </div>
);

const TimelineItem: React.FC<{ icon: React.ReactNode; label: string; detail: string; time: string }> = ({ icon, label, detail, time }) => (
  <li className="flex items-start gap-2">
    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="font-medium text-slate-900">{label}</div>
      <div className="text-[10px] text-slate-500">{detail}</div>
    </div>
    <span className="text-[10px] text-slate-400 shrink-0 inline-flex items-center gap-0.5">
      <Clock size={9} />
      {time}
    </span>
  </li>
);

export default ProjetWorkspace;
