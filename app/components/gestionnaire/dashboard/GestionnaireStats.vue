<script setup lang="ts">
import { useGestionnaireDashboardStore } from '~/stores/gestionnaireDashboardStore'

defineProps<{ activeKpi?: string }>()
defineEmits<{ (e: 'select', kpi: string): void }>()

const store = useGestionnaireDashboardStore()
const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

const trainersRate = computed(() => {
  const total = store.trainersTotal
  const active = store.stats?.trainers?.active ?? 0
  return total > 0 ? Math.min(Math.round((active / total) * 100), 100) : 0
})

const langRate = computed(() => {
  const total = store.totalLanguages || 0
  const active = store.activeLanguages || 0
  return total > 0 ? Math.min(Math.round((active / total) * 100), 100) : 0
})
</script>

<template>
  <div class="sg">

    <!-- ── Formateurs ── -->
    <NuxtLink to="/gestionnaire/formateurs" class="sk sk--blue" :class="{'sk--on': activeKpi === 'trainers'}">
      <div class="sk-top">
        <div class="sk-icon sk-icon--blue">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span class="sk-label">Formateurs</span>
        <svg class="sk-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div class="sk-value">{{ fmt(store.trainersTotal) }}</div>

      <div class="sk-meta">
        <span class="sk-dot sk-dot--blue"></span>
        <span>{{ fmt(store.stats?.trainers?.active ?? 0) }} actifs &middot; {{ trainersRate }}%</span>
      </div>

      <div class="sk-track">
        <div class="sk-fill sk-fill--blue" :style="{ width: trainersRate + '%' }"></div>
      </div>
    </NuxtLink>

    <!-- ── Langues ── -->
    <NuxtLink to="/gestionnaire" class="sk sk--green" :class="{'sk--on': activeKpi === 'languages'}">
      <div class="sk-top">
        <div class="sk-icon sk-icon--green">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        </div>
        <span class="sk-label">Langues</span>
        <svg class="sk-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div class="sk-value">{{ fmt(store.totalLanguages || 0) }}</div>

      <div class="sk-meta">
        <span class="sk-dot sk-dot--green"></span>
        <span>{{ fmt(store.activeLanguages || 0) }} activées &middot; {{ langRate }}%</span>
      </div>

      <div class="sk-track">
        <div class="sk-fill sk-fill--green" :style="{ width: langRate + '%' }"></div>
      </div>
    </NuxtLink>

    <!-- ── Contenus ── -->
    <NuxtLink to="/gestionnaire/contenus" class="sk sk--orange" :class="{'sk--on': activeKpi === 'contents'}">
      <div class="sk-top">
        <div class="sk-icon sk-icon--orange">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span class="sk-label">Contenus</span>
        <svg class="sk-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div class="sk-value">{{ fmt((store.totalModules || 0) + (store.totalParcours || 0) + (store.totalEtapes || 0)) }}</div>

      <div class="sk-breakdown">
        <div class="sk-break-item">
          <span class="sk-break-val">{{ fmt(store.totalModules || 0) }}</span>
          <span class="sk-break-label">Modules</span>
        </div>
        <div class="sk-break-sep"></div>
        <div class="sk-break-item">
          <span class="sk-break-val">{{ fmt(store.totalParcours || 0) }}</span>
          <span class="sk-break-label">Parcours</span>
        </div>
        <div class="sk-break-sep"></div>
        <div class="sk-break-item">
          <span class="sk-break-val">{{ fmt(store.totalEtapes || 0) }}</span>
          <span class="sk-break-label">Étapes</span>
        </div>
      </div>

      <div class="sk-track sk-track--ghost">
        <div class="sk-fill sk-fill--orange" style="width: 100%"></div>
      </div>
    </NuxtLink>

  </div>
</template>

<style scoped>
.sg {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* ── Card base ── */
.sk {
  position: relative;
  background: #FFFFFF;
  border-radius: 14px;
  padding: 0;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  transition: box-shadow 0.22s ease, transform 0.22s ease;
  cursor: pointer;
}

.sk:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.07);
}

.sk--on {
  box-shadow: 0 0 0 2px #16A34A, 0 4px 12px rgba(22,163,74,0.12) !important;
}

/* Card body */
.sk-top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 22px 22px 0;
}

.sk-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.sk-icon--blue   { background: linear-gradient(135deg, rgba(59,130,246,0.16), rgba(59,130,246,0.07)); color: #2563EB; }
.sk-icon--green  { background: linear-gradient(135deg, rgba(22,163,74,0.16),  rgba(22,163,74,0.07));  color: #15803D; }
.sk-icon--orange { background: linear-gradient(135deg, rgba(249,115,22,0.16), rgba(249,115,22,0.07)); color: #EA580C; }

.sk-label {
  flex: 1;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #9CA3AF;
}

.sk-arrow {
  width: 14px; height: 14px;
  color: #D1D5DB;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.15s, transform 0.15s;
}
.sk:hover .sk-arrow { opacity: 1; transform: translateX(0); }

.sk-value {
  font-size: 40px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.05em;
  line-height: 1;
  padding: 14px 22px 10px;
}

/* Meta row */
.sk-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6B7280;
  font-weight: 500;
  padding: 0 22px 18px;
}

.sk-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.sk-dot--blue  { background: #3B82F6; }
.sk-dot--green { background: #16A34A; }

/* Breakdown */
.sk-breakdown {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 22px 18px;
}

.sk-break-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.sk-break-val {
  font-size: 16px;
  font-weight: 700;
  color: #374151;
  letter-spacing: -0.02em;
}

.sk-break-label {
  font-size: 10.5px;
  color: #9CA3AF;
  font-weight: 500;
}

.sk-break-sep {
  width: 1px;
  height: 28px;
  background: #F3F4F6;
  flex-shrink: 0;
  margin: 0 16px;
}

/* Progress track */
.sk-track {
  height: 4px;
  background: #F1F5F9;
  margin-top: auto;
}

.sk-track--ghost { opacity: 0.35; }

.sk-fill {
  height: 100%;
  border-radius: 0 2px 2px 0;
  transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  max-width: 100%;
}

.sk-fill--blue   { background: linear-gradient(90deg, #1D4ED8, #60A5FA); }
.sk-fill--green  { background: linear-gradient(90deg, #15803D, #4ade80); }
.sk-fill--orange { background: linear-gradient(90deg, #C2410C, #FB923C); }
</style>
