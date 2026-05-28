<template>
  <div class="chart-card">
    <!-- Header -->
    <div class="chart-header">
      <h2 class="chart-title">Répartition des utilisateurs</h2>
      <span class="chart-total">{{ stats.users.total }} au total</span>
    </div>

    <!-- Body -->
    <div class="chart-body">
      <!-- SVG Donut -->
      <div class="donut-wrap">
        <svg class="donut-svg" style="transform:rotate(-90deg);" viewBox="0 0 36 36">
          <circle cx="18" cy="18" fill="none" r="15.915" stroke="#F3F4F6" stroke-width="4.5" />
          <circle
            v-for="seg in segments"
            :key="seg.color"
            cx="18" cy="18" fill="none" r="15.915"
            :stroke="seg.color"
            :stroke-dasharray="`${seg.pct} 100`"
            :stroke-dashoffset="`-${seg.offset}`"
            stroke-width="4.5"
          />
          <circle cx="18" cy="18" fill="white" r="11.5" />
        </svg>
        <!-- Center label (outside SVG, absolute) -->
        <div class="donut-center">
          <p class="donut-number">{{ stats.users.total }}</p>
          <p class="donut-label">utilisateurs</p>
        </div>
      </div>

      <!-- Legend with progress bars -->
      <div class="chart-legend">
        <div v-for="seg in segments" :key="seg.label" class="legend-row">
          <span class="legend-dot" :style="{ background: seg.color }"></span>
          <span class="legend-name">{{ seg.label }}</span>
          <span class="legend-count">{{ seg.count }}</span>
          <div class="legend-bar-track">
            <div class="legend-bar-fill" :style="{ width: seg.pct + '%', background: seg.color }"></div>
          </div>
          <span class="legend-pct">{{ seg.pct }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardData } from '~/types/dashboard'
import { computed } from 'vue'

const props = defineProps<{ stats: DashboardData }>()

const segments = computed(() => {
  const total = props.stats.users.total || 1
  const a = Math.round((props.stats.users.admin / total) * 100)
  const b = Math.round((props.stats.users.subAccounts / total) * 100)
  const c = Math.round((props.stats.users.withSubscription / total) * 100)
  const d = Math.max(0, 100 - a - b - c)

  return [
    { color: '#16A34A', label: 'Administrateurs',     count: props.stats.users.admin,           pct: a, offset: 0 },
    { color: '#F59E0B', label: 'Sous-comptes',        count: props.stats.users.subAccounts,      pct: b, offset: a },
    { color: '#3B82F6', label: 'Avec abonnement',     count: props.stats.users.withSubscription, pct: c, offset: a + b },
    { color: '#E5E7EB', label: 'Utilisateurs standard', count: Math.max(0, props.stats.users.total - props.stats.users.admin - props.stats.users.subAccounts), pct: d, offset: a + b + c },
  ]
})
</script>

<style scoped>
.chart-card {
  background: #FFFFFF;
  border: none;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.9),
    0 1px 2px rgba(0,0,0,0.05),
    0 3px 10px rgba(0,0,0,0.05),
    0 0 0 1px rgba(17,24,39,0.05);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #F3F4F6;
  background: rgba(249,250,251,0.6);
}

.chart-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #111827;
}

.chart-total {
  font-size: 12px;
  font-weight: 500;
  color: #9CA3AF;
}

.chart-body {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 28px 32px;
  flex-wrap: wrap;
}

/* Donut */
.donut-wrap {
  position: relative;
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.donut-svg {
  width: 100%;
  height: 100%;
}

.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.donut-number {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.04em;
  line-height: 1;
}

.donut-label {
  font-size: 10.5px;
  font-weight: 500;
  color: #9CA3AF;
  margin-top: 2px;
}

/* Legend */
.chart-legend {
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-name {
  font-size: 13px;
  color: #374151;
  flex: 1;
  white-space: nowrap;
}

.legend-count {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  min-width: 24px;
  text-align: right;
  tabular-nums: all;
}

.legend-bar-track {
  width: 80px;
  height: 5px;
  background: #F3F4F6;
  border-radius: 100px;
  overflow: hidden;
  flex-shrink: 0;
}

.legend-bar-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 0.5s ease;
}

.legend-pct {
  font-size: 11.5px;
  font-weight: 500;
  color: #9CA3AF;
  min-width: 30px;
  text-align: right;
}
</style>

