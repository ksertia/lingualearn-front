<template>
  <div class="quiz-page">

    <!-- ══ TOPBAR ════════════════════════════════════════════════════════════ -->
    <div class="quiz-topbar" v-if="!showIntro && !showResult">
      <button class="topbar-close" @click="handleClose" title="Fermer">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="topbar-progress">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressWidth + '%' }" />
        </div>
        <span class="progress-label">{{ currentQ + 1 }} / {{ quiz?.questions.length ?? 1 }}</span>
      </div>

      <div class="hearts-display">
        <span v-for="i in (quiz?.heartsAllowed ?? 3)" :key="i" class="heart" :class="{ 'heart--lost': i > heartsLeft }">❤️</span>
      </div>
    </div>

    <!-- ══ CONTENU ═══════════════════════════════════════════════════════════ -->
    <div class="quiz-body">

      <!-- Loading -->
      <div v-if="store.isLessonLoading" class="loading-state">
        <div class="spinner" />
        <p>Chargement du quiz...</p>
      </div>

      <!-- Intro -->
      <div v-else-if="showIntro && quiz" class="intro-screen">
        <div class="intro-icon">❓</div>
        <h1 class="intro-title">{{ quiz.title }}</h1>
        <div class="intro-meta">
          <span class="meta-pill">📝 {{ quiz.questions.length }} questions</span>
          <span class="meta-pill">❤️ {{ quiz.heartsAllowed }} vies</span>
          <span class="meta-pill">⚡ +{{ quiz.xpReward }} XP</span>
        </div>
        <p class="intro-tip">Répondez correctement à toutes les questions pour gagner les XP !</p>
        <button class="btn-start" @click="startQuiz">
          Commencer le quiz
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      <!-- Résultats -->
      <div v-else-if="showResult" class="result-screen" :class="{ 'result--win': passed, 'result--lose': !passed }">
        <div class="result-mascot">
          <ApprenantMascotBubble
            character="zaki"
            :mood="resultMascotMood"
            :message="resultMascotMessage"
            size="lg"
            :animated="true"
            position="center"
          />
        </div>
        <h1 class="result-title">{{ passed ? 'Excellent !' : 'Dommage...' }}</h1>
        <p class="result-sub">
          {{ passed ? `Vous avez réussi le quiz avec ${score}/${quiz?.questions.length} bonnes réponses !` : 'Vous n\'avez plus de vies. Réessayez !' }}
        </p>
        <div v-if="passed" class="result-rewards">
          <div class="reward-item reward-item--xp">
            <span>⚡</span>
            <span class="reward-val">+{{ quiz?.xpReward ?? 0 }} XP</span>
            <span class="reward-lbl">Gagné</span>
          </div>
          <div class="reward-item reward-item--score">
            <span>✅</span>
            <span class="reward-val">{{ score }} / {{ quiz?.questions.length }}</span>
            <span class="reward-lbl">Bonnes réponses</span>
          </div>
        </div>
        <div class="result-actions">
          <button v-if="!passed" class="btn-retry" @click="resetQuiz">Réessayer</button>
          <NuxtLink :to="parcoursLink" class="btn-continue">
            {{ passed ? 'Continuer le parcours' : 'Retour au parcours' }}
          </NuxtLink>
        </div>
      </div>

      <!-- Questions -->
      <Transition name="slide-block" mode="out-in">
        <div v-if="!showIntro && !showResult && quiz && currentQuestion" :key="currentQ" class="question-container">

          <!-- Question card -->
          <div class="question-card">
            <p class="question-text">{{ currentQuestion.question }}</p>
            <img v-if="currentQuestion.imageUrl" :src="currentQuestion.imageUrl" alt="" class="question-img" />

            <!-- ── QCM ────────────────────────────────────────────────────── -->
            <div v-if="currentQuestion.type === 'mcq'" class="options-grid">
              <button
                v-for="opt in currentQuestion.options"
                :key="opt.id"
                class="option-btn"
                :class="getOptionClass(opt.id)"
                :disabled="!!feedbackState"
                @click="selectAnswer(opt.id)"
              >
                {{ opt.text }}
              </button>
            </div>

            <!-- ── Vrai/Faux ──────────────────────────────────────────────── -->
            <div v-else-if="currentQuestion.type === 'true_false'" class="tf-grid">
              <button
                class="tf-btn tf-btn--true"
                :class="getTFClass('true')"
                :disabled="!!feedbackState"
                @click="selectAnswer('true')"
              >
                ✅ Vrai
              </button>
              <button
                class="tf-btn tf-btn--false"
                :class="getTFClass('false')"
                :disabled="!!feedbackState"
                @click="selectAnswer('false')"
              >
                ❌ Faux
              </button>
            </div>

            <!-- ── Texte à trou ────────────────────────────────────────────── -->
            <div v-else-if="currentQuestion.type === 'fill_blank'" class="fill-blank">
              <input
                v-model="blankInput"
                type="text"
                class="blank-input"
                :class="{ 'blank-correct': feedbackState === 'correct', 'blank-wrong': feedbackState === 'wrong' }"
                :disabled="!!feedbackState"
                placeholder="Tapez votre réponse..."
                @keyup.enter="!feedbackState && submitBlank()"
              />
              <button
                v-if="!feedbackState"
                class="btn-validate"
                :disabled="!blankInput.trim()"
                @click="submitBlank"
              >
                Valider
              </button>
            </div>

            <!-- ── Association ────────────────────────────────────────────── -->
            <div v-else-if="currentQuestion.type === 'match'" class="match-grid">
              <div class="match-col">
                <div
                  v-for="pair in currentQuestion.pairs"
                  :key="pair.left"
                  class="match-item match-item--left"
                  :class="{ 'match-item--selected': selectedLeft === pair.left }"
                  @click="!feedbackState && selectLeft(pair.left)"
                >
                  {{ pair.left }}
                </div>
              </div>
              <div class="match-col">
                <div
                  v-for="right in shuffledRights"
                  :key="right"
                  class="match-item match-item--right"
                  :class="getMatchRightClass(right)"
                  @click="!feedbackState && selectRight(right)"
                >
                  {{ right }}
                </div>
              </div>
            </div>

          </div>

          <!-- Feedback -->
          <Transition name="slide-up">
            <div v-if="feedbackState" class="feedback-bar" :class="`feedback--${feedbackState}`">
              <div class="feedback-icon">{{ feedbackState === 'correct' ? '✅' : '❌' }}</div>
              <div class="feedback-content">
                <p class="feedback-title">{{ feedbackState === 'correct' ? 'Correct !' : 'Pas tout à fait...' }}</p>
                <p class="feedback-explanation">{{ currentQuestion?.explanation }}</p>
              </div>
              <button class="feedback-next" @click="nextQuestion">
                {{ currentQ < (quiz?.questions.length ?? 1) - 1 ? 'Suivant →' : 'Voir résultats →' }}
              </button>
            </div>
          </Transition>

        </div>
      </Transition>

    </div>

    <!-- Modal quitter -->
    <Transition name="fade">
      <div v-if="showCloseModal" class="modal-overlay" @click.self="showCloseModal = false">
        <div class="modal">
          <div class="modal-icon">⚠️</div>
          <h3 class="modal-title">Quitter le quiz ?</h3>
          <p class="modal-text">Votre progression sera perdue.</p>
          <div class="modal-actions">
            <button class="modal-btn modal-btn--cancel" @click="showCloseModal = false">Continuer</button>
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

