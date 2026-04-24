<template>
  <div class="space-y-6">
    <!-- Modal création -->
    <CreateNewUser v-if="openModal" @close="openModal = false" @create="addUser"/>

    <!-- Indicateur de chargement -->
    <div v-if="userStore.isLoading" class="text-center py-4">
      <p class="text-gray-500">Chargement des utilisateurs...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="userStore.error" class="text-center py-4">
      <p class="text-red-500">Erreur : {{ userStore.error }}</p>
      <button @click="userStore.fetchUsers()" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Réessayer</button>
    </div>

    <!-- Tableau utilisateurs -->
    <UserTable
      v-else
        :users="userStore.users"
        :initial-role="route.query.role as string"
        :initial-status="route.query.status as string"
      @create="openModal = true"
      @delete="deleteUser" 
      @show-details="showUserDetails"
      @toggle-status="toggleUserStatus"
      @verify="verifyUser"
      @edit="editUser"
    />

    <!-- Message si aucun utilisateur -->
    <!-- <div v-else class="text-center py-4">
      {{ users }}
      <p class="text-gray-500">Aucun utilisateur trouvé.</p>
    </div> -->

    <!-- Modal détails -->
    <CreateUserDetails
      v-if="selectedUser"
      :user="selectedUser"
      @close="selectedUser = null"
    />

    <!-- Popup édition -->
    <div
      v-if="editingUser"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg space-y-4">
        <h2 class="text-lg font-bold text-[#000099]">
          Modifier {{ editingUser.profile.firstName }} {{ editingUser.profile.lastName }}
        </h2>

        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium">Prénom</label>
            <input
              v-model="editingUser.profile.firstName"
              class="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#00ced1] outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium">Nom</label>
            <input
              v-model="editingUser.profile.lastName"
              class="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#00ced1] outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium">Email</label>
            <input
              v-model="editingUser.email"
              class="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#00ced1] outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium">Username</label>
            <input
              v-model="editingUser.username"
              class="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#00ced1] outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium">Mot de passe (laisser vide pour ne pas changer)</label>
            <input
              v-model="editingUser.password"
              type="password"
              placeholder="••••••"
              class="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#00ced1] outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium">Rôle</label>
            <select
              v-model="editingUser.accountType"
              class="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#00ced1] outline-none"
            >
              <option value="learner">Apprenant</option>
              <option value="sub_account_learner">Sous-compte apprenant</option>
              <option value="teacher">Formateur</option>
              <option value="plateform_manager">Gestionnaire de plateforme</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium">Statut</label>
            <button
              @click="toggleStatusInPopup"
              class="px-3 py-1 rounded-full font-semibold transition"
              :class="editingUser.isActive
                ? 'bg-[#c0c0c0] text-[#000099] hover:bg-[#a0a0a0]'   /* Désactiver */
                : 'bg-[#00ced1] text-[#000099] hover:bg-[#00b6b9]'    /* Activer */"
            >
              {{ editingUser.isActive ? 'Actif' : 'Inactif' }}
            </button>
          </div>

          <div class="flex justify-end gap-3 mt-4">
            <button
              @click="editingUser = null"
              class="px-4 py-2 rounded-full bg-gray-200 text-black font-semibold hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              @click="saveEdit"
              class="px-4 py-2 rounded-full bg-[#00ced1] text-[#000099] font-semibold hover:bg-[#00b6b9]"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>

    <transition name="toast-fade">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-[60] rounded-xl px-4 py-3 shadow-lg text-white"
        :class="toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'"
      >
        {{ toast.message }}
      </div>
    </transition>

    <div v-if="userToDelete" class="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-slate-900 mb-2">Supprimer l'utilisateur</h3>
        <p class="text-sm text-slate-600 mb-6">
          Voulez-vous supprimer {{ userToDelete.profile.firstName }} {{ userToDelete.profile.lastName }} ?
        </p>
        <div class="flex justify-end gap-3">
          <button class="px-4 py-2 rounded-lg border border-slate-200 text-slate-600" @click="userToDelete = null">Annuler</button>
          <button class="px-4 py-2 rounded-lg bg-red-600 text-white" @click="confirmDeleteUser">Supprimer</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/userStore'
import type { User } from '~/types/user'

import UserTable from '~/components/admin/UserTable.vue'
import CreateNewUser from '~/components/admin/CreateNewUser.vue'
import CreateUserDetails from '~/components/admin/CreateUserDetails.vue'

definePageMeta({ layout: 'admin' })

const userStore = useUserStore()
const route = useRoute()
const openModal = ref(false)
const selectedUser = ref<User | null>(null)
const editingUser = ref<User | null>(null)
const userToDelete = ref<User | null>(null)
const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// -------------------
// FETCH USERS ON MOUNT
// -------------------
onMounted(async () => {
  await userStore.fetchUsers()
})

