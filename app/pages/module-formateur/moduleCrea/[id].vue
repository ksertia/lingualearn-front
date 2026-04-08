

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <section class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">

      <!-- ================= HEADER ================= -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 sm:gap-0">
        <!-- Back button -->
        <button
          class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group -ml-1 sm:-ml-2"
          @click="goBack"
          title="Retour"
        >
          <svg class="w-6 h-6 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
         <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-900 to-teal-700 bg-clip-text text-transparent text-center sm:text-left">
          Mes Modules
        </h2> 

        <button
          class="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 font-semibold text-sm sm:text-base"
          @click="openModal"
        >
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Nouveau Module
        </button>
      </div>

    <!-- ================= TABLE / CARDS DES MODULES ================= -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <!-- État de chargement -->
        <div
          v-if="isFetchingModules"
          class="p-12 sm:p-16 lg:p-20 text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl"
        >
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4 mx-auto">
            <svg class="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-lg font-medium text-gray-700">Chargement de vos modules...</p>
        </div>

        <!-- Table Desktop/Tablet -->
        <div v-else-if="modules.length" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-blue-900 to-blue-800">
              <tr>
                <th class="px-4 sm:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white text-opacity-95">Nom</th>
                <th class="px-4 sm:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white text-opacity-95 hidden md:table-cell">Niveau</th>
                <th class="px-4 sm:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white text-opacity-95 hidden lg:table-cell">Description</th>
                <th class="px-4 sm:px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-white text-opacity-95">Parcours</th>
                <th class="px-4 sm:px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-white text-opacity-95">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="m in paginatedModules"
                :key="m.id"
                class="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 group"
              >
                <td class="px-4 sm:px-6 py-5 sm:py-4 font-semibold text-lg text-teal-700 group-hover:text-teal-800">
                  {{ m.title }}
                </td>

                <td class="px-4 sm:px-6 py-5 sm:py-4 hidden md:table-cell">
                  <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-sm">
                    {{ getLevelName(m.levelId) }}
                  </span>
                </td>

                <td class="px-4 sm:px-6 py-5 sm:py-4 text-sm text-gray-600 hidden lg:table-cell max-w-xs truncate">
                  {{ m.description || '—' }}
                </td>

                <td class="px-4 sm:px-6 py-5 sm:py-4 text-center">
                  <span class="inline-flex items-center justify-center min-w-[40px] px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm font-bold shadow-sm ring-1 ring-inset ring-blue-200">
                    {{ parcoursCount[m.id] ?? '...' }}
                    <svg v-if="parcoursCount[m.id]" class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                  </span>
                </td>

                <td class="px-4 sm:px-6 py-5 sm:py-4 text-right space-x-6 space-x-reverse">
                  <button
                    class="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium text-sm hover:-translate-y-0.5"
                    @click="goToParcours(m.id)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                    Parcours
                  </button>

                  <button
                    class="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium text-sm hover:-translate-y-0.5"
                    @click="removeModule(m.id)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cards Mobile -->
        <div v-else-if="modules.length" class="grid grid-cols-1 gap-4 p-4 sm:hidden">
          <div
            v-for="m in paginatedModules"
            :key="m.id"
            class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 p-6 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <div class="font-bold text-xl text-teal-700 group-hover:text-teal-800 line-clamp-2">{{ m.title }}</div>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm">
                {{ getLevelName(m.levelId) }}
              </span>
            </div>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ m.description || 'Pas de description' }}</p>
            <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <div class="flex items-center justify-center text-sm font-bold text-blue-700">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                {{ parcoursCount[m.id] ?? 0 }} parcours
              </div>
              <div class="flex gap-2">
                <button
                  class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all font-medium text-sm"
                  @click="goToParcours(m.id)">
                  Parcours
                </button>
                <button
                  class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all font-medium text-sm"
                  @click="removeModule(m.id)">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-16 sm:p-20 lg:p-24 text-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div class="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg class="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Aucun module créé</h3>
          <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">Commencez par créer votre premier module pour cette langue.</p>
          <button
            class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg hover:-translate-y-1"
            @click="openModal">
            Créer mon premier module
          </button>
        </div>

        <!-- ================= PAGINATION ================= -->
        <div
          v-if="modules.length > perPage"
          class="flex flex-wrap items-center justify-center sm:justify-between gap-4 px-4 sm:px-6 py-6 sm:py-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-2xl mt-4"
        >
          <button
            class="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 font-semibold text-sm sm:text-base min-w-[140px]"
            :disabled="currentPage === 1"
            @click="currentPage--">
            <svg v-if="currentPage > 1" class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Précédent
          </button>

          <div class="text-base sm:text-lg font-bold text-gray-800 bg-white/60 px-6 py-3 rounded-xl shadow-md min-w-[160px] text-center">
            Page {{ currentPage }} / {{ totalPages }}
          </div>

          <button
            class="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 font-semibold text-sm sm:text-base min-w-[140px]"
            :disabled="currentPage === totalPages"
            @click="currentPage++">
            Suivant
            <svg v-if="currentPage < totalPages" class="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <div class="text-sm text-gray-600 font-medium col-span-full sm:col-span-1 text-center sm:text-left mt-2 sm:mt-0">
            {{ modules.length }} modules au total
          </div>
        </div>

      </div>

    <!-- ================= MODAL CRÉATION ================= -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-3xl w-full max-w-md sm:max-w-lg shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
          <div class="p-8">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Nouveau Module
              </h3>
              <button
                @click="closeModal"
                class="p-2 hover:bg-gray-100 rounded-2xl transition-colors duration-200"
              >
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form class="space-y-6" @submit.prevent="onSubmit">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Nom du module</label>
                <input
                  v-model="name"
                  :disabled="isLoading"
                  required
                  class="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 text-lg placeholder-gray-500 shadow-sm hover:shadow-md"
                  :placeholder="isLoading ? '' : 'Ex: Grammaire de base'"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  v-model="description"
                  :disabled="isLoading"
                  rows="3"
                  class="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 resize-vertical placeholder-gray-500 shadow-sm hover:shadow-md"
                  :placeholder="isLoading ? '' : 'Décrivez brièvement ce module...'"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Niveau</label>
                <select
                  v-model="selectedLevelId"
                  :disabled="isLoading"
                  required
                  class="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 text-lg shadow-sm hover:shadow-md appearance-none bg-white"
                >
                  <option value="" disabled class="text-gray-500">
                    Sélectionnez un niveau
                  </option>
                  <option
                    v-for="level in levels"
                    :key="level.id"
                    :value="level.id"
                    class="py-4"
                  >
                    {{ level.name }}
                  </option>
                </select>
              </div>

              <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p class="text-red-800 text-sm font-medium">{{ error }}</p>
              </div>

              <div class="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  :disabled="isLoading"
                  class="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-900 py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  :disabled="isLoading || !name || !selectedLevelId"
                  class="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-500 text-white py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isLoading ? 'Création en cours...' : 'Créer le module' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>

    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModuleStore } from '~/stores/moduleStore'
