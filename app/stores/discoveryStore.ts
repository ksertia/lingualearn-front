import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiService } from "~/services/api";
import type {
  DiscoveryLanguage,
  DiscoveryExercise,
  DiscoveryLessonAdmin,
  SubmitExercisePayload,
} from "~/types/discovery";

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

export const useDiscoveryStore = defineStore("discovery", () => {
  const api = useApiService();

  const languages = ref<DiscoveryLanguage[]>([]);
  const lesson = ref<DiscoveryLessonAdmin | null>(null);
  const exercises = ref<DiscoveryExercise[]>([]);
  const currentExercise = ref<DiscoveryExercise | null>(null);
  const sessionId = ref<string | null>(null);
  const selectedLanguageId = ref<string | null>(null);
  const selectedLanguageCode = ref<string | null>(null);
  const score = ref<any>(null);

  const isLoadingLanguages = ref(false);
  const isCreatingSession = ref(false);
  const isLoadingLesson = ref(false);
  const isLoadingExercises = ref(false);
  const isSubmitting = ref(false);
  const isLoadingScore = ref(false);
  const error = ref<string | null>(null);

  const fetchLanguages = async (payload: Record<string, any> = {}): Promise<DiscoveryLanguage[]> => {
    isLoadingLanguages.value = true;
    error.value = null;
    try {
      const response = await api.discoverLanguages(payload);
      const data = extractPayload(response);
      languages.value = extractArray(data) as DiscoveryLanguage[];
      return languages.value;
    } catch (err) {
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
    } catch (err) {
      error.value = "Erreur lors de la création de la session";
      sessionId.value = null;
      return null;
    } finally {
      isCreatingSession.value = false;
    }
  };

  const fetchLesson = async (id: string, params: Record<string, any> = {}) => {
    isLoadingLesson.value = true;
    error.value = null;
    try {
      const response = await api.getDiscoverLesson(id, params);
      lesson.value = extractPayload(response);
      return lesson.value;
    } catch (err) {
      error.value = "Erreur lors du chargement de la leçon";
      lesson.value = null;
      return null;
    } finally {
      isLoadingLesson.value = false;
    }
  };

  const fetchExercises = async (params: Record<string, any> = {}): Promise<DiscoveryExercise[]> => {
    isLoadingExercises.value = true;
    error.value = null;
    try {
      const response = await api.getDiscoverLessons({
        ...params,
      });
      const data = extractPayload(response);
      exercises.value = extractArray(data) as DiscoveryExercise[];
      return exercises.value;
    } catch (err) {
      error.value = "Erreur lors du chargement des exercices";
      exercises.value = [];
      return [];
    } finally {
      isLoadingExercises.value = false;
    }
  };

  const fetchExercisesBySection = async (params: Record<string, any> = {}) => {
    isLoadingExercises.value = true;
    error.value = null;
    try {
      const response = await api.getDiscoverLessons(params);
      const data = extractPayload(response);
      exercises.value = extractArray(data);
      return exercises.value;
    } catch (err) {
      error.value = "Erreur lors du chargement des exercices par section";
      exercises.value = [];
      return [];
    } finally {
      isLoadingExercises.value = false;
    }
  };

  const navigateExercise = async (params: Record<string, any> = {}) => {
    isLoadingExercises.value = true;
    error.value = null;
    try {
      const response = await api.getDiscoverLessons(params);
      currentExercise.value = extractPayload(response);
      return currentExercise.value;
    } catch (err) {
      error.value = "Erreur lors de la navigation des exercices";
      return null;
    } finally {
      isLoadingExercises.value = false;
    }
  };

  const fetchExerciseById = async (id: string, params: Record<string, any> = {}): Promise<DiscoveryExercise | null> => {
    isLoadingExercises.value = true;
    error.value = null;
    try {
      const response = await api.getDiscoverExercise(id, params);
      currentExercise.value = extractPayload(response) as DiscoveryExercise;
      return currentExercise.value;
    } catch (err) {
      error.value = "Erreur lors du chargement de l'exercice";
      return null;
    } finally {
      isLoadingExercises.value = false;
    }
  };

  const submitExercise = async (id: string, payload: SubmitExercisePayload = { answers: {} }): Promise<any> => {
    isSubmitting.value = true;
    error.value = null;
    try {
      const response = await api.submitDiscoverExercise(id, payload);
      return extractPayload(response);
    } catch (err) {
      error.value = "Erreur lors de la soumission de l'exercice";
      return null;
    } finally {
      isSubmitting.value = false;
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
    } catch (err) {
      error.value = "Erreur lors du chargement du score";
      score.value = null;
      return null;
    } finally {
      isLoadingScore.value = false;
    }
  };

  const setCurrentExercise = (exercise: DiscoveryExercise | null) => {
    currentExercise.value = exercise;
  };

  const startDiscovery = async (languageId: string) => {
    const selected = languages.value.find(
      (lang) => lang.id === languageId || lang.code === languageId,
    );
    const languageCode = selected?.code || languageId;

    selectedLanguageId.value = selected?.id || languageId;
    selectedLanguageCode.value = languageCode;
    lesson.value = null;
    exercises.value = [];
    currentExercise.value = null;
    score.value = null;

    await createSession({ languageCode });
    // Récupère les leçons/exercices sans passer languageCode (côté serveur il sera récupéré de la session)
    await fetchExercises({});

    if (exercises.value.length && exercises.value[0]) {
      currentExercise.value = exercises.value[0];
    }
  };

  return {
    languages,
    lesson,
    exercises,
    currentExercise,
    sessionId,
    selectedLanguageId,
    selectedLanguageCode,
    score,
    isLoadingLanguages,
    isCreatingSession,
    isLoadingLesson,
    isLoadingExercises,
    isSubmitting,
    isLoadingScore,
    error,
    fetchLanguages,
    createSession,
    fetchLesson,
    fetchExercises,
    fetchExercisesBySection,
    navigateExercise,
    fetchExerciseById,
    submitExercise,
    fetchScore,
    setCurrentExercise,
    startDiscovery,
  };
});
