import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiService } from '~/services/api';
import type { Level, CreateLevelRequest } from '~/types/learning';

export const useLevelStore = defineStore('level', () => {
    const apiService = useApiService();
    const levels = ref<Level[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function fetchLevels(learningPathId?: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.getLevels(learningPathId);
            const data = response.data || (Array.isArray(response) ? response : null);

            if (data) {
                levels.value = data;
            } else {
                error.value = response.message || 'Échec du chargement des niveaux';
            }
        } catch (err: any) {
            error.value = 'Erreur lors de la récupération des niveaux';
        } finally {
            isLoading.value = false;
        }
    }

    async function createLevel(data: CreateLevelRequest) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.createLevel(data);
            // Si l'API renvoie {success: true, data: {...}} OU directement l'objet créé
            const levelData = response.data || (response.id ? response : null);

            if (levelData) {
                levels.value.push(levelData);
                return true;
            } else {
                error.value = response.message || 'Échec de la création du niveau';
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || 'Erreur lors de la création du niveau';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function updateLevel(id: string, data: Partial<Level>) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.updateLevel(id, data);
            const levelData = response.data || (response.id ? response : null);

            if (levelData) {
                const index = levels.value.findIndex(l => l.id === id);
                if (index !== -1) {
                    levels.value[index] = levelData;
                }
                return true;
            } else {
                error.value = response.message || 'Échec de la mise à jour du niveau';
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || 'Erreur lors de la mise à jour du niveau';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteLevel(id: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.deleteLevel(id);
            // Si l'API renvoie success: true OU si elle renvoie 200/204 sans corps (response vide ou true)
            if (response.success || response === true || !response || Object.keys(response).length === 0) {
                levels.value = levels.value.filter(l => l.id !== id);
                return true;
            } else {
                error.value = response.message || 'Échec de la suppression du niveau';
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || 'Erreur lors de la suppression du niveau';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        levels,
        isLoading,
        error,
        fetchLevels,
        createLevel,
        updateLevel,
        deleteLevel
    };
});
