# 20 — Mocks Data (MSW)

**Durée estimée** : 2h30
**Objectif** : Implémenter tous les mocks MSW nécessaires pour faire tourner l'UI module Estimation sans back ni AVM réels. Endpoints cohérents, fixtures réalistes (Paris / Lyon / Bordeaux), variations selon inputs.

Ce fichier est **transversal** : il couvre les mocks de toutes les briques (03 à 12). Les fichiers précédents peuvent pointer vers ce fichier pour dire "utilise ce handler MSW".

---

## Principe

- **MSW v2** intercepte tous les `fetch()` sortants.
- **Handlers organisés par domaine** dans `/src/mocks/handlers/` (un fichier par service).
- **Fixtures** (données statiques) dans `/src/mocks/fixtures/` (JSON ou TS).
- **Cohérence** : quand on fetch `/api/avm` avec une adresse Paris 15e, on récupère un prix Paris, pas Bordeaux. Les mocks sont **paramétrables** selon les inputs.
- **Latences simulées** : AVM renvoie en 800ms (simule un vrai appel ML), Filosofi en 200ms, DVF en 300ms.
- **Erreurs simulées** : possibilité d'activer un flag `__MSW_SIMULATE_ERROR` dans localStorage pour tester les états d'erreur.

---

## Structure de dossiers

```
/src/mocks
  /handlers
    index.ts                 ← Agrège tous les handlers
    avm.ts                   ← POST /api/avm
    solvabilite.ts           ← POST /api/solvabilite
    estimation-rapide.ts     ← CRUD /api/estimations/rapide
    avis-valeur.ts           ← CRUD /api/avis-valeur
    etude-locative.ts        ← CRUD /api/etudes-locatives
    bien.ts                  ← GET /api/biens, /api/biens/[id]
    annonce.ts               ← GET /api/annonces (depuis URL scraping)
    dvf.ts                   ← GET /api/dvf/adresse, /api/dvf/comparables
    comparables.ts           ← GET /api/comparables (annonces + DVF + scoring)
    scoring-emplacement.ts   ← GET /api/scoring-emplacement
    insee.ts                 ← GET /api/insee/iris, /api/insee/filosofi
    taux-bdf.ts              ← GET /api/taux-bdf (taux emprunt actuel)
    encadrement-loyers.ts    ← GET /api/encadrement-loyers
    email.ts                 ← POST /api/rapports/envoyer
    tracking.ts              ← GET /api/rapports/[token]/tracking
    lead.ts                  ← POST /api/leads, GET /api/leads
  /fixtures
    biens-paris.ts
    biens-lyon.ts
    biens-bordeaux.ts
    annonces.ts
    dvf-transactions.ts
    insee-iris.ts
    users.ts
    organisations.ts
  browser.ts                 ← Setup MSW pour Next.js client
  server.ts                  ← Setup MSW pour Node (tests, SSR)
```

---

## Setup MSW dans Next.js 15

### `/src/mocks/browser.ts`

```ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

### `/src/mocks/server.ts`

```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

### `/src/mocks/handlers/index.ts`

```ts
import { avmHandlers } from './avm'
import { solvabiliteHandlers } from './solvabilite'
import { estimationRapideHandlers } from './estimation-rapide'
// ... etc

export const handlers = [
  ...avmHandlers,
  ...solvabiliteHandlers,
  ...estimationRapideHandlers,
  // ...
]
```

### Activation dans l'app

Créer `/src/app/layout-client.tsx` :

```tsx
'use client'
import { useEffect, useState } from 'react'

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(process.env.NODE_ENV !== 'development')

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const init = async () => {
      const { worker } = await import('@/mocks/browser')
      await worker.start({ onUnhandledRequest: 'bypass' })
      setReady(true)
    }
    init()
  }, [])

  if (!ready) return null
  return <>{children}</>
}
```

Wrapper l'app dans `layout.tsx` avec `<MswProvider>`.

---

## 1. Handler AVM — `POST /api/avm`

