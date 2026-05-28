<script setup lang="ts">
import DiscoverySectionForm from '~/components/gestionnaire/Discoverysectionform.vue'
import { useDiscoveryStore } from '~/stores/discoveryStore'

definePageMeta({ layout: 'gestionnaire' })

const store = useDiscoveryStore()

const showForm = ref(false)
const editingSectionId = ref<string | null>(null)
const sectionToDeleteId = ref<string | null>(null)
const toast = ref<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' })

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const loadSections = async () => {
  try { await store.fetchAdminSections() }
  catch { showToast(store.adminError ?? 'Erreur lors du chargement', 'error') }
}

const startCreating = () => { editingSectionId.value = null; showForm.value = true }
const startEditing  = (id: string) => { editingSectionId.value = id; showForm.value = true }
const resetForm     = () => { showForm.value = false; editingSectionId.value = null }

const handleSaved = async () => {
  resetForm()
  await loadSections()
  showToast('Section enregistrée avec succès')
}

const deleteSection = (id: string) => { sectionToDeleteId.value = id }

const confirmDeleteSection = async () => {
  if (!sectionToDeleteId.value) return
  const success = await store.deleteAdminSection(sectionToDeleteId.value)
  showToast(success ? 'Section supprimée avec succès.' : (store.adminError ?? 'Erreur lors de la suppression'), success ? 'success' : 'error')
  sectionToDeleteId.value = null
}

const sectionTypeLabel = (type: string) => {
  const map: Record<string, string> = { audio: 'Audio', video: 'Vidéo', qcm: 'QCM', dragdrop: 'Glisser-déposer', lesson: 'Cours', exercise: 'Quiz' }
  return map[type] ?? type
}

const sectionTypeIcon = (type: string) => {
  const map: Record<string, string> = { audio: '🎵', video: '🎬', qcm: '☑️', dragdrop: '🔀', lesson: '📖', exercise: '✏️' }
  return map[type] ?? '📄'
}

const sectionTypeColor = (type: string) => {
  const map: Record<string, string> = {
    audio: 'tag--blue', video: 'tag--purple', qcm: 'tag--orange',
    dragdrop: 'tag--green', lesson: 'tag--indigo', exercise: 'tag--amber',
  }
  return map[type] ?? 'tag--gray'
}

const sectionCardClass = (type: string) => {
  const map: Record<string, string> = {
    audio: 'scard--blue', video: 'scard--purple', qcm: 'scard--orange',
    dragdrop: 'scard--green', lesson: 'scard--indigo', exercise: 'scard--amber',
  }
  return map[type] ?? 'scard--gray'
}

onMounted(loadSections)
</script>

