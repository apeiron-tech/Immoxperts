# Propsight — Tableau de bord Pro

**Version** : V2 — refonte post-analyse concurrentielle
**Statut** : prête pour Claude Code
**Route principale** : `/app/tableau-de-bord`
**Sidebar** : `Tableau de bord` actif, premier item de la sidebar Pro
**Persona V1 principal** : agent immobilier
**Variantes prévues** : manager / admin / owner, investisseur, hybrid
**Design** : desktop-first 1440–1600px · dense · premium · Linear / Attio · violet Propsight
**Stack cible** : Next.js App Router · TypeScript strict · Tailwind · shadcn/ui · TanStack Query v5 · MSW v2 · nuqs · Zustand si nécessaire

---

# 0. Résumé exécutif

Le **Tableau de bord Propsight** est la page d'accueil Pro. Il répond à **trois questions business** qu'un agent immobilier se pose en ouvrant son CRM le matin :

1. **"Mon mois se passe bien ?"** → KPIs business (CA, mandats, pipe, taux transfo, part de marché)
2. **"Qu'est-ce qui peut basculer ma fin de trimestre ?"** → rapports envoyés qui rebondissent, mandats expirants, signaux territoire
3. **"Qu'est-ce que je dois regarder maintenant ?"** → top priorités + top alertes rankées par impact

## 0.1 Différenciation produit

Le Tableau de bord Propsight se positionne contre trois types de concurrents :

| Concurrent | Faiblesse | Avantage Propsight |
|---|---|---|
| Yanport (veille marché) | 0 indicateur business, alertes chronologiques noyées | KPIs business + alertes rankées par impact |
| CRM immo classiques (Apimo, Hektor) | Dashboard = compteurs statiques | Synthèse transverse + signaux territoire |
| Outils BI généralistes | Pas de contexte immo | Intégration marché/DVF/AVM native |

**Bloc différenciant unique** : **Rapports envoyés & engagement** (§9). Aucun concurrent français ne permet à un agent de voir quels avis de valeur / études locatives ont été rouverts par le client et quand les relancer. C'est le bloc qui justifie l'abonnement à lui seul.

## 0.2 Principe architectural : preview, pas workspace

Le Tableau de bord agrège les objets clés de Propsight :

```txt
Lead · Action · Bien · Annonce · Estimation · Rapport · Opportunité ·
Dossier · Alerte · Notification · Bien suivi · Zone · Collaborateur · RDV
```

Mais il **n'est pas le propriétaire** de ces objets. Il affiche des **previews rankées par impact** et renvoie systématiquement vers le module source pour le travail de manipulation (checker une action, trier des leads, filtrer des alertes).

La logique métier :

```txt
Donnée → Signal → Priorité → Action → Lead → Rapport → Relance → Mandat
```

Le Tableau de bord rend cette chaîne visible en un écran. Les autres modules la font avancer.

---

# 1. Positionnement produit

## 1.1 Ce que le Tableau de bord est

- une page d'accueil Pro (entry point après login) ;
- une synthèse transverse business + signaux ;
- une surface de priorisation par impact ;
- une passerelle cliquable vers les modules sources ;
- un écran d'orientation en 30 secondes le matin.

## 1.2 Ce que le Tableau de bord n'est pas