const quiz = ref(store.currentQuiz)
const showIntro = ref(true)
const showResult = ref(false)
const showCloseModal = ref(false)
const currentQ = ref(0)
const heartsLeft = ref(3)
const score = ref(0)
const passed = ref(false)
const feedbackState = ref<'correct' | 'wrong' | null>(null)

const blankInput = ref('')
const selectedLeft = ref<string | null>(null)
const matchedPairs = ref<Record<string, string>>({})

onMounted(async () => {
  await store.init()
  quiz.value = await store.loadQuiz(nodeId.value)
  heartsLeft.value = quiz.value?.heartsAllowed ?? 3
})

const currentQuestion = computed(() => {
  if (!quiz.value) return null
  return quiz.value.questions[currentQ.value] ?? null
})

const progressWidth = computed(() => {
  if (!quiz.value) return 0
  return Math.round(((currentQ.value + 1) / quiz.value.questions.length) * 100)
})

const shuffledRights = computed(() => {
  if (!currentQuestion.value?.pairs) return []
  return [...currentQuestion.value.pairs.map(p => p.right)].sort(() => Math.random() - 0.5)
})

function startQuiz() {
  showIntro.value = false
  heartsLeft.value = quiz.value?.heartsAllowed ?? 3
}

function resetQuiz() {
  currentQ.value = 0
  score.value = 0
  heartsLeft.value = quiz.value?.heartsAllowed ?? 3
  feedbackState.value = null
  blankInput.value = ''
  selectedLeft.value = null
  matchedPairs.value = {}
  showResult.value = false
  showIntro.value = true
}

