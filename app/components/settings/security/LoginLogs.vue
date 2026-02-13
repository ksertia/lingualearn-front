<script setup lang="ts">
import { ref, computed } from 'vue'

// Types
interface LoginLog {
  id: number
  user: string
  email: string
  ip: string
  device: string
  location: string
  status: 'success' | 'failed'
  date: string
}

// Données simulées
const logs = ref<LoginLog[]>([
  { id: 1, user: 'Jean Dupont', email: 'jean.dupont@email.com', ip: '192.168.1.100', device: 'Chrome / Windows', location: 'Paris, France', status: 'success', date: '2024-01-15 14:30:25' },
  { id: 2, user: 'Marie Martin', email: 'marie.martin@email.com', ip: '192.168.1.101', device: 'Safari / macOS', location: 'Lyon, France', status: 'success', date: '2024-01-15 14:25:10' },
  { id: 3, user: 'Pierre Durant', email: 'pierre.durant@email.com', ip: '45.33.22.111', device: 'Firefox / Linux', location: 'Unknown', status: 'failed', date: '2024-01-15 14:20:45' },
  { id: 4, user: 'Sophie Bernard', email: 'sophie.bernard@email.com', ip: '192.168.1.102', device: 'Chrome / Android', location: 'Marseille, France', status: 'success', date: '2024-01-15 14:15:30' },
  { id: 5, user: 'Lucas Moreau', email: 'lucas.moreau@email.com', ip: '78.45.12.34', device: 'Safari / iOS', location: 'Toulouse, France', status: 'success', date: '2024-01-15 14:10:55' },
  { id: 6, user: 'Admin System', email: 'admin@lingualearn.com', ip: '192.168.1.1', device: 'Chrome / Windows', location: 'Paris, France', status: 'success', date: '2024-01-15 14:05:00' },
  { id: 7, user: 'Emma Petit', email: 'emma.petit@email.com', ip: '82.12.34.56', device: 'Edge / Windows', location: 'Nice, France', status: 'failed', date: '2024-01-15 13:55:22' },
  { id: 8, user: 'Thomas Blanc', email: 'thomas.blanc@email.com', ip: '192.168.1.105', device: 'Chrome / Windows', location: 'Bordeaux, France', status: 'success', date: '2024-01-15 13:50:18' },
])

const search = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

// Filtrage des logs
const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchSearch = 
      log.user.toLowerCase().includes(search.value.toLowerCase()) ||
      log.email.toLowerCase().includes(search.value.toLowerCase()) ||
      log.ip.includes(search.value)
    const matchStatus = statusFilter.value ? log.status === statusFilter.value : true
    return matchSearch && matchStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / itemsPerPage))

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredLogs.value.slice(start, start + itemsPerPage)
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('fr-FR')
}

// Reset page on filter change
const resetPagination = () => {
  currentPage.value = 1
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-blue-100 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M12 8v4l2 2"/>
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Journal des connexions</h2>
        <p class="text-sm text-slate-500">Historique des tentatives de connexion des utilisateurs</p>
      </div>
    </div>

    <!-- Filtres -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1">
        <input
          v-model="search"
          @input="resetPagination"
          type="text"
          placeholder="Rechercher par utilisateur, email ou IP..."
          class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] focus:ring-2 focus:ring-[#00ced1]/20 outline-none transition"
        />
      </div>
      <select
        v-model="statusFilter"
        @change="resetPagination"
        class="px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
      >
        <option value="">Tous les statuts</option>
        <option value="success">Succès</option>
        <option value="failed">Échoué</option>
      </select>
    </div>

    <!-- Tableau -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Utilisateur</th>
            <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">IP</th>
            <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Appareil</th>
            <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Statut</th>
            <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="log in paginatedLogs" 
            :key="log.id"
            class="border-b border-gray-50 hover:bg-gray-50/50 transition"
          >
            <td class="py-3 px-4">
              <div>
                <p class="text-sm font-medium text-slate-900">{{ log.user }}</p>
                <p class="text-xs text-slate-500">{{ log.email }}</p>
              </div>
            </td>
            <td class="py-3 px-4">
              <div>
                <p class="text-sm font-mono text-slate-700">{{ log.ip }}</p>
                <p class="text-xs text-slate-500">{{ log.location }}</p>
              </div>
            </td>
            <td class="py-3 px-4 text-sm text-slate-700">{{ log.device }}</td>
            <td class="py-3 px-4">
              <span 
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="log.status === 'success' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-red-100 text-red-700'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="log.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                {{ log.status === 'success' ? 'Succès' : 'Échoué' }}
              </span>
            </td>
            <td class="py-3 px-4 text-sm text-slate-600">{{ formatDate(log.date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Message si aucun résultat -->
    <div v-if="filteredLogs.length === 0" class="text-center py-8 text-slate-500">
      Aucun journal de connexion trouvé
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
      <span class="text-sm text-slate-500">
        Page {{ currentPage }} / {{ totalPages }}
      </span>
      <div class="flex gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Précédent
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

