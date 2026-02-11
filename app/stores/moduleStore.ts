import type { moduleResponse } from './../types/modules';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiService } from '~/services/api';
import type { module, moduleRequest } from '~/types/modules';

export const useModuleStore = defineStore('module', () => {
    const apiService = useApiService();
    const module = ref<module[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function fetchModule(levelId?: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.getModule(levelId);
            const data = response.data || (Array.isArray(response) ? response : null);
            if (data) {
                module.value = data;
            } else {
                error.value = response.message || 'Impossible de charger les modules';
            }
        } catch (err: any) {
            error.value = 'Erreur lors de la récupération des modules';
        } finally {
            isLoading.value = false;
        }
    }

    async function createModule(data: moduleRequest) {
        console.log("Creating module with data:", data);
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.createModule(data);
            console.log("Response from createModule:", response);
            const moduleData = response.data || (response.id ? response : null);
            if (moduleData) {
                module.value.push(moduleData);
                return true;
            } else {
                error.value = response.message || "Échec de la création du module";
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || "Erreur lors de la création du module";
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function updateModule(id: string, data: Partial<moduleResponse>) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.updateModule(id, data);
            const moduleData = response.data || (response.id ? response : null);
            if (moduleData) {
                const index = module.value.findIndex(m => m.levelId === id);
                if (index !== -1) {
                    module.value[index] = moduleData;
                }
                return true;
            } else {
                error.value = response.message || "Impossible de mettre à jour le module";
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || "Erreur lors de la mise à jour du module";
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteModule(id: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.deleteModule(id);
            if (response.success || response === true || !response || Object.keys(response).length === 0) {
                module.value = module.value.filter(m => m.title !== id);
                return true;
            } else {
                error.value = response.message || "Échec de la suppression du module";
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || "Erreur lors de la suppression du module";
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        module,
        isLoading,
        error,
        fetchModule,
        createModule,
        updateModule,
        deleteModule,
    };
});
