<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/userStore'
import { useLanguageStore } from '~/stores/languageStore'
import { useProgressionStore } from '~/stores/progressionStore'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const userStore = useUserStore()
const langStore = useLanguageStore()
const progStore = useProgressionStore()

const search = ref('')
const selectedUser = ref<any>(null)
const languageId = ref('')
const showModal = ref(false)

onMounted(async () => {
  await Promise.all([userStore.fetchUsers(), langStore.fetchLanguages()])
  if (langStore.languages.length) languageId.value = langStore.languages[0].id
})

// REQ 1: Strict learner filtering
const learners = computed(() => {
  const q = search.value.toLowerCase()
  return userStore.users.filter(u => {
    const isLearner = (u.accountType as any) === 'learner'
    const fullName = `${u.profile?.firstName || u.firstName || ''} ${u.profile?.lastName || u.lastName || ''}`.toLowerCase()
    return isLearner && (fullName.includes(q) || u.email?.toLowerCase().includes(q))
  })
})

const openProfile = (user: any) => {
  selectedUser.value = user
  showModal.value = true
  loadStats()
}

const loadStats = () => {
  if (selectedUser.value && languageId.value) {
    progStore.fetchUserStats(selectedUser.value.id, languageId.value)
  }
}

// REQ 2: Progression Graphs
const charts = computed(() => {
  const s = progStore.stats
  if (!s || progStore.isLoading) return null

  return {
    doughnut: {
      labels: ['Réalisé', 'Restant'],
      datasets: [{ 
        data: [s.overallProgressPercentage, 100 - s.overallProgressPercentage], 
        backgroundColor: ['#6366f1', '#f1f5f9'], 
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    bar: {
      labels: ['Niveaux', 'Modules', 'Parcours', 'Étapes'],
      datasets: [
        { label: 'Total', data: [s.totalLevels, s.totalModules, s.totalPaths, s.totalSteps], backgroundColor: '#e2e8f0', borderRadius: 8 },
        { label: 'Complétés', data: [s.completedLevels, s.completedModules, s.completedPaths, s.completedSteps], backgroundColor: '#6366f1', borderRadius: 8 }
      ]
    }
  }
})

const chartOptions = { 
  responsive: true, 
  maintainAspectRatio: false, 
  plugins: { legend: { display: false } },
  cutout: '75%'
}
</script>

<template>
  <div class="p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-slate-800">Espace Apprenants</h1>
        <p class="text-slate-500 font-medium">Suivi analytique des performances</p>
      </div>
      <div class="relative w-full md:w-96">
        <input v-model="search" type="text" placeholder="Rechercher un apprenant..." 
               class="w-full pl-12 pr-4 py-3 bg-white border-0 shadow-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
      </div>
    </header>

    <div v-if="userStore.isLoading" class="flex justify-center py-20">
      <div class="animate-pulse flex space-x-4">
        <div class="rounded-full bg-slate-200 h-10 w-10"></div>
        <div class="flex-1 space-y-6 py-1">
          <div class="h-2 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="u in learners" :key="u.id" @click="openProfile(u)" 
           class="group bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-transparent hover:border-indigo-100">
        <div class="flex items-center gap-5">
          <div class="h-14 w-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            {{ (u.profile?.firstName || u.firstName || '?')[0] }}
          </div>
          <div class="overflow-hidden">
            <h3 class="font-bold text-slate-800 truncate text-lg">{{ u.profile?.firstName || u.firstName }} {{ u.profile?.lastName || u.lastName }}</h3>
            <p class="text-xs text-slate-400 font-medium truncate">{{ u.email }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md transition-all" @click.self="showModal = false">
        <div class="bg-white w-full max-w-5xl h-full max-h-[850px] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          <aside class="md:w-80 bg-slate-50 p-10 flex flex-col border-r border-slate-100">
            <div class="flex flex-col items-center mb-10">
              <div class="h-24 w-24 rounded-3xl bg-indigo-500 flex items-center justify-center text-white text-4xl font-black mb-4 shadow-2xl shadow-indigo-200">
                {{ (selectedUser?.profile?.firstName || selectedUser?.firstName || '?')[0] }}
              </div>
              <h2 class="text-2xl font-black text-slate-800 text-center leading-tight">
                {{ selectedUser?.profile?.firstName || selectedUser?.firstName }}<br>
                {{ selectedUser?.profile?.lastName || selectedUser?.lastName }}
              </h2>
            </div>

            <div class="space-y-6 mb-auto">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2 px-1">Langue d'étude</label>
                <select v-model="languageId" @change="loadStats" class="w-full px-4 py-3 bg-white border-0 shadow-sm rounded-2xl text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20">
                  <option v-for="l in langStore.languages" :key="l.id" :value="l.id">{{ l.name }}</option>
                </select>
              </div>
              
              <div class="grid grid-cols-1 gap-3">
                <div class="p-4 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-100">
                  <span class="text-[10px] font-bold opacity-80 uppercase block">Score Total (XP)</span>
                  <span class="text-3xl font-black">{{ progStore.totalXp }}</span>
                </div>
              </div>
            </div>

            <button @click="showModal = false" class="w-full py-4 bg-slate-200 hover:bg-indigo-500 hover:text-white rounded-2xl text-sm font-black text-slate-600 transition-all mt-8">Fermer</button>
          </aside>

          <main class="flex-1 p-10 overflow-y-auto custom-scrollbar">
            <div v-if="progStore.isLoading" class="h-full flex flex-col items-center justify-center">
              <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p class="text-sm font-black text-slate-300 uppercase tracking-widest">Analyse de la progression...</p>
            </div>

            <div v-else-if="charts" class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-slate-50 p-8 rounded-[2.5rem] relative flex flex-col items-center justify-center h-64">
                  <span class="absolute top-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Score de maitrise</span>
                  <div class="h-48 w-48 relative">
                    <Doughnut :data="charts.doughnut" :options="chartOptions" />
                    <div class="absolute inset-0 flex flex-col items-center justify-center pt-2">
                      <span class="text-4xl font-black text-slate-800">{{ progStore.stats?.overallProgressPercentage.toFixed(0) }}%</span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div v-for="item in [
                    {label:'Niveaux', val:progStore.stats?.completedLevels, total:progStore.stats?.totalLevels},
                    {label:'Modules', val:progStore.stats?.completedModules, total:progStore.stats?.totalModules},
                    {label:'Parcours', val:progStore.stats?.completedPaths, total:progStore.stats?.totalPaths},
                    {label:'Étapes', val:progStore.stats?.completedSteps, total:progStore.stats?.totalSteps}
                  ]" :key="item.label" class="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col justify-center">
                    <span class="text-[10px] font-black text-slate-400 uppercase block mb-1">{{ item.label }}</span>
                    <div class="flex items-baseline gap-1">
                      <span class="text-3xl font-black text-slate-800">{{ item.val || 0 }}</span>
                      <span class="text-xs font-bold text-slate-300">/ {{ item.total || 0 }}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div class="flex items-center justify-between mb-6 px-2">
                  <h3 class="text-xl font-black text-slate-800">Détails par catégorie</h3>
                </div>
                <div class="bg-slate-50 p-8 rounded-[2.5rem] h-80">
                  <Bar :data="charts.bar" :options="{ ...chartOptions, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }" />
                </div>
              </section>
            </div>

            <div v-else class="h-full flex flex-col items-center justify-center text-slate-300 italic">
              <div class="text-6xl mb-4">📊</div>
              <p>Sélectionnez une langue pour explorer les statistiques.</p>
            </div>
          </main>

        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.font-sans { font-family: 'Outfit', 'Inter', system-ui, sans-serif; }
</style>
