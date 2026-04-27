# 12 — Étude Locative (module complet)

**Durée estimée** : 3h
**Objectif** : Sous-module Étude locative de bout en bout. Variations principales vs Avis de valeur : blocs locatifs par défaut, bloc Réglementations, valeur retenue loyer HC/CC/honoraires.

---

## Principe

L'Étude locative est une variation de l'Avis de valeur : **même squelette, blocs différents**.

**Ce qui change** :
- Blocs par défaut : loyers marché, comparables à louer, tension locative, réglementations
- Bloc `prix_marche` et `comp_vendus` masqués par défaut
- Bloc `reglementations` activé par défaut (encadrement loyers, permis louer, Pinel, logement décent)
- Valeur retenue : loyer HC + charges + loyer CC + honoraires (au lieu de prix + honoraires + net vendeur)
- KPI : tension locative, vacance, durée moyenne de mise en location

**Ce qui reste identique** :
- Page d'accueil (même squelette)
- 4 modes de création
- Template rapport mutualisé
- Flow envoi + tracking
- Versioning
- Route publique

---

## 1. Page d'accueil

**KPI row (3 + lien pipeline)** :
1. **En cours** — nb brouillons + envoyés
2. **Taux d'ouverture bailleur** — %
3. **Ce mois** — nb créées + évolution

→ Lien : "N leads à relancer → Mon pipeline commercial"

**Split button** : mode prioritaire = **"Depuis une annonce"**
Dropdown :
- Depuis une annonce (prioritaire)
- Depuis un bien du portefeuille
- Depuis une estimation existante
- Saisie manuelle

### Cards spécifiques

- Loyer retenu (€ HC + CC)
- Badge statut
- Zone tendue : badge si applicable

---

## 2. Éditeur — blocs locatifs par défaut

Réutilise `<TemplateRapport rapportType="etude_locative" />`.

### Blocs par défaut (différences avec AdV)

**Activés par défaut** :
- `couverture`, `agence`, `conseiller`, `bien`, `photos`, `points`
- `socio_eco`, `profil_cible` (locataire), `budget_revenu`, `solvabilite`
- `score_emplacement`, `services_proximite`, `repartition_logements`
- `loyers_marche`, `evolution_loyers`, `tension` (locative), `delais` (location)
- `comp_location`, `comp_loues`
- `reglementations` ← SPÉCIFIQUE
- `synthese_3_methodes`, `ajustements`
- `conclusion`, `annexes`, `footer`

**Désactivés par défaut** (vs AdV) :
- `prix_marche`, `evolution_prix`, `comp_vente`, `comp_vendus`

---

## 3. Bloc Réglementations (spécifique)