<template>
  <div class="page-root">

    <!-- Hero -->
    <div class="page-hero">
      <div>
        <h1 class="page-heading">Découverte</h1>
        <p class="page-sub">Créez et gérez les sections de découverte affichées aux utilisateurs</p>
      </div>
      <button v-if="!showForm" class="btn-new" @click="startCreating">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        Nouvelle section
      </button>
    </div>

    <!-- Form -->
    <Transition name="disc-form">
      <div v-if="showForm" class="form-wrap">
        <DiscoverySectionForm
          :section-id="editingSectionId ?? undefined"
          @cancel="resetForm"
          @saved="handleSaved"
        />
      </div>
    </Transition>

    <!-- Sections list -->
    <template v-if="!showForm">

      <!-- Loading -->
      <div v-if="store.isLoadingAdminSections" class="state-center">
        <div class="spinner"></div>
        <p class="state-text">Chargement des sections…</p>
      </div>

      <!-- Empty -->
      <div v-else-if="store.adminSections.length === 0" class="empty-card">
        <div class="empty-icon">📚</div>
        <p class="empty-title">Aucune section pour le moment</p>
        <p class="empty-sub">Créez une première section pour commencer</p>
        <button class="btn-new" @click="startCreating">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Créer une section
        </button>
      </div>

      <!-- Grid -->
      <div v-else class="sections-grid">
          <div
            v-for="section in store.adminSections"
            :key="section.id"
            class="section-card"
            :class="sectionCardClass(section.type)"
          >
            <!-- Top row -->
            <div class="section-top">
              <span class="tag" :class="sectionTypeColor(section.type)">
                {{ sectionTypeIcon(section.type) }} {{ sectionTypeLabel(section.type) }}
              </span>
              <span class="section-count" :class="section.contents?.length ? 'section-count--on' : 'section-count--off'">
                {{ section.contents?.length ?? 0 }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="section-title">{{ section.title }}</h3>

            <!-- Actions -->
            <div class="section-actions">
              <button class="btn-edit" @click="startEditing(section.id!)">Éditer</button>
              <button class="btn-del" :disabled="store.isDeletingAdminSection" @click="deleteSection(section.id!)">Supprimer</button>
            </div>
          </div>
        </div>

    </template>

    <!-- Confirm delete modal -->
    <Teleport to="body">
      <div v-if="sectionToDeleteId" class="modal-overlay" @click.self="sectionToDeleteId = null">
        <div class="modal-box">
          <h3 class="modal-title">Supprimer cette section ?</h3>
          <p class="modal-msg">La section et ses contenus seront définitivement supprimés.</p>
          <div class="modal-actions">
            <button class="btn-cancel" @click="sectionToDeleteId = null">Annuler</button>
            <button class="btn-danger" @click="confirmDeleteSection">Supprimer</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="page-toast" :class="toast.type === 'success' ? 'page-toast--ok' : 'page-toast--err'">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path v-if="toast.type === 'success'" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.page-root { padding: 32px; display: flex; flex-direction: column; gap: 20px; }

.page-hero { display: flex; align-items: center; justify-content: space-between; }
.page-heading { font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.03em; }
.page-sub { font-size: 13px; color: #9CA3AF; margin-top: 3px; }

.btn-new {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 14px;
  background: #16A34A; color: white;
  border: none; border-radius: 8px;
  font-size: 13px; font-weight: 500; cursor: pointer;
  box-shadow: 0 1px 3px rgba(22,163,74,.3);
  transition: background 0.15s;
}
.btn-new:hover { background: #15803D; }

.form-wrap {
  background: #FFFFFF;
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
}

/* States */
.state-center {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 80px 0; gap: 12px;
}
.spinner {
  width: 28px; height: 28px;
  border: 2.5px solid #E5E7EB; border-top-color: #16A34A;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.state-text { font-size: 13px; color: #9CA3AF; }

.empty-card {
  display: flex; flex-direction: column; align-items: center;
  padding: 64px 32px; gap: 10px;
  background: #FFFFFF;
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  text-align: center;
}
.empty-icon  { font-size: 40px; }
.empty-title { font-size: 15px; font-weight: 600; color: #111827; }
.empty-sub   { font-size: 13px; color: #9CA3AF; margin-bottom: 6px; }

/* Grid */
.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.section-card {
  display: flex; flex-direction: column; gap: 10px;
  padding: 18px 20px;
  background: #FFFFFF;
  border-radius: 12px;
  border-left: 3px solid transparent;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s, transform 0.2s;
}
.section-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.07);
}

/* Colored left borders by type */
.scard--blue   { border-left-color: #2563EB; }
.scard--purple { border-left-color: #7C3AED; }
.scard--orange { border-left-color: #C2410C; }
.scard--green  { border-left-color: #16A34A; }
.scard--indigo { border-left-color: #4338CA; }
.scard--amber  { border-left-color: #B45309; }
.scard--gray   { border-left-color: #6B7280; }

.section-top { display: flex; align-items: center; justify-content: space-between; }

/* Content count badge */
.section-count {
  font-size: 12px; font-weight: 700;
  width: 24px; height: 24px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.section-count--on  { background: #EFF6FF; color: #2563EB; }
.section-count--off { background: #F3F4F6; color: #9CA3AF; }

.tag {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 100px;
  font-size: 11.5px; font-weight: 600;
}
.tag--blue   { background: #EFF6FF; color: #1D4ED8; }
.tag--purple { background: #F5F3FF; color: #7C3AED; }
.tag--orange { background: #FFF7ED; color: #C2410C; }
.tag--green  { background: #F0FDF4; color: #15803D; }
.tag--indigo { background: #EEF2FF; color: #4338CA; }
.tag--amber  { background: #FFFBEB; color: #B45309; }
.tag--gray   { background: #F9FAFB; color: #6B7280; }

.section-title { font-size: 14px; font-weight: 600; color: #111827; line-height: 1.45; }


.section-actions {
  display: flex; gap: 8px;
  padding-top: 10px; margin-top: 2px;
  border-top: 1px solid #F3F4F6;
}
.btn-edit {
  flex: 1; height: 32px; font-size: 12.5px; font-weight: 500;
  color: #2563EB; background: #EFF6FF; border: none; border-radius: 7px; cursor: pointer;
  transition: background 0.12s;
}
.btn-edit:hover { background: #DBEAFE; }

.btn-del {
  height: 32px; padding: 0 12px; font-size: 12.5px; font-weight: 500;
  color: #DC2626; background: #FEF2F2; border: none; border-radius: 7px; cursor: pointer;
  transition: background 0.12s;
}
.btn-del:hover { background: #FEE2E2; }
.btn-del:disabled { opacity: 0.5; cursor: not-allowed; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; z-index: 60;
  background: rgba(0,0,0,0.35); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal-box {
  background: white; border-radius: 14px; padding: 28px; max-width: 400px; width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(17,24,39,0.06);
}
.modal-title { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px; }
.modal-msg   { font-size: 13px; color: #6B7280; line-height: 1.6; margin-bottom: 20px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
.btn-cancel { height: 34px; padding: 0 14px; font-size: 13px; font-weight: 500; color: #6B7280; background: none; border: none; border-radius: 7px; cursor: pointer; transition: background 0.12s; }
.btn-cancel:hover { background: #F3F4F6; }
.btn-danger { height: 34px; padding: 0 18px; font-size: 13px; font-weight: 500; color: white; background: #DC2626; border: none; border-radius: 7px; cursor: pointer; transition: background 0.15s; }
.btn-danger:hover { background: #B91C1C; }

/* Toast */
.page-toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 60;
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.page-toast--ok  { background: #16A34A; color: white; }
.page-toast--err { background: #DC2626; color: white; }
.toast-enter-active, .toast-leave-active { transition: opacity 0.2s, transform 0.2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(6px); }

.disc-form-enter-active, .disc-form-leave-active { transition: opacity 0.2s, transform 0.2s; }
.disc-form-enter-from, .disc-form-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
