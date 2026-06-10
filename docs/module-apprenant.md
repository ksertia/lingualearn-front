# Module Apprenant — Documentation Technique

> **Langue :** Vue 3 + Nuxt (Composition API) · **State :** Pinia · **Style :** Tailwind CSS  
> **Périmètre :** Tout ce qui touche à l'expérience d'apprentissage côté apprenant.

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture des fichiers](#2-architecture-des-fichiers)
3. [Pages et routes](#3-pages-et-routes)
4. [Composants](#4-composants)
5. [Store Pinia](#5-store-pinia)
6. [Service & données mock](#6-service--données-mock)
7. [Types & interfaces](#7-types--interfaces)
8. [Système Mascotte](#8-système-mascotte)
9. [Flux de données](#9-flux-de-données)
10. [Flux d'interaction clés](#10-flux-dinteraction-clés)
11. [Design & animations](#11-design--animations)
12. [Checklist intégration API réelle](#12-checklist-intégration-api-réelle)

---

## 1. Vue d'ensemble

Le module apprenant couvre l'intégralité du parcours d'un utilisateur qui apprend une langue :

- Tableau de bord personnalisé (stats, quêtes, coffre quotidien)
- Navigation dans les parcours et leurs nœuds
- Lecteur de leçons (blocs de contenu)
- Moteur de quiz (4 types de questions, système de cœurs/vies)
- Système de progression : XP, niveaux, badges, streaks
- Mascotte animée contextuelle (Zaki et ses amis)

Toutes les données sont actuellement **simulées via un service mock** (`learner-mock.ts`) en attendant le branchement API.

---

## 2. Architecture des fichiers

```
app/
├── pages/apprenant/
│   ├── dashboard.vue          # Hub principal
│   ├── profil.vue             # Profil et stats
│   ├── badges.vue             # Galerie de badges
│   ├── parcours/
│   │   ├── index.vue          # Liste des parcours
│   │   └── [id].vue           # Carte d'un parcours (nœuds)
│   ├── lecon/
│   │   └── [id].vue           # Lecteur de leçon
│   └── quiz/
│       └── [id].vue           # Moteur de quiz
│
├── components/apprenant/
│   ├── ZakiSvg.vue            # SVG mascotte Zaki (multi-humeur)
│   ├── MascotBubble.vue       # Bulle de dialogue + mascotte
│   ├── Confetti.vue           # Pluie de confettis (célébration)
│   ├── BadgeCelebration.vue   # Modal "badge débloqué"
│   ├── LevelUpModal.vue       # Modal "niveau supérieur"
│   ├── DailyChest.vue         # Coffre quotidien animé
│   ├── DailyQuests.vue        # Tracker de quêtes journalières
│   └── ParcoursComplete.vue   # Écran fin de parcours
│
├── stores/
│   └── learnerStore.ts        # Store Pinia central
│
├── services/
│   └── learner-service.ts     # Couche service (mock → API)
│
├── data/
│   ├── learner-mock.ts        # Données fictives
│   └── mascot-data.ts         # Personnages et messages mascotte
│
├── types/
│   ├── learner.ts             # Toutes les interfaces métier
│   └── mascot.ts              # Types mascotte
│
└── composables/
    └── useNotificationSound.ts # Sons de notification
```

---

## 3. Pages et routes

| Route | Fichier | Rôle |
|---|---|---|
| `/apprenant/dashboard` | `dashboard.vue` | Hub principal : stats, coffre, quêtes, langues, parcours actif |
| `/apprenant/profil` | `profil.vue` | Profil : avatar, niveaux, graphique activité, badges |
| `/apprenant/badges` | `badges.vue` | Galerie filtrée par catégorie |
| `/apprenant/parcours` | `parcours/index.vue` | Liste de tous les parcours avec filtres par langue |
| `/apprenant/parcours/[id]` | `parcours/[id].vue` | Carte visuelle du parcours (nœuds gauche/droite alternés) |
| `/apprenant/lecon/[id]?parcours=[id]` | `lecon/[id].vue` | Lecteur de leçon bloc par bloc |
| `/apprenant/quiz/[id]?parcours=[id]` | `quiz/[id].vue` | Moteur de quiz avec vies |

> **Convention :** `[id]` correspond toujours à l'ID du **nœud** (`PathNode.id`), pas du contenu.  
> Le `?parcours=` en query string permet au store de recharger le contexte du parcours.

---

## 4. Composants

### ZakiSvg

**Fichier :** [app/components/apprenant/ZakiSvg.vue](app/components/apprenant/ZakiSvg.vue)

SVG entièrement codé du personnage Zaki. Les yeux, la bouche et les bras changent selon la `mood`.

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `mood` | `MascotMood` | `'happy'` | Humeur affichée |
| `size` | `number` | `120` | Taille en px |
| `animated` | `boolean` | `true` | Active les animations CSS |

**Humeurs disponibles :** `happy`, `excited`, `celebrating`, `sad`, `thinking`, `proud`, `surprised`, `worried`, `resting`, `focused`, `victory`

---

### MascotBubble

**Fichier :** [app/components/apprenant/MascotBubble.vue](app/components/apprenant/MascotBubble.vue)

Wraps ZakiSvg avec une bulle de dialogue contextuelle.

| Prop | Description |
|---|---|
| `character` | ID du personnage (`zaki`, `awa`, etc.) |
| `mood` | Humeur |
| `message` | Texte à afficher |
| `position` | `'left'` ou `'right'` |
| `dismissable` | L'utilisateur peut fermer |
| `autoHide` | Délai auto-fermeture en ms |

**Émet :** `dismissed`

---

### Confetti

**Fichier :** [app/components/apprenant/Confetti.vue](app/components/apprenant/Confetti.vue)

Pluie de confettis via `Teleport` (rendu à la racine `<body>`).

| Prop | Défaut | Description |
|---|---|---|
| `active` | `false` | Déclenche l'animation |
| `count` | `60` | Nombre de confettis |
| `duration` | `3000` | Durée en ms |

**Émet :** `done` (quand l'animation est terminée)

---

### BadgeCelebration

**Fichier :** [app/components/apprenant/BadgeCelebration.vue](app/components/apprenant/BadgeCelebration.vue)

Modal de célébration quand un badge est débloqué. Inclut confettis, mascotte, nom + description du badge, et XP gagné.

| Prop | Description |
|---|---|
| `badge` | Objet `Badge` |
| `visible` | Booléen d'affichage |

**Émet :** `close`

---

### LevelUpModal

**Fichier :** [app/components/apprenant/LevelUpModal.vue](app/components/apprenant/LevelUpModal.vue)

Plein écran quand l'apprenant change de niveau. Affiche l'anneau de progression XP, le titre du nouveau niveau, et les récompenses.

| Prop | Description |
|---|---|
| `previousLevel` | Niveau avant |
| `newLevel` | Nouveau niveau |
| `currentXp` | XP actuel |
| `nextLevelXp` | Seuil prochain niveau |

**Niveaux → titres :** niveau 5 = "Maître des langues" (mapping interne au composant)

---

### DailyChest

**Fichier :** [app/components/apprenant/DailyChest.vue](app/components/apprenant/DailyChest.vue)

Coffre quotidien animé. Deux états : disponible (cliquable) / réclamé (compte à rebours).

| Prop | Type |
|---|---|
| `chest` | `DailyChestState` |

**Émet :** `open` (quand l'utilisateur clique pour ouvrir)

---

### DailyQuests

**Fichier :** [app/components/apprenant/DailyQuests.vue](app/components/apprenant/DailyQuests.vue)

Tracker des quêtes journalières avec barres de progression par type (`lesson`, `quiz`, `streak`, `xp`).

| Prop | Type |
|---|---|
| `quests` | `DailyQuest[]` |

Affiche également un anneau de progression global (% des quêtes complétées).

---

### ParcoursComplete

**Fichier :** [app/components/apprenant/ParcoursComplete.vue](app/components/apprenant/ParcoursComplete.vue)

Écran de fin de parcours avec stats (XP, temps, leçons, score quiz), section certificat, et boutons continuer/partager.

| Prop | Description |
|---|---|
| `visible` | Booléen d'affichage |
| `parcoursName` | Nom du parcours |
| `languageName` | Langue apprise |
| `xpEarned` | XP total gagné |
| `timeSpentSeconds` | Temps passé |
| `lessonsCount` | Nombre de leçons |
| `quizScore` | Score moyen quiz |

**Émet :** `continue`, `share`

---

## 5. Store Pinia

**Fichier :** [app/stores/learnerStore.ts](app/stores/learnerStore.ts)

C'est le **point central** de tout état apprenant. Toutes les pages l'utilisent via `useLearnerStore()`.

### État (refs)

```typescript
languages          // LearnerLanguage[] — langues de l'apprenant
allParcours        // LearnerParcours[] — tous les parcours
activeParcours     // LearnerParcours | null — parcours en cours
currentLesson      // Lesson | null — leçon chargée
currentQuiz        // Quiz | null — quiz chargé
badges             // Badge[]
stats              // LearnerStats | null
isLoading          // boolean — chargement global
isLessonLoading    // boolean — chargement leçon/quiz
completedNodeIds   // Set<string> — IDs des nœuds terminés cette session
```

### Computed

| Computed | Description |
|---|---|
| `xpPercent` | % de XP vers le prochain niveau |
| `weeklyGoalPercent` | % de l'objectif hebdomadaire atteint |
| `unlockedBadges` | Badges filtrés débloqués |
| `currentNodeInActiveParcours` | Prochain nœud à étudier |
| `mooreParcours` / `dioulaParcours` | Parcours par langue |

### Actions

| Action | Description |
|---|---|
| `init()` | Charge tout au montage du dashboard |
| `loadParcours(id)` | Charge un parcours spécifique |
| `loadLesson(nodeId)` | Charge une leçon par ID de nœud |
| `loadQuiz(nodeId)` | Charge un quiz par ID de nœud |
| `completeLesson(nodeId, parcoursId)` | Marque la leçon comme terminée, met à jour les stats |
| `submitQuiz(result)` | Envoie le résultat du quiz, met à jour les stats |
| `getParcoursById(id)` | Retourne un parcours par ID (sync) |

---

## 6. Service & données mock

**Fichier service :** [app/services/learner-service.ts](app/services/learner-service.ts)  
**Données :** [app/data/learner-mock.ts](app/data/learner-mock.ts)

Le service fait office de **façade** entre le store et la source de données. Chaque méthode simule un délai réseau de 300 ms (`MOCK_DELAY`).

### Méthodes du service

```typescript
getMyLanguages()              → LearnerLanguage[]
getAllParcours()               → LearnerParcours[]
getParcoursForLang(langId)    → LearnerParcours[]
getParcours(id)               → LearnerParcours | null
getLesson(nodeId)             → Lesson | null
completeLesson(nodeId, parcoursId) → LessonProgress
getQuiz(nodeId)               → Quiz | null
submitQuizResult(result)      → { xpEarned, coinsEarned, newBadges }
getMyBadges()                 → Badge[]
getMyStats()                  → LearnerStats
getActiveParcours()           → LearnerParcours | null
```

### Données mock disponibles

| Export | Contenu |
|---|---|
| `mockLanguages` | Mooré, Dioula |
| `mockParcours` | 3 parcours avec 6-10 nœuds chacun |
| `mockLessons` | 4 leçons avec blocs markdown |
| `mockQuizzes` | 2 quiz avec 5 questions chacun |
| `mockBadges` | 8 badges (4 débloqués, 4 verrouillés) |
| `mockLearnerStats` | Niveau 5, 1 240 XP, streak 7 jours |
| `mockDailyQuests` | 3 modèles de quêtes |
| `mockDailyChest` | Coffre disponible, 25 XP + 15 pièces |

> **Pour brancher l'API :** remplacer les appels mock dans `learner-service.ts` par de vrais appels HTTP. Le store et les pages n'ont pas besoin d'être modifiés.

---

## 7. Types & interfaces

**Fichier :** [app/types/learner.ts](app/types/learner.ts)

### Enums principaux

```typescript
type NodeStatus     = 'completed' | 'current' | 'locked'
type NodeType       = 'lesson' | 'quiz' | 'review' | 'checkpoint' | 'bonus'
type ContentBlockType = 'text' | 'image' | 'video' | 'audio'
type QuestionType   = 'mcq' | 'true_false' | 'fill_blank' | 'match'
type ParcoursStatus = 'not_started' | 'in_progress' | 'completed'
type BadgeCategory  = 'streak' | 'xp' | 'completion' | 'special'
```

### Interfaces clés

**`LearnerLanguage`** — une langue apprise par l'utilisateur

```typescript
{
  id, name, code, flag, coverImage,
  currentLevel, progressPercent, totalXP,
  parcoursCount, color
}
```

**`PathNode`** — un nœud sur la carte d'un parcours

```typescript
{
  id, parcoursId, order, type, title,
  status, xpReward, duration, icon
}
```

**`LearnerParcours`** — un parcours avec ses nœuds

```typescript
{
  id, languageId, title, description, coverImage,
  totalNodes, completedNodes, xpReward, status,
  nodes: PathNode[]
}
```

**`Lesson`** — contenu d'une leçon

```typescript
{
  id, nodeId, parcoursId, title, subtitle,
  xpReward, duration,
  blocks: ContentBlock[]
}
```

**`ContentBlock`** — un bloc de contenu dans une leçon

```typescript
{
  id, type, order,
  text?,        // si type = 'text'
  imageUrl?,    // si type = 'image'
  videoUrl?,    // si type = 'video'
  audioLabel?   // si type = 'audio'
}
```

**`Quiz`** — un quiz avec ses questions

```typescript
{
  id, nodeId, parcoursId, title,
  xpReward, heartsAllowed,
  questions: QuizQuestion[]
}
```

**`QuizQuestion`** — une question de quiz

```typescript
{
  id, type, question, imageUrl?,
  options?,        // pour mcq
  correctAnswer,
  explanation,
  pairs?,          // pour match
  blankAnswer?     // pour fill_blank
}
```

**`LearnerStats`** — statistiques globales de l'apprenant

```typescript
{
  xp, level, levelTitle, xpToNextLevel,
  streak, maxStreak, coins, hearts,
  totalLessonsCompleted, totalQuizzesCompleted,
  totalBadges, studyMinutesTotal,
  weeklyXP: number[],  // 7 derniers jours
  weeklyGoalXP
}
```

---

## 8. Système Mascotte

**Fichier :** [app/data/mascot-data.ts](app/data/mascot-data.ts)  
**Types :** [app/types/mascot.ts](app/types/mascot.ts)

### Les 5 personnages

| ID | Nom | Couleur | Personnalité |
|---|---|---|---|
| `zaki` | Zaki | `#1A7A1A` (vert) | Aventurier et enthousiaste |
| `awa` | Awa | `#E06510` (orange) | Sage et encourageante |
| `kinga` | Kinga | `#8B5CF6` (violet) | Joyeuse et créative |
| `yuma` | Yuma | `#0EA5E9` (cyan) | Calme et réfléchi |
| `sambo` | Sambo | `#F59E0B` (ambre) | Drôle et joueur |

### Assignation page → mascotte

| Page | Personnage par défaut |
|---|---|
| Dashboard | Zaki |
| Parcours | Awa |
| Leçon | Kinga |
| Quiz | Zaki |
| Badges | Kinga |
| Profil | Awa |

### Contextes de messages (16 contextes)

`greeting`, `lesson_start`, `lesson_complete`, `quiz_start`, `quiz_correct`, `quiz_wrong`, `quiz_complete_win`, `quiz_complete_lose`, `badge_unlock`, `level_up`, `streak`, `daily_reminder`, `encouragement`, `parcours_complete`, `chest_open`, `quest_complete`

### Utilisation

```typescript
import { getMascotMessage, CONTEXT_TO_MOOD } from '~/data/mascot-data'

// Obtenir un message aléatoire
const msg = getMascotMessage('zaki', 'quiz_correct', { name: 'Moussa' })

// Obtenir la mood correspondante
const mood = CONTEXT_TO_MOOD['level_up']  // → 'celebrating'
```

---

## 9. Flux de données

```
Page (dashboard, parcours, lecon, quiz…)
        │
        │  useLearnerStore()
        ▼
  Pinia Store (learnerStore.ts)
  ├─ state : languages, allParcours, stats, currentLesson…
  ├─ computed : xpPercent, unlockedBadges…
  └─ actions : init(), loadLesson(), completeLesson()…
        │
        │  appels async au service
        ▼
  Learner Service (learner-service.ts)
  └─ simulation 300ms + données depuis learner-mock.ts
        │
        ▼
  Données mock (learner-mock.ts)
  └─ mockLanguages, mockParcours, mockLessons, mockQuizzes…
```

---

## 10. Flux d'interaction clés

### Chargement du dashboard

1. `onMounted` → `store.init()`
2. Le service charge en parallèle langues, parcours, badges, stats, parcours actif
3. Le store met à jour toutes les refs
4. L'UI rend : hero stats → coffre + quêtes → objectifs → langues → parcours actif

### Complétion d'une leçon

1. Clic sur un nœud "leçon" → navigation vers `/apprenant/lecon/[nodeId]?parcours=[id]`
2. `store.loadLesson(nodeId)` charge la leçon
3. Écran intro → blocs de contenu (un par écran, avec transitions) → écran de fin
4. Clic "Continuer" → `store.completeLesson(nodeId, parcoursId)`
5. Stats mises à jour (XP, compteur leçons)
6. Retour à la carte du parcours — le nœud passe de `current` à `completed`

### Déroulement d'un quiz

1. Clic sur un nœud "quiz" → `/apprenant/quiz/[nodeId]?parcours=[id]`
2. `store.loadQuiz(nodeId)` charge le quiz
3. Écran intro (avec affichage des cœurs/vies) → questions
4. À chaque réponse : vérification, feedback, passage à la suivante
5. Perte d'un cœur sur mauvaise réponse → game over si 0 cœur
6. Écran résultat → `store.submitQuiz(result)` → stats mises à jour

### Déblocage de badge

1. Seuil atteint (leçon terminée, XP, streak…)
2. Badge mis à jour : `unlocked: true`, `unlockedAt: now()`
3. Modal `BadgeCelebration` + confettis
4. Mascotte affiche le message contexte `badge_unlock`
5. Badge visible sur le dashboard et la page badges

### Passage de niveau

1. Seuil XP dépassé
2. Niveau incrémenté, titre mis à jour
3. `LevelUpModal` affiché : niveaux avant/après, anneau XP, mascotte en mode `celebrating`
4. Récompenses affichées (cœur bonus, XP)
5. Clic "Continuer" → modal fermée

---

## 11. Design & animations

### Palette de couleurs

| Usage | Couleur |
|---|---|
| Accent principal | `#1A7A1A` (vert) |
| XP / niveau | `#F0B429` (or) |
| Streak / alerte | `#E06510` (orange) |
| Quiz / spécial | `#8B5CF6` (violet) |
| Focus / réflexion | `#0EA5E9` (cyan) |
| Nœud terminé | `#1A7A1A` |
| Nœud verrouillé | `#E5E7EB` |

### Animations notables

| Composant | Animation |
|---|---|
| `Confetti.vue` | Chute + rotation + fondu, 3 000–4 500 ms |
| `BadgeCelebration.vue` | Bounce pop 600 ms cubic-bezier |
| `LevelUpModal.vue` | Badge pop 700 ms |
| `DailyChest.vue` | Couvercle `rotateX` 400 ms |
| `ZakiSvg.vue` | Float, dance, bounce, shake selon mood |

### Responsive

Approche desktop-first, breakpoints : 640 px, 900 px, 1 024 px.  
Les grilles passent de 3 colonnes → 2 → 1 sur mobile.

---

## 12. Checklist intégration API réelle

- [ ] Remplacer les appels mock dans `learner-service.ts` par des `$fetch` / `useAsyncData`
- [ ] Brancher le middleware d'authentification pour protéger les routes `/apprenant/*`
- [ ] Connecter la logique de déblocage de badge au système d'événements backend
- [ ] Synchroniser la complétion leçon/quiz avec le tracker de progression backend
- [ ] Implémenter le calcul XP/niveaux côté serveur (actuellement simulé)
- [ ] Ajouter les fichiers sons dans `/public/sounds/` pour `useNotificationSound`
- [ ] Brancher la génération PDF du certificat (fin de parcours)
- [ ] Implémenter le suivi de streak avec horodatage serveur
- [ ] Intégrer le partage réseaux sociaux (composant `ParcoursComplete`)
- [ ] Remplacer les images mock par les assets CDN définitifs
