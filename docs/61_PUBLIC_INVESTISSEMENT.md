# Propsight — Page publique `/investissement`

**Version :** V1 freemium
**Statut :** Spécification prête pour Claude Code
**Route :** `/investissement`
**Shell parent :** `PublicShell` variant `standard`
**Auth :** Non
**Type de page :** landing freemium orientée investisseur particulier

---

## 0. Pourquoi cette page

La route `/investissement` est aujourd'hui vide. On a besoin d'une **landing freemium sobre** pour les investisseurs particuliers (futurs locatifs, primo-investisseurs, diversifieurs) — sans basculer sur le territoire Pro. La page doit :

- Expliquer en quelques blocs ce qu'on peut faire avec Propsight côté investissement,
- Orienter vers le **simulateur public** (`/investissement/simulateur`),
- Offrir une **entrée de capture lead douce** pour ceux qui veulent un conseil humain,
- Pousser discrètement vers les ressources pédagogiques (`/ressources`).

Cette page **n'est pas** :
- L'espace Pro investisseur (`/app/investissement/*`, spécifié dans `12_OPPORTUNITES_INVESTISSEMENT.md` et `13_DOSSIER_INVESTISSEMENT__1_.md`)
- Le widget partenaire (`/widget/investissement`, spécifié dans `40_WIDGETS_PUBLICS.md`)
- Un dashboard, une liste d'opportunités, ou un moteur d'analyse fiscale

Rien de Pro ne fuit ici.

---

## 1. Contexte dans la navigation

### 1.1 Header

La route est déjà câblée dans `publicNavStandard` (cf. `00_ARCHITECTURE_GLOBALE.md` §7.5) :

```ts
{ label: "Investissement", to: "/investissement" }
```

Pas de modif de nav nécessaire.

### 1.2 Footer

`PublicFooter` variant `full` (cf. `00_ARCHITECTURE_GLOBALE.md` §8.1).

### 1.3 Liens depuis cette page

- Vers `/investissement/simulateur` — CTA principal hero et CTA final.
- Vers `/ressources?theme=investissement` — section ressources.
- Vers `/prix-immobiliers` — teaser data sources.
- Vers `/pro` — via le bouton `Espace Pro` du header (déjà câblé), jamais dupliqué dans le contenu.

---

## 2. Structure de la page

Layout vertical standard landing Propsight (cf. `08_LANDING_PATTERNS.md`).

```
PublicHeader (standard)

┌──────────────────────────────────────────┐
│ 1. InvestHero                             │  Hero avec CTA simulateur
├──────────────────────────────────────────┤
│ 2. InvestWhatYouGetSection                │  3 cards "Ce que vous obtenez"
├──────────────────────────────────────────┤
│ 3. InvestHowItWorksSection                │  3 étapes pédago
├──────────────────────────────────────────┤
│ 4. InvestMiniCalculator (léger)           │  Widget inline preview
├──────────────────────────────────────────┤
│ 5. InvestResourcesTeaser                  │  3 articles ressources
├──────────────────────────────────────────┤
│ 6. InvestFinalCta                         │  CTA final vers simulateur
└──────────────────────────────────────────┘

PublicFooter (full)
```

6 sections max, aérées. Pas de hero 100vh, pas de parallax, pas de mesh gradient.

---

## 3. Section 1 — `InvestHero`

### 3.1 Layout desktop (≥ 1024px)

Grille 2 colonnes 55/45, container `max-w-[1200px]`, `py-24`.

```
┌───────────────────────────────┬───────────────────────────────┐
│ Eyebrow "Investir dans la     │                               │
│ pierre"                       │  Preview illustrative          │
│                               │  (card statique, pas iframe)  │
│ H1 3 lignes max               │                               │
│ "Investir dans l'immobilier   │  Mockup sobre simulateur :    │
│  en confiance."               │   - Input prix + loyer         │
│                               │   - KPI Rendement net          │
│ Sous-titre 2 lignes           │   - KPI Cash-flow              │
│                               │   - KPI TRI                    │
│ [CTA violet Lancer la simu]   │                               │
│ [CTA outline Voir une démo]   │                               │
│                               │                                │
│ 3 pills réassurance           │                                │
└───────────────────────────────┴───────────────────────────────┘
```

