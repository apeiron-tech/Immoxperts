# Propsight — Page publique `/estimation`

**Version :** V1 freemium
**Statut :** Spécification prête pour Claude Code
**Route :** `/estimation`
**Shell parent :** `PublicShell` variant `standard`
**Auth :** Non
**Type de page :** landing freemium + formulaire court + résultat indicatif

---

## 0. Pourquoi cette page

La route `/estimation` est aujourd'hui vide. On a besoin d'une **version freemium extrêmement simple** qui permette à un particulier (vendeur potentiel, propriétaire curieux) de recevoir en quelques champs une **fourchette de prix indicative** sur son bien, puis d'être invité à demander un avis de valeur officiel auprès d'un conseiller (capture lead).

Cette page **n'est pas** :
- Le parcours widget partenaire (`/widget/estimation`, déjà spécifié dans `40_WIDGETS_PUBLICS.md`)
- L'estimation rapide Pro (`/app/estimation/rapide`, spécifiée dans `10_ESTIMATION_RAPIDE.md` et `ARCHITECTURE_ESTIMATION.md`)
- Un AVM complet avec comparables, scoring emplacement, solvabilité, etc.

Tout ce qui est Pro reste Pro. La page publique livre une **fourchette** et un **lien vers un conseiller**. Rien de plus.

---

## 1. Contexte dans la navigation

### 1.1 Ajout au header public

Ajouter l'item `Estimation` au `PublicHeader variant="standard"` entre `Acheter / Louer` et `Investissement` :

```
[Logo]  [Prix immobiliers] [Acheter / Louer] [Estimation] [Investissement] [Ressources]   [Espace Pro]
```

Mettre à jour `src/main/webapp/app/config/publicNavigation.ts` :

```ts
export const publicNavStandard: PublicNavItem[] = [
  { label: "Prix immobiliers", to: "/prix-immobiliers" },
  { label: "Acheter / Louer", to: "/annonces" },
  { label: "Estimation", to: "/estimation" },
  { label: "Investissement", to: "/investissement" },
  { label: "Ressources", to: "/ressources" },
]
```

### 1.2 Entrée depuis la landing `/`

La carte `Estimation` de `PublicProductCards` (landing `/`) pointe également sur `/estimation`.

### 1.3 Footer

`/estimation` utilise `PublicFooter` variant `full` (cf. `00_ARCHITECTURE_GLOBALE.md` §8).

---

## 2. Structure de la page

Layout vertical standard landing Propsight (cf. `08_LANDING_PATTERNS.md`).

```
PublicHeader (standard)

┌──────────────────────────────────────────┐
│ 1. EstimationHero                         │  Section 1 - hero avec form court
├──────────────────────────────────────────┤
│ 2. EstimationResult (conditionnel)        │  Section 2 - résultat + CTA lead
├──────────────────────────────────────────┤
│ 3. HowItWorksSection                      │  Section 3 - 3 étapes pédagogiques
├──────────────────────────────────────────┤
│ 4. LimitationsSection                     │  Section 4 - transparence méthodo
├──────────────────────────────────────────┤
│ 5. ProTeaserSection (partagée)            │  Section 5 - teaser offre Pro
└──────────────────────────────────────────┘

PublicFooter (full)
```

Le résultat (section 2) n'apparaît **que** après soumission du formulaire — scroll automatique vers cette section.

---

## 3. Section 1 — `EstimationHero`

### 3.1 Layout desktop (≥ 1024px)

Grille 2 colonnes, container `max-w-[1200px]`, `py-20` vertical.

```
┌───────────────────────────────┬───────────────────────────────┐
│  Eyebrow "Estimation gratuite"│                               │
│                               │  ┌─────────────────────────┐ │
│  H1 en 2 lignes max            │  │  EstimationFormCard     │ │
│  "Combien vaut votre bien ?"   │  │  (formulaire condensé)  │ │
│                                │  │                         │ │
│  Sous-titre 2 lignes           │  │                         │ │
│  "Une fourchette indicative…"  │  │                         │ │
│                                │  │                         │ │
│  3 pills réassurance inline    │  │                         │ │
│  ✓ Gratuit                     │  │                         │ │
│  ✓ Sans engagement             │  │                         │ │
│  🔒 Confidentiel               │  └─────────────────────────┘ │
└───────────────────────────────┴───────────────────────────────┘
```

### 3.2 Textes (copier tel quel)

