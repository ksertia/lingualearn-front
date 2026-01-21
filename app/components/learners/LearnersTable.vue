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
                {{ learner.name }}
              </NuxtLink>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ learner.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ learner.phone }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ learner.createdAt }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ learner.parcours }}</td>
          </tr>
          <tr v-if="paginatedLearners.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
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

interface Learner {
  id: number
  name: string
  email: string
  phone: string
  createdAt: string
  parcours: string
}

const props = defineProps<{ filteredLearners: Learner[] }>()

const currentPage = ref(1)
const itemsPerPage = 3

const totalPages = computed(() => Math.ceil(props.filteredLearners.length / itemsPerPage))

// Pages affichées (1…n) ; simple logique ici, tu peux optimiser pour "..." si beaucoup
const pagesToDisplay = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1)
})

const paginatedLearners = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return props.filteredLearners.slice(start, start + itemsPerPage)
})

watch(
  () => props.filteredLearners,
  () => (currentPage.value = 1)
)

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>
