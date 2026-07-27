
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
  id: string;                // fourni par le backend
  languageId: string;        // lien vers la langue
  code: string;
  name: string;
  description?: string;
  index: number;             // ordre du niveau
  isActive: boolean;
  stats?: {
    coursesCount: number;
    exercisesCount: number;
    stepsCount: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Step {
  id: string
  pathId: string
  title: string
  description?: string
  stepType: 'lesson' | 'exercise' | 'quiz'
  index: number
  estimatedMinutes: number
  isActive: boolean
  content?: any
  createdAt?: string
  updatedAt?: string
}

export interface CreateStepRequest {
  pathId: string
  learningPathId?: string 
  title: string
  description?: string
  stepType: 'lesson' | 'exercise' | 'quiz'
  index?: number
  stepNumber?: number 
  estimatedMinutes?: number
  isActive?: boolean
  content?: any
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

export type LessonSectionType =
  | 'introduction'
  | 'main'
  | 'transcript'
  | 'example'
  | 'example_audio'
  | 'key_points'

export type LessonContentType = 'text' | 'video' | 'audio' | 'pdf' | 'image'

export interface LessonBlock {
  id?: string
  lessonId?: string
  sectionType: LessonSectionType
  contentType: LessonContentType
  content: string
  caption?: string | null
  index: number
  order?: number
}

export interface LessonBlockCreateRequest {
  sectionType: LessonSectionType
  contentType: LessonContentType
  content: string
  caption?: string | null
  index?: number
}

export interface LessonBlockUpdateRequest extends Partial<LessonBlockCreateRequest> {}

export interface LessonBlockReorderRequest {
  orderedIds: string[]
}

export interface Course {
  id: string
  stepId: string
  title: string
  summary?: string | null
  description?: string
  contentType?: 'video' | 'audio' | 'text' | 'pdf' | 'image'
  content?: string
  attachments?: true | unknown[]
  isActive?: boolean
  blocks?: LessonBlock[]
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
  correctAnswer: string | string[] | number
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
  isActive?: boolean
}

export interface CreateCourseRequest {
  stepId: string
  title: string
  summary?: string | null
  description?: string
  contentType?: 'video' | 'audio' | 'text' | 'pdf' | 'image'
  content?: string
  attachments?: true | unknown[]
  isActive?: boolean
}

export interface UpdateCourseRequest {
  title?: string
  summary?: string | null
  description?: string
  contentType?: 'video' | 'audio' | 'text' | 'pdf' | 'image'
  content?: string
  attachments?: true | unknown[]
  isActive?: boolean
}
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}
// export type ProgressStatus = 'locked' | 'unlocked' | 'started' | 'completed'
// export type ProgressStepType = 'lesson' | 'exercise' | 'quiz'

// export interface ProgressionLanguaexport interface ApiResponse<T> {
//   success: boolean
//   data?: T
//   message?: string
// }

// export interface PaginatedResponse<T> {
//   success: boolean
//   data: T[]
//   pagination: {
//     page: number
//     limit: number
//     total: number
//     totalPages: number
//   }
// }
