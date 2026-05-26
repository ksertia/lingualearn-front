<script setup lang="ts">
import type { DashboardData } from '~/types/dashboard'
import { computed } from 'vue'

const props = defineProps<{
  stats: DashboardData
}>()

/*
  SVG Donut trick:
  - viewBox "0 0 36 36", center (18,18), r=15.915
  - Circumference = 2π × 15.915 ≈ 100  → percentages map directly
  - stroke-dasharray="${pct} 100"  (gap=100 covers full circumference)
  - stroke-dashoffset="-${cumulativeOffset}"  (shifts start past prev segments)
  - SVG rotated -90deg so segments start at 12 o'clock
*/
const segments = computed(() => {
  const total = props.stats.users.total || 1
  const a = Math.round((props.stats.users.admin / total) * 100)
  const b = Math.round((props.stats.users.subAccounts / total) * 100)
  const c = Math.round((props.stats.users.withSubscription / total) * 100)
  const d = 100 - a - b - c

  return [
    { color: '#1B5E20', label: 'Admin',            pct: a, offset: 0 },
    { color: '#EF6C00', label: 'Sous-comptes',     pct: b, offset: a },
    { color: '#FBC02D', label: 'Avec Abonnement',  pct: c, offset: a + b },
    { color: '#D32F2F', label: 'Utilisateurs',     pct: d, offset: a + b + c },
  ]
})
</script>

<template>
  <!-- ── Donut Chart Section ── -->
  <section class="bg-white rounded-xl shadow-sm p-6 mb-8">
    <h2 class="text-lg font-bold text-gray-800 mb-6">Répartition Utilisateurs</h2>
    <div class="flex flex-col items-center">

      <!-- SVG Donut — 256×256, rotated -90deg so 12 o'clock is start -->
      <div class="relative mb-10" style="width: 256px; height: 256px;">
        <svg
          class="w-full h-full"
          style="transform: rotate(-90deg);"
          viewBox="0 0 36 36"
        >
          <!-- Background track -->
          <circle cx="18" cy="18" fill="none" r="15.915" stroke="#eee" stroke-width="6" />

          <!-- Coloured segments -->
          <circle
            v-for="seg in segments"
            :key="seg.color"
            cx="18"
            cy="18"
            fill="none"
            r="15.915"
            :stroke="seg.color"
            :stroke-dasharray="`${seg.pct} 100`"
            :stroke-dashoffset="`${-seg.offset}`"
            stroke-width="6"
          />

          <!-- Centre hole -->
          <circle cx="18" cy="18" fill="white" r="10" />
        </svg>
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap justify-center gap-6">
        <div
          v-for="seg in segments"
          :key="seg.label"
          class="flex items-center gap-2"
        >
          <span
            class="w-3 h-3 rounded"
            :style="{ background: seg.color }"
          ></span>
          <span class="text-xs font-semibold text-gray-600">{{ seg.label }}</span>
        </div>
      </div>

    </div>
  </section>
</template>
