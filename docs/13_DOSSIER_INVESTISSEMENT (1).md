# Propsight — Module Investissement — Spec détaillée `Dossiers`

**Version** : V2 (consolidée et enrichie, remplace la V1)
**Format** : source de vérité produit / design / dev
**Périmètre** : `/app/investissement/dossiers` — V1 complète
**Langue produit** : français
**Persona V1** : agent immobilier / chasseur / conseiller investisseur / investisseur en direct (UI persona-aware)
**Complémentaire de** : `12_OPPORTUNITES_INVESTISSEMENT.md`, `03_TEMPLATE_RAPPORT.md`, `06_BLOC_SOLVABILITE.md`

---

# 0. Principes transverses

## 0.1 Positionnement du module

Le module `Dossiers` n'est pas un simple export PDF.
C'est le **niveau de production livrable** du module Investissement.

Le flux cible Propsight est :

```text
Annonce / bien suivi / projet vierge
→ Analyse investisseur (modal 7 onglets)
→ Comparatif éventuel (biens ou villes)
→ Dossier d'investissement
→ Partage / export / versioning / relance commerciale
```

Le dossier permet à un agent, un chasseur, un marchand de biens, un conseiller investissement ou un investisseur en direct de :

1. **structurer un projet investisseur** autour d'une ville, budget, stratégie
2. **analyser plusieurs opportunités** sans perdre l'historique
3. **retenir un bien ou un scénario**
4. **produire un support lisible, crédible, partageable**
5. **revenir plus tard dans l'éditeur** pour ajuster

## 0.2 Interconnexion & pipeline commercial unique

- **Aucun mini-CRM dans Dossiers.** Le pipeline commercial vit dans `Mon activité > Leads`.
- Les signaux d'activité des dossiers remontent dans `Leads` pour déclencher des relances.
- Le dossier est alimenté par le module Opportunités et par les autres modules, il ne vit pas en silo.

## 0.3 Règles KPI héritées de la spec Opportunités

- Un owner par KPI
- 3 KPIs max par ATF + verdict qualitatif
- Sticky row = 5 KPIs figés (Prix total projet, Cash-flow ATF, Net-net, TRI 10 ans, Score)
- Profil locataire à toutes les surfaces

## 0.4 Profil locataire — obligatoire dans le livrable

Le bloc profil locataire cible & profondeur de demande est **non négociable** dans le rapport investissement. Il survit même au profil d'export Synthèse.

## 0.5 Matrice persona appliquée aux dossiers

| Aspect | Agent | Investisseur en direct |
|---|---|---|
| **Créer un dossier** | "Nouveau dossier client" | "Nouveau dossier" |
| **Titre par défaut** | "Dossier [ville] [stratégie] — [Client]" | "Mon projet [ville] — [mois] [année]" |
| **Client / Porteur** | "Client : M. Dupont" (obligatoire) | "Porteur : moi" (auto, masqué) |
| **Partage** | "Partager avec votre client" | "Partager cette analyse" (banquier, courtier, conjoint, comptable) |
| **Tracking ouverture** | "Dossier ouvert par le client — relance utile" | "Dossier ouvert par [nom destinataire]" |
| **Action post-envoi** | "Créer une relance" | "Ajouter une note" |
| **Profils de partage** | Client uniquement V1 | Client · Banquier · Courtier · Conjoint · Comptable (labels seulement V1) |

### Table de substitutions

| Label générique | Label agent | Label investisseur |
|---|---|---|
| Dossier | Dossier client | Mon dossier |
| Client | Client | (masqué) |
| Relance | Relance client | Rappel personnel |
| Projet | Projet client | Mon projet |
| Partager | Partager avec le client | Partager cette analyse |
| Nouvelle version | Nouvelle version (révision client) | Nouvelle version |

## 0.6 Ce qui est figé et ne doit pas être remis en question

- Route principale : `/app/investissement/dossiers`
- Switch segmenté : **Dossiers | Projets**
- Moteur de rendu : **Template Rapport mutualisé** (partagé avec Avis de valeur + Étude locative)
- Comparatifs : modales contextuelles, pas de section sidebar
- Biens sauvegardés : `Veille > Biens suivis`
- Moteur fiscal V1 : 4 régimes réels + 4 mockés (voir §7.4)
- Millésime fiscal : configurable admin, versionné
- Export : 2 niveaux (Complet / Synthèse)

---

# 1. Rôle du sous-module `Dossiers`

Le sous-module `Dossiers` couvre 4 besoins distincts :

1. **Vue synthétique des dossiers** : pilotage éditorial et commercial
2. **Projets créés** : conteneurs amont, avant dossier final
3. **Éditeur de dossier** : construction, ajustement, versioning
4. **Template du rapport investissement** : ordre, présence, éditabilité des blocs

---

# 2. Architecture générale du module

## 2.1 Routes

```text
/app/investissement/dossiers
│
├── [Vue synthétique]
│   ├── Onglet A : Dossiers
│   └── Onglet B : Projets
│
├── /app/investissement/dossiers/projets/[id]
│   └── Workspace projet investisseur
│
├── /app/investissement/dossiers/[id]
│   └── Éditeur du dossier (split édition / preview)
│
└── [Routes publiques / partage]
    └── /rapport/[token]  (moteur mutualisé déjà existant)
```

## 2.2 Navigation dans l'UI

Sidebar Investissement :
- `Opportunités`
- `Dossiers`

Page Dossiers : switch segmenté `Dossiers | Projets` en haut.

## 2.3 Objets métier

### `ProjetInvestisseur`
Objet de travail continu, avant ou pendant la production du dossier.
Défini en détail dans la spec Opportunités §2.1.

Exemples :
- "Investissement rendement Lyon — budget 180k"
- "Projet patrimonial Bordeaux — couple expatrié"
- "Recherche colocation Lille pour client M. Dupont"

### `DossierInvestissement`
Livrable éditorialisé, attaché à :
- un projet
- ou une opportunité
- ou un scénario retenu
- ou un projet vierge si l'agent/investisseur veut produire un dossier très tôt

```ts
type DossierInvestissement = {
  dossier_id: string                      // UUID
  project_id?: string                     // optionnel si dossier standalone
  opportunity_id?: string                 // si créé depuis une opportunité
  scenario_id?: string                    // scénario principal retenu
  scenario_secondaires_ids: string[]      // scénarios alternatifs annexes
  title: string
  subtitle?: string
  client_lead_id?: string                 // persona agent
  porteur_user_id: string                 // auteur / propriétaire
  assignee_ids: string[]                  // collaborateurs

  // Snapshot hybride Opportunité → Dossier (voir §6)
  snapshot: {
    created_from: 'opportunite'|'projet_vierge'|'comparatif'|'duplicata'|'annonce'|'portefeuille'
    snapshot_at: string
    snapshot_source_id: string
    snapshot_hypotheses: ScenarioInvest['key_assumptions']
    snapshot_financing: ScenarioInvest['financing_setup']
    snapshot_fiscal: {
      regime: string
      tmi: number
      parts: number
      millesime: number
    }
    snapshot_overrides: ScenarioInvest['overrides']
  }

  // Références live (recalculées à la demande)
  live_refs: {
    bien_id?: string
    zone_id: string
    avm_version_at_last_sync: string
    last_sync_at: string
  }

  // Contenu éditorial
  template_id: string                     // "dossier_invest" dans le registry
  blocks_config: BlockConfig[]            // ordre + visibilité + overrides
  editorial_content: {                    // textes inline
    title: string
    subtitle: string
    synthese_narrative: string
    conclusion: string
    forces: string[]
    vigilances: string[]
    recommandations: string[]
    notes_internes: string
  }
  branding: {
    agency_logo_override?: string
    color_override?: string
  }

  // Cycle de vie
  status: 'brouillon'|'analyse_prete'|'finalise'|'envoye'|'ouvert'|'archive'
  version: number                         // 1, 2, 3...
  version_history: VersionEntry[]
  is_readonly: boolean                    // true quand envoyé

  // Partage
  share_tokens: ShareToken[]
  export_profiles_generated: ExportProfile[]

  created_at: string
  updated_at: string
  last_opened_at?: string
}

type BlockConfig = {
  block_id: string                        // "bien", "socio_eco", "fiscalite"...
  order: number
  visible: boolean
  collapsed: boolean
  user_overrides: Record<string, any>     // overrides traçables
}

type ShareToken = {
  token: string                           // URL publique
  profile: 'complet'|'synthese'
  recipient_label: string                 // "Client", "Banquier", "Courtier"...
  created_at: string
  expires_at?: string
  opened_count: number
  last_opened_at?: string
}
```

