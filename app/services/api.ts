import type { LoginCredentials, AuthResponse, User } from "~/types/auth";
import type {
  CreateLanguagePayload,
  CreateLevelPayload,
  Level,
} from "~/types/language-level";
import type { ApiResponse, StepQuiz, CreateStepQuizRequest } from "~/types/learning";
import type { CreateUserPayload, UpdateUserPayload, UserFilter } from "~/types/user";
import type { module, moduleRequest, moduleResponse } from "~/types/modules";
import type { StatTotalResponse, UsersTotalParams } from "~/types/dashboard";
import type {
  CreateDiscoverSectionRequest,
  UpdateDiscoverSectionRequest,
  CreateDiscoverContentRequest,
  UpdateDiscoverContentRequest,
} from "~/types/discovery";

type UploadKind = "image" | "video" | "audio" | "pdf" | "content";
import type {
  ProgressionResponse,
  CompleteProgressionResponse,
  ProgressionStatsResponse,
} from "~/types/progression";
import { useSessionStore } from "~/stores/sessionStore";

class ApiService {
  private api: ReturnType<typeof $fetch.create>;
  private discoverBase: string | null = null;
  private discoverFallbackBase: string | null = null;

  private accessToken: string | null = null;

  constructor() {
    const config = useRuntimeConfig();
    const apiBase = (config.public.apiBase || "").replace(/\/+$/, "");
    const discoverBase = (config.public.discoverApiBase || apiBase).replace(/\/+$/, "");

    this.api = $fetch.create({
      baseURL: apiBase,
      onRequest: ({ options }) => {
        const token = this.accessToken || useCookie("token").value;

        if (!options.headers) {
          options.headers = new Headers();
        }

        if (token) {
          (options.headers as Headers).set(
              "Authorization",
              `Bearer ${token}`,
          );
        }
      },
      onResponseError: ({ response }) => {
        if (!process.client) return;

        const status = response?.status;
        if (status !== 401 && status !== 403) return;

        const token = this.accessToken || useCookie("token").value;
        if (!token) return;

        const sessionStore = useSessionStore();
        sessionStore.showSessionExpired();
      },
    });

    if (discoverBase) {
      this.discoverBase = discoverBase;
    }

    if (!config.public.discoverApiBase && apiBase.endsWith("/api")) {
      this.discoverFallbackBase = apiBase.slice(0, -4);
    }
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async discoverRequest<T>(path: string, options: Record<string, any> = {}): Promise<T> {
    const baseURL = this.discoverBase || undefined;
    try {
      return await this.api(path, { ...options, baseURL });
    } catch (err: any) {
      const status = err?.statusCode ?? err?.status;
      if (status === 404 && this.discoverFallbackBase) {
        return await this.api(path, { ...options, baseURL: this.discoverFallbackBase });
      }
      throw err;
    }
  }

  /* ===================== AUTH ===================== */

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await this.api("/v1/auth/login", {
      method: "POST",
      body: credentials,
    });
  }

  async getMe(): Promise<{ data: { user: User } }> {
    return await this.api("/v1/users/me");
  }

  async getFilterUsers(filters?: UserFilter): Promise<
      ApiResponse<{
        users: User[]
        pagination: {
          page: number
          limit: number
          total: number
        }
      }>
  > {
    return await this.api("/v1/users/profile-filters", {
      query: filters,
    });
  }

  async createUser(
      payload: CreateUserPayload,
  ): Promise<ApiResponse<User>> {
    return await this.api("/v1/auth/register", {
      method: "POST",
      body: payload,
    });
  }

  /* ===================== USERS ===================== */

  async getUsers(): Promise<
      ApiResponse<{
        users: User[]
        pagination: {
          page: number
          limit: number
          total: number
        }
      }>
  > {
    return await this.api("/v1/users");
  }

