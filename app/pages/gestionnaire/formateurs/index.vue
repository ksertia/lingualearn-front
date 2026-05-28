<script setup lang="ts">
import { useFormateurStore } from '~/stores/formateurStore'
import FormateursList from '~/components/gestionnaire/formateurs/FormateursList.vue'

definePageMeta({ layout: 'gestionnaire' })

const store = useFormateurStore()
const router = useRouter()

const searchInput  = ref('')
const statusFilter = ref<'all' | 'active' | 'suspended'>('all')
const toast = ref<{ show: boolean; text: string; type: 'success' | 'error' }>({ show: false, text: '', type: 'success' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (text: string, type: 'success' | 'error' = 'success') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, text, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2800)
}

const handleSearch        = (v: string)                      => store.setSearch(v)
const handleStatusFilter  = (v: 'all' | 'active' | 'suspended') => store.setStatusFilter(v)
const handleView          = (id: string)                     => router.push(`/gestionnaire/formateurs/${id}`)

const handleSuspend = async (id: string) => {
  const ok = await store.suspendFormateur(id)
  showToast(ok ? 'Formateur suspendu.' : 'Échec de la suspension.', ok ? 'success' : 'error')
}

const handleReactivate = async (id: string) => {
  const ok = await store.reactivateFormateur(id)
  showToast(ok ? 'Formateur réactivé.' : 'Échec de la réactivation.', ok ? 'success' : 'error')
}

const stats = [
  { label: 'Total',        getValue: () => store.statsSummary.total,       color: 'blue',   icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Actifs',       getValue: () => store.statsSummary.active,      color: 'green',  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Suspendus',    getValue: () => store.statsSummary.suspended,   color: 'red',    icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
  { label: 'Signalements', getValue: () => store.statsSummary.withReports, color: 'orange', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
]
</script>

<template>
  <div class="page-root">

    <!-- Header -->
    <div class="page-hero">
      <div>
        <h1 class="page-heading">Formateurs</h1>
        <p class="page-sub">Gérez et surveillez l'activité des formateurs de la plateforme</p>
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
    <div class="filters-bar">
      <div class="search-wrap">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
        </svg>
        <input
          v-model="searchInput"
          @input="handleSearch(searchInput)"
          type="text"
          placeholder="Rechercher un formateur…"
          class="search-input"
        />
      </div>
      <select
        v-model="statusFilter"
        @change="handleStatusFilter(statusFilter)"
        class="filter-select"
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actifs</option>
        <option value="suspended">Suspendus</option>
      </select>
    </div>

    <!-- Table -->
    <FormateursList
      @view="handleView"
      @suspend="handleSuspend"
      @reactivate="handleReactivate"
    />

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="page-toast"
        :class="toast.type === 'success' ? 'page-toast--ok' : 'page-toast--err'"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path v-if="toast.type === 'success'" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ toast.text }}
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.page-root { padding: 32px; display: flex; flex-direction: column; gap: 20px; }

.page-hero { }

.page-heading { font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.03em; }
.page-sub { font-size: 13px; color: #9CA3AF; margin-top: 3px; }

/* Stats */
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
.sc--orange::after { background: linear-gradient(90deg, #C2410C, #FB923C); }
.sc:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.07); transform: translateY(-1px); }

.sc-top { display: flex; align-items: center; justify-content: space-between; }

.sc-icon {
  width: 36px; height: 36px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.sc-icon--blue   { background: rgba(59,130,246,0.10);  color: #2563EB; }
.sc-icon--green  { background: rgba(22,163,74,0.10);   color: #16A34A; }
.sc-icon--red    { background: rgba(220,38,38,0.10);   color: #DC2626; }
.sc-icon--orange { background: rgba(234,88,12,0.10);   color: #EA580C; }

.sc-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9CA3AF; }
.sc-val { font-size: 36px; font-weight: 800; color: #111827; line-height: 1; letter-spacing: -0.04em; }

/* Filters */
.filters-bar {
  display: flex;
  gap: 10px;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
}

.search-wrap { flex: 1; position: relative; }

.search-icon {
  position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
  width: 14px; height: 14px; color: #9CA3AF; pointer-events: none;
}

.search-input {
  width: 100%; height: 36px; padding: 0 12px 0 32px;
  font-size: 13px; color: #111827;
  background: #F9FAFB; border: 1px solid #E5E7EB;
  border-radius: 8px; outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;
}
.search-input:focus { background: white; border-color: #16A34A; box-shadow: 0 0 0 3px rgba(22,163,74,0.10); }

.filter-select {
  height: 36px; padding: 0 10px;
  font-size: 13px; color: #374151;
  background: #F9FAFB; border: 1px solid #E5E7EB;
  border-radius: 8px; outline: none; cursor: pointer;
}
.filter-select:focus { border-color: #16A34A; }

/* Toast */
.page-toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 60;
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; border-radius: 10px;
  font-size: 13px; font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.page-toast--ok  { background: #16A34A; color: white; }
.page-toast--err { background: #DC2626; color: white; }

.toast-enter-active, .toast-leave-active { transition: opacity 0.2s, transform 0.2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(6px); }
</style>
