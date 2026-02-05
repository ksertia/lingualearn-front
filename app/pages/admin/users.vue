<template>
  <div class="space-y-6">
    <!-- Bouton créer utilisateur -->
    <button
      @click="openModal = true"
      class="px-4 py-2 rounded font-semibold"
      style="background-color: rgb(0,206,209); color: rgb(0,0,153);"
    >
      Créer un utilisateur
    </button>

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
const selectedUser = ref<any>(null)

onMounted(() => {
  userStore.fetchUsers()
})

// -------------------
// Ajouter un utilisateur depuis le modal
// -------------------
const addUser = async (newUser: any) => {
  try {
    await userStore.createUser(newUser)
    openModal.value = false
  } catch {
    alert('Erreur lors de la création')
  }
}

// -------------------
// Modifier un utilisateur
// -------------------
const editUser = async (user: any) => {
  const newNom = prompt('Modifier le nom :', user.nom)
  if (newNom) {
    try {
      await userStore.updateUser(user.id, { nom: newNom })
    } catch {
      alert('Erreur lors de la modification')
    }
  }
}

// -------------------
// Supprimer un utilisateur
// -------------------
const deleteUser = async (user: any) => {
  if (confirm(`Supprimer ${user.prenom} ${user.nom} ?`)) {
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
const showUserDetails = (user: any) => {
  selectedUser.value = user
}
</script>
