import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiService } from '~/services/api';
import type { User } from '~/types/auth';

export const useUserStore = defineStore('user', () => {
    const apiService = useApiService();
    const users = ref<User[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function fetchUsers() {
        const token = useCookie('token').value;
        if (!token) {
            console.warn('No token found in cookies, API call might fail');
        }

        isLoading.value = true;
        error.value = null;
        try {
            console.log('Fetching users from API...');
            const response: any = await apiService.getUsers();
            console.log('Users response received:', response);

            // On gère les différents formats possibles
            let data: any = null;

            if (Array.isArray(response)) {
                data = response;
            } else if (response && typeof response === 'object') {
                // Cas: { success: true, data: [...] } ou { data: [...] }
                if (Array.isArray(response.data)) {
                    data = response.data;
                }
                // Cas: { data: { users: [...] } }
                else if (response.data && Array.isArray(response.data.users)) {
                    data = response.data.users;
                }
                // Cas: { users: [...] }
                else if (Array.isArray(response.users)) {
                    data = response.users;
                }
                // Cas: { success: true, data: { data: [...] } } - Parfois vu avec certains générateurs
                else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    data = response.data.data;
                }
            }

            if (data) {
                console.log('Extracted users data:', data.length, 'users found');
                users.value = data;
            } else {
                console.warn('Could not find users array in response', response);
                error.value = response.message || 'Format de réponse invalide';
            }
        } catch (err: any) {
            console.error('Fetch users error:', err);
            error.value = err.data?.message || 'Erreur lors de la récupération des utilisateurs';
        } finally {
            isLoading.value = false;
        }
    }

    return {
        users,
        isLoading,
        error,
        fetchUsers
    };
});
