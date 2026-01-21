<template>
     <!-- Statistiques utilisateur -->
    <section class="flex gap-5 mt-10">
        <div class="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 text-center font-bold flex-1 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl">
            <h2 class="text-base text-gray-600 mb-4">Total des utilisateurs</h2>
            <p class="text-4xl font-bold text-blue-900">{{ stats.totalUsers }}</p>
            <p class="text-xs text-gray-500 mt-auto text-center">Nombre d'utilisateurs de la plateforme</p>

        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 text-center font-bold flex-1 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl">
            <h2 class="text-base text-gray-600 mb-4">Nouveaux inscrits</h2>
            <p class="text-4xl font-bold text-[#FFA500]">{{ stats.newUsers }}</p>
            <p class="text-xs text-gray-500 mt-auto text-center">Nombre d'utilisateurs inscrits au cours du dernier mois</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 text-center font-bold flex-1 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl">
            <h2 class="text-base text-gray-600 mb-4">Utilisateurs inactifs</h2>
            <p class="text-4xl font-bold text-red-600">{{ stats.inactiveUsers }}</p>
            <p class="text-xs text-gray-500 mt-auto text-center">Utilisateurs n'ayant pas accédé à leur compte depuis plus de 30 jours</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 text-center font-bold flex-1 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl">
            <h2 class="text-base text-gray-600 mb-4">Taux d’activité</h2>
            <p class="text-4xl font-bold text-purple-600">{{ activityRate }}%</p>
            <p class="text-xs text-gray-500 mt-auto text-center">Pourcentage d'utilisateurs actifs sur la plateforme</p>
        </div>
  </section> <!-- Statistiques utilisateur -->

  <!-- Statistiques des langues les plus parlées et utilisateurs par niveau -->
  <section class="flex gap-5 mt-10">
    <div class="bg-white p-6 rounded-xl shadow-lg w-1/3 ">
        <h2 class="text-lg font-semibold text-gray-700 mb-4 text-center">
          Langues les plus parlées
        </h2>
        <canvas ref="pieCanvas"></canvas>
    </div>

    <div class="bg-white rounded-xl shadow p-6 w-2/3">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">
          Répartition des utilisateurs par niveau
        </h2>

      <div class="relative h-80">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </section>
  <!-- Statistiques des langues les plus parlées et utilisateurs par niveau -->
</template>

<script setup>
//  debut du script Statistiques utilisateur 
        import { reactive, computed } from 'vue'

    //  Données simulées (comme depuis une API)
    const stats = reactive({
    totalUsers: 1250,
    newUsers: 87,
    inactiveUsers: 320
    })

    // Calcul du taux d'activité
    const activityRate = computed(() => {
    const activeUsers = stats.totalUsers - stats.inactiveUsers
    return ((activeUsers / stats.totalUsers) * 100).toFixed(1)
    })
//  fin du script Statistiques utilisateur 

// debut du script Statistiques des langues les plus parlées
import { ref, onMounted } from 'vue'
import {
  Chart,
  PieController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  BarController
} from 'chart.js'

// OBLIGATOIRE : enregistrer le controller + éléments
Chart.register(
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title
)

const pieCanvas = ref(null)

onMounted(() => {
  const data = {
    labels: ['Mooré', 'Dioula', 'Fulfuldé'],
    datasets: [
      {
        label: 'Langues les plus parlées',
        data: [45, 30, 25],
        backgroundColor: [
          'rgba(0,0,153,1)',
          'rgba(255, 165, 0, 1)',
          'rgba(64, 224, 208, 1)'
        ],
        borderWidth: 1
      }
    ]
  }

  const config = {
    type: 'pie',
    data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  }

  new Chart(pieCanvas.value, config)
}) // fin du script Statistiques des langues les plus parlées


// debut du script utilisateurs par niveau
// Enregistrement des composants Chart.js
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

const chartCanvas = ref(null)

onMounted(() => {
  new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      datasets: [
        {
          label: 'Débutant',
          data: [150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260],
          backgroundColor: ['rgba(0,0,153,1)'] // blue-foncé
        },
        {
          label: 'Intermédiaire',
          data: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210],
          backgroundColor: ['rgba(255, 165, 0, 1)'] // orange
        },
        {
          label: 'Avancé',
          data: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105],
          backgroundColor: ['rgba(64, 224, 208, 1)'] // turquoise
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        x: {
          stacked: true,
          beginAtZero: true
        },
        y: {
          stacked: true
        }
      }
    }
  })
})
// fin du script utilisateurs par niveau
</script>