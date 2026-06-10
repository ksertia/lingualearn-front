<template>
  <div class="daily-chest" :class="{ 'chest-opened': opened, 'chest-available': chest.available && !opened }">
    <div class="chest-inner" @click="tryOpen">
      <!-- Chest icon with animated lid -->
      <div class="chest-icon-wrap" aria-hidden="true">
        <div class="chest-body">
          <div class="chest-lid" :class="{ 'lid-open': opening || opened }" />
          <div class="chest-lock" :class="{ 'lock-hidden': opening || opened }">🔒</div>
          <div class="chest-base">📦</div>
        </div>
        <!-- Reward burst when opening -->
        <Transition name="burst">
          <div v-if="showBurst" class="reward-burst">
            <span class="burst-xp">+{{ chest.reward.xp }} XP</span>
            <span class="burst-coins">+{{ chest.reward.coins }} 🪙</span>
          </div>
        </Transition>
      </div>

      <!-- Text -->
      <div class="chest-text">
        <div class="chest-title">
          {{ opened ? 'Coffre ouvert !' : chest.available ? 'Coffre du jour' : 'Déjà réclamé' }}
        </div>
        <div class="chest-subtitle">
          {{ opened
            ? chest.reward.message
            : chest.available
              ? 'Ouvre ton coffre quotidien'
              : `Reviens demain pour un nouveau coffre` }}
        </div>
        <!-- Reward chips when not yet opened -->
        <div v-if="!opened && chest.available" class="reward-preview">
          <span class="preview-chip xp">⚡ {{ chest.reward.xp }} XP</span>
          <span class="preview-chip coins">🪙 {{ chest.reward.coins }}</span>
        </div>
      </div>
    </div>

    <!-- Timer if already claimed -->
    <div v-if="!chest.available && !opened" class="countdown-bar">
      <div class="countdown-fill" :style="{ width: `${timePercent}%` }" />
      <span class="countdown-label">🕐 Prochain coffre dans {{ timeRemaining }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DailyChestState } from '~/types/mascot'

const props = defineProps<{
  chest: DailyChestState
}>()

const emit = defineEmits<{
  open: [reward: DailyChestState['reward']]
}>()

const opened = ref(false)
const opening = ref(false)
const showBurst = ref(false)

function tryOpen() {
  if (!props.chest.available || opened.value || opening.value) return
  opening.value = true

  setTimeout(() => {
    showBurst.value = true
    emit('open', props.chest.reward)

    setTimeout(() => {
      opened.value = true
      opening.value = false
    }, 600)

    setTimeout(() => {
      showBurst.value = false
    }, 1800)
  }, 400)
}

// Simple countdown display (hours left until midnight)
const timeRemaining = computed(() => {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const diffMs = midnight.getTime() - now.getTime()
  const h = Math.floor(diffMs / 3600000)
  const m = Math.floor((diffMs % 3600000) / 60000)
  return `${h}h${m.toString().padStart(2, '0')}`
})

const timePercent = computed(() => {
  const now = new Date()
  const secondsInDay = 86400
  const secondsPassed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
  return Math.round((secondsPassed / secondsInDay) * 100)
})
</script>

<style scoped>
.daily-chest {
  background: white;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.daily-chest.chest-available {
  border-color: #F0B429;
  box-shadow: 0 0 0 4px rgba(240,180,41,0.15), 0 4px 12px rgba(0,0,0,0.06);
}
.daily-chest.chest-opened {
  border-color: #1A7A1A;
}

.chest-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.chest-available .chest-inner:hover {
  background: #fffbeb;
}
.chest-opened .chest-inner {
  cursor: default;
}

/* ─── Chest icon ──────────────────────────────────────── */
.chest-icon-wrap {
  position: relative;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chest-body {
  position: relative;
  font-size: 40px;
  line-height: 1;
  user-select: none;
}
.chest-base { display: block; }
.chest-lid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: transparent;
  transform-origin: top center;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.chest-lid.lid-open { transform: rotateX(-60deg); }

.chest-lock {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  transition: opacity 0.2s;
}
.chest-lock.lock-hidden { opacity: 0; }

/* Available pulse animation */
.chest-available .chest-body {
  animation: chest-pulse 2s ease-in-out infinite;
}
@keyframes chest-pulse {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(240,180,41,0)); }
  50%       { transform: scale(1.06); filter: drop-shadow(0 0 8px rgba(240,180,41,0.6)); }
}

/* ─── Reward burst ────────────────────────────────────── */
.reward-burst {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  pointer-events: none;
}
.burst-xp, .burst-coins {
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
  padding: 2px 8px;
  border-radius: 20px;
}
.burst-xp    { background: #fef9c3; color: #854d0e; }
.burst-coins { background: #f0fdf4; color: #15803d; }

.burst-enter-active { animation: burst-in 0.35s ease-out forwards; }
.burst-leave-active { animation: burst-out 0.4s ease-in forwards; }
@keyframes burst-in  { from { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.8); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
@keyframes burst-out { from { opacity: 1; } to { opacity: 0; transform: translateX(-50%) translateY(-14px); } }

/* ─── Text ────────────────────────────────────────────── */
.chest-text { flex: 1; min-width: 0; }
.chest-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 2px;
}
.chest-subtitle {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}
.reward-preview {
  display: flex;
  gap: 6px;
}
.preview-chip {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}
.preview-chip.xp    { background: #fef9c3; color: #854d0e; }
.preview-chip.coins { background: #f0fdf4; color: #15803d; }

/* ─── Countdown ───────────────────────────────────────── */
.countdown-bar {
  position: relative;
  height: 28px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.countdown-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: #e2e8f0;
  transition: width 1s ease;
}
.countdown-label {
  position: relative;
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}
</style>
