<template>
  <div class="dashboard">

    <!-- ══ HERO WELCOME ══════════════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <p class="hero-greeting">{{ greeting }}, {{ firstName }} 👋</p>
          <h1 class="hero-title">Continuez votre aventure linguistique !</h1>
          <p class="hero-sub">Vous avez une série de <strong>{{ store.stats?.streak ?? 0 }} jours</strong>. Ne la brisez pas aujourd'hui !</p>

          <div v-if="store.currentNodeInActiveParcours && store.activeParcours" class="hero-cta-block">
            <p class="cta-label">Reprendre là où vous vous êtes arrêté :</p>
            <NuxtLink
              :to="getContinueLink(store.currentNodeInActiveParcours, store.activeParcours.id)"
              class="btn-continue"
            >
              <span class="btn-icon">{{ store.currentNodeInActiveParcours.icon }}</span>
              <span class="btn-text">
                <span class="btn-title">{{ store.currentNodeInActiveParcours.title }}</span>
                <span class="btn-sub">{{ store.activeParcours.title }} · +{{ store.currentNodeInActiveParcours.xpReward }} XP</span>
              </span>
              <svg class="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>
          </div>
        </div>

        <div class="hero-mascot">
          <ApprenantMascotBubble
            character="zaki"
            :mood="heroMood"
            :message="heroMessage"
            size="xl"
            :animated="true"
            position="right"
          />
        </div>
      </div>
    </section>

    <!-- ══ STATS GAMIFIÉES ═══════════════════════════════════════════════════ -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">

          <div class="stat-card stat-card--streak">
            <div class="stat-card-icon">🔥</div>
            <div class="stat-card-info">
              <p class="stat-card-value">{{ store.stats?.streak ?? 0 }}</p>
              <p class="stat-card-label">Jours de suite</p>
            </div>
            <div class="stat-card-badge">Record : {{ store.stats?.maxStreak ?? 0 }}</div>
          </div>

          <div class="stat-card stat-card--xp">
            <div class="stat-card-icon">⚡</div>
            <div class="stat-card-info">
              <p class="stat-card-value">{{ store.stats?.xp ?? 0 }}</p>
              <p class="stat-card-label">Points XP</p>
            </div>
            <div class="stat-card-badge">Niv. {{ store.stats?.level ?? 1 }}</div>
          </div>

          <div class="stat-card stat-card--coins">
            <div class="stat-card-icon">🪙</div>
            <div class="stat-card-info">
              <p class="stat-card-value">{{ store.stats?.coins ?? 0 }}</p>
              <p class="stat-card-label">Pièces</p>
            </div>
          </div>

          <div class="stat-card stat-card--lessons">
            <div class="stat-card-icon">📚</div>
            <div class="stat-card-info">
              <p class="stat-card-value">{{ store.stats?.totalLessonsCompleted ?? 0 }}</p>
              <p class="stat-card-label">Leçons terminées</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <div class="main-grid container">

      <!-- ── COLONNE GAUCHE ─────────────────────────────────────────────── -->
      <div class="main-left">

        <!-- Coffre quotidien -->
        <ApprenantDailyChest :chest="dailyChest" @open="onChestOpen" />

        <!-- Quêtes du jour -->
        <ApprenantDailyQuests :quests="dailyQuests" />

        <!-- Objectif hebdomadaire -->
        <div class="widget-card">
          <div class="widget-header">
            <h2 class="widget-title">Objectif de la semaine</h2>
            <span class="widget-badge">{{ store.weeklyGoalPercent }}%</span>
          </div>
          <div class="goal-bar-track">
            <div class="goal-bar-fill" :style="{ width: store.weeklyGoalPercent + '%' }" />
          </div>
          <div class="goal-details">
            <span class="goal-current">{{ weeklyXPTotal }} XP gagnés</span>
            <span class="goal-target">Objectif : {{ store.stats?.weeklyGoalXP ?? 500 }} XP</span>
          </div>
          <div class="goal-days">
            <div
              v-for="(xp, i) in (store.stats?.weeklyXP ?? [])"
              :key="i"
              class="goal-day"
              :class="{ 'goal-day--done': xp > 0 }"
              :title="dayLabels[i] + ' : ' + xp + ' XP'"
            >
              <div class="day-bar-wrap">
                <div class="day-bar" :style="{ height: Math.min(100, (xp / 200) * 100) + '%' }" />
              </div>
              <span class="day-label">{{ dayLabels[i] }}</span>
            </div>
          </div>
        </div>

        <!-- Mes langues -->
        <div class="widget-card">
          <div class="widget-header">
            <h2 class="widget-title">Mes langues</h2>
            <NuxtLink to="/apprenant/parcours" class="widget-link">Voir tout →</NuxtLink>
          </div>
          <div class="languages-list">
            <div
              v-for="lang in store.languages"
              :key="lang.id"
              class="lang-item"
            >
              <div class="lang-flag">{{ lang.flag }}</div>
              <div class="lang-info">
                <div class="lang-header-row">
                  <span class="lang-name">{{ lang.name }}</span>
                  <span class="lang-level">{{ lang.currentLevel }}</span>
                </div>
                <div class="lang-bar-track">
                  <div class="lang-bar-fill" :style="{ width: lang.progressPercent + '%', background: lang.color }" />
                </div>
                <div class="lang-xp">{{ lang.totalXP }} XP · {{ lang.progressPercent }}%</div>
              </div>
              <NuxtLink :to="`/apprenant/parcours?lang=${lang.id}`" class="lang-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>

      </div>

      <!-- ── COLONNE DROITE ─────────────────────────────────────────────── -->
      <div class="main-right">

        <!-- Niveau XP -->
        <div class="widget-card level-card">
          <div class="level-top">
            <div class="level-icon">{{ levelEmoji }}</div>
            <div class="level-info">
              <p class="level-title">{{ store.stats?.levelTitle ?? 'Débutant' }}</p>
              <p class="level-sub">Niveau {{ store.stats?.level ?? 1 }}</p>
            </div>
          </div>
          <div class="xp-bar-track">
            <div class="xp-bar-fill" :style="{ width: store.xpPercent + '%' }" />
          </div>
          <div class="xp-details">
            <span>{{ store.stats?.xp ?? 0 }} XP</span>
            <span>{{ store.stats?.xpToNextLevel ?? 1500 }} XP pour le prochain niveau</span>
          </div>
        </div>

        <!-- Badges récents -->
        <div class="widget-card">
          <div class="widget-header">
            <h2 class="widget-title">Badges récents</h2>
            <NuxtLink to="/apprenant/badges" class="widget-link">Voir tout →</NuxtLink>
          </div>
          <div class="badges-grid" v-if="store.unlockedBadges.length">
            <div
              v-for="badge in store.unlockedBadges.slice(0, 6)"
              :key="badge.id"
              class="badge-item"
              :title="badge.name + ' — ' + badge.description"
              :style="{ background: badge.bgColor }"
            >
              <span class="badge-icon">{{ badge.icon }}</span>
            </div>
          </div>
          <p v-else class="empty-text">Complétez des leçons pour gagner vos premiers badges !</p>
        </div>

        <!-- Parcours en cours -->
        <div class="widget-card" v-if="store.activeParcours">
          <div class="widget-header">
            <h2 class="widget-title">Parcours en cours</h2>
          </div>
          <NuxtLink :to="`/apprenant/parcours/${store.activeParcours.id}`" class="parcours-preview">
            <div class="parcours-preview-info">
              <p class="parcours-preview-title">{{ store.activeParcours.title }}</p>
              <p class="parcours-preview-count">
                {{ store.activeParcours.completedNodes }} / {{ store.activeParcours.totalNodes }} étapes
              </p>
            </div>
            <div class="parcours-preview-ring">
              <svg viewBox="0 0 36 36" class="ring-svg">
                <path class="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="ring-fill" :stroke-dasharray="`${Math.round((store.activeParcours.completedNodes / store.activeParcours.totalNodes) * 100)}, 100`"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span class="ring-pct">{{ Math.round((store.activeParcours.completedNodes / store.activeParcours.totalNodes) * 100) }}%</span>
            </div>
          </NuxtLink>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useLearnerStore } from '~/stores/learnerStore'