  async updateUser(
      id: string,
      data: UpdateUserPayload,
  ): Promise<ApiResponse<User>> {
    return await this.api(`/v1/users/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return await this.api(`/v1/users/${id}`, {
      method: "DELETE",
    });
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return await this.api(`/v1/users/${id}`);
  }

  /* ===================== LANGUAGES ===================== */

  async getLanguages(): Promise<ApiResponse<any[]>> {
    return await this.api("/v1/languages");
  }

  async getLanguage(id: string): Promise<ApiResponse<any>> {
    return await this.api(`/v1/languages/${id}`);
  }

  async createLanguage(
      data: CreateLanguagePayload,
  ): Promise<ApiResponse<any>> {
    return await this.api("/v1/languages", {
      method: "POST",
      body: {
        code: data.code,
        name: data.name,
        description: data.description,
        iconUrl: data.iconUrl ?? null,
        isActive: data.isActive ?? true,
      },
    });
  }

  async updateLanguage(
      id: string,
      data: Partial<{
        name: string;
        code: string;
        description?: string;
        iconUrl?: string;
        isActive?: boolean;
      }>,
  ): Promise<ApiResponse<any>> {
    return await this.api(`/v1/languages/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteLanguage(id: string): Promise<ApiResponse<void>> {
    return await this.api(`/v1/languages/${id}`, {
      method: "DELETE",
    });
  }

  /* ==== ACTIVATE / DEACTIVATE LANGUAGE ==== */

  async activateLanguage(id: string): Promise<ApiResponse<any>> {
    return await this.api(`/v1/languages/${id}/activate`, {
      method: "PATCH",
    });
  }

  async deactivateLanguage(id: string): Promise<ApiResponse<any>> {
    return await this.api(`/v1/languages/${id}/deactivate`, {
      method: "PATCH",
    });
  }

  /* ===================== LEVELS ===================== */

  async getLevels(languageId?: string): Promise<ApiResponse<Level[]>> {
    return await this.api("/v1/levels", {
      query: languageId ? { languageId } : {},
    });
  }

  async getLevel(id: string): Promise<ApiResponse<Level>> {
    return await this.api(`/v1/levels/${id}`);
  }

  async createLevelForLanguage(
      languageId: string,
      data: CreateLevelPayload,
  ): Promise<ApiResponse<Level>> {
    return await this.api("/v1/levels", {
      method: "POST",
      body: {
        ...data,
        languageId,
        isActive: data.isActive ?? true,
      },
    });
  }

  async getLevelsByLanguage(
      languageId: string,
  ): Promise<ApiResponse<Level[]>> {
    return await this.api("/v1/levels", {
      query: { languageId },
    });
  }

  async updateLevelForLanguage(
      levelId: string,
      data: Partial<CreateLevelPayload>,
  ): Promise<ApiResponse<Level>> {
    return await this.api(`/v1/levels/${levelId}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteLevelForLanguage(
      levelId: string,
  ): Promise<ApiResponse<void>> {
    return await this.api(`/v1/levels/${levelId}`, {
      method: "DELETE",
    });
  }

  /* ==== ACTIVATE / DEACTIVATE LEVEL ==== */

  async activateLevel(id: string): Promise<ApiResponse<Level>> {
    return await this.api(`/v1/levels/${id}/activate`, {
      method: "PATCH",
    });
  }

  async deactivateLevel(id: string): Promise<ApiResponse<Level>> {
    return await this.api(`/v1/levels/${id}/deactivate`, {
      method: "PATCH",
    });
  }

  /* ===================== MODULES ===================== */

  async getModulesByLevel(languageId: string, levelId: string): Promise<ApiResponse<module[]>> {
    return await this.api(`/v1/languages/${languageId}/levels/${levelId}/modules`);
  }

  async getLearningPathsByModule(
    languageId: string,
    levelId: string,
    moduleId: string,
  ): Promise<ApiResponse<any[]>> {
    return await this.api(
      `/v1/languages/${languageId}/levels/${levelId}/modules/${moduleId}/paths`,
    );
  }

  async getStepsByPath(
    languageId: string,
    levelId: string,
    moduleId: string,
    pathId: string,
  ): Promise<ApiResponse<any[]>> {
    return await this.api(
      `/v1/languages/${languageId}/levels/${levelId}/modules/${moduleId}/paths/${pathId}/steps`,
    );
  }

  async getModule(levelId?: string): Promise<ApiResponse<module[]>> {
    return await this.api("/v1/modules", {
      query: levelId ? { levelId } : {},
    });
  }

  async createModule(data: moduleRequest): Promise<ApiResponse<module>> {
    return await this.api("/v1/modules", {
      method: "POST",
      body: data,
    });
  }

  async updateModule(
      id: string,
      data: Partial<moduleResponse>,
  ): Promise<ApiResponse<module>> {
    return await this.api(`/v1/modules/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteModule(id: string): Promise<ApiResponse<void>> {
    return await this.api(`/v1/modules/${id}`, {
      method: "DELETE",
    });
  }

  /* ===================== LEARNING PATHS ===================== */

  async getLearningPaths(moduleId?: string): Promise<ApiResponse<any[]>> {
    return await this.api("/v1/learning-paths", {
      query: moduleId ? { moduleId } : {},
    });
  }

  async createLearningPath(data: any): Promise<ApiResponse<any>> {
    return await this.api("/v1/learning-paths", {
      method: "POST",
      body: data,
    });
  }

  async updateLearningPath(
      id: string,
      data: any,
  ): Promise<ApiResponse<any>> {
    return await this.api(`/v1/learning-paths/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteLearningPath(id: string): Promise<ApiResponse<void>> {
    return await this.api(`/v1/learning-paths/${id}`, {
      method: "DELETE",
    });
  }

  /* ===================== STEPS ===================== */

  async getSteps(pathId: string): Promise<ApiResponse<any[]>> {
    return await this.api("/v1/steps", {
      query: {
        pathId,
        learningPathId: pathId,
      },
    });
  }

  async getStep(id: string): Promise<ApiResponse<any>> {
    return await this.api(`/v1/steps/${id}`);
  }

  async createStep(data: any): Promise<ApiResponse<any>> {
    return await this.api("/v1/steps", {
      method: "POST",
      body: data,
    });
  }

  async updateStep(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.api(`/v1/steps/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteStep(id: string): Promise<ApiResponse<void>> {
    return await this.api(`/v1/steps/${id}`, {
      method: "DELETE",
    });
  }

  /* ===================== COURSES ===================== */

  async getCourses(stepId?: string): Promise<ApiResponse<any[]>> {
    return await this.api("/v1/courses", {
      query: stepId ? { stepId } : {},
    });
  }

  async getCourse(id: string): Promise<ApiResponse<any>> {
    return await this.api(`/v1/courses/${id}`);
  }

  async createCourse(data: any): Promise<ApiResponse<any>> {
    return await this.api("/v1/courses", {
      method: "POST",
      body: data,
    });
  }

  async updateCourse(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.api(`/v1/courses/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    return await this.api(`/v1/courses/${id}`, {
      method: "DELETE",
    });
  }

  /* ===================== EXERCISES ===================== */

  async getExercises(lessonId?: string): Promise<ApiResponse<any[]>> {
    return await this.api("/v1/exercises", {
      query: lessonId ? { lessonId } : {},
    });
  }

  async getExercise(id: string): Promise<ApiResponse<any>> {
    return await this.api(`/v1/exercises/${id}`);
  }

  async createExercise(data: any): Promise<ApiResponse<any>> {
    return await this.api("/v1/exercises", {
      method: "POST",
      body: data,
    });
  }

  async updateExercise(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.api(`/v1/exercises/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteExercise(id: string): Promise<ApiResponse<void>> {
    return await this.api(`/v1/exercises/${id}`, {
      method: "DELETE",
    });
  }

  /* ===================== STEP QUIZZES ===================== */

  async getStepQuizzes(stepId?: string): Promise<ApiResponse<StepQuiz[]>> {
    if (!stepId) {
      return await this.api("/v1/step-quizzes");
    }

    try {
      return await this.api("/v1/step-quizzes", {
        query: { stepId },
      });
    } catch (err: any) {
      const status = err?.statusCode ?? err?.status;
      if (status === 404) {
        return await this.api(`/v1/step-quizzes/${stepId}`);
      }
      throw err;
    }
  }

  async getStepQuiz(id: string): Promise<ApiResponse<StepQuiz>> {
    return await this.api(`/v1/step-quizzes/${id}`);
  }

  async createStepQuiz(
      data: CreateStepQuizRequest,
  ): Promise<ApiResponse<StepQuiz>> {
    return await this.api("/v1/step-quizzes", {
      method: "POST",
      body: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });
  }

  async updateStepQuiz(
      id: string,
      data: Partial<StepQuiz>,
  ): Promise<ApiResponse<StepQuiz>> {
    return await this.api(`/v1/step-quizzes/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteStepQuiz(id: string): Promise<ApiResponse<void>> {
    return await this.api(`/v1/step-quizzes/${id}`, {
      method: "DELETE",
    });
  }

  /* ===================== UPLOADS ===================== */

  async uploadMedia(mediaType: UploadKind | null, file: File): Promise<any> {
    const formData = new FormData();

    let fieldName = "content";
    if (mediaType) {
      switch (mediaType) {
        case "image":  fieldName = "image";   break;
        case "video":  fieldName = "video";   break;
        case "audio":  fieldName = "audio";   break;
        case "pdf":    fieldName = "pdf";     break;
        default:       fieldName = "content"; break;
      }
    } else {
      if (file.type.startsWith("image/"))           fieldName = "image";
      else if (file.type.startsWith("video/"))      fieldName = "video";
      else if (file.type.startsWith("audio/"))      fieldName = "audio";
      else if (file.type.startsWith("pdf/"))        fieldName = "pdf";
    }

    formData.append(fieldName, file);

    let endpoint = "/v1/uploads/content";
    if (mediaType) {
      switch (mediaType) {
        case "image":  endpoint = "/v1/uploads/image";   break;
        case "video":  endpoint = "/v1/uploads/video";   break;
        case "audio":  endpoint = "/v1/uploads/audio";   break;
        case "pdf":    endpoint = "/v1/uploads/pdf";     break;
        default:       endpoint = "/v1/uploads/content"; break;
      }
    } else {
      if (file.type.startsWith("image/"))           endpoint = "/v1/uploads/image";
      else if (file.type.startsWith("video/"))      endpoint = "/v1/uploads/video";
      else if (file.type.startsWith("audio/"))      endpoint = "/v1/uploads/audio";
      else if (file.type.startsWith("pdf/"))        endpoint = "/v1/uploads/pdf";
    }

    try {
      return await this.api(endpoint, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("❌ Erreur upload média :", error);
      throw new Error("Échec de l'upload du fichier");
    }
  }

  /**
   * Upload un fichier média pour les sections discover.
   * Détecte automatiquement le type et utilise uploadMedia en interne.
   */
  async uploadDiscoverMedia(file: File): Promise<any> {
    return this.uploadMedia(null, file);
  }

  /* ===================== DISCOVER — SECTIONS ===================== */

  /** GET /v1/discover/sections */
  async getDiscoverSections(params: Record<string, any> = {}): Promise<any> {
    return await this.discoverRequest("/v1/discover/sections", {
      query: params,
    });
  }

  /** POST /v1/discover/sections */
  async createDiscoverSection(payload: CreateDiscoverSectionRequest): Promise<any> {
    return await this.discoverRequest("/v1/discover/sections", {
      method: "POST",
      body: payload,
    });
  }

  /** PATCH /v1/discover/sections/:sectionId */
  async updateDiscoverSection(sectionId: string, payload: UpdateDiscoverSectionRequest): Promise<any> {
    return await this.discoverRequest(`/v1/discover/sections/${sectionId}`, {
      method: "PATCH",
      body: payload,
    });
  }

  /** DELETE /v1/discover/sections/:sectionId */
  async deleteDiscoverSection(sectionId: string): Promise<any> {
    return await this.discoverRequest(`/v1/discover/sections/${sectionId}`, {
      method: "DELETE",
    });
  }

  /* ===================== DISCOVER — CONTENTS ===================== */

  /** POST /v1/discover/sections/:sectionId/contents */
  async addDiscoverContent(sectionId: string, payload: CreateDiscoverContentRequest): Promise<any> {
    return await this.discoverRequest(`/v1/discover/sections/${sectionId}/contents`, {
      method: "POST",
      body: payload,
    });
  }

  /** PATCH /v1/discover/contents/:contentId */
  async updateDiscoverContent(contentId: string, payload: UpdateDiscoverContentRequest): Promise<any> {
    return await this.discoverRequest(`/v1/discover/contents/${contentId}`, {
      method: "PATCH",
      body: payload,
    });
  }

  /** DELETE /v1/discover/contents/:contentId */
  async deleteDiscoverContent(contentId: string): Promise<any> {
    return await this.discoverRequest(`/v1/discover/contents/${contentId}`, {
      method: "DELETE",
    });
  }

  /* ===================== DASHBOARD ===================== */

  async getDashboardData(
    params?: UsersTotalParams,
  ): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/users/total", {
      query: params,
    });
  }

  async getAllLearningPathsDashboard(): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/learning-paths/total");
  }

  async getAllStepsDashboard(): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/steps/total");
  }

  async getAllLessonDashboard(): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/lessons/total");
  }

  async getAllQuizzesDashboard(): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/quizzes/total");
  }

  async getAllLevelsDashboard(): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/levels/total");
  }

  async getAllUsersDashboard(): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/users/total");
  }

  /* ===================== PROGRESSION ===================== */

  async getProgression(
      userId: string,
      languageId: string,
  ): Promise<ProgressionResponse> {
    return await this.api(
        `/v1/progression/user/${userId}/language/${languageId}`,
    );
  }

  async getCompleteProgression(
      userId: string,
      languageId: string,
  ): Promise<CompleteProgressionResponse> {
    return await this.api(
        `/v1/progression/complete/${userId}/${languageId}`,
    );
  }

  async getProgressionStats(
      userId: string,
      languageId: string,
  ): Promise<ProgressionStatsResponse> {
    return await this.api(
        `/v1/progression/stats/${userId}/${languageId}`,
    );
  }
}

/* ===================== SINGLETON ===================== */

let instance: ApiService;

export const useApiService = () => {
  if (!instance) {
    instance = new ApiService();
  }
  return instance;
};