### 3.2 Textes

- **Eyebrow** (violet-500 uppercase) : `INVESTIR DANS LA PIERRE`
- **H1** (48-56px, weight 500) : `Investir dans l'immobilier en confiance.`
- **Sous-titre** (18-20px, neutral-600) : `Testez un projet locatif en quelques secondes. Rendement, cash-flow, effort mensuel : les chiffres essentiels pour décider, expliqués simplement.`

### 3.3 CTA

- **Primaire violet** : `Lancer la simulation` → `/investissement/simulateur`
- **Secondaire outline** : `Voir un exemple` → scroll anchor `#exemple` (section 4)

### 3.4 Pills réassurance (inline sous CTAs)

3 chips identiques au pattern `08_LANDING_PATTERNS.md` :

- `✓ Gratuit`
- `✓ Sans inscription`
- `📊 Données DVF officielles`

### 3.5 Visuel colonne droite

Card blanche, border `neutral-200`, radius 8px, padding 24px, ombre `shadow-sm`. Contient un **mockup statique** (JSX) du simulateur, **pas** une iframe ni un vrai simulateur fonctionnel.

Contenu du mockup :
```
┌─────────────────────────────┐
│  Simulation d'un T2          │
│  Lyon 69003                  │
├─────────────────────────────┤
│  Prix d'achat     180 000 €  │
│  Loyer mensuel       720 €   │
│  Apport            36 000 €   │
│                              │
│  ─ Résultats ──────────────  │
│                              │
│  Rendement brut      4,8 %   │
│  Cash-flow mensuel   +120 €  │
│  Effort net          -280 €  │
└─────────────────────────────┘
```

Typo monospace sur les chiffres est acceptée ici, uniquement dans ce mockup (exception au design system). Tous les chiffres sont **hardcoded** dans le JSX, pas de calcul, pas de state.

### 3.6 À ne pas faire

- Pas de vidéo hero.
- Pas de mesh gradient violet derrière le mockup.
- Pas d'animation "number ticker" qui fait défiler les chiffres.
- Pas de parallax.

---

## 4. Section 2 — `InvestWhatYouGetSection`

Pattern feature grid 3 cards (cf. `08_LANDING_PATTERNS.md` §2.2), fond blanc, `py-24`.

### 4.1 En-tête

- **Eyebrow** : `CE QUE VOUS OBTENEZ`
- **H2** (32-40px) : `Les chiffres essentiels, pas le bruit.`

### 4.2 Les 3 cards

| # | Icône lucide | Titre | Description |
|---|---|---|---|
| 1 | `TrendingUp` | Rendement estimé | Rendement brut et net, calculés à partir des loyers de marché observés dans votre zone. |
| 2 | `Wallet` | Effort mensuel | Mensualité de prêt, charges, fiscalité simplifiée : combien sort de votre poche chaque mois. |
| 3 | `Map` | Tension locative | Un indicateur clair par ville : tendu, équilibré, détendu. Basé sur les annonces agrégées. |

Chaque card : icône violet-500 24px en haut, titre weight 500 20px, description neutral-600 15px, padding 32px, border `neutral-200`, radius 8px, hover border `violet-200`.

Pas de lien CTA dans les cards. Les cards ne sont **pas cliquables** — elles documentent, elles ne naviguent pas.

---

## 5. Section 3 — `InvestHowItWorksSection`

Section pédagogique, fond `neutral-50` (section de contraste autorisée), `py-20`.

### 5.1 Layout

Grille 2 colonnes desktop (50/50), 1 colonne mobile.

```
┌─────────────────────┬─────────────────────┐
│                     │  1. Décrivez le bien │
│ H2 gauche           │     Prix, loyer…      │
│                     │                      │
│ Paragraphe intro    │  2. On calcule        │
│                     │     Rendement, CF…   │
│                     │                      │
│                     │  3. Vous affinez     │
│                     │     Apport, taux…    │
└─────────────────────┴─────────────────────┘
```

