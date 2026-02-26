<script setup lang="ts">
import { useContenuStore } from "~/stores/contenuStore";
import { useLanguageStore } from "~/stores/languageStore";
import { useFormateurStore } from "~/stores/formateurStore";

const store = useContenuStore();
const languageStore = useLanguageStore();
const formateurStore = useFormateurStore();

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
  const selectedLangId = store.filters.languageId;
  if (!selectedLangId) return [];

  const selectedLang = languageStore.languages.find(
    (l) => l.id === selectedLangId,
  );
  if (!selectedLang) return [];

  return selectedLang.levels.map((level) => ({
    value: level.id,
    label: level.name,
  }));
});

const formateurs = computed(() => {
  if(!formateurStore.fetchFormateurUsers) {
    return []
  } else {
    return formateurStore.fetchFormateurUsers((f) => ({
    value: f.id,
    label: `${f.firstName} ${f.lastName}`,
  }));
  }
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
  <div
    class="content-filters bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
  >
    <!-- Filtres principaux -->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Recherche -->
      <div class="relative flex-1">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          :value="store.filters.search"
          @input="
            store.setFilter('search', ($event.target as HTMLInputElement).value)
          "
          type="text"
          placeholder="Rechercher un contenu..."
          class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm"
        />
      </div>

      <!-- Langue -->
      <div class="relative min-w-[180px]">
        <select
          :value="store.filters.languageId || ''"
          @change="handleLanguageChange"
          class="appearance-none w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm font-medium"
        >
          <option value="">Toutes les langues</option>
          <option
            v-for="lang in languages"
            :key="lang.value"
            :value="lang.value"
          >
            {{ lang.label }}
          </option>
        </select>
        <div
          class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <!-- Niveau -->
      <div class="relative min-w-[180px]">
        <select
          :value="store.filters.levelId || ''"
          @change="handleLevelChange"
          :disabled="!store.filters.languageId"
          class="appearance-none w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Tous les niveaux</option>
          <option
            v-for="level in levels"
            :key="level.value"
            :value="level.value"
          >
            {{ level.label }}
          </option>
        </select>
        <div
          class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <!-- Formateur -->
      <div class="relative min-w-[180px]">
        <select
          :value="store.filters.formateurId || ''"
          @change="handleFormateurChange"
          class="appearance-none w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm font-medium"
        >
          <option value="">Tous les formateurs</option>
          <option
            v-for="formateur in formateurs"
            :key="formateur"
            :value="formateur"
          >
            {{ formateur }}
          </option>
        </select>
        <div
          class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <!-- Statut -->
      <div class="relative min-w-[160px]">
        <select
          :value="store.filters.status || 'all'"
          @change="handleStatusChange"
          class="appearance-none w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none transition-all text-sm font-medium"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="disabled">Désactivés</option>
        </select>
        <div
          class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <!-- Bouton filtres avancés -->
      <!-- <button
        @click="showAdvancedFilters = !showAdvancedFilters"
        class="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#000099] bg-[#000099]/5 hover:bg-[#000099]/10 rounded-xl transition-colors whitespace-nowrap"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        <span>{{ showAdvancedFilters ? "Masquer" : "Plus de filtres" }}</span>
      </button> -->
    </div>

    <!-- Filtres avancés -->
    <div v-if="showAdvancedFilters" class="mt-6 pt-6 border-t border-gray-100">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Date de début -->
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-2"
            >Date de publication (depuis)</label
          >
          <input
            type="date"
            :value="store.filters.dateFrom || ''"
            @change="handleDateFromChange"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none text-sm"
          />
        </div>

        <!-- Date de fin -->
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-2"
            >Date de publication (jusqu'à)</label
          >
          <input
            type="date"
            :value="store.filters.dateTo || ''"
            @change="handleDateToChange"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none text-sm"
          />
        </div>

        <!-- Inscrits (min) -->
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-2"
            >Inscrits (min)</label
          >
          <input
            type="number"
            :value="store.filters.minEnrolled || ''"
            @change="handleMinEnrolledChange"
            placeholder="0"
            min="0"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none text-sm"
          />
        </div>

        <!-- Inscrits (max) -->
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-2"
            >Inscrits (max)</label
          >
          <input
            type="number"
            :value="store.filters.maxEnrolled || ''"
            @change="handleMaxEnrolledChange"
            placeholder="9999"
            min="0"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none text-sm"
          />
        </div>
      </div>

      <!-- Bouton reset -->
      <div class="mt-4 flex justify-end">
        <button
          @click="handleReset"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  </div>
</template>
