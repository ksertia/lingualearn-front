// stores/quizzes.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizStore } from '../stores/quizStore'
import { useApiService } from '../services/api'

// Mock pour getStepQuizzes
const mockGetStepQuizzes = vi.fn()

// Mock pour createStepQuiz
const mockCreateStepQuiz = vi.fn()

// On mocke le service d'API
vi.mock('../services/api', () => ({
    useApiService: vi.fn(() => ({
        getStepQuizzes: mockGetStepQuizzes,
        createStepQuiz: mockCreateStepQuiz
    }))
}))

describe('Quizz Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    // Test de la logique d'extraction (extractQuizzes)
    describe('extractQuizzes (via fetchQuizzes)', () => {
        it('devrait extraire les quiz quel que soit le format de réponse', async () => {
            const store = useQuizStore()
            const mockData = [{ id: '1', title: 'Quiz Test' }]

            // Test format : { data: { quizzes: [...] } }
            mockGetStepQuizzes.mockResolvedValue({ data: { quizzes: mockData } })

            await store.fetchQuizzes('step-1')
            expect(store.quizzes).toEqual(mockData)
            expect(store.error).toBeNull()
        })

        it('devrait retourner un tableau vide et une erreur si le format est inconnu', async () => {
            const store = useQuizStore()
            mockGetStepQuizzes.mockResolvedValue({ unknown: 'format' })

            await store.fetchQuizzes('step-1')
            expect(store.quizzes).toEqual([])
            expect(store.error).toBe('Échec du chargement des quiz')
        })
    })

    // Test de la gestion des erreurs (fetchQuizzes)
    describe('fetchQuizzes error handling', () => {
        it('devrait gérer proprement une erreur 404 (pas de quiz)', async () => {
            const store = useQuizStore()

            // Simule un rejet d'API avec un code 404
            mockGetStepQuizzes.mockRejectedValue({ statusCode: 404 })

            await store.fetchQuizzes('invalid-id')

            expect(store.quizzes).toEqual([])
            expect(store.error).toBeNull() // Selon votre code, 404 ne met pas d'erreur
            expect(store.isLoading).toBe(false)
        })

        it('devrait afficher un message d\'erreur pour les autres erreurs (ex: 500)', async () => {
            const store = useQuizStore()
            mockGetStepQuizzes.mockRejectedValue({ status: 500 })

            await store.fetchQuizzes('step-1')

            expect(store.error).toBe('Erreur lors de la récupération des quiz')
            expect(store.isLoading).toBe(false)
        })
    })

    // Test de la création de quiz
    describe('createQuiz', () => {
        it('devrait créer un quiz avec succès et l\'ajouter à la liste', async () => {
            const store = useQuizStore()
            const newQuiz = { id: '3', title: 'Nouveau Quiz', questions: [] }
            const createData = { title: 'Nouveau Quiz', stepId: 'step-1', questions: [] }

            mockCreateStepQuiz.mockResolvedValue({ data: newQuiz })

            const result = await store.createQuiz(createData)

            expect(result).toEqual(newQuiz)
            expect(store.error).toBeNull()
            expect(store.isLoading).toBe(false)
        })

        it('devrait gérer une réponse sans data mais avec id', async () => {
            const store = useQuizStore()
            const newQuiz = { id: '4', title: 'Quiz Direct' }
            const createData = { title: 'Quiz Direct', stepId: 'step-1' }

            mockCreateStepQuiz.mockResolvedValue(newQuiz)

            const result = await store.createQuiz(createData)

            expect(result).toEqual(newQuiz)
        })

        it('devrait gérer les erreurs de création', async () => {
            const store = useQuizStore()
            const createData = { title: 'Quiz Erreur', stepId: 'step-1' }

            mockCreateStepQuiz.mockResolvedValue({ message: 'Erreur de validation' })

            const result = await store.createQuiz(createData)

            expect(result).toBeNull()
            expect(store.error).toBe('Erreur de validation')
            expect(store.isLoading).toBe(false)
        })

        it('devrait gérer les exceptions lors de la création', async () => {
            const store = useQuizStore()
            const createData = { title: 'Quiz Exception', stepId: 'step-1' }

            mockCreateStepQuiz.mockRejectedValue({ message: 'Erreur réseau', name: 'Error' })

            const result = await store.createQuiz(createData)

            expect(result).toBeNull()
            expect(store.error).toBe('Erreur lors de la création du quiz')
        })
    })
})