- un second Pilotage commercial (le workspace d'exécution reste `/app/activite/pilotage`) ;
- une seconde Veille (l'inbox notifications reste `/app/veille/notifications`) ;
- une page Performance détaillée (le reporting reste `/app/activite/performance`) ;
- une carte Observatoire ;
- une fiche bien ;
- un mini-CRM ;
- un Kanban équipe ;
- une page personnalisable drag & drop (V1).

Les modules sources restent **propriétaires de leur logique métier**. Le Tableau de bord ne duplique jamais un Kanban, une table de filtres, une carte ou un form de création.

## 1.3 Pattern "preview vs workspace"

C'est le principe architectural central qui résout le chevauchement avec Pilotage et Veille.

| Dimension | Pilotage / Veille (workspace) | Tableau de bord (preview) |
|---|---|---|
| Scope | Exhaustif (toutes actions, toutes notifs) | Top 4–5 seulement |
| Tri | Chronologique, filtrable, Kanban | Par `priority_score` (impact business) |
| Interaction | Manipulable inline (check, drag, filtrer) | Lecture + 1 CTA qui ouvre la source |
| CTA footer | — | `Voir toutes (N) →` obligatoire |
| Usage | Ouvert en continu sur la journée | Ouvert 1–2 fois par jour |

Un agent qui veut **traiter** ses actions → Pilotage. Un agent qui veut **voir s'il y a du nouveau critique** → Tableau de bord.

## 1.4 Différence avec les autres sections

| Section | Question | Rôle |
|---|---|---|
| **Tableau de bord** | Comment va mon business et qu'est-ce qui est important ? | Synthèse business + preview |
| Pilotage commercial | Qu'est-ce que je fais aujourd'hui ? | Cockpit d'exécution quotidien |
| Leads | Où en est mon pipeline ? | Pipeline commercial unique |
| Performance | Qu'est-ce qui marche ? Combien je peux faire ? | Analytique personnelle |
| Veille | Qu'est-ce qui a changé ? | Inbox d'événements actionnables |
| Équipe | Où l'équipe est bloquée ? | Surcouche manager |
| Observatoire | Que dit cette zone ? | Intelligence territoriale |
| Prospection | Quel signal mérite une action ? | Détection + conversion |
| Investissement | Quel bien mérite une analyse ? | Décision investisseur |
| Estimation | Quel livrable produire / relancer ? | Production de valeur |

---

# 2. Principes non négociables

## 2.1 Preview, pas duplication

Un bloc TdB = **extrait priorisé + lien vers le module source**. Jamais un Kanban, jamais une table filtrable, jamais un form de création interne.

| Donnée | Source de vérité | Dashboard affiche |
|---|---|---|
| Pipeline lead | `/app/activite/leads` | KPI + lignes priorités + raccourci |
| Actions | Pilotage commercial | Top 4 priorités du jour, lecture seule |
| Alertes / notifs | Veille | Top 5 alertes rankées par impact |
| Rapports | Estimation + Dossiers | Rapports envoyés avec signal engagement |
| Mandats | Biens / Portefeuille | Santé (expirations, overpricing) |
| Signaux | Prospection | Top 3 signaux Radar zone |
| Marché | Observatoire | Pouls synthétique multi-scopes |
| Opportunités | Investissement | Top 3 à analyser |
| Performance | Performance | Résumé KPIs strip + delta |
| Équipe | Équipe | Variante `scope=equipe` uniquement |

## 2.2 KPIs business, pas compteurs d'inbox

Les 5 KPIs du strip répondent à **"comment va mon business ?"**, pas à "combien de tâches j'ai à faire ?". Les compteurs task-list (leads à traiter, actions urgentes) restent dans Pilotage où ils ont leur place légitime.

## 2.3 Tri par impact, pas chronologique

Chaque liste (priorités, alertes, rapports, signaux) est triée par un **score d'impact business**. Le chronologique est disponible dans les modules sources (Pilotage, Veille), pas ici.

## 2.4 Chaque information renvoie vers son module source

Aucune ligne décorative. Chaque KPI, ligne ou cellule doit :

- afficher un **badge source** (module d'origine) ;
- permettre au minimum **une action** (CTA principal) ;
- ouvrir soit un **drawer contextuel**, soit le **module source filtré**.

Actions-type autorisées :

```txt
Ouvrir · Relancer · Assigner · Créer lead · Créer action · Analyser
Comparer · Créer alerte · Voir détail · Brief · Reporter · Archiver
```

## 2.5 Grille fixe en V1

Pas de drag & drop, pas de personnalisation widgets. Tous les utilisateurs voient la même grille (variations limitées au scope et au persona). La personnalisation est reportée à V2 post-lancement.

Rationale : une grille fixe garantit une UX consistante pendant la phase d'apprentissage du produit et évite une couche de complexité technique (persistance layout, drag handles, modes édition) sur un sprint déjà chargé.

## 2.6 IA discrète

Pas de gros bloc IA dans le body. L'IA reste disponible via :

- bouton `Assistant IA` dans le header global Pro ;
- suggestion courte dans un drawer contextuel ;
- CTA `Voir suggestion IA` depuis une priorité si pertinent.

## 2.7 Desktop-first

Viewport cible :

```txt
1440 × 900 minimum utile
1600 px idéal
```

La page peut scroller légèrement (~1.3 hauteurs d'écran max). L'objectif V1 : **bloc KPI strip + Priorités + Alertes + Rapports envoyés visibles above the fold**. Le reste (Santé portefeuille, Pouls marché, Opportunités) en scroll court.

---

# 3. Architecture route & URL

## 3.1 Route

```txt
/app/tableau-de-bord
```

L'URL `/app` redirige automatiquement vers `/app/tableau-de-bord` (entry point post-login).

## 3.2 Query params

```ts
type DashboardQueryParams = {
  periode?: '7j' | '30j' | 'trim' | '12m' | 'custom'
  zone?: string           // slug zone ex: "paris-15"
  scope?: 'me' | 'equipe' // visible admin/owner uniquement
  persona?: 'agent' | 'investor'
  drawer?: string         // ex: "lead:L-001"
  preset?: string         // ex: "rapports-chauds"
}
```

Gestion via `nuqs` (shallow routing sans reload).

Exemples :

```txt
/app/tableau-de-bord?periode=30j&zone=paris-15&scope=me
/app/tableau-de-bord?drawer=lead:L-001
/app/tableau-de-bord?preset=rapports-chauds
```

## 3.3 Drawer contextuel

Chaque ligne cliquable (priorité, alerte, rapport, opportunité) ouvre un drawer contextuel partagé (composant `<EntityDrawer>`) via query param `?drawer=...`.

```txt
?drawer=lead:L-001
?drawer=bien:B-204
?drawer=rapport:R-914
?drawer=signal:S-333
?drawer=zone:paris-15
?drawer=dossier:D-102
?drawer=action:A-421
?drawer=notification:N-887
?drawer=rdv:RDV-112
```

Structure du drawer (shell partagé Propsight) :

```txt
Header objet · Key info · Actions rapides · Liens inter-modules · Timeline · Bloc IA compact
```

## 3.4 Fallback zone par défaut

Ordre de résolution quand `?zone` n'est pas fourni :

```txt
1. Zone par défaut de l'utilisateur (profil compte) si définie
2. Zone la plus active des 30 derniers jours (la plus de leads / actions / RDV)
3. Première zone des "zones suivies" dans Veille
4. Pas de zone → bloc Marché affiche empty state "Configurer une zone"
```

---

# 4. Layout global

## 4.1 Structure desktop

```txt
┌────────────────────────────────────────────────────────────────────────────┐
│ Header Pro global (52px)                                                   │
├───────────────┬────────────────────────────────────────────────────────────┤
│               │ Page header : titre + filtres + [+ Action rapide]          │
│               │                                                            │
│               │ KPI strip — 5 cards business                               │
│  Sidebar Pro  │                                                            │
│  (240px)      │ ┌─────────────────────────┬──────────────────────────────┐ │
│               │ │ Mes priorités du jour   │ Alertes prioritaires         │ │
│               │ │ (45% — top 4 actions)   │ (55% — top 5 notifs)         │ │
│               │ └─────────────────────────┴──────────────────────────────┘ │
│               │                                                            │
│               │ ┌──────────────────────────────────────────────────────┐   │
│               │ │ Rapports envoyés & engagement (bloc phare)           │   │
│               │ │ Tableau dense · signal ouvertures                    │   │
│               │ └──────────────────────────────────────────────────────┘   │
│               │                                                            │
│               │ ┌──────────────────────────┬─────────────────────────────┐ │
│               │ │ Santé portefeuille       │ Pouls marché zone           │ │
│               │ │ mandats                  │ (tableau dense multi-scopes)│ │
│               │ └──────────────────────────┴─────────────────────────────┘ │
│               │                                                            │
│               │ ┌──────────────────────────────────────────────────────┐   │
│               │ │ Opportunités & signaux territoire                    │   │
│               │ └──────────────────────────────────────────────────────┘   │
└───────────────┴────────────────────────────────────────────────────────────┘
```

## 4.2 Dimensions recommandées

```txt
Header Pro         : 52px (sticky top)
Sidebar            : 240px (sticky left)
Main padding outer : 24px
Grid gap           : 16px
Card radius        : 8px
Card border        : 1px border-tertiary
KPI card height    : 116px
Panels min-height  : 260–340px
Rapports block h.  : 320–380px (selon nb lignes)
```

## 4.3 Grille CSS

### Grille principale (ligne priorités + alertes)

```css
.dashboard-row-top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.22fr);
  gap: 16px;
}
```

### Grille ligne santé + marché

```css
.dashboard-row-mid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
}
```

### KPI strip

```css
.dashboard-kpi-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}
```

## 4.4 Scroll / sticky

- page scroll vertical autorisé (environ 1.3 hauteurs d'écran) ;
- pas de scroll horizontal ;
- panels internes scrollables si contenu > hauteur panel (scroll limité au panel) ;
- header Pro global sticky ;
- sidebar sticky ;
- filtres TdB (ligne "[Période ▾] [Zone ▾] [Scope ▾] [+ Action rapide]") **non-sticky** en V1 (peu de scroll global, pas nécessaire).

---

# 5. Header de page

## 5.1 Titre

```txt
Tableau de bord
Vue d'ensemble de votre activité, opportunités et signaux importants.
```

- Titre H1 : 24px / 500, `text-primary`
- Sous-titre : 13px / 400, `text-secondary`, marge top 4px
- Marge bottom 20px

## 5.2 Barre de filtres (ligne sous titre)

Alignement : flex horizontal, gap 12px, justify between.

**Groupe gauche — filtres** :

| Élément | Type | Détail |
|---|---|---|
| Période | Dropdown | Défaut `30 jours`. Options : Aujourd'hui, 7j, 30j, Trimestre, 12 mois, Personnalisé |
| Zone | Dropdown | Défaut = zone active user (cf §3.4). Options : toutes zones user, recherche, `Gérer les zones` |
| Scope | Dropdown | **Visible uniquement si rôle ∈ [OWNER, ADMIN]**. Options : Moi (défaut), Équipe, Collaborateur spécifique |

**Groupe droite — action rapide** :

```txt
[+ Action rapide ▾]
```

Bouton primary violet Propsight, 32px de haut. Dropdown unique (pas de strip en bas de page — décision tranchée vs spec V1).

## 5.3 Bouton `+ Action rapide`

Dropdown commands, 6 actions :

| Action | Destination |
|---|---|
| Créer une estimation rapide | `/app/estimation/rapide?action=create` |
| Créer un lead | `/app/activite/leads?action=create` |
| Ajouter un bien | `/app/biens/portefeuille?action=create` |
| Lancer une analyse investissement | `/app/investissement/opportunites?action=analyse` |
| Créer une alerte | `/app/veille/alertes?action=create` |
| Créer un dossier | `/app/investissement/dossiers?action=create` |

Chaque action ouvre le flow existant du module source. Le Tableau de bord ne crée **pas** ses propres modals de création — il délègue.

---

# 6. KPI strip — 5 KPIs business

## 6.1 Règle générale

5 cards maximum, cliquables, **orientées business et pas task-list**.

Chaque card :

```txt
Label (12px text-secondary)
Valeur principale (24–28px, 500, text-primary)
Delta / contexte (11–12px, couleur sémantique)
Micro-contexte optionnel (11px, text-muted)
Badge source module (bas-droit, très discret)
```

Hover : bordure `border-secondary`, curseur pointer. Clic → route source (§6.7).

## 6.2 KPI 1 — CA réalisé mois

```json
{
  "id": "ca_realise_mois",
  "label": "CA réalisé",
  "value": "74 200 €",
  "delta": { "value": "+12%", "trend": "up", "is_positive": true },
  "context": "vs objectif : 78%",
  "source_module": "performance",
  "href": "/app/activite/performance?period=mois",
  "action_label": "Voir le reporting",
  "icon": "TrendingUp"
}
```

**Règle de calcul** (lib partagée `@/lib/performance/ca.ts`) :

```ts
sum(mandats.commission_nette where status === 'signe' and signed_at in current_period)
```

Delta : vs période précédente.
Micro-contexte : progression vs objectif mensuel (si défini dans profil user).

## 6.3 KPI 2 — Mandats signés

```json
{
  "id": "mandats_signes",
  "label": "Mandats signés",
  "value": 17,
  "delta": { "value": "+2", "trend": "up", "is_positive": true },
  "context": "dont 6 exclusifs",
  "source_module": "leads",
  "href": "/app/activite/leads?stage=mandat&period=mois",
  "action_label": "Voir les mandats",
  "icon": "FileSignature"
}
```

**Règle** :

```ts
count(mandats where signed_at in current_period)
```

Contexte : répartition simple/exclusif (important pour le business).

## 6.4 KPI 3 — CA pipe pondéré 90j

```json
{
  "id": "ca_pipe_pondere",
  "label": "CA pipe pondéré",
  "value": "286 450 €",
  "delta": { "value": "+18%", "trend": "up", "is_positive": true },
  "context": "sur 90 jours",
  "source_module": "performance",
  "href": "/app/activite/performance?view=pipe",
  "action_label": "Voir le pipe",
  "icon": "Wallet"
}
```

**Règle** (lib partagée `@/lib/performance/ca.ts`) :

```ts
sum(leads.estimated_commission * stage_probability)
where lead.expected_close_at in next_90_days
```

## 6.5 KPI 4 — Taux transformation

```json
{
  "id": "taux_transformation",
  "label": "Taux transformation",
  "value": "21%",
  "delta": { "value": "+2 pts", "trend": "up", "is_positive": true },
  "context": "lead → mandat",
  "source_module": "performance",
  "href": "/app/activite/performance?view=funnel",
  "action_label": "Voir le funnel",
  "icon": "Filter"
}
```

**Règle** (lib partagée `@/lib/performance/funnel.ts`) :

```ts
count(leads where stage >= 'mandat' and created_at in period)
/ count(leads where created_at in period)
```

## 6.6 KPI 5 — Part de marché zone

```json
{
  "id": "part_marche",
  "label": "Part de marché",
  "value": "0,87%",
  "delta": { "value": "+0,12 pt", "trend": "up", "is_positive": true },
  "context": "Paris 15e · potentiel 2,5%",
  "source_module": "performance",
  "href": "/app/activite/performance?view=marche",
  "action_label": "Voir le potentiel",
  "icon": "Target"
}
```

**Règle** (lib partagée `@/lib/performance/marche-potentiel.ts`) :

```ts
count(mes_mandats_signes_zone in period)
/ count(total_transactions_dvf_zone in period)
```

Contexte : zone courante + rappel du potentiel cible (hypothèse user).

## 6.7 Routes cibles des KPI

| KPI | Destination au clic |
|---|---|
| CA réalisé | `/app/activite/performance?period=mois` |
| Mandats signés | `/app/activite/leads?stage=mandat&period=mois` |
| CA pipe pondéré | `/app/activite/performance?view=pipe` |
| Taux transformation | `/app/activite/performance?view=funnel` |
| Part de marché | `/app/activite/performance?view=marche` |

## 6.8 Variantes scope équipe

Si `scope=equipe` (OWNER / ADMIN only), les KPIs restent business mais agrègent toute l'équipe :

```txt
CA réalisé équipe · Mandats signés équipe · CA pipe équipe ·
Taux transformation équipe · Part de marché zone équipe
```

Le contexte "vs objectif" utilise alors l'objectif organisation.

---

# 7. Bloc — Mes priorités du jour (preview Pilotage)

## 7.1 Rôle

Répond à :

> Parmi les actions à faire aujourd'hui (ou en retard), lesquelles ont le plus d'impact business ?

C'est une **preview du Pilotage**, pas un workspace. 4 lignes max, lecture + CTA. Tout travail de manipulation (checker, reporter, drag) se fait dans Pilotage.

## 7.2 Layout

```txt
┌────────────────────────────────────────────────────┐
│ Mes priorités du jour                    [4]       │
├────────────────────────────────────────────────────┤
│ 🔴 En retard 3j · Relancer M. Dupont               │
│    Mandat expire dans 12j · [Estimation] [Appeler] │
│                                                    │
│ 🟠 14h30 · RDV estimation                          │
│    45 rue Lecourbe · [Agenda] [Brief]              │
│                                                    │
│ 🟠 Aujourd'hui · Signer compromis Dossier Lyon     │
│    Projet Pinel · [Invest] [Ouvrir]                │
│                                                    │
│ 🟡 Cette semaine · Visite T3 rue Vaugirard         │
│    M. et Mme Duval · [Leads] [Préparer]            │
├────────────────────────────────────────────────────┤
│ Voir toutes les actions (14) →                     │
└────────────────────────────────────────────────────┘
```

- Titre panel : 14px / 500, marge bottom 12px
- Badge de count à droite du titre : tag gris 11px
- Lignes : 13px, hauteur ~52px, séparateur 1px `border-tertiary` entre items
- Badge urgence (émoji coloré + label) en début de ligne
- Titre ligne : 13px / 500
- Sous-titre : 12px `text-secondary`
- Badge source : tag 11px `bg-secondary`
- CTA : button ghost 12px, taille compact
- Footer link : 12px violet Propsight, hover underline

## 7.3 Fusion actions + RDV

Les RDV et actions sont fusionnés dans la même liste (un RDV à 14h30 est une priorité du jour comme une autre). Le type de l'item est indiqué par le **badge source** (`Agenda`, `Leads`, `Estimation`, `Invest`, `Pilotage`, etc.) pas par une séparation visuelle.

## 7.4 Types TS

```ts
type PriorityItemType =
  | 'lead_a_traiter'
  | 'action_en_retard'
  | 'rapport_ouvert_sans_relance'
  | 'rdv_du_jour'
  | 'rdv_a_preparer'
  | 'signature_imminente'
  | 'signal_prospection_chaud'
  | 'bien_suivi_mouvement'
  | 'opportunite_invest'
  | 'dossier_ouvert'
  | 'estimation_faible_confiance'

type UrgencyLevel =
  | 'en_retard'      // rouge
  | 'aujourdhui'     // orange
  | 'cette_semaine'  // jaune
  | 'a_surveiller'   // gris

type DashboardPriorityItem = {
  id: string
  rank: number
  type: PriorityItemType
  urgency: UrgencyLevel
  urgency_label: string           // ex: "En retard 3j" ou "14h30"
  title: string                   // ex: "Relancer M. Dupont"
  subtitle: string                // ex: "Mandat expire dans 12j"
  source_module: SourceModule
  source_label: string            // badge affiché, ex: "Estimation"
  linked_object_type: PropsightObjectType
  linked_object_id: string
  priority_score: number
  cta_primary: {
    label: string                 // ex: "Relancer"
    action: 'open_drawer' | 'open_route' | 'open_modal'
    href?: string
    drawer_ref?: string
  }
  cta_secondary?: {
    label: string
    action: string
    href?: string
  }
  created_at: string
  updated_at: string
}
```

## 7.5 Ranking score

```ts
priority_score =
    urgency_score        * 0.40  // poids dominant : on veut le chaud
  + business_impact_score * 0.35
  + freshness_score      * 0.15
  + confidence_score     * 0.10
```

**urgency_score** :

| Cas | Score |
|---|---:|
| En retard > 72h | 100 |
| En retard 24–72h | 90 |
| En retard < 24h | 80 |
| Aujourd'hui (datation horaire) | 75 |
| Demain | 45 |
| Cette semaine | 25 |
| Plus tard / pas daté | 10 |

**business_impact_score** :

| Cas | Score |
|---|---:|
| Signature compromis imminente | 100 |
| Rapport ouvert sans relance > 48h | 95 |
| Lead vendeur widget non assigné | 90 |
| RDV estimation / vendeur du jour | 88 |
| Mandat expirant < 15j | 85 |
| Opportunité invest score > 80 | 80 |
| Bien suivi baisse prix > 3% | 75 |
| Signal DPE business | 70 |
| Visite acheteur | 60 |
| Relance classique | 45 |

**freshness_score** (délai depuis apparition de la priorité) :

| Cas | Score |
|---|---:|
| < 1h | 100 |
| < 24h | 80 |
| < 3j | 60 |
| < 7j | 35 |
| > 7j | 10 |

**confidence_score** (fiabilité de la détection) :

| Cas | Score |
|---|---:|
| Action explicite créée par user | 100 |
| RDV en calendrier | 100 |
| Signal détecté heuristique déterministe (ex: mandat < 15j) | 85 |
| Signal ML score > 80 | 75 |
| Signal ML score 50–80 | 50 |
| Signal ML score < 50 | ❌ exclu du ranking |

Seuil de confidence minimal : 50. En dessous, l'item n'apparaît **pas** dans les priorités du dashboard (il reste dans le module source pour consultation).

## 7.6 CTAs par type

| Type | CTA principal | CTA secondaire |
|---|---|---|
| lead_a_traiter | Ouvrir | Assigner |
| action_en_retard | Terminer | Reporter |
| rapport_ouvert_sans_relance | Relancer | Ouvrir rapport |
| rdv_du_jour | Brief | Ouvrir lead |
| rdv_a_preparer | Préparer | Ouvrir lead |
| signature_imminente | Ouvrir dossier | — |
| signal_prospection_chaud | Créer lead | Ignorer |
| bien_suivi_mouvement | Analyser | Créer alerte |
| opportunite_invest | Analyser | Comparer |
| dossier_ouvert | Ouvrir | Relancer |
| estimation_faible_confiance | Vérifier | Voir comparables |

## 7.7 Menu kebab (3 dots par ligne)

```txt
Ouvrir la source
Reporter à demain
Reporter à la semaine prochaine
Ignorer aujourd'hui
Copier le lien
```

Les actions "Reporter" et "Ignorer" déclenchent des mutations côté module source (action dans Pilotage, pas stockage local TdB) pour rester cohérent avec le principe "preview, pas duplication".

## 7.8 Footer `Voir toutes les actions (N) →`

- Texte lien 12px, violet Propsight
- Route destination : `/app/activite/pilotage`
- Le count `N` = nombre total d'items priorités **au-delà** des 4 affichées, calculé côté API

## 7.9 Empty state

Si aucune priorité :

```txt
🎉  Tout est à jour.
    Aucune action urgente ni RDV aujourd'hui.

    [Voir mon pipeline →]  [Créer un lead]
```

---

# 8. Bloc — Alertes prioritaires (preview Veille)

## 8.1 Rôle

Répond à :

> Qu'est-ce qui a changé sur mon marché, mes biens suivis, mes zones, et mérite mon attention ?

C'est une **preview de Veille Notifications**, rankée par **impact business** (pas chronologique comme Yanport). 5 lignes max, lecture + CTA.

## 8.2 Layout

```txt
┌──────────────────────────────────────────────────────────────┐
│ Alertes prioritaires                                [5]      │
├──────────────────────────────────────────────────────────────┤
│ 📉  Baisse -4,2% sur bien suivi                              │
│     Appartement · 75015 Paris · il y a 2h                    │
│     [Veille]                              [Analyser]         │
│                                                              │
│ 🏠  3 nouveaux mandats agence concurrente                    │
│     Paris 15e · Century 21 · ce mois                         │
│     [Veille]                              [Voir]             │
│                                                              │
│ 📄  Avis de valeur rouvert 3 fois                            │
│     M. Prévost · Dernier accès hier 18h                      │
│     [Estimation]                          [Relancer]         │
│                                                              │
│ 🎯  Signal DPE · 2 lots concernés                            │
│     8 rue Blomet · DPE F détecté                             │
│     [Prospection]                         [Créer lead]       │
│                                                              │
│ 📊  Prix médian 75015 +1,2% ce mois                          │
│     Observatoire · 842 DVF                                   │
│     [Observatoire]                        [Voir]             │
├──────────────────────────────────────────────────────────────┤
│ Voir toutes les notifications (47) →                         │
└──────────────────────────────────────────────────────────────┘
```

## 8.3 Tri par impact (pas chrono)

C'est la différence majeure avec Yanport qui trie par "depuis 24h". Ici, on range par `impact_score` :

```ts
impact_score =
    business_impact_score * 0.50  // l'info business prime
  + freshness_score       * 0.25
  + relevance_score       * 0.25  // pertinence contextuelle user
```

**business_impact_score** (pour alertes) :

| Cas | Score |
|---|---:|
| Bien suivi baisse prix > 5% | 100 |
| Rapport rouvert client (ouvertures répétées) | 95 |
| Nouveau mandat concurrent zone user | 90 |
| Signal DPE / DVF haute qualité | 85 |
| Baisse prix 2–5% bien suivi | 80 |
| Nouveau bien annonce zone | 60 |
| Signal marché macro (prix médian, volume) | 50 |
| Notification compte / admin | 20 |

**relevance_score** (contexte utilisateur) :

| Cas | Score |
|---|---:|
| Concerne un bien du portefeuille user | 100 |
| Concerne un bien suivi user | 95 |
| Concerne une zone suivie user | 85 |
| Concerne une alerte user active | 80 |
| Concerne une zone "active" user (activité récente) | 60 |
| Notif générique | 30 |

## 8.4 Types TS

```ts
type AlertItemType =
  | 'bien_suivi_baisse_prix'
  | 'bien_suivi_retrait_annonce'
  | 'bien_suivi_prix_ajuste'
  | 'agence_concurrente_mandat'
  | 'rapport_rouvert_multiple'
  | 'signal_dpe'
  | 'signal_dvf'
  | 'signal_mandat_expire'
  | 'marche_zone_variation'
  | 'nouvelle_annonce_zone'
  | 'alerte_user_triggered'
  | 'systeme'

type DashboardAlertItem = {
  id: string
  rank: number
  type: AlertItemType
  icon: string                    // lucide name
  title: string
  subtitle: string
  source_module: SourceModule
  source_label: string
  linked_object_type?: PropsightObjectType
  linked_object_id?: string
  zone_label?: string
  occurred_at: string
  impact_score: number
  cta_primary: {
    label: string
    action: 'open_drawer' | 'open_route' | 'open_modal'
    href?: string
    drawer_ref?: string
  }
  is_unread: boolean
}
```

## 8.5 CTAs par type

| Type | CTA principal |
|---|---|
| bien_suivi_baisse_prix | Analyser |
| bien_suivi_retrait_annonce | Voir |
| bien_suivi_prix_ajuste | Ouvrir |
| agence_concurrente_mandat | Voir |
| rapport_rouvert_multiple | Relancer |
| signal_dpe | Créer lead |
| signal_dvf | Créer lead |
| signal_mandat_expire | Contacter |
| marche_zone_variation | Voir |
| nouvelle_annonce_zone | Voir |
| alerte_user_triggered | Ouvrir |

## 8.6 Footer `Voir toutes les notifications (N) →`

- Route destination : `/app/veille/notifications`
- Count `N` = nombre total de notifs non-lues

## 8.7 Empty state

```txt
🔔  Rien à signaler.
    Aucune alerte prioritaire pour le moment.

    [Gérer mes alertes →]
```

---

# 9. Bloc phare — Rapports envoyés & engagement

## 9.1 Rôle (différenciant unique)

Répond à la frustration métier #1 de l'agent :

> J'ai envoyé 23 avis de valeur ce mois. Combien ont été rouverts ? Lesquels je dois relancer ?

**Aucun CRM immo FR ne propose cette vue** en 2026. C'est le bloc qui justifie l'abonnement à lui seul.

## 9.2 Logique métier

Un rapport envoyé = du travail investi non rémunéré. Son rebond en mandat = le cœur de la commission. Le bloc affiche pour chaque rapport **envoyé dans les 90 derniers jours** :

- type (avis valeur / étude locative / dossier invest)
- client
- date envoi + délai depuis
- **signal d'engagement** : nb ouvertures + date dernier accès
- statut relance (jamais, en cours, signée, abandonnée)
- CTA contextuel

Sources : les 3 types de rapports Propsight :

```txt
Avis de valeur       (Estimation > Avis de valeur)
Étude locative       (Estimation > Étude locative)
Dossier investissement (Investissement > Dossiers)
```

## 9.3 Layout

Tableau dense, colonnes compactes, hauteur bloc ~360px (max 8 lignes visibles, scroll interne au-delà).

```txt
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Rapports envoyés & engagement                        90 derniers jours    [23]  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Client          Type            Envoyé   Ouvertures   Dernier accès   Action    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Mme Martin      Avis valeur     il y 5j  ●●● 3 fois   hier 18h       Relancer   │
│ M. Prévost      Avis valeur     il y 12j ●●●● 5 fois  il y 2h        Appeler    │
│ Durand SAS      Étude locative  il y 3j  ●● 2 fois    hier 14h       Relancer   │
│ M. Lefebvre     Avis valeur     il y 8j  ● 1 fois     il y 6j        Relancer   │
│ Projet Lyon     Dossier invest  il y 2j  ●●●● 4 fois  il y 3h        Appeler    │
│ Mme Bernard     Avis valeur     il y 14j — pas ouvert                Renvoyer   │
│ M. Rousseau     Avis valeur     il y 22j ●● 2 fois    il y 8j        Archiver   │
│ …                                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Voir tous les rapports →                         Trier par : Engagement ▾       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Colonnes** :

| Colonne | Largeur | Contenu |
|---|---|---|
| Client | 22% | Nom client · clic → drawer lead |
| Type | 16% | Tag type rapport (couleur distincte par type) |
| Envoyé | 12% | Délai relatif ("il y a 5j") |
| Ouvertures | 16% | Visualisation dots + count ("●●● 3 fois") |
| Dernier accès | 16% | Datation relative ("hier 18h") ou "pas ouvert" |
| Action | 18% | CTA unique contextuel |

## 9.4 Signal d'engagement — visualisation

**Dots d'ouverture** : visualisation rapide nb ouvertures.

```txt
— pas ouvert
● 1 fois        (gris)
●● 2 fois       (gris)
●●● 3 fois      (orange — chaud)
●●●● 4+ fois    (rouge — très chaud)
```

**Couleur ligne selon engagement** :

| État | Style ligne |
|---|---|
| Ouvert < 24h + ≥ 3 ouvertures | Background très léger rouge/orange (chaud) |
| Ouvert récemment | Ligne normale |
| Envoyé > 7j, jamais ouvert | Texte légèrement grisé |
| Envoyé > 30j | Texte gris muted (candidat archivage) |

## 9.5 Tri par défaut

`priority_engagement_score` décroissant :

```ts
priority_engagement_score =
    recency_last_open_score    * 0.40
  + opens_count_score          * 0.30
  + time_since_last_relance    * 0.20
  + rapport_value_score        * 0.10
```

Options tri utilisateur (dropdown "Trier par ▾") :

```txt
Engagement (défaut)
Date envoi (récent d'abord)
Ouvertures (plus au moins)
Relance nécessaire
Type de rapport
```

## 9.6 Types TS

```ts
type RapportType = 'avis_valeur' | 'etude_locative' | 'dossier_invest'

type RapportEngagementState =
  | 'non_ouvert'         // pas ouvert depuis envoi
  | 'ouvert_passif'      // ouvert 1-2 fois, pas récent
  | 'chaud'              // ouvert récemment + plusieurs fois
  | 'tres_chaud'         // ouvert 4+ fois récemment
  | 'signe'              // a débouché sur mandat/dossier signé
  | 'abandonne'          // > 30j, pas d'engagement

type DashboardRapportItem = {
  id: string
  rapport_id: string
  type: RapportType
  type_label: string                // "Avis de valeur"
  client: {
    name: string
    linked_lead_id: string
  }
  sent_at: string
  sent_label: string                // "il y a 5j"
  opens_count: number
  last_opened_at: string | null
  last_opened_label: string | null  // "hier 18h" ou null
  engagement_state: RapportEngagementState
  relance_status: 'jamais' | 'en_cours' | 'signee' | 'abandonnee'
  priority_engagement_score: number
  bien_linked_id?: string
  cta_primary: {
    label: 'Relancer' | 'Appeler' | 'Renvoyer' | 'Archiver' | 'Ouvrir'
    action: string
    href?: string
    drawer_ref?: string
  }
}
```

## 9.7 CTAs selon engagement state

| État | CTA primaire |
|---|---|
| non_ouvert + > 10j | Renvoyer |
| non_ouvert + > 30j | Archiver |
| ouvert_passif | Relancer |
| chaud | Relancer |
| tres_chaud | Appeler *(priorité haute)* |
| signe | Ouvrir |
| abandonne | Archiver |

Le CTA "Appeler" ouvre un drawer action `type=appel` prérempli avec le contexte (lead, bien, rapport).

## 9.8 Interactions

- **Clic ligne** → drawer contextuel rapport (pas de navigation full page)
- **Clic colonne Client** → drawer lead
- **Clic CTA** → action directe ou drawer selon type
- **Clic colonne Type** → filtre (futur V2)
- **Hover dots ouvertures** → tooltip avec détail (`"3 ouvertures : 22 mai 18h, 24 mai 09h, 26 mai 18h"`)

## 9.9 Empty state

Si aucun rapport envoyé sur la période :

```txt
📄  Aucun rapport envoyé sur 90 jours.
    Produisez un avis de valeur ou une étude locative pour activer le suivi d'engagement.

    [Créer un avis de valeur]  [Créer une étude locative]
```

## 9.10 Footer

```txt
Voir tous les rapports →
```

Route : `/app/estimation/avis-de-valeur` (avec preset "envoyés récents" en V2).

---

# 10. Bloc — Santé portefeuille mandats

## 10.1 Rôle (défensif)

Répond à :

> Quels mandats sont en train de mourir sans que je m'en rende compte ?

C'est le bloc **défensif** du dashboard. Pas de nouveautés business, mais du sauvetage d'existant (où le ROI court terme est le plus élevé).

## 10.2 Layout

```txt
┌───────────────────────────────────────────────────────┐
│ Santé portefeuille mandats                  [12]      │
├───────────────────────────────────────────────────────┤
│ 🔴  Mandats expirant < 15j                        3   │
│     Rue Lecourbe · Rue Convention · Bd Lefebvre       │
│                                    [Voir tous]        │
│                                                       │
│ 🟠  Mandats sans mouvement > 60j                  5   │
│     Dont 2 sans visite                                │
│                                    [Voir tous]        │
│                                                       │
│ 🟡  Overpricing vs marché                         2   │
│     +8% et +12% vs prix médian zone                   │
│                                    [Voir détails]     │
│                                                       │
│ 🔵  Mandats simples à convertir                   2   │
│     Candidats exclusivité                             │
│                                    [Stratégie]        │
├───────────────────────────────────────────────────────┤
│ Voir le portefeuille complet →                        │
└───────────────────────────────────────────────────────┘
```

Format lignes agrégées (pas de liste item par item, le détail est dans le module source). Chaque ligne = 1 catégorie de risque + count + extrait + CTA.

## 10.3 Catégories de santé

```ts
type PortfolioHealthCategory =
  | 'expirant_court_terme'       // mandat expirant < 15j
  | 'expirant_moyen_terme'       // mandat expirant 15-30j
  | 'sans_mouvement_long'        // > 60j sans action / visite
  | 'overpricing'                // prix > médian zone + X%
  | 'mandat_simple_candidat_exclusif'
  | 'annonce_ancienne'           // > 90j online sans baisse
  | 'baisse_prix_recommandee'    // recommandation AVM
```

## 10.4 Règles de détection

```ts
// expirant_court_terme
mandat.status === 'actif' && mandat.expires_at within 15 days

// sans_mouvement_long
mandat.status === 'actif'
  && no action logged in 60 days
  && no visite logged in 60 days

// overpricing
bien.annonce.prix > zone.avm_median * 1.07
  && bien.annonce.days_online > 30

// mandat_simple_candidat_exclusif
mandat.type === 'simple'
  && mandat.duration > 30 days
  && bien.visit_count >= 3
  && bien.offer_count === 0

// annonce_ancienne
annonce.days_online > 90 && no price_change in last 30 days
```

## 10.5 Types TS

```ts
type DashboardPortfolioHealthCategory = {
  id: PortfolioHealthCategory
  severity: 'critical' | 'warning' | 'info' | 'opportunity'
  icon: string
  label: string
  count: number
  excerpt: string                 // ex: "Rue Lecourbe · Rue Convention..."
  linked_bien_ids: string[]
  cta: {
    label: string                 // ex: "Voir tous"
    action: string
    href: string                  // ex: "/app/biens/portefeuille?filter=expirant-15j"
  }
}

type DashboardPortfolioHealth = {
  total_mandats_actifs: number
  health_categories: DashboardPortfolioHealthCategory[]
  health_score: number            // 0-100, agrégé
  trend_30d: 'improving' | 'stable' | 'degrading'
}
```

## 10.6 Health score agrégé (optionnel UI V1)

Visualisation micro en haut-droit du bloc : jauge circulaire 0-100, code couleur vert/orange/rouge.

```ts
health_score =
  100
  - (count(expirant_court_terme) / total_mandats_actifs) * 100 * 0.40
  - (count(sans_mouvement_long) / total_mandats_actifs) * 100 * 0.25
  - (count(overpricing) / total_mandats_actifs) * 100 * 0.25
  - (count(annonce_ancienne) / total_mandats_actifs) * 100 * 0.10
clamped to [0, 100]
```

## 10.7 Footer

```txt
Voir le portefeuille complet →
```

Route : `/app/biens/portefeuille`.

## 10.8 Empty state

```txt
Aucun mandat actif dans votre portefeuille.
[Ajouter un bien →]
```

---

# 11. Bloc — Pouls marché zone

## 11.1 Rôle

Répond à :

> Que s'est-il passé sur mon territoire cette semaine / ce mois ?

Inspiration : bandeau haut Yanport (Mes biens / Biens suivis / Particuliers / Professionnels × Nouveaux / Baisses / Expirés). **Reformaté en tableau dense** (10× plus compact), **enrichi DVF** (ventes réelles, que Yanport n'a pas), et **chaque cellule cliquable** vers le module source filtré.

## 11.2 Layout

```txt
┌──────────────────────────────────────────────────────────────────┐
│ Pouls marché — Paris 15e                      30 derniers jours  │
├──────────────────────────────────────────────────────────────────┤
│                         Nouveaux  Baisses prix  Expirés  Vendus  │
│ Mon portefeuille             3         1           0      —      │
│ Biens suivis                 8         4           2      —      │
│ Annonces particuliers       42        18          31      —      │
│ Annonces agences           287       126         198      —      │
│ DVF (ventes réelles)         —         —           —     92      │
├──────────────────────────────────────────────────────────────────┤
│ Synthèse                                                         │
│ Prix médian  9 420 €/m²  ·  Évolution 12m  +2,8%  ·  Tension Forte│
│                                                                  │
│ Ouvrir Observatoire →    Créer alerte zone    Voir DVF            │
└──────────────────────────────────────────────────────────────────┘
```

**Largeurs colonnes** :

| Colonne | Largeur |
|---|---:|
| Scope (label ligne) | 36% |
| Nouveaux | 16% |
| Baisses prix | 16% |
| Expirés | 16% |
| Vendus | 16% |

## 11.3 Scopes des lignes

5 scopes fixes :

```txt
Mon portefeuille          → /app/biens/portefeuille
Biens suivis              → /app/veille/biens-suivis
Annonces particuliers     → /app/biens/annonces?source=particulier
Annonces agences          → /app/biens/annonces?source=agence
DVF (ventes réelles)      → /app/biens/vendus (ex-DVF Pro)
```

## 11.4 Interactions cellules

Chaque cellule non-nulle = lien vers le module source filtré :

```txt
Cellule "Biens suivis · Baisses prix : 4"
→ /app/veille/biens-suivis?filter=baisse-prix&period=30j

Cellule "DVF · Vendus : 92"
→ /app/biens/vendus?zone=paris-15&period=30j

Cellule "Annonces agences · Nouveaux : 287"
→ /app/biens/annonces?source=agence&filter=nouveau&zone=paris-15&period=30j
```

Hover cellule : background `bg-secondary`, curseur pointer.

## 11.5 Synthèse bas (1 ligne)

Données Observatoire synthétisées :

```ts
{
  prix_median_m2: 9420,
  evolution_12m_pct: 2.8,
  tension: 'Forte',
  volume_dvf_12m: 842,
  confidence: 'forte'
}
```

Affichage 1 ligne : `Prix médian X €/m²  ·  Évolution 12m ±Y%  ·  Tension Z`

## 11.6 Actions footer

```txt
Ouvrir Observatoire  → /app/observatoire/marche?zone=paris-15
Créer alerte zone    → /app/veille/alertes?action=create&zone=paris-15
Voir DVF             → /app/biens/vendus?zone=paris-15
```

## 11.7 Types TS

```ts
type PulseScope =
  | 'mon_portefeuille'
  | 'biens_suivis'
  | 'annonces_particuliers'
  | 'annonces_agences'
  | 'dvf_vendus'

type PulseIndicator = 'nouveaux' | 'baisses_prix' | 'expires' | 'vendus'

type DashboardPulseCell = {
  scope: PulseScope
  indicator: PulseIndicator
  value: number | null              // null si non-applicable (ex: DVF × Nouveaux)
  delta_vs_previous?: {
    value: string
    trend: 'up' | 'down' | 'neutral'
  }
  href: string                      // route source filtrée
}

type DashboardPulseMarket = {
  zone_id: string
  zone_label: string
  period: '7j' | '30j' | 'trim' | '12m'
  cells: DashboardPulseCell[]
  synthese: {
    prix_median_m2: number
    evolution_12m_pct: number
    tension: 'Faible' | 'Équilibrée' | 'Forte' | 'Très forte'
    volume_dvf_12m: number
    confidence: 'faible' | 'moyenne' | 'forte'
  }
  sparkline?: { month: string; value: number }[]
}
```

## 11.8 Empty state

Si zone non configurée :

```txt
🗺️  Aucune zone configurée.
     Sélectionnez une zone pour afficher son pouls marché.

     [Choisir une zone →]
```

---

# 12. Bloc — Opportunités & signaux territoire

## 12.1 Rôle

Répond à :

> Qu'est-ce qui mérite que j'aille analyser maintenant ?

Bloc **offensif** : montre les biens / signaux / opportunités qui peuvent devenir des mandats ou des leads.

## 12.2 Layout

Grille 2 colonnes, 3 items max par colonne.

```txt
┌─────────────────────────────────────────────────────────────────────┐
│ Opportunités & signaux territoire                                    │
├──────────────────────────────────┬──────────────────────────────────┤
│ TOP 3 OPPORTUNITÉS               │ TOP 3 SIGNAUX RADAR              │
│                                  │                                  │
│ T2 Paris 15e                     │ Mandat expire 15 rue Péclet      │
│ Score 84/100 · Rdt 4,8%          │ Confiance élevée · 19j           │
│ [Invest]       [Analyser]        │ [Prospection]    [Contacter]     │
│                                  │                                  │
│ Maison Boulogne                  │ Propriétaire âgé + 2 héritiers   │
│ Baisse -3,8% · Bien suivi        │ 12 rue Blomet · DPE F            │
│ [Veille]       [Ouvrir]          │ [Prospection]    [Créer lead]    │
│                                  │                                  │
│ Studio 75015                     │ Hausse prix médian +1,5%         │
│ Rendement net-net 5,2%           │ 75015 · 30 derniers jours        │
│ [Invest]       [Analyser]        │ [Observatoire]   [Voir]          │
└──────────────────────────────────┴──────────────────────────────────┘
```

## 12.3 Colonne gauche — Top 3 opportunités

Sources (ordre priorité) :

```txt
1. Investissement > Opportunités (score > 80)
2. Veille > Biens suivis avec mouvement prix notable
3. Biens > Annonces avec score d'opportunité (ex: T2 bien placé)
```

## 12.4 Colonne droite — Top 3 signaux Radar

Sources :

```txt
1. Prospection > Radar signaux score > 80
2. Prospection > Signaux DVF / DPE validés
3. Observatoire > Variations marché notables
```

## 12.5 Types TS

```ts
type TerritoryItemType =
  | 'opportunite_invest'
  | 'bien_suivi_mouvement'
  | 'annonce_opportunite'
  | 'signal_radar'
  | 'signal_dvf'
  | 'signal_dpe'
  | 'signal_marche'

type DashboardTerritoryItem = {
  id: string
  side: 'opportunites' | 'signaux'
  rank: number
  type: TerritoryItemType
  title: string
  subtitle: string
  score?: number
  metric_label?: string           // ex: "Rendement 4,8%" ou "DPE F"
  badge: {
    label: string                 // "Invest", "Veille", "Prospection"
    tone: 'violet' | 'blue' | 'green' | 'amber' | 'red' | 'gray'
  }
  source_module: SourceModule
  linked_object_type: PropsightObjectType
  linked_object_id: string
  cta_primary: {
    label: 'Analyser' | 'Ouvrir' | 'Contacter' | 'Créer lead' | 'Comparer' | 'Voir'
    action: string
    href?: string
    drawer_ref?: string
  }
}
```

## 12.6 Ranking

Opportunités : score produit × score rendement (déjà calculé côté module Investissement).
Signaux : `signal_score` (déjà calculé côté Prospection).

Le dashboard **ne recalcule pas** ces scores. Il consomme des endpoints pré-rankés.

## 12.7 Footer

2 liens discrets en bas du bloc :

```txt
Voir toutes les opportunités →   Voir le Radar →
```

Routes : `/app/investissement/opportunites` et `/app/prospection/radar`.

## 12.8 Empty state

```txt
Aucune opportunité détectée sur votre périmètre.
Élargissez vos zones ou activez des alertes pour recevoir des signaux.

[Ajouter une zone →]
```

---

# 13. Variantes persona

## 13.1 Agent immobilier (défaut)

Structure complète telle que décrite §4 à §12. Tous les blocs visibles.

KPIs strip :

```txt
CA réalisé mois · Mandats signés · CA pipe pondéré 90j · Taux transformation · Part de marché zone
```

## 13.2 Manager / Admin / Owner (scope équipe)

**Structure identique**, mais déclenchement `scope=equipe` depuis le header (dropdown Scope).

### 13.2.1 KPIs strip équipe

```txt
CA réalisé équipe (mois)
Mandats signés équipe
CA pipe équipe (90j)
Taux transformation équipe
Part de marché zone équipe
```

### 13.2.2 Priorités du jour (scope équipe)

Remontent :

```txt
- Leads widget non assignés
- Rapports envoyés par l'équipe rouverts sans relance
- Actions équipe en retard > 72h
- RDV du jour non-briefés
- Mandats expirants équipe < 15j
```

Wording à respecter :

```txt
Préférer : Relance utile · Charge élevée · Objet à débloquer · Coaching recommandé
Éviter   : mauvais agent · sous-performance · surveillance
```

### 13.2.3 Alertes prioritaires (scope équipe)

Remontent en plus des notifs agent :

```txt
- Agents en charge élevée (> N leads actifs / M dossiers)
- Zones sous-exploitées (leads entrants < seuil)
- Collaborateurs inactifs > 48h (sauf congés marqués)
```

### 13.2.4 Bloc Rapports envoyés (scope équipe)

Colonne supplémentaire `Agent` insérée entre `Client` et `Type`. Permet de voir en 1 coup d'œil quels rapports de quels agents sont chauds.

### 13.2.5 Bloc Santé portefeuille (scope équipe)

Agrège sur tout le portefeuille organisation. Catégorie additionnelle :

```txt
🔵 Déséquilibre charge portefeuille
   Sophie: 38 mandats · Marc: 12 mandats
   [Rééquilibrer]
```

### 13.2.6 Bloc Opportunités territoire (scope équipe)

Identique, mais avec badge `Agent en charge` sur chaque item si déjà assigné.

### 13.2.7 Pas de Kanban équipe

**Règle absolue** : le TdB équipe n'affiche **jamais** un Kanban Leads équipe. Pour ça, le manager va dans `/app/equipe/activite` ou `/app/activite/leads?assigne=equipe`.

## 13.3 Investisseur

### 13.3.1 KPIs strip investisseur

```txt
Valeur portefeuille estimée
Cash-flow projeté mensuel
Opportunités à analyser
Alertes prix actives
Dossiers ouverts
```

### 13.3.2 Blocs adaptés

| Bloc agent | Bloc investisseur |
|---|---|
| Mes priorités du jour | Mes projets en cours |
| Alertes prioritaires | Alertes prix / rendement |
| Rapports envoyés & engagement | Dossiers investissement ouverts (engagement clients) |
| Santé portefeuille mandats | Santé portefeuille biens (cash-flow, travaux, locataires) |
| Pouls marché zone | Pouls zones cibles (multi-zones) |
| Opportunités & signaux | Opportunités & comparatifs |

### 13.3.3 Labels à ajuster

```txt
Leads            → Contacts / Projets
Mandats          → masqué
CA pipe          → Valeur portefeuille / cash-flow projeté
Part de marché   → Rendement moyen portefeuille
```

### 13.3.4 Bloc "Échéances financement / fiscalité" (spécifique investisseur)

Remplace "Mes priorités du jour" pour persona investisseur. Affiche :

```txt
- Échéances prêts (mensualités à venir, avec montant)
- Échéances fiscales (taxe foncière, IRPP revenus fonciers, CFE)
- Renouvellements assurances
- Fins de baux à venir < 60j
- Révisions de loyer à appliquer
```

## 13.4 Hybrid (agent + investisseur dual)

Header affiche un switch supplémentaire à côté du filtre scope :

```txt
Mode : [Agent ▾] / [Investisseur]
```

Ne change pas les objets (mêmes données sous-jacentes), change les labels, KPIs, blocs affichés.

La persistance du choix se fait :

```txt
- session-level : query param ?persona=investor
- compte-level : colonne users.preferred_dashboard_persona
```

## 13.5 VIEWER (lecture seule)

Tous les CTAs mutation sont désactivés :

```txt
Boutons primary grisés (style disabled, curseur not-allowed)
Menus kebab masqués
Dropdowns de tri gardés (lecture seule)
Liens de navigation vers modules sources : gardés
```

Le VIEWER voit donc les KPIs, les lignes priorités / alertes / rapports, mais ne peut ni relancer, ni assigner, ni créer. Il peut naviguer vers les modules sources (où ses permissions s'appliquent).

---

# 14. Ranking algorithms (synthèse)

Chaque bloc a son algorithme de ranking, qui vit dans `/src/lib/dashboard/ranking.ts`.

## 14.1 Priorités du jour

```ts
priority_score =
    urgency_score          * 0.40
  + business_impact_score  * 0.35
  + freshness_score        * 0.15
  + confidence_score       * 0.10
```

Filtre `confidence_score >= 50` en amont.

Détail des sous-scores : §7.5.

## 14.2 Alertes prioritaires

```ts
impact_score =
    business_impact_score  * 0.50
  + freshness_score        * 0.25
  + relevance_score        * 0.25
```

Détail des sous-scores : §8.3.

## 14.3 Rapports envoyés engagement

```ts
priority_engagement_score =
    recency_last_open_score    * 0.40
  + opens_count_score          * 0.30
  + time_since_last_relance    * 0.20
  + rapport_value_score        * 0.10
```

**recency_last_open_score** :

| Dernier accès | Score |
|---|---:|
| < 6h | 100 |
| 6h–24h | 90 |
| 24h–3j | 70 |
| 3–7j | 40 |
| > 7j | 20 |
| Jamais ouvert | 10 |

**opens_count_score** :

| Ouvertures | Score |
|---|---:|
| 0 | 0 |
| 1 | 30 |
| 2 | 55 |
| 3 | 75 |
| 4+ | 100 |

**time_since_last_relance** :

| Dernière relance | Score |
|---|---:|
| Jamais | 80 |
| > 14j | 70 |
| 7-14j | 40 |
| 3-7j | 20 |
| < 3j | 5 |

**rapport_value_score** :

| Type rapport | Score |
|---|---:|
| Dossier invest | 100 |
| Avis valeur vendeur | 90 |
| Étude locative | 70 |

## 14.4 Dédoublonnage cross-module

**Problème** : un même bien peut apparaître dans plusieurs blocs (opportunité Invest + bien suivi Veille + mandat expirant portefeuille).

**Règle** :

```ts
// Par bloc, dédoublonner par linked_object_id, garder max(priority_score)
function deduplicateInBlock<T extends { linked_object_id?: string, priority_score: number }>(
  items: T[]
): T[] {
  const map = new Map<string, T>()
  for (const item of items) {
    const key = item.linked_object_id ?? crypto.randomUUID()
    const existing = map.get(key)
    if (!existing || item.priority_score > existing.priority_score) {
      map.set(key, item)
    }
  }
  return Array.from(map.values())
}
```

**Règle cross-blocs** : un objet **peut** apparaître dans plusieurs blocs différents (ex: même bien dans "Priorités" + "Santé portefeuille") si le contexte business diffère. La dédup est intra-bloc uniquement.

---

# 15. Data model global

## 15.1 Types communs

```ts
export type SourceModule =
  | 'leads'
  | 'pilotage'
  | 'biens'
  | 'prospection'
  | 'estimation'
  | 'investissement'
  | 'observatoire'
  | 'veille'
  | 'equipe'
  | 'widget'
  | 'agenda'
  | 'performance'

export type PropsightObjectType =
  | 'lead'
  | 'action'
  | 'bien'
  | 'annonce'
  | 'vente_dvf'
  | 'estimation'
  | 'rapport'
  | 'opportunite'
  | 'dossier'
  | 'alerte'
  | 'notification'
  | 'bien_suivi'
  | 'zone'
  | 'collaborateur'
  | 'rdv'
  | 'mandat'

export type DashboardScope = 'me' | 'equipe'
export type DashboardPersona = 'agent' | 'investor' | 'hybrid'
export type DashboardPeriod = '7j' | '30j' | 'trim' | '12m' | 'custom'
```

## 15.2 DashboardSummary (endpoint principal)

```ts
export type DashboardSummary = {
  meta: {
    user_id: string
    organization_id: string
    persona: DashboardPersona
    scope: DashboardScope
    period: DashboardPeriod
    zone_id: string | null
    zone_label: string | null
    generated_at: string
  }

  kpis: DashboardKpi[]                         // §6
  priorities: DashboardPriorityItem[]          // §7
  alerts: DashboardAlertItem[]                 // §8
  rapports: DashboardRapportItem[]             // §9
  portfolio_health: DashboardPortfolioHealth   // §10
  pulse_market: DashboardPulseMarket | null    // §11 (null si pas de zone)
  territory: DashboardTerritoryItem[]          // §12

  counts: {                                     // pour les footers "Voir tout (N)"
    total_priorities: number
    total_alerts_unread: number
    total_rapports_90j: number
    total_opportunities: number
  }

  quick_actions: DashboardQuickAction[]        // §5.3 (dropdown + Action rapide)
}
```

## 15.3 DashboardKpi

```ts
export type DashboardKpi = {
  id: string
  label: string
  value: string | number
  context?: string
  delta?: {
    value: string
    trend: 'up' | 'down' | 'neutral'
    is_positive: boolean
  }
  icon: string
  source_module: SourceModule
  href: string
  action_label: string
}
```

## 15.4 DashboardQuickAction

```ts
export type DashboardQuickAction = {
  id: string
  label: string
  subtitle?: string
  icon: string
  href: string
  source_module: SourceModule
}
```

## 15.5 Récapitulatif des types de blocs

Voir §7.4 (DashboardPriorityItem), §8.4 (DashboardAlertItem), §9.6 (DashboardRapportItem), §10.5 (DashboardPortfolioHealth), §11.7 (DashboardPulseMarket), §12.5 (DashboardTerritoryItem).

Tous les types sont exportés depuis `/src/lib/dashboard/types.ts`.

---

# 16. API / endpoints V1

## 16.1 Endpoint principal

```http
GET /api/dashboard/summary?period=30j&zone=paris-15&scope=me&persona=agent
```

Retourne : `DashboardSummary`

**Cache serveur** : 60s (dashboard bouge peu, calculs coûteux).
**Réponse p95 cible** : < 400ms (stale cache hit), < 1200ms (cache miss).

## 16.2 Endpoints par bloc (lazy refresh)

Utilisés pour refresh ciblé après mutation.

```http
GET /api/dashboard/kpis?period=30j&zone=paris-15&scope=me
GET /api/dashboard/priorities?limit=4&scope=me
GET /api/dashboard/alerts?limit=5&scope=me
GET /api/dashboard/rapports?period=90j&scope=me
GET /api/dashboard/portfolio-health?scope=me
GET /api/dashboard/pulse-market?zone=paris-15&period=30j
GET /api/dashboard/territory?zone=paris-15&limit=6
```

## 16.3 Endpoints de mutation TdB

Les mutations purement TdB (snooze / dismiss d'une priorité) :

```http
POST /api/dashboard/priorities/:id/dismiss
POST /api/dashboard/priorities/:id/snooze
  body: { until: 'tomorrow' | 'next_week' | ISO-date }
```

Pour toutes les autres mutations (terminer action, créer lead, relancer, assigner…), le dashboard appelle les endpoints des **modules sources** :

```http
POST /api/actions
POST /api/leads
POST /api/assignments
POST /api/alerts
POST /api/reminders
PATCH /api/actions/:id
PATCH /api/notifications/:id
```

Principe : le dashboard ne possède **pas** sa propre logique métier de mutation.

---

# 17. Refresh strategy (TanStack Query)

## 17.1 staleTime par bloc

```ts
const DASHBOARD_QUERY_KEY = 'dashboard'

// summary global — refresh pas trop agressif
queryKey: ['dashboard', 'summary', { period, zone, scope, persona }]
staleTime: 60_000           // 60s
gcTime: 300_000             // 5 min

// blocs individuels (pour refresh ciblé)
queryKey: ['dashboard', 'priorities', ...]
staleTime: 30_000           // 30s — plus frais

queryKey: ['dashboard', 'alerts', ...]
staleTime: 30_000

queryKey: ['dashboard', 'kpis', ...]
staleTime: 60_000

queryKey: ['dashboard', 'rapports', ...]
staleTime: 120_000          // rapports bougent moins vite

queryKey: ['dashboard', 'pulse-market', ...]
staleTime: 300_000          // marché bouge lentement, 5 min
```

## 17.2 Invalidation après mutation

Règle : une mutation déclenchée depuis le dashboard invalide **uniquement le bloc concerné**, pas le summary entier.

```ts
// Ex: après avoir relancé un rapport
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['dashboard', 'rapports'] })
  queryClient.invalidateQueries({ queryKey: ['dashboard', 'priorities'] })
  // pas kpis, pas pulse-market, pas territory
}

// Ex: après avoir assigné un lead
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['dashboard', 'priorities'] })
  queryClient.invalidateQueries({ queryKey: ['dashboard', 'kpis'] })
}
```

## 17.3 Polling (hors V1)

Pas de polling en V1. Refresh uniquement :

```txt
- au mount
- à chaque changement query param (period, zone, scope, persona)
- après mutation invalidante
- au retour focus onglet (refetchOnWindowFocus: true par défaut)
```

Polling temps réel : V2+ via WebSocket Veille (non scope TdB V1).

## 17.4 Optimistic UI

Pour les mutations internes au dashboard (dismiss, snooze) :

```ts
useMutation({
  mutationFn: dismissPriority,
  onMutate: async (priorityId) => {
    await queryClient.cancelQueries({ queryKey: ['dashboard', 'priorities'] })
    const previous = queryClient.getQueryData(['dashboard', 'priorities'])
    queryClient.setQueryData(['dashboard', 'priorities'], (old) =>
      old.filter(p => p.id !== priorityId)
    )
    return { previous }
  },
  onError: (err, _, context) => {
    queryClient.setQueryData(['dashboard', 'priorities'], context.previous)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'priorities'] })
  }
})
```

---

# 18. Données mockées obligatoires

Toutes les fixtures sont dans `/src/lib/dashboard/fixtures.ts` et servies via `/src/mocks/handlers/dashboard.ts`.

## 18.1 KPIs strip (agent, 30j, Paris 15e)

```json
[
  {
    "id": "ca_realise_mois",
    "label": "CA réalisé",
    "value": "74 200 €",
    "delta": { "value": "+12%", "trend": "up", "is_positive": true },
    "context": "vs objectif : 78%",
    "source_module": "performance",
    "href": "/app/activite/performance?period=mois",
    "action_label": "Voir le reporting",
    "icon": "TrendingUp"
  },
  {
    "id": "mandats_signes",
    "label": "Mandats signés",
    "value": 17,
    "delta": { "value": "+2", "trend": "up", "is_positive": true },
    "context": "dont 6 exclusifs",
    "source_module": "leads",
    "href": "/app/activite/leads?stage=mandat&period=mois",
    "action_label": "Voir les mandats",
    "icon": "FileSignature"
  },
  {
    "id": "ca_pipe_pondere",
    "label": "CA pipe pondéré",
    "value": "286 450 €",
    "delta": { "value": "+18%", "trend": "up", "is_positive": true },
    "context": "sur 90 jours",
    "source_module": "performance",
    "href": "/app/activite/performance?view=pipe",
    "action_label": "Voir le pipe",
    "icon": "Wallet"
  },
  {
    "id": "taux_transformation",
    "label": "Taux transformation",
    "value": "21%",
    "delta": { "value": "+2 pts", "trend": "up", "is_positive": true },
    "context": "lead → mandat",
    "source_module": "performance",
    "href": "/app/activite/performance?view=funnel",
    "action_label": "Voir le funnel",
    "icon": "Filter"
  },
  {
    "id": "part_marche",
    "label": "Part de marché",
    "value": "0,87%",
    "delta": { "value": "+0,12 pt", "trend": "up", "is_positive": true },
    "context": "Paris 15e · potentiel 2,5%",
    "source_module": "performance",
    "href": "/app/activite/performance?view=marche",
    "action_label": "Voir le potentiel",
    "icon": "Target"
  }
]
```

## 18.2 Priorités du jour (agent, 4 items)

```json
[
  {
    "id": "P-001",
    "rank": 1,
    "type": "action_en_retard",
    "urgency": "en_retard",
    "urgency_label": "En retard 3j",
    "title": "Relancer M. Dupont",
    "subtitle": "Mandat expire dans 12j",
    "source_module": "estimation",
    "source_label": "Estimation",
    "linked_object_type": "lead",
    "linked_object_id": "L-421",
    "priority_score": 92,
    "cta_primary": {
      "label": "Appeler",
      "action": "open_drawer",
      "drawer_ref": "lead:L-421"
    },
    "cta_secondary": { "label": "Reporter", "action": "snooze" }
  },
  {
    "id": "P-002",
    "rank": 2,
    "type": "rdv_du_jour",
    "urgency": "aujourdhui",
    "urgency_label": "14h30",
    "title": "RDV estimation",
    "subtitle": "45 rue Lecourbe",
    "source_module": "agenda",
    "source_label": "Agenda",
    "linked_object_type": "rdv",
    "linked_object_id": "RDV-112",
    "priority_score": 88,
    "cta_primary": { "label": "Brief", "action": "open_drawer", "drawer_ref": "rdv:RDV-112" }
  },
  {
    "id": "P-003",
    "rank": 3,
    "type": "signature_imminente",
    "urgency": "aujourdhui",
    "urgency_label": "Aujourd'hui",
    "title": "Signer compromis Dossier Lyon",
    "subtitle": "Projet Pinel · Lyon 3e",
    "source_module": "investissement",
    "source_label": "Invest",
    "linked_object_type": "dossier",
    "linked_object_id": "D-102",
    "priority_score": 86,
    "cta_primary": { "label": "Ouvrir", "action": "open_route", "href": "/app/investissement/dossiers/D-102" }
  },
  {
    "id": "P-004",
    "rank": 4,
    "type": "rdv_a_preparer",
    "urgency": "cette_semaine",
    "urgency_label": "Cette semaine",
    "title": "Visite T3 rue Vaugirard",
    "subtitle": "M. et Mme Duval",
    "source_module": "leads",
    "source_label": "Leads",
    "linked_object_type": "lead",
    "linked_object_id": "L-512",
    "priority_score": 64,
    "cta_primary": { "label": "Préparer", "action": "open_drawer", "drawer_ref": "lead:L-512" }
  }
]
```

## 18.3 Alertes prioritaires (5 items)

```json
[
  {
    "id": "A-001",
    "rank": 1,
    "type": "bien_suivi_baisse_prix",
    "icon": "TrendingDown",
    "title": "Baisse -4,2% sur bien suivi",
    "subtitle": "Appartement · 75015 Paris · il y a 2h",
    "source_module": "veille",
    "source_label": "Veille",
    "linked_object_type": "bien_suivi",
    "linked_object_id": "BS-331",
    "zone_label": "Paris 15e",
    "occurred_at": "2026-04-24T08:15:00Z",
    "impact_score": 88,
    "cta_primary": { "label": "Analyser", "action": "open_drawer", "drawer_ref": "bien:B-331" },
    "is_unread": true
  },
  {
    "id": "A-002",
    "rank": 2,
    "type": "agence_concurrente_mandat",
    "icon": "Building2",
    "title": "3 nouveaux mandats agence concurrente",
    "subtitle": "Paris 15e · Century 21 · ce mois",
    "source_module": "veille",
    "source_label": "Veille",
    "zone_label": "Paris 15e",
    "occurred_at": "2026-04-24T07:00:00Z",
    "impact_score": 80,
    "cta_primary": { "label": "Voir", "action": "open_route", "href": "/app/veille/agences-concurrentes" },
    "is_unread": true
  },
  {
    "id": "A-003",
    "rank": 3,
    "type": "rapport_rouvert_multiple",
    "icon": "FileText",
    "title": "Avis de valeur rouvert 3 fois",
    "subtitle": "M. Prévost · Dernier accès hier 18h",
    "source_module": "estimation",
    "source_label": "Estimation",
    "linked_object_type": "rapport",
    "linked_object_id": "R-914",
    "occurred_at": "2026-04-23T18:00:00Z",
    "impact_score": 75,
    "cta_primary": { "label": "Relancer", "action": "open_drawer", "drawer_ref": "rapport:R-914" },
    "is_unread": false
  },
  {
    "id": "A-004",
    "rank": 4,
    "type": "signal_dpe",
    "icon": "Zap",
    "title": "Signal DPE · 2 lots concernés",
    "subtitle": "8 rue Blomet · DPE F détecté",
    "source_module": "prospection",
    "source_label": "Prospection",
    "linked_object_type": "bien",
    "linked_object_id": "B-555",
    "zone_label": "Paris 15e",
    "occurred_at": "2026-04-23T12:00:00Z",
    "impact_score": 70,
    "cta_primary": { "label": "Créer lead", "action": "open_modal", "href": "/app/activite/leads?action=create&bien=B-555" },
    "is_unread": false
  },
  {
    "id": "A-005",
    "rank": 5,
    "type": "marche_zone_variation",
    "icon": "BarChart3",
    "title": "Prix médian 75015 +1,2% ce mois",
    "subtitle": "Observatoire · 842 DVF",
    "source_module": "observatoire",
    "source_label": "Observatoire",
    "zone_label": "Paris 15e",
    "occurred_at": "2026-04-22T00:00:00Z",
    "impact_score": 48,
    "cta_primary": { "label": "Voir", "action": "open_route", "href": "/app/observatoire/marche?zone=paris-15" },
    "is_unread": false
  }
]
```

## 18.4 Rapports envoyés & engagement (8 items pour remplir le tableau)

```json
[
  {
    "id": "RE-001", "rapport_id": "R-911", "type": "avis_valeur", "type_label": "Avis valeur",
    "client": { "name": "Mme Martin", "linked_lead_id": "L-201" },
    "sent_at": "2026-04-19T14:00:00Z", "sent_label": "il y a 5j",
    "opens_count": 3, "last_opened_at": "2026-04-23T18:00:00Z", "last_opened_label": "hier 18h",
    "engagement_state": "chaud", "relance_status": "jamais",
    "priority_engagement_score": 85,
    "cta_primary": { "label": "Relancer", "action": "open_drawer", "drawer_ref": "rapport:R-911" }
  },
  {
    "id": "RE-002", "rapport_id": "R-914", "type": "avis_valeur", "type_label": "Avis valeur",
    "client": { "name": "M. Prévost", "linked_lead_id": "L-214" },
    "sent_at": "2026-04-12T10:30:00Z", "sent_label": "il y a 12j",
    "opens_count": 5, "last_opened_at": "2026-04-24T10:00:00Z", "last_opened_label": "il y a 2h",
    "engagement_state": "tres_chaud", "relance_status": "jamais",
    "priority_engagement_score": 95,
    "cta_primary": { "label": "Appeler", "action": "open_drawer", "drawer_ref": "rapport:R-914" }
  },
  {
    "id": "RE-003", "rapport_id": "R-920", "type": "etude_locative", "type_label": "Étude locative",
    "client": { "name": "Durand SAS", "linked_lead_id": "L-230" },
    "sent_at": "2026-04-21T09:00:00Z", "sent_label": "il y a 3j",
    "opens_count": 2, "last_opened_at": "2026-04-23T14:00:00Z", "last_opened_label": "hier 14h",
    "engagement_state": "chaud", "relance_status": "jamais",
    "priority_engagement_score": 78,
    "cta_primary": { "label": "Relancer", "action": "open_drawer", "drawer_ref": "rapport:R-920" }
  },
  {
    "id": "RE-004", "rapport_id": "R-905", "type": "avis_valeur", "type_label": "Avis valeur",
    "client": { "name": "M. Lefebvre", "linked_lead_id": "L-188" },
    "sent_at": "2026-04-16T15:00:00Z", "sent_label": "il y a 8j",
    "opens_count": 1, "last_opened_at": "2026-04-18T10:00:00Z", "last_opened_label": "il y a 6j",
    "engagement_state": "ouvert_passif", "relance_status": "jamais",
    "priority_engagement_score": 55,
    "cta_primary": { "label": "Relancer", "action": "open_drawer", "drawer_ref": "rapport:R-905" }
  },
  {
    "id": "RE-005", "rapport_id": "R-930", "type": "dossier_invest", "type_label": "Dossier invest",
    "client": { "name": "Projet Lyon", "linked_lead_id": "L-301" },
    "sent_at": "2026-04-22T11:00:00Z", "sent_label": "il y a 2j",
    "opens_count": 4, "last_opened_at": "2026-04-24T09:00:00Z", "last_opened_label": "il y a 3h",
    "engagement_state": "tres_chaud", "relance_status": "jamais",
    "priority_engagement_score": 92,
    "cta_primary": { "label": "Appeler", "action": "open_drawer", "drawer_ref": "rapport:R-930" }
  },
  {
    "id": "RE-006", "rapport_id": "R-888", "type": "avis_valeur", "type_label": "Avis valeur",
    "client": { "name": "Mme Bernard", "linked_lead_id": "L-172" },
    "sent_at": "2026-04-10T09:00:00Z", "sent_label": "il y a 14j",
    "opens_count": 0, "last_opened_at": null, "last_opened_label": null,
    "engagement_state": "non_ouvert", "relance_status": "jamais",
    "priority_engagement_score": 42,
    "cta_primary": { "label": "Renvoyer", "action": "open_drawer", "drawer_ref": "rapport:R-888" }
  },
  {
    "id": "RE-007", "rapport_id": "R-855", "type": "avis_valeur", "type_label": "Avis valeur",
    "client": { "name": "M. Rousseau", "linked_lead_id": "L-144" },
    "sent_at": "2026-04-02T16:00:00Z", "sent_label": "il y a 22j",
    "opens_count": 2, "last_opened_at": "2026-04-16T10:00:00Z", "last_opened_label": "il y a 8j",
    "engagement_state": "ouvert_passif", "relance_status": "en_cours",
    "priority_engagement_score": 38,
    "cta_primary": { "label": "Archiver", "action": "open_drawer", "drawer_ref": "rapport:R-855" }
  },
  {
    "id": "RE-008", "rapport_id": "R-812", "type": "etude_locative", "type_label": "Étude locative",
    "client": { "name": "Mme Caron", "linked_lead_id": "L-128" },
    "sent_at": "2026-03-28T10:00:00Z", "sent_label": "il y a 27j",
    "opens_count": 1, "last_opened_at": "2026-04-05T11:00:00Z", "last_opened_label": "il y a 19j",
    "engagement_state": "abandonne", "relance_status": "abandonnee",
    "priority_engagement_score": 20,
    "cta_primary": { "label": "Archiver", "action": "open_drawer", "drawer_ref": "rapport:R-812" }
  }
]
```

## 18.5 Santé portefeuille

```json
{
  "total_mandats_actifs": 23,
  "health_score": 72,
  "trend_30d": "stable",
  "health_categories": [
    {
      "id": "expirant_court_terme",
      "severity": "critical",
      "icon": "AlertCircle",
      "label": "Mandats expirant < 15j",
      "count": 3,
      "excerpt": "Rue Lecourbe · Rue Convention · Bd Lefebvre",
      "linked_bien_ids": ["B-101", "B-102", "B-103"],
      "cta": {
        "label": "Voir tous",
        "action": "open_route",
        "href": "/app/biens/portefeuille?filter=expirant-15j"
      }
    },
    {
      "id": "sans_mouvement_long",
      "severity": "warning",
      "icon": "Clock",
      "label": "Mandats sans mouvement > 60j",
      "count": 5,
      "excerpt": "Dont 2 sans visite",
      "linked_bien_ids": ["B-110", "B-111", "B-112", "B-113", "B-114"],
      "cta": {
        "label": "Voir tous",
        "action": "open_route",
        "href": "/app/biens/portefeuille?filter=sans-mouvement"
      }
    },
    {
      "id": "overpricing",
      "severity": "warning",
      "icon": "TrendingUp",
      "label": "Overpricing vs marché",
      "count": 2,
      "excerpt": "+8% et +12% vs prix médian zone",
      "linked_bien_ids": ["B-120", "B-121"],
      "cta": {
        "label": "Voir détails",
        "action": "open_route",
        "href": "/app/biens/portefeuille?filter=overpricing"
      }
    },
    {
      "id": "mandat_simple_candidat_exclusif",
      "severity": "opportunity",
      "icon": "Sparkles",
      "label": "Mandats simples à convertir",
      "count": 2,
      "excerpt": "Candidats exclusivité",
      "linked_bien_ids": ["B-130", "B-131"],
      "cta": {
        "label": "Stratégie",
        "action": "open_drawer",
        "drawer_ref": "portfolio-strategy"
      }
    }
  ]
}
```

## 18.6 Pouls marché (Paris 15e · 30j)

```json
{
  "zone_id": "paris-15",
  "zone_label": "Paris 15e",
  "period": "30j",
  "cells": [
    { "scope": "mon_portefeuille", "indicator": "nouveaux", "value": 3, "href": "/app/biens/portefeuille?filter=nouveau&period=30j" },
    { "scope": "mon_portefeuille", "indicator": "baisses_prix", "value": 1, "href": "/app/biens/portefeuille?filter=baisse-prix&period=30j" },
    { "scope": "mon_portefeuille", "indicator": "expires", "value": 0, "href": "/app/biens/portefeuille?filter=expire&period=30j" },
    { "scope": "mon_portefeuille", "indicator": "vendus", "value": null, "href": "" },

    { "scope": "biens_suivis", "indicator": "nouveaux", "value": 8, "href": "/app/veille/biens-suivis?filter=nouveau&period=30j" },
    { "scope": "biens_suivis", "indicator": "baisses_prix", "value": 4, "href": "/app/veille/biens-suivis?filter=baisse-prix&period=30j" },
    { "scope": "biens_suivis", "indicator": "expires", "value": 2, "href": "/app/veille/biens-suivis?filter=expire&period=30j" },
    { "scope": "biens_suivis", "indicator": "vendus", "value": null, "href": "" },

    { "scope": "annonces_particuliers", "indicator": "nouveaux", "value": 42, "href": "/app/biens/annonces?source=particulier&filter=nouveau&period=30j&zone=paris-15" },
    { "scope": "annonces_particuliers", "indicator": "baisses_prix", "value": 18, "href": "/app/biens/annonces?source=particulier&filter=baisse-prix&period=30j&zone=paris-15" },
    { "scope": "annonces_particuliers", "indicator": "expires", "value": 31, "href": "/app/biens/annonces?source=particulier&filter=expire&period=30j&zone=paris-15" },
    { "scope": "annonces_particuliers", "indicator": "vendus", "value": null, "href": "" },

    { "scope": "annonces_agences", "indicator": "nouveaux", "value": 287, "href": "/app/biens/annonces?source=agence&filter=nouveau&period=30j&zone=paris-15" },
    { "scope": "annonces_agences", "indicator": "baisses_prix", "value": 126, "href": "/app/biens/annonces?source=agence&filter=baisse-prix&period=30j&zone=paris-15" },
    { "scope": "annonces_agences", "indicator": "expires", "value": 198, "href": "/app/biens/annonces?source=agence&filter=expire&period=30j&zone=paris-15" },
    { "scope": "annonces_agences", "indicator": "vendus", "value": null, "href": "" },

    { "scope": "dvf_vendus", "indicator": "nouveaux", "value": null, "href": "" },
    { "scope": "dvf_vendus", "indicator": "baisses_prix", "value": null, "href": "" },
    { "scope": "dvf_vendus", "indicator": "expires", "value": null, "href": "" },
    { "scope": "dvf_vendus", "indicator": "vendus", "value": 92, "href": "/app/biens/vendus?zone=paris-15&period=30j" }
  ],
  "synthese": {
    "prix_median_m2": 9420,
    "evolution_12m_pct": 2.8,
    "tension": "Forte",
    "volume_dvf_12m": 842,
    "confidence": "forte"
  }
}
```

## 18.7 Opportunités & signaux territoire

```json
[
  {
    "id": "T-001", "side": "opportunites", "rank": 1, "type": "opportunite_invest",
    "title": "T2 Paris 15e", "subtitle": "Rue Lecourbe · 42 m²",
    "score": 84, "metric_label": "Rendement 4,8%",
    "badge": { "label": "Invest", "tone": "violet" },
    "source_module": "investissement",
    "linked_object_type": "opportunite", "linked_object_id": "O-201",
    "cta_primary": { "label": "Analyser", "action": "open_route", "href": "/app/investissement/opportunites?analyse=O-201" }
  },
  {
    "id": "T-002", "side": "opportunites", "rank": 2, "type": "bien_suivi_mouvement",
    "title": "Maison Boulogne", "subtitle": "150 m² · Jardin",
    "metric_label": "Baisse -3,8%",
    "badge": { "label": "Veille", "tone": "blue" },
    "source_module": "veille",
    "linked_object_type": "bien_suivi", "linked_object_id": "BS-410",
    "cta_primary": { "label": "Ouvrir", "action": "open_drawer", "drawer_ref": "bien:B-410" }
  },
  {
    "id": "T-003", "side": "opportunites", "rank": 3, "type": "opportunite_invest",
    "title": "Studio 75015", "subtitle": "22 m² · Rue Cambronne",
    "score": 79, "metric_label": "Rdt net-net 5,2%",
    "badge": { "label": "Invest", "tone": "violet" },
    "source_module": "investissement",
    "linked_object_type": "opportunite", "linked_object_id": "O-215",
    "cta_primary": { "label": "Analyser", "action": "open_route", "href": "/app/investissement/opportunites?analyse=O-215" }
  },
  {
    "id": "T-004", "side": "signaux", "rank": 1, "type": "signal_radar",
    "title": "Mandat expire 15 rue Péclet", "subtitle": "Confiance élevée · 19j",
    "badge": { "label": "Prospection", "tone": "amber" },
    "source_module": "prospection",
    "linked_object_type": "bien", "linked_object_id": "B-505",
    "cta_primary": { "label": "Contacter", "action": "open_drawer", "drawer_ref": "signal:S-333" }
  },
  {
    "id": "T-005", "side": "signaux", "rank": 2, "type": "signal_dpe",
    "title": "Propriétaire âgé + 2 héritiers", "subtitle": "12 rue Blomet · DPE F",
    "badge": { "label": "Prospection", "tone": "amber" },
    "source_module": "prospection",
    "linked_object_type": "bien", "linked_object_id": "B-520",
    "cta_primary": { "label": "Créer lead", "action": "open_modal", "href": "/app/activite/leads?action=create&bien=B-520" }
  },
  {
    "id": "T-006", "side": "signaux", "rank": 3, "type": "signal_marche",
    "title": "Hausse prix médian +1,5%", "subtitle": "75015 · 30 derniers jours",
    "badge": { "label": "Observatoire", "tone": "green" },
    "source_module": "observatoire",
    "linked_object_type": "zone", "linked_object_id": "paris-15",
    "cta_primary": { "label": "Voir", "action": "open_route", "href": "/app/observatoire/marche?zone=paris-15" }
  }
]
```

## 18.8 Counts

```json
{
  "total_priorities": 14,
  "total_alerts_unread": 47,
  "total_rapports_90j": 23,
  "total_opportunities": 12
}
```

## 18.9 Quick actions

```json
[
  { "id": "qa_estim",  "label": "Créer une estimation rapide",      "icon": "Calculator", "href": "/app/estimation/rapide?action=create", "source_module": "estimation" },
  { "id": "qa_lead",   "label": "Créer un lead",                    "icon": "UserPlus",   "href": "/app/activite/leads?action=create",    "source_module": "leads" },
  { "id": "qa_bien",   "label": "Ajouter un bien",                  "icon": "Home",       "href": "/app/biens/portefeuille?action=create","source_module": "biens" },
  { "id": "qa_invest", "label": "Lancer une analyse investissement","icon": "LineChart",  "href": "/app/investissement/opportunites?action=analyse", "source_module": "investissement" },
  { "id": "qa_alerte", "label": "Créer une alerte",                 "icon": "Bell",       "href": "/app/veille/alertes?action=create",    "source_module": "veille" },
  { "id": "qa_doss",   "label": "Créer un dossier",                 "icon": "FolderPlus", "href": "/app/investissement/dossiers?action=create", "source_module": "investissement" }
]
```

---

# 19. Composants à créer

## 19.1 Arborescence

```txt
/src/app/(app)/tableau-de-bord/page.tsx

