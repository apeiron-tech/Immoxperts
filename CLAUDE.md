# CLAUDE.md — Propsight

Ce fichier est le contexte de travail pour Claude Code dans ce repo.  
Il est chargé automatiquement à chaque session. Le lire intégralement avant toute action.

---

## 1. Produit

**Propsight** — SaaS immobilier FR, double couche :

- **Freemium public** (carte DVF, estimateur, annonces) → acquisition + SEO + leads
- **Pro payant** (agents immobiliers + investisseurs) → abonnement SaaS avec billing par siège, multi-user dès V1
- **Widget estimateur** embarqué sur sites d'agents → leads redirigés vers l'agent (pas marketplace)

Site en production : `propsight.fr` (carte DVF opérationnelle).  
Société : Propsight SASU (ex-ImmoXpert, renommée 05/12/2025).

### Personas V1 payants
- **Agent immobilier**
- **Investisseur**

Même backbone data, UI adaptée. Les modules sont partagés, les vues diffèrent.

### Données backbone
DVF, DPE/ADEME, BPE INSEE, IRIS INSEE, BAN, OSM, PLU, SIRENE, annonces scrapées depuis janvier 2025.

### AVM (prix + loyers)
- Algo : **LightGBM** sur DVF + annonces + INSEE + BPE + OSM
- Développé par l'équipe ML en parallèle
- Branchement prévu **fin juillet 2026**
- **D'ici là : mocks obligatoires** derrière une interface stable (cf. §9)

### Deadlines
- Dev : 27 avril 2026 → 31 juillet 2026
- Branchement AVM : fin juillet 2026

---

## 2. Stack technique (confirmé)

### Backend
- **Java 17** (`maven-enforcer-plugin` contraint `[17,18),[21,22),[24,25)`)
- **Spring Boot 3.4.5**
- **JHipster 8.11.0** (générateur, conserver la compatibilité)
- **PostgreSQL** (DB principale — dev local via Docker)
- **Liquibase** pour toutes les migrations de schéma
- **Hibernate ORM** + **MapStruct** pour les DTOs
- **Spring Security** + **OAuth2 Resource Server** (JWT)
- **Caffeine** (cache L1 in-memory) + JCache
- **Undertow** (pas Tomcat)
- **springdoc-openapi** pour la doc API
- **Testcontainers** (PostgreSQL) pour les tests d'intégration
- **ArchUnit** pour les tests de règles d'architecture
- Package Java actuel : `com.apeiron.immoxperts` → **à migrer vers `com.propsight`** (cf. §13)

### Frontend
- **React 18.3.1** + **TypeScript 5.8.3**
- **Redux Toolkit** + `react-redux` (state global)
- **React Router 7** (routing)
- **Tailwind CSS 3.4.1** (styling — voir §2.1)
- **Mapbox GL 3** (carto nouveau code — voir §2.2)
- **Leaflet + react-leaflet** (carto legacy, gelée)
- **framer-motion** (animations)
- **react-hook-form** (formulaires)
- **axios** (HTTP)
- **lucide-react** (icônes — standardiser dessus)
- **dayjs** (dates)
- **Jest** + **Testing Library React** (tests)
- **Webpack 5** + **Yarn 1.22** (build)

### 2.1 Styling — règle stricte

Le repo contient Bootstrap 5, Reactstrap et SCSS (héritage JHipster), ET Tailwind.

**Règle pour tout nouveau code :**
- **Tailwind only.** Pas de Bootstrap, pas de Reactstrap, pas de SCSS custom sauf exceptions motivées.
- Les composants JHipster legacy restent en place jusqu'à ce qu'on les touche. Quand on les touche, on les migre vers Tailwind.
- Design tokens violet Propsight : définis dans `tailwind.config.js` sous `theme.extend.colors.propsight.*`.
- Pas de classes inline exotiques. Utiliser `@apply` dans un `.css` uniquement pour des patterns réellement réutilisés (3+ fois).

