import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiService } from '~/services/api';
import type {
    Course,
    CreateCourseRequest,
    UpdateCourseRequest,
    LessonBlockCreateRequest,
    LessonBlockUpdateRequest,
    LessonBlockReorderRequest,
} from '~/types/learning';

export const useCourseStore = defineStore('course', () => {
    const apiService = useApiService();
    const courses = ref<Course[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function fetchCourses(stepId?: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.getCourses(stepId);
            const payload = response?.data ?? response;
            let items: Course[] | null = null;

            if (Array.isArray(payload)) {
                items = payload as Course[];
            } else if (Array.isArray(payload?.items)) {
                items = payload.items as Course[];
            } else if (Array.isArray(payload?.courses)) {
                items = payload.courses as Course[];
            } else if (Array.isArray(payload?.data)) {
                items = payload.data as Course[];
            } else if (Array.isArray(payload?.results)) {
                items = payload.results as Course[];
            }

            if (items) {
                courses.value = items;
            } else {
                courses.value = [];
                error.value = response?.message || '�chec du chargement des cours';
                console.warn('fetchCourses: r�ponse inattendue', response);
            }
        } catch (err: any) {
            error.value = 'Erreur lors de la r�cup�ration des cours';
            console.error('fetchCourses error:', err);
        } finally {
            isLoading.value = false;
        }
    }
    // async function createCourse(data: CreateCourseRequest): Promise<Course | null> {
    //     isLoading.value = true;
    //     error.value = null;
    //     try {
    //         const response: any = await apiService.createCourse(data);
    //         const courseData = response.data || (response.id ? response : null);
    //         if (courseData) {
    //             courses.value.push(courseData);
    //             return courseData as Course;
    //         } else {
    //             error.value = response.message || 'Échec de la création du cours';
    //             return null;
    //         }
    //     } catch (err: any) {
    //         error.value = err.data?.message || 'Erreur lors de la création du cours';
    //         return null;
    //     } finally {
    //         isLoading.value = false;
    //     }
    // }

    //Nouvelle version de createCourse 

    async function createCourse(data: CreateCourseRequest): Promise<Course> {
    isLoading.value = true;
    error.value = null;

    try {
        const response: any = await apiService.createCourse(data);
        const courseData = response.data || (response.id ? response : null);

        if (!courseData) {
            throw new Error(response.message || 'Échec de la création');
        }

        courses.value.push(courseData);
        return courseData;

    } catch (err: any) {
        error.value = err.message || 'Erreur création';
        throw err;
    } finally {
        isLoading.value = false;
    }
}

    async function fetchCourseById(id: string): Promise<Course | null> {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.getCourse(id);
            const courseData = response?.data ?? response;
            if (courseData) {
                const existingIndex = courses.value.findIndex(c => c.id === id);
                if (existingIndex !== -1) {
                    courses.value[existingIndex] = courseData;
                } else {
                    courses.value.push(courseData);
                }
                return courseData as Course;
            }
            return null;
        } catch (err: any) {
            error.value = err.data?.message || 'Erreur lors de la récupération du cours';
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchCoursesByStep(stepId: string): Promise<Course[]> {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.getCoursesByStep(stepId);
            const payload = response?.data ?? response;
            const items = Array.isArray(payload) ? payload : (payload?.items ?? payload?.lessons ?? payload?.data ?? []);
            courses.value = Array.isArray(items) ? items as Course[] : [];
            return courses.value;
        } catch (err: any) {
            error.value = err.data?.message || 'Erreur lors de la récupération des leçons de l\'étape';
            return [];
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchCoursesByUser(userId: string): Promise<Course[]> {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.getCoursesByUser(userId);
            const payload = response?.data ?? response;
            const items = Array.isArray(payload) ? payload : (payload?.items ?? payload?.lessons ?? payload?.data ?? []);
            courses.value = Array.isArray(items) ? items as Course[] : [];
            return courses.value;
        } catch (err: any) {
            error.value = err.data?.message || 'Erreur lors de la récupération des leçons utilisateur';
            return [];
        } finally {
            isLoading.value = false;
        }
    }

    async function updateCourse(id: string, data: UpdateCourseRequest) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.updateCourse(id, data);
            const courseData = response.data || (response.id ? response : null);
            if (courseData) {
                const index = courses.value.findIndex(c => c.id === id);
                if (index !== -1) {
                    courses.value[index] = courseData;
                }
                return true;
            } else {
                error.value = response.message || 'Échec de la mise à jour du cours';
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || 'Erreur lors de la mise à jour du cours';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteCourse(id: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.deleteCourse(id);
            if (response.success || response === true || !response || Object.keys(response).length === 0) {
                courses.value = courses.value.filter(c => c.id !== id);
                return true;
            } else {
                error.value = response.message || 'Échec de la suppression du cours';
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || 'Erreur lors de la suppression du cours';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function createBlock(courseId: string, data: LessonBlockCreateRequest) {
        try {
            const response: any = await apiService.createCourseBlock(courseId, data);
            const blockData = response?.data ?? response;
            const course = courses.value.find((item) => item.id === courseId);
            if (course) {
                course.blocks = [...(course.blocks ?? []), blockData];
            }
            return blockData;
        } catch (err: any) {
            error.value = err.data?.message || 'Erreur lors de l\'ajout du bloc';
            throw err;
        }
    }

    async function reorderBlocks(courseId: string, orderedIds: string[]) {
        try {
            const payload: LessonBlockReorderRequest = { orderedIds };
            const response: any = await apiService.reorderCourseBlocks(courseId, payload);
            const updatedCourse = response?.data ?? response;
            if (updatedCourse) {
                const index = courses.value.findIndex((item) => item.id === courseId);
                if (index !== -1) {
                    courses.value[index] = { ...courses.value[index], ...updatedCourse };
                }
            }
            return response;
        } catch (err: any) {
            // L'endpoint reorder peut ne pas exister sur le backend
            // On log l'erreur mais on ne la relève pas pour éviter de bloquer la sauvegarde
            console.warn('Endpoint reorder non disponible, les blocs ont été ordonnés localement:', err?.message);
            return null;
        }
    }

    async function updateBlock(courseId: string, blockId: string, data: LessonBlockUpdateRequest) {
        try {
            const response: any = await apiService.updateCourseBlock(courseId, blockId, data);
            const blockData = response?.data ?? response;
            const course = courses.value.find((item) => item.id === courseId);
            if (course?.blocks) {
                course.blocks = course.blocks.map((block) => block.id === blockId ? { ...block, ...blockData } : block);
            }
            return blockData;
        } catch (err: any) {
            error.value = err.data?.message || 'Erreur lors de la mise à jour du bloc';
            throw err;
        }
    }

    async function deleteBlock(courseId: string, blockId: string) {
        try {
            const response: any = await apiService.deleteCourseBlock(courseId, blockId);
            const course = courses.value.find((item) => item.id === courseId);
            if (course?.blocks) {
                course.blocks = course.blocks.filter((block) => block.id !== blockId);
            }
            return response;
        } catch (err: any) {
            error.value = err.data?.message || 'Erreur lors de la suppression du bloc';
            throw err;
        }
    }

    return {
        courses,
        isLoading,
        error,
        fetchCourses,
        fetchCourseById,
        fetchCoursesByStep,
        fetchCoursesByUser,
        createCourse,
        updateCourse,
        deleteCourse,
        createBlock,
        reorderBlocks,
        updateBlock,
        deleteBlock
    };
});
