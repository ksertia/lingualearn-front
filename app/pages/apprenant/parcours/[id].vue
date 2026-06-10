<template>
  <div class="path-page">
    <div class="page-container">

      <!-- Loading -->
      <div v-if="store.isLoading" class="loading-state">
        <div class="spinner" />
      </div>

      <template v-else-if="parcours">

        <!-- En-tête parcours -->
        <div class="parcours-header">
          <NuxtLink to="/apprenant/parcours" class="back-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Mes parcours
          </NuxtLink>

          <div class="header-content">
            <div class="header-info">
              <div class="header-lang-badge">
                {{ langName }}
              </div>
              <h1 class="header-title">{{ parcours.title }}</h1>
              <p class="header-desc">{{ parcours.description }}</p>

              <div class="header-stats">
                <div class="hstat">
                  <span class="hstat-icon">📋</span>
                  <span>{{ parcours.totalNodes }} étapes</span>
                </div>
                <div class="hstat">
                  <span class="hstat-icon">✅</span>
                  <span>{{ parcours.completedNodes }} terminées</span>
                </div>
                <div class="hstat">
                  <span class="hstat-icon">⚡</span>
                  <span>{{ parcours.xpReward }} XP au total</span>
                </div>
              </div>
            </div>

            <!-- Anneau de progression -->
            <div class="header-ring-wrap">
              <svg viewBox="0 0 36 36" class="ring-svg">
                <path class="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="ring-fill"
                  :stroke-dasharray="`${progressPct}, 100`"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div class="ring-center">
                <span class="ring-pct">{{ progressPct }}%</span>
                <span class="ring-label">terminé</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ── CARTE DU PARCOURS ─────────────────────────────────────────── -->
        <div class="path-map">

          <div class="path-track">
            <div
              v-for="(node, index) in parcours.nodes"
              :key="node.id"
              class="path-step"
              :class="{
                'path-step--left': index % 2 === 0,
                'path-step--right': index % 2 === 1,
              }"
            >
              <!-- Connecteur (sauf premier) -->
              <div v-if="index > 0" class="path-connector" :class="`connector--${node.status}`" />

              <!-- Nœud -->
              <div class="node-wrapper">
                <component
                  :is="canNavigate(node) ? 'a' : 'div'"
                  :href="canNavigate(node) ? getNodeLink(node) : undefined"
                  @click.prevent="canNavigate(node) && navigateToNode(node)"
                  class="path-node"
                  :class="`path-node--${node.status} path-node--${node.type}`"
                  :title="node.title"
                >
                  <div v-if="node.status === 'locked'" class="node-lock">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="lock-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div v-else-if="node.status === 'completed'" class="node-check">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="check-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span v-else class="node-emoji">{{ node.icon }}</span>

                  <!-- Badge de type -->
                  <div class="node-type-badge">{{ typeLabel(node.type) }}</div>
                </component>

                <!-- Étiquette -->
                <div class="node-label" :class="`label--${node.status}`">
                  <p class="label-title">{{ node.title }}</p>
                  <p class="label-meta">{{ node.duration }} min · +{{ node.xpReward }} XP</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </template>

      <!-- 404 -->
      <div v-else class="not-found">
        <p>Parcours introuvable.</p>
        <NuxtLink to="/apprenant/parcours" class="back-link">← Retour aux parcours</NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useLearnerStore } from '~/stores/learnerStore'
import type { PathNode } from '~/types/learner'

definePageMeta({ layout: 'learner' })

const route = useRoute()
const router = useRouter()
const store = useLearnerStore()

const parcours = ref(store.getParcoursById(route.params.id as string) ?? null)

onMounted(async () => {
  if (!parcours.value) {
    parcours.value = await store.loadParcours(route.params.id as string)
  }
})

const langName = computed(() => {
  if (!parcours.value) return ''
  return store.languages.find(l => l.id === parcours.value!.languageId)?.name ?? ''
})

const progressPct = computed(() => {
  if (!parcours.value) return 0
  return Math.round((parcours.value.completedNodes / parcours.value.totalNodes) * 100)
})

function canNavigate(node: PathNode): boolean {
  return node.status !== 'locked'
}

function getNodeLink(node: PathNode): string {
  if (node.type === 'quiz') return `/apprenant/quiz/${node.id}?parcours=${route.params.id}`
  return `/apprenant/lecon/${node.id}?parcours=${route.params.id}`
}

function navigateToNode(node: PathNode) {
  if (!canNavigate(node)) return
  router.push(getNodeLink(node))
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    lesson: '📖',
    quiz: '❓',
    review: '🔄',
    checkpoint: '🏆',
    bonus: '🎁'
  }
  return map[type] ?? '📖'
}
</script>

<style scoped>
.path-page {
  min-height: 100vh;
  background: #f0fdf4;
  padding-bottom: 80px;
}

