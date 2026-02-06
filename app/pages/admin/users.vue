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
      v-else-if="userStore.users.length > 0"
      :users="userStore.users"
      @create="openModal = true"
      @edit="editUser"
      @delete="deleteUser"
      @show-details="showUserDetails"
    />

    <!-- Message si aucun utilisateur -->
    <div v-else class="text-center py-4">
      <p class="text-gray-500">Aucun utilisateur trouvé.</p>
    </div>

    <!-- Modal détails -->
    <CreateUserDetails
      v-if="selectedUser"
      :user="selectedUser"
      @close="selectedUser = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/userStore'
import UserTable from '~/components/admin/UserTable.vue'
import CreateNewUser from '~/components/admin/CreateNewUser.vue'
import CreateUserDetails from '~/components/admin/CreateUserDetails.vue'


definePageMeta({ layout: 'admin' })

const userStore = useUserStore()
const openModal = ref(false)
const selectedUser = ref<User | null>(null)

onMounted(() => {
  userStore.fetchUsers()
})

// -------------------
// Ajouter un utilisateur depuis le modal
// -------------------
const addUser = async (newUser: any) => {
  try {
    // Transformer les données pour correspondre à l'API
    const userData = {
      firstName: newUser.prenom,
      lastName: newUser.nom,
      email: newUser.email,
      password: newUser.password,
      accountType: newUser.role
    }
    console.log('Sending user data:', userData)
    await userStore.createUser(userData)
    openModal.value = false
  } catch (err) {
    console.error('Error creating user:', err)
    alert('Erreur lors de la création')
  }
}

// -------------------
// Modifier un utilisateur
// -------------------
const editUser = async (user: User) => {
  const newNom = prompt('Modifier le nom :', user.profile.lastName)
  if (newNom) {
    try {
      await userStore.updateUser(user.id, { lastName: newNom })
    } catch {
      alert('Erreur lors de la modification')
    }
  }
}

// -------------------
// Supprimer un utilisateur
// -------------------
const deleteUser = async (user: User) => {
  if (confirm(`Supprimer ${user.profile.firstName} ${user.profile.lastName} ?`)) {
    try {
      await userStore.deleteUser(user.id)
    } catch {
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
</script>