```
┌─ Réglementations locatives ───────────────────────────────┐
│                                                           │
│  Encadrement des loyers                                   │
│  🔶 Ce bien est en zone tendue avec loyer plafonné        │
│                                                           │
│  Loyer de référence : 18,19 €/m²                          │
│  Loyer minoré :     14,55 €/m² (~757 €)                   │
│  Loyer majoré :     21,83 €/m² (~1 135 €)                 │
│                                                           │
│  ⚠ Votre loyer proposé : 22,50 €/m²                       │
│  Dépasse le plafond majoré.                               │
│  [Voir les justifications possibles]                      │
│                                                           │
│  ─────────────────────                                    │
│                                                           │
│  Permis de louer                                          │
│  ✓ Cette commune n'est pas concernée                      │
│                                                           │
│  ─────────────────────                                    │
│                                                           │
│  Dispositif Pinel                                         │
│  Zone : B1 · Plafond : 10,55 €/m² · Location nue         │
│  Loyer Pinel maximum : ~549 €                             │
│                                                           │
│  ─────────────────────                                    │
│                                                           │
│  Critères de logement décent                              │
│  ✓ Surface > 9 m²                                         │
│  ✓ DPE conforme (pas de G ni F)                           │
│  ✓ Équipements minimums                                   │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Data sources

- **Encadrement des loyers** : arrêtés préfectoraux (Paris, Lille, Lyon, Bordeaux, etc.) — données publiques
- **Permis de louer** : liste communes ALUR — data.gouv
- **Zonage Pinel** : zonage A/A bis/B1/B2/C — data.gouv
- **Logement décent** : règles fixes (surface min 9m², DPE etc.)

Pour V1 on mocke tout via MSW, V2 on branche les vraies sources.

---

## 4. Bloc Conclusion (valeur retenue loyer)

```
┌─ Notre estimation ─────────────────────────────────────┐
│                                                        │
│  💰 Loyer H.C.           [1 000 €]                     │
│                          19 €/m²                       │
│                                                        │
│  [Dans l'encadrement : 757 - 1135 €]                  │
│                                                        │
│  🏷 Charges mensuelles   [60 €]                        │
│                                                        │
│  ─────────────────                                     │
│                                                        │
│  🏠 Loyer C.C.           1 060 €                       │
│                          20 €/m²                       │
│                                                        │
│  📋 Honoraires           [965 €]                       │
│  (équivalent à 1 mois de loyer hors charges)          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

- Loyer HC : input avec toggle € ↔ €/m²
- Si zone tendue : badge conformité (vert si dans la fourchette, orange si dépasse)
- Charges : input € mensuel
- Loyer CC : calculé (HC + charges)
- Honoraires : input € (défaut = loyer HC = 1 mois)

---

## Prompt Claude Code

```
On construit le sous-module Étude locative. C'est une variation du sous-module Avis de valeur (étape 11) : même squelette mais blocs et valeur retenue différents.

Lis :
- /docs/ARCHITECTURE_ESTIMATION.md (section 10)
- /docs/modules/estimation/ETUDE_LOCATIVE.md
- /docs/TEMPLATE_RAPPORT.md (blocs par défaut pour rapportType="etude_locative")

Réutilise au maximum les composants de l'étape 11 (Avis de valeur), avec adaptations.

1. Enrichis MSW /src/mocks/handlers/estimations.ts :
   - Support du type 'etude_locative' dans les queries
   - Les fixtures ajoutent quelques études locatives

2. Crée /src/mocks/handlers/reglementations.ts :
   - GET /api/reglementations?adresse=... :
     * Retourne encadrement_loyers (loyer_reference, minoré, majoré) si commune en zone tendue
     * permis_de_louer (boolean selon commune)
     * zonage_pinel (A, A bis, B1, B2, C) + plafond_pinel
     * logement_decent (checklist standard)
   - Mock statique : Paris/Lille/Lyon/Bordeaux en zone tendue avec valeurs plausibles
   - Défaut : zone non tendue, pas de permis, pas de Pinel applicable

3. Crée /src/components/estimation/etude-locative/KPIRow.tsx :
   - 3 KPI + lien pipeline
   - En cours, Taux ouverture bailleur, Ce mois

4. Crée /src/components/estimation/etude-locative/EtudeLocativeCard.tsx :
   - Card grille
   - Loyer HC + CC affichés, zone tendue badge si applicable

5. Crée /src/components/estimation/etude-locative/ListeEtudesLocatives.tsx :
   - Grille cards ou tableau
   - Empty state

6. Crée /src/components/estimation/etude-locative/SplitButtonCreation.tsx :
   - Mode prioritaire : "Depuis une annonce" (pas depuis estimation rapide car moins fréquent)
   - Dropdown : annonce / bien portefeuille / estimation existante / saisie manuelle

7. Crée /src/components/shared/template-rapport/blocs/BlocReglementations.tsx :
   - Bloc spécifique étude locative
   - Fetch /api/reglementations via useQuery
   - Sections : Encadrement loyers, Permis de louer, Pinel, Logement décent
   - Chaque section avec icône de statut (✓ conforme, ⚠ attention, ✗ non conforme)
   - Si encadrement : compare loyer retenu vs fourchette minoré/majoré
   - Ajoute ce bloc dans BLOCS_COMPONENTS

8. Crée /src/components/estimation/etude-locative/BlocConclusionEditorLocatif.tsx :
   - Variante du BlocConclusionEditor (AdV) pour location
   - Input loyer HC avec toggle € ↔ €/m²
   - Input charges mensuelles
   - Input honoraires (default = 1 mois loyer HC)
   - Affichage loyer CC calculé
   - Si encadrement : badge conformité vert/orange/rouge

9. Crée /src/app/(app)/estimation/etude-locative/page.tsx :
   - Header + KPIRow + ListeEtudesLocatives + filtres spécifiques (zone tendue, type location)

10. Crée /src/app/(app)/estimation/etude-locative/[id]/page.tsx :
    - Query useEstimation(id) avec type 'etude_locative'
    - <TemplateRapport rapportType="etude_locative" ... />
    - Réutilise la logique d'envoi, tracking, versioning de l'étape 11

11. Ajuste BLOCS_REGISTRY dans /src/components/shared/template-rapport/BlocsRegistry.ts :
    - Active par défaut pour etude_locative les blocs locatifs listés dans la spec
    - Désactive prix_marche, evolution_prix, comp_vente, comp_vendus
    - Active reglementations

12. Test de bout en bout :
    - /app/estimation/etude-locative page d'accueil OK
    - Crée une étude via saisie manuelle
    - Vérifie que les blocs par défaut sont bien les blocs locatifs
    - Vérifie que le bloc Réglementations s'affiche avec données mockées
    - Édite le bloc Conclusion avec le nouvel éditeur locatif
    - Renseigne un loyer hors encadrement, vérifie badge orange
    - Envoie l'étude, tracking, nouvelle version : tout doit fonctionner comme pour AdV

13. Commit :
    git add -A
    git commit -m "12: étude locative complète (liste, création, éditeur locatif, bloc réglementations)"

IMPORTANT :
- Réutilise AU MAXIMUM les composants de l'étape 11 (Avis de valeur). Évite la duplication de code.
- Les blocs par défaut doivent être correctement configurés selon defaultActiveBy.etude_locative dans le registry
- Le BlocReglementations doit réellement être conditionné (ne s'affiche bien que si données reglementations disponibles)
- Le calcul loyer CC = HC + charges doit être en live
- La comparaison avec encadrement doit colorer clairement (vert/orange/rouge)
```

---

## Validation

- [ ] Page `/app/estimation/etude-locative` avec KPI + liste
- [ ] Création via les 4 modes fonctionne
- [ ] Éditeur : blocs locatifs par défaut (loyers, tension locative, comparables loc)
- [ ] Bloc Réglementations s'affiche avec données mock
- [ ] Encadrement loyers : comparaison visuelle fonctionne (badges colorés)
- [ ] Bloc Conclusion : loyer HC + CC + honoraires, calculs corrects
- [ ] Envoi, tracking, nouvelle version : fonctionnels comme AdV

---

## Étape suivante

Quand validé → `20_MOCKS_DATA.md` (dernière étape pour finaliser les mocks complets + passe 3)
