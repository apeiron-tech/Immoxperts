# 40 — WIDGETS PUBLICS

Maquettes statiques à livrer pour la feature **Widgets publics** de Propsight :
2 plugins embeddables sur le site du partenaire (vendeur + investisseur), leur
configuration côté Pro, et leur feedback dans le CRM.

**Scope de ce doc** : UI + données mockées. Pas d'implémentation backend, pas d'API
réelle, pas d'intégration AVM. Tout est en dur dans des fixtures.

---

## 0. Contexte

2 plugins publics en marque blanche légère :

- **Estimation vendeur** — un propriétaire saisit son bien, obtient une fourchette,
  laisse ses coordonnées → lead vendeur qualifié côté agent.
- **Projet investisseur** — un investisseur décrit son projet, obtient une stratégie
  recommandée + scénarios alternatifs, laisse ses coordonnées → lead investisseur
  qualifié côté agent.

Les 2 widgets partagent la même infra de configuration côté Pro (9 onglets
identiques). Le public voit simple ; l'agent voit riche.

Feature **conditionnelle à l'abonnement** — la section n'apparaît dans la sidebar
Pro que si l'organisation a activé l'option Widget.

---

## 1. Décisions V1 (figées, ne pas rediscuter)

| # | Sujet | Décision |
|---|---|---|
| 1 | Placement sidebar | Top-level "Widgets publics" entre *Prospection* et *Estimation*, conditionnel à l'abo |
| 2 | Volet Paramètres | Léger — juste code embed rapide sous `/app/parametres/widgets` |
| 3 | Nombre d'instances | 2 max par organisation (1 vendeur + 1 investisseur), pré-instanciées à l'abo |
| 4 | Variantes persona | 1 seule variante neutre configurable (logo / couleur / ton) |
| 5 | Stratégie investisseur | Calculée par ML (AVM+) — mock typé pour les maquettes |
| 6 | WhatsApp | Lien `wa.me` avec message pré-rempli (pas d'API WhatsApp Business) |
| 7 | Webhook CRM | Oui dès V1 (URL cible + événements + secret + test) |
| 8 | Export CSV | Oui dès V1 (manuel, depuis Intégration) |
| 9 | Brief RDV | Asset lié au lead, affiché depuis `/app/activite/leads/[id]`, pas depuis la config widget |
| 10 | OpenClaw | Bloc "Orchestration avancée" activable dans Automatisations, pas des cases partout |
| 11 | Toggle Public/Agent | Présent sur chaque champ de résultat (œil ouvert / œil barré) |
| 12 | Parcours public | 7 écrans distincts (pas de version compressée en V1) |

---

## 2. Architecture — Routes & sidebar

### 2.1 Ajout sidebar Pro

Entre `4. Prospection` et `5. Estimation`, nouvelle section conditionnelle :

```
5. Widgets publics                          [conditionnel abo]
   • Vue d'ensemble                  /app/widgets
   • Estimation vendeur              /app/widgets/estimation-vendeur
   • Projet investisseur             /app/widgets/projet-investisseur
```

Ne pas ajouter Automatisations / Templates / Performance comme items sidebar —
ce sont des **onglets internes** à chaque widget (cf. §3.2).

La numérotation sidebar décale : `Estimation` devient 6, `Investissement` 7, etc.

### 2.2 Table des routes

**Pro (authentifié)**

| Route | Contenu |
|---|---|
| `/app/widgets` | Hub — vue d'ensemble des 2 widgets + activité récente |
| `/app/widgets/estimation-vendeur` | Config widget vendeur, tab par défaut : `vue-ensemble` |
| `/app/widgets/estimation-vendeur/etapes` | Tab Étapes |
| `/app/widgets/estimation-vendeur/apparence` | Tab Apparence |
| `/app/widgets/estimation-vendeur/formulaire` | Tab Formulaire |
| `/app/widgets/estimation-vendeur/contenu-resultat` | Tab Contenu résultat |
| `/app/widgets/estimation-vendeur/automatisations` | Tab Automatisations |
| `/app/widgets/estimation-vendeur/templates` | Tab Templates |
| `/app/widgets/estimation-vendeur/integration` | Tab Intégration |
| `/app/widgets/estimation-vendeur/performance` | Tab Performance |
| `/app/widgets/projet-investisseur/*` | Mêmes 9 tabs |
| `/app/parametres/widgets` | Volet light — statut + code embed rapide, renvoie vers `/app/widgets` pour config détaillée |
| `/app/activite/leads/[id]` | Fiche lead enrichie widget (Brief RDV, Insights agent) |

**Public (non authentifié)**

| Route | Contenu |
|---|---|
| `/widget/estimation?agent_id=xxx&theme=xxx` | Iframe plugin vendeur, 7 écrans |
| `/widget/investissement?agent_id=xxx&theme=xxx` | Iframe plugin investisseur, 7 écrans |

---

## 3. Écrans Pro

### 3.1 Hub `/app/widgets`

Vue d'ensemble rapide des 2 widgets + activité récente.

**Layout (desktop 1440-1600)**

- Header page : titre "Widgets publics" + sous-titre + (pas de CTA "Créer")
- Bandeau 4 KPI compacts (cards horizontales) :
  - Vues (30j) + delta vs période précédente
  - Démarrages (30j) + delta
  - Leads générés (30j) + delta
  - Taux de complétion (30j) + delta en points
- Grille 2 colonnes → 2 cards widgets :
  - Card widget vendeur
  - Card widget investisseur
- Bloc "Activité récente" — table 5-10 dernières entrées

**Card widget (répétée x2)**

- Header : titre widget + pill `● Actif` / `○ Inactif` + menu kebab (3 points)
- Sous-titre : domaine(s) d'installation en lien cliquable (ouvre nouvel onglet)
- Preview miniature du rendu public (screenshot figé, pas iframe live)
- 3 lignes de stats :
  - Leads générés (30j) : `872`
  - Taux de conversion : `11,8 %`
  - Dernière activité : `Aujourd'hui à 09:41`
- 3 CTA bas de card :
  - `Configurer` (primaire violet) → `/app/widgets/[slug]`
  - `Aperçu` (secondaire) → ouvre `/widget/[type]?preview=1` nouvel onglet
  - `Copier le code` (secondaire) → copie snippet embed dans presse-papiers, toast succès

**Si widget inactif** : card grisée, CTA `Activer` à la place de `Configurer`.

**Bloc "Activité récente"**

Table 4 colonnes :

| Événement | Widget | Utilisateur | Date |
|---|---|---|---|
| Lead créé | Widget estimation vendeur | Camille Durand | Aujourd'hui à 09:41 |
| Code copié | Widget projet investisseur | Thomas Lemoine | Hier à 16:32 |
| Widget mis à jour | Widget estimation vendeur | Camille Durand | Hier à 11:07 |

Lien `Voir toute l'activité` en haut à droite → page dédiée (hors scope V1).

**Référence visuelle** : screen 2 (corrigé : retirer CTA "Créer un widget").

---

### 3.2 Structure commune d'une page widget

Quand on ouvre `/app/widgets/estimation-vendeur` ou `/app/widgets/projet-investisseur`,
même structure :

- **Header page (sticky en haut)**
  - Titre widget + pill `● Actif`
  - Lien domaine d'installation
  - À droite : `Aperçu du widget` (ouvre public en nouvel onglet) + `Enregistrer les modifications` (primaire violet, avec split button pour "Enregistrer et publier")
- **Barre d'onglets (sticky sous le header)**
  - Vue d'ensemble
  - Étapes
  - Apparence
  - Formulaire
  - Contenu résultat
  - Automatisations
  - Templates
  - Intégration
  - Performance
- **Zone contenu** (varie selon onglet actif)

La barre d'onglets est identique entre les 2 widgets. Les différences vendeur vs
investisseur sont dans le **contenu** de chaque onglet.

**Référence visuelle** : screens 7 et 8.

---

### 3.3 Onglet *Vue d'ensemble*

Lecture rapide du statut du widget.

**Layout**

- Bandeau haut pleine largeur : statut + domaine + version + dernière soumission
- Grille 4 KPI (vues / démarrages / leads / complétion)
- 2 colonnes :
  - Gauche : bloc "Aperçu du rendu public" (screenshot preview + bouton `Voir en conditions réelles`)
  - Droite : bloc "Intégration rapide" — snippet embed minified, bouton copier, lien vers onglet Intégration détaillé
- Bloc bas : "Activité récente" (5 dernières lignes, format identique au hub)

---

### 3.4 Onglet *Étapes* ⭐ écran le plus important

3 colonnes. Permet à l'agent de voir le flow, de réorganiser les étapes, de
configurer le contenu de chacune.

**Colonne gauche — Liste des étapes** (~280px)

- Titre "Étapes du widget" + sous-titre "Glissez pour réorganiser"
- Liste drag & drop des étapes du widget sélectionné :
  - Vendeur : Intro / Adresse / Bien / Détails / Résultat / Contact / Confirmation
  - Investisseur : Intro / Projet / Budget / Zone & type / Stratégie / Contact / Confirmation
- Chaque item :
  - Icône handle drag `⋮⋮` à gauche
  - Numéro rond (1, 2, 3...)
  - Nom étape + sous-titre court ("Présentation du parcours", "Décrire le projet"...)
  - Pill `Actif` ou `Masqué` à droite
  - Checkmark vert si étape complète / rond vide si en cours de config
  - Clic = sélectionne l'étape (highlight violet gauche)
- Bouton `+ Ajouter une étape` en bas (désactivé en V1 — 7 étapes figées, juste masquables)

**Colonne centre — Aperçu** (~flex-1)

- Header : "Aperçu de l'étape sélectionnée" + toggle `Bureau | Mobile`
- Zone preview :
  - Rendu pixel-proche de l'étape publique, avec branding réel de l'agence
  - Progress bar visible (numéroté 1-7)
  - Étape courante en violet, autres grises
  - Zone interactive non cliquable (c'est un aperçu statique)
- Footer preview : mention "Aperçu non interactif. Voir le widget en conditions réelles →"

**Colonne droite — Configuration de l'étape** (~360px)

- Header : "Configuration de l'étape" + pill "Étape X sur 7"
- Bloc **Statut** : toggle "Étape active" (désactivable si étape non obligatoire)
- Bloc **Contenu** :
  - Titre (input, compteur 42/80)
  - Sous-titre (input, 44/100)
  - Texte descriptif (textarea, 86/200)
  - CTA principal (input, 9/30)
  - (Pour étape Résultat) Texte de réassurance (input, 48/100)
- Bloc **Champs** (visible sur étapes avec formulaire) :
  - Liste multiselect "Champs visibles" (chips supprimables)
  - Liste multiselect "Champs obligatoires"
  - Lien "Gérer les champs disponibles" → onglet Formulaire
- Bloc **Scénarios** (uniquement étape Stratégie, widget investisseur) :
  - Checkbox liste scénarios affichés au public :
    - ☑ Rendement locatif (ordre ↕)
    - ☑ Valorisation patrimoniale (ordre ↕)
    - ☑ Impact & durabilité (ordre ↕)
    - ☐ Diversification
  - Compteur "3/4 sélectionnés"
  - Bouton `+ Ajouter un scénario` (désactivé V1)
- Bloc **Chips KPI** (étape Stratégie investisseur) :
  - Checkboxes inline : Revenus réguliers / Cashflow / Plus-value / Long terme / ESG
  - Compteur "4/5 sélectionnés"
- Bloc **Boutons d'action** :
  - Texte bouton précédent (input)
  - Texte bouton suivant (input)
- Bloc **Comportement** (expandable) :
  - Toggle "Autoriser la sélection d'un seul scénario"
  - Toggle "Afficher les icônes des scénarios"
  - Toggle "Rendre cette étape optionnelle" (+ icône info)
- Lien bas : `Avancé ▾` (expand vers options rares : animations, conditionnelles)

**Référence visuelle** : screens 7 (vendeur) et 8 (investisseur).

---

### 3.5 Onglet *Apparence*

**Layout** : 2 colonnes. Gauche = réglages, droite = preview live.

**Gauche — réglages**

- Bloc **Logo**
  - Upload logo partenaire (drag drop + fallback URL)
  - Alignement (gauche / centre)
  - Hauteur (slider 24-64px)
- Bloc **Identité**
  - Nom du partenaire (input)
  - Baseline optionnelle (input)
- Bloc **Couleurs**
  - Couleur principale (color picker) — ex : `#6366F1`
  - Couleur secondaire (color picker)
  - Fond du widget (white / grey-50 / transparent)
  - Couleur des boutons (hérite principale par défaut)
- Bloc **Formes**
  - Forme des boutons (select : rounded-sm / rounded-md / rounded-full)
  - Radius global (slider 0-24px)
  - Ombre (none / light / standard)
- Bloc **Densité**
  - Compact / Standard (toggle)
- Bloc **Mode d'affichage**
  - Radio : Inline / Pop-in / Bloc pleine largeur
- Bloc **Powered by Propsight**
  - Toggle (désactivable selon niveau d'abonnement — V1 : toujours activé)

**Droite — preview**

- Toggle `Bureau | Mobile` + toggle `Fond clair | Fond site partenaire`
- Zone preview pleine hauteur, re-rendue à chaque changement
- Bouton `Voir en conditions réelles` bas droit

---

### 3.6 Onglet *Formulaire*

Configure les champs collectés par étape.

**Layout** : 1 colonne, liste accordéon par étape.

Pour chaque étape du widget (pliable) :

- Header : nom étape + compteur "5 champs visibles / 3 obligatoires"
- Liste des champs disponibles :
  - Chaque champ = ligne avec handle drag + label + type + 2 toggles (`Visible` / `Obligatoire`) + icône paramètres
- Bouton `+ Ajouter un champ personnalisé` en bas de chaque étape (V1 désactivé)

**Champs vendeur disponibles** (exhaustif)

| Champ | Étape | Type |
|---|---|---|
| Adresse | Adresse | Autocomplete BAN |
| Type de bien | Bien | Radio cards (Appart/Maison/Terrain/Parking) |
| Surface | Bien | Number (m²) |
| Pièces | Bien | Number |
| Chambres | Bien | Number |
| Étage | Bien | Select |
| Terrain | Bien | Number (m²), conditionnel si maison |
| Année de construction | Détails | Select décennies |
| État général | Détails | Select (Neuf/Bon/À rafraîchir/À rénover) |
| DPE | Détails | Select A→G |
| Équipements | Détails | Chips multiselect |
| Occupation | Détails | Select (Libre/Loué/Occupé) |
| Prénom | Contact | Text |
| Nom | Contact | Text |
| Email | Contact | Email |
| Téléphone | Contact | Tel FR |
| Projet (vendre / juste estimer) | Contact | Select |
| Délai | Contact | Select (<3M / 3-6M / 6-12M / >12M) |
| Préférence contact | Contact | Select (Email/Téléphone/WhatsApp) |
| Consentement | Contact | Checkbox (obligatoire, non désactivable) |

**Champs investisseur disponibles**

| Champ | Étape | Type |
|---|---|---|
| Objectif principal | Projet | Radio cards (Rendement/Patrimonial/Cash-flow/Diversification) |
| Horizon | Projet | Select (5/10/15/20 ans) |
| Niveau d'accompagnement | Projet | Select |
| Style d'investissement | Projet | Select |
| Budget total | Budget | Number (€) |
| Apport | Budget | Number (€) |
| Mode de financement | Budget | Select |
| Rendement visé | Budget | Number (%) |
| Effort mensuel max | Budget | Number (€/mois) |
| Zones recherchées | Zone & type | Chips multiselect villes |
| Type de bien | Zone & type | Chips (Studio/T1/T2/T3+/Immeuble) |
| Travaux acceptés | Zone & type | Toggle |
| Type de location | Zone & type | Chips (Meublé/Nu/Colocation/Saisonnier) |
| Ouvert aux recommandations | Zone & type | Checkbox |
| Prénom, Nom, Email, Téléphone, Préférence, Disponibilité, Consentement | Contact | Idem vendeur |

---

### 3.7 Onglet *Contenu résultat*

Différenciateur clé. Configure ce qui est affiché au public vs réservé à l'agent.

**Layout** : 2 colonnes.

**Gauche — Configuration**

Liste de tous les éléments de résultat, chacun avec :

- Label
- Toggle `Visible publiquement` (œil)
- Toggle `Réservé agent` (œil barré, bleu)
- Icône paramètres (format d'affichage, unité, précision)

**Éléments résultat vendeur**

| Élément | Public | Agent |
|---|---|---|
| Fourchette de prix | ☑ | ☑ |
| Prix au m² | ☐ (toggle off par défaut) | ☑ |
| Indice de confiance (pill) | ☑ | ☑ |
| Texte de réassurance | ☑ | — |
| Délai de vente estimé | ☐ | ☑ |
| Marché local (dynamique/équilibré/tendu) | ☑ | ☑ |
| Nombre de ventes récentes proximité | ☑ | ☑ |
| Comparables détaillés (adresses, prix, dates) | ☐ | ☑ |
| Angle de conversation recommandé | — | ☑ |
| Maturité vendeur estimée | — | ☑ |
| Tension locale | — | ☑ |
| Point fort principal du bien | — | ☑ |
| Point de vigilance principal | — | ☑ |

**Éléments résultat investisseur**

| Élément | Public | Agent |
|---|---|---|
| Stratégie principale (carte) | ☑ | ☑ |
| Scénarios alternatifs (2) | ☑ | ☑ |
| Loyer cible | ☑ | ☑ |
| Rendement brut estimé | ☑ | ☑ |
| Tension locative | ☑ | ☑ |
| Points clés (3 cards : budget, vigilance, vacance) | ☑ | ☑ |
| Hypothèses détaillées du calcul | ☐ | ☑ |
| Comparables experts | ☐ | ☑ |
| Montage financier détaillé | ☐ | ☑ |
| Scoring risque/rendement | — | ☑ |
| Angle de conversation recommandé | — | ☑ |
| Maturité projet | — | ☑ |
| Prochaine meilleure action | — | ☑ |

**Droite — Preview résultat public**

Rendu pixel-proche de l'écran 4 du parcours vendeur ou écran 4 investisseur, avec
uniquement les éléments cochés "Visible publiquement".

---

### 3.8 Onglet *Automatisations*

Règles de traitement du lead. Séparé des templates (qui sont dans l'onglet suivant).

**Layout** : 2 colonnes.

**Gauche — Règles d'automatisation** (~50% largeur)

Série de lignes "réglage + toggle ou select", compact :

- ☑ **Créer automatiquement un lead** — Chaque soumission crée un lead dans le CRM
- ☑ **Créer une action prioritaire** — Tâche de suivi pour l'équipe
- ☑ **Assigner automatiquement** — Select : Round-robin / Par secteur / Collaborateur par défaut / Manuel
- Propriétaire par défaut — Select membres équipe (visible si "Collaborateur par défaut")
- Stage d'entrée — Select (Nouveau / À qualifier)
- Tags automatiques — Chips multiselect
- Priorité automatique — Select (Basse / Normale / Haute / Urgente) — règles conditionnelles V1.5
- Canal prioritaire — Select (Email / Téléphone / WhatsApp / Email + WhatsApp)
- Délai de relance initial — Select (Immédiat / 15 min / 1 h / 24 h)
- Délai de relance secondaire — Select (24 h / 48 h / 72 h / 7 j)
- Nombre max de relances — Select (1 / 2 / 3 / 5)

**Bloc Orchestration avancée (OpenClaw)** — collapsable, off par défaut

- Toggle maître "Activer OpenClaw" (si off, bloc grisé)
- ☑ Notifier l'agent/équipe (Slack / email / in-app — select canal)
- ☑ Préparer un message WhatsApp (lien `wa.me` avec variables pré-remplies)
- ☑ Générer un brief RDV automatique (visible dans fiche lead)
- ☑ Enrichir le lead avec insights pack
- ☑ Proposer une relance automatique si pas de réponse sous X h

**Droite — Dernières automatisations exécutées** (~50%)

Timeline compacte 10 dernières entrées :

```
✓  Lead créé                 Sophie Martin       10:28
✓  WhatsApp préparé          Sophie Martin       10:29
✓  Email envoyé (avis PDF)   Sophie Martin       10:30
✓  RDV proposé               Lien WhatsApp envoyé 10:32
```

Lien bas : `Voir tout l'historique →`

**Référence visuelle** : screen 9, mais sans les blocs WhatsApp preview et Brief RDV
(qui vont respectivement dans Templates et dans la fiche lead).

---

### 3.9 Onglet *Templates*

Éditeur des messages email + WhatsApp. C'est là que vit la partie "preview message"
du screen 9.

**Layout**

- Barre d'onglets secondaire en haut :
  - Email initial
  - Email relance
  - WhatsApp initial
  - WhatsApp relance
  - Confirmation interne (équipe)
- 2 colonnes :
  - Gauche : éditeur
  - Droite : preview + variables

**Éditeur email** (gauche)

- Input Objet (ex : `Votre première estimation pour le {{property_address}}`)
- Éditeur WYSIWYG simple (bold / italic / lien / liste / variables)
- Bouton `+ Insérer une variable` → dropdown avec les variables disponibles
- Pièces jointes : toggle "Joindre l'avis de valeur PDF" (vendeur) / "Joindre la fiche projet PDF" (investisseur)
- Compteur caractères
- Bouton `Envoyer un test à moi-même`

**Éditeur WhatsApp** (gauche)

- Textarea simple (pas de rich text — WhatsApp ne gère que bold/italic/strike minimal)
- Bouton `+ Insérer une variable`
- Mention : "Le message sera ouvert via un lien `wa.me` avec le numéro du lead et ce message pré-rempli. L'agent confirme l'envoi manuellement."
- Compteur caractères (limite 1024)

**Preview** (droite)

- Email : rendu maquetté avec branding agence, variables remplacées par des valeurs d'exemple
- WhatsApp : bubble chat style WhatsApp (vert clair), heure, double check

**Variables disponibles** (panneau droit, collapsable)

Communes :

```
{{first_name}}           {{last_name}}
{{property_address}}     {{agent_name}}
{{agency_name}}          {{rdv_link}}
{{agency_phone}}         {{agency_email}}
{{submission_date}}
```

Vendeur :

```
{{valuation_min}}        {{valuation_max}}
{{property_type}}        {{surface}}
{{confidence_level}}     {{median_price}}
{{market_trend}}         {{days_on_market}}
{{comparables_count}}    {{main_insight_seller}}
{{avis_valeur_pdf_url}}
```

Investisseur :

```
{{budget}}               {{down_payment}}
{{recommended_strategy}} {{target_zone}}
{{estimated_yield}}      {{target_rent}}
{{rental_tension}}       {{main_warning}}
{{next_best_action}}
```

**Contenu préchargé par défaut** — fournir les 5 templates pré-remplis du spec §14 et
§15 (textes français prêts à l'emploi).

---

### 3.10 Onglet *Intégration*

Enrichi vs spec initiale : code embed + webhook + export CSV + compatibilité CRM.

**Layout** : 1 colonne, sections empilées.

**Bloc Code embed**

- Select : Mode d'affichage (Inline / Pop-in / Bloc hero / Bouton flottant)
- Textarea readonly avec snippet HTML + JS (syntax highlighting)

```html
<div id="propsight-widget-estimation"></div>
<script src="https://widget.propsight.fr/loader.js"
        data-agent-id="ag_xxx"
        data-theme="default"
        data-mode="inline"></script>
```

- Bouton `Copier le code` + toast succès
- Note d'installation : "Collez ce code juste avant la fermeture de `</body>`. Le widget se charge automatiquement."

**Bloc Domaines autorisés**

- Input liste (chips) — ajouter des domaines (ex : `maisondexception.fr`, `estimation.maisondexception.fr`)
- Note CORS : "Le widget ne se chargera que sur ces domaines."

**Bloc Webhook sortant**

- Toggle "Activer les webhooks"
- Input URL cible (https obligatoire)
- Input Secret (généré auto, bouton régénérer)
- Multiselect événements :
  - `widget.viewed`
  - `widget.started`
  - `widget.completed`
  - `lead.created`
  - `action.created`
- Bouton `Envoyer un événement test` → toast succès + payload JSON affiché en dessous
- Tableau historique 10 derniers envois (événement, status code, timestamp, bouton `Voir payload`)

**Bloc Export CSV**

- Date range picker (30j par défaut)
- Multiselect colonnes (cochées par défaut : toutes)
- Bouton `Télécharger CSV` → génère et télécharge (mock : fichier statique)

**Bloc Compatibilité CRM**

- Grille de logos CRM supportés avec pill status :
  - Hektor — `Via webhook`
  - Apimo — `Via webhook`
  - Netty — `Via webhook`
  - Zapier — `Via Zapier (disponible)`
  - Make — `Via Make (disponible)`
- Lien `Voir le guide d'intégration →` (page doc externe)

**Bloc Mode test / production**

- Toggle `Mode test` — en mode test, les leads sont taggés `[TEST]` et exclus des stats

---

### 3.11 Onglet *Performance*

KPI détaillés + funnel.

**Layout**

- Date range picker en haut droite (7j / 30j / 90j / 12 mois / custom)

- **Bandeau KPI** (grille 4 colonnes) :
  - Vues
  - Démarrages (+ taux de démarrage)
  - Complétions (+ taux de complétion)
  - Leads générés (+ taux de capture)

- **Funnel visuel** — 6 barres horizontales décroissantes :
  ```
  Vues              ████████████████████  24 812
  Démarrages        ████████████          7 352    (29,6%)
  Étape 2 atteinte  ██████████            6 104    (24,6%)
  Étape 4 atteinte  ████████              5 023    (20,2%)
  Complétions       █████                 1 823    (7,3%)
  Leads capturés    ███                   1 243    (5,0%)
  ```

- **Grille KPI secondaires** (2 colonnes) :
  - Gauche "Comportement" :
    - Temps moyen de complétion
    - Étape la plus abandonnée
    - Appareil dominant (desktop/mobile/tablet %)
    - Source de trafic dominante
  - Droite "Conversion" :
    - Canal préféré par les leads
    - Taux de réponse aux relances
    - RDV générés
    - (Vendeur) Mandats issus du widget
    - (Investisseur) Dossiers ouverts

- **Graphique ligne temporelle** — évolution vues/leads sur la période, avec toggle multi-séries.

- **Tableau Top zones** (investisseur) / **Top quartiers** (vendeur) — 10 lignes.

---

## 4. Écrans publics

### 4.1 Parcours vendeur — 7 écrans

Tous les écrans partagent :
- Header : logo partenaire (gauche) + navigation partenaire (centre) + CTA "Nous contacter" (droite) — injecté par embed OU masqué en mode inline
- Progress bar 1→7 sticky en haut du widget
- Footer : `Powered by Propsight`
- Responsive : desktop 2 colonnes, mobile 1 colonne stackée

**Écran 0 — Intro**

- Layout : 1 colonne centrée max 640px
- Titre : "Estimez votre bien en quelques minutes"
- Sous-titre : "Une première estimation basée sur les caractéristiques de votre bien et les données du marché local"
- CTA principal violet : "Commencer mon estimation"
- Réassurances sous CTA : pills inline ✓ Gratuit  ✓ Sans engagement  🔒 Confidentiel

**Écran 1 — Adresse**

- 2 colonnes (desktop) :
  - Gauche : titre "Commençons par l'adresse de votre bien" + sous-titre + input adresse autocomplete BAN + lien "Utiliser ma position" + hint placeholder "Ex: 22 rue de la Pompe, 75116 Paris"
  - Droite : card sidebar "Votre estimation à venir" avec 3 blocs réassurance (Estimation fiable / Analyses clés / Rapide et sécurisé) + bloc "Estimation indicative" en aperçu flouté (fourchette exemple 482 000 € – 515 000 €)
- CTA bas gauche : "Commencer mon estimation →"
- Référence : screen 1

**Écran 2 — Le bien**

- 2 colonnes :
  - Gauche : titre "Parlons de votre bien" + sous-titre + formulaire :
    - Type de bien (4 radio cards icônes : Appartement / Maison / Terrain / Parking)
    - Surface (m²) / Pièces / Chambres (3 inputs en ligne)
    - Étage / Année de construction (2 selects en ligne)
    - État général / DPE (2 selects en ligne)
    - Équipements (chips multiselect : Balcon / Terrasse / Ascenseur / Cave / Jardin / Parking)
  - Droite : sidebar "Récapitulatif" avec adresse + bouton Modifier, bloc réassurance, liste étapes restantes
- Footer : `← Retour` (gauche) + `Continuer →` (droite violet)
- Référence : screen 3

**Écran 3 — Détails**

Structure identique à écran 2, autres champs (occupation, travaux récents, prestations spécifiques).

**Écran 4 — Résultat + Contact (2 colonnes, même écran)**

⚠️ Dérogation au principe "7 écrans distincts" : Résultat + Contact partagent le
même écran en colonnes parallèles car c'est là que la conversion se joue.

- Progress bar : étape 5/7 (Contact)
- Titre : "Estimez votre bien en quelques minutes" (même que intro)
- 2 colonnes :
  - **Gauche : Votre estimation**
    - Icône maison
    - Fourchette grande `482 000 € — 515 000 €` (texte violet 48px)
    - `Soit 8 310 € — 8 880 €/m²` (gris)
    - Pill verte `✓ Fiabilité forte`
    - Paragraphe explicatif "Cette estimation est basée sur..."
    - 3 points clés avec icônes : Marché local dynamique / Délai de vente estimé : 43 jours / 3 ventes récentes à proximité
    - Banner violet pâle "Un conseiller peut affiner cette estimation avec vous"
  - **Droite : Recevoir mon avis de valeur**
    - Formulaire : Prénom + Nom (2 col) / Email / Téléphone + Projet (2 col) / Préférence de contact
    - 2 checkboxes consentement
    - CTA principal : "Recevoir mon avis de valeur"
    - CTA secondaire outline : "📞 Être rappelé"
- Référence : screen 4

**Écran 5 — Confirmation**

- 1 colonne centrée
- Icône check violet grande
- Titre : "Votre demande a bien été transmise"
- Paragraphe : "Un conseiller peut vous recontacter pour affiner votre avis de valeur. Réponse sous 24h."
- Bloc card avec nom + photo + coordonnées du conseiller assigné
- CTA : "Retour au site" + "Voir notre sélection de biens"

**Écran 6 — Terminé** (techniquement inclus dans confirmation, pas d'écran 7 séparé V1)

### 4.2 Parcours investisseur — 7 écrans

Structure globale identique (header, progress bar, footer).

**Écran 0 — Intro**

- Layout : 1 colonne centrée
- Titre : "Décrivez votre projet investisseur"
- Sous-titre : "Recevez une stratégie cohérente avec votre budget et le marché local"
- CTA : "Trouver ma stratégie d'investissement"

**Écran 1 — Projet + Budget (2 colonnes)**

⚠️ Même logique que résultat+contact vendeur : conversion-friendly.

- Progress bar : étape 1-2/7
- 2 colonnes :
  - **Gauche : formulaire**
    - Bloc "Quel est votre objectif principal ?" — 4 radio cards (Rendement / Patrimonial / Cash-flow / Diversification), chacune avec icône + titre + sous-titre
    - Bloc "Votre enveloppe et vos objectifs" (fond gris-50) :
      - Budget total (€) / Apport (€) — 2 col
      - Rendement visé (%) — 1 col
      - Effort mensuel max (€/mois) / Horizon d'investissement — 2 col
    - Bloc "Où souhaitez-vous investir ?" — chips villes (Paris / Lyon / Bordeaux / Marseille / + autres)
    - Bloc "Vos préférences immobilières" — chips (Meublé / Nu / Colocation / Travaux acceptés)
  - **Droite : sidebar "Ce que vous allez obtenir"**
    - 4 lignes icône + titre + description (Une stratégie recommandée / Un rendement réaliste / La tension locative / Les points de vigilance)
    - Bloc sécurité bas
- Footer : `← Retour` + CTA violet "Voir ma stratégie →"
- Référence : screen 5

**Écran 2 — Zone & type** (affiné si données manquent à l'écran 1)

**Écran 3 — Stratégie (résultat public)**

- 2 colonnes :
  - **Gauche : Votre stratégie recommandée**
    - Card principale violette claire :
      - Icône graphique
      - Titre "T2 meublé en zone tendue" + pill violet "Recommandé"
      - Sous-titre explicatif
      - Grille 3 chips KPI : Loyer cible `930 €/mois` / Rendement brut `5,2 %` / Tension locative `élevée`
    - Grille 2 cards secondaires :
      - "Option patrimoniale" — tags Valorisation/Sécurité, Loyer 820€, Rendement 3,2%
      - "Option rendement renforcé" — tags Performance/Optimisé, Loyer 980€, Rendement 6,4%
    - Section "Points clés à retenir" — 3 colonnes icônes :
      - 💰 Budget cohérent — "Votre budget de 250 000 € est adapté à cette stratégie."
      - ⚠️ Vigilance DPE / travaux — "Anticipez les normes énergétiques pour sécuriser la rentabilité."
      - 🏠 Vacance locative faible — "La demande locative est forte dans votre zone cible."
    - Banner violet pâle : "Un conseiller peut vous proposer une sélection de biens adaptée à votre stratégie."
  - **Droite : Formulaire "Recevoir une sélection de biens"**
    - Idem vendeur (Prénom, Nom, Email, Téléphone, Préférence, Disponibilité)
    - 2 checkboxes consentement
    - CTA principal : "Recevoir une sélection de biens →"
    - CTA secondaire : "📅 Planifier un échange"
- Référence : screen 6

**Écran 4 — Confirmation**

Idem vendeur, textes adaptés.

### 4.3 Responsive mobile

Règles générales :

- Breakpoint : `< 768px`
- Layout : 1 colonne stackée, sidebar résumé passe **en bas** après le contenu principal
- Progress bar compact (juste "Étape 2/7" en texte, plus de 7 ronds)
- CTA pleine largeur
- Inputs pleine largeur, plus de grilles 2/3 colonnes
- Card principale stratégie : KPI chips passent en 2x2 au lieu de 1x3
- Radio cards : passent de 4 côte-à-côte à 2x2
- Footer sticky (CTA Continuer toujours visible en bas)

Pas de maquettes mobile pixel-perfect — suivre ces règles + bon sens mobile-first.

---

## 5. Assets générés côté agent

### 5.1 Brief RDV

**Où il vit** : dans la fiche lead `/app/activite/leads/[id]`, tab "Brief RDV" ou
bloc dans le drawer contextuel. Pas dans la config widget.

**Contenu vendeur** (card à droite de la fiche lead, ou tab dédié) :

```
BRIEF RDV — [Nom lead]                                 [Générer un brief ↻]

📍 Bien
   Maison 120 m² — 4 pièces
   22 rue de la Pompe, 75116 Paris

💼 Lead
   Sophie Martin
   Source : Widget Estimation vendeur
   Date : 23/04/2026

📊 Insights lead
   Prix médian secteur : 8 650 €/m²
   Évolution 6 mois : +2,3%
   Délai de vente estimé : 43 jours
   Comparables récents : 12 biens

⚠️ Objections probables
   • "Le prix n'est-il pas un peu élevé ?"
   • "Quels travaux prévoir ?"
   • "Combien de temps pour vendre ?"
   → Voir comment y répondre

🎯 Prochaine meilleure action
   Proposer un RDV de conseil
   Le lead est chaud. Proposez un échange pour approfondir.
   [Proposer un RDV]
```

**Contenu investisseur** : budget, apport, stratégie recommandée, zones
compatibles, type de bien conseillé, point de vigilance, arguments RDV,
prochaines propositions à faire.

**Référence visuelle** : colonne droite du screen 9 (à déplacer dans la fiche lead).

**Génération** : bouton manuel `Générer un brief ↻` en V1 (pas de génération
automatique). Mock d'un délai 2s + affichage.

### 5.2 Fiche lead enrichie widget

Dans `/app/activite/leads/[id]`, quand le lead vient d'un widget :

- Badge source visible en header : `🔌 Widget estimation vendeur` (pill violet)
- Section "Soumission widget" — tous les champs remplis par le prospect
- Section "Insights agent" — tous les champs cochés "Réservé agent" dans la config
- Section "Brief RDV" — comme ci-dessus
- Section "Messages préparés" — aperçu de l'email et du WhatsApp déjà générés, avec
  bouton "Envoyer l'email" (action réelle) et "Ouvrir WhatsApp" (lien `wa.me`)
- Timeline événements widget — widget vu, commencé, terminé, lead créé, email
  envoyé, etc.

---

## 6. Intégration CRM (récap cross-écran)

### 6.1 Webhook payload — événement `lead.created`

```json
{
  "event": "lead.created",
  "timestamp": "2026-04-23T10:28:14Z",
  "widget": {
    "id": "wdg_estimation_vendeur",
    "type": "estimation_vendeur",
    "version": "v1"
  },
  "organization_id": "org_xxx",
  "agent_id": "ag_xxx",
  "lead": {
    "id": "lead_xxx",
    "first_name": "Sophie",
    "last_name": "Martin",
    "email": "sophie.martin@example.com",
    "phone": "+33612345678",
    "contact_preference": "email",
    "project": "sell",
    "timeline": "3-6M",
    "consent": true
  },
  "property": {
    "address": "22 rue de la Pompe, 75116 Paris",
    "lat": 48.861,
    "lng": 2.284,
    "type": "apartment",
    "surface": 85,
    "rooms": 4,
    "bedrooms": 2,
    "floor": 3,
    "year_built": 1920,
    "condition": "good",
    "dpe": "D",
    "equipment": ["balcony", "elevator", "cellar"]
  },
  "valuation": {
    "min": 482000,
    "max": 515000,
    "median_per_sqm": 8600,
    "confidence": "high",
    "days_on_market": 43,
    "market_trend": "dynamic"
  },
  "signature": "sha256=..."
}
```

### 6.2 Export CSV — colonnes

```
lead_id, created_at, widget_type, first_name, last_name, email, phone,
contact_preference, project, timeline, address, lat, lng, property_type,
surface, rooms, bedrooms, valuation_min, valuation_max, confidence, consent,
source_domain, utm_source, utm_medium, utm_campaign
```

---

## 7. Mocks data

### 7.1 Stratégie investisseur (format typé)

```json
{
  "strategy_primary": {
    "id": "t2_meuble_zone_tendue",
    "title": "T2 meublé en zone tendue",
    "description": "Un équilibre idéal entre rendement, sécurité et demande locative.",
    "icon": "trending-up",
    "badge": "Recommandé",
    "kpi": {
      "target_rent": 930,
      "gross_yield": 5.2,
      "rental_tension": "élevée"
    }
  },
  "scenarios": [
    {
      "id": "patrimonial",
      "title": "Option patrimoniale",
      "description": "Sécurisez votre capital sur le long terme.",
      "tags": ["Valorisation", "Sécurité"],
      "kpi": { "target_rent": 820, "gross_yield": 3.2 }
    },
    {
      "id": "rendement_renforce",
      "title": "Option rendement renforcé",
      "description": "Optimisez la performance locative.",
      "tags": ["Performance", "Optimisé"],
      "kpi": { "target_rent": 980, "gross_yield": 6.4 }
    }
  ],
  "key_points": [
    {
      "type": "budget_coherent",
      "title": "Budget cohérent",
      "text": "Votre budget de 250 000 € est adapté à cette stratégie.",
      "severity": "success"
    },
    {
      "type": "dpe_warning",
      "title": "Vigilance DPE / travaux",
      "text": "Anticipez les normes énergétiques pour sécuriser la rentabilité.",
      "severity": "warning"
    },
    {
      "type": "low_vacancy",
      "title": "Vacance locative faible",
      "text": "La demande locative est forte dans votre zone cible.",
      "severity": "success"
    }
  ]
}
```

### 7.2 KPI hub + performance

```json
{
  "period": "30d",
  "vues": { "value": 24812, "delta_pct": 18.6 },
  "demarrages": { "value": 7352, "delta_pct": 15.2 },
  "leads": { "value": 1243, "delta_pct": 22.1 },
  "completion_rate": { "value": 68.3, "delta_pts": 6.4 }
}
```

### 7.3 Templates pré-remplis

Utiliser les textes français tels quels du spec initial §14 (vendeur) et §15 (investisseur) :

- Email initial vendeur : objet `Votre première estimation pour le {{property_address}}`
- Email relance vendeur
- WhatsApp initial vendeur
- Email initial investisseur : objet `Votre stratégie d'investissement pour {{target_zone}}`
- Email relance investisseur
- WhatsApp initial investisseur

### 7.4 Activité récente (hub)

```json
[
  { "type": "lead_created",    "widget": "estimation_vendeur",    "user": "Camille Durand",  "date": "2026-04-23T09:41:00" },
  { "type": "code_copied",     "widget": "projet_investisseur",   "user": "Thomas Lemoine",  "date": "2026-04-22T16:32:00" },
  { "type": "widget_updated",  "widget": "estimation_vendeur",    "user": "Camille Durand",  "date": "2026-04-22T11:07:00" },
  { "type": "lead_created",    "widget": "projet_investisseur",   "user": "Maxime Robert",   "date": "2026-04-11T14:22:00" },
  { "type": "code_copied",     "widget": "estimation_vendeur",    "user": "Maxime Robert",   "date": "2026-04-10T10:18:00" }
]
```

---

## 8. États & interactions

### 8.1 Loading

- Chargement initial d'un onglet : skeletons (rectangles gris animés), pas de spinner central
- Chargement preview étape : skeleton + fade-in
- Soumission formulaire public : bouton CTA en état loading (spinner inline + texte "Calcul en cours...")

### 8.2 Erreurs

- **AVM down** (écran résultat vendeur/investisseur) : afficher un fallback "Nous calculons votre estimation. Recevez-la par email dans quelques minutes." + passage direct à l'écran Contact
- **Validation formulaire** : erreurs inline sous chaque champ (rouge), pas d'alerte globale
- **Webhook test échoué** : toast rouge + code erreur HTTP affiché
- **Upload logo échoué** : message inline sous le champ

### 8.3 Empty states

- **Hub sans leads** : illustration neutre + "Vos premiers leads arriveront ici dès qu'un visiteur complétera votre widget." + CTA "Voir comment installer le widget →"
- **Widget inactif** : card grisée avec CTA "Activer le widget" central
- **Aucune activité récente** : "Aucune activité sur la période sélectionnée."

### 8.4 Succès

- Copier code : toast bas droit 3s "✓ Code copié dans le presse-papiers"
- Enregistrer modifications : toast + badge "Modifications enregistrées" 5s
- Envoi test webhook : toast vert + affichage payload en dessous

### 8.5 Confirmations destructives

- Désactiver widget : modal "Le widget sera masqué sur le site du partenaire. Confirmer ?" → Annuler / Désactiver
- Supprimer domaine autorisé : pas de modal, chip supprimable avec undo toast 5s
- Régénérer secret webhook : modal "L'ancien secret sera invalidé. Tous les endpoints qui l'utilisent devront être mis à jour. Confirmer ?"

---

## 9. Composants partagés à créer

Ces composants sont réutilisés entre Hub, config widget et fiche lead. Les
factoriser dès le départ.

- `<WidgetCard />` — card widget (hub + overview tab)
- `<ProgressBar />` — progress bar 1→7 (public + preview)
- `<StepListItem />` — item liste drag & drop (onglet Étapes)
- `<PreviewPane />` — zone preview avec toggle Bureau/Mobile
- `<FieldVisibilityToggle />` — double toggle Public/Agent (onglet Contenu résultat)
- `<VariableInserter />` — dropdown insertion variables (onglet Templates)
- `<MessagePreview variant="email|whatsapp" />` — preview messages (onglet Templates)
- `<KpiCard />` — card KPI compact (hub + performance)
- `<FunnelBar />` — barre horizontale funnel (onglet Performance)
- `<LeadSourceBadge />` — pill source lead (fiche lead)
- `<BriefRdvCard />` — card brief RDV (fiche lead)
- `<ActivityTimeline />` — timeline compacte (hub + automatisations + fiche lead)
- `<EmbedCodeBlock />` — bloc code embed avec syntax highlight + copy

---

## 10. Mapping screenshots fournis

| Screen | Section MD | Notes |
|---|---|---|
| 1 (Estim vendeur, écran Adresse) | §4.1 Écran 1 | Référence pixel, garder layout 2 colonnes |
| 2 (Widget estimateur overview Pro) | §3.1 Hub | Retirer CTA "Créer un widget", renommer sidebar "Widgets publics" |
| 3 (Estim vendeur, écran Caractéristiques) | §4.1 Écran 2 | Référence pixel |
| 4 (Estim vendeur, écran Résultat+Contact) | §4.1 Écran 4 | Référence pixel |
| 5 (Investisseur, écran Projet+Budget) | §4.2 Écran 1 | Référence pixel |
| 6 (Investisseur, écran Stratégie) | §4.2 Écran 3 | Référence pixel |
| 7 (Config widget vendeur, onglet Étapes) | §3.4 Onglet Étapes | Référence pixel. Ajouter toggle Public/Agent sur bloc "Champs" pour l'étape Résultat |
| 8 (Config widget investisseur, onglet Étapes) | §3.4 Onglet Étapes | Idem. Référence pour bloc "Scénarios affichés" et "Chips KPI visibles" |
| 9 (Automatisations & messages) | §3.8 + §3.9 + §5.1 | ⚠️ À splitter en 3 : règles → §3.8 / templates → §3.9 / brief RDV → §5.1 fiche lead |

---

## 11. Non-scope V1 (pour info, à reporter V1.5)

- Multi-instances widgets (1 par agence/secteur)
- Variantes persona broker / marchand de biens / patrimonial
- A/B testing sur étapes et copy
- Parcours public compressé "mode express" (5 écrans au lieu de 7)
- Règles d'assignation conditionnelles avancées (par secteur + charge)
- Génération automatique du Brief RDV en background à la création du lead
- Intégrations natives directes (sans webhook) Hektor / Apimo / Netty
- Anonymisation RGPD automatique après X jours
- Historique des versions de templates avec restore
- Preview live du widget dans un iframe réel (pour l'instant screenshots statiques)

---

## 12. TODO juridique (hors scope dev, à valider avant lancement)

- [ ] Revue loi Hoguet sur la génération automatique d'avis de valeur
- [ ] Revue RGPD sur l'envoi WhatsApp post-lead (double opt-in nécessaire ?)
- [ ] CGU spécifiques plugin public à faire valider
- [ ] Mentions légales à injecter dans l'iframe widget (lien vers politique confidentialité de l'agence + de Propsight)

---

## 13. Ordre de livraison recommandé

Pour que Claude Code attaque dans le bon ordre :

1. `<WidgetCard />` + `<KpiCard />` + Hub `/app/widgets` (§3.1)
2. Structure commune page widget + barre d'onglets (§3.2)
3. Onglet Étapes (§3.4) — le plus complexe, à faire tôt
4. Parcours public vendeur complet (§4.1) — 5 écrans effectifs
5. Parcours public investisseur complet (§4.2) — 4 écrans effectifs
6. Onglets Apparence + Formulaire + Contenu résultat (§3.5, §3.6, §3.7)
7. Onglet Automatisations (§3.8)
8. Onglet Templates (§3.9)
9. Onglet Intégration (§3.10) — webhook + export CSV
10. Onglet Performance (§3.11)
11. Fiche lead enrichie widget + Brief RDV (§5)
12. États loading / erreurs / empty (§8)

---

**Fin de la spec.** Toute décision produit non tranchée dans ce doc remonte en
question avant implémentation.
