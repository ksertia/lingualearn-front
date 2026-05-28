<template>
  <div class="page-root">

    <!-- ================= PAGE HERO ================= -->
    <div class="page-hero">
      <div class="hero-left">
        <button class="back-btn" @click="goBack" title="Retour">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="hero-text">
          <h1 class="page-title">Modules</h1>
          <p class="page-subtitle">{{ languageName || 'Gérez les modules de cette langue' }}</p>
        </div>
      </div>
      <button class="btn-primary" @click="openModal">
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-width="2" d="M12 6v12m6-6H6"/>
        </svg>
        Nouveau module
      </button>
    </div>

    <!-- ================= MAIN CARD ================= -->
    <div class="card">

      <!-- LOADING -->
      <div v-if="isFetchingModules" class="state-center">
        <div class="spinner"></div>
        <p class="state-sub">Chargement des modules…</p>
      </div>

      <!-- TABLE -->
      <div v-else-if="modules.length" class="table-wrap">
        <table class="data-table">
          <thead>
            <tr class="table-head-row">
              <th class="th">Nom</th>
              <th class="th">Niveau</th>
              <th class="th th-hide-mobile">Description</th>
              <th class="th th-center">Parcours</th>
              <th class="th th-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="m in paginatedModules"
              :key="m.id"
              class="table-row"
            >
              <!-- TITLE -->
              <td class="td td-title">{{ m.title }}</td>

              <!-- LEVEL -->
              <td class="td">
                <span class="level-badge">{{ getLevelName(m.levelId) }}</span>
              </td>

              <!-- DESC -->
              <td class="td td-hide-mobile td-desc">{{ m.description || '—' }}</td>

              <!-- COUNT -->
              <td class="td td-center">
                <span class="parcours-count">{{ parcoursCount[m.id] ?? 0 }}</span>
              </td>

              <!-- ACTIONS -->
              <td class="td td-right">
                <div class="action-btns">
                  <button class="btn-ghost-blue" @click="goToParcours(m.id)">Parcours</button>
                  <button class="btn-ghost-red" @click="removeModule(m.id)">Supprimer</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- EMPTY -->
      <div v-else class="state-center">
        <div class="empty-icon">
          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-width="1.5" d="M9 12h6m-6 4h6M5 8h14M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"/>
          </svg>
        </div>
        <h3 class="empty-title">Aucun module</h3>
        <p class="state-sub">Commencez par créer votre premier module</p>
        <button class="btn-primary" style="margin-top: 16px;" @click="openModal">
          Créer un module
        </button>
      </div>

      <!-- PAGINATION -->
      <div v-if="modules.length > perPage" class="pagination">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Précédent
        </button>
        <div class="page-numbers">
          <button
            v-for="p in totalPages"
            :key="p"
            class="page-num-btn"
            :class="{ 'page-num-btn--active': p === currentPage }"
            @click="currentPage = p"
          >{{ p }}</button>
        </div>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          Suivant
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

    </div>

    <!-- ================= CREATE MODAL ================= -->
    <Transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-box">

          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header-left">
              <div class="modal-icon modal-icon-green">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-width="2" d="M12 6v12m6-6H6"/>
                </svg>
              </div>
              <h3 class="modal-title">Nouveau module</h3>
            </div>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <form @submit.prevent="onSubmit">
              <div class="form-group">
                <label class="form-label">Nom du module</label>
                <input
                  v-model="name"
                  class="form-input"
                  placeholder="Ex. : Les salutations"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea
                  v-model="description"
                  class="form-input"
                  placeholder="Description du module"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Niveau</label>
                <select v-model="selectedLevelId" class="form-input">
                  <option value="" disabled>Choisir un niveau</option>
                  <option v-for="level in levels" :key="level.id" :value="level.id">
                    {{ level.name }}
                  </option>
                </select>
              </div>

              <p v-if="error" class="form-error">{{ error }}</p>

              <!-- Footer -->
              <div class="modal-footer">
                <button type="button" class="btn-cancel" @click="closeModal">Annuler</button>
                <button type="submit" class="btn-primary">Créer</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </Transition>

    <!-- ================= DELETE MODAL ================= -->
    <Transition name="modal-fade">
      <div v-if="moduleToDeleteId" class="modal-overlay" @click.self="moduleToDeleteId = null">
        <div class="modal-box">

          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header-left">
              <div class="modal-icon modal-icon-red">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2"/>
                </svg>
              </div>
              <div>
                <h3 class="modal-title">Supprimer le module</h3>
                <p class="modal-subtitle">Cette action est irréversible</p>
              </div>
            </div>
            <button class="modal-close" @click="moduleToDeleteId = null">✕</button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <p class="delete-confirm-text">
              Êtes-vous sûr de vouloir supprimer ce module ? Tous les parcours associés seront également supprimés.
            </p>
          </div>

          <!-- Footer -->
          <div class="modal-footer modal-footer-border">
            <button class="btn-cancel" @click="moduleToDeleteId = null">Annuler</button>
            <button class="btn-delete" @click="confirmDeleteModule">Supprimer</button>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModuleStore } from '~/stores/moduleStore'
