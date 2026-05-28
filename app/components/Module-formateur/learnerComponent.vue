<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '~/stores/userStore'
import { useLanguageStore } from '~/stores/languageStore'
import { useProgressionStore } from '~/stores/progressionStore'
import { useLevelStore } from '~/stores/levelStore'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const userStore = useUserStore()
const langStore = useLanguageStore()
const progStore = useProgressionStore()
const levelStore = useLevelStore()

const search = ref('')
const country = ref('')
const language = ref('')
const level = ref('')
const minAge = ref<number | undefined>(undefined)
const maxAge = ref<number | undefined>(undefined)
const page = ref(1)
const limit = ref(12)

const levelOptions = computed(() => {
  const codes = levelStore.levels.map(l => l.code)
  return [...new Set(codes)].sort()
})


const selectedUser = ref<any>(null)
const languageId = ref('')
const showModal = ref(false)

const fetchLearners = async () => {
  await userStore.fetchFilterUsers({
    search: search.value,
    country: country.value,
    language: language.value,
    level: level.value,
    minAge: minAge.value,
    maxAge: maxAge.value,
    page: page.value,
    limit: limit.value,
    accountType: 'learner'
  })
}

onMounted(async () => {
  await Promise.all([fetchLearners(), langStore.fetchLanguages(), levelStore.fetchLevels(),])
  if (langStore.languages.length) languageId.value = langStore.languages[0]?.id ?? ''
})

watch([search, country, language, level, minAge, maxAge, limit], () => {
  page.value = 1
  fetchLearners()
})

watch(page, fetchLearners)

const learners = computed(() => userStore.users)
const totalPages = computed(() => Math.ceil(userStore.pagination.total / userStore.pagination.limit))

const openProfile = (user: any) => {
  selectedUser.value = user
  showModal.value = true
  loadStats()
}

const loadStats = () => {
  if (selectedUser.value && languageId.value) {
    progStore.fetchUserStats(selectedUser.value.id, languageId.value)
  }
}

