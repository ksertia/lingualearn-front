<template>
  <div class="lesson-page">

    <!-- ══ TOPBAR ════════════════════════════════════════════════════════════ -->
    <div class="lesson-topbar">
      <button class="topbar-close" @click="handleClose" title="Fermer">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="topbar-progress">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressWidth + '%' }" />
        </div>
        <span class="progress-label">{{ currentBlock + 1 }} / {{ lesson?.blocks.length ?? 1 }}</span>
      </div>

      <div class="topbar-xp">
        <span>⚡</span>
        <span>+{{ lesson?.xpReward ?? 0 }} XP</span>
      </div>
    </div>

    <!-- ══ CONTENU ═══════════════════════════════════════════════════════════ -->
    <div class="lesson-body">

      <!-- Loading -->
      <div v-if="store.isLessonLoading" class="loading-state">
        <div class="spinner" />
        <p>Chargement de la leçon...</p>
      </div>

      <!-- Introducteur -->
      <div v-else-if="showIntro && lesson" class="intro-screen">
        <div class="intro-icon">{{ nodeEmoji }}</div>
        <h1 class="intro-title">{{ lesson.title }}</h1>
        <p class="intro-sub">{{ lesson.subtitle }}</p>
        <div class="intro-meta">
          <span class="meta-pill">⏱ {{ lesson.duration }} min</span>
          <span class="meta-pill">⚡ +{{ lesson.xpReward }} XP</span>
        </div>
        <button class="btn-start" @click="showIntro = false">
          Commencer la leçon
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      <!-- Écran de complétion -->
      <div v-else-if="completed" class="completion-screen">
        <div class="completion-mascot">
          <ApprenantMascotBubble
            character="zaki"
            mood="celebrating"
            :message="completionMascotMessage"
            size="lg"
            :animated="true"
            position="center"
          />
        </div>
        <h1 class="completion-title">Bravo !</h1>
        <p class="completion-sub">Vous avez terminé la leçon <strong>{{ lesson?.title }}</strong></p>
        <div class="completion-rewards">
          <div class="reward-item reward-item--xp">
            <span class="reward-icon">⚡</span>
            <span class="reward-value">+{{ lesson?.xpReward }} XP</span>
            <span class="reward-label">Expérience</span>
          </div>
          <div class="reward-item reward-item--streak">
            <span class="reward-icon">🔥</span>
            <span class="reward-value">{{ store.stats?.streak }}</span>
            <span class="reward-label">Jours de suite</span>
          </div>
        </div>
        <div class="completion-actions">
          <NuxtLink :to="parcoursLink" class="btn-continue">
            Continuer le parcours
          </NuxtLink>
          <NuxtLink to="/apprenant/dashboard" class="btn-home">
            Retour à l'accueil
          </NuxtLink>
        </div>
      </div>

      <!-- Contenu de la leçon -->
      <Transition name="slide-block" mode="out-in">
        <div v-if="!showIntro && !completed && lesson && currentBlockData" :key="currentBlock" class="block-container">
          <div class="block-card">

            <!-- Bloc texte (markdown simple) -->
            <div v-if="currentBlockData.type === 'text'" class="block-text">
              <div class="markdown-content" v-html="renderMarkdown(currentBlockData.text ?? '')" />
            </div>

            <!-- Bloc image -->
            <div v-else-if="currentBlockData.type === 'image'" class="block-image">
              <img
                :src="currentBlockData.imageUrl"
                :alt="currentBlockData.imageAlt ?? ''"
                class="lesson-img"
              />
              <p v-if="currentBlockData.text" class="img-caption">{{ currentBlockData.text }}</p>
            </div>

          </div>

          <!-- Navigation -->
          <div class="lesson-nav">
            <button
              v-if="currentBlock > 0"
              class="nav-btn nav-btn--prev"
              @click="prevBlock"
            >
              ← Précédent
            </button>
            <button
              v-if="currentBlock < (lesson.blocks.length - 1)"
              class="nav-btn nav-btn--next"
              @click="nextBlock"
            >
              Suivant →
            </button>
            <button
              v-else
              class="nav-btn nav-btn--complete"
              @click="completeLesson"
              :disabled="isCompleting"
            >
              <span v-if="isCompleting">⏳ Enregistrement...</span>
              <span v-else>✓ Terminer la leçon</span>
            </button>
          </div>
        </div>
      </Transition>

    </div>

    <!-- Modal de confirmation fermeture -->
    <Transition name="fade">
      <div v-if="showCloseModal" class="modal-overlay" @click.self="showCloseModal = false">
        <div class="modal">
          <div class="modal-icon">⚠️</div>
          <h3 class="modal-title">Quitter la leçon ?</h3>
          <p class="modal-text">Votre progression dans cette leçon sera perdue.</p>
          <div class="modal-actions">
            <button class="modal-btn modal-btn--cancel" @click="showCloseModal = false">Continuer la leçon</button>
            <button class="modal-btn modal-btn--quit" @click="confirmClose">Quitter</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { useLearnerStore } from '~/stores/learnerStore'
