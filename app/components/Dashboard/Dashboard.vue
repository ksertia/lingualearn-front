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

<script setup lang="ts">
//  debut du script Statistiques utilisateur
        import { reactive, computed, onMounted, ref } from 'vue'
        import { useApiService } from '~/services/api'
        import type { DashboardResponse } from '~/types/dashboard'
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
                  BarController,
                  type ChartConfiguration
                } from 'chart.js'

    const apiService = useApiService()

    //  Données depuis l'API
    const stats = reactive({
    totalUsers: 0,
    newUsers: 0,
    inactiveUsers: 0
    })

    const dashboardData = reactive<DashboardResponse>({
      stats: stats,
      languages: [],
      userLevels: []
    })

    // Calcul du taux d'activité
    const activityRate = computed(() => {
    const activeUsers = stats.totalUsers - stats.inactiveUsers
    return stats.totalUsers > 0 ? ((activeUsers / stats.totalUsers) * 100).toFixed(1) : '0.0'
    })

    // Refs pour les canvas
    const pieCanvas = ref(null)
    const chartCanvas = ref(null)

    // OBLIGATOIRE : enregistrer le controller + éléments
    Chart.register(
      PieController,
      ArcElement,
      BarController,
      BarElement,
      CategoryScale,
      LinearScale,
      Tooltip,
      Legend,
      Title
    )

    onMounted(async () => {
      try {
        const response = await apiService.getAdminDashboard()
        console.log('Réponse API dashboard:', response)  // Ajout pour déboguer
        Object.assign(dashboardData, response.data)
        // dashboardData.languages = response.languagesData
        // dashboardData.userLevels = response.userLevels

        // Graphique des langues (utiliser les données de l'API)
        if (dashboardData.languages.length > 0 && pieCanvas.value) {
          const pieData = {
            labels: dashboardData.languages.map(lang => lang.label),
            datasets: [
              {
                label: 'Langues les plus parlées',
                data: dashboardData.languages.map(lang => lang.data),
                backgroundColor: dashboardData.languages.map(lang => lang.backgroundColor),
                borderWidth: 1
              }
            ]
          }

          const config: ChartConfiguration = {
            type: 'pie',
            data: pieData,
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
        }

        // Graphique des niveaux (utiliser les données de l'API)
        if (dashboardData.userLevels.length > 0 && chartCanvas.value) {
          const barData = {
            labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'], // Assumer des mois fixes ou ajuster selon l'API
            datasets: dashboardData.userLevels.map(level => ({
              label: level.label,
              data: level.data,
              backgroundColor: level.backgroundColor
            }))
          }

          const barConfig: ChartConfiguration = {
            type: 'bar',
            data: barData,
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
          }

          new Chart(chartCanvas.value, barConfig)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données du dashboard:', error)
      }
    })
//  fin du script Statistiques utilisateur
</script>