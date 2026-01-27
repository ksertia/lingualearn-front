import type { LoginCredentials, AuthResponse, User } from '~/types/auth';
import type { parcours } from '~/types/parcours';
import type { DashboardResponse } from '~/types/dashboard';
import type {
  LearningPath, Level, Step, Exercise, Course, StepQuiz,
  CreateLearningPathRequest, CreateLevelRequest, CreateStepRequest, CreateExerciseRequest, CreateCourseRequest, CreateStepQuizRequest,
  ApiResponse
} from '~/types/learning';

class ApiService {
  private api;

  constructor() {
    const config = useRuntimeConfig();
    this.api = $fetch.create({
      baseURL: config.public.apiBase,
      onRequest({ options }) {
        const token = useCookie('token').value;
        if (token) options.headers.set('Authorization', `Bearer ${token}`);
      },
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await this.api('v1/auth/login', { method: 'POST', body: credentials });
  }

  async getMe(): Promise<{ data: User }> {
    return await this.api('v1/users/me');
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    return await this.api('v1/users');
  }

  async getLearningPaths(): Promise<ApiResponse<LearningPath[]>> {
    return await this.api('v1/learning-paths');
  }

  async getLearningPath(id: string): Promise<ApiResponse<LearningPath>> {
    return await this.api(`v1/learning-paths/${id}`);
  }

  async createLearningPath(data: CreateLearningPathRequest): Promise<ApiResponse<LearningPath>> {
    return await this.api('v1/learning-paths', { method: 'POST', body: data });
  }

  async updateLearningPath(id: string, data: Partial<LearningPath>): Promise<ApiResponse<LearningPath>> {
    return await this.api(`v1/learning-paths/${id}`, { method: 'PUT', body: data });
  }

  async deleteLearningPath(id: string): Promise<ApiResponse<void>> {
    return await this.api(`v1/learning-paths/${id}`, { method: 'DELETE' });
  }

  async getLevels(learningPathId?: string): Promise<ApiResponse<Level[]>> {
    return await this.api('v1/levels', { query: learningPathId ? { learningPathId } : {} });
  }

  async getLevel(id: string): Promise<ApiResponse<Level>> {
    return await this.api(`v1/levels/${id}`);
  }

  async createLevel(data: CreateLevelRequest): Promise<ApiResponse<Level>> {
    return await this.api('v1/levels', { method: 'POST', body: data });
  }

  async updateLevel(id: string, data: Partial<Level>): Promise<ApiResponse<Level>> {
    return await this.api(`v1/levels/${id}`, { method: 'PUT', body: data });
  }

  async deleteLevel(id: string): Promise<ApiResponse<void>> {
    return await this.api(`v1/levels/${id}`, { method: 'DELETE' });
  }

  async getSteps(levelId?: string): Promise<ApiResponse<Step[]>> {
    return await this.api('v1/steps', { query: levelId ? { levelId } : {} });
  }

  async getStep(id: string): Promise<ApiResponse<Step>> {
    return await this.api(`v1/steps/${id}`);
  }

  async createStep(data: CreateStepRequest): Promise<ApiResponse<Step>> {
    return await this.api('v1/steps', { method: 'POST', body: data });
  }

  async updateStep(id: string, data: Partial<Step>): Promise<ApiResponse<Step>> {
    return await this.api(`v1/steps/${id}`, { method: 'PUT', body: data });
  }

  async deleteStep(id: string): Promise<ApiResponse<void>> {
    return await this.api(`v1/steps/${id}`, { method: 'DELETE' });
  }

  async getExercises(lessonId?: string): Promise<ApiResponse<Exercise[]>> {
    return await this.api('v1/exercises', { query: lessonId ? { lessonId } : {} });
  }

  async getExercise(id: string): Promise<ApiResponse<Exercise>> {
    return await this.api(`v1/exercises/${id}`);
  }

  async createExercise(data: CreateExerciseRequest): Promise<ApiResponse<Exercise>> {
    return await this.api('v1/exercises', { method: 'POST', body: data });
  }

  async updateExercise(id: string, data: Partial<Exercise>): Promise<ApiResponse<Exercise>> {
    return await this.api(`v1/exercises/${id}`, { method: 'PUT', body: data });
  }

  async deleteExercise(id: string): Promise<ApiResponse<void>> {
    return await this.api(`v1/exercises/${id}`, { method: 'DELETE' });
  }

  async getCourses(stepId?: string): Promise<ApiResponse<Course[]>> {
    return await this.api('v1/courses', { query: stepId ? { stepId } : {} });
  }

  async getCourse(id: string): Promise<ApiResponse<Course>> {
    return await this.api(`v1/courses/${id}`);
  }

  async createCourse(data: CreateCourseRequest): Promise<ApiResponse<Course>> {
    return await this.api('v1/courses', { method: 'POST', body: data });
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<ApiResponse<Course>> {
    return await this.api(`v1/courses/${id}`, { method: 'PUT', body: data });
  }

  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    return await this.api(`v1/courses/${id}`, { method: 'DELETE' });
  }

  // async getStepQuizzes(stepId?: string): Promise<ApiResponse<StepQuiz[]>> {
  //   return await this.api('v1/step-quizzes', { query: stepId ? { stepId } : {} });
  // }

  // async getStepQuiz(id: string): Promise<ApiResponse<StepQuiz>> {
  //   return await this.api(`v1/step-quizzes/${id}`);
  // }

  // async createStepQuiz(data: CreateStepQuizRequest): Promise<ApiResponse<StepQuiz>> {
  //   return await this.api('v1/step-quizzes', { method: 'POST', body: data });
  // }

  // async updateStepQuiz(id: string, data: Partial<StepQuiz>): Promise<ApiResponse<StepQuiz>> {
  //   return await this.api(`v1/step-quizzes/${id}`, { method: 'PUT', body: data });
  // }

  // async deleteStepQuiz(id: string): Promise<ApiResponse<void>> {
  //   return await this.api(`v1/step-quizzes/${id}`, { method: 'DELETE' });
  // }
}

let instance: ApiService;
export const useApiService = () => {
  if (!instance) instance = new ApiService();
  return instance;
}


