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
  if (kpi === 'subscriptions') query.status = 'premium'
  else if (kpi === 'verification') query.status = 'unverified'
  navigateTo({ path: '/admin/users', query })
}

onMounted(() => {
  dashboardStore.fetchDashboardData()
})
</script>

<template>
  <div class="p-8">

    <!-- Page title -->
    <h1 class="text-2xl font-bold text-gray-800 mb-8">Vue d'ensemble</h1>

    <!-- Loading state -->
    <div
      v-if="dashboardStore.isLoading && !dashboardStore.stats"
      class="flex flex-col items-center justify-center py-20"
    >
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div
          class="absolute inset-0 border-4 rounded-full border-t-transparent animate-spin"
          style="border-color: #2D6A3E transparent transparent transparent;"
        ></div>
      </div>
      <p class="mt-4 text-gray-500 font-medium">Récupération des données...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="dashboardStore.error"
      class="bg-red-50 border border-red-200 p-6 rounded-xl flex items-center gap-4 text-red-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 flex-shrink-0" viewBox="0 0 256 256">
        <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 56a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm8 104a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z" />
      </svg>
      <div>
        <p class="font-bold">Une erreur est survenue</p>
        <p class="text-sm opacity-90">{{ dashboardStore.error }}</p>
      </div>
    </div>

    <!-- Dashboard content -->
    <div v-else-if="dashboardStore.stats">

      <!-- KPI Cards (3 colonnes) -->
      <DashboardStats
        :stats="dashboardStore.stats"
        :engagement-rate="dashboardStore.engagementRate"
        :conversion-rate="dashboardStore.conversionRate"
        :verification-rate="dashboardStore.verificationRate"
        :content-density="dashboardStore.contentDensity"
        @select="handleKpiDetail"
      />

      <!-- Donut Chart -->
      <DashboardCharts :stats="dashboardStore.stats" />

      <!-- Activités Récentes -->
      <section class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Activités Récentes</h2>
        <div
          class="rounded-lg flex items-center justify-center"
          style="border: 2px dashed #f3f4f6; height: 128px;"
        >
          <p class="text-gray-400 text-sm">Aucune activité récente à afficher.</p>
        </div>
      </section>

    </div>
  </div>
</template>