### `ScenarioInvest`
Défini dans spec Opportunités §2.3. Réutilisé tel quel.

Un dossier peut agréger **1 scénario principal** et **N scénarios secondaires**.

---

# 3. Liens transverses avec le reste du produit

## 3.1 Sources d'entrée autorisées

Un dossier peut être créé :
1. **Depuis une opportunité analysée** (mode prioritaire)
2. **Depuis un comparatif sauvegardé** (biens ou scénarios)
3. **Depuis un projet vierge** (via wizard 6 étapes)
4. **Depuis un bien du portefeuille**
5. **Depuis une annonce**
6. **Par duplication d'un dossier existant**

## 3.2 Liens entrants

- `Biens > Annonces` → action "Analyser en investissement" puis "Créer dossier"
- `Biens > Portefeuille` → action "Créer un dossier"
- `Veille > Biens suivis` → action "Basculer en opportunité" puis "Créer dossier"
- `Opportunités > Analyse modal > Récap` → CTA "Créer dossier" (prioritaire)
- `Opportunités > Comparatif sauvegardé` → CTA "Créer dossier depuis ce comparatif"
- `Observatoire > Contexte local` → "Ajouter cette ville au projet"
- `Leads` → rattacher un investisseur (persona agent)

## 3.3 Liens sortants depuis Dossiers

- Ouvrir l'analyse opportunité source
- Ouvrir les biens suivis liés
- Ouvrir l'Observatoire ville
- Créer un lead ou lier un lead existant (agent)
- Envoyer un rapport public (lien tokenisé)
- Exporter PDF (Complet / Synthèse)
- Générer une nouvelle version
- Créer une tâche / relance (bascule Leads)
- Pousser une alerte dans Veille

---

# 4. Vue synthétique des dossiers

## 4.1 Route

`/app/investissement/dossiers` — Onglet par défaut : **Dossiers**

## 4.2 Rôle

Cette page répond à :

> "Quels dossiers sont ouverts, pour qui, sur quelle stratégie, à quel niveau de maturité, et que dois-je faire ensuite ?"

Ce n'est pas un stockage de PDF. C'est une **vue de pilotage éditorial et commercial**.

## 4.3 Layout

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Dossiers investissement · 28                                             │
│ [Recherche] [Filtres] [Vue cards/liste]          [+ Nouveau dossier ▾]  │
├──────────────────────────────────────────────────────────────────────────┤
│ [Onglets segmentés : Dossiers | Projets]                                 │
├──────────────────────────────────────────────────────────────────────────┤
│ KPI row (4 KPIs actionnables)                                            │
├──────────────────────────────────────────────────────────────────────────┤
│ Chips filtres actifs                                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ [Grille de cards] ou [tableau dense]                                     │
└──────────────────────────────────────────────────────────────────────────┘
```

## 4.4 KPI row (4 KPIs actionnables)

Règle : 4 KPIs cliquables (chaque clic filtre la liste).

| KPI | Description | Persona agent | Persona investisseur |
|---|---|---|---|
| **Brouillons en cours** | Dossiers non finalisés | ✓ | ✓ |
| **À envoyer** | Dossiers finalisés non partagés | ✓ | ✓ |
| **Ouverts** | Dossiers dont le lien public a été consulté | "Ouverts par client" | "Ouverts par destinataire" |
| **Relances utiles** | Dossiers avec ouverture mais sans action depuis X jours | ✓ | "Dossiers à suivre" |

> La logique pipeline de relance détaillée reste dans `Leads`. Ici on expose seulement les signaux utiles et un lien contextuel "→ N leads liés à des dossiers à relancer".

## 4.5 Filtres

### Principaux
- Client / lead lié (persona agent)
- Conseiller / auteur
- Ville / zone principale
- Stratégie investisseur
- Statut du dossier
- Type de bien
- Période de création / MAJ

### Avancés
- Source de création (opportunité, projet vierge, annonce, portefeuille, duplicata)
- Régime fiscal principal retenu
- Score Propsight min
- TRI min
- Cashflow min
- Rendement net-net min
- Avec revente / sans revente
- Avec travaux / sans travaux
- Partagé / non partagé
- Ouvert / non ouvert

## 4.6 Statuts du dossier

```text
brouillon           → en construction
analyse_prete       → chiffres stabilisés, éditorial pas finalisé
finalise            → prêt à être partagé
envoye              → lien / PDF partagé
ouvert              → consulté au moins une fois
archive             → hors circuit actif
```

## 4.7 Card dossier

```text
┌────────────────────────────────────────────────────┐
│ [Photo bien / visuel projet]     [Statut badge]   │
├────────────────────────────────────────────────────┤
│ Dossier Lyon rendement — T2 Part-Dieu             │
│ Client : M. Durand   (agent only)                  │
│ Ville : Lyon 3e · Budget 180k · Rendement          │
├────────────────────────────────────────────────────┤
│ Bien retenu : T2 42m² · 149 000 €                  │
│ Régime principal : LMNP réel                       │
├────────────────────────────────────────────────────┤
│ Prix total │ Cash-flow ATF │ Net-net │ Score       │
│ 167k       │ +143 €        │ 5,6%    │ 62/100      │
├────────────────────────────────────────────────────┤
│ 👤 Cible : Jeunes actifs · Profondeur forte       │
├────────────────────────────────────────────────────┤
│ Dernière activité : ouvert hier 18:42              │
│ Version : v3                                       │
├────────────────────────────────────────────────────┤
│ [Ouvrir] [Dupliquer] [Partager] [⋯]                │
└────────────────────────────────────────────────────┘
```

### Champs card
- Titre du dossier
- Nom du client ou du lead (agent) / Nom du projet (investisseur)
- Ville / zone
- Stratégie
- Bien retenu ou mention "Projet vierge"
- **4 KPIs exactement** (Prix total, Cash-flow ATF, Net-net, Score)
- **Pill profil locataire** (type + profondeur)
- Date de dernière activité
- Statut (badge)
- Version
- Actions : Ouvrir · Dupliquer · Partager · menu ⋯

### Règles d'affichage
- Pas plus de 4 indicateurs sur la card
- Pas de narratif long
- Pas d'aperçu PDF miniature
- Profil locataire obligatoire en pill

## 4.8 Vue tableau dense

Colonnes par défaut (9 + actions) :

| # | Colonne |
|---|---|
| 1 | checkbox |
| 2 | Nom dossier (+ client si agent) |
| 3 | Ville / Bien retenu |
| 4 | Stratégie |
| 5 | Régime fiscal |
| 6 | Cash-flow ATF |
| 7 | Net-net |
| 8 | Score |
| 9 | Statut + Dernière activité |
| 10 | Actions (menu ⋯) |

### Colonnes configurables

- TRI 10 ans
- Total projet
- Apport
- Auteur
- Profil locataire cible
- Version
- Nombre d'ouvertures
- Date création
- Dernière relance

### Actions inline
- Ouvrir
- Dupliquer
- Partager
- Archiver
- Créer nouvelle version
- Rattacher à un lead (agent)

## 4.9 Empty state

Si aucun dossier :
```
Créez votre premier dossier d'investissement.

Vous pouvez partir :
[Créer un dossier depuis une opportunité]
[Créer un projet vierge (wizard)]
[Dupliquer un dossier modèle]

