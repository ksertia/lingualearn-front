<template>
  <div class="stats-grid">

    <!-- ── Utilisateurs ── -->
    <button class="kpi-card" @click="$emit('select', 'users')">
      <div class="kpi-card__body">
        <div class="kpi-card__text">
          <p class="kpi-card__label">Utilisateurs</p>
          <p class="kpi-card__value">{{ stats.users.total }}</p>
          <div class="kpi-card__meta">
            <span class="kpi-dot" style="background:#16A34A;"></span>
            <span>{{ stats.users.active }} actifs &middot; {{ engagementRate }}%</span>
          </div>
        </div>
        <div class="kpi-card__icon kpi-card__icon--green">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>
      <div class="kpi-card__track">
        <div class="kpi-card__fill kpi-card__fill--green" :style="{ width: engagementRate + '%' }"></div>
      </div>
    </button>

    <!-- ── Abonnements ── -->
    <button class="kpi-card" @click="$emit('select', 'subscriptions')">
      <div class="kpi-card__body">
        <div class="kpi-card__text">
          <p class="kpi-card__label">Abonnements</p>
          <p class="kpi-card__value">{{ stats.users.withSubscription }}</p>
          <div class="kpi-card__meta">
            <span class="kpi-dot" style="background:#F59E0B;"></span>
            <span>{{ conversionRate }}% de conversion</span>
          </div>
        </div>
        <div class="kpi-card__icon kpi-card__icon--amber">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      <div class="kpi-card__track">
        <div class="kpi-card__fill kpi-card__fill--amber" :style="{ width: conversionRate + '%' }"></div>
      </div>
    </button>

    <!-- ── Vérification ── -->
    <button class="kpi-card" @click="$emit('select', 'verification')">
      <div class="kpi-card__body">
        <div class="kpi-card__text">
          <p class="kpi-card__label">Vérification</p>
          <p class="kpi-card__value">{{ stats.users.verified }}</p>
          <div class="kpi-card__meta">
            <span class="kpi-dot" style="background:#3B82F6;"></span>
            <span>{{ stats.users.total - stats.users.verified }} en attente</span>
          </div>
        </div>
        <div class="kpi-card__icon kpi-card__icon--blue">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </div>
      <div class="kpi-card__track">
        <div class="kpi-card__fill kpi-card__fill--blue" :style="{ width: verificationRate + '%' }"></div>
      </div>
    </button>

  </div>
</template>

<script setup lang="ts">
import type { DashboardData } from '~/types/dashboard'

defineProps<{
  stats: DashboardData
  engagementRate: number
  conversionRate: number
  verificationRate: number
  activeKpi?: string
}>()

defineEmits<{ (e: 'select', kpi: string): void }>()
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

@media (max-width: 900px) {
  .stats-grid { grid-template-columns: 1fr; }
}

/* ── Card base ────────────────────────────
   Depth system:
   - inset top highlight  → physical "rim light"
   - close edge shadow    → card boundary
   - medium lift shadow   → card elevation
   - ring shadow          → replaces explicit border
──────────────────────────────────────── */
.kpi-card {
  background: #FFFFFF;
  border: none;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  padding: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  transition: box-shadow 0.22s cubic-bezier(0.4,0,0.2,1), transform 0.22s cubic-bezier(0.4,0,0.2,1);
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.07);
}

.kpi-card:active {
  transform: translateY(-1px);
  transition-duration: 0.1s;
}

/* ── Card body ────────────────────────── */
.kpi-card__body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 24px 24px 18px;
}

.kpi-card__text { flex: 1; min-width: 0; }

.kpi-card__label {
  font-size: 11px;
  font-weight: 700;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}

.kpi-card__value {
  font-size: 38px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
  letter-spacing: -0.05em;
  margin-bottom: 12px;
}

.kpi-card__meta {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #6B7280;
  font-weight: 500;
}

.kpi-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── Icon containers — gradient backgrounds ──
   Each uses 2-stop gradient for depth
──────────────────────────────────────────── */
.kpi-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* Icon shadow for float effect */
  box-shadow: 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4);
}

.kpi-card__icon--green {
  background: linear-gradient(135deg, rgba(22,163,74,0.18) 0%, rgba(16,185,129,0.07) 100%);
  color: #16A34A;
}

.kpi-card__icon--amber {
  background: linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(251,191,36,0.07) 100%);
  color: #D97706;
}

.kpi-card__icon--blue {
  background: linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(99,102,241,0.07) 100%);
  color: #2563EB;
}

/* ── Progress bar ─────────────────────────
   4px thick, gradient fill for life
──────────────────────────────────────── */
.kpi-card__track {
  height: 4px;
  background: #F1F5F9;
}

.kpi-card__fill {
  height: 100%;
  border-radius: 0 2px 2px 0;
  transition: width 0.7s cubic-bezier(0.4,0,0.2,1);
  max-width: 100%;
}

/* Gradient fills — brighter at right end */
.kpi-card__fill--green {
  background: linear-gradient(90deg, #15803D 0%, #4ade80 100%);
}

.kpi-card__fill--amber {
  background: linear-gradient(90deg, #D97706 0%, #FCD34D 100%);
}

.kpi-card__fill--blue {
  background: linear-gradient(90deg, #1D4ED8 0%, #60A5FA 100%);
}
</style>
