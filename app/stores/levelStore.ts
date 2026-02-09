// import type { Language } from "~/types/language-level";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiService } from "~/services/api";
import type { Level, CreateLevelPayload, UpdateLevelPayload, Language } from "~/types/language-level";

export const useLevelStore = defineStore("level", () => {
  const api = useApiService();

  // STATE
  const levels = ref<Level[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ----------------------
  // ACTIONS
  // ----------------------

  /**
   * Charger tous les niveaux
   */
  const fetchLevels = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await api.getLevels();
      // Adaptation: l'API semble renvoyer directement le tableau parfois
      if (Array.isArray(res)) {
        levels.value = res;
      } else if (res.success && res.data) {
        levels.value = res.data;
      } else {
        throw new Error(res.message || "Réponse API invalide");
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Erreur chargement niveaux";
    } finally {
      loading.value = false;
    }
  };

  /**
   * Charger les niveaux pour une langue spécifique
   */
  const fetchLevelsByLanguage = async (languageId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await api.getLevels(languageId);

      // Adaptation: l'API semble renvoyer directement le tableau parfois
      if (Array.isArray(res)) {
        levels.value = res;
      } else if (res.success && res.data) {
        levels.value = res.data;
      } else {
        throw new Error(res.message || "Réponse API invalide");
      }
    } catch (e) {
      console.error('Store: fetchLevelsByLanguage error:', e);
      error.value = e instanceof Error ? e.message : "Erreur chargement niveaux";
    } finally {
      loading.value = false;
    }
  };

  /**
   * Créer un nouveau niveau pour une langue
   */
  const addLevel = async (payload: CreateLevelPayload) => {
    loading.value = true;
    error.value = null;

    try {
      // Vérifier index obligatoire
      if (payload.index === undefined || payload.index === null) payload.index = 0;

      const res: any = await api.createLevelForLanguage(payload.languageId, payload);

      let newLevel;
      if (res && res.id) {
        newLevel = res;
      } else if (res.success && res.data) {
        newLevel = res.data;
      } else {
        throw new Error(res.message || "Erreur inconnue");
      }

      levels.value.push(newLevel);
      return newLevel;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Erreur création niveau";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Mettre à jour un niveau
   */
  const updateLevel = async (id: string, payload: UpdateLevelPayload) => {
    loading.value = true;
    error.value = null;

    try {
      // ⚡ transformer index undefined si nécessaire
      const payloadToSend = { ...payload };

      const res: any = await api.updateLevelForLanguage(id, payloadToSend);

      let updatedLevel;
      if (res && res.id) {
        updatedLevel = res;
      } else if (res.success && res.data) {
        updatedLevel = res.data;
      } else {
        throw new Error(res.message || "Erreur inconnue");
      }

      const index = levels.value.findIndex(l => l.id === id);
      if (index !== -1) levels.value[index] = { ...levels.value[index], ...updatedLevel };

      return updatedLevel;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Erreur mise à jour niveau";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Supprimer un niveau
   */
  const deleteLevel = async (id: string, languageId: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Correction: passer l'ID du niveau, pas le languageId
      const res: any = await api.deleteLevelForLanguage(id);

      // Accepter true, success:true, ou objet vide
      if (res === true || res?.success || (res && !res.error)) {
        levels.value = levels.value.filter(l => l.id !== id);
      } else {
        throw new Error(res?.message || "Erreur suppression");
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Erreur suppression niveau";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Récupérer tous les niveaux dans le store
   */
  const getLevelsForLanguage = (languageId: string) => {
    return levels.value.filter(lvl => lvl.languageId === languageId);
  };

  return {
    levels,
    loading,
    error,
    fetchLevels,
    fetchLevelsByLanguage,
    addLevel,
    updateLevel,
    deleteLevel,
    getLevelsForLanguage,
  };
})
