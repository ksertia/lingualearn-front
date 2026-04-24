<template>
  <div class="max-w-7xl mx-auto px-6 lg:px-8 py-10">
    <section class="bg-white rounded-3xl border border-slate-200 shadow-sm">

      <!-- ================= HEADER ================= -->
      <div class="flex items-center justify-between px-6 py-6 border-b border-slate-100">
        
        <!-- Back -->
        <button
          class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group -ml-1 sm:-ml-2"
          @click="goBack"
          title="Retour"
        >
          <svg class="w-6 h-6 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <!-- Action -->
        <button
          @click="openModal"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-width="2" d="M12 6v12m6-6H6"/>
          </svg>
          Nouveau module
        </button>
      </div>

      <!-- ================= CONTENT ================= -->
      <div class="p-6">

        <!-- LOADING -->
        <div v-if="isFetchingModules" class="text-center py-16">
          <div class="animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p class="text-slate-500 text-sm">Chargement des modules...</p>
        </div>

        <!-- TABLE -->
        <div v-else-if="modules.length" class="overflow-x-auto">
          <table class="w-full">
            
            <!-- HEAD -->
            <thead>
              <tr class="text-xs text-slate-500 uppercase border-b border-slate-200">
                <th class="py-3 text-left">Nom</th>
                <th class="py-3 text-left hidden md:table-cell">Niveau</th>
                <th class="py-3 text-left hidden lg:table-cell">Description</th>
                <th class="py-3 text-center">Parcours</th>
                <th class="py-3 text-right">Actions</th>
              </tr>
            </thead>

            <!-- BODY -->
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="m in paginatedModules"
                :key="m.id"
                class="hover:bg-slate-50 transition"
              >
                <!-- TITLE -->
                <td class="py-4 font-medium text-slate-800">
                  {{ m.title }}
                </td>

                <!-- LEVEL -->
                <td class="hidden md:table-cell">
                  <span class="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                    {{ getLevelName(m.levelId) }}
                  </span>
                </td>

                <!-- DESC -->
                <td class="hidden lg:table-cell text-sm text-slate-500 max-w-xs truncate">
                  {{ m.description || '—' }}
                </td>

                <!-- COUNT -->
                <td class="text-center">
                  <span class="text-sm font-medium text-blue-600">
                    {{ parcoursCount[m.id] ?? 0 }}
                  </span>
                </td>

                <!-- ACTIONS -->
                <td class="text-right">
                  <div class="flex justify-end gap-3">
                    
                    <button
                      @click="goToParcours(m.id)"
                      class="px-4 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      Parcours
                    </button>

                    <button
                      @click="removeModule(m.id)"
                      class="px-4 py-2 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      Supprimer
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>

          </table>
        </div>

        <!-- EMPTY -->
        <div v-else class="text-center py-20">
          <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-width="1.5" d="M9 12h6m-6 4h6"/>
            </svg>
          </div>

          <h3 class="text-lg font-medium text-slate-800 mb-2">
            Aucun module
          </h3>

          <p class="text-sm text-slate-500 mb-6">
            Commencez par créer votre premier module
          </p>

          <button
            @click="openModal"
            class="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            Créer un module
          </button>
        </div>

        <!-- PAGINATION -->
        <div
          v-if="modules.length > perPage"
          class="flex items-center justify-between mt-8 pt-6 border-t border-slate-100"
        >
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Précédent
          </button>

          <span class="text-sm text-slate-500">
            Page {{ currentPage }} / {{ totalPages }}
          </span>

          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Suivant
          </button>
        </div>

      </div>

      <!-- ================= MODAL ================= -->
      <transition name="fade">
        <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div class="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-slate-800">Nouveau module</h3>
              <button @click="closeModal" class="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form class="space-y-4" @submit.prevent="onSubmit">
              
              <input
                v-model="name"
                placeholder="Nom du module"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
              />

              <textarea
                v-model="description"
                placeholder="Description"
                rows="3"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
              ></textarea>

              <select
                v-model="selectedLevelId"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
              >
                <option value="" disabled>Choisir un niveau</option>
                <option v-for="level in levels" :key="level.id" :value="level.id">
                  {{ level.name }}
                </option>
              </select>

              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  class="flex-1 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  Créer
                </button>
              </div>

            </form>

          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="moduleToDeleteId" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div class="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <h3 class="text-lg font-semibold text-slate-800 mb-2">Supprimer le module</h3>
            <p class="text-sm text-slate-600 mb-6">Cette action est irréversible. Voulez-vous continuer ?</p>
            <div class="flex justify-end gap-3">
              <button @click="moduleToDeleteId = null" class="px-4 py-2 rounded-lg border border-slate-200 text-slate-600">Annuler</button>
              <button @click="confirmDeleteModule" class="px-4 py-2 rounded-lg bg-red-600 text-white">Supprimer</button>
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
const moduleToDeleteId = ref<string | null>(null)

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
  moduleToDeleteId.value = id
}

const confirmDeleteModule = async () => {
  if (!moduleToDeleteId.value) return
  await moduleStore.deleteModule(moduleToDeleteId.value)
  await fetchModulesByLanguage(route.params.id as string)
  currentPage.value = 1
  moduleToDeleteId.value = null
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
