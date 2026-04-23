<script setup lang="ts">
import { useGestionnaireDashboardStore } from "~/stores/gestionnaireDashboardStore";

defineProps<{activeKpi?: string}>();

defineEmits<{(e: "select", kpi: string): void;
}>();

const store = useGestionnaireDashboardStore();

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("fr-FR").format(num);
};

type StatCard = {
  id: string;
  title: string;
  value: number;
  icon: string;
  color: string;
  route: string;
  gradient: string;
  subStats: { label: string; value: number }[];
  variation?: number | null;
  variationLabel?: string | null;
  urgent?: boolean; // ✅ 
};


// Configuration des cartes statistiques
const statCards = computed<StatCard[]>(() => [
  {
    id: "trainers",
    title: "Formateurs",
    value: store.trainersTotal,
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    color: "brand-blue",
    route : "/gestionnaire/formateurs",
    gradient: "from-[#000099] to-[#0f1b3b]",
    subStats: store.stats?.trainers.active
      ? [{ label: "Actifs", value: store.stats.trainers.active }]
      : [],
  },

{
  id: 'languages',
  title: 'Langues',
  // 👉 total global des langues
  value: store.totalLanguages || 0,
  icon: 'M3 5h12M9 3v2m1.5 13.5L15 10M12 21l-3-8-3 8m3-8h6',
  color: 'brand-cyan',
  gradient: 'from-[#00CED1] to-[#0097a7]',
  route: '/gestionnaire',
  // variation: null,
  // variationLabel: null,

  // 👉 détail
  subStats: [
    {
      // label: 'Désactivées',
      // value: store.disabledLanguages || 0
      label: 'Activées',
      value: store.activeLanguages || 0
    }
  ]
},

  {
    id: "contents",
    title: "Contenus",
    route: "/gestionnaire/contenus",

    // ✅ TOTAL GLOBAL (modules + parcours + étapes)
    value:
      (store.totalModules || 0) +
      (store.totalParcours || 0) +
      (store.totalEtapes || 0),

    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    color: "brand-orange",
    gradient: "from-[#FF7F00] to-[#c96000]",

    // // ❌ inutile ici
    // variation: null,
    // variationLabel: null,

    // ✅ DÉTAIL COMPLET
    subStats: [
      {
        label: "Modules",
        value: store.totalModules || 0,
      },
      {
        label: "Parcours",
        value: store.totalParcours || 0,
      },
      {
        label: "Étapes",
        value: store.totalEtapes || 0,
      },
    ],
  },
]);
</script>

<template>
  <div class="flex gap-4 lg:gap-6">
      <NuxtLink
        v-for="card in statCards"
        :key="card.id"
        :to="card.route"
        class="stat-card group text-left w-full relative overflow-hidden cursor-pointer"
        :class="[
          `bg-gradient-to-br ${card.gradient}`,
          { 'ring-4 ring-offset-2': activeKpi === card.id },
        ]"
      >
      
      
      <!-- <button
        v-for="card in statCards"
        :key="card.id"
        @click="$emit('select', card.id)"
        class="stat-card group text-left w-full relative overflow-hidden"
        :class="[
          `bg-gradient-to-br ${card.gradient}`,
          { 'ring-4 ring-offset-2': activeKpi === card.id },
        ]"
      > -->
        <!-- Header -->
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <p
              class="text-white text-xs font-semibold uppercase tracking-wider"
              style="opacity: 0.8"
            >
              {{ card.title }}
            </p>
            <div class="flex items-baseline gap-2 mt-2">
              <h3
                class="text-3xl lg:text-4xl font-extrabold text-white group-hover:scale-105 transition-transform origin-left duration-300 leading-none"
              >
                {{ formatNumber(card.value) }}
              </h3>
            </div>
          </div>

          <!-- Icon -->
          <div
            class="p-3 rounded-2xl group-hover:rotate-12 transition-all duration-300"
            style="
              background-color: rgba(255, 255, 255, 0.2);
              backdrop-filter: blur(8px);
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                :d="card.icon"
              />
            </svg>
          </div>
        </div>

        <!-- Sub Stats -->
        <div v-if="card.subStats?.length" class="mt-4 space-y-2">
          <div
            v-for="sub in card.subStats"
            :key="sub.label"
            class="rounded-lg px-3 py-2"
            style="
              background-color: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(4px);
            "
          >
            <span class="text-white text-xs" style="opacity: 0.7">{{
              sub.label
            }}</span>
            <span class="ml-2 text-white font-bold">{{
              formatNumber(sub.value)
            }}</span>
          </div>
        </div>

        <!-- Badge -->
        <!-- <div v-if="card.badge" class="mt-4">
          <span 
            class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
            :class="card.badgeColor"
          >
            {{ card.badge }}
          </span>
        </div> -->

        <!-- Variation -->
        <div
          v-if="card.variation !== undefined"
          class="mt-4 pt-3"
          style="border-top: 1px solid rgba(255, 255, 255, 0.2)"
        >
          <div class="flex items-center justify-between">
            <span class="text-white text-xs" style="opacity: 0.7">{{
              card.variationLabel
            }}</span>
            <span
              class="flex items-center text-sm font-bold"
              :class="(card.variation ?? 0) >= 0 ? 'text-emerald-300' : 'text-rose-300'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="(card.variation ?? 0) >= 0"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              {{ Math.abs((card.variation ?? 0)) }}%
            </span>
          </div>
        </div>

        <!-- Urgent indicator -->
        <div
          v-if="card.urgent"
          class="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"
        ></div>

        <!-- Hover overlay -->
        <div
          class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style="background-color: rgba(255, 255, 255, 0.05)"
        ></div>
      <!-- </button> -->
    </NuxtLink>
  </div>
</template>

<style scoped>
.stat-card {
  padding: 1.25rem;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 160px;
}

.stat-card:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

@media (min-width: 1024px) {
  .stat-card {
    padding: 1.5rem;
  }
}
</style>
