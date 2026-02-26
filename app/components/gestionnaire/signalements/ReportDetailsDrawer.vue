<script setup lang="ts">
import { useSignalementStore } from '~/stores/signalementStore'
import type { Signalement } from '~/types/signalement'

const props = defineProps<{
  signalementId: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'process', signalement: Signalement): void
}>()

const store = useSignalementStore()

// Track if component is mounted
const isMounted = ref(false)

// Charger les détails quand l'ID change
watch(() => props.signalementId, async (newId) => {
  if (newId && isMounted.value) {
    await store.fetchSignalementDetail(newId)
  }
}, { immediate: true })

onMounted(() => {
  isMounted.value = true
})

onUnmounted(() => {
  isMounted.value = false
  // Clear current signalement to prevent reactivity issues
  store.currentSignalement = null
})

// Formatage des dates
const formatDateTime = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Badge de type
// const getTypeBadge = (type?: string): { class: string; label: string } => {
//   if (!type) return { class: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Autre' }
//   const badges: Record<string, { class: string; label: string }> = {
//     course: { class: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Cours' },
//     lesson: { class: 'bg-indigo-100 text-indigo-700 border-indigo-200', label: 'Leçon' },
//     quiz: { class: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Quiz' },
//     formateur: { class: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Formateur' },
//     module: { class: 'bg-cyan-100 text-cyan-700 border-cyan-200', label: 'Module' },
//     other: { class: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Autre' }
//   }
//   const badge = badges[type]
//   if (badge) return badge
//   return badges.other
// }