import { useLevelStore } from '~/stores/levelStore'
import { useParcoursStore } from '~/stores/parcoursStore'
import { useLanguageStore } from '~/stores/languageStore'
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
const languageStore = useLanguageStore()
const apiService = useApiService()

const languageName = computed(() =>
  languageStore.languages.find(l => l.id === languageId)?.name || ''
)


// Stocke le nombre de parcours par module
const parcoursCount = ref<Record<string, number>>({})

// Fonction pour récupérer les modules par langue via les niveaux
const fetchModulesByLanguage = async (languageId: string) => {
  try {
    isFetchingModules.value = true
    moduleStore.module = []
    parcoursCount.value = {}

    await levelStore.fetchLevelsByLanguage(languageId)

    const allModules = []

    for (const level of levelStore.levels) {
      if (level.languageId === languageId) {
        const response = await apiService.getModulesByLevel(languageId, level.id)
        const responseData = response?.data as any || {}
        const modules = responseData.modules || []
        if (Array.isArray(modules)) {
          allModules.push(...modules)
        }
      }
    }

    moduleStore.module = allModules

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
  await languageStore.fetchLanguages()
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
const modules = computed(() => moduleStore.module)

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
    await moduleStore.createModule({
      levelId: selectedLevelId.value,
      title: name.value,
      description: description.value,
      iconUrl: '',
      index: null,
      isActive: true,
    })
    await fetchModulesByLanguage(route.params.id as string)
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
/* ===== LAYOUT ===== */
.page-root {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Inter', sans-serif;
}

/* ===== HERO ===== */
.page-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.hero-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.hero-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}
.page-subtitle {
  font-size: 13px;
  color: #9CA3AF;
  margin: 0;
}

/* ===== BACK BUTTON ===== */
.back-btn {
  height: 34px;
  width: 34px;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  border: 1px solid #E5E7EB;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s;
  flex-shrink: 0;
}
.back-btn:hover {
  background: #F3F4F6;
}

/* ===== PRIMARY BUTTON ===== */
.btn-primary {
  background: #16A34A;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(22, 163, 74, 0.3);
  transition: background 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: inherit;
}
.btn-primary:hover {
  background: #15803D;
}

/* ===== CARD ===== */
.card {
  background: #FFFFFF;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  overflow: hidden;
}

/* ===== TABLE ===== */
.table-wrap {
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.table-head-row {
  background: #FAFAFA;
}
.th {
  padding: 11px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  white-space: nowrap;
}
.th-center { text-align: center; }
.th-right { text-align: right; }
.th-hide-mobile {
  display: none;
}
@media (min-width: 768px) {
  .th-hide-mobile { display: table-cell; }
}

.table-row {
  border-bottom: 1px solid #F9FAFB;
  transition: background 0.12s;
}
.table-row:hover {
  background: #FAFAFA;
}
.table-row:last-child {
  border-bottom: none;
}

.td {
  padding: 13px 16px;
  font-size: 13px;
  color: #374151;
  vertical-align: middle;
}
.td-title {
  font-weight: 500;
  color: #111827;
}
.td-center { text-align: center; }
.td-right { text-align: right; }
.td-desc {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #6B7280;
}
.td-hide-mobile {
  display: none;
}
@media (min-width: 768px) {
  .td-hide-mobile { display: table-cell; }
}

/* ===== BADGES ===== */
.level-badge {
  background: #F3F4F6;
  color: #374151;
  border-radius: 6px;
  padding: 3px 9px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}
.parcours-count {
  color: #16A34A;
  font-weight: 600;
  font-size: 13px;
}

/* ===== ACTION BUTTONS ===== */
.action-btns {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}
.btn-ghost-blue {
  background: rgba(22, 163, 74, 0.08);
  color: #15803D;
  border: none;
  border-radius: 7px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.12s;
  font-family: inherit;
}
.btn-ghost-blue:hover {
  background: rgba(22, 163, 74, 0.15);
}
.btn-ghost-red {
  background: #FEF2F2;
  color: #DC2626;
  border: none;
  border-radius: 7px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.12s;
  font-family: inherit;
}
.btn-ghost-red:hover {
  background: #FEE2E2;
}

/* ===== STATES ===== */
.state-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}
.state-sub {
  font-size: 13px;
  color: #9CA3AF;
  margin: 6px 0 0;
}

/* Spinner */
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #DCFCE7;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  margin-bottom: 12px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty */
.empty-icon {
  width: 56px;
  height: 56px;
  background: #F0FDF4;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16A34A;
  margin-bottom: 16px;
}
.empty-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px;
}

