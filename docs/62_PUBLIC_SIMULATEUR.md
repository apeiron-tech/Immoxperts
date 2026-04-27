# Propsight — Page publique `/investissement/simulateur`

**Version :** V1 freemium
**Statut :** Spécification prête pour Claude Code
**Route :** `/investissement/simulateur`
**Shell parent :** `PublicShell` variant `simulator` (footer minimal, cf. `00_ARCHITECTURE_GLOBALE.md` §8.2)
**Auth :** Non
**Type de page :** outil freemium d'une seule page, calcul live côté client

---

## 0. Pourquoi cette page

La route `/investissement/simulateur` est aujourd'hui vide. On a besoin d'un **simulateur basique freemium** qui permette à un particulier de chiffrer en temps réel un projet locatif : rendement, cash-flow, mensualité, effort, et quelques variantes (nu/meublé au régime micro uniquement). Le tout **sans inscription** et **sans dépendance serveur lourde**.

Cette page **n'est pas** :
- Le moteur de scénarios `ScenarioInvest` du Pro (spécifié dans `12_OPPORTUNITES_INVESTISSEMENT.md` §2.3), avec régimes fiscaux multiples, SCI IS, overrides traçables, résultats cachés en base.
- Le dossier d'investissement avec rapport PDF multi-blocs (spécifié dans `13_DOSSIER_INVESTISSEMENT__1_.md`).
- Le widget partenaire investisseur avec stratégie recommandée (spécifié dans `40_WIDGETS_PUBLICS.md`).

Le simulateur public doit rester **un seul écran, une seule formule simple**. S'il devient complexe, c'est le signal qu'on doit basculer l'utilisateur côté Pro via capture lead.

---

## 1. Contexte dans la navigation

### 1.1 Entrée

Accès depuis :
- La landing `/investissement` (hero CTA, mini-calculator CTA, CTA final — cf. `61_PUBLIC_INVESTISSEMENT.md`).
- Lien direct profond (partage, SEO).
- Éventuellement depuis le footer `Investissement`.

### 1.2 PublicShell variant `simulator`

Le footer est `minimal` (cf. `00_ARCHITECTURE_GLOBALE.md` §8.2) :

```
© Propsight · Données publiques · Confidentialité · Espace Pro
```

Le header reste standard.

### 1.3 Breadcrumb

En haut de page, sous le header, un breadcrumb léger :

```
Investissement  ›  Simulateur
```

Lien `Investissement` → `/investissement`. 14px, neutral-500, séparateur chevron lucide. Pas de background.

---

## 2. Structure de la page

Une **seule section** en grille 2 colonnes desktop. Pas de sections empilées à la landing. C'est un outil, pas un site éditorial.

```
PublicHeader (standard)
Breadcrumb

┌────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────────────────┬────────────────────────────┐ │
│  │                          │                            │ │
│  │  Colonne gauche           │  Colonne droite            │ │
│  │  FORMULAIRE               │  RÉSULTATS + CTA LEAD      │ │
│  │  Onglets Achat/Exploit/   │  KPI principaux            │ │
│  │   Financement             │  Graphique amortissement   │ │
│  │                          │  Bloc lead capture         │ │
│  │                          │                            │ │
│  └──────────────────────────┴────────────────────────────┘ │
│                                                             │
└────────────────────────────────────────────────────────────┘

SimulatorLegalDisclaimer (bandeau sous la grille)

PublicFooter (minimal)
```

Container `max-w-[1280px]`, `py-12`. Grille 5/7 colonnes (gauche formulaire, droite résultats).

---

## 3. Header de page

### 3.1 Au-dessus de la grille

```
Simulateur d'investissement locatif
Chiffrez votre projet en quelques secondes. Aucune inscription.
```

- H1 (36px, weight 500)
- Sous-titre (16px, neutral-600)

Pas d'illustration, pas de badge, pas de CTA ici — l'outil commence directement.

---

## 4. Colonne gauche — formulaire

### 4.1 Organisation en 3 onglets

Composant `Tabs` shadcn, non-overflow, underline violet sur l'onglet actif (pas de pill background).

```
┌────────┬────────────┬──────────────┐
│ Achat  │ Exploitation│ Financement  │
└────────┴────────────┴──────────────┘
```