[Voir un exemple de dossier]
```

---

# 5. Projets créés

## 5.1 Rôle

Le `Projet` est le conteneur amont (voir spec Opportunités §2.1 pour la structure complète).

Il structure :
- Une ville cible (1 ou N)
- Un budget
- Une stratégie
- Un ou plusieurs investisseurs / porteurs
- Des opportunités présélectionnées
- Des villes suivies
- Des recherches sauvegardées
- Des scénarios
- Un ou plusieurs dossiers dérivés

### Principe clé

Un projet peut exister **sans dossier**.
Un dossier peut exister **sans bien source unique**.
Le projet permet de garder la logique de travail même quand le bien final n'est pas retenu.

## 5.2 Routes

- `/app/investissement/dossiers?tab=projets` (vue liste)
- `/app/investissement/dossiers/projets/[id]` (workspace)

## 5.3 Création d'un projet — wizard 6 étapes

**Unique parcours de création**, détaillé dans la spec Opportunités §8.

Accessible depuis :
- Page Dossiers > onglet Projets > `+ Nouveau projet` (split button)
- Page Opportunités > split button `Nouveau ▾`
- Popover "Changer de projet" > `+ Nouveau projet`

Étapes : Projet → Acquisition → Finance → Revenus & charges → Fiscalité → Résultats

À la fin du wizard :
- Création `ProjetInvestisseur` en base
- Création d'un `ScenarioInvest` de référence
- Optionnellement création d'un `DossierInvestissement` brouillon si bouton "Créer projet + dossier"
- Redirection vers `/app/investissement/dossiers/projets/[id]` (workspace projet)

## 5.4 Vue liste des projets

Onglet Projets de la page Dossiers.

### Card projet

```text
┌────────────────────────────────────────────────────┐
│ Projet principal                                   │
│ Grenoble · 150 000 € · Rendement                  │
├────────────────────────────────────────────────────┤
│ Étape actuelle : comparer des biens                │
│ 4 opportunités sauvegardées · 2 villes suivies     │
│ 1 comparatif · 0 dossier finalisé                  │
├────────────────────────────────────────────────────┤
│ 👤 Cible : Jeunes actifs · Profondeur forte       │
├────────────────────────────────────────────────────┤
│ Dernière activité : il y a 2 h                     │
│ [Ouvrir le projet] [Créer dossier] [⋯]             │
└────────────────────────────────────────────────────┘
```

## 5.5 Workspace projet

### Objectif

Espace de pilotage investisseur intermédiaire entre Opportunités et Dossiers.

### Layout

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Projet principal                                                     │
│ Grenoble · 150 000 € · Rendement · Progression 40%                  │
│ 👤 Cible : Jeunes actifs · Profondeur forte                          │
│ [Modifier] [Créer dossier] [Partager projet]                        │
├──────────────────────────────────────────────────────────────────────┤
│ Bloc 1 — Résumé projet                                               │
│ Bloc 2 — Étapes / checklist                                          │
│ Bloc 3 — Opportunités suggérées                                      │
│ Bloc 4 — Recherches sauvegardées                                     │
│ Bloc 5 — Villes suivies / villes proches  [+ Comparer zones]        │
│ Bloc 6 — Comparatifs sauvegardés (biens et villes)                  │
│ Bloc 7 — Scénarios sauvegardés                                       │
│ Bloc 8 — Dossiers dérivés                                            │
│ Bloc 9 — Timeline / notes / actions                                  │
└──────────────────────────────────────────────────────────────────────┘
```

### Bloc 1 — Résumé projet

- Ville(s) target
- Budget
- Stratégie
- Typologies cibles
- Mode d'exploitation cible
- Horizon de détention
- Apport disponible
- TMI si connue
- **Cible locataire visée** (profil obligatoire)
- **Profondeur de demande estimée** (sur les zones target)
- Taux d'effort de référence
- Niveau d'avancement (progress bar)

### Bloc 2 — Étapes / checklist

Template de parcours investisseur :
- ☐ Définir la ville principale
- ☐ Comparer 2 villes ou plus
- ☐ Sauvegarder une recherche
- ☐ Suivre au moins 3 biens
- ☐ Analyser 1 bien
- ☐ Comparer 2 scénarios
- ☐ Créer le dossier

Checklist éditable (le user peut ajouter/retirer).

### Bloc 3 — Opportunités suggérées

Cards opportunités filtrées sur le projet (budget, zones, stratégie). Mini-version des cards Opportunités.

Actions : Ouvrir · Suivre · Ajouter au comparatif · Analyser.

### Bloc 4 — Recherches sauvegardées

Recherches marché liées aux critères du projet.

Chaque item : nom · filtres résumés · dernière exécution · nombre de résultats · bouton `Rouvrir`.

### Bloc 5 — Villes suivies / villes proches

Inspiré de Solho, enrichi Propsight :

| Ville | Distance | Prix m² | Loyer m² | Rdt médian | Vacance | Profondeur | Profil dominant | Signal |
|---|---|---|---|---|---|---|---|---|
| Grenoble 3e | centre | 2 890 € | 13,80 € | 5,7% | 2,5% | Correcte | Étudiants | Meilleur rdt |
| Lyon 3e | 100km | 4 150 € | 17,20 € | 4,7% | 1,8% | Forte | Jeunes actifs | Meilleure tension |
| ... | | | | | | | | |

**Bouton `Comparer ces zones`** → ouvre modal `?comparatif-zones=[...]` (voir spec Opportunités §19).

### Bloc 6 — Comparatifs sauvegardés

Liste des comparatifs contextuels (biens et villes).

Chaque item :
- Type (biens / villes / mixte / scenarios)
- Items comparés (chips)
- Critères dominants
- Scénario ou zone retenue
- Date
- Bouton `Rouvrir le comparatif`

### Bloc 7 — Scénarios sauvegardés

Stocke les hypothèses de calcul retenues.

Exemples :
- `LMNP réel — apport 20% — travaux 25k`
- `Location nue — sans travaux — prêt 25 ans`
- `Colocation — meublé — gestion déléguée`

### Bloc 8 — Dossiers dérivés

Liste des dossiers créés depuis le projet. Mini-cards avec : nom · statut · score · dernière MAJ.

### Bloc 9 — Timeline / notes / actions

Historique léger (15 derniers événements) :
- Dossier créé
- Comparatif sauvegardé
- Lien partagé
- Projet ouvert par le client (agent)
- Bien supprimé du marché
- Note interne ajoutée
- Zone ajoutée

Zone de notes libres (textarea).

## 5.6 Règles produit du projet

- Un projet peut contenir plusieurs opportunités
- Un projet peut déboucher sur plusieurs dossiers
- Un projet peut être partagé en lecture seule (V1.1)
- Si un bien source disparaît du marché, le projet reste intact
- Le projet est la porte d'entrée idéale pour un client investisseur long cycle (agent) ou un investisseur en direct (cycles multi-mois)

---

# 6. Éditeur de dossier

## 6.1 Route

`/app/investissement/dossiers/[id]`

## 6.2 Rôle

L'éditeur transforme les données d'analyse en **document livrable**.

Il doit permettre :
- D'ajuster les chiffres (overrides traçables)
- De sélectionner le scénario principal
- D'activer / désactiver des blocs
- De réordonner le récit
- D'éditer les contenus inline
- De visualiser la preview en direct
- De produire des versions
- De partager (tokens URL)

## 6.3 Layout

L'éditeur réutilise strictement la logique du `TemplateRapport` mutualisé.

```text
┌────────────────────────────────────────────────────────────────────┐
│ ← Dossier Paris 15 — Hameau  · Finalisé · v1.3 · M. Millet        │
│ [Aperçu PDF] [Partager ▾] [Exporter ▾] [+ Nouvelle version]       │
├──────────┬──────────────────────────────────────┬─────────────────┤
│ STRUCTURE│                                       │ CONTENU         │
│          │                                       │ MISE EN PAGE    │
│ [+ Add]  │      [PREVIEW DOCUMENT]              │                 │
│          │                                       │ BLOC SÉLECTIONNÉ│
│ ≡ 1 Couv │      [Page 1/28 ...]                 │ Synthèse projet │
│ ≡ 2 Bien │                                       │                 │
│ ≡ 3 Marché│                                      │ TITRE           │
│ ≡ 4 Rdt   │                                      │ Synthèse projet│
│ ...       │                                      │                 │
│ ≡ 9 Concl │                                      │ STATUT          │
│           │                                       │ Finalisé ▾      │
│ [Annexes] │                                       │                 │
│           │                                       │ CADRE           │
│ [Réord.]  │                                       │ [Toggle]        │
│           │                                       │                 │
│           │                                       │ INDICATEURS     │
│           │                                       │ (liste 4 KPIs)  │
│           │                                       │ [+ Ajouter]     │
│           │                                       │                 │
│           │                                       │ STYLE           │
│           │                                       │ Thème · Couleur │
│           │                                       │                 │
│           │                                       │ VISIBILITÉ      │
│           │                                       │ [Toggle]        │
└──────────┴──────────────────────────────────────┴─────────────────┘
```

