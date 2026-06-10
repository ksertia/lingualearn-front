import type {
  LearnerLanguage,
  LearnerParcours,
  PathNode,
  Lesson,
  Quiz,
  Badge,
  LearnerStats
} from '~/types/learner'

import type { DailyQuest, DailyChestState } from '~/types/mascot'

// ─────────────────────────────────────────────────────────────────────────────
// LANGUES
// ─────────────────────────────────────────────────────────────────────────────

export const mockLanguages: LearnerLanguage[] = [
  {
    id: 'lang-1',
    name: 'Mooré',
    code: 'mos',
    flag: '🇧🇫',
    coverImage: '/images/tibi-aventure.jpeg',
    currentLevel: 'A1',
    progressPercent: 65,
    totalXP: 1240,
    parcoursCount: 3,
    color: '#1A7A1A'
  },
  {
    id: 'lang-2',
    name: 'Dioula',
    code: 'dyu',
    flag: '🇧🇫',
    coverImage: '/images/tibi-parcours.jpeg',
    currentLevel: 'A1',
    progressPercent: 20,
    totalXP: 380,
    parcoursCount: 2,
    color: '#E06510'
  }
]

// ─────────────────────────────────────────────────────────────────────────────
// NŒUDS DE PARCOURS
// ─────────────────────────────────────────────────────────────────────────────

const nodesP1: PathNode[] = [
  { id: 'n1', parcoursId: 'p1', order: 1, type: 'lesson', title: 'Salutations', status: 'completed', xpReward: 10, duration: 5, icon: '👋' },
  { id: 'n2', parcoursId: 'p1', order: 2, type: 'lesson', title: 'Se présenter', status: 'completed', xpReward: 10, duration: 5, icon: '🙋' },
  { id: 'n3', parcoursId: 'p1', order: 3, type: 'quiz', title: 'Quiz 1', status: 'completed', xpReward: 20, duration: 8, icon: '❓' },
  { id: 'n4', parcoursId: 'p1', order: 4, type: 'lesson', title: 'Les chiffres', status: 'completed', xpReward: 10, duration: 6, icon: '🔢' },
  { id: 'n5', parcoursId: 'p1', order: 5, type: 'lesson', title: 'Les couleurs', status: 'current', xpReward: 10, duration: 5, icon: '🎨' },
  { id: 'n6', parcoursId: 'p1', order: 6, type: 'quiz', title: 'Quiz 2', status: 'locked', xpReward: 20, duration: 8, icon: '❓' },
  { id: 'n7', parcoursId: 'p1', order: 7, type: 'lesson', title: 'La famille', status: 'locked', xpReward: 10, duration: 7, icon: '👨‍👩‍👧' },
  { id: 'n8', parcoursId: 'p1', order: 8, type: 'lesson', title: 'Les animaux', status: 'locked', xpReward: 10, duration: 6, icon: '🐾' },
  { id: 'n9', parcoursId: 'p1', order: 9, type: 'review', title: 'Révision générale', status: 'locked', xpReward: 15, duration: 10, icon: '🔄' },
  { id: 'n10', parcoursId: 'p1', order: 10, type: 'checkpoint', title: 'Niveau 1 — Certificat', status: 'locked', xpReward: 50, duration: 15, icon: '🏆' }
]

const nodesP2: PathNode[] = [
  { id: 'np1', parcoursId: 'p2', order: 1, type: 'lesson', title: 'La nourriture', status: 'locked', xpReward: 10, duration: 7, icon: '🍲' },
  { id: 'np2', parcoursId: 'p2', order: 2, type: 'lesson', title: 'Le marché', status: 'locked', xpReward: 10, duration: 8, icon: '🛒' },
  { id: 'np3', parcoursId: 'p2', order: 3, type: 'quiz', title: 'Quiz du marché', status: 'locked', xpReward: 20, duration: 8, icon: '❓' },
  { id: 'np4', parcoursId: 'p2', order: 4, type: 'lesson', title: 'La maison', status: 'locked', xpReward: 10, duration: 7, icon: '🏠' },
  { id: 'np5', parcoursId: 'p2', order: 5, type: 'lesson', title: 'Le transport', status: 'locked', xpReward: 10, duration: 6, icon: '🚌' },
  { id: 'np6', parcoursId: 'p2', order: 6, type: 'review', title: 'Révision', status: 'locked', xpReward: 15, duration: 10, icon: '🔄' },
  { id: 'np7', parcoursId: 'p2', order: 7, type: 'quiz', title: 'Quiz final', status: 'locked', xpReward: 25, duration: 12, icon: '❓' },
  { id: 'np8', parcoursId: 'p2', order: 8, type: 'checkpoint', title: 'Niveau 2', status: 'locked', xpReward: 100, duration: 15, icon: '🏆' }
]