### Spec

Retourne l'estimation AVM complète selon les inputs. Structure conforme au contrat ML défini dans `ARCHITECTURE_ESTIMATION.md` section 6.

### Logique de mock

- Prix de base = fonction de la ville :
  - Paris : 10 000 €/m² × modulateur arrondissement
  - Lyon : 5 000 €/m²
  - Bordeaux : 4 800 €/m²
  - Fallback autre : 3 500 €/m²
- Ajustements :
  - État "refait à neuf" : +8%, "à rafraîchir" : -5%, "à rénover" : -15%
  - DPE A/B : +3%, D : 0, E : -2%, F/G : -8%
  - Étage élevé + ascenseur : +2%
  - Balcon : +1.5%, Terrasse : +3%, Parking : +2%
  - Année < 1950 : -2%, > 2010 : +4%
- Fourchette : ±6% autour de la médiane
- Confiance : 0.85 si tous champs critiques remplis, descend de 0.05 par champ manquant (min 0.40)
- Loyer estimé : prix_m2 × 0.35% (cohérent rendement brut ~3.5-4%)
- Comparables : 5 à 10 faux biens proches (générés avec variation ±15% sur surface, prix)
- `features_importance` : array de 5 features avec contribution sommée à 1
- `ajustements` : tableau reflétant les règles ci-dessus, libellés humains
- `marche_reference` : calcul d'écart par rapport au prix de base de la ville

### Handler

```ts
// /src/mocks/handlers/avm.ts
import { http, HttpResponse, delay } from 'msw'
import { computeMockAvm } from '@/mocks/logic/avm-engine'

export const avmHandlers = [
  http.post('/api/avm', async ({ request }) => {
    const inputs = await request.json() as AvmInputs

    // Simule temps de calcul
    await delay(800)

    // Simule erreur si flag
    if (typeof window !== 'undefined' && window.localStorage.getItem('__MSW_SIMULATE_ERROR') === 'avm') {
      return new HttpResponse(null, { status: 503 })
    }

    const response = computeMockAvm(inputs)
    return HttpResponse.json(response)
  })
]
```

### Logique engine (à implémenter dans `/src/mocks/logic/avm-engine.ts`)

```ts
export function computeMockAvm(inputs: AvmInputs): AvmResponse {
  const prixM2Base = getPrixBase(inputs.adresse)
  const modifs = computeAjustements(inputs)
  const prixM2 = Math.round(prixM2Base * (1 + modifs.totalPct))
  const prix = Math.round(prixM2 * inputs.surface_habitable)

  const confiance = computeConfiance(inputs)

  return {
    prix: {
      estimation: prix,
      fourchette_basse: Math.round(prix * 0.94),
      fourchette_haute: Math.round(prix * 1.06),
      prix_m2: prixM2,
      prix_m2_fourchette_basse: Math.round(prixM2 * 0.94),
      prix_m2_fourchette_haute: Math.round(prixM2 * 1.06),
      confiance,
      confiance_label: confiance >= 0.75 ? 'fort' : confiance >= 0.5 ? 'bon' : 'faible',
    },
    loyer: {
      estimation: Math.round(prix * 0.0035),
      fourchette_basse: Math.round(prix * 0.0031),
      fourchette_haute: Math.round(prix * 0.0039),
      loyer_m2: Math.round(prixM2 * 0.0035 * 10) / 10,
      confiance: confiance - 0.05,
      confiance_label: 'bon',
    },
    comparables: generateComparables(inputs, 8),
    features_importance: [
      { feature: 'localisation_iris', contribution: 0.34 },
      { feature: 'surface', contribution: 0.28 },
      { feature: 'etat', contribution: 0.12 },
      { feature: 'dpe', contribution: 0.08 },
      { feature: 'etage', contribution: 0.06 },
    ],
    ajustements: modifs.detail,
    marche_reference: {
      prix_m2_bas: Math.round(prixM2Base * 0.85),
      prix_m2_median: prixM2Base,
      prix_m2_haut: Math.round(prixM2Base * 1.15),
      ecart_vs_marche_pct: modifs.totalPct,
      message: formatEcartMessage(modifs.totalPct),
    },
    meta: {
      nb_comparables_dvf: 47,
      nb_comparables_annonces: 23,
      rayon_analyse_m: 500,
      periode_analyse_mois: 18,
      model_version: 'mock-v0.1.0',
      computed_at: new Date().toISOString(),
    },
  }
}
```