/src/components/dashboard/
  DashboardPage.tsx
  DashboardHeader.tsx
  DashboardFilters.tsx
  DashboardQuickActionsMenu.tsx
  DashboardKpiStrip.tsx
  DashboardKpiCard.tsx

  PrioritiesPanel.tsx
  PriorityRow.tsx

  AlertsPanel.tsx
  AlertRow.tsx

  RapportsEngagementPanel.tsx
  RapportsEngagementRow.tsx
  OpensDotsBadge.tsx
  EngagementStatePill.tsx

  PortfolioHealthPanel.tsx
  PortfolioHealthCategoryRow.tsx
  PortfolioHealthScoreGauge.tsx

  PulseMarketPanel.tsx
  PulseMarketTable.tsx
  PulseMarketCell.tsx
  PulseMarketSynthese.tsx

  TerritoryPanel.tsx
  TerritoryItemRow.tsx

  DashboardSkeleton.tsx
  DashboardEmptyState.tsx
  DashboardErrorState.tsx
  PanelErrorState.tsx
  PanelEmptyState.tsx

/src/lib/dashboard/
  types.ts
  fixtures.ts
  ranking.ts
  dedup.ts
  adapters.ts
  routes.ts
  permissions.ts
  hooks/
    useDashboardSummary.ts
    useDashboardPriorities.ts
    useDashboardAlerts.ts
    useDashboardRapports.ts
    useDashboardPortfolioHealth.ts
    useDashboardPulseMarket.ts
    useDashboardTerritory.ts
    useDashboardFilters.ts