function selectAnswer(answer: string) {
  if (!currentQuestion.value || feedbackState.value) return
  const correct = currentQuestion.value.correctAnswer
  const isCorrect = Array.isArray(correct) ? correct.includes(answer) : correct === answer
  handleFeedback(isCorrect)
}

function getTFClass(val: string): string {
  if (!feedbackState.value) return ''
  const correct = currentQuestion.value?.correctAnswer
  if (correct === val) return 'tf-correct'
  return 'tf-wrong'
}

function getOptionClass(optId: string): string {
  if (!feedbackState.value) return ''
  const correct = currentQuestion.value?.correctAnswer
  if (correct === optId) return 'option-correct'
  return 'option-wrong'
}

function submitBlank() {
  if (!currentQuestion.value || !blankInput.value.trim()) return
  const answer = blankInput.value.trim().toLowerCase()
  const correct = (currentQuestion.value.blankAnswer ?? '').toLowerCase()
  handleFeedback(answer === correct)
}

function selectLeft(left: string) {
  selectedLeft.value = left
}

function selectRight(right: string) {
  if (!selectedLeft.value || !currentQuestion.value?.pairs) return
  matchedPairs.value[selectedLeft.value] = right
  selectedLeft.value = null

  if (Object.keys(matchedPairs.value).length === currentQuestion.value.pairs.length) {
    const correct = currentQuestion.value.pairs.every(p => matchedPairs.value[p.left] === p.right)
    handleFeedback(correct)
  }
}

function getMatchRightClass(right: string): string {
  if (!feedbackState.value) {
    const isMatched = Object.values(matchedPairs.value).includes(right)
    return isMatched ? 'match-item--matched' : ''
  }
  const pair = currentQuestion.value?.pairs?.find(p => p.right === right)
  if (!pair) return ''
  return matchedPairs.value[pair.left] === right ? 'match-correct' : 'match-wrong'
}

function handleFeedback(isCorrect: boolean) {
  if (isCorrect) {
    feedbackState.value = 'correct'
    score.value++
  } else {
    feedbackState.value = 'wrong'
    heartsLeft.value--
    if (heartsLeft.value <= 0) {
      setTimeout(() => { showResult.value = true; passed.value = false }, 1500)
      return
    }
  }
}

function nextQuestion() {
  feedbackState.value = null
  blankInput.value = ''
  selectedLeft.value = null
  matchedPairs.value = {}

  if (!quiz.value) return
  if (currentQ.value < quiz.value.questions.length - 1) {
    currentQ.value++
  } else {
    passed.value = score.value >= Math.ceil(quiz.value.questions.length * 0.6)
    showResult.value = true
    if (passed.value) {
      store.submitQuiz({
        quizId: quiz.value.id,
        score: score.value,
        totalQuestions: quiz.value.questions.length,
        xpEarned: quiz.value.xpReward,
        coinsEarned: score.value * 5,
        passed: true
      })
    }
  }
}

const resultMascotMood = computed(() => passed.value ? 'celebrating' as const : 'encouraging' as const)
const resultMascotMessage = computed(() =>
  getMascotMessage('zaki', passed.value ? 'quiz_complete_win' : 'quiz_complete_lose')
)

function handleClose() {
  showCloseModal.value = true
}

function confirmClose() {
  showCloseModal.value = false
  router.push(parcoursLink.value || '/apprenant/dashboard')
}
</script>

