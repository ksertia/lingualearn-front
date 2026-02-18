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
      @create="openModal = true"
      @delete="deleteUser" 
      @show-details="showUserDetails"
      @toggle-status="toggleUserStatus"
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
              <option value="learner">Learner</option>
              <option value="sub_account_learner">Sub learner</option>
              <option value="teacher">Teacher</option>
              <option value="plateform_manager">Plateform manager</option>
              <option value="admin">Admin</option>
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

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/userStore'
import type { User } from '~/types/user'

import UserTable from '~/components/admin/UserTable.vue'
import CreateNewUser from '~/components/admin/CreateNewUser.vue'
import CreateUserDetails from '~/components/admin/CreateUserDetails.vue'

definePageMeta({ layout: 'admin' })

const userStore = useUserStore()
const openModal = ref(false)
const selectedUser = ref<User | null>(null)
const editingUser = ref<User | null>(null)

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
    openModal.value = false
    await userStore.fetchUsers()
  } catch (err) {
    console.error('Error creating user:', err)
    alert('Erreur lors de la création')
  }
}

// -------------------
// Supprimer un utilisateur
// -------------------
const deleteUser = async (user: User) => {
  if (!user?.id) return
  if (confirm(`Supprimer ${user.profile.firstName} ${user.profile.lastName} ?`)) {
    try {
      await userStore.deleteUser(user.id)
      // Mise à jour locale
      userStore.users = userStore.users.filter(u => u.id !== user.id)
    } catch (err) {
      console.error('Delete user error:', err)
      alert('Erreur lors de la suppression')
    }
  }
}

// -------------------
// Afficher les détails
// -------------------
const showUserDetails = (user: User) => {
  selectedUser.value = user
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
  } catch (err) {
    console.error(err)
    alert('Erreur lors de la mise à jour du statut')
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
    alert('Utilisateur mis à jour !')
    editingUser.value = null
  } catch (err) {
    console.error('Put user error:', err)
    alert('Erreur lors de la mise à jour')
  }
}

</script>