/src/mocks/handlers/dashboard.ts
```

## 19.2 Composants partagés à réutiliser

```txt
HeaderPro
SidebarPro
EntityDrawer (drawer contextuel partagé)
DrawerAI
BadgeSource
BadgeStatus
BadgeUrgency
Avatar
Button
Card
DropdownMenu
Command (shadcn)
Tooltip
Tabs
SegmentedControl
Skeleton
```

## 19.3 Responsabilités des composants clés

### DashboardPage

```txt
- lit query params via nuqs (period, zone, scope, persona, drawer)
- fetch /api/dashboard/summary via useDashboardSummary
- gère les états loading / error / empty globaux
- compose les panels
- ouvre les drawers via query param partagé ?drawer=...
- applique les permissions rôle (VIEWER = disabled CTAs)
```

### DashboardHeader

```txt
- affiche titre + sous-titre
- rend DashboardFilters (période, zone, scope)
- rend DashboardQuickActionsMenu (+ Action rapide)
- scope dropdown masqué si user n'est ni OWNER ni ADMIN
```

### PrioritiesPanel

```txt
- reçoit priorities[] + total count
- limite à 4 items
- rend PriorityRow × N
- footer "Voir toutes les actions (N) →" si total > 4
- empty state si priorities.length === 0
```

### AlertsPanel

```txt
- reçoit alerts[] + total unread count
- limite à 5 items
- rend AlertRow × N
- footer "Voir toutes les notifications (N) →" si total > 5
- empty state si alerts.length === 0
```

### RapportsEngagementPanel

```txt
- reçoit rapports[] + total count
- format tableau (pas liste)
- gère tri par dropdown "Trier par ▾"
- hauteur max 380px, scroll interne au-delà
- footer "Voir tous les rapports →"
- empty state si rapports.length === 0
```

### PortfolioHealthPanel

```txt
- reçoit portfolio_health object
- optionnel: affiche gauge health_score en haut-droit
- rend PortfolioHealthCategoryRow × N
- footer "Voir le portefeuille complet →"
- empty state si total_mandats_actifs === 0
```

### PulseMarketPanel

```txt
- reçoit pulse_market ou null
- si null: empty state "Aucune zone configurée"
- rend PulseMarketTable (5 lignes × 4 colonnes)
- rend PulseMarketSynthese en bas
- 3 actions footer (Ouvrir Observatoire / Créer alerte / Voir DVF)
```

### TerritoryPanel

```txt
- reçoit territory[] (6 items: 3 opportunites + 3 signaux)
- split en 2 colonnes (opportunites / signaux)
- rend TerritoryItemRow × 3 par colonne
- 2 footers discrets (Voir opportunités / Voir Radar)
```

---

# 20. États UI

## 20.1 Loading

**Skeleton global** : affiché pendant le premier fetch summary.

```txt
Header skeleton (titre + filtres shimmer)
KPI strip skeleton : 5 cards shimmer
Row top skeleton : 2 panels (60% / 40%)
Rapports skeleton : 8 lignes tableau
Row mid skeleton : 2 panels (50% / 50%)
Territory skeleton : 2 colonnes × 3 rows
```

**Skeleton partiel** : si un bloc refresh après mutation, seul ce bloc passe en skeleton local (pas toute la page).

## 20.2 Empty state global

Si le compte est tout neuf (aucun lead, aucun bien, aucune zone) :

```txt
🚀  Votre tableau de bord est prêt à se remplir.

    Commencez par configurer votre espace pour voir votre activité en un clin d'œil.

    [Créer une estimation]   [Ajouter un bien]   [Configurer une zone]

    ou [Voir le tour guidé →]
