<script setup lang="ts">
import { useSignalementStore } from '~/stores/signalementStore'
import { useLanguageStore } from '~/stores/languageStore'
import { useFormateurStore } from '~/stores/formateurStore'

const store = useSignalementStore()
const languageStore = useLanguageStore()
const formateurStore = useFormateurStore()

const emit = defineEmits<{
  (e: 'filter-change'): void
}>()

// Options de filtres
const languages = computed(() => {
  return languageStore.languages.map(lang => ({
    value: lang.id,
    label: lang.name
  }))
})

const formateurs = computed(() => {
  return formateurStore.formateurs.map(f => ({
    value: f.id,
    label: `${f.firstName} ${f.lastName}`
  }))
})

// Handlers
const handleStatusChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  store.setFilter('status', value)
  emit('filter-change')
}

const handleTypeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  store.setFilter('type', value)
  emit('filter-change')
}

const handleLanguageChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  store.setFilter('languageId', value)
  emit('filter-change')
}

const handleFormateurChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  store.setFilter('formateurId', value)
  emit('filter-change')
}

const handleGravityChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  store.setFilter('gravity', value)
  emit('filter-change')
}

const handleDateFromChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  store.setFilter('dateFrom', value || undefined)
  emit('filter-change')
}

const handleDateToChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  store.setFilter('dateTo', value || undefined)
  emit('filter-change')
}

const handleReset = () => {
  store.resetFilters()
  emit('filter-change')
}

const showAdvancedFilters = ref(false)
</script>

<template>
  <div class="reports-filters bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
    <!-- Filtres principaux -->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Recherche -->
      <div class="relative flex-1">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          :value="store.filters.search"
          @input="store.setFilter('search', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Rechercher un signalement..."
          class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm"
        />
      </div>

      <!-- Statut -->
      <div class="relative min-w-[160px]">
        <select
          :value="store.filters.status || 'all'"
          @change="handleStatusChange"
          class="appearance-none w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm font-medium"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="processed">Traités</option>
          <option value="rejected">Rejetés</option>
        </select>
        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Type -->
      <div class="relative min-w-[160px]">
        <select
          :value="store.filters.type || 'all'"
          @change="handleTypeChange"
          class="appearance-none w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm font-medium"
        >
          <option value="all">Tous les types</option>
          <option value="course">Cours</option>
          <option value="lesson">Leçon</option>
          <option value="quiz">Quiz</option>
          <option value="formateur">Formateur</option>
          <option value="module">Module</option>
          <option value="other">Autre</option>
        </select>
        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Gravité -->
      <div class="relative min-w-[160px]">
        <select
          :value="store.filters.gravity || 'all'"
          @change="handleGravityChange"
          class="appearance-none w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm font-medium"
        >
          <option value="all">Toutes les gravités</option>
          <option value="urgent">Urgent</option>
          <option value="normal">Normal</option>
          <option value="low">Faible</option>
        </select>
        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Langue -->
      <div class="relative min-w-[160px]">
        <select
          :value="store.filters.languageId || ''"
          @change="handleLanguageChange"
          class="appearance-none w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm font-medium"
        >
          <option value="">Toutes les langues</option>
          <option v-for="lang in languages" :key="lang.value" :value="lang.value">
            {{ lang.label }}
          </option>
        </select>
        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Bouton filtres avancés -->
      <button
        @click="showAdvancedFilters = !showAdvancedFilters"
        class="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#000099] bg-[#000099]/5 hover:bg-[#000099]/10 rounded-xl transition-colors whitespace-nowrap"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span>{{ showAdvancedFilters ? 'Masquer' : 'Plus' }}</span>
      </button>
    </div>

    <!-- Filtres avancés -->
    <div v-if="showAdvancedFilters" class="mt-6 pt-6 border-t border-slate-100">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Formateur -->
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-2">Formateur</label>
          <select
            :value="store.filters.formateurId || ''"
            @change="handleFormateurChange"
            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none text-sm"
          >
            <option value="">Tous les formateurs</option>
            <option v-for="formateur in formateurs" :key="formateur.value" :value="formateur.value">
              {{ formateur.label }}
            </option>
          </select>
        </div>

        <!-- Date de début -->
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-2">Date (depuis)</label>
          <input
            type="date"
            :value="store.filters.dateFrom || ''"
            @change="handleDateFromChange"
            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none text-sm"
          />
        </div>

        <!-- Date de fin -->
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-2">Date (jusqu'à)</label>
          <input
            type="date"
            :value="store.filters.dateTo || ''"
            @change="handleDateToChange"
            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none text-sm"
          />
        </div>

        <!-- Bouton reset -->
        <div class="flex items-end">
          <button
            @click="handleReset"
            class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