### 2.2 Cartographie — règle stricte

- **Mapbox GL** pour tout nouveau code carto (DVF, prospection, radar, tuiles custom, clustering haute perf).
- **Leaflet gelé** sur l'existant. Ne rien y ajouter. Migration future opportuniste.
- Ne jamais importer les deux dans le même module.

### 2.3 Icônes — règle stricte

- **lucide-react only** pour tout nouveau code.
- FontAwesome et react-icons sont legacy, ne pas étendre.

---

## 3. Architecture

### 3.1 Backend — package par feature

Structure cible sous `com.propsight` (à la place de `com.apeiron.immoxperts`) :

```
com.propsight
├── shared/              # Infra transverse : config, security, web, util
│   ├── config/
│   ├── security/
│   ├── web/rest/errors/
│   └── util/
├── domain/              # Entités JPA partagées (Bien, Annonce, Lead, Zone, …)
│   └── model/
├── prospection/         # Feature Prospection (radar, signaux DVF, signaux DPE)
│   ├── web/             # Controllers REST
│   ├── service/         # Services métier
│   ├── repository/      # Repositories JPA
│   └── dto/             # DTOs + mappers MapStruct
├── estimation/          # Feature Estimation (rapide, avis de valeur, locative)
│   ├── avm/             # Interface AVM + impl mock (cf. §9)
│   │   ├── AvmClient.java          (interface)
│   │   └── mock/MockAvmClient.java
│   └── …
├── observatoire/        # Marché, tension, contexte local
├── investissement/      # Opportunités, dossiers
├── veille/              # Alertes, biens suivis, notifications
├── activite/            # Pilotage commercial, leads, performance
├── equipe/              # Vue équipe, activité, portefeuille, agenda
├── biens/               # Portefeuille, annonces, biens vendus
├── widget/              # API publique du widget estimateur
├── organization/        # Multi-tenant : Organization, Membership, Role
└── PropsightApp.java
```

**Principe :** chaque feature est autonome (web + service + repository + dto). Les entités JPA **partagées entre features** vivent dans `domain/` (pas dupliquées). Les features n'ont **jamais** de dépendance cyclique entre elles — enforcer via ArchUnit.

### 3.2 Frontend — features-based

Structure cible sous `src/main/webapp/app/` :

```
app/
├── app.tsx                    # Root
├── routes.tsx                 # Route config globale
├── shared/                    # Transverse : layout, auth, api, hooks, ui
│   ├── layout/                # Sidebar Pro, header, drawer transverse
│   ├── ui/                    # Primitives Tailwind réutilisées (Button, Modal, Drawer, Table, …)
│   ├── api/                   # Axios client + interceptors
│   ├── auth/                  # Login, guards
│   └── hooks/
├── features/
│   ├── prospection/
│   │   ├── pages/             # Pages routées
│   │   ├── components/        # Composants locaux à la feature
│   │   ├── api/               # Hooks API (useProspectionRadar, …)
│   │   ├── store/             # Slice Redux Toolkit
│   │   └── types.ts
│   ├── estimation/
│   │   ├── avm/               # Client AVM front (mock jusqu'à fin juillet)
│   │   └── …
│   ├── observatoire/
│   ├── investissement/
│   ├── veille/
│   ├── activite/
│   ├── equipe/
│   ├── biens/
│   └── dashboard/
├── public/                    # Pages publiques freemium
│   ├── home/
│   ├── prix-immobiliers/
│   ├── annonces/
│   ├── estimer/
│   ├── investir/
│   ├── ressources/
│   ├── pro/
│   └── widget/
└── config/                    # Constantes, env, i18n FR
```

**Migration :** pas de big bang. La structure JHipster existante (`entities/`, `modules/`, `shared/`) reste en place. Tout **nouveau module** est features-based. Quand on touche un module existant, on le migre.

### 3.3 Objets métier transverses (anti-silos)

Le principe produit est : **pas de silos**. Les objets suivants sont partagés entre modules :

