import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  Signalement, 
  SignalementFilters, 
  SignalementSort, 
  SignalementStats,
  ModerationDecision,
  ModerationResult 
} from '~/types/signalement'

// Données de démonstration
const DEMO_SIGNALEMENTS: Signalement[] = [
  {
    id: 's1',
    contenu: {
      id: 'c1',
      title: 'Bases de la grammaire française',
      description: 'Cours complet pour débutants',
      type: 'course',
      url: '/courses/c1',
      language: { id: '1', name: 'Français', code: 'fr' },
      level: { id: 'l1', name: 'Débutant', code: 'A1' },
      module: { id: 'm1', title: 'Grammaire fondamentale' },
      parcours: { id: 'p1', title: 'Parcours complet' },
      auteur: { id: 'a1', firstName: 'Jean', lastName: 'DOE', email: 'jean.doe@example.com' }
    },
    contenuId: 'c1',
    reason: 'Contenu inapproprié',
    description: 'Le contenu contient des erreurs manifestes et peut induire les apprenants en erreur.',
    gravity: 'urgent',
    status: 'pending',
    reportedBy: { id: 'u1', firstName: 'Marie', lastName: 'DURAND', email: 'marie@example.com' },
    createdAt: '2024-03-20T10:00:00Z',
    moderationAction: 'none'
  },
  {
    id: 's2',
    contenu: {
      id: 'c2',
      title: 'Anglais professionnel - Niveau intermédiaire',
      description: 'Cours d\'anglais des affaires',
      type: 'course',
      url: '/courses/c2',
      language: { id: '2', name: 'Anglais', code: 'en' },
      level: { id: 'l3', name: 'Intermédiaire', code: 'B1' },
      module: { id: 'm2', title: 'Anglais professionnel' },
      parcours: { id: 'p2', title: 'Carrière' },
      auteur: { id: 'a2', firstName: 'Sophie', lastName: 'BERNARD', email: 'sophie@example.com' }
    },
    contenuId: 'c2',
    reason: 'Contenu incomplet',
    description: 'Le cours s\'arrête brutalement et les dernières leçons ne sont pas accessibles.',
    gravity: 'normal',
    status: 'pending',
    reportedBy: { id: 'u2', firstName: 'Pierre', lastName: 'MARTIN', email: 'pierre@example.com' },
    createdAt: '2024-03-19T14:30:00Z',
    moderationAction: 'none'
  },
  {
    id: 's3',
    contenu: {
      id: 'c3',
      title: 'Quiz de grammaire espagnole',
      description: 'Testez vos connaissances',
      type: 'quiz',
      url: '/quizzes/c3',
      language: { id: '3', name: 'Espagnol', code: 'es' },
      level: { id: 'l2', name: 'Intermédiaire', code: 'B1' },
      module: { id: 'm3', title: 'Grammaire espagnole' },
      auteur: { id: 'a3', firstName: 'Luc', lastName: 'PETIT', email: 'luc@example.com' }
    },
    contenuId: 'c3',
    reason: 'Erreurs dans les réponses',
    description: 'Plusieurs réponses marquées comme fausses sont en fait correctes.',
    gravity: 'normal',
    status: 'pending',
    reportedBy: { id: 'u3', firstName: 'Emma', lastName: 'DUBOIS', email: 'emma@example.com' },
    createdAt: '2024-03-18T09:15:00Z',
    moderationAction: 'none'
  },
  {
    id: 's4',
    contenu: {
      id: 'a4',
      title: 'Profil formateur - Jean Dupont',
      description: 'Formateur de français',
      type: 'formateur',
      url: '/formateurs/a4',
      language: { id: '1', name: 'Français', code: 'fr' },
      level: { id: 'l1', name: 'Débutant', code: 'A1' },
      module: { id: 'm1', title: 'Grammaire fondamentale' },
      auteur: { id: 'a1', firstName: 'Jean', lastName: 'DUPONT', email: 'jean.dupont@example.com' }
    },
    contenuId: 'a4',
    reason: 'Comportement inapproprié',
    description: 'Le formateur répond de manière aggressive aux questions des apprenants.',
    gravity: 'urgent',
    status: 'pending',
    reportedBy: { id: 'u4', firstName: 'Thomas', lastName: 'ROBERT', email: 'thomas@example.com' },
    createdAt: '2024-03-17T16:45:00Z',
    moderationAction: 'none'
  },
  {
    id: 's5',
    contenu: {
      id: 'c4',
      title: 'Exercices de vocabulaire avancé',
      description: 'Plus de 500 exercices',
      type: 'exercise',
      url: '/exercises/c4',
      language: { id: '1', name: 'Français', code: 'fr' },
      level: { id: 'l4', name: 'Avancé', code: 'C1' },
      module: { id: 'm4', title: 'Vocabulaire avancé' },
      auteur: { id: 'a1', firstName: 'Jean', lastName: 'DOE', email: 'jean.doe@example.com' }
    },
    contenuId: 'c4',
    reason: 'Contenu superficiel',
    description: 'Les exercices ne couvrent pas le vocabulaire avancé promis.',
    gravity: 'low',
    status: 'processed',
    reportedBy: { id: 'u5', firstName: 'Sarah', lastName: 'MOREL', email: 'sarah@example.com' },
    createdAt: '2024-03-10T11:00:00Z',
    processedAt: '2024-03-15T14:00:00Z',
    moderationAction: 'processed',
    moderationComment: 'Le contenu a été mis à jour par le formateur.',
    moderatorId: 'g1',
    moderatorName: 'Admin Gestionnaire'
  },
  {
    id: 's6',
    contenu: {
      id: 'c5',
      title: 'Module Allemand A1',
      description: 'Cours d\'allemand pour débutants',
      type: 'module',
      url: '/modules/c5',
      language: { id: '4', name: 'Allemand', code: 'de' },
      level: { id: 'l1', name: 'Débutant', code: 'A1' },
      module: { id: 'm5', title: 'Allemand fondamental' },
      auteur: { id: 'a5', firstName: 'Anna', lastName: 'SCHMITT', email: 'anna@example.com' }
    },
    contenuId: 'c5',
    reason: 'Contenu dupliqué',
    description: 'Ce module existe déjà sous un autre nom.',
    gravity: 'normal',
    status: 'rejected',
    reportedBy: { id: 'u6', firstName: 'Lucas', lastName: 'WEBER', email: 'lucas@example.com' },
    createdAt: '2024-03-05T08:30:00Z',
    processedAt: '2024-03-08T10:00:00Z',
    moderationAction: 'rejected',
    moderationComment: 'Les contenus sont différents malgré des thématiques similaires.',
    moderatorId: 'g1',
    moderatorName: 'Admin Gestionnaire'
  },
  {
    id: 's7',
    contenu: {
      id: 'c6',
      title: 'Leçon 5 - Les verbes irréguliers',
      description: 'Cours de conjugaison',
      type: 'lesson',
      url: '/lessons/c6',
      language: { id: '2', name: 'Anglais', code: 'en' },
      level: { id: 'l2', name: 'Intermédiaire', code: 'B1' },
      module: { id: 'm6', title: 'Conjugaison anglaise' },
      parcours: { id: 'p6', title: 'Perfectionnement' },
      auteur: { id: 'a2', firstName: 'Sophie', lastName: 'BERNARD', email: 'sophie@example.com' }
    },
    contenuId: 'c6',
    reason: 'Lien mort',
    description: 'Les fichiers audio ne se chargent pas.',
    gravity: 'urgent',
    status: 'pending',
    reportedBy: { id: 'u7', firstName: 'Claire', lastName: 'FONTAINE', email: 'claire@example.com' },
    createdAt: '2024-03-21T07:00:00Z',
    moderationAction: 'none'
  },
  {
    id: 's8',
    contenu: {
      id: 'c7',
      title: 'Quiz final - Italien',
      description: 'Évaluation finale',
      type: 'quiz',
      url: '/quizzes/c7',
      language: { id: '5', name: 'Italien', code: 'it' },
      level: { id: 'l3', name: 'Intermédiaire', code: 'B1' },
      module: { id: 'm7', title: 'Évaluation italien' },
      auteur: { id: 'a6', firstName: 'Marco', lastName: 'ROSSI', email: 'marco@example.com' }
    },
    contenuId: 'c7',
    reason: 'Problème technique',
    description: 'Le quiz plante systématiquement à la question 10.',
    gravity: 'normal',
    status: 'pending',
    reportedBy: { id: 'u8', firstName: 'Julie', lastName: 'LAMBERT', email: 'julie@example.com' },
    createdAt: '2024-03-20T15:20:00Z',
    moderationAction: 'none'
  }
]

