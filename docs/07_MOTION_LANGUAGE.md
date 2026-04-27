# Propsight — Motion Language

**Version :** V1
**Statut :** Règles d'animation pour toutes les surfaces Propsight (public et Pro)
**Librairie :** `motion/react` (anciennement Framer Motion)
**Inspiration :** Linear, Attio, Vercel — animations utilitaires, jamais décoratives

---

## 0. Philosophie

> L'animation sert à **rendre une transition lisible**, jamais à attirer l'attention.
> Si une animation est notée par l'utilisateur, elle est trop présente.

Propsight est un SaaS immobilier premium. Les animations doivent :

- **Accompagner** une action (feedback de clic, apparition d'un drawer, révélation d'une section)
- **Réduire la charge cognitive** (un élément qui apparaît doucement est moins agressif qu'un saut brusque)
- **Respecter l'accessibilité** (support total de `prefers-reduced-motion`)

Les animations ne doivent **jamais** :

- Servir à impressionner (parallax, morphing, 3D, gradients animés)
- Retarder l'accès à une information utile
- Consommer plus de 60ms de wait inutile
- Se déclencher sur scroll pour du contenu déjà attendu

---

## 1. Tokens d'animation

### 1.1 Durées

```css
--motion-duration-instant:  0ms     /* feedback immédiat, ex: changement de state */
--motion-duration-fast:     150ms   /* hover, focus, boutons */
--motion-duration-base:     220ms   /* valeur par défaut, la plupart des cas */
--motion-duration-slow:     320ms   /* drawers, modales, sections landing */
--motion-duration-slower:   480ms   /* rares cas, hero reveals en landing */
```

**Règle :** jamais au-dessus de 500ms. Une animation qui doit durer plus longtemps est un bug UX déguisé.

### 1.2 Easings

Un seul easing par défaut. Pas de cubic-bezier exotique par composant.

```ts
// /src/lib/motion/easings.ts

export const easings = {
  // Défaut — ease-out-expo soft, très Linear
  default: [0.22, 1, 0.36, 1],

  // Entrée vive (drawer qui arrive, modale)
  enter: [0.16, 1, 0.3, 1],

  // Sortie rapide (fermeture)
  exit: [0.7, 0, 0.84, 0],

  // Linéaire (progress bars, loaders)
  linear: [0, 0, 1, 1],
} as const
```

**Règle :** 95% des animations utilisent `easings.default`. `easings.enter` et `easings.exit` sont réservées aux overlays.

### 1.3 Stagger

Délai entre enfants d'une liste ou grille animée.

```ts
export const staggerChildren = {
  tight: 0.04,   // 40ms — listes denses (kanban cards, table rows)
  base: 0.06,   // 60ms — cards de features, grilles de modules
  loose: 0.08,  // 80ms — rares, pour hero sections avec peu d'éléments
}
```

**Règle :** jamais au-dessus de 80ms. Un stagger trop lent donne l'impression que la page met du temps à charger.

### 1.4 Distances

```ts
export const distances = {
  xs: 4,    // micro-feedback
  sm: 8,    // slide-up discret
  md: 12,   // valeur par défaut pour reveals
  lg: 20,   // drawers, modales
}
```

**Règle :** jamais au-dessus de 24px pour un reveal. Une distance trop grande transforme le reveal en animation d'entrée ostentatoire.

---

## 2. Patterns autorisés

### 2.1 Scroll reveal (sections landing)

Utiliser `whileInView` avec `once: true`. Un élément ne se rejoue jamais au scroll retour.

```tsx
import { motion } from "motion/react"
import { easings, distances } from "@/lib/motion"

<motion.div
  initial={{ opacity: 0, y: distances.md }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-10% 0px" }}
  transition={{ duration: 0.32, ease: easings.default }}
>
  {children}
</motion.div>
```

**Règle :** `margin: "-10% 0px"` déclenche l'animation quand l'élément est clairement visible, pas dès le seuil de viewport.

### 2.2 Stagger d'une grille

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06, delayChildren: 0.05 }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1, y: 0,
          transition: { duration: 0.28, ease: easings.default }
        }
      }}
    >
      <Card {...item} />
    </motion.div>
  ))}
</motion.div>
```

### 2.3 Drawer (EntityDrawer, AIDrawer)

```tsx
import { AnimatePresence, motion } from "motion/react"

