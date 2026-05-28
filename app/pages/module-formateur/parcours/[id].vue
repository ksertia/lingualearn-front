<template>
  <div class="page-root">

    <!-- Hero -->
    <div class="page-hero">
      <button class="btn-back" @click="goBack" title="Retour">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="back-ico">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="page-heading">Parcours du module</h1>
        <p class="page-sub">Gérez les parcours d'apprentissage de ce module</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="parcoursStore.isLoading" class="state-center">
      <div class="spinner"></div>
      <p class="state-text">Chargement du parcours…</p>
    </div>

    <!-- Error -->
    <div v-else-if="parcoursStore.error" class="error-card">
      <svg class="error-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="error-title">{{ parcoursStore.error }}</p>
      <p class="error-sub">Veuillez réessayer dans quelques instants.</p>
    </div>

    <template v-else>

      <!-- Toast -->
      <div v-if="toast.message" class="toast" :class="toast.type === 'success' ? 'toast--ok' : 'toast--err'">
        {{ toast.message }}
      </div>

      <!-- Create form -->
      <div class="card">
        <h3 class="card-title">Ajouter un nouveau parcours</h3>
        <div class="form-grid">
          <div class="field">
            <label class="field-label">Titre du parcours</label>
            <input v-model="titleInput" type="text" class="field-input" placeholder="Ex: «Parcours Débutant»" />
          </div>
          <div class="field">
            <label class="field-label">Description courte</label>
            <input v-model="pathDescription" type="text" class="field-input" placeholder="Ex: Introduction aux bases..." />
          </div>
        </div>
        <p v-if="errorPath" class="form-error">{{ errorPath }}</p>
        <div class="form-actions">
          <button class="btn-primary" @click="addPath">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-ico">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Créer parcours
          </button>
        </div>
      </div>

      <!-- List -->
      <div class="card card--flush">
        <div class="card-header">
          <h3 class="card-title">Parcours existants</h3>
          <span class="badge">{{ parcoursStore.parcours.length }}</span>
        </div>

        <div v-if="parcoursStore.parcours.length" class="table-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th>Titre</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, index) in parcoursStore.parcours" :key="p.id">
                <td class="td-num">{{ index + 1 }}</td>
                <td><span class="td-title">{{ p.title }}</span></td>
                <td><span class="td-desc">{{ p.description || 'Aucune description' }}</span></td>
                <td>
                  <div class="row-actions">
                    <button class="btn-action btn-action--go" @click="goToEtapes(p)">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-action-ico">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                      Étapes
                    </button>
                    <button class="btn-action btn-action--del" @click="removePath(p)">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-action-ico">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📋</div>
          <p class="empty-title">Aucun parcours</p>
          <p class="empty-sub">Créez votre premier parcours pour commencer à organiser le contenu d'apprentissage.</p>
        </div>
      </div>

    </template>

    <!-- Delete modal -->
    <div v-if="pathToDelete" class="modal-overlay">
      <div class="modal-box">
        <div class="del-header">
          <div class="del-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="del-icon-svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <p class="del-title">Supprimer le parcours</p>
            <p class="del-sub">Cette action est irréversible.</p>
          </div>
        </div>
        <p class="del-msg">Voulez-vous supprimer <span class="del-name">{{ pathToDelete.title }}</span> ?</p>
        <div class="del-actions">
          <button class="btn-cancel" @click="pathToDelete = null">Annuler</button>
          <button class="btn-danger" @click="confirmRemovePath">Supprimer</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useParcoursStore } from '~/stores/parcoursStore'

definePageMeta({
  layout: 'formateur'
})

const route = useRoute()
const router = useRouter()
const moduleId = route.params.id as string

const parcoursStore = useParcoursStore()

onMounted(async () => {
  await parcoursStore.fetchAll(moduleId)
})

const goBack = () => router.back()

const titleInput = ref('')
const pathDescription = ref('')
const errorPath = ref('')
const pathToDelete = ref<any | null>(null)
const toast = ref({ message: '', type: 'success' as 'success' | 'error' })

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { message, type }
  setTimeout(() => (toast.value.message = ''), 3000)
}

const addPath = async () => {
  errorPath.value = ''
  if (!titleInput.value.trim()) {
    errorPath.value = 'Le titre est obligatoire'
    return
  }

  try {
    const createdTitle = titleInput.value.trim()
    await parcoursStore.create({
      moduleId: moduleId,
      title: createdTitle,
      description: pathDescription.value.trim(),
      thumbnailUrl: "",
      difficulty: "easy",
      estimatedHours: 0,
      isActive: true
    })
    titleInput.value = ''
    pathDescription.value = ''
    showToast(`Le parcours "${createdTitle}" a été créé avec succès.`)
  } catch (err: any) {
    errorPath.value = err.message || 'Erreur lors de la création'
    showToast(errorPath.value, 'error')
  }
}

const goToEtapes = (p: any) => {
  router.push(`/module-formateur/etapes/${p.id}`)
}

