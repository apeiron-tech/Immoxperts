# Propsight — Spécification complète Observatoire Pro

**Version :** V1 maquette fonctionnelle  
**Produit :** Propsight Pro  
**Section :** Observatoire  
**Routes :**
- `/app/observatoire/marche`
- `/app/observatoire/tension`
- `/app/observatoire/contexte-local`

---

## 0. Objectif du document

Ce document sert de **spécification produit + UX + composants + données** pour générer les maquettes de la section **Observatoire** dans l’espace Pro Propsight.

Il doit permettre à Claude Code de construire une première version cohérente des écrans, sans repartir de zéro et sans faire un dashboard isolé.

L’Observatoire doit être conçu comme une **couche transverse d’intelligence territoriale** qui nourrit toutes les autres sections du produit :

- **Biens immobiliers**
- **Estimation**
- **Investissement**
- **Prospection**
- **Veille**
- **Mon activité / Leads**
- **Performance**
- **Rapports éditables PDF**

L’Observatoire ne doit pas être une simple page de graphiques.  
Il doit transformer une zone en **décision métier**.

---

# 1. Vision produit Observatoire

## 1.1 Rôle global

L’Observatoire répond à la question :

> Que dit cette zone, et comment cette lecture doit influencer mes décisions de prix, d’estimation, de prospection, d’investissement, de veille ou de reporting ?

L’objet principal de cette section est :

```ts
Zone
```

Une zone peut être :

```ts
commune
arrondissement
quartier
IRIS
adresse
zone personnalisée agence
zone suivie
zone de prospection
```

---

## 1.2 Les 3 sous-sections

```text
Observatoire
├ Marché
├ Tension
└ Contexte local
```

### Marché

Répond à :

> Combien vaut cette zone, comment les prix / loyers / rendements évoluent-ils, et comment les comparer ?

### Tension

Répond à :

> Est-ce que le marché absorbe rapidement l’offre ? Où sont les stocks, les délais, les baisses de prix et les signaux d’action ?

### Contexte local

Répond à :

> Qui vit ici, comment est le cadre de vie, et quel potentiel futur peut influencer la valeur, la location ou l’investissement ?

---

## 1.3 Principe transversal fondamental

L’Observatoire est une **source de vérité zone**.

Il ne possède pas seul la donnée. Il expose des blocs qui sont réutilisés dans :

```text
Avis de valeur
Étude locative
Dossier investissement
Analyse d’un bien
Fiche bien
Radar prospection
Alertes veille
Performance commerciale
Brief RDV
```

### Exemple de flux

```text
Observatoire > Marché
→ bloc prix du marché
→ ajouté dans Avis de valeur

Observatoire > Tension
→ bloc délais / baisses de prix
→ ajouté dans argumentaire vendeur

Observatoire > Contexte local
→ bloc profil locataire / cadre de vie / PLU
→ ajouté dans Étude locative ou Dossier investissement

Observatoire > Contexte local > Potentiel
→ alerte urbanisme
→ Veille > Mes alertes

Observatoire > Tension > Annonces anciennes
→ Prospection > Radar
→ Action commerciale
→ Mon activité > Pilotage commercial
```

---

# 2. Règles UI / UX globales

## 2.1 Style visuel

Respecter la charte Propsight déjà définie :

```text
Violet Propsight dominant
Interface clean / compact
Desktop-first 1440–1600 px
Inspiration Linear / Attio
Densité professionnelle
Pas de gros blocs décoratifs
Pas de gros icônes
Pas de padding excessif
Pas de dashboard surchargé
```

---

## 2.2 Règle KPI

Ne pas noyer l’utilisateur.

Chaque écran ou tab affiche :

```text
4 KPI maximum
3 insights maximum dans “À retenir”
2 à 3 blocs détaillés visibles
Le reste dans drawer / détail / export / rapport
```

Un KPI n’existe que s’il aide à décider.

```text
KPI principal = visible en haut
Donnée secondaire = graphique / tableau / drawer
Donnée explicative = tooltip / source / méthodo
Insight = phrase actionnable
```

---

## 2.3 Layout standard Observatoire

Toutes les sous-sections utilisent une logique **split view** :

```text
┌────────────────────────────────────────────────────────────┐
│ Header Pro Propsight                                       │
├──────────────┬─────────────────────────────────────────────┤
│ Sidebar Pro  │ Header page + filtres                       │
│              │                                             │
│              │ ┌──────────────────────┬──────────────────┐ │
│              │ │ Panneau analyse      │ Carte fixe       │ │
│              │ │ KPI + insights       │ couches données  │ │
│              │ │ blocs détaillés      │ pins / zones     │ │
│              │ │ actions              │ légende          │ │
│              │ └──────────────────────┴──────────────────┘ │
└──────────────┴─────────────────────────────────────────────┘
```

### Dimensions recommandées

```text
Sidebar : 240 px
Panneau analyse gauche : 560 px environ
Carte droite : largeur restante
```

### Scroll

```text
Pas de scroll global lourd.
La carte reste fixe.
Le panneau gauche peut scroller.
Les filtres restent sticky.
Les tabs restent sticky dans Contexte local.
```

---

## 2.4 IA

Ne jamais afficher un gros bloc IA dans le body.

L’IA est uniquement dans :

```text
Drawer contextuel
Drawer Assistant IA
Suggestions compactes
Actions contextuelles
```

---

# 3. Section Marché

## 3.1 Rôle exact

**Marché** répond à :

```text
1. Combien vaut la zone ?
2. Est-ce que les prix / loyers / rendements montent, baissent ou stagnent ?
3. Quelle est la fiabilité statistique ?
4. Quels segments portent le marché ?
5. Que peut-on faire avec cette information ?
```

Marché ne doit pas être un mur de données.  
Il doit être un **cockpit marché clair, compact et actionnable**.

---

## 3.2 Route

```text
/app/observatoire/marche
```

Exemples :

```text
/app/observatoire/marche?zone=paris-15
/app/observatoire/marche?zone=lyon-7&type=appartement&period=12m
/app/observatoire/marche?zone=bordeaux&type=appartement&mode=location
/app/observatoire/marche?zone=grenoble&mode=rendement
```

---

## 3.3 Structure écran

```text
Observatoire > Marché
Analysez les prix, loyers, rendements et dynamiques de transaction par zone.

[Zone] [Mode] [Type bien] [Segment] [Période] [Source]

┌─────────────────────────┬───────────────────────────────┐
│ Panneau analyse marché  │ Carte marché interactive       │
│                         │                               │
│ Zone sélectionnée       │ Couche prix / loyer / rendement│
│ 4 KPI                   │ Biens vendus                   │
│ À retenir               │ Annonces actives               │
│ Fourchette marché       │ Zones voisines                 │
│ Évolution               │ Légende                        │
│ Segments                │ Contrôles carte                │
│ Distribution            │                               │
│ Comparables             │                               │
│ Zones voisines          │                               │
│ Sources & fiabilité     │                               │
└─────────────────────────┴───────────────────────────────┘
```

---

## 3.4 Header Marché

### Titre

```text
Marché
```

### Sous-titre

```text
Analysez les prix, loyers, rendements et dynamiques de transaction par zone.
```

### Actions header

```text
[Comparer une zone]
[Créer une alerte]
[Exporter]
```

Hiérarchie :

```text
Primaire : Comparer une zone
Secondaire : Créer une alerte
Ghost / menu : Exporter
```

---

## 3.5 Barre de filtres Marché

```text
[Zone : Paris 15e ▾]
[Mode : Vente ▾]
[Type : Appartement ▾]
[Segment : Tous ▾]
[Surface : Toutes ▾]
[Période : 12 mois ▾]
[Source : DVF + annonces ▾]
```

### Zone

Accepte :

```text
ville
arrondissement
quartier
IRIS
adresse
zone personnalisée agence
zone suivie
```

Exemples :

```text
Paris 15e
Lyon 7e
Bordeaux Chartrons
Grenoble
Rue du Commerce
Zone agence Sud-Ouest Paris
```

### Mode

```text
Vente
Location
Rendement
```

### Type de bien

```text
Tous
Appartement
Maison
Immeuble
Local
Terrain
Parking
```

V1 recommandée :

```text
Tous
Appartement
Maison
```

### Segment

```text
Tous
Studio / T1
T2
T3
T4+
Petites surfaces
Familial
Haut de marché
Marché accessible
```

### Surface

```text
Toutes
< 30 m²
30–50 m²
50–75 m²
75–100 m²
100 m²+
Personnalisée
```

### Période

```text
6 mois
12 mois
24 mois
5 ans
10 ans
```

Par défaut :

```text
12 mois pour les KPI
5 ans pour la courbe si disponible
```

### Source

```text
DVF
Annonces
DVF + annonces
```

Par défaut :

```text
Mode Vente     → DVF + annonces
Mode Location  → Annonces
Mode Rendement → DVF + annonces location
```

---

## 3.6 Mode Vente

### Objectif

Comprendre le niveau de prix de vente d’une zone.

### KPI visibles — 4 maximum

```text
Prix médian €/m²
Évolution 12 mois
Volume DVF
Confiance
```

Exemple :

```text
Prix médian       9 420 €/m²
Évolution 12m     +2,8 %
Volume DVF        842 ventes
Confiance         Forte
```

### Détails accessibles

```text
prix bas
prix haut
prix moyen
prix par typologie
distribution prix/m²
évolution 6 mois / 24 mois / 5 ans
comparables vendus
comparables en vente
écart annonces / DVF
```

---

## 3.7 Mode Location

### Objectif