### 5.2 Textes

**Gauche**
- H2 (32px) : `Trois étapes, aucune inscription.`
- Paragraphe (neutral-600) : `Notre simulateur est conçu pour les particuliers qui découvrent l'investissement locatif comme pour ceux qui veulent rapidement arbitrer entre deux biens. Pas de jargon fiscal, pas de courbe TRI sur 25 ans. Juste les chiffres dont vous avez besoin pour passer à l'étape suivante.`

**Droite** — liste verticale numérotée (cercles violet-100 avec chiffre violet-600) :

1. **Décrivez le bien** — `Prix, surface, loyer estimé. C'est suffisant pour un premier regard.`
2. **Le simulateur calcule** — `Rendement brut et net, cash-flow, effort mensuel après impôt simplifié.`
3. **Vous ajustez** — `Apport, taux, durée : voyez en temps réel comment vos choix changent la rentabilité.`

Pas de card autour de chaque étape, rester clean (cf. `08_LANDING_PATTERNS.md` §2.3).

---

## 6. Section 4 — `InvestMiniCalculator` (inline, léger)

Ancre `id="exemple"`.

### 6.1 Rôle

Teaser du simulateur complet. 3 sliders + 3 KPI qui se mettent à jour en temps réel. L'utilisateur voit que c'est simple et est incité à ouvrir la vraie page simulateur pour creuser.

### 6.2 Layout

Container centré `max-w-[900px]`, fond blanc, card bordée `neutral-200`, radius 8px, padding 40px, `py-20` autour de la section.

```
─────────────────────────────────────
Eyebrow "ESSAYEZ TOUT DE SUITE"
H2 "Jouez avec les chiffres"
─────────────────────────────────────
┌──────────────────────────────────┐
│                                   │
│  [ Sliders  |  Résultats en live ] │
│                                   │
└──────────────────────────────────┘
   [CTA Ouvrir le simulateur complet →]
```

### 6.3 Composants

**Gauche — 3 sliders** avec input numérique synchronisé à droite de chaque label :

| Champ | Min | Max | Step | Défaut |
|---|---|---|---|---|
| Prix d'achat | 50 000 | 800 000 | 5 000 | 200 000 |
| Loyer mensuel | 300 | 3 500 | 10 | 800 |
| Apport | 0 | 200 000 | 1 000 | 40 000 |

Utiliser `Slider` shadcn. Input numérique à droite du slider sur la même ligne, largeur 120px, format `X XXX €` affiché, parsé sans espaces au blur.

**Droite — 3 KPI**, grille 1 col sur desktop / 3 col sur mobile :

- Rendement brut — `{(loyer * 12 / prix) * 100}%` (1 décimale)
- Cash-flow mensuel estimé — `loyer - mensualité - charges` (cf. §6.4)
- Effort mensuel — même valeur si négatif, ou `0 €` si positif

KPI : label neutral-600 14px au-dessus, valeur 36px weight 500 violet-600 en dessous. Valeurs mises à jour sans animation fancy (pas de count-up).

### 6.4 Formules V1 (volontairement simplistes)

Paramètres **figés** dans le code, pas paramétrables par l'utilisateur à ce stade (ça c'est le simulateur complet) :

```
taux_emprunt    = 3.8 %      (valeur figée V1, cf. note §9)
duree_annees    = 25
charges_mensuel = loyer * 0.08   (provision charges + vacance simplifiée)
fiscalite       = 0              (ignoré sur le mini-calculator)
```

Calculs :

```
montant_emprunte      = prix - apport
mensualite            = amortizationMonthly(montant_emprunte, taux_emprunt, duree_annees)
rendement_brut        = (loyer * 12 / prix) * 100
cashflow_mensuel      = loyer - mensualite - charges_mensuel
effort_mensuel_affiche= cashflow_mensuel si < 0, sinon 0 (libellé "Autofinancé ✓")
```

