# 11 — Avis de Valeur (module complet)

**Durée estimée** : 5h
**Objectif** : Sous-module Avis de valeur de bout en bout : page d'accueil, 4 flows de création (dont promotion depuis estimation rapide prioritaire), éditeur rapport (template mutualisé), valeur retenue avec toggles, flow envoi + tracking, versioning.

---

## Écrans à construire

1. **`/app/estimation/avis-valeur`** — Page d'accueil (liste + KPI + split button)
2. **Modale de création** — dispatch vers 4 modes (prioritaire : depuis estimation rapide)
3. **`/app/estimation/avis-valeur/[id]`** — Éditeur (template rapport mutualisé)
4. **Modale d'envoi** — destinataire, objet, message, options
5. **Page publique rapport** — `/rapport/[token]` avec tracking ouverture

---

## 1. Page d'accueil

### Layout

Même squelette que page d'accueil Estimation rapide, avec :

**KPI row (3 + lien pipeline)** :
1. **En cours** — nb brouillons + envoyés non signés
2. **Taux d'ouverture vendeur** — % sur 30 derniers jours
3. **Signés en mandat ce mois** — nb

→ Lien : "N leads à relancer → Mon pipeline commercial"

**Split button** : mode prioritaire = **"Depuis une estimation rapide"**
Dropdown :
- Depuis une estimation rapide (prioritaire)
- Depuis un bien du portefeuille
- Depuis une annonce
- Saisie manuelle

### Cards avec infos spécifiques

Chaque card Avis de valeur affiche :
- Photo/visu bien, adresse
- Client (obligatoire sur AdV, champ "À l'attention de")
- Prix retenu (€)
- Statut badge (Brouillon / Finalisé / Envoyé / Ouvert / Archivé)
- Si envoyé : indicateur "Ouvert" (icône œil) ou "Non ouvert" (icône œil barré)
- Si statut Ouvert : date de 1ère ouverture + nb d'ouvertures
- Auteur + date modif
- Menu ⋯ : éditer, dupliquer, nouvelle version, archiver, supprimer

---

## 2. Flows de création

### Mode 1 (prioritaire) — Depuis une estimation rapide

Modale avec liste des estimations rapides récentes de l'user :

```
┌─ Nouvel avis de valeur depuis une estimation rapide ───── ✕ ┐
│                                                              │
│  [🔍 rechercher]  [Période : 30 jours ▾]                    │
│                                                              │
│  Résultats (8)                                               │
│                                                              │
│  ┌──────┐ Appartement 42m² · 16 rue du Hameau                │
│  │ 📷   │ Estimé 421 000 € il y a 2 jours                   │
│  │      │ Client : M. Prévost                                │
│  └──────┘                                        [Utiliser →]│
│                                                              │
│  ┌──────┐ Maison 120m² · 8 av des Tilleuls                  │
│  │ 📷   │ Estimée 850 000 € il y a 5 jours                  │
│  │      │ Client : pas renseigné                             │
│  └──────┘                                        [Utiliser →]│
│                                                              │
│  [... scroll ...]                                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Clic "Utiliser" → création nouvel AdV avec tous les champs pré-remplis depuis l'estimation rapide + `parent_estimation_id` pointant dessus + redirection vers éditeur.

### Mode 2 — Depuis un bien du portefeuille

Idem étape 10 (Estimation rapide), mais crée un AdV directement.

### Mode 3 — Depuis une annonce (URL)

Idem étape 10.

### Mode 4 — Saisie manuelle

Wizard 3 étapes (réutilise étape 04).

---

## 3. Éditeur — template rapport mutualisé

Réutilise `<TemplateRapport rapportType="avis_valeur" />` de l'étape 03.

### Header

```
┌────────────────────────────────────────────────────────────────┐
│ ← Avis de valeur · 16 rue du Hameau · M. Prévost               │
│ ● Brouillon                                                    │
│                                                                │
│           [Aperçu PDF]  [Envoyer]  [Exporter ▾]   Contenu ▸   │
└────────────────────────────────────────────────────────────────┘
```

### Bloc Conclusion — valeur retenue (spécifique)

Le bloc `conclusion` est spécifique à Avis de valeur :

```
┌─ Notre estimation ───────────────────────────────────────┐
│                                                          │
│  📊 Prix de vente    [272 000 €]  🔄                    │
│                        5 117 €/m²                        │
│                                                          │
│  🏷 Honoraires       [6] %  🔄                           │
│                        15 396 € TTC                      │
│                        À la charge de [Acquéreur ▾]      │
│                                                          │
│  ─────────────────                                       │
│                                                          │
│  🏠 Net vendeur       256 604 €                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