const charts = computed(() => {
  const s = progStore.stats
  if (!s || progStore.isLoading) return null

  return {
    doughnut: {
      labels: ['Réalisé', 'Restant'],
      datasets: [{
        data: [s.overallProgressPercentage, 100 - s.overallProgressPercentage],
        backgroundColor: ['#6366f1', '#f1f5f9'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    bar: {
      labels: ['Niveaux', 'Modules', 'Parcours', 'Étapes'],
      datasets: [
        { label: 'Total', data: [s.totalLevels, s.totalModules, s.totalPaths, s.totalSteps], backgroundColor: '#e2e8f0', borderRadius: 8 },
        { label: 'Complétés', data: [s.completedLevels, s.completedModules, s.completedPaths, s.completedSteps], backgroundColor: '#6366f1', borderRadius: 8 }
      ]
    }
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  cutout: '75%'
}
</script>

<template>
  <div class="lc-root">

    <!-- Page header -->
    <div class="lc-header">
      <h1 class="page-heading">Espace Apprenants</h1>
      <p class="page-sub">Suivi analytique des performances</p>
    </div>

    <!-- Filters card -->
    <div class="lc-filters-card">
      <div class="cf-row">

        <!-- Search -->
        <div class="cf-search">
          <svg class="cf-search-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher par nom ou email…"
            class="cf-input"
          />
        </div>

        <!-- Language -->
        <div class="cf-sel-wrap" style="min-width: 160px;">
          <select v-model="language" class="cf-select">
            <option value="">Toutes les langues</option>
            <option v-for="l in langStore.visibleLanguages" :key="l.id" :value="l.id">{{ l.name }}</option>
          </select>
          <svg class="cf-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <!-- Level -->
        <div class="cf-sel-wrap" style="min-width: 160px;">
          <select v-model="level" class="cf-select">
            <option value="">Tous les niveaux</option>
            <option v-for="l in levelOptions" :key="l" :value="l">{{ l }}</option>
          </select>
          <svg class="cf-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <!-- Limit -->
        <div class="cf-sel-wrap" style="min-width: 130px;">
          <select v-model="limit" class="cf-select">
            <option :value="12">12 par page</option>
            <option :value="24">24 par page</option>
            <option :value="48">48 par page</option>
          </select>
          <svg class="cf-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

      </div>
    </div>

    <!-- Loading state -->
    <div v-if="userStore.isLoading" class="state-center">
      <div class="spinner"></div>
      <p class="state-text">Chargement…</p>
    </div>

    <!-- Learner grid -->
    <div v-else-if="learners.length > 0" class="learner-grid">
      <div
        v-for="u in learners"
        :key="u.id"
        class="learner-card"
        @click="openProfile(u)"
      >
        <div class="lc-avatar">
          {{ (u.profile?.firstName || u.firstName || '?')[0] }}
        </div>
        <div class="lc-info">
          <div class="lc-name">{{ u.profile?.firstName || u.firstName }} {{ u.profile?.lastName || u.lastName }}</div>
          <div class="lc-email">{{ u.email }}</div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="lc-empty">
      <div class="lc-empty-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:24px;height:24px;color:#D1D5DB;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p class="lc-empty-title">Aucun apprenant trouvé</p>
      <p class="lc-empty-sub">Essayez de modifier vos filtres de recherche.</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="lc-pagination">
      <button
        class="page-btn page-btn--nav"
        :disabled="page === 1"
        @click="page--"
      >
        <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        v-for="p in totalPages"
        :key="p"
        class="page-btn"
        :class="{ 'page-btn--active': page === p }"
        @click="page = p"
      >{{ p }}</button>

      <button
        class="page-btn page-btn--nav"
        :disabled="page === totalPages"
        @click="page++"
      >
        <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Profile modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="lc-overlay"
        @click.self="showModal = false"
      >
        <div class="lc-modal">

          <!-- Left sidebar -->
          <aside class="lc-sidebar">

            <!-- Avatar + name -->
            <div class="lc-sb-identity">
              <div class="lc-avatar-lg">
                {{ (selectedUser?.profile?.firstName || selectedUser?.firstName || '?')[0] }}
              </div>
              <div class="lc-sb-name">
                {{ selectedUser?.profile?.firstName || selectedUser?.firstName }}
                {{ selectedUser?.profile?.lastName || selectedUser?.lastName }}
              </div>
            </div>

            <!-- Language selector -->
            <div class="lc-sb-field">
              <label class="lc-sb-label">Langue d'étude</label>
              <div class="cf-sel-wrap" style="min-width: unset; width: 100%;">
                <select v-model="languageId" @change="loadStats" class="cf-select" style="width:100%;">
                  <option v-for="l in langStore.visibleLanguages" :key="l.id" :value="l.id">{{ l.name }}</option>
                </select>
                <svg class="cf-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <!-- XP card -->
            <div class="lc-xp-card">
              <span class="lc-xp-label">Score Total (XP)</span>
              <span class="lc-xp-value">{{ progStore.totalXp }}</span>
            </div>

            <!-- Close -->
            <button class="lc-close-btn" @click="showModal = false">Fermer</button>

          </aside>

          <!-- Right main -->
          <main class="lc-main">

            <!-- Loading -->
            <div v-if="progStore.isLoading" class="state-center">
              <div class="spinner"></div>
              <p class="state-text">Analyse de la progression…</p>
            </div>

            <!-- Charts -->
            <div v-else-if="charts" class="lc-charts">

              <div class="lc-charts-top">

                <!-- Doughnut -->
                <div class="lc-chart-card lc-chart-card--doughnut">
                  <span class="lc-chart-title">Score de maîtrise</span>
                  <div class="lc-doughnut-wrap">
                    <Doughnut :data="charts.doughnut" :options="chartOptions" />
                    <div class="lc-doughnut-center">
                      <span class="lc-doughnut-pct">{{ (progStore.stats?.overallProgressPercentage ?? 0).toFixed(0) }}%</span>
                    </div>
                  </div>
                </div>

                <!-- Stats grid -->
                <div class="lc-stats-grid">
                  <div
                    v-for="item in [
                      {label:'Niveaux', val:progStore.stats?.completedLevels, total:progStore.stats?.totalLevels},
                      {label:'Modules', val:progStore.stats?.completedModules, total:progStore.stats?.totalModules},
                      {label:'Parcours', val:progStore.stats?.completedPaths, total:progStore.stats?.totalPaths},
                      {label:'Étapes', val:progStore.stats?.completedSteps, total:progStore.stats?.totalSteps}
                    ]"
                    :key="item.label"
                    class="lc-stat-card"
                  >
                    <span class="lc-stat-label">{{ item.label }}</span>
                    <div class="lc-stat-values">
                      <span class="lc-stat-val">{{ item.val || 0 }}</span>
                      <span class="lc-stat-total">/ {{ item.total || 0 }}</span>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Bar chart -->
              <div class="lc-bar-section">
                <h3 class="lc-section-title">Détails par catégorie</h3>
                <div class="lc-chart-card lc-chart-card--bar">
                  <Bar :data="charts.bar" :options="{ ...chartOptions, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }" />
                </div>
              </div>

            </div>

            <!-- Empty -->
            <div v-else class="state-center">
              <div class="lc-empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:24px;height:24px;color:#D1D5DB;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p class="state-text">Sélectionnez une langue pour explorer les statistiques.</p>
            </div>

          </main>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
/* ── Page root ─────────────────────────── */
.lc-root {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Header ────────────────────────────── */
.lc-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  margin: 0;
}

/* ── Filters card ──────────────────────── */
.lc-filters-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
}

/* cf-* pattern (mirrors ReportsFilters) */
.cf-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.cf-search {
  position: relative;
  flex: 1;
  min-width: 180px;
}

.cf-search-ico {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #9CA3AF;
  pointer-events: none;
}

.cf-input {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 34px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #111827;
  outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;
  box-sizing: border-box;
}

.cf-input:focus {
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
  background: #fff;
}

.cf-input::placeholder { color: #9CA3AF; }

.cf-sel-wrap {
  position: relative;
}

.cf-select {
  appearance: none;
  width: 100%;
  height: 36px;
  padding: 0 30px 0 11px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  font-weight: 500;
  color: #374151;
  outline: none;
  cursor: pointer;
  transition: border-color 0.12s, box-shadow 0.12s;
  box-sizing: border-box;
}

.cf-select:focus {
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
  background: #fff;
}

.cf-chevron {
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  width: 13px;
  height: 13px;
  color: #9CA3AF;
  pointer-events: none;
}

/* ── Loading / empty state ─────────────── */
.state-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  gap: 12px;
}

.state-text {
  font-size: 13px;
  color: #9CA3AF;
  margin: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid #E5E7EB;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

/* ── Learner grid ──────────────────────── */
.learner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.learner-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.learner-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.07);
}

.lc-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #16A34A, #065F46);
  color: white;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lc-info {
  min-width: 0;
  flex: 1;
}

.lc-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lc-email {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Empty state ───────────────────────── */
.lc-empty {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  gap: 6px;
}

.lc-empty-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #F9FAFB;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.lc-empty-title {
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  margin: 0;
}

.lc-empty-sub {
  font-size: 12.5px;
  color: #9CA3AF;
  margin: 0;
}

/* ── Pagination ────────────────────────── */
.lc-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding-bottom: 8px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  border-radius: 7px;
  border: 1px solid #E5E7EB;
  background: white;
  font-size: 12.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  transition: all 0.1s;
}

.page-btn:hover:not(:disabled) {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.page-btn--active {
  background: #16A34A !important;
  border-color: #16A34A !important;
  color: white !important;
}

.page-btn--nav {
  color: #6B7280;
}

.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* ── Modal overlay ─────────────────────── */
.lc-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 50;
}

.lc-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 88vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  display: flex;
}

/* ── Sidebar ───────────────────────────── */
.lc-sidebar {
  width: 280px;
  flex-shrink: 0;
  background: #F9FAFB;
  border-right: 1px solid #F3F4F6;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.lc-sb-identity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.lc-avatar-lg {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #16A34A, #065F46);
  color: white;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lc-sb-name {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  line-height: 1.35;
}

.lc-sb-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lc-sb-label {
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* XP card */
.lc-xp-card {
  background: linear-gradient(135deg, #16A34A, #065F46);
  color: white;
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lc-xp-label {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.lc-xp-value {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Close button */
.lc-close-btn {
  width: 100%;
  height: 36px;
  background: #F3F4F6;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: #6B7280;
  cursor: pointer;
  margin-top: auto;
  transition: background 0.12s;
}

.lc-close-btn:hover {
  background: #E5E7EB;
}

/* ── Modal main ────────────────────────── */
.lc-main {
  flex: 1;
  padding: 28px;
  overflow-y: auto;
}

.lc-main::-webkit-scrollbar { width: 6px; }
.lc-main::-webkit-scrollbar-track { background: transparent; }
.lc-main::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }

/* Charts */
.lc-charts {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.lc-charts-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 680px) {
  .lc-charts-top { grid-template-columns: 1fr; }
  .lc-modal { flex-direction: column; }
  .lc-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #F3F4F6; }
}

.lc-chart-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  padding: 20px;
}

.lc-chart-card--doughnut {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.lc-chart-title {
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.lc-doughnut-wrap {
  position: relative;
  width: 160px;
  height: 160px;
}

.lc-doughnut-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lc-doughnut-pct {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.02em;
}

.lc-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.lc-stat-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lc-stat-label {
  font-size: 10px;
  font-weight: 700;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.lc-stat-values {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.lc-stat-val {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.lc-stat-total {
  font-size: 12px;
  font-weight: 500;
  color: #D1D5DB;
}

.lc-bar-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lc-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.lc-chart-card--bar {
  height: 240px;
}
</style>
