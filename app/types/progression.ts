import type { ApiResponse } from '~/types/learning'

export interface ProgressionStats {
  totalLevels: number
  completedLevels: number
  totalModules: number
  completedModules: number
  totalPaths: number
  completedPaths: number
  totalSteps: number
  completedSteps: number
  overallProgressPercentage: number
  totalEstimatedHours: number
  completedEstimatedHours: number
}

export interface LanguageInfo {
  id: string
  code?: string
  name?: string
  description?: string
  iconUrl?: string
  isActive?: boolean
  index?: number
}

export interface OverallProgress {
  status?: string
  overallProgress?: number
  totalXp?: number
  totalTimeMinutes?: number
  startedAt?: string
  completedAt?: string | null
  lastAccessedAt?: string | null
}

export interface BaseProgression {
  overallProgress?: OverallProgress
}

export interface CompleteProgression {
  user?: string
  language?: LanguageInfo
  overallProgress?: OverallProgress
}

export type ProgressionResponse = ApiResponse<BaseProgression>
export type CompleteProgressionResponse = ApiResponse<CompleteProgression>
export type ProgressionStatsResponse = ApiResponse<ProgressionStats>