Comprendre le niveau de loyer d’une zone.

### KPI visibles

```text
Loyer médian €/m² HC
Évolution 12 mois
Volume annonces
Confiance
```

Exemple :

```text
Loyer médian      18,90 €/m² HC
Évolution 12m     +3,4 %
Volume annonces   386 annonces
Confiance         Bonne
```

### Détails accessibles

```text
loyer bas
loyer haut
loyer par typologie
loyer meublé / non meublé
loyer HC / CC
comparables loués
comparables à louer
encadrement si applicable
```

---

## 3.8 Mode Rendement

### Objectif

Comprendre le potentiel rendement d’une zone.

### KPI visibles

```text
Rendement brut médian
Prix médian
Loyer médian
Confiance
```

Exemple :

```text
Rendement brut    5,8 %
Prix médian       3 950 €/m²
Loyer médian      15,20 €/m² HC
Confiance         Moyenne
```

### Détails accessibles

```text
rendement bas
rendement haut
rendement par typologie
rendement par surface
zones voisines plus rentables
rapport prix / loyer
```

---

## 3.9 Bloc Zone sélectionnée

Position : haut du panneau.

Exemple :

```text
Paris 15e
Arrondissement · Île-de-France
842 ventes DVF · 1 924 annonces observées · 12 mois

[Marché actif] [Volume fiable] [Prix stable] [Écart annonces élevé]
```

Interactions :

```text
Clic zone → Drawer Zone
Clic chip → explication courte
```

---

## 3.10 KPI strip Marché

Composant :

```tsx
<MarketKpiStrip mode="vente" />
<MarketKpiStrip mode="location" />
<MarketKpiStrip mode="rendement" />
```

Règle :

```text
KPI 1 = valeur principale
KPI 2 = tendance
KPI 3 = volume / profondeur
KPI 4 = confiance
```

Interactions :

```text
Prix médian → scroll vers fourchette / distribution
Évolution 12m → scroll vers courbe
Volume → détail volume / segments
Confiance → drawer méthodologie
```

---

## 3.11 Bloc À retenir Marché

Position : sous les KPI.

Format :

```text
3 insights maximum
1 phrase courte par insight
1 action suggérée si utile
```

Exemple Vente :

```text
À retenir

• Prix stables sur 12 mois, mais volume en baisse.
• Les T2 restent le segment le plus liquide.
• Les annonces actives sont en moyenne 6 % au-dessus du réalisé DVF.
```

Exemple Location :

```text
À retenir

• Loyers en hausse sur 12 mois.
• Forte profondeur sur les petites surfaces meublées.
• Le marché reste sensible à l’encadrement des loyers.
```

Exemple Rendement :

```text
À retenir

• Rendement supérieur aux zones voisines.
• Les petites surfaces concentrent le meilleur couple prix / loyer.
• Attention à la vacance sur les grands logements.
```

---

## 3.12 Bloc Fourchette marché

Bloc inspiré des rapports concurrents, mais compact.

### Vente

```text
Fourchette de prix de vente

Prix bas       Prix médian       Prix haut
8 120 €/m²     9 420 €/m²       10 850 €/m²
```

### Location

```text
Fourchette des loyers

Loyer bas          Loyer médian       Loyer haut
16,00 €/m² HC      18,90 €/m² HC      21,20 €/m² HC
```

### Rendement

```text
Fourchette de rendement brut

Bas       Médian       Haut
4,2 %     5,8 %        7,1 %
```

Visualisation :

```text
Barre horizontale compacte bas → médian → haut
```

Si contexte bien :

```text
Position de votre bien : 9 850 €/m²
→ au-dessus de la médiane, mais sous le haut de marché
```

---

## 3.13 Bloc Évolution

### Vente

```text
Ligne principale : prix médian DVF
Bande : prix bas / haut
Barres : volume DVF
```

### Location

```text
Ligne principale : loyer médian annonces
Bande : loyer bas / haut
Option : meublé / non meublé
```

### Rendement

```text
Ligne principale : rendement brut médian
Lignes secondaires optionnelles : prix médian / loyer médian
```

Périodes affichées :

```text
6 mois
12 mois
24 mois
5 ans
```

---

## 3.14 Bloc Segments

Objectif : comprendre quel segment porte le marché.

### Vente

```text
Segment       Prix médian   Volume   Évol. 12m
Studio/T1     10 850 €/m²   184      +3,2 %
T2             9 940 €/m²   256      +2,1 %
T3             9 320 €/m²   238      +1,4 %
T4+            8 780 €/m²   164      -0,6 %
```

### Location

```text
Segment       Loyer médian     Volume annonces   Évol. 12m
Studio/T1     32 €/m² HC       210               +4,1 %
T2            27 €/m² HC       180               +3,2 %
T3            23 €/m² HC       94                +1,8 %
T4+           20 €/m² HC       42                +0,4 %
```

### Rendement

```text
Segment       Rendement médian   Prix médian   Loyer médian
Studio/T1     6,2 %              5 200 €/m²    27 €/m²
T2            5,7 %              4 800 €/m²    23 €/m²
T3            4,9 %              4 500 €/m²    18 €/m²
```

Interaction :

```text
Clic segment
→ recalcule KPI
→ filtre carte
→ met à jour courbe
→ met à jour comparables
```

---

## 3.15 Bloc Distribution

Position : après Segments.

Tabs :

```text
Prix/m²
Prix total
Surface
```

Par défaut :

```text
Prix/m²
```

Affichage :

```text
Histogramme simple + médiane
P25 / médiane / P75
```

Exemple :

```text
Distribution des prix au m²
Médiane : 9 420 €/m²
P25 : 8 120 €/m²
P75 : 10 850 €/m²
```

Si contexte bien :

```text
Position de votre bien
```

---

## 3.16 Bloc Comparables

Dans Marché, afficher une preview uniquement.

### Mode Vente

Tabs :

```text
Vendus
En vente
Invendus
```

Champs visibles :

```text
adresse approximative
distance
surface
pièces
prix
prix/m²
date
statut
```

### Mode Location

Tabs :

```text
À louer
Loués / expirés
```

Champs visibles :

```text
loyer HC / CC
loyer/m²
surface
pièces
meublé / vide
durée en ligne
date de retrait si expiré
```

Actions :

```text
[Voir tous les comparables]
[Ajouter au rapport]
[Ouvrir dans Biens]
```

---

## 3.17 Bloc Zones voisines

Table compacte :

```text
Zone          Prix médian   Évol. 12m   Volume   Confiance
Paris 15e     9 420 €/m²    +2,8 %      842      Forte
Paris 14e     9 180 €/m²    +1,9 %      621      Forte
Boulogne      8 960 €/m²    +0,6 %      488      Forte
Issy           8 420 €/m²    +1,2 %      392      Moyenne
```

CTA :

```text
[Ouvrir comparatif zones]
```

Le comparatif est une modale transverse, pas une sous-section de sidebar.

---

## 3.18 Carte Marché

Position : droite, fixe.

### Couches principales Vente

```text
Prix au m² DVF
Volume DVF
Évolution 12 mois
Écart annonces / DVF
```

### Couches principales Location

```text
Loyer au m²
Volume annonces location
Évolution loyers
Encadrement loyers si disponible
```

### Couches principales Rendement

```text
Rendement brut
Prix / loyer
Opportunités rendement
Zones comparables
```

### Couches secondaires

```text
Biens vendus
Annonces actives
Biens portefeuille
Biens suivis
Zones suivies
Agences concurrentes
```

### Contrôles

```text
[Couche : Prix au m² ▾] [Légende min → max]

☑ Biens vendus
☑ Annonces actives
☐ Portefeuille
☐ Biens suivis
☐ Agences concurrentes
```

Fonds :

```text
Plan clair
Satellite
Cadastre
Sans fond
```

Par défaut :

```text
Plan clair
```

---

## 3.19 Sources & fiabilité Marché

Afficher en bas du panneau et via badge confiance.

Contenu :

```text
Source prix : DVF
Source annonces : agrégateur annonces
Période : 12 mois
Dernière mise à jour : avril 2026
Granularité : arrondissement / IRIS
Volume : 842 ventes
Dispersion : modérée
Confiance : forte
```

Raisons :

```text
✓ 842 ventes DVF sur 12 mois
✓ annonces disponibles
✓ dispersion maîtrisée
⚠ faible volume sur T4+
```

---

## 3.20 Actions Marché

### Actions globales

```text
Comparer une zone
Créer une alerte marché
Ajouter cette zone à la veille
Exporter les données
Ajouter au rapport
```

### Vers Biens immobiliers

```text
Voir biens vendus DVF
Voir annonces actives
Voir biens portefeuille sur la zone
Voir biens suivis sur la zone
```

### Vers Estimation

```text
Ajouter le bloc prix au rapport
Créer une estimation rapide
Créer un avis de valeur
Préparer un argumentaire vendeur
```

### Vers Investissement

```text
Ouvrir opportunités sur cette zone
Comparer avec une autre ville
Ajouter zone à un projet investisseur
Ouvrir analyse rendement
```

### Vers Prospection

```text
Ouvrir Radar sur cette zone
Voir annonces anciennes
Voir écarts annonces / DVF
Créer action de prospection
```

### Vers Veille

```text
Créer alerte prix
Créer alerte volume
Créer alerte écart annonces / DVF
Créer alerte rendement
```

---

# 4. Section Tension

## 4.1 Rôle exact

**Tension** répond à :

