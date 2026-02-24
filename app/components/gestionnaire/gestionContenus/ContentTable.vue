<script setup lang="ts">
import { useContenuStore } from "~/stores/contenuStore";
import type { Contenu, ContenuSortField } from "~/types/contenu";

const store = useContenuStore();

const emit = defineEmits<{
  (e: "view", id: string): void;
  (e: "disable", contenu: Contenu): void;
  (e: "enable", id: string): void;
  (e: "delete", id: string): void;
}>();

// Menu contextuel
const openMenuId = ref<string | null>(null);

const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

const handleClickOutside = () => {
  openMenuId.value = null;
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
});

// Formatage des dates
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Badge de type de contenu
const getTypeBadge = (type: string) => {
  const badges: Record<string, { class: string; label: string }> = {
    course: {
      class: "bg-blue-100 text-blue-700 border-blue-200",
      label: "Cours",
    },
    exercise: {
      class: "bg-purple-100 text-purple-700 border-purple-200",
      label: "Exercice",
    },
    quiz: {
      class: "bg-orange-100 text-orange-700 border-orange-200",
      label: "Quiz",
    },
  };
  return (
    badges[type] || {
      class: "bg-gray-100 text-gray-700 border-gray-200",
      label: type,
    }
  );
};

// Badge de statut
const getStatusBadge = (contenu: Contenu) => {
  if (contenu.status === "disabled") {
    if (contenu.disabledByGestionnaire) {
      return {
        class: "bg-red-100 text-red-700 border-red-200",
        label: "Désactivé (Gestionnaire)",
        tooltip: contenu.disabledReason,
      };
    }
    return {
      class: "bg-gray-100 text-gray-700 border-gray-200",
      label: "Désactivé",
    };
  }
  return {
    class: "bg-green-100 text-green-700 border-green-200",
    label: "Actif",
  };
};

// Handlers d'actions
const handleView = (id: string) => {
  emit("view", id);
  openMenuId.value = null;
};

const handleStats = (id: string) => {
  emit("stats", id);
  openMenuId.value = null;
};

const handleDisable = (contenu: Contenu) => {
  emit("disable", contenu);
  openMenuId.value = null;
};

const handleEnable = (id: string) => {
  emit("enable", id);
  openMenuId.value = null;
};

const handleDelete = (id: string) => {
  emit("delete", id);
  openMenuId.value = null;
};

// Tri
const handleSort = (field: ContenuSortField) => {
  if (store.sort.field === field) {
    store.setSort(field, store.sort.order === "asc" ? "desc" : "asc");
  } else {
    store.setSort(field, "desc");
  }
};

const getSortIcon = (field: ContenuSortField) => {
  if (store.sort.field !== field) return null;
  return store.sort.order === "asc" ? "↑" : "↓";
};

// Pagination
const totalPages = computed(() =>
  Math.ceil(store.filteredContenus.length / store.pagination.limit),
);
const startItem = computed(
  () => (store.pagination.page - 1) * store.pagination.limit + 1,
);
const endItem = computed(() =>
  Math.min(
    store.pagination.page * store.pagination.limit,
    store.filteredContenus.length,
  ),
);

const handlePageChange = (page: number) => {
  store.setPage(page);
};

const displayedContenus = computed(() => {
  const start = (store.pagination.page - 1) * store.pagination.limit;
  const end = start + store.pagination.limit;
  return store.filteredContenus.slice(start, end);
});
</script>

