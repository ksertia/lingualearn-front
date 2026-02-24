<script setup lang="ts">
import { useSignalementStore } from '~/stores/signalementStore'
import { useLanguageStore } from '~/stores/languageStore'
import { useFormateurStore } from '~/stores/formateurStore'
import ReportsFilters from '~/components/gestionnaire/signalements/ReportsFilters.vue'
import ReportsTable from '~/components/gestionnaire/signalements/ReportsTable.vue'
import ReportDetailsDrawer from '~/components/gestionnaire/signalements/ReportDetailsDrawer.vue'
import ModerationDecisionModal from '~/components/gestionnaire/signalements/ModerationDecisionModal.vue'
import type { Signalement, ModerationDecision } from '~/types/signalement'

definePageMeta({
  layout: 'gestionnaire'
})

const store = useSignalementStore()
const languageStore = useLanguageStore()
const formateurStore = useFormateurStore()
const router = useRouter()

// État pour le drawer et la modale
const showDrawer = ref(false)
const selectedSignalementId = ref<string | null>(null)
const showModal = ref(false)
const selectedSignalement = ref<Signalement | null>(null)

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
    store.fetchSignalements(),
    languageStore.fetchLanguages(),
    formateurStore.fetchFormateurs()
  ])
})

// Handlers
const handleView = (id: string) => {
  selectedSignalementId.value = id
  showDrawer.value = true
}

const handleProcess = (signalement: Signalement) => {
  selectedSignalement.value = signalement
  showModal.value = true
}

const handleViewContent = (signalement: Signalement) => {
  // Navigation vers le contenu signalé
  if (signalement.contenu.url) {
    window.open(signalement.contenu.url, '_blank')
  }
}

const handleViewFormateur = (id: string) => {
  router.push(`/gestionnaire/formateurs/${id}`)
}

const handleSubmitDecision = async (decision: ModerationDecision) => {
  const result = await store.processSignalement(decision)
  
  if (result.success) {
    showToast(result.message, 'success')
    showDrawer.value = false
  } else {
    showToast(result.message, 'error')
  }
}

const closeDrawer = () => {
  showDrawer.value = false
  selectedSignalementId.value = null
}

const closeModal = () => {
  showModal.value = false
  selectedSignalement.value = null
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto p-6 lg:p-8">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Signalements</h1>
        <p class="text-slate-500 mt-1">Modérez les contenus signalés par les utilisateurs.</p>
      </header>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <!-- Total -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-[#000099]/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#000099]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">Total</p>
              <p class="text-xl font-bold text-slate-900">{{ store.stats.total }}</p>
            </div>
          </div>
        </div>

        <!-- En attente -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-red-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">En attente</p>
              <p class="text-xl font-bold text-red-600">{{ store.stats.pending }}</p>
            </div>
          </div>
        </div>

        <!-- Urgent -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-red-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">Urgents</p>
              <p class="text-xl font-bold text-red-600">{{ store.stats.urgent }}</p>
            </div>
          </div>
        </div>

        <!-- Traités -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">Traités</p>
              <p class="text-xl font-bold text-slate-600">{{ store.stats.processed }}</p>
            </div>
          </div>
        </div>

        <!-- Rejetés -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-emerald-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">Rejetés</p>
              <p class="text-xl font-bold text-emerald-600">{{ store.stats.rejected }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="mb-6">
        <ReportsFilters />
      </div>

      <!-- Tableau -->
      <ReportsTable 
        @view="handleView"
        @process="handleProcess"
        @view-content="handleViewContent"
        @view-formateur="handleViewFormateur"
      />

      <!-- Drawer -->
      <ReportDetailsDrawer 
        :signalement-id="selectedSignalementId"
        @close="closeDrawer"
        @process="handleProcess"
      />

      <!-- Modal -->
      <ModerationDecisionModal
        :show="showModal"
        :signalement="selectedSignalement"
        @close="closeModal"
        @submit="handleSubmitDecision"
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