```text
1. Le marché est-il ralenti, équilibré ou dynamique ?
2. L’offre est-elle trop abondante ou trop faible ?
3. Les biens se vendent-ils / se louent-ils rapidement ?
4. Les vendeurs / bailleurs baissent-ils leurs prix ou loyers ?
5. Quels segments sont les plus tendus ?
6. Quelle action métier déclencher ?
```

Marché dit :

```text
Combien ça vaut ?
```

Tension dit :

```text
À quelle vitesse le marché absorbe l’offre, et où faut-il agir ?
```

---

## 4.2 Route

```text
/app/observatoire/tension
```

Exemples :

```text
/app/observatoire/tension?zone=paris-15
/app/observatoire/tension?zone=lyon-7&mode=vente&type=appartement
/app/observatoire/tension?zone=bordeaux&mode=location&segment=t2
/app/observatoire/tension?zone=grenoble&mode=vente&period=90j
```

---

## 4.3 Structure écran

```text
Observatoire > Tension
Suivez la pression du marché, les stocks, délais et signaux d’opportunité par zone.

[Zone] [Mode] [Type bien] [Segment] [Période] [Source]

┌─────────────────────────┬───────────────────────────────┐
│ Panneau analyse tension │ Carte tension interactive      │
│                         │                               │
│ Zone sélectionnée       │ Score tension                  │
│ 4 KPI                   │ Stock                          │
│ À retenir               │ Délais                         │
│ Tensiomètre             │ Baisses de prix                │
│ Délais                  │ Annonces anciennes             │
│ Stock                   │ Segments                       │
│ Révisions prix / loyers │                               │
│ Signaux actionnables    │                               │
│ Sources & fiabilité     │                               │
└─────────────────────────┴───────────────────────────────┘
```

---

## 4.4 Header Tension

### Titre

```text
Tension
```

### Sous-titre

```text
Suivez la pression du marché, les stocks, délais et signaux d’opportunité par zone.
```

### Actions header

```text
[Créer une alerte tension]
[Ouvrir Radar]
[Exporter]
```

Hiérarchie :

```text
Primaire : Créer une alerte tension
Secondaire : Ouvrir Radar
Ghost : Exporter
```

---

## 4.5 Barre de filtres Tension

```text
[Zone : Paris 15e ▾]
[Mode : Vente ▾]
[Type : Appartement ▾]
[Segment : Tous ▾]
[Période : 90 jours ▾]
[Source : Annonces + DVF ▾]
```

### Mode

```text
Vente
Location
```

Pas de mode Rendement dans Tension.

### Période

```text
30 jours
90 jours
6 mois
12 mois
```

Par défaut :

```text
90 jours
```

### Source

```text
Annonces
DVF
Annonces + DVF
```

Par défaut :

```text
Mode Vente     → Annonces + DVF
Mode Location  → Annonces
```

---

## 4.6 Mode Vente

### KPI visibles

```text
Score tension
Délai médian de vente
Stock actif
Part des baisses de prix
```

Exemple :

```text
Score tension          Équilibré · 56/100
Délai médian           49 jours
Stock actif            318 annonces
Baisses de prix         18 %
```

---

## 4.7 Mode Location

### KPI visibles

```text
Score tension locative
Délai médian de location
Stock locatif actif
Part des loyers révisés / baissés
```

Exemple :

```text
Score tension locative     Dynamique · 72/100
Délai médian location      17 jours
Stock locatif actif        142 annonces
Loyers révisés             9 %
```

---

## 4.8 KPI strip Tension

Règle :

```text
KPI 1 = score tension
KPI 2 = délai
KPI 3 = stock
KPI 4 = révision prix / loyer
```

Interactions :

```text
Score tension → Tensiomètre + breakdown
Délai médian → bloc Délais
Stock actif → filtre carte stock
Baisses / révisions → liste des biens concernés
```

---

## 4.9 Bloc À retenir Tension

Exemple Vente :

```text
À retenir

• Le marché est équilibré mais les délais s’allongent sur les T3.
• 18 % des annonces ont déjà baissé leur prix sur 90 jours.
• Les biens affichés au-dessus du marché génèrent des opportunités de prospection.
```

Exemple Location :

```text
À retenir

• La demande locative reste forte sur les petites surfaces.
• Les délais de location sont courts sur les T1/T2 meublés.
• Les grands logements restent plus exposés à la vacance.
```

---

## 4.10 Bloc Tensiomètre

Ne pas utiliser une jauge trop “cheap”.  
Préférer une barre segmentée premium.

```text
Très ralenti | Ralenti | Équilibré | Dynamique | Très dynamique
                         ▲
                       56/100
```

Contenu :

```text
Score : 56/100 · Équilibré

Le marché reste équilibré : les délais sont proches de la tendance,
mais le stock augmente légèrement sur les T3/T4.
```

Toujours afficher :

```text
score + label + explication
```

---

## 4.11 Breakdown du score

### Composantes Vente

```text
Stock actif
Délai de vente
Baisses de prix
Ancienneté des annonces
Rotation DVF
Écart prix affiché / prix réalisé
```

### Composantes Location

```text
Stock locatif actif
Délai de location
Révision des loyers
Ancienneté des annonces location
Vacance estimée
Profondeur de demande locative
```

Affichage recommandé :

```text
Facteurs qui ralentissent le marché
• Stock en hausse sur 90 jours
• 18 % des annonces ont baissé leur prix

Facteurs qui soutiennent le marché
• Délai médian encore inférieur à 60 jours
• Volume DVF stable sur 12 mois
```

---

## 4.12 Bloc Délais

### Vente

```text
Délais de vente
Durée médiane de diffusion des annonces sur les 6 derniers mois.

Rapides          Médiane          Lents
20 jours         49 jours         105 jours
25 % rapides     50 % médiane     25 % lents
```

### Location

```text
Délais de location

Rapides          Médiane          Lents
3 jours          11 jours         33 jours
```

Interaction :

```text
Clic sur Lents
→ filtre annonces anciennes
→ CTA créer action prospection
```

---

## 4.13 Bloc Stock actif

### Vente

```text
Stock actif
318 annonces actives
+12 % vs 90 jours précédents
```

Répartition :

```text
Studio/T1      42
T2             86
T3             104
T4+            86
```

### Location

```text
Stock locatif actif
142 annonces actives
-8 % vs 90 jours précédents
```

Répartition :

```text
Meublé         96
Vide           46
T1/T2          88
T3+            54
```

---

## 4.14 Bloc Révisions de prix / loyers

### Vente

```text
Baisses de prix

18 % des annonces ont baissé leur prix
Baisse médiane : -4,2 %
Délai avant première baisse : 38 jours
```

Table :

```text
Segment        Part baisse      Baisse médiane
T1/T2          11 %             -3,1 %
T3             21 %             -4,5 %
T4+            24 %             -5,2 %
```

### Location

```text
Révisions de loyers

9 % des annonces ont révisé leur loyer
Révision médiane : -2,8 %
Délai avant révision : 21 jours
```

---

## 4.15 Bloc Annonces anciennes

Définition V1 :

```text
Annonce active depuis plus de X jours par rapport à la médiane locale.
```

Exemple :

```text
Médiane zone : 49 jours
Seuil annonce ancienne : > 90 jours
```

Contenu :

```text
46 annonces anciennes
14 % du stock actif
Prix affiché moyen : +7,8 % au-dessus du marché
```

Table preview :

```text
Bien                Prix       Ancienneté    Signal
T3 64 m²            415 000 €  128 jours     Prix trop haut
T2 48 m²            289 000 €  94 jours      Baisse récente
Maison 110 m²       620 000 €  156 jours     Stock rare mais cher
```

Actions :

```text
[Voir dans Annonces]
[Créer action prospection]
[Créer alerte annonces anciennes]
[Ajouter au Radar]
```

---

## 4.16 Bloc Segments sous tension

### Vente

```text
Segment        Score tension   Délai médian   Stock   Baisses prix
T1/T2          72 dynamique    32 j           42      8 %
T3             49 équilibré    61 j           104     21 %
T4+            38 ralenti      84 j           86      24 %
```

### Location

```text
Segment        Score tension   Délai médian   Stock   Révision loyer
T1 meublé      82 dynamique    7 j            24      3 %
T2 meublé      76 dynamique    11 j           38      5 %
T3 vide        48 équilibré    24 j           41      12 %
T4+            31 ralenti      42 j           39      18 %
```

Interaction :

```text
Clic segment
→ recalcule KPI
→ filtre carte
→ met à jour signaux
```

---

## 4.17 Bloc Signaux actionnables

Ne pas créer de pipeline parallèle.  
Un signal devient soit :

```text
Action
Lead
Alerte
Vue Radar
```

### Signaux Vente

```text
Prix trop élevé
Annonce ancienne
Baisse de prix récente
Remise en ligne
Stock en hausse
Délai supérieur à la médiane
Segment en ralentissement
Zone avec tension forte et faible stock
```

### Signaux Location

```text
Loyer trop élevé
Annonce location ancienne
Révision loyer récente
Stock locatif faible
Délai de location très court
Zone à forte demande petites surfaces
Vacance locative probable
```

Affichage :

```text
Signaux à traiter

1. 18 annonces anciennes avec prix > marché
   → Voir annonces
   → Créer action prospection

2. Stock T3 en hausse de 22 %
   → Créer alerte tension
   → Ajouter au brief marché

3. Petites surfaces locatives sous 12 jours de délai médian
   → Ouvrir opportunités investissement
```

---

## 4.18 Carte Tension

### Couches Vente

```text
Score tension
Stock actif
Délai médian
Baisses de prix
Annonces anciennes
Écart annonce / DVF
```