Les 3 onglets sont toujours visibles. Passer d'un onglet à l'autre **ne reset jamais** les autres champs. Le panneau résultats à droite recalcule en live quel que soit l'onglet actif.

### 4.2 Onglet 1 — Achat

| Champ | Type | Min | Max | Step | Défaut | Unité |
|---|---|---|---|---|---|---|
| `prix` | slider + input | 50 000 | 1 500 000 | 5 000 | 200 000 | € |
| `fraisAcquisitionPct` | select 2 options | — | — | — | `notaire_ancien` | % |
| `travaux` | slider + input | 0 | 300 000 | 1 000 | 0 | € |
| `ville` | autocomplete ville | — | — | — | `null` | — |

Options `fraisAcquisitionPct` :
- `notaire_ancien` → 7,5 % (libellé `Ancien (7,5 %)`)
- `notaire_neuf` → 3 % (libellé `Neuf ou VEFA (3 %)`)

Autocomplete `ville` : source communes INSEE (ou fichier JSON des 1 000 plus grandes villes en statique dans `/public/data/villes.json`). Optionnel, n'influe **pas** sur le calcul V1 — sert uniquement au label du récap. Si saisi, affichage récap "Votre projet à **{ville}**".

### 4.3 Onglet 2 — Exploitation

| Champ | Type | Min | Max | Step | Défaut | Unité |
|---|---|---|---|---|---|---|
| `modeLocation` | radio group 2 | — | — | — | `nu` | — |
| `loyerMensuel` | slider + input | 200 | 5 000 | 10 | 800 | € |
| `chargesNonRecuperables` | slider + input | 0 | 500 | 10 | 50 | €/mois |
| `taxeFonciere` | slider + input | 0 | 6 000 | 50 | 800 | €/an |
| `vacanceMoisParAn` | select | 0 | 2 | 0.5 | 0.5 | mois |

Options `modeLocation` :
- `nu` → `Location nue (micro-foncier)`
- `meuble` → `Location meublée (micro-BIC)`

V1 : **uniquement régimes micro** (micro-foncier, micro-BIC). Pas de réel, pas de LMNP amortissements, pas de SCI. Ces régimes sont Pro.

Abattements applicables V1 :
- `micro_foncier` → abattement forfaitaire 30 % sur les revenus fonciers
- `micro_bic` → abattement forfaitaire 50 % sur les recettes

Options `vacanceMoisParAn` : `0`, `0,5 mois`, `1 mois`, `1,5 mois`, `2 mois`.

### 4.4 Onglet 3 — Financement

| Champ | Type | Min | Max | Step | Défaut | Unité |
|---|---|---|---|---|---|---|
| `apport` | slider + input | 0 | 500 000 | 1 000 | 40 000 | € |
| `taux` | slider + input | 1.0 | 6.0 | 0.05 | 3.8 | % |
| `dureeAnnees` | select | — | — | — | 25 | ans |
| `assurancePct` | slider + input | 0 | 1.0 | 0.01 | 0.3 | % |
| `tmi` | select | — | — | — | 30 | % |

