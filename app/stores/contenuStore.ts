import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApiService } from '~/services/api'
import type { 
  Contenu, 
  ContenuFilters, 
  ContenuSort, 
  ContenuStatsSummary, 
  ContenuDetailResponse,
  ContenuActionResult 
} from '~/types/contenu'

// Données de démonstration
const DEMO_CONTENUS: Contenu[] = [
  {
    id: 'c1',
    title: 'Bases de la grammaire française',
    description: 'Cours complet pour maîtriser les fondamentaux de la grammaire française',
    type: 'course',
    status: 'active',
    language: { id: '1', name: 'Français', code: 'fr' },
    level: { id: 'l1', name: 'Débutant', code: 'A1' },
    module: { id: 'm1', title: 'Grammaire fondamentale' },
    parcours: { id: 'p1', title: 'Parcours complet' },
    step: { id: 's1', title: 'Leçons 1-10' },
    auteur: { id: 'a1', firstName: 'Jean', lastName: 'DOE', email: 'jean.doe@example.com' },
    createdAt: '2024-01-15T10:00:00Z',
    publishedAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
    stats: {
      enrolledCount: 245,
      completionRate: 78,
      averageScore: 82,
      reportsCount: 2
    }
  },
  {
    id: 'c2',
    title: 'Anglais professionnel - Niveau intermédiaire',
    description: 'Maîtrisez l\'anglais des affaires',
    type: 'course',
    status: 'active',
    language: { id: '2', name: 'Anglais', code: 'en' },
    level: { id: 'l3', name: 'Intermédiaire', code: 'B1' },
    module: { id: 'm2', title: 'Anglais professionnel' },
    parcours: { id: 'p2', title: 'Parcours carrière' },
    step: { id: 's2', title: 'Module 1' },
    auteur: { id: 'a2', firstName: 'Marie', lastName: 'DURAND', email: 'marie.durand@example.com' },
    createdAt: '2024-02-01T08:00:00Z',
    publishedAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-03-18T16:45:00Z',
    stats: {
      enrolledCount: 189,
      completionRate: 65,
      averageScore: 75,
      reportsCount: 0
    }
  },
  {
    id: 'c3',
    title: 'Exercices de vocabulaire avancé',
    description: 'Plus de 500 exercices pour enrichir votre vocabulaire',
    type: 'exercise',
    status: 'disabled',
    language: { id: '1', name: 'Français', code: 'fr' },
    level: { id: 'l4', name: 'Avancé', code: 'C1' },
    module: { id: 'm3', title: 'Vocabulaire avancé' },
    parcours: { id: 'p3', title: 'Perfectionnement' },
    step: { id: 's3', title: 'Vocabulaire thématique' },
    auteur: { id: 'a1', firstName: 'Jean', lastName: 'DOE', email: 'jean.doe@example.com' },
    createdAt: '2023-11-20T12:00:00Z',
    publishedAt: '2023-12-01T09:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
    stats: {
      enrolledCount: 56,
      completionRate: 90,
      averageScore: 88,
      reportsCount: 5
    },
    disabledByGestionnaire: true,
    disabledAt: '2024-02-15T10:00:00Z',
    disabledReason: 'Contenu inapproprié signalé à plusieurs reprises'
  },
  {
    id: 'c4',
    title: 'Quiz de grammaire espagnole',
    description: 'Testez vos connaissances grammaticales',
    type: 'quiz',
    status: 'active',
    language: { id: '3', name: 'Espagnol', code: 'es' },
    level: { id: 'l2', name: 'Intermédiaire', code: 'B1' },
    module: { id: 'm4', title: 'Grammaire espagnole' },
    parcours: { id: 'p4', title: 'Apprentissage intensif' },
    step: { id: 's4', title: 'Quiz 1-5' },
    auteur: { id: 'a3', firstName: 'Pierre', lastName: 'MARTIN', email: 'pierre.martin@example.com' },
    createdAt: '2024-03-01T09:00:00Z',
    publishedAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    stats: {
      enrolledCount: 78,
      completionRate: 72,
      averageScore: 79,
      reportsCount: 1
    }
  },
  {
    id: 'c5',
    title: 'Allemand pour débutants',
    description: 'Initiation à la langue allemande',
    type: 'course',
    status: 'active',
    language: { id: '4', name: 'Allemand', code: 'de' },
    level: { id: 'l1', name: 'Débutant', code: 'A1' },
    module: { id: 'm5', title: 'Allemand fondamental' },
    parcours: { id: 'p5', title: 'Parcours découverte' },
    step: { id: 's5', title: 'Leçons 1-15' },
    auteur: { id: 'a4', firstName: 'Sophie', lastName: 'BERNARD', email: 'sophie.bernard@example.com' },
    createdAt: '2024-03-05T14:00:00Z',
    publishedAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-03-19T15:20:00Z',
    stats: {
      enrolledCount: 134,
      completionRate: 55,
      averageScore: 70,
      reportsCount: 0
    }
  },
  {
    id: 'c6',
    title: 'Conversation anglaise - Niveau avancé',
    description: 'Perfectionnez votre prononciation et fluidité',
    type: 'course',
    status: 'disabled',
    language: { id: '2', name: 'Anglais', code: 'en' },
    level: { id: 'l4', name: 'Avancé', code: 'C1' },
    module: { id: 'm6', title: 'Conversation avancée' },
    parcours: { id: 'p6', title: 'Maîtrise orale' },
    step: { id: 's6', title: 'Dialogues 1-10' },
    auteur: { id: 'a2', firstName: 'Marie', lastName: 'DURAND', email: 'marie.durand@example.com' },
    createdAt: '2024-01-10T10:00:00Z',
    publishedAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    stats: {
      enrolledCount: 42,
      completionRate: 80,
      averageScore: 85,
      reportsCount: 3
    },
    disabledByGestionnaire: true,
    disabledAt: '2024-03-01T09:00:00Z',
    disabledReason: 'Signalements de contenu'
  },
  {
    id: 'c7',
    title: 'Exercices de conjugaison française',
    description: 'Maîtrisez tous les temps du verbe',
    type: 'exercise',
    status: 'active',
    language: { id: '1', name: 'Français', code: 'fr' },
    level: { id: 'l3', name: 'Intermédiaire', code: 'B1' },
    module: { id: 'm1', title: 'Grammaire fondamentale' },
    parcours: { id: 'p1', title: 'Parcours complet' },
    step: { id: 's7', title: 'Conjugaison' },
    auteur: { id: 'a1', firstName: 'Jean', lastName: 'DOE', email: 'jean.doe@example.com' },
    createdAt: '2024-02-15T11:00:00Z',
    publishedAt: '2024-02-25T10:00:00Z',
    updatedAt: '2024-03-20T11:30:00Z',
    stats: {
      enrolledCount: 312,
      completionRate: 85,
      averageScore: 90,
      reportsCount: 0
    }
  },
  {
    id: 'c8',
    title: 'Quiz de vocabulaire italien',
    description: 'Apprenez le vocabulaire italien par thème',
    type: 'quiz',
    status: 'active',
    language: { id: '5', name: 'Italien', code: 'it' },
    level: { id: 'l2', name: 'Intermédiaire', code: 'B1' },
    module: { id: 'm7', title: 'Vocabulaire italien' },
    parcours: { id: 'p7', title: 'Apprentissage flexible' },
    step: { id: 's8', title: 'Quiz thématiques' },
    auteur: { id: 'a5', firstName: 'Luc', lastName: 'PETIT', email: 'luc.petit@example.com' },
    createdAt: '2024-03-10T08:00:00Z',
    publishedAt: '2024-03-18T09:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z',
    stats: {
      enrolledCount: 67,
      completionRate: 60,
      averageScore: 72,
      reportsCount: 1
    }
  }
]