### Couches Location

```text
Score tension locative
Stock locatif
Délai médian location
Loyers révisés
Vacance locative estimée
Tension petites surfaces
```

### Couches secondaires

```text
Annonces actives
Annonces anciennes
Biens avec baisse de prix
Biens vendus DVF
Biens portefeuille
Biens suivis
Zones suivies
Agences concurrentes
```

---

## 4.19 Sources & fiabilité Tension

Sources :

```text
Annonces actives
Historique annonces
Annonces expirées
Baisses de prix
Dates de publication
Dates de retrait
DVF agrégé
DPE si lien avec tension énergétique
```

Affichage :

```text
Sources & fiabilité

Source principale : annonces agrégées
Source complémentaire : DVF
Période : 90 jours
Dernière mise à jour : aujourd’hui
Volume : 318 annonces actives
Confiance : moyenne
```

Raisons :

```text
✓ Volume annonces suffisant
✓ Historique disponible sur 12 mois
⚠ Données DVF non temps réel
⚠ Segment T4+ peu profond
```

---

## 4.20 Actions Tension

### Globales

```text
Créer une alerte tension
Ouvrir Radar
Voir annonces concernées
Exporter
Ajouter au rapport
Comparer zones
```

### Vers Biens

```text
Voir annonces actives
Voir annonces anciennes
Voir biens avec baisse de prix
Voir biens vendus DVF
Voir biens suivis dans cette zone
```

### Vers Prospection

```text
Ouvrir Radar sur cette zone
Créer signal de prospection
Créer action commerciale
Créer liste de biens à contacter
```

### Vers Estimation

```text
Ajouter bloc tension à l’avis de valeur
Ajouter argument délai de vente
Préparer argumentaire vendeur
Créer estimation rapide sur une annonce ancienne
```

### Vers Investissement

```text
Ouvrir opportunités sur cette zone
Filtrer les biens avec négociation probable
Identifier segments locatifs rapides
Ajouter au dossier investissement
```

### Vers Veille

```text
Créer alerte stock
Créer alerte délai
Créer alerte baisse de prix
Créer alerte annonce ancienne
Créer alerte tension locative
```

---

# 5. Section Contexte local

## 5.1 Rôle exact

**Contexte local** répond à :

```text
1. Quel est le profil socio-économique de la zone ?
2. Quel type d’acheteur ou locataire cette zone attire ?
3. Le cadre de vie est-il attractif ?
4. Quels services sont accessibles rapidement ?
5. Existe-t-il un potentiel futur : urbanisme, DPE, rénovation, mutation ?
6. Quelle action métier déclencher ?
```

Contexte local ne doit pas être une fiche INSEE brute.  
Il doit transformer les données locales en **arguments, profils cibles et décisions métier**.

---

## 5.2 Route

```text
/app/observatoire/contexte-local
```

Exemples :

```text
/app/observatoire/contexte-local?zone=paris-15
/app/observatoire/contexte-local?zone=lyon-7&tab=profil
/app/observatoire/contexte-local?zone=bordeaux-chartrons&tab=cadre-vie
/app/observatoire/contexte-local?zone=grenoble&tab=potentiel
/app/observatoire/contexte-local?zone=paris-15&adresse=16-rue-du-hameau
```

---

## 5.3 Structure avec 3 tabs

```text
Contexte local
├ Profil
├ Cadre de vie
└ Potentiel
```

### Profil

```text
Qui vit ici ?
Qui peut acheter ou louer ?
Quelle profondeur de demande ?
```

### Cadre de vie

```text
Est-ce agréable, pratique, désirable ?
Quels services sont proches ?
```

### Potentiel

```text
Qu’est-ce qui peut faire évoluer la valeur ou le risque ?
PLU, permis, DPE, rénovation, réglementation.
```

---

## 5.4 Header Contexte local

### Titre

```text
Contexte local
```

### Sous-titre

```text
Analysez le profil des habitants, le cadre de vie et le potentiel futur d’une zone.
```

### Actions header

```text
[Ajouter au rapport]
[Comparer une zone]
[Créer une alerte]
[Exporter]
```

Hiérarchie :

```text
Primaire : Ajouter au rapport
Secondaire : Comparer une zone
Secondaire : Créer une alerte
Ghost : Exporter
```

---

## 5.5 Barre de filtres

```text
[Zone : Lyon 7e ▾]
[Granularité : Quartier ▾]
[Persona : Investisseur ▾]
[Rayon : 15 min à pied ▾]
[Source : INSEE + BPE + OSM + PLU ▾]
```

### Zone

```text
Commune
Arrondissement
Quartier
IRIS
Adresse
Zone personnalisée
Zone suivie
```

### Granularité

```text
Commune
Arrondissement
Quartier
IRIS
Adresse / rayon
Zone personnalisée
```

Par défaut :

```text
Quartier ou IRIS si disponible
Commune sinon
```

### Persona

```text
Agent immobilier
Investisseur
Bailleur
Acquéreur occupant
Vendeur
```

Le persona change :

```text
les insights
les actions suggérées
les blocs mis en avant
le vocabulaire
```

### Rayon

```text
5 min à pied
10 min à pied
15 min à pied
500 m
1 km
2 km
Commune entière
```

---

# 5.6 Tab Profil

## Rôle

Répond à :

```text
Qui vit ici, qui peut acheter ou louer, et quelle profondeur de demande cela crée ?
```

---

## KPI visibles — 4 maximum

```text
Population / ménages
Revenu médian
Profil dominant
Part locataires
```

Exemple :

```text
Population        7 072 habitants
Revenu médian     2 088 €/mois
Profil dominant   Personnes seules
Locataires        75 %
```

Si contexte investissement / étude locative :

```text
Population        7 072 habitants
Revenu médian     2 088 €/mois
Profil dominant   Jeunes actifs
Profondeur        Forte
```

---

## Bloc À retenir — Profil

Exemple investisseur :

```text
À retenir

• Zone dominée par des personnes seules et jeunes actifs.
• Forte cohérence avec des T1/T2 meublés.
• Le revenu médian permet de soutenir un loyer autour de 850–1 050 € HC.
```

Exemple vendeur :

```text
À retenir

• La zone attire une demande de résidence principale et de primo-accédants.
• Les ménages locataires sont nombreux, ce qui alimente une demande d’achat potentielle.
• Les petites surfaces sont plus liquides que les grands logements.
```

---

## Bloc Profil socio-économique

Contenu précis :

```text
Population
Nombre de ménages
Revenu médian / mensuel
Âge médian
Répartition par âge
Catégories socio-professionnelles
Taux d’activité
Taux de chômage
Part étudiants
Ancienneté d’emménagement
```

Affichage :

```text
Carte synthèse + graphique simple
Pas de gros tableau INSEE brut
```

---

## Bloc Profil cible

Objectif :

```text
Identifier qui est le plus susceptible d’acheter ou louer dans la zone.
```

Profils possibles :

```text
Étudiant
Jeune actif
Couple sans enfant
Famille
Senior
Investisseur
Mixte
```

Structure :

```text
Profil dominant : Jeunes actifs
Profil secondaire : Étudiants
Typologie cohérente : T1 / T2
Profondeur : Forte
Niveau de confiance : Élevé
```

### Si contexte vente

```text
Budget compatible estimé
Revenu indicatif requis
Part de population compatible
```

### Si contexte location

```text
Loyer compatible estimé
Revenu indicatif requis
Part de population compatible
```

---

## Bloc Solvabilité / profondeur de marché

### Cas vente

```text
Prix cible : 272 000 €
Revenu indicatif requis : 4 150 €/mois
Part de ménages compatibles : 28 %
Profondeur : Correcte
```

### Cas location

```text
Loyer cible : 1 000 € HC
Revenu indicatif requis : 3 000 €/mois
Part de ménages compatibles : 34 %
Profondeur : Forte
```

Règles V1 :

```text
Achat :
prix + taux BDF + durée + apport + taux d’effort

Location :
loyer × 3 par défaut
```

---

## Bloc Structure logement

Contenu précis :

```text
Maisons
Appartements
HLM
Résidences principales
Résidences secondaires
Logements vacants
Propriétaires
Locataires
Nombre de pièces
Distribution des surfaces
Année de construction
Ancienneté d’emménagement
```

Affichage :

```text
1 mini synthèse
2 graphiques maximum
```

Exemple :

```text
Le secteur est majoritairement composé d’appartements et de petites surfaces.
Les T2 représentent le cœur du marché local.
```

---

## Actions Profil

```text
Ajouter le profil au rapport
Créer un profil locataire cible
Créer une alerte zone
Ouvrir Étude locative
Ouvrir Opportunités investissement
Comparer avec une autre zone
Préparer argumentaire vendeur
Préparer brief RDV bailleur
```

---

# 5.7 Tab Cadre de vie

## Rôle

Répond à :

```text
La zone est-elle agréable, pratique et désirable au quotidien ?
```

---

## KPI visibles — 4 maximum

```text
Score emplacement
Transports
Services essentiels
Écoles / santé
```

Exemple :

```text
Score emplacement      82/100 · B
Transports             91/100 · A
Services essentiels    88/100 · A
Écoles / santé          76/100 · B
```

---

## Bloc À retenir — Cadre de vie

Exemple :

```text
À retenir

• Zone très praticable à pied, avec services du quotidien à moins de 5 minutes.
• Bonne desserte transports, adaptée aux jeunes actifs et aux locataires sans voiture.
• Attractivité familiale correcte grâce aux écoles et équipements proches.
```

---

