/**
 * Learner Service — couche de données mockées.
 * Toutes les méthodes retournent des Promises simulant des appels API.
 * Pour connecter une vraie API, remplacer le corps de chaque méthode
 * par un appel à useApiService() en conservant la même signature.
 */

import {
  mockLanguages,
  mockParcours,
  mockLessons,
  mockQuizzes,
  mockBadges,
  mockLearnerStats,
  getParcoursById,
  getLessonByNodeId,
  getQuizByNodeId,
  getParcoursForLanguage
} from '~/data/learner-mock'

import type {
  LearnerLanguage,
  LearnerParcours,
  Lesson,
  Quiz,
  Badge,
  LearnerStats,
  QuizResult,
  LessonProgress
} from '~/types/learner'

const MOCK_DELAY = 300

function delay(ms = MOCK_DELAY): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const useLearnerService = () => {
  // ── Langues ────────────────────────────────────────────────────────────────

  async function getMyLanguages(): Promise<LearnerLanguage[]> {
    await delay()
    return [...mockLanguages]
  }

  // ── Parcours ───────────────────────────────────────────────────────────────

  async function getAllParcours(): Promise<LearnerParcours[]> {
    await delay()
    return [...mockParcours]
  }

  async function getParcoursForLang(languageId: string): Promise<LearnerParcours[]> {
    await delay()
    return getParcoursForLanguage(languageId)
  }

  async function getParcours(id: string): Promise<LearnerParcours | null> {
    await delay()
    return getParcoursById(id) ?? null
  }

  // ── Leçons ─────────────────────────────────────────────────────────────────

  async function getLesson(nodeId: string): Promise<Lesson | null> {
    await delay()
    return getLessonByNodeId(nodeId) ?? null
  }

  async function completeLesson(nodeId: string, parcoursId: string): Promise<LessonProgress> {
    await delay(500)
    // Simuler la sauvegarde de la progression
    const lesson = getLessonByNodeId(nodeId)
    return {
      nodeId,
      completed: true,
      completedAt: new Date().toISOString(),
      xpEarned: lesson?.xpReward ?? 10
    }
  }

  // ── Quiz ───────────────────────────────────────────────────────────────────

  async function getQuiz(nodeId: string): Promise<Quiz | null> {
    await delay()
    return getQuizByNodeId(nodeId) ?? null
  }

  async function submitQuizResult(result: QuizResult): Promise<{ xpEarned: number; coinsEarned: number; newBadges: Badge[] }> {
    await delay(600)
    return {
      xpEarned: result.xpEarned,
      coinsEarned: result.passed ? Math.floor(result.score * 5) : 0,
      newBadges: []
    }
  }

  // ── Badges ─────────────────────────────────────────────────────────────────

  async function getMyBadges(): Promise<Badge[]> {
    await delay()
    return [...mockBadges]
  }

  // ── Statistiques ───────────────────────────────────────────────────────────

  async function getMyStats(): Promise<LearnerStats> {
    await delay()
    return { ...mockLearnerStats }
  }

  // ── Parcours actif (pour continuer) ───────────────────────────────────────

  async function getActiveParcours(): Promise<LearnerParcours | null> {
    await delay(200)
    return mockParcours.find(p => p.status === 'in_progress') ?? null
  }

  return {
    getMyLanguages,
    getAllParcours,
    getParcoursForLang,
    getParcours,
    getLesson,
    completeLesson,
    getQuiz,
    submitQuizResult,
    getMyBadges,
    getMyStats,
    getActiveParcours
  }
}
