<template>
  <div class="dashboard-container">
    <!-- Langues -->
    <div class="langue">
      <h2 class="section-title">{{ resolvedTitle }}</h2>

      <div
        v-if="resolvedLoading"
        class="p-8 text-center text-gray-500"
      >
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mr-2"></div>
        Chargement des langues...
      </div>

      <div v-else>
        <div v-if="resolvedLanguages.length" class="cards-container">
          <div v-for="(lang, index) in resolvedLanguages" :key="lang.id ?? index" class="language-card">
            <div class="card-header">
              <div class="lang-icon">
                🌍
              </div>

              <div class="lang-title">
                {{ lang.name || lang.title || 'Langue' }}
              </div>
            </div>

            <!-- Description -->
            <p class="lang-description">
              {{ lang.description || 'Aucune description disponible pour cette langue.' }}
            </p>

            <!-- Action -->
            <button @click="handleSelectLanguage(lang.id)" class="module-btn eye-btn">
              <span class="eye-wrapper">
                👁️
              </span>
            </button>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>
            {{ emptyLabel }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '~/stores/languageStore'
import { useLevelStore } from '~/stores/levelStore'

interface Language {
  id: string
  name?: string
  title?: string
  description?: string
}

const props = defineProps<{
  languages?: Language[]
  loading?: boolean
  title?: string
  emptyLabel?: string
}>()

const emit = defineEmits<{
  (e: 'select-language', languageId: string): void
}>()

const languages = ref<Language[]>([])
const languageStore = useLanguageStore()
const levelStore = useLevelStore()

const isLoading = ref(false)

const resolvedLanguages = computed(() => {
  if (Array.isArray(props.languages)) {
    return props.languages
  }
  return languages.value
})

const resolvedLoading = computed(() => {
  if (typeof props.loading === 'boolean') return props.loading
  return isLoading.value
})

const resolvedTitle = computed(() => props.title || 'Sélectionnez une langue')

const emptyLabel = computed(() => props.emptyLabel || 'Aucune langue disponible pour le moment.')

const handleSelectLanguage = (languageId?: string) => {
  if (!languageId) return
  if (Array.isArray(props.languages)) {
    emit('select-language', languageId)
    return
  }
  const url = `module-formateur/moduleCrea/${languageId}`
  console.log('URL finale =', url)
  navigateTo(url)
}

onMounted(async () => {
  if (Array.isArray(props.languages)) return
  isLoading.value = true
  try {
    await languageStore.fetchLanguages()
    await levelStore.fetchLevels()
    languages.value = languageStore.languages
  } catch (error) {
    console.error('Erreur lors du chargement des langues', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>

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
