

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiService } from "~/services/api";
import type { LanguageWithLevels, CreateLanguagePayload, Level } from "~/types/language-level";

export const useLanguageStore = defineStore("language", () => {
  const api = useApiService();

  // -----------------------------
  // STATE
  // -----------------------------
  const languages = ref<LanguageWithLevels[]>([]);
  const selectedLanguageId = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // -----------------------------
  // GETTERS
  // -----------------------------
  const selectedLanguage = computed(() =>
    languages.value.find(l => l.id === selectedLanguageId.value) ?? null
  );

  const totalLanguages = computed(() => languages.value.length);

  // -----------------------------
  // UTILS : normaliser la réponse des niveaux
  // -----------------------------
  const normalizeLevelsResponse = (res: any): Level[] => {
    if (Array.isArray(res)) return res;
    if (res?.success && Array.isArray(res.data)) return res.data;
    return [];
  };

  // -----------------------------
  // ACTIONS
  // -----------------------------

  // 1️⃣ Charger toutes les langues et leurs niveaux
  const fetchLanguages = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getLanguages();
      if (!res.success || !res.data) throw new Error(res.message);

      // Initialiser chaque langue avec niveaux vides
      languages.value = res.data.map(l => ({
        ...l,
        levels: [],
        levelsLoaded: false,
      }));

      // Charger les niveaux pour chaque langue
      for (const lang of languages.value) {
        await loadLevelsForLanguage(lang.id);
      }

    } catch (e) {
      error.value = e instanceof Error ? e.message : "Erreur chargement langues";
    } finally {
      loading.value = false;
    }
  };

  // 2️⃣ Charger les niveaux d'une langue
  const loadLevelsForLanguage = async (languageId: string) => {
    const lang = languages.value.find(l => l.id === languageId);
    if (!lang) return;

    loading.value = true;
    try {
      const res = await api.getLevelsByLanguage(languageId);
      let levels = normalizeLevelsResponse(res).filter(l => l.languageId === languageId);

      // Si aucun niveau retourné par le backend, créer les 3 par défaut
      if (levels.length === 0) {
        const defaultLevelsRes = await api.createDefaultLevels(languageId);
        levels = normalizeLevelsResponse(defaultLevelsRes);
      }

      lang.levels = levels;
      lang.levelsLoaded = true;
    } catch (e) {
      console.error("Erreur chargement niveaux :", e);
      lang.levels = [];
      lang.levelsLoaded = false;
    } finally {
      loading.value = false;
    }
  };

  // 3️⃣ Ajouter une langue avec ses niveaux backend
  const addLanguage = async (payload: CreateLanguagePayload) => {
    loading.value = true;
    error.value = null;

    try {
      // Créer la langue
      const res = await api.createLanguage(payload);
      if (!res.success || !res.data) throw new Error(res.message);

      const newLang = res.data;

      // Charger les niveaux du backend pour cette langue
      let levelsRes = await api.getLevelsByLanguage(newLang.id);
      let levels = normalizeLevelsResponse(levelsRes).filter(l => l.languageId === newLang.id);

      // Si le backend n'a pas créé de niveaux, créer les niveaux par défaut
      if (levels.length === 0) {
        const defaultLevelsRes = await api.createDefaultLevels(newLang.id);
        levels = normalizeLevelsResponse(defaultLevelsRes);
      }

      newLang.levels = levels;
      newLang.levelsLoaded = true;

      // Ajouter la langue au store
      languages.value.push(newLang);

      return newLang;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Erreur création langue";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // 4️⃣ Sélectionner une langue
  const selectLanguage = async (id: string) => {
    selectedLanguageId.value = id;
    const lang = languages.value.find(l => l.id === id);
    if (!lang) return;

    if (!lang.levelsLoaded) {
      await loadLevelsForLanguage(id);
    }
  };

  const clearSelection = () => {
    selectedLanguageId.value = null;
  };

  // 5️⃣ Mettre à jour une langue
  const updateLanguage = async (id: string, payload: Partial<CreateLanguagePayload>) => {
    loading.value = true;
    error.value = null;
    try {
      const payloadToSend = { ...payload, iconUrl: payload.iconUrl ?? undefined };
      const res = await api.updateLanguage(id, payloadToSend);
      if (!res.success || !res.data) throw new Error(res.message);

      const index = languages.value.findIndex(l => l.id === id);
      if (index !== -1) languages.value[index] = { ...languages.value[index], ...res.data };
      return res.data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Erreur mise à jour langue";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // 6️⃣ Supprimer une langue
  const deleteLanguage = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await api.deleteLanguage(id);
      languages.value = languages.value.filter(l => l.id !== id);
      if (selectedLanguageId.value === id) selectedLanguageId.value = null;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Erreur suppression langue";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // 7️⃣ Supprimer un niveau
  const deleteLevel = async (languageId: string, levelId: string) => {
    loading.value = true;
    error.value = null;
    try {
      await api.deleteLevelForLanguage(languageId, levelId);
      const lang = languages.value.find(l => l.id === languageId);
      if (lang) lang.levels = lang.levels.filter(l => l.id !== levelId);
    } catch (e) {
      console.error("Erreur suppression niveau :", e);
      error.value = e instanceof Error ? e.message : "Échec suppression niveau";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    languages,
    selectedLanguageId,
    selectedLanguage,
    totalLanguages,
    loading,
    error,
    fetchLanguages,
    selectLanguage,
    clearSelection,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    loadLevelsForLanguage,
    deleteLevel,
  };
});
