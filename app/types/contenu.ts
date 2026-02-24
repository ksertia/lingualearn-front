// Types pour la Gestion des Contenus (Gestionnaire)

// Hiérarchie pédagogique
export interface ContenuLanguage {
  id: string
  name: string
  code: string
}

export interface ContenuLevel {
  id: string
  name: string
  code: string
}

export interface ContenuModule {
  id: string
  title: string
}

export interface ContenuParcours {
  id: string
  title: string
}

export interface ContenuStep {
  id: string
  title: string
}

// Formateur (auteur du contenu)
export interface ContenuFormateur {
  id: string
  firstName: string
  lastName: string
  email: string
}

// Type de contenu
export type ContenuType = 'course' | 'exercise' | 'quiz'

// Statut du contenu
export type ContenuStatus = 'active' | 'disabled'

// Contenu principal
export interface Contenu {
  id: string
  title: string
  description: string
  type: ContenuType
  status: ContenuStatus
  
  // Hiérarchie pédagogique
  language: ContenuLanguage
  level: ContenuLevel
  module: ContenuModule
  parcours?: ContenuParcours
  step?: ContenuStep
  
  // Auteur
  auteur: ContenuFormateur
  
  // Dates
  createdAt: string
  publishedAt?: string
  updatedAt?: string
  
  // Statistiques
  stats: ContenuStats
  
  // Gestionnaire a désactivé ce contenu
  disabledByGestionnaire?: boolean
  disabledAt?: string
  disabledReason?: string
}

// Statistiques d'un contenu
export interface ContenuStats {
  enrolledCount: number
  completionRate: number
  averageScore: number
  reportsCount: number
}

// Filtres pour la recherche de contenus
export interface ContenuFilters {
  languageId?: string
  levelId?: string
  moduleId?: string
  formateurId?: string
  status?: ContenuStatus | 'all'
  dateFrom?: string
  dateTo?: string
  minEnrolled?: number
  maxEnrolled?: number
  search?: string
}

// Options de tri
export type ContenuSortField = 'publishedAt' | 'enrolledCount' | 'language' | 'level' | 'title'
export type ContenuSortOrder = 'asc' | 'desc'

export interface ContenuSort {
  field: ContenuSortField
  order: ContenuSortOrder
}

// Réponse paginée
export interface ContenusResponse {
  success: boolean
  data: {
    contenus: Contenu[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

// Réponse détaillée d'un contenu
export interface ContenuDetailResponse {
  success: boolean
  data: Contenu
}

// Statistiques globales des contenus
export interface ContenuStatsSummary {
  total: number
  active: number
  disabled: number
  publishedToday: number
  publishedThisWeek: number
  publishedThisMonth: number
  totalEnrolled: number
}

// Journal d'audit pour les actions du gestionnaire
export interface ContenuAuditLog {
  id: string
  contenuId: string
  contenuTitle: string
  action: 'disable' | 'enable' | 'delete' | 'view_details'
  performedBy: string
  performedAt: string
  details?: string
}

// Actions sur le contenu
export interface ContenuAction {
  contenuId: string
  action: 'disable' | 'enable' | 'delete'
  reason?: string
}

// Résultats d'action
export interface ContenuActionResult {
  success: boolean
  message: string
}