## Bloc Score emplacement

Contenu :

```text
Score global
Grade A/B/C/D/E
Forces majeures
Points de vigilance
Niveau de confiance
```

Forces possibles :

```text
Vie de quartier
Vie sans voiture
Besoins quotidiens
Pour les enfants
Pour les personnes âgées
Proche transports
Proche nature
Centre-ville
Cadre calme
Bâtiment fibré
Aucun quartier prioritaire
```

Vigilances :

```text
Faible desserte transports
Peu d’espaces verts
Peu d’écoles
Services santé limités
Nuisances potentielles
Forte dépendance voiture
```

---

## Bloc Accessibilité / isochrone

Contenu :

```text
Isochrone 5 min
Isochrone 10 min
Isochrone 15 min
Distance transports
Distance commerces essentiels
Distance santé
Distance écoles
```

Affichage :

```text
Carte avec isochrone
POI colorés par catégorie
Filtres rapides par catégorie
```

Catégories :

```text
Transports
Commerces
Santé
Éducation
Services
Culture
Sport
Espaces verts
```

---

## Bloc Transports

Éléments précis :

```text
Bus : distance arrêt le plus proche, nombre de lignes
Métro : distance station la plus proche, lignes
Tramway : distance station la plus proche, lignes
RER / Train : distance gare la plus proche
Temps d’accès centre-ville
Temps d’accès gare principale
Accessibilité sans voiture
```

Exemple :

```text
Métro Jean Macé · 320 m
Tram T2 · 180 m
Gare · 650 m
Score transports : A
```

---

## Bloc Commerces & services essentiels

Éléments précis :

```text
Boulangerie
Supermarché
Épicerie
Commerce de bouche
Pharmacie
Médecin généraliste
Bureau de poste
Banque
Coiffeur
Garage / services auto
```

Affichage :

```text
distance du plus proche
nombre à 5 min
nombre à 10 min
score catégorie
```

Exemple :

```text
Boulangerie : 120 m · 5 à 5 min
Pharmacie : 240 m · 3 à 5 min
Médecin généraliste : 400 m · 8 à 10 min
```

---

## Bloc Éducation

Éléments précis :

```text
Crèches
Maternelles
Écoles élémentaires
Collèges
Lycées
Enseignement supérieur
Effectifs si disponible
Public / privé si disponible
Distance
```

Utilité :

```text
argumentaire familles
profil locataire étudiant
attractivité quartier
```

---

## Bloc Vie de quartier

Éléments précis :

```text
Restaurants
Cafés
Bars
Commerces de proximité
Marchés
Culture
Sport
Parcs / espaces verts
Densité de POI
Ambiance : résidentielle / active / étudiante / familiale
```

Chips :

```text
Vie de quartier active
Centre-ville
Proche nature
Quartier étudiant
Quartier familial
```

---

## Points de vigilance Cadre de vie

V1 :

```text
QPV oui/non
Dépendance voiture
Faible offre santé
Faible offre scolaire
Peu d’espaces verts
```

V2 :

```text
Pollution
Bruit
Risques naturels
Sécurité perçue
Avis habitants
Score ESG / durabilité
```

---

## Actions Cadre de vie

```text
Ajouter au rapport
Générer argumentaire acquéreur
Générer argumentaire bailleur
Ouvrir biens dans cette zone
Créer alerte cadre de vie
Comparer avec autre zone
Ajouter au dossier investissement
```

---

# 5.8 Tab Potentiel

## Rôle

Répond à :

```text
Qu’est-ce qui peut faire évoluer la valeur ou le risque de cette zone dans le futur ?
```

Couvre :

```text
cadastre
PLU
autorisations urbanisme
permis proches
DPE / rénovation
mutation urbaine
réglementation
potentiel de transformation
```

---

## KPI visibles — 4 maximum

```text
Score potentiel
Permis récents
Part DPE F/G
Contraintes PLU
```

Exemple :

```text
Score potentiel       68/100
Permis récents        12 dans 500 m
DPE F/G               18 %
Contraintes PLU       À vérifier
```

Alternative adresse précise :

```text
Zonage PLU            UA
Permis proches        12
DPE F/G secteur       18 %
Transformabilité      Moyenne
```

---

## Bloc À retenir — Potentiel

Exemple :

```text
À retenir

• Zone en mutation modérée avec plusieurs permis récents à proximité.
• Potentiel de rénovation énergétique intéressant grâce à une poche DPE F/G.
• Contraintes PLU à vérifier avant toute hypothèse de transformation lourde.
```

---

## Bloc Synthèse potentiel Propsight

Contenu :

```text
Verdict
Synthèse courte
Forces
Vigilances
Horizon de valorisation estimé
Niveau de confiance
```

Verdicts :

```text
Potentiel favorable
Potentiel neutre
À surveiller
Potentiel contraint
Potentiel défavorable
```

Forces :

```text
Permis récents
Mutation urbaine
Poche rénovation DPE
Bonne liquidité future
Services en progression
PLU favorable
Demande locative soutenable
```

Vigilances :

```text
Contraintes PLU
ABF / patrimoine
Stationnement
Changement d’usage
Risque de vacance
Offre future concurrente
DPE dégradé
Zone réglementée
```

---

## Bloc Cadastre & parcelle

Éléments précis :

```text
Référence cadastrale
Surface parcelle
Surface bâtie
Surface libre
Nombre de bâtiments
Emprise au sol
Hauteur si disponible
Type de bâtiment si disponible
Contour parcellaire
```

Affichage :

```text
Carte parcelle + table compacte
```

Actions :

```text
Ouvrir fiche parcelle
Ajouter au rapport
Ouvrir Géoportail
Créer note urbanisme
```

---

## Bloc PLU & zonage

Éléments précis :

```text
Zone PLU
Document d’urbanisme applicable
Règles utiles
Hauteur autorisée si disponible
Emprise au sol si disponible
Destination autorisée
Servitudes connues
Contraintes patrimoniales
ABF / monuments historiques si disponible
Zone tendue / réglementations location
```

Affichage :

```text
Carte PLU
Chip zonage
Lecture simplifiée
Lien document officiel
```

Lecture simplifiée :

```text
Ce qu’on peut raisonnablement envisager :
- rénovation légère
- amélioration DPE
- reconfiguration intérieure
- division à vérifier
- surélévation non prioritaire
```

---

## Bloc Autorisations urbanisme

Éléments précis :

```text
Permis de construire
Déclarations préalables
Permis d’aménager
Permis de démolir
Date de dépôt
Statut
Nature du projet
Nombre de logements créés
Distance
Début chantier si disponible
```

Table :

```text
Type      Statut       Année   Projet              Distance
PC        Autorisé     2024    12 logements        180 m
DP        Déposé       2025    Ravalement          95 m
PD        Autorisé     2023    Démolition part.    420 m
```

Lecture métier :

```text
Soutien de valeur
Concurrence future
Nuisance temporaire
Mutation du quartier
```

---

## Bloc DPE / rénovation

Éléments précis :

```text
Répartition DPE secteur
Part DPE F/G
Part DPE E/F/G
Évolution des DPE récents
Biens à rénover
Potentiel de revalorisation
Contraintes de louabilité
Passoires thermiques
```

Actions :

```text
Ouvrir Signaux DPE
Créer alerte DPE
Ouvrir Prospection DPE
Ajouter au dossier investissement
```

---

## Bloc Réglementations locales

Éléments possibles :

```text
Zone tendue
Encadrement des loyers
Permis de louer
Changement d’usage
Meublé touristique
Logement décent
DPE minimum
Pinel / zonage historique si besoin
Contraintes copropriété si connues
```

Affichage :

```text
Réglementation          Statut       Impact
Zone tendue             Oui          Loyer encadré
Permis de louer          Oui          Vérification nécessaire
Encadrement loyers       Oui          Plafond à respecter
DPE location             OK           Pas de blocage immédiat
```

---

## Bloc Transformabilité

Éléments précis :

```text
Rénovation légère
Amélioration DPE
Reconfiguration intérieure
Meublé
Colocation
Division intérieure
Extension
Surélévation
Changement de destination
Optimisation surface
Création de surface potentielle
```

Niveaux :

```text
Simple
À vérifier
Contraint
Non recommandé
```

Exemple :

```text
Rénovation légère : simple
Amélioration DPE : pertinente
Division intérieure : à vérifier
Surélévation : contrainte
Changement d’usage : vigilance
```

---

## Actions Potentiel

```text
Ajouter au dossier investissement
Créer alerte urbanisme
Créer alerte DPE
Ouvrir Signaux DPE
Ouvrir Signaux DVF
Ouvrir PLU
Ouvrir Prospection
Créer action de vérification urbanisme
Ajouter au rapport
Comparer potentiel avec autre zone
```

---

# 5.9 Carte Contexte local

La carte change selon le tab.

## Profil

Couches :

```text
IRIS / quartier
densité population
revenu médian
part locataires
part étudiants
part familles
ménages compatibles
```

## Cadre de vie

Couches :

```text
isochrone 5 / 10 / 15 min
transports
écoles
commerces
santé
services
espaces verts
culture / sport
```

## Potentiel

Couches :

```text
cadastre
PLU
permis
DPE F/G
projets urbains
zones réglementées
biens à potentiel rénovation
```

Contrôles :

```text
[Couche principale ▾]
[Rayon / isochrone ▾]
[Fond carte ▾]
[Légende]
```

Fonds :

```text
Plan clair
Satellite
Cadastre
PLU
Sans fond
```

---

# 6. Drawers

## 6.1 Drawer Zone générique

