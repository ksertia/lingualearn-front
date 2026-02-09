import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiService } from '~/services/api';
import type { StepQuiz, CreateStepQuizRequest } from '~/types/learning';



export const useQuizStore = defineStore('quiz', () => {
  const apiService = useApiService()

  const quizzes = ref<StepQuiz[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 🔹 Récupérer les quizzes (optionnellement par lessonId)
  async function fetchQuizzes(lessonId?: string) {
    isLoading.value = true
    error.value = null
    try {
      const response: any = await apiService.getStepQuizzes(lessonId)
      const data = response.data || (Array.isArray(response) ? response : null)

      if (data) {
        quizzes.value = data
      } else {
        error.value = response.message || 'Échec du chargement des quiz'
      }
    } catch (err: any) {
      error.value = 'Erreur lors de la récupération des quiz'
    } finally {
      isLoading.value = false
    }
  }

  // 🔹 Créer un quiz
  async function createQuiz(data: CreateStepQuizRequest) {
    isLoading.value = true
    error.value = null
    try {
      const response: any = await apiService.createStepQuiz(data)
      const quizData = response.data || (response.id ? response : null)

      if (quizData) {
        quizzes.value.push(quizData)
        return true
      } else {
        error.value = response.message || 'Échec de la création du quiz'
        return false
      }
    } catch (err: any) {
      error.value = err.data?.message || 'Erreur lors de la création du quiz'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 🔹 Mettre à jour un quiz
  async function updateQuiz(id: string, data: Partial<StepQuiz>) {
    isLoading.value = true
    error.value = null
    try {
      const response: any = await apiService.updateStepQuiz(id, data)
      const quizData = response.data || (response.id ? response : null)

      if (quizData) {
        const index = quizzes.value.findIndex(q => q.pathId === id)
        if (index !== -1) {
          quizzes.value[index] = quizData
        }
        return true
      } else {
        error.value = response.message || 'Échec de la mise à jour du quiz'
        return false
      }
    } catch (err: any) {
      error.value = err.data?.message || 'Erreur lors de la mise à jour du quiz'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 🔹 Supprimer un quiz
  async function deleteQuiz(id: string) {
    isLoading.value = true
    error.value = null
    try {
      const response: any = await apiService.deleteStepQuiz(id)

      if (response.success || response === true || !response || Object.keys(response).length === 0) {
        quizzes.value = quizzes.value.filter(q => q.pathId !== id)
        return true
      } else {
        error.value = response.message || 'Échec de la suppression du quiz'
        return false
      }
    } catch (err: any) {
      error.value = err.data?.message || 'Erreur lors de la suppression du quiz'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    quizzes,
    isLoading,
    error,
    fetchQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz
  }
})
