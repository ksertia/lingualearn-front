<script setup lang="ts">
import { useDashboardStore } from '~/stores/dashboardStore'
import DashboardStats from '~/components/admin/DashboardStats.vue'
import DashboardCharts from '~/components/admin/DashboardCharts.vue'

definePageMeta({
  layout: 'admin'
})

const dashboardStore = useDashboardStore()

const handleKpiDetail = (kpi: string) => {
  const query: Record<string, string> = {}
  
  if (kpi === 'users') {
    // Par défaut, voir tous les utilisateurs
  } else if (kpi === 'subscriptions') {
    query.status = 'premium'
  } else if (kpi === 'verification') {
    query.status = 'unverified'
  }

  navigateTo({
    path: '/admin/users',
    query
  })
}

onMounted(() => {
  dashboardStore.fetchDashboardData()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Vue d'ensemble</h1>
          <p class="text-slate-500 mt-1">Gérez et suivez les performances de la plateforme LinguaLearn.</p>
        </div>
        <button 
          @click="dashboardStore.fetchDashboardData()" 
          class="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          :disabled="dashboardStore.isLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" :class="{ 'animate-spin': dashboardStore.isLoading }" class="w-4 h-4 text-slate-500" viewBox="0 0 256 256"><path fill="currentColor" d="M224 128a96 96 0 0 1-96 96A96 96 0 0 1 32 128A96 96 0 0 1 128 32a96 96 0 0 1 96 96Zm-16 0a80 80 0 1 0-80 80a80 80 0 0 0 80-80Z"/></svg>
          Actualiser
        </button>
      </header>

      <div v-if="dashboardStore.isLoading && !dashboardStore.stats" class="flex flex-col items-center justify-center py-20">
        <div class="relative w-20 h-20">
          <div class="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-4 text-slate-500 font-medium">Récupération des données...</p>
      </div>

      <div v-else-if="dashboardStore.error" class="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center gap-4 text-red-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 flex-shrink-0" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 56a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm8 104a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"/></svg>
        <div>
          <p class="font-bold">Une erreur est survenue</p>
          <p class="text-sm opacity-90">{{ dashboardStore.error }}</p>
        </div>
      </div>

      <div v-else-if="dashboardStore.stats" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DashboardStats 
          :stats="dashboardStore.stats"
          :engagement-rate="dashboardStore.engagementRate"
          :conversion-rate="dashboardStore.conversionRate"
          :verification-rate="dashboardStore.verificationRate"
          :content-density="dashboardStore.contentDensity"
          @select="handleKpiDetail"
        />

        <DashboardCharts :stats="dashboardStore.stats" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.detail-item {
  @apply p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col;
}

.detail-label {
  @apply text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1;
}

.detail-value {
  @apply text-2xl font-bold;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  @apply bg-transparent;
}
::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full hover:bg-slate-300;
}
</style>