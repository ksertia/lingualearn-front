<template>
  <div class="badges-page">
    <div class="page-container">

      <!-- En-tête -->
      <div class="page-header">
        <h1 class="page-title">Mes Badges</h1>
        <p class="page-sub">
          <span class="badges-unlocked">{{ store.unlockedBadges.length }}</span>
          <span> / {{ store.badges.length }} badges débloqués</span>
        </p>
      </div>

      <!-- Barre de progression badges -->
      <div class="badge-progress-card">
        <div class="progress-label-row">
          <span class="progress-label">Progression des badges</span>
          <span class="progress-pct">{{ Math.round((store.unlockedBadges.length / store.badges.length) * 100) }}%</span>
        </div>
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: Math.round((store.unlockedBadges.length / store.badges.length) * 100) + '%' }"
          />
        </div>
      </div>

      <!-- Filtres catégories -->
      <div class="category-filters">
        <button
          class="cat-btn"
          :class="{ 'cat-btn--active': activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          Tous ({{ store.badges.length }})
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-btn"
          :class="{ 'cat-btn--active': activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          {{ cat.icon }} {{ cat.label }} ({{ countByCategory(cat.id) }})
        </button>
      </div>

      <!-- Grille de badges -->
      <div class="badges-grid">
        <div
          v-for="badge in filteredBadges"
          :key="badge.id"
          class="badge-card"
          :class="{ 'badge-card--locked': !badge.unlocked, 'badge-card--clickable': badge.unlocked }"
          @click="badge.unlocked && celebrateBadge(badge)"
        >
          <!-- Icône -->
          <div
            class="badge-icon-wrap"
            :style="{
              background: badge.unlocked ? badge.bgColor : '#F3F4F6',
              borderColor: badge.unlocked ? badge.color + '40' : '#E5E7EB'
            }"
          >
            <span class="badge-emoji" :class="{ 'badge-emoji--locked': !badge.unlocked }">
              {{ badge.icon }}
            </span>
            <div v-if="!badge.unlocked" class="lock-overlay">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="lock-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <!-- Contenu -->
          <div class="badge-content">
            <div class="badge-header">
              <h3 class="badge-name">{{ badge.name }}</h3>
              <span
                class="badge-category"
                :style="badge.unlocked ? { background: badge.bgColor, color: badge.color } : {}"
              >
                {{ categoryLabel(badge.category) }}
              </span>
            </div>
            <p class="badge-desc">{{ badge.description }}</p>

            <!-- Progression (si pas encore débloqué) -->
            <div v-if="!badge.unlocked && badge.maxProgress > 1" class="badge-progress">
              <div class="mini-track">
                <div
                  class="mini-fill"
                  :style="{ width: Math.round((badge.progress / badge.maxProgress) * 100) + '%' }"
                />
              </div>
              <span class="mini-label">{{ badge.progress }} / {{ badge.maxProgress }}</span>
            </div>

            <!-- Date débloqué -->
            <p v-if="badge.unlocked && badge.unlockedAt" class="badge-date">
              Débloqué le {{ formatDate(badge.unlockedAt) }}
            </p>
          </div>

          <!-- Bouclier -->
          <div v-if="badge.unlocked" class="badge-unlocked-mark" :style="{ background: badge.color }">✓</div>
        </div>
      </div>

      <!-- Vide -->
      <div v-if="filteredBadges.length === 0" class="empty-state">
        <div class="empty-icon">🏅</div>
        <h3>Aucun badge dans cette catégorie</h3>
        <p>Continuez à apprendre pour débloquer vos badges !</p>
      </div>

    </div>
  </div>

  <!-- Célébration badge -->
  <ApprenantBadgeCelebration
    :badge="celebrationBadge"
    :visible="showCelebration"
    @close="showCelebration = false"
  />
</template>

<script setup lang="ts">
import { useLearnerStore } from '~/stores/learnerStore'
import type { BadgeCategory, Badge } from '~/types/learner'

definePageMeta({ layout: 'learner' })

const store = useLearnerStore()
onMounted(() => store.init())

const activeCategory = ref<'all' | BadgeCategory>('all')

const showCelebration = ref(false)
const celebrationBadge = ref<Badge | null>(null)