export const useSignalementStore = defineStore('signalement', () => {
  // State
  const signalements = ref<Signalement[]>([])
  const currentSignalement = ref<Signalement | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Filtres
  const filters = ref<SignalementFilters>({
    status: 'all',
    type: 'all',
    languageId: undefined,
    formateurId: undefined,
    gravity: 'all',
    dateFrom: undefined,
    dateTo: undefined,
    search: ''
  })
  
  // Tri
  const sort = ref<SignalementSort>({
    field: 'createdAt',
    order: 'desc'
  })
  
  // Pagination
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Computed
  const filteredSignalements = computed(() => {
    let result = [...signalements.value]
    
    // Filtre par statut
    if (filters.value.status && filters.value.status !== 'all') {
      result = result.filter(s => s.status === filters.value.status)
    }
    
    // Filtre par type
    if (filters.value.type && filters.value.type !== 'all') {
      result = result.filter(s => s.contenu.type === filters.value.type)
    }
    
    // Filtre par langue
    if (filters.value.languageId) {
      result = result.filter(s => s.contenu.language.id === filters.value.languageId)
    }
    
    // Filtre par formateur
    if (filters.value.formateurId) {
      result = result.filter(s => s.contenu.auteur.id === filters.value.formateurId)
    }
    
    // Filtre par gravité
    if (filters.value.gravity && filters.value.gravity !== 'all') {
      result = result.filter(s => s.gravity === filters.value.gravity)
    }
    
    // Filtre par date (from)
    if (filters.value.dateFrom) {
      const fromDate = new Date(filters.value.dateFrom)
      result = result.filter(s => new Date(s.createdAt) >= fromDate)
    }
    
    // Filtre par date (to)
    if (filters.value.dateTo) {
      const toDate = new Date(filters.value.dateTo)
      result = result.filter(s => new Date(s.createdAt) <= toDate)
    }
    
    // Filtre par recherche
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      result = result.filter(s => 
        s.contenu.title.toLowerCase().includes(searchLower) ||
        s.reason.toLowerCase().includes(searchLower) ||
        s.reportedBy.firstName.toLowerCase().includes(searchLower) ||
        s.reportedBy.lastName.toLowerCase().includes(searchLower)
      )
    }
    
    // Tri
    result.sort((a, b) => {
      let comparison = 0
      
      switch (sort.value.field) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'gravity':
          const gravityOrder = { urgent: 0, normal: 1, low: 2 }
          comparison = gravityOrder[a.gravity] - gravityOrder[b.gravity]
          break
        case 'status':
          const statusOrder = { pending: 0, processed: 1, rejected: 2 }
          comparison = statusOrder[a.status] - statusOrder[b.status]
          break
      }
      
      return sort.value.order === 'asc' ? comparison : -comparison
    })
    
    return result
  })
  
  const paginatedSignalements = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.limit
    const end = start + pagination.value.limit
    return filteredSignalements.value.slice(start, end)
  })
  
  const stats = computed((): SignalementStats => {
    return {
      total: signalements.value.length,
      pending: signalements.value.filter(s => s.status === 'pending').length,
      processed: signalements.value.filter(s => s.status === 'processed').length,
      rejected: signalements.value.filter(s => s.status === 'rejected').length,
      urgent: signalements.value.filter(s => s.gravity === 'urgent' && s.status === 'pending').length
    }
  })
  
  // Actions
  async function fetchSignalements(page = 1) {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      signalements.value = DEMO_SIGNALEMENTS
      pagination.value = {
        page: 1,
        limit: 10,
        total: DEMO_SIGNALEMENTS.length,
        totalPages: 1
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des signalements'
      console.error('Erreur fetchSignalements:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  async function fetchSignalementDetail(id: string): Promise<Signalement | null> {
    isLoading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const signalement = DEMO_SIGNALEMENTS.find(s => s.id === id)
      if (signalement) {
        currentSignalement.value = signalement
        return signalement
      }
      
      error.value = 'Signalement introuvable'
      return null
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des détails'
      console.error('Erreur fetchSignalementDetail:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  async function processSignalement(decision: ModerationDecision): Promise<ModerationResult> {
    isLoading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mise à jour locale
      const index = signalements.value.findIndex(s => s.id === decision.signalementId)
      if (index !== -1) {
        signalements.value[index].status = decision.action === 'rejected' ? 'rejected' : 'processed'
        signalements.value[index].processedAt = new Date().toISOString()
        signalements.value[index].moderationAction = decision.action
        signalements.value[index].moderationComment = decision.comment
        signalements.value[index].moderatorId = 'g1'
        signalements.value[index].moderatorName = 'Admin Gestionnaire'
      }
      
      // Journalisation
      console.log(`[AUDIT] Signalement ${decision.signalementId} traité: ${decision.action}. Commentaire: ${decision.comment || 'Aucun'}`)
      
      const messages: Record<string, string> = {
        content_disabled: 'Contenu désactivé avec succès',
        content_deleted: 'Contenu supprimé définitivement',
        formator_suspended: 'Formateur suspendu avec succès',
        rejected: 'Signalement rejeté',
        processed: 'Signalement marqué comme traité'
      }
      
      return { success: true, message: messages[decision.action] || 'Action effectuée' }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du traitement'
      console.error('Erreur processSignalement:', err)
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }
  
  // Filtres
  function setFilter(key: keyof SignalementFilters, value: any) {
    if (key === 'search') {
      filters.value.search = value
    } else if (value === '' || value === 'all') {
      (filters.value as any)[key] = undefined
    } else {
      (filters.value as any)[key] = value
    }
    pagination.value.page = 1
  }
  
  function setSort(field: SignalementSort['field'], order: SignalementSort['order']) {
    sort.value = { field, order }
  }
  
  function resetFilters() {
    filters.value = {
      status: 'all',
      type: 'all',
      languageId: undefined,
      formateurId: undefined,
      gravity: 'all',
      dateFrom: undefined,
      dateTo: undefined,
      search: ''
    }
    pagination.value.page = 1
  }
  
  function setPage(page: number) {
    pagination.value.page = page
  }
  
  function clearError() {
    error.value = null
  }

  // Helpers UI
function getActionBadge(action?: string) {
  const badges = {
    none: {
      class: 'bg-slate-100 text-slate-700 border-slate-200',
      label: 'Aucune'
    },
    processed: {
      class: 'bg-green-100 text-green-700 border-green-200',
      label: 'Traité'
    },
    rejected: {
      class: 'bg-red-100 text-red-700 border-red-200',
      label: 'Rejeté'
    },
    content_disabled: {
      class: 'bg-orange-100 text-orange-700 border-orange-200',
      label: 'Contenu désactivé'
    },
    content_deleted: {
      class: 'bg-red-100 text-red-700 border-red-200',
      label: 'Contenu supprimé'
    },
    formator_suspended: {
      class: 'bg-purple-100 text-purple-700 border-purple-200',
      label: 'Formateur suspendu'
    }
  }

  return badges[action as keyof typeof badges] ?? badges.none
}
  
  return {
    // State
    signalements,
    currentSignalement,
    isLoading,
    error,
    filters,
    sort,
    pagination,
    
    // Computed
    filteredSignalements,
    paginatedSignalements,
    stats,
    
    // Actions
    fetchSignalements,
    fetchSignalementDetail,
    processSignalement,
    setFilter,
    setSort,
    resetFilters,
    setPage,
    clearError,
    getActionBadge
  }
})