.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px 0;
}

/* ── Loading ─────────────────────────────────────────────────────────────── */
.loading-state {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #E5E7EB;
  border-top-color: #1A7A1A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Back ────────────────────────────────────────────────────────────────── */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  text-decoration: none;
  margin-bottom: 20px;
  transition: color 0.15s;
}
.back-btn:hover { color: #1A7A1A; }

/* ── Header ──────────────────────────────────────────────────────────────── */
.header-content {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  margin-bottom: 40px;
}

.header-info { flex: 1; }

.header-lang-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #1A7A1A;
  background: #D1FAE5;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 10px;
}

.header-title {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 8px;
  line-height: 1.25;
}

.header-desc {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 16px;
}

.header-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.hstat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.hstat-icon { font-size: 15px; }

/* Anneau */
.header-ring-wrap {
  position: relative;
  width: 90px;
  height: 90px;
  flex-shrink: 0;
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: #F3F4F6;
  stroke-width: 3;
}

.ring-fill {
  fill: none;
  stroke: #1A7A1A;
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease;
}

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ring-pct { font-size: 18px; font-weight: 800; color: #1A7A1A; line-height: 1; }
.ring-label { font-size: 9px; color: #9CA3AF; font-weight: 600; margin-top: 2px; }

/* ── Path map ────────────────────────────────────────────────────────────── */
.path-map {
  padding: 0 0 40px;
}

.path-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  position: relative;
}

.path-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
}

.path-step--left  { align-items: flex-start; padding-left: 100px; }
.path-step--right { align-items: flex-end;   padding-right: 100px; }

/* Connecteur */
.path-connector {
  width: 3px;
  height: 48px;
  margin: 0 auto;
}

.connector--completed { background: #1A7A1A; }
.connector--current   { background: linear-gradient(to bottom, #1A7A1A, #D1FAE5); }
.connector--locked    { background: #E5E7EB; border-left: 3px dashed #D1D5DB; width: 0; }

/* Nœud */
.node-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
}

.path-step--left  .node-wrapper { flex-direction: row; }
.path-step--right .node-wrapper { flex-direction: row-reverse; }

.path-node {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  text-decoration: none;
  flex-shrink: 0;
  border: 3px solid transparent;
}

.path-node--completed {
  background: #1A7A1A;
  border-color: #1A7A1A;
  box-shadow: 0 4px 16px rgba(26, 122, 26, 0.35);
}

.path-node--current {
  background: white;
  border-color: #1A7A1A;
  box-shadow: 0 0 0 6px rgba(26, 122, 26, 0.15), 0 4px 16px rgba(26, 122, 26, 0.2);
  animation: pulse-ring 2s infinite;
}

.path-node--locked {
  background: #F9FAFB;
  border-color: #E5E7EB;
  cursor: not-allowed;
}

.path-node--checkpoint {
  width: 78px;
  height: 78px;
}

.path-node--checkpoint.path-node--current,
.path-node--checkpoint.path-node--completed {
  background: linear-gradient(135deg, #F0B429, #E06510);
  border-color: #F0B429;
  box-shadow: 0 4px 20px rgba(240, 180, 41, 0.4);
}

@keyframes pulse-ring {
  0%, 100% { box-shadow: 0 0 0 6px rgba(26, 122, 26, 0.15), 0 4px 16px rgba(26, 122, 26, 0.2); }
  50%       { box-shadow: 0 0 0 10px rgba(26, 122, 26, 0.08), 0 4px 16px rgba(26, 122, 26, 0.3); }
}

.path-node:hover:not(.path-node--locked) {
  transform: scale(1.08);
}

.node-lock { }
.lock-icon { width: 22px; height: 22px; color: #9CA3AF; }
.node-check { }
.check-icon { width: 26px; height: 26px; color: white; }
.node-emoji { font-size: 26px; }

.node-type-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  border: 1.5px solid #E5E7EB;
}

/* Étiquette */
.node-label {
  max-width: 160px;
  background: white;
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1.5px solid #F3F4F6;
}

.label-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 3px;
}

.label-meta {
  font-size: 11px;
  color: #9CA3AF;
}

.label--locked .label-title { color: #9CA3AF; }

/* ── Not found ───────────────────────────────────────────────────────────── */
.not-found {
  text-align: center;
  padding: 80px;
  color: #6B7280;
}

.back-link {
  display: inline-block;
  margin-top: 16px;
  color: #1A7A1A;
  text-decoration: none;
  font-weight: 600;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .header-content { flex-direction: column; }
  .header-ring-wrap { align-self: center; }
  .path-step--left  { padding-left: 16px; }
  .path-step--right { padding-right: 16px; }
  .node-label { max-width: 120px; }
}
</style>
