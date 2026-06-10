<template>
  <div class="profile-page">

    <!-- ══ HERO PROFIL ═══════════════════════════════════════════════════════ -->
    <div class="profile-hero">
      <div class="hero-bg" />
      <div class="hero-content">
        <!-- Avatar -->
        <div class="avatar-wrapper">
          <div class="avatar-ring">
            <img
              v-if="authStore.user?.profile?.avatarUrl"
              :src="authStore.user.profile.avatarUrl"
              class="avatar-img"
            />
            <span v-else class="avatar-initial">{{ firstName.charAt(0) }}</span>
          </div>
          <div class="level-badge">{{ store.stats?.level ?? 1 }}</div>
        </div>

        <div class="hero-info">
          <h1 class="hero-name">{{ firstName }} {{ lastName }}</h1>
          <p class="hero-title-label">{{ store.stats?.levelTitle ?? 'Apprenant' }}</p>

          <!-- Barre XP -->
          <div class="xp-section">
            <div class="xp-labels">
              <span class="xp-current">{{ store.stats?.xp ?? 0 }} XP</span>
              <span class="xp-next">Prochain niveau : {{ store.stats?.xpToNextLevel ?? 1500 }} XP</span>
            </div>
            <div class="xp-bar-track">
              <div class="xp-bar-fill" :style="{ width: store.xpPercent + '%' }" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ CONTENU ═══════════════════════════════════════════════════════════ -->
    <div class="profile-body">
      <div class="body-container">

        <!-- ── STATISTIQUES ─────────────────────────────────────────────── -->
        <div class="section">
          <h2 class="section-title">Statistiques</h2>
          <div class="stats-grid">

            <div class="stat-card stat--streak">
              <div class="stat-top">
                <span class="stat-icon">🔥</span>
                <span class="stat-main">{{ store.stats?.streak ?? 0 }}</span>
              </div>
              <p class="stat-label">Jours de suite</p>
              <p class="stat-sub">Record : {{ store.stats?.maxStreak ?? 0 }}</p>
            </div>

            <div class="stat-card stat--xp">
              <div class="stat-top">
                <span class="stat-icon">⚡</span>
                <span class="stat-main">{{ store.stats?.xp ?? 0 }}</span>
              </div>
              <p class="stat-label">Points XP</p>
              <p class="stat-sub">Niveau {{ store.stats?.level ?? 1 }}</p>
            </div>

            <div class="stat-card stat--lessons">
              <div class="stat-top">
                <span class="stat-icon">📚</span>
                <span class="stat-main">{{ store.stats?.totalLessonsCompleted ?? 0 }}</span>
              </div>
              <p class="stat-label">Leçons terminées</p>
            </div>

            <div class="stat-card stat--quizzes">
              <div class="stat-top">
                <span class="stat-icon">🧠</span>
                <span class="stat-main">{{ store.stats?.totalQuizzesCompleted ?? 0 }}</span>
              </div>
              <p class="stat-label">Quiz réussis</p>
            </div>

            <div class="stat-card stat--time">
              <div class="stat-top">
                <span class="stat-icon">⏱</span>
                <span class="stat-main">{{ formatTime(store.stats?.studyMinutesTotal ?? 0) }}</span>
              </div>
              <p class="stat-label">Temps d'étude</p>
            </div>

            <div class="stat-card stat--coins">
              <div class="stat-top">
                <span class="stat-icon">🪙</span>
                <span class="stat-main">{{ store.stats?.coins ?? 0 }}</span>
              </div>
              <p class="stat-label">Pièces</p>
            </div>

          </div>
        </div>

        <!-- ── ACTIVITÉ HEBDOMADAIRE ────────────────────────────────────── -->
        <div class="section">
          <h2 class="section-title">Activité cette semaine</h2>
          <div class="activity-card">
            <div class="activity-bars">
              <div
                v-for="(xp, i) in (store.stats?.weeklyXP ?? [])"
                :key="i"
                class="activity-day"
              >
                <span class="activity-xp" v-if="xp > 0">{{ xp }}</span>
                <div class="activity-bar-wrap">
                  <div
                    class="activity-bar"
                    :class="{ 'activity-bar--active': xp > 0 }"
                    :style="{ height: Math.max(8, Math.min(100, (xp / 200) * 100)) + '%' }"
                  />
                </div>
                <span class="activity-label" :class="{ 'activity-label--today': i === todayIndex }">{{ dayLabels[i] }}</span>
              </div>
            </div>
            <div class="activity-footer">
              <span class="activity-total">Total : {{ weeklyTotal }} XP</span>
              <span class="activity-goal">Objectif : {{ store.stats?.weeklyGoalXP ?? 500 }} XP</span>
            </div>
          </div>
        </div>

        <!-- ── LANGUES ──────────────────────────────────────────────────── -->
        <div class="section" v-if="store.languages.length">
          <h2 class="section-title">Mes langues</h2>
          <div class="languages-grid">
            <div v-for="lang in store.languages" :key="lang.id" class="lang-card">
              <div class="lang-header">
                <span class="lang-flag">{{ lang.flag }}</span>
                <div class="lang-info">
                  <p class="lang-name">{{ lang.name }}</p>
                  <p class="lang-level">Niveau {{ lang.currentLevel }}</p>
                </div>
                <span class="lang-xp">{{ lang.totalXP }} XP</span>
              </div>
              <div class="lang-bar-track">
                <div class="lang-bar-fill" :style="{ width: lang.progressPercent + '%', background: lang.color }" />
              </div>
              <p class="lang-progress-text">{{ lang.progressPercent }}% du niveau {{ lang.currentLevel }}</p>
            </div>
          </div>
        </div>

        <!-- ── BADGES ───────────────────────────────────────────────────── -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Badges ({{ store.unlockedBadges.length }} / {{ store.badges.length }})</h2>
            <NuxtLink to="/apprenant/badges" class="section-link">Voir tout →</NuxtLink>
          </div>
          <div class="badges-row">
            <div
              v-for="badge in store.badges.slice(0, 6)"
              :key="badge.id"
              class="profile-badge"
              :class="{ 'profile-badge--locked': !badge.unlocked }"
              :style="{ background: badge.unlocked ? badge.bgColor : '#F3F4F6' }"
              :title="`${badge.name} — ${badge.description}`"
            >
              <span class="badge-icon" :class="{ 'badge-icon--locked': !badge.unlocked }">{{ badge.icon }}</span>
              <span class="badge-name">{{ badge.name }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useLearnerStore } from '~/stores/learnerStore'

