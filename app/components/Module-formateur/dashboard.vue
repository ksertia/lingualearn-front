<template>
  <div class="page-root">

    <!-- Hero -->
    <div class="page-hero">
      <h1 class="page-heading">Choisissez une langue</h1>
      <p class="page-sub">Sélectionnez une langue pour accéder aux modules d'apprentissage</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="state-center">
      <div class="spinner"></div>
      <p class="state-text">Chargement des langues…</p>
    </div>

    <!-- Grid -->
    <div v-else-if="languages && languages.length" class="lang-grid">
      <div v-for="lang in languages" :key="lang.id" class="lang-card">
        <div class="lang-card-top">
          <div class="lang-icon">🌍</div>
          <div>
            <h2 class="lang-name">{{ lang.name }}</h2>
            <p class="lang-avail">Langue disponible</p>
          </div>
        </div>
        <p class="lang-desc">{{ lang.description || 'Aucune description disponible pour cette langue.' }}</p>
        <div class="lang-action">
          <button class="btn-primary" @click="goToModules(lang.id)">
            Voir modules
            <svg class="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="empty-card">
      <div class="empty-icon">📚</div>
      <p class="empty-title">Aucune langue disponible</p>
      <p class="empty-sub">Les langues apparaîtront ici dès qu'elles seront ajoutées</p>
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

const goToModules = (languageId: string) => {
  navigateTo(`module-formateur/moduleCrea/${languageId}`)
}

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
    languages.value = languageStore.visibleLanguages
  } catch (error) {
    console.error('Erreur lors du chargement des langues', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.page-root {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}


.page-heading {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.03em;
}

.page-sub {
  font-size: 13px;
  color: #9CA3AF;
  margin-top: 3px;
}

/* Loading */
.state-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 12px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid #E5E7EB;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.state-text { font-size: 13px; color: #9CA3AF; }

/* Grid */
.lang-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.lang-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px 22px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 3px solid #16A34A;
  transition: box-shadow 0.2s, transform 0.2s;
}

.lang-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.07);
}

.lang-card-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lang-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(22,163,74,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.lang-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.lang-avail {
  font-size: 12px;
  color: #9CA3AF;
  margin: 2px 0 0;
}

.lang-desc {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.lang-action {
  display: flex;
  justify-content: flex-end;
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: #16A34A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(22,163,74,.3);
  transition: background 0.15s;
  font-family: inherit;
}

.btn-primary:hover { background: #15803D; }

.btn-arrow { width: 14px; height: 14px; }

/* Empty */
.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 32px;
  gap: 10px;
  background: #FFFFFF;
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  text-align: center;
}

.empty-icon { font-size: 40px; }
.empty-title { font-size: 15px; font-weight: 600; color: #111827; margin: 0; }
.empty-sub { font-size: 13px; color: #9CA3AF; margin: 0; }
</style>
