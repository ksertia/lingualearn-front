import type { CreateUserPayload } from './../types/user';
import type { CreateLevelPayload } from '~/types/language-level';
import type { LoginCredentials, AuthResponse, User } from '~/types/auth';
import type { DashboardResponse } from '~/types/dashboard';
import type {
  LearningPath, Level, Step, Exercise, Course, StepQuiz,
  ApiResponse, CreateStepQuizRequest
} from '~/types/learning';
import type { moduleResponse, moduleRequest } from '~/types/modules';
import { Title } from 'chart.js';

class ApiService {
  private api: ReturnType<typeof $fetch.create>;

  constructor() {
    const config = useRuntimeConfig();

    this.api = $fetch.create({
      baseURL: config.public.apiBase,
      onRequest({ options }) {
        const token = useCookie("token").value;

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

  /* ================= AUTH ================= */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await this.api("/v1/auth/login", {
      method: "POST",
      body: credentials,
    });
  }

  async getMe(): Promise<{ data: User }> {
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
   async deleteUser(id: string): Promise<ApiResponse<void>> {
    return await this.api(`/v1/users/${id}`, {
      method: "DELETE",
    });
  }

  /* ================= PARCOURS ================= */
  async getLearningPaths(): Promise<ApiResponse<LearningPath[]>> {
    return await this.api('v1/learning-paths');
  }

  async getLearningPath(id: string): Promise<ApiResponse<LearningPath>> {
    return await this.api(`v1/learning-paths/${id}`);
  }

  async createLearningPath(data: {
    moduleId: string,
    title: string,
    description: string,
    index?: number,
    tempResaListime?: number,
    thumbnailUrl?: string,
    difficulty?: string,
    estimatedHours?: number,
    isActive?: boolean
  }): Promise<ApiResponse<LearningPath>> {
    // Définition des valeurs par défaut pour le backend
    const payload = {
      CreateLevelPayload:'',
      CreateUserPayload:'',
      index: 0,
      tempResaListime: 0,
      thumbnailUrl: '',
      difficulty: 'easy',
      estimatedHours: 0,
      isActive: true,
      ...data
    }
    return await this.api('v1/learning-paths', { method: 'POST', body: payload });
  }

  async updateLearningPath(id: string, data: Partial<LearningPath>): Promise<ApiResponse<LearningPath>> {
    return await this.api(`v1/learning-paths/${id}`, { method: 'PUT', body: data });
  }

 

  /* ===================== LANGUAGES ===================== */
  async getLanguage(id: string): Promise<ApiResponse<any>> {
    return await this.api(`/v1/languages/${id}`);
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
  async deleteLanguage(id: string): Promise<ApiResponse<void>> {
    return await this.api(`/v1/languages/${id}`, {
      method: "DELETE",
    });
  }

  /* ================= NIVEAUX ================= */
  async getLevels(learningPathId?: string): Promise<ApiResponse<Level[]>> {
    return await this.api('v1/levels', { query: learningPathId ? { learningPathId } : {} });
  }
  async createLevel(data: any): Promise<ApiResponse<Level>> {
    return await this.api('v1/levels', { method: 'POST', body: data });
  }

  async updateLevel(id: string, data: Partial<Level>): Promise<ApiResponse<Level>> {
    return await this.api(`v1/levels/${id}`, { method: 'PUT', body: data });
  }

  async deleteLevel(id: string): Promise<ApiResponse<void>> {
    return await this.api(`v1/levels/${id}`, { method: 'DELETE' });
  }

  /* ================= ÉTAPES ================= */
  async getSteps(levelId?: string): Promise<ApiResponse<Step[]>> {
    return await this.api('v1/steps', { query: levelId ? { levelId } : {} });
  }

  async getStep(id: string): Promise<ApiResponse<Step>> {
    return await this.api(`v1/steps/${id}`);
  }

  async createStep(data: any): Promise<ApiResponse<Step>> {
    return await this.api('v1/steps', { method: 'POST', body: data });
  }

  async updateStep(id: string, data: Partial<Step>): Promise<ApiResponse<Step>> {
    return await this.api(`v1/steps/${id}`, { method: 'PUT', body: data });
  }
  async deleteStep(id:string, data:Promise<Step>):Promise<ApiResponse<Step>>{
    return await this.api(`v1/step/${id}`, { method: 'DELETE', body: data});
  }

  

  /* ===================== LEVELS ===================== */

  /* ================= EXERCICES ================= */
  async getExercises(id?: string): Promise<ApiResponse<Exercise[]>> {
    return await this.api('v1/exercises', { query: id ? { id } : {} });
  }

  async getExercise(id: string): Promise<ApiResponse<Exercise>> {
    return await this.api(`v1/exercises/${id}`);  
  }

  async createExercise(data: any): Promise<ApiResponse<Exercise>> {
    return await this.api('v1/exercises', { method: 'POST', body: data });
  }

  async updateExercise(id: string, data: Partial<Exercise>): Promise<ApiResponse<Exercise>> {
    return await this.api(`v1/exercises/${id}`, { method: 'PUT', body: data });
  }

  async deleteExercise(id: string): Promise<ApiResponse<void>> {
    return await this.api(`v1/exercises/${id}`, { method: 'DELETE' });
  }

  /* ================= COURS ================= */
  async getCourses(stepId?: string): Promise<ApiResponse<Course[]>> {
    return await this.api('v1/courses', { query: stepId ? { stepId } : {} });
  }

  async getCourse(id: string): Promise<ApiResponse<Course>> {
    return await this.api(`v1/courses/${id}`);
  }

  async createCourse(data: any): Promise<ApiResponse<Course>> {
    return await this.api('v1/courses', { method: 'POST', body: data });
  }
  async updateCourse(id: string, data: Partial<Course>): Promise<ApiResponse<Course>> {
    return await this.api(`v1/courses/${id}`, { method: 'PUT', body: data });
  }
  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    return await this.api(`v1/courses/${id}`, { method: 'DELETE' });
  }

  

  /* ================= MODULES ================= */
  async getModule(levelId?: string): Promise<ApiResponse<moduleResponse[]>> {
    return await this.api('v1/modules', { query: levelId ? { levelId } : {} });
  }

  async createModule(data: moduleRequest): Promise<ApiResponse<moduleResponse>> {
    return await this.api('v1/modules', { method: 'POST', body: data });
  }

  async updateModule(id: string, data: Partial<moduleResponse>): Promise<ApiResponse<moduleResponse>> {
    return await this.api(`v1/modules/${id}`, { method: 'PUT', body: data });
  }

  async deleteModule(id: string): Promise<ApiResponse<void>> {
    return await this.api(`v1/modules/${id}`, { method: 'DELETE' });
  }

  /* ================= DASHBOARD ================= */
  async getAdminDashboard(): Promise<ApiResponse<DashboardResponse>> {
    return await this.api('v1/admin/dashboard');
  }

  /* ================= QUIZ ================= */

// 🔹 Récupérer les quizzes d’une étape
async getStepQuizzes(stepId?: string): Promise<ApiResponse<StepQuiz[]>> {
  return await this.api('v1/step-quizzes', {
    query: stepId ? { stepId } : {}
  })
}
// 🔹 Récupérer un quiz par son ID
async getStepQuiz(id: string): Promise<ApiResponse<StepQuiz>> {
  return await this.api(`v1/step-quizzes/${id}`)
}
// 🔹 Créer un quiz pour une étape
async createStepQuiz(
  data: CreateStepQuizRequest
): Promise<ApiResponse<StepQuiz>> {
  return await this.api('v1/step-quizzes', {
    method: 'POST',
    body: data
  })
}
// 🔹 Mettre à jour un quiz
async updateStepQuiz(
  id: string,
  data: Partial<StepQuiz>
): Promise<ApiResponse<StepQuiz>> {
  return await this.api(`v1/step-quizzes/${id}`, {
    method: 'PUT', // ou 'PATCH' selon ton backend
    body: data
  })
}
// 🔹 Supprimer un quiz
async deleteStepQuiz(id: string): Promise<ApiResponse<void>> {
  return await this.api(`v1/step-quizzes/${id}`, {
    method: 'DELETE'
  })
}

}




let instance: ApiService;

export const useApiService = () => {
  if (!instance) {
    instance = new ApiService();
  }
  return instance;
}
