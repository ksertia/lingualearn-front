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
            const data = response.data || (Array.isArray(response) ? response : null);
            if (data) {
                courses.value = data;
            } else {
                error.value = response.message || 'Échec du chargement des cours';
            }
        } catch (err: any) {
            error.value = 'Erreur lors de la récupération des cours';
        } finally {
            isLoading.value = false;
        }
    }

    async function createCourse(data: CreateCourseRequest) {
        isLoading.value = true;
        error.value = null;
        try {
            const response: any = await apiService.createCourse(data);
            const courseData = response.data || (response.id ? response : null);
            if (courseData) {
                courses.value.push(courseData);
                return true;
            } else {
                error.value = response.message || 'Échec de la création du cours';
                return false;
            }
        } catch (err: any) {
            error.value = err.data?.message || 'Erreur lors de la création du cours';
            return false;
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