**Bien, Annonce, Lead, Action, Estimation, Opportunité, Dossier, Alerte, Bien suivi, Zone, Collaborateur.**

Chaque module = un angle de lecture, pas une copie des données.

Règles d'implémentation :
- Ces entités vivent dans `com.propsight.domain` côté back, dans `shared/types/` côté front.
- **Favoris (♡)** dans n'importe quel module → écriture dans une unique table `followed_property`. Alimente directement la section Veille > Biens suivis. Pas de duplication.
- **Drawer contextuel transverse** : un seul composant `<EntityDrawer>` côté front, rendu différemment selon le type d'entité, réutilisé par tous les modules.

---

## 4. URLs & routes

### Règles
- **kebab-case**, français, minuscules, pas d'accents.
- `/app/*` = authentifié (Pro).
- Pages publiques sans préfixe.

### Pages publiques
```
/                        Home freemium
/prix-immobiliers        Carte DVF publique
/annonces                Annonces publiques
/estimer                 Estimateur grand public
/investir                Landing investisseur
/ressources              Blog / SEO
/pro                     Landing Pro (agent)
/pro/investisseur        Landing Pro (investisseur)
/pro/tarifs              Pricing
/widget/estimation       Widget embeddable (iframe)
```

### Auth
```
/connexion
/inscription
/mot-de-passe-oublie
```

### App authentifiée — sidebar Pro (ordre figé)
```
/app                              1. Tableau de bord
/app/activite/pilotage            2. Mon activité — Pilotage commercial
/app/activite/leads                  Leads
/app/activite/performance            Performance
/app/biens/portefeuille           3. Biens immobiliers — Portefeuille
/app/biens/annonces                  Annonces
/app/biens/vendus                    Biens vendus (DVF)
/app/prospection/radar            4. Prospection — Radar
/app/prospection/signaux-dvf         Signaux DVF
/app/prospection/signaux-dpe         Signaux DPE
/app/estimation/rapide            5. Estimation — Rapide
/app/estimation/avis-de-valeur       Avis de valeur
/app/estimation/locative             Étude locative
/app/investissement/opportunites  6. Investissement — Opportunités
/app/investissement/dossiers         Dossiers
/app/observatoire/marche          7. Observatoire — Marché
/app/observatoire/tension            Tension
/app/observatoire/contexte           Contexte local
/app/veille/alertes               8. Veille — Alertes
/app/veille/notifications            Notifications
/app/veille/biens-suivis             Biens suivis
/app/veille/agences-concurrentes     Agences concurrentes
/app/equipe/vue                   9. Équipe — Vue équipe
/app/equipe/activite                 Activité
/app/equipe/portefeuille             Portefeuille
/app/equipe/agenda                   Agenda
/app/equipe/performance              Performance
```

### Modals partageables (query params, hors sidebar)
```
?analyse=[bienId]                 Drawer/modal analyse bien (7 tabs)
?comparatif=[id1,id2,id3]         Comparatif multi-biens
```

Ces query params doivent fonctionner **depuis n'importe quelle page** (sidebar respectée en arrière-plan). Le routeur gère l'ouverture/fermeture sans unmount de la page parente.

### Paramètres
```
/app/parametres/compte
/app/parametres/organisation
/app/parametres/membres
/app/parametres/facturation
/app/parametres/widget
/app/parametres/integrations
```

---

## 5. Design system

- **Accent : violet Propsight** (token `--color-propsight-500`, défini dans `tailwind.config.js`)
- **Fond** : blanc ou gris très clair (`bg-white`, `bg-slate-50`)
- **Texte principal** : bleu nuit (approx. `text-slate-900`)
- **Ton** : clean, compact, dense, premium
- **Inspiration** : Linear, Attio
- **Desktop-first** : viewport cible **1440–1600 px**. Responsive mobile V2 (sauf pages publiques + widget qui sont responsive dès V1).

