<template>
  <div class="parcours-page">
    <div class="page-container">

      <!-- En-tête -->
      <div class="page-header">
        <h1 class="page-title">Mes Parcours</h1>
        <p class="page-sub">Choisissez un parcours et continuez votre apprentissage</p>
      </div>

      <!-- Filtres langues -->
      <div class="lang-filters" v-if="store.languages.length">
        <button
          class="lang-filter-btn"
          :class="{ 'lang-filter-btn--active': activeLang === 'all' }"
          @click="activeLang = 'all'"
        >
          Toutes les langues
        </button>
        <button
          v-for="lang in store.languages"
          :key="lang.id"
          class="lang-filter-btn"
          :class="{ 'lang-filter-btn--active': activeLang === lang.id }"
          @click="activeLang = lang.id"
        >
          {{ lang.flag }} {{ lang.name }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="store.isLoading" class="loading-state">
        <div class="spinner" />
        <p>Chargement des parcours...</p>
      </div>

      <!-- Liste des parcours -->
      <div v-else class="parcours-grid">
        <NuxtLink
          v-for="parcours in filteredParcours"
          :key="parcours.id"
          :to="`/apprenant/parcours/${parcours.id}`"
          class="parcours-card"
          :class="`parcours-card--${parcours.status}`"
        >
          <!-- Image de couverture -->
          <div class="card-cover">
            <div class="card-cover-overlay" />
            <div class="card-status-badge" :class="`badge--${parcours.status}`">
              {{ statusLabel(parcours.status) }}
            </div>
            <div class="card-lang-badge">
              {{ langName(parcours.languageId) }}
            </div>
          </div>

          <!-- Contenu -->
          <div class="card-body">
            <h2 class="card-title">{{ parcours.title }}</h2>
            <p class="card-desc">{{ parcours.description }}</p>

            <!-- Progression -->
            <div class="card-progress">
              <div class="progress-bar-track">
                <div
                  class="progress-bar-fill"
                  :style="{ width: progressPercent(parcours) + '%' }"
                />
              </div>
              <div class="progress-meta">
                <span class="progress-text">
                  {{ parcours.completedNodes }} / {{ parcours.totalNodes }} étapes
                </span>
                <span class="progress-pct">{{ progressPercent(parcours) }}%</span>
              </div>
            </div>

            <!-- Noeuds aperçu -->
            <div class="card-nodes">
              <div
                v-for="node in parcours.nodes.slice(0, 8)"
                :key="node.id"
                class="node-dot"
                :class="`node-dot--${node.status}`"
                :title="node.title"
              />
              <span v-if="parcours.nodes.length > 8" class="nodes-more">+{{ parcours.nodes.length - 8 }}</span>
            </div>

            <!-- Footer -->
            <div class="card-footer">
              <div class="card-xp">
                <span>⚡</span>
                <span>{{ parcours.xpReward }} XP</span>
              </div>
              <div class="card-cta">
                {{ parcours.status === 'not_started' ? 'Commencer' : parcours.status === 'completed' ? 'Revoir' : 'Continuer' }}
                →
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Vide -->
      <div v-if="!store.isLoading && filteredParcours.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>Aucun parcours disponible</h3>
        <p>Des nouveaux parcours seront bientôt disponibles pour cette langue.</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useLearnerStore } from '~/stores/learnerStore'
import type { LearnerParcours } from '~/types/learner'

definePageMeta({ layout: 'learner' })

const store = useLearnerStore()
const route = useRoute()

const activeLang = ref<string>((route.query.lang as string) || 'all')

onMounted(() => store.init())

const filteredParcours = computed(() => {
  if (activeLang.value === 'all') return store.allParcours
  return store.allParcours.filter(p => p.languageId === activeLang.value)
})

function progressPercent(p: LearnerParcours): number {
  if (p.totalNodes === 0) return 0
  return Math.round((p.completedNodes / p.totalNodes) * 100)
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    completed: '✓ Terminé',
    in_progress: '▶ En cours',
    not_started: '🔒 Nouveau'
  }
  return map[status] ?? status
}

function langName(langId: string): string {
  return store.languages.find(l => l.id === langId)?.name ?? langId
}
</script>

<style scoped>
.parcours-page {
  min-height: 100vh;
  background: #f0fdf4;
  padding-bottom: 60px;
}

.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 0;
}

/* ── Header ──────────────────────────────────────────────────────────────── */
.page-header { margin-bottom: 28px; }

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 6px;
}

.page-sub {
  font-size: 15px;
  color: #6B7280;
}

/* ── Filtres ─────────────────────────────────────────────────────────────── */
.lang-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.lang-filter-btn {
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid #E5E7EB;
  background: white;
  color: #6B7280;
  transition: all 0.15s;
}

.lang-filter-btn:hover {
  border-color: #1A7A1A;
  color: #1A7A1A;
}

.lang-filter-btn--active {
  background: #1A7A1A;
  border-color: #1A7A1A;
  color: white;
}

/* ── Loading ─────────────────────────────────────────────────────────────── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 0;
  color: #6B7280;
  font-size: 14px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #E5E7EB;
  border-top-color: #1A7A1A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Grille ──────────────────────────────────────────────────────────────── */
.parcours-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* ── Card ────────────────────────────────────────────────────────────────── */
.parcours-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.parcours-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(26, 122, 26, 0.15);
  border-color: #1A7A1A;
}

.parcours-card--completed { border-color: #BBF7D0; }

/* Cover */
.card-cover {
  height: 100px;
  background: linear-gradient(135deg, #1A7A1A 0%, #2d9c2d 100%);
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px;
}

.card-cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.15));
}

.card-status-badge {
  position: relative;
  z-index: 1;
  font-size: 10.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}

.badge--completed { background: #D1FAE5; color: #065F46; }
.badge--in_progress { background: #FEF3C7; color: #92400E; }
.badge--not_started { background: rgba(255,255,255,0.2); color: white; }

.card-lang-badge {
  position: relative;
  z-index: 1;
  font-size: 11px;
  font-weight: 600;
  color: white;
  background: rgba(255,255,255,0.2);
  padding: 4px 10px;
  border-radius: 20px;
}

/* Body */
.card-body {
  padding: 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}

.card-desc {
  font-size: 12.5px;
  color: #6B7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Barre de progression */
.progress-bar-track {
  height: 8px;
  background: #F3F4F6;
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1A7A1A, #34C759);
  border-radius: 8px;
  transition: width 0.5s ease;
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9CA3AF;
  margin-top: 4px;
}

.progress-pct { font-weight: 700; color: #1A7A1A; }

/* Noeuds */
.card-nodes {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}

.node-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid transparent;
}

.node-dot--completed { background: #1A7A1A; border-color: #1A7A1A; }
.node-dot--current   { background: white; border-color: #1A7A1A; box-shadow: 0 0 0 2px rgba(26,122,26,0.25); }
.node-dot--locked    { background: #E5E7EB; border-color: #D1D5DB; }

.nodes-more {
  font-size: 10px;
  color: #9CA3AF;
  font-weight: 600;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid #F3F4F6;
  margin-top: auto;
}

.card-xp {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #D97706;
}

.card-cta {
  font-size: 12.5px;
  font-weight: 700;
  color: #1A7A1A;
}

/* ── Empty ───────────────────────────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #6B7280;
}

.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-state h3 { font-size: 18px; font-weight: 700; color: #374151; margin-bottom: 8px; }
.empty-state p { font-size: 14px; }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .parcours-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .parcours-grid { grid-template-columns: 1fr; }
}
</style>