Split 20 / 50 / 30 (structure / preview / contenu).

### Règle densité

**Option 2 retenue** : la colonne Structure est **toggleable en drawer** pour libérer la preview. Au toggle off, la preview prend ~70% de la largeur, proche du A4.

Bouton toggle en haut de la colonne Structure : `≡` (icône hamburger) en mode ouvert, `⟶` en mode fermé.

### Header cible

```text
┌────────────────────────────────────────────────────────────────────┐
│ ← Dossier [titre] · [statut] · v[n] · [auteur]                    │
│ [Aperçu PDF] [Partager] [Exporter ▾] [Contenu ▸]                  │
└────────────────────────────────────────────────────────────────────┘
```

### Actions header

- **Aperçu PDF** : preview fullscreen (bascule mode preview)
- **Partager ▾** : dropdown avec profils persona-aware
  - Agent : `Partager avec le client` · `Copier le lien public` · `Envoyer par email`
  - Investisseur : `Partager cette analyse` → sous-menu `Banquier` / `Courtier` / `Conjoint` / `Comptable` / `Autre`
- **Exporter ▾** : dropdown profils
  - `Complet (PDF ~28 pages)`
  - `Synthèse (PDF ~8 pages)`
  - `Export données (CSV)` (tableau projet)
- **Nouvelle version** : duplique le contenu éditorial + paramètres, incrémente version
- **Menu ⋯** : Archiver · Dupliquer · Imprimer · Voir source opportunité

## 6.4 Band informatif snapshot (nouveau)

Juste sous le header, band fin (40px) :

```
📌 Créé depuis l'opportunité "15 Rue Hameau, Paris 15" le 14/05/2025
   Données marché : live (dernière sync : il y a 3 jours)
   Hypothèses : figées (snapshot du 14/05/2025)
   [Rafraîchir les données marché] [Voir l'opportunité source]
```

Si créé depuis projet vierge :
```
📌 Dossier créé depuis un projet vierge le 14/05/2025
   Aucun bien source ne lui est rattaché.
   [Associer un bien] [Voir le projet parent]
```

## 6.5 Modes de création du dossier

### Mode 1 — Depuis une opportunité analysée (prioritaire)

L'utilisateur clique `Créer dossier` depuis l'onglet Récap du modal Analyse.

Le système récupère :
- Bien (bien_id en référence live)
- Données marché (références live)
- Scénario financier actif (snapshot hypotheses + financing)
- Hypothèses fiscales (snapshot : regime, TMI, parts, millesime)
- Score Propsight (snapshot au moment de création)
- Overrides user (copiés)
- Comparatifs retenus (références)
- Projet parent éventuel (project_id)

**Règle snapshot hybride V1** :
- **Figés** : hypothèses scénario, overrides, décisions qualitatives
- **Live** : données marché, comparables, PLU, profil locataire IRIS

Voir spec Opportunités §17 pour le détail.

### Mode 2 — Depuis un comparatif sauvegardé

Le système crée un dossier avec :
- Bien gagnant du comparatif = scénario principal
- Autres biens comparés = scénarios alternatifs (ou annexés)
- Bloc comparatif pré-rempli avec les items comparés

### Mode 3 — Depuis un projet vierge (via wizard)

Option à la fin du wizard 6 étapes. Le dossier démarre sans bien unique.

Articulé autour d'une **thèse d'investissement** :
- Ville(s) cible
- Budget
- Typologie recherchée
- Stratégie
- Rendements cibles
- Profondeur de marché cible
- Profil locataire cible
- Recommandations d'acquisition

### Mode 4 — Depuis une annonce (module Biens)

Depuis `Biens > Annonces > [annonce]`, action "Créer un dossier d'investissement" → crée une opportunité + un dossier.

### Mode 5 — Depuis portefeuille (agent)

Depuis `Biens > Portefeuille > [bien]`, action "Créer un dossier d'investissement" pour préparer une revente ou un arbitrage.

### Mode 6 — Duplication

Duplique un dossier existant comme base de travail pour un nouveau client ou une nouvelle ville. Copie tout sauf :
- Le client / porteur (à redéfinir)
- Le titre (pré-rempli "Copie de X")
- Le statut (brouillon)

## 6.6 Structure interne de l'éditeur

### Colonne gauche — Structure éditoriale

Liste des blocs actifs avec :
- Poignée drag (`≡`)
- Numéro + nom du bloc
- Mini-résumé (1 ligne)
- Bouton édition (crayon)
- État : `✓` données dispo / `⚠` données manquantes / `🔄` calcul en cours

Actions sous la liste :
- `+ Ajouter une section` (ouvre popover avec blocs disponibles non utilisés)
- `Réorganiser les pages` (mode drag-reorder)

### Colonne centrale — Preview live

Rendu du dossier tel qu'il sera partagé / exporté. Pagination visible. Toggle desktop / mobile (simule responsive). Zoom 50 / 75 / 100%.

### Colonne droite — Contenu / Mise en page (panneau)

2 onglets :
- **Contenu** : config du bloc sélectionné (titre, sous-titre, indicateurs, style, visibilité)
- **Mise en page** : couleur accent, arrondi, thème global, police (V1 limitée à 2 polices)

Visible seulement quand un bloc est sélectionné.

### Drawer contextuel complémentaire

Si l'utilisateur clique sur :
- Un comparable dans la preview
- Une donnée PLU
- Un point marché
- Un profil locataire
- Un régime fiscal

Un drawer contextuel s'ouvre à droite (par-dessus le panneau contenu) avec le détail, sans casser l'édition. Fermeture par croix.

## 6.7 Règles d'édition

- **Autosave permanent** (debounced 2s) sur les modifications
- Toute modification de paramètre recalcule les indicateurs dépendants
- Le scénario principal peut être changé à tout moment (dropdown `Changer scénario ▾`)
- Les scénarios secondaires peuvent être conservés en annexes
- Un dossier envoyé devient **lecture seule** (statut `envoye` / `ouvert`)
- Une nouvelle version duplique les paramètres et le contenu éditorial, incrémente version, revient à statut `brouillon`
- Le dossier `ouvert` redevient éditable uniquement via nouvelle version

## 6.8 Données éditables inline

### Éditable inline directement dans la preview
- Titre dossier
- Sous-titre
- Note de synthèse
- Conclusion
- Points forts / points de vigilance (chips)
- Hypothèses de travaux (narratif)
- Wording des recommandations
- Sélection des comparables (clic pour épingler/dépingler)
- Ordre des blocs (via colonne structure)

### Non éditable manuellement sauf override tracé
- Séries marché
- Données socio-éco brutes
- DVF
- Données légales
- Score d'emplacement
- Profondeur de marché

### Overrides autorisés mais traçables

L'utilisateur peut modifier via le panneau Contenu :
- Loyer retenu
- Budget travaux
- Prix d'achat visé
- Taux / durée / apport
- Taxe foncière
- Vacance
- Charges
- Structure juridique
- Scénario de revente

**Chaque override est historisé** dans `snapshot.snapshot_overrides` :

```ts
{
  field: 'loyer_mensuel_hc',
  original_value: 1100,
  override_value: 1150,
  override_source: 'user',
  user_id: 'uuid',
  reason: 'Loyer négocié en hausse',  // optionnel
  timestamp: '2026-05-14T10:32:00Z'
}
```

Les overrides apparaissent dans le rapport avec une astérisque discrète + tooltip "Valeur ajustée par [auteur] le [date]".

## 6.9 Versioning

### Versions
- `v1` : première version
- `v2`, `v3`… : variantes ultérieures

### Déclencheurs nouvelle version
- Dossier déjà partagé (envoyé ou ouvert)
- Changement majeur de stratégie
- Nouveau bien retenu
- Hypothèses marché mises à jour manuellement
- À la demande explicite user

### Historique visible

Dans le header, clic sur `v1.3` → popover historique :
- Date
- Auteur
- Motif du changement (saisi à la création)
- Ouvertures / partages associés
- Bouton `Ouvrir cette version`

