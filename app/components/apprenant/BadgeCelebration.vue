<template>
  <Teleport to="body">
    <Transition name="celebration-fade">
      <div v-if="visible" class="celebration-overlay" @click.self="close">
        <ApprenantConfetti :active="confettiActive" :count="80" :duration="3500" />

        <div class="celebration-card">
          <!-- Close button -->
          <button class="close-btn" aria-label="Fermer" @click="close">×</button>

          <!-- Header glow -->
          <div class="card-glow" />

          <!-- Mascot celebrating -->
          <div class="mascot-area">
            <ApprenantMascotBubble
              character="zaki"
              mood="celebrating"
              :message="mascotMessage"
              size="lg"
              :animated="true"
              position="center"
            />
          </div>

          <!-- Badge display -->
          <div class="badge-display">
            <div class="badge-circle" :style="{ '--badge-color': categoryColor }">
              <span class="badge-icon">{{ badge?.icon }}</span>
              <div class="badge-shine" />
            </div>
            <div class="badge-unlock-label">Nouveau badge débloqué !</div>
            <h2 class="badge-name">{{ badge?.name }}</h2>
            <p class="badge-description">{{ badge?.description }}</p>
          </div>

          <!-- Reward info -->
          <div class="reward-row">
            <div class="reward-chip xp">
              <span>⚡</span>
              <span>+{{ badge?.xpReward ?? 0 }} XP</span>
            </div>
          </div>

          <!-- CTA -->
          <button class="cta-btn" @click="close">
            Super ! Continuer
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Badge } from '~/types/learner'
import { getMascotMessage } from '~/data/mascot-data'

const props = defineProps<{
  badge: Badge | null
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const confettiActive = ref(false)

const categoryColor = computed(() => {
  const map: Record<string, string> = {
    streak: '#E06510',
    xp: '#F0B429',
    completion: '#1A7A1A',
    special: '#8B5CF6'
  }
  return map[props.badge?.category ?? 'completion'] ?? '#1A7A1A'
})

const mascotMessage = computed(() =>
  getMascotMessage('zaki', 'badge_unlock')
)

watch(() => props.visible, (val) => {
  if (val) {
    confettiActive.value = true
    setTimeout(() => { confettiActive.value = false }, 3500)
  }
})

function close() {
  emit('close')
}
</script>

<style scoped>
.celebration-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  padding: 16px;
}

.celebration-card {
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 32px 28px 28px;
  max-width: 380px;
  width: 100%;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0,0,0,0.3);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(180deg, #f0fdf4 0%, transparent 100%);
  pointer-events: none;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: background 0.2s;
}
.close-btn:hover { background: #e2e8f0; }

.mascot-area {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

/* ─── Badge display ─────────────────────────────────────── */
.badge-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.badge-circle {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--badge-color, #1A7A1A), color-mix(in srgb, var(--badge-color, #1A7A1A) 70%, #000));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--badge-color, #1A7A1A) 40%, transparent);
  animation: badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  overflow: hidden;
}

.badge-icon {
  font-size: 44px;
  position: relative;
  z-index: 1;
}

.badge-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 60%);
  border-radius: 50%;
  animation: badge-shine-anim 2s ease-in-out infinite;
}

@keyframes badge-pop {
  0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg);   opacity: 1; }
}

@keyframes badge-shine-anim {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}

.badge-unlock-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--badge-color, #1A7A1A);
}

.badge-name {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
}

.badge-description {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  max-width: 280px;
}

/* ─── Rewards ───────────────────────────────────────────── */
.reward-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.reward-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
}
.reward-chip.xp {
  background: #fef9c3;
  color: #854d0e;
}

/* ─── CTA ───────────────────────────────────────────────── */
.cta-btn {
  width: 100%;
  background: linear-gradient(135deg, #1A7A1A, #15a015);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 16px rgba(26,122,26,0.35);
}
.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(26,122,26,0.45);
}
.cta-btn:active { transform: translateY(0); }

/* ─── Transition ────────────────────────────────────────── */
.celebration-fade-enter-active {
  animation: overlay-in 0.4s ease-out forwards;
}
.celebration-fade-leave-active {
  animation: overlay-out 0.25s ease-in forwards;
}
@keyframes overlay-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes overlay-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
</style>