Options `dureeAnnees` : 10, 15, 20, 25.
Options `tmi` : 0, 11, 30, 41, 45 (Tranches marginales d'imposition 2026). Défaut 30.

Pas de champ "prélèvements sociaux" visible — valeur figée 17,2 % dans le calcul, **non paramétrable V1**. Le libellé TMI mentionne entre parenthèses `+ 17,2 % prélèvements sociaux`.

### 4.5 UX des inputs slider + input

Chaque ligne champ :
```
Label (neutral-700, 14px weight 500)                 [ xxx xxx € ] (input à droite)
[─────●──────────────────────────]  (slider plein largeur)
Aide contextuelle (neutral-500, 12px, optionnelle)
```

Input numérique :
- Affichage formaté `200 000 €` (séparateur espace insécable).
- Au focus, retire le format pour saisie libre.
- Au blur, reformate.
- Valeur synchronisée live avec le slider.
- Validation : clamp min/max automatique si out-of-range.

Slider : composant shadcn `Slider`. Track violet-500, thumb blanc border violet-500.

### 4.6 Footer colonne gauche

Sous les onglets, deux boutons :
- `Réinitialiser` (outline, neutral-700) → reset tous les champs à leurs valeurs par défaut, toast confirmation `Simulation réinitialisée`.
- `Copier le lien` (outline, neutral-700) → sérialise le state dans l'URL via query params (cf. §7.3), copie l'URL dans le presse-papiers, toast `Lien copié`.

Pas de bouton `Sauvegarder` (pas de compte V1). Pas de bouton `Exporter PDF` (Pro uniquement).

---

## 5. Colonne droite — résultats live

### 5.1 Structure

```
┌───────────────────────────────────┐
│  Récap projet (ligne compacte)    │
├───────────────────────────────────┤
│  Grille 4 KPI principaux           │
├───────────────────────────────────┤
│  Grille 4 KPI secondaires          │
├───────────────────────────────────┤
│  Graphique amortissement (optionnel V1) │
├───────────────────────────────────┤
│  Bloc Lead Capture                 │
└───────────────────────────────────┘
```

Fond blanc, border `neutral-200`, radius 8px, padding 32px. Sticky top desktop à partir de 1024px (`position: sticky; top: 88px`).

### 5.2 Récap projet (ligne du haut)

Ligne inline, 14px neutral-600 :
```
Projet à {ville ?? "—"}  ·  {modeLocationLabel}  ·  Apport {apport}  ·  Taux {taux} %
```

Aucun bouton ici.

### 5.3 KPI principaux (4 blocs)

Grille 2x2 desktop, 1 col mobile. Chaque KPI : label 14px neutral-600 en haut, valeur 32px weight 500 violet-600 en dessous, petite note 12px neutral-500 optionnelle.

| # | Label | Formule | Note |
|---|---|---|---|
| 1 | Rendement brut | `(loyerMensuel * 12) / (prix * (1 + fraisPct) + travaux) * 100` | `% par an` |
| 2 | Rendement net | voir §6.4 | `après charges` |
| 3 | Cash-flow mensuel | voir §6.5 | `avant impôt` |
| 4 | Effort mensuel | voir §6.6 | `après impôt` |

Valeurs affichées avec 1 décimale pour les %, séparateur milliers pour les €. Pour `Effort mensuel`, si positif → libellé `Autofinancé ✓` en vert, sinon valeur négative rouge `-280 €/mois`.

### 5.4 KPI secondaires (4 blocs)

Grille 2x2 desktop, 1 col mobile. Label 12px neutral-600, valeur 18px weight 500 neutral-900.

| # | Label | Valeur |
|---|---|---|
| 1 | Mensualité de prêt | `mensualite` € |
| 2 | Coût total du crédit | `mensualite * dureeMois - montantEmprunte` € |
| 3 | Impôt annuel sur revenus locatifs | `impotAnnuel` € (cf. §6.7) |
| 4 | Prix au m² équivalent | affiché **seulement** si surface est renseignée (pas un champ V1) → **masqué V1** |

Le KPI "Prix au m²" est prévu mais masqué tant qu'on n'ajoute pas un champ surface. En V1 on supprime cette case du render et on laisse la grille à 2x1.5 → 2x2 avec 3 KPI seulement : **V1 garde uniquement Mensualité, Coût crédit, Impôt annuel**.

### 5.5 Graphique amortissement (optionnel V1)

Recharts `AreaChart` ou `LineChart`, hauteur 220px, 2 séries :
- `capitalRestantDu` (violet-500, area)
- `interetsCumules` (neutral-400, ligne)

X = années de 0 à `dureeAnnees`. Y = euros.

Toggle `Afficher le détail amortissement` en collapsible. Fermé par défaut pour ne pas surcharger. Quand ouvert, affiche aussi une mini table 5 lignes : années 1, 5, 10, 15, 25 avec capital restant dû et intérêts cumulés.

Si le chart ajoute trop de complexité au chantier initial, **on peut le déclasser à V1.1**. Dans ce cas, le toggle est remplacé par un placeholder "Graphique à venir". Ne pas bloquer la mise en prod pour ça.

### 5.6 Bloc Lead Capture

Card interne (fond `neutral-50`, border `neutral-200`, radius 8px, padding 24px, séparée du reste par un `mt-8`).

**Titre** (16px weight 500) : `Besoin d'un conseil humain sur ce projet ?`
**Sous-titre** (14px neutral-600) : `Un conseiller Propsight peut affiner cette simulation avec vous. Gratuit, sous 24h.`

Formulaire compact (`react-hook-form` + `zod`) :

| Champ | Type | Obligatoire |
|---|---|---|
| `firstName` + `lastName` | 2 inputs sur une ligne | ✓ |
| `email` | input email | ✓ |
| `phone` | input tel | ✗ |
| `consent` | checkbox | ✓ |

Libellé consent identique à celui de `/estimation` (cf. `60_PUBLIC_ESTIMATION.md` §4.3).

**CTA primaire** (pleine largeur) : `Être recontacté`

À la soumission : `POST /api/public/invest/lead` (payload : champs du formulaire + `simulationState` complet sérialisé). Réponse 201 → remplace le formulaire par un bloc confirmation identique à §4.4 de `60_PUBLIC_ESTIMATION.md`.

Pas de captcha V1 (honeypot `website` silencieux comme sur `/estimation`).

---

## 6. Moteur de calcul (côté client, pur JS)

Créer `src/app/(public)/investissement/simulateur/lib/calcInvest.ts`. Aucun appel serveur. Types exportés.

### 6.1 Types

```ts
export type SimulatorInput = {
  prix: number
  fraisAcquisitionPct: 0.075 | 0.03
  travaux: number
  ville: string | null
  modeLocation: "nu" | "meuble"
  loyerMensuel: number
  chargesNonRecuperables: number
  taxeFonciere: number
  vacanceMoisParAn: number
  apport: number
  tauxPct: number                       // en % (ex 3.8)
  dureeAnnees: 10 | 15 | 20 | 25
  assurancePct: number                  // en %
  tmi: 0 | 11 | 30 | 41 | 45
}

export type SimulatorResult = {
  rendementBrutPct: number
  rendementNetPct: number
  cashflowMensuelAvantImpot: number
  effortMensuelApresImpot: number
  mensualite: number
  coutTotalCredit: number
  impotAnnuel: number
  montantEmprunte: number
  dureeMois: number
}
```

### 6.2 Mensualité

Formule classique d'amortissement mensuel constant :

```
montantEmprunte  = prix + travaux + prix * fraisAcquisitionPct - apport
tauxMensuel      = tauxPct / 100 / 12
tauxAssuranceM   = assurancePct / 100 / 12
dureeMois        = dureeAnnees * 12

mensualiteHorsAss = montantEmprunte * tauxMensuel / (1 - (1 + tauxMensuel)^-dureeMois)
mensualiteAssurance = montantEmprunte * tauxAssuranceM
mensualite       = mensualiteHorsAss + mensualiteAssurance
```

Si `montantEmprunte ≤ 0` (apport couvre tout), `mensualite = 0`, `coutTotalCredit = 0`, `montantEmprunte = 0`.

### 6.3 Rendement brut

```
baseInvestissement = prix * (1 + fraisAcquisitionPct) + travaux
rendementBrutPct   = (loyerMensuel * 12) / baseInvestissement * 100
```

### 6.4 Rendement net

```
loyersAnnuelsEncaisses = loyerMensuel * (12 - vacanceMoisParAn)
chargesAnnuelles       = chargesNonRecuperables * 12 + taxeFonciere
rendementNetPct        = (loyersAnnuelsEncaisses - chargesAnnuelles) / baseInvestissement * 100
```

### 6.5 Cash-flow mensuel avant impôt

```
cashflowMensuelAvantImpot =
    loyersAnnuelsEncaisses / 12
  - mensualite
  - chargesNonRecuperables
  - taxeFonciere / 12
```

### 6.6 Effort mensuel après impôt

```
effortMensuelApresImpot = cashflowMensuelAvantImpot - impotAnnuel / 12
```

### 6.7 Impôt annuel (simplifié micro)

Deux cas uniquement V1 :

**`modeLocation === "nu"` — micro-foncier :**
```
revenuImposable = loyersAnnuelsEncaisses * (1 - 0.30)
impotAnnuel     = revenuImposable * (tmi / 100 + 0.172)
```

**`modeLocation === "meuble"` — micro-BIC :**
```
revenuImposable = loyersAnnuelsEncaisses * (1 - 0.50)
impotAnnuel     = revenuImposable * (tmi / 100 + 0.172)
```

Note V1 : on ignore le plafond micro (77 700 € en nu, 77 700 € en meublé classique). Si les recettes dépassent, on affiche un warning (cf. §6.9) mais on continue de calculer en micro, avec une mention claire.

### 6.8 Arrondi et format

- Tous les montants arrondis à l'euro près à l'affichage.
- Pourcentages à 1 décimale.
- Jamais de zéro décimal trailing ("4,8 %" pas "4,80 %").

### 6.9 Warnings contextuels

Sous le bloc résultats, afficher une ligne warning `amber-600` si :

- `loyersAnnuelsEncaisses > 77700` → `Vos recettes dépassent le seuil micro. Le régime réel est souvent plus avantageux. Un conseiller peut vous orienter.`
- `effortMensuelApresImpot < -1000` → `Cet effort mensuel élevé mérite une revue avec un conseiller.`
- `rendementBrutPct < 3` → `Rendement brut inférieur à 3 %. Un projet plus patrimonial que locatif.`
- `rendementBrutPct > 10` → `Rendement brut élevé. Vérifiez la cohérence du loyer saisi avec le marché local.`

Maximum 2 warnings affichés simultanément (les 2 premiers par ordre de priorité : seuil micro > effort > rendement faible > rendement fort).

### 6.10 Tests unitaires

Couvrir au minimum :
- Mensualité pour `(200 000 €, 3,8 %, 25 ans, assurance 0,3 %)` — résultat connu.
- Cas `apport >= prix + frais + travaux` → mensualité 0.
- Rendement brut avec et sans travaux.
- Impôt micro-foncier et micro-BIC aux 5 tranches de TMI.
- Warning seuil micro déclenché à 77 701 € annuels.

---

## 7. State management

### 7.1 État local

`useState` ou `useReducer` sur le composant parent de la page. Pas de Zustand pour cette page (le state est local, éphémère, n'a pas besoin de vivre hors de l'arbre).

### 7.2 Recalcul

À chaque changement d'input, `useMemo` sur `calcInvest(state)` pour produire `result`. Pas de debounce : le calcul est pur et <1ms.

### 7.3 Sérialisation URL

Le bouton `Copier le lien` sérialise le state complet en base64url dans un seul param :

```
/investissement/simulateur?s=eyJwcml4IjoyMDAwMDAsIm...
```

Au chargement, si `?s=` présent, parse et hydrate l'état. Si parsing échoue, toast neutre et fallback défauts. Version de schéma incluse (`v: 1`) pour anticiper évolutions.

---

## 8. API

### 8.1 Pas d'API de calcul

Le calcul est **entièrement côté client**. Aucun endpoint. C'est ce qui rend la page freemium viable : pas de coût serveur par simulation, pas de rate-limit à gérer.

### 8.2 API lead — `POST /api/public/invest/lead`

Request :
```json
{
  "firstName": "...",
  "lastName": "...",
  "email": "...",
  "phone": "...",
  "consent": true,
  "simulationState": { /* SimulatorInput complet */ },
  "simulationResult": { /* SimulatorResult complet */ }
}
```

Response 201 : `{ "ok": true, "leadId": "..." }`

Backend : stocke en table leads avec `source: "public_simulateur_invest"`, déclenche notif agent selon règles internes. Rate-limit 10 req/h/IP.

---

## 9. Arborescence front

```
src/app/(public)/investissement/simulateur/
├── page.tsx                          → composition
├── SimulatorForm.tsx                 → colonne gauche, 3 onglets
├── SimulatorResults.tsx              → colonne droite, KPI + chart + lead
├── SimulatorLegalDisclaimer.tsx      → bandeau sous la grille
├── tabs/
│   ├── TabAchat.tsx
│   ├── TabExploitation.tsx
│   └── TabFinancement.tsx
├── hooks/
│   ├── useSimulatorState.ts
│   └── useUrlSync.ts
└── lib/
    ├── calcInvest.ts                 → moteur pur
    └── calcInvest.test.ts            → tests unitaires
```

---

## 10. Disclaimer légal

Bandeau full-width sous la grille, fond `neutral-50`, `py-8`, texte 13px neutral-600, container centré `max-w-[1200px]`.

```
Cet outil fournit une simulation à titre indicatif. Les résultats dépendent des
paramètres que vous saisissez et d'hypothèses simplifiées (régimes micro
uniquement, prélèvements sociaux fixes à 17,2 %, absence de plafonds de recettes).
Propsight ne constitue pas un conseil fiscal, financier ou en investissement.
Pour une analyse personnalisée, rapprochez-vous d'un conseiller professionnel.
```

---

## 11. Design tokens et responsive

Aligné sur `01_DESIGN_SYSTEM.md`.

### 11.1 Rappels

- Violet Propsight uniquement en accent : CTA, track slider, KPI principaux.
- Radius 8px.
- Inter, poids 400/500/600.
- Pas de gradient, pas de glow.
- Animations `motion/react` pour le fade-in KPI sur changement de valeur, durée 120ms, pas d'overshoot.

### 11.2 Responsive

- `< 1024px` : la grille 2 col passe en 1 col. Le panneau résultats passe **au-dessus** du formulaire sur mobile ? **Non** : le formulaire en premier, résultats en dessous. Un CTA `Voir mes résultats ↓` sticky bas peut être ajouté V1.1 si feedback utilisateur.
- `< 768px` :
  - Onglets scrollables horizontalement si besoin.
  - Les 4 KPI principaux en 2x2, les secondaires en 1 colonne.
  - Inputs slider pleine largeur, input numérique passe en dessous du slider sur la même ligne reste lisible.
- Sticky `position: sticky` du panneau résultats désactivé sous 1024px.

---

## 12. Ce qu'on ne fait pas en V1

- Pas de régime réel foncier, pas de régime LMNP au réel, pas de SCI.
- Pas d'amortissement du bien (amortissements comptables LMNP), pas de déficit foncier.
- Pas de calcul IFI.
- Pas de calcul avec revalorisation annuelle (loyer et prix indexés) — horizon 0-25 ans figé côté mensualité uniquement.
- Pas de comparaison multi-scénarios (pour ça → Pro).
- Pas d'import d'une annonce avec auto-remplissage (pour ça → Pro).
- Pas d'estimation automatique du loyer (l'utilisateur saisit son hypothèse).
- Pas de PDF, pas d'email du rapport.
- Pas de compte, pas d'historique de simulations (seule la copie d'URL permet de retrouver une simu).
- Pas de graphique projection 10 ans patrimoine net.
- Pas de TRI ni VAN.
- Pas de suggestion de villes / stratégie automatique.
- Pas d'appel vers `/app/*`.

