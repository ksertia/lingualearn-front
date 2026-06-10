<template>
  <div
    class="mascot-wrapper"
    :class="[`position-${position}`, `size-${size}`]"
    :aria-label="`Mascotte ${characterData?.name}`"
  >
    <!-- Mascot image + mood effects -->
    <div class="mascot-figure" :class="[`mood-${mood}`, { animated }]">
      <!-- Sparkle particles for celebrating/excited -->
      <div v-if="showSparkles" class="sparkles" aria-hidden="true">
        <span v-for="n in 6" :key="n" class="sparkle" :style="`--i:${n}`">✦</span>
      </div>

      <!-- Glow ring -->
      <div class="glow-ring" :style="{ '--glow-color': moodColor }" />

      <!-- Zaki SVG robot -->
      <ApprenantZakiSvg :mood="mood" :size="size" :animated="animated" />

      <!-- Mood indicator badge -->
      <div class="mood-badge" :style="{ background: moodColor }">
        {{ moodEmoji }}
      </div>
    </div>

    <!-- Speech bubble -->
    <Transition name="bubble-pop">
      <div
        v-if="message && showBubble"
        class="speech-bubble"
        :class="`bubble-${position === 'right' ? 'left' : 'right'}`"
        :style="{ '--accent': characterData?.color || '#1A7A1A' }"
      >
        <p class="bubble-text">{{ displayMessage }}</p>
        <button
          v-if="dismissable"
          class="bubble-dismiss"
          aria-label="Fermer"
          @click="dismissBubble"
        >×</button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { MascotMood, MascotSize } from '~/types/mascot'
import { MASCOT_CHARACTERS } from '~/data/mascot-data'

const props = withDefaults(defineProps<{
  character?: string
  mood?: MascotMood
  message?: string
  size?: MascotSize
  animated?: boolean
  position?: 'left' | 'right' | 'center'
  dismissable?: boolean
  autoHide?: number
}>(), {
  character: 'zaki',
  mood: 'happy',
  message: '',
  size: 'md',
  animated: true,
  position: 'left',
  dismissable: false,
  autoHide: 0
})

const emit = defineEmits<{
  dismissed: []
}>()

const showBubble = ref(true)

const characterData = computed(() =>
  MASCOT_CHARACTERS[props.character] ?? null
)

const displayMessage = computed(() => props.message)

const moodColor = computed(() => {
  const map: Record<MascotMood, string> = {
    happy: '#1A7A1A',
    excited: '#E06510',
    celebrating: '#F0B429',
    sad: '#64748b',
    encouraging: '#8B5CF6',
    thinking: '#0EA5E9',
    proud: '#F0B429',
    surprised: '#EC4899',
    worried: '#64748b',
    resting: '#94a3b8',
    focused: '#0EA5E9',
    victory: '#F0B429'
  }
  return map[props.mood] ?? '#1A7A1A'
})

const moodEmoji = computed(() => {
  const map: Record<MascotMood, string> = {
    happy: '😊',
    excited: '🤩',
    celebrating: '🎉',
    sad: '😢',
    encouraging: '💪',
    thinking: '🤔',
    proud: '🏆',
    surprised: '😮',
    worried: '😟',
    resting: '😴',
    focused: '🎯',
    victory: '🏆'
  }
  return map[props.mood] ?? '😊'
})

const showSparkles = computed(() =>
  props.animated && (props.mood === 'celebrating' || props.mood === 'excited' || props.mood === 'proud')
)

function dismissBubble() {
  showBubble.value = false
  emit('dismissed')
}

let hideTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.message, () => {
  showBubble.value = true
  if (hideTimer) clearTimeout(hideTimer)
  if (props.autoHide > 0) {
    hideTimer = setTimeout(() => {
      showBubble.value = false
    }, props.autoHide)
  }
}, { immediate: true })