const nodesP3: PathNode[] = [
  { id: 'dp1', parcoursId: 'p3', order: 1, type: 'lesson', title: 'Bonjour en Dioula', status: 'completed', xpReward: 10, duration: 5, icon: '👋' },
  { id: 'dp2', parcoursId: 'p3', order: 2, type: 'lesson', title: 'Se présenter', status: 'current', xpReward: 10, duration: 5, icon: '🙋' },
  { id: 'dp3', parcoursId: 'p3', order: 3, type: 'quiz', title: 'Mini Quiz', status: 'locked', xpReward: 20, duration: 8, icon: '❓' },
  { id: 'dp4', parcoursId: 'p3', order: 4, type: 'lesson', title: 'Les nombres', status: 'locked', xpReward: 10, duration: 6, icon: '🔢' },
  { id: 'dp5', parcoursId: 'p3', order: 5, type: 'review', title: 'Révision', status: 'locked', xpReward: 15, duration: 10, icon: '🔄' },
  { id: 'dp6', parcoursId: 'p3', order: 6, type: 'checkpoint', title: 'Niveau 1', status: 'locked', xpReward: 50, duration: 15, icon: '🏆' }
]

// ─────────────────────────────────────────────────────────────────────────────
// PARCOURS
// ─────────────────────────────────────────────────────────────────────────────

export const mockParcours: LearnerParcours[] = [
  {
    id: 'p1',
    languageId: 'lang-1',
    title: 'Les Fondamentaux',
    description: 'Maîtrisez les bases essentielles du Mooré : salutations, chiffres, couleurs et vie quotidienne.',
    coverImage: '/images/tibi-accueil.jpeg',
    totalNodes: 10,
    completedNodes: 4,
    xpReward: 165,
    status: 'in_progress',
    nodes: nodesP1
  },
  {
    id: 'p2',
    languageId: 'lang-1',
    title: 'La Vie Quotidienne',
    description: 'Apprenez le vocabulaire du quotidien : nourriture, maison, marché et transports.',
    coverImage: '/images/tibi-progression.jpeg',
    totalNodes: 8,
    completedNodes: 0,
    xpReward: 200,
    status: 'not_started',
    nodes: nodesP2
  },
  {
    id: 'p3',
    languageId: 'lang-2',
    title: 'Dioula Débutant',
    description: 'Premiers pas en Dioula : salutations, présentations et expressions courantes.',
    coverImage: '/images/tibi-parcours.jpeg',
    totalNodes: 6,
    completedNodes: 1,
    xpReward: 120,
    status: 'in_progress',
    nodes: nodesP3
  }
]

// ─────────────────────────────────────────────────────────────────────────────
// LEÇONS
// ─────────────────────────────────────────────────────────────────────────────

