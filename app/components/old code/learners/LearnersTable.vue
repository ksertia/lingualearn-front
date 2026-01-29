<template>
  <div class="bg-gray-100 rounded-lg p-4 shadow-sm">
    <!-- Tableau -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-lg shadow divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nom</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Téléphone</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inscrit le</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Parcours</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Dernière connexion</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="learner in paginatedLearners"
            :key="learner.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-6 py-4 whitespace-nowrap font-medium text-[#000099] underline">
              <NuxtLink :to="`/gestion-apprenants/learners/${learner.id}`">
                {{ getFullName(learner) }}
              </NuxtLink>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ learner.email || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ learner.phone || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ formatDate(learner.createdAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">
              <span class="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-slate-100 border border-slate-200">
                {{ learner.accountType }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">
              {{ formatDate(learner.lastLogin) }}
            </td>
          </tr>
          <tr v-if="paginatedLearners.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              Aucun apprenant trouvé
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination en bas à droite -->
    <div class="flex justify-end mt-4 items-center gap-2">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-1 bg-[#000099] text-white rounded disabled:opacity-40 hover:bg-[#00CED1] transition"
      >
        Précédent
      </button>

      <ul class="inline-flex -space-x-px text-sm">
        <li v-for="page in pagesToDisplay" :key="page">
          <button
            @click="currentPage = page"
            :class="[
              'px-3 py-1 border',
              currentPage === page
                ? 'bg-[#00CED1] text-white border-[#00CED1]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            ]"
          >
            {{ page }}
          </button>
        </li>
      </ul>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 bg-[#000099] text-white rounded disabled:opacity-40 hover:bg-[#00CED1] transition"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { User } from '~/types/auth'

const props = defineProps<{ filteredLearners: User[] }>()

const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(props.filteredLearners.length / itemsPerPage))

const pagesToDisplay = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1).slice(0, 10) 
})

const paginatedLearners = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return props.filteredLearners.slice(start, start + itemsPerPage)
})

watch(() => props.filteredLearners, () => (currentPage.value = 1))

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const getFullName = (user: User) => {
  const firstName = user.profile?.firstName || (user as any).firstName || '';
  const lastName = user.profile?.lastName || (user as any).lastName || '';
  if (firstName || lastName) {
    return `${firstName} ${lastName}`.trim();
  }
  return user.username || 'Inconnu';
}

// Formatage des dates et affichage "Jamais connecté"
function formatDate(date?: Date | string) {
  if (!date) return 'Jamais connecté'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('fr-FR')
}
</script>
