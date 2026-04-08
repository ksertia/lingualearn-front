import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiService } from '~/services/api';
import type { Course, CreateCourseRequest } from '~/types/learning';

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
        throw err; // 🔥 IMPORTANT
    } finally {
        isLoading.value = false;
    }
}

    async function updateCourse(id: string, data: Partial<Course>) {
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

    return {
        courses,
        isLoading,
        error,
        fetchCourses,
        createCourse,
        updateCourse,
        deleteCourse
    };
});