import { useLevelStore } from '~/stores/levelStore'
import { useParcoursStore } from '~/stores/parcoursStore'
import { useApiService } from '~/services/api'

definePageMeta({
  layout:'formateur'
})

/* ================= ROUTER ================= */
const route = useRoute()
const router = useRouter()

/* ================= STORES ================= */
const moduleStore = useModuleStore()
const levelStore = useLevelStore()
const parcoursStore = useParcoursStore()
const apiService = useApiService()


// Stocke le nombre de parcours par module
const parcoursCount = ref<Record<string, number>>({})

// Fonction pour récupérer les modules par langue via les niveaux
const fetchModulesByLanguage = async (languageId: string, expectedLevelId?: string) => {
  try {
    // Vider immédiatement les modules et indiquer le chargement
    isFetchingModules.value = true
    moduleStore.module = []
    parcoursCount.value = {}
    
    console.log('Début récupération modules pour langue:', languageId)
    
    // Récupérer les niveaux de cette langue
    await levelStore.fetchLevelsByLanguage(languageId)
    console.log('Niveaux récupérés:', levelStore.levels)
    
    const allModules = []
    
    // Pour chaque niveau, récupérer les modules
    for (const level of levelStore.levels) {
      console.log('Vérification niveau:', level, 'languageId:', level.languageId, 'recherché:', languageId)
      if (level.languageId === languageId) {
        console.log('Récupération modules pour niveau:', level.id)
        const response = await apiService.getModulesByLevel(languageId, level.id)
        console.log('Réponse API pour niveau', level.id, ':', response)
        
        // L'API retourne {modules: Array} au lieu d'un tableau direct
        const responseData = response?.data as any || {}
        const modules = responseData.modules || []
        console.log('Modules extraits:', modules)
        if (Array.isArray(modules)) {
          allModules.push(...modules)
        }
      }
    }
    
    console.log('Tous les modules agrégés:', allModules)
    
    // Afficher les levelId de tous les modules pour débogage
    console.log('LevelId des modules:', allModules.map(m => ({ id: m.id, title: m.title, levelId: m.levelId })))
    
    // Vérifier si le module créé est dans la liste
    if (expectedLevelId) {
      console.log('Module créé avec levelId:', expectedLevelId, 'présent dans les modules?', 
        allModules.some(m => m.levelId === expectedLevelId))
    }
    
    // Mettre à jour le store avec les modules filtrés
    moduleStore.module = allModules
    console.log('Modules chargés:', allModules)
    console.log('Store module:', moduleStore.module)
    
    // Calculer les nombres de parcours
    await parcoursStore.fetchAll()
    computeCounts()
  } catch (error) {
    console.error('Erreur lors de la récupération des modules:', error)
  } finally {
    isFetchingModules.value = false
  }
}