definePageMeta({ layout: 'learner' })

const authStore = useAuthStore()
const store = useLearnerStore()

onMounted(() => store.init())

const firstName = computed(() => {
  const u = authStore.user
  return u?.profile?.firstName || u?.firstName || u?.username || 'Apprenant'
})

const lastName = computed(() => {
  const u = authStore.user
  return u?.profile?.lastName || u?.lastName || ''
})

const dayLabels = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']

const todayIndex = computed(() => {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
})

const weeklyTotal = computed(() => {
  return store.stats?.weeklyXP.reduce((a, b) => a + b, 0) ?? 0
})

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m}m` : `${h}h`
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f0fdf4;
  padding-bottom: 60px;
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
.profile-hero {
  position: relative;
  padding: 48px 24px 36px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1A7A1A 0%, #208020 50%, #2d9c2d 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 28px;
}

/* Avatar */
.avatar-wrapper { position: relative; flex-shrink: 0; }

.avatar-ring {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #065F46, #1A7A1A);
  border: 4px solid rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-initial { font-size: 36px; font-weight: 800; color: white; }

.level-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 28px;
  height: 28px;
  background: #F0B429;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: white;
}

/* Info */
.hero-info { flex: 1; min-width: 0; }

.hero-name {
  font-size: 26px;
  font-weight: 800;
  color: white;
  margin-bottom: 3px;
  line-height: 1.2;
}

.hero-title-label {
  font-size: 14px;
  color: rgba(255,255,255,0.75);
  font-weight: 500;
  margin-bottom: 16px;
}

/* Barre XP */
.xp-section { max-width: 400px; }
.xp-labels { display: flex; justify-content: space-between; margin-bottom: 6px; }
.xp-current { font-size: 14px; font-weight: 700; color: white; }
.xp-next { font-size: 12px; color: rgba(255,255,255,0.65); }

.xp-bar-track {
  height: 12px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  overflow: hidden;
}

.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #F0B429, #E06510);
  border-radius: 12px;
  transition: width 0.6s ease;
}

/* ── Body ────────────────────────────────────────────────────────────────── */
.profile-body { padding: 32px 24px 0; }

.body-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ── Section ─────────────────────────────────────────────────────────────── */
.section {}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 14px;
}

.section-header .section-title { margin-bottom: 0; }

.section-link { font-size: 13px; font-weight: 600; color: #1A7A1A; text-decoration: none; }
.section-link:hover { text-decoration: underline; }

/* ── Stats grid ──────────────────────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1.5px solid transparent;
  transition: transform 0.2s;
}

.stat-card:hover { transform: translateY(-2px); }

.stat--streak  { border-color: #FED7AA; }
.stat--xp      { border-color: #FDE68A; }
.stat--lessons { border-color: #BBF7D0; }
.stat--quizzes { border-color: #DDD6FE; }
.stat--time    { border-color: #BFDBFE; }
.stat--coins   { border-color: #FEF9C3; }

.stat-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.stat-icon { font-size: 20px; }
.stat-main { font-size: 24px; font-weight: 800; color: #111827; line-height: 1; }
.stat-label { font-size: 12.5px; color: #6B7280; font-weight: 500; }
.stat-sub { font-size: 11px; color: #9CA3AF; margin-top: 2px; }

/* ── Activité ────────────────────────────────────────────────────────────── */
.activity-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.activity-bars {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  height: 100px;
  margin-bottom: 16px;
}

.activity-day {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
  justify-content: flex-end;
}

.activity-xp {
  font-size: 10px;
  font-weight: 700;
  color: #1A7A1A;
}

.activity-bar-wrap {
  width: 100%;
  background: #F3F4F6;
  border-radius: 6px;
  height: 72px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.activity-bar {
  width: 100%;
  background: #D1FAE5;
  border-radius: 4px;
  min-height: 4px;
  transition: height 0.5s ease;
}

.activity-bar--active { background: #1A7A1A; }

.activity-label { font-size: 11px; font-weight: 600; color: #9CA3AF; }
.activity-label--today { color: #1A7A1A; }

.activity-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;
  font-weight: 600;
}

.activity-total { color: #1A7A1A; }
.activity-goal  { color: #9CA3AF; }

/* ── Langues ─────────────────────────────────────────────────────────────── */
.languages-grid { display: flex; flex-direction: column; gap: 12px; }

.lang-card {
  background: white;
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.lang-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.lang-flag { font-size: 24px; }
.lang-info { flex: 1; }
.lang-name { font-size: 14px; font-weight: 700; color: #111827; }
.lang-level { font-size: 12px; color: #6B7280; }
.lang-xp { font-size: 13px; font-weight: 700; color: #D97706; }

.lang-bar-track { height: 8px; background: #F3F4F6; border-radius: 8px; overflow: hidden; margin-bottom: 6px; }
.lang-bar-fill  { height: 100%; border-radius: 8px; transition: width 0.5s; }
.lang-progress-text { font-size: 11.5px; color: #9CA3AF; }

/* ── Badges ──────────────────────────────────────────────────────────────── */
.badges-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.profile-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px 8px;
  border-radius: 14px;
  transition: transform 0.15s;
  cursor: default;
}

.profile-badge:hover { transform: scale(1.06); }
.profile-badge--locked { opacity: 0.45; }

.badge-icon { font-size: 24px; }
.badge-icon--locked { filter: grayscale(1); }

.badge-name {
  font-size: 9.5px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  line-height: 1.2;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .hero-content { flex-direction: column; text-align: center; }
  .xp-section { max-width: 100%; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .badges-row { grid-template-columns: repeat(3, 1fr); }
}
</style>
