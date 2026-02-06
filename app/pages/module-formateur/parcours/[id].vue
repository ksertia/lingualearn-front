<template>
  <!-- ================= DÉTAILS DU PARCOURS ================= -->
  <section class="p-6 max-w-5xl mx-auto">

    <!-- ================= EN-TÊTE ================= -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-blue-900">
          Parcours du module
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          ID du module :
          <span class="font-medium text-gray-700">{{ moduleId }}</span>
        </p>
      </div>

      <button
        @click="goBack"
        class="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
      >
        Retour
      </button>
    </div>

    <!-- ================= ÉTAT DE CHARGEMENT ================= -->
    <div v-if="parcoursStore.isLoading" class="text-center py-10 text-gray-600">
      Chargement du parcours...
    </div>

    <!-- ================= ERREUR ================= -->
    <div v-else-if="parcoursStore.error" class="text-center py-10 text-red-600">
      {{ parcoursStore.error }}
    </div>

    <!-- ================= CONTENU ================= -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">

      <!-- ================= AJOUT D’UN PARCOURS ================= -->
      <div class="px-6 py-6 border-b border-gray-100">
        <h3 class="text-sm font-medium text-gray-700 mb-4">
          Ajouter un parcours
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              v-model="titleInput"
              type="text"
              class="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
              placeholder="Titre du parcours"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              v-model="pathDescription"
              type="text"
              class="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
              placeholder="Courte description"
            />
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            @click="addPath"
            class="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-sm"
          >
            Ajouter le parcours
          </button>
        </div>

        <p v-if="errorPath" class="mt-2 text-sm text-red-600">
          {{ errorPath }}
        </p>
      </div>

      <!-- ================= LISTE DES PARCOURS ================= -->
      <div class="px-6 py-6">
        <h3 class="text-sm font-medium text-gray-700 mb-4">
          Liste des parcours
        </h3>

        <table v-if="parcoursStore.parcours.length" class="min-w-full divide-y divide-gray-200">
          <thead class="bg-blue-900 text-white">
            <tr>
              <th class="px-6 py-3 text-left text-xs uppercase">#</th>
              <th class="px-6 py-3 text-left text-xs uppercase">Titre</th>
              <th class="px-6 py-3 text-left text-xs uppercase">Description</th>
              <th class="px-6 py-3 text-left text-xs uppercase">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-for="(p, index) in parcoursStore.parcours" :key="p.moduleId" class="hover:bg-gray-50">
              <td class="px-6 py-4">{{ index + 1 }}</td>
              <td class="px-6 py-4 font-medium text-teal-600">{{ p.title }}</td>
              <td class="px-6 py-4 text-gray-500">{{ p.description || '-' }}</td>
              <td class="px-6 py-4 flex gap-2">
                <button
                  @click="goToEtapes(p)"
                  class="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-sm"
                >
                  Voir étapes
                </button>
                <button
                  @click="removePath(p)"
                  class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="text-center text-gray-600 py-6">
          Aucun parcours n’est encore associé à ce module.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useParcoursStore } from '~/stores/parcoursStore'

/* ================= ROUTER ================= */
const route = useRoute()
const router = useRouter()
const moduleId = route.params.id as string

/* ================= STORE ================= */
const parcoursStore = useParcoursStore()

/* ================= CHARGEMENT ================= */
onMounted(async () => {
  await parcoursStore.fetchAll()
})

/* ================= UI ================= */
const goBack = () => router.back()

/* ================= FORMULAIRE ================= */
const titleInput = ref('')
const pathDescription = ref('')
const errorPath = ref('')

const addPath = async () => {
  errorPath.value = ''
  if (!titleInput.value.trim()) {
    errorPath.value = 'Le titre est obligatoire'
    return
  }

  try {
    await parcoursStore.create({
      moduleId: moduleId,
      title: titleInput.value.trim(),
      description: pathDescription.value.trim(),
      // index: 0,
      tempResaListime: 0,
      thumbnailUrl: "",
      difficulty: "easy",
      estimatedHours: 0,
      isActive: true
    })
    titleInput.value = ''
    pathDescription.value = ''
  } catch (err: any) {
    errorPath.value = err.message || 'Erreur lors de la création'
  }
}

/* ================= NAVIGATION ================= */
const goToEtapes = (p: any) => {
  router.push(`/module-formateur/etapes/${p.id}`)
}

const removePath = async (p: any) => {
  if (!confirm(`Supprimer le parcours "${p.title}" ?`)) return
  await parcoursStore.removePath(p.id)
}
</script>

<style scoped>
/* Stylisé via Tailwind */
</style>
