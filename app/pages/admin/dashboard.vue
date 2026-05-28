<script setup lang="ts">
import { useDashboardStore } from '~/stores/dashboardStore'
import DashboardStats from '~/components/admin/DashboardStats.vue'
import DashboardCharts from '~/components/admin/DashboardCharts.vue'

definePageMeta({ layout: 'admin' })

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

const today = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
</script>

<template>
  <div class="page-root">

    <!-- Page header -->
    <div class="page-hero">
      <div>
        <h1 class="page-heading">Vue d'ensemble</h1>
        <p class="page-subheading">{{ today }}</p>
      </div>
      <button class="btn-refresh" @click="dashboardStore.fetchDashboardData()">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualiser
      </button>
    </div>

    <!-- Loading -->
    <div v-if="dashboardStore.isLoading && !dashboardStore.stats" class="state-loading">
      <div class="spinner"></div>
      <p class="state-text">Chargement des données…</p>
    </div>

    <!-- Error -->
    <div v-else-if="dashboardStore.error" class="state-error">
      <svg class="state-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <p class="state-error-title">Erreur de chargement</p>
        <p class="state-error-msg">{{ dashboardStore.error }}</p>
      </div>
    </div>

    <!-- Dashboard content -->
    <div v-else-if="dashboardStore.stats">
      <DashboardStats
        :stats="dashboardStore.stats"
        :engagement-rate="dashboardStore.engagementRate"
        :conversion-rate="dashboardStore.conversionRate"
        :verification-rate="dashboardStore.verificationRate"
        @select="handleKpiDetail"
      />

      <DashboardCharts :stats="dashboardStore.stats" />

      <!-- Recent activity -->
      <div class="activity-card">
        <div class="activity-header">
          <h2 class="activity-title">Activité récente</h2>
          <span class="activity-badge">Bientôt disponible</span>
        </div>
        <div class="activity-empty">
          <div class="activity-icon-wrap">
            <svg class="w-5 h-5" style="color:#D1D5DB;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="activity-empty-title">Aucune activité récente</p>
          <p class="activity-empty-sub">Les actions des utilisateurs apparaîtront ici</p>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page-root {
  padding: 32px;
}

.page-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.page-heading {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.03em;
}

.page-subheading {
  font-size: 13px;
  color: #9CA3AF;
  margin-top: 3px;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  background: #16A34A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(22,163,74,.3);
  transition: all 0.15s;
}

.btn-refresh:hover {
  background: #15803D;
  box-shadow: 0 3px 8px rgba(22,163,74,.35);
}

/* States */
.state-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 12px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid #E5E7EB;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.state-text {
  font-size: 13px;
  color: #9CA3AF;
}

.state-error {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 10px;
  color: #DC2626;
  margin-bottom: 20px;
}

.state-error-icon { width: 20px; height: 20px; flex-shrink: 0; }
.state-error-title { font-size: 13px; font-weight: 600; }
.state-error-msg { font-size: 12px; margin-top: 2px; opacity: 0.8; }

/* Activity card */
.activity-card {
  background: #FFFFFF;
  border: none;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #F3F4F6;
}

.activity-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #111827;
}

.activity-badge {
  font-size: 11.5px;
  font-weight: 500;
  color: #9CA3AF;
  background: #F3F4F6;
  border-radius: 100px;
  padding: 3px 10px;
}

.activity-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 6px;
}

.activity-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #F9FAFB;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.activity-empty-title {
  font-size: 13.5px;
  font-weight: 500;
  color: #6B7280;
}

.activity-empty-sub {
  font-size: 12px;
  color: #9CA3AF;
}
</style>
