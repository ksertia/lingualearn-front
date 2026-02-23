<script setup lang="ts">
import { useGestionnaireDashboardStore } from '~/stores/gestionnaireDashboardStore'
import GestionnaireStats from '~/components/gestionnaire/dashboard/GestionnaireStats.vue'
import GestionnaireCharts from '~/components/gestionnaire/dashboard/GestionnaireCharts.vue'

definePageMeta({
  layout: 'gestionnaire'
})

const store = useGestionnaireDashboardStore()

const handleKpiDetail = (kpi: string) => {
  console.log('KPI clicked:', kpi)
  // Navigation vers les pages détaillées (à implémenter)
}

onMounted(() => {
  store.fetchDashboardData()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50/50">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p class="text-slate-500 mt-1">Vue d'ensemble de la plateforme LinguaLearn</p>
        </div>
        <button 
          @click="store.fetchDashboardData()" 
          class="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          :disabled="store.isLoading"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            :class="{ 'animate-spin': store.isLoading }" 
            class="w-4 h-4 text-slate-500" 
            viewBox="0 0 256 256"
          >
            <path fill="currentColor" d="M224 128a96 96 0 0 1-96 96A96 96 0 0 1 32 128A96 96 0 0 1 128 32a96 96 0 0 1 96 96Zm-16 0a80 80 0 1 0-80 80a80 80 0 0 0 80-80Z"/>
          </svg>
          Actualiser
        </button>
      </header>

      <!-- Loading State -->
      <div v-if="store.isLoading && !store.stats" class="flex flex-col items-center justify-center py-20">
        <div class="relative w-20 h-20">
          <div class="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-4 text-slate-500 font-medium">Récupération des données...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center gap-4 text-red-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 flex-shrink-0" viewBox="0 0 256 256">
          <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 56a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm8 104a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"/>
        </svg>
        <div>
          <p class="font-bold">Une erreur est survenue</p>
          <p class="text-sm opacity-90">{{ store.error }}</p>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else-if="store.stats" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <!-- Main Stats Cards -->
        <section>
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Indicateurs clés</h2>
          <GestionnaireStats @select="handleKpiDetail" />
        </section>

        <!-- Strategic Indicators Section -->
        <section class="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-blue-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-slate-800">Indicateurs stratégiques</h2>
              <p class="text-sm text-slate-500">Statistiques avancées et analyses</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Most Active Language -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-indigo-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-600">Langue la plus active</span>
              </div>
              <p class="text-xl font-bold text-slate-900">{{ store.mostActiveLanguage }}</p>
            </div>

            <!-- Most Active Level -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-emerald-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-600">Niveau le plus actif</span>
              </div>
              <p class="text-xl font-bold text-slate-900">{{ store.mostActiveLevel }}</p>
            </div>

            <!-- Most Productive Trainer -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-amber-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-600">Formateur le plus productif</span>
              </div>
              <p class="text-xl font-bold text-slate-900">{{ store.mostProductiveTrainer }}</p>
            </div>

            <!-- Publications Last 7 Days -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-rose-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-600">Publications (7 jours)</span>
              </div>
              <p class="text-xl font-bold text-slate-900">{{ store.publicationsLast7Days }} cours</p>
            </div>
          </div>
        </section>

        <!-- Charts Section -->
        <section v-if="store.publicationsLast30Days.length > 0">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Visualisations</h2>
          <GestionnaireCharts />
        </section>

        <!-- Quick Actions / Alerts Section -->
        <section v-if="store.reportsPending > 0" class="bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-orange-100 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-orange-900">Alerte</h2>
              <p class="text-sm text-orange-700">Action requise</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between bg-white rounded-xl p-4 border border-orange-100">
            <div>
              <p class="font-medium text-slate-800">Signalements en attente</p>
              <p class="text-sm text-slate-500">{{ store.reportsPending }} signalement(s) nécessitent votre attention</p>
            </div>
            <NuxtLink 
              to="/gestionnaire/reports" 
              class="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Voir les signalements
            </NuxtLink>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}
</style>

