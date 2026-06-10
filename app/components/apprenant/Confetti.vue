<template>
  <Teleport to="body">
    <div v-if="active" class="confetti-container" aria-hidden="true">
      <div
        v-for="piece in pieces"
        :key="piece.id"
        class="confetti-piece"
        :style="piece.style"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface ConfettiPiece {
  id: number
  style: Record<string, string>
}

const props = withDefaults(defineProps<{
  active?: boolean
  count?: number
  duration?: number
}>(), {
  active: false,
  count: 60,
  duration: 3000
})

const emit = defineEmits<{
  done: []
}>()

const COLORS = ['#1A7A1A', '#F0B429', '#E06510', '#8B5CF6', '#0EA5E9', '#EC4899', '#ffffff']
const SHAPES = ['square', 'circle', 'ribbon']

const pieces = ref<ConfettiPiece[]>([])

function randomBetween(min: number, max: number) {
  return Math.floor(min + (max - min) * (Math.sin(Date.now() * (min + max)) * 0.5 + 0.5))
}

function buildPieces() {
  pieces.value = Array.from({ length: props.count }, (_, i) => {
    const color = COLORS[i % COLORS.length]
    const shape = SHAPES[i % SHAPES.length]
    const size = 6 + (i % 5) * 2
    const left = (i * 1.7 + 3) % 100
    const delay = (i * 47) % 800
    const rotateEnd = ((i * 137) % 720) - 360
    const duration = props.duration * 0.7 + (i * 31) % (props.duration * 0.6)

    return {
      id: i,
      style: {
        '--color': color,
        '--size': `${size}px`,
        '--left': `${left}%`,
        '--delay': `${delay}ms`,
        '--duration': `${duration}ms`,
        '--rotate-end': `${rotateEnd}deg`,
        '--border-radius': shape === 'circle' ? '50%' : shape === 'ribbon' ? '2px' : '2px',
        '--width': shape === 'ribbon' ? `${size * 0.4}px` : `${size}px`,
      }
    }
  })
}

let timer: ReturnType<typeof setTimeout> | null = null

watch(() => props.active, (val) => {
  if (val) {
    buildPieces()
    timer = setTimeout(() => {
      emit('done')
    }, props.duration + 500)
  } else {
    pieces.value = []
    if (timer) clearTimeout(timer)
  }
}, { immediate: true })

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 9999;
}

.confetti-piece {
  position: absolute;
  top: -20px;
  left: var(--left);
  width: var(--width, var(--size));
  height: var(--size);
  background: var(--color);
  border-radius: var(--border-radius);
  animation: confetti-fall var(--duration) var(--delay) ease-in forwards;
  transform-origin: center;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg) scaleX(1);
    opacity: 1;
  }
  25% {
    transform: translateY(25vh) rotate(var(--rotate-end, 180deg)) scaleX(-1);
    opacity: 1;
  }
  50% {
    transform: translateY(55vh) rotate(calc(var(--rotate-end, 180deg) * 1.5)) scaleX(1);
    opacity: 0.9;
  }
  75% {
    transform: translateY(80vh) rotate(calc(var(--rotate-end, 180deg) * 2)) scaleX(-1);
    opacity: 0.6;
  }
  100% {
    transform: translateY(110vh) rotate(calc(var(--rotate-end, 180deg) * 2.5)) scaleX(1);
    opacity: 0;
  }
}
</style>