```

## 20.3 Empty state par bloc

Chaque bloc a son propre empty state (§7.9, §8.7, §9.9, §10.8, §11.8, §12.8). Un bloc vide n'empêche pas les autres de s'afficher.

## 20.4 Erreur globale

Si `/api/dashboard/summary` échoue complètement :

```txt
⚠️  Impossible de charger le tableau de bord.

    Certaines données peuvent être temporairement indisponibles.

    [Réessayer]   [Contacter le support]
```

## 20.5 Erreur locale (bloc)

Si un bloc spécifique échoue mais pas les autres :

```txt
[dans le panel concerné]
⚠️  Ce bloc n'a pas pu être chargé.
    [Réessayer]
```

Les autres blocs continuent d'afficher leurs données.

## 20.6 Permissions par rôle

| Rôle | Vue par défaut | CTAs mutations | Scope dropdown | Quick actions |
|---|---|---|---|---|
| OWNER | Personnel + scope equipe toggle | ✓ | ✓ | ✓ |
| ADMIN | Personnel + scope equipe toggle | ✓ | ✓ | ✓ |
| AGENT | Personnel uniquement | ✓ | ✗ (masqué) | ✓ |
| VIEWER | Personnel lecture seule | ✗ (disabled) | ✗ (masqué) | ✗ (disabled) |
| INVESTOR | Variante investisseur | ✓ | ✗ | ✓ (variantes) |

---

# 21. Interactions détaillées

## 21.1 Clic KPI

| KPI | Destination |
|---|---|
| CA réalisé mois | `/app/activite/performance?period=mois` |
| Mandats signés | `/app/activite/leads?stage=mandat&period=mois` |
| CA pipe pondéré | `/app/activite/performance?view=pipe` |
| Taux transformation | `/app/activite/performance?view=funnel` |
| Part de marché | `/app/activite/performance?view=marche` |

Navigation complète (pas drawer).

## 21.2 Clic ligne priorité

- **Clic row (hors CTA)** → drawer contextuel objet (`?drawer=lead:L-001`)
- **Clic CTA primary** → action dédiée (selon §7.6)
- **Clic CTA secondary** → action secondaire
- **Clic badge source** → module source filtré (`/app/activite/leads?stage=mandat` par exemple)
- **Clic kebab** → menu §7.7

## 21.3 Clic alerte

Identique aux priorités (row → drawer, CTA → action, badge → module).

Interaction supplémentaire :
- **Hover alerte** → marque automatiquement `is_unread: false` après 1s (optimistic, PATCH en arrière-plan)

## 21.4 Clic rapport

- **Clic row** → drawer rapport (`?drawer=rapport:R-914`)
- **Clic colonne Client** → drawer lead (`?drawer=lead:L-214`)
- **Clic CTA "Relancer" / "Appeler"** → drawer action préremplie (pas de navigation)
- **Clic CTA "Archiver"** → confirm modal → PATCH archive
- **Clic CTA "Renvoyer"** → modal envoi rapide
- **Hover dots ouvertures** → tooltip détail ouvertures avec dates

## 21.5 Dropdown "+ Action rapide"

Chaque action dans le dropdown ouvre le flow existant du module source (§5.3). Aucune création de form dans le TdB.

## 21.6 Drawer contextuel

Ouvre un drawer partagé `<EntityDrawer>` (§3.3). Le drawer vit au-dessus du TdB, le TdB reste visible en arrière (overlay opaque ~40%).

Fermeture du drawer :
- ESC
- Clic overlay
- Bouton X header drawer
- Navigation vers route sans `?drawer=`

## 21.7 Changement de filtre

- **Changement Période** → refetch summary complet avec nouveau period
- **Changement Zone** → refetch summary (KPIs + pulse market + territory)
- **Changement Scope** → refetch summary complet avec nouveau scope
- **Changement Persona** → refetch summary + re-render layout adapté

Transitions : le contenu des blocs passe en skeleton local pendant le refetch (pas toute la page).

---

# 22. Règles de wording

## 22.1 Ton général

Professionnel, direct, actionnable. Pas de marketing, pas d'émojis dans les titres de blocs, pas d'exclamation.

**Préférer** :

```txt
Relance utile · À traiter · À préparer · À surveiller · À analyser
Objet à débloquer · Rapport chaud · Signal prioritaire
Charge élevée · Coaching recommandé
```

**Éviter** :

```txt
Mauvais · Sous-performance · Erreur agent · Surveillance
Score magique · Super · Génial · Amazing
```

## 22.2 Labels source (badges)

Labels courts, pas d'abréviations inutiles :

```txt
Leads · Estimation · Agenda · Veille · Prospection
Invest · Observatoire · Performance · Portefeuille · Pilotage
```

Exception pour l'espace : "Invest" au lieu de "Investissement" (tag compact).

## 22.3 CTAs courts (max 2 mots, 1 si possible)

```txt
Relancer · Assigner · Brief · Analyser · Créer lead
Ouvrir · Comparer · Créer action · Voir · Appeler
Reporter · Archiver · Renvoyer · Préparer · Voir détail
```

## 22.4 États temporels

| Cas | Format |
|---|---|
| < 1h | "il y a 12 min" |
| < 24h | "il y a 2h" (si > 1h) / "il y a 45 min" (si < 1h mais > 5 min) |
| < 48h | "hier 18h" |
| < 7j | "il y a 3j" |
| ≥ 7j | "il y a 12j" puis "il y a 3 sem." à partir de 14j |
| ≥ 30j | "il y a 1 mois" |

## 22.5 Urgences

```txt
En retard 3j   (rouge)
En retard <24h (rouge)
Aujourd'hui    (orange)
14h30          (orange, si heure précise)
Demain         (orange)
Cette semaine  (jaune)
Plus tard      (gris)
```

## 22.6 Nombres / devises

```txt
CA           : "74 200 €"  (espace insécable entre milliers)
Delta %      : "+12%"       (signe systématique)
Delta pts    : "+2 pts"     (espace entre nombre et unité)
Part marché  : "0,87%"      (virgule décimale FR)
Volume DVF   : "842 ventes" (pas de K/M abrégé en V1)
```

---

# 23. Design system appliqué

## 23.1 Couleurs

```txt
Primaire        : violet Propsight (violet-500 à violet-700 selon contexte)
Fond page       : neutral-50
Cards           : white
Bordures        : neutral-200 (border-tertiary)
Bordure hover   : neutral-300 (border-secondary)
Texte primaire  : neutral-900
Texte secondaire: neutral-500 / 600
Texte muted     : neutral-400
Accent positif  : success (green-600)
Accent warning  : amber-500
Accent danger   : red-500 / 600
Accent info     : blue-500
```

## 23.2 Cards

```txt
radius 8px
border 1px solid border-tertiary
shadow très léger (shadow-sm)
padding 16px (standard) / 20px (panels avec titre)
hover border-secondary
transition 120ms ease
```

## 23.3 Densité typographique

```txt
Titre page        : 24px / 500 · text-primary
Sous-titre page   : 13px / 400 · text-secondary
Titre panel       : 14px / 500 · text-primary
Labels KPI        : 12px · text-secondary
Valeurs KPI       : 24–28px / 500 · text-primary
Valeurs KPI delta : 11–12px · couleur sémantique
Body row          : 13px / 400 · text-primary
Subtitle row      : 12px · text-secondary
Meta              : 11–12px · text-muted
Badge             : 11px / 500
CTA button ghost  : 12px / 500
```

## 23.4 Icônes

- Lucide icons exclusivement
- Taille standard : 16px (rows), 18–20px (KPIs), 14px (badges)
- Pas d'émojis dans les titres de blocs
- Émojis colorés acceptés pour urgence dans priorités (🔴 🟠 🟡) en V1, à remplacer par Lucide `Circle` coloré en V2 propre

## 23.5 Hauteurs / espacements clés

```txt
KPI card height      : 116px
Priority row height  : ~52px
Alert row height     : ~60px
Rapport row height   : 44px
Territory row height : ~68px
Panel padding        : 20px
Panel gap inter-rows : 12px (avec séparateur 1px au milieu)
Main grid gap        : 16px
Outer padding        : 24px
```

## 23.6 États visuels

```txt
Hover row        : bg-secondary (très léger)
Active row       : bg-tertiary + border-left violet 2px
Focus visible    : outline violet 2px / offset 2px
Disabled (Viewer): opacity 0.5, cursor not-allowed
Unread alert     : puce violet 6px à gauche du title
```

---

# 24. Critères d'acceptation

## 24.1 Produit

- [ ] Le TdB affiche **5 KPIs business** (pas 5 compteurs d'inbox)
- [ ] Le bloc "Mes priorités du jour" est une preview 4 lignes, pas un Kanban ni une workspace
- [ ] Le bloc "Alertes prioritaires" trie **par impact**, pas chronologiquement
- [ ] Le bloc "Rapports envoyés & engagement" est présent et affiche signal d'ouvertures (dots + dernier accès)
- [ ] Le bloc "Santé portefeuille" liste au moins 3 catégories de risque
- [ ] Le bloc "Pouls marché zone" est un tableau dense multi-scopes inspiré Yanport mais enrichi DVF
- [ ] Aucun bloc ne duplique la logique d'un module source
- [ ] Chaque KPI est cliquable vers son module source
- [ ] Chaque ligne (priorité, alerte, rapport, opportunité, signal) a un CTA clair
- [ ] Le pipeline commercial reste dans Leads, aucun Kanban en TdB
- [ ] Les favoris / biens suivis restent dans Veille (pas de section dédiée TdB)
- [ ] Le marché est une synthèse Observatoire, pas une carte complète
- [ ] La performance est un résumé KPI, pas la page analytique
- [ ] Le mode manager (scope=equipe) ne crée pas de Kanban équipe
- [ ] Les variantes persona (agent / manager / investor) sont isolées dans des adapters
- [ ] Le bouton `+ Action rapide` est l'unique entry point de création (pas de strip dupliqué)

## 24.2 UI

- [ ] Compatible 1440 × 900 sans scroll horizontal
- [ ] Scroll vertical < 1.3 hauteurs d'écran
- [ ] KPIs + Priorités + Alertes visibles above the fold (1440 × 900)
- [ ] Header + sidebar conformes au shell Pro
- [ ] Design dense, premium, violet Propsight
- [ ] Pas de gros blocs colorés (type Yanport ancien style)
- [ ] Skeletons propres par bloc
- [ ] Empty states globaux et par bloc
- [ ] Error states global et par bloc

## 24.3 Technique

- [ ] Types TS stricts, aucun `any`
- [ ] Fixtures MSW complètes (§18) couvrant les 7 blocs
- [ ] TanStack Query v5 avec queryKeys hiérarchiques `['dashboard', ...]`
- [ ] staleTime configuré par bloc (§17.1)
- [ ] Invalidation ciblée post-mutation (§17.2)
- [ ] Query params via nuqs (pas `useSearchParams` direct)
- [ ] Ranking priorités isolé dans `/src/lib/dashboard/ranking.ts`
- [ ] Dédup cross-module isolée dans `/src/lib/dashboard/dedup.ts`
- [ ] Import de la lib `@/lib/performance` pour tous les calculs CA / funnel / marché (pas de duplication)
- [ ] CTAs qui ouvrent un module source utilisent `/src/lib/dashboard/routes.ts` (URL centralisées)
- [ ] Drawer partagé via query param partageable (`?drawer=lead:L-001`)
- [ ] Permissions centralisées dans `/src/lib/dashboard/permissions.ts`
- [ ] Tests unitaires au minimum sur ranking.ts et dedup.ts

## 24.4 Performance

- [ ] Summary endpoint p95 < 1200ms cache miss, < 400ms cache hit
- [ ] First meaningful paint < 1.5s sur 3G rapide
- [ ] Layout shift (CLS) < 0.1 pendant loading → loaded
- [ ] Aucun re-render global sur changement drawer (seul le drawer re-render)

---

# 25. Prompt Claude Code

```txt
Tu vas construire la page Tableau de bord Propsight.