export const mockLessons: Lesson[] = [
  {
    id: 'l-sal',
    nodeId: 'n1',
    parcoursId: 'p1',
    title: 'Les Salutations en Mooré',
    subtitle: 'Comment dire bonjour et au revoir',
    xpReward: 10,
    duration: 5,
    blocks: [
      {
        id: 'bs1',
        type: 'text',
        order: 1,
        text: '## Bienvenue dans cette leçon !\n\nEn Mooré, les salutations sont très importantes dans la culture Burkinabè. Il existe plusieurs façons de se saluer selon le moment de la journée.'
      },
      {
        id: 'bs2',
        type: 'text',
        order: 2,
        text: '### Bonjour\n\n🌅 **Le matin** : "Ne y beoog soaba"\n\nRéponse : "Yaa, ne y beoog soaba"\n\n☀️ **L\'après-midi** : "Ne y zaabr soaba"\n\n🌙 **Le soir** : "Ne y zan soaba"'
      },
      {
        id: 'bs3',
        type: 'text',
        order: 3,
        text: '### Comment ça va ?\n\n**"Y sɩda?"** — Comment ça va ?\n\nRéponse : **"Laafi bala"** — Ça va bien\n\n> 💡 **Astuce** : Le mot **"Laafi"** est très utilisé. Il signifie "paix, santé, bien-être".'
      },
      {
        id: 'bs4',
        type: 'text',
        order: 4,
        text: '### Au revoir\n\n**"Rɩ m tũnd"** — Au revoir\n\n**"Sõng"** — Bonne journée / Adieu\n\n---\n\n✅ Vous avez maintenant les bases des salutations en Mooré ! Pratiquez ces expressions au quotidien.'
      }
    ]
  },
  {
    id: 'l-pres',
    nodeId: 'n2',
    parcoursId: 'p1',
    title: 'Se Présenter en Mooré',
    subtitle: 'Donner son nom et son origine',
    xpReward: 10,
    duration: 5,
    blocks: [
      {
        id: 'bp1',
        type: 'text',
        order: 1,
        text: '## Se présenter en Mooré\n\nSavoir se présenter est l\'une des premières étapes essentielles dans l\'apprentissage d\'une langue.'
      },
      {
        id: 'bp2',
        type: 'text',
        order: 2,
        text: '### Dire son nom\n\n**"Mam yʋʋre yaa..."** — Je m\'appelle...\n\nExemple : "Mam yʋʋre yaa Aminata"\n\n**"Fo yʋʋre yaa a bʋ?"** — Comment tu t\'appelles ?'
      },
      {
        id: 'bp3',
        type: 'text',
        order: 3,
        text: '### D\'où viens-tu ?\n\n**"Fo yii yʋʋre la?"** — D\'où viens-tu ?\n\n**"Mam yii Wagadugu"** — Je viens de Ouagadougou\n\n**"Mam yii Buŋ"** — Je viens de Bobo-Dioulasso\n\n> 💡 En Mooré, on peut aussi demander l\'âge : **"Fo pe yʋʋs a yʋʋr?"** — Quel âge as-tu ?'
      },
      {
        id: 'bp4',
        type: 'text',
        order: 4,
        text: '### Mettre tout ensemble\n\nVoici un exemple de présentation complète :\n\n> "Laafi bala. Mam yʋʋre yaa Kalifa. Mam yii Wagadugu. Mam pe yʋʋs a 15."\n\nTraduction : "Je vais bien. Je m\'appelle Kalifa. Je viens de Ouagadougou. J\'ai 15 ans."\n\n🎉 Bravo ! Vous savez maintenant vous présenter en Mooré !'
      }
    ]
  },
  {
    id: 'l-col',
    nodeId: 'n5',
    parcoursId: 'p1',
    title: 'Les Couleurs en Mooré',
    subtitle: 'Apprenez à nommer les couleurs',
    xpReward: 10,
    duration: 5,
    blocks: [
      {
        id: 'bc1',
        type: 'text',
        order: 1,
        text: '## Les couleurs en Mooré\n\nAujourd\'hui, vous allez apprendre les couleurs. Les couleurs sont essentielles pour décrire le monde qui vous entoure.'
      },
      {
        id: 'bc2',
        type: 'text',
        order: 2,
        text: '### Les couleurs principales\n\n🔴 **Yɩɩre** — Rouge\n\n🔵 **Zabre** — Bleu\n\n🟢 **Vɩɩgré** — Vert\n\n⚪ **Wɩnde** — Blanc\n\n⚫ **Sablɩɩgo** — Noir\n\n🟡 **Wɩɩgre** — Jaune\n\n🟠 **Sʋʋg-beoog** — Orange'
      },
      {
        id: 'bc3',
        type: 'image',
        order: 3,
        imageUrl: '/icons/tibi-logo-final.png',
        imageAlt: 'Logo TiBi avec ses couleurs',
        text: 'Observez les couleurs du logo TiBi : vert (vɩɩgré), or (wɩɩgre) et orange (sʋʋg-beoog).'
      },
      {
        id: 'bc4',
        type: 'text',
        order: 4,
        text: '### Utilisation en phrase\n\nPour dire **"C\'est rouge"** : **"Yɩɩre la"**\n\nPour demander **"Quelle couleur ?"** : **"Bõnde la ?"**\n\n> 💡 **Règle** : En Mooré, l\'adjectif de couleur vient toujours **après** le nom.\n\n### Exemples\n- **Pʋg-wɩnde** — Fille en blanc\n- **Daaga-zabre** — Pagne bleu\n\n🎉 Félicitations ! Vous connaissez maintenant les couleurs en Mooré !'
      }
    ]
  },
  {
    id: 'l-chif',
    nodeId: 'n4',
    parcoursId: 'p1',
    title: 'Les Chiffres en Mooré',
    subtitle: 'Compter de 1 à 10',
    xpReward: 10,
    duration: 6,
    blocks: [
      {
        id: 'bch1',
        type: 'text',
        order: 1,
        text: '## Les chiffres de 1 à 10\n\nApprendre à compter en Mooré est fondamental pour les conversations du quotidien : prix, âge, quantités...'
      },
      {
        id: 'bch2',
        type: 'text',
        order: 2,
        text: '### De 1 à 5\n\n1️⃣ **Yembre** — Un\n\n2️⃣ **Ayyibo** — Deux\n\n3️⃣ **Tãabo** — Trois\n\n4️⃣ **Naase** — Quatre\n\n5️⃣ **Nuugo** — Cinq'
      },
      {
        id: 'bch3',
        type: 'text',
        order: 3,
        text: '### De 6 à 10\n\n6️⃣ **Yoobe** — Six\n\n7️⃣ **Yopoe** — Sept\n\n8️⃣ **Nyɩɩse** — Huit\n\n9️⃣ **Wa-yembre** — Neuf\n\n🔟 **Piig** — Dix\n\n> 💡 Le nombre 9 en Mooré signifie littéralement "manque un pour dix" !'
      },
      {
        id: 'bch4',
        type: 'text',
        order: 4,
        text: '### Compter dans la vie quotidienne\n\n**"A nede yembre"** — Il y en a un\n\n**"Tãabo yembre"** — Trois cents (unité de monnaie)\n\n> Pour demander un prix : **"A yaa kõlem?"** — C\'est combien ?\n\n🎉 Vous savez maintenant compter de 1 à 10 en Mooré !'
      }
    ]
  }
]

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ
// ─────────────────────────────────────────────────────────────────────────────

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    nodeId: 'n3',
    parcoursId: 'p1',
    title: 'Quiz : Salutations & Présentations',
    xpReward: 20,
    heartsAllowed: 3,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'Comment dit-on "Bonjour le matin" en Mooré ?',
        options: [
          { id: 'a', text: 'Ne y beoog soaba' },
          { id: 'b', text: 'Ne y zan soaba' },
          { id: 'c', text: 'Rɩ m tũnd' },
          { id: 'd', text: 'Laafi bala' }
        ],
        correctAnswer: 'a',
        explanation: '"Ne y beoog soaba" est la salutation du matin. "Beoog" signifie matin en Mooré.'
      },
      {
        id: 'q2',
        type: 'true_false',
        question: 'Le mot "Laafi" en Mooré signifie "Au revoir".',
        correctAnswer: 'false',
        explanation: '"Laafi" signifie "paix / bien / santé". Pour dire "Au revoir", on dit "Rɩ m tũnd".'
      },
      {
        id: 'q3',
        type: 'mcq',
        question: 'Quelle est la bonne réponse à "Y sɩda ?" ?',
        options: [
          { id: 'a', text: 'Ne y beoog soaba' },
          { id: 'b', text: 'Laafi bala' },
          { id: 'c', text: 'Sõng' },
          { id: 'd', text: 'Mam yʋʋre yaa...' }
        ],
        correctAnswer: 'b',
        explanation: '"Laafi bala" signifie "Ça va bien". C\'est la réponse standard à "Comment ça va?".'
      },
      {
        id: 'q4',
        type: 'fill_blank',
        question: 'Pour dire "Bonsoir" en Mooré, on dit : "Ne y ___ soaba"',
        correctAnswer: 'zan',
        blankAnswer: 'zan',
        explanation: '"Zan" signifie nuit / soir. Donc "Ne y zan soaba" = Bonsoir.'
      },
      {
        id: 'q5',
        type: 'match',
        question: 'Associez chaque expression Mooré à sa traduction française.',
        pairs: [
          { left: 'Ne y beoog soaba', right: 'Bonjour (matin)' },
          { left: 'Laafi bala', right: 'Ça va bien' },
          { left: 'Rɩ m tũnd', right: 'Au revoir' },
          { left: 'Y sɩda ?', right: 'Comment ça va ?' }
        ],
        correctAnswer: [
          'Ne y beoog soaba|Bonjour (matin)',
          'Laafi bala|Ça va bien',
          'Rɩ m tũnd|Au revoir',
          'Y sɩda ?|Comment ça va ?'
        ],
        explanation: 'Ces associations sont les expressions de base des salutations en Mooré.'
      }
    ]
  },
  {
    id: 'quiz-2',
    nodeId: 'n6',
    parcoursId: 'p1',
    title: 'Quiz : Chiffres & Couleurs',
    xpReward: 20,
    heartsAllowed: 3,
    questions: [
      {
        id: 'q2-1',
        type: 'mcq',
        question: 'Comment dit-on "Vert" en Mooré ?',
        options: [
          { id: 'a', text: 'Yɩɩre' },
          { id: 'b', text: 'Zabre' },
          { id: 'c', text: 'Vɩɩgré' },
          { id: 'd', text: 'Wɩnde' }
        ],
        correctAnswer: 'c',
        explanation: '"Vɩɩgré" signifie vert en Mooré. C\'est aussi la couleur du logo TiBi !'
      },
      {
        id: 'q2-2',
        type: 'mcq',
        question: 'Quel chiffre correspond à "Tãabo" en Mooré ?',
        options: [
          { id: 'a', text: '2' },
          { id: 'b', text: '3' },
          { id: 'c', text: '4' },
          { id: 'd', text: '5' }
        ],
        correctAnswer: 'b',
        explanation: '"Tãabo" signifie 3 en Mooré.'
      },
      {
        id: 'q2-3',
        type: 'true_false',
        question: 'En Mooré, l\'adjectif de couleur vient avant le nom.',
        correctAnswer: 'false',
        explanation: 'En Mooré, l\'adjectif de couleur vient toujours APRÈS le nom. Ex: "Pʋg-wɩnde" = Fille-blanc = Fille en blanc.'
      }
    ]
  }
]

