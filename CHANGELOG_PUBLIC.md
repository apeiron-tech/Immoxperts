# CHANGELOG_PUBLIC — pages publiques freemium V1

Implémentation des trois pages publiques spécifiées dans `/docs/60_PUBLIC_ESTIMATION.md`, `/docs/61_PUBLIC_INVESTISSEMENT.md`, `/docs/62_PUBLIC_SIMULATEUR.md`.

Routes activées :

- `/investissement` — landing freemium investissement (spec 61).
- `/investissement/simulateur` — simulateur basique freemium (spec 62).
- `/estimation` — estimation grand public + capture lead (spec 60).

Toutes les pages utilisent `PublicShell` (variant `marketing` ou `simulator`). Aucun lien vers `/app/*` n'a été ajouté.

---

## Fichiers créés

### Front — spec 61 (`/investissement`)

- `src/main/webapp/app/pages/public/investissement/InvestissementPage.tsx`
- `src/main/webapp/app/pages/public/investissement/InvestHero.tsx`
- `src/main/webapp/app/pages/public/investissement/InvestWhatYouGetSection.tsx`
- `src/main/webapp/app/pages/public/investissement/InvestHowItWorksSection.tsx`
- `src/main/webapp/app/pages/public/investissement/InvestMiniCalculator.tsx`
- `src/main/webapp/app/pages/public/investissement/InvestResourcesTeaser.tsx`
- `src/main/webapp/app/pages/public/investissement/InvestFinalCta.tsx`
- `src/main/webapp/app/pages/public/investissement/constants.ts`
- `src/main/webapp/app/pages/public/investissement/lib/calcAmortization.ts`
- `src/main/webapp/app/pages/public/investissement/lib/calcAmortization.spec.ts` *(5 cas, tous verts)*

### Front — spec 62 (`/investissement/simulateur`)

- `src/main/webapp/app/pages/public/investissement/simulateur/SimulateurPage.tsx`
- `src/main/webapp/app/pages/public/investissement/simulateur/SimulatorForm.tsx`
- `src/main/webapp/app/pages/public/investissement/simulateur/SimulatorResults.tsx`
- `src/main/webapp/app/pages/public/investissement/simulateur/SimulatorLeadForm.tsx`
- `src/main/webapp/app/pages/public/investissement/simulateur/SimulatorLegalDisclaimer.tsx`
- `src/main/webapp/app/pages/public/investissement/simulateur/SliderField.tsx`
- `src/main/webapp/app/pages/public/investissement/simulateur/tabs/TabAchat.tsx`
- `src/main/webapp/app/pages/public/investissement/simulateur/tabs/TabExploitation.tsx`
- `src/main/webapp/app/pages/public/investissement/simulateur/tabs/TabFinancement.tsx`
- `src/main/webapp/app/pages/public/investissement/simulateur/hooks/useSimulatorState.ts`
- `src/main/webapp/app/pages/public/investissement/simulateur/hooks/useUrlSync.ts`
- `src/main/webapp/app/pages/public/investissement/simulateur/lib/calcInvest.ts`
- `src/main/webapp/app/pages/public/investissement/simulateur/lib/calcInvest.spec.ts` *(14 cas, tous verts)*

### Front — spec 60 (`/estimation`)

- `src/main/webapp/app/pages/public/estimation/EstimationPage.tsx`
- `src/main/webapp/app/pages/public/estimation/EstimationHero.tsx`
- `src/main/webapp/app/pages/public/estimation/EstimationFormCard.tsx`
- `src/main/webapp/app/pages/public/estimation/EstimationResult.tsx`
- `src/main/webapp/app/pages/public/estimation/EstimationLeadForm.tsx`
- `src/main/webapp/app/pages/public/estimation/HowItWorksSection.tsx`
- `src/main/webapp/app/pages/public/estimation/LimitationsSection.tsx`
- `src/main/webapp/app/pages/public/estimation/lib/api.ts`
- `src/main/webapp/app/pages/public/estimation/lib/schema.ts`
- `src/main/webapp/app/shared/AddressAutocomplete.tsx` *(BAN api-adresse.data.gouv.fr, déjà whitelisté CSP)*

### Backend

