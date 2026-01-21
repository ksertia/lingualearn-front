<template>
  <div class="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">

    <h1 class="text-xl md:text-2xl font-bold text-[#000099]">
      Liste des apprenants
    </h1>

    <!-- Filtres -->
    <LearnerFilters
      v-model:search="search"
      v-model:parcours="parcours"
      v-model:status="status"
    />

    <!-- Tableau -->
    <LearnersTable :filtered-learners="filteredLearners" />

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'learners-layout' })

import { ref, computed } from 'vue'
import LearnerFilters from '~/components/learners/LearnerFilters.vue'
import LearnersTable from '~/components/learners/LearnersTable.vue'

interface Learner {
  id: number
  name: string
  email: string
  phone: string
  createdAt: string
  parcours: string
  status: string
}

// Données mock
const learners = ref<Learner[]>([
  { id: 1, name: 'Goama', email: 'goama@mail.com', phone: '60000000', createdAt: '2026-01-01', parcours: 'A', status: 'actif' },
  { id: 2, name: 'Nadi Traoré', email: 'nadi@mail.com', phone: '25000000', createdAt: '2026-01-01', parcours: 'B', status: 'inactif' },
  { id: 3, name: 'Mariam Kaboré', email: 'mariam@mail.com', phone: '50000000', createdAt: '2026-01-02', parcours: 'A', status: 'actif' },
  { id: 4, name: 'Issa Ouédraogo', email: 'issa@mail.com', phone: '70000000', createdAt: '2026-01-03', parcours: 'C', status: 'actif' },
  { id: 5, name: 'Fatou Diallo', email: 'fatou@mail.com', phone: '60005000', createdAt: '2026-01-04', parcours: 'B', status: 'inactif' }
])

// Filtres
const search = ref('')
const parcours = ref('')
const status = ref('')

// Filtrage
const filteredLearners = computed(() => {
  return learners.value.filter(l => {
    const matchName = l.name.toLowerCase().includes(search.value.toLowerCase())
    const matchParcours = parcours.value ? l.parcours === parcours.value : true
    const matchStatus = status.value ? l.status === status.value : true
    return matchName && matchParcours && matchStatus
  })
})
</script>
