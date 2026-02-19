<template>
  <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-8">

    <!-- Top bar -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div class="flex flex-wrap items-center gap-4 w-full lg:w-auto">
        <!-- Search -->
        <div class="relative w-full md:w-80">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher un utilisateur..."
            class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm"
          />
        </div>

        <!-- Role filter -->
        <div class="relative">
          <select
            v-model="selectedRole"
            class="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm font-medium"
          >
            <option value="">TOUS LES RÔLES</option>
            <option v-for="(label, key) in rolesMap" :key="key" :value="key">
              {{ label.toUpperCase() }}
            </option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Status filter -->
        <div class="relative">
          <select
            v-model="selectedStatus"
            class="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm font-medium"
          >
            <option value="">TOUS LES STATUTS</option>
            <option value="active">ACTIF</option>
            <option value="inactive">INACTIF</option>
            <option value="verified">VÉRIFIÉ</option>
            <option value="unverified">NON VÉRIFIÉ</option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Create button -->
      <button
        @click="$emit('create')"
        class="flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-[#00ced1] text-[#000099] font-bold shadow-lg shadow-[#00ced1]/20 hover:shadow-[#00ced1]/40 hover:-translate-y-0.5 transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <!-- Table Container -->
    <div class="overflow-x-auto -mx-8 px-8">
      <div class="min-w-[800px]">
        <!-- Header -->
        <div
          class="grid grid-cols-[2.5fr_2.5fr_1.5fr_1.5fr_2fr] px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400"
        >
          <span>Utilisateur</span>
          <span>Contact</span>
          <span>Statut</span>
          <span>Rôle</span>
          <span class="text-right">Actions</span>
        </div>

        <!-- Rows -->
        <div class="space-y-4">
          <div
            v-for="user in paginatedUsers"
            :key="user.id"
            :class="[
              'grid grid-cols-[2.5fr_2.5fr_1.5fr_1.5fr_2fr] items-center border rounded-2xl px-6 py-5 group transition-all duration-300',
              user.isActive
                ? 'bg-white border-gray-100 hover:border-[#00ced1] hover:shadow-xl hover:shadow-gray-100'
                : 'bg-gray-50 border-gray-100 grayscale hover:grayscale-0'
            ]"
          >
            <!-- User -->
            <div class="flex items-center gap-4">
              <div class="relative">
                <div
                  class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00ced1] to-[#00a8a8] text-[#000099] flex items-center justify-center text-base font-bold shadow-inner"
                  :class="!user.isActive ? 'opacity-40' : ''"
                >
                  {{ user.profile.firstName[0] }}{{ user.profile.lastName[0] }}
                </div>

                <!-- PADLOCK for inactive users (Just a lock as requested) -->
                <div
                  v-if="!user.isActive"
                  class="absolute -top-2 -right-2 w-7 h-7 rounded-xl bg-[#000099] text-[#00ced1] flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform"
                  title="Compte inactif"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              <div class="flex flex-col">
                <span class="text-sm font-bold text-gray-900 leading-tight">
                  {{ user.profile.firstName }} {{ user.profile.lastName }}
                </span>
                <span class="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
                  ID: {{ user.id.substring(0, 8) }}
                </span>
              </div>
            </div>

            <!-- Contact -->
            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium text-gray-600 truncate max-w-[180px]" :title="user.email">
                {{ user.email }}
              </span>
              <span v-if="user.phone" class="text-[10px] text-gray-400 font-medium tracking-tight">
                {{ user.phone }}
              </span>
            </div>

            <!-- Status (Verification + Activity) -->
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-1.5">
                <div 
                  class="w-2 h-2 rounded-full"
                  :class="user.isVerified ? 'bg-green-500' : 'bg-amber-400'"
                ></div>
                <span class="text-[10px] font-bold uppercase tracking-wider" :class="user.isVerified ? 'text-green-600' : 'text-amber-600'">
                  {{ user.isVerified ? 'Vérifié' : 'En attente' }}
                </span>
              </div>
              <div class="flex items-center gap-1.5 opacity-60">
                <div 
                  class="w-2 h-2 rounded-full"
                  :class="user.isActive ? 'bg-[#00ced1]' : 'bg-gray-400'"
                ></div>
                <span class="text-[10px] font-bold uppercase tracking-wider" :class="user.isActive ? 'text-[#000099]' : 'text-gray-500'">
                  {{ user.isActive ? 'Actif' : 'Bloqué' }}
                </span>
              </div>
            </div>

            <!-- Role (Using Keys - Standardized) -->
            <div class="flex items-center">
              <span
                class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm"
                :class="roleBadge(user.accountType)"
              >
                {{ roleLabel(user.accountType) }}
              </span>
            </div>

            <!-- Actions (Dropdown Menu) -->
            <div class="flex justify-end items-center relative">
              <button
                @click.stop="toggleMenu(user.id)"
                class="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
                :class="{ 'bg-gray-100 text-gray-900': openMenuId === user.id }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>

              <!-- Dropdown Panel -->
              <div
                v-if="openMenuId === user.id"
                class="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <!-- Verification -->
                <button
                  v-if="!user.isVerified"
                  @click="[$emit('verify', user), openMenuId = null]"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-green-600 hover:bg-green-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Vérifier
                </button>

                <!-- Edit -->
                <button
                  @click="[$emit('edit', user), openMenuId = null]"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </button>

                <!-- Divider -->
                <div class="my-1 border-t border-gray-50"></div>

                <!-- Toggle Status -->
                <button
                  @click="[handleToggle(user), openMenuId = null]"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors"
                  :class="user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-[#000099] hover:bg-[#00ced1]/10'"
                >
                  <svg v-if="user.isActive" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ user.isActive ? 'Désactiver' : 'Activer' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="paginatedUsers.length === 0"
          class="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-lg font-medium">Aucun utilisateur trouvé</p>
          <p class="text-sm">Essayez d'ajuster vos filtres de recherche</p>
        </div>
      </div>
    </div>

    <!-- Footer: Pagination and Stats -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100">
      <div class="flex items-center gap-4">
        <div class="px-5 py-2.5 bg-[#000099] rounded-2xl text-white shadow-lg shadow-[#000099]/10">
          <span class="text-xs uppercase tracking-widest font-bold opacity-60 mr-2">Total</span>
          <span class="text-lg font-black text-[#00ced1]">{{ filteredUsers.length }}</span>
        </div>
        <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Utilisateurs affichés sur {{ totalPages }} page(s)
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="p-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#00ced1] hover:text-[#000099] disabled:opacity-20 disabled:hover:bg-gray-50 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="flex gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            class="w-10 h-10 rounded-xl text-xs font-bold transition-all duration-300"
            :class="page === currentPage 
              ? 'bg-[#00ced1] text-[#000099] shadow-lg shadow-[#00ced1]/20' 
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="p-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#00ced1] hover:text-[#000099] disabled:opacity-20 disabled:hover:bg-gray-50 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { User } from '~/types/auth'

const props = defineProps<{ users: User[] }>()

const emit = defineEmits([
  'create',
  'edit',
  'delete',
  'show-details',
  'toggle-status',
  'verify'
])

const search = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 8
const openMenuId = ref<string | null>(null)

const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

const handleClickOutside = () => {
  openMenuId.value = null
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

// Mapping des rôles en Français
const rolesMap: Record<string, string> = {
  learner: 'Apprenant',
  sub_account_learner: 'Sous-compte',
  teacher: 'Formateur',
  plateform_manager: 'Gestionnaire',
  admin: 'Administrateur'
}

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

    const matchStatus = !selectedStatus.value || 
      (selectedStatus.value === 'active' && user.isActive) ||
      (selectedStatus.value === 'inactive' && !user.isActive) ||
      (selectedStatus.value === 'verified' && user.isVerified) ||
      (selectedStatus.value === 'unverified' && !user.isVerified)

    return matchSearch && matchRole && matchStatus
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
    learner: 'bg-[#00ced1]/10 text-[#000099] border border-[#00ced1]/20',
    sub_account_learner: 'bg-[#000099] text-[#00ced1] border border-[#000099]',
    teacher: 'bg-[#ff7f00]/10 text-[#ff7f00] border border-[#ff7f00]/20',
    plateform_manager: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    admin: 'bg-[#000099] text-[#00ced1] border border-[#000099]'
  }
  return map[role as keyof typeof map] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

const roleLabel = (role: string) => {
  return rolesMap[role] || role
}

const handleToggle = (user: User) => {
  if (user.isActive) {
    const confirmDeactivate = confirm(
      `Voulez-vous vraiment désactiver le compte de ${user.profile.firstName} ${user.profile.lastName} ?`
    )
    if (!confirmDeactivate) return
  }

  emit('toggle-status', user)
}

watch([search, selectedRole, selectedStatus], () => {
  currentPage.value = 1
})
</script>
