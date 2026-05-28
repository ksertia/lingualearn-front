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
  <div class="cf-root">

    <!-- Main filters row -->
    <div class="cf-row">

      <!-- Search -->
      <div class="cf-search">
        <svg class="cf-search-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          :value="store.filters.search"
          @input="store.setFilter('search', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Rechercher un signalement…"
          class="cf-input"
        />
      </div>

      <!-- Statut -->
      <div class="cf-sel-wrap">
        <select :value="store.filters.status || 'all'" @change="handleStatusChange" class="cf-select">
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="processed">Traités</option>
          <option value="rejected">Rejetés</option>
        </select>
        <svg class="cf-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Type -->
      <div class="cf-sel-wrap">
        <select :value="store.filters.type || 'all'" @change="handleTypeChange" class="cf-select">
          <option value="all">Tous les types</option>
          <option value="course">Cours</option>
          <option value="lesson">Leçon</option>
          <option value="quiz">Quiz</option>
          <option value="formateur">Formateur</option>
          <option value="module">Module</option>
          <option value="other">Autre</option>
        </select>
        <svg class="cf-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Gravité -->
      <div class="cf-sel-wrap">
        <select :value="store.filters.gravity || 'all'" @change="handleGravityChange" class="cf-select">
          <option value="all">Toutes les gravités</option>
          <option value="urgent">Urgent</option>
          <option value="normal">Normal</option>
          <option value="low">Faible</option>
        </select>
        <svg class="cf-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Langue -->
      <div class="cf-sel-wrap">
        <select :value="store.filters.languageId || ''" @change="handleLanguageChange" class="cf-select">
          <option value="">Toutes les langues</option>
          <option v-for="lang in languages" :key="lang.value" :value="lang.value">{{ lang.label }}</option>
        </select>
        <svg class="cf-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Advanced toggle -->
      <button class="cf-adv-btn" :class="{ 'cf-adv-btn--on': showAdvancedFilters }" @click="showAdvancedFilters = !showAdvancedFilters">
        <svg class="cf-adv-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        {{ showAdvancedFilters ? 'Masquer' : 'Filtres' }}
      </button>

    </div>

    <!-- Advanced filters -->
    <Transition name="cf-slide">
      <div v-if="showAdvancedFilters" class="cf-advanced">
        <div class="cf-adv-grid">

          <!-- Formateur -->
          <div class="cf-field">
            <label class="cf-label">Formateur</label>
            <div class="cf-sel-wrap">
              <select :value="store.filters.formateurId || ''" @change="handleFormateurChange" class="cf-select">
                <option value="">Tous les formateurs</option>
                <option v-for="formateur in formateurs" :key="formateur.value" :value="formateur.value">{{ formateur.label }}</option>
              </select>
              <svg class="cf-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Date from -->
          <div class="cf-field">
            <label class="cf-label">Date (depuis)</label>
            <input type="date" :value="store.filters.dateFrom || ''" @change="handleDateFromChange" class="cf-input-sm" />
          </div>

          <!-- Date to -->
          <div class="cf-field">
            <label class="cf-label">Date (jusqu'à)</label>
            <input type="date" :value="store.filters.dateTo || ''" @change="handleDateToChange" class="cf-input-sm" />
          </div>

          <!-- Reset -->
          <div class="cf-field cf-field--end">
            <button class="cf-reset" @click="handleReset">
              <svg class="cf-reset-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser
            </button>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.cf-root {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
}

.cf-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Search */
.cf-search {
  position: relative;
  flex: 1;
  min-width: 180px;
}

.cf-search-ico {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px; height: 14px;
  color: #9CA3AF;
  pointer-events: none;
}

.cf-input {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 34px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 13px;
  color: #111827;
  outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;
  box-sizing: border-box;
  font-family: inherit;
}

.cf-input:focus {
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
  background: #fff;
}

.cf-input::placeholder { color: #9CA3AF; }

/* Select wrapper */
.cf-sel-wrap {
  position: relative;
  min-width: 148px;
}

.cf-select {
  appearance: none;
  width: 100%;
  height: 36px;
  padding: 0 30px 0 11px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  outline: none;
  cursor: pointer;
  transition: border-color 0.12s, box-shadow 0.12s;
  font-family: inherit;
}

.cf-select:focus {
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
  background: #fff;
}

.cf-chevron {
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  width: 13px; height: 13px;
  color: #9CA3AF;
  pointer-events: none;
}

/* Advanced toggle */
.cf-adv-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 13px;
  font-size: 13px;
  font-weight: 500;
  color: #6B7280;
  background: #F3F4F6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.12s;
  white-space: nowrap;
  font-family: inherit;
}

.cf-adv-ico { width: 15px; height: 15px; flex-shrink: 0; }

.cf-adv-btn:hover { background: #E5E7EB; color: #374151; }
.cf-adv-btn--on { background: rgba(22,163,74,0.10); color: #15803D; }
.cf-adv-btn--on:hover { background: rgba(22,163,74,0.16); color: #166534; }

/* Advanced panel */
.cf-advanced {
  padding-top: 14px;
  margin-top: 12px;
  border-top: 1px solid #F3F4F6;
}

.cf-adv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.cf-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.cf-field--end { justify-content: flex-end; }

.cf-label {
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cf-input-sm {
  height: 34px;
  padding: 0 11px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 12.5px;
  color: #374151;
  outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;
  font-family: inherit;
}

.cf-input-sm:focus {
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
  background: #fff;
}

.cf-reset {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  font-size: 12.5px;
  font-weight: 500;
  color: #6B7280;
  background: #F3F4F6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.12s;
  font-family: inherit;
}

.cf-reset-ico { width: 14px; height: 14px; flex-shrink: 0; }

.cf-reset:hover { background: #E5E7EB; color: #374151; }

/* Transition */
.cf-slide-enter-active,
.cf-slide-leave-active { transition: opacity 0.15s, transform 0.15s; }
.cf-slide-enter-from,
.cf-slide-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
