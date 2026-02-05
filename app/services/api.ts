import type { LoginCredentials, AuthResponse, User } from "~/types/auth";
import type {
  CreateLanguagePayload,
  CreateLevelPayload,
  Language,
  Level,
} from "~/types/language-level";
import type { ApiResponse } from "~/types/learning";

class ApiService {
  private api;

  constructor() {
    const config = useRuntimeConfig();

    // BaseURL corrigé : port 4000 et /api
    this.api = $fetch.create({
      baseURL: config.public.apiBase,
      onRequest({ options }) {
        const token = useCookie("token").value;
        if (!options.headers) options.headers = new Headers();
        if (token)
          (options.headers as Headers).set("Authorization", `Bearer ${token}`);
      },
    });
  }

  /** Auth */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await this.api("v1/auth/login", {
      method: "POST",
      body: credentials,
    });
  }

  async getMe(): Promise<{ data: User }> {
    return await this.api("v1/users/me");
  }


  async getUsers(): Promise<ApiResponse<User[]>> {
    return await this.api('v1/users')
  }

  async createUser(data: {
    firstName: string
    lastName: string
    email: string
    password: string
    accountType: string
  }): Promise<ApiResponse<User>> {
    return await this.api('v1/users', {
      method: 'POST',
      body: data
    })
  }

  async updateUser(
    id: string,
    data: Partial<{
      nom: string
      prenom: string
      email: string
      password: string
      role: string
    }>
  ): Promise<ApiResponse<User>> {
    return await this.api(`v1/users/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return await this.api(`v1/users/${id}`, {
      method: 'DELETE'
    })
  }

  /** Languages */
  async getLanguages(): Promise<ApiResponse<any[]>> {
    return await this.api("v1/languages");
  }

  async getLanguage(id: string): Promise<ApiResponse<any>> {
    return await this.api(`v1/languages/${id}`);
  }

  async createLanguage(data: CreateLanguagePayload): Promise<ApiResponse<any>> {
    return await this.api("v1/languages", {
      method: "POST",
      body: {
        code: data.code,
        name: data.name,
        description: data.description,
        iconUrl: data.iconUrl || null,
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
    return await this.api(`v1/languages/${id}`, { method: "PUT", body: data });
  }

  async deleteLanguage(id: string): Promise<ApiResponse<void>> {
    return await this.api(`v1/languages/${id}`, { method: "DELETE" });
  }

  /** Levels */
  async getLevels(languageId?: string): Promise<ApiResponse<Level[]>> {
    return await this.api("v1/levels", {
      query: languageId ? { languageId } : {},
    });
  }

  async getLevel(id: string): Promise<ApiResponse<Level>> {
    return await this.api(`v1/levels/${id}`);
  }

  /** --- CRÉATION DE NIVEAUX --- */
  async createLevelForLanguage(
    languageId: string,
    data: CreateLevelPayload,
  ): Promise<ApiResponse<Level>> {
    // POST sur /levels avec languageId dans le body
    return await this.api<ApiResponse<Level>>("v1/levels", {
      method: "POST",
      body: {
        ...data,
        languageId,
        isActive: data.isActive ?? true, // par défaut actif
      },
    });
  }

  /** Obtenir les niveaux d'une langue */
  async getLevelsByLanguage(languageId: string): Promise<ApiResponse<Level[]>> {
    return await this.api("v1/levels", {
      query: { languageId },
    });
  }

  /** Mettre à jour un niveau d'une langue */
  async updateLevelForLanguage(
    languageId: string,
    levelId: string,
    data: Partial<CreateLevelPayload>,
  ): Promise<ApiResponse<Level>> {
    return await this.api(`v1/levels/${levelId}`, {
      method: "PUT",
      body: data,
    });
  }

  // async getSteps(levelId?: string): Promise<ApiResponse<Step[]>> {
  //   return await this.api('v1/steps', { query: levelId ? { levelId } : {} });
  // }

  // async getStep(id: string): Promise<ApiResponse<Step>> {
  //   return await this.api(`v1/steps/${id}`);
  // }

  // async createStep(data: CreateStepRequest): Promise<ApiResponse<Step>> {
  //   return await this.api('v1/steps', { method: 'POST', body: data });
  // }

  // async updateStep(id: string, data: Partial<Step>): Promise<ApiResponse<Step>> {
  //   return await this.api(`v1/steps/${id}`, { method: 'PUT', body: data });
  // }

  // async deleteStep(id: string): Promise<ApiResponse<void>> {
  //   return await this.api(`v1/steps/${id}`, { method: 'DELETE' });
  // }

  // async getExercises(lessonId?: string): Promise<ApiResponse<Exercise[]>> {
  //   return await this.api('v1/exercises', { query: lessonId ? { lessonId } : {} });
  // }

  // async getExercise(id: string): Promise<ApiResponse<Exercise>> {
  //   return await this.api(`v1/exercises/${id}`);
  // }

  // async createExercise(data: CreateExerciseRequest): Promise<ApiResponse<Exercise>> {
  //   return await this.api('v1/exercises', { method: 'POST', body: data });
  // }

  // async updateExercise(id: string, data: Partial<Exercise>): Promise<ApiResponse<Exercise>> {
  //   return await this.api(`v1/exercises/${id}`, { method: 'PUT', body: data });
  // }

  // async deleteExercise(id: string): Promise<ApiResponse<void>> {
  //   return await this.api(`v1/exercises/${id}`, { method: 'DELETE' });
  // }

  // async getCourses(stepId?: string): Promise<ApiResponse<Course[]>> {
  //   return await this.api('v1/courses', { query: stepId ? { stepId } : {} });
  // }

  // async getCourse(id: string): Promise<ApiResponse<Course>> {
  //   return await this.api(`v1/courses/${id}`);
  // }

  // async createCourse(data: CreateCourseRequest): Promise<ApiResponse<Course>> {
  //   return await this.api('v1/courses', { method: 'POST', body: data });
  // }

  // async updateCourse(id: string, data: Partial<Course>): Promise<ApiResponse<Course>> {
  //   return await this.api(`v1/courses/${id}`, { method: 'PUT', body: data });
  // }

  // async deleteCourse(id: string): Promise<ApiResponse<void>> {
  //   return await this.api(`v1/courses/${id}`, { method: 'DELETE' });
  // }

  // async getStepQuizzes(stepId?: string): Promise<ApiResponse<StepQuiz[]>> {
  //   return await this.api('v1/step-quizzes', { query: stepId ? { stepId } : {} });
  // }

  // async getStepQuiz(id: string): Promise<ApiResponse<StepQuiz>> {
  //   return await this.api(`v1/step-quizzes/${id}`);
  // }

  // async createStepQuiz(data: CreateStepQuizRequest): Promise<ApiResponse<StepQuiz>> {
  //   return await this.api('v1/step-quizzes', { method: 'POST', body: data });
  // }
  /** Supprimer un niveau d'une langue */
  async deleteLevelForLanguage(
    languageId: string,
    levelId: string,
  ): Promise<ApiResponse<void>> {
    return await this.api(`v1/levels/${levelId}`, {
      method: "DELETE",
    });
  }

  /** Création des niveaux par défaut */
  async createDefaultLevels(languageId: string): Promise<ApiResponse<Level[]>> {
    const defaultLevels: CreateLevelPayload[] = [
      {
        languageId,
        name: "Basique",
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
      if (response.success && response.data) createdLevels.push(response.data);
    }

    return { success: true, data: createdLevels };
  }
}

let instance: ApiService;
export const useApiService = () => {
  if (!instance) instance = new ApiService();
  return instance;
};