const getTypeBadge = (type?: string) => {
  const badges = {
    course: { class: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Cours' },
    lesson: { class: 'bg-indigo-100 text-indigo-700 border-indigo-200', label: 'Leçon' },
    quiz: { class: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Quiz' },
    formateur: { class: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Formateur' },
    module: { class: 'bg-cyan-100 text-cyan-700 border-cyan-200', label: 'Module' },
    other: { class: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Autre' }
  }

  return badges[type as keyof typeof badges] ?? badges.other
}

// Badge de statut
// const getStatusBadge = (status?: string): { class: string; label: string } => {
//   if (!status) return { class: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Inconnu' }
//   const badges: Record<string, { class: string; label: string }> = {
//     pending: { class: 'bg-red-100 text-red-700 border-red-200', label: 'En attente' },
//     processed: { class: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Traité' },
//     rejected: { class: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Rejeté' }
//   }
//   const badge = badges[status]
//   if (badge) return badge
//   return badges.pending
// }


const getStatusBadge = (status?: string) => {
  const badges = {
    pending: { class: 'bg-red-100 text-red-700 border-red-200', label: 'En attente' },
    processed: { class: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Traité' },
    rejected: { class: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Rejeté' }
  }

  return badges[status as keyof typeof badges] ?? badges.pending
}

// Badge de gravité
// const getGravityBadge = (gravity?: string): { class: string; label: string } => {
//   if (!gravity) return { class: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Inconnue' }
//   const badges: Record<string, { class: string; label: string }> = {
//     urgent: { class: 'bg-red-100 text-red-700 border-red-200', label: 'Urgent' },
//     normal: { class: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Normal' },
//     low: { class: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Faible' }
//   }
//   const badge = badges[gravity]
//   if (badge) return badge
//   return badges.normal
// }



const getGravityBadge = (gravity?: string) => {
  const badges = {
    urgent: { class: 'bg-red-100 text-red-700 border-red-200', label: 'Urgent' },
    normal: { class: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Normal' },
    low: { class: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Faible' }
  }

  return badges[gravity as keyof typeof badges] ?? badges.normal
}

// Action de modération
// const getActionBadge = (action?: string): { class: string; label: string } => {
//   if (!action) return { class: 'bg-slate-50 text-slate-500', label: 'Aucune' }
//   const badges: Record<string, { class: string; label: string }> = {
//     none: { class: 'bg-slate-50 text-slate-500', label: 'Aucune' },
//     content_disabled: { class: 'bg-red-50 text-red-600 border-red-200', label: 'Contenu désactivé' },
//     content_deleted: { class: 'bg-red-100 text-red-700 border-red-200', label: 'Contenu supprimé' },
//     formator_suspended: { class: 'bg-orange-50 text-orange-600 border-orange-200', label: 'Formateur suspendu' },
//     rejected: { class: 'bg-slate-50 text-slate-500 border-slate-200', label: 'Signalement rejeté' },
//     processed: { class: 'bg-blue-50 text-blue-600 border-blue-200', label: 'Signalement traité' }
//   }
//   const badge = badges[action]
//   if (badge) return badge
//   return badges.none
// }



const getActionBadge = (action?: string) => {
  const badges = {
    none: { class: 'bg-slate-50 text-slate-500', label: 'Aucune' },
    content_disabled: { class: 'bg-red-50 text-red-600 border-red-200', label: 'Contenu désactivé' },
    content_deleted: { class: 'bg-red-100 text-red-700 border-red-200', label: 'Contenu supprimé' },
    formator_suspended: { class: 'bg-orange-50 text-orange-600 border-orange-200', label: 'Formateur suspendu' },
    rejected: { class: 'bg-slate-50 text-slate-500 border-slate-200', label: 'Signalement rejeté' },
    processed: { class: 'bg-blue-50 text-blue-600 border-blue-200', label: 'Signalement traité' }
  }

  return badges[action as keyof typeof badges] ?? badges.none
}

const signalement = computed(() => store.currentSignalement)
const isLoading = computed(() => store.isLoading)

const handleProcess = () => {
  if (signalement.value) {
    emit('process', signalement.value)
  }
}
</script>

<template>
  <!-- Overlay -->
  <div
    v-if="signalementId"
    class="fixed inset-0 bg-black/30 z-40 transition-opacity"
    @click="emit('close')"
  ></div>

  <!-- Drawer -->
  <div
    class="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-hidden flex flex-col"
    :class="signalementId ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
      <div>
        <h2 class="text-lg font-bold text-slate-900">Détails du signalement</h2>
        <p v-if="signalement" class="text-sm text-slate-500 mt-0.5">
          Signalement #{{ signalement.id }}
        </p>
      </div>
      <button
        @click="emit('close')"
        class="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-[#000099] rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="signalement" class="flex-1 overflow-y-auto p-6">
      <!-- Status & Gravity -->
      <div class="flex items-center gap-3 mb-6">
        <span
          class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border"
          :class="getStatusBadge(signalement.status).class"
        >
          {{ getStatusBadge(signalement.status).label }}
        </span>
        <span
          class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border"
          :class="getGravityBadge(signalement.gravity).class"
        >
          {{ getGravityBadge(signalement.gravity).label }}
        </span>
        <span
          class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border"
          :class="getTypeBadge(signalement.contenu.type).class"
        >
          {{ getTypeBadge(signalement.contenu.type).label }}
        </span>
      </div>

      <!-- Signalement Info -->
      <div class="bg-slate-50 rounded-2xl p-4 mb-6">
        <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Signalement</h3>
        <div class="space-y-3">
          <div>
            <span class="text-xs text-slate-400 block mb-1">Motif:</span>
            <p class="text-slate-900 font-medium">{{ signalement.reason }}</p>
          </div>
          <div>
            <span class="text-xs text-slate-400 block mb-1">Description:</span>
            <p class="text-slate-600">{{ signalement.description }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4 pt-2">
            <div>
              <span class="text-xs text-slate-400 block">Signalé par:</span>
              <p class="text-sm text-slate-900">{{ signalement.reportedBy.firstName }} {{ signalement.reportedBy.lastName }}</p>
            </div>
            <div>
              <span class="text-xs text-slate-400 block">Date du signalement:</span>
              <p class="text-sm text-slate-900">{{ formatDateTime(signalement.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu Concerné -->
      <div class="bg-slate-50 rounded-2xl p-4 mb-6">
        <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Contenu concerné</h3>
        <div class="space-y-3">
          <div>
            <span class="text-xs text-slate-400 block mb-1">Titre:</span>
            <p class="text-slate-900 font-medium">{{ signalement.contenu.title }}</p>
          </div>
          <div>
            <span class="text-xs text-slate-400 block mb-1">Description:</span>
            <p class="text-slate-600">{{ signalement.contenu.description }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4 pt-2">
            <div>
              <span class="text-xs text-slate-400 block">Langue:</span>
              <p class="text-sm text-slate-900">{{ signalement.contenu.language.name }}</p>
            </div>
            <div>
              <span class="text-xs text-slate-400 block">Niveau:</span>
              <p class="text-sm text-slate-900">{{ signalement.contenu.level.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formateur -->
      <div class="bg-slate-50 rounded-2xl p-4 mb-6">
        <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Auteur du contenu</h3>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ced1] to-[#00a8a8] flex items-center justify-center text-sm font-bold text-[#000099]">
            {{ signalement.contenu.auteur.firstName.charAt(0) }}{{ signalement.contenu.auteur.lastName.charAt(0) }}
          </div>
          <div>
            <p class="text-sm font-medium text-slate-900">{{ signalement.contenu.auteur.firstName }} {{ signalement.contenu.auteur.lastName }}</p>
            <p class="text-xs text-slate-500">{{ signalement.contenu.auteur.email }}</p>
          </div>
        </div>
      </div>

      <!-- Modération (si traité) -->
      <div v-if="signalement.status !== 'pending'" class="bg-slate-50 rounded-2xl p-4">
        <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Décision de modération</h3>
        <div class="space-y-3">
          <div>
            <span class="text-xs text-slate-400 block mb-1">Action prise:</span>
            <span
              class="px-3 py-1.5 rounded-lg text-xs font-bold border"
              :class="getActionBadge(signalement.moderationAction).class"
            >
              {{ getActionBadge(signalement.moderationAction).label }}
            </span>
          </div>
          <div v-if="signalement.moderationComment">
            <span class="text-xs text-slate-400 block mb-1">Commentaire:</span>
            <p class="text-slate-600">{{ signalement.moderationComment }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4 pt-2">
            <div>
              <span class="text-xs text-slate-400 block">Modérateur:</span>
              <p class="text-sm text-slate-900">{{ signalement.moderatorName || '-' }}</p>
            </div>
            <div>
              <span class="text-xs text-slate-400 block">Date de traitement:</span>
              <p class="text-sm text-slate-900">{{ formatDateTime(signalement.processedAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3">
      <button
        @click="emit('close')"
        class="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-colors"
      >
        Fermer
      </button>
      <button
        v-if="signalement?.status === 'pending'"
        @click="handleProcess"
        class="flex-1 px-4 py-3 bg-[#000099] text-white rounded-xl font-medium hover:bg-[#000088] transition-colors"
      >
        Traiter ce signalement
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>