Les helpers `getPrixBase`, `computeAjustements`, `generateComparables`, `computeConfiance` sont à implémenter dans le même fichier (fonctions pures, pas besoin de finesse).

---

## 2. Handler Solvabilité — `POST /api/solvabilite`

### Spec

Calcule la part de ménages éligibles à l'achat/location selon le prix/loyer et la zone.

### Logique

- Distribution des revenus selon la ville (déciles INSEE Filosofi) :
  - Paris : D1 1400, D3 2100, D5 2800, D7 3800, D9 6500
  - Lyon : D1 1200, D3 1700, D5 2200, D7 2900, D9 4800
  - Bordeaux : D1 1150, D3 1650, D5 2100, D7 2800, D9 4500
  - Autre : D1 1050, D3 1500, D5 1900, D7 2500, D9 4000
- Revenu nécessaire :
  - Achat : `(prix × 0.9 / 300) * (taux_mensuel / (1 - (1 + taux_mensuel)^-300)) / 0.33`
    - Hypothèses défaut : taux 3.63% annuel, 25 ans, apport 10%, endettement 33%
  - Location : `loyer × 3`
- Part éligible : interpolation linéaire sur la distribution
- Benchmark : part éligible médiane du quartier sur 12 derniers mois (mock : centile aléatoire entre 15% et 40%)

### Handler

```ts
// /src/mocks/handlers/solvabilite.ts
import { http, HttpResponse, delay } from 'msw'

export const solvabiliteHandlers = [
  http.post('/api/solvabilite', async ({ request }) => {
    const body = await request.json() as SolvabiliteInputs
    await delay(200)

    const distribution = getDistributionRevenus(body.iris_code || body.commune)
    const revenuNecessaire = body.type === 'achat'
      ? computeRevenuAchat(body.prix, body.hypotheses)
      : body.loyer * 3
    const partEligible = interpolatePart(distribution, revenuNecessaire)
    const benchmark = getBenchmarkQuartier(body.iris_code || body.commune, body.type)

    return HttpResponse.json({
      zone_reference: {
        type: body.type === 'achat' ? 'commune_et_limitrophe' : 'iris_et_rayon_3km',
        code_zone: body.iris_code || body.commune,
        nb_communes: body.type === 'achat' ? 4 : 1,
        population: 245000,
        nb_menages: 135000,
      },
      distribution_revenus: distribution,
      hypotheses: body.hypotheses || {
        taux_bdf: 0.0363,
        duree_annees: 25,
        apport_pct: 0.10,
        endettement_max: 0.33,
        regle_locative: '3x_loyer',
      },
      revenu_necessaire: Math.round(revenuNecessaire),
      part_eligible: Math.round(partEligible * 100) / 100,
      benchmark_quartier: {
        part_eligible_mediane_ventes_12m: benchmark,
        positionnement: partEligible > benchmark + 0.05 ? 'au_dessus_mediane'
          : partEligible < benchmark - 0.05 ? 'en_dessous_mediane'
          : 'proche_mediane',
        message: formatBenchmarkMessage(partEligible, benchmark),
      },
    })
  })
]
```

---

## 3. Handler Estimation rapide — CRUD

### Endpoints

```
GET    /api/estimations/rapide                → Liste (avec filtres via query params)
GET    /api/estimations/rapide/:id            → Détail
POST   /api/estimations/rapide                → Créer
PATCH  /api/estimations/rapide/:id            → Update
DELETE /api/estimations/rapide/:id            → Soft delete (archiver)
POST   /api/estimations/rapide/:id/promouvoir → Promouvoir en AdV ou étude
```