## 6.10 Partage

### Modes V1
- Lien web lecture seule (tokenisé)
- Export PDF (profil Complet ou Synthèse)
- Envoi par email (lien + message)
- Téléchargement local

### Profils de partage V1 (labels uniquement)

**Agent** :
- `Client` (profil Complet par défaut)
- `Banquier` (profil Synthèse)

**Investisseur** :
- `Client` (n/a)
- `Banquier`
- `Courtier`
- `Conjoint`
- `Comptable`
- `Autre`

V1 : le profil est un **label** qui détermine juste le template export (Complet ou Synthèse). V1.1 : templates dédiés par profil (banquier = focus finance/bancabilité, comptable = focus fiscalité).

### Comportement après partage
- Statut passe `envoye`
- Tracking des ouvertures (par token)
- Passage éventuel à `ouvert`
- Action suggérée dans Leads (persona agent) ou notes (investisseur)

---

# 7. Template du rapport investissement

## 7.1 Principe

Le dossier réutilise `rapportType = "dossier_invest"` du `TemplateRapport` mutualisé.

Le rapport doit être **dense mais hiérarchisé**, inspiré de Yanport dans la restitution, plus modulable et plus orienté décision investisseur.

## 7.2 Blocs par défaut activés pour `dossier_invest`

### Blocs activés par défaut (ordre par défaut)

| # | Block ID | Bloc |
|---|---|---|
| 1 | `couverture` | Couverture |
| 2 | `sommaire` | Sommaire |
| 3 | `agence` | En-tête agence / conseiller |
| 4 | `bien` | Présentation du bien |
| 5 | `photos` | Photos |
| 6 | `points` | Points forts / à défendre |
| 7 | `cadastre` | Cadastre |
| 8 | **`profil_cible`** | **Profil cible & profondeur de marché** (fusion ancien profil_cible + socio_eco + budget_revenu) |
| 9 | `solvabilite` | Solvabilité / calcul revenu requis |
| 10 | `score_emplacement` | Score d'emplacement |
| 11 | `services_proximite` | Services de proximité |
| 12 | `repartition_logements` | Répartition des logements |
| 13 | `prix_marche` | Prix de marché |
| 14 | `evolution_prix` | Évolution prix |
| 15 | `loyers_marche` | Loyers de marché |
| 16 | `evolution_loyers` | Évolution loyers |
| 17 | `rendement` | Rendements du marché |
| 18 | `tension` | Tension locative |
| 19 | `delais` | Délais de relocation |
| 20 | `historique_ventes` | Historique des ventes à l'adresse |
| 21 | `comp_vente` | Comparables vente |
| 22 | `comp_vendus` | Comparables vendus |
| 23 | `comp_location` | Comparables en location |
| 24 | `comp_loues` | Comparables loués |
| 25 | `focus_comp` | Focus comparable |
| 26 | `synthese_3_methodes` | Synthèse des 3 méthodes d'estimation |
| 27 | `ajustements` | Ajustements feature-par-feature |
| 28 | `reglementations` | Réglementations applicables |
| 29 | `urbanisme` | PLU / urbanisme / pipeline permis |
| 30 | `projet_invest` | Projet d'investissement (stratégie + scénario) |
| 31 | `analyse_financiere` | Analyse financière complète |
| 32 | `fiscalite` | Fiscalité comparée |
| 33 | `simulation_renov` | Simulation rénovation (si applicable) |
| 34 | `benchmark_placements` | Comparaison autres placements |
| 35 | `conclusion` | Conclusion & recommandation |
| 36 | `annexes` | Annexes |
| 37 | `footer` | Footer |

### Blocs optionnels (désactivables)
- `comp_invendus` : comparables retirés du marché
- `focus_comp` : si pas de comparable pertinent identifié
- `sommaire` : pour rapports courts
- `annexes` : pour rapports courts
- `simulation_renov` : uniquement si travaux > 10k€
- `benchmark_placements` : uniquement si mode investisseur

### Blocs obligatoires (non désactivables, même en Synthèse)
- `couverture`
- `bien` ou `projet_invest` (selon mode)
- **`profil_cible`** (wedge obligatoire)
- `analyse_financiere`
- `fiscalite`
- `conclusion`
- `footer`

## 7.3 Ordre recommandé (narratif)

L'ordre par défaut raconte une histoire investisseur :

### 1. Le contexte (pages 1-3)
- Couverture
- Sommaire
- En-tête agence / conseiller

### 2. Le bien (pages 4-6)
- Présentation du bien
- Photos
- Points forts / à défendre

### 3. **Le profil cible et le marché qui le compose** (pages 7-9)
- Profil cible & profondeur de marché (obligatoire, wedge)
- Solvabilité / calcul revenu requis
- Score d'emplacement + services

### 4. Le marché (pages 10-14)
- Prix de marché + évolution
- Loyers de marché + évolution
- Tension locative + délais
- Historique ventes adresse

### 5. Les comparables (pages 15-17)
- Vente / vendus
- Location / loués
- Focus comparable

### 6. L'estimation multi-méthodes (page 18)
- Synthèse 3 méthodes
- Ajustements feature-par-feature

### 7. Le cadre légal et urbain (pages 19-20)
- Réglementations
- PLU / urbanisme / permis

### 8. Le projet d'investissement (pages 21-24)
- Projet d'investissement (stratégie + scénario)
- Analyse financière complète
- Fiscalité comparée
- Simulation rénovation (si applicable)

### 9. La mise en perspective (page 25)
- Benchmark placements

### 10. La décision (pages 26-28)
- Conclusion & recommandation
- Annexes
- Footer

**Principe narratif** : le rapport commence par le bien et son contexte humain (profil cible), puis descend progressivement dans le financier et le fiscal, pour remonter à la décision. C'est l'inverse d'un simulateur froid qui démarre par les chiffres.

## 7.4 Détail des blocs différenciants

### `profil_cible` (ex-fusion socio_eco + profil_cible + budget_revenu)

**Bloc obligatoire, wedge central du produit.**

Structure :

```
👤 Profil locataire cible & profondeur de marché

Partie 1 — Le marché local
   Secteur : Paris 15e — Hameau
   Population : 42 800 habitants
   Nombre de ménages : 19 200
   Revenu médian : 3 450 €/mois
   Structure ménages : 48% seules, 32% couples, 20% familles

Partie 2 — Le profil cible identifié
   Cible dominante : Jeunes actifs / Couples sans enfant
   Cible secondaire : Étudiants en écoles supérieures

Partie 3 — Calcul de solvabilité
   Loyer cible : 1 100 €/mois HC
   Taux d'effort de référence : 33%
   Revenu indicatif requis : 3 333 €/mois
   Calcul : 1 100 × 3 = 3 333

Partie 4 — Profondeur de la demande
   Part de la population compatible : 28%
   Profondeur : Forte
   Niveau de confiance : Élevé

Partie 5 — Sources
   Filosofi IRIS (Insee) · Structure ménages INSEE ·
   Distribution revenus IRIS 2023
```

**Règle** : même en profil Synthèse, ce bloc survit avec une version condensée (Parties 2 + 3 + 4 uniquement).

### `solvabilite`

Bloc stratégique complémentaire au `profil_cible`. Détaille le calcul :

- Loyer retenu
- Taux d'effort utilisé (paramétrable)
- Revenu requis calculé
- Distribution des revenus IRIS (graphe)
- % population compatible (calcul détaillé)
- Comparaison avec taux d'emploi local
- Lecture : demande large vs fragile

Voir `06_BLOC_SOLVABILITE.md` pour le détail complet.

### `projet_invest`

Bloc narratif + structurant. Présente la logique de projet, pas seulement des chiffres.

Affiche :
- Objectif investisseur
- Profil de stratégie
- Horizon de détention
- Cible de rendement
- Cible de cashflow
- Niveau de travaux acceptable
- Typologie de locataire visée
- Scénario principal retenu
- Variantes possibles (scénarios secondaires)

### `analyse_financiere`

