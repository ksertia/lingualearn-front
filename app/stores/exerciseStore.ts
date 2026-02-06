import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiService } from '~/services/api';
import type { Exercise, CreateExerciseRequest } from '~/types/learning';

export const useExerciseStore = defineStore('exercise', () => {
    const apiService = useApiService();
    const exercises = ref<Exercise[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function fetchExercises(lessonId?: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.getExercises(quizId);
            const data = response.data || (Array.isArray(response) ? response : null);
            if (data) {
                exercises.value = data;
            } else {
                error.value = response.message || 'Échec du chargement des exercices';
            }
        } catch (err: any) {
            error.value = 'Erreur lors de la récupération des exercices';
        } finally {
            isLoading.value = false;
        }
    }

    async function createExercise(data: CreateExerciseRequest) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.createExercise(data);
            const exerciseData = response.data || (response.id ? response : null);
            if (exerciseData) {
                exercises.value.push(exerciseData);
                return true;
            } else {
                error.value = response.message || "Échec de la création de l'exercice";
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || "Erreur lors de la création de l'exercice";
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function updateExercise(id: string, data: Partial<Exercise>) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.updateExercise(id, data);
            const exerciseData = response.data || (response.id ? response : null);
            if (exerciseData) {
                const index = exercises.value.findIndex(e => e.id === id);
                if (index !== -1) {
                    exercises.value[index] = exerciseData;
                }
                return true;
            } else {
                error.value = response.message || "Échec de la mise à jour de l'exercice";
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || "Erreur lors de la mise à jour de l'exercice";
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteExercise(id: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.deleteExercise(id);
            if (response.success || response === true || !response || Object.keys(response).length === 0) {
                exercises.value = exercises.value.filter(e => e.id !== id);
                return true;
            } else {
                error.value = response.message || "Échec de la suppression de l'exercice";
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || "Erreur lors de la suppression de l'exercice";
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        exercises,
        isLoading,
        error,
        fetchExercises,
        createExercise,
        updateExercise,
        deleteExercise
    };
});