import type { PathNode } from '~/types/learner'
import type { DailyChestState } from '~/types/mascot'
import { getMascotMessage } from '~/data/mascot-data'
import { mockDailyQuests, mockDailyChest } from '~/data/learner-mock'

definePageMeta({ layout: 'learner' })

const authStore = useAuthStore()
const store = useLearnerStore()

onMounted(() => store.init())

// ─── Daily chest & quests (local state — swap for API later) ───────────────
const dailyChest = ref<DailyChestState>({ ...mockDailyChest })
const dailyQuests = ref([...mockDailyQuests])

function onChestOpen(_reward: DailyChestState['reward']) {
  dailyChest.value.available = false
}

const firstName = computed(() => {
  const u = authStore.user
  return u?.profile?.firstName || u?.firstName || u?.username || 'Apprenant'
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bon après-midi'
  return 'Bonsoir'
})

const heroMood = computed(() => {
  const streak = store.stats?.streak ?? 0
  if (streak >= 7) return 'excited' as const
  if (streak >= 3) return 'happy' as const
  return 'encouraging' as const
})

const heroMessage = computed(() =>
  getMascotMessage('zaki', 'greeting', { name: firstName.value })
)

const levelEmoji = computed(() => {
  const lvl = store.stats?.level ?? 1
  if (lvl <= 2) return '🌱'
  if (lvl <= 5) return '🌿'
  if (lvl <= 10) return '🌳'
  return '🏆'
})

