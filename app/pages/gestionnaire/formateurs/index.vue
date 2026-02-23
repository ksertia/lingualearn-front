<script setup lang="ts">
import { useFormateurStore } from '~/stores/formateurStore'
import FormateursList from '~/components/gestionnaire/formateurs/FormateursList.vue'

definePageMeta({
  layout: 'gestionnaire'
})

const store = useFormateurStore()
const router = useRouter()

const searchInput = ref('')
const statusFilter = ref<'all' | 'active' | 'suspended'>('all')

const handleSearch = (value: string) => {
  store.setSearch(value)
}

const handleStatusFilter = (value: 'all' | 'active' | 'suspended') => {
  store.setStatusFilter(value)
}

const handleViewFormateur = (id: string) => {
  router.push(`/gestionnaire/formateurs/${id}`)
}

const handleSuspend = async (id: string) => {
  const success = await store.suspendFormateur(id)
  if (success) {
    alert('Formateur suspendu avec succès')
  }
}

const handleReactivate = async (id: string) => {
  const success = await store.reactivateFormateur(id)
  if (success) {
    alert('Formateur réactivé avec succès')
  }
}
</script>

<template>
  <div class="min-h-screen p-4 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Gestion des Formateurs</h1>
        <p class="text-gray-500 mt-1">Surveillez l'activité et gérez les formateurs de la plateforme.</p>
      </header>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-[#000099]/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#000099]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Total</p>
              <p class="text-xl font-bold text-gray-900">{{ store.statsSummary.total }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-green-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Actifs</p>
              <p class="text-xl font-bold text-green-600">{{ store.statsSummary.active }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-red-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Suspendus</p>
              <p class="text-xl font-bold text-red-600">{{ store.statsSummary.suspended }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-orange-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Signalements</p>
              <p class="text-xl font-bold text-orange-600">{{ store.statsSummary.withReports }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="relative flex-1">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              v-model="searchInput"
              @input="handleSearch(searchInput)"
              type="text"
              placeholder="Rechercher un formateur..."
              class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm"
            />
          </div>

          <!-- Status Filter -->
          <div class="relative min-w-[200px]">
            <select
              v-model="statusFilter"
              @change="handleStatusFilter(statusFilter)"
              class="appearance-none w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm font-medium"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="suspended">Suspendus</option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Formateurs List -->
      <FormateursList 
        @view="handleViewFormateur"
        @suspend="handleSuspend"
        @reactivate="handleReactivate"
      />
    </div>
  </div>
</template>

