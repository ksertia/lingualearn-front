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
    <h1 class="text-2xl font-bold" style="color: rgb(0,42,104);">
      Profil Apprenant
    </h1>

    <!-- ================== CARTE INFORMATIONS ================== -->
    <div class="bg-white rounded shadow p-6">
      <h2 class="text-xl font-semibold mb-4" style="color: rgb(0,42,104);">
        Informations détaillées
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Apprenant -->
        <div class="space-y-2">
          <p><span class="font-semibold">Nom :</span> {{ learner.name }}</p>
          <p><span class="font-semibold">Inscrit le :</span> {{ learner.createdAt }}</p>
          <p><span class="font-semibold">Parcours actuel :</span> {{ learner.currentCourse }}</p>
          <p><span class="font-semibold">Dernière connexion :</span> {{ learner.lastLogin }}</p>

          <!-- Statut -->
          <p class="flex items-center gap-2">
            <span class="font-semibold">Statut :</span>

            <span
              v-if="learner.status === 'actif'"
              class="px-3 py-1 rounded-full text-xs font-semibold bg-[#00CED1] text-white"
            >
              Actif
            </span>

            <span
              v-else
              class="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white"
            >
              Inactif
            </span>
          </p>
        </div>

        <!-- Parent -->
        <div class="space-y-2">
          <h3 class="text-lg font-semibold" style="color: rgb(0,42,104);">
            Informations du parent
          </h3>

          <p>
            <span class="font-semibold">Nom :</span>
            {{ learner.parent?.name || '' }}
          </p>

          <p>
            <span class="font-semibold">Email :</span>
            {{ learner.parent?.email || '' }}
          </p>

          <p>
            <span class="font-semibold">Téléphone :</span>
            {{ learner.parent?.phone || '' }}
          </p>
        </div>

      </div>
    </div>

    <!-- ================== CARTE COURS ================== -->
    <div class="bg-white rounded shadow p-6">
      <h2 class="text-xl font-semibold mb-4" style="color: rgb(0,42,104);">
        Cours
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Cours terminés -->
        <div>
          <h3 class="text-lg font-semibold mb-2" style="color: rgb(0,42,104);">
            Cours terminés
          </h3>

          <ul class="list-disc pl-6 space-y-1">
            <li v-for="(course, index) in learner.completedCourses" :key="index">
              {{ course }} - 100%
            </li>
          </ul>
        </div>

        <!-- Cours actuel -->
        <div>
          <h3 class="text-lg font-semibold mb-2" style="color: rgb(0,42,104);">
            Cours actuel
          </h3>

          <ul class="list-disc pl-6 space-y-1">
            <li
              v-for="(course, index) in learner.inProgressCourses || []"
              :key="index"
            >
              {{ course.name }} - {{ course.progress }}%
            </li>
            <li v-if="learner.currentCourse && !learner.inProgressCourses?.length">
              {{ learner.currentCourse }} - {{ learner.completion }}%
            </li>
          </ul>
        </div>

      </div>
    </div>

    <!-- ================== PROGRESSION ================== -->
    <div class="bg-white rounded shadow p-6 space-y-4">
      <h2 class="text-xl font-semibold mb-2" style="color: rgb(0,42,104);">
        Progression Globale
      </h2>

      <!-- Progress bar -->
      <div>
        <p class="text-gray-600 mb-1">Taux de progression</p>
        <div class="w-full bg-gray-200 rounded h-4">
          <div
            class="bg-[#000099] h-4 rounded"
            :style="{ width: learner.completion + '%' }"
          ></div>
        </div>
        <p class="text-right text-sm text-gray-500 mt-1">
          {{ learner.completion }}%
        </p>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 bg-gray-100 rounded text-center">
          <p class="text-gray-600 mb-1">Moyenne des scores</p>
          <p class="text-lg font-bold" style="color: rgb(0,42,104);">
            {{ learner.averageScore }} / 100
          </p>
        </div>

        <div class="p-4 bg-gray-100 rounded text-center">
          <p class="text-gray-600 mb-1">Temps moyen par module</p>
          <p class="text-lg font-bold" style="color: rgb(0,42,104);">
            {{ learner.avgTime }} min
          </p>
        </div>

        <div class="p-4 bg-gray-100 rounded text-center">
          <p class="text-gray-600 mb-1">Parcours suivis</p>
          <p class="text-lg font-bold" style="color: rgb(0,42,104);">
            {{ learner.parcours }}
          </p>
        </div>
      </div>
    </div>

    <!-- ================== ACTIVITÉS ================== -->
    <div class="bg-white rounded shadow p-6 space-y-4">
      <h2 class="text-xl font-semibold mb-2" style="color: rgb(0,42,104);">
        Dernières activités
      </h2>

      <ul class="space-y-2">
        <li
          v-for="(activity, index) in learner.activities.slice(0,5)"
          :key="index"
          class="flex items-center gap-2 bg-gray-100 p-2 rounded"
        >
          <span v-if="activity.title.includes('Lecture')" class="text-[#000099]">📖</span>
          <span v-else-if="activity.title.includes('Quiz')" class="text-[#00CED1]">📝</span>
          <span v-else-if="activity.title.includes('Audio')" class="text-orange-500">🎧</span>
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
  layout: 'lms'
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
    createdAt: '2026-01-01',
    currentCourse: 'Parcours A',
    completion: 60,
    status: 'actif',
    parent: { name: 'Mme Traoré', email: 'parent@mail.com', phone: '60000000' },
    completedCourses: ['Module 1', 'Module 2'],
    inProgressCourses: [
      { name: 'Module 3', progress: 60 }
    ],
    averageScore: 78,
    avgTime: 25,
    parcours: 'A',
    activities: [
      { title: 'Lecture terminé', date: 'Hier' },
      { title: 'Quiz réussi (70%)', date: 'Il y a 2 jours' },
      { title: 'Audio écouté', date: 'Il y a 3 jours' }
    ]
  },
  {
    id: '2',
    name: 'Nadi Traoré',
    createdAt: '2026-01-01',
    currentCourse: 'Parcours B',
    completion: 45,
    status: 'inactif',
    parent: {},
    completedCourses: ['Module 1', 'Module 2', 'Module 3'],
    inProgressCourses: [
      { name: 'Module 4', progress: 45 }
    ],
    averageScore: 88,
    avgTime: 20,
    parcours: 'B',
    activities: [
      { title: 'Lecture terminé', date: 'Hier' },
      { title: 'Quiz réussi (60%)', date: 'Il y a 2 jours' }
    ]
  }
]

const learner = ref<any>({
  id: '',
  name: '',
  createdAt: '',
  currentCourse: '',
  completion: 0,
  status: '',
  parent: {},
  completedCourses: [],
  inProgressCourses: [],
  averageScore: 0,
  avgTime: 0,
  parcours: '',
  activities: []
})

// Récupère l’apprenant selon l’ID
onMounted(() => {
  const found = learnersMock.find(l => l.id === learnerId)
  if (found) learner.value = found
})
</script>
