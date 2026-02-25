<script setup lang="ts">
import { useContenuStore } from "~/stores/contenuStore";

import type { Contenu } from "~/types/contenu";

const props = defineProps<{
  contenuId: string | null;

  showStats?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const store = useContenuStore();

// Track if component is mounted
const isMounted = ref(false)

// Charger les détails quand l'ID change

watch(
  () => props.contenuId,

  async (newId) => {
    if (newId) {
      await store.fetchModuleDetails(newId);
    }
  },

  { immediate: true },
);

onMounted(() => {
  isMounted.value = true
})

onUnmounted(() => {
  isMounted.value = false
  // Clear current contenu to prevent reactivity issues
  store.currentContenu = null
})

// Formatage des dates

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",

    month: "long",

    year: "numeric",

    hour: "2-digit",

    minute: "2-digit",
  });
};

// Badge de type

const getTypeBadge = (type: string) => {
  const badges: Record<string, { class: string; label: string; icon: string }> =
    {
      course: {
        class: "bg-blue-100 text-blue-700 border-blue-200",

        label: "Cours",

        icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      },

      exercise: {
        class: "bg-purple-100 text-purple-700 border-purple-200",

        label: "Exercice",

        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
      },

      quiz: {
        class: "bg-orange-100 text-orange-700 border-orange-200",

        label: "Quiz",

        icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
      },
    };

  return (
    badges[type] || {
      class: "bg-gray-100 text-gray-700 border-gray-200",

      label: type,

      icon: "",
    }
  );
};

// Badge de statut

const getStatusBadge = (contenu: Contenu) => {
  if (contenu.status === "disabled") {
    if (contenu.disabledByGestionnaire) {
      return {
        class: "bg-red-100 text-red-700 border-red-200",

        label: "Désactivé par le gestionnaire",

        icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      };
    }

    return {
      class: "bg-gray-100 text-gray-700 border-gray-200",

      label: "Désactivé",

      icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
    };
  }

  return {
    class: "bg-green-100 text-green-700 border-green-200",

    label: "Actif",

    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  };
};

// Computed

const contenu = computed(() =>
  store.contenus.find((c) => c.id === props.contenuId),
);

const isLoading = computed(() => store.isLoading);

const moduleDetails = computed(() => store.selectedModuleDetails);
</script>