/* ===== PAGINATION ===== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid #F3F4F6;
}
.page-btn {
  background: white;
  color: #374151;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.12s;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.page-btn:hover:not(:disabled) {
  background: #F9FAFB;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-numbers {
  display: flex;
  gap: 4px;
}
.page-num-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #E5E7EB;
  border-radius: 7px;
  background: white;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
  font-family: inherit;
}
.page-num-btn:hover {
  background: #F9FAFB;
}
.page-num-btn--active {
  background: #16A34A;
  border-color: #16A34A;
  color: white;
}

/* ===== MODAL OVERLAY ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 50;
}

/* ===== MODAL BOX ===== */
.modal-box {
  background: white;
  border-radius: 14px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 0;
}
.modal-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.modal-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.modal-icon-green {
  background: #F0FDF4;
  color: #16A34A;
}
.modal-icon-red {
  background: #FEF2F2;
  color: #DC2626;
}
.modal-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}
.modal-subtitle {
  font-size: 12px;
  color: #9CA3AF;
  margin: 2px 0 0;
}
.modal-close {
  background: none;
  border: none;
  font-size: 16px;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  transition: color 0.12s;
  flex-shrink: 0;
}
.modal-close:hover {
  color: #374151;
}

.modal-body {
  padding: 20px;
}

/* ===== FORM ===== */
.form-group {
  margin-bottom: 14px;
}
.form-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 5px;
}
.form-input {
  width: 100%;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  padding: 8px 12px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
  color: #111827;
  resize: vertical;
}
.form-input:focus {
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.10);
}
.form-error {
  font-size: 12px;
  color: #DC2626;
  margin: 0 0 12px;
}

/* ===== MODAL FOOTER ===== */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 6px;
}
.modal-footer-border {
  padding: 16px 20px;
  border-top: 1px solid #F3F4F6;
}

/* Cancel */
.btn-cancel {
  background: white;
  color: #6B7280;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.12s;
  font-family: inherit;
}
.btn-cancel:hover {
  background: #F9FAFB;
}

/* Delete */
.btn-delete {
  background: #DC2626;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.12s;
  font-family: inherit;
}
.btn-delete:hover {
  background: #B91C1C;
}

/* Delete confirm text */
.delete-confirm-text {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.6;
  margin: 0;
}

/* ===== MODAL TRANSITIONS ===== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-active .modal-box,
.modal-fade-leave-active .modal-box {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-box,
.modal-fade-leave-to .modal-box {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}
</style>