### Anti-patterns à bannir
- ❌ Gros blocs cards avec padding généreux (pas un dashboard BI type Metabase)
- ❌ Icônes surdimensionnées
- ❌ Padding excessif, espacements "airy"
- ❌ Ombres marquées (`shadow-lg`, `shadow-xl`)
- ❌ Border-radius généreux (`rounded-xl`, `rounded-2xl`)
- ❌ Couleurs sémantiques criardes
- ❌ Animations lourdes

### Patterns préférés
- ✅ Listes denses, tables compactes (ligne ~36–40 px)
- ✅ `border` fines (`border-slate-200`) plutôt que shadow
- ✅ `rounded-md` max
- ✅ Typographie petite, hiérarchie par poids et couleur
- ✅ Drawer latéral pour le détail (pas modal full-screen sauf exception)
- ✅ Keyboard-first (raccourcis Cmd+K, navigation clavier dans les listes)

---

## 6. Conventions de code

### Nommage
- **Java classes** : `PascalCase` (`PropertyService`)
- **Java packages** : `lowercase` (`com.propsight.estimation.avm`)
- **TS/JS** : `camelCase` variables et fonctions, `PascalCase` composants React et types
- **Fichiers front** : `kebab-case.tsx` pour les pages routées, `PascalCase.tsx` pour les composants
- **URLs** : `kebab-case` (cf. §4)
- **Tables PostgreSQL** : `snake_case` (Liquibase + stratégie `CamelCaseToUnderscoresNamingStrategy` déjà configurée)

### Tests
- **Back** : JUnit 5. Tests unitaires `*Test.java`, tests d'intégration `*IT.java` ou `*IntTest.java` (séparés par surefire/failsafe, déjà configuré dans `pom.xml`).
- **Back infra** : Testcontainers PostgreSQL (déjà en place). Pas de H2.
- **Back architecture** : ArchUnit dans `src/test/java/com/propsight/archtest/`. Règles à enforcer : pas de cycles entre features, les features ne dépendent que de `shared` et `domain`.
- **Front** : Jest + Testing Library. Tests à côté du composant (`Component.tsx` + `Component.test.tsx`).
- **Coverage** : pas d'objectif chiffré dogmatique. Tester la logique métier (services, reducers, fonctions pures). Ne pas tester les mappers auto-générés, les controllers triviaux, les composants de présentation sans logique.

### Commits
- **Conventional Commits** avec scope = nom de module sidebar.
- Exemples :
  - `feat(prospection): ajout radar DVF multi-critères`
  - `fix(estimation): correction calcul loyer mensuel`
  - `chore(shared): upgrade Tailwind 3.4.1`
  - `refactor(biens): migration entités vers domain package`
- Scopes autorisés : `dashboard`, `activite`, `biens`, `prospection`, `estimation`, `investissement`, `observatoire`, `veille`, `equipe`, `widget`, `public`, `shared`, `domain`, `auth`, `org`, `infra`, `ci`.

### Branches
- **Trunk-based**, branches courtes depuis `main`.
- Préfixes : `feat/`, `fix/`, `chore/`, `refactor/`.
- Format : `feat/prospection-radar-dvf`.
- PR obligatoire. Pas de push direct sur `main`.

### i18n
- **FR only V1.** Pas d'i18n multi-langues tant que ce n'est pas explicitement décidé. Textes en dur en français acceptés pour vitesse.
- JHipster livre un système i18n — on ne l'alimente pas en EN V1.

---

## 7. Commands essentielles

### Dev local (premier lancement)
```bash
# 1. DB PostgreSQL via Docker
npm run docker:db:up

# 2. Backend (port 8080) — garder ce terminal ouvert
./mvnw

# 3. Frontend dev server (port 9000) — autre terminal
npm start
```

### Dev quotidien
```bash
npm run watch              # Lance front + back en parallèle
npm run backend:start      # Back seul (pas de build front)
npm start                  # Front seul (proxifie vers back sur 8080)
```

