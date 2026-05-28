<script setup lang="ts">
import { useGestionnaireDashboardStore } from '~/stores/gestionnaireDashboardStore'
import GestionnaireStats from '~/components/gestionnaire/dashboard/GestionnaireStats.vue'
import GestionnaireCharts from '~/components/gestionnaire/dashboard/GestionnaireCharts.vue'

definePageMeta({ layout: 'gestionnaire' })

const store = useGestionnaireDashboardStore()

onMounted(() => store.fetchDashboardData())

const today = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
})
</script>

<template>
  <div class="page-root">

    <!-- Header -->
    <div class="page-hero">
      <div>
        <h1 class="page-heading">Vue d'ensemble</h1>
        <p class="page-sub">{{ today }}</p>
      </div>
      <button
        class="btn-refresh"
        :disabled="store.isLoading"
        @click="store.fetchDashboardData()"
      >
        <svg
          class="w-3.5 h-3.5"
          :class="{ 'animate-spin': store.isLoading }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualiser
      </button>
    </div>

    <!-- Loading -->
    <div v-if="store.isLoading && !store.stats" class="state-center">
      <div class="spinner"></div>
      <p class="state-text">Chargement des données…</p>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="state-error">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <p class="font-semibold text-sm">Erreur de chargement</p>
        <p class="text-xs mt-0.5 opacity-80">{{ store.error }}</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="store.stats" class="page-content">

      <!-- KPI cards -->
      <GestionnaireStats />

      <!-- Charts -->
      <div v-if="store.publicationsLast30Days.length > 0" class="charts-card">
        <div class="charts-header">
          <h2 class="charts-title">Activité récente</h2>
          <span class="charts-badge">30 derniers jours</span>
        </div>
        <GestionnaireCharts />
      </div>

    </div>

  </div>
</template>

<style scoped>
.page-root { padding: 32px; }

.page-hero {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 28px;
}

.page-heading {
  font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.03em;
}

.page-sub { font-size: 13px; color: #9CA3AF; margin-top: 3px; }

.btn-refresh {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 14px;
  background: #16A34A; color: white;
  border: none; border-radius: 8px;
  font-size: 13px; font-weight: 500; cursor: pointer;
  box-shadow: 0 1px 3px rgba(22,163,74,.3);
  transition: all 0.15s;
}
.btn-refresh:hover { background: #15803D; }
.btn-refresh:disabled { opacity: 0.6; cursor: not-allowed; }

.state-center {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 80px 0; gap: 12px;
}

.spinner {
  width: 28px; height: 28px;
  border: 2.5px solid #E5E7EB;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.state-text { font-size: 13px; color: #9CA3AF; }

.state-error {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 16px 20px;
  background: #FEF2F2; border: 1px solid #FECACA;
  border-radius: 10px; color: #DC2626; margin-bottom: 20px;
}

.page-content { display: flex; flex-direction: column; gap: 24px; }

/* Charts card */
.charts-card {
  background: #FFFFFF;
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
}

.charts-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 24px; border-bottom: 1px solid #F3F4F6;
}

.charts-title { font-size: 13.5px; font-weight: 600; color: #111827; }

.charts-badge {
  font-size: 11.5px; font-weight: 500; color: #9CA3AF;
  background: #F3F4F6; border-radius: 100px; padding: 3px 10px;
}
</style>
