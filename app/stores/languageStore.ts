import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { languageService } from "../services/language.service";
import { levelService } from "../services/level.service";
import type { Language as ApiLanguage, Level as ApiLevel } from "../types/api";

// Types locaux pour compatibilité
export interface Level extends ApiLevel {}
export interface Language extends ApiLanguage {}

// Helpers de typage
const isLanguageArray = (data: unknown): data is Language[] =>
  Array.isArray(data);

const isLanguage = (data: unknown): data is Language =>
  typeof data === "object" && data !== null && "id" in data;

export const useLanguageStore = defineStore("language", () => {
  // État
  const languages = ref<Language[]>([]);
  const selectedLanguageId = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  // Computed
  const selectedLanguage = computed(() => {
    if (!selectedLanguageId.value) return null;
    return languages.value.find(
      (lang) => lang.id === selectedLanguageId.value,
    );
  });

  const totalLanguages = computed(() => languages.value.length);

  // Actions
  const fetchLanguages = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await languageService.getAll();

      if (response.success && response.data && isLanguageArray(response.data)) {
        languages.value = response.data;
        initialized.value = true;
      } else {
        throw new Error(
          response.error?.message || "Erreur lors du chargement des langues",
        );
      }
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "Erreur réseau lors du chargement des langues";
      console.error("Erreur fetchLanguages:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const loadLevelsForLanguage = async (languageId: string) => {
  loading.value = true;
  error.value = null;

  try {
    const response = await levelService.getByLanguage(languageId);

    if (response.success && Array.isArray(response.data)) {
      const index = languages.value.findIndex(
        (l) => l.id === languageId
      );

      if (index !== -1) {
        const lang = languages.value[index];
        if (lang) {
          lang.levels = response.data as ApiLevel[];
        }
      }
    } else {
      throw new Error(
        response.error?.message || "Erreur lors du chargement des niveaux"
      );
    }
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : "Erreur réseau lors du chargement des niveaux";
    console.error("Erreur loadLevelsForLanguage:", err);
  } finally {
    loading.value = false;
  }
};


  const selectLanguage = async (languageId: string) => {
    selectedLanguageId.value = languageId;
    const lang = languages.value.find((l) => l.id === languageId);

    if (!lang?.levels || lang.levels.length === 0) {
      await loadLevelsForLanguage(languageId);
    }
  };

  const clearSelection = () => {
    selectedLanguageId.value = null;
  };

  const addLanguage = async (payload: {
    name: string;
    code: string;
    description?: string;
    iconUrl?: string;
  }) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await languageService.create(payload);

      if (response.success && response.data && isLanguage(response.data)) {
        languages.value.push(response.data);
        return response.data;
      } else {
        throw new Error(
          response.error?.message || "Erreur lors de la création de la langue",
        );
      }
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "Erreur réseau lors de la création de la langue";
      console.error("Erreur addLanguage:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteLanguage = async (languageId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await languageService.delete(languageId);

      if (response.success) {
        languages.value = languages.value.filter(
          (l) => l.id !== languageId,
        );
        if (selectedLanguageId.value === languageId) {
          clearSelection();
        }
      } else {
        throw new Error(
          response.error?.message || "Erreur lors de la suppression",
        );
      }
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "Erreur réseau lors de la suppression";
      console.error("Erreur deleteLanguage:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateLanguage = async (
    languageId: string,
    payload: Partial<{
      name: string;
      code: string;
      description?: string;
      iconUrl?: string;
      isActive?: boolean;
    }>,
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await languageService.update(languageId, payload);

      if (response.success && response.data && isLanguage(response.data)) {
        const index = languages.value.findIndex(
          (l) => l.id === languageId,
        );
        if (index !== -1) {
          languages.value[index] = response.data;
        }
        return response.data;
      } else {
        throw new Error(
          response.error?.message || "Erreur lors de la mise à jour",
        );
      }
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "Erreur réseau lors de la mise à jour";
      console.error("Erreur updateLanguage:", err);
      throw err;
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
    initialized,
    fetchLanguages,
    selectLanguage,
    clearSelection,
    addLanguage,
    deleteLanguage,
    updateLanguage,
    loadLevelsForLanguage,
  };
});
