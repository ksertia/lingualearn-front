import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiService } from "~/services/api";
import { useAuthStore } from "~/stores/authStore";
import type {
  LanguageWithLevels,
  CreateLanguagePayload,
  CreateLevelPayload,
  Level,
} from "~/types/language-level";

// Configuration du polling
// const POLLING_INTERVAL = 5000; // 5 secondes

export const useLanguageStore = defineStore("language", () => {
  const api = useApiService();
  const authStore = useAuthStore();

  // -----------------------------
  // STATE
  // -----------------------------
  const languages = ref<LanguageWithLevels[]>([]);
  const selectedLanguageId = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // State pour le polling
  const pollingIntervals = ref<Map<string, number>>(new Map());
  const isPolling = ref(false);

  // -----------------------------
  // GETTERS
  // -----------------------------
  const userRole = computed(() => authStore.user?.accountType);

  const visibleLanguages = computed(() => {
    if (userRole.value === "plateform_manager" || userRole.value === "admin") {
      return languages.value;
    }

    // Apprenant / formateur → seulement langues actives
    return languages.value.filter(l => l.isActive);
  });

  const selectedLanguage = computed(() => {
    const lang = languages.value.find(
      l => l.id === selectedLanguageId.value
    );
    if (!lang) return null;

    // Gestionnaire → tout voir
    if (userRole.value === "plateform_manager" || userRole.value === "admin") {
      return lang;
    }

    // Apprenant / formateur → seulement niveaux actifs
    return {
      ...lang,
      levels: lang.levels.filter(level => level.isActive),
    };
  });

  const totalLanguages = computed(() => visibleLanguages.value.length);

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
      error.value =
        e instanceof Error ? e.message : "Erreur chargement langues";
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

  // 3️⃣ Ajouter une langue
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
      error.value =
        e instanceof Error ? e.message : "Erreur création langue";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // 4️⃣ Ajouter un niveau
  const addLevelToLanguage = async (
  languageId: string,
  payload: Omit<CreateLevelPayload, "languageId">
): Promise<Level> => {
  const lang = languages.value.find(l => l.id === languageId);
  if (!lang) throw new Error("Langue introuvable");

  try {
    const payloadWithId = { ...payload, languageId };
    const res = await api.createLevelForLanguage(languageId, payloadWithId);

    let newLevel: Level;

    if (res && "data" in res && res.data) {
      newLevel = res.data as Level;
    } else if (res) {
      // 🔹 Cast sûr : d'abord unknown puis on vérifie les champs obligatoires
      const temp = res as unknown;
      if (
        typeof temp === "object" &&
        temp !== null &&
        "id" in temp &&
        "languageId" in temp &&
        "code" in temp &&
        "name" in temp &&
        "index" in temp &&
        "isActive" in temp
      ) {
        newLevel = temp as Level;
      } else {
        throw new Error("Réponse API invalide pour le niveau");
      }
    } else {
      throw new Error("Impossible de créer le niveau, réponse inattendue de l'API");
    }

    const exists = lang.levels.some(l => l.id === newLevel.id);
    if (!exists) lang.levels.push(newLevel);

    return newLevel;
  } catch (e) {
    console.error("Erreur création niveau :", e);
    throw e;
  }
};


  // 5️⃣ Mettre à jour un niveau
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
      Object.assign(level, res.data);
      return level;
    } catch (e) {
      console.error("Erreur mise à jour niveau :", e);
      throw e;
    }
  };

  // 6️⃣ Supprimer un niveau
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
      error.value =
        e instanceof Error ? e.message : "Échec suppression niveau";
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
      const cleanedPayload = {
        ...payload,
        iconUrl: payload.iconUrl ?? undefined
      };

      const res = await api.updateLanguage(id, cleanedPayload);
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
      error.value =
        e instanceof Error ? e.message : "Erreur mise à jour langue";
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
      error.value =
        e instanceof Error ? e.message : "Erreur suppression langue";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // 🔟 Activer / désactiver une langue
  const toggleLanguageStatus = async (languageId: string) => {
    const lang = languages.value.find(l => l.id === languageId);
    if (!lang) return;

    try {
      const newStatus = !lang.isActive;

      const res = await api.updateLanguage(languageId, {
        isActive: newStatus,
      });

      if (res?.data) {
        lang.isActive = res.data.isActive;
      } else {
        lang.isActive = newStatus;
      }
    } catch (e) {
      console.error("Erreur changement statut langue :", e);
    }
  };

  return {
    languages,
    visibleLanguages,
    selectedLanguageId,
    selectedLanguage,
    totalLanguages,
    loading,
    error,
    isPolling,
    pollingIntervals,
    fetchLanguages,
    selectLanguage,
    clearSelection,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    loadLevelsForLanguage,
    addLevelToLanguage,
    updateLevel,
    deleteLevel,
    toggleLanguageStatus,
    api,
  };
});
