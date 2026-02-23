import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApiService } from '~/services/api'
import type { Formateur, FormateurModule, FormateursResponse, FormateurDetailResponse, FormateurStatsSummary } from '~/types/formateur'

// Données de démonstration
const DEMO_FORMATEURS: Formateur[] = [
  {
    id: '1',
    email: 'jean.doe@example.com',
    firstName: 'Jean',
    lastName: 'DOE',
    isActive: true,
    isSuspended: false,
    createdAt: '2024-01-15T10:00:00Z',
    lastActive: '2024-03-20T14:30:00Z',
    language: { id: '1', name: 'Français', code: 'fr' },
    stats: {
      totalModules: 8,
      activeModules: 6,
      totalSteps: 24,
      totalCourses: 45,
      totalExercises: 120,
      totalQuizzes: 30,
      lastPublicationDate: '2024-03-18T09:00:00Z'
    },
    reports: [
      { id: 'r1', reason: 'Contenu inapproprié', status: 'pending', createdAt: '2024-03-15T10:00:00Z', reportedBy: 'Utilisateur 1' }
    ]
  },
  {
    id: '2',
    email: 'marie.durand@example.com',
    firstName: 'Marie',
    lastName: 'DURAND',
    isActive: true,
    isSuspended: false,
    createdAt: '2024-02-01T08:00:00Z',
    lastActive: '2024-03-19T16:45:00Z',
    language: { id: '2', name: 'Anglais', code: 'en' },
    stats: {
      totalModules: 5,
      activeModules: 5,
      totalSteps: 18,
      totalCourses: 32,
      totalExercises: 80,
      totalQuizzes: 20,
      lastPublicationDate: '2024-03-19T11:00:00Z'
    },
    reports: []
  },
  {
    id: '3',
    email: 'pierre.martin@example.com',
    firstName: 'Pierre',
    lastName: 'MARTIN',
    isActive: false,
    isSuspended: true,
    createdAt: '2023-11-20T12:00:00Z',
    lastActive: '2024-02-10T09:15:00Z',
    language: { id: '3', name: 'Espagnol', code: 'es' },
    stats: {
      totalModules: 3,
      activeModules: 0,
      totalSteps: 9,
      totalCourses: 15,
      totalExercises: 40,
      totalQuizzes: 10,
      lastPublicationDate: '2024-01-25T14:00:00Z'
    },
    reports: [
      { id: 'r2', reason: 'Signalement de contenu', status: 'pending', createdAt: '2024-02-05T08:00:00Z', reportedBy: 'Utilisateur 2' },
      { id: 'r3', reason: 'Comportement inapproprié', status: 'pending', createdAt: '2024-02-08T11:00:00Z', reportedBy: 'Utilisateur 3' }
    ]
  },
  {
    id: '4',
    email: 'sophie.bernard@example.com',
    firstName: 'Sophie',
    lastName: 'BERNARD',
    isActive: true,
    isSuspended: false,
    createdAt: '2024-03-01T09:00:00Z',
    lastActive: '2024-03-20T10:00:00Z',
    language: { id: '1', name: 'Français', code: 'fr' },
    stats: {
      totalModules: 2,
      activeModules: 2,
      totalSteps: 6,
      totalCourses: 12,
      totalExercises: 30,
      totalQuizzes: 8,
      lastPublicationDate: '2024-03-20T08:00:00Z'
    },
    reports: []
  },
  {
    id: '5',
    email: 'luc.petit@example.com',
    firstName: 'Luc',
    lastName: 'PETIT',
    isActive: true,
    isSuspended: false,
    createdAt: '2023-12-10T14:00:00Z',
    lastActive: '2024-03-15T18:20:00Z',
    language: { id: '4', name: 'Allemand', code: 'de' },
    stats: {
      totalModules: 6,
      activeModules: 4,
      totalSteps: 20,
      totalCourses: 38,
      totalExercises: 95,
      totalQuizzes: 25,
      lastPublicationDate: '2024-03-10T12:00:00Z'
    },
    reports: [
      { id: 'r4', reason: 'Retard de réponse', status: 'pending', createdAt: '2024-03-12T09:00:00Z', reportedBy: 'Utilisateur 4' }
    ]
  }
]

const DEMO_FORMATEUR_DETAIL: Formateur & { modules: FormateurModule[] } = {
  id: '1',
  email: 'jean.doe@example.com',
  firstName: 'Jean',
  lastName: 'DOE',
  isActive: true,
  isSuspended: false,
  createdAt: '2024-01-15T10:00:00Z',
  lastActive: '2024-03-20T14:30:00Z',
  language: { id: '1', name: 'Français', code: 'fr' },
  stats: {
    totalModules: 8,
    activeModules: 6,
    totalSteps: 24,
    totalCourses: 45,
    totalExercises: 120,
    totalQuizzes: 30,
    lastPublicationDate: '2024-03-18T09:00:00Z'
  },
  reports: [
    { id: 'r1', reason: 'Contenu inapproprié', status: 'pending', createdAt: '2024-03-15T10:00:00Z', reportedBy: 'Utilisateur 1' }
  ],
  modules: [
    {
      id: 'm1',
      title: 'Bases du Français',
      description: ' Cours complet pour débutants',
      isActive: true,
      isPublished: true,
      createdAt: '2024-01-20T10:00:00Z',
      publishedAt: '2024-02-01T09:00:00Z',
      stepsCount: 5,
      coursesCount: 10,
      exercisesCount: 25,
      quizzesCount: 8
    },
    {
      id: 'm2',
      title: 'Grammaire Avancée',
      description: 'Maîtrisez la grammaire française',
      isActive: true,
      isPublished: true,
      createdAt: '2024-02-10T10:00:00Z',
      publishedAt: '2024-02-20T09:00:00Z',
      stepsCount: 4,
      coursesCount: 8,
      exercisesCount: 20,
      quizzesCount: 6
    },
    {
      id: 'm3',
      title: 'Conversation',
      description: 'Améliorez votre pronunciation',
      isActive: true,
      isPublished: true,
      createdAt: '2024-03-01T10:00:00Z',
      publishedAt: '2024-03-10T09:00:00Z',
      stepsCount: 3,
      coursesCount: 6,
      exercisesCount: 15,
      quizzesCount: 4
    },
    {
      id: 'm4',
      title: 'Vocabulaire Professionnel',
      description: 'French for business',
      isActive: false,
      isPublished: false,
      createdAt: '2024-03-15T10:00:00Z',
      publishedAt: undefined,
      stepsCount: 2,
      coursesCount: 4,
      exercisesCount: 10,
      quizzesCount: 2
    }
  ]
}

