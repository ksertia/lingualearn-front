export type MascotMood =
  | 'happy'
  | 'excited'
  | 'celebrating'
  | 'sad'
  | 'encouraging'
  | 'thinking'
  | 'proud'
  | 'surprised'
  | 'worried'
  | 'resting'
  | 'focused'
  | 'victory'

export type MascotContext =
  | 'greeting'
  | 'lesson_start'
  | 'lesson_complete'
  | 'quiz_start'
  | 'quiz_correct'
  | 'quiz_wrong'
  | 'quiz_complete_win'
  | 'quiz_complete_lose'
  | 'badge_unlock'
  | 'level_up'
  | 'streak'
  | 'daily_reminder'
  | 'encouragement'
  | 'parcours_complete'
  | 'chest_open'
  | 'quest_complete'

export type MascotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface MascotCharacter {
  id: string
  name: string
  image: string
  personality: string
  tagline: string
  color: string
}

export interface MascotConfig {
  character: string
  mood: MascotMood
  message: string
  animated?: boolean
  size?: MascotSize
  position?: 'left' | 'right' | 'center'
}

export interface DailyQuest {
  id: string
  title: string
  description: string
  icon: string
  target: number
  progress: number
  xpReward: number
  coinsReward: number
  completed: boolean
  type: 'lesson' | 'quiz' | 'streak' | 'xp'
}

export interface DailyChestState {
  available: boolean
  lastOpened: string | null
  reward: {
    xp: number
    coins: number
    message: string
  }
}
