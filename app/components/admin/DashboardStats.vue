<script setup lang="ts">
import type { DashboardData } from '~/types/dashboard'

defineProps<{
  stats: DashboardData
  engagementRate: number
  conversionRate: number
  verificationRate: number
  contentDensity: string
  activeKpi?: string
}>()

defineEmits<{
  (e: 'select', kpi: string): void
}>()
</script>

<template>
  <!-- KPI Cards Grid — 3 colonnes, gap 24px -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

    <!-- ── Utilisateurs ── -->
    <div
      class="bg-white rounded-xl shadow-sm p-6 relative cursor-pointer hover:shadow-md transition-shadow"
      style="border-top: 4px solid #2D6A3E;"
      @click="$emit('select', 'users')"
    >
      <div class="flex justify-between items-start mb-4">
        <div>
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Utilisateurs</p>
          <p class="text-2xl font-bold text-gray-800 mt-1">
            {{ stats.users.total }}
            <span class="text-lg font-bold">au total</span>
          </p>
        </div>
        <div class="bg-green-50 p-2 rounded-full">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>
      <div class="flex gap-10">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase">Actifs</p>
          <p class="text-lg font-bold text-gray-800">
            {{ stats.users.active }}
            <span class="text-xs text-gray-400 font-medium ml-1">{{ engagementRate }}%</span>
          </p>
        </div>
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase">Vérifiés</p>
          <p class="text-lg font-bold text-gray-800">
            {{ stats.users.verified }}
            <span class="text-xs text-gray-400 font-medium ml-1">{{ verificationRate }}%</span>
          </p>
        </div>
      </div>
    </div>

    <!-- ── Abonnements ── -->
    <div
      class="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
      style="border-top: 4px solid #F5C467;"
      @click="$emit('select', 'subscriptions')"
    >
      <div class="flex justify-between items-start mb-4">
        <div>
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Abonnements</p>
          <p class="text-2xl font-bold text-gray-800 mt-1">
            {{ stats.users.withSubscription }}
            <span class="text-lg font-bold">actifs</span>
          </p>
        </div>
        <div class="bg-orange-50 p-2 rounded-full">
          <svg class="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      <div class="flex gap-10">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase">Premium</p>
          <p class="text-lg font-bold text-gray-800">
            {{ stats.users.withSubscription }}
            <span class="text-xs text-gray-400 font-medium ml-1">{{ conversionRate }}%</span>
          </p>
        </div>
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase">Gratuit</p>
          <p class="text-lg font-bold text-gray-800">
            {{ stats.users.total - stats.users.withSubscription }}
            <span class="text-xs text-gray-400 font-medium ml-1">{{ 100 - conversionRate }}%</span>
          </p>
        </div>
      </div>
    </div>

    <!-- ── Vérification ── -->
    <div
      class="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
      style="border-top: 4px solid #D9A173;"
      @click="$emit('select', 'verification')"
    >
      <div class="flex justify-between items-start mb-4">
        <div>
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vérification</p>
          <p class="text-2xl font-bold text-gray-800 mt-1">
            {{ stats.users.verified }}
            <span class="text-lg font-bold">certifiés</span>
          </p>
        </div>
        <div class="bg-amber-50 p-2 rounded-full">
          <svg class="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>
      <div class="flex gap-10">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase">Vérifiés</p>
          <p class="text-lg font-bold text-gray-800">
            {{ stats.users.verified }}
            <span class="text-xs text-gray-400 font-medium ml-1">{{ verificationRate }}%</span>
          </p>
        </div>
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase">En attente</p>
          <p class="text-lg font-bold text-gray-800">
            {{ stats.users.total - stats.users.verified }}
            <span class="text-xs text-gray-400 font-medium ml-1">{{ 100 - verificationRate }}%</span>
          </p>
        </div>
      </div>
    </div>

  </div>
</template>
