<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'
import type { DashboardData } from '~/types/dashboard'
import { computed } from 'vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

const props = defineProps<{
  stats: DashboardData
}>()

const userChartData = computed(() => ({
  labels: ['Admin', 'Sous-comptes', 'Avec Abonnement', 'Utilisateurs'],
  datasets: [
    {
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#0bf59e'],
      data: [props.stats.users.admin, props.stats.users.subAccounts, props.stats.users.withSubscription, props.stats.users.user]
    }
  ]
}))

const userChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: 'Inter',
          size: 12
        }
      }
    }
  }
}

const contentChartData = computed(() => ({
  labels: ['Leçons', 'Exercices', 'Quiz'],
  datasets: [
    {
      label: 'Volume de contenu',
      backgroundColor: '#3b82f6',
      borderRadius: 8,
      data: [props.stats.lessons, props.stats.exercises, props.stats.stepQuizzes]
    }
  ]
}))

const contentChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
    <!-- User Segments Chart -->
    <div class="chart-container">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-slate-800">Répartition Utilisateurs</h3>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-400" viewBox="0 0 256 256"><path fill="currentColor" d="M117.33 144A10.67 10.67 0 0 1 128 154.67v42.66A10.67 10.67 0 1 1 106.67 197.33v-42.66A10.67 10.67 0 0 1 117.33 144Zm42.67 0a10.67 10.67 0 0 1 10.67 10.67v42.66a10.67 10.67 0 1 1-21.34 0v-42.66A10.67 10.67 0 0 1 160 144ZM240 128a112 112 0 1 1-224 0a112 112 0 0 1 224 0Zm-21.33 0a90.67 90.67 0 1 0-181.34 0a90.67 90.67 0 0 0 181.34 0Z"/></svg>
      </div>
      <div class="h-[300px]">
        <Doughnut :data="userChartData" :options="userChartOptions" />
      </div>
    </div>

    <!-- Content Bar Chart -->
    <!-- <div class="chart-container">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-slate-800">Production de Contenu</h3>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-400" viewBox="0 0 256 256"><path fill="currentColor" d="M232 208a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8v-32a8 8 0 0 1 8-16h48v-24a8 8 0 0 1 8-8h48v-24a8 8 0 0 1 8-8h48v-24a8 8 0 0 1 16 0v104h24a8 8 0 0 1 8 8Z"/></svg>
      </div>
      <div class="h-[300px]">
        <Bar :data="contentChartData" :options="contentChartOptions" />
      </div>
    </div> -->
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.chart-container {
  @apply bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100;
}
</style>
