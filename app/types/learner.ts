export type NodeStatus = 'completed' | 'current' | 'locked'
export type NodeType = 'lesson' | 'quiz' | 'review' | 'checkpoint' | 'bonus'
export type ContentBlockType = 'text' | 'image' | 'video' | 'audio'
export type QuestionType = 'mcq' | 'true_false' | 'fill_blank' | 'match'
export type ParcoursStatus = 'not_started' | 'in_progress' | 'completed'
export type BadgeCategory = 'streak' | 'xp' | 'completion' | 'special'

export interface LearnerLanguage {
  id: string
  name: string
  code: string
  flag: string
  coverImage: string
  currentLevel: string
  progressPercent: number
  totalXP: number
  parcoursCount: number
  color: string
}

export interface PathNode {
  id: string
  parcoursId: string
  order: number
  type: NodeType
  title: string
  status: NodeStatus
  xpReward: number
  duration: number
  icon: string
}

export interface LearnerParcours {
  id: string
  languageId: string
  title: string
  description: string
  coverImage: string
  totalNodes: number
  completedNodes: number
  xpReward: number
  status: ParcoursStatus
  nodes: PathNode[]
}

export interface ContentBlock {
  id: string
  type: ContentBlockType
  order: number
  text?: string
  imageUrl?: string
  imageAlt?: string
  videoUrl?: string
  audioLabel?: string
}

export interface Lesson {
  id: string
  nodeId: string
  parcoursId: string
  title: string
  subtitle: string
  xpReward: number
  duration: number
  blocks: ContentBlock[]
}

export interface QuizOption {
  id: string
  text: string
}

export interface MatchPair {
  left: string
  right: string
}

export interface QuizQuestion {
  id: string
  type: QuestionType
  question: string
  imageUrl?: string
  options?: QuizOption[]
  correctAnswer: string | string[]
  explanation: string
  pairs?: MatchPair[]
  blankAnswer?: string
}

export interface Quiz {
  id: string
  nodeId: string
  parcoursId: string
  title: string
  xpReward: number
  heartsAllowed: number
  questions: QuizQuestion[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  bgColor: string
  category: BadgeCategory
  unlocked: boolean
  progress: number
  maxProgress: number
  unlockedAt: string
}

export interface LearnerStats {
  xp: number
  level: number
  levelTitle: string
  xpToNextLevel: number
  streak: number
  maxStreak: number
  coins: number
  hearts: number
  totalLessonsCompleted: number
  totalQuizzesCompleted: number
  totalBadges: number
  studyMinutesTotal: number
  weeklyXP: number[]
  weeklyGoalXP: number
}

export interface QuizResult {
  quizId: string
  score: number
  totalQuestions: number
  xpEarned: number
  coinsEarned: number
  passed: boolean
}

export interface LessonProgress {
  nodeId: string
  completed: boolean
  completedAt?: string
  xpEarned: number
}