// -------------------
// Ajouter un utilisateur
// -------------------
const addUser = async (newUser: any) => {
  try {
    const userData = {
      firstName: newUser.prenom ?? '',
      lastName: newUser.nom ?? '',
      email: newUser.email ?? '',
      phone: newUser.phone ?? '',
      password: newUser.password ?? '',
      username: newUser.username ?? null,
      accountType: newUser.role ?? 'learner',
      parentId: null
    }
    await userStore.createUser(userData)
    showToast(`L'utilisateur ${userData.firstName} ${userData.lastName} a été créé avec succès.`)
    openModal.value = false
    await userStore.fetchUsers()
  } catch (err) {
    console.error('Error creating user:', err)
    showToast('Erreur lors de la création de l’utilisateur.', 'error')
  }
}

// -------------------
// Supprimer un utilisateur
// -------------------
const deleteUser = async (user: User) => {
  if (!user?.id) return
  userToDelete.value = user
}

const confirmDeleteUser = async () => {
  if (!userToDelete.value) return
  try {
    const user = userToDelete.value
    await userStore.deleteUser(user.id)
    userStore.users = userStore.users.filter(u => u.id !== user.id)
    showToast(`L'utilisateur ${user.profile.firstName} ${user.profile.lastName} a été supprimé avec succès.`)
  } catch (err) {
    console.error('Delete user error:', err)
    showToast('Erreur lors de la suppression de l’utilisateur.', 'error')
  } finally {
    userToDelete.value = null
  }
}

// -------------------
// Afficher les détails
// -------------------
const showUserDetails = (user: User) => {
  selectedUser.value = user
}

// -------------------
// Vérifier un utilisateur
// -------------------
const verifyUser = async (user: User) => {
  try {
    const { email, accountType, profile, username, phone, isActive } = user
    const payload = { 
      firstName: profile.firstName, 
      lastName: profile.lastName, 
      email, 
      username,
      phone,
      accountType, 
      isActive,
      isVerified: true,
      profile: {
        ...profile,
      }
    }
    await userStore.putUser(user.id, payload)
    user.isVerified = true
    showToast(`L'utilisateur ${profile.firstName} ${profile.lastName} a été vérifié.`)
  } catch (err) {
    console.error(err)
    showToast('Erreur lors de la vérification de l’utilisateur.', 'error')
  }
}

// -------------------
// Toggle status direct depuis le tableau
// -------------------
const toggleUserStatus = async (user: User) => {
  try {
    const newStatus = !user.isActive
    const { email, accountType, profile, username, phone } = user
    const payload = { 
      firstName: profile.firstName, 
      lastName: profile.lastName, 
      email, 
      username,
      phone,
      accountType, 
      isActive: newStatus,
      profile: {
        ...profile,
        firstName: profile.firstName,
        lastName: profile.lastName,
      }
    }
    await userStore.putUser(user.id, payload)
    user.isActive = newStatus
    showToast(
      `Le statut de ${profile.firstName} ${profile.lastName} a été ${newStatus ? 'activé' : 'désactivé'}.`
    )
  } catch (err) {
    console.error(err)
    showToast('Erreur lors de la mise à jour du statut.', 'error')
  }
}

// -------------------
// Édition popup
// -------------------

// Ouvrir le modal d'édition (clone profond pour éviter les effets de bord)
const editUser = (user: User) => {
  editingUser.value = JSON.parse(JSON.stringify(user))
}

// Toggle Actif/Inactif dans le popup
const toggleStatusInPopup = () => {
  if (!editingUser.value) return
  editingUser.value.isActive = !editingUser.value.isActive
}

// Sauvegarder les modifications depuis le popup
const saveEdit = async () => {
  if (!editingUser.value) return

  const { id, accountType, isActive, email, profile, username, phone } = editingUser.value
  
  // On envoie à la fois à la racine et dans l'objet profile
  // pour maximiser les chances de compatibilité avec le backend
  const payload: any = { 
    firstName: profile.firstName, 
    lastName: profile.lastName, 
    email, 
    username,
    phone,
    accountType, 
    isActive,
    profile: {
      ...profile,
      firstName: profile.firstName,
      lastName: profile.lastName,
    }
  }

  // On n'envoie le mot de passe que s'il a été saisi
  if (editingUser.value.password) {
    payload.password = editingUser.value.password
  }

  try {
    await userStore.putUser(id, payload)
    
    // Si on est ici, c'est que ça a marché
    showToast(`L'utilisateur ${profile.firstName} ${profile.lastName} a été modifié avec succès.`)
    editingUser.value = null
  } catch (err) {
    console.error('Put user error:', err)
    showToast('Erreur lors de la modification de l’utilisateur.', 'error')
  }
}

</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
