<template>
  <Teleport to="body">
    <Transition name="levelup-fade">
      <div v-if="visible" class="levelup-overlay">
        <ApprenantConfetti :active="confettiActive" :count="70" :duration="4000" />

        <div class="levelup-card">
          <!-- Starburst bg decoration -->
          <div class="starburst" aria-hidden="true" />

          <!-- Level reveal -->
          <div class="level-area">
            <div class="level-badge-old">Niveau {{ previousLevel }}</div>
            <div class="arrow-up">↑</div>
            <div class="level-badge-new" :class="{ pop: visible }">
              <span class="level-number">{{ newLevel }}</span>
              <span class="level-label">Niveau</span>
            </div>
          </div>

          <!-- Title -->
          <div class="levelup-headline">Félicitations !</div>
          <div class="levelup-title">{{ levelTitle }}</div>

          <!-- Mascot -->
          <div class="mascot-area">
            <ApprenantMascotBubble
              character="zaki"
              mood="proud"
              :message="mascotMessage"
              size="md"
              :animated="true"
              position="center"
            />
          </div>

          <!-- XP info -->
          <div class="xp-info">
            <div class="xp-bar-wrap">
              <div class="xp-bar-fill" :style="{ width: `${xpPercent}%` }" />
            </div>
            <p class="xp-caption">{{ currentXp }} / {{ nextLevelXp }} XP pour le niveau {{ newLevel + 1 }}</p>
          </div>

          <!-- Rewards -->
          <div class="reward-row">
            <div class="reward-chip">🎁 +1 Cœur bonus</div>
            <div class="reward-chip">⚡ +50 XP</div>
          </div>

          <button class="cta-btn" @click="close">
            Continuer mon aventure !
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { getMascotMessage } from '~/data/mascot-data'

const props = withDefaults(defineProps<{
  visible: boolean
  previousLevel?: number
  newLevel?: number
  currentXp?: number
  nextLevelXp?: number
}>(), {
  visible: false,
  previousLevel: 4,
  newLevel: 5,
  currentXp: 0,
  nextLevelXp: 500
})

const emit = defineEmits<{
  close: []
}>()

const confettiActive = ref(false)

const LEVEL_TITLES: Record<number, string> = {
  2:  'Explorateur curieux',
  3:  'Apprenant courageux',
  4:  'Aventurier des mots',
  5:  'Maître des langues',
  6:  'Sage des savanes',
  7:  'Gardien des traditions',
  8:  'Champion linguistique',
  9:  'Légende vivante',
  10: 'Grand Sage TiBi'
}

const levelTitle = computed(() =>
  LEVEL_TITLES[props.newLevel] ?? `Niveau ${props.newLevel}`
)

const xpPercent = computed(() => {
  if (!props.nextLevelXp) return 0
  return Math.min(100, Math.round((props.currentXp / props.nextLevelXp) * 100))
})

const mascotMessage = computed(() =>
  getMascotMessage('zaki', 'level_up')
)

watch(() => props.visible, (val) => {
  if (val) {
    confettiActive.value = true
    setTimeout(() => { confettiActive.value = false }, 4000)
  }
})

function close() {
  emit('close')
}
</script>

<style scoped>
.levelup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  padding: 16px;
}

.levelup-card {
  position: relative;
  background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%);
  border-radius: 28px;
  padding: 36px 28px 28px;
  max-width: 360px;
  width: 100%;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08);
}

/* Starburst decoration */
.starburst {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(240,180,41,0.2) 0%, transparent 70%);
  pointer-events: none;
}

/* ─── Level area ─────────────────────────────────────────── */
.level-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.level-badge-old {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: rgba(255,255,255,0.08);
  padding: 6px 12px;
  border-radius: 20px;
}

.arrow-up {
  font-size: 24px;
  color: #F0B429;
  animation: arrow-bounce 1s ease-in-out infinite;
}

@keyframes arrow-bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-4px); }
}

.level-badge-new {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #F0B429, #E06510);
  box-shadow: 0 0 0 4px rgba(240,180,41,0.3), 0 8px 24px rgba(240,180,41,0.4);
}
.level-badge-new.pop {
  animation: level-badge-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes level-badge-pop {
  0%   { transform: scale(0) rotate(-30deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.level-number {
  font-size: 28px;
  font-weight: 900;
  color: white;
  line-height: 1;
}
.level-label {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,255,255,0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ─── Text ───────────────────────────────────────────────── */
.levelup-headline {
  font-size: 26px;
  font-weight: 900;
  color: #F0B429;
  margin-bottom: 4px;
}

.levelup-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  margin-bottom: 20px;
}

.mascot-area {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

/* ─── XP bar ─────────────────────────────────────────────── */
.xp-info {
  margin-bottom: 16px;
}
.xp-bar-wrap {
  height: 8px;
  background: rgba(255,255,255,0.12);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 6px;
}
.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #F0B429, #E06510);
  border-radius: 8px;
  transition: width 1s ease-out;
}
.xp-caption {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin: 0;
}

/* ─── Rewards ───────────────────────────────────────────── */
.reward-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
}
.reward-chip {
  background: rgba(255,255,255,0.1);
  color: white;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
}

/* ─── CTA ───────────────────────────────────────────────── */
.cta-btn {
  width: 100%;
  background: linear-gradient(135deg, #F0B429, #E06510);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 16px rgba(240,180,41,0.4);
}
.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(240,180,41,0.5);
}
.cta-btn:active { transform: translateY(0); }

/* ─── Transition ─────────────────────────────────────────── */
.levelup-fade-enter-active { animation: levelup-in 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards; }
.levelup-fade-leave-active { animation: levelup-out 0.3s ease-in forwards; }
@keyframes levelup-in  { from { opacity: 0; transform: scale(0.85) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes levelup-out { from { opacity: 1; } to { opacity: 0; transform: scale(0.9); } }
</style>