### Fixture initiale

Pré-charger 12 estimations rapides dans `/src/mocks/fixtures/estimations-rapide.ts` :
- 5 à Paris (mix arrondissements 3, 15, 16, 18, 20)
- 4 à Lyon (arrondissements 2, 3, 6, 7)
- 3 à Bordeaux (centre + chartrons)

Chaque estimation a : id, dates, auteur, bien (avec adresse réelle plausible), valeurs AVM mockées, statut varié (brouillon, finalisée, archivée).

### Query params supportés

```
?status=brouillon,finalisee
?auteur=user_id
?periode=30d
?ville=Paris
?type_bien=appartement
?sort=date_desc|date_asc|prix_desc|prix_asc
?q=rechercher  (recherche full-text sur adresse, client)
?page=1&limit=20
```

### Store en mémoire

Pas de vraie DB. Utiliser un simple array en module :

```ts
// /src/mocks/stores/estimations-rapide-store.ts
import { FIXTURES_ESTIMATIONS_RAPIDE } from '@/mocks/fixtures/estimations-rapide'
import type { EstimationRapide } from '@/types/estimation'

let store: EstimationRapide[] = [...FIXTURES_ESTIMATIONS_RAPIDE]

export const estimationsRapideStore = {
  list: (filters: Filters) => applyFilters(store, filters),
  get: (id: string) => store.find(e => e.id === id),
  create: (data: Omit<EstimationRapide, 'id'>) => {
    const nouvelle = { ...data, id: crypto.randomUUID() }
    store.unshift(nouvelle)
    return nouvelle
  },
  update: (id: string, patch: Partial<EstimationRapide>) => {
    const idx = store.findIndex(e => e.id === id)
    if (idx === -1) return null
    store[idx] = { ...store[idx], ...patch, updated_at: new Date().toISOString() }
    return store[idx]
  },
  delete: (id: string) => {
    store = store.filter(e => e.id !== id)
  },
}
```

---

## 4. Handler Avis de valeur — CRUD

Même structure que Estimation rapide, avec :

### Endpoints

```
GET    /api/avis-valeur
GET    /api/avis-valeur/:id
POST   /api/avis-valeur
PATCH  /api/avis-valeur/:id
DELETE /api/avis-valeur/:id
POST   /api/avis-valeur/:id/finaliser           → status brouillon → finalisée
POST   /api/avis-valeur/:id/envoyer             → status finalisée → envoyée, envoi email
POST   /api/avis-valeur/:id/dupliquer           → duplicate
POST   /api/avis-valeur/:id/nouvelle-version    → crée v2
GET    /api/avis-valeur/:id/versions            → historique versions
POST   /api/avis-valeur/:id/export-pdf          → génère PDF (mock : renvoie un fichier placeholder)
```

### Fixture

