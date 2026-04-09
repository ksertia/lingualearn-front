<template>
  <div class="min-h-screen bg-slate-50 px-6 py-10">

    <!-- HEADER -->
    <div class="max-w-6xl mx-auto mb-10">
      <h1 class="text-3xl font-bold text-slate-800">
        Choisissez une langue
      </h1>
      <p class="text-slate-500 mt-1">
        Sélectionnez une langue pour accéder aux modules d’apprentissage
      </p>
    </div>

    <!-- LOADING -->
    <div
      v-if="isLoading"
      class="max-w-6xl mx-auto flex flex-col items-center justify-center py-20"
    >
      <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="mt-4 text-slate-500 text-sm">Chargement des langues...</p>
    </div>

    <!-- CONTENT -->
    <div v-else class="max-w-6xl mx-auto">

      <!-- GRID -->
      <div
        v-if="languages && languages.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >

        <div
          v-for="lang in languages"
          :key="lang.id"
          class="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >

          <!-- HEADER CARD -->
          <div class="flex items-center gap-3 mb-4">
            
            <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-xl">
              🌍
            </div>

            <div>
              <h2 class="font-semibold text-slate-800 group-hover:text-blue-600 transition">
                {{ lang.name }}
              </h2>
              <p class="text-xs text-slate-400">
                Langue disponible
              </p>
            </div>
          </div>

          <!-- DESCRIPTION -->
          <p class="text-sm text-slate-500 leading-relaxed line-clamp-3 min-h-[60px]">
            {{ lang.description || "Aucune description disponible pour cette langue." }}
          </p>

          <!-- ACTION -->
          <div class="mt-6 flex justify-end">
            <button
              @click="goToModules(lang.id)"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-95 transition"
            >
              <span>Voir modules</span>
              <span class="group-hover:translate-x-1 transition">→</span>
            </button>
          </div>

        </div>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-else
        class="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm"
      >
        <div class="text-5xl mb-4">📚</div>

        <h3 class="text-lg font-semibold text-slate-800">
          Aucune langue disponible
        </h3>

        <p class="text-slate-500 text-sm mt-2">
          Les langues apparaîtront ici dès qu’elles seront ajoutées
        </p>

        <button
          class="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition"
        >
          Rafraîchir
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '~/stores/languageStore'
import { useLevelStore } from '~/stores/levelStore'

interface Language {
  id: string
  name: string
  description?: string
}

const router = useRouter()
const languages = ref<Language[]>([])
const languageStore = useLanguageStore()
const levelStore = useLevelStore()

const isLoading = ref()

// Redirection vers les modules d’une langue
const goToModules = (languageId: string) => {
  const url = `module-formateur/moduleCrea/${languageId}`
  
  console.log('URL finale =', url)
  navigateTo(url)
}

// Chargement des langues (inchangé)
onMounted(async () => {
  isLoading.value = true
  try {
    await languageStore.fetchLanguages()
    languages.value = languageStore.visibleLanguages
  } catch (error) {
    console.error("Erreur lors du chargement des langues", error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Layout général */
.dashboard-container {
  padding: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #0f172a;
}

/* Grid responsive */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

/* Card */
.language-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  transition: all .25s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 190px;
}

.language-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgba(0,0,0,0.10);
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.lang-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #1e3a8a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.lang-title {
  font-weight: 600;
  font-size: 18px;
  color: #0f172a;
}

/* Description */
.lang-description {
  font-size: 14px;
  color: #475569;
  margin: 12px 0 18px;
  line-height: 1.5;
  flex-grow: 1;
}

/* Bouton */
.module-btn {
  background: #1e3a8a;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background .2s ease;
}

.module-btn:hover {
  background: #172554;
}

/* Empty state */
.empty-state {
  margin-top: 20px;
  color: #64748b;
}

.eye-btn:hover .eye-wrapper{
  transform: scale(1.2);
}

.eye-wrapper{
  display:inline-block;
  transition: transform .2s ease;
}

</style>