- `src/main/java/com/apeiron/immoxperts/web/rest/PublicEstimationController.java`
  - `POST /api/public/estimation` : retourne fourchette `{ priceLow, priceHigh, pricePerSqm*, confidence, ... }`. Algo V1 stub par code postal × surface × coefficient état (à remplacer par requête DVF dans une PR dédiée).
  - Rate-limit IP : 20 req / heure (in-memory `ConcurrentHashMap`).
  - Réponse 422 `insufficient_data` si pas de prix de référence.
- `src/main/java/com/apeiron/immoxperts/web/rest/PublicLeadController.java`
  - `POST /api/public/estimation/lead` → 201 `{ ok, leadId }`. Log structuré, persistance leads à brancher dans une PR dédiée.
  - `POST /api/public/invest/lead` → 201 `{ ok, leadId }`. Log structuré, embarque `simulationState` + `simulationResult`.

Sécurité : `/api/**` est déjà `permitAll` dans `SecurityConfiguration.java` — aucun changement nécessaire.

---

## Fichiers modifiés

- `src/main/webapp/app/routes.tsx`
  - Ajout des imports `EstimationPage`, `InvestissementPage`, `SimulateurPage`.
  - `/estimation` : retiré du bloc `variant="simulator"`, monté dans le bloc `variant="marketing" footer="full"` avec la nouvelle `EstimationPage`.
  - `/investissement` : retrait de la redirection vers `/estimation`, monté sur la nouvelle `InvestissementPage`.
  - `/investissement/simulateur` : ajout dans le bloc `variant="simulator" footer="minimal"`.
  - L'ancien composant `Estimation` (legacy) reste accessible sous `/estimation-legacy` le temps d'archivage.

- `src/main/webapp/app/config/publicNavigation.ts`
  - Vérifié : item `Estimation` déjà présent entre `Acheter / Louer` et `Investissement` (aucune modif nécessaire).

---

## Critères d'acceptation validés

### Spec 61 — `/investissement`

