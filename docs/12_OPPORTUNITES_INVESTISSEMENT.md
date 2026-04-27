# Propsight — Module Investissement — Spec détaillée `Opportunités`

**Version** : V3 (consolidée et enrichie, remplace la V2)
**Format** : source de vérité produit / design / dev
**Périmètre** : `/app/investissement/opportunites` + projet investisseur + projet vierge + vue liste/cards + drawer + analyse détaillée + comparatif contextuel + comparatif de villes + liens avec Veille / Leads / Actions / Dossiers
**Langue produit** : français
**Persona V1** : agent immobilier / chasseur / conseiller investisseur / investisseur en direct (UI persona-aware)
**Complémentaire de** : `13_DOSSIER_INVESTISSEMENT.md`, `03_TEMPLATE_RAPPORT.md`, `06_BLOC_SOLVABILITE.md`

---

# 0. Principes transverses

## 0.1 Principes structurants (non négociables)

1. **Interconnexion transverse** : tous les modules sont reliés, chaque objet affiche ses liens vers les autres modules (estimation, analyse invest, dossier, actions, alertes, contexte observatoire).
2. **Pipeline commercial unique** : le suivi commercial (statuts, relances, conversion) vit dans `Mon activité > Leads`. Aucun mini-CRM dans Opportunités. Les liens vers le Kanban filtré restent contextuels.
3. **Objet partagé** : Bien, Annonce, Lead, Action, Estimation, Opportunité, Dossier, Alerte, Bien suivi, Zone, Collaborateur — source unique.
4. **Favoris ♡** alimentent `Veille > Biens suivis` (source unique).
5. **UI dense, premium, desktop-first (1440-1600px)**, inspiration Linear/Attio, violet Propsight.
6. **Pas de gros blocs IA décoratifs** : l'IA reste contextuelle, discrète, toujours justifiée.
7. **Score toujours explicable**, jamais magique. Breakdown exposé à tout moment.

## 0.2 Règle KPI : un owner par métrique + hiérarchie progressive

**Chaque KPI appartient à un onglet unique qui en est l'owner.** Les autres onglets peuvent le référencer en inline (lien, chip), mais ne le republient pas comme KPI héro.

### Matrice d'ownership

| Onglet | KPIs owner |
|---|---|
| **Annonce** | Prix affiché · Prix/m² · Surface · DPE · Ancienneté annonce |
| **Ville / Marché** | Prix m² zone · Loyer m² zone · Tension locative · Vacance · Profondeur de demande |
| **Rendement** | Rendement brut · Rendement net · Cash-on-cash · Cash-flow avant impôt |
| **Finance** | Apport · Mensualité · DSCR · Effort mensuel · Coût du crédit |
| **Fiscalité** | Impôt annuel · Cash-flow APRÈS impôt · Rendement net-net · TRI après impôt |
| **Potentiel / PLU** | Signal urbanisme · Permis proches · Transformabilité (qualitatifs) |
| **Récap** | (aucun KPI propre — agrège les 5 KPIs sticky + synthèse décision) |

### Hiérarchie progressive (T0 / T1 / T2)