function celebrateBadge(badge: Badge) {
  celebrationBadge.value = badge
  showCelebration.value = true
}

const categories = [
  { id: 'streak',     label: 'Régularité', icon: '🔥' },
  { id: 'xp',        label: 'XP',         icon: '⚡' },
  { id: 'completion', label: 'Complétion', icon: '✅' },
  { id: 'special',   label: 'Spécial',    icon: '🌟' }
] as const

const filteredBadges = computed(() => {
  if (activeCategory.value === 'all') return store.badges
  return store.badges.filter(b => b.category === activeCategory.value)
})

function countByCategory(cat: string): number {
  return store.badges.filter(b => b.category === cat).length
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    streak: 'Régularité',
    xp: 'XP',
    completion: 'Complétion',
    special: 'Spécial'
  }
  return map[cat] ?? cat
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
.badges-page {
  min-height: 100vh;
  background: #f0fdf4;
  padding-bottom: 60px;
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 0;
}

/* ── Header ──────────────────────────────────────────────────────────────── */
.page-header { margin-bottom: 20px; }

.page-title { font-size: 28px; font-weight: 800; color: #111827; margin-bottom: 4px; }

.page-sub { font-size: 15px; color: #6B7280; }

.badges-unlocked { font-weight: 800; color: #1A7A1A; font-size: 18px; }

/* ── Progress card ───────────────────────────────────────────────────────── */
.badge-progress-card {
  background: white;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 24px;
}

.progress-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13.5px;
  font-weight: 600;
}

.progress-label { color: #374151; }
.progress-pct   { color: #1A7A1A; }

.progress-track {
  height: 12px;
  background: #F3F4F6;
  border-radius: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1A7A1A, #F0B429);
  border-radius: 12px;
  transition: width 0.6s ease;
}

/* ── Filtres ─────────────────────────────────────────────────────────────── */
.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.cat-btn {
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

.cat-btn:hover { border-color: #1A7A1A; color: #1A7A1A; }
.cat-btn--active { background: #1A7A1A; border-color: #1A7A1A; color: white; }

/* ── Grille ──────────────────────────────────────────────────────────────── */
.badges-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

/* ── Badge card ──────────────────────────────────────────────────────────── */
.badge-card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1.5px solid #F3F4F6;
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
}

.badge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.badge-card--locked {
  opacity: 0.65;
}

.badge-card--clickable {
  cursor: pointer;
}
.badge-card--clickable:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

/* Icône */
.badge-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.badge-emoji { font-size: 30px; z-index: 1; position: relative; }
.badge-emoji--locked { filter: grayscale(1) opacity(0.5); }

.lock-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.7);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-icon { width: 20px; height: 20px; color: #9CA3AF; }

/* Contenu */
.badge-content { flex: 1; min-width: 0; }

.badge-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 5px;
}

.badge-name {
  font-size: 14.5px;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}

.badge-category {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  background: #F3F4F6;
  color: #6B7280;
  white-space: nowrap;
  flex-shrink: 0;
}

.badge-desc {
  font-size: 12.5px;
  color: #6B7280;
  line-height: 1.4;
  margin-bottom: 8px;
}

/* Mini barre de progression */
.badge-progress { display: flex; align-items: center; gap: 8px; }

.mini-track {
  flex: 1;
  height: 6px;
  background: #F3F4F6;
  border-radius: 6px;
  overflow: hidden;
}

.mini-fill {
  height: 100%;
  background: linear-gradient(90deg, #1A7A1A, #34C759);
  border-radius: 6px;
}

.mini-label { font-size: 11px; font-weight: 600; color: #9CA3AF; white-space: nowrap; }

.badge-date { font-size: 11px; color: #9CA3AF; font-style: italic; }

/* Mark débloqué */
.badge-unlocked-mark {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: white;
}

/* ── Empty ───────────────────────────────────────────────────────────────── */
.empty-state { text-align: center; padding: 60px 20px; color: #6B7280; }
.empty-icon  { font-size: 48px; margin-bottom: 14px; }
.empty-state h3 { font-size: 17px; font-weight: 700; color: #374151; margin-bottom: 6px; }
.empty-state p  { font-size: 13.5px; line-height: 1.5; }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .badges-grid { grid-template-columns: 1fr; }
}
</style>