Bloc central du dossier. Agrège :
- Acquisition (prix, frais, travaux, ameublement)
- Financement (apport, dette, mensualité, coût crédit)
- Charges (copro, TF, gestion, GLI, vacance)
- Revenus (loyer, revalorisation)
- Cashflow (mensuel, annuel, cumulé)
- Revente (plus-value, fiscalité sortie)
- Sensibilité (prudent / central / optimisé)
- Effort d'épargne

Tableau prévisionnel 10 ans + courbes :
- Trésorerie cumulée
- Capital remboursé
- Valeur nette patrimoniale

### `fiscalite`

**Périmètre V1 (figé — alignement avec spec Opportunités §14.2)** :

**Régimes V1 complets (calculs réels)** :
- Location nue — micro-foncier
- Location nue — réel (déficit foncier inclus)
- LMNP — micro-BIC
- LMNP — réel

**Régimes V1 mockés (affichage uniquement)** :
- LMP
- SCI à l'IR
- SCI à l'IS
- Colocation (variante de LMNP)
- Courte durée / meublé touristique

**Règles produit** :
- **Pinel** : présent uniquement comme régime legacy historique, pas comme tunnel de recommandation
- Les paramètres légaux sont **versionnés par millésime** (config admin)
- Toutes les simulations fiscales sont présentées comme **estimatives**

### `reglementations`

Bloc optionnel mais recommandé si :
- Courte durée
- Location meublée
- Zone tendue
- Encadrement des loyers
- DPE dégradé
- Permis de louer
- Destination / changement d'usage

### `urbanisme`

Différenciateur fort Propsight.

À afficher :
- Zonage PLU
- Servitudes
- Opérations voisines
- Permis récents
- Signaux de transformation du quartier
- Impacts potentiels sur valeur long terme
- Carte avec contour parcelle

### `benchmark_placements`

Encart comparaison pédagogique (règles strictes) :

| Placement | Rendement | Liquidité | Risque | Millésime |
|---|---|---|---|---|
| Fonds euros | 2,5% | élevée | très faible | 2026 |
| Livret A | 3,0% | élevée | très faible | 2026 |
| OAT 10 ans | 3,2% | moyenne | faible | 2026 |
| SCPI cible | 4,5% | faible | moyen | 2026 |
| Ce bien (net) | 4,9% | faible | moyen | — |
| Ce bien (cash-on-cash) | 6,8% | faible | moyen | — |

**Règles légales obligatoires** :
- Pas de conseil financier réglementé
- Comparatif purement pédagogique
- Mentions : "Valeurs indicatives au [date]. Ne constitue pas un conseil en investissement."
- Benchmark administrable côté back-office (pas en code)

## 7.5 Moteur fiscal millésimé — structure admin

Tous les barèmes fiscaux vivent dans une config admin (`/admin/fiscal-config`), versionnée par année :

```ts
type FiscalMillesime = {
  millesime: number                       // 2026
  effective_from: string                  // "2026-01-01"
  effective_to: string                    // "2026-12-31"

  bareme_ir: TrancheIR[]                  // tranches TMI
  parts_plafond_qf: number

  micro_foncier_plafond: number           // 15 000 €
  micro_foncier_abattement: number        // 0.30

  micro_bic_plafond: number               // 77 700 €
  micro_bic_abattement_lmnp: number       // 0.50
  micro_bic_abattement_meuble_touristique: number  // 0.30 (si V1.1)

  reel_foncier_charges_deductibles: string[]
  reel_foncier_deficit_plafond: number    // 10 700 €

  lmnp_reel_amortissement_bien: {
    repartition_moyenne: number           // 0.85 part construction
    duree_annees: number                  // 25-40
  }
  lmnp_reel_amortissement_mobilier: {
    duree_annees: number                  // 5-10
  }

  plus_value_immobiliere: {
    abattement_duree: AbattementYear[]    // progressif
    exoneration_totale_duree: number      // 22/30 ans selon cas
    cfl_rate: number                      // 0.172
  }

  cfe_estimation: CFERange[]

  benchmark_placements: BenchmarkValue[]  // référence datée

  sources: string[]                       // liens officiels
  last_updated_at: string
  updated_by: string                      // admin user
}
```

Interface admin `/admin/fiscal-config` permet :
- Dupliquer un millésime vers l'année N+1
- Éditer les valeurs
- Marquer un millésime comme "en production"
- Archiver un ancien millésime

**Côté user** : chaque `ScenarioInvest.millesime_fiscal` pointe vers un millésime. À la finalisation d'un dossier, snapshot du millésime. Au rechargement d'un vieux dossier, affichage d'un badge "Calculé avec règles fiscales [année]" + bouton "Recalculer avec règles [année actuelle]".

---

# 8. Profils d'export (Complet / Synthèse)

## 8.1 Principe

Le user choisit le profil au moment de l'export, pas au moment de la création.
Un même dossier peut être exporté en Complet pour le client et en Synthèse pour le banquier.

## 8.2 Profil Complet (~28 pages)

Tous les 37 blocs activés par défaut. C'est le profil canonique du rapport investissement, inspiré Yanport.

Public cible : client investisseur, dossier personnel, comptable.

## 8.3 Profil Synthèse (~8 pages)

Version condensée. Blocs retenus :

| # | Block ID | Justification |
|---|---|---|
| 1 | `couverture` | Identité |
| 2 | `bien` (version condensée) | Le bien en 1 page |
| 3 | `profil_cible` (version condensée) | **Obligatoire même en Synthèse** |
| 4 | `analyse_financiere` (version condensée) | Chiffres clés |
| 5 | `fiscalite` (recommandation seule, pas la matrice) | Régime retenu |
| 6 | `urbanisme` (synthèse seule) | Signal PLU |
| 7 | `conclusion` | Décision |
| 8 | `footer` | Mentions légales |

Les blocs retirés :
- Photos (1 seule en cover)
- Comparables détaillés
- Synthèse 3 méthodes
- Ajustements
- Historique ventes
- Services détaillés
- Benchmark placements
- Annexes

Public cible : banquier, courtier, synthèse rapide.

## 8.4 UI de sélection du profil

Au clic `Exporter ▾` :

```
┌─ Choisir un profil d'export ──────────────┐
│                                            │
│ ⦿ Complet (28 pages, ~2 Mo)                │
│   Version détaillée, pour le client        │
│                                            │
│ ○ Synthèse (8 pages, ~600 Ko)              │
│   Version courte, pour banquier/courtier   │
│                                            │
│ Format :  ⦿ PDF   ○ HTML (lien public)    │
│                                            │
│ [Annuler]                [Générer l'export]│
└────────────────────────────────────────────┘
```

---

# 9. Comportements métier clés

## 9.1 Projet vierge

Le dossier peut être créé sans annonce via le wizard 6 étapes (voir spec Opportunités §8).

Cas d'usage :
- Investisseur veut d'abord comparer des villes
- Agent prépare une stratégie avant la chasse
- Marchand de biens veut tester une zone
- Client demande un cadrage avant recherche active

Le template supporte :
- `bien_non_defini` (les blocs bien-dependant affichent "à définir" ou sont masqués)
- `comparables / marché / scénario sans bien final`
- Wording spécifique : "thèse d'investissement" au lieu de "bien retenu"

## 9.2 Comparatifs contextuels

Les comparatifs :
- Ne créent pas de page dédiée
- S'ouvrent en modale contextuelle (biens OU villes)
- Peuvent être sauvegardés (objet `Comparaison`)
- Réapparaissent dans le projet et dans Veille > Biens suivis

## 9.3 Partage avec destinataire

Le lien public du dossier peut montrer :
- Le dossier intégral (Complet)
- Une version allégée (Synthèse)
- (V1.1) Un scénario spécifique uniquement

V1 : lecture seule pour le destinataire.

## 9.4 Pilotage commercial

**Aucun mini-CRM dans Dossiers.**

Mais le dossier pousse vers `Leads` les événements suivants :
- `dossier_envoye`
- `dossier_ouvert`
- `dossier_nouvelle_version`
- `dossier_action_a_relancer`

Le lien contextuel `→ N leads à relancer` s'affiche dans la KPI row.

---

# 10. États, empty states, loading

## 10.1 Empty states

### Aucun dossier
Voir §4.9.

### Aucun projet
```
Créez votre premier projet d'investissement pour identifier les
meilleures opportunités selon votre stratégie.

[Créer mon projet] [Voir un exemple]
```