Pré-charger 15 avis de valeur, statuts variés :
- 5 brouillons
- 4 finalisés non envoyés
- 4 envoyés (avec dates d'ouverture pour certains)
- 2 archivés

---

## 5. Handler Étude locative — CRUD

Même structure que Avis de valeur.

### Endpoints

```
GET    /api/etudes-locatives
GET    /api/etudes-locatives/:id
POST   /api/etudes-locatives
PATCH  /api/etudes-locatives/:id
DELETE /api/etudes-locatives/:id
POST   /api/etudes-locatives/:id/finaliser
POST   /api/etudes-locatives/:id/envoyer
POST   /api/etudes-locatives/:id/dupliquer
POST   /api/etudes-locatives/:id/nouvelle-version
POST   /api/etudes-locatives/:id/export-pdf
```

### Fixture

10 études locatives :
- 4 brouillons
- 3 finalisées
- 3 envoyées

---

## 6. Handler Comparables — `GET /api/comparables`

### Spec

Retourne les comparables d'un bien donné (annonces en vente + DVF vendus + annonces expirées invendues).

### Query params

```
?lat=48.8323&lon=2.2893
?surface=42&nb_pieces=2
?type_bien=appartement
?rayon_m=500
?periode_mois=18
?source=annonces,dvf,invendus  (défaut : tous)
```

### Output

```json
{
  "comparables": [
    {
      "id": "comp_abc123",
      "type": "dvf",
      "adresse": "14 rue du Hameau",
      "ville": "Paris 15e",
      "lat": 48.8325,
      "lon": 2.2891,
      "distance_m": 40,
      "type_bien": "appartement",
      "surface": 45,
      "nb_pieces": 2,
      "etage": 3,
      "annee_construction": 1962,
      "dpe": "D",
      "ges": "D",
      "prix": 435000,
      "prix_m2": 9667,
      "date_vente": "2024-08-15",
      "score_similarite": 0.94,
      "photo_url": "https://picsum.photos/seed/comp_abc123/400/300"
    }
  ],
  "meta": {
    "total": 47,
    "nb_annonces": 23,
    "nb_dvf": 18,
    "nb_invendus": 6
  }
}
```

### Logique mock

- Générer 30 comparables fictifs autour de la position du bien, avec variations réalistes
- Score de similarité décroissant : le 1er = 0.95, puis décroissance progressive
- Photos : `https://picsum.photos/seed/[id]/400/300` (service gratuit)
- Adresses générées à partir de listes réalistes par ville

---

## 7. Handler Scraping annonce — `POST /api/annonces/scrape`

### Spec

Reçoit une URL d'annonce, retourne les données structurées extraites.

### Input

```json
{ "url": "https://www.leboncoin.fr/..." }
```

### Output (succès)

```json
{
  "source": "leboncoin",
  "scraped_at": "2026-04-22T15:30:00Z",
  "champs_fiables": {
    "type_bien": "appartement",
    "surface": 42,
    "nb_pieces": 2,
    "prix_affiche": 425000
  },
  "champs_a_verifier": {
    "adresse": "rue du Hameau, 75015 Paris",
    "etage": 2,
    "annee_construction": 1960
  },
  "champs_non_fiables": {
    "description": "Bel appartement...",
    "etat": null,
    "exposition": null
  },
  "photos": [
    "https://picsum.photos/seed/1/800/600",
    "https://picsum.photos/seed/2/800/600"
  ],
  "dpe": "E",
  "ges": "E",
  "caracteristiques_detectees": ["balcon", "cave", "ascenseur"]
}
```

### Output (erreur)

```json
{
  "error": "annonce_non_lisible",
  "message": "Nous n'arrivons pas à lire cette annonce. Vous pouvez essayer un autre lien ou saisir manuellement."
}
```

### Logique mock

- Si URL contient "leboncoin", "seloger", "bienici", "pap" → succès avec données générées aléatoirement (mais plausibles pour Paris/Lyon/Bordeaux)
- Sinon → erreur
- Latence : 1500ms (simule scraping lent)

---

## 8. Handler Biens du portefeuille — `GET /api/biens`

### Endpoints

```
GET /api/biens                    → Liste portefeuille de l'utilisateur
GET /api/biens/:id               → Détail bien
```

### Fixture

20 biens dans le portefeuille, répartis dans les 3 villes, avec historique, photos placeholder, caractéristiques variées.

---

## 9. Handler Scoring emplacement — `GET /api/scoring-emplacement`

### Spec

Retourne la note A→E sur 6 dimensions + forces majeures + POI à proximité.

### Input

```
?lat=48.8323&lon=2.2893
```

### Output

```json
{
  "note_globale": "B",
  "score_global": 82,
  "dimensions": {
    "transports": { "note": "A", "score": 91, "details": "Métro ligne 12 à 200m, 3 lignes de bus" },
    "commerces": { "note": "A", "score": 88, "details": "7 commerces de bouche à 5 min" },
    "sante": { "note": "B", "score": 76, "details": "15 pharmacies, 29 médecins à 5 min" },
    "education": { "note": "B", "score": 78, "details": "2 crèches, 2 écoles à 5 min" },
    "services": { "note": "A", "score": 85, "details": "Banque, poste, coiffeur à <500m" },
    "vie_quartier": { "note": "A", "score": 90, "details": "675 restaurants, nombreux bars" }
  },
  "forces_majeures": [
    "Bâtiment fibré",
    "Vie de quartier",
    "Vie sans voiture",
    "Besoins quotidiens",
    "Pour les personnes âgées"
  ],
  "points_interet": [
    { "type": "metro", "nom": "Rambuteau", "distance_m": 111, "lignes": ["11"] },
    { "type": "boulangerie", "nom": "Poilâne", "distance_m": 113 },
    // ... plus de POI
  ]
}
```

### Logique mock

- Générer des notes réalistes selon la ville :
  - Paris centre : toutes dimensions A/B
  - Paris périphérie : mix A-C
  - Lyon centre : B-C
  - Bordeaux centre : A-B
  - Zones rurales : C-E
- Forces majeures : sélection parmi ~15 détecteurs prédéfinis selon les notes
- POI : générer 5-10 POI réalistes par dimension

---

## 10. Handler INSEE / Filosofi — `GET /api/insee/iris`

### Endpoints

```
GET /api/insee/iris?lat=X&lon=Y           → Infos IRIS + commune
GET /api/insee/filosofi?iris=XXX          → Déciles revenus
GET /api/insee/repartition-logements?iris=XXX
```

### Fixtures

Préloader 10 IRIS réalistes (Paris 15, Lyon 7, Bordeaux centre, etc.) avec :
- Population, nombre de ménages, revenu médian
- Distribution par typologie (personne seule, couple, famille, monoparental)
- Répartition CSP
- Ancienneté emménagement
- Répartition logements (résidence principale, secondaire, vacant)
- Répartition pièces et surfaces

---

## 11. Handler Taux BDF — `GET /api/taux-bdf`

Renvoie le taux d'emprunt actuel.

```json
{
  "taux_mensuel_actuel": 0.0363,
  "historique_6m": [
    { "mois": "2025-11", "taux": 0.0368 },
    { "mois": "2025-12", "taux": 0.0363 },
    // ...
  ],
  "source": "Banque de France",
  "updated_at": "2026-04-15T00:00:00Z"
}
```

---

## 12. Handler Encadrement loyers — `GET /api/encadrement-loyers`

### Input

```
?commune=Bordeaux&surface=52&type=meuble&pieces=2
```

### Output

```json
{
  "zone_tendue": true,
  "loyer_plafonne": true,
  "loyer_reference": 837.20,
  "loyer_reference_minore": 587.60,
  "loyer_reference_majore": 1003.60,
  "loyer_reference_m2": 16.1,
  "loyer_minore_m2": 11.3,
  "loyer_majore_m2": 19.3,
  "source": "Arrêté préfectoral 2024",
  "permis_de_louer": true,
  "pinel_zonage": null
}
```

### Logique mock

- Si commune dans [Paris, Lille, Lyon, Bordeaux, Montpellier] → zone tendue + encadrement actif
- Si autre → pas d'encadrement

---

## 13. Handler Envoi email — `POST /api/rapports/envoyer`

### Input

```json
{
  "rapport_id": "abc123",
  "type": "avis_valeur|etude_locative",
  "destinataire": {
    "nom": "M. Prévost",
    "email": "prevost@example.com"
  },
  "objet": "Votre avis de valeur",
  "message": "Bonjour...",
  "options": {
    "accuse_lecture": true
  }
}
```

### Output

```json
{
  "envoi_id": "envoi_xyz",
  "envoye_le": "2026-04-22T16:00:00Z",
  "url_publique": "/rapport/token_abc123xyz",
  "statut": "envoye"
}
```

Update le rapport dans son store : statut → "envoyée", ajoute date d'envoi.

---

## 14. Handler Tracking rapport — `GET /api/rapports/:token/tracking`

### Output

```json
{
  "rapport_id": "abc123",
  "token": "token_abc123xyz",
  "ouvertures": [
    { "timestamp": "2026-04-22T16:30:00Z", "user_agent": "iPhone", "ip_masque": "XX.XX.100.0" }
  ],
  "nb_ouvertures": 1,
  "duree_totale_s": 245,
  "sections_consultees": ["presentation_bien", "prix_marche", "conclusion"]
}
```

Appelé par la page publique `/rapport/[token]` pour afficher le rapport + tracker l'ouverture.

---

## 15. Handler Leads — `POST /api/leads`

Création de lead associée à une estimation/avis/étude.

```ts
POST /api/leads
Body: {
  source: 'estimation_rapide' | 'avis_valeur' | 'etude_locative' | 'widget_public',
  source_id: string,
  client: { civilite, nom, prenom, email, telephone },
  bien_id?: string,
  statut: 'a_qualifier' | 'avis_envoye' | ...
}
```

Output : lead créé avec id.

Pas besoin de liste/édition côté mock — juste création pour que les flows "Promouvoir" etc. marchent.

---

## 16. Flag d'erreurs simulées

Permettre à l'agent de tester les états d'erreur en saisissant dans la console :

```js
localStorage.setItem('__MSW_SIMULATE_ERROR', 'avm')    // fait échouer AVM
localStorage.setItem('__MSW_SIMULATE_ERROR', 'all')    // fait échouer tout
localStorage.removeItem('__MSW_SIMULATE_ERROR')        // désactive
```

Dans chaque handler critique, check du flag en tête :

```ts
function shouldSimulateError(domain: string) {
  if (typeof window === 'undefined') return false
  const flag = window.localStorage.getItem('__MSW_SIMULATE_ERROR')
  return flag === 'all' || flag === domain
}
```

---

## 17. Fixtures minimales à produire

Pour que l'app ait du contenu réaliste dès le premier `npm run dev`.

### `/src/mocks/fixtures/biens-paris.ts`

```ts
export const BIENS_PARIS = [
  {
    id: 'bien_p1',
    adresse: '16 rue du Hameau',
    ville: 'Paris 15e',
    code_postal: '75015',
    lat: 48.8323,
    lon: 2.2893,
    iris_code: '751156408',
    type_bien: 'appartement',
    surface: 42,
    nb_pieces: 2,
    etage: 2,
    annee_construction: 1960,
    dpe: 'E',
    ges: 'E',
    etat: 'a_rafraichir',
    caracteristiques: ['balcon', 'cave', 'ascenseur', 'parking'],
    photo_url: 'https://picsum.photos/seed/bien_p1/800/600',
  },
  // ... 4 autres biens Paris
]
```

Faire de même pour Lyon et Bordeaux, avec des biens représentatifs (T2, T3, T4, maison si Bordeaux hors centre, etc.).

### `/src/mocks/fixtures/users.ts`

```ts
export const USERS = [
  { id: 'u1', nom: 'Leroy', prenom: 'Sophie', email: 'sophie@test.fr', role: 'agent', photo_url: '...' },
  { id: 'u2', nom: 'Dubois', prenom: 'Jean', email: 'jean@test.fr', role: 'manager', photo_url: '...' },
]

export const CURRENT_USER = USERS[0] // Pour mock "utilisateur connecté"
```

### `/src/mocks/fixtures/organisations.ts`

```ts
export const ORGANISATION = {
  id: 'org1',
  nom: 'Propsight Demo',
  logo_url: '/logo-agence-demo.svg',
  couleur_primaire: '#6D4DE8',
  siret: '12345678900000',
  carte_t: '7500...',
  adresse: '15 avenue de la Grande Armée, 75016 Paris',
  telephone: '01 49 48 47 46',
  email: 'contact@propsight.fr',
  mentions_legales: 'SAS au capital...',
}
```

---

## 18. Types TypeScript associés

À déclarer dans `/src/types/` :

```ts
// /src/types/estimation.ts
export type StatutEstimation = 'brouillon' | 'finalisee' | 'envoyee' | 'ouverte' | 'archivee'
export type TypeBien = 'appartement' | 'maison' | 'terrain' | 'local_commercial' | 'parking'
export type EtatBien = 'neuf' | 'refait_a_neuf' | 'bon' | 'a_rafraichir' | 'a_renover' | 'a_restructurer'
export type DpeGes = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'inconnu'

export interface Estimation {
  id: string
  type: 'rapide' | 'avis_valeur' | 'etude_locative'
  status: StatutEstimation
  source: 'manuel' | 'annonce_url' | 'bien_portefeuille' | 'estimation_rapide' | 'widget_public'
  // ... etc (voir ARCHITECTURE_ESTIMATION.md section 2.1)
}

// /src/types/avm.ts
export interface AvmInputs {
  adresse: string
  ban_id?: string
  lat: number
  lon: number
  iris_code?: string
  type_bien: TypeBien
  surface_habitable: number
  nb_pieces: number
  // ... etc
}

export interface AvmResponse {
  prix: { estimation: number; fourchette_basse: number; /* ... */ }
  loyer: { estimation: number; /* ... */ }
  comparables: Comparable[]
  features_importance: { feature: string; contribution: number }[]
  ajustements: { critere: string; delta_prix_pct: number; delta_prix_m2: number; libelle: string }[]
  marche_reference: { prix_m2_bas: number; prix_m2_median: number; prix_m2_haut: number; ecart_vs_marche_pct: number; message: string }
  meta: { /* ... */ }
}
```

---

## Checklist de validation

À la fin de ce prompt, Claude Code doit avoir produit :

- [ ] `/src/mocks/browser.ts` et `/src/mocks/server.ts`
- [ ] `/src/mocks/handlers/index.ts` qui exporte tous les handlers
- [ ] Les 15 handlers listés, chacun dans son fichier, fonctionnels
- [ ] `/src/mocks/logic/avm-engine.ts` avec la logique de calcul
- [ ] `/src/mocks/stores/` avec les stores en mémoire pour les CRUD
- [ ] `/src/mocks/fixtures/` avec les fixtures de base (biens × 3 villes, users, organisation, annonces, comparables)
- [ ] `/src/types/` avec tous les types TypeScript associés
- [ ] `<MswProvider>` intégré dans le `layout.tsx` de l'app
- [ ] Ouvrir `npm run dev`, ouvrir la console → `fetch('/api/avm', { method: 'POST', body: JSON.stringify({ adresse: '16 rue du Hameau', surface_habitable: 42, nb_pieces: 2, type_bien: 'appartement' }) })` doit retourner une réponse AVM complète
- [ ] Pareil pour `/api/solvabilite`, `/api/scoring-emplacement`, `/api/comparables`

---

## Prompt Claude Code

```
Lis le fichier /docs/20_MOCKS_DATA.md et implémente tous les handlers MSW, stores en mémoire, et fixtures nécessaires pour faire tourner le module Estimation sans back réel.

Respecte scrupuleusement :
- La structure de dossiers /src/mocks/ définie dans la spec
- Les contrats d'API (inputs/outputs) de chaque endpoint
- Les latences simulées (800ms pour AVM, 200-500ms ailleurs)
- La cohérence métier (Paris plus cher que Lyon, Bordeaux en zone tendue, etc.)
- Les types TypeScript (à créer dans /src/types/)

À la fin :
1. Ajoute le <MswProvider> dans src/app/layout.tsx
2. Affiche la commande de test dans la console pour vérifier qu'un appel /api/avm fonctionne
3. Liste tous les fichiers créés/modifiés

Si un point est ambigu dans la spec, demande-moi avant d'implémenter.
```

---

**Fin du document**
