<script setup lang="ts">
import { useContenuStore } from "~/stores/contenuStore";
import { useLanguageStore } from "~/stores/languageStore";
import { useFormateurStore } from "~/stores/formateurStore";
import { useLevelStore } from "~/stores/levelStore";

const store = useContenuStore();
const languageStore = useLanguageStore();
const formateurStore = useFormateurStore();
const levelStore = useLevelStore();

// Émettre les changements de filtres
const emit = defineEmits<{
  (e: "filter-change"): void;
}>();

// Computed pour les options de filtres
const languages = computed(() => {
  return languageStore.languages.map((lang) => ({
    value: lang.id,
    label: lang.name,
  }));
});

const levels = computed(() => {
  // Regrouper les niveaux par nom (Débutant, Intermédiaire, Avancé) peu importe la langue
  const uniqueLevels = new Map();

  levelStore.levels.forEach((level: any) => {
    const levelName = level.name.toLowerCase().trim();
    if (!uniqueLevels.has(levelName)) {
      uniqueLevels.set(levelName, {
        value: level.id,
        label: level.name,
      });
    }
  });

  return Array.from(uniqueLevels.values());
});

const formateurs = computed(() => {
  // Ne plus utiliser le filtrage par formateur
  return [];
});

// Handlers
const handleLanguageChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  store.filters.languageId = value;
  store.filters.levelId = undefined; // Reset niveau si la langue change
  store.fetchContenus();
  emit("filter-change");
};

const handleLevelChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  store.filters.levelId = value;
  store.fetchContenus();
  emit("filter-change");
};

const handleFormateurChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  store.filters.formateurId = value;
  store.fetchContenus();
  emit("filter-change");
};

const handleStatusChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  store.filters.status = value as any;
  store.fetchContenus();
  emit("filter-change");
};

const handleDateFromChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  store.filters.dateFrom = value;
  store.fetchContenus();
  emit("filter-change");
};

const handleDateToChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  store.filters.dateTo = value;
  store.fetchContenus();
  emit("filter-change");
};

const handleMinEnrolledChange = (event: Event) => {
  const value = parseInt((event.target as HTMLInputElement).value);
  store.filters.minEnrolled = isNaN(value) ? undefined : value;
  store.fetchContenus();
  emit("filter-change");
};

const handleMaxEnrolledChange = (event: Event) => {
  const value = parseInt((event.target as HTMLInputElement).value);
  store.filters.maxEnrolled = isNaN(value) ? undefined : value;
  store.fetchContenus();
  emit("filter-change");
};

const handleReset = () => {
  store.filters = { status: "all" };
  store.fetchContenus();
  emit("filter-change");
};

// État pour afficher/masquer les filtres avancés
const showAdvancedFilters = ref(false);
</script>