onUnmounted(() => {
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<style scoped>
/* ─── Wrapper layout ─────────────────────────────────────── */
.mascot-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}
.mascot-wrapper.position-right  { flex-direction: row-reverse; }
.mascot-wrapper.position-center { flex-direction: column; align-items: center; }

/* ─── Size scale ─────────────────────────────────────────── */
.size-xs .mascot-figure { --ms: 48px; }
.size-sm .mascot-figure { --ms: 64px; }
.size-md .mascot-figure { --ms: 88px; }
.size-lg .mascot-figure { --ms: 120px; }
.size-xl .mascot-figure { --ms: 160px; }

/* ─── Mascot figure container ────────────────────────────── */
.mascot-figure {
  position: relative;
  width: var(--ms, 88px);
  height: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ─── Glow ring ──────────────────────────────────────────── */
.glow-ring {
  position: absolute;
  inset: -6px;
  border-radius: 20px;
  background: transparent;
  pointer-events: none;
  transition: box-shadow 0.4s ease;
}
.mood-celebrating .glow-ring,
.mood-excited .glow-ring,
.mood-proud .glow-ring,
.mood-victory .glow-ring {
  box-shadow: 0 0 18px 4px color-mix(in srgb, var(--glow-color, #F0B429) 40%, transparent);
}


/* ─── Mood badge ─────────────────────────────────────────── */
.mood-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: calc(var(--ms, 88px) * 0.32);
  height: calc(var(--ms, 88px) * 0.32);
  min-width: 20px;
  min-height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(var(--ms, 88px) * 0.18);
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 1;
}


/* ─── Sparkles ───────────────────────────────────────────── */
.sparkles {
  position: absolute;
  inset: -16px;
  pointer-events: none;
  z-index: 2;
}
.sparkle {
  position: absolute;
  color: #F0B429;
  font-size: 10px;
  animation: sparkle-orbit 1.8s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.3s);
  top: 50%;
  left: 50%;
  transform-origin: 0 0;
}
.sparkle:nth-child(1) { --angle: 0deg;   --radius: 44px; }
.sparkle:nth-child(2) { --angle: 60deg;  --radius: 40px; }
.sparkle:nth-child(3) { --angle: 120deg; --radius: 46px; }
.sparkle:nth-child(4) { --angle: 180deg; --radius: 42px; }
.sparkle:nth-child(5) { --angle: 240deg; --radius: 44px; }
.sparkle:nth-child(6) { --angle: 300deg; --radius: 40px; }

@keyframes sparkle-orbit {
  0%   { transform: rotate(var(--angle)) translateX(var(--radius)) scale(0); opacity: 0; }
  50%  { transform: rotate(calc(var(--angle) + 20deg)) translateX(var(--radius)) scale(1); opacity: 1; }
  100% { transform: rotate(calc(var(--angle) + 40deg)) translateX(var(--radius)) scale(0); opacity: 0; }
}

/* ─── Speech bubble ──────────────────────────────────────── */
.speech-bubble {
  position: relative;
  background: white;
  border: 2px solid var(--accent, #1A7A1A);
  border-radius: 16px;
  padding: 10px 14px;
  max-width: 220px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  flex: 1;
}
.bubble-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #1e293b;
  font-weight: 500;
}
.speech-bubble.bubble-left::before {
  content: '';
  position: absolute;
  left: -10px;
  bottom: 18px;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 10px solid var(--accent, #1A7A1A);
}
.speech-bubble.bubble-left::after {
  content: '';
  position: absolute;
  left: -7px;
  bottom: 19px;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-right: 9px solid white;
}
.speech-bubble.bubble-right::before {
  content: '';
  position: absolute;
  right: -10px;
  bottom: 18px;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 10px solid var(--accent, #1A7A1A);
}
.speech-bubble.bubble-right::after {
  content: '';
  position: absolute;
  right: -7px;
  bottom: 19px;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 9px solid white;
}

.bubble-dismiss {
  position: absolute;
  top: 6px;
  right: 8px;
  background: none;
  border: none;
  font-size: 16px;
  color: #94a3b8;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}
.bubble-dismiss:hover { color: #475569; }

/* ─── Bubble transition ──────────────────────────────────── */
.bubble-pop-enter-active {
  animation: bubble-pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.bubble-pop-leave-active {
  animation: bubble-pop-out 0.2s ease-in forwards;
}
@keyframes bubble-pop-in {
  from { opacity: 0; transform: scale(0.7) translateY(6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes bubble-pop-out {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.85) translateY(4px); }
}
</style>