- **Eyebrow** (petit texte violet-500 uppercase, tracking wide) : `ESTIMATION GRATUITE`
- **H1** (48-56px, weight 500) : `Combien vaut votre bien ?`
- **Sous-titre** (18-20px, neutral-600) : `Recevez en quelques secondes une fourchette indicative basée sur les prix réels observés dans votre secteur. Sans inscription, sans engagement.`
- **Pills** sous sous-titre (3 chips inline, fond neutral-50, border neutral-200, radius 8px, padding 6/12) :
  - `✓ Gratuit`
  - `✓ Sans engagement`
  - `🔒 Confidentiel`

### 3.3 EstimationFormCard (colonne droite)

Card bordée `1px neutral-200`, radius 8px, padding 32px, fond blanc.

Formulaire minimaliste, **5 champs seulement**. Utiliser `react-hook-form` + `zod`.

| Champ | Type | Obligatoire | Validation | Placeholder |
|---|---|---|---|---|
| `address` | `AddressAutocomplete` (BAN, voir §3.4) | ✓ | non vide, retourne lat/lng | `22 rue de la Pompe, 75116 Paris` |
| `propertyType` | radio group 2 options | ✓ | `"appartement"` ou `"maison"` | — |
| `surface` | input number | ✓ | 9 ≤ x ≤ 1000 | `Surface en m²` |
| `rooms` | select 1-6 + `6+` | ✓ | — | `Nombre de pièces` |
| `condition` | select 4 options | ✓ | `"neuf" / "bon" / "a-rafraichir" / "a-renover"` | — |

Libellés options `condition` : `Neuf ou récent`, `Bon état`, `À rafraîchir`, `À rénover`.

Pas de champ DPE en V1, pas d'étage, pas d'équipements, pas d'année de construction. Ces champs vivent dans le parcours Pro et widget uniquement.

**Bouton submit** : largeur 100%, violet-500, texte blanc, hauteur 48px, radius 8px.
Libellé : `Estimer mon bien`. Icône chevron droit.

**Mention légale** sous le bouton, 12px, neutral-500 :
> Estimation indicative générée à partir des données publiques DVF. Ne constitue pas un avis de valeur officiel.

### 3.4 `AddressAutocomplete`