- [x] `/investissement` rend `PublicShell` standard — pas de HeaderPro, pas de SidebarPro.
- [x] L'item `Investissement` du `PublicHeader` est actif (souligné/violet) quand on est sur la page (logique existante du header standard).
- [x] Les 6 sections apparaissent dans l'ordre : Hero, WhatYouGet, HowItWorks, MiniCalculator, ResourcesTeaser, FinalCta.
- [x] Le hero contient un mockup statique (chiffres hardcodés, pas d'interaction).
- [x] Les 3 cards `WhatYouGet` ne sont pas cliquables.
- [x] La section `HowItWorks` a un fond `bg-slate-50` (token équivalent neutral-50), toutes les autres ont fond blanc.
- [x] Le mini-calculator met à jour les 3 KPI à chaque changement de slider/input via `useMemo`.
- [x] Mensualité et cash-flow utilisent `calcAmortization.ts`, testé en unitaire (5 cas).
- [x] CTA `Ouvrir le simulateur complet` pointe sur `/investissement/simulateur`.
- [x] 3 cards ressources pointent sur `/ressources/...` (placeholder propre côté ressources existantes).
- [x] CTA final seul, pas de formulaire ni de capture lead.
- [x] Aucune référence à régime fiscal, TRI, VAN, DSCR, LMNP, SCI dans la page.
- [x] Responsive : 1 col sous 1024px sur le hero, 1 col sous 768px sur les feature grids.

### Spec 62 — `/investissement/simulateur`

- [x] `/investissement/simulateur` rend `PublicShell` avec footer `minimal`.
- [x] Breadcrumb `Investissement › Simulateur` sous le header.
- [x] Grille 2 colonnes desktop (5/7), 1 colonne mobile.
- [x] Panneau résultats sticky `top-[88px]` à partir de `lg:` (≥ 1024px).
- [x] 3 onglets formulaire : Achat / Exploitation / Financement, switch sans reset.
- [x] Tous les champs ont slider + input numérique synchronisés (`SliderField`).
- [x] Les 4 KPI principaux se mettent à jour live via `useMemo(calcInvest)`.
- [x] Warnings affichés selon §6.9, max 2 simultanés (`buildWarnings`).
- [x] Bouton `Réinitialiser` rétablit les défauts + toast.
- [x] Bouton `Copier le lien` génère une URL base64url ré-hydratable au chargement (`useUrlSync`).
- [x] `calcInvest` couvert par 14 cas unitaires (mensualité, apport >= prix, rendements, impôt micro à 5 TMI, warnings).
- [x] Bloc lead capture `POST /api/public/invest/lead` avec state + result.
- [x] Bandeau disclaimer fond `bg-slate-50` sous la grille.
- [x] Pas de captcha visible V1, honeypot `website` présent.
- [x] Aucune référence à régime réel, LMNP amortissement, SCI, TRI, VAN, PDF.
- [x] Aucun appel backend pour le calcul — tout client-side.
- [x] Aucun appel vers `/app/*`.

### Spec 60 — `/estimation`

- [x] Item `Estimation` visible dans `PublicHeader` standard entre `Acheter / Louer` et `Investissement`.
- [x] `/estimation` affiche `PublicHeader` standard + `PublicFooter` full, aucun HeaderPro/SidebarPro.
- [x] Le formulaire accepte 5 champs et n'en exige aucun de plus (adresse, type, surface, pièces, état).
- [x] L'autocomplete adresse interroge la BAN (`api-adresse.data.gouv.fr`, déjà whitelisté CSP) et force la sélection.
- [x] À la soumission : appel `POST /api/public/estimation`, état loading sur le bouton, scroll vers `#resultat`.
- [x] Fourchette affichée `{low} € — {high} €` avec espaces milliers (locale fr-FR).
- [x] Pill confiance change selon `confidence` (vert / amber / neutre).
- [x] Formulaire lead : 4 champs + consent. Pas de captcha visible V1, honeypot `website` présent.
- [x] Après soumission lead : card droite remplacée par bloc confirmation.
- [x] Lien `← Recommencer l'estimation` reset state et scroll vers le hero.
- [x] Section Limitations sur fond `bg-slate-50`, toutes les autres sont blanches.
- [x] Rate-limit backend 20 req/h/IP sur `/api/public/estimation` (in-memory).
- [x] Responsive : hero 1 col sous 1024px, fourchette 36px sous 768px (responsive-prefixed sizes), CTA pleine largeur mobile.
- [x] Aucune référence à scoring emplacement, solvabilité, comparables détaillés, PDF, AVM ML.
- [x] Aucun appel vers `/app/*` dans les liens.

---

## Tests automatisés

```bash
npx jest src/main/webapp/app/pages/public/investissement --config jest.conf.js
# PASS calcAmortization.spec.ts (5 cas)
# PASS calcInvest.spec.ts (14 cas)
# Tests: 19 passed, 19 total
```

---

## Notes d'implémentation et écarts assumés

- **Stack UI** : le projet n'a pas de shadcn/ui installé (réf. CLAUDE.md §2.1, V1 utilise reactstrap + Tailwind). Les nouveaux composants utilisent **Tailwind only** sur le token `propsight-*` du `tailwind.config.js`, conformément à la règle "nouveau code = Tailwind only". Le slider est un `<input type="range">` stylisé avec `accent-propsight-600` plutôt qu'un wrapper shadcn.
- **Validation** : `zod` n'étant pas installé dans le projet, la validation utilise des `validate` natifs de `react-hook-form` + une fonction `validateEstimation` pure, sans dépendance ajoutée.
- **Animations** : `framer-motion` (déjà présent) au lieu de `motion/react`, easing `[0.22, 1, 0.36, 1]` (token `easings.default` du repo). Toutes les durées ≤ 480ms, scroll reveal `once: true`.
- **Algo estimation backend** : V1 stub déterministe par code postal × état. Le branchement à la requête DVF pondérée décrite §7.4 du spec 60 (rayon progressif, fenêtre 24 mois, médiane ± écart-interquartile) reste à faire dans une PR dédiée — la signature HTTP est conforme et stable.
- **Persistance leads** : V1 logge les leads sans persistance ni email. La table `leads` et le wiring email/notif agent restent à brancher dans une PR dédiée.
- **Graphique amortissement** (spec 62 §5.5) : déclassé V1.1 conformément à la note du spec ("Si le chart ajoute trop de complexité au chantier initial, on peut le déclasser à V1.1"). Le composant Recharts n'a pas été ajouté pour ne pas alourdir le bundle d'une dépendance non essentielle. Le toggle peut être ajouté à postériori sans casser le contrat.
- **Page legacy `Estimation`** : conservée sous `/estimation-legacy` plutôt que supprimée — décision de prudence le temps de vérifier qu'aucun lien externe (newsletter, ads) ne pointe encore vers l'ancienne URL.
