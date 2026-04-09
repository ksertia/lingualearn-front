<template>
  <!-- ================= DÉTAILS DU PARCOURS ================= -->
  <section class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
    <!-- ================= EN-TÊTE ================= -->
    <div class="flex items-center justify-between mb-12">
      <button
          class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group -ml-1 sm:-ml-2"
          @click="goBack"
          title="Retour"
        >
          <svg class="w-6 h-6 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

      <div class="text-center sm:text-left">
        <h1 class="text-3xl lg:text-4xl font-light text-slate-900 tracking-tight mb-2">
          Parcours du module
        </h1>
        <p class="text-sm font-normal text-slate-500">
          ID du module : <span class="font-medium text-slate-700">{{ moduleId }}</span>
        </p>
      </div>
    </div>

    <!-- ================= ÉTAT DE CHARGEMENT ================= -->
    <div v-if="parcoursStore.isLoading" class="text-center py-20 px-8">
      <div class="inline-flex items-center space-x-2 text-slate-500 animate-pulse">
        <svg class="w-6 h-6 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Chargement du parcours...</span>
      </div>
    </div>

    <!-- ================= ERREUR ================= -->
    <div v-else-if="parcoursStore.error" class="text-center py-20 px-8 max-w-md mx-auto">
      <div class="bg-rose-50 border border-rose-100 rounded-2xl p-8 shadow-sm">
        <div class="w-16 h-16 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p class="text-lg font-medium text-slate-900 mb-2">{{ parcoursStore.error }}</p>
        <p class="text-sm text-slate-500">Veuillez réessayer dans quelques instants.</p>
      </div>
    </div>

    <!-- ================= CONTENU ================= -->
    <div v-else class="max-w-4xl mx-auto space-y-8">

      <!-- ================= AJOUT D'UN PARCOURS ================= -->
      <div class="bg-white/80 backdrop-blur-sm shadow-sm rounded-3xl border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300">
        <h3 class="text-xl font-medium text-slate-900 mb-6 pb-2 border-b border-slate-100">
          Ajouter un nouveau parcours
        </h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Titre du parcours
            </label>
            <input
              v-model="titleInput"
              type="text"
              class="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200 shadow-sm"
              placeholder="Ex: «Parcours Débutant»"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Description courte
            </label>
            <input
              v-model="pathDescription"
              type="text"
              class="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200 shadow-sm"
              placeholder="Ex: Introduction aux bases..."
            />
          </div>
        </div>

        <div class="mt-8 flex justify-end">
          <button
            @click="addPath"
            class="group px-6 py-3 bg-gradient-to-r from-blue-500/90 via-blue-600/90 to-blue-500/90 text-white font-medium rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center space-x-2"
          >
            <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span> Créer parcours</span>
          </button>
        </div>

        <p v-if="errorPath" class="mt-4 text-sm text-rose-500 px-3 py-2.5 bg-rose-50/80 border border-rose-100 rounded-xl">
          {{ errorPath }}
        </p>
      </div>

      <!-- ================= LISTE DES PARCOURS ================= -->
      <div class="bg-white/80 backdrop-blur-sm shadow-sm rounded-3xl border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300">
        <div class="px-8 py-8 border-b border-slate-100">
          <h3 class="text-xl font-medium text-slate-900">
            Parcours existants ({{ parcoursStore.parcours.length }})
          </h3>
        </div>

        <div class="overflow-x-auto">
          <template v-if="parcoursStore.parcours.length" class="min-w-full divide-y divide-slate-100">
            <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-gradient-to-r from-blue-100 to-blue-100/50 backdrop-blue-sm sticky top-0 z-10">
              <tr>
                <th class="px-8 py-5 text-left text-sm font-bolder text-slate-700 uppercase  tracking-wider">#</th>
                <th class="px-8 py-5 text-left text-sm font-bolder text-slate-700 uppercase tracking-wider">Titre</th>
                <th class="px-8 py-5 text-left text-sm font-bolder text-slate-700 uppercase tracking-wider">Description</th>
                <th class="px-8 py-5 text-left text-sm font-bolder text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-50">
              <tr v-for="(p, index) in parcoursStore.parcours" :key="p.id" class="hover:bg-slate-50/50 transition-all duration-200">
                <td class="px-8 py-6 font-semibold text-slate-900 text-lg">{{ index + 1 }}</td>
                <td class="px-8 py-6">
                  <div class="font-semibold text-slate-900 text-lg">{{ p.title }}</div>
                </td>
                <td class="px-8 py-6">
                  <p class="text-sm text-slate-600 max-w-md">{{ p.description || 'Aucune description' }}</p>
                </td>
                <td class="px-8 py-6">
                  <div class="flex gap-2">
                    <button
                      @click="goToEtapes(p)"
                      class="px-5 py-2.5 bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-600/90 hover:to-blue-700/90 text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 flex items-center space-x-1.5 text-sm"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                      <span>Étapes</span>
                    </button>
                    <button
                      @click="removePath(p)"
                      class="px-5 py-2.5 bg-gradient-to-r from-rose-500/90 to-rose-600/90 hover:from-rose-600/90 hover:to-rose-700/90 text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 flex items-center space-x-1.5 text-sm"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      <span>Supprimer</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            </table>
          </template>
                <!-- Empty State -->
          <template v-else class="text-center py-20 px-12 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100 rounded-b-3xl">
          <div class="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg class="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
          </div>
          <h4 class="text-2xl font-light text-slate-900 mb-2">Aucun parcours</h4>
          <p class="text-lg text-slate-500 mb-6 max-w-md mx-auto">
            Créez votre premier parcours pour commencer à organiser le contenu d'apprentissage de ce module.
          </p>
          <p class="text-sm font-medium text-slate-600 border border-dashed border-slate-300 rounded-xl py-3 px-6 bg-slate-50/50 inline-block hover:bg-slate-100 transition-colors cursor-default">
            💡 Conseil : Commencez par un parcours «Débutant»
          </p>
        </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useParcoursStore } from '~/stores/parcoursStore'

definePageMeta({
  layout: 'formateur'
})

/* ================= ROUTER ================= */
const route = useRoute()
const router = useRouter()
const moduleId = route.params.id as string

/* ================= STORE ================= */
const parcoursStore = useParcoursStore()

/* ================= CHARGEMENT ================= */
onMounted(async () => {
  await parcoursStore.fetchAll(moduleId)
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