### Aucun bien source (dossier projet vierge)
```
Ce dossier n'a pas encore de bien retenu.
Explorez les opportunités compatibles avec votre projet.

[Voir les opportunités compatibles] [Créer une alerte]
```

### Dossier en calcul
```
[Skeleton des blocs]
Analyse en cours…
```

## 10.2 Loading

- Skeleton cards (animation shimmer)
- Skeleton rows pour liste dense
- Jamais de spinner central plein écran
- Indicateur de recalcul dans l'éditeur : pill discrète top-right "Calcul…"
- Autosave en cours : pill "Sauvegarde…" dans le header

## 10.3 États AVM indisponible

Si l'AVM n'a pas répondu lors du snapshot :
- Affiche les valeurs connues (prix affiché, données marché)
- Remplace les KPIs calculés par `—` avec tooltip
- Badge `AVM indispo` orange dans le band info
- Bouton `Réessayer`

## 10.4 États dégradés

- Données source douteuses → badge `À vérifier`
- Millésime fiscal obsolète (>18 mois) → badge `Règles fiscales anciennes, recalculer`
- Overrides user sur valeurs critiques → badge `Valeurs modifiées`
- Bien source disparu du marché → band alerte "Le bien source n'est plus disponible. Le dossier reste consultable mais les données marché ne se rafraîchissent plus."

---

# 11. Structure technique recommandée

```text
/app/investissement/dossiers
├── page.tsx                            ← landing avec switch Dossiers / Projets
├── /projets/[id]/page.tsx              ← workspace projet
└── /[id]/page.tsx                      ← éditeur dossier

/components/investissement/dossiers/
├── DossiersLanding.tsx
├── SwitchSegmented.tsx                 ← Dossiers | Projets
├── KPIRowDossiers.tsx                  ← 4 KPIs actionnables
├── ListeDossiers.tsx
├── CardDossier.tsx
├── TableDossiers.tsx
├── ListeProjets.tsx
├── CardProjet.tsx
├── ProjetWorkspace.tsx
├── BlocResumeProjet.tsx
├── BlocEtapesProjet.tsx
├── BlocOpportunitesProjet.tsx
├── BlocRecherchesSauvegardees.tsx
├── BlocVillesSuivies.tsx               ← avec bouton Comparer zones
├── BlocComparatifsSauvegardes.tsx      ← biens ET villes
├── BlocScenariosSauvegardes.tsx
├── BlocDossiersDerivesPostProjet.tsx
├── BlocTimelineProjet.tsx
├── HeaderDossierInvest.tsx
├── BandInfoSnapshot.tsx                ← nouveau
├── ModaleCreationDossier.tsx
├── ModaleChoixProfilExport.tsx
├── DropdownPartage.tsx                 ← persona-aware
└── PopoverVersionHistory.tsx

/components/investissement/shared/
├── BlocProfilLocataire.tsx             ← variantes card / pill / tab / plein
├── BlocSolvabilite.tsx
├── BlocScoreBreakdown.tsx
└── BlocCoherenceProjet.tsx

/services/investissement/
├── useDossiers.ts
├── useProjets.ts
├── useScenario.ts
├── useAutoSaveEditor.ts                ← debounce 2s
├── useShareTokens.ts
├── useVersioning.ts
└── useExportPDF.ts

/mocks/handlers/
├── dossiers.ts
├── projets.ts
├── scenarios.ts
├── historique_ouvertures.ts
├── comparatifs.ts
└── fiscal_config.ts                    ← millésimes

/admin (V1 optionnel)
└── fiscal-config/
    └── page.tsx                        ← gestion millésimes
```

### Réutilisations obligatoires

- `TemplateRapport` (moteur mutualisé avec Avis de valeur + Étude locative)
- `PanneauContenu` (droite)
- `ModaleComparables` (drawer)
- `BlocSolvabilite`
- `BlocProfilLocataire` (cross-module)
- `WizardCreation` (pour mode projet vierge)
- Handlers MSW existants opportunités / estimations / comparables

---

# 12. Prompt Claude Code

```text
On construit le sous-module Dossiers du module Investissement pour Propsight.

Lis d'abord :
- /docs/13_DOSSIER_INVESTISSEMENT.md (ce document, V2)
- /docs/12_OPPORTUNITES_INVESTISSEMENT.md (spec Opportunités, notamment §8 wizard et §17 snapshot)
- /docs/03_TEMPLATE_RAPPORT.md (moteur rapport mutualisé)
- /docs/06_BLOC_SOLVABILITE.md
- /docs/02_LAYOUT_PRO.md

Objectif : implémenter le sous-module complet avec 4 briques :
1. Vue synthétique des dossiers (landing avec switch Dossiers/Projets)
2. Vue synthétique des projets
3. Workspace projet investisseur
4. Éditeur de dossier branché sur le TemplateRapport avec rapportType="dossier_invest"

Contraintes :
- Respecter la densité UI Propsight (Linear / Attio / Yanport Agent 360)
- KPI row = 4 KPIs actionnables (brouillons, à envoyer, ouverts, relances)
- Card dossier = 4 KPIs (Prix total, Cash-flow ATF, Net-net, Score) + pill profil locataire
- Vue table = 9 colonnes par défaut + configurables
- Pas de page dédiée pour les comparatifs : modale contextuelle uniquement
- Les comparatifs sauvegardés (biens ET villes) doivent remonter dans le projet et dans Veille > Biens suivis
- Le dossier doit pouvoir être créé depuis une opportunité analysée OU depuis un projet vierge
- Tous les régimes fiscaux V1 doivent être supportés (4 réels + 4 mockés), paramètres légaux configurables
- Éditeur : colonne Structure toggleable en drawer pour libérer la preview
- Snapshot hybride Opportunité → Dossier (hypothèses figées, marché live)
- Export : 2 niveaux (Complet / Synthèse), profil locataire obligatoire dans les deux
- UI persona-aware (labels agent vs investisseur, dropdown partage différent)

À implémenter :

1. Route `/app/investissement/dossiers/page.tsx`
   - Header + search + filtres + split button persona-aware
   - Switch segmenté `Dossiers / Projets`
   - KPI row (4 KPIs actionnables)
   - Vue cards + vue table (toggle)

2. Composants de liste Dossiers
   - `CardDossier.tsx` (4 KPIs + pill profil locataire)
   - `TableDossiers.tsx` (9 colonnes par défaut)
   - `ListeDossiers.tsx` (wrapper toggle)

3. Composants de liste Projets
   - `CardProjet.tsx` (avec pill profil locataire)
   - `ListeProjets.tsx`

4. Route `/app/investissement/dossiers/projets/[id]/page.tsx`
   - workspace projet complet
   - Bloc 1 Résumé projet (avec cible locataire)
   - Bloc 2 Étapes / checklist
   - Bloc 3 Opportunités suggérées
   - Bloc 4 Recherches sauvegardées
   - Bloc 5 Villes suivies + bouton Comparer zones
   - Bloc 6 Comparatifs sauvegardés (biens + villes)
   - Bloc 7 Scénarios sauvegardés
   - Bloc 8 Dossiers dérivés
   - Bloc 9 Timeline / notes

5. Route `/app/investissement/dossiers/[id]/page.tsx`
   - Header dossier (titre, statut, version, actions persona-aware)
   - Band info snapshot (créé depuis, dernière sync, boutons)
   - Branchement `TemplateRapport rapportType="dossier_invest"`
   - Colonne Structure toggleable
   - Dropdown changer scénario
   - Dropdown partage persona-aware (Client / Banquier / Courtier / Comptable…)
   - Modale choix profil export (Complet / Synthèse)

6. Créer les fixtures et handlers MSW nécessaires
   - Projets investisseur (3-5 profils : agent gère clients, investisseur en direct)
   - Dossiers investissement (10+ dossiers variés statuts)
   - Scénarios (principal + secondaires)
   - Historique d'ouvertures / partages
   - Comparatifs sauvegardés (biens + villes)
   - Millésimes fiscaux (2024, 2025, 2026)

7. Étendre le registry du TemplateRapport pour `dossier_invest`
   - Activer les 37 blocs par défaut (voir §7.2)
   - Vérifier l'ordre narratif (§7.3)
   - Support profil_cible obligatoire (ex-fusion 3 blocs)
   - Support benchmark_placements avec valeurs configurables
   - Support mode projet vierge (blocs bien-dependant masqués ou placeholder)

8. Prévoir les composants / placeholders dédiés pour :
   - `BlocProjetInvest`
   - `BlocAnalyseFinanciere`
   - `BlocFiscaliteInvest` (matrice 4 régimes réels + 4 mockés badge V1.1)
   - `BlocSimulationRenov`
   - `BlocProfilCible` (fusion socio_eco + profil_cible + budget_revenu)
   - `BlocBenchmarkPlacements` (avec mentions légales)

9. Moteur fiscal millésimé
   - Types `FiscalMillesime`
   - Config mock pour 2025 et 2026
   - Hook `useFiscalConfig(millesime)`
   - Badge "Règles fiscales [année]" dans le dossier
   - Bouton "Recalculer avec règles actuelles"

10. Export PDF
    - Profil Complet : les 37 blocs
    - Profil Synthèse : 8 blocs (profil_cible obligatoire)
    - Modale de choix profil avant génération
    - Preview possible avant export

11. Versioning
    - Incrémentation automatique quand dossier envoyé + modification
    - Popover history au clic sur v[n]
    - Possibilité d'ouvrir une ancienne version (lecture seule)

12. Validation visuelle
    - Desktop 1440px prioritaire
    - Pas de scroll horizontal
    - Sticky header correct
    - Cards denses mais lisibles (4 KPIs + pill)
    - Preview rapport cohérente avec Yanport-like output
    - Colonne Structure toggleable fluide

13. Commit final
    - `git add -A`
    - `git commit -m "13: module dossiers investissement complet"`
```