// ─────────────────────────────────────────────────────────────────────────────
// BADGES
// ─────────────────────────────────────────────────────────────────────────────

export const mockBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'Premier Pas',
    description: 'Complétez votre première leçon',
    icon: '🌱',
    color: '#10B981',
    bgColor: '#D1FAE5',
    category: 'completion',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    unlockedAt: '2026-06-01'
  },
  {
    id: 'badge-2',
    name: '7 Jours de Suite',
    description: 'Apprenez 7 jours d\'affilée',
    icon: '🔥',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    category: 'streak',
    unlocked: true,
    progress: 7,
    maxProgress: 7,
    unlockedAt: '2026-06-07'
  },
  {
    id: 'badge-3',
    name: 'Étoile Montante',
    description: 'Atteignez 1000 XP',
    icon: '⭐',
    color: '#F0B429',
    bgColor: '#FFFBEB',
    category: 'xp',
    unlocked: true,
    progress: 1240,
    maxProgress: 1000,
    unlockedAt: '2026-06-05'
  },
  {
    id: 'badge-4',
    name: 'Explorateur',
    description: 'Commencez à apprendre 2 langues',
    icon: '🗺️',
    color: '#14B8A6',
    bgColor: '#CCFBF1',
    category: 'special',
    unlocked: true,
    progress: 2,
    maxProgress: 2,
    unlockedAt: '2026-06-04'
  },
  {
    id: 'badge-5',
    name: 'Maître des Couleurs',
    description: 'Complétez la leçon sur les couleurs',
    icon: '🎨',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    category: 'completion',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    unlockedAt: ''
  },
  {
    id: 'badge-6',
    name: '30 Jours de Suite',
    description: 'Apprenez 30 jours d\'affilée',
    icon: '💎',
    color: '#0EA5E9',
    bgColor: '#E0F2FE',
    category: 'streak',
    unlocked: false,
    progress: 7,
    maxProgress: 30,
    unlockedAt: ''
  },
  {
    id: 'badge-7',
    name: 'Quiz Master',
    description: 'Réussissez 10 quiz avec 100%',
    icon: '🧠',
    color: '#EC4899',
    bgColor: '#FCE7F3',
    category: 'completion',
    unlocked: false,
    progress: 3,
    maxProgress: 10,
    unlockedAt: ''
  },
  {
    id: 'badge-8',
    name: 'Sage du Mooré',
    description: 'Complétez tous les parcours Mooré',
    icon: '👑',
    color: '#D97706',
    bgColor: '#FEF3C7',
    category: 'special',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    unlockedAt: ''
  }
]