Déclencheurs :

```text
clic sur zone carte
clic sur IRIS
clic sur quartier
clic sur ligne de table
clic sur signal
clic sur permis
clic sur POI
```

Structure :

```text
Header
Nom de la zone
Type · localisation

Key info
Prix médian / tension / profil / potentiel selon contexte

À retenir
2 ou 3 lignes actionnables

Actions rapides
[Voir marché]
[Voir tension]
[Voir contexte local]
[Comparer]
[Créer alerte]
[Ajouter au rapport]
[Voir biens]
[Ouvrir opportunités]

Liens modules
ventes DVF
annonces actives
biens portefeuille
biens suivis
opportunités
leads liés
alertes actives

Timeline
événements récents liés à la zone

Propsight IA
insight compact et actionnable
```

---

## 6.2 Drawer depuis Marché

Contenu spécifique :

```text
Prix médian
Évolution 12m
Volume DVF
Écart annonces / DVF
Segments principaux
Comparables
Sources & confiance
```

---

## 6.3 Drawer depuis Tension

Contenu spécifique :

```text
Score tension
Délai médian
Stock actif
Baisses de prix / révisions loyers
Annonces anciennes
Signaux actionnables
```

---

## 6.4 Drawer depuis Contexte local

Contenu spécifique :

```text
Profil dominant
Revenu médian
Score emplacement
Services proches
Potentiel PLU
DPE / rénovation
Réglementations
```

---

# 7. Drawer IA Observatoire

Pas de gros bloc IA dans le body.

## Marché

Prompts :

```text
Résume ce marché en 5 lignes
Prépare un argumentaire vendeur
Compare cette zone avec une autre
Explique l’évolution des prix
Trouve les segments les plus liquides
Crée une alerte pertinente
Ajoute ce bloc au rapport d’avis de valeur
```

## Tension

Prompts :

```text
Résume la tension de cette zone
Quels segments ralentissent ?
Quels biens dois-je prospecter ?
Prépare un argumentaire vendeur
Crée une alerte pertinente
Explique pourquoi les délais s’allongent
Identifie les annonces anciennes intéressantes
Ajoute ce bloc au rapport
```

## Contexte local — Profil

```text
Résume le profil des habitants
Quel profil locataire domine ?
Quel revenu est nécessaire pour louer ici ?
Cette zone est-elle cohérente pour un T2 ?
Prépare un argumentaire investisseur
```

## Contexte local — Cadre de vie

```text
Résume le cadre de vie
Quels arguments mettre dans un avis de valeur ?
Cette zone est-elle adaptée aux familles ?
Cette zone est-elle adaptée aux étudiants ?
Quels points de vigilance mentionner ?
```

## Contexte local — Potentiel

```text
Résume le potentiel urbain
Quels risques PLU dois-je vérifier ?
Y a-t-il un potentiel rénovation ?
Prépare une alerte urbanisme
Ajoute ce bloc au dossier investissement
```

---

# 8. Liens transverses avec les autres modules

## 8.1 Avec Biens immobiliers

Depuis Observatoire :

```text
Voir biens vendus DVF filtrés sur la zone
Voir annonces actives filtrées
Voir biens portefeuille
Voir biens suivis
Ouvrir fiche bien
Comparer un bien à la distribution marché
```

Depuis une fiche bien :

```text
Voir contexte marché
Voir tension de zone
Voir contexte local
Ajouter bloc au rapport
Créer alerte zone
```

---

## 8.2 Avec Estimation

Observatoire nourrit directement :

```text
Avis de valeur
Estimation rapide enrichie
Étude locative
Rapports PDF éditables
```

Blocs réutilisables :

```text
Prix de marché
Évolution prix
Fourchette bas / médian / haut
Distribution
Comparables vendus
Tension vente
Délais de vente
Baisses de prix
Profil socio-économique
Profil acquéreur / locataire
Solvabilité
Score emplacement
Services de proximité
Réglementations
```

CTA :

```text
Ajouter au rapport
Créer avis de valeur
Préparer argumentaire vendeur
Préparer brief RDV
```

---

## 8.3 Avec Étude locative

Blocs réutilisables :

```text
Loyer de marché
Fourchette loyers
Évolution loyers
Comparables loués / à louer
Tension locative
Délais de location
Profil locataire
Revenu nécessaire
Solvabilité locative
Encadrement loyers
Permis de louer
Logement décent / DPE
Cadre de vie locatif
```

---

## 8.4 Avec Investissement

Observatoire nourrit :

```text
Opportunités
Analyse d’un bien
Dossiers investissement
Comparatif villes
Onglet Ville / Marché
Onglet Profil locataire
Onglet PLU / Potentiel
```

Blocs réutilisables :

```text
Prix
Loyer
Rendement
Tension locative
Profondeur demande
Profil cible
Cadre de vie
PLU
DPE
Réglementations
Transformabilité
```

---

## 8.5 Avec Prospection

Observatoire nourrit :

```text
Radar
Signaux DVF
Signaux DPE
Actions commerciales
```

Signaux créés depuis Observatoire :

```text
annonces anciennes
baisses de prix
écart annonce / DVF
stock en hausse
zone sous-offreuse
poche DPE F/G
permis / mutation quartier
segment en ralentissement
```

Important :

```text
Observatoire peut créer une action ou pousser vers Radar.
Il ne crée pas un pipeline commercial parallèle.
Le pipeline reste dans Mon activité > Leads.
```

---

## 8.6 Avec Veille

Observatoire crée :

```text
alerte prix
alerte volume
alerte rendement
alerte tension
alerte délai
alerte baisse de prix
alerte annonce ancienne
alerte urbanisme
alerte permis
alerte DPE
alerte réglementation
alerte zone suivie
```

Les zones suivies et alertes sont centralisées dans :

```text
Veille > Mes alertes
Veille > Notifications
Veille > Biens suivis
```

---

## 8.7 Avec Performance

Observatoire alimente :

```text
marché adressable
volume transactions
panier moyen
commission potentielle
part de marché captée
écart au potentiel
zones prioritaires
```

---

# 9. Rapports éditables PDF

## 9.1 Principe important

L’Observatoire doit nourrir les rapports éditables.

Le rapport PDF est une sortie.  
La source de vérité reste la donnée Observatoire.

```text
Observatoire
→ blocs réutilisables
→ rapport éditable
→ export PDF
```

---

## 9.2 Blocs rapport générés depuis Observatoire

### Marché

```text
Bloc prix du marché
Bloc loyers du marché
Bloc rendement du marché
Bloc évolution prix / loyers
Bloc fourchette bas / médian / haut
Bloc distribution
Bloc comparables
Bloc zones voisines
Bloc sources & fiabilité
```

### Tension

```text
Bloc tension vente
Bloc tension locative
Bloc délais vente / location
Bloc stock actif
Bloc baisses de prix
Bloc révisions de loyers
Bloc annonces anciennes
Bloc signaux tension
Bloc sources & fiabilité
```

### Contexte local — Profil

```text
Bloc profil socio-économique
Bloc profil cible
Bloc solvabilité
Bloc profondeur de demande
Bloc structure logement
Bloc sources & fiabilité
```

### Contexte local — Cadre de vie

```text
Bloc score emplacement
Bloc transports
Bloc services essentiels
Bloc éducation
Bloc vie de quartier
Bloc isochrone
Bloc points de vigilance
```

### Contexte local — Potentiel

```text
Bloc synthèse potentiel
Bloc cadastre / parcelle
Bloc PLU / zonage
Bloc permis / autorisations urbanisme
Bloc DPE / rénovation
Bloc réglementations locales
Bloc transformabilité
```

---

## 9.3 Actions d’ajout au rapport

Chaque bloc important doit proposer :

```text
[Ajouter au rapport]
```

Ou menu :

```text
Ajouter à :
- Avis de valeur
- Étude locative
- Dossier investissement
- Brief RDV
```

---

## 9.4 Blocs éditables

Une fois ajouté au rapport :

```text
Le graphique est figé ou actualisable
Le texte expert est éditable
Les sources restent visibles
La date de calcul est conservée
Le niveau de confiance est affiché
```

---

# 10. États vides globaux

## Donnée insuffisante

```text
Aucune donnée suffisante sur cette zone avec ces filtres.
```

Actions :

```text
[Élargir à la commune]
[Passer sur 24 mois]
[Retirer le filtre]
[Réinitialiser]
```

## Volume faible

```text
Volume faible sur ce segment.
Les indicateurs doivent être interprétés avec prudence.
```

Badge :

```text
Confiance faible
```

## Source indisponible

```text
Cette source n’est pas disponible sur la zone.
Les autres indicateurs restent affichés.
```

## PLU indisponible

```text
Le PLU n’est pas disponible automatiquement pour cette zone.
Vous pouvez ouvrir le document officiel ou ajouter une note manuelle.
```

Actions :

```text
[Ouvrir Géoportail urbanisme]
[Ajouter note urbanisme]
[Masquer le bloc]
```

---

# 11. Modèles de données

## 11.1 Zone

```ts
type ZoneType =
  | 'commune'
  | 'arrondissement'
  | 'quartier'
  | 'iris'
  | 'adresse'
  | 'zone_custom'
  | 'zone_suivie';

type ZoneRef = {
  zone_id: string;
  label: string;
  type: ZoneType;
  parent_label?: string;
  code_insee?: string;
  code_postal?: string;
  iris_code?: string;
  centroid?: {
    lat: number;
    lon: number;
  };
  geometry_available: boolean;
};
```

---

## 11.2 Marché