const removePath = async (p: any) => {
  pathToDelete.value = p
}

const confirmRemovePath = async () => {
  if (!pathToDelete.value) return
  const title = pathToDelete.value.title
  await parcoursStore.removePath(pathToDelete.value.id)
  pathToDelete.value = null
  showToast(`Le parcours "${title}" a été supprimé avec succès.`)
}
</script>

<style scoped>
.page-root {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-hero {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-heading {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.03em;
  margin: 0;
}

.page-sub {
  font-size: 13px;
  color: #9CA3AF;
  margin-top: 3px;
}

.btn-back {
  width: 34px; height: 34px;
  border: 1px solid #E5E7EB;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #374151;
  flex-shrink: 0;
  transition: background 0.12s, border-color 0.12s;
}
.btn-back:hover { background: #F3F4F6; border-color: #D1D5DB; }
.back-ico { width: 16px; height: 16px; }

/* Toast */
.toast {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}
.toast--ok { background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; }
.toast--err { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; }

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
  width: 28px; height: 28px;
  border: 2.5px solid #E5E7EB;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.state-text { font-size: 13px; color: #9CA3AF; }

/* Error */
.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 32px;
  gap: 8px;
  background: #FEF2F2;
  border-radius: 12px;
  border: 1px solid #FECACA;
  text-align: center;
}
.error-ico { width: 28px; height: 28px; color: #EF4444; }
.error-title { font-size: 14px; font-weight: 600; color: #111827; margin: 0; }
.error-sub { font-size: 13px; color: #9CA3AF; margin: 0; }

/* Cards */
.card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px 22px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card--flush { padding: 0; gap: 0; overflow: hidden; }
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #F3F4F6;
}
.card-title { font-size: 14px; font-weight: 600; color: #111827; margin: 0; }
.badge {
  padding: 2px 9px;
  background: rgba(22,163,74,0.1);
  color: #16A34A;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
  border: 1px solid rgba(22,163,74,0.2);
}

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 12px; font-weight: 500; color: #374151; }
.field-input {
  padding: 9px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 13px;
  color: #111827;
  background: #FAFAFA;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  font-family: inherit;
}
.field-input:focus { border-color: #16A34A; background: #fff; }
.form-error {
  font-size: 12px;
  color: #DC2626;
  background: #FEF2F2;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #FECACA;
  margin: 0;
}
.form-actions { display: flex; justify-content: flex-end; }

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
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
.btn-ico { width: 14px; height: 14px; }

/* Table */
.table-wrap { overflow-x: auto; }
.tbl { width: 100%; border-collapse: collapse; }
.tbl th {
  padding: 10px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #F9FAFB;
  border-bottom: 1px solid #F3F4F6;
}
.tbl td {
  padding: 14px 16px;
  border-bottom: 1px solid #F9FAFB;
  vertical-align: middle;
}
.tbl tbody tr:last-child td { border-bottom: none; }
.tbl tbody tr:hover td { background: #FAFAFA; }
.td-num { font-size: 13px; font-weight: 600; color: #374151; width: 48px; }
.td-title { font-size: 13px; font-weight: 600; color: #111827; }
.td-desc { font-size: 12px; color: #6B7280; }
.row-actions { display: flex; gap: 8px; }

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: none;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.13s;
  font-family: inherit;
}
.btn-action-ico { width: 13px; height: 13px; }
.btn-action--go { background: rgba(22,163,74,0.1); color: #15803D; }
.btn-action--go:hover { background: rgba(22,163,74,0.18); }
.btn-action--del { background: rgba(220,38,38,0.08); color: #DC2626; }
.btn-action--del:hover { background: rgba(220,38,38,0.14); }

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 32px;
  gap: 8px;
  text-align: center;
}
.empty-icon { font-size: 36px; }
.empty-title { font-size: 14px; font-weight: 600; color: #111827; margin: 0; }
.empty-sub { font-size: 13px; color: #9CA3AF; margin: 0; max-width: 340px; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.modal-box {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.del-header { display: flex; align-items: center; gap: 12px; }
.del-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(220,38,38,0.08);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: #DC2626;
}
.del-icon-svg { width: 18px; height: 18px; }
.del-title { font-size: 14px; font-weight: 600; color: #111827; margin: 0; }
.del-sub { font-size: 12px; color: #9CA3AF; margin: 2px 0 0; }
.del-msg { font-size: 13px; color: #6B7280; margin: 0; line-height: 1.5; }
.del-name { font-weight: 600; color: #111827; }
.del-actions { display: flex; justify-content: flex-end; gap: 10px; }
.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #E5E7EB;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.12s;
  font-family: inherit;
}
.btn-cancel:hover { background: #F9FAFB; }
.btn-danger {
  padding: 8px 16px;
  border: none;
  background: #DC2626;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: background 0.12s;
  font-family: inherit;
}
.btn-danger:hover { background: #B91C1C; }
</style>
