import type { LoginCredentials, AuthResponse, User } from "~/types/auth";
import type {
  CreateLanguagePayload,
  CreateLevelPayload,
  Level,
} from "~/types/language-level";
import type { ApiResponse } from "~/types/learning";
import type { CreateUserPayload } from "~/types/user";
import type { module, moduleRequest, moduleResponse } from "~/types/modules";
import type { StatTotalResponse, UsersTotalParams } from "~/types/dashboard";
import type {
  ProgressionResponse,
  CompleteProgressionResponse,
  ProgressionStatsResponse,
} from "~/types/progression";

class ApiService {
  private api: ReturnType<typeof $fetch.create>;

  private accessToken: string | null = null;

  constructor() {
    const config = useRuntimeConfig();

    this.api = $fetch.create({
      baseURL: config.public.apiBase,
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
    });
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
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

  async createUser(
    payload: CreateUserPayload,
  ): Promise<ApiResponse<User>> {
    return await this.api("/v1/auth/register", {
      method: "POST",
      body: payload,
    });
  }

  /* ===================== USERS ===================== */

  async getUsers(): Promise<ApiResponse<User[]>> {
    return await this.api("/v1/users");
  }

  async updateUser(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      accountType: string;
    }>,
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

  /* ===================== DEFAULT LEVELS ===================== */

  async createDefaultLevels(
    languageId: string,
  ): Promise<ApiResponse<Level[]>> {
    const defaultLevels: CreateLevelPayload[] = [
      {
        languageId,
        name: "Débutant",
        code: "beginner",
        description: "Niveau pour les débutants",
        index: 0,
        isActive: true,
      },
      {
        languageId,
        name: "Intermédiaire",
        code: "intermediate",
        description: "Niveau pour les intermédiaires",
        index: 1,
        isActive: true,
      },
      {
        languageId,
        name: "Avancé",
        code: "advanced",
        description: "Niveau pour les avancés",
        index: 2,
        isActive: true,
      },
    ];

    const createdLevels: Level[] = [];

    for (const level of defaultLevels) {
      const response = await this.createLevelForLanguage(languageId, level);
      if (response.success && response.data) {
        createdLevels.push(response.data);
      }
    }

    return { success: true, data: createdLevels };
  }
  /* ===================== MODULES ===================== */

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
  async getSteps(learningPathId: string): Promise<ApiResponse<any[]>> {
    return await this.api("/v1/steps", {
      query: { learningPathId },
    });
  }

  async createStep(data: any): Promise<ApiResponse<any>> {
    return await this.api("/v1/steps", {
      method: "POST",
      body: data,
    });
  }

  async updateStep(
    id: string,
    data: any,
  ): Promise<ApiResponse<any>> {
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




  async getDashboardData(params?: UsersTotalParams): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/users/total", {
      query: params,
    });
  }

  async getAllLearningPathsDashboard(): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/learning-paths/total")
  }

  async getAllStepsDashboard(): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/steps/total")
  }

  async getAllLessonDashboard(): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/lessons/total")
  }

  async getAllQuizzesDashboard(): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/quizzes/total")
  }

  async getAllLevelsDashboard(): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/levels/total")
  }

  async getAllUsersDashboard(): Promise<StatTotalResponse> {
    return await this.api("/v1/admin/stats/users/total")
  }

  /* ===================== PROGRESSION ===================== */

  async getProgression(
    userId: string,
    languageId: string,
  ): Promise<ProgressionResponse> {
    return await this.api(`/v1/progression/user/${userId}/language/${languageId}`);
  }

  async getCompleteProgression(
    userId: string,
    languageId: string,
  ): Promise<CompleteProgressionResponse> {
    return await this.api(`/v1/progression/complete/${userId}/${languageId}`);
  }

  async getProgressionStats(
    userId: string,
    languageId: string,
  ): Promise<ProgressionStatsResponse> {
    return await this.api(`/v1/progression/stats/${userId}/${languageId}`);
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