Contexte :
Propsight est un SaaS immobilier data-driven Pro pour agents et investisseurs.
Le Tableau de bord est la page d'accueil Pro (entry point après login sur /app).
Il répond à 3 questions business : "mon mois se passe bien ?", "qu'est-ce qui peut
basculer ma fin de trimestre ?", "qu'est-ce que je dois regarder maintenant ?".

Principe architectural central : PREVIEW, PAS WORKSPACE.
Le TdB affiche des extraits priorisés (top 4-5 par bloc) + CTAs vers les modules
sources. Il ne duplique JAMAIS la logique métier. Les workspaces restent :
- Pilotage (actions, agenda, exécution)
- Veille (notifications, alertes, biens suivis)
- Leads (Kanban pipeline)
- Performance (analytique détaillée)

Différenciation vs concurrents (Yanport, Apimo, Hektor) :
- KPIs business (CA, mandats, pipe, taux transfo, part de marché), pas d'inbox
- Bloc unique "Rapports envoyés & engagement" : signal d'ouvertures des avis de valeur
- Tri des alertes par impact business, pas chronologiquement
- Pouls marché multi-scopes enrichi DVF (ventes réelles)

Lis et respecte :
- docs/01_DESIGN_SYSTEM.md
- docs/02_LAYOUT_PRO.md
- docs/30_PILOTAGE_COMMERCIAL.md
- docs/31_LEADS.md
- docs/32_PERFORMANCE.md
- docs/20_PROSPECTION.md
- docs/22_OBSERVATOIRE.md
- docs/22_VEILLE.md
- docs/12_OPPORTUNITES_INVESTISSEMENT.md
- docs/ARCHITECTURE_ESTIMATION.md
- docs/biens_immobiliers_spec.md
- docs/50_EQUIPE_PROPSIGHT.md

