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
  LineElement,
  Filler
} from 'chart.js'
import { Line, Doughnut } from 'vue-chartjs'
import { useGestionnaireDashboardStore } from '~/stores/gestionnaireDashboardStore'
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
  LineElement,
  Filler
)

const store = useGestionnaireDashboardStore()

// Chart 1: Publications Evolution (Last 30 Days) - Line Chart
const publicationsChartData = computed(() => {
  const data = store.publicationsLast30Days
  
  return {
    labels: data.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    }),
    datasets: [
      {
        label: 'Publications',
        backgroundColor: (context: any) => {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) return 'rgba(99, 102, 241, 0.1)'
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0)')
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.3)')
          return gradient
        },
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
        data: data.map(item => item.count)
      }
    ]
  }
})

const publicationsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        stepSize: 1
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 7
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#fff',
      bodyColor: '#cbd5e1',
      padding: 12,
      cornerRadius: 8,
      displayColors: false
    }
  }
}

// Chart 2: Contents by Language - Doughnut Chart
const languageChartData = computed(() => {
  const data = store.contentsByLanguage
  
  // Couleurs pour les langues
  const colors = [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
  ]
  
  return {
    labels: data.map(item => item.languageName),
    datasets: [
      {
        backgroundColor: data.map((_, index) => colors[index % colors.length]),
        borderWidth: 0,
        data: data.map(item => item.courseCount)
      }
    ]
  }
})

const languageChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        usePointStyle: true,
        padding: 16,
        font: {
          family: 'Inter',
          size: 12
        },
        generateLabels: (chart: any) => {
          const data = chart.data
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label: string, i: number) => {
              const dataset = data.datasets[0]
              const value = dataset.data[i]
              const total = dataset.data.reduce((a: number, b: number) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              
              return {
                text: `${label} (${percentage}%)`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.backgroundColor[i],
                lineWidth: 0,
                pointStyle: 'circle',
                hidden: false,
                index: i
              }
            })
          }
          return []
        }
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#fff',
      bodyColor: '#cbd5e1',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (context: any) => {
          const value = context.raw
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return ` ${value} cours (${percentage}%)`
        }
      }
    }
  }
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
    <!-- Publications Evolution Chart -->
    <div class="chart-container">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-slate-800">Évolution des publications</h3>
          <p class="text-sm text-slate-500 mt-1">30 derniers jours</p>
        </div>
        <div class="p-2 bg-indigo-50 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>
      <div class="h-[280px]">
        <Line :data="publicationsChartData" :options="publicationsChartOptions" />
      </div>
    </div>

    <!-- Contents by Language Chart -->
    <div class="chart-container">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-slate-800">Contenus par langue</h3>
          <p class="text-sm text-slate-500 mt-1">Répartition des Module</p>
        </div>
        <div class="p-2 bg-emerald-50 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        </div>
      </div>
      <div class="h-[280px]">
        <Doughnut :data="languageChartData" :options="languageChartOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #f1f5f9;
}

@media (min-width: 1024px) {
  .chart-container {
    padding: 2rem;
  }
}
</style>

