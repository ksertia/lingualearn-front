<script setup lang="ts">
import { ref, computed } from 'vue'

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

const logs = ref<LoginLog[]>([
  { id: 1, user: 'Jean Dupont',       email: 'jean.dupont@email.com',     ip: '192.168.1.100', device: 'Chrome / Windows', location: 'Paris, France',     status: 'success', date: '2024-01-15 14:30:25' },
  { id: 2, user: 'Marie Martin',      email: 'marie.martin@email.com',    ip: '192.168.1.101', device: 'Safari / macOS',   location: 'Lyon, France',      status: 'success', date: '2024-01-15 14:25:10' },
  { id: 3, user: 'Pierre Durant',     email: 'pierre.durant@email.com',   ip: '45.33.22.111',  device: 'Firefox / Linux',  location: 'Inconnu',           status: 'failed',  date: '2024-01-15 14:20:45' },
  { id: 4, user: 'Sophie Bernard',    email: 'sophie.bernard@email.com',  ip: '192.168.1.102', device: 'Chrome / Android', location: 'Marseille, France', status: 'success', date: '2024-01-15 14:15:30' },
  { id: 5, user: 'Lucas Moreau',      email: 'lucas.moreau@email.com',    ip: '78.45.12.34',   device: 'Safari / iOS',     location: 'Toulouse, France',  status: 'success', date: '2024-01-15 14:10:55' },
  { id: 6, user: 'Admin System',      email: 'admin@lingualearn.com',     ip: '192.168.1.1',   device: 'Chrome / Windows', location: 'Paris, France',     status: 'success', date: '2024-01-15 14:05:00' },
  { id: 7, user: 'Emma Petit',        email: 'emma.petit@email.com',      ip: '82.12.34.56',   device: 'Edge / Windows',   location: 'Nice, France',      status: 'failed',  date: '2024-01-15 13:55:22' },
  { id: 8, user: 'Thomas Blanc',      email: 'thomas.blanc@email.com',    ip: '192.168.1.105', device: 'Chrome / Windows', location: 'Bordeaux, France',  status: 'success', date: '2024-01-15 13:50:18' },
])

const search       = ref('')
const statusFilter = ref('')
const currentPage  = ref(1)
const itemsPerPage = 5

const filteredLogs = computed(() =>
  logs.value.filter(log => {
    const q = search.value.toLowerCase()
    const matchSearch = log.user.toLowerCase().includes(q) || log.email.toLowerCase().includes(q) || log.ip.includes(q)
    const matchStatus = statusFilter.value ? log.status === statusFilter.value : true
    return matchSearch && matchStatus
  })
)

const totalPages   = computed(() => Math.ceil(filteredLogs.value.length / itemsPerPage))
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredLogs.value.slice(start, start + itemsPerPage)
})

const resetPagination = () => { currentPage.value = 1 }

const formatDate = (d: string) => new Date(d).toLocaleString('fr-FR')

const successCount = computed(() => logs.value.filter(l => l.status === 'success').length)
const failedCount  = computed(() => logs.value.filter(l => l.status === 'failed').length)
</script>