### Tests
```bash
npm test                   # Tests front (Jest)
npm run test:watch         # Tests front en watch
./mvnw test                # Tests unitaires back
./mvnw verify              # Tests unitaires + intégration back (Testcontainers requis)
```

### Qualité
```bash
npm run lint               # ESLint sur tout le repo
npm run lint:fix           # ESLint + autofix
npm run prettier:check     # Check formatage
npm run prettier:format    # Format tout
./mvnw checkstyle:check    # Checkstyle Java
./mvnw spotless:apply      # Format Java
```

### Build prod
```bash
npm run webapp:prod        # Build front prod dans target/classes/static
./mvnw -Pprod verify       # Jar complet prod
```

### DB
```bash
npm run docker:db:up       # PostgreSQL Docker up
npm run docker:db:down     # Stop + wipe volume
# Migrations : placer les fichiers dans src/main/resources/config/liquibase/changelog/
#              et les référencer dans master.xml. Liquibase s'exécute au boot.
```

---

## 8. Workflow de développement

### Principe général
- **Un module = une conv claude.ai** (spec produit + UI + data model)
- La spec sort de claude.ai, entre dans Claude Code (VS Code)
- Claude Code **implémente en suivant ce CLAUDE.md**
- **Toujours demander un PLAN à Claude Code avant implémentation.** Valider le plan, puis exécuter.

### Plan attendu avant tout gros ticket
Quand on demande à Claude Code d'implémenter un module ou une feature non triviale, il doit produire un plan avant d'écrire du code, couvrant :
1. Liste des fichiers à créer / modifier (chemins exacts)
2. Migrations Liquibase nécessaires (nouvelles tables, colonnes)
3. Nouveaux endpoints API (méthode, URL, DTO in/out)
4. Slices Redux à créer / modifier
5. Nouveaux composants front (avec dépendances UI partagées)
6. Tests à ajouter (unit, IT, archi)
7. Points d'attention / risques

On itère sur le plan jusqu'à ce qu'il soit validé. Puis implémentation.

### Tickets triviaux
Un fix CSS, un rename, un petit bug → pas besoin de plan, implémentation directe.

---

## 9. AVM — interface mock jusqu'à fin juillet 2026

L'équipe ML livre l'AVM (prix + loyers) fin juillet. D'ici là, **tous les appels AVM passent par une interface stable implémentée en mock.**

### Back — `com.propsight.estimation.avm`

```java
// Interface stable — ne doit PAS changer au branchement ML
public interface AvmClient {
    AvmPriceEstimate estimatePrice(AvmPriceRequest request);
    AvmRentEstimate estimateRent(AvmRentRequest request);
}

// Impl mock utilisée jusqu'à fin juillet
@Component
@Profile({"dev", "prod"})  // actif tant que le profil "avm-ml" n'est pas activé
@ConditionalOnMissingBean(name = "avmMlClient")
public class MockAvmClient implements AvmClient { ... }

// Impl ML branchée fin juillet
@Component("avmMlClient")
@Profile("avm-ml")
public class MlAvmClient implements AvmClient { ... }
```

**Règle :** aucun code métier ne fait référence à `MockAvmClient`. Uniquement à `AvmClient`. Swap plug-and-play au branchement.

### Front
- Client TS dans `features/estimation/avm/avmClient.ts` (interface).
- Impl mock dans `features/estimation/avm/mock/`.
- Feature flag via variable d'env pour basculer mock ↔ backend réel quand back prêt.

### Données mock attendues
- Prix m² cohérents avec les ordres de grandeur DVF réels par zone
- Intervalles de confiance fournis (min / median / max)
- Latence simulée ~300–500ms (pour tester UX de loading)

---

## 10. Multi-tenant & auth

### Entités
- `Organization` : entité tenant. Chaque user appartient à une et une seule Organization V1.
- `Membership` : lien User ↔ Organization avec rôle.
- **Rôles** : `OWNER`, `ADMIN`, `AGENT`, `VIEWER`.
  - `OWNER` : facturation, suppression org
  - `ADMIN` : gestion membres, config widget
  - `AGENT` : usage standard (créer biens, leads, estimations)
  - `VIEWER` : lecture seule (ex: manager qui supervise)