import { getMascotMessage } from '~/data/mascot-data'

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const store = useLearnerStore()

const nodeId = computed(() => route.params.id as string)
const parcoursId = computed(() => route.query.parcours as string ?? '')
const parcoursLink = computed(() => `/apprenant/parcours/${parcoursId.value}`)

const lesson = ref(store.currentLesson)
const currentBlock = ref(0)
const showIntro = ref(true)
const completed = ref(false)
const isCompleting = ref(false)
const showCloseModal = ref(false)

onMounted(async () => {
  await store.init()
  lesson.value = await store.loadLesson(nodeId.value)
})

const currentBlockData = computed(() => {
  if (!lesson.value) return null
  return lesson.value.blocks[currentBlock.value] ?? null
})

const progressWidth = computed(() => {
  if (!lesson.value) return 0
  return Math.round(((currentBlock.value + 1) / lesson.value.blocks.length) * 100)
})

const nodeEmoji = computed(() => {
  if (!parcoursId.value) return '📖'
  const parcours = store.getParcoursById(parcoursId.value)
  const node = parcours?.nodes.find(n => n.id === nodeId.value)
  return node?.icon ?? '📖'
})

function nextBlock() {
  if (!lesson.value) return
  if (currentBlock.value < lesson.value.blocks.length - 1) {
    currentBlock.value++
  }
}

function prevBlock() {
  if (currentBlock.value > 0) currentBlock.value--
}

async function completeLesson() {
  if (!lesson.value || isCompleting.value) return
  isCompleting.value = true
  try {
    await store.completeLesson(nodeId.value, parcoursId.value)
    completed.value = true
  } finally {
    isCompleting.value = false
  }
}

function handleClose() {
  if (!showIntro.value && !completed.value) {
    showCloseModal.value = true
  } else {
    confirmClose()
  }
}

function confirmClose() {
  showCloseModal.value = false
  if (parcoursId.value) router.push(parcoursLink.value)
  else router.push('/apprenant/dashboard')
}

const completionMascotMessage = computed(() =>
  getMascotMessage('zaki', 'lesson_complete')
)

