<template>
  <div class="bg-white rounded-2xl shadow-sm p-6 space-y-6">

    <!-- Top bar -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div class="flex gap-3 w-full md:w-auto">
        <!-- Search -->
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher par nom ou email"
          class="w-full md:w-64 px-4 py-2 text-sm bg-gray-200 rounded-full focus:ring-2 focus:ring-[#00ced1] outline-none"
        />

        <!-- Role filter -->
        <select
          v-model="selectedRole"
          class="px-4 py-2 text-sm bg-gray-200 rounded-full outline-none"
        >
          <option value="">Tous les rôles</option>
          <option value="learner">Learner</option>
          <option value="sub_account_learner">Sub learner</option>
          <option value="teacher">Teacher</option>
          <option value="platform_manager">Platform manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <!-- Create button -->
      <button
        @click="$emit('create')"
        class="flex items-center gap-2 px-5 py-2 rounded-full bg-[#00ced1] text-[#000099] font-medium shadow-sm hover:bg-[#00b6b9] transition"
      >
        <span class="text-lg font-bold">+</span>
        Créer utilisateur
      </button>
    </div>

    <!-- Header -->
    <div
      class="grid grid-cols-[2fr_3fr_1.5fr_1.5fr] px-6 text-xs font-semibold text-gray-500"
    >
      <span>Utilisateur</span>
      <span>Email</span>
      <span>Rôle</span>
      <span class="text-right">Actions</span>
    </div>

    <!-- Rows -->
    <div class="space-y-3">
      <div
        v-for="user in paginatedUsers"
        :key="user.id"
        class="grid grid-cols-[2fr_3fr_1.5fr_1.5fr] items-center bg-white border border-gray-200 hover:border-[#ff7f00] hover:shadow-sm transition rounded-xl px-6 py-4 group"
      >
        <!-- User -->
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-[#00ced1] text-[#000099] flex items-center justify-center text-sm font-bold"
          >
            {{ user.profile.firstName[0] }}{{ user.profile.lastName[0] }}
          </div>
          <div class="leading-tight">
            <p class="text-sm font-medium text-black">
              {{ user.profile.firstName }} {{ user.profile.lastName }}
            </p>
          </div>
        </div>

        <!-- Email -->
        <span
          class="text-sm text-black break-all"
          :title="user.email"
        >
          {{ user.email }}
        </span>

        <!-- Role -->
        <button
          @click="$emit('show-details', user)"
          class="w-fit px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition transform group-hover:scale-105"
          :class="roleBadge(user.accountType)"
        >
          {{ roleLabel(user.accountType) }}
        </button>

        <!-- Actions -->
        <div class="flex justify-end gap-2">
          <button
            @click="$emit('edit', user)"
            class="px-3 py-1 text-xs rounded-full bg-[#000099] text-[#00ced1] font-semibold hover:bg-opacity-90 transition"
          >
            Modifier
          </button>
          <button
            @click="$emit('delete', user)"
            class="px-3 py-1 text-xs rounded-full bg-[#ff7f00] text-black font-semibold hover:bg-opacity-90 transition"
          >
            Supprimer
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="paginatedUsers.length === 0"
        class="text-center text-gray-400 py-10"
      >
        Aucun utilisateur trouvé
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center pt-4 text-sm text-[#000099]">
      <span>
        Page {{ currentPage }} / {{ totalPages }}
      </span>

      <div class="flex gap-1">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-full bg-gray-200 disabled:opacity-40"
        >
          ←
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          class="px-3 py-1 rounded-full"
          :class="page === currentPage ? 'bg-[#00ced1] text-[#000099]' : 'bg-gray-200'"
        >
          {{ page }}
        </button>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-full bg-gray-200 disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { User } from '~/types/auth'

const props = defineProps<{ users: User[] }>()

const search = ref('')
const selectedRole = ref('')
const currentPage = ref(1)
const itemsPerPage = 8

const filteredUsers = computed(() => {
  return props.users.filter(user => {
    const searchValue = search.value.toLowerCase()
    const matchSearch =
      user.profile.firstName.toLowerCase().includes(searchValue) ||
      user.profile.lastName.toLowerCase().includes(searchValue) ||
      (user.email || '').toLowerCase().includes(searchValue)
    const matchRole = selectedRole.value
      ? user.accountType === selectedRole.value
      : true
    return matchSearch && matchRole
  })
})

const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / itemsPerPage)
)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUsers.value.slice(start, start + itemsPerPage)
})

const roleBadge = (role: string) => {
  const map = {
    learner: 'bg-[#00ced1] text-[#000099] hover:bg-[#00b6b9]',
    sub_account_learner: 'bg-[#000099] text-[#00ced1] hover:bg-[#000066]',
    teacher: 'bg-[#ff7f00] text-black hover:bg-[#e67300]',
    platform_manager: 'bg-gray-200 text-[#000099] hover:bg-gray-300',
    admin: 'bg-[#000099] text-[#00ced1] hover:bg-[#000066]'
  }
  return map[role as keyof typeof map] || 'bg-gray-100 text-gray-700'
}

const roleLabel = (role: string) => {
  const labels = {
    learner: 'Learner',
    sub_account_learner: 'Sub learner',
    teacher: 'Teacher',
    platform_manager: 'Platform manager',
    admin: 'Admin'
  }
  return labels[role as keyof typeof labels] || role
}

watch([search, selectedRole], () => {
  currentPage.value = 1
})
</script>