export const useContenuStore = defineStore('contenu', () => {
  const apiService = useApiService()

  // State
  const contenus = ref<Contenu[]>([])
  const currentContenu = ref<Contenu | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Filtres
  const filters = ref<ContenuFilters>({
    languageId: undefined,
    levelId: undefined,
    moduleId: undefined,
    formateurId: undefined,
    status: 'all',
    dateFrom: undefined,
    dateTo: undefined,
    minEnrolled: undefined,
    maxEnrolled: undefined,
    search: ''
  })
  
  // Tri
  const sort = ref<ContenuSort>({
    field: 'publishedAt',
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
  const filteredContenus = computed(() => {
    let result = [...contenus.value]
    
    // Filtre par langue
    if (filters.value.languageId) {
      result = result.filter(c => c.language.id === filters.value.languageId)
    }
    
    // Filtre par niveau
    if (filters.value.levelId) {
      result = result.filter(c => c.level.id === filters.value.levelId)
    }
    
    // Filtre par module
    if (filters.value.moduleId) {
      result = result.filter(c => c.module.id === filters.value.moduleId)
    }
    
    // Filtre par formateur
    if (filters.value.formateurId) {
      result = result.filter(c => c.auteur.id === filters.value.formateurId)
    }
    
    // Filtre par statut
    if (filters.value.status && filters.value.status !== 'all') {
      result = result.filter(c => c.status === filters.value.status)
    }
    
    // Filtre par date de publication (from)
    if (filters.value.dateFrom) {
      const fromDate = new Date(filters.value.dateFrom)
      result = result.filter(c => c.publishedAt && new Date(c.publishedAt) >= fromDate)
    }
    
    // Filtre par date de publication (to)
    if (filters.value.dateTo) {
      const toDate = new Date(filters.value.dateTo)
      result = result.filter(c => c.publishedAt && new Date(c.publishedAt) <= toDate)
    }
    
    // Filtre par nombre d'inscrits (min)
    if (filters.value.minEnrolled !== undefined) {
      result = result.filter(c => c.stats.enrolledCount >= filters.value.minEnrolled!)
    }
    
    // Filtre par nombre d'inscrits (max)
    if (filters.value.maxEnrolled !== undefined) {
      result = result.filter(c => c.stats.enrolledCount <= filters.value.maxEnrolled!)
    }
    
    // Filtre par recherche (titre ou description)
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.auteur.firstName.toLowerCase().includes(searchLower) ||
        c.auteur.lastName.toLowerCase().includes(searchLower)
      )
    }
    
    // Tri
    result.sort((a, b) => {
      let comparison = 0
      
      switch (sort.value.field) {
        case 'publishedAt':
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          comparison = dateA - dateB
          break
        case 'enrolledCount':
          comparison = a.stats.enrolledCount - b.stats.enrolledCount
          break
        case 'language':
          comparison = a.language.name.localeCompare(b.language.name)
          break
        case 'level':
          comparison = a.level.name.localeCompare(b.level.name)
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
      }
      
      return sort.value.order === 'asc' ? comparison : -comparison
    })
    
    return result
  })
  
  const paginatedContenus = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.limit
    const end = start + pagination.value.limit
    return filteredContenus.value.slice(start, end)
  })
  
  const statsSummary = computed((): ContenuStatsSummary => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const publishedToday = contenus.value.filter(c => 
      c.publishedAt && new Date(c.publishedAt) >= today
    ).length
    
    const publishedThisWeek = contenus.value.filter(c => 
      c.publishedAt && new Date(c.publishedAt) >= weekAgo
    ).length
    
    const publishedThisMonth = contenus.value.filter(c => 
      c.publishedAt && new Date(c.publishedAt) >= monthAgo
    ).length
    
    const totalEnrolled = contenus.value.reduce((sum, c) => sum + c.stats.enrolledCount, 0)
    
    return {
      total: contenus.value.length,
      active: contenus.value.filter(c => c.status === 'active').length,
      disabled: contenus.value.filter(c => c.status === 'disabled').length,
      publishedToday,
      publishedThisWeek,
      publishedThisMonth,
      totalEnrolled
    }
  })
  
  // Actions
  async function fetchContenus(page = 1) {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulation d'appel API - à remplacer par le vrai appel
      // const response = await apiService.getAllContents({ page, limit: pagination.value.limit, ...filters.value })
      
      // Utilisation des données de démo
      await new Promise(resolve => setTimeout(resolve, 500))
      
      contenus.value = DEMO_CONTENUS
      pagination.value = {
        page: 1,
        limit: 10,
        total: DEMO_CONTENUS.length,
        totalPages: 1
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des contenus'
      console.error('Erreur fetchContenus:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  async function fetchContenuDetail(id: string): Promise<Contenu | null> {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulation d'appel API
      // const response = await apiService.getContenuDetail(id)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const contenu = DEMO_CONTENUS.find(c => c.id === id)
      if (contenu) {
        currentContenu.value = contenu
        return contenu
      }
      
      error.value = 'Contenu introuvable'
      return null
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des détails'
      console.error('Erreur fetchContenuDetail:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  async function disableContenu(id: string, reason?: string): Promise<ContenuActionResult> {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulation d'appel API
      // await apiService.disableContenu(id, reason)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mise à jour locale
      const index = contenus.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contenus.value[index].status = 'disabled'
        contenus.value[index].disabledByGestionnaire = true
        contenus.value[index].disabledAt = new Date().toISOString()
        contenus.value[index].disabledReason = reason
      }
      
      if (currentContenu.value && currentContenu.value.id === id) {
        currentContenu.value.status = 'disabled'
        currentContenu.value.disabledByGestionnaire = true
        currentContenu.value.disabledAt = new Date().toISOString()
        currentContenu.value.disabledReason = reason
      }
      
      // Journalisation (simulée)
      console.log(`[AUDIT] Contenu ${id} désactivé par le gestionnaire. Raison: ${reason || 'Non spécifiée'}`)
      
      return { success: true, message: 'Contenu désactivé avec succès' }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la désactivation'
      console.error('Erreur disableContenu:', err)
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }
  
  async function enableContenu(id: string): Promise<ContenuActionResult> {
    isLoading.value = true
    error.value = null
    
    try {
      // Vérifier si le contenu a été désactivé par le gestionnaire
      const contenu = contenus.value.find(c => c.id === id)
      if (contenu?.disabledByGestionnaire) {
        return { 
          success: false, 
          message: 'Ce contenu a été désactivé par le gestionnaire et ne peut pas être réactivé par le formateur.' 
        }
      }
      
      // Simulation d'appel API
      // await apiService.enableContenu(id)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mise à jour locale
      const index = contenus.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contenus.value[index].status = 'active'
        contenus.value[index].disabledByGestionnaire = false
        contenus.value[index].disabledAt = undefined
        contenus.value[index].disabledReason = undefined
      }
      
      if (currentContenu.value && currentContenu.value.id === id) {
        currentContenu.value.status = 'active'
        currentContenu.value.disabledByGestionnaire = false
        currentContenu.value.disabledAt = undefined
        currentContenu.value.disabledReason = undefined
      }
      
      // Journalisation (simulée)
      console.log(`[AUDIT] Contenu ${id} réactivé`)
      
      return { success: true, message: 'Contenu réactivé avec succès' }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la réactivation'
      console.error('Erreur enableContenu:', err)
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }
  
  async function deleteContenu(id: string): Promise<ContenuActionResult> {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulation d'appel API
      // await apiService.deleteContenu(id)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Suppression locale
      contenus.value = contenus.value.filter(c => c.id !== id)
      
      if (currentContenu.value && currentContenu.value.id === id) {
        currentContenu.value = null
      }
      
      // Journalisation (simulée)
      console.log(`[AUDIT] Contenu ${id} supprimé définitivement`)
      
      return { success: true, message: 'Contenu supprimé définitivement' }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression'
      console.error('Erreur deleteContenu:', err)
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }
  
  // Filtres
  function setFilter(key: keyof ContenuFilters, value: any) {
    if (key === 'search') {
      filters.value.search = value
    } else if (value === '' || value === 'all') {
      (filters.value as any)[key] = undefined
    } else {
      (filters.value as any)[key] = value
    }
    pagination.value.page = 1 // Reset à la première page
  }
  
  function setSort(field: ContenuSort['field'], order: ContenuSort['order']) {
    sort.value = { field, order }
  }
  
  function resetFilters() {
    filters.value = {
      languageId: undefined,
      levelId: undefined,
      moduleId: undefined,
      formateurId: undefined,
      status: 'all',
      dateFrom: undefined,
      dateTo: undefined,
      minEnrolled: undefined,
      maxEnrolled: undefined,
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
  
  return {
    // State
    contenus,
    currentContenu,
    isLoading,
    error,
    filters,
    sort,
    pagination,
    
    // Computed
    filteredContenus,
    paginatedContenus,
    statsSummary,
    
    // Actions
    fetchContenus,
    fetchContenuDetail,
    disableContenu,
    enableContenu,
    deleteContenu,
    setFilter,
    setSort,
    resetFilters,
    setPage,
    clearError
  }
})

