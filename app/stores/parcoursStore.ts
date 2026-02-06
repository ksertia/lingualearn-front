import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApiService } from '~/services/api'
import type { LearningPath } from '~/types/learning'
import type{parcours} from '~/types/parcours'
export const useParcoursStore = defineStore('parcours', () => {
  const apiService = useApiService()

  /* ================= ÉTAT ================= */
  const allParcours = ref<parcours[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed pour récupérer tous les parcours
  const parcours = computed(() => allParcours.value)

  /* ================= CHARGEMENT ================= */
  const fetchAll = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response: any = await apiService.getLearningPaths()
      allParcours.value = response.data || (Array.isArray(response) ? response : [])
    } catch (err: any) {
      console.error("Erreur fetchAll:", err)
      error.value = "Impossible de charger les parcours"
    } finally {
      isLoading.value = false
    }
  }

  /* ================= CRÉATION ================= */
  const create = async (pathData: {
    moduleId: string
    title: string
    description: string
    // index?: number
    tempResaListime?: number
    thumbnailUrl?: string
    difficulty?: string
    estimatedHours?: number
    isActive?: boolean
  }) => {
    isLoading.value = true
    error.value = null
    try {
      // Envoi du payload exact attendu par le backend (sans steps)
      const response: any = await apiService.createLearningPath(pathData)
      const created = response.data || response

      if (created) {
        allParcours.value.push(created)
        return created
      } else {
        throw new Error(response.message || 'Erreur lors de la création')
      }
    } catch (err: any) {
      console.error("Erreur create:", err)
      error.value = err.message || 'Impossible de créer le parcours'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /* ================= SUPPRESSION ================= */
  const removePath = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response: any = await apiService.deleteLearningPath(id)

      if (response.success || response === true || !response) {
        allParcours.value = allParcours.value.filter(p => p.moduleId !== id)
        return true
      } else {
        throw new Error(response.message || 'Suppression échouée')
      }
    } catch (err: any) {
      console.error("Erreur removePath:", err)
      error.value = err.message || 'Impossible de supprimer le parcours'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /* ================= UTILITAIRES ================= */
  const getByModule = (moduleId: string) => {
    return allParcours.value.filter(p => p.moduleId === moduleId)
  }

  return {
    allParcours,
    parcours,
    isLoading,
    error,
    fetchAll,
    create,
    removePath,
    getByModule,
  }
})