const weeklyXPTotal = computed(() => {
  return store.stats?.weeklyXP.reduce((a, b) => a + b, 0) ?? 0
})

const dayLabels = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']

function getContinueLink(node: PathNode, parcoursId: string): string {
  if (node.type === 'quiz') return `/apprenant/quiz/${node.id}?parcours=${parcoursId}`
  return `/apprenant/lecon/${node.id}?parcours=${parcoursId}`
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f0fdf4;
}

/* ── Container ───────────────────────────────────────────────────────────── */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
.hero {
  background: linear-gradient(135deg, #1A7A1A 0%, #208020 60%, #2d9c2d 100%);
  padding: 0 24px;
}

.hero-content {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 40px 0;
}

.hero-text { flex: 1; }

.hero-greeting {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin-bottom: 6px;
}

.hero-title {
  font-size: 28px;
  font-weight: 800;
  color: white;
  line-height: 1.25;
  margin-bottom: 10px;
}

.hero-sub {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 24px;
}

.hero-sub strong { color: #F0B429; }

.hero-cta-block {}

.cta-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
  margin-bottom: 8px;
}

.btn-continue {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: white;
  color: #1A7A1A;
  padding: 12px 20px;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
  max-width: 420px;
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.btn-icon { font-size: 22px; }
.btn-text { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.btn-title { font-size: 14px; font-weight: 700; }
.btn-sub { font-size: 11.5px; color: #6B7280; font-weight: 500; }
.btn-arrow { width: 18px; height: 18px; flex-shrink: 0; color: #1A7A1A; }

.hero-mascot {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mascot-img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.3);
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

/* ── Stats ───────────────────────────────────────────────────────────────── */
.stats-section {
  padding: 24px 24px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1.5px solid transparent;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.stat-card--streak { border-color: #FED7AA; }
.stat-card--xp     { border-color: #FDE68A; }
.stat-card--coins  { border-color: #BBF7D0; }
.stat-card--lessons { border-color: #BFDBFE; }

.stat-card-icon { font-size: 28px; line-height: 1; }

.stat-card-info { flex: 1; }

.stat-card-value {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.stat-card-label {
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 500;
  margin-top: 3px;
}

.stat-card-badge {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 10px;
  font-weight: 600;
  color: #6B7280;
  background: #F3F4F6;
  padding: 2px 7px;
  border-radius: 20px;
}

/* ── Main grid ───────────────────────────────────────────────────────────── */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  padding-top: 20px;
  padding-bottom: 40px;
  align-items: start;
}

.main-left,
.main-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Widget card ─────────────────────────────────────────────────────────── */
.widget-card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #f0fdf4;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.widget-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.widget-badge {
  font-size: 12px;
  font-weight: 700;
  color: #1A7A1A;
  background: #D1FAE5;
  padding: 2px 8px;
  border-radius: 20px;
}

.widget-link {
  font-size: 12px;
  font-weight: 600;
  color: #1A7A1A;
  text-decoration: none;
}
.widget-link:hover { text-decoration: underline; }

/* ── Objectif hebdo ──────────────────────────────────────────────────────── */
.goal-bar-track {
  height: 10px;
  background: #F3F4F6;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
}

.goal-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1A7A1A, #34C759);
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.goal-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9CA3AF;
  margin-bottom: 16px;
}

.goal-current { font-weight: 600; color: #1A7A1A; }

.goal-days {
  display: flex;
  gap: 6px;
  align-items: flex-end;
}

.goal-day {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.day-bar-wrap {
  width: 100%;
  height: 48px;
  background: #F9FAFB;
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border: 1.5px solid #E5E7EB;
}

.day-bar {
  width: 100%;
  background: #D1FAE5;
  border-radius: 4px;
  min-height: 4px;
  transition: height 0.5s ease;
}

.goal-day--done .day-bar { background: #1A7A1A; }

.day-label {
  font-size: 10px;
  font-weight: 600;
  color: #9CA3AF;
}

.goal-day--done .day-label { color: #1A7A1A; }

/* ── Langues ─────────────────────────────────────────────────────────────── */
.languages-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.lang-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lang-flag { font-size: 24px; flex-shrink: 0; }

.lang-info { flex: 1; min-width: 0; }

.lang-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.lang-name { font-size: 13.5px; font-weight: 600; color: #111827; }

.lang-level {
  font-size: 10px;
  font-weight: 700;
  color: #1A7A1A;
  background: #D1FAE5;
  padding: 2px 6px;
  border-radius: 6px;
}

.lang-bar-track {
  height: 6px;
  background: #F3F4F6;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 4px;
}

.lang-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.lang-xp { font-size: 11px; color: #9CA3AF; }

.lang-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6B7280;
  text-decoration: none;
  transition: all 0.15s;
  flex-shrink: 0;
}
.lang-btn:hover { background: #1A7A1A; color: white; }

/* ── Level card ──────────────────────────────────────────────────────────── */
.level-card { background: linear-gradient(135deg, #f0fdf4, #dcfce7); }

.level-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.level-icon { font-size: 36px; }

.level-title { font-size: 16px; font-weight: 800; color: #1A7A1A; }
.level-sub { font-size: 12px; color: #6B7280; margin-top: 2px; }

.xp-bar-track {
  height: 12px;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
  border: 1px solid #BBF7D0;
}

.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1A7A1A, #F0B429);
  border-radius: 12px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.xp-bar-fill::after {
  content: '';
  position: absolute;
  top: 2px; right: 2px; bottom: 2px;
  width: 40%;
  background: rgba(255,255,255,0.3);
  border-radius: 10px;
}

.xp-details {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: #6B7280;
  font-weight: 500;
}

.xp-details span:first-child { font-weight: 700; color: #1A7A1A; }

/* ── Badges ──────────────────────────────────────────────────────────────── */
.badges-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.badge-item {
  aspect-ratio: 1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: default;
  transition: transform 0.15s;
}
.badge-item:hover { transform: scale(1.1); }

.empty-text {
  font-size: 12.5px;
  color: #9CA3AF;
  text-align: center;
  padding: 12px 0;
  line-height: 1.5;
}

/* ── Parcours preview ────────────────────────────────────────────────────── */
.parcours-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  padding: 4px 0;
  transition: opacity 0.15s;
}
.parcours-preview:hover { opacity: 0.8; }

.parcours-preview-info { flex: 1; }
.parcours-preview-title { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 3px; }
.parcours-preview-count { font-size: 12px; color: #9CA3AF; }

.parcours-preview-ring {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.ring-svg { width: 100%; height: 100%; transform: rotate(-90deg); }

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

.ring-pct {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: #1A7A1A;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  .main-right { order: -1; }
  .main-right .widget-card:not(:first-child) { display: none; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .hero-content { flex-direction: column; text-align: center; }
  .hero-mascot { display: none; }
  .hero-title { font-size: 22px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .badges-grid { grid-template-columns: repeat(4, 1fr); }
}
</style>