/* ================= PARAMÈTRES ================= */
// ID DU NIVEAU -> C'est en fait l'ID DE LA LANGUE !
const languageId = route.params.id as string

/* ================= LEVELS ================= */
const levels = computed(() => {
  // Filtrer les niveaux pour n'afficher que ceux de la langue actuelle
  return levelStore.levels.filter(level => level.languageId === route.params.id)
})
const selectedLevelId = ref('')

onMounted(async () => {
  // Récupérer les modules de la langue via les niveaux
  await fetchModulesByLanguage(languageId)
})

// Watcher pour recharger les modules quand la langue change
watch(() => route.params.id, async (newLanguageId) => {
  if (newLanguageId && newLanguageId !== languageId) {
    await fetchModulesByLanguage(newLanguageId as string)
  }
}, { immediate: false })


// 🆕 Fonction pour charger le nombre de parcours par module
const computeCounts = () => {
  const counts: Record<string, number> = {}
  parcoursStore.parcours.forEach((p: any) => {
    if (p.moduleId) {
      counts[p.moduleId] = (counts[p.moduleId] || 0) + 1
    }
  })
  parcoursCount.value = counts
}

/* ================= DATA ================= */
// Modules appartenant au niveau courant (ou langue courante)
const modules = computed(() => {
  console.log('Computed modules called, store.module:', moduleStore.module)
  return moduleStore.module
})

/* ================= UI STATE ================= */
const showModal = ref(false)
const name = ref('')
const description = ref('')
const error = ref('')
const isLoading = ref(false)
const isFetchingModules = ref(false)

// Récupérer le nom du niveau via son ID
const getLevelName = (levelId: string) => {
  const level = levels.value.find((l: any) => l.id === levelId)
  return level ? level.name : 'N/A'
}

/* ================= CHARGEMENT INITIAL ================= */
// onMounted(async () => {
//   await moduleStore.fetchModule(levelId)
// })

/* ================= NAVIGATION ================= */
/**
 * Retour à la page précédente
 */
const goBack = () => {
  router.back()
}

/**
 * Navigation vers les parcours
 * IMPORTANT :
 * → on passe l'ID DU MODULE
 */
const goToParcours = (moduleId: string) => {
  router.push({
    path: `/module-formateur/parcours/${moduleId}`
  })
}

/* ================= MODAL ================= */
const openModal = () => {
  error.value = ''
  name.value = ''
  description.value = ''
  selectedLevelId.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

/* ================= CREATE MODULE ================= */
const onSubmit = async () => {
  if (!name.value.trim()) {
    error.value = 'Le nom est obligatoire'
    return
  }

  if (!selectedLevelId.value) {
    error.value = 'Le niveau est obligatoire'
    return
  }

  try {
    isLoading.value = true
    const createdLevelId = selectedLevelId.value
    console.log('Création module avec levelId:', createdLevelId, 'languageId:', route.params.id)

    await moduleStore.createModule({
      levelId: createdLevelId,
      title: name.value,
      description: description.value,
      iconUrl: '',
      index: null,
      isActive: true,
    })

    console.log('Module créé, rechargement des modules pour languageId actuel:', route.params.id)
    
    // Attendre un peu pour que l'API ait le temps de mettre à jour
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await fetchModulesByLanguage(route.params.id as string, createdLevelId)
    closeModal()
  } catch (e) {
    console.error('Erreur création module:', e)
    error.value = 'Erreur lors de la création du module'
  } finally {
    isLoading.value = false
  }

}

/* ================= DELETE MODULE ================= */
const removeModule = async (id: string) => {
  if (!confirm('Supprimer ce module ?')) return
  await moduleStore.deleteModule(id)
  await fetchModulesByLanguage(route.params.id as string)
  currentPage.value = 1

 

}

/* ================= PAGINATION ================= */
const currentPage = ref(1)
const perPage = 10

const totalPages = computed(() =>
  Math.ceil(modules.value.length / perPage)
)

const paginatedModules = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return modules.value.slice(start, end)
})

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

/* Améliorations fluides */
.group-hover\:text-teal-800:hover {
  color: #0d9488;
}

/* Line clamp pour mobile */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar pour modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #e2e8f0, #cbd5e1);
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #cbd5e1, #94a3b8);
}

/* Responsive amélioré */
@media (max-width: 640px) {
  .grid-cols-1 {
    gap: 1rem;
  }
}
</style>