<template>
  <div class="s-card">

    <!-- Header -->
    <div class="s-card-header">
      <div class="s-card-icon s-card-icon--blue">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <div class="flex-1">
        <h2 class="s-card-title">Journal des connexions</h2>
        <p class="s-card-desc">Historique des tentatives de connexion des utilisateurs</p>
      </div>
      <!-- Stats pills -->
      <div class="s-header-pills">
        <span class="s-pill s-pill--green">{{ successCount }} succès</span>
        <span class="s-pill s-pill--red">{{ failedCount }} échoués</span>
      </div>
    </div>

    <!-- Body -->
    <div class="s-card-body">

      <!-- Filters -->
      <div class="s-filters">
        <div class="s-search-wrap">
          <svg class="s-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
          <input
            v-model="search"
            @input="resetPagination"
            type="text"
            placeholder="Utilisateur, email ou IP…"
            class="s-search"
          />
        </div>
        <select v-model="statusFilter" @change="resetPagination" class="s-select">
          <option value="">Tous les statuts</option>
          <option value="success">Succès</option>
          <option value="failed">Échoué</option>
        </select>
      </div>

      <!-- Table -->
      <div class="s-table-wrap">
        <table class="s-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Adresse IP</th>
              <th>Appareil</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in paginatedLogs" :key="log.id" class="s-row">
              <td>
                <p class="s-cell-name">{{ log.user }}</p>
                <p class="s-cell-sub">{{ log.email }}</p>
              </td>
              <td>
                <p class="s-cell-mono">{{ log.ip }}</p>
                <p class="s-cell-sub">{{ log.location }}</p>
              </td>
              <td class="s-cell-text">{{ log.device }}</td>
              <td>
                <span class="s-status" :class="log.status === 'success' ? 's-status--ok' : 's-status--fail'">
                  <span class="s-status-dot"></span>
                  {{ log.status === 'success' ? 'Succès' : 'Échoué' }}
                </span>
              </td>
              <td class="s-cell-date">{{ formatDate(log.date) }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredLogs.length === 0" class="s-empty">
          <svg class="w-8 h-8" style="color:#D1D5DB" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
          <p>Aucune entrée trouvée</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="s-pagination">
        <span class="s-page-info">Page {{ currentPage }} / {{ totalPages }}</span>
        <div class="s-page-btns">
          <button class="s-page-btn" :disabled="currentPage === 1" @click="currentPage--">Précédent</button>
          <button class="s-page-btn" :disabled="currentPage === totalPages" @click="currentPage++">Suivant</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.s-card {
  background: #FFFFFF;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.9),
    0 1px 2px rgba(0,0,0,0.05),
    0 3px 10px rgba(0,0,0,0.05),
    0 0 0 1px rgba(17,24,39,0.05);
}

.s-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid #F3F4F6;
}

.s-card-icon {
  width: 34px; height: 34px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.s-card-icon--blue { background: rgba(59,130,246,0.10); color: #2563EB; }

.s-card-title { font-size: 13.5px; font-weight: 600; color: #111827; line-height: 1.3; }
.s-card-desc  { font-size: 12px; color: #9CA3AF; margin-top: 1px; }
.s-card-body  { padding: 20px 24px 24px; }

.s-header-pills { display: flex; gap: 6px; margin-left: auto; }

.s-pill {
  font-size: 11.5px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 100px;
}

.s-pill--green { background: #DCFCE7; color: #15803D; }
.s-pill--red   { background: #FEE2E2; color: #DC2626; }

/* Filters */
.s-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.s-search-wrap {
  flex: 1;
  position: relative;
}

.s-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #9CA3AF;
  pointer-events: none;
}

.s-search {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 32px;
  font-size: 13px;
  color: #111827;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;
}

.s-search:focus {
  background: white;
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
}

.s-select {
  height: 36px;
  padding: 0 10px;
  font-size: 13px;
  color: #374151;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.12s;
}

.s-select:focus { border-color: #16A34A; }

/* Table */
.s-table-wrap { overflow-x: auto; }

.s-table {
  width: 100%;
  border-collapse: collapse;
}

.s-table thead tr {
  border-bottom: 1px solid #F3F4F6;
}

.s-table th {
  text-align: left;
  padding: 9px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9CA3AF;
}

.s-row { border-bottom: 1px solid #F9FAFB; transition: background 0.1s; }
.s-row:hover { background: #FAFAFA; }
.s-row:last-child { border-bottom: none; }

.s-table td { padding: 10px 12px; vertical-align: middle; }

.s-cell-name { font-size: 13px; font-weight: 500; color: #111827; line-height: 1.3; }
.s-cell-sub  { font-size: 11px; color: #9CA3AF; margin-top: 1px; }
.s-cell-mono { font-size: 12px; font-family: 'Menlo', monospace; color: #374151; }
.s-cell-text { font-size: 13px; color: #6B7280; }
.s-cell-date { font-size: 12px; color: #9CA3AF; white-space: nowrap; }

/* Status */
.s-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 100px;
}

.s-status--ok   { background: #DCFCE7; color: #15803D; }
.s-status--fail { background: #FEE2E2; color: #DC2626; }

.s-status-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

/* Empty */
.s-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 0;
  color: #9CA3AF;
  font-size: 13px;
}

/* Pagination */
.s-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #F3F4F6;
}

.s-page-info { font-size: 12px; color: #9CA3AF; }

.s-page-btns { display: flex; gap: 6px; }

.s-page-btn {
  height: 30px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  background: #F3F4F6;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.12s;
}

.s-page-btn:hover:not(:disabled) { background: #E5E7EB; }
.s-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>

