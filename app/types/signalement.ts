// Types pour la Gestion des Signalements (Gestionnaire)

// Types de contenus pouvant être signalés
export type SignalementType = 'course' | 'lesson' | 'quiz' | 'formateur' | 'module' | 'other'

// Statut du signalement
export type SignalementStatus = 'pending' | 'processed' | 'rejected'

// Gravité du signalement
export type SignalementGravity = 'urgent' | 'normal' | 'low'

// Action de modération prise
export type ModerationAction = 'none' | 'content_disabled' | 'formateur_suspended' | 'content_deleted' | 'rejected' | 'processed'

// Hiérarchie pédagogique
export interface SignalementLanguage {
  id: string
  name: string
  code: string
}

export interface SignalementLevel {
  id: string
  name: string
  code: string
}

export interface SignalementModule {
  id: string
  title: string
}

export interface SignalementParcours {
  id: string
  title: string
}

export interface SignalementStep {
  id: string
  title: string
}

// Formateur (auteur du contenu)
export interface SignalementFormateur {
  id: string
  firstName: string
  lastName: string
  email: string
}

// Utilisateur qui a signalé
export interface SignalementUser {
  id: string
  firstName: string
  lastName: string
  email: string
}
export interface SignalementContenu {
  id: string
  title: string
  description: string
  type: SignalementType
  url?: string
  
  // Hiérarchie pédagogique
  language: SignalementLanguage
  level: SignalementLevel
  module: SignalementModule
  parcours?: SignalementParcours
  step?: SignalementStep
  
  // Auteur du contenu
  auteur: SignalementFormateur
}

// Signalement principal
export interface Signalement {
  id: string
  
  // Type et contenu signalé
  contenu: SignalementContenu
  contenuId: string
  
  // Motif
  reason: string
  description: string
  gravity: SignalementGravity
  
  // Statut
  status: SignalementStatus
  
  // Utilisateur ayant signalé
  reportedBy: SignalementUser
  
  // Dates
  createdAt: string
  processedAt?: string
  
  // Modération
  moderationAction: ModerationAction
  moderationComment?: string
  moderatorId?: string
  moderatorName?: string
}

// Filtres pour la recherche
export interface SignalementFilters {
  status?: SignalementStatus | 'all'
  type?: SignalementType | 'all'
  languageId?: string
  formateurId?: string
  gravity?: SignalementGravity | 'all'
  dateFrom?: string
  dateTo?: string
  search?: string
}

// Options de tri
export type SignalementSortField = 'createdAt' | 'gravity' | 'status'
export type SignalementSortOrder = 'asc' | 'desc'

export interface SignalementSort {
  field: SignalementSortField
  order: SignalementSortOrder
}

// Réponse paginée
export interface SignalementsResponse {
  success: boolean
  data: {
    signalements: Signalement[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

// Statistiques des signalements
export interface SignalementStats {
  total: number
  pending: number
  processed: number
  rejected: number
  urgent: number
}

// Action de modération à effectuer
export interface ModerationDecision {
  signalementId: string
  action: ModerationAction
  comment?: string
  disableContent?: boolean
  suspendFormateur?: boolean
  deleteContent?: boolean
}

// Résultat d'action de modération
export interface ModerationResult {
  success: boolean
  message: string
}

// Journal d'audit
export interface SignalementAuditLog {
  id: string
  signalementId: string
  action: ModerationAction
  performedBy: string
  performedAt: string
  details?: string
}

