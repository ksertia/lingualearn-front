import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLearnerService } from '~/services/learner-service'
import type {
  LearnerLanguage,
  LearnerParcours,
  Lesson,
  Quiz,
  Badge,
  LearnerStats,
  QuizResult
} from '~/types/learner'

export const useLearnerStore = defineStore('learner', () => {
  const service = useLearnerService()

  // ── State ──────────────────────────────────────────────────────────────────

  const languages = ref<LearnerLanguage[]>([])
  const allParcours = ref<LearnerParcours[]>([])
  const activeParcours = ref<LearnerParcours | null>(null)
  const currentLesson = ref<Lesson | null>(null)
  const currentQuiz = ref<Quiz | null>(null)
  const badges = ref<Badge[]>([])
  const stats = ref<LearnerStats | null>(null)
  const isLoading = ref(false)
  const isLessonLoading = ref(false)

  // Suivi de progression locale (avant synchro API)
  const completedNodeIds = ref<Set<string>>(new Set())

  // ── Computed ───────────────────────────────────────────────────────────────

  const xpPercent = computed(() => {
    if (!stats.value) return 0
    return Math.round((stats.value.xp / stats.value.xpToNextLevel) * 100)
  })

  const weeklyGoalPercent = computed(() => {
    if (!stats.value) return 0
    const weekTotal = stats.value.weeklyXP.reduce((a, b) => a + b, 0)
    return Math.min(100, Math.round((weekTotal / stats.value.weeklyGoalXP) * 100))
  })

  const unlockedBadges = computed(() => badges.value.filter(b => b.unlocked))

  const currentNodeInActiveParcours = computed(() => {
    return activeParcours.value?.nodes.find(n => n.status === 'current') ?? null
  })

  const mooreParcours = computed(() => allParcours.value.filter(p => p.languageId === 'lang-1'))
  const dioulaParcours = computed(() => allParcours.value.filter(p => p.languageId === 'lang-2'))

  // ── Actions ────────────────────────────────────────────────────────────────

  async function init() {
    if (stats.value) return
    isLoading.value = true
    try {
      const [langs, parcoursList, badgeList, statData, active] = await Promise.all([
        service.getMyLanguages(),
        service.getAllParcours(),
        service.getMyBadges(),
        service.getMyStats(),
        service.getActiveParcours()
      ])
      languages.value = langs
      allParcours.value = parcoursList
      badges.value = badgeList
      stats.value = statData
      activeParcours.value = active
    } finally {
      isLoading.value = false
    }
  }

  async function loadParcours(id: string): Promise<LearnerParcours | null> {
    isLoading.value = true
    try {
      const p = await service.getParcours(id)
      if (p) {
        const idx = allParcours.value.findIndex(x => x.id === id)
        if (idx >= 0) allParcours.value[idx] = p
        else allParcours.value.push(p)
      }
      return p
    } finally {
      isLoading.value = false
    }
  }

  async function loadLesson(nodeId: string): Promise<Lesson | null> {
    isLessonLoading.value = true
    try {
      const l = await service.getLesson(nodeId)
      currentLesson.value = l
      return l
    } finally {
      isLessonLoading.value = false
    }
  }

  async function loadQuiz(nodeId: string): Promise<Quiz | null> {
    isLessonLoading.value = true
    try {
      const q = await service.getQuiz(nodeId)
      currentQuiz.value = q
      return q
    } finally {
      isLessonLoading.value = false
    }
  }

  async function completeLesson(nodeId: string, parcoursId: string) {
    const progress = await service.completeLesson(nodeId, parcoursId)
    completedNodeIds.value.add(nodeId)
    if (stats.value) {
      stats.value.xp += progress.xpEarned
      stats.value.totalLessonsCompleted += 1
    }
    return progress
  }

  async function submitQuiz(result: QuizResult) {
    const reward = await service.submitQuizResult(result)
    completedNodeIds.value.add(result.quizId)
    if (stats.value) {
      stats.value.xp += reward.xpEarned
      stats.value.coins += reward.coinsEarned
      stats.value.totalQuizzesCompleted += 1
    }
    return reward
  }

  function getParcoursById(id: string): LearnerParcours | undefined {
    return allParcours.value.find(p => p.id === id)
  }

  return {
    // State
    languages,
    allParcours,
    activeParcours,
    currentLesson,
    currentQuiz,
    badges,
    stats,
    isLoading,
    isLessonLoading,
    completedNodeIds,
    // Computed
    xpPercent,
    weeklyGoalPercent,
    unlockedBadges,
    currentNodeInActiveParcours,
    mooreParcours,
    dioulaParcours,
    // Actions
    init,
    loadParcours,
    loadLesson,
    loadQuiz,
    completeLesson,
    submitQuiz,
    getParcoursById
  }
})