<template>
  <!-- Overlay -->

  <div
    v-if="contenuId"
    class="fixed inset-0 bg-black/30 z-40 transition-opacity"
    @click="emit('close')"
  ></div>

  <!-- Drawer -->

  <div
    class="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-hidden flex flex-col"
    :class="contenuId ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Header -->

    <div
      class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50"
    >
      <div>
        <h2 class="text-lg font-bold text-gray-900">Détails du module</h2>

        <p v-if="contenu" class="text-sm text-gray-500 mt-0.5">
          {{ contenu.title }}
        </p>
      </div>

      <button
        @click="emit('close')"
        class="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Loading -->

    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="relative w-12 h-12">
        <div
          class="absolute inset-0 border-4 border-gray-200 rounded-full"
        ></div>

        <div
          class="absolute inset-0 border-4 border-[#000099] rounded-full border-t-transparent animate-spin"
        ></div>
      </div>
    </div>

    <!-- Content -->

    <div v-else-if="contenu" class="flex-1 overflow-y-auto p-6">
      <!-- Status Banner -->

      <div
        class="flex items-center gap-3 px-4 py-3 rounded-xl border mb-6"
        :class="getStatusBadge(contenu).class"
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
            :d="getStatusBadge(contenu).icon"
          />
        </svg>

        <span class="font-semibold">{{ getStatusBadge(contenu).label }}</span>
      </div>

      <!-- Type Badge -->

      <div class="flex items-center gap-2 mb-6">
        <span
          class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border"
          :class="getTypeBadge(contenu.type).class"
        >
          {{ getTypeBadge(contenu.type).label }}
        </span>
      </div>

      <!-- Basic Info -->

      <div class="space-y-4 mb-8">
        <div>
          <h3
            class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1"
          >
            Titre du Module
          </h3>

          <p class="text-gray-900 font-medium">{{ contenu.title }}</p>
        </div>

        <div>
          <h3
            class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1"
          >
            Description
          </h3>

          <p class="text-gray-600">{{ contenu.description }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-2">
          <div>
            <h3
              class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1"
            >
              Type
            </h3>

            <span
              class="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border inline-block"
              :class="getTypeBadge(contenu.type).class"
            >
              {{ getTypeBadge(contenu.type).label }}
            </span>
          </div>

          <div>
            <h3
              class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1"
            >
              Langue
            </h3>

            <span
              class="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 inline-block"
            >
              {{ contenu.language.code.toUpperCase() || "FR" }}
            </span>
          </div>
        </div>
      </div>

      <!-- Statistics Summary (Moved from Table) -->

      <div class="grid grid-cols-3 gap-3 mb-8">
        <div class="bg-blue-50/50 rounded-2xl p-3 border border-blue-100">
          <p class="text-[10px] font-bold text-blue-600 uppercase mb-1">
            Inscrits
          </p>

          <p class="text-xl font-bold text-[#000099]">
            {{ contenu.stats.enrolledCount }}
          </p>
        </div>

        <div class="bg-purple-50/50 rounded-2xl p-3 border border-purple-100">
          <p class="text-[10px] font-bold text-purple-600 uppercase mb-1">
            Succès
          </p>

          <p class="text-xl font-bold text-purple-700">
            {{ contenu.stats.completionRate }}%
          </p>
        </div>

        <div class="bg-orange-50/50 rounded-2xl p-3 border border-orange-100">
          <p class="text-[10px] font-bold text-orange-600 uppercase mb-1">
            Alertes
          </p>

          <p class="text-xl font-bold text-orange-700">
            {{ contenu.stats.reportsCount }}
          </p>
        </div>
      </div>

      <!-- Module Content (Parcours & Steps) -->

      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-[#000099]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>

          Parcours et Étapes associés
        </h3>

        <div
          v-if="!isLoading && moduleDetails.parcours.length === 0"
          class="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
        >
          <p class="text-gray-400 text-sm font-medium">
            Aucun parcours trouvé pour ce module
          </p>
        </div>

        <div v-else-if="moduleDetails.parcours.length > 0" class="space-y-4">
          <div
            v-for="parcours in moduleDetails.parcours"
            :key="parcours.id"
            class="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm"
          >
            <div
              class="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between"
            >
              <div>
                <h4 class="font-bold text-gray-900 text-sm">
                  {{ parcours.title }}
                </h4>

                <p class="text-[10px] text-gray-500 line-clamp-1">
                  {{ parcours.description }}
                </p>
              </div>

              <span
                class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase"
                >Parcours</span
              >
            </div>

            <div class="p-4">
              <h5
                class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3"
              >
                Étapes du parcours
              </h5>

              <div
                v-if="
                  !moduleDetails.steps[String(parcours.id).trim()] ||
                  moduleDetails.steps[String(parcours.id).trim()].length === 0
                "
                class="text-xs text-gray-400 italic"
              >
                Aucune étape définie
              </div>

              <div v-else class="space-y-2">
                <div
                  v-for="step in moduleDetails.steps[
                    String(parcours.id).trim()
                  ]"
                  :key="step.id"
                  class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-[#00ced1]/10 flex items-center justify-center text-[#000099] font-bold text-xs"
                  >
                    {{ step.index || "•" }}
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-gray-900 truncate">
                      {{ step.title }}
                    </p>

                    <div class="flex items-center gap-2 mt-0.5">
                      <span
                        class="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium uppercase tracking-wider"
                      >
                        {{ step.stepType }}
                      </span>

                      <span
                        v-if="step.estimatedMinutes"
                        class="text-[9px] text-gray-400 flex items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-2.5 h-2.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>

                        {{ step.estimatedMinutes }} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hierarchy -->

      <div class="bg-gray-50 rounded-2xl p-4 mb-6">
        <h3
          class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3"
        >
          Hiérarchie pédagogique
        </h3>

        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 w-20">Langue:</span>

            <span class="text-sm font-medium text-gray-900">{{
              contenu.language.name
            }}</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 w-20">Niveau:</span>

            <span class="text-sm font-medium text-gray-900">{{
              contenu.level.name
            }}</span>
          </div>
        </div>
      </div>

      <!-- Author & Dates -->

      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="bg-gray-50 rounded-2xl p-4">
          <h3
            class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3"
          >
            Formateur
          </h3>

          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ced1] to-[#00a8a8] flex items-center justify-center text-sm font-bold text-[#000099]"
            >
              {{ contenu.auteur.firstName.charAt(0)
              }}{{ contenu.auteur.lastName.charAt(0) }}
            </div>

            <div class="min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">
                {{ contenu.auteur.firstName }} {{ contenu.auteur.lastName }}
              </p>

              <p class="text-[10px] text-gray-500 truncate">
                {{ contenu.auteur.email }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-2xl p-4">
          <h3
            class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3"
          >
            Dates Clés
          </h3>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-gray-400">Créé le</span>

              <span class="text-[10px] font-medium text-gray-600">{{
                formatDate(contenu.createdAt)
              }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-[10px] text-gray-400">Publié le</span>

              <span class="text-[10px] font-medium text-gray-600">{{
                formatDate(contenu.publishedAt)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Hierarchy -->

      <!-- Statistics (only shown in stats mode) -->

      <div v-if="showStats" class="space-y-4">
        <h3
          class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3"
        >
          Statistiques
        </h3>

        <div class="grid grid-cols-2 gap-4">
          <!-- Enrolled -->

          <div class="bg-white rounded-xl border border-gray-100 p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-2 rounded-lg bg-blue-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>

              <span class="text-xs text-gray-500">Inscrits</span>
            </div>

            <p class="text-2xl font-bold text-gray-900">
              {{ contenu.stats.enrolledCount }}
            </p>
          </div>

          <!-- Completion Rate -->

          <div class="bg-white rounded-xl border border-gray-100 p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-2 rounded-lg bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <span class="text-xs text-gray-500">Taux de completion</span>
            </div>

            <p class="text-2xl font-bold text-gray-900">
              {{ contenu.stats.completionRate }}%
            </p>
          </div>

          <!-- Average Score -->

          <div class="bg-white rounded-xl border border-gray-100 p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-2 rounded-lg bg-purple-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>

              <span class="text-xs text-gray-500">Score moyen</span>
            </div>

            <p class="text-2xl font-bold text-gray-900">
              {{ contenu.stats.averageScore }}/100
            </p>
          </div>

          <!-- Reports -->

          <div class="bg-white rounded-xl border border-gray-100 p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-2 rounded-lg bg-orange-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <span class="text-xs text-gray-500">Signalements</span>
            </div>

            <p class="text-2xl font-bold text-gray-900">
              {{ contenu.stats.reportsCount }}
            </p>
          </div>
        </div>
      </div>

      <!-- Disable Reason -->

      <div
        v-if="contenu.disabledReason"
        class="bg-red-50 border border-red-200 rounded-2xl p-4 mt-6"
      >
        <h3
          class="text-sm font-semibold text-red-700 uppercase tracking-wider mb-2"
        >
          Motif de désactivation
        </h3>

        <p class="text-red-600">{{ contenu.disabledReason }}</p>
      </div>
    </div>

    <!-- Footer -->

    <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
      <button
        @click="emit('close')"
        class="w-full px-4 py-3 bg-[#000099] text-white rounded-xl font-medium hover:bg-[#000088] transition-colors"
      >
        Fermer
      </button>
    </div>
  </div>
</template>

<style scoped></style>
