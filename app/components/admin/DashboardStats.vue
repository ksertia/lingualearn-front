<script setup lang="ts">
import type { DashboardData } from '~/types/dashboard'

defineProps<{
  stats: DashboardData
}>()

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div class="stat-card bg-gradient-to-br from-indigo-500 to-purple-600">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-indigo-100 text-sm font-medium">Total Utilisateurs</p>
          <h3 class="text-3xl font-bold text-white mt-1">{{ formatNumber(stats.users.total) }}</h3>
        </div>
        <div class="p-3 bg-white/20 rounded-xl backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 256 256"><path fill="currentColor" d="M117.33 144A10.67 10.67 0 0 1 128 154.67v42.66A10.67 10.67 0 1 1 106.67 197.33v-42.66A10.67 10.67 0 0 1 117.33 144Zm42.67 0a10.67 10.67 0 0 1 10.67 10.67v42.66a10.67 10.67 0 1 1-21.34 0v-42.66A10.67 10.67 0 0 1 160 144ZM240 128a112 112 0 1 1-224 0a112 112 0 0 1 224 0Zm-21.33 0a90.67 90.67 0 1 0-181.34 0a90.67 90.67 0 0 0 181.34 0Z"/></svg>
        </div>
      </div>
      <div class="mt-4 flex items-center gap-4 text-xs text-indigo-100">
        <span>Active: {{ stats.users.active }}</span>
        <span class="w-1 h-1 bg-white/40 rounded-full"></span>
        <span>Verified: {{ stats.users.verified }}</span>
      </div>
    </div>

    <div class="stat-card bg-gradient-to-br from-emerald-500 to-teal-600">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-emerald-100 text-sm font-medium">Parcours d'apprentissage</p>
          <h3 class="text-3xl font-bold text-white mt-1">{{ formatNumber(stats.learningPaths) }}</h3>
        </div>
        <div class="p-3 bg-white/20 rounded-xl backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 256 256"><path fill="currentColor" d="M224 48H32a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16Zm0 16v32H32V64h192ZM32 192v-80h192v80H32Z"/></svg>
        </div>
      </div>
      <p class="mt-4 text-xs text-emerald-100">Disponibles pour les étudiants</p>
    </div>

    <div class="stat-card bg-gradient-to-br from-blue-500 to-cyan-600">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-blue-100 text-sm font-medium">Niveaux & Etapes</p>
          <h3 class="text-3xl font-bold text-white mt-1">{{ stats.levels }} / {{ stats.steps }}</h3>
        </div>
        <div class="p-3 bg-white/20 rounded-xl backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 256 256"><path fill="currentColor" d="M232 208a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8v-32a8 8 0 0 1 8-16h48v-24a8 8 0 0 1 8-8h48v-24a8 8 0 0 1 8-8h48v-24a8 8 0 0 1 16 0v104h24a8 8 0 0 1 8 8Z"/></svg>
        </div>
      </div>
      <p class="mt-4 text-xs text-blue-100">{{ stats.steps }} étapes au total</p>
    </div>

    <div class="stat-card bg-gradient-to-br from-orange-500 to-pink-600">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-orange-100 text-sm font-medium">Leçons & Exercices</p>
          <h3 class="text-3xl font-bold text-white mt-1">{{ stats.lessons }} / {{ stats.exercises }}</h3>
        </div>
        <div class="p-3 bg-white/20 rounded-xl backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 256 256"><path fill="currentColor" d="M208 24H72a16 16 0 0 0-16 16v16H48a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h136a16 16 0 0 0 16-16v-16h8a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16ZM184 216H48V72h136v144Zm24-40h-8V56H72V40h136v136Z"/></svg>
        </div>
      </div>
      <p class="mt-4 text-xs text-orange-100">{{ stats.stepQuizzes }} Quiz de validation</p>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.stat-card {
  @apply p-6 rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-white/10;
}
</style>
