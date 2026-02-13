<script setup lang="ts">
import { ref, computed } from 'vue'

// Types
interface Transaction {
  id: string
  user: string
  email: string
  plan: string
  amount: number
  method: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  date: string
}

// Transactions simulées
const transactions = ref<Transaction[]>([
  { id: 'TXN-001', user: 'Jean Dupont', email: 'jean.dupont@email.com', plan: 'Premium', amount: 19.99, method: 'Stripe', status: 'completed', date: '2024-01-15 14:30:25' },
  { id: 'TXN-002', user: 'Marie Martin', email: 'marie.martin@email.com', plan: 'Basique', amount: 9.99, method: 'PayPal', status: 'completed', date: '2024-01-15 12:15:10' },
  { id: 'TXN-003', user: 'Pierre Durant', email: 'pierre.durant@email.com', plan: 'Premium', amount: 19.99, method: 'Carte Bancaire', status: 'pending', date: '2024-01-15 11:45:33' },
  { id: 'TXN-004', user: 'Sophie Bernard', email: 'sophie.bernard@email.com', plan: 'Entreprise', amount: 49.99, method: 'Virement', status: 'completed', date: '2024-01-14 16:20:45' },
  { id: 'TXN-005', user: 'Lucas Moreau', email: 'lucas.moreau@email.com', plan: 'Basique', amount: 9.99, method: 'Stripe', status: 'failed', date: '2024-01-14 15:10:22' },
  { id: 'TXN-006', user: 'Emma Petit', email: 'emma.petit@email.com', plan: 'Premium', amount: 19.99, method: 'Orange Money', status: 'completed', date: '2024-01-14 10:55:18' },
  { id: 'TXN-007', user: 'Thomas Blanc', email: 'thomas.blanc@email.com', plan: 'Basique', amount: 9.99, method: 'PayPal', status: 'refunded', date: '2024-01-13 09:30:00' },
  { id: 'TXN-008', user: 'Alice Roux', email: 'alice.roux@email.com', plan: 'Premium', amount: 19.99, method: 'Stripe', status: 'completed', date: '2024-01-13 08:15:44' },
])

const search = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

// Filtrage des transactions
const filteredTransactions = computed(() => {
  return transactions.value.filter(tx => {
    const matchSearch = 
      tx.user.toLowerCase().includes(search.value.toLowerCase()) ||
      tx.email.toLowerCase().includes(search.value.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = statusFilter.value ? tx.status === statusFilter.value : true
    return matchSearch && matchStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage))

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTransactions.value.slice(start, start + itemsPerPage)
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('fr-FR')
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

const getStatusColor = (status: string) => {
  const colors = {
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-blue-100 text-blue-700'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status: string) => {
  const labels = {
    completed: 'Complété',
    pending: 'En attente',
    failed: 'Échoué',
    refunded: 'Remboursé'
  }
  return labels[status as keyof typeof labels] || status
}

const resetPagination = () => {
  currentPage.value = 1
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-cyan-100 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-cyan-600" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Historique des transactions</h2>
        <p class="text-sm text-slate-500">Liste de toutes les transactions de paiement</p>
      </div>
    </div>

    <!-- Filtres -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1">
        <input
          v-model="search"
          @input="resetPagination"
          type="text"
          placeholder="Rechercher par utilisateur, email ou ID..."
          class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] focus:ring-2 focus:ring-[#00ced1]/20 outline-none transition"
        />
      </div>
      <select
        v-model="statusFilter"
        @change="resetPagination"
        class="px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
      >
        <option value="">Tous les statuts</option>
        <option value="completed">Complété</option>
        <option value="pending">En attente</option>
        <option value="failed">Échoué</option>
        <option value="refunded">Remboursé</option>
      </select>
    </div>

    <!-- Tableau -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">ID</th>
            <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Utilisateur</th>
            <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Plan</th>
            <th class="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Montant</th>
            <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Méthode</th>
            <th class="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Statut</th>
            <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="tx in paginatedTransactions" 
            :key="tx.id"
            class="border-b border-gray-50 hover:bg-gray-50/50 transition"
          >
            <td class="py-3 px-4">
              <span class="text-sm font-mono text-slate-600">{{ tx.id }}</span>
            </td>
            <td class="py-3 px-4">
              <div>
                <p class="text-sm font-medium text-slate-900">{{ tx.user }}</p>
                <p class="text-xs text-slate-500">{{ tx.email }}</p>
              </div>
            </td>
            <td class="py-3 px-4">
              <span class="text-sm font-medium text-slate-700">{{ tx.plan }}</span>
            </td>
            <td class="py-3 px-4 text-right">
              <span class="text-sm font-semibold text-[#000099]">{{ formatAmount(tx.amount) }}</span>
            </td>
            <td class="py-3 px-4 text-sm text-slate-600">{{ tx.method }}</td>
            <td class="py-3 px-4 text-center">
              <span 
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="getStatusColor(tx.status)"
              >
                {{ getStatusLabel(tx.status) }}
              </span>
            </td>
            <td class="py-3 px-4 text-sm text-slate-600">{{ formatDate(tx.date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Message si aucun résultat -->
    <div v-if="filteredTransactions.length === 0" class="text-center py-8 text-slate-500">
      Aucune transaction trouvée
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