export const useFormateurStore = defineStore('formateur', () => {
  const apiService = useApiService()

  const formateurs = ref<Formateur[]>([])
  const currentFormateur = ref<(Formateur & { modules: FormateurModule[] }) | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Filtres
  const search = ref('')
  const statusFilter = ref<'all' | 'active' | 'suspended'>('all')

  // Computed
  const filteredFormateurs = computed(() => {
    let result = formateurs.value

    // Filtre par statut
    if (statusFilter.value === 'active') {
      result = result.filter(f => f.isActive && !f.isSuspended)
    } else if (statusFilter.value === 'suspended') {
      result = result.filter(f => f.isSuspended)
    }

    // Filtre par recherche
    if (search.value) {
      const searchLower = search.value.toLowerCase()
      result = result.filter(f => 
        f.firstName.toLowerCase().includes(searchLower) ||
        f.lastName.toLowerCase().includes(searchLower) ||
        f.email.toLowerCase().includes(searchLower) ||
        f.language?.name.toLowerCase().includes(searchLower)
      )
    }

    return result
  })

  const statsSummary = computed((): FormateurStatsSummary => {
    return {
      total: formateurs.value.length,
      active: formateurs.value.filter(f => f.isActive && !f.isSuspended).length,
      suspended: formateurs.value.filter(f => f.isSuspended).length,
      withReports: formateurs.value.filter(f => f.reports.length > 0).length
    }
  })

  // Actions
  async function fetchFormateurs(page = 1) {
    isLoading.value = true
    error.value = null

    try {
      // Simulation d'appel API - à remplacer par le vrai appel
      // const response = await apiService.getFormateurs({ page, limit: pagination.value.limit })
      
      // Utilisation des données de démo
      await new Promise(resolve => setTimeout(resolve, 500)) // Simuler un délai
      
      formateurs.value = DEMO_FORMATEURS
      pagination.value = {
        page: 1,
        limit: 10,
        total: DEMO_FORMATEURS.length,
        totalPages: 1
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des formateurs'
      console.error('Erreur fetchFormateurs:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchFormateurDetail(id: string) {
    isLoading.value = true
    error.value = null

    try {
      // Simulation d'appel API - à remplacer par le vrai appel
      // const response = await apiService.getFormateurDetail(id)
      
      // Utilisation des données de démo
      await new Promise(resolve => setTimeout(resolve, 500))
      
      currentFormateur.value = DEMO_FORMATEUR_DETAIL
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des détails'
      console.error('Erreur fetchFormateurDetail:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function suspendFormateur(id: string) {
    isLoading.value = true
    error.value = null

    try {
      // Simulation d'appel API
      // await apiService.suspendFormateur(id)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mise à jour locale
      const index = formateurs.value.findIndex(f => f.id === id)
      if (index !== -1) {
        formateurs.value[index].isSuspended = true
        formateurs.value[index].isActive = false
      }
      
      if (currentFormateur.value && currentFormateur.value.id === id) {
        currentFormateur.value.isSuspended = true
        currentFormateur.value.isActive = false
      }
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suspension'
      console.error('Erreur suspendFormateur:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function reactivateFormateur(id: string) {
    isLoading.value = true
    error.value = null

    try {
      // Simulation d'appel API
      // await apiService.reactivateFormateur(id)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mise à jour locale
      const index = formateurs.value.findIndex(f => f.id === id)
      if (index !== -1) {
        formateurs.value[index].isSuspended = false
        formateurs.value[index].isActive = true
      }
      
      if (currentFormateur.value && currentFormateur.value.id === id) {
        currentFormateur.value.isSuspended = false
        currentFormateur.value.isActive = true
      }
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la réactivation'
      console.error('Erreur reactivateFormateur:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  function setSearch(value: string) {
    search.value = value
  }

  function setStatusFilter(value: 'all' | 'active' | 'suspended') {
    statusFilter.value = value
  }

  function clearError() {
    error.value = null
  }

  return {
    formateurs,
    currentFormateur,
    isLoading,
    error,
    pagination,
    search,
    statusFilter,
    filteredFormateurs,
    statsSummary,
    fetchFormateurs,
    fetchFormateurDetail,
    suspendFormateur,
    reactivateFormateur,
    setSearch,
    setStatusFilter,
    clearError
  }
})

