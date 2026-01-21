<template>
  <div class="p-4 md:p-6 space-y-6">

    <!-- retour -->
    <NuxtLink
      to="/gestion-apprenants/learners"
      class="inline-block px-3 py-1 bg-[#000099] text-white rounded text-sm hover:bg-[#00CED1] transition mb-4"
    >
      ← Retour à la liste
    </NuxtLink>

    <!-- Titre -->
    <h1 class="text-2xl font-bold text-[#000099]">Profil Apprenant</h1>

    <!--  Informations générales -->
    <div class="bg-white rounded shadow p-6 space-y-2">
      <h2 class="text-xl font-semibold text-[#000099] mb-2">Informations générales</h2>
      <p><span class="font-semibold">Nom :</span> {{ learner.name }}</p>
      <p><span class="font-semibold">Email :</span> {{ learner.email }}</p>
      <p><span class="font-semibold">Téléphone :</span> {{ learner.phone }}</p>
      <p><span class="font-semibold">Inscrit le :</span> {{ learner.createdAt }}</p>
      <p><span class="font-semibold">Parcours :</span> {{ learner.parcours }}</p>
      <p>
        <span class="font-semibold">Statut :</span>
        <span
          :class="learner.status === 'actif' ? 'bg-[#00CED1] text-white' : 'bg-[#FF7F00] text-white'"
          class="inline-block px-2 py-1 rounded text-sm font-semibold"
        >
          {{ learner.status === 'actif' ? 'Actif' : 'Inactif' }}
        </span>
      </p>
      <p><span class="font-semibold">ID :</span> {{ learner.id }}</p>
    </div>

    <!-- Progression globale -->
    <div class="bg-white rounded shadow p-6 space-y-4">
      <h2 class="text-xl font-semibold text-[#000099] mb-2">Progression Globale</h2>

      <!-- Progress bar -->
      <div>
        <p class="text-gray-600 mb-1">Taux de progression</p>
        <div class="w-full bg-gray-200 rounded h-4">
          <div
            class="bg-[#000099] h-4 rounded"
            :style="{ width: learner.completion + '%' }"
          ></div>
        </div>
        <p class="text-right text-sm text-gray-500 mt-1">{{ learner.completion }}%</p>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 bg-gray-100 rounded text-center">
          <p class="text-gray-600 mb-1">Moyenne des scores</p>
          <p class="text-lg font-bold text-[#000099]">{{ learner.averageScore }} / 100</p>
        </div>
        <div class="p-4 bg-gray-100 rounded text-center">
          <p class="text-gray-600 mb-1">Temps moyen par module</p>
          <p class="text-lg font-bold text-[#000099]">{{ learner.avgTime }} min</p>
        </div>
        <div class="p-4 bg-gray-100 rounded text-center">
          <p class="text-gray-600 mb-1">Parcours suivis</p>
          <p class="text-lg font-bold text-[#000099]">{{ learner.parcours }}</p>
        </div>
      </div>
    </div>

    <!-- Carte dernières activités -->
    <div class="bg-white rounded shadow p-6 space-y-4">
      <h2 class="text-xl font-semibold text-[#000099] mb-2">Dernières activités</h2>
      <ul class="space-y-2">
        <li
          v-for="(activity, index) in learner.activities.slice(0,5)"
          :key="index"
          class="flex items-center gap-2 bg-gray-100 p-2 rounded"
        >
          <!-- Icône selon type d'activité -->
          <span v-if="activity.title.includes('Lecture')" class="text-[#000099]">📖</span>
          <span v-else-if="activity.title.includes('Quiz')" class="text-[#00CED1]">📝</span>
          <span v-else-if="activity.title.includes('Audio')" class="text-[#FF7F00]">🎧</span>
          <span v-else>✅</span>

          <span class="flex-1">{{ activity.title }}</span>
          <span class="text-sm text-gray-500">{{ activity.date }}</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'learners-layout'
})

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const learnerId = route.params.id

// Données mock
const learnersMock = [
  {
    id: '1',
    name: 'Goama',
    email: 'goama@mail.com',
    phone: '60000000',
    createdAt: '2026-01-01',
    parcours: 'A',
    status: 'actif',
    completion: 85,
    averageScore: 78,
    avgTime: 25,
    activities: [
      { title: 'Lecture terminé', date: 'Hier' },
      { title: 'Quiz réussi (80%)', date: 'Il y a 2 jours' },
      { title: 'Audio écouté', date: 'Il y a 3 jours' },
      { title: 'Lecture terminé', date: 'Il y a 4 jours' },
      { title: 'Quiz réussi (90%)', date: 'Il y a 5 jours' },
      { title: 'Lecture commencé', date: 'Il y a 6 jours' }
    ]
  },
  {
    id: '2',
    name: 'Nadi Traoré',
    email: 'nadi@mail.com',
    phone: '25000000',
    createdAt: '2026-01-01',
    parcours: 'B',
    status: 'inactif',
    completion: 92,
    averageScore: 88,
    avgTime: 20,
    activities: [
      { title: 'Lecture terminé', date: 'Hier' },
      { title: 'Quiz réussi (80%)', date: 'Il y a 2 jours' },
      { title: 'Audio écouté', date: 'Il y a 3 jours' }
    ]
  }
]

const learner = ref<any>({
  id: '',
  name: '',
  email: '',
  phone: '',
  createdAt: '',
  parcours: '',
  status: '',
  completion: 0,
  averageScore: 0,
  avgTime: 0,
  activities: []
})

// Récupère l’apprenant selon l’ID
onMounted(() => {
  const found = learnersMock.find(l => l.id === learnerId)
  if (found) learner.value = found
})
</script>