<style scoped>
/* ── Page ────────────────────────────────────────────────────────────────── */
.quiz-page {
  min-height: 100vh;
  background: #f0fdf4;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* ── Topbar ──────────────────────────────────────────────────────────────── */
.quiz-topbar {
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
  width: 36px; height: 36px;
  border-radius: 50%; border: none;
  background: #F3F4F6; color: #6B7280;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s; flex-shrink: 0;
}
.topbar-close:hover { background: #FEE2E2; color: #EF4444; }

.topbar-progress { flex: 1; display: flex; align-items: center; gap: 12px; }

.progress-track {
  flex: 1; height: 10px;
  background: #F3F4F6; border-radius: 10px; overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1A7A1A, #F0B429);
  border-radius: 10px; transition: width 0.4s ease;
}

.progress-label { font-size: 12px; font-weight: 600; color: #9CA3AF; white-space: nowrap; }

.hearts-display { display: flex; gap: 3px; flex-shrink: 0; }
.heart { font-size: 18px; transition: all 0.2s; }
.heart--lost { opacity: 0.2; filter: grayscale(1); }

/* ── Body ────────────────────────────────────────────────────────────────── */
.quiz-body {
  flex: 1; display: flex;
  align-items: center; justify-content: center;
  padding: 40px 24px;
  padding-bottom: 120px;
}

/* ── Loading ─────────────────────────────────────────────────────────────── */
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 16px; color: #6B7280; font-size: 14px; }
.spinner { width: 36px; height: 36px; border: 3px solid #E5E7EB; border-top-color: #1A7A1A; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Intro ───────────────────────────────────────────────────────────────── */
.intro-screen { text-align: center; max-width: 480px; }
.intro-icon { font-size: 64px; margin-bottom: 20px; }
.intro-title { font-size: 28px; font-weight: 800; color: #111827; margin-bottom: 16px; }
.intro-meta { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
.meta-pill { font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 20px; background: #F3F4F6; color: #374151; }
.intro-tip { font-size: 14px; color: #6B7280; margin-bottom: 28px; line-height: 1.5; }

.btn-start {
  display: inline-flex; align-items: center; gap: 8px;
  background: #1A7A1A; color: white; border: none;
  padding: 14px 32px; border-radius: 16px; font-size: 16px; font-weight: 700;
  cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(26, 122, 26, 0.3);
}
.btn-start:hover { background: #155e15; transform: translateY(-2px); }

/* ── Résultats ───────────────────────────────────────────────────────────── */
.result-mascot { display: flex; justify-content: center; margin-bottom: 16px; }
.result-screen { text-align: center; max-width: 480px; animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
.result-icon { font-size: 72px; margin-bottom: 16px; }
.result-title { font-size: 32px; font-weight: 800; color: #111827; margin-bottom: 8px; }
.result-sub { font-size: 16px; color: #6B7280; margin-bottom: 28px; line-height: 1.5; }
.result-rewards { display: flex; justify-content: center; gap: 20px; margin-bottom: 32px; }
.reward-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 20px 24px; border-radius: 18px; font-size: 20px; }
.reward-item--xp { background: #FFFBEB; border: 2px solid #FDE68A; }
.reward-item--score { background: #D1FAE5; border: 2px solid #6EE7B7; }
.reward-val { font-size: 22px; font-weight: 800; color: #111827; }
.reward-lbl { font-size: 11px; color: #6B7280; font-weight: 500; }
.result-actions { display: flex; flex-direction: column; gap: 10px; align-items: center; }
.btn-retry { padding: 12px 28px; border-radius: 14px; background: #F3F4F6; color: #374151; font-size: 15px; font-weight: 700; border: none; cursor: pointer; transition: background 0.15s; }
.btn-retry:hover { background: #E5E7EB; }
.btn-continue { display: inline-flex; align-items: center; background: #1A7A1A; color: white; padding: 14px 32px; border-radius: 16px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 16px rgba(26, 122, 26, 0.3); }
.btn-continue:hover { background: #155e15; transform: translateY(-1px); }

/* ── Question ────────────────────────────────────────────────────────────── */
.question-container { width: 100%; max-width: 640px; }

.question-card {
  background: white; border-radius: 20px; padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 16px;
}

.question-text { font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 24px; line-height: 1.4; }
.question-img { max-width: 100%; max-height: 180px; object-fit: contain; border-radius: 12px; margin-bottom: 20px; }

/* QCM */
.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.option-btn {
  padding: 14px 16px; border-radius: 12px; border: 2px solid #E5E7EB;
  background: white; font-size: 14px; font-weight: 600; color: #374151;
  cursor: pointer; transition: all 0.15s; text-align: left; line-height: 1.4;
}
.option-btn:hover:not(:disabled) { border-color: #1A7A1A; color: #1A7A1A; background: #F0FDF4; }
.option-btn:disabled { cursor: not-allowed; }
.option-correct { background: #D1FAE5 !important; border-color: #1A7A1A !important; color: #065F46 !important; }
.option-wrong   { background: #FEE2E2 !important; border-color: #EF4444 !important; color: #7F1D1D !important; }

/* Vrai/Faux */
.tf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.tf-btn {
  padding: 18px; border-radius: 14px; border: 2px solid #E5E7EB;
  font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.15s;
}
.tf-btn--true:hover:not(:disabled) { border-color: #1A7A1A; background: #F0FDF4; }
.tf-btn--false:hover:not(:disabled) { border-color: #EF4444; background: #FEF2F2; }
.tf-correct { background: #D1FAE5 !important; border-color: #1A7A1A !important; color: #065F46 !important; }
.tf-wrong   { background: #FEE2E2 !important; border-color: #EF4444 !important; color: #7F1D1D !important; }

/* Texte à trou */
.fill-blank { display: flex; gap: 12px; align-items: center; }
.blank-input {
  flex: 1; padding: 14px 16px; border-radius: 12px; border: 2px solid #E5E7EB;
  font-size: 15px; font-family: inherit; outline: none; transition: all 0.15s;
}
.blank-input:focus { border-color: #1A7A1A; box-shadow: 0 0 0 3px rgba(26,122,26,0.1); }
.blank-correct { border-color: #1A7A1A !important; background: #D1FAE5; }
.blank-wrong   { border-color: #EF4444 !important; background: #FEE2E2; }
.btn-validate {
  padding: 14px 20px; border-radius: 12px; background: #1A7A1A; color: white;
  font-size: 14px; font-weight: 700; border: none; cursor: pointer; transition: all 0.15s; white-space: nowrap;
}
.btn-validate:hover:not(:disabled) { background: #155e15; }
.btn-validate:disabled { opacity: 0.5; cursor: not-allowed; }

/* Association */
.match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.match-col { display: flex; flex-direction: column; gap: 8px; }
.match-item {
  padding: 12px 16px; border-radius: 12px; border: 2px solid #E5E7EB;
  font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all 0.15s; text-align: center;
}
.match-item--left:hover  { border-color: #1A7A1A; color: #1A7A1A; }
.match-item--right:hover { border-color: #7C3AED; color: #7C3AED; }
.match-item--selected { border-color: #1A7A1A; background: #F0FDF4; color: #1A7A1A; }
.match-item--matched  { background: #EDE9FE; border-color: #7C3AED; color: #7C3AED; }
.match-correct { background: #D1FAE5 !important; border-color: #1A7A1A !important; color: #065F46 !important; }
.match-wrong   { background: #FEE2E2 !important; border-color: #EF4444 !important; color: #7F1D1D !important; }

/* ── Feedback ────────────────────────────────────────────────────────────── */
.feedback-bar {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 20px; border-radius: 16px; border: 2px solid transparent;
}
.feedback--correct { background: #D1FAE5; border-color: #6EE7B7; }
.feedback--wrong   { background: #FEE2E2; border-color: #FCA5A5; }
.feedback-icon { font-size: 24px; flex-shrink: 0; }
.feedback-content { flex: 1; }
.feedback-title { font-size: 15px; font-weight: 800; color: #111827; margin-bottom: 3px; }
.feedback-explanation { font-size: 13px; color: #6B7280; line-height: 1.4; }
.feedback-next {
  padding: 10px 20px; border-radius: 12px;
  background: #1A7A1A; color: white; font-size: 14px; font-weight: 700;
  border: none; cursor: pointer; white-space: nowrap; transition: background 0.15s;
}
.feedback-next:hover { background: #155e15; }

/* ── Transitions ─────────────────────────────────────────────────────────── */
.slide-block-enter-active, .slide-block-leave-active { transition: all 0.25s ease; }
.slide-block-enter-from { opacity: 0; transform: translateX(30px); }
.slide-block-leave-to   { opacity: 0; transform: translateX(-30px); }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.25s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(12px); }

/* ── Modal ───────────────────────────────────────────────────────────────── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; }
.modal { background: white; border-radius: 20px; padding: 32px; max-width: 380px; width: 100%; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
.modal-icon { font-size: 48px; margin-bottom: 16px; }
.modal-title { font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 8px; }
.modal-text { font-size: 14px; color: #6B7280; margin-bottom: 24px; }
.modal-actions { display: flex; gap: 10px; justify-content: center; }
.modal-btn { padding: 11px 24px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; border: none; transition: all 0.15s; }
.modal-btn--cancel { background: #F3F4F6; color: #374151; }
.modal-btn--cancel:hover { background: #E5E7EB; }
.modal-btn--quit { background: #EF4444; color: white; }
.modal-btn--quit:hover { background: #DC2626; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .options-grid { grid-template-columns: 1fr; }
  .match-grid { grid-template-columns: 1fr; }
  .fill-blank { flex-direction: column; }
  .quiz-body { padding: 20px 16px; }
  .question-card { padding: 20px; }
}
</style>
