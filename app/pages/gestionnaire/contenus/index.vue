<script setup lang="ts">
import { useContenuStore } from '~/stores/contenuStore'
import { useLanguageStore } from '~/stores/languageStore'
import { useFormateurStore } from '~/stores/formateurStore'
import ContentFilters from '~/components/gestionnaire/gestionContenus/ContentFilters.vue'
import ContentTable from '~/components/gestionnaire/gestionContenus/ContentTable.vue'
import ContentDetailsDrawer from '~/components/gestionnaire/gestionContenus/ContentDetailsDrawer.vue'
import type { Contenu } from '~/types/contenu'

definePageMeta({ layout: 'gestionnaire' })

const store = useContenuStore()
const languageStore = useLanguageStore()
const formateurStore = useFormateurStore()

const showDrawer = ref(false)
const selectedContenuId = ref<string | null>(null)
const contenuToDeleteId = ref<string | null>(null)
const toast = ref<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' })

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

onMounted(async () => {
  await Promise.all([store.fetchContenus(), languageStore.fetchLanguages(), formateurStore.fetchFormateurUsers()])
})

const handleView = (id: string) => { selectedContenuId.value = id; showDrawer.value = true }
const closeDrawer = () => { showDrawer.value = false; selectedContenuId.value = null }

const handleDisable = async (contenu: Contenu) => {
  const reason = prompt('Motif de désactivation (optionnel):')
  const r = await store.disableContenu(contenu.id, reason || undefined)
  showToast(r.success ? 'Contenu désactivé avec succès' : r.message, r.success ? 'success' : 'error')
}

const handleEnable = async (id: string) => {
  const r = await store.enableContenu(id)
  showToast(r.success ? 'Contenu réactivé avec succès' : r.message, r.success ? 'success' : 'error')
}

const handleDelete = (id: string) => { contenuToDeleteId.value = id }

const confirmDelete = async () => {
  if (!contenuToDeleteId.value) return
  const r = await store.deleteContenu(contenuToDeleteId.value)
  showToast(r.success ? 'Contenu supprimé définitivement.' : r.message, r.success ? 'success' : 'error')
  if (r.success) showDrawer.value = false
  contenuToDeleteId.value = null
}

const stats = [
  { label: 'Total',          getValue: () => store.statsSummary.total,         color: 'blue',   icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { label: 'Actifs',         getValue: () => store.statsSummary.active,        color: 'green',  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Désactivés',     getValue: () => store.statsSummary.disabled,      color: 'red',    icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
  { label: 'Total inscrits', getValue: () => store.statsSummary.totalEnrolled, color: 'purple', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
]
</script>

<template>
  <div class="page-root">

    <div class="page-hero">
      <div>
        <h1 class="page-heading">Contenus</h1>
        <p class="page-sub">Surveillez et gérez tous les contenus publiés sur la plateforme</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div v-for="s in stats" :key="s.label" class="sc" :class="`sc--${s.color}`">
        <div class="sc-top">
          <div class="sc-icon" :class="`sc-icon--${s.color}`">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path :d="s.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" />
            </svg>
          </div>
          <span class="sc-lbl">{{ s.label }}</span>
        </div>
        <div class="sc-val">{{ s.getValue() }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-wrap">
      <ContentFilters />
    </div>

    <!-- Table -->
    <ContentTable @view="handleView" @disable="handleDisable" @enable="handleEnable" @delete="handleDelete" />

    <!-- Drawer -->
    <ContentDetailsDrawer :contenu-id="selectedContenuId" @close="closeDrawer" />

    <!-- Confirm delete modal -->
    <Teleport to="body">
      <div v-if="contenuToDeleteId" class="modal-overlay" @click.self="contenuToDeleteId = null">
        <div class="modal-box">
          <h3 class="modal-title">Supprimer ce contenu ?</h3>
          <p class="modal-msg">Cette action est irréversible. Le contenu sera définitivement supprimé.</p>
          <div class="modal-actions">
            <button class="btn-cancel" @click="contenuToDeleteId = null">Annuler</button>
            <button class="btn-danger" @click="confirmDelete">Supprimer</button>
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
.page-heading { font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.03em; }
.page-sub { font-size: 13px; color: #9CA3AF; margin-top: 3px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

.sc {
  padding: 18px 20px 16px;
  background: #FFFFFF; border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; gap: 12px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.sc::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
}
.sc--blue::after   { background: linear-gradient(90deg, #1D4ED8, #60A5FA); }
.sc--green::after  { background: linear-gradient(90deg, #15803D, #4ade80); }
.sc--red::after    { background: linear-gradient(90deg, #991B1B, #F87171); }
.sc--purple::after { background: linear-gradient(90deg, #5B21B6, #A78BFA); }
.sc:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.07); transform: translateY(-1px); }

.sc-top { display: flex; align-items: center; justify-content: space-between; }

.sc-icon {
  width: 36px; height: 36px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.sc-icon--blue   { background: rgba(59,130,246,0.10);  color: #2563EB; }
.sc-icon--green  { background: rgba(22,163,74,0.10);   color: #16A34A; }
.sc-icon--red    { background: rgba(220,38,38,0.10);   color: #DC2626; }
.sc-icon--purple { background: rgba(124,58,237,0.10);  color: #7C3AED; }

.sc-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9CA3AF; }
.sc-val { font-size: 36px; font-weight: 800; color: #111827; line-height: 1; letter-spacing: -0.04em; }

.filters-wrap {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  overflow: hidden;
}

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
</style>