Tout ce qui est listé ci-dessus appartient au moteur `ScenarioInvest` Pro (cf. `12_OPPORTUNITES_INVESTISSEMENT.md` §2.3) ou au `DossierInvestissement` (`13_DOSSIER_INVESTISSEMENT__1_.md`).

---

## 13. Critères d'acceptation

- [ ] `/investissement/simulateur` rend `PublicShell` avec footer `minimal`.
- [ ] Breadcrumb `Investissement › Simulateur` présent sous le header.
- [ ] Grille 2 colonnes desktop, 1 colonne mobile.
- [ ] Panneau résultats sticky top à partir de 1024px.
- [ ] 3 onglets formulaire : Achat / Exploitation / Financement. Passer d'un onglet à l'autre ne reset rien.
- [ ] Tous les champs ont un slider **et** un input numérique synchronisés.
- [ ] Les 4 KPI principaux se mettent à jour en live sans lag (calcul pur < 1ms).
- [ ] Les warnings apparaissent selon les règles §6.9, max 2 simultanés.
- [ ] Le bouton `Réinitialiser` rétablit tous les défauts.
- [ ] Le bouton `Copier le lien` génère une URL partageable qui ré-hydrate l'état au chargement.
- [ ] `calcInvest` est couvert par des tests unitaires (au moins 6 cas).
- [ ] Le bloc lead capture poste vers `/api/public/invest/lead` avec le state et le résultat.
- [ ] Bandeau disclaimer fond `neutral-50` sous la grille.
- [ ] Pas de captcha visible V1, honeypot `website` présent.
- [ ] Aucune référence à régime réel, LMNP amortissement, SCI, TRI, VAN, PDF dans la page.
- [ ] Aucun appel backend pour le calcul — tout client-side.
- [ ] Aucun appel vers `/app/*` dans les liens.

---

**Fin du document.** Si un utilisateur demande plus (régime réel, scénarios multiples, etc.), la réponse produit est : `Pour affiner, demandez à être recontacté par un conseiller` → bloc lead capture. Pas d'ajout de features.
