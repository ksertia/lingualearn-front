<template>
  <section class="bg-gray-50 p-6 rounded-lg shadow-sm">

    <!-- ================= HEADER ================= -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold text-blue-900">
        Modules
      </h2>

      <button
        class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md shadow-md"
        @click="openModal"
      >
        + Nouveau
      </button>
    </div>

    <!-- ================= TABLE DES MODULES ================= -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table
        v-if="modules.length"
        class="min-w-full divide-y divide-gray-200"
      >
        <thead class="bg-blue-900 text-white">
          <tr>
            <th class="px-6 py-3">Nom</th>
            <th class="px-6 py-3">Niveau</th>
            <th class="px-6 py-3">Description</th>
            <!-- 🆕 NOUVELLE COLONNE -->
            <th class="px-6 py-3 text-center">Total parcours</th>

            <th class="px-6 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(m, index) in paginatedModules"
            :key="m.id"
            class="hover:bg-gray-50"
          >
            <!-- INDEX -->
            <!-- <td class="px-6 py-4 text-sm">
              {{ index + 1 }}
            </td> -->

            <!-- NOM DU MODULE -->
            <td class="px-6 py-4 font-medium text-teal-600">
              {{ m.title }}
            </td>

            <!-- NIVEAU (INFO VISUELLE SEULEMENT) -->
            <td class="px-6 py-4">
              <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                {{ getLevelName(m.levelId) }}
              </span>
            </td>

            <!-- DESCRIPTION -->
            <td class="px-6 py-4 text-gray-500">
              {{ m.description || '-' }}
            </td>
            <!-- 🆕 TOTAL PARCOURS -->
            <td class="px-6 py-4 text-center">
              <span
              class="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
              {{ parcoursCount[m.id] ?? '...' }}
              </span>
            </td>

            <!-- ================= ACTIONS ================= -->
            <td class="px-6 py-4 flex gap-2">
              <!-- ✅ ICI LA CORRECTION IMPORTANTE -->
              <!-- On envoie l'ID DU MODULE, PAS DU NIVEAU -->
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                @click="goToParcours(m.id)">
                  Parcours
              </button>

              <button
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                @click="removeModule(m.id)"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-else
        class="p-6 text-center text-gray-500"
      >
        Aucun module pour le moment
      </div>


       <!-- ================= PAGINATION ================= -->
        <div
      v-if="modules.length > perPage"
      class="flex items-center justify-between px-6 py-4 border-t bg-gray-50">

  <button
    class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
    :disabled="currentPage === 1"
    @click="currentPage--">
    ← Précédent
  </button>

      <div class="text-sm text-gray-600 font-medium">
        Page {{ currentPage }} / {{ totalPages }}
      </div>

      <button
        class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
        :disabled="currentPage === totalPages"
        @click="currentPage++">
        Suivant →
      </button>

    <div class="text-sm text-gray-500 mb-2">
      {{ modules.length }} modules au total
    </div>
</div>
  

    </div>

    <!-- ================= MODAL CRÉATION ================= -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg w-full max-w-md p-6">
          <h3 class="text-xl font-semibold mb-4">
            Créer un module
          </h3>

          <div class="space-y-4">
            <input
              v-model="name"
              placeholder="Nom du module"
              class="w-full border px-3 py-2 rounded"
            />

            <textarea
              v-model="description"
              placeholder="Description"
              class="w-full border px-3 py-2 rounded"
            />

            <!-- Sélection du niveau -->
            <select
              v-model="selectedLevelId"
              class="w-full border px-3 py-2 rounded"
            >
              <option value="" disabled>
                -- Sélectionner un niveau --
              </option>

              <option
                v-for="level in levels"
                :key="level.id"
                :value="level.id"
              >
                {{ level.name }}
              </option>
            </select>

            <p v-if="error" class="text-red-600 text-sm">
              {{ error }}
            </p>

            <div class="flex justify-end gap-3">
              <button @click="closeModal">
                Annuler
              </button>

              <button
                class="bg-orange-500 text-white px-4 py-2 rounded"
                :disabled="isLoading"
                @click="onSubmit"
              >
                {{ isLoading ? 'Création...' : 'OK' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModuleStore } from '~/stores/moduleStore'
import { useLevelStore } from '~/stores/levelStore'
import { useParcoursStore } from '~/stores/parcoursStore'

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


// Stocke le nombre de parcours par module
const parcoursCount = ref<Record<string, number>>({})


/* ================= PARAMÈTRES ================= */
// ID DU NIVEAU -> C'est en fait l'ID DE LA LANGUE !
const languageId = route.params.id as string

/* ================= LEVELS ================= */
const levels = computed(() => levelStore.levels)
const selectedLevelId = ref('')

onMounted(async () => {
  // modules de la langue
  await moduleStore.fetchModule(languageId)

  // niveaux
  await levelStore.fetchLevelsByLanguage(languageId)

  // 🆕 charger le nombre de parcours pour chaque module
  await parcoursStore.fetchAll()
  computeCounts()
})


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
const modules = computed(() => moduleStore.module)

/* ================= UI STATE ================= */
const showModal = ref(false)
const name = ref('')
const description = ref('')
const error = ref('')
const isLoading = ref(false)

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

    await moduleStore.createModule({
      levelId: selectedLevelId.value,
      title: name.value,
      description: description.value,
      iconUrl: '',
      index: null,
      isActive: true,
    })

    await moduleStore.fetchModule(languageId)
    closeModal()
  } catch (e) {
    error.value = 'Erreur lors de la création du module'
  } finally {
    isLoading.value = false
  }
  await moduleStore.fetchModule(languageId)
  currentPage.value = 1

}

/* ================= DELETE MODULE ================= */
const removeModule = async (id: string) => {
  if (!confirm('Supprimer ce module ?')) return
  await moduleStore.deleteModule(id)
  await moduleStore.fetchModule(languageId)

  await moduleStore.fetchModule(languageId)
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
/* Stylisé avec Tailwind */
</style>
