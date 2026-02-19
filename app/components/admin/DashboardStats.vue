<script setup lang="ts">
import type { DashboardData } from '~/types/dashboard'

defineProps<{
  stats: DashboardData,
  engagementRate: number,
  conversionRate: number,
  verificationRate: number,
  contentDensity: string,
  activeKpi?: string
}>()

defineEmits<{
  (e: 'select', kpi: string): void
}>()

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Utilisateurs (Engagement focus) -->
    <button 
      @click="$emit('select', 'users')"
      class="stat-card bg-gradient-to-br from-indigo-600 to-indigo-800 group text-left w-full h-full"
      :class="{ 'ring-4 ring-indigo-200 ring-offset-2': activeKpi === 'users' }"
    >
      <div class="flex justify-between items-start">
        <div>
          <p class="text-indigo-100 text-sm font-medium uppercase tracking-wider">Utilisateurs</p>
          <div class="flex items-baseline gap-2 mt-1">
            <h3 class="text-4xl font-extrabold text-white group-hover:scale-105 transition-transform origin-left duration-300 leading-none">
              {{ formatNumber(stats.users.total) }}
            </h3>
            <span class="text-indigo-200 text-xs font-medium">au total</span>
          </div>
        </div>
        <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-md group-hover:rotate-12 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 256 256"><path fill="currentColor" d="M117.33 144A10.67 10.67 0 0 1 128 154.67v42.66A10.67 10.67 0 1 1 106.67 197.33v-42.66A10.67 10.67 0 0 1 117.33 144Zm42.67 0a10.67 10.67 0 0 1 10.67 10.67v42.66a10.67 10.67 0 1 1-21.34 0v-42.66A10.67 10.67 0 0 1 160 144ZM240 128a112 112 0 1 1-224 0a112 112 0 0 1 224 0Zm-21.33 0a90.67 90.67 0 1 0-181.34 0a90.67 90.67 0 0 0 181.34 0Z"/></svg>
        </div>
      </div>

      <!-- Sous-stats détaillées -->
      <div class="grid grid-cols-2 gap-3 mt-6">
        <div class="bg-black/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
          <p class="text-indigo-200 text-[10px] uppercase font-bold tracking-widest">Actifs</p>
          <div class="flex items-end justify-between mt-1">
            <span class="text-xl font-bold text-white leading-none">{{ formatNumber(stats.users.active) }}</span>
            <span class="text-[10px] text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded-full font-bold">{{ engagementRate }}%</span>
          </div>
        </div>
        <div class="bg-black/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
          <p class="text-indigo-200 text-[10px] uppercase font-bold tracking-widest">Vérifiés</p>
          <div class="flex items-end justify-between mt-1">
            <span class="text-xl font-bold text-white leading-none">{{ formatNumber(stats.users.verified) }}</span>
            <span class="text-[10px] text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded-full font-bold">{{ verificationRate }}%</span>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-100/80">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Taux d'engagement
        </span>
        <span class="font-black text-white tracking-widest">{{ engagementRate }}%</span>
      </div>
    </button>

    <!-- Conversion & Business -->
    <button 
      @click="$emit('select', 'subscriptions')"
      class="stat-card bg-gradient-to-br from-emerald-600 to-emerald-800 group text-left w-full h-full"
      :class="{ 'ring-4 ring-emerald-200 ring-offset-2': activeKpi === 'subscriptions' }"
    >
      <div class="flex justify-between items-start">
        <div>
          <p class="text-emerald-100 text-sm font-medium uppercase tracking-wider">Abonnements</p>
          <div class="flex items-baseline gap-2 mt-1">
            <h3 class="text-4xl font-extrabold text-white group-hover:scale-105 transition-transform origin-left duration-300 leading-none">
              {{ formatNumber(stats.users.withSubscription) }}
            </h3>
            <span class="text-emerald-200 text-xs font-medium">actifs</span>
          </div>
        </div>
        <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-md group-hover:rotate-12 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 256 256"><path fill="currentColor" d="M224 48H32a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16Zm0 16v32H32V64h192ZM32 192v-80h192v80H32Z"/></svg>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 mt-6">
        <div class="bg-black/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
          <p class="text-emerald-200 text-[10px] uppercase font-bold tracking-widest">Premium</p>
          <div class="flex items-end justify-between mt-1">
            <span class="text-xl font-bold text-white leading-none">{{ formatNumber(stats.users.withSubscription) }}</span>
            <span class="text-[10px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold">{{ conversionRate }}%</span>
          </div>
        </div>
        <div class="bg-black/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
          <p class="text-emerald-200 text-[10px] uppercase font-bold tracking-widest">Gratuit</p>
          <div class="flex items-end justify-between mt-1">
            <span class="text-xl font-bold text-white leading-none">{{ formatNumber(stats.users.total - stats.users.withSubscription) }}</span>
            <span class="text-[10px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold">{{ 100 - conversionRate }}%</span>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-100/80">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Taux de conversion
        </span>
        <span class="font-black text-white tracking-widest">{{ conversionRate }}%</span>
      </div>
    </button>

    <!-- Rétention (Trust focus) -->
    <button 
      @click="$emit('select', 'verification')"
      class="stat-card bg-gradient-to-br from-rose-600 to-rose-800 group text-left w-full h-full"
      :class="{ 'ring-4 ring-rose-200 ring-offset-2': activeKpi === 'verification' }"
    >
      <div class="flex justify-between items-start">
        <div>
          <p class="text-rose-100 text-sm font-medium uppercase tracking-wider">Vérification</p>
          <div class="flex items-baseline gap-2 mt-1">
            <h3 class="text-4xl font-extrabold text-white group-hover:scale-105 transition-transform origin-left duration-300 leading-none">
              {{ formatNumber(stats.users.verified) }}
            </h3>
            <span class="text-rose-200 text-xs font-medium">certifiés</span>
          </div>
        </div>
        <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-md group-hover:rotate-12 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 256 256"><path fill="currentColor" d="M208 24H72a16 16 0 0 0-16 16v16H48a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h136a16 16 0 0 0 16-16v-16h8a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16ZM184 216H48V72h136v144Zm24-40h-8V56H72V40h136v136Z"/></svg>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 mt-6">
        <div class="bg-black/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
          <p class="text-rose-200 text-[10px] uppercase font-bold tracking-widest">Vérifiés</p>
          <div class="flex items-end justify-between mt-1">
            <span class="text-xl font-bold text-white leading-none">{{ formatNumber(stats.users.verified) }}</span>
            <span class="text-[10px] text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded-full font-bold">{{ verificationRate }}%</span>
          </div>
        </div>
        <div class="bg-black/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
          <p class="text-rose-200 text-[10px] uppercase font-bold tracking-widest">En attente</p>
          <div class="flex items-end justify-between mt-1">
            <span class="text-xl font-bold text-white leading-none">{{ formatNumber(stats.users.total - stats.users.verified) }}</span>
            <span class="text-[10px] text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded-full font-bold">{{ 100 - verificationRate }}%</span>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-rose-100/80">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Taux de confiance
        </span>
        <span class="font-black text-white tracking-widest">{{ verificationRate }}%</span>
      </div>
    </button>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.stat-card {
  @apply p-6 rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-white/10 relative overflow-hidden;
}

.stat-card::after {
  content: '';
  @apply absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 pointer-events-none;
}

.stat-card:hover::after {
  @apply opacity-100;
}
</style>

<style scoped>
@reference "~/assets/css/main.css";

.stat-card {
  @apply p-6 rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-white/10;
}
</style>
