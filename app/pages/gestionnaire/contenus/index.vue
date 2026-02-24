<script setup lang="ts">
import { useContenuStore } from '~/stores/contenuStore'
import { useLanguageStore } from '~/stores/languageStore'
import { useFormateurStore } from '~/stores/formateurStore'
import ContentFilters from '~/components/gestionnaire/gestionContenus/ContentFilters.vue'
import ContentTable from '~/components/gestionnaire/gestionContenus/ContentTable.vue'
import ContentDetailsDrawer from '~/components/gestionnaire/gestionContenus/ContentDetailsDrawer.vue'
import type { Contenu } from '~/types/contenu'

definePageMeta({
  layout: 'gestionnaire'
})

const store = useContenuStore()
const languageStore = useLanguageStore()
const formateurStore = useFormateurStore()

// État pour le drawer
const showDrawer = ref(false)
const selectedContenuId = ref<string | null>(null)
const showStats = ref(false)

// Toast notifications
const toast = ref<{ show: boolean; message: string; type: 'success' | 'error' }>({
  show: false,
  message: '',
  type: 'success'
})

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Chargement initial
onMounted(async () => {
  await Promise.all([
    store.fetchContenus(),
    languageStore.fetchLanguages(),
    formateurStore.fetchFormateurs()
  ])
})

// Handlers
const handleView = (id: string) => {
  selectedContenuId.value = id
  showStats.value = false
  showDrawer.value = true
}

const handleStats = (id: string) => {
  selectedContenuId.value = id
  showStats.value = true
  showDrawer.value = true
}

const handleDisable = async (contenu: Contenu) => {
  const reason = prompt('Motif de désactivation (optionnel):')
  
  const result = await store.disableContenu(contenu.id, reason || undefined)
  
  if (result.success) {
    showToast('Contenu désactivé avec succès', 'success')
  } else {
    showToast(result.message, 'error')
  }
}

const handleEnable = async (id: string) => {
  const result = await store.enableContenu(id)
  
  if (result.success) {
    showToast('Contenu réactivé avec succès', 'success')
  } else {
    showToast(result.message, 'error')
  }
}

const handleDelete = async (id: string) => {
  const confirmDelete = confirm(
    'Êtes-vous sûr de vouloir supprimer définitivement ce contenu ?\n\nCette action est irréversible et supprimera toutes les données associées.'
  )
  
  if (confirmDelete) {
    const result = await store.deleteContenu(id)
    
    if (result.success) {
      showToast('Contenu supprimé définitivement', 'success')
      showDrawer.value = false
    } else {
      showToast(result.message, 'error')
    }
  }
}

const closeDrawer = () => {
  showDrawer.value = false
  selectedContenuId.value = null
  showStats.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto p-6 lg:p-8">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Contenus</h1>
        <p class="text-slate-500 mt-1">Surveillez et gérez tous les contenus publiés sur la plateforme.</p>
      </header>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Total -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-[#000099]/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#000099]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">Total</p>
              <p class="text-xl font-bold text-slate-900">{{ store.statsSummary.total }}</p>
            </div>
          </div>
        </div>

        <!-- Actifs -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-emerald-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">Actifs</p>
              <p class="text-xl font-bold text-emerald-600">{{ store.statsSummary.active }}</p>
            </div>
          </div>
        </div>

        <!-- Désactivés -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-red-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">Désactivés</p>
              <p class="text-xl font-bold text-red-600">{{ store.statsSummary.disabled }}</p>
            </div>
          </div>
        </div>

        <!-- Total Inscrits -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-blue-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">Total Inscrits</p>
              <p class="text-xl font-bold text-blue-600">{{ store.statsSummary.totalEnrolled }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="mb-6">
        <ContentFilters />
      </div>

      <!-- Tableau -->
      <ContentTable 
        @view="handleView"
        @stats="handleStats"
        @disable="handleDisable"
        @enable="handleEnable"
        @delete="handleDelete"
      />

      <!-- Drawer -->
      <ContentDetailsDrawer 
        :contenu-id="selectedContenuId"
        :show-stats="showStats"
        @close="closeDrawer"
      />

      <!-- Toast -->
      <div 
        class="fixed bottom-6 right-6 z-50 transition-all duration-300 transform"
        :class="toast.show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
      >
        <div 
          class="flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg"
          :class="toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'"
        >
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