function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\| (.+?) \|/g, (_, cell) => `<td>${cell.trim()}</td>`)
    .replace(/^\|(.+)\|$/gm, '<tr>$1</tr>')
    .replace(/(<tr>.*<\/tr>\n?)+/g, m => `<table>${m}</table>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h1-6|blockquote|table|hr|p])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/\n/g, '<br>')
}
</script>

<style scoped>
/* ── Page ────────────────────────────────────────────────────────────────── */
.lesson-page {
  min-height: 100vh;
  background: #f0fdf4;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* ── Topbar ──────────────────────────────────────────────────────────────── */
.lesson-topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: white;
  border-bottom: 2px solid #e8f5e9;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #F3F4F6;
  color: #6B7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}
.topbar-close:hover { background: #FEE2E2; color: #EF4444; }

.topbar-progress { flex: 1; display: flex; align-items: center; gap: 12px; }

.progress-track {
  flex: 1;
  height: 10px;
  background: #F3F4F6;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1A7A1A, #34C759);
  border-radius: 10px;
  transition: width 0.4s ease;
}

.progress-label {
  font-size: 12px;
  font-weight: 600;
  color: #9CA3AF;
  white-space: nowrap;
}

.topbar-xp {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: #D97706;
  background: #FFFBEB;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1.5px solid #FDE68A;
  flex-shrink: 0;
}

/* ── Body ────────────────────────────────────────────────────────────────── */
.lesson-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

/* ── Loading ─────────────────────────────────────────────────────────────── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #6B7280;
  font-size: 14px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #E5E7EB;
  border-top-color: #1A7A1A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Intro ───────────────────────────────────────────────────────────────── */
.intro-screen {
  text-align: center;
  max-width: 480px;
}

.intro-icon { font-size: 64px; margin-bottom: 20px; }

.intro-title {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 8px;
}

.intro-sub {
  font-size: 16px;
  color: #6B7280;
  margin-bottom: 20px;
  line-height: 1.6;
}

.intro-meta {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.meta-pill {
  font-size: 13px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 20px;
  background: #F3F4F6;
  color: #374151;
}

.btn-start {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1A7A1A;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(26, 122, 26, 0.3);
}
.btn-start:hover {
  background: #155e15;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(26, 122, 26, 0.35);
}

/* ── Completion ──────────────────────────────────────────────────────────── */
.completion-mascot { display: flex; justify-content: center; margin-bottom: 16px; }
.completion-screen {
  text-align: center;
  max-width: 480px;
  animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}

.completion-icon { font-size: 72px; margin-bottom: 16px; }
.completion-title { font-size: 32px; font-weight: 800; color: #111827; margin-bottom: 8px; }
.completion-sub { font-size: 16px; color: #6B7280; margin-bottom: 32px; line-height: 1.5; }

.completion-rewards {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 36px;
}

.reward-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 20px 28px;
  border-radius: 18px;
}

.reward-item--xp { background: #FFFBEB; border: 2px solid #FDE68A; }
.reward-item--streak { background: #FFF7ED; border: 2px solid #FED7AA; }

.reward-icon { font-size: 28px; }
.reward-value { font-size: 24px; font-weight: 800; color: #111827; }
.reward-label { font-size: 12px; color: #6B7280; font-weight: 500; }

.completion-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.btn-continue {
  display: inline-flex;
  align-items: center;
  background: #1A7A1A;
  color: white;
  padding: 14px 32px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(26, 122, 26, 0.3);
}
.btn-continue:hover { background: #155e15; transform: translateY(-1px); }

.btn-home {
  font-size: 13.5px;
  font-weight: 600;
  color: #6B7280;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 10px;
}
.btn-home:hover { background: #F3F4F6; color: #374151; }

/* ── Block container ─────────────────────────────────────────────────────── */
.block-container {
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.block-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-height: 300px;
}

/* Texte markdown */
.markdown-content {
  font-size: 16px;
  line-height: 1.75;
  color: #374151;
}

.markdown-content :deep(h1) { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 16px; margin-top: 8px; }
.markdown-content :deep(h2) { font-size: 20px; font-weight: 700; color: #1A7A1A; margin-bottom: 12px; margin-top: 20px; }
.markdown-content :deep(h3) { font-size: 17px; font-weight: 700; color: #374151; margin-bottom: 10px; margin-top: 16px; }
.markdown-content :deep(p)  { margin-bottom: 12px; }
.markdown-content :deep(strong) { color: #111827; font-weight: 700; }
.markdown-content :deep(em) { font-style: italic; color: #1A7A1A; }
.markdown-content :deep(blockquote) {
  background: #F0FDF4;
  border-left: 4px solid #1A7A1A;
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
  margin: 12px 0;
  font-size: 14px;
  color: #374151;
}
.markdown-content :deep(hr) { border: none; border-top: 2px solid #E5E7EB; margin: 20px 0; }
.markdown-content :deep(table) { border-collapse: collapse; width: 100%; margin: 12px 0; }
.markdown-content :deep(td) { padding: 10px 14px; border: 1px solid #E5E7EB; font-size: 14px; }
.markdown-content :deep(tr:first-child td) { background: #F0FDF4; font-weight: 700; color: #1A7A1A; }
.markdown-content :deep(tr:nth-child(even) td) { background: #FAFAFA; }

/* Image */
.block-image { text-align: center; }
.lesson-img {
  max-width: 100%;
  max-height: 260px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 12px;
}
.img-caption {
  font-size: 13px;
  color: #6B7280;
  font-style: italic;
  line-height: 1.5;
}

/* Navigation leçon */
.lesson-nav {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.nav-btn {
  padding: 12px 28px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  border: none;
}

.nav-btn--prev {
  background: #F3F4F6;
  color: #374151;
}
.nav-btn--prev:hover { background: #E5E7EB; }

.nav-btn--next {
  background: #1A7A1A;
  color: white;
  box-shadow: 0 4px 16px rgba(26, 122, 26, 0.3);
}
.nav-btn--next:hover {
  background: #155e15;
  transform: translateY(-1px);
}

.nav-btn--complete {
  background: linear-gradient(135deg, #1A7A1A, #F0B429);
  color: white;
  box-shadow: 0 4px 16px rgba(26, 122, 26, 0.3);
  min-width: 200px;
}
.nav-btn--complete:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(26, 122, 26, 0.4);
}
.nav-btn--complete:disabled { opacity: 0.7; cursor: not-allowed; }

/* ── Transition ──────────────────────────────────────────────────────────── */
.slide-block-enter-active,
.slide-block-leave-active {
  transition: all 0.25s ease;
}
.slide-block-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-block-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* ── Modal ───────────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal {
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.modal-icon { font-size: 48px; margin-bottom: 16px; }
.modal-title { font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 8px; }
.modal-text { font-size: 14px; color: #6B7280; margin-bottom: 24px; line-height: 1.5; }

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.modal-btn {
  padding: 11px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}

.modal-btn--cancel { background: #F3F4F6; color: #374151; }
.modal-btn--cancel:hover { background: #E5E7EB; }
.modal-btn--quit { background: #EF4444; color: white; }
.modal-btn--quit:hover { background: #DC2626; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .lesson-body { padding: 20px 16px; }
  .block-card { padding: 20px; }
  .completion-rewards { flex-direction: column; align-items: center; }
}
</style>