```ts
type MarketMode = 'vente' | 'location' | 'rendement';

type MarketQuery = {
  zone_id: string;
  mode: MarketMode;
  property_type: 'all' | 'appartement' | 'maison';
  segment?: 'studio_t1' | 't2' | 't3' | 't4_plus' | 'custom';
  surface_min?: number;
  surface_max?: number;
  period: '6m' | '12m' | '24m' | '5y' | '10y';
  source: 'dvf' | 'annonces' | 'mixed';
};

type MarketKpi = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  helper: string;
  confidence?: ConfidenceLevel;
};

type MarketRange = {
  low: number;
  median: number;
  high: number;
  unit: 'eur_m2' | 'eur_m2_hc' | 'percent';
  source: string;
  period_label: string;
};

type MarketTimeSeriesPoint = {
  period: string;
  median: number;
  low?: number;
  high?: number;
  volume?: number;
};

type MarketSegmentRow = {
  segment_id: string;
  label: string;
  median_value: number;
  volume: number;
  evolution_12m_pct?: number;
  confidence: ConfidenceLevel;
};

type MarketComparable = {
  comparable_id: string;
  status:
    | 'vendu'
    | 'en_vente'
    | 'invendu'
    | 'a_louer'
    | 'loue'
    | 'expire';
  address_label: string;
  distance_m?: number;
  surface_m2: number;
  rooms?: number;
  price?: number;
  rent_hc?: number;
  value_per_m2: number;
  date: string;
  source: string;
  photo_url?: string;
  tags?: string[];
};
```

---

## 11.3 Tension

```ts
type TensionMode = 'vente' | 'location';

type TensionQuery = {
  zone_id: string;
  mode: TensionMode;
  property_type: 'all' | 'appartement' | 'maison';
  segment?: 'studio_t1' | 't2' | 't3' | 't4_plus' | 'custom';
  surface_min?: number;
  surface_max?: number;
  period: '30d' | '90d' | '6m' | '12m';
  source: 'annonces' | 'dvf' | 'mixed';
};

type TensionScore = {
  value: number;
  label:
    | 'tres_ralenti'
    | 'ralenti'
    | 'equilibre'
    | 'dynamique'
    | 'tres_dynamique';
  explanation: string;
  components: TensionScoreComponent[];
};

type TensionScoreComponent = {
  id: string;
  label: string;
  value: number;
  direction: 'ralentit' | 'soutient' | 'neutre';
  detail: string;
};

type TensionDelayStats = {
  fast_days: number;
  median_days: number;
  slow_days: number;
  period_label: string;
};

type TensionStockStats = {
  active_count: number;
  evolution_pct: number;
  by_segment: {
    segment_id: string;
    label: string;
    count: number;
    evolution_pct?: number;
  }[];
};

type PriceRevisionStats = {
  revision_rate_pct: number;
  median_revision_pct: number;
  median_days_before_revision?: number;
  by_segment: {
    segment_id: string;
    label: string;
    revision_rate_pct: number;
    median_revision_pct: number;
  }[];
};

type TensionSignal = {
  id: string;
  type:
    | 'annonce_ancienne'
    | 'baisse_prix'
    | 'loyer_revise'
    | 'stock_hausse'
    | 'stock_faible'
    | 'delai_long'
    | 'segment_tendu'
    | 'negociation_probable';
  label: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  linked_object?: {
    object_type: 'annonce' | 'zone' | 'segment' | 'bien';
    object_id: string;
  };
  suggested_actions: {
    label: string;
    action_type:
      | 'open_annonce'
      | 'open_radar'
      | 'create_alert'
      | 'create_action'
      | 'add_to_report';
  }[];
};
```

---

## 11.4 Contexte local

```ts
type LocalContextTab = 'profil' | 'cadre_vie' | 'potentiel';

type LocalContextQuery = {
  zone_id: string;
  tab: LocalContextTab;
  granularity: 'commune' | 'arrondissement' | 'quartier' | 'iris' | 'adresse' | 'custom_zone';
  persona: 'agent' | 'investisseur' | 'bailleur' | 'acquereur' | 'vendeur';
  radius?: '5min_walk' | '10min_walk' | '15min_walk' | '500m' | '1km' | '2km';
  address_id?: string;
};

type LocalContextKpi = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  helper: string;
  status?: 'positive' | 'neutral' | 'warning' | 'critical';
};

type LocalProfile = {
  population: number;
  households: number;
  median_income_monthly: number;
  median_age?: number;
  tenant_share_pct: number;
  owner_share_pct: number;
  dominant_household_profile:
    | 'personne_seule'
    | 'couple'
    | 'famille'
    | 'monoparental'
    | 'senior'
    | 'mixte';
  dominant_target_profile:
    | 'etudiant'
    | 'jeune_actif'
    | 'couple_sans_enfant'
    | 'famille'
    | 'senior'
    | 'mixte';
  demand_depth: 'forte' | 'correcte' | 'etroite';
  required_income_monthly?: number;
  eligible_population_share_pct?: number;
};

type LifestyleScore = {
  global_score: number;
  global_grade: 'A' | 'B' | 'C' | 'D' | 'E';
  dimensions: {
    transports: ScoreDimension;
    commerces: ScoreDimension;
    sante: ScoreDimension;
    education: ScoreDimension;
    services: ScoreDimension;
    vie_quartier: ScoreDimension;
  };
  strengths: string[];
  warnings: string[];
};

type ScoreDimension = {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  nearest_distance_m?: number;
  count_5min?: number;
  count_10min?: number;
};

type UrbanPotential = {
  score: number;
  verdict: 'favorable' | 'neutre' | 'a_surveiller' | 'contraint' | 'defavorable';
  plu_zone?: string;
  permits_count_500m?: number;
  dpe_f_g_share_pct?: number;
  constraints: string[];
  opportunities: string[];
  transformation_potential:
    | 'simple'
    | 'a_verifier'
    | 'contraint'
    | 'non_recommande';
};
```

---

## 11.5 Confiance commune

```ts
type ConfidenceLevel = 'faible' | 'moyenne' | 'forte' | 'tres_forte';

type ConfidenceReason = {
  label: string;
  status: 'positive' | 'neutral' | 'warning';
  detail: string;
};

type Confidence = {
  level: ConfidenceLevel;
  score: number;
  reasons: ConfidenceReason[];
};
```

---

# 12. Endpoints V1

## 12.1 Marché

```ts
GET /api/observatoire/marche/summary
GET /api/observatoire/marche/range
GET /api/observatoire/marche/timeseries
GET /api/observatoire/marche/segments
GET /api/observatoire/marche/distribution
GET /api/observatoire/marche/comparables
GET /api/observatoire/marche/zones-voisines
GET /api/observatoire/marche/map
```

---

## 12.2 Tension

```ts
GET /api/observatoire/tension/summary
GET /api/observatoire/tension/score
GET /api/observatoire/tension/delays
GET /api/observatoire/tension/stock
GET /api/observatoire/tension/revisions
GET /api/observatoire/tension/segments
GET /api/observatoire/tension/signals
GET /api/observatoire/tension/zones-voisines
GET /api/observatoire/tension/map
```

---

## 12.3 Contexte local

```ts
GET /api/observatoire/contexte-local/summary
GET /api/observatoire/contexte-local/profil
GET /api/observatoire/contexte-local/cadre-vie
GET /api/observatoire/contexte-local/potentiel
GET /api/observatoire/contexte-local/map
GET /api/observatoire/contexte-local/poi
GET /api/observatoire/contexte-local/isochrone
GET /api/observatoire/contexte-local/cadastre
GET /api/observatoire/contexte-local/plu
GET /api/observatoire/contexte-local/permis
GET /api/observatoire/contexte-local/dpe
```

---

# 13. Composants à créer

## 13.1 Composants Observatoire communs

```text
/src/components/observatoire/
├ ObservatoirePageShell.tsx
├ ObservatoireSplitView.tsx
├ ZoneHeader.tsx
├ ZoneSelector.tsx
├ ZoneKpiStrip.tsx
├ InsightStrip.tsx
├ SourceConfidenceBlock.tsx
├ DrawerZone.tsx
├ AddToReportButton.tsx
├ CreateAlertButton.tsx
└ ObservatoireMapShell.tsx
```

---

## 13.2 Marché

```text
/src/components/observatoire/marche/
├ MarchePage.tsx
├ MarcheHeader.tsx
├ MarcheFilters.tsx
├ MarketKpiStrip.tsx
├ MarketInsightStrip.tsx
├ MarketMap.tsx
├ MarketLayerControl.tsx
├ MarketRangeBlock.tsx
├ MarketEvolutionChart.tsx
├ MarketSegmentsTable.tsx
├ MarketDistributionBlock.tsx
├ MarketComparablesPreview.tsx
├ NeighborZonesTable.tsx
├ MarketSourcesConfidence.tsx
├ CreateMarketAlertButton.tsx
├ AddMarketBlockToReportButton.tsx
└ useMarcheQuery.ts
```

---

## 13.3 Tension

```text
/src/components/observatoire/tension/
├ TensionPage.tsx
├ TensionHeader.tsx
├ TensionFilters.tsx
├ TensionKpiStrip.tsx
├ TensionInsightStrip.tsx
├ TensionMap.tsx
├ TensionLayerControl.tsx
├ TensionScoreBlock.tsx
├ TensionScoreBreakdown.tsx
├ TensionDelayBlock.tsx
├ TensionStockBlock.tsx
├ PriceRevisionBlock.tsx
├ OldListingsBlock.tsx
├ TensionSegmentsTable.tsx
├ TensionSignalsList.tsx
├ NeighborTensionZonesTable.tsx
├ TensionSourcesConfidence.tsx
├ CreateTensionAlertButton.tsx
├ AddTensionBlockToReportButton.tsx
└ useTensionQuery.ts
```

