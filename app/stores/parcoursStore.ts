import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApiService } from '~/services/api';
import type { parcours } from '~/types/parcours';

export const useParcoursStore = defineStore('parcours', () => {
    const apiService = useApiService();
    const parcours = ref<parcours | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const hasParcours = computed(() => !!parcours.value);

    const allParcours = ref<parcours[]>([]);

    function setParcours(newParcours: parcours) {
        parcours.value = newParcours;
    }

    function clearParcours() {
        parcours.value = null;
    }


    async function createParcours(parcours: parcours) {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await apiService.createParcours(parcours);
            if (response.success && response.data) {
                setParcours(response.   data);
                allParcours.value.push(response.data);
                return true;
            } else {
                error.value = response.message || 'Création de parcours echouée';
                return false;
            }
        } catch (err) {
            const e = err as FetchError;

            const status = e.statusCode;
            switch (status) {
                case 401:
                    error.value = 'Email ou mot de passe incorrect';
                    break;
                case 500:
                    error.value = 'Le serveur semble fatigué, réessayez plus tard';
                    break;
                case 422:
                    error.value = 'Certains champs du formulaire sont invalides';
                    break;
                default:
                    error.value = status ? 'Une erreur inconnue est survenue' : "La connexion est coupée ou impossible";
                    break;
            }
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
        clearParcours,
        allParcours
    };
});