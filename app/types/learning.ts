export interface LearningPath {
  id: string
  title: string
  description: string
  code?: string
  thumbnailUrl?: string
  bannerUrl?: string
  colorCode?: string
  iconUrl?: string
  estimatedDurationWeeks?: number
  isPublished?: boolean
  sortOrder?: number
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  levels?: Level[]
}

export interface Level {
  id: string
  learningPathId: string
  name: string
  description: string
  levelNumber?: number
  estimatedDurationHours?: number
  isPublished?: boolean
  sortOrder?: number
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  steps?: Step[]
}

export interface Step {
  id: string
  levelId: string
  title: string
  description?: string
  stepNumber: number
  estimatedDurationMinutes?: number
  isPublished?: boolean
  sortOrder?: number
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  exercises?: Exercise[]
  stepQuiz?: StepQuiz
}

export interface Exercise {
  id: string
  lessonId?: string
  stepId?: string
  title: string
  exerciseType: 'multiple_choice' | 'fill_blank' | 'matching'
  instructions?: string
  content: Record<string, any>
  correctAnswers: Record<string, any>
  hints?: Record<string, any>
  explanation?: string
  points?: number
  xpReward?: number
  coinReward?: number
  maxAttempts?: number
  timeLimitSeconds?: number
  sortOrder?: number
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Course {
  id: string
  stepId: string
  title: string
  description?: string
  contentType: 'video' | 'audio' | 'text' | 'pdf'
  contentUrl: string
  duration?: number
  order?: number
  isPublished?: boolean
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface StepQuiz {
  id: string
  stepId: string
  title: string
  description?: string
  questions: QuizQuestion[]
  passingScore?: number
  maxAttempts?: number
  timeLimitMinutes?: number
  xpReward?: number
  coinReward?: number
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface QuizQuestion {
  id: string
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank'
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  points?: number
}

export interface CreateLearningPathRequest {
  title: string
  description: string
  isPublished?: boolean
}

export interface CreateLevelRequest {
  name: string
  description: string
  learningPathId: string
}

export interface CreateStepRequest {
  levelId: string
  title: string
  stepNumber: number
}

export interface CreateExerciseRequest {
  lessonId: string
  title: string
  exerciseType: 'multiple_choice' | 'fill_blank' | 'matching'
  content: Record<string, any>
  correctAnswers?: Record<string, any>
  instructions?: string
  hints?: Record<string, any>
  explanation?: string
  points?: number
  xpReward?: number
  coinReward?: number
  maxAttempts?: number
  timeLimitSeconds?: number
  sortOrder?: number
  isActive?: boolean
}

export interface CreateStepQuizRequest {
  stepId: string
  title: string
  description?: string
  questions: QuizQuestion[]
  passingScore?: number
  maxAttempts?: number
  timeLimitMinutes?: number
  xpReward?: number
  coinReward?: number
}

export interface CreateCourseRequest {
  stepId: string
  title: string
  description?: string
  contentType: 'video' | 'audio' | 'text' | 'pdf'
  contentUrl: string
  duration?: number
  order?: number
  isPublished?: boolean
  isActive?: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
