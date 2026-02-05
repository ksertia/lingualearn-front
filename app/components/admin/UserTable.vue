<template>
  <div class="bg-white rounded-2xl shadow-sm p-4">

    <!-- Recherche + filtre -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="Search by name or email"
        class="w-full md:w-1/3 px-4 py-2 text-sm bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <select
        v-model="selectedRole"
        class="px-4 py-2 text-sm bg-gray-50 rounded-full focus:outline-none"
      >
        <option value="">All roles</option>
        <option value="ADMIN">Admin</option>
        <option value="TEACHER">Teacher</option>
        <option value="PARENT">Parent</option>
        <option value="CHILD">Child</option>
      </select>
    </div>

    <!-- Header -->
    <div class="grid grid-cols-5 text-xs text-gray-400 px-4 mb-2">
      <span>Prénom</span>
      <span>Nom</span>
      <span>Email</span>
      <span>Rôle</span>
      <span class="text-right">Actions</span>
    </div>

    <!-- Rows -->
    <div class="space-y-2">
      <div
        v-for="user in paginatedUsers"
        :key="user.id"
        class="grid grid-cols-5 items-center bg-gray-50 hover:bg-yellow-200/80 transition rounded-xl px-4 py-3 cursor-pointer"
      >
        <span class="font-medium text-gray-800">{{ user.firstName }}</span>
        <span class="text-gray-700">{{ user.lastName }}</span>
        <span class="text-gray-500 text-sm truncate">{{ user.email }}</span>

        <!-- Badge rôle -->
        <span
          class="w-fit px-3 py-1 rounded-full text-xs font-medium cursor-pointer"
          :class="roleBadge(user.accountType)"
          @click="$emit('show-details', user)"
        >
          {{ user.accountType }}
        </span>

        <!-- Actions -->
        <div class="flex justify-end gap-3 text-sm">
          <button
            @click="$emit('edit', user)"
            class="text-gray-600 hover:text-black"
          >
            Modifier
          </button>
          <button
            @click="$emit('delete', user)"
            class="text-red-500 hover:text-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>

      <div
        v-if="paginatedUsers.length === 0"
        class="text-center text-gray-400 py-8"
      >
        Aucun utilisateur trouvé
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-6 text-sm">
      <span class="text-gray-400">
        Page {{ currentPage }} / {{ totalPages }}
      </span>

      <div class="flex gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-full bg-gray-100 disabled:opacity-40"
        >
          ←
        </button>

        <button
          v-for="page in Array.from({ length: totalPages }, (_, i) => i + 1)"
          :key="page"
          @click="currentPage = page"
          class="px-3 py-1 rounded-full"
          :class="page === currentPage ? 'bg-yellow-400 text-black' : 'bg-gray-100'"
        >
          {{ page }}
        </button>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-full bg-gray-100 disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  accountType: string
}

interface Props {
  users: User[]
}

const props = defineProps<Props>()

const search = ref('')
const selectedRole = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredUsers = computed(() => {
  let filtered = props.users

  if (search.value) {
    filtered = filtered.filter(user =>
      user.firstName.toLowerCase().includes(search.value.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.value.toLowerCase()) ||
      user.email.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  if (selectedRole.value) {
    filtered = filtered.filter(user => user.accountType === selectedRole.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const roleBadge = (role: string) => {
  const badges = {
    ADMIN: 'bg-red-100 text-red-800',
    TEACHER: 'bg-blue-100 text-blue-800',
    PARENT: 'bg-green-100 text-green-800',
    CHILD: 'bg-yellow-100 text-yellow-800'
  }
  return badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-800'
}

// Reset to first page when filters change
watch([search, selectedRole], () => {
  currentPage.value = 1
})
</script>
