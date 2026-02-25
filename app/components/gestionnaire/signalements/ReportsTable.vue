<script setup lang="ts">
import { useSignalementStore } from '~/stores/signalementStore'
import type { Signalement, SignalementSortField } from '~/types/signalement'

const store = useSignalementStore()

const emit = defineEmits<{
  (e: 'view', id: string): void
  (e: 'process', signalement: Signalement): void
  (e: 'viewContent', signalement: Signalement): void
  (e: 'viewFormateur', id: string): void
}>()

// Menu contextuel
const openMenuId = ref<string | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const isMounted = ref(false)

const toggleMenu = (id: string, event: Event) => {
  event.stopPropagation()
  openMenuId.value = openMenuId.value === id ? null : id
}

const handleClickOutside = (event: MouseEvent) => {
  // Only process if component is still mounted
  if (!isMounted.value) return
  
  const target = event.target as HTMLElement
  const dropdown = target.closest('.dropdown-menu')
  
  if (!dropdown && openMenuId.value) {
    openMenuId.value = null
  }
}

onMounted(() => {
  isMounted.value = true
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  isMounted.value = false
  document.removeEventListener('click', handleClickOutside, true)
})

// Formatage des dates
const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Badge helpers with proper null safety
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

const getTypeBadge = (type?: string): { class: string; label: string } => {
  const badges = {
    course: { class: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Cours' },
    lesson: { class: 'bg-indigo-100 text-indigo-700 border-indigo-200', label: 'Leçon' },
    quiz: { class: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Quiz' },
    formateur: { class: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Formateur' },
    module: { class: 'bg-cyan-100 text-cyan-700 border-cyan-200', label: 'Module' },
    other: { class: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Autre' }
  }

  if (!type) return badges.other
  return badges[type as keyof typeof badges] ?? badges.other
}


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

const getStatusBadge = (status?: string): { class: string; label: string } => {
  const badges = {
    pending: { class: 'bg-red-100 text-red-700 border-red-200', label: 'En attente' },
    processed: { class: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Traité' },
    rejected: { class: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Rejeté' }
  }

  if (!status) return { class: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Inconnu' }
  return badges[status as keyof typeof badges] ?? badges.pending
}


// const getGravityBadge = (gravity?: string): { class: string; label: string; dot: string } => {
//   if (!gravity) return { class: 'text-slate-500', label: 'Inconnue', dot: 'bg-slate-400' }
//   const badges: Record<string, { class: string; label: string; dot: string }> = {
//     urgent: { class: 'text-red-600', label: 'Urgent', dot: 'bg-red-500' },
//     normal: { class: 'text-orange-600', label: 'Normal', dot: 'bg-orange-500' },
//     low: { class: 'text-slate-500', label: 'Faible', dot: 'bg-slate-400' }
//   }
//   const badge = badges[gravity]
//   if (badge) return badge
//   return badges.normal
// }


const getGravityBadge = (gravity?: string): { class: string; label: string; dot: string } => {
  const badges = {
    urgent: { class: 'text-red-600', label: 'Urgent', dot: 'bg-red-500' },
    normal: { class: 'text-orange-600', label: 'Normal', dot: 'bg-orange-500' },
    low: { class: 'text-slate-500', label: 'Faible', dot: 'bg-slate-400' }
  }

  if (!gravity) return { class: 'text-slate-500', label: 'Inconnue', dot: 'bg-slate-400' }
  return badges[gravity as keyof typeof badges] ?? badges.normal
}

// const getActionBadge = (action?: string): { class: string; label: string } => {
//   if (!action) return { class: 'bg-slate-50 text-slate-500', label: 'Aucune' }
//   const badges: Record<string, { class: string; label: string }> = {
//     none: { class: 'bg-slate-50 text-slate-500', label: 'Aucune' },
//     content_disabled: { class: 'bg-red-50 text-red-600', label: 'Contenu désactivé' },
//     content_deleted: { class: 'bg-red-100 text-red-700', label: 'Contenu supprimé' },
//     formator_suspended: { class: 'bg-orange-50 text-orange-600', label: 'Formateur suspendu' },
//     rejected: { class: 'bg-slate-50 text-slate-500', label: 'Signalement rejeté' },
//     processed: { class: 'bg-blue-50 text-blue-600', label: 'Signalement traité' }
//   }
//   const badge = badges[action]
//   if (badge) return badge
//   return badges.none
// }


// Handlers
const handleView = (id: string) => {
  emit('view', id)
  openMenuId.value = null
}

const handleProcess = (signalement: Signalement) => {
  emit('process', signalement)
  openMenuId.value = null
}

const handleViewContent = (signalement: Signalement) => {
  if (signalement.contenu?.url) {
    window.open(signalement.contenu.url, '_blank')
  } else {
    emit('viewContent', signalement)
  }
  openMenuId.value = null
}

const handleViewFormateur = (id: string) => {
  emit('viewFormateur', id)
  openMenuId.value = null
}

// Tri
const handleSort = (field: SignalementSortField) => {
  if (store.sort.field === field) {
    store.setSort(field, store.sort.order === 'asc' ? 'desc' : 'asc')
  } else {
    store.setSort(field, 'desc')
  }
}

const getSortIcon = (field: SignalementSortField) => {
  if (store.sort.field !== field) return null
  return store.sort.order === 'asc' ? '↑' : '↓'
}

// Pagination
const totalPages = computed(() => Math.ceil(store.filteredSignalements.length / store.pagination.limit))
const startItem = computed(() => (store.pagination.page - 1) * store.pagination.limit + 1)
const endItem = computed(() => Math.min(store.pagination.page * store.pagination.limit, store.filteredSignalements.length))

const handlePageChange = (page: number) => {
  store.setPage(page)
}

const displayedSignalements = computed(() => {
  const start = (store.pagination.page - 1) * store.pagination.limit
  const end = start + store.pagination.limit
  return store.filteredSignalements.slice(start, end)
})

// Safe data accessors
const getSignalementTitle = (s: Signalement) => s.contenu?.title || '-'
const getSignalementType = (s: Signalement): { class: string; label: string } => getTypeBadge(s.contenu?.type)
const getSignalementFormateurInitials = (s: Signalement) => {
  const fn = s.contenu?.auteur?.firstName || ''
  const ln = s.contenu?.auteur?.lastName || ''
  return (fn.charAt(0) || '?') + (ln.charAt(0) || '?')
}
const getSignalementFormateurName = (s: Signalement) => {
  const fn = s.contenu?.auteur?.firstName || '-'
  const ln = s.contenu?.auteur?.lastName || ''
  return `${fn} ${ln}`.trim() || '-'
}
const getSignalementLanguage = (s: Signalement) => s.contenu?.language?.code?.toUpperCase() || ''
const getSignalementFormateurId = (s: Signalement) => s.contenu?.auteur?.id || ''
const getReporterName = (s: Signalement) => {
  const fn = s.reportedBy?.firstName || '-'
  const ln = s.reportedBy?.lastName?.charAt(0) || ''
  return `${fn} ${ln}.`.trim()
}
</script>

<template>
  <div class="reports-table bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <!-- Loading State -->
    <div
      v-if="store.isLoading"
      class="flex flex-col items-center justify-center py-16 px-6"
    >
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-[#000099] rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-4 text-slate-500 font-medium">Chargement des signalements...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="store.error"
      class="bg-red-50 border border-red-200 m-6 p-6 rounded-2xl flex items-center gap-4 text-red-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 flex-shrink-0" viewBox="0 0 256 256">
        <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 56a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm8 104a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"/>
      </svg>
      <div>
        <p class="font-bold">Une erreur est survenue</p>
        <p class="text-sm opacity-90">{{ store.error }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="displayedSignalements.length === 0"
      class="flex flex-col items-center justify-center py-16 mx-6 mb-6 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="text-lg font-medium">Aucun signalement trouvé</p>
      <p class="text-sm">Essayez d'ajuster vos filtres de recherche</p>
    </div>

    <!-- Table -->
    <div v-else>
      <!-- Header -->
      <div class="grid grid-cols-[1.5fr_80px_1fr_1fr_100px_100px_100px] px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
        <button @click="handleSort('createdAt')" class="flex items-center gap-1 hover:text-slate-600 transition-colors text-left">
          Signalement {{ getSortIcon('createdAt') }}
        </button>
        <span>Type</span>
        <span>Formateur</span>
        <button @click="handleSort('gravity')" class="flex items-center gap-1 hover:text-slate-600 transition-colors text-left">
          Gravité {{ getSortIcon('gravity') }}
        </button>
        <button @click="handleSort('status')" class="flex items-center gap-1 hover:text-slate-600 transition-colors text-left">
          Statut {{ getSortIcon('status') }}
        </button>
        <span>Signalé par</span>
        <span class="text-right">Actions</span>
      </div>

      <!-- Rows -->
      <div class="divide-y divide-slate-100">
        <div
          v-for="signalement in displayedSignalements"
          :key="signalement.id"
          class="grid grid-cols-[1.5fr_80px_1fr_100px_100px_100px] items-center px-6 py-4 group transition-all duration-300 hover:bg-slate-50"
          :class="signalement.status === 'pending' ? 'bg-red-50/30' : 'bg-white'"
        >
          <!-- Signalement -->
          <div class="flex flex-col gap-1 pr-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-slate-900 truncate" :title="getSignalementTitle(signalement)">
                {{ getSignalementTitle(signalement) }}
              </span>
            </div>
            <p class="text-xs text-slate-500 line-clamp-1" :title="signalement.reason">
              {{ signalement.reason }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] text-slate-400">
                {{ formatDateTime(signalement.createdAt) }}
              </span>
              <span v-if="signalement.status !== 'pending'" class="text-[10px] text-slate-400">
                • Traité: {{ formatDate(signalement.processedAt) }}
              </span>
            </div>
          </div>

          <!-- Type -->
          <div>
            <span
              class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border"
              :class="getSignalementType(signalement).class"
            >
              {{ getSignalementType(signalement).label }}
            </span>
          </div>

          <!-- Formateur -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ced1] to-[#00a8a8] flex items-center justify-center text-[10px] font-bold text-[#000099] flex-shrink-0">
              {{ getSignalementFormateurInitials(signalement) }}
            </div>
            <div class="min-w-0">
              <span class="text-xs text-slate-900 font-medium truncate block">
                {{ getSignalementFormateurName(signalement) }}
              </span>
              <span class="text-[10px] text-slate-400">{{ getSignalementLanguage(signalement) }}</span>
            </div>
          </div>

          <!-- Gravité -->
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" :class="getGravityBadge(signalement.gravity).dot"></span>
              <span class="text-sm font-medium" :class="getGravityBadge(signalement.gravity).class">
                {{ getGravityBadge(signalement.gravity).label }}
              </span>
            </div>
          </div>

          <!-- Statut -->
          <div>
            <span
              class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border"
              :class="getStatusBadge(signalement.status).class"
            >
              {{ getStatusBadge(signalement.status).label }}
            </span>
          </div>

          <!-- Signalé par -->
          <div class="text-xs text-slate-600">
            {{ getReporterName(signalement) }}
          </div>

          <!-- Actions -->
          <div class="flex justify-end items-center gap-2">
            <button
              v-if="signalement.status === 'pending'"
              @click="handleProcess(signalement)"
              class="px-3 py-1.5 text-xs font-medium text-white bg-[#000099] hover:bg-[#000088] rounded-lg transition-colors"
            >
              Traiter
            </button>
            <div class="relative">
              <button
                @click.stop="toggleMenu(signalement.id, $event)"
                class="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300"
                :class="{ 'bg-slate-100 text-slate-900': openMenuId === signalement.id }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>

              <!-- Dropdown -->
              <div
                v-if="openMenuId === signalement.id"
                class="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <button
                  @click="handleView(signalement.id)"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[#000099] hover:bg-[#00ced1]/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Voir les détails
                </button>

                <button
                  @click="handleViewContent(signalement)"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Voir le contenu
                </button>

                <button
                  @click="handleViewFormateur(getSignalementFormateurId(signalement))"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profil formateur
                </button>

                <div class="my-1 border-t border-slate-50"></div>

                <!-- Actions de modération (si en attente) -->
                <template v-if="signalement.status === 'pending'">
                  <button
                    @click="handleProcess(signalement)"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Marquer comme traité
                  </button>
                </template>

                <!-- Action prise (si traité) -->
                <div v-if="signalement.status !== 'pending'" class="px-4 py-2">
                  <span class="text-[10px] font-medium text-slate-500 uppercase">Action prise:</span>
                  <p class="text-xs" :class="getActionBadge(signalement.moderationAction).class">
                    {{ getActionBadge(signalement.moderationAction).label }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="store.filteredSignalements.length > 0" class="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
        <div class="text-sm text-slate-500">
          Affichage de <span class="font-semibold text-slate-900">{{ startItem }}</span> à 
          <span class="font-semibold text-slate-900">{{ endItem }}</span> sur 
          <span class="font-semibold text-slate-900">{{ store.filteredSignalements.length }}</span> résultats
        </div>
        
        <div v-if="totalPages > 1" class="flex items-center gap-2">
          <button
            @click="handlePageChange(store.pagination.page - 1)"
            :disabled="store.pagination.page === 1"
            class="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            v-for="page in totalPages"
            :key="page"
            @click="handlePageChange(page)"
            class="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
            :class="store.pagination.page === page 
              ? 'bg-[#000099] text-white' 
              : 'text-slate-600 hover:bg-slate-50 border border-slate-200'"
          >
            {{ page }}
          </button>
          
          <button
            @click="handlePageChange(store.pagination.page + 1)"
            :disabled="store.pagination.page === totalPages"
            class="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

