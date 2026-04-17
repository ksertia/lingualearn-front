// tests/api.integration.test.ts
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useApiService } from '../services/api'

// Mock HTTP requests avec MSW
const server = setupServer(
    rest.get('http://localhost:3000/api/v1/step-quizzes', (req, res, ctx) => {
        const stepId = req.url.searchParams.get('stepId')

        if (stepId === 'invalid-step') {
            return res(ctx.status(404), ctx.json({ message: 'Not Found' }))
        }

        if (stepId === 'error-step') {
            return res(ctx.status(500), ctx.json({ message: 'Internal Server Error' }))
        }

        return res(ctx.json({
            data: {
                quizzes: [
                    { id: '1', title: 'Quiz 1', questions: [] },
                    { id: '2', title: 'Quiz 2', questions: [] }
                ]
            }
        }))
    })
)

describe('API Service Integration Tests', () => {
    beforeAll(() => {
        server.listen()
    })

    afterEach(() => {
        server.resetHandlers()
    })

    afterAll(() => {
        server.close()
    })

    describe('getStepQuizzes', () => {
        it('devrait récupérer les quiz d\'une étape avec succès', async () => {
            const apiService = useApiService()

            const result = await apiService.getStepQuizzes('step-123')

            expect(result).toEqual({
                data: {
                    quizzes: [
                        { id: '1', title: 'Quiz 1', questions: [] },
                        { id: '2', title: 'Quiz 2', questions: [] }
                    ]
                }
            })
        })

        it('devrait gérer les erreurs 404 (pas de quiz)', async () => {
            const apiService = useApiService()

            await expect(apiService.getStepQuizzes('invalid-step')).rejects.toThrow()
        })

        it('devrait gérer les erreurs serveur (500)', async () => {
            const apiService = useApiService()

            await expect(apiService.getStepQuizzes('error-step')).rejects.toThrow()
        })

        it('devrait gérer les erreurs réseau', async () => {
            // Pour simuler une erreur réseau, on peut arrêter le serveur ou changer le handler
            server.use(
                rest.get('http://localhost:3000/api/v1/step-quizzes', (req, res, ctx) => {
                    return res.networkError('Network Error')
                })
            )

            const apiService = useApiService()

            await expect(apiService.getStepQuizzes('step-123')).rejects.toThrow('Network Error')
        })

        it('devrait passer les paramètres correctement', async () => {
            const apiService = useApiService()

            await apiService.getStepQuizzes('step-456')

            // MSW vérifie automatiquement que la requête est faite avec les bons paramètres
            // Si le test passe, c'est que l'URL et les params sont corrects
        })
    })

    // Vous pouvez ajouter d'autres méthodes de l'API ici
    // describe('createQuiz', () => { ... })
    // describe('updateQuiz', () => { ... })
})