<template>
  <Transition name="parcours-fade">
    <div v-if="visible" class="parcours-complete">
      <ApprenantConfetti :active="confettiActive" :count="90" :duration="4500" />

      <!-- Background decoration -->
      <div class="bg-decoration" aria-hidden="true">
        <div class="bg-circle c1" />
        <div class="bg-circle c2" />
        <div class="bg-circle c3" />
      </div>

      <div class="complete-content">
        <!-- Header -->
        <div class="complete-header">
          <div class="trophy-icon">🏆</div>
          <h1 class="complete-title">Parcours terminé !</h1>
          <p class="complete-subtitle">Tu as complété <strong>{{ parcoursName }}</strong></p>
        </div>

        <!-- Mascot -->
        <div class="mascot-area">
          <ApprenantMascotBubble
            character="zaki"
            mood="celebrating"
            :message="mascotMessage"
            size="xl"
            :animated="true"
            position="center"
          />
        </div>

        <!-- Stats grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-value">+{{ xpEarned }}</div>
            <div class="stat-label">XP gagnés</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-value">{{ formatDuration(timeSpentSeconds) }}</div>
            <div class="stat-label">Temps</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-value">{{ lessonsCount }}</div>
            <div class="stat-label">Leçons</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🧠</div>
            <div class="stat-value">{{ quizScore }}%</div>
            <div class="stat-label">Quiz moyen</div>
          </div>
        </div>

        <!-- Certificate band -->
        <div class="certificate-band">
          <div class="cert-icon">🎓</div>
          <div class="cert-text">
            <div class="cert-title">Certificat de complétion</div>
            <div class="cert-sub">{{ parcoursName }} — {{ languageName }}</div>
          </div>
          <button class="cert-download" @click="downloadCertificate">
            Voir
          </button>
        </div>

        <!-- Actions -->
        <div class="actions">
          <button class="btn-primary" @click="emit('continue')">
            Continuer l'aventure
          </button>
          <button class="btn-secondary" @click="emit('share')">
            Partager 📣
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { getMascotMessage } from '~/data/mascot-data'

const props = withDefaults(defineProps<{
  visible?: boolean
  parcoursName?: string
  languageName?: string
  xpEarned?: number
  timeSpentSeconds?: number
  lessonsCount?: number
  quizScore?: number
}>(), {
  visible: false,
  parcoursName: 'Parcours',
  languageName: '',
  xpEarned: 0,
  timeSpentSeconds: 0,
  lessonsCount: 0,
  quizScore: 0
})

const emit = defineEmits<{
  continue: []
  share: []
}>()

const confettiActive = ref(false)

const mascotMessage = computed(() =>
  getMascotMessage('zaki', 'parcours_complete')
)

watch(() => props.visible, (val) => {
  if (val) {
    confettiActive.value = true
    setTimeout(() => { confettiActive.value = false }, 4500)
  }
})

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h${(m % 60).toString().padStart(2, '0')}`
  return `${m} min`
}

function downloadCertificate() {
  // Placeholder — hook into a real certificate generator
  alert('Certificat bientôt disponible !')
}
</script>

<style scoped>
.parcours-complete {
  position: fixed;
  inset: 0;
  background: linear-gradient(160deg, #0f2d12 0%, #1a4a1a 40%, #0c3a0c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 8000;
  overflow-y: auto;
  padding: 24px 16px;
}

/* ─── Decorations ───────────────────────────────────── */
.bg-decoration { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.03);
}
.c1 { width: 500px; height: 500px; top: -200px; right: -200px; }
.c2 { width: 300px; height: 300px; bottom: -100px; left: -100px; }
.c3 { width: 200px; height: 200px; top: 40%; left: 10%; }

/* ─── Content ───────────────────────────────────────── */
.complete-content {
  position: relative;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

/* ─── Header ────────────────────────────────────────── */
.complete-header { text-align: center; }

.trophy-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 12px;
  animation: trophy-drop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes trophy-drop {
  0%   { transform: translateY(-40px) scale(0.5); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

.complete-title {
  font-size: 32px;
  font-weight: 900;
  color: #F0B429;
  margin: 0 0 8px;
  text-shadow: 0 2px 12px rgba(240,180,41,0.4);
}
.complete-subtitle {
  font-size: 15px;
  color: rgba(255,255,255,0.7);
  margin: 0;
}
.complete-subtitle strong { color: white; }

/* ─── Mascot ────────────────────────────────────────── */
.mascot-area { width: 100%; display: flex; justify-content: center; }

/* ─── Stats ─────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;
}
.stat-card {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  padding: 12px 8px;
  text-align: center;
  backdrop-filter: blur(4px);
}
.stat-icon  { font-size: 20px; margin-bottom: 4px; }
.stat-value { font-size: 18px; font-weight: 800; color: white; }
.stat-label { font-size: 10px; color: rgba(255,255,255,0.5); margin-top: 2px; }

/* ─── Certificate ───────────────────────────────────── */
.certificate-band {
  width: 100%;
  background: rgba(240,180,41,0.12);
  border: 1px solid rgba(240,180,41,0.3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
}
.cert-icon { font-size: 28px; flex-shrink: 0; }
.cert-text  { flex: 1; min-width: 0; }
.cert-title { font-size: 13px; font-weight: 700; color: #F0B429; }
.cert-sub   { font-size: 11px; color: rgba(255,255,255,0.5); }
.cert-download {
  background: rgba(240,180,41,0.2);
  border: 1px solid rgba(240,180,41,0.4);
  color: #F0B429;
  border-radius: 10px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.cert-download:hover { background: rgba(240,180,41,0.35); }

/* ─── Actions ───────────────────────────────────────── */
.actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }

.btn-primary {
  background: linear-gradient(135deg, #F0B429, #E06510);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(240,180,41,0.4);
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(240,180,41,0.5);
}
.btn-secondary {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.8);
  border-radius: 14px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-secondary:hover { background: rgba(255,255,255,0.15); }

/* ─── Transition ────────────────────────────────────── */
.parcours-fade-enter-active { animation: parcours-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
.parcours-fade-leave-active { animation: parcours-out 0.35s ease-in forwards; }
@keyframes parcours-in  { from { opacity: 0; } to { opacity: 1; } }
@keyframes parcours-out { from { opacity: 1; } to { opacity: 0; } }
</style>
