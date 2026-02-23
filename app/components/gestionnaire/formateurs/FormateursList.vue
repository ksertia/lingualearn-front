<script setup lang="ts">
import { useFormateurStore } from "~/stores/formateurStore";

const store = useFormateurStore();

const emit = defineEmits<{
  (e: "view", id: string): void;
  (e: "suspend", id: string): void;
  (e: "reactivate", id: string): void;
}>();

const props = defineProps<{
  limit?: number;
}>();

const formatDate = (dateString?: string | Date) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (dateString?: string | Date) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const openMenuId = ref<string | null>(null);

const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

const handleClickOutside = () => {
  openMenuId.value = null;
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
  store.fetchFormateurUsers();
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
});

const displayedFormateurs = computed(() => {
  const list = store.users
  if (props.limit) {
    return list.slice(0, props.limit)
  }
  return list
})


const getInitials = (firstName?: string, lastName?: string) => {
  const f = firstName?.charAt(0) ?? '?'
  const l = lastName?.charAt(0) ?? ''
  return `${f}${l}`.toUpperCase() || '?'
};

const getStatusBadge = (formateur: any) => {
  if (!formateur.isActive) {
    return {
      class: "bg-red-100 text-red-700 border-red-200",
      label: "Suspendu",
    };
  }
  if (formateur.reports && formateur.reports.length > 0) {
    return {
      class: "bg-orange-100 text-orange-700 border-orange-200",
      label: "Signalements",
    };
  }
  return {
    class: "bg-green-100 text-green-700 border-green-200",
    label: "Actif",
  };
};

const handleSuspend = (formateur: any) => {
  const confirmSuspend = confirm(
    `Êtes-vous sûr de vouloir suspendre ${formateur.firstName} ${formateur.lastName} ?\n\nCette action rendra tous ses modules invisibles pour les apprenants.`,
  );
  if (confirmSuspend) {
    store.suspendFormateur(formateur.id);
    openMenuId.value = null;
  }
};

const handleReactivate = (formateur: any) => {
  store.reactivateFormateur(formateur.id);
  openMenuId.value = null;
};

const handleViewDetail = (id: string) => {
  openMenuId.value = null;
  nextTick(() => {
    emit('view', id);
  });
};
</script>

<template>
  <div class="formateurs-list">
    <div
      v-if="store.isLoading"
      class="flex flex-col items-center justify-center py-16"
    >
      <div class="relative w-16 h-16">
        <div
          class="absolute inset-0 border-4 border-gray-200 rounded-full"
        ></div>
        <div
          class="absolute inset-0 border-4 border-[#000099] rounded-full border-t-transparent animate-spin"
        ></div>
      </div>
      <p class="mt-4 text-gray-500 font-medium">Chargement des formateurs...</p>
    </div>

    <div
      v-else-if="store.error"
      class="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center gap-4 text-red-700"
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

    <div
      v-else-if="displayedFormateurs.length === 0"
      class="flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
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
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <p class="text-lg font-medium">Aucun formateur trouvé</p>
      <p class="text-sm">Essayez d'ajuster vos filtres de recherche</p>
    </div>

    <div v-else class="overflow-x-auto -mx-8 px-8">
      <div class="min-w-[900px]">
        <!-- Header -->
        <div
          class="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_1fr] px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 rounded-t-2xl"
        >
          <span>Formateur</span>
          <span>Langue</span>
          <span>Modules</span>
          <span>Signal.</span>
          <span>Dernière pub.</span>
          <span>Statut</span>
          <span class="text-right">Actions</span>
        </div>

        <!-- Rows -->
        <div class="space-y-2">
          <div
            v-for="formateur in displayedFormateurs"
            :key="formateur.id"
            class="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_1fr] items-center border rounded-xl px-6 py-4 group transition-all duration-300 hover:shadow-lg"
            :class="
              !formateur.isActive
                ? 'bg-red-50 border-red-100'
                : 'bg-white border-gray-100 hover:border-[#00ced1]'
            "
          >
            <!-- Formateur -->
            <div class="flex items-center gap-4">
              <div class="relative">
                <div
                  class="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold shadow-inner"
                  :class="
                    !formateur.isActive
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-gradient-to-br from-[#00ced1] to-[#00a8a8] text-[#000099]'
                  "
                >
                  {{ getInitials(formateur.firstName, formateur.lastName) }}
                </div>

                <!-- Lock icon for suspended -->
                <div
                  v-if="!formateur.isActive"
                  class="absolute -top-2 -right-2 w-7 h-7 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg"
                  title="Compte suspendu"
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>

              <div class="flex flex-col">
                <span class="text-sm font-bold text-gray-900 leading-tight">
                  {{ formateur.firstName }} {{ formateur.lastName }}
                </span>
                <span
                  class="text-xs text-gray-500 truncate max-w-[180px]"
                  :title="formateur.email"
                >
                  {{ formateur.email }}
                </span>
              </div>
            </div>

            <!-- Language -->
            <div class="flex items-center gap-2">
              <span
                v-if="formateur.language"
                class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700"
              >
                {{ formateur.language?.code?.toUpperCase() }}
              </span>
              <span v-else class="text-xs text-gray-400">-</span>
            </div>

            <!-- Modules -->
            <div class="flex flex-col">
              <span class="text-sm font-bold text-gray-900">{{ formateur.stats?.totalModules ?? '-' }}</span>
              <span class="text-[10px] text-gray-500"
                >{{ formateur.stats?.activeModules ?? 0 }} actifs</span
              >
            </div>

            <!-- Reports -->
            <div>
              <span
                v-if="formateur.reports && formateur.reports.length > 0"
                class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-orange-100 text-orange-700"
              >
                {{ formateur.reports.length }}
              </span>
              <span v-else class="text-xs text-gray-400">0</span>
            </div>

            <!-- Last Publication -->
            <div class="text-xs text-gray-600">
              {{ formatDate(formateur.stats?.lastPublicationDate) }}
            </div>

            <!-- Status -->
            <div>
              <span
                class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border"
                :class="getStatusBadge(formateur).class"
              >
                {{ getStatusBadge(formateur).label }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex justify-end items-center relative">
              <button
                @click.stop="toggleMenu(formateur.id)"
                class="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
                :class="{
                  'bg-gray-100 text-gray-900': openMenuId === formateur.id,
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6"
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
                v-if="openMenuId === formateur.id"
                class="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                @click.stop
              >
                <!-- View Details -->
                <button
                  @click="handleViewDetail(formateur.id)"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[#000099] hover:bg-[#00ced1]/10 transition-colors"
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

                <!-- View Modules -->
                <button
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  Voir les modules
                </button>

                <div class="my-1 border-t border-gray-50"></div>

                <!-- Suspend / Reactivate -->
                <button
                  v-if="formateur.isActive"
                  @click="handleSuspend(formateur)"
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
                  Suspendre
                </button>
                <button
                  v-else
                  @click="handleReactivate(formateur)"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-green-600 hover:bg-green-50 transition-colors"
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>



</style>
