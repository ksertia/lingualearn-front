<template>
  <div class="dashboard-container">

    <!-- Langues -->
    <div class="langue">
      <h2 class="section-title">Sélectionnez une langue</h2>

      <!-- Cards -->
      <div v-if="languageStore.languages && languages.length" class="cards-container">

        <div
          v-for="(lang, index) in languages"
          :key="lang.id"
          class="language-card"
        >
          <!-- Header card -->
          <div class="card-header">
            <div class="lang-icon">
              🌍
            </div>

            <div class="lang-title">
              {{ lang.name }}
            </div>
          </div>

          <!-- Description -->
          <p class="lang-description">
            {{ lang.description || 'Aucune description disponible pour cette langue.' }}
          </p>

          <!-- Action -->
          <button @click="goToModules(lang.id)" class="module-btn eye-btn">
  <span class="eye-wrapper">
    👁️
  </span>
  <!-- Voir modules -->
</button>

        </div>

      </div>

      <p v-else class="empty-state">
        Aucune langue disponible pour le moment.
      </p>
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
  description: string
}

const router = useRouter()
const languages = ref<Language[]>([])
const languageStore = useLanguageStore()
const levelStore = useLevelStore()

// Redirection vers les modules d’une langue
const goToModules = (languageId: string) => {
  const url = `module-formateur/moduleCrea/${languageId}`
  
  console.log('URL finale =', url)
  navigateTo(url)
}

// Chargement des langues (inchangé)
onMounted(async () => {
  try {
    await languageStore.fetchLanguages() 
    await levelStore.fetchLevels()
    languages.value = languageStore.languages
  } catch (error) {
    console.error("Erreur lors du chargement des langues", error)
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