Objectif :
Créer `/app/tableau-de-bord` avec design premium, dense, Linear/Attio, violet Propsight.

Structure imposée :
1. Header page : titre "Tableau de bord", filtres (période/zone/scope), bouton
   "+ Action rapide" (dropdown unique, pas de strip en bas)
2. KPI strip : 5 cards BUSINESS
   - CA réalisé mois : 74 200 € (+12%, vs objectif 78%)
   - Mandats signés : 17 (+2, dont 6 exclusifs)
   - CA pipe pondéré 90j : 286 450 € (+18%)
   - Taux transformation : 21% (+2 pts, lead → mandat)
   - Part de marché : 0,87% (+0,12 pt, Paris 15e, potentiel 2,5%)
3. Row top (2 colonnes 45% / 55%) :
   - Mes priorités du jour (top 4, actions + RDV fusionnés, triées par priority_score)
   - Alertes prioritaires (top 5, triées par impact_score)
4. Bloc phare plein width : Rapports envoyés & engagement (tableau dense, 8 lignes
   max, colonnes Client / Type / Envoyé / Ouvertures / Dernier accès / Action)
5. Row mid (2 colonnes 50% / 50%) :
   - Santé portefeuille mandats (catégories : expirant <15j, sans mouvement >60j,
     overpricing, candidats exclusifs)
   - Pouls marché zone (tableau 5 scopes × 4 indicateurs + synthèse bas)