<AnimatePresence>
  {open && (
    <motion.aside
      initial={{ x: 440 }}
      animate={{ x: 0 }}
      exit={{ x: 440 }}
      transition={{ duration: 0.28, ease: easings.enter }}
      className="fixed right-0 top-0 h-full w-[440px] bg-white"
    >
      {children}
    </motion.aside>
  )}
</AnimatePresence>
```

**Règle :** les drawers entrent depuis leur bord d'origine (droite ou bas), jamais depuis le centre. Pas de scale à l'ouverture.

### 2.4 Modale / dialog

Fade + léger scale. Pas de rotation, pas de flip.

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.96 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.98 }}
  transition={{ duration: 0.22, ease: easings.enter }}
>
  {children}
</motion.div>
```

### 2.5 Hover sur cards Pro

Micro-shift 1-2px + ombre. Pas de lift 8px façon marketplace consumer.

```tsx
<motion.div
  whileHover={{ y: -1 }}
  transition={{ duration: 0.15, ease: easings.default }}
  className="border border-neutral-200 rounded-[8px] hover:shadow-sm"
>
  {children}
</motion.div>
```

### 2.6 Toggle Acheter / Louer

`layout` animation pour la pastille active qui glisse.

```tsx
<div className="relative flex gap-1 p-1 bg-neutral-100 rounded-[8px]">
  {["Acheter", "Louer"].map(option => (
    <button
      key={option}
      onClick={() => setActive(option)}
      className="relative z-10 px-4 py-1.5"
    >
      {active === option && (
        <motion.div
          layoutId="toggle-pill"
          className="absolute inset-0 bg-white rounded-[6px] shadow-sm -z-10"
          transition={{ duration: 0.2, ease: easings.default }}
        />
      )}
      {option}
    </button>
  ))}
</div>
```

### 2.7 Tab switch dans ReportEditorShell ou Widgets

Même pattern que 2.6 avec `layoutId`. Le contenu des tabs cross-fade sans glissement horizontal.

### 2.8 Notification badge count

`key` animation sur le nombre pour un mini-flip vertical.

```tsx
<AnimatePresence mode="popLayout">
  <motion.span
    key={count}
    initial={{ y: -8, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 8, opacity: 0 }}
    transition={{ duration: 0.18, ease: easings.default }}
  >
    {count}
  </motion.span>
</AnimatePresence>
```

### 2.9 Chargement data (skeletons)

Shimmer CSS natif, pas d'animation JS. Le shimmer doit être **subtil** (gradient à 4% d'opacité max).

```css
@keyframes shimmer {
  0%   { background-position: -100% 0; }
  100% { background-position: 100% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--neutral-100) 0%,
    var(--neutral-50) 50%,
    var(--neutral-100) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
}
```

---

## 3. Reduced motion

### 3.1 Support obligatoire

Tous les composants animés **doivent** respecter `prefers-reduced-motion: reduce`.

```tsx
import { useReducedMotion } from "motion/react"

function Section() {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.3, ease: easings.default }}
    />
  )
}
```

### 3.2 Helper global

Pour éviter de dupliquer partout :

```ts
// /src/lib/motion/useSafeMotion.ts

export function useSafeMotion<T>(animated: T, fallback: T): T {
  const reduced = useReducedMotion()
  return reduced ? fallback : animated
}
```

Usage :

```tsx
const anim = useSafeMotion(
  { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } },
  { initial: false, animate: { opacity: 1 } }
)

<motion.div {...anim} transition={{ duration: 0.3 }} />
```

### 3.3 Règle

Dans l'état `reduced`, toutes les animations sont **désactivées** (pas juste accélérées). L'utilisateur voit l'état final directement.

---

## 4. Performance

### 4.1 Propriétés à animer

**OK (GPU-accelerated) :**
- `transform` (x, y, scale, rotate)
- `opacity`
- `filter` (avec parcimonie)

**NON (reflow, mauvais FPS) :**
- `width`, `height` (sauf via `layout` animation de motion)
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- Box shadows animés en continu

### 4.2 `will-change`

À ajouter sur les éléments animés **pendant** leur animation, retiré après :

```tsx
<motion.div
  animate={{ x: 100 }}
  style={{ willChange: "transform" }}
/>
```

### 4.3 Tree-shaking

Import uniquement ce qui est utilisé. Ne pas importer `motion` en full :

```tsx
// OK
import { motion, AnimatePresence, useReducedMotion } from "motion/react"

// NON
import * as Motion from "motion/react"
```

### 4.4 Lazy des animations lourdes