Toggles € ↔ €/m² sur le prix, € ↔ % sur les honoraires. "À la charge de" en select.

**Règle d'écart** : si prix retenu diverge de >5% de l'AVM, champ "Justifier l'écart" obligatoire (textarea). Stocké dans l'objet, pas affiché dans le PDF final.

---

## 4. Flow d'envoi

Bouton "Envoyer" → modale :

```
┌─ Envoyer cet avis de valeur ───────────────────────────── ✕ ┐
│                                                              │
│  Destinataire                                                │
│  Nom     [M. Prévost__________]                              │
│  Email   [prevost@example.com_]                              │
│                                                              │
│  Objet du mail                                               │
│  [Votre avis de valeur pour le 16 rue du Hameau____]         │
│                                                              │
│  Message                                                     │
│  [Textarea avec template de l'agence prérempli]              │
│                                                              │
│  Options                                                     │
│  ☑ Tracker l'ouverture                                       │
│  ☑ Envoyer aussi une version PDF attachée                    │
│  ☐ Programmer l'envoi (V2)                                   │
│                                                              │
│  Aperçu                                                      │
│  Le destinataire recevra un lien vers une version web        │
│  sécurisée + un PDF attaché.                                 │
│                                                              │
│                        [Annuler]  [Envoyer maintenant ▸]    │
└──────────────────────────────────────────────────────────────┘
```

### Après envoi

- Statut passe à "envoyé"
- Event loggé dans timeline du bien + du lead associé
- Lead passe statut "Avis envoyé"
- Toast confirmation "Avis envoyé à M. Prévost"
- Éditeur devient **non éditable** (sauf création nouvelle version)

---

## 5. Tracking ouverture

Route publique `/rapport/[token]` (le token est un UUID signé).

### Comportement

- Token valide + non expiré → affiche le rapport en mode lecture responsive
- Chaque visite loggée dans `/api/tracking/rapport/[id]/opened` (MSW)
- Mise à jour de `estimation.envoi.ouvertures[]` + `derniere_ouverture`
- Lead passe statut "Rapport consulté" lors de la première ouverture

### Vue rapport public

Même rendu que le mode preview du template, mais :
- En-tête branded agence (logo + nom + contact)
- Pas de boutons d'édition
- Responsive mobile (stack vertical blocs)
- Bouton "Télécharger en PDF" en bas
- Footer avec mentions légales

---

## 6. Versioning

### Comportement

- Un avis envoyé est verrouillé en lecture
- Bouton "Nouvelle version" sur la fiche d'un avis envoyé → duplique l'objet avec version++, statut brouillon
- Lien parent-enfant maintenu dans `versions_precedentes[]`
- Timeline affiche toutes les versions
- Le lien public `/rapport/[token]` redirige toujours vers la dernière version

---

## 7. Historique envois (par rapport)

Sur la fiche d'un avis envoyé, panneau latéral ou onglet "Envois" :