`amortizationMonthly` : formule classique crédit amortissement constant. À implémenter en util pur `calcAmortization.ts`, testée en unitaire.

### 6.5 Mention légale sous la card

```
Simulation pédagogique. Taux de 3,8 % sur 25 ans, charges simplifiées à 8 % du loyer, fiscalité non prise en compte. Pour un calcul précis, utilisez le simulateur complet.
```

12px neutral-500.

### 6.6 CTA sous la card

Bouton primaire violet, centré : `Ouvrir le simulateur complet` → `/investissement/simulateur`.

### 6.7 À ne pas faire

- Pas de capture lead dans cette section.
- Pas de champ fiscal, pas de régime LMNP, pas de TMI.
- Pas d'estimation de loyer automatique (c'est l'utilisateur qui saisit).
- Pas de persistence session/localStorage.

---

## 7. Section 5 — `InvestResourcesTeaser`

### 7.1 Intention

Pousser vers `/ressources` sans polluer la landing avec du contenu éditorial. 3 cartes articles, pas de bloc "Dernier article" dynamique V1.

### 7.2 Layout

Pattern feature grid 3 cards, fond blanc, `py-20`.

**Eyebrow** : `POUR ALLER PLUS LOIN`
**H2** : `Les bases, sans détour.`

3 cards. Chaque card = titre article + description courte + lien `Lire →`. Fichiers ressources à câbler (slugs à créer dans `/ressources`, hors scope si articles non encore rédigés — routes placeholder acceptées).

| Titre | Description | Slug |
|---|---|---|
| Comprendre le rendement locatif | Brut, net, net-net : les trois chiffres à distinguer avant d'investir. | `/ressources/rendement-locatif` |
| Où investir aujourd'hui ? | Ce que disent les transactions récentes sur la tension et les prix en France. | `/ressources/ou-investir` |
| Nu, meublé, colocation | Trois modes d'exploitation, trois profils de rendement. Choisir selon votre horizon. | `/ressources/modes-exploitation` |

Si l'article n'existe pas encore, la route ressources affiche un placeholder propre (règle `00_ARCHITECTURE_GLOBALE.md` §2.3).

---

## 8. Section 6 — `InvestFinalCta`

### 8.1 Layout

Pattern CTA final (cf. `08_LANDING_PATTERNS.md` §2.9). Fond blanc (pas violet). `py-24`. Contenu centré, `max-w-[680px]`.

```
─────────────────────
H2 centré
Sous-titre court
[CTA primaire violet]
─────────────────────
```

### 8.2 Textes

- **H2** (36px, weight 500) : `Prêt à chiffrer votre projet ?`
- **Sous-titre** (18px, neutral-600) : `Quelques champs, trois chiffres, aucun engagement.`
- **CTA primaire** : `Lancer la simulation` → `/investissement/simulateur`

Pas de second CTA, pas de formulaire, pas de capture lead ici. Un seul geste.

---

## 9. Données et API

### 9.1 Aucune API V1

Cette page est **100% statique** côté front, hors le mini-calculator qui calcule en JS pur côté client.

Pas d'appel backend, pas de chargement de données DVF / annonces en V1 — la page est une landing, pas un outil de données.

### 9.2 Valeurs figées à paramétrer

Créer `src/app/(public)/investissement/constants.ts` :

```ts
export const INVEST_MINI_CALC_DEFAULTS = {
  prix: 200_000,
  loyer: 800,
  apport: 40_000,
  tauxEmprunt: 0.038,
  dureeAnnees: 25,
  chargesPct: 0.08,
}
```

Note : le taux 3,8 % est une valeur raisonnable au moment de la rédaction. **Pas besoin** de le brancher à la Banque de France V1 sur cette page. Le vrai simulateur (`/investissement/simulateur`) pourra le faire plus tard.

### 9.3 Mocks

Aucune dépendance à `20_MOCKS_DATA.md` pour cette page.

---

## 10. Arborescence front