<template>
  <div class="cf-root">
    <div class="cf-row">
      <!-- Search -->
      <div class="cf-search">
        <svg class="cf-search-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          :value="store.filters.search"
          @input="store.filters.search = ($event.target as HTMLInputElement).value"
          type="text"
          placeholder="Rechercher un contenu…"
          class="cf-input"
        />
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

      <!-- Niveau -->
      <div class="cf-sel-wrap">
        <select :value="store.filters.levelId || ''" @change="handleLevelChange" class="cf-select">
          <option value="">Tous les niveaux</option>
          <option v-for="level in levels" :key="level.value" :value="level.value">{{ level.label }}</option>
        </select>
        <svg class="cf-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Statut -->
      <div class="cf-sel-wrap">
        <select :value="store.filters.status || 'all'" @change="handleStatusChange" class="cf-select">
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="disabled">Désactivés</option>
        </select>
        <svg class="cf-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Advanced toggle -->
      <button class="cf-adv-btn" :class="{ 'cf-adv-btn--on': showAdvancedFilters }" @click="showAdvancedFilters = !showAdvancedFilters">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        {{ showAdvancedFilters ? 'Masquer' : 'Filtres' }}
      </button>
    </div>

    <!-- Advanced section -->
    <Transition name="cf-slide">
      <div v-if="showAdvancedFilters" class="cf-advanced">
        <div class="cf-adv-grid">
          <div class="cf-field">
            <label class="cf-label">Date de publication (depuis)</label>
            <input type="date" :value="store.filters.dateFrom || ''" @change="handleDateFromChange" class="cf-input-sm" />
          </div>
          <div class="cf-field">
            <label class="cf-label">Date de publication (jusqu'à)</label>
            <input type="date" :value="store.filters.dateTo || ''" @change="handleDateToChange" class="cf-input-sm" />
          </div>
          <div class="cf-field">
            <label class="cf-label">Inscrits (min)</label>
            <input type="number" :value="store.filters.minEnrolled || ''" @change="handleMinEnrolledChange" placeholder="0" min="0" class="cf-input-sm" />
          </div>
          <div class="cf-field">
            <label class="cf-label">Inscrits (max)</label>
            <input type="number" :value="store.filters.maxEnrolled || ''" @change="handleMaxEnrolledChange" placeholder="9999" min="0" class="cf-input-sm" />
          </div>
        </div>
        <button class="cf-reset" @click="handleReset">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Réinitialiser les filtres
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cf-root { display: flex; flex-direction: column; gap: 12px; padding: 14px 16px; }

.cf-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.cf-search { flex: 1; min-width: 200px; position: relative; }
.cf-search-ico {
  position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
  width: 14px; height: 14px; color: #9CA3AF; pointer-events: none;
}
.cf-input {
  width: 100%; height: 36px; padding: 0 12px 0 32px;
  font-size: 13px; color: #111827;
  background: #F9FAFB; border: 1px solid #E5E7EB;
  border-radius: 8px; outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;
  box-sizing: border-box;
}
.cf-input:focus { background: white; border-color: #16A34A; box-shadow: 0 0 0 3px rgba(22,163,74,0.10); }

.cf-sel-wrap { position: relative; flex-shrink: 0; }
.cf-select {
  height: 36px; padding: 0 28px 0 10px;
  font-size: 13px; color: #374151;
  background: #F9FAFB; border: 1px solid #E5E7EB;
  border-radius: 8px; outline: none; cursor: pointer; appearance: none;
  transition: border-color 0.12s;
}
.cf-select:focus { border-color: #16A34A; box-shadow: 0 0 0 3px rgba(22,163,74,0.10); }
.cf-chevron {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  width: 13px; height: 13px; color: #9CA3AF; pointer-events: none;
}

.cf-adv-btn {
  display: flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 12px;
  font-size: 13px; font-weight: 500; color: #6B7280;
  background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;
  transition: all 0.13s; white-space: nowrap; flex-shrink: 0;
}
.cf-adv-btn:hover { background: #E5E7EB; color: #374151; }
.cf-adv-btn--on { background: rgba(22,163,74,0.10); color: #15803D; }

.cf-advanced { display: flex; flex-direction: column; gap: 12px; padding-top: 12px; border-top: 1px solid #F3F4F6; }
.cf-adv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.cf-field { display: flex; flex-direction: column; gap: 5px; }
.cf-label { font-size: 11.5px; font-weight: 600; color: #6B7280; }
.cf-input-sm {
  height: 34px; padding: 0 10px;
  font-size: 13px; color: #111827;
  background: #F9FAFB; border: 1px solid #E5E7EB;
  border-radius: 8px; outline: none;
  transition: border-color 0.12s;
  box-sizing: border-box;
}
.cf-input-sm:focus { background: white; border-color: #16A34A; box-shadow: 0 0 0 3px rgba(22,163,74,0.10); }

.cf-reset {
  display: flex; align-items: center; gap: 6px;
  width: fit-content; height: 32px; padding: 0 12px;
  font-size: 12.5px; font-weight: 500; color: #6B7280;
  background: none; border: none; border-radius: 7px; cursor: pointer;
  transition: all 0.12s;
}
.cf-reset:hover { background: #F3F4F6; color: #374151; }

.cf-slide-enter-active, .cf-slide-leave-active { transition: opacity 0.18s, transform 0.18s; }
.cf-slide-enter-from, .cf-slide-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
