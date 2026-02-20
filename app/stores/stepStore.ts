// import type { LearningPath } from './../types/learning';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiService } from '~/services/api';
import type { Step, CreateStepRequest, LearningPath } from '~/types/learning';

export const useStepStore = defineStore('step', () => {
    const apiService = useApiService();
    const steps = ref<Step[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function fetchSteps(pathId?: string) {
        isLoading.value = true;
        error.value = null;
        steps.value = []; 
        try {
            const response: any = await apiService.getSteps(pathId || '');
            const data = response.data || (Array.isArray(response) ? response : null);
            if (data) {
                steps.value = data.filter((s: any) =>
                    s.pathId === pathId ||
                    s.learningPathId === pathId ||
                    s.parcoursId === pathId
                );
            } else {
                error.value = response.message || 'Échec du chargement des étapes';
            }
        } catch (err: any) {
            error.value = 'Erreur lors de la récupération des étapes';
        } finally {
            isLoading.value = false;
        }
    }

    async function createStep(data: CreateStepRequest) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.createStep(data);
            const stepData = response.data || (response.id ? response : null);
            if (stepData) {
                steps.value.push(stepData);
                return true;
            } else {
                error.value = response.message || "Échec de la création de l'étape";
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || "Erreur lors de la création de l'étape";
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function updateStep(id: string, data: Partial<Step>) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.updateStep(id, data);
            const stepData = response.data || (response.id ? response : null);
            if (stepData) {
                const index = steps.value.findIndex(s => s.id === id);
                if (index !== -1) {
                    steps.value[index] = stepData;
                }
                return true;
            } else {
                error.value = response.message || "Échec de la mise à jour de l'étape";
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || "Erreur lors de la mise à jour de l'étape";
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteStep(id: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.deleteStep(id);
            if (response.success || response === true || !response || Object.keys(response).length === 0) {
                steps.value = steps.value.filter(s => s.id !== id);
                return true;
            } else {
                error.value = response.message || "Échec de la suppression de l'étape";
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || "Erreur lors de la suppression de l'étape";
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        steps,
        isLoading,
        error,
        fetchSteps,
        createStep,
        updateStep,
        deleteStep
    };
});