Composant à créer (ou réutiliser s'il existe déjà dans la couche publique, ex. sur `/prix-immobiliers` ou `/annonces`). Source : **API BAN** (adresse.data.gouv.fr), endpoint `/search`.

- Debounce 250ms
- Minimum 3 caractères avant requête
- Dropdown max 5 résultats, chaque item affiche `label` + code postal + ville
- Sélection fige l'item, stocke `{ label, postcode, city, lat, lng }` dans le state form
- Validation : l'item doit avoir été **choisi** dans la dropdown (pas juste tapé libre). Message d'erreur : `Sélectionnez une adresse dans la liste.`

### 3.5 Soumission

Au clic submit :
1. Validation zod côté client. Si erreur, toast + focus sur le premier champ en erreur.
2. Appel `POST /api/public/estimation` (cf. §7).
3. État loading sur le bouton pendant l'appel (spinner + libellé `Estimation en cours…`, bouton désactivé).
4. Réception : injection du résultat dans le state de page + scroll smooth vers `#resultat`.
5. Erreur API : bannière rouge dans la card, libellé `Impossible d'estimer votre bien pour le moment. Réessayez dans quelques instants.` Pas de détails techniques.

---

## 4. Section 2 — `EstimationResult` (conditionnelle)

Apparaît uniquement après soumission réussie. Ancre : `id="resultat"`.

### 4.1 Layout

Grille 2 colonnes desktop (40% / 60% ou équivalent), 1 colonne mobile.

```
┌──────────────────────────┬──────────────────────────────────┐
│  Votre estimation         │  Demander un avis officiel        │
│                           │                                   │
│  Icône maison violet      │  Formulaire lead 4 champs         │
│  Fourchette XXL violet    │  Prénom · Nom                      │
│  Prix au m² neutral-600   │  Email                             │
│  Pill confiance           │  Téléphone                         │
│                           │  [ ] Consentement RGPD             │
│  3 facts inline :         │                                   │
│  • Adresse                │  [CTA Être recontacté par un      │
│  • Surface / pièces       │   conseiller]                     │
│  • Type / état            │                                   │
│                           │  ou [lien Recommencer l'estimation]│
│  Paragraphe "Sur quoi…"   │                                   │
│                           │                                   │
└──────────────────────────┴──────────────────────────────────┘
```

### 4.2 Colonne gauche — le résultat

**Titre** (32px, weight 500) : `Votre estimation`

**Fourchette prix** (48px, weight 600, couleur violet-600) :
```
482 000 € — 515 000 €
```
Format : séparateur milliers espace insécable, pas de décimales. Sur mobile, descend à 36px.

**Prix au m²** (16px, neutral-600) : `Soit 8 310 € — 8 880 € / m²`

**Pill confiance** (inline, juste sous prix au m²) :
- `✓ Fiabilité forte` (fond green-50, texte green-700, border green-200) si `confidence === "high"`
- `◆ Fiabilité moyenne` (fond amber-50, texte amber-700, border amber-200) si `confidence === "medium"`
- `⚠ Fiabilité limitée` (fond neutral-50, texte neutral-700, border neutral-300) si `confidence === "low"`

**Recap 3 facts** (liste verticale, icônes lucide 16px neutral-700) :
- 📍 `{address.label}`
- 📐 `{surface} m² · {rooms} pièce(s)`
- 🏠 `{propertyType === "appartement" ? "Appartement" : "Maison"} · {label condition}`

**Paragraphe explicatif** (neutral-600, 14px, line-height 1.6) :
> Cette fourchette est calculée à partir des transactions immobilières réelles observées dans votre secteur au cours des 24 derniers mois, ajustées selon la surface et l'état de votre bien. Elle ne remplace pas l'avis d'un professionnel.

### 4.3 Colonne droite — capture lead

Card fond neutral-50, border neutral-200, radius 8px, padding 32px.

**Titre** (20px, weight 500) : `Obtenir un avis de valeur officiel`
**Sous-titre** (14px, neutral-600) : `Un conseiller local vous recontacte sous 24h pour affiner cette estimation gratuitement.`

Formulaire `react-hook-form` + `zod` :

| Champ | Type | Obligatoire | Validation |
|---|---|---|---|
| `firstName` | input text | ✓ | min 2 |
| `lastName` | input text | ✓ | min 2 |
| `email` | input email | ✓ | email valide |
| `phone` | input tel | ✗ (recommandé) | si rempli, format FR `^(?:\+33\|0)[1-9](?:[ .-]?\d{2}){4}$` |
| `consent` | checkbox | ✓ | doit être coché |

Libellé consent (12px, neutral-500) :
> J'accepte d'être recontacté par un conseiller Propsight ou un partenaire. Mes données sont traitées conformément à la [politique de confidentialité](/confidentialite).

**CTA primaire** (pleine largeur, violet-500) : `Être recontacté par un conseiller`

**Lien texte sous CTA** (centré, 14px, neutral-600, underline au hover) : `← Recommencer l'estimation`
→ reset le form section 1, scroll vers le hero, cache le résultat.

### 4.4 Après soumission lead

Remplacer la card droite par un bloc confirmation :
- Icône check violet 48px centrée
- Titre : `Merci, votre demande a bien été transmise.`
- Paragraphe : `Un conseiller vous recontacte sous 24h.`
- CTA secondaire outline : `Explorer les prix du marché` → `/prix-immobiliers`

Pas de confettis, pas d'animation fancy. Transition fade 200ms `easings.default`.

---

## 5. Section 3 — `HowItWorksSection`

### 5.1 Layout

Pattern feature grid 3 cards (cf. `08_LANDING_PATTERNS.md` §2.2), fond blanc, `py-24`.

**Eyebrow** : `COMMENT ÇA MARCHE`
**H2** (32-40px) : `Trois étapes pour situer la valeur de votre bien`

### 5.2 Les 3 cards

| # | Icône lucide | Titre | Description |
|---|---|---|---|
| 1 | `MapPin` | Une adresse | Saisissez l'adresse du bien et ses caractéristiques principales. |
| 2 | `BarChart3` | Des données réelles | On croise votre bien avec les transactions DVF et les annonces du secteur. |
| 3 | `MessageSquare` | Un avis humain | Un conseiller peut affiner gratuitement l'estimation si vous le souhaitez. |

Icône violet-500 24px en haut de chaque card, titre weight 500 20px, description neutral-600 15px.

---

## 6. Section 4 — `LimitationsSection`

### 6.1 Intention

Section transparente sur les limites de l'estimation gratuite. Renforce la confiance sans casser la conversion. Positionne l'offre Pro / conseiller comme le vrai approfondissement.

### 6.2 Layout

Grille 2 colonnes sur fond `neutral-50` (section de contraste autorisée, cf. `08_LANDING_PATTERNS.md` §1.1), `py-20`.

```
┌─────────────────────┬─────────────────────┐
│ H2 + paragraphe     │ Liste checks        │
│                     │                     │
│ "Une fourchette,    │ ✓ 12M+ transactions │
│  pas un avis."      │ ✓ Mise à jour…      │
│                     │ ✓ Seul l'humain…    │
└─────────────────────┴─────────────────────┘
```

### 6.3 Textes

**Colonne gauche**
- H2 : `Une fourchette, pas un avis de valeur.`
- Paragraphe (neutral-600, 16px) : `Notre estimation en ligne s'appuie sur les prix observés dans votre quartier et sur les caractéristiques que vous avez saisies. Elle vous donne une première idée, utile avant toute décision. Pour un chiffrage précis tenant compte de l'état exact, des prestations, du contexte de copropriété et du marché local, un conseiller reste indispensable.`

**Colonne droite** — bullet list pattern `08_LANDING_PATTERNS.md` §2.3 :

- `Données publiques officielles` — `Transactions DVF, annonces agrégées, INSEE. Toutes nos sources sont publiques et vérifiables.`
- `Mise à jour régulière` — `Les données sont rafraîchies chaque semaine. Votre fourchette reflète le marché récent.`
- `L'humain fait la différence` — `Un conseiller voit ce qu'un algorithme ne voit pas : la lumière, le bruit, la qualité de l'immeuble, l'ambiance du quartier.`

---

## 7. API contract — `POST /api/public/estimation`

Endpoint backend à créer. Pas d'authentification, rate-limit IP (cf. §9.3).

### 7.1 Request

```json
{
  "address": {
    "label": "22 rue de la Pompe, 75116 Paris",
    "postcode": "75116",
    "city": "Paris",
    "lat": 48.8650,
    "lng": 2.2793
  },
  "propertyType": "appartement",
  "surface": 58,
  "rooms": 3,
  "condition": "bon"
}
```

### 7.2 Response 200

```json
{
  "priceLow": 482000,
  "priceHigh": 515000,
  "pricePerSqmLow": 8310,
  "pricePerSqmHigh": 8880,
  "confidence": "high",
  "comparableCount": 27,
  "radiusMeters": 400,
  "sampleWindowMonths": 24,
  "methodology": "dvf_weighted_v1"
}
```

### 7.3 Response 422 (données insuffisantes)

```json
{
  "error": "insufficient_data",
  "message": "Pas assez de transactions récentes dans ce secteur pour produire une estimation fiable."
}
```

UI affiche un message dédié dans la card résultat + CTA `Parler à un conseiller` (scroll direct vers le formulaire lead, sans fourchette).

### 7.4 Règles backend V1 (pragmatique, sans ML)

- Rayon progressif : 200m → 400m → 800m → 1500m jusqu'à obtenir ≥ 10 comparables.
- Fenêtre temporelle : 24 mois glissants.
- Filtres comparables : même `propertyType`, surface dans ±30%, même commune ou commune limitrophe.
- Ajustement `condition` : coefficient appliqué sur la médiane (`neuf: 1.08`, `bon: 1.00`, `a-rafraichir: 0.94`, `a-renover: 0.85`). Ces coefs sont **V1 figés**, à re-calibrer après 3 mois de données.
- Fourchette = médiane ± 1 écart-interquartile ajusté.
- `confidence` :
  - `high` si ≥ 20 comparables dans ≤ 400m
  - `medium` si ≥ 10 comparables ou rayon étendu 400-800m
  - `low` si < 10 comparables ou rayon > 800m

Aucun appel à l'AVM ML interne pour cette route V1 — elle reste Pro.

### 7.5 API lead capture — `POST /api/public/estimation/lead`

Request :
```json
{
  "estimationId": "uuid",
  "firstName": "...",
  "lastName": "...",
  "email": "...",
  "phone": "...",
  "consent": true
}
```

Response 201 : `{ "ok": true }`

Le backend enregistre le lead dans la table leads avec `source: "public_estimation"` et déclenche l'email / notif agent selon les règles internes (hors scope de cette spec).

---

## 8. Arborescence front

Créer :

```
src/app/(public)/estimation/
├── page.tsx                          → composition des sections
├── EstimationHero.tsx
├── EstimationFormCard.tsx
├── EstimationResult.tsx
├── HowItWorksSection.tsx
├── LimitationsSection.tsx
└── lib/
    ├── schema.ts                     → zod schemas
    └── api.ts                        → fetch wrappers

src/shared/
└── AddressAutocomplete.tsx           → si pas déjà créé pour /prix-immobiliers
```

Le `ProTeaserSection` est un composant partagé déjà présent (ou à rapatrier depuis la landing `/`), à ne pas dupliquer.

---

## 9. Design tokens et règles

Strictement aligné sur `01_DESIGN_SYSTEM.md` et `08_LANDING_PATTERNS.md`.

### 9.1 Rappels structurants

- Pas de mesh gradient, pas de halo, pas de glow.
- Violet en **accent** uniquement : CTA primaire, pill eyebrow, prix affiché, icônes.
- Radius 8px partout.
- Typographie Inter, poids 400/500/600 max.
- Fond blanc dominant, une seule section fond `neutral-50` (Limitations).
- Animations via `motion/react` uniquement, durées 180-240ms, `easings.default` (cf. `07_MOTION_LANGUAGE.md`).

### 9.2 Responsive

Breakpoints Tailwind standards.

- `< 1024px` : grille du hero passe en 1 colonne, la card formulaire passe en dessous du bloc texte.
- `< 768px` : fourchette prix descend à 36px, card lead pleine largeur, pills réassurance wrap.
- Tous les CTA passent pleine largeur en mobile.

### 9.3 Sécurité / abus

- Rate-limit IP sur `/api/public/estimation` : 20 req / heure / IP, en mémoire (Redis si dispo, sinon LRU in-proc côté gateway).
- Honeypot field caché `website` dans le formulaire lead (si rempli, 204 silencieux).
- Pas de captcha V1 (frein UX). Si abus constaté, ajouter hCaptcha invisible V2.

---

## 10. Ce qu'on ne fait pas en V1

Liste stricte, à ne pas déborder :

- Pas de score emplacement (6 dimensions A→E), pas de pills "Vie de quartier", "Fibré", etc.
- Pas de bloc solvabilité, pas d'INSEE Filosofi.
- Pas de bloc comparables détaillés avec liste de ventes récentes adresse par adresse.
- Pas d'historique ventes à l'adresse.
- Pas de carte interactive ni heatmap.
- Pas de DPE consommation, pas d'étiquette énergie.
- Pas de génération PDF.
- Pas d'espace compte vendeur pour retrouver son estimation. Une estimation = une session.
- Pas de versioning d'estimations, pas de comparaison multi-biens.
- Pas de simulation d'emprunt.
- Pas d'intégration aux widgets partenaires (ces widgets vivent via leur propre route `/widget/estimation`).
- Pas d'appel AVM ML interne.
- Pas de parcours en 7 écrans type widget. **Une seule page, un seul écran, résultat inline.**

Tout ce qui est listé ci-dessus appartient au parcours Pro (`/app/estimation/*`) ou aux widgets partenaires (`/widget/estimation`).

---

## 11. Critères d'acceptation

- [ ] Item `Estimation` visible dans `PublicHeader variant="standard"` entre `Acheter / Louer` et `Investissement`.
- [ ] `/estimation` affiche `PublicHeader` standard + `PublicFooter` full, aucun HeaderPro ou SidebarPro.
- [ ] Le formulaire accepte 5 champs et n'en exige aucun de plus.
- [ ] L'autocomplete adresse interroge la BAN et force la sélection d'une proposition.
- [ ] À la soumission, appel `/api/public/estimation`, état loading sur le bouton, scroll vers `#resultat`.
- [ ] La fourchette affichée suit le format `{low} € — {high} €` avec espaces insécables milliers.
- [ ] La pill confiance change de couleur selon `confidence` (`high`/`medium`/`low`).
- [ ] Le formulaire lead contient exactement 4 champs + consent. Pas de captcha visible V1.
- [ ] Après soumission lead, la card droite est remplacée par un bloc confirmation.
- [ ] Le lien `← Recommencer l'estimation` reset proprement le state et repositionne le scroll.
- [ ] Section Limitations sur fond `neutral-50`, toutes les autres sections fond blanc.
- [ ] Rate-limit backend : 20 req/h/IP sur l'endpoint estimation.
- [ ] Responsive : hero en 1 colonne sous 1024px, fourchette 36px sous 768px, CTA pleine largeur mobile.
- [ ] Aucune référence à un scoring emplacement, solvabilité, comparables détaillés, PDF, AVM ML.
- [ ] Aucun appel vers `/app/*` dans les liens.

---

**Fin du document.** Toute demande d'enrichissement fonctionnel (DPE, comparables détaillés, score emplacement, PDF) doit être refusée V1 et redirigée vers le parcours Pro.