---

# 13. Checklist validation produit

### Vue Dossiers
- [ ] Les dossiers sont visibles en cards et en table
- [ ] Les statuts sont clairs (brouillon / analyse_prete / finalise / envoye / ouvert / archive)
- [ ] Le lien vers le pipeline commercial reste contextuel, sans dupliquer le CRM
- [ ] Les 4 KPIs exposent bien l'activité utile
- [ ] Profil locataire visible sur chaque card (pill)

### Vue Projets
- [ ] Un projet peut exister sans dossier final
- [ ] Un projet peut exister sans bien source unique
- [ ] Les opportunités, comparatifs et scénarios sont visibles au même endroit
- [ ] Profil locataire cible visible dans le résumé projet
- [ ] Bouton "Comparer zones" fonctionne dans bloc 5

### Workspace projet
- [ ] Les 9 blocs sont présents et dans le bon ordre
- [ ] Bloc villes avec bouton Comparer zones
- [ ] Bloc comparatifs affiche biens ET villes
- [ ] Timeline historise les événements

### Éditeur de dossier
- [ ] Le dossier peut être créé depuis une opportunité ou un projet vierge
- [ ] Band info snapshot affiche la source et les données live/figées
- [ ] Le scénario principal est sélectionnable via dropdown
- [ ] Le dossier envoyé devient lecture seule
- [ ] La nouvelle version est proprement historisée
- [ ] Colonne Structure toggleable fonctionne
- [ ] Autosave debounced 2s

### Persona
- [ ] Labels substitués (Dossier client vs Mon dossier, etc.)
- [ ] Dropdown partage adapté (Client seul pour agent, Banquier/Courtier/etc. pour investisseur)
- [ ] CTAs quick actions adaptés
- [ ] Titre par défaut adapté au persona

### Rapport investissement
- [ ] Les 37 blocs sont présents et activables
- [ ] L'ordre par défaut suit la narration (§7.3)
- [ ] Bloc profil_cible fusionné et obligatoire
- [ ] Le rapport est modulable via le panneau Contenu
- [ ] L'export PDF Complet est lisible et professionnel (~28 pages)
- [ ] L'export PDF Synthèse préserve le profil_cible (~8 pages)

### Moteur fiscal V1
- [ ] 4 régimes réels calculés : micro-foncier, réel foncier, LMNP micro, LMNP réel
- [ ] 4 régimes mockés avec badge "V1.1"
- [ ] Millésime fiscal configurable (admin)
- [ ] Snapshot millésime à la finalisation
- [ ] Bouton "Recalculer avec règles actuelles" sur dossiers anciens

### Snapshot hybride
- [ ] Hypothèses scénario figées à la création
- [ ] Données marché live (comparables, prix zone, tension)
- [ ] Band info visible en haut du dossier
- [ ] Bouton "Rafraîchir données marché" fonctionne
- [ ] Overrides user tracés (auteur + date)

### Partage
- [ ] Modale choix profil (Complet / Synthèse)
- [ ] Labels destinataire (Client / Banquier / Courtier / etc.)
- [ ] Tracking ouverture par token
- [ ] Bascule statut envoye → ouvert automatique

---

# 14. Hors scope V1 (explicite)

Ces éléments sont identifiés comme non-livrables V1 mais documentés ici pour la V1.1 / V2 :

### V1.1 (post-juillet)
- Templates dédiés par profil de partage (banquier = focus finance, comptable = focus fiscalité)
- Partage d'un scénario spécifique (pas le dossier complet)
- Régimes fiscaux mockés → calcul réel (LMP, SCI IR, SCI IS, courte durée)
- Partage de projet en lecture seule
- Multi-projets actifs parallèles pour un agent (tab switcher pour gérer 10 clients investisseurs)
- Collaboration en temps réel sur un dossier (présence + édition)

### V2
- Portefeuille investisseur (post-acquisition : biens détenus, cash-flow agrégé, calendrier fiscal)
- Matching vendeur ↔ investisseur type Tinder
- Commissionnement transactionnel
- Marketplace de services opérée
- Workflows juridiques transaction
- Montages patrimoniaux avancés (démembrement, marchand complexe)
- Scoring emplacement façon Cityscan
- Isochrones piétonniers
- Alertes zone prédictives ML
- Score ESG / durabilité des biens
- Intégration courtiers / banques (API)
- Signature électronique des mandats

---

# 15. Source de vérité finale

Ce document est la **source de vérité V1** du sous-module `Dossiers` côté Investissement.

Il doit être lu en complément de :
- la spec `Opportunités` (`12_OPPORTUNITES_INVESTISSEMENT.md`)
- le `TemplateRapport` mutualisé (`03_TEMPLATE_RAPPORT.md`)
- le bloc `Solvabilité` (`06_BLOC_SOLVABILITE.md`)
- les règles globales du layout Pro (`02_LAYOUT_PRO.md`)

---

# 16. Changelog V1 → V2

### Ajouts majeurs
- §0.4 Profil locataire obligatoire dans le livrable (survit à Synthèse)
- §0.5 Matrice persona agent vs investisseur (détaillée)
- §6.4 Band info snapshot (nouveau)
- §6.10 Profils de partage persona-aware
- §7.2 Fusion `profil_cible` (ex 3 blocs séparés)
- §7.3 Ordre narratif du rapport (avec le profil cible avant les chiffres)
- §7.5 Moteur fiscal millésimé (structure admin détaillée)
- §8 Profils d'export Complet / Synthèse (détail blocs retenus)
- §10 États dégradés complets (AVM indispo, millésime obsolète, bien disparu)

### Corrections majeures
- §4.7 Card dossier = 4 KPIs exactement (Prix total, Cash-flow ATF, Net-net, Score) + pill profil
- §4.8 Vue table = 9 colonnes par défaut (ajout Profil cible configurable)
- §5.5 Workspace projet bloc 5 avec bouton Comparer zones
- §5.5 Workspace projet bloc 6 affiche biens ET villes
- §6.3 Colonne Structure toggleable pour libérer la preview
- §7.4 Fiscalité V1 : 4 régimes réels + 4 mockés (vs 8 complets)
- §7.4 Pinel = legacy seulement, pas un tunnel

### Scope V1 clarifié
- Régimes fiscaux réels : micro-foncier, réel foncier, LMNP micro, LMNP réel
- Régimes mockés V1 : LMP, SCI IR, SCI IS, courte durée
- Profil locataire obligatoire même en export Synthèse
- Snapshot hybride : hypothèses figées + marché live
- Profils de partage = labels V1, templates dédiés V1.1

---

Fin de la spec Dossier V2.
