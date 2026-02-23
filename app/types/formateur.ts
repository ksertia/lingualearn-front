// Types pour la gestion des formateurs

export interface Formateur {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  isSuspended: boolean
  createdAt: string
  lastActive?: string
  language?: {
    id: string
    name: string
    code: string
  }
  stats: FormateurStats
  reports: FormateurReport[]
}

export interface FormateurStats {
  totalModules: number
  activeModules: number
  totalSteps: number
  totalCourses: number
  totalExercises: number
  totalQuizzes: number
  lastPublicationDate?: string
}

export interface FormateurReport {
  id: string
  reason: string
  status: 'pending' | 'resolved' | 'dismissed'
  createdAt: string
  reportedBy: string
}

export interface FormateurModule {
  id: string
  title: string
  description?: string
  isActive: boolean
  isPublished: boolean
  createdAt: string
  publishedAt?: string
  stepsCount: number
  coursesCount: number
  exercisesCount: number
  quizzesCount: number
}

export interface FormateursResponse {
  success: boolean
  data: {
    formateurs: Formateur[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface FormateurDetailResponse {
  success: boolean
  data: Formateur & {
    modules: FormateurModule[]
  }
}

export interface FormateurStatsSummary {
  total: number
  active: number
  suspended: number
  withReports: number
}