Les animations de la landing (hero, sections scroll) peuvent être lazy-loadées avec `dynamic` pour alléger le bundle initial. Le Pro n'a quasiment pas d'animations lourdes.

---

## 5. À proscrire strictement

| ❌ À ne pas faire | Pourquoi |
|---|---|
| Parallax scroll | Cheap, ralentit le rendu, distrait |
| Morphing de shapes | Jamais utile dans un SaaS data |
| Text gradient animé | Kitsch, violet Propsight ne supporte pas ça |
| 3D perspective, flip cards | Anti-Linear/Attio |
| Particle effects, mesh gradients animés | Pur décoratif |
| Animations en boucle infinie (hors skeletons) | Fatigue visuelle |
| Spring physics exagérée (bounce) | Pas sérieux pour un SaaS Pro |
| Rotation > 5° | Décoratif |
| Durée > 500ms | Paraît buggué |
| Stagger > 100ms | Paraît lent |
| Auto-play vidéo en hero | Bande passante + distrayant |
| Cursor custom ou "magnetic" | Anti-accessibilité |
| Scroll-jacking | Dégrade l'UX |
| Animations qui se redéclenchent au scroll retour | `once: true` obligatoire |

---

## 6. Surfaces et intensité

Toutes les surfaces Propsight ne tolèrent pas le même niveau d'animation.

| Surface | Intensité animation | Exemples |
|---|---|---|
| Landing `/` | Modérée | Scroll reveal hero + sections |
| Landing `/pro` | Modérée | Scroll reveal + stagger modules |
| `/prix-immobiliers`, `/annonces` | Minimale | Hover cards, fade sur filter change |
| `/investissement/simulateur` | Minimale | Transitions de résultats |
| Widget iframe | Aucune non essentielle | Juste feedback boutons |
| Rapport partagé | Aucune | Page de lecture |
| `/login` | Minimale | Feedback form |
| `/app/*` (tous modules Pro) | Utilitaire seulement | Drawers, modales, toggles, badges |

**Règle générale :** plus on est profond dans le flow métier Pro, moins il y a d'animation décorative. Zero-decor dans `/app/*`.

---

## 7. Structure des fichiers motion

```
/src/lib/motion/
├── easings.ts          // const easings
├── durations.ts        // const durations
├── distances.ts        // const distances
├── staggers.ts         // const staggerChildren
├── useSafeMotion.ts    // helper reduced-motion
├── variants/
│   ├── scrollReveal.ts
│   ├── staggerGrid.ts
│   ├── drawer.ts
│   ├── modal.ts
│   └── toggle.ts
└── index.ts            // exports groupés
```

Usage :

```tsx
import { motion } from "motion/react"
import { scrollReveal } from "@/lib/motion/variants/scrollReveal"

<motion.section {...scrollReveal}>{children}</motion.section>
```

---

## 8. Checklist avant merge d'une PR avec animations

- [ ] Durée ≤ 500ms
- [ ] Easing = `easings.default` (sauf overlay)
- [ ] `useReducedMotion` supporté
- [ ] Pas de propriété non-GPU animée
- [ ] Pas de `infinite` (hors skeleton)
- [ ] Pas de scroll-jacking
- [ ] Animation désactivable ou raccourcissable
- [ ] Stagger ≤ 80ms
- [ ] Distance ≤ 24px sur un reveal
- [ ] Aucune animation décorative dans `/app/*`

---

## 9. Exemples concrets par écran

### Landing `/` — Hero

- Titre : fade + y=16 → 0, duration 400ms
- Sous-titre : delay 80ms, fade + y=12 → 0
- CTAs : delay 160ms, stagger 60ms, fade + y=8 → 0
- Visuel droite : delay 200ms, fade + x=20 → 0, duration 480ms (seule exception > 320ms)

### Landing `/pro` — Section modules

- Container : stagger 60ms sur cards
- Chaque card : fade + y=12 → 0, duration 280ms

### `/app/activite/pilotage` — Ouverture page

- Pas d'animation d'entrée de page. Les données apparaissent via skeletons qui font place au contenu sans transition.
- Kanban cards : micro hover `y: -1` au survol
- Drawer au clic sur une lead : slide depuis la droite, 280ms, `easings.enter`

### `/app/estimation/avis-valeur/[id]` — Génération rapport

- Split édition/preview : apparition instantanée, pas d'animation
- Ajout d'un comparable : nouvelle ligne fade + height, 220ms
- Preview refresh : cross-fade 180ms du bloc impacté uniquement (pas du rapport entier)

---

**Fin du document.**
