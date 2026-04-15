import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiService } from "~/services/api";
import type {
  DiscoveryLanguage,
  SubmitExercisePayload,
  DiscoverSection,
  DiscoverContent,
  CreateDiscoverSectionRequest,
  UpdateDiscoverSectionRequest,
  CreateDiscoverContentRequest,
  UpdateDiscoverContentRequest,
  // Legacy
  DiscoverLesson,
  CreateDiscoverLessonRequest,
  UpdateDiscoverLessonRequest,
} from "~/types/discovery";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const extractPayload = (response: any) => {
  if (!response) return null;
  if (response.data !== undefined) return response.data;
  if (response.result !== undefined) return response.result;
  return response;
};

const extractArray = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  const candidates = [
    payload.items,
    payload.results,
    payload.languages,
    payload.exercises,
    payload.sections,
    payload.contents,
    payload.data,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
};

const extractSessionId = (payload: any): string | null => {
  if (!payload) return null;
  const candidates = [
    payload.sessionId,
    payload.id,
    payload.session?.id,
    payload.data?.sessionId,
    payload.data?.id,
  ];
  return candidates.find((value) => typeof value === "string") || null;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDiscoveryStore = defineStore("discovery", () => {
  const api = useApiService();

  // ── États apprenant ──────────────────────────────────────────────────────────
  const languages = ref<DiscoveryLanguage[]>([]);
  const sessionId = ref<string | null>(null);
  const selectedLanguageId = ref<string | null>(null);
  const selectedLanguageCode = ref<string | null>(null);
  const score = ref<any>(null);

  const isLoadingLanguages = ref(false);
  const isCreatingSession = ref(false);
  const isLoadingScore = ref(false);
  const error = ref<string | null>(null);

  // ── États sections (nouveau modèle) ─────────────────────────────────────────
  const adminSections = ref<DiscoverSection[]>([]);
  const currentAdminSection = ref<DiscoverSection | null>(null);
  const isLoadingAdminSections = ref(false);
  const isCreatingAdminSection = ref(false);
  const isUpdatingAdminSection = ref(false);
  const isDeletingAdminSection = ref(false);

  const isAddingContent = ref(false);
  const isUpdatingContent = ref(false);
  const isDeletingContent = ref(false);

  const adminError = ref<string | null>(null);

  const adminLessons = ref<DiscoverLesson[]>([]);
  const currentAdminLesson = ref<DiscoverLesson | null>(null);
  const isLoadingAdminLessons = ref(false);
  const isCreatingAdminLesson = ref(false);
  const isUpdatingAdminLesson = ref(false);
  const isDeletingAdminLesson = ref(false);
  const isPublishingAdminLesson = ref(false);
  const isUploadingAdminMedia = ref(false);


  const fetchLanguages = async (payload: Record<string, any> = {}): Promise<DiscoveryLanguage[]> => {
    isLoadingLanguages.value = true;
    error.value = null;
    try {
      const response = await api.discoverLanguages(payload);
      const data = extractPayload(response);
      languages.value = extractArray(data) as DiscoveryLanguage[];
      return languages.value;
    } catch {
      error.value = "Erreur lors du chargement des langues";
      languages.value = [];
      return [];
    } finally {
      isLoadingLanguages.value = false;
    }
  };

  const createSession = async (payload: Record<string, any> = {}) => {
    isCreatingSession.value = true;
    error.value = null;
    try {
      const response = await api.createDiscoverSession(payload);
      const data = extractPayload(response);
      sessionId.value = extractSessionId(data);
      return sessionId.value;
    } catch {
      error.value = "Erreur lors de la création de la session";
      sessionId.value = null;
      return null;
    } finally {
      isCreatingSession.value = false;
    }
  };

  const fetchScore = async (sessionIdParam?: string) => {
    if (!sessionIdParam && !sessionId.value) return null;
    isLoadingScore.value = true;
    error.value = null;
    try {
      const response = await api.getDiscoverSessionScore(sessionIdParam || sessionId.value || "");
      score.value = extractPayload(response);
      return score.value;
    } catch {
      error.value = "Erreur lors du chargement du score";
      score.value = null;
      return null;
    } finally {
      isLoadingScore.value = false;
    }
  };


  /**
   * Récupère toutes les sections avec leurs contenus
   * GET /api/v1/discover/sections
   */
  const fetchAdminSections = async (): Promise<DiscoverSection[]> => {
    isLoadingAdminSections.value = true;
    adminError.value = null;
    try {
      const response = await api.getDiscoverSections();
      const data = extractPayload(response);
      adminSections.value = extractArray(data) as DiscoverSection[];
      return adminSections.value;
    } catch {
      adminError.value = "Erreur lors du chargement des sections";
      adminSections.value = [];
      return [];
    } finally {
      isLoadingAdminSections.value = false;
    }
  };

  /**
   * Crée une nouvelle section
   * POST /api/v1/discover/sections
   */
  const createAdminSection = async (payload: CreateDiscoverSectionRequest): Promise<DiscoverSection | null> => {
    isCreatingAdminSection.value = true;
    adminError.value = null;
    try {
      const response = await api.createDiscoverSection(payload);
      const data = extractPayload(response);
      const newSection = data as DiscoverSection;
      if (newSection) {
        if (!newSection.contents) newSection.contents = [];
        adminSections.value.push(newSection);
        currentAdminSection.value = newSection;
      }
      return newSection;
    } catch {
      adminError.value = "Erreur lors de la création de la section";
      return null;
    } finally {
      isCreatingAdminSection.value = false;
    }
  };

  /**
   * Met à jour une section existante
   */
  const updateAdminSection = async (sectionId: string, payload: UpdateDiscoverSectionRequest): Promise<DiscoverSection | null> => {
    isUpdatingAdminSection.value = true;
    adminError.value = null;
    try {
      const response = await api.updateDiscoverSection(sectionId, payload);
      const data = extractPayload(response);
      const updated = data as DiscoverSection;
      if (updated) {
        const idx = adminSections.value.findIndex(s => s.id === sectionId);
        if (idx !== -1) {
          // Conserver les contents chargés localement
          updated.contents = updated.contents ?? adminSections.value[idx]?.contents ?? [];
          adminSections.value[idx] = updated;
        }
        if (currentAdminSection.value?.id === sectionId) {
          currentAdminSection.value = updated;
        }
      }
      return updated;
    } catch {
      adminError.value = "Erreur lors de la mise à jour de la section";
      return null;
    } finally {
      isUpdatingAdminSection.value = false;
    }
  };

  /**
   * Supprime une section
   */
  const deleteAdminSection = async (sectionId: string): Promise<boolean> => {
    isDeletingAdminSection.value = true;
    adminError.value = null;
    try {
      await api.deleteDiscoverSection(sectionId);
      adminSections.value = adminSections.value.filter(s => s.id !== sectionId);
      if (currentAdminSection.value?.id === sectionId) {
        currentAdminSection.value = null;
      }
      return true;
    } catch {
      adminError.value = "Erreur lors de la suppression de la section";
      return false;
    } finally {
      isDeletingAdminSection.value = false;
    }
  };

  // ── Actions contents ──────────────────────────────────────────────────────

  /**
   * Ajoute un contenu à une section
   * POST /api/v1/discover/sections/{sectionId}/contents
   */
  const addContentToSection = async (
      sectionId: string,
      payload: CreateDiscoverContentRequest
  ): Promise<DiscoverContent | null> => {
    isAddingContent.value = true;
    adminError.value = null;
    try {
      const response = await api.addDiscoverContent(sectionId, payload);
      const data = extractPayload(response);
      const newContent = data as DiscoverContent;
      if (newContent) {
        const section = adminSections.value.find(s => s.id === sectionId);
        if (section) {
          if (!section.contents) section.contents = [];
          section.contents.push(newContent);
        }
      }
      return newContent;
    } catch {
      adminError.value = "Erreur lors de l'ajout du contenu";
      return null;
    } finally {
      isAddingContent.value = false;
    }
  };

  /**
   * Met à jour un contenu
   * PATCH /api/v1/discover/contents/{contentId}
   */
  const updateContent = async (
      contentId: string,
      payload: UpdateDiscoverContentRequest
  ): Promise<DiscoverContent | null> => {
    isUpdatingContent.value = true;
    adminError.value = null;
    try {
      const response = await api.updateDiscoverContent(contentId, payload);
      const data = extractPayload(response);
      const updated = data as DiscoverContent;
      if (updated) {
        // Mettre à jour dans la section correspondante
        for (const section of adminSections.value) {
          if (!section.contents) continue;
          const idx = section.contents.findIndex(c => c.id === contentId);
          if (idx !== -1) {
            section.contents[idx] = updated;
            break;
          }
        }
      }
      return updated;
    } catch {
      adminError.value = "Erreur lors de la mise à jour du contenu";
      return null;
    } finally {
      isUpdatingContent.value = false;
    }
  };

  /**
   * Supprime un contenu d'une section
   */
  const deleteContent = async (sectionId: string, contentId: string): Promise<boolean> => {
    isDeletingContent.value = true;
    adminError.value = null;
    try {
      await api.deleteDiscoverContent(contentId);
      const section = adminSections.value.find(s => s.id === sectionId);
      if (section?.contents) {
        section.contents = section.contents.filter(c => c.id !== contentId);
      }
      return true;
    } catch {
      adminError.value = "Erreur lors de la suppression du contenu";
      return false;
    } finally {
      isDeletingContent.value = false;
    }
  };

  // ── Upload média ──────────────────────────────────────────────────────────

  const uploadAdminMedia = async (file: File): Promise<string | null> => {
    isUploadingAdminMedia.value = true;
    adminError.value = null;
    try {
      const response = await api.uploadDiscoverMedia(file);
      const data = extractPayload(response);
      return data?.url || data?.mediaUrl || null;
    } catch {
      adminError.value = "Erreur lors de l'upload du média";
      return null;
    } finally {
      isUploadingAdminMedia.value = false;
    }
  };

  // ── Setters ───────────────────────────────────────────────────────────────

  const setCurrentAdminSection = (section: DiscoverSection | null) => {
    currentAdminSection.value = section;
  };

  // ── Legacy : actions lessons ──────────────────────────────────────────────

  /** @deprecated Utiliser fetchAdminSections */
  const fetchAdminLessons = async (): Promise<DiscoverLesson[]> => {
    isLoadingAdminLessons.value = true;
    adminError.value = null;
    try {
      const response = await api.getDiscoverLessons();
      const lessons = response?.data;
      adminLessons.value = Array.isArray(lessons) ? lessons : [];
      return adminLessons.value;
    } catch {
      adminError.value = "Erreur lors du chargement des leçons admin";
      adminLessons.value = [];
      return [];
    } finally {
      isLoadingAdminLessons.value = false;
    }
  };

  /** @deprecated */
  const createAdminLesson = async (payload: CreateDiscoverLessonRequest): Promise<DiscoverLesson | null> => {
    isCreatingAdminLesson.value = true;
    adminError.value = null;
    try {
      const response = await api.createDiscoverLesson(payload);
      const data = extractPayload(response);
      const newLesson = data as DiscoverLesson;
      if (newLesson) adminLessons.value.push(newLesson);
      currentAdminLesson.value = newLesson;
      return newLesson;
    } catch {
      adminError.value = "Erreur lors de la création de la leçon";
      return null;
    } finally {
      isCreatingAdminLesson.value = false;
    }
  };

  /** @deprecated */
  const updateAdminLesson = async (id: string, payload: UpdateDiscoverLessonRequest): Promise<DiscoverLesson | null> => {
    isUpdatingAdminLesson.value = true;
    adminError.value = null;
    try {
      const response = await api.updateDiscoverLesson(id, payload);
      const data = extractPayload(response);
      const updated = data as DiscoverLesson;
      if (updated) {
        const idx = adminLessons.value.findIndex(l => l.id === id);
        if (idx !== -1) adminLessons.value[idx] = updated;
        if (currentAdminLesson.value?.id === id) currentAdminLesson.value = updated;
      }
      return updated;
    } catch {
      adminError.value = "Erreur lors de la mise à jour de la leçon";
      return null;
    } finally {
      isUpdatingAdminLesson.value = false;
    }
  };

  /** @deprecated */
  const deleteAdminLesson = async (id: string): Promise<boolean> => {
    isDeletingAdminLesson.value = true;
    adminError.value = null;
    try {
      await api.deleteDiscoverLesson(id);
      adminLessons.value = adminLessons.value.filter(l => l.id !== id);
      if (currentAdminLesson.value?.id === id) currentAdminLesson.value = null;
      return true;
    } catch {
      adminError.value = "Erreur lors de la suppression de la leçon";
      return false;
    } finally {
      isDeletingAdminLesson.value = false;
    }
  };

  /** @deprecated */
  const publishAdminLesson = async (id: string, publish: boolean): Promise<DiscoverLesson | null> => {
    isPublishingAdminLesson.value = true;
    adminError.value = null;
    try {
      const response = await api.publishDiscoverLesson(id, publish);
      const data = extractPayload(response);
      const updated = data as DiscoverLesson;
      if (updated) {
        const idx = adminLessons.value.findIndex(l => l.id === id);
        if (idx !== -1) adminLessons.value[idx] = updated;
        if (currentAdminLesson.value?.id === id) currentAdminLesson.value = updated;
      }
      return updated;
    } catch {
      adminError.value = "Erreur lors du changement de publication";
      return null;
    } finally {
      isPublishingAdminLesson.value = false;
    }
  };

  return {
    // ── Apprenant ──
    languages,
    sessionId,
    selectedLanguageId,
    selectedLanguageCode,
    score,
    isLoadingLanguages,
    isCreatingSession,
    isLoadingScore,
    error,
    fetchLanguages,
    createSession,
    fetchScore,

    // ── Sections (nouveau modèle) ──
    adminSections,
    currentAdminSection,
    isLoadingAdminSections,
    isCreatingAdminSection,
    isUpdatingAdminSection,
    isDeletingAdminSection,
    fetchAdminSections,
    createAdminSection,
    updateAdminSection,
    deleteAdminSection,
    setCurrentAdminSection,

    // ── Contents ──
    isAddingContent,
    isUpdatingContent,
    isDeletingContent,
    addContentToSection,
    updateContent,
    deleteContent,

    // ── Média ──
    isUploadingAdminMedia,
    uploadAdminMedia,

    // ── Erreur admin ──
    adminError,

    // ── Legacy lessons ──
    adminLessons,
    currentAdminLesson,
    isLoadingAdminLessons,
    isCreatingAdminLesson,
    isUpdatingAdminLesson,
    isDeletingAdminLesson,
    isPublishingAdminLesson,
    fetchAdminLessons,
    createAdminLesson,
    updateAdminLesson,
    deleteAdminLesson,
    publishAdminLesson,
  };
});