// ─────────────────────────────────────────────────────────────────────────────
// STATISTIQUES APPRENANT
// ─────────────────────────────────────────────────────────────────────────────

export const mockLearnerStats: LearnerStats = {
  xp: 1240,
  level: 5,
  levelTitle: 'Explorateur',
  xpToNextLevel: 1500,
  streak: 7,
  maxStreak: 12,
  coins: 350,
  hearts: 5,
  totalLessonsCompleted: 23,
  totalQuizzesCompleted: 8,
  totalBadges: 4,
  studyMinutesTotal: 180,
  weeklyXP: [80, 120, 60, 150, 90, 200, 110],
  weeklyGoalXP: 500
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getParcoursById(id: string): LearnerParcours | undefined {
  return mockParcours.find(p => p.id === id)
}

export function getLessonByNodeId(nodeId: string): Lesson | undefined {
  return mockLessons.find(l => l.nodeId === nodeId)
}

export function getQuizByNodeId(nodeId: string): Quiz | undefined {
  return mockQuizzes.find(q => q.nodeId === nodeId)
}

export function getParcoursForLanguage(languageId: string): LearnerParcours[] {
  return mockParcours.filter(p => p.languageId === languageId)
}

export function getCurrentNode(parcoursId: string): PathNode | undefined {
  const parcours = getParcoursById(parcoursId)
  return parcours?.nodes.find(n => n.status === 'current')
}

// ─────────────────────────────────────────────────────────────────────────────
// QUÊTES QUOTIDIENNES
// ─────────────────────────────────────────────────────────────────────────────

export const mockDailyQuests: DailyQuest[] = [
  {
    id: 'dq1',
    title: 'Complète 1 leçon',
    description: 'Termine une leçon de ton parcours actif',
    icon: '📚',
    target: 1,
    progress: 0,
    xpReward: 20,
    coinsReward: 10,
    completed: false,
    type: 'lesson'
  },
  {
    id: 'dq2',
    title: 'Réussis 1 quiz',
    description: 'Passe un quiz avec au moins 60% de bonnes réponses',
    icon: '🧠',
    target: 1,
    progress: 0,
    xpReward: 30,
    coinsReward: 15,
    completed: false,
    type: 'quiz'
  },
  {
    id: 'dq3',
    title: 'Gagne 50 XP',
    description: 'Accumule 50 points d\'expérience aujourd\'hui',
    icon: '⚡',
    target: 50,
    progress: 30,
    xpReward: 25,
    coinsReward: 20,
    completed: false,
    type: 'xp'
  }
]

// ─────────────────────────────────────────────────────────────────────────────
// COFFRE QUOTIDIEN
// ─────────────────────────────────────────────────────────────────────────────

export const mockDailyChest: DailyChestState = {
  available: true,
  lastOpened: null,
  reward: {
    xp: 25,
    coins: 15,
    message: 'Ton coffre quotidien t\'a récompensé !'
  }
}
