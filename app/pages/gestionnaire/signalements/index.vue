<script setup lang="ts">
import { useSignalementStore } from '~/stores/signalementStore'
import { useLanguageStore } from '~/stores/languageStore'
import { useFormateurStore } from '~/stores/formateurStore'
import ReportsFilters from '~/components/gestionnaire/signalements/ReportsFilters.vue'
import ReportsTable from '~/components/gestionnaire/signalements/ReportsTable.vue'
import ReportDetailsDrawer from '~/components/gestionnaire/signalements/ReportDetailsDrawer.vue'
import ModerationDecisionModal from '~/components/gestionnaire/signalements/ModerationDecisionModal.vue'
import type { Signalement, ModerationDecision } from '~/types/signalement'

definePageMeta({ layout: 'gestionnaire' })

const store = useSignalementStore()
const languageStore = useLanguageStore()
const formateurStore = useFormateurStore()
const router = useRouter()

const showDrawer = ref(false)
const selectedSignalementId = ref<string | null>(null)
const showModal = ref(false)
const selectedSignalement = ref<Signalement | null>(null)

const toast = ref<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' })

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

onMounted(async () => {
  await Promise.all([store.fetchSignalements(), languageStore.fetchLanguages(), formateurStore.fetchFormateurUsers()])
})

const handleView = (id: string) => { selectedSignalementId.value = id; showDrawer.value = true }
const handleProcess = (signalement: Signalement) => { selectedSignalement.value = signalement; showModal.value = true }
const handleViewContent = (signalement: Signalement) => { if (signalement.contenu.url) window.open(signalement.contenu.url, '_blank') }
const handleViewFormateur = (id: string) => router.push(`/gestionnaire/formateurs/${id}`)

const handleSubmitDecision = async (decision: ModerationDecision) => {
  const result = await store.processSignalement(decision)
  showToast(result.message, result.success ? 'success' : 'error')
  if (result.success) showDrawer.value = false
}

const closeDrawer = () => { showDrawer.value = false; selectedSignalementId.value = null }
const closeModal = () => { showModal.value = false; selectedSignalement.value = null }

const stats = [
  { label: 'Total',      getValue: () => store.stats.total,     color: 'blue',   icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { label: 'En attente', getValue: () => store.stats.pending,   color: 'orange', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Urgents',    getValue: () => store.stats.urgent,    color: 'red',    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { label: 'Traités',    getValue: () => store.stats.processed, color: 'green',  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Rejetés',    getValue: () => store.stats.rejected,  color: 'gray',   icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
]
</script>

<template>
  <div class="page-root">

    <div class="page-hero">
      <div>
        <h1 class="page-heading">Signalements</h1>
        <p class="page-sub">Modérez les contenus signalés par les utilisateurs de la plateforme</p>
      </div>
    </div>

    <!-- Urgent alert -->
    <Transition name="slide-down">
      <div v-if="store.stats.urgent > 0" class="urgent-banner">
        <div class="urgent-pulse-wrap">
          <span class="urgent-pulse"></span>
          <span class="urgent-pulse-core"></span>
        </div>
        <svg class="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="urgent-text">
          <strong>{{ store.stats.urgent }}</strong>
          signalement{{ store.stats.urgent > 1 ? 's' : '' }} urgent{{ store.stats.urgent > 1 ? 's' : '' }}
          nécessite{{ store.stats.urgent > 1 ? 'nt' : '' }} une attention immédiate
        </p>
      </div>
    </Transition>

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
      <ReportsFilters />
    </div>

    <!-- Table -->
    <ReportsTable
      @view="handleView"
      @process="handleProcess"
      @view-content="handleViewContent"
      @view-formateur="handleViewFormateur"
    />

    <!-- Drawer -->
    <ReportDetailsDrawer
      :signalement-id="selectedSignalementId"
      @close="closeDrawer"
      @process="handleProcess"
    />

    <!-- Modal -->
    <ModerationDecisionModal
      :show="showModal"
      :signalement="selectedSignalement"
      @close="closeModal"
      @submit="handleSubmitDecision"
    />

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

/* Urgent banner */
.urgent-banner {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 16px;
  background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px;
  color: #DC2626;
}

.urgent-pulse-wrap { position: relative; width: 12px; height: 12px; flex-shrink: 0; }
.urgent-pulse-core {
  position: absolute; inset: 2px; border-radius: 50%; background: #EF4444;
}
.urgent-pulse {
  position: absolute; inset: 0; border-radius: 50%;
  background: rgba(239,68,68,0.45);
  animation: ping 1.6s cubic-bezier(0,0,0.2,1) infinite;
}
@keyframes ping { 75%, 100% { transform: scale(2.2); opacity: 0; } }

.urgent-text { font-size: 13px; font-weight: 500; }
.urgent-text strong { font-weight: 700; }

.slide-down-enter-active, .slide-down-leave-active { transition: opacity 0.25s, transform 0.25s; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }

/* Stats */
.stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }

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
.sc--orange::after { background: linear-gradient(90deg, #C2410C, #FB923C); }
.sc--red::after    { background: linear-gradient(90deg, #991B1B, #F87171); }
.sc--green::after  { background: linear-gradient(90deg, #15803D, #4ade80); }
.sc--gray::after   { background: linear-gradient(90deg, #4B5563, #9CA3AF); }
.sc:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.07); transform: translateY(-1px); }

.sc-top { display: flex; align-items: center; justify-content: space-between; }

.sc-icon {
  width: 36px; height: 36px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.sc-icon--blue   { background: rgba(59,130,246,0.10);  color: #2563EB; }
.sc-icon--orange { background: rgba(234,88,12,0.10);   color: #EA580C; }
.sc-icon--red    { background: rgba(220,38,38,0.10);   color: #DC2626; }
.sc-icon--green  { background: rgba(22,163,74,0.10);   color: #16A34A; }
.sc-icon--gray   { background: rgba(107,114,128,0.10); color: #6B7280; }

.sc-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9CA3AF; }
.sc-val { font-size: 36px; font-weight: 800; color: #111827; line-height: 1; letter-spacing: -0.04em; }

.filters-wrap {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  overflow: hidden;
}

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