```
┌─ Historique des envois ──────────────────────┐
│                                              │
│ Envoyé le 15 avril 2026 à 14:23              │
│ À : prevost@example.com                      │
│                                              │
│ Ouvertures : 3                               │
│ • 15 avril à 15:45 (mobile)                  │
│ • 16 avril à 09:12 (desktop)                 │
│ • 16 avril à 18:30 (mobile)                  │
│                                              │
│ [Renvoyer le rapport]                        │
└──────────────────────────────────────────────┘
```

---

## Prompt Claude Code

```
On construit le sous-module Avis de valeur complet, qui réutilise le template rapport mutualisé.

Lis :
- /docs/ARCHITECTURE_ESTIMATION.md (section 9)
- /docs/modules/estimation/AVIS_DE_VALEUR.md
- /docs/TEMPLATE_RAPPORT.md (rappel structure)

Réutilise :
- <TemplateRapport rapportType="avis_valeur" /> (étape 03)
- <WizardCreation /> (étape 04)
- <ModaleComparables /> (étape 05)
- <BlocSolvabilite /> (étape 06)
- Handlers MSW estimations déjà configurés (étape 10) — enrichis-les

1. Enrichis /src/mocks/handlers/estimations.ts :
   - Support du type 'avis_valeur' dans les queries
   - POST /api/estimations/[id]/send : envoi email (mock, retourne success)
   - POST /api/tracking/rapport/[id]/opened : log ouverture
   - POST /api/estimations/[id]/new-version : crée nouvelle version

2. Crée /src/mocks/handlers/rapport-public.ts :
   - GET /api/rapport-public/[token] : retourne l'objet AdV si token valide
   - Token mock = "valid-token-123" pour les tests

3. Crée /src/components/estimation/avis-valeur/KPIRow.tsx :
   - 3 KPICard + lien pipeline
   - En cours, Taux ouverture, Signés ce mois

4. Crée /src/components/estimation/avis-valeur/AvisValeurCard.tsx :
   - Card pour la grille
   - Photo, adresse, client, prix retenu, badge statut
   - Si statut envoyé/ouvert : indicateur ouverture (icône œil avec tooltip)
   - Menu ⋯ complet (nouvelle version visible uniquement si envoyé)

5. Crée /src/components/estimation/avis-valeur/ListeAvisValeur.tsx :
   - Grille cards ou tableau selon viewMode
   - Empty state éducatif avec 4 CTAs

6. Crée /src/components/estimation/avis-valeur/ModaleCreationDepuisEstimation.tsx :
   - Modale avec liste des estimations rapides récentes de l'user
   - Filtres : période, recherche
   - Clic "Utiliser" → POST /api/estimations (type=avis_valeur, parent_estimation_id=X) → redirect éditeur

7. Crée /src/components/estimation/avis-valeur/SplitButtonCreation.tsx :
   - Mode prioritaire : "Depuis une estimation rapide"
   - Dropdown : estimation / bien portefeuille / annonce / saisie manuelle
   - Ouvre la bonne modale selon le mode

8. Crée /src/components/estimation/avis-valeur/BlocConclusionEditor.tsx :
   - Composant spécifique pour le bloc Conclusion en mode édition
   - Input prix avec toggle € ↔ €/m²
   - Input honoraires avec toggle € ↔ %
   - Select "À la charge de" (Acquéreur / Vendeur)
   - Calcul net vendeur en live
   - Si prix > 5% d'écart vs AVM : textarea "Justifier l'écart" required
   - Cette édition remplace l'édition inline du bloc Conclusion via le crayon

9. Crée /src/components/estimation/avis-valeur/ModaleEnvoi.tsx :
   - Formulaire envoi (destinataire, objet, message, options)
   - Message template préremplissage depuis Paramètres > Organisation (mock pour l'instant avec un template simple)
   - Bouton "Envoyer maintenant" → POST /api/estimations/[id]/send
   - Après succès : toast + ferme modale + statut mis à jour + éditeur en lecture seule

10. Crée /src/components/estimation/avis-valeur/HistoriqueEnvois.tsx :
    - Panel latéral affichant les envois + ouvertures
    - Bouton "Renvoyer le rapport"

11. Crée /src/components/estimation/avis-valeur/BoutonNouvelleVersion.tsx :
    - Visible uniquement si AdV envoyé
    - Au clic : confirmation modale + POST /api/estimations/[id]/new-version → redirect vers nouvel AdV en brouillon

12. Crée /src/app/(app)/estimation/avis-valeur/page.tsx :
    - Header + KPIRow + ListeAvisValeur + filtres
    - Gère URL search params

13. Crée /src/app/(app)/estimation/avis-valeur/[id]/page.tsx :
    - Récupère AdV via useEstimation(id)
    - Si statut brouillon/finalisé : rend <TemplateRapport rapportType="avis_valeur" estimationData={...} />
    - Si statut envoyé/ouvert : rend en lecture seule + <HistoriqueEnvois /> + <BoutonNouvelleVersion />
    - Bouton "Envoyer" déclenche <ModaleEnvoi />
    - Gestion d'état "dirty" pour déclencher auto-save

14. Crée la route publique /src/app/rapport/[token]/page.tsx :
    - Récupère le rapport via GET /api/rapport-public/[token]
    - Rend la preview en mode responsive pleine largeur
    - Log automatique l'ouverture au mount (POST /api/tracking/rapport/[id]/opened)
    - Layout sans sidebar ni header Pro (c'est une route publique)
    - Footer avec mentions légales de l'agence
    - Bouton "Télécharger en PDF" déclenche window.print()

15. Test de bout en bout :
    - /app/estimation/avis-valeur → page d'accueil OK
    - Crée un AdV depuis une estimation rapide → pré-remplissage OK
    - Édite un bloc via le crayon → preview se met à jour
    - Édite le bloc Conclusion avec toggles € ↔ % → calculs OK
    - Modifie prix pour créer un écart >5% → champ justification apparaît
    - Envoie l'avis → statut passe à envoyé, éditeur en lecture seule
    - Visite /rapport/valid-token-123 → rapport affiché en public, ouverture loggée
    - Retour sur l'AdV → historique envois montre l'ouverture
    - Clic "Nouvelle version" → duplique en brouillon, nouvelle édition possible

16. Commit :
    git add -A
    git commit -m "11: avis de valeur complet (liste, création, éditeur, envoi, tracking, versioning, route publique)"

IMPORTANT :
- Une fois envoyé, l'éditeur est VRAIMENT en lecture seule (toutes les éditions désactivées visuellement)
- La justification d'écart est OBLIGATOIRE si écart prix > 5% vs AVM
- Le tracking de l'ouverture doit fonctionner (log via MSW + update estimation)
- La route publique /rapport/[token] n'utilise PAS le layout (app) — crée un layout dédié si besoin
- Les statuts affichent bien leur couleur (brouillon gris, finalisé bleu, envoyé violet, ouvert vert)
```

---

## Validation

- [ ] Page `/app/estimation/avis-valeur` avec KPI, liste, filtres
- [ ] Split button : mode "Depuis estimation rapide" prioritaire
- [ ] Création depuis estimation rapide : sélection dans modale → AdV pré-rempli + redirection
- [ ] Éditeur utilise le template rapport (blocs, drag, panneau Contenu)
- [ ] Bloc Conclusion : toggles €/€m²/% fonctionnent, net vendeur recalculé
- [ ] Écart prix >5% → justification obligatoire
- [ ] Envoi par email : modale complète, statut mis à jour
- [ ] Après envoi : éditeur verrouillé, bouton "Nouvelle version" apparaît
- [ ] Route publique `/rapport/[token]` affiche le rapport en responsive
- [ ] Tracking ouverture logué
- [ ] Historique envois visible
- [ ] Nouvelle version : duplication en brouillon fonctionnelle

---

## Étape suivante

Quand validé → `12_ETUDE_LOCATIVE.md`
