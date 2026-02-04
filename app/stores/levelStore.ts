import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiService } from "~/services/api";
import type { Level, CreateLevelPayload, UpdateLevelPayload } from "~/types/language-level";

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
      if (!res.success || !res.data) throw new Error(res.message);

      levels.value = res.data;
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
      const res = await api.getLevels();
      if (!res.success || !res.data) throw new Error(res.message);

      // filtrer par languageId
      levels.value = res.data.filter(lvl => lvl.languageId === languageId);
    } catch (e) {
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

      const res = await api.createLevelForLanguage(payload.languageId, payload);
      if (!res.success || !res.data) throw new Error(res.message);

      levels.value.push(res.data);
      return res.data;
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

      const res = await api.updateLevelForLanguage(payload.languageId!, id, payloadToSend);
      if (!res.success || !res.data) throw new Error(res.message);

      const index = levels.value.findIndex(l => l.id === id);
      if (index !== -1) levels.value[index] = { ...levels.value[index], ...res.data };

      return res.data;
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
      const res = await api.deleteLevelForLanguage(languageId, id);
      if (!res.success) throw new Error(res.message);

      levels.value = levels.value.filter(l => l.id !== id);
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