<template>
  <div
    class="content-table bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
  >
    <!-- Loading State -->
    <div
      v-if="store.isLoading"
      class="flex flex-col items-center justify-center py-16 px-6"
    >
      <div class="relative w-16 h-16">
        <div
          class="absolute inset-0 border-4 border-gray-200 rounded-full"
        ></div>
        <div
          class="absolute inset-0 border-4 border-[#000099] rounded-full border-t-transparent animate-spin"
        ></div>
      </div>
      <p class="mt-4 text-gray-500 font-medium">Chargement des contenus...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="store.error"
      class="bg-red-50 border border-red-200 m-6 p-6 rounded-2xl flex items-center gap-4 text-red-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8 flex-shrink-0"
        viewBox="0 0 256 256"
      >
        <path
          fill="currentColor"
          d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 56a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm8 104a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"
        />
      </svg>
      <div>
        <p class="font-bold">Une erreur est survenue</p>
        <p class="text-sm opacity-90">{{ store.error }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="displayedContenus.length === 0"
      class="flex flex-col items-center justify-center py-16 mx-6 mb-6 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-16 h-16 mb-4 opacity-20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <p class="text-lg font-medium">Aucun contenu trouvé</p>
      <p class="text-sm">Essayez d'ajuster vos filtres de recherche</p>
    </div>

    <!-- Table -->
    <div v-else>
      <!-- Header -->
      <div
        class="grid grid-cols-[2fr_1fr_1fr_100px] px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-100"
      >
        <button
          @click="handleSort('title')"
          class="flex items-center gap-1 hover:text-gray-600 transition-colors text-left"
        >
          Module {{ getSortIcon("title") }}
        </button>
        <button
          @click="handleSort('level')"
          class="flex items-center gap-1 hover:text-gray-600 transition-colors text-left"
        >
          Niveau {{ getSortIcon("level") }}
        </button>
        <button
          @click="handleSort('publishedAt')"
          class="flex items-center gap-1 hover:text-gray-600 transition-colors text-left"
        >
          Publié {{ getSortIcon("publishedAt") }}
        </button>
        <span class="text-right">Statut</span>
      </div>

      <!-- Rows -->
      <div class="divide-y divide-gray-100">
        <div
          v-for="contenu in displayedContenus"
          :key="contenu.id"
          class="grid grid-cols-[2fr_1fr_1fr_100px] items-center px-6 py-4 group transition-all duration-300 hover:bg-gray-50"
          :class="contenu.status === 'disabled' ? 'bg-red-50/50' : 'bg-white'"
        >
          <!-- Contenu -->
          <div class="flex items-start gap-3 pr-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span
                  class="text-sm font-bold text-gray-900 truncate"
                  :title="contenu.title"
                >
                  {{ contenu.title }}
                </span>
              </div>
              <p
                class="text-xs text-gray-500 truncate mt-0.5"
                :title="contenu.description"
              >
                {{ contenu.description }}
              </p>
            </div>
          </div>

          <!-- Niveau -->
          <div>
            <span class="text-sm text-gray-700">{{ contenu.level.name }}</span>
          </div>

          <!-- Date de publication -->
          <div class="text-xs text-gray-600">
            {{ formatDate(contenu.publishedAt) }}
          </div>

          <!-- Statut & Actions -->
          <div class="flex justify-end items-center gap-2">
            <span
              class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap"
              :class="getStatusBadge(contenu).class"
              :title="getStatusBadge(contenu).tooltip || ''"
            >
              {{ getStatusBadge(contenu).label }}
            </span>

            <div class="relative">
              <button
                @click.stop="toggleMenu(contenu.id)"
                class="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
                :class="{
                  'bg-gray-100 text-gray-900': openMenuId === contenu.id,
                }"
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
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </button>

              <!-- Dropdown -->
              <div
                v-if="openMenuId === contenu.id"
                class="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <!-- Voir détails -->
                <button
                  @click="handleView(contenu.id)"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[#000099] hover:bg-[#00ced1]/10 transition-colors rounded-t-2xl"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Voir les détails
                </button>

                <div class="my-1 border-t border-gray-50"></div>

                <!-- Désactiver / Réactiver -->
                <button
                  v-if="contenu.status === 'active'"
                  @click="handleDisable(contenu)"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
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
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  Désactiver
                </button>
                <button
                  v-else
                  @click="handleEnable(contenu.id)"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-green-600 hover:bg-green-50 transition-colors"
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      contenu.disabledByGestionnaire,
                  }"
                  :disabled="contenu.disabledByGestionnaire"
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
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Réactiver
                  <span
                    v-if="contenu.disabledByGestionnaire"
                    class="text-[10px] text-gray-400 ml-1"
                    >(bloqué)</span
                  >
                </button>

                <!-- Supprimer -->
                <button
                  @click="handleDelete(contenu.id)"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="store.filteredContenus.length > 0"
        class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50"
      >
        <div class="text-sm text-gray-500">
          Affichage de
          <span class="font-semibold text-gray-900">{{ startItem }}</span> à
          <span class="font-semibold text-gray-900">{{ endItem }}</span> sur
          <span class="font-semibold text-gray-900">{{
            store.filteredContenus.length
          }}</span>
          résultats
        </div>

        <div v-if="totalPages > 1" class="flex items-center gap-2">
          <button
            @click="handlePageChange(store.pagination.page - 1)"
            :disabled="store.pagination.page === 1"
            class="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="handlePageChange(page)"
            class="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
            :class="
              store.pagination.page === page
                ? 'bg-[#000099] text-white'
                : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
            "
          >
            {{ page }}
          </button>

          <button
            @click="handlePageChange(store.pagination.page + 1)"
            :disabled="store.pagination.page === totalPages"
            class="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
