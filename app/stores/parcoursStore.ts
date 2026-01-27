import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApiService } from '~/services/api';
import type { CreateLearningPathRequest, LearningPath } from '~/types/learning';
import type { parcours } from '~/types/parcours';

export const useParcoursStore = defineStore('parcours', () => {
    const apiService = useApiService();
    const parcours = ref<parcours | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const hasParcours = computed(() => !!parcours.value);

    const allParcours = ref<LearningPath[]>([]);

    function setParcours(newParcours: parcours) {
        parcours.value = newParcours;
    }

    function clearParcours() {
        parcours.value = null;
    }

    async function createParcours(credentials: CreateLearningPathRequest) {
        isLoading.value = true;
        error.value = null;
        try {
            // Le backend n'accepte pas isPublished à la création
            const { isPublished, ...postData } = credentials;

            const response: any = await apiService.createLearningPath(postData);
            console.log("Response API createLearningPath:", response);

            const createdPath = response.data || (response.id ? response : null);

            if (createdPath) {
                const pathId = createdPath.id;

                // Si on a demandé de publier, on fait un deuxième appel (PUT)
                if (isPublished && pathId) {
                    try {
                        await apiService.updateLearningPath(pathId, { isPublished: true });
                        createdPath.isPublished = true;
                    } catch (updateErr) {
                        console.error("Erreur lors de la publication automatique:", updateErr);
                    }
                }

                allParcours.value.push(createdPath);
                return true;
            } else {
                error.value = response.message || 'Le serveur a renvoyé une erreur sans message.';
                return false;
            }
        } catch (err: any) {
            console.error("Erreur création parcours:", err);
            error.value = err.data?.message || err.message || "Erreur lors de la création";
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchParcours() {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.getLearningPaths();
            const data = response.data || (Array.isArray(response) ? response : null);

            if (data) {
                allParcours.value = data;
            } else {
                error.value = response.message || 'Échec du chargement des parcours';
            }
        } catch (err: any) {
            console.error("Fetch parcours error:", err);
            error.value = "Impossible de charger les parcours";
        } finally {
            isLoading.value = false;
        }
    }

    async function updateParcours(id: string, data: any) {
        isLoading.value = true;
        error.value = null;
        try {
            const { isPublished, ...textData } = data;
            const response: any = await apiService.updateLearningPath(id, textData);
            const pathData = response.data || (response.id ? response : null);

            if (pathData) {
                if (isPublished !== undefined) {
                    await apiService.updateLearningPath(id, { isPublished });
                }
                await fetchParcours();
                return true;
            } else {
                error.value = response.message || 'Mise à jour échouée';
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || err.message || "Erreur lors de la mise à jour";
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteParcours(id: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.deleteLearningPath(id);
            if (response.success || response === true || !response || Object.keys(response).length === 0) {
                allParcours.value = allParcours.value.filter(p => p.id !== id);
                return true;
            } else {
                error.value = response.message || 'Suppression échouée';
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || "Erreur lors de la suppression";
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        parcours,
        isLoading,
        error,
        hasParcours,
        createParcours,
        fetchParcours,
        updateParcours,
        deleteParcours,
        clearParcours,
        allParcours
    };
});