- **T0 (always visible, above the fold de l'onglet)** : **3 KPIs héros max + 1 verdict qualitatif**
- **T1 (blocs below the fold)** : décomposition, détail calcul, sensibilité
- **T2 (expand/drawer)** : données brutes, sources, overrides

Cette règle s'applique à tous les onglets du modal Analyse.

## 0.3 Profil locataire & profondeur de demande — donnée normée

C'est le **wedge différenciant** du produit. Présent à toutes les surfaces avec progressive disclosure.

### Structure canonique de l'objet `LocataireProfile`

```ts
type LocataireProfile = {
  type_dominant: 'etudiant' | 'jeune_actif' | 'couple_sans_enfant' | 'famille' | 'senior' | 'mixte'
  profondeur_demande: 'forte' | 'correcte' | 'etroite'
  revenu_indicatif_requis: number          // €/mois
  taux_effort_reference: number            // 0.33 par défaut, paramétrable 0.30-0.50
  part_population_eligible: number         // 0-1, % du bassin IRIS compatible
  niveau_confiance: 'faible' | 'moyen' | 'eleve'
  sources: string[]                        // IRIS, Filosofi, etc.
}
```

### Règles d'affichage selon surface

| Surface | Ce qu'on affiche |
|---|---|
| Card opportunité | Pill `👤 Demande : Forte · Jeunes actifs` (combine tension + profil) |
| Liste dense colonne "Profil cible" | Pill court : `Jeunes actifs` |
| Modal Analyse — ligne contextuelle sous sticky | `Cible : jeunes actifs · Profondeur forte · Revenu requis 2 790 €/mois` |
| Onglet Ville/Marché ATF | Bloc profil dédié avec type + depth + revenu requis |
| Récap — bloc obligatoire | Les 7 dimensions complètes (voir §19) |
| Dossier — page Profil cible | Bloc complet avec distribution IRIS + structure ménages |

### Règles produit

- Le **revenu requis** n'est JAMAIS présenté comme règle légale. Toujours libellé `Revenu indicatif requis` ou `Revenu minimum recommandé`.
- Le taux d'effort est paramétrable dans le projet actif (30%, 33%, 35%, 40%, 50% selon dispositif Visale / GLI).
- La granularité IRIS doit être indiquée : quartier / IRIS / ville.

## 0.4 Matrice persona agent vs investisseur

Le module Investissement est utilisé par deux personas distincts. UI persona-aware, mais **mêmes objets backbone**.

### Différences comportementales

| Aspect | Agent | Investisseur en direct |
|---|---|---|
| **Création projet** | Split button prioritaire : "Depuis annonce" > "Bien suivi" > "Projet vierge" | Split button prioritaire : "Projet vierge (wizard)" > "Bien suivi" > "Depuis annonce" |
| **Onboarding** | Import portefeuille, liste clients existants | Wizard projet vierge (budget, apport, stratégie, objectifs) |
| **Actions quick card** | Suivre · Estimer · Créer action · Créer lead · Comparer | Suivre · Analyse invest · Comparer · Créer dossier · Alerte prix |
| **Client lié** | Obligatoire ou fortement suggéré | Absent (le porteur = utilisateur) |
| **Partage dossier** | "Partager avec votre client" | "Partager cette analyse" (banquier, courtier, conjoint, comptable) |
| **Dossier ouvert** | "Dossier ouvert par le client — relance utile" | "Dossier ouvert par [nom destinataire]" |
| **KPI row tableau de bord** | Pipeline commercial, mandats signés | Cash-flow portefeuille estimé, prochaines échéances |
| **Sidebar visible** | Complète (10 sections) | Réduite : pas d'Équipe, Prospection limitée, pas d'Agences concurrentes dans Veille |

### Table de substitutions wording

| Label générique | Label agent | Label investisseur |
|---|---|---|
| Créer un dossier | Créer un dossier client | Créer mon dossier |
| Rattacher à un lead | Rattacher à un lead | *(masqué)* |
| Mandats | Mandats | *(masqué)* |
| Client / Lead | Client / Lead | Porteur (= moi) |
| Projet investisseur | Projet investisseur | Mon projet |
| Mon activité > Leads | Mon activité > Leads | Mes affaires |
| Partager | Partager avec le client | Partager cette analyse |

### Implémentation technique

```ts
// Config persona dans le profil utilisateur
type UserPersona = 'agent' | 'investor' | 'hybrid'  // hybrid = agent qui est aussi investisseur perso

// Chaque composant doit exposer sa version persona-aware
<CreateOpportunityButton persona={user.persona} />
// En interne : ordre des options, labels, CTAs filtrés
```

Le mode `hybrid` affiche un switch en haut de sidebar "Mode : Agent | Investisseur" qui bascule entre les deux UX.

## 0.5 Ce qui est figé et ne doit pas être remis en question

- Route principale : `/app/investissement/opportunites`
- Analyse détaillée : modal URL-shareable `?analyse=[bien_id|scenario_id]`
- Comparatif biens : modal URL-shareable `?comparatif=[id1,id2,id3]`
- **Comparatif villes** : modal URL-shareable `?comparatif-zones=[ville1,ville2,ville3]`
- Flux transverse : `Annonce → Favori → Bien suivi → Opportunité → Analyse → Dossier`
- La **fiche bien unifiée** (module Biens) reste le pivot transverse du produit
- Les biens sauvegardés vivent dans **Veille > Biens suivis**
- Le comparatif n'a **pas de section dédiée** dans la sidebar

---

# 1. Contexte produit & positionnement

## 1.1 Vision produit Propsight

Propsight est un SaaS immobilier data-driven à double couche : public freemium + espace Pro payant.

Le produit est pensé autour d'un backbone objet transverse. Les modules ne sont pas des silos mais des lectures différentes des mêmes objets : Bien, Annonce, Lead, Action, Estimation, Opportunité, Dossier, Alerte, Bien suivi, Zone, Collaborateur.

Le module **Investissement** est le wedge différenciant sur le persona investisseur. Il est une **couche de décision** branchée au reste du produit : Biens, Veille, Estimation, Observatoire, Leads/Actions, Dossiers.

## 1.2 Positionnement du module Opportunités

Le module Opportunités est la **file de travail investissement** de Propsight.

Il permet de :
1. détecter des biens à potentiel ;
2. les qualifier par rapport à un projet investisseur actif ;
3. les comparer (biens ou villes) ;
4. ouvrir une analyse détaillée ;
5. les faire progresser vers un dossier ou une action.

### Promesse produit

> Identifier rapidement les biens qui méritent une vraie analyse d'investissement, en croisant rendement, marché, réglementation, urbanisme, contexte local et **profondeur de demande locative solvable**.

## 1.3 Benchmark & différenciateurs

### Ce que Propsight combine

- Logique de sourcing enrichi (LyBox)
- Lisibilité financière (Rentaloca)
- Logique "projet actif" (Solho)
- Restitution dense et professionnelle (Yanport)

### Différenciateurs V1 à rendre visibles

1. **PLU / urbanisme / pipeline de permis / mutation du secteur**
2. **Contexte vécu / avis habitants / désirabilité locale**
3. **Comparatifs contextuels sauvegardables (biens + villes)**
4. **Veille > Biens suivis comme mémoire centrale**
5. **Lien natif avec Leads / Actions / Estimation / Dossiers**
6. **Capacité à partir d'un projet vierge, pas seulement d'une annonce**
7. **Profil locataire / profondeur de demande solvable** (wedge central)

---

# 2. Objets backbone du module

## 2.1 `ProjetInvestisseur`

Le projet est le contexte actif du module. Il cadre la recherche, contextualise le score, alimente les recommandations, permet le parcours projet vierge → opportunités → dossier.

### Champs

```ts
type ProjetInvestisseur = {
  project_id: string                        // UUID
  name: string
  owner_user_id: string                     // créateur
  porteur_type: 'self' | 'lead' | 'client'  // persona-aware
  porteur_id?: string                       // lead_id si agent
  target_zones: string[]                    // liste villes/quartiers
  budget_min: number
  budget_max: number
  down_payment_target: number
  strategy_type: 'patrimonial' | 'equilibree' | 'rendement' | 'cashflow' | 'travaux' | 'colocation' | 'meuble' | 'autre'
  yield_target: number                      // rendement net-net cible
  cashflow_target: number                   // €/mois cible
  holding_period: number                    // années
  preferred_property_types: ('studio'|'t1'|'t2'|'t3'|'t4_plus'|'immeuble'|'local')[]
  occupancy_mode_target: 'nu'|'meuble'|'colocation'|'courte_duree'|'mixte'
  works_tolerance: 'aucun'|'legers'|'moyens'|'lourds'
  risk_tolerance: 'prudent'|'equilibre'|'offensif'
  taux_effort_reference: number             // 0.33 par défaut
  tmi: number                               // tranche marginale imposition
  nombre_parts: number
  profil_locataire_cible?: LocataireProfile // calculé auto depuis budget + stratégie + typologie
  notes: string
  status: 'actif'|'pause'|'archive'
  created_at: string
  updated_at: string
}
```

## 2.2 `Opportunité`

Cas d'investissement centré sur un bien ou projet théorique, évalué par rapport à un projet actif.

```ts
type Opportunity = {
  opportunity_id: string
  project_id: string                        // FK projet actif au moment création
  bien_id: string | null                    // null si projet vierge
  source_type: 'annonce'|'bien_suivi'|'portefeuille'|'manuel'|'dvf_ref'|'projet_vierge'
  source_id: string
  status: 'nouveau'|'a_qualifier'|'compare'|'a_arbitrer'|'suivi'|'ecarte'
  score_overall: number                     // 0-100
  score_breakdown: {
    rendement: number                       // 0-100
    marche: number
    risque: number
    potentiel: number
    coherence_projet: number                // 0-100, match vs projet actif
  }
  current_scenario_id: string               // scénario actif
  assignee_id?: string
  lead_id?: string
  dossier_id?: string
  first_detected_at: string
  last_analyzed_at?: string
  created_at: string
  updated_at: string
}
```

### Règle de calcul `coherence_projet`

Score 0-100 basé sur :
- Budget dans la fourchette projet : 30 points
- Zone dans target_zones : 25 points
- Type de bien dans preferred_property_types : 15 points
- Rendement net-net ≥ yield_target : 15 points
- Cash-flow ≥ cashflow_target : 10 points
- Works tolerance compatible : 5 points

Seuils visuels :
- ≥ 80 : `Excellente compatibilité` (vert)
- 60-79 : `Bonne compatibilité` (vert-jaune)
- 40-59 : `Moyenne` (jaune)
- < 40 : `Hors projet` (gris)

## 2.3 `ScenarioInvest`

Simulation exploitable sur un même bien/projet. Un bien peut porter N scénarios, un scénario est actif à la fois (`current_scenario_id`).

```ts
type ScenarioInvest = {
  scenario_id: string
  opportunity_id: string
  label: string                             // "LMNP réel — apport 20%"
  is_default: boolean
  occupancy_mode: 'nu'|'meuble'|'colocation'|'courte_duree'
  fiscal_regime: 'micro_foncier'|'reel_foncier'|'lmnp_micro'|'lmnp_reel'|'lmp'|'sci_ir'|'sci_is'
  holding_structure: 'nom_propre'|'sci_ir'|'sci_is'
  millesime_fiscal: number                  // 2026
  financing_setup: {
    achat_cash: boolean
    apport: number
    montant_emprunte: number
    taux: number
    duree_annees: number
    assurance_taux: number
    differe_mois: number
    frais_bancaires: number
    travaux_finances: boolean
    mobilier_finance: boolean
  }
  key_assumptions: {
    prix_achat: number
    frais_acquisition: number
    travaux: number
    ameublement: number
    loyer_mensuel_hc: number
    charges_recuperables: number
    charges_non_recup: number
    taxe_fonciere: number
    vacance_mois_par_an: number
    gestion_locative_pct: number
    gli_pct: number
    revalorisation_loyer_annuelle: number
    revalorisation_prix_annuelle: number
    horizon_annees: number
  }
  overrides: {                              // traçabilité des modifs user
    field: string
    original_value: number
    override_value: number
    override_source: 'user'|'avm'|'source'
    timestamp: string
  }[]
  results: {                                // calculés, en cache
    rendement_brut: number
    rendement_net: number
    rendement_net_net: number               // après impôt
    cash_on_cash: number
    cashflow_avant_impot_mensuel: number
    cashflow_apres_impot_mensuel: number
    tri_10_ans: number
    van: number
    dscr: number
    effort_mensuel: number
    impot_annuel: number
    patrimoine_net_10ans: number
  }
  status: 'brouillon'|'valide'|'archive'
  created_at: string
  updated_at: string
}
```

## 2.4 `Analyse` (non persistée)

**Important** : l'Analyse n'est PAS un objet persisté. C'est une vue transient sur une `Opportunité` + un `ScenarioInvest` actif. L'URL `?analyse=[bien_id]` pointe sur l'opportunité, charge le scénario actif, ouvre le modal. Toute édition dans les 7 onglets autosave sur le scénario (ou crée une version si `is_default=true` et modifications majeures).

### Cycle de vie édition

1. User ouvre Analyse → charge `current_scenario_id`
2. Édite loyer dans onglet Rendement → autosave sur le scénario actif après 2s debounce
3. Recalcul automatique des `results` (moteur côté serveur)
4. Propagation inter-onglets via state React + revalidation TanStack Query
5. Fermeture modal → état conservé, réouverture sans perte

### Nouveau scénario

Le bouton "Dupliquer le scénario" dans le modal crée un `ScenarioInvest` enfant (avec label auto "Scenario 2"). Le user peut renommer, éditer, le définir comme actif. Le scénario original reste disponible dans un dropdown `[Scenario actif ▾]` en haut du modal.

## 2.5 `ComparaisonSauvegardee`

Mémoire d'un comparatif (biens ou villes).

```ts
type Comparaison = {
  comparison_id: string
  project_id: string
  type: 'biens'|'scenarios'|'mixte'|'villes'
  name: string
  items: { ref_id: string; ref_type: string; label: string }[]
  source_context: string                    // où il a été créé (opp list, drawer, etc.)
  linked_bien_suivi_ids: string[]
  linked_opportunity_ids: string[]
  linked_villes: string[]                   // si type=villes
  verdict_propsight?: string                // synthèse AI
  status: 'brouillon'|'valide'|'archive'
  created_by: string
  created_at: string
  updated_at: string
}
```

---

# 3. Structure de la page `/app/investissement/opportunites`

## 3.1 Layout général

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Header module                                                             │
│ Opportunités                              [Exporter] [Nouveau ▾]         │
│ Sous-titre                                                                │
├──────────────────────────────────────────────────────────────────────────┤
│ Bloc projet actif : Lyon · 180k · Rendement · Cible >5,5%  [Changer]    │
├──────────────────────────────────────────────────────────────────────────┤
│ KPI row actionnable (4 KPIs dynamiques)                                  │
├──────────────────────────────────────────────────────────────────────────┤
│ Barre sticky : recherche · presets · filtres · tri · toggle Cards/Liste │
├──────────────────────────────────────────────────────────────────────────┤
│ Résultats (cards ou liste dense)                                         │
└──────────────────────────────────────────────────────────────────────────┘
```

Drawer contextuel droit ouvert au clic sur une opportunité.

## 3.2 Zone 1 — Header module

- Titre : `Opportunités`
- Sous-titre : `Biens à potentiel investissement, priorisés par rentabilité, marché et contexte territorial`
- CTA droite :
  - `Exporter` (dropdown : CSV, XLSX, PDF liste)
  - `Nouveau ▾` (split button) :
    - **Investisseur par défaut** : Projet vierge (wizard) > Depuis annonce > Depuis bien suivi
    - **Agent par défaut** : Depuis annonce > Depuis bien suivi > Projet vierge

## 3.3 Zone 2 — Bloc projet actif

Band horizontal fin (48px) avec fond légèrement teinté violet pâle.

Contenu :
- Icône `📊 Projet actif`
- `Nom du projet` · `Ville` · `Budget` · `Stratégie` · `Cible rendement`
- Bouton `[Changer de projet ▾]` à droite

### Interaction clic "Changer de projet"

Ouvre un popover avec :
- Liste des projets actifs (triés par dernière activité)
- Chaque item : nom, zone, budget, stratégie, nombre d'opportunités, date MAJ
- Actions par item : Activer · Dupliquer · Archiver
- En bas : `+ Nouveau projet` (ouvre le wizard 6 étapes)

### Si aucun projet

Band devient CTA-only :
`Aucun projet actif. [Créer mon premier projet]` → lance le wizard.

## 3.4 Zone 3 — KPI row actionnable

**4 KPIs dynamiques** calculés sur la liste filtrée courante, chacun cliquable pour filtrer.

```
┌──────────────┬──────────────────┬────────────────┬──────────────────┐
│ Cohérence    │ Rendement net-net│ Cash-flow      │ Nouveautés       │
│ projet       │ médian           │ médian         │ 7 derniers jours │
│              │                  │                │                  │
│ 67%          │ 4,8%             │ +82 €/mois     │ 12 biens         │
│ compatibles  │ sur 41 biens     │ sur 41 biens   │ +3 baisses prix  │
└──────────────┴──────────────────┴────────────────┴──────────────────┘
   [clic: filtre cohérence>70]    [clic: tri cash-flow desc]  [clic: filtre nouveautés]
```

Règles :
- Se mettent à jour en live selon les filtres appliqués
- Cliquables (toggle filtre/tri associé)
- Indicateur visuel quand le filtre est actif (bordure violette)

## 3.5 Zone 4 — Barre sticky de pilotage

Ordre :
1. Champ recherche (largeur fluide, placeholder `Rechercher une adresse, une ville, un quartier…`)
2. Dropdown `Presets ▾` : `Toutes · Cash-flow · Patrimonial · Travaux/décote · Zone à potentiel · Risque élevé · Mes suivis`
3. Bouton `Filtres (3)` avec badge compteur → ouvre drawer gauche de filtres
4. Bouton `Colonnes` (visible uniquement en mode liste) → popover de config
5. Bouton `Tri ▾` : options listées en §4.2
6. Toggle `[Cards | Liste]` (pattern segmented)

Sticky au scroll.

## 3.6 Zone 5 — Résultats

Deux modes : cards (défaut) ou liste dense. Toggle sauvegarde la préférence par user/project.

---

# 4. Filtres, presets, tri, colonnes

## 4.1 Presets

| Preset | Filtres appliqués |
|---|---|
| Toutes | aucun |
| Cash-flow | cashflow > 0 · rendement net > 4% |
| Patrimonial | cohérence > 70 · horizon > 10 ans |
| Travaux/décote | travaux > 0 · décote > 5% |
| Zone à potentiel | signal PLU fort OR permis proches |
| Risque élevé | risque réglementaire >= élevé OR DPE F/G |
| Mes suivis | source = bien_suivi |

## 4.2 Tri disponible

- Date d'entrée (défaut : desc)
- Score opportunité
- Cohérence projet
- Cash-flow décroissant
- Rendement net-net décroissant
- TRI décroissant
- Prix croissant
- Prix/m² croissant
- Décote marché décroissante
- Potentiel long terme
- Tension locative décroissante

## 4.3 Filtres — drawer gauche

### Bloc Bien / annonce
- Type de bien (multi)
- Type de vente (vente / viager / enchère)
- Ancien / neuf
- Budget (range slider)
- Surface (range)
- Pièces / chambres (range)
- Étage (range)
- Terrain si maison (range)
- DPE (chips multi A→G)
- Travaux (oui/non/tolérance)
- Locataire en place (oui/non)
- Ancienneté annonce (range jours)
- Baisse de prix (oui/non)
- Source (multi)

### Bloc Investissement
- Loyer estimé min/max
- Rendement brut min
- Rendement net min
- Rendement net-net min
- Cash-flow min
- TRI min
- Effort d'épargne max
- Mensualité max
- Total projet max
- Travaux max
- Vacance max

### Bloc Marché / territoire
- Tension locative (chips)
- Prix m² zone (range)
- Croissance loyers (range)
- Croissance prix (range)
- Vacance (range)
- Profondeur de marché (chips : forte / correcte / étroite)
- **Profil locataire dominant** (chips multi : étudiant / jeune actif / couple / famille / senior / mixte)
- Score attractivité (range)

### Bloc Réglementaire / potentiel
- Encadrement loyers (oui/non)
- Zone tendue (oui/non)
- DPE F/G (oui/non)
- Louabilité dégradée (oui/non)
- Permis de louer (oui/non)
- Permis de construire proches (oui/non)
- Mutation urbaine (oui/non)
- PLU favorable / défavorable (chips)
- Servitudes / contraintes (chips)
- Potentiel de transformation (chips)

### Bloc Contexte vécu
- Avis citadins positifs
- Avis citadins mitigés
- Sécurité perçue (chips)
- Qualité de vie perçue (chips)
- Transports perçus (chips)
- Commerce / dynamisme perçu (chips)

### Bloc Cohérence projet
- Cohérence projet min (range 0-100)
- Budget hors fourchette (oui/non)
- Zone hors target (oui/non)

## 4.4 Configuration colonnes (vue liste)

Bouton `Colonnes` → popover avec :
- Liste des 20 colonnes disponibles (checkbox + drag pour réordonner)
- Sauvegarde par user + par projet
- Boutons `Réinitialiser` / `Enregistrer comme preset`

---

# 5. Vue Cards

## 5.1 Règle : 4 métriques fixes + Score + Cohérence

Ne pas dépasser. Les signaux enrichissent via badges haut, pas via métriques ajoutées.

## 5.2 Anatomie d'une card

```
┌────────────────────────────────────────────┐
│ [photo]  [♡] [···]                         │
│ Annonce · Cash-flow+ · DPE C               │
│                            ┌──────┐        │
│                            │ 82   │        │
│                            │/100  │        │
│                            └──────┘        │
├────────────────────────────────────────────┤
│ 15 Rue de la Part-Dieu, 69003 Lyon        │
│ Part-Dieu · Lyon 3e                        │
│ 179 000 €        4 231 €/m²                │
│ 42,3 m² · 2 pièces · 1 ch · 3e · 1990     │
├────────────────────────────────────────────┤
│ Loyer estimé │ Rend. net-net │ Cash-flow  │
│ 930 €/mois   │ 5,8%          │ +128 €     │
│                                             │
│ 👤 Demande : Forte · Jeunes actifs         │
├────────────────────────────────────────────┤
│ Cohérence projet : 78% ✓                   │
│                                             │
│ [Ouvrir l'analyse]  [Comparer]  [···]      │
└────────────────────────────────────────────┘
```

## 5.3 Blocs

### Bloc A — Identité visuelle (haut)
- Photo 4:3
- Badges source top-left (`Annonce`, `Bien suivi`, `Portefeuille`, `DVF`, `Suggestion`, `Manuel`)
- Badges signaux (max 3) : `Cash-flow+`, `Sous-prix`, `Travaux`, `Zone tendue`, `Encadré`, `DPE F/G`, `PLU fort`
- DPE badge inline
- Icône ♡ (suivre) top-right
- Menu `⋯` (actions secondaires) top-right
- Score Propsight : cercle 56px avec valeur /100, overlay photo bas-droit

### Bloc B — Identité bien
- Adresse complète
- Quartier · Ville/CP
- Prix (gras) · Prix/m²
- Caractéristiques inline : surface · pièces · chambres · étage · année

### Bloc C — Décisionnel (4 métriques)
- Ligne 1 (3 métriques financières) :
  - Loyer estimé (€/mois)
  - Rendement net-net (%)
  - Cash-flow après impôt (€/mois)
- Ligne 2 (pill combiné) :
  - `👤 Demande : [Forte|Correcte|Étroite] · [Type dominant]`

Ce pill remplace la 4ème métrique financière et intègre le wedge profil locataire.

### Bloc D — Décision & actions
- Chip `Cohérence projet : 78% ✓` (couleur selon seuil)
- CTA principal `Ouvrir l'analyse` (pleine largeur primaire)
- CTA secondaires : `Comparer` · `⋯` (Suivre, Créer dossier, Créer action, Écarter)

## 5.4 Badges disponibles

### Source (1 badge)
`Annonce` · `Bien suivi` · `Portefeuille` · `DVF ref` · `Suggestion` · `Manuel` · `Projet vierge`

### Statut (0-1 badge, overlay top-right ou menu)
`Nouveau` · `À qualifier` · `Comparé` · `À arbitrer` · `Suivi` · `Écarté` · `Pré-sélection`

### Signal (max 3 badges)
`Cash-flow+` · `Sous-prix` · `Travaux` · `Zone tendue` · `Encadré` · `DPE F/G` · `PLU fort` · `Avis positifs` · `Avis sensibles` · `Baisse prix`

### Règle
Max 3 badges signal. Si plus, afficher `+N` cliquable (tooltip full list).

## 5.5 États card

- **Défaut** : bordure neutre
- **Hover** : bordure violette légère + shadow
- **Sélectionné** (multi-select) : checkbox visible + bordure violette pleine
- **Nouveau** : tag "Nouveau" coin top-left
- **Écarté** : opacity 50%, action `Réactiver` dans menu

---

# 6. Vue Liste dense

## 6.1 Règle : 8 colonnes par défaut, 20 configurables

## 6.2 Colonnes par défaut

| # | Colonne | Largeur | Contenu |
|---|---|---|---|
| 1 | checkbox | 32px | — |
| 2 | Bien | 280px | Photo mini + adresse + ville/CP + source (badge inline) |
| 3 | Prix | 100px | Prix affiché + prix/m² en subtitle |
| 4 | Loyer | 90px | Loyer estimé €/mois + %/an en subtitle |
| 5 | Cash-flow | 90px | Cash-flow après impôt € + % effort en subtitle |
| 6 | Rend. net-net | 90px | % + chip niveau (bon/correct/faible) |
| 7 | Profil cible | 100px | Pill "Jeunes actifs" / "Familles" / etc. |
| 8 | Cohérence | 80px | % + chip couleur (vert/jaune/gris) |
| 9 | Score | 60px | Cercle mini + /100 |
| 10 | Actions | 48px | Menu `⋯` |

Total : ~1080px + marges. Tient sur 1440px utile.

## 6.3 Colonnes configurables (les 20)

Ajoutables depuis le bouton Colonnes :
- TRI 10 ans
- DSCR
- Total projet
- Mensualité
- Apport requis
- Tension locative
- Vacance
- Prix zone m²
- Loyer zone m²
- Risque réglementaire
- Potentiel long terme
- DPE
- Surface
- Pièces
- Année construction
- Ancienneté annonce
- Auteur / Assignee
- Statut
- Date d'entrée
- Régime fiscal retenu

## 6.4 Multi-sélection

Quand 2+ biens cochés, barre flottante bas :
- Compteur `[N] sélectionnés`
- `Comparer` (max 4)
- `Enregistrer la comparaison`
- `Ajouter aux biens suivis`
- `Créer une action` (par lot)
- `Écarter`
- `X` pour tout désélectionner

## 6.5 Tri par colonne

Click header = tri asc/desc toggle. Indicateur visuel (chevron).

---

# 7. Drawer opportunité

## 7.1 Rôle

Préqualifier rapidement sans quitter la page. Ouvre au clic sur une card/ligne. Largeur ~480px, slide from right.

## 7.2 Structure

### Header
- Photo miniature + Badges source/statut
- Adresse complète
- Type de bien · Surface · Pièces
- Score (cercle) + Cohérence projet (chip)
- Menu `⋯` (Fermer, Voir fiche bien, Partager lien)

### Bloc Sticky (4 KPIs)
- Prix total projet
- Cash-flow après impôt
- Rendement net-net
- TRI 10 ans

### Bloc Profil locataire (compact)
```
👤 Cible : jeunes actifs
Profondeur : forte · Revenu requis 2 790 €/mois
```

### Bloc Cohérence projet
- Nom projet actif
- Budget : ✓ / ✗
- Zone : ✓ / ✗
- Type de bien : ✓ / ✗
- Rendement cible atteint : ✓ / ✗
- Alignement global : chip %

### Bloc Signaux clés
6 chips horizontales :
- Décote/surcote vs marché
- Tension
- DPE
- Encadrement
- PLU / permis signal
- Avis citadins résumé

### Bloc Comparaisons associées
- Nombre de comparaisons liées
- Dernière comparaison (date + preview)
- CTA `Rouvrir` · `Nouvelle comparaison`

### Bloc Actions
- `Ouvrir l'analyse` (primaire)
- `Ajouter au comparatif`
- `Suivre ♡`
- `Créer une action`
- `Rattacher à un lead` (persona agent uniquement)
- `Voir la fiche bien`
- `Écarter`

### Bloc Timeline (condensé)
5 derniers événements :
- Opportunité détectée (date)
- Prix changé
- Suivi
- Comparée
- Analysée

CTA `Voir tout` → ouvre modal timeline complète.

---

# 8. Wizard de création d'un projet investisseur

## 8.1 Rôle

Unique parcours de création d'un projet. Accessible depuis :
- Split button `Nouveau projet` de la page Opportunités
- Popover "Changer de projet" > `+ Nouveau projet`
- Sidebar Dossiers > onglet Projets > bouton `Nouveau projet`
- Tableau de bord (via widget vide)

**Remplace** le mode "projet vierge dans modal Analyse" précédemment spécifié. Le modal Analyse sert uniquement à **itérer** sur un projet existant.

## 8.2 Structure — 6 étapes

```
┌─ Nouveau projet vierge ────────────────────────────────────────────────┐
│ [Quitter] [Enregistrer]                                    [Suivant ▸]│
├────────────────────────────────────────────────────────────────────────┤
│ (1) Projet → (2) Acquisition → (3) Finance → (4) Revenus & charges    │
│           → (5) Fiscalité → (6) Résultats                             │
├────────────────────────────────────────────────────────────────────────┤
│                                              │ Simulation en temps réel│
│  [Formulaire de l'étape courante]           │ [Synthèse live]         │
│                                              │ [Zones suggérées]       │
│                                              │ [Opps correspondantes]  │
└────────────────────────────────────────────────────────────────────────┘
```

Split 65/35. Colonne droite est sticky et se met à jour en live à chaque champ modifié.

## 8.3 Étape 1 — Projet

### Champs
- **Nom du projet** (input, défaut auto : "Projet [ville] [stratégie] — [mois] [année]")
- **Ville / Secteur** (autocomplete villes FR, multi-select jusqu'à 3)
- **Stratégie d'investissement** (select) :
  - Location nue longue durée
  - Location meublée longue durée
  - Colocation
  - Courte durée
  - Revente rapide (achat-travaux-revente)
  - Mixte

### Sous-bloc "Bien cible"
- Type de bien (select : Appartement ancien / Appartement neuf / Maison / Immeuble / Local)
- Surface cible (input m²)
- Nombre de pièces (select)
- Étage cible (range)
- Loyer cible HC (input €, avec calcul %/m² inline)
- Travaux / Aménagements (input €, avec calcul % du prix inline)
- État du bien (select : Neuf / Bon / À rafraîchir / À rénover)

### Sous-bloc "Exploitation"
- Mode d'exploitation (select déduit de la stratégie)
- Durée d'occupation cible (select)
- Profil locataire cible (select : Étudiant / Jeune actif / Couple / Famille / Senior / Mixte)
- Vacance locative estimée (% annuel)

### Sous-bloc "Fiscalité & détention" (V1 réduite)
- Régime fiscal (select parmi 4 V1 : micro-foncier, réel foncier, LMNP micro, LMNP réel)
- Holding de détention (select : Nom propre / SCI IR — SCI IS en V2)
- Durée de détention envisagée (select)
- TMI du foyer fiscal (%)

### Bouton `Afficher les paramètres avancés`
Expand montrant : nombre de parts fiscales, millésime fiscal, taux d'effort de référence.

## 8.4 Étape 2 — Acquisition

- Budget d'acquisition (frais inclus)
- Apport personnel (€ et %)
- Frais de notaire (% calculé auto, éditable)
- Frais d'agence (% inclus dans le prix ou ajoutés)
- Travaux additionnels
- Ameublement (si meublé)
- Réserve de sécurité post-achat

## 8.5 Étape 3 — Finance

- Montant emprunté (auto-calculé, éditable)
- Taux de crédit (input %, valeur par défaut selon barème admin)
- Durée du prêt (années)
- Assurance emprunteur (%)
- Différé de remboursement (mois)
- Frais de dossier bancaire (€)
- Achat cash oui/non (toggle)

## 8.6 Étape 4 — Revenus & charges

- Loyer mensuel HC
- Charges récupérables
- Charges non récupérables
- Taxe foncière annuelle
- Gestion locative (% si externalisée)
- GLI (% si assurance)
- Petits frais récurrents
- Revalorisation loyer annuelle (%)

## 8.7 Étape 5 — Fiscalité

Détail du régime sélectionné en étape 1, avec possibilité de comparer.

Pour chaque régime V1 disponible :
- Impôt annuel estimé
- Cash-flow après impôt
- Rendement net-net
- TRI 10 ans
- Complexité (chip)

Le user peut changer le régime actif ici.

## 8.8 Étape 6 — Résultats

Synthèse des résultats + bouton de création :

- KPI summary (5 KPIs sticky row du modal Analyse)
- Verdict projet (Propsight)
- Profil locataire cible & profondeur de marché
- Zones suggérées similaires (top 3)
- Opportunités correspondantes (top 5)
- CTA `Créer le projet` (primaire) · `Créer le projet + dossier` · `Enregistrer en brouillon`

## 8.9 Colonne droite — Simulation temps réel

Toujours visible, contenu :
- Synthèse du projet (coût total, mensualité, cash-flow, rendement net-net, TRI, patrimoine 10 ans, plus-value brute)
- Zones suggérées similaires (3 villes avec rendement + tension)
- Opportunités correspondantes (1-3 biens matching)

Legend "Les résultats sont des estimations indicatives basées sur vos hypothèses."

## 8.10 Sortie du wizard

Au clic `Créer le projet` :
1. Création `ProjetInvestisseur` en base
2. Création d'un `ScenarioInvest` de référence avec les hypothèses du wizard
3. Optionnellement création d'un `DossierInvestissement` brouillon (si bouton "Créer projet + dossier")
4. Redirection vers `/app/investissement/dossiers/projets/[id]` (workspace projet)

---

# 9. Modal d'analyse — shell général

## 9.1 Rôle

Workspace décisionnel détaillé du bien ou du projet. URL shareable. Ouvre depuis :
- Card Opportunité → clic "Ouvrir l'analyse"
- Liste dense → clic ligne
- Drawer opportunité → CTA "Ouvrir l'analyse"
- Annonce (module Biens) → "Analyser en investissement"
- Bien suivi (Veille) → "Analyser"

URL : `/app/investissement/opportunites?analyse=[opp_id]&tab=[tab_name]&scenario=[scenario_id]`

## 9.2 Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [← Retour aux opportunités]           [Comparer] [Scénario▾] [Créer dossier] [⋯]│
├──────────────────────────────────────────────────────────────────────────┤
│ Header : photo · titre · adresse · source · statut · Score + Cohérence │
├──────────────────────────────────────────────────────────────────────────┤
│ Sticky KPI row (5 KPIs)                                                  │
│ Prix total proj · Cash-flow ATF · Rend. net-net · TRI 10 ans · Score    │
│ ─────────────────────────────────────────────────────────────────────── │
│ Cible : jeunes actifs · Profondeur forte · Revenu requis 2 790 €/mois  │
├──────────────────────────────────────────────────────────────────────────┤
│ Tabs : Annonce | Ville/Marché | Rendement | Finance | Fiscalité |       │
│        Potentiel/PLU | Récap                                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ [Contenu de l'onglet courant]                                            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Header modal

- Bouton retour `[← Retour aux opportunités]` top-left
- Actions droite :
  - `Comparer` (ajoute au comparatif en cours ou en crée un)
  - `Scénario ▾` (dropdown : scénario actif sélectionné + dupliquer + renommer + gérer)
  - `Créer un dossier` (primaire violet)
  - Menu `⋯` : Partager l'analyse · Enregistrer le scénario · Exporter · Écarter
- Sous le bouton retour :
  - Photo miniature 72px + titre + adresse
  - Source (chip) + Statut opportunité (chip)
  - Score cercle + Cohérence projet (chip à droite)

### Sticky KPI row — 5 KPIs figés

Ordre fixe, ne change jamais d'onglet à onglet :

| Prix total projet | Cash-flow après impôt | Rendement net-net | TRI 10 ans | Score |

Recalcul live quand le scénario actif est édité.

### Ligne contextuelle sous le sticky

```
Cible : [type_dominant] · Profondeur [depth] · Revenu requis [X €/mois]
```

Toujours visible. Clic → ouvre drawer avec détail complet du profil locataire.

### Tabs

7 tabs dans l'ordre : **Annonce · Ville/Marché · Rendement · Finance · Fiscalité · Potentiel/PLU · Récap**

Indicateur visuel tab actif (bordure bas violette + gras). Tab URL-aware.

## 9.3 Deux modes

- **Mode bien réel / annonce existante** : les 7 tabs s'appliquent normalement
- **Mode projet vierge** : l'onglet Annonce devient "Bien cible" (caractéristiques recherchées, pas un bien réel)

## 9.4 Frontières anti-doublons

| Onglet | Répond à |
|---|---|
| Annonce | Qu'est-ce qu'on analyse exactement, qualité source, faits bruts à valider |
| Ville/Marché | Marché local, demande, comparables, désirabilité, profil locataire |
| Rendement | Qualité économique de l'exploitation (avant impôt) |
| Finance | Dette, levier, bancabilité, scénarios financement |
| Fiscalité | Régime, impôt, sortie, complexité (post-impôt) |
| Potentiel/PLU | Futur du bien et du secteur, urbanisme, transformabilité |
| Récap | Décision finale, scénario retenu, prochaines actions |

---

# 10. Onglet `Annonce`

## 10.1 Question répondue

> "Qu'est-ce qu'on analyse exactement, quelle est la qualité de la source, et quels sont les faits bruts à valider avant de croire aux calculs ?"

## 10.2 Above the fold (ATF)

**3 KPIs héros + verdict**

| Prix affiché | Prix/m² | Ancienneté annonce |
|---|---|---|
| 179 000 € | 4 231 €/m² | Publiée il y a 12 jours |

**Verdict Annonce** : `Annonce propre` / `À compléter` / `Vieillissante` / `Signaux douteux`

+ Score de complétude (pill, ex : `Complétude : 8/10`)

## 10.3 Blocs détaillés (T1)

### Bloc 1 — Synthèse Annonce Propsight
- Verdict (chip)
- 2-4 lignes narratives
- Forces (3 chips)
- Points à vérifier (3 chips)

### Bloc 2 — Identité du bien
- Adresse complète
- Ville / CP / Quartier
- Type de bien
- Surface (+ Carrez si copropriété)
- Pièces / chambres
- Étage / ascenseur
- Extérieur (balcon / terrasse / jardin)
- Parking / cave / annexes
- Année ou période de construction
- Occupation si connue
- Copropriété ou non
- Chauffage / énergie
- DPE / GES

### Bloc 3 — Galerie et lecture visuelle
- Galerie images
- Zoom
- Signaux visuels détectés (chips) : état apparent · luminosité · travaux visibles · potentiel présentation
- Toujours labellisé `signaux à confirmer`

### Bloc 4 — Description source + extraction structurée
- Texte source repliable
- Tags structurés extraits : lumineux, dernier étage, à rénover, meublé, faibles charges
- Alertes : flou commercial · manque d'infos · "idéal investisseur" non étayé

### Bloc 5 — Historique commercial
- Date de première détection
- Date de publication connue
- Prix initial / Prix actuel
- Baisses de prix (timeline mini)
- Ancienneté
- Réactivation éventuelle
- Multi-diffusion si disponible

### Bloc 6 — Données financières brutes
Tout taggué `Déclaré par la source` :
- Prix affiché
- Honoraires / FAI
- Loyer en place si bien occupé
- Charges copro si mentionnées
- Taxe foncière si mentionnée
- Rentabilité affichée par la source

### Bloc 7 — Qualité de la donnée / niveau de confiance
Scoring par dimension (chip oui/non/partiel) :
- Photos · Énergie · Charges · Taxe foncière · Occupation · Description · Historique · Sources multiples

### Bloc 8 — Notes, vérifications et mémoire interne
- Notes libres (textarea)
- Drapeaux de vérification (chips)
- Checklist validation
- Contact agence / vendeur
- Actions liées

## 10.4 Mode projet vierge → "Bien cible"

L'onglet devient **Bien cible** :
- Type de bien cible
- Surface visée
- Prix cible
- État cible
- Budget travaux cible
- DPE cible
- Critères indispensables / bonus
- CTA `Chercher des opportunités compatibles`

## 10.5 Éditable ici
- État perçu
- Niveau travaux estimatif
- Occupation à confirmer
- Tags internes
- Notes
- Checklist
- Enrichissements manuels

## 10.6 CTA
- Voir la fiche bien
- Ouvrir l'annonce originale
- Ajouter au comparatif
- Créer une action
- Marquer à vérifier
- Ajouter aux biens suivis
- Recharger les données

---

# 11. Onglet `Ville / Marché`

## 11.1 Question répondue

> "Ce bien est-il situé dans un marché locatif et de revente cohérent avec le projet, et qui peut louer dans cette zone ?"

## 11.2 Above the fold (ATF)

**3 KPIs héros + 1 verdict**

| Prix m² zone | Loyer m² zone | Tension locative |
|---|---|---|
| 4 150 €/m² | 17,20 €/m² | Très élevée |

**Verdict marché** : `Très porteur` / `Solide` / `Patrimonial` / `Étroit` / `Sensible`

### Bloc profil locataire ATF (différenciateur, obligatoire)

Positionné directement sous les 3 KPIs, pleine largeur :

```
┌───────────────────────────────────────────────────────────────────┐
│ 👤 Profil locataire cible & profondeur de demande                │
│                                                                    │
│  Cible dominante     Profondeur        Revenu requis              │
│  Jeunes actifs       Forte             2 790 €/mois               │
│                                                                    │
│  Taux d'effort référence : 33% · Part population compatible : 28% │
│  [Voir le détail ▸]                                               │
└───────────────────────────────────────────────────────────────────┘
```

Clic "Voir le détail" → scroll vers bloc 6 (profil complet).

## 11.3 Blocs détaillés (T1)

### Bloc 1 — Synthèse marché Propsight
- Verdict marché (chip)
- 2-4 lignes narratives
- Forces (3 chips)
- Vigilances (3 chips)

### Bloc 2 — Snapshot marché local (uniquement macro)
- Prix moyen / médian au m²
- Loyer moyen / médian au m²
- Évolution prix 1 an / 5 ans (sparkline)
- Évolution loyers 1 an / 5 ans
- Volume de transactions récentes
- Rendement moyen de zone

**Ne pas reproduire** : tension, vacance (ATF owner).

### Bloc 3 — Positionnement du bien dans son marché
- Prix bien vs marché (% décote/surcote)
- Loyer cible vs marché (% décote/surcote)
- Percentile du bien
- Lecture revente / liquidité (chip)

### Bloc 4 — Demande locative & profondeur (détail)
- Tension locative (détail + sources)
- Vacance (détail)
- Délai de relocation estimé
- Profondeur de demande (détail)
- Adéquation typologie ↔ zone
- Solvabilité locative du secteur

### Bloc 5 — Comparables vente et location
- 3-6 comparables vente (cards cliquables → drawer bien)
- 3-6 comparables location
- Lecture Propsight : loyer prudent / cohérent / agressif

### Bloc 6 — Profil locataire détaillé (complet)
- Profil dominant + distribution secondaire
- Part locataires / propriétaires
- Taille moyenne des ménages
- Mobilité résidentielle
- Structure d'occupation locale
- Distribution revenus IRIS (graphe)
- Part population compatible avec le loyer cible
- Calcul explicité : `Loyer 1100 € × taux effort 33% = Revenu requis 3 333 €/mois`

### Bloc 7 — Services, accessibilité et qualité de vie
- Transports (score + détail)
- Commerces
- Santé
- Écoles / campus
- Vie quotidienne
- Lecture utile investissement

### Bloc 8 — Ressenti local / avis habitants
- Note globale (positive / mitigée / sensible)
- Thèmes dominants (chips) : sécurité · bruit · commerces · ambiance · transports
- Verbatims courts (3-5)
- Labellisé `signal complémentaire`

### Bloc 9 — Zones et villes alternatives
- Quartiers voisins plus cohérents
- Villes proches plus adaptées au projet
- Surface achetable ailleurs
- Raison de la recommandation
- CTA `Comparer ces zones` → lance modal `?comparatif-zones=[...]`

## 11.4 Mode projet vierge

L'onglet affiche :
- Zone cible
- Budget
- Stratégie
- Typologie visée
- Loyer cible
- Surface achetable
- Zones alternatives

## 11.5 Éditable ici
- Rayon d'analyse
- Granularité (ville / quartier / micro-zone / IRIS)
- Typologie benchmarkée
- Mode d'exploitation cible
- Zone comparée alternative
- Taux d'effort de référence

## 11.6 CTA
- Voir les comparables
- Comparer une zone voisine
- Ajouter la zone au projet
- Créer une alerte secteur
- Ouvrir Potentiel/PLU
- Ouvrir l'Observatoire

---

# 12. Onglet `Rendement`

## 12.1 Question répondue

> "Ce bien tient-il économiquement en exploitation (avant fiscalité), dans le scénario actif ?"

## 12.2 Above the fold (ATF)

**3 KPIs héros + verdict (thèse)**

| Cash-flow avant impôt | Rendement net | Cash-on-cash |
|---|---|---|
| +164 €/mois | 4,9% | 6,8% |

**Thèse d'investissement** : 2-4 lignes narratives
- 3 forces (chips vertes)
- 3 vigilances (chips orange)

## 12.3 Blocs détaillés (T1)

### Bloc 1 — Paramètres d'exploitation (éditable)
**Éditables inline** :
- Mode d'exploitation (nue / meublée / colocation / courte durée)
- Loyer cible (€/mois)
- Vacance (mois/an)
- Charges non récupérables (€)
- Gestion locative (%)
- GLI (%)
- Taxe foncière (€)
- Petits frais récurrents (€/an)
- Revalorisation loyer (%/an)
- Horizon d'analyse (années)

Chaque édition déclenche recalcul debounced 2s.

### Bloc 2 — Décomposition cash-flow (waterfall)
Visualisation waterfall mensuelle :
```
Loyers collectés    +1 100 €
− Vacance              −22 €
− Charges non rec.     −58 €
− Taxe foncière        −92 €
− Crédit              −786 €
= Cash-flow BI        +142 €
```

Toggle `Avant impôt | Après impôt` (si après, affiche la version fiscalisée — switch mental pour aller voir Fiscalité).

### Bloc 3 — Rendements détaillés
**Inline 2 lignes** :
- Rendement brut : 5,5%
- Rendement net : 4,9%

**Expand "Indicateurs avancés"** :
- Cap rate / revenu net d'exploitation
- VAN (Valeur Actuelle Nette)

Le **rendement net-net** et le **TRI après impôt** vivent dans Fiscalité. Ici on référence en fin de bloc : `→ Voir rendement net-net dans Fiscalité`.

### Bloc 4 — Benchmarks placements
Comparaison pédagogique (bloc admin-configurable, valeurs millésimées) :

| Placement | Rendement | Liquidité | Risque |
|---|---|---|---|
| Livret A | 3,0% | élevée | très faible |
| LDDS | 3,0% | élevée | très faible |
| OAT 10 ans | 3,2% | moyenne | faible |
| SCPI moyenne | 4,5% | faible | moyen |
| **Ce bien (net)** | **4,9%** | faible | moyen |
| **Ce bien (cash-on-cash)** | **6,8%** | faible | moyen |

**Règle** :
- Comparer le **net** et le **cash-on-cash**, jamais le brut
- Mentions légales : "Comparaison pédagogique, ne constitue pas un conseil en investissement. Valeurs à titre indicatif au [date]."

### Bloc 5 — Comparables locatifs utiles au rendement
- Loyers comparables (3-6)
- Loyer/m²
- Fraîcheur annonce
- Distance
- Lecture : prudent / cohérent / agressif

### Bloc 6 — Projection simple et enrichissement
Courbes à 10 ans :
- Cash-flow cumulé
- Capital remboursé
- Patrimoine net
- Enrichissement total

### Bloc 7 — Sensibilité et scénarios
Matrice Prudent / Central / Optimisé :

| Scénario | Loyer | Vacance | Cash-flow | Net-net | TRI |
|---|---|---|---|---|---|
| Prudent | -5% | +2 mois | ... | ... | ... |
| Central | base | base | +142€ | 4,9% | 6,4% |
| Optimisé | +3% | 0 | ... | ... | ... |

## 12.4 Éditable ici
- Loyer cible
- Vacance
- Charges d'exploitation
- Gestion / GLI
- Taxe foncière
- Mode d'exploitation
- Horizon simplifié

## 12.5 Non éditable ici
- Détail du prêt (→ Finance)
- Structure fiscale détaillée (→ Fiscalité)

## 12.6 CTA
- Enregistrer le scénario
- Ajouter au comparatif
- Dupliquer le scénario
- Créer un dossier
- Modifier dans Finance
- Modifier dans Fiscalité

---

# 13. Onglet `Finance`

## 13.1 Question répondue

> "Comment finance-t-on ce projet, est-il finançable dans de bonnes conditions, et quel montage crée le meilleur compromis ?"

## 13.2 Above the fold (ATF)

**3 KPIs héros + verdict bancabilité**

| Apport requis | Mensualité | DSCR |
|---|---|---|
| 70 000 € (20%) | 1 254 €/mois | 1,12 |

**Verdict bancabilité** : `Finançable confort` / `Tendu` / `À revoir`
- 2-4 lignes d'explication
- Forces / Vigilances

## 13.3 Blocs détaillés (T1)

### Bloc 1 — Structure du projet et coût total
- Prix d'acquisition
- Frais d'acquisition (notaire)
- Garantie / frais bancaires
- Courtage
- Travaux / ameublement
- Réserve de sécurité
- **Coût total projet**

### Bloc 2 — Paramètres de financement (éditable)
- Apport
- Montant emprunté
- Durée (ans)
- Taux
- Assurance (%)
- Différé (mois)
- Achat cash oui/non
- Frais bancaires
- Travaux financés oui/non
- Mobilier financé oui/non
- Mensualité cible (calculée ou saisie, mode sync)

### Bloc 3 — Plan de financement détaillé (waterfall)
- Apport personnel
- Part financée
- Quote-part frais financés ou non
- Travaux financés ou non
- Mobilier financé ou non
- Trésorerie restante après achat

### Bloc 4 — Scénarios de financement (comparaison 3 montages)
3 colonnes : 10% apport / 20% / 30%

| Paramètre | 10% | 20% | 30% |
|---|---|---|---|
| Apport | 35k | 70k | 105k |
| Durée | 25 ans | 20 ans | 20 ans |
| Taux | 3,5% | 3,4% | 3,4% |
| Mensualité | 1 400 | 1 254 | 1 100 |
| DSCR | 0,9 | 1,12 | 1,27 |
| Effort | 300€ | 142€ | -20€ |
| Cash-on-cash | 9,1% | 6,8% | 4,9% |
| TRI 10 ans | 6,2% | 5,7% | 5,1% |

Chaque colonne : bouton `Appliquer ce montage`.

### Bloc 5 — Sensibilité / robustesse
Variations :
- Taux +0,5pt / +1pt
- Durée -5 ans
- Loyer -5%
- Vacance +1 mois
- Travaux +10%
- Prix négocié -5%

Impact sur : mensualité, cash-flow, DSCR, effort.

### Bloc 6 — Bancabilité / lecture prêteur
- Verdict : bancable confort / tendu / refus probable
- Taux d'endettement estimé
- Explication
- Correctifs suggérés (allonger durée, augmenter apport, renégocier taux)

## 13.4 Mode projet vierge
- Budget total cible
- Apport cible
- Mensualité acceptable
- Taux d'effort cible
- Durée max souhaitée
- Stratégie

## 13.5 Éditable ici
- Apport
- Taux
- Durée
- Assurance
- Différé
- Achat cash oui/non
- Frais bancaires
- Mensualité cible
- Financement des travaux / mobilier

## 13.6 Non éditable ici
- Loyer détaillé (→ Rendement)
- Vacance (→ Rendement)
- Régime fiscal (→ Fiscalité)

## 13.7 CTA
- Enregistrer le scénario
- Dupliquer le scénario
- Comparer les financements
- Créer un dossier
- Ajouter au comparatif
- Modifier dans Rendement
- Modifier dans Fiscalité

---

# 14. Onglet `Fiscalité`

## 14.1 Question répondue

> "Quel régime rend ce projet cohérent après impôt, et quel est le meilleur compromis cash-flow / simplicité / sortie ?"

## 14.2 Périmètre V1 (figé)

### Régimes V1 (4 + mock pour les autres)

**Branchés en calcul complet** :
- Micro-foncier (location nue)
- Réel foncier (location nue)
- LMNP micro-BIC (meublée)
- LMNP réel (meublée)

**Mockés en V1 (affichage uniquement, pas de calcul réel)** :
- LMP
- SCI IR
- SCI IS
- Courte durée / meublé tourisme

**Règles V1** :
- Tous les paramètres légaux (barèmes IR, seuils micro, taux amortissement) sont **versionnés par millésime** dans une config admin (pas hardcodés)
- Un scénario porte toujours un `millesime_fiscal` (défaut : année en cours)
- Les régimes mockés affichent un badge `Calcul à venir (V1.1)` et un tooltip explicatif

### Enveloppes de détention
- Nom propre (V1 complet)
- SCI IR (V1.1 mock)
- SCI IS (V1.1 mock)

### Compléments obligatoires V1
- CFE potentielle (affichage)
- Coût comptable / gestion (input)
- Fiscalité de revente (calcul plus-value)
- Horizon de détention
- TMI / parts fiscales

## 14.3 Above the fold (ATF)

**3 KPIs héros + verdict régime**

| Cash-flow après impôt | Rendement net-net | Gain vs régime de référence |
|---|---|---|
| +92 €/mois | 4,2% | +38€/mois vs nu réel |

**Verdict régime** : `LMNP réel recommandé` (chip avec raison courte)

## 14.4 Blocs détaillés (T1)

### Bloc 1 — Recommandation fiscale Propsight
- Régime recommandé (chip)
- Synthèse courte
- Badges auto : `Meilleur cash-flow` / `Meilleure simplicité` / `Meilleure revente` / `Meilleur compromis`
- Forces / Vigilances

### Bloc 2 — Cadrage fiscal du projet (éditable)
- Nom propre / SCI
- Nature d'exploitation
- Régime fiscal actif
- TMI
- Nombre de parts
- Horizon de détention
- Millésime fiscal (défaut : année courante, overridable)
- Autres revenus utiles au calcul
- Prise en compte revente oui/non

### Bloc 3 — Résultat du régime actif (détail calcul)
- Impôt annuel estimé
- Base imposable
- Abattement
- Charges déductibles
- Amortissements (si LMNP réel)
- CFE
- Coût comptable
- Déficit reportable éventuel
- Gain/perte vs régime de référence

### Bloc 4 — Matrice "Comparer tous les régimes"

Tableau (régime par ligne, métrique par colonne) :

| Régime | Impôt annuel | Cash-flow ATF | Net-net | TRI 10 ans | Coût admin | Revente | Pertinence projet | Complexité |
|---|---|---|---|---|---|---|---|---|
| Micro-foncier | 500 € | +80 | 3,9% | 5,2% | 0 € | ✓ | Moyen | Simple |
| Réel foncier | 420 € | +86 | 4,1% | 5,4% | 0 € | ✓ | Bon | Moyen |
| LMNP micro | 280 € | +92 | 4,4% | 5,6% | 0 € | ✓ | Bon | Simple |
| **LMNP réel** ⭐ | **120 €** | **+112** | **4,8%** | **6,4%** | **800 €** | ⚠ | **Excellent** | Moyen |
| LMP (mock) | — | — | — | — | — | — | — | — |
| SCI IR (mock) | — | — | — | — | — | — | — | — |
| SCI IS (mock) | — | — | — | — | — | — | — | — |

Badges auto sur chaque ligne.

### Bloc 5 — Décryptage du régime recommandé
- Pourquoi Propsight le recommande
- Ce qu'il faut surveiller
- Cas d'usage typiques

### Bloc 6 — Complexité / gestion administrative
- Niveau de complexité (chip)
- Obligations déclaratives
- Besoin comptable
- Coût annuel estimatif
- Charge de gestion

### Bloc 7 — Sortie / fiscalité de revente
- Horizon de détention
- Plus-value estimée de sortie
- Impact amortissements LMNP réel
- Lecture revente : favorable / neutre / défavorable / à surveiller

### Bloc 8 — Alertes fiscales et administratives
- Micro peu intéressant
- Réel plus performant
- Déficit foncier exploitable
- LMNP réel pertinent mais plus complexe
- CFE probable
- Sortie LMNP réel à surveiller

## 14.5 Mode projet vierge
- Le moteur fonctionne sans annonce
- Permet de définir un régime cible avant la recherche
- Guide ensuite les opportunités compatibles

## 14.6 Éditable ici
- Enveloppe
- Nature d'exploitation
- Régime fiscal
- TMI / parts
- Horizon
- Millésime
- Prise en compte revente
- Coût comptable / CFE (avancé)

## 14.7 CTA
- Appliquer ce régime au scénario
- Comparer tous les régimes
- Enregistrer le scénario fiscal
- Créer un dossier
- Ajouter au comparatif
- Modifier dans Rendement
- Modifier dans Finance

---

# 15. Onglet `Potentiel / PLU`

## 15.1 Question répondue

> "Quels risques et opportunités long terme liés à l'urbanisme, aux autorisations autour du bien, aux contraintes réglementaires locales et aux possibilités de transformation ?"

## 15.2 Above the fold (ATF)

**3 KPIs qualitatifs + verdict**

| Signal urbanisme | Permis à proximité | Transformabilité |
|---|---|---|
| Favorable (chip vert) | 12 dans 500m | R+1 envisageable |

**Verdict Propsight** : `Potentiel long terme favorable` / `Neutre` / `À surveiller` / `Défavorable`

## 15.3 Blocs détaillés (T1)

### Bloc 1 — Synthèse Potentiel Propsight
- Verdict
- Synthèse courte
- Forces (chips)
- Vigilances (chips)
- Horizon de valorisation estimé

### Bloc 2 — Faisabilité réglementaire rapide
- Zone PLU / document d'urbanisme
- Lecture simplifiée du zonage
- Servitudes / contraintes connues
- Règles utiles à l'investisseur
- Niveau faisabilité : simple / à vérifier / contraint
- "Ce qu'on peut raisonnablement envisager"

### Bloc 3 — Localisation & zonage PLU (carte)
- Map avec contour parcelle
- Chip zonage (UG, UA, etc.)
- Lien `Ouvrir le PLU` (Géoportail urbanisme)

### Bloc 4 — Pipeline de transformation du secteur
- Permis de construire récents (liste avec date + type)
- Déclarations préalables pertinentes
- Permis d'aménager
- Lotissements / divisions
- Projets publics structurants
- Lecture : soutien de valeur / concurrence future / nuisance / recomposition

### Bloc 5 — Transformabilité du bien
- Reconfiguration légère (chip)
- Amélioration DPE (chip)
- Meublé / colocation (chip)
- Division intérieure (chip)
- Extension / surélévation (chip)
- Changement destination (chip)
- Optimisation surface
- Création de surface SDP estimée
- Potentiel de valorisation estimé (%)

### Bloc 6 — Risques urbanistiques et réglementaires
- Zonage & règles (récap)
- Servitudes & contraintes
- Risques administratifs (délai PC, recours tiers, ABF)
- Points de vigilance (division, stationnement, changement d'usage, meublé touristique)

### Bloc 7 — Valeur future et concurrence d'offre
- Soutien potentiel à la valeur
- Dilution potentielle de la rente
- Attractivité future du quartier
- Risque de compression des loyers
- Liquidité future à la revente

### Bloc 8 — Cas spéciaux d'usage et d'exploitation
- Meublé touristique / courte durée (autorisation locale)
- Division foncière
- Transformation local ↔ logement
- Colocation lourde / reconfiguration

## 15.4 Mode projet vierge
- Zone cible
- Type de bien recherché
- Stratégie
- Signaux de mutation du secteur
- Contraintes génériques à surveiller
- Opportunités de création de valeur par typologie

## 15.5 Éditable ici
- Rayon d'analyse des autorisations autour
- Scénario d'usage cible
- Hypothèse de transformation à tester
- Niveau de sensibilité au risque urbanistique

## 15.6 CTA
- Ajouter ce signal au scénario
- Créer une action de vérification
- Joindre ce diagnostic au dossier
- Comparer le potentiel avec un autre bien
- Voir les permis proches
- Créer une alerte secteur

---

# 16. Onglet `Récap`

## 16.1 Question répondue

> "Est-ce qu'on avance sur ce bien, dans quel scénario, avec quels points forts, quels risques, et pour quel locataire cible ?"

## 16.2 Above the fold (ATF)

**Bloc Verdict global + Score + Cohérence + Profil locataire cible** (pas de KPIs nouveaux, on agrège le sticky row)

```
┌───────────────────────────────────────────────────────────────────┐
│  ┌─────┐                                                          │
│  │ 82  │  Verdict : Très bonne opportunité                       │
│  │ /100│  Scénario retenu : LMNP réel · Location longue · 10 ans  │
│  └─────┘  Cohérence projet : 78% ✓                                │
│                                                                    │
│  👤 Profil locataire cible : Jeunes actifs / Couples sans enfant │
│  Revenu indicatif requis : 3 150 €/mois · Profondeur : forte     │
│                                                                    │
│  [Créer le dossier]  [Créer une action]  [Partager l'analyse]    │
└───────────────────────────────────────────────────────────────────┘
```

## 16.3 Blocs détaillés (T1)

### Bloc 1 — Verdict global Propsight
Statuts : `Go` / `Go sous conditions` / `À négocier` / `À arbitrer` / `À écarter`
- Score global /100
- Score breakdown (radar chart mini : Rendement · Marché · Risque · Potentiel · Cohérence)
- Niveau de confiance
- Synthèse 2-4 lignes
- Scénario de référence actif

### Bloc 2 — Scénario retenu
- Mode d'exploitation retenu
- Régime fiscal retenu
- Scénario de financement retenu
- Horizon de détention
- Hypothèses structurantes (liste)
- Loyer cible
- Vacance
- Bouton `Changer de scénario` (ouvre dropdown scénarios alternatifs)

### Bloc 3 — KPI de synthèse (5 KPIs, cohérents avec sticky row)

| Prix total projet | Cash-flow après impôt | Rendement net-net | TRI 10 ans | Score |
|---|---|---|---|---|

**Ne pas dupliquer** d'autres métriques. Si besoin de détail, lien vers l'onglet owner.

### Bloc 4 — Profil locataire cible & profondeur de demande (OBLIGATOIRE)

Bloc non négociable, pleine largeur :

```
👤 Profil locataire cible & profondeur de demande

   Cible principale     Loyer cible         Revenu requis
   Jeunes actifs        1 100 €/mois        3 150 €/mois
   + Couples            (HC)                (taux effort 33%)

   Part de la population compatible      Profondeur
   28% (IRIS Lyon 3e)                    Forte

   Niveau de confiance : Élevé
   Sources : Filosofi IRIS · Structure ménages INSEE
```

### Bloc 5 — Forces principales (3-5 bullets max)

### Bloc 6 — Risques / blockers (3-5 bullets max)

### Bloc 7 — Checklist avant décision / avant offre
10 items max, format checkbox :
- Vérifier charges copro
- Confirmer taxe foncière
- Demander diagnostics
- Vérifier règlement de copro
- Confirmer occupation réelle
- Valider loyer de marché
- Vérifier urbanisme / servitudes
- Valider montage bancaire
- Valider régime fiscal
- Obtenir le DPE et audit énergétique

### Bloc 8 — Recommandations alternatives (narratif)
- Négocier le prix de X%
- Passer en meublé plutôt qu'en nu
- Ajuster l'apport
- Viser une autre zone
- Préférer un T2 à un T3

### Bloc 9 — Actions et sorties
CTA principaux (persona-aware) :
- `Créer le dossier` (primaire)
- `Créer une action` (agent: suivi client / investisseur: rappel perso)
- `Ajouter au comparatif`
- `Partager l'analyse`
- `Enregistrer les hypothèses`

## 16.4 Mode projet vierge

Le Récap affiche :
- Verdict sur le projet cible
- Zone · Budget · Stratégie
- Mode d'exploitation recommandé
- Régime fiscal recommandé
- Type de bien idéal
- Surface / prix cible
- Profil locataire cible
- Profondeur de marché
- Critères indispensables de sourcing

---

# 17. Lien Opportunité → Dossier : règles de snapshot hybride

## 17.1 Principe

Quand on clique `Créer un dossier` depuis l'Analyse :

**Snapshot figé** :
- Hypothèses du scénario actif (loyer, vacance, taxe, régime, financement)
- Overrides user (tous)
- Décisions qualitatives (verdict, forces, risques)
- Checklist / notes

**Référence live** :
- Données marché (prix zone, loyer zone, tension, vacance)
- Comparables (mise à jour possible)
- Données PLU / permis
- Profil locataire IRIS

## 17.2 Mécanisme technique

```ts
type DossierCreationFromOpportunity = {
  opportunity_id: string
  scenario_id: string
  snapshot_hypotheses: ScenarioInvest['key_assumptions']
  snapshot_financing: ScenarioInvest['financing_setup']
  snapshot_fiscal: {
    regime: string
    tmi: number
    parts: number
    millesime: number
  }
  snapshot_overrides: ScenarioInvest['overrides']
  live_refs: {
    bien_id: string | null
    zone_id: string
    avm_version_at_creation: string
  }
  created_at: string
}
```

## 17.3 UI dans l'éditeur dossier

En haut du dossier, band informatif :

```
📌 Créé depuis l'opportunité [nom] le [date]
   Données marché : live (dernière sync : il y a 3 jours)
   Hypothèses : figées (snapshot du [date])
   [Rafraîchir les données marché] [Voir l'opportunité source]
```

Le bouton `Rafraîchir les données marché` met à jour uniquement les blocs marché (prix zone, comparables, tension) sans toucher aux hypothèses.

---

# 18. Comparatif contextuel — biens & scénarios

## 18.1 Principe

**Aucune section dédiée dans la sidebar.** Le comparatif se lance depuis :
- Cards (multi-select bas + bouton Comparer)
- Liste dense (checkboxes + barre flottante)
- Drawer (CTA Ajouter au comparatif)
- Analyse détaillée (bouton Comparer en header)
- Biens suivis

URL : `?comparatif=[id1,id2,id3]` (jusqu'à 4 items)

## 18.2 Types de comparaison

- **biens** : comparer plusieurs biens avec leur scénario actif
- **scenarios** : comparer plusieurs scénarios du même bien (ex: LMNP réel vs nu réel)
- **mixte** : combinaisons (bien A en LMNP + bien A en nu + bien B en LMNP)

## 18.3 Layout modal

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Comparaison d'opportunités              [Enregistrer] [Rouvrir+tard] [×]│
│ Projet actif : Grenoble · 150k · Rendement · Cible >8%                  │
├──────────────────────────────────────────────────────────────────────────┤
│ [Photo]    [Photo]    [Photo]                   │ Verdict Propsight     │
│ Bien A     Bien B     Bien C                    │                       │
│ 124 000 €  158 000 €  89 000 €                  │ Meilleur rendement :  │
│ 78/100     64/100     82/100                    │ Bien C (10,4%)        │
├─────────────────────────────────────────────────┤                       │
│ Critères  │   A   │   B   │   C   │             │ Meilleure sécurité :  │
├───────────┼───────┼───────┼───────┤             │ Bien C                │
│ Acquis.   │ ...   │ ...   │ ...   │             │                       │
│ Rendement │ 9,6%  │ 6,8%  │ 10,4% │             │ Meilleur potentiel :  │
│ Cash-flow │ +112  │ -18   │ +164  │             │ Bien C                │
│ Fiscalité │ LMNP  │ ...   │ ...   │             │                       │
│ Marché    │ ...   │ ...   │ ...   │             │ Meilleur cash-flow :  │
│ Risques   │ ...   │ ...   │ ...   │             │ Bien C (+164€/mois)   │
│ Potentiel │ ...   │ ...   │ ...   │             │                       │
│ Avis      │ ...   │ ...   │ ...   │             │ Recommandation :      │
├───────────┴───────┴───────┴───────┤             │ Bien C (82/100)       │
│ [Ajouter biens suivis] [Rouvrir] [Ouvrir l'analyse détaillée]           │
└──────────────────────────────────────────────────────────────────────────┘
```

## 18.4 Critères de comparaison (lignes)

Ordre fixe :
1. **Acquisition** : prix, m², frais, négociation
2. **Rendement** : brut / net / TRI
3. **Cash-flow** : mensuel / annuel
4. **Fiscalité** : régime / optimisation
5. **Marché local** : dynamique / tension
6. **Risques réglementaires** : encadrement / zones / taxes
7. **Potentiel / PLU** : évolution / transformabilité
8. **Avis citadins** : note + verbatims

Chaque cellule peut être cliquée pour ouvrir un drawer détail.

## 18.5 Verdict Propsight (colonne droite)

Calcul automatique :
- Meilleur rendement (+ raison)
- Meilleure sécurité (+ raison)
- Meilleur potentiel long terme (+ raison)
- Meilleur cash-flow (+ raison)
- **Recommandation globale** (bien gagnant + score + raison synthèse)

## 18.6 Actions comparatif

- `Enregistrer la comparaison` (sauvegarde dans le projet)
- `Rouvrir plus tard` (le sauvegarde en brouillon personnel)
- `Ajouter aux biens suivis` (tous les biens du comparatif)
- `Ouvrir l'analyse détaillée` (sur le bien sélectionné)
- `+ Nouvelle recherche` (ajouter un 4ème bien)

## 18.7 Réapparition

Une comparaison sauvegardée est retrouvable depuis :
- Workspace projet (bloc Comparatifs sauvegardés)
- Drawer opportunité (bloc Comparaisons associées)
- Veille > Biens suivis (filtre "Dans une comparaison")
- Fiche bien

---

# 19. Comparatif de villes (NOUVEAU)

## 19.1 Rôle

Permettre à un investisseur d'arbitrer entre plusieurs villes avant même de regarder des biens. Répond à : "Dois-je investir à Lyon 3e ou Saint-Étienne Centre ?"

URL : `?comparatif-zones=[ville1,ville2,ville3]` (jusqu'à 4 zones)

## 19.2 Points d'entrée

- Workspace projet > bloc "Villes suivies / proches" → bouton `Comparer ces zones`
- Onglet Ville/Marché du modal Analyse > bloc "Zones alternatives" → bouton `Comparer avec cette zone`
- Veille > Zones suivies → multi-select + `Comparer`
- Observatoire > Contexte local → bouton `Ajouter à un comparatif zones`

## 19.3 Layout modal

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Comparaison de zones                    [Enregistrer] [+ Zone] [×]      │
│ Projet actif : Grenoble · 150k · Rendement                               │
├──────────────────────────────────────────────────────────────────────────┤
│              │ Lyon 3e   │ Saint-Étienne │ Grenoble 3e │ Verdict         │
│              │           │ Centre         │              │                 │
├──────────────┼───────────┼────────────────┼─────────────┼─────────────────┤
│ Prix m² médian│ 4 150 €   │ 1 680 €        │ 2 890 €     │ Meilleur rdt :  │
│ Loyer m² médian│ 17,20 €  │ 11,50 €        │ 13,80 €     │ Saint-Étienne   │
│ Rendement médian│ 4,7%    │ 8,2%           │ 5,7%        │                 │
│ Tension loca. │ Très élevée│ Moyenne        │ Élevée     │ Meilleure       │
│ Vacance       │ 1,8%      │ 4,2%           │ 2,5%        │ tension :       │
│ Profondeur    │ Forte     │ Étroite        │ Correcte    │ Lyon 3e         │
│ Profil dominant│ Jeunes actifs│ Mixte       │ Étudiants   │                 │
│ Signal PLU    │ Favorable │ Neutre         │ Favorable   │                 │
│ Évol. prix 5a │ +18%      │ +4%            │ +9%         │                 │
│ Évol. loyers 5a│ +12%     │ +6%            │ +10%        │                 │
│ Avis habitants│ 4,2/5     │ 3,1/5          │ 4,5/5       │                 │
│ Budget compatible│ ≥250k   │ ≥90k           │ ≥160k       │ Compat. budget :│
│ Part pop. CSP+│ 42%       │ 28%            │ 38%         │ Lyon 3e         │
├──────────────┴───────────┴────────────────┴─────────────┴─────────────────┤
│ Recommandation Propsight : Lyon 3e — meilleur équilibre rdt/tension pour │
│ votre projet rendement avec budget 150k. Mais budget trop serré (>250k). │
│ Alternative Grenoble 3e : budget compatible + tension élevée +           │
│ rendement médian correct 5,7%.                                           │
├──────────────────────────────────────────────────────────────────────────┤
│ [Suivre cette zone] [Choisir comme cible] [Voir opportunités] [Enregistrer]│
└──────────────────────────────────────────────────────────────────────────┘
```

## 19.4 Critères de comparaison (lignes)

1. **Prix** : prix m² médian, évolution 1 an / 5 ans
2. **Loyers** : loyer m² médian, évolution 1 an / 5 ans
3. **Rendement** : rendement médian de zone
4. **Tension & demande** : tension, vacance, délai relocation, profondeur
5. **Profil locataire** : type dominant, part CSP+, structure ménages
6. **Réglementaire** : encadrement, zone tendue, permis louer
7. **Urbanisme / PLU** : signal PLU, permis en cours, projets structurants
8. **Avis habitants** : note + thèmes
9. **Compatibilité projet** : budget compatible, stratégie compatible, typologie accessible

## 19.5 Actions zones

- `Suivre cette zone` (ajoute à Veille > Zones suivies)
- `Choisir comme cible du projet` (ajoute à target_zones du projet actif)
- `Voir les opportunités de cette zone` (filtre opportunités)
- `Créer une alerte zone` (alerte sur nouvelles annonces / baisses prix)
- `Enregistrer la comparaison` (dans le workspace projet)
- `+ Zone` (ajouter une 4ème pour comparer)

## 19.6 Sauvegarde

Idem comparatif biens : objet `Comparaison` avec `type='villes'`, réapparaît dans workspace projet + Veille.

---

# 20. États, empty states, loading

## 20.1 Empty states

### Aucune opportunité
```
Vos premières opportunités apparaîtront ici dès que vous suivrez
des biens ou lancerez une recherche investisseur.

[Voir les biens suivis] [Explorer les annonces] [Créer une opportunité]
```

### Aucun projet actif
```
Créez votre premier projet d'investissement pour identifier les
meilleures opportunités selon votre stratégie.

[Créer mon projet] [Voir un exemple]
```

### Aucun résultat avec filtres
```
Aucun bien ne correspond à ces critères. Essayez d'élargir votre
budget, votre zone ou vos seuils de rendement.

[Réinitialiser les filtres] [Charger le preset Toutes] [Voir mes biens suivis]
```

### Analyse en cours (AVM)
```
Analyse en cours — estimation du loyer et des rendements…
(skeleton des blocs)
```

## 20.2 Loading

- Skeleton cards (animation shimmer)
- Skeleton rows pour liste dense
- Jamais de spinner central plein écran
- Indicateur de recalcul dans modal Analyse : pill discrète top-right "Calcul…"

## 20.3 États AVM indisponible

Si l'AVM n'a pas répondu :
- Afficher les valeurs connues (prix affiché, données marché)
- Remplacer les KPIs calculés par `—` avec tooltip `Estimation indisponible, réessayer`
- Badge `AVM indispo` orange
- Bouton `Réessayer`

## 20.4 États dégradés

- Données source douteuses → badge `À vérifier`
- Millésime fiscal obsolète (>18 mois) → badge `Règles fiscales anciennes, recalculer`
- Overrides user sur valeurs critiques → badge `Valeurs modifiées`

---

# 21. Recommandations design & dev

## 21.1 Design

- UI dense, premium, desktop-first (1440-1600px cible)
- Cards et tables structurées, pas décoratives
- Score explicable, jamais magique (breakdown toujours accessible)
- Toujours distinguer `source` / `estimé` / `à confirmer`
- Faire ressortir la **cohérence projet** partout (chip couleur)
- Rendre visibles les différenciateurs : **profil locataire**, PLU, permis, avis citadins
- Pas de gros blocs IA décoratifs : l'IA s'intègre aux blocs métier (synthèses courtes, verdicts)

## 21.2 Dev

- Moteur d'analyse **stateful** avec scénarios persistants (`ScenarioInvest`)
- Moteur fiscal **millésimé** (config admin, pas hardcodé)
- Moteur de comparaisons sauvegardées
- Objet `ProjetInvestisseur` réutilisable
- Capable de fonctionner avec ou sans annonce réelle (mode projet vierge)
- Toutes les hypothèses critiques doivent être versionnables / persistées
- Autosave debounced 2s sur le scénario actif
- URL shareable sur modal Analyse + comparatifs

## 21.3 Analytics produit recommandés

À suivre en V1 :
- Ouverture analyse / opportunité
- Création projet vierge (via wizard)
- Comparaison créée (biens / villes / mixte)
- Comparaison sauvegardée
- Bien ajouté aux suivis depuis opportunités
- Scénario dupliqué
- Régime fiscal changé dans Fiscalité
- Dossier créé depuis opportunité
- Opportunité écartée
- Changement de projet actif
- Filtres appliqués (top 10)
- Colonnes configurées par user

---

# 22. Structure technique recommandée

```
/app/investissement/opportunites
├── page.tsx                            ← Liste + KPI row + filtres + drawer
├── layout.tsx                          ← Header module + band projet actif

/components/investissement/opportunites/
├── OpportunitiesPage.tsx
├── BandProjetActif.tsx
├── KPIRowActionable.tsx
├── BarreSticky.tsx
├── CardOpportunity.tsx
├── ListeOpportunitiesDense.tsx
├── ColumnConfigPopover.tsx
├── DrawerOpportunity.tsx
├── ModalAnalyse.tsx                    ← shell avec tabs
├── tabs/
│   ├── TabAnnonce.tsx
│   ├── TabVilleMarche.tsx
│   ├── TabRendement.tsx
│   ├── TabFinance.tsx
│   ├── TabFiscalite.tsx
│   ├── TabPotentielPLU.tsx
│   └── TabRecap.tsx
├── ModalComparatif.tsx
├── ModalComparatifZones.tsx            ← NOUVEAU
├── WizardProjetVierge.tsx              ← 6 étapes
├── PopoverSwitchProjet.tsx
├── BlocProfilLocataire.tsx             ← réutilisé partout
├── BlocScoreBreakdown.tsx
└── BlocCoherenceProjet.tsx

/services/investissement/
├── useOpportunities.ts                 ← TanStack Query
├── useScenario.ts
├── useProjet.ts
├── useAnalysisAutoSave.ts
└── useComparaison.ts

/mocks/handlers/
├── opportunites.ts
├── projets.ts
├── scenarios.ts
├── comparaisons.ts
└── avm.ts                              ← mock AVM en attendant ML team
```

### Réutilisations obligatoires

- `TemplateRapport` (pour le passage au dossier)
- `PanneauContenu`
- `ModaleComparables`
- `BlocSolvabilite`
- `DrawerContextuel` (shared layout)
- Handlers MSW existants estimations / comparables / solvabilité

---

# 23. Prompt Claude Code

```text
On construit le sous-module Opportunités du module Investissement pour Propsight.

Lis d'abord :
- /docs/12_OPPORTUNITES_INVESTISSEMENT.md
- /docs/13_DOSSIER_INVESTISSEMENT.md
- /docs/03_TEMPLATE_RAPPORT.md
- /docs/06_BLOC_SOLVABILITE.md
- /docs/02_LAYOUT_PRO.md

Objectif : implémenter le sous-module complet avec :
1. Page principale `/app/investissement/opportunites` (cards + liste dense)
2. Drawer opportunité
3. Modal Analyse (7 onglets)
4. Wizard création projet (6 étapes)
5. Modal comparatif biens
6. Modal comparatif zones
7. Popover switch projet

Contraintes :
- Respecter la règle "3 KPIs max par ATF + verdict qualitatif"
- Sticky row modal Analyse = 5 KPIs figés (Prix total, Cash-flow ATF, Net-net, TRI, Score)
- Cards = 4 métriques + Score + Cohérence
- Liste dense = 8 colonnes par défaut, 20 configurables
- Profil locataire visible à toutes les surfaces (pill card, ligne sticky, ATF Ville, bloc Récap)
- Snapshot hybride Opportunité → Dossier
- UI persona-aware (agent vs investisseur) : split buttons, wording, CTAs
- Moteur fiscal V1 réduit à 4 régimes réels + 4 mockés
- Millésime fiscal configurable admin
- Comparatifs modaux sans section sidebar
- Autosave debounced 2s sur le scénario actif

À implémenter :

1. Route `/app/investissement/opportunites/page.tsx`
   - Header + split button persona-aware
   - BandProjetActif avec changement
   - KPIRowActionable (4 KPIs cliquables)
   - BarreSticky (recherche, presets, filtres, tri, toggle)
   - CardOpportunity / ListeOpportunitiesDense selon toggle
   - DrawerOpportunity au clic

2. Modal `ModalAnalyse`
   - URL shareable `?analyse=[id]&tab=[name]&scenario=[sid]`
   - Header + sticky KPI row + ligne contextuelle profil locataire
   - 7 tabs avec frontières strictes
   - Autosave sur scénario actif

3. Wizard `WizardProjetVierge` 6 étapes
   - Split 65/35 avec simulation live droite
   - Crée Projet + ScenarioInvest de référence
   - Optionnellement crée un Dossier brouillon

4. `ModalComparatif` (biens + scénarios + mixte) 
5. `ModalComparatifZones` (nouveau)

6. Composants réutilisables :
   - BlocProfilLocataire (3 variantes : card pill / tab ATF / Récap plein)
   - BlocScoreBreakdown (radar 5 dimensions)
   - BlocCoherenceProjet (pill + détail)

7. Fixtures & handlers MSW :
   - projets (3-5 profils)
   - opportunités (30+ biens Paris/Lyon/Grenoble/Saint-Étienne)
   - scénarios (2-3 par opportunité)
   - comparaisons sauvegardées (biens + zones)
   - mock AVM (prix + loyer + confidence)
   - profils locataires par IRIS (5-10)

8. Persona-aware :
   - Switch agent/investisseur en settings user
   - Composants qui lisent `user.persona` et ajustent labels + actions
   - Table de substitutions wording centralisée

9. Validation visuelle :
   - Desktop 1440px prioritaire
   - Pas de scroll horizontal
   - Sticky header modal Analyse correct
   - Cards denses mais lisibles (4 métriques + pill)
   - Liste dense : 8 colonnes par défaut tiennent sur 1440px

10. Commit final
    - `git add -A`
    - `git commit -m "12: module opportunites investissement complet"`
```

---

# 24. Checklist validation produit

### Page Opportunités
- [ ] Band projet actif visible en haut, switch fonctionnel
- [ ] KPI row : 4 KPIs dynamiques cliquables (filtre/tri)
- [ ] Cards : 4 métriques + Score + Cohérence + pill Demande profil locataire
- [ ] Liste dense : 8 colonnes par défaut (incluant Profil cible)
- [ ] Bouton Colonnes fonctionne, sauvegarde config par user+projet
- [ ] Filtres : 5 blocs + bloc Cohérence projet

### Modal Analyse
- [ ] Sticky row = 5 KPIs figés (Prix total, Cash-flow ATF, Net-net, TRI, Score)
- [ ] Ligne contextuelle sous sticky avec profil locataire + revenu requis
- [ ] 7 tabs sans duplication de KPI héro
- [ ] Chaque ATF d'onglet : 3 KPIs max + verdict
- [ ] Profil locataire ATF dans Ville/Marché (pas en bloc 6)
- [ ] Récap : bloc profil obligatoire pleine largeur
- [ ] Autosave fonctionne (2s debounce)
- [ ] URL partageable

### Profil locataire (wedge)
- [ ] Pill card "Demande : X · Y"
- [ ] Colonne liste dense "Profil cible"
- [ ] Ligne sticky modal
- [ ] Bloc ATF Ville/Marché
- [ ] Bloc obligatoire Récap
- [ ] Bloc détail Ville/Marché T1
- [ ] Même source de vérité partout (LocataireProfile)

### Wizard projet
- [ ] 6 étapes, pas plus
- [ ] Simulation live colonne droite
- [ ] Crée ProjetInvestisseur + ScenarioInvest de référence
- [ ] Option "Créer projet + dossier"
- [ ] Redirection vers workspace projet

### Comparatifs
- [ ] Comparatif biens : jusqu'à 4 biens
- [ ] Comparatif zones : jusqu'à 4 zones
- [ ] Comparatif mixte (biens + scénarios)
- [ ] Sauvegarde dans le projet
- [ ] Verdict Propsight calculé
- [ ] Réapparition dans workspace projet

### Persona
- [ ] Split button Nouveau projet change d'ordre selon persona
- [ ] Labels substitués (Créer dossier, Partager, etc.)
- [ ] CTAs quick actions adaptés
- [ ] Mode hybride avec switch

### Moteur fiscal V1
- [ ] 4 régimes réels calculés : micro-foncier, réel foncier, LMNP micro, LMNP réel
- [ ] 4 régimes mockés avec badge "V1.1"
- [ ] Millésime fiscal configurable
- [ ] Comparaison matrice complète

### Lien Opportunité → Dossier
- [ ] Snapshot hypothèses figé
- [ ] Référence live pour marché/comparables
- [ ] Band informatif en haut du dossier
- [ ] Bouton Rafraîchir données marché

---

# 25. Définition finale du module

> **Le module Opportunités de Propsight est une file de biens à potentiel investissement, évalués par rapport à un projet investisseur actif, enrichis par la finance, le marché, le risque réglementaire, l'urbanisme, le contexte vécu et la profondeur de demande locative solvable, ouvrant une analyse détaillée à 7 onglets, des comparaisons contextuelles sauvegardables (biens et villes), reliées à Veille, Leads, Estimation et Dossiers, avec une UI persona-aware pour agent et investisseur en direct.**

---

# 26. Changelog V2 → V3

### Ajouts majeurs
- §0.2 Règle KPI ownership + hiérarchie progressive
- §0.3 Profil locataire comme donnée normée cross-produit
- §0.4 Matrice persona agent vs investisseur
- §2.4 Analyse comme vue transient (pas objet persisté)
- §2.5 Comparaison sauvegardée (biens + villes)
- §8 Wizard projet vierge 6 étapes unifié
- §17 Règles snapshot hybride Opportunité → Dossier
- §19 Comparatif de villes (module complet)

### Corrections majeures
- §3.4 KPI row actionnable (4 KPIs dynamiques, plus de compteurs de buckets)
- §5 Cards réduites à 4 métriques + pill Demande
- §6 Liste dense à 8 colonnes par défaut + colonne Profil cible
- §9.2 Sticky row modal = 5 KPIs figés (vs 7)
- §12-16 ATF onglets = 3 KPIs max + verdict (vs 6+)
- §11 Profil locataire monté en ATF Ville/Marché
- §12 Rendement : suppression doublons bloc 2 + répartition claire avec Fiscalité
- §13 Finance : suppression doublons bloc 4
- §14 Fiscalité : scope V1 réduit à 4 régimes réels + mock
- §16 Récap : profil locataire = bloc pleine largeur obligatoire

### Hors scope V1 (explicite)
- Portefeuille investisseur (biens détenus, post-acquisition)
- Multi-projets actifs parallèles pour un agent (tab switcher)
- Comparaison mixte avancée (matrice complexe)
- LMP, SCI IR, SCI IS, courte durée (mockés V1, calcul V1.1)
- Alertes zone prédictives ML
- Scoring emplacement façon Cityscan (V2)
- Isochrones piétonniers (V2)

---

Fin de la spec Opportunités V3.