6. Territory plein width : 2 colonnes (top 3 opportunités / top 3 signaux Radar)

Contraintes absolues :
- Aucun Kanban dans le TdB
- Aucun bloc décoratif (chaque ligne a un CTA)
- Chaque objet affiche un badge source (module d'origine)
- Clic KPI / ligne → module source OU drawer contextuel
- Quick actions = 1 seul dropdown header (pas de strip)
- Fixtures MSW complètes (cf §18)
- Types stricts dans /src/lib/dashboard/types.ts
- Ranking dans /src/lib/dashboard/ranking.ts
- Dédup dans /src/lib/dashboard/dedup.ts
- TanStack Query v5 avec queryKey ['dashboard', ...] hiérarchique
- Import @/lib/performance pour les calculs (NE PAS DUPLIQUER)
- Query params via nuqs
- Permissions via permissions.ts (VIEWER = CTAs disabled)

Livrable attendu :
Page screenshot-ready, dense, crédible, premium. Doit donner l'impression que tout
Propsight travaille ensemble : KPIs business en haut, priorités rankées à gauche,
alertes rankées à droite, rapports & engagement au centre, santé portefeuille et
pouls marché au milieu, opportunités et signaux territoire en bas.

Commence par :
1. types.ts (tous les types §15)
2. fixtures.ts (§18 complet)
3. mocks/handlers/dashboard.ts
4. ranking.ts + dedup.ts + routes.ts + permissions.ts
5. hooks useDashboardSummary + hooks par bloc
6. DashboardPage + DashboardHeader + DashboardKpiStrip
7. Les 6 panels (Priorities, Alerts, RapportsEngagement, PortfolioHealth,
   PulseMarket, Territory)
8. Skeletons + Empty states + Error states
```

---

# 26. Définition finale

Le Tableau de bord Propsight est la page d'accueil Pro qui transforme l'ensemble des données produit en **priorités business actionnables**, **rankées par impact** et **présentées comme previews** vers les modules sources.

Il doit montrer :

```txt
ce qui peut générer un mandat,       (opportunités + signaux)
ce qui doit être relancé,              (rapports chauds + priorités)
ce qui a changé sur le marché,        (alertes + pouls zone)
ce qui mérite une action aujourd'hui, (priorités du jour)
ce qui menace le portefeuille,        (santé mandats)
comment va le business,               (KPIs strip)
```

Sa promesse :

> Votre activité immobilière priorisée par Propsight : KPIs business, rapports chauds, signaux territoire et actions à fort impact — en un écran.

Sa différenciation :

> Là où Yanport vous montre ce qui change sur le marché, Propsight vous montre **ce que vous pouvez en faire**, **où vous en êtes**, et **quels rapports sont en train de devenir des mandats**.
