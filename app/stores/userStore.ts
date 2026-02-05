// import { defineStore } from 'pinia';
// import { ref } from 'vue';
// import { useApiService } from '~/services/api';
// import type { User } from '~/types/auth';

// export const useUserStore = defineStore('user', () => {
//     const apiService = useApiService();
//     const users = ref<User[]>([]);
//     const isLoading = ref(false);
//     const error = ref<string | null>(null);

//     async function fetchUsers() {
//         const token = useCookie('token').value;
//         if (!token) {
//             console.warn('No token found in cookies, API call might fail');
//         }

//         isLoading.value = true;
//         error.value = null;
//         try {
//             console.log('Fetching users from API...');
//             const response: any = await apiService.getUsers();
//             console.log('Users response received:', response);

//             // On gère les différents formats possibles
//             let data: any = null;

//             if (Array.isArray(response)) {
//                 data = response;
//             } else if (response && typeof response === 'object') {
//                 // Cas: { success: true, data: [...] } ou { data: [...] }
//                 if (Array.isArray(response.data)) {
//                     data = response.data;
//                 }
//                 // Cas: { data: { users: [...] } }
//                 else if (response.data && Array.isArray(response.data.users)) {
//                     data = response.data.users;
//                 }
//                 // Cas: { users: [...] }
//                 else if (Array.isArray(response.users)) {
//                     data = response.users;
//                 }
//                 // Cas: { success: true, data: { data: [...] } } - Parfois vu avec certains générateurs
//                 else if (response.data && response.data.data && Array.isArray(response.data.data)) {
//                     data = response.data.data;
//                 }
//             }

//             if (data) {
//                 console.log('Extracted users data:', data.length, 'users found');
//                 users.value = data;
//             } else {
//                 console.warn('Could not find users array in response', response);
//                 error.value = response.message || 'Format de réponse invalide';
//             }
//         } catch (err: any) {
//             console.error('Fetch users error:', err);
//             error.value = err.data?.message || 'Erreur lors de la récupération des utilisateurs';
//         } finally {
//             isLoading.value = false;
//         }
//     }

//     return {
//         users,
//         isLoading,
//         error,
//         fetchUsers
//     };
// });

// ~/stores/userStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '~/services/api'
import type { User } from '~/types/auth'

export const useUserStore = defineStore('user', () => {
const apiService = useApiService()

const users = ref<User[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// -------------------
// Récupérer tous les utilisateurs
// -------------------
async function fetchUsers() {
  isLoading.value = true
  error.value = null
  try {
    console.log('Fetching users from API...')
    const response: any = await apiService.getUsers()
    console.log('Users response received:', response)

    // On extrait les données en gérant différents formats possibles
    let data: any = null
    if (Array.isArray(response)) data = response
    else if (response?.data) {
      if (Array.isArray(response.data)) data = response.data
      else if (Array.isArray(response.data.users)) data = response.data.users
      else if (response.data.data && Array.isArray(response.data.data)) data = response.data.data
    } else if (Array.isArray(response?.users)) data = response.users

    console.log('Extracted data:', data)

    if (data) {
      // Mapper les propriétés de l'API vers l'interface User
      users.value = data.map((user: any) => {
        console.log('User object keys:', Object.keys(user))
        console.log('User profile keys:', user.profile ? Object.keys(user.profile) : 'no profile')
        const firstName = user.profile?.firstName || user.prenom || user.firstName || ''
        const lastName = user.profile?.lastName || user.nom || user.lastName || ''
        console.log('Extracted names - firstName:', firstName, 'lastName:', lastName)
        const mapped = {
          ...user,
          firstName,
          lastName,
          profile: {
            firstName,
            lastName,
            displayName: user.displayName || '',
            timezone: user.timezone || 'UTC',
            preferredLanguage: user.preferredLanguage || 'fr',
            ...user.profile
          },
          accountType: user.role || user.accountType || 'child'
        }
        console.log('Final mapped - firstName:', mapped.firstName, 'lastName:', mapped.lastName)
        return mapped
      })
      console.log('Final users array:', JSON.stringify(users.value, null, 2))
    } else error.value = response.message || 'Format de réponse invalide'
  } catch (err: any) {
    console.error('Fetch users error:', err)
    error.value = err?.data?.message || 'Erreur lors de la récupération des utilisateurs'
  } finally {
    isLoading.value = false
  }
}

// -------------------
// Créer un utilisateur
// -------------------
async function createUser(payload: {
  nom: string
  prenom: string
  email: string
  password: string
  role: string
}) {
  isLoading.value = true
  error.value = null
  try {
    const response: any = await apiService.createUser(payload)
    const newUser = response?.data?.data || response?.data || response
    if (newUser) {
      const mappedUser = {
        ...newUser,
        firstName: newUser.prenom || newUser.firstName || '',
        lastName: newUser.nom || newUser.lastName || '',
        profile: {
          firstName: newUser.prenom || newUser.firstName || '',
          lastName: newUser.nom || newUser.lastName || '',
          displayName: newUser.displayName || '',
          timezone: newUser.timezone || 'UTC',
          preferredLanguage: newUser.preferredLanguage || 'fr',
          ...newUser.profile
        },
        accountType: newUser.role || newUser.accountType || 'child'
      }
      users.value.unshift(mappedUser)
      return mappedUser
    }
    return newUser
  } catch (err: any) {
    error.value = err?.data?.message || 'Erreur création utilisateur'
    throw err
  } finally {
    isLoading.value = false
  }
}

// -------------------
// Modifier un utilisateur
// -------------------
async function updateUser(
  id: string,
  payload: Partial<{
    nom: string
    prenom: string
    email: string
    password: string
    role: string
  }>
) {
  isLoading.value = true
  error.value = null
  try {
    const response: any = await apiService.updateUser(id, payload)
    const updatedUser = response?.data?.data || response?.data || response
    if (updatedUser) {
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) users.value[index] = { ...users.value[index], ...updatedUser }
    }
    return updatedUser
  } catch (err: any) {
    error.value = err?.data?.message || 'Erreur mise à jour utilisateur'
    throw err
  } finally {
    isLoading.value = false
  }
}

// -------------------
// Supprimer un utilisateur
// -------------------
async function deleteUser(id: string) {
  isLoading.value = true
  error.value = null
  try {
    await apiService.deleteUser(id)
    users.value = users.value.filter(u => u.id !== id)
  } catch (err: any) {
    error.value = err?.data?.message || 'Erreur suppression utilisateur'
    throw err
  } finally {
    isLoading.value = false
  }
}

return {
  users,
  isLoading,
  error,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
}
})
