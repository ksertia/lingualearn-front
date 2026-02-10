import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiService } from "~/services/api";
import type {
  LanguageWithLevels,
  CreateLanguagePayload,
  CreateLevelPayload,
  Level,
} from "~/types/language-level";

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
  // UTILS
  // -----------------------------
  const normalizeLevelsResponse = (res: any): Level[] => {
    if (Array.isArray(res)) return res;
    if (res?.success && Array.isArray(res.data)) return res.data;
    return [];
  };

  // -----------------------------
  // ACTIONS
  // -----------------------------

  // 1️⃣ Charger toutes les langues
  const fetchLanguages = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await api.getLanguages();
      if (!res.success || !res.data) throw new Error(res.message);

      languages.value = res.data.map(l => ({
        ...l,
        levels: [],
        levelsLoaded: false,
      }));
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
      const levels = normalizeLevelsResponse(res).filter(
        l => l.languageId === languageId
      );

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

  // 3️⃣ Ajouter une langue (sans niveaux automatiques)
  const addLanguage = async (payload: CreateLanguagePayload) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await api.createLanguage(payload);
      if (!res.success || !res.data) throw new Error(res.message);

      const newLang: LanguageWithLevels = {
        ...res.data,
        levels: [],
        levelsLoaded: true,
      };

      languages.value.push(newLang);
      return newLang;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Erreur création langue";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // 4️⃣ Ajouter un niveau à une langue
  const addLevelToLanguage = async (
    languageId: string,
    payload: CreateLevelPayload
  ): Promise<Level | undefined> => {
    const lang = languages.value.find(l => l.id === languageId);
    if (!lang) return;

    try {
      const res = await api.createLevelForLanguage(languageId, payload);

      if (!res.data) {
        throw new Error("Le niveau n'a pas été créé");
      }
      // ⚡ On récupère le Level depuis res.data
      const newLevel: Level = res.data;

      // On l’ajoute dans le store
      lang.levels.push(newLevel);

      return newLevel;
    } catch (e) {
      console.error("Erreur création niveau :", e);
      throw e;
    }
  };

  // 5️⃣ Mettre à jour un niveau (activation/désactivation ou autres)
  const updateLevel = async (
    languageId: string,
    levelId: string,
    payload: Partial<CreateLevelPayload>
  ): Promise<Level | undefined> => {
    const lang = languages.value.find(l => l.id === languageId);
    if (!lang) return;

    const level = lang.levels.find(l => l.id === levelId);
    if (!level) return;

    try {
      const res = await api.updateLevelForLanguage(levelId, payload);

      // ⚡ On met à jour le niveau dans le store
      Object.assign(level, res.data);

      return level;
    } catch (e) {
      console.error("Erreur mise à jour niveau :", e);
      throw e;
    }
  };

  // 6️⃣ Supprimer un niveau d'une langue
  const deleteLevel = async (languageId: string, levelId: string) => {
    loading.value = true;
    error.value = null;

    try {
      await api.deleteLevelForLanguage(levelId);

      const lang = languages.value.find(l => l.id === languageId);
      if (lang) {
        lang.levels = lang.levels.filter(l => l.id !== levelId);
      }
    } catch (e) {
      console.error("Erreur suppression niveau :", e);
      error.value = e instanceof Error ? e.message : "Échec suppression niveau";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // 7️⃣ Sélectionner une langue
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

  // 8️⃣ Mettre à jour une langue
  const updateLanguage = async (
    id: string,
    payload: Partial<CreateLanguagePayload>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const payloadToSend = {
        ...payload,
        iconUrl: payload.iconUrl ?? undefined,
      };

      const res = await api.updateLanguage(id, payloadToSend);
      if (!res.success || !res.data) throw new Error(res.message);

      const index = languages.value.findIndex(l => l.id === id);
      if (index !== -1) {
        languages.value[index] = {
          ...languages.value[index],
          ...res.data,
        };
      }

      return res.data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Erreur mise à jour langue";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // 9️⃣ Supprimer une langue
  const deleteLanguage = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      await api.deleteLanguage(id);
      languages.value = languages.value.filter(l => l.id !== id);

      if (selectedLanguageId.value === id) {
        selectedLanguageId.value = null;
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Erreur suppression langue";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // -----------------------------
  // 10️⃣ créer un niveau pour une langue (utilisé dans le formulaire de création de niveau)
// -----------------------------
const createLevelForLanguage = async (
  languageId: string,
  payload: {
    name: string;
    code: string;
    description?: string;
    index: number;
    isActive: boolean;
  }
): Promise<Level> => {
  loading.value = true;
  error.value = null;

  try {
    const res = await api.createLevelForLanguage(languageId, {
      ...payload,
      languageId,
    });

    // 🔹 Log complet pour debug
    console.log("API createLevelForLanguage response:", res);

    // Vérifier si on reçoit bien res.data ou fallback
    const newLevel: Level | undefined =
      res?.data ?? (res as unknown as Level);

    if (!newLevel || !newLevel.id) {
      throw new Error(
        `Impossible de créer le niveau, réponse inattendue de l'API`
      );
    }

    // Ajouter dans le store
    const lang = languages.value.find(l => l.id === languageId);
    if (lang) {
      const exists = lang.levels.some(l => l.id === newLevel.id);
      if (!exists) lang.levels.push(newLevel);
    }

    return newLevel;
  } catch (e) {
    console.error("Erreur création niveau :", e);
    error.value =
      e instanceof Error
        ? e.message
        : "Échec création niveau, voir console pour détails";
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
    addLevelToLanguage,
    updateLevel,
    createLevelForLanguage,
    deleteLevel,
    api,
  };
});