---

## 13.4 Contexte local

```text
/src/components/observatoire/contexte-local/
├ ContexteLocalPage.tsx
├ ContexteLocalHeader.tsx
├ ContexteLocalFilters.tsx
├ LocalContextTabs.tsx
├ LocalKpiStrip.tsx
├ LocalInsightStrip.tsx
├ LocalContextMap.tsx
├ LocalMapLayerControl.tsx

├ ProfilTab.tsx
├ SocioEconomicBlock.tsx
├ TargetProfileBlock.tsx
├ SolvabilityDepthBlock.tsx
├ HousingStructureBlock.tsx

├ CadreVieTab.tsx
├ LocationScoreBlock.tsx
├ IsochroneAccessBlock.tsx
├ TransportBlock.tsx
├ EssentialServicesBlock.tsx
├ EducationBlock.tsx
├ NeighborhoodLifeBlock.tsx
├ LifestyleWarningsBlock.tsx

├ PotentielTab.tsx
├ PotentialSummaryBlock.tsx
├ CadastreParcelBlock.tsx
├ PluZoningBlock.tsx
├ UrbanPermitsBlock.tsx
├ DpeRenovationBlock.tsx
├ LocalRegulationsBlock.tsx
├ TransformabilityBlock.tsx

├ LocalSourcesConfidence.tsx
├ AddLocalContextToReportButton.tsx
├ CreateLocalAlertButton.tsx
└ useLocalContextQuery.ts
```

---

## 13.5 Composants partagés

```text
/src/components/shared/
├ ConfidenceBadge.tsx
├ SourceBadge.tsx
├ EmptyState.tsx
├ ModuleLinkButton.tsx
├ PeriodSelector.tsx
├ SegmentSelector.tsx
├ GranularitySelector.tsx
├ PersonaSelector.tsx
├ RadiusSelector.tsx
├ AiDrawer.tsx
└ MapLayerControl.tsx
```

---

# 14. Données nécessaires

## 14.1 Marché

```text
DVF agrégé
prix/m² par zone
prix bas / médian / haut
volume DVF
évolution prix
annonces actives
prix affichés annonces
loyers annonces
rendement brut
géométrie zones
BAN / géocodage
IRIS / commune / arrondissement
comparables vendus
comparables en vente
comparables invendus
comparables loués / à louer
durée de publication
baisses de prix
loyers HC / CC
meublé / non meublé
```

---

## 14.2 Tension

```text
annonces actives
date de publication
prix actuel
prix initial
historique de baisse de prix
type de bien
surface
pièces
localisation
source annonce
stock par zone
stock par segment
historique stock
date de retrait annonce
durée de diffusion
annonces expirées
remises en ligne
historique loyer
révisions de loyer
meublé / vide
vacance locative estimée
écart affiché / réalisé
DVF agrégé
```

---

## 14.3 Contexte local — Profil

```text
population
nombre de ménages
revenu médian
distribution revenus si disponible
âge médian
répartition par âge
CSP
taux activité
taux chômage
part étudiants
personnes seules
couples
familles
monoparentalité
propriétaires
locataires
résidences principales
résidences secondaires
logements vacants
typologies logements
distribution surfaces
nombre de pièces
ancienneté emménagement
```

---

## 14.4 Contexte local — Cadre de vie

```text
transports
arrêts bus
métro
tramway
train / RER
commerces alimentaires
boulangeries
supermarchés
épiceries
pharmacies
médecins
hôpitaux
crèches
maternelles
écoles élémentaires
collèges
lycées
services publics
banques
postes
espaces verts
restaurants
cafés
culture
sport
isochrone 5/10/15 min
score par catégorie
score global emplacement
```

---

## 14.5 Contexte local — Potentiel

```text
cadastre
parcelle
surface parcelle
emprise au sol
surface bâtie
surface libre
PLU
zonage
servitudes si disponibles
permis de construire
déclarations préalables
permis de démolir
permis d’aménager
projets urbains si disponibles
DPE secteur
part DPE F/G
zone tendue
encadrement loyers
permis de louer
réglementations locales
```

---

# 15. Sources de données

```text
DVF
Annonces agrégées
DPE / ADEME
INSEE
INSEE Filosofi
IRIS
BPE
OpenStreetMap
BAN
Cadastre
PLU / Géoportail urbanisme
Sitadel / autorisations urbanisme
SIRENE si besoin économique local
```

---

# 16. Version V1 réaliste

## 16.1 Marché V1

```text
Split view carte + panneau
Zone selector
Mode Vente / Location / Rendement
Filtres Type, Segment, Période
4 KPI maximum
À retenir
Carte avec couche prix / loyer / rendement
Fourchette bas / médian / haut
Courbe évolution
Segments
Distribution simple
Comparables preview
Zones voisines
Actions : comparer, alerte, ajouter au rapport, voir DVF / annonces
Drawer Zone
```

---

## 16.2 Tension V1

```text
Split view carte + panneau
Zone selector
Mode Vente / Location
Filtres Type, Segment, Période
4 KPI maximum
À retenir
Carte tension
Tensiomètre
Délais
Stock
Baisses de prix / Révisions de loyers
Annonces anciennes
Segments sous tension
Signaux actionnables
Actions : alerte, Radar, annonces, rapport
Drawer Zone / Signal
```

---

## 16.3 Contexte local V1

```text
Split view carte + panneau
Zone selector
Tabs : Profil / Cadre de vie / Potentiel
Filtres : granularité, persona, rayon
4 KPI maximum par tab
À retenir
Carte qui change selon le tab
Profil : socio-éco + profil cible + solvabilité + structure logement
Cadre de vie : score emplacement + isochrone + transports + services + écoles
Potentiel : synthèse + cadastre + PLU + permis + DPE + réglementations
Actions : ajouter rapport, alerte, comparer, ouvrir investissement/prospection
Drawer Zone
```

---

# 17. À ne pas faire en V1

```text
Pas de 15 KPI
Pas de dashboard rempli de graphiques
Pas de gros bloc IA dans le body
Pas de personnalisation d’indicateurs dans Observatoire
Pas de pipeline commercial parallèle
Pas de données INSEE brutes affichées sans interprétation
Pas de PLU ultra-détaillé si non disponible
Pas de carte bâtiment ultra-fine si la donnée n’est pas fiable
Pas de score opaque sans explication
Pas de prédiction ML avancée non justifiée
```

---

# 18. Phrases produit finales

## Observatoire

> Observatoire transforme une zone en décision : estimer, prospecter, investir, suivre ou argumenter.

## Marché

> Marché transforme les prix, loyers et rendements d’une zone en lecture claire, comparable et directement réutilisable dans les décisions métier.

## Tension

> Tension transforme le stock, les délais et les révisions de prix en signaux d’action commerciale.

## Contexte local

> Contexte local transforme les données socio-économiques, de cadre de vie et d’urbanisme en arguments, profils cibles et décisions métier.

---

# 19. Résumé final de structure

```text
Observatoire

├ Marché
│  ├ Mode Vente
│  ├ Mode Location
│  ├ Mode Rendement
│  ├ 4 KPI
│  ├ À retenir
│  ├ Carte
│  ├ Fourchette
│  ├ Évolution
│  ├ Segments
│  ├ Distribution
│  ├ Comparables
│  └ Zones voisines

├ Tension
│  ├ Mode Vente
│  ├ Mode Location
│  ├ 4 KPI
│  ├ À retenir
│  ├ Carte tension
│  ├ Tensiomètre
│  ├ Délais
│  ├ Stock
│  ├ Baisses / révisions
│  ├ Annonces anciennes
│  ├ Segments sous tension
│  └ Signaux actionnables

└ Contexte local
   ├ Profil
   │  ├ 4 KPI
   │  ├ À retenir
   │  ├ Profil socio-éco
   │  ├ Profil cible
   │  ├ Solvabilité
   │  └ Structure logement
   │
   ├ Cadre de vie
   │  ├ 4 KPI
   │  ├ À retenir
   │  ├ Score emplacement
   │  ├ Isochrone
   │  ├ Transports
   │  ├ Services essentiels
   │  ├ Éducation
   │  └ Vie de quartier
   │
   └ Potentiel
      ├ 4 KPI
      ├ À retenir
      ├ Synthèse potentiel
      ├ Cadastre
      ├ PLU
      ├ Permis / urbanisme
      ├ DPE / rénovation
      ├ Réglementations
      └ Transformabilité
```

---

# 20. Instruction Claude Code

Générer des maquettes desktop-first pour les trois routes Observatoire.

Priorités :

```text
1. Respecter la sidebar Pro existante.
2. Respecter le Header Pro existant.
3. Utiliser un layout split view : panneau gauche + carte droite.
4. Garder 4 KPI maximum par écran/tab.
5. Ajouter un bloc “À retenir” avec 3 insights maximum.
6. Ajouter des actions transverses vers Estimation, Investissement, Prospection, Veille, Biens.
7. Prévoir le bouton “Ajouter au rapport” sur les blocs importants.
8. Ne pas créer de gros bloc IA dans le body.
9. Prévoir Drawer Zone et Drawer IA.
10. Prévoir des états vides et des badges de confiance.
```

Le rendu doit être :

```text
compact
premium
clair
data-driven
actionnable
non-siloté
cohérent avec Propsight
```
