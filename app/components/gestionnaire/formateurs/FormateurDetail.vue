<script setup lang="ts">
import { useFormateurStore } from '~/stores/formateurStore'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'suspend', id: string): void
  (e: 'reactivate', id: string): void
}>()

const store = useFormateurStore()

const formatDate = (dateString?: string | Date) => {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatDateTime = (dateString?: string | Date) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getInitials = (firstName?: string, lastName?: string) => {
  const f = firstName?.charAt(0) ?? '?'
  const l = lastName?.charAt(0) ?? ''
  return `${f}${l}`.toUpperCase() || '?'
}

const getModuleStatusBadge = (isActive: boolean, isPublished: boolean) => {
  if (!isPublished) {
    return { class: 'bg-gray-100 text-gray-600 border-gray-200', label: 'Brouillon' }
  }
  if (isActive) {
    return { class: 'bg-green-100 text-green-700 border-green-200', label: 'Actif' }
  }
  return { class: 'bg-red-100 text-red-700 border-red-200', label: 'Désactivé' }
}

const handleSuspend = () => {
  if (store.currentFormateur) {
    const confirmSuspend = confirm(
      `Êtes-vous sûr de vouloir suspendre ${store.currentFormateur.firstName} ${store.currentFormateur.lastName} ?\n\nCette action rendra tous ses modules invisibles pour les apprenants.`
    )
    if (confirmSuspend) {
      store.suspendFormateur(store.currentFormateur.id)
    }
  }
}

const handleReactivate = () => {
  if (store.currentFormateur) {
    store.reactivateFormateur(store.currentFormateur.id)
  }
}

onMounted(() => {
  store.fetchFormateurDetail(props.id)
})
</script>

<template>
  <div class="formateur-detail">
    <!-- Back button -->
    <button 
      @click="$emit('back')"
      class="flex items-center gap-2 text-[#000099] hover:text-[#00ced1] transition-colors mb-6"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="font-medium">Retour à la liste</span>
    </button>

    <!-- Loading State -->
    <div v-if="store.isLoadingDetail" class="flex flex-col items-center justify-center py-16">
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-[#000099] rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-4 text-gray-500 font-medium">Chargement des détails...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="store.errorDetail" class="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center gap-4 text-red-700">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 flex-shrink-0" viewBox="0 0 256 256">
        <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 56a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm8 104a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"/>
      </svg>
      <div>
        <p class="font-bold">Une erreur est survenue</p>
        <p class="text-sm opacity-90">{{ store.errorDetail }}</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="store.currentFormateur" class="space-y-6">
      <!-- Header Card -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <!-- Profile -->
          <div class="flex items-center gap-6">
            <div 
              class="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-inner"
              :class="!store.currentFormateur.isActive 
                ? 'bg-gray-200 text-gray-500' 
                : 'bg-gradient-to-br from-[#00ced1] to-[#00a8a8] text-[#000099]'"
            >
              {{ getInitials(store.currentFormateur.firstName, store.currentFormateur.lastName) }}
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ store.currentFormateur.firstName }} {{ store.currentFormateur.lastName }}
              </h2>
              <p class="text-gray-500">{{ store.currentFormateur.email }}</p>
              <div class="flex items-center gap-3 mt-3">
                <span
                  v-if="store.currentFormateur.language"
                  class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700"
                >
                  {{ store.currentFormateur.language.name }}
                </span>
                <span
                  class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border"
                  :class="!store.currentFormateur.isActive 
                    ? 'bg-red-100 text-red-700 border-red-200' 
                    : 'bg-green-100 text-green-700 border-green-200'"
                >
                  {{ !store.currentFormateur.isActive ? 'Suspendu' : 'Actif' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              v-if="store.currentFormateur.isActive"
              @click="handleSuspend"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Suspendre
            </button>
            <button
              v-else
              @click="handleReactivate"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 text-green-600 font-medium hover:bg-green-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Réactiver
            </button>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
          <div class="p-4 bg-gray-50 rounded-2xl">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date d'inscription</p>
            <p class="mt-1 text-lg font-bold text-gray-900">{{ formatDate(store.currentFormateur.createdAt) }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-2xl">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dernière activité</p>
            <p class="mt-1 text-lg font-bold text-gray-900">{{ formatDateTime(store.currentFormateur.lastActive) }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-2xl">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dernière publication</p>
            <p class="mt-1 text-lg font-bold text-gray-900">{{ formatDate(store.currentFormateur.stats?.lastPublicationDate) }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-2xl">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Signalements</p>
            <p class="mt-1 text-lg font-bold" :class="store.currentFormateur.reports && store.currentFormateur.reports.length > 0 ? 'text-orange-600' : 'text-green-600'">
              {{ store.currentFormateur.reports ? store.currentFormateur.reports.length : 0 }}
            </p>
          </div>
        </div>
      </div>

      <!-- Activity Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-[#000099]/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#000099]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Modules</p>
              <p class="text-xl font-bold text-gray-900">{{ store.currentFormateur.stats?.totalModules ?? '-' }}</p>
            </div>
          </div>
          <p class="text-xs text-green-600 mt-2">{{ store.currentFormateur.stats?.activeModules ?? 0 }} actifs</p>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-[#00ced1]/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#00ced1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Étapes</p>
              <p class="text-xl font-bold text-gray-900">{{ store.currentFormateur.stats?.totalSteps ?? '-' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-amber-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Cours</p>
              <p class="text-xl font-bold text-gray-900">{{ store.currentFormateur.stats?.totalCourses ?? '-' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-purple-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Exercices</p>
              <p class="text-xl font-bold text-gray-900">{{ store.currentFormateur.stats?.totalExercises ?? '-' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-pink-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Quiz</p>
              <p class="text-xl font-bold text-gray-900">{{ store.currentFormateur.stats?.totalQuizzes ?? '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modules List -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Modules ({{ store.currentFormateur.modules?.length || 0 }})</h3>
        
        <div v-if="store.currentFormateur.modules && store.currentFormateur.modules.length > 0" class="space-y-4">
          <div
            v-for="module in store.currentFormateur.modules"
            :key="module.id"
            class="flex items-center justify-between p-5 border rounded-xl transition-all duration-300 hover:shadow-md"
            :class="module.isActive ? 'border-gray-100 bg-white' : 'border-red-100 bg-red-50'"
          >
            <div class="flex items-center gap-4">
              <div 
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                :class="module.isActive ? 'bg-[#000099]/10 text-[#000099]' : 'bg-gray-200 text-gray-500'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">{{ module.title }}</h4>
                <p class="text-xs text-gray-500">{{ module.description || 'Aucune description' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-6">
              <div class="flex gap-4 text-xs text-gray-500">
                <span>{{ module.stepsCount }} étapes</span>
                <span>{{ module.coursesCount }} cours</span>
                <span>{{ module.exercisesCount }} exercices</span>
                <span>{{ module.quizzesCount }} quiz</span>
              </div>
              <span
                class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border"
                :class="getModuleStatusBadge(module.isActive, module.isPublished).class"
              >
                {{ getModuleStatusBadge(module.isActive, module.isPublished).label }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-10 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p>Aucun module créé</p>
        </div>
      </div>

      <!-- Reports Section -->
      <div v-if="store.currentFormateur.reports && store.currentFormateur.reports.length > 0" class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Signalements ({{ store.currentFormateur.reports.length }})</h3>
        
        <div class="space-y-4">
          <div
            v-for="report in store.currentFormateur.reports"
            :key="report.id"
            class="flex items-start justify-between p-5 border border-orange-100 rounded-xl bg-orange-50"
          >
            <div>
              <p class="font-medium text-gray-900">{{ report.reason }}</p>
              <p class="text-xs text-gray-500 mt-1">
                Signalé par {{ report.reportedBy }} le {{ formatDateTime(report.createdAt) }}
              </p>
            </div>
            <span
              class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider"
              :class="report.status === 'pending' ? 'bg-orange-200 text-orange-700' : 'bg-gray-200 text-gray-600'"
            >
              {{ report.status === 'pending' ? 'En attente' : report.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