### Isolation données
**Toutes les requêtes métier filtrent par `organization_id`.** Règle non négociable.

À enforcer :
- Filtre systématique dans les repositories (`findByOrganizationId`, ou via Hibernate filters activés par défaut).
- Test ArchUnit : aucune query JPA sur les entités métier sans contrainte `organization_id`.

### Auth
- JWT via Spring Security OAuth2 Resource Server (déjà configuré).
- Claims JWT contiennent `userId`, `organizationId`, `role`.
- Axios interceptor front ajoute le Bearer token à toute requête `/api/*`.

---

## 11. API — conventions

- Base path : `/api/` pour les endpoints authentifiés Pro, `/api/public/` pour les endpoints freemium, `/api/widget/` pour le widget.
- REST, JSON, pas de GraphQL V1.
- DTOs toujours, jamais d'entités JPA exposées directement (MapStruct pour les conversions).
- Pagination Spring : `?page=0&size=20&sort=createdAt,desc`.
- Errors : format Problem Details (RFC 7807), déjà géré par JHipster.
- OpenAPI auto-généré via springdoc, disponible en dev sur `/v3/api-docs` et `/swagger-ui.html`.

---

## 12. À ne jamais faire

- ❌ Coder sans avoir produit un plan validé pour les features non triviales.
- ❌ Exposer une entité JPA directement dans un controller (passer par DTO).
- ❌ Ajouter du Bootstrap / Reactstrap / SCSS custom dans du nouveau code.
- ❌ Ajouter du Leaflet dans un nouveau module (Mapbox GL uniquement).
- ❌ Importer depuis FontAwesome ou react-icons dans du nouveau code.
- ❌ Écrire une query JPA sur une entité métier sans filtre `organization_id`.
- ❌ Appeler `MockAvmClient` directement au lieu de l'interface `AvmClient`.
- ❌ Dupliquer la logique "favoris" dans plusieurs modules. Une seule table `followed_property`.
- ❌ Créer des entités métier dans une feature (doivent vivre dans `domain/`).
- ❌ Ignorer Liquibase et modifier le schéma directement.
- ❌ Faire des commits sans scope (`feat: ...` tout seul, sans `feat(prospection): ...`).
- ❌ Push direct sur `main`.

---

## 13. Migration à prévoir (hors session courante)

Ces migrations ne sont **pas** à faire opportunistiquement dans chaque ticket — elles méritent leur propre conv / leur propre PR dédiée.

1. **Renommage package Java** : `com.apeiron.immoxperts` → `com.propsight`. Nombreux fichiers impactés, configs Spring, properties, tests ArchUnit. À prévoir en PR dédiée avant gros développement.
2. **Renommage repo** : `Immoxperts-clean` → `propsight`.
3. **Renommage artifactId Maven** : `immoxperts` → `propsight` dans `pom.xml`.
4. **Nom BDD** : `immoxperts` → `propsight` (Liquibase URL dans `pom.xml`, `application-dev.yml`, `application-prod.yml`, docker compose).
5. **Migration Bootstrap → Tailwind** des composants JHipster legacy (progressif, au fil des touches).
6. **Migration layout front** `entities/` + `modules/` → `features/` (progressif, au fil des touches).

Tant que ces migrations ne sont pas faites, le code coexiste. Nouveau code sous `com.propsight` / `features/`, ancien code sous `com.apeiron.immoxperts` / `entities/`. Pas de blocage, juste à garder en tête.

---

## 14. Références rapides

- Site prod : https://propsight.fr
- Repo actuel : `Immoxperts-clean` (local)
- Spec produit vivante : conv claude.ai "Maquettes produit" (par module)
- Stack docs : JHipster 8 (https://www.jhipster.tech/documentation-archive/v8/), Spring Boot 3.4, React 18, Mapbox GL JS v3.