```
src/app/(public)/investissement/
├── page.tsx                          → composition des 6 sections
├── InvestHero.tsx
├── InvestWhatYouGetSection.tsx
├── InvestHowItWorksSection.tsx
├── InvestMiniCalculator.tsx
├── InvestResourcesTeaser.tsx
├── InvestFinalCta.tsx
├── constants.ts
└── lib/
    └── calcAmortization.ts            → util pur, testé
```

Composants partagés (Button, Slider, Input, Card) → shadcn/ui existants.

---

## 11. Design tokens et règles

Aligné sur `01_DESIGN_SYSTEM.md` et `08_LANDING_PATTERNS.md`.

### 11.1 Rappels

- Violet en accent uniquement (CTA primaire, eyebrow, valeurs KPI, icônes de cards).
- Pas de mesh gradient, pas de glow, pas de dark mode.
- Radius 8px.
- Inter, poids 400/500/600 max.
- Une seule section fond `neutral-50` (InvestHowItWorks).
- Animations `motion/react`, durées 180-240ms.

### 11.2 Responsive

- `< 1024px` : grille du hero en 1 colonne, mockup sous le texte.
- `< 768px` : mini-calculator en stack vertical (sliders au-dessus, KPI en dessous en 3 colonnes compactes ou 1 colonne selon largeur), CTA pleine largeur.
- Toutes les grilles 3 cards passent 1 colonne sous 768px.

---

## 12. Ce qu'on ne fait pas en V1

Liste stricte :

- Pas de scan d'opportunités type Opportunités investissement (Pro).
- Pas de dossier investisseur (`DossierInvest`), pas de scénarios multiples (`ScenarioInvest`).
- Pas de régime fiscal détaillé (micro-foncier, LMNP réel, SCI IS, etc.).
- Pas de TRI 10 ans, pas de VAN, pas de DSCR.
- Pas de carte chaleur rendement par ville.
- Pas de liste d'annonces investissement.
- Pas de comparables investisseurs.
- Pas d'intégration DVF ni annonces agrégées sur cette page (seul le simulateur pourrait en avoir plus tard).
- Pas d'espace compte, pas de sauvegarde de simulation.
- Pas de PDF, pas d'export.
- Pas d'appel vers `/app/*`.
- Pas de widget partenaire embed.

Tout ce qui est listé ci-dessus appartient au parcours Pro (`/app/investissement/*`), au simulateur dédié (`/investissement/simulateur`, version plus complète), ou au widget (`/widget/investissement`).

---

## 13. Critères d'acceptation

- [ ] `/investissement` rend `PublicShell` standard — pas de HeaderPro, pas de SidebarPro.
- [ ] L'item `Investissement` du `PublicHeader` est visiblement actif (underline violet) quand on est sur la page.
- [ ] Les 6 sections apparaissent dans l'ordre listé en §2.
- [ ] Le hero contient un mockup **statique** (pas d'interaction), avec chiffres hardcoded.
- [ ] Les 3 cards `WhatYouGet` ne sont pas cliquables.
- [ ] La section `HowItWorks` a un fond `neutral-50`, toutes les autres ont fond blanc.
- [ ] Le mini-calculator met à jour les 3 KPI à chaque changement de slider ou d'input, sans lag perceptible.
- [ ] Les calculs de mensualité et cash-flow utilisent `calcAmortization.ts`, testé en unitaire (au moins 3 cas).
- [ ] Le CTA `Ouvrir le simulateur complet` pointe sur `/investissement/simulateur`.
- [ ] Les 3 cards ressources pointent sur des slugs `/ressources/...`, avec placeholder propre si article absent.
- [ ] CTA final seul, pas de formulaire ni de capture lead.
- [ ] Aucune référence à régime fiscal, TRI, VAN, DSCR, LMNP, SCI, etc. dans la page.
- [ ] Responsive OK : 1 col sous 1024px sur le hero, 1 col sous 768px sur les feature grids.

---

**Fin du document.** Le simulateur lui-même est spécifié dans `62_PUBLIC_SIMULATEUR.md`.
