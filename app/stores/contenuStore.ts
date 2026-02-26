import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useModuleStore } from './moduleStore'
import { useLevelStore } from './levelStore'
import { useLanguageStore } from './languageStore'
import { useApiService } from '~/services/api'
import type { Contenu, ContenuFilters, ContenuSortField, ContenuSortOrder, ContenuStatsSummary } from '~/types/contenu'
import type { module as ModuleType } from '~/types/modules'
import type { LearningPath, Step } from '~/types/learning'

export const useContenuStore = defineStore('contenu', () => {
  const moduleStore = useModuleStore()
  const levelStore = useLevelStore()
  const languageStore = useLanguageStore()
  const apiService = useApiService()

  const contenus = ref<Contenu[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Détails du module sélectionné (parcours et étapes)
  const selectedModuleDetails = ref<{
    parcours: LearningPath[],
    steps: Record<string, Step[]> // pathId -> Step[]
  }>({
    parcours: [],
    steps: {}
  })

  // Filtres et Tri
  const filters = ref<ContenuFilters>({
    status: 'all',
    languageId: undefined,
    levelId: undefined,
    formateurId: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    minEnrolled: undefined,
    maxEnrolled: undefined,
    search: undefined
  })

  const sort = ref<{ field: ContenuSortField; order: ContenuSortOrder }>({
    field: 'publishedAt',
    order: 'desc'
  })

  // Pagination
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Computed: Contenus filtrés et triés
  const filteredContenus = computed(() => {
    let result = [...contenus.value]

    // Filtre par recherche
    if (filters.value.search) {
      const q = filters.value.search.toLowerCase()
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      )
    }

    // Filtre par langue
    if (filters.value.languageId) {
      result = result.filter(c => c.language.id === filters.value.languageId)
    }

    // Filtre par niveau (par nom regroupé)
    if (filters.value.levelId) {
      // Trouver le niveau sélectionné pour obtenir son nom
      const selectedLevel = levelStore.levels.find(l => l.id === filters.value.levelId);
      if (selectedLevel) {
        // Filtrer par nom de niveau (peu importe la langue)
        result = result.filter(c => c.level.name === selectedLevel.name);
      }
    }

    // Filtre par formateur (désactivé)
    // if (filters.value.formateurId) {
    //   result = result.filter(c => c.auteur.id === filters.value.formateurId)
    // }

    // Filtre par statut
    if (filters.value.status && filters.value.status !== 'all') {
      result = result.filter(c => c.status === filters.value.status)
    }

    // Filtre par date de début
    if (filters.value.dateFrom) {
      const fromDate = new Date(filters.value.dateFrom)
      result = result.filter(c => {
        const publishDate = new Date(c.publishedAt || c.createdAt)
        return publishDate >= fromDate
      })
    }

    // Filtre par date de fin
    if (filters.value.dateTo) {
      const toDate = new Date(filters.value.dateTo)
      result = result.filter(c => {
        const publishDate = new Date(c.publishedAt || c.createdAt)
        return publishDate <= toDate
      })
    }

    // Filtre par nombre d'inscrits (min)
    if (filters.value.minEnrolled !== undefined && filters.value.minEnrolled !== null) {
      result = result.filter(c => (c.stats?.enrolledCount || 0) >= filters.value.minEnrolled!)
    }

    // Filtre par nombre d'inscrits (max)
    if (filters.value.maxEnrolled !== undefined && filters.value.maxEnrolled !== null) {
      result = result.filter(c => (c.stats?.enrolledCount || 0) <= filters.value.maxEnrolled!)
    }

    // Tri
    result.sort((a, b) => {
      let valA: any = a[sort.value.field as keyof Contenu]
      let valB: any = b[sort.value.field as keyof Contenu]

      if (sort.value.field === 'title') {
        valA = a.title
        valB = b.title
      } else if (sort.value.field === 'publishedAt') {
        valA = new Date(a.publishedAt || a.createdAt).getTime()
        valB = new Date(b.publishedAt || b.createdAt).getTime()
      } else if (sort.value.field === 'enrolledCount') {
        valA = a.stats?.enrolledCount || 0
        valB = b.stats?.enrolledCount || 0
      }

      if (valA < valB) return sort.value.order === 'asc' ? -1 : 1
      if (valA > valB) return sort.value.order === 'asc' ? 1 : -1
      return 0
    })

    return result
  })

  const statsSummary = computed<ContenuStatsSummary>(() => {
    return {
      total: contenus.value.length,
      active: contenus.value.filter(c => c.status === 'active').length,
      disabled: contenus.value.filter(c => c.status === 'disabled').length,
      publishedToday: 0,
      publishedThisWeek: 0,
      publishedThisMonth: 0,
      totalEnrolled: contenus.value.reduce((acc, c) => acc + (c.stats?.enrolledCount || 0), 0),
    }
  })

  // Action: Récupérer les modules (contenus) par langue via les niveaux
  async function fetchContenus() {
    isLoading.value = true
    error.value = null

    try {
      // 1. Récupérer les langues et niveaux
      await Promise.all([
        levelStore.fetchLevels(),
        languageStore.fetchLanguages()
      ])
      
      const allModules: ModuleType[] = []
      
      // 2. Préparer toutes les requêtes de modules en parallèle
      const moduleRequests: Promise<{ languageId: string; levelId: string; modules: ModuleType[] }>[] = []
      
      for (const language of languageStore.languages) {
        const languageId = String(language.id || (language as any)._id || '')
        
        // Récupérer les niveaux de cette langue
        const languageLevels = levelStore.levels.filter(level => level.languageId === languageId)
        
        // Préparer les requêtes pour chaque niveau
        for (const level of languageLevels) {
          const levelId = String(level.id || (level as any)._id || '')
          
          moduleRequests.push(
            apiService.getModulesByLevel(languageId, levelId)
              .then(response => {
                const responseData = response?.data as any || {}
                const modules = responseData.modules || []
                return {
                  languageId,
                  levelId,
                  modules: Array.isArray(modules) ? modules : []
                }
              })
              .catch(e => {
                console.error(`Erreur récupération modules pour niveau ${levelId}:`, e)
                return { languageId, levelId, modules: [] }
              })
          )
        }
      }
      
      // 3. Exécuter toutes les requêtes en parallèle
      const results = await Promise.all(moduleRequests)
      
      // 4. Agréger tous les modules
      results.forEach(result => {
        allModules.push(...result.modules)
      })
      
      console.log('Total modules récupérés:', allModules.length)
      
      // 5. Filtrer les modules qui ont des parcours associés (en parallèle)
      const checkResults = await Promise.all(
        allModules.map(async (mod) => {
          const moduleId = String(mod.id || (mod as any)._id || '');
          const modLevelId = String(mod.levelId || (mod as any)._levelId || '');
          
          if (!moduleId || !modLevelId) return { mod, hasPaths: false };
          
          // Trouver le niveau et la langue pour utiliser les endpoints hiérarchiques
          const level = levelStore.levels.find(l => 
            String(l.id || (l as any)._id || '').trim() === modLevelId.trim()
          );
          
          const language = level ? languageStore.languages.find(lang => 
            String(lang.id || (lang as any)._id || '').trim() === String(level.languageId || (level as any)._languageId || '').trim()
          ) : null;
          
          if (!level || !language) return { mod, hasPaths: false };
          
          try {
            // Utilisation des endpoints hiérarchiques
            const response: any = await apiService.getLearningPathsByModule(
              String(language.id || (language as any)._id || ''),
              modLevelId,
              moduleId
            );
            const pathsData = response?.data || (Array.isArray(response) ? response : [])
            return { mod, hasPaths: pathsData.length > 0 };
          } catch (e) {
            return { mod, hasPaths: false };
          }
        })
      )

      const validModules = checkResults.filter(r => r.hasPaths).map(r => r.mod)
      console.log('Modules valides (avec parcours):', validModules.length)
      
      // TEMPORAIRE: Afficher tous les modules même sans parcours pour débogage
      const allValidModules = checkResults.map(r => r.mod)
      console.log('TOUS les modules (même sans parcours):', allValidModules.length)
      
      // 6. Mapping avec les données synchronisées
      contenus.value = allValidModules.map((mod: ModuleType) => {
        const modLevelId = String(mod.levelId || (mod as any)._levelId || '');
        const level = levelStore.levels.find(l => 
          String(l.id || (l as any)._id || '').trim() === modLevelId.trim()
        )
        
        const language = level ? languageStore.languages.find(lang => 
          String(lang.id || (lang as any)._id || '').trim() === String(level.languageId || (level as any)._languageId || '').trim()
        ) : null

        return {
          id: String(mod.id || (mod as any)._id || ''),
          title: mod.title,
          description: mod.description,
          type: 'course',
          status: mod.isActive ? 'active' : 'disabled',
          language: { 
            id: String(language?.id || (language as any)?._id || ''), 
            name: language?.name || 'Inconnue', 
            code: language?.code || 'FR' 
          },
          level: { 
            id: modLevelId, 
            name: level?.name || `Niveau ${modLevelId}`, 
            code: level?.code || '' 
          },
          module: { id: String(mod.id || (mod as any)._id || ''), title: mod.title },
          auteur: { id: 'system', firstName: 'Admin', lastName: 'System', email: '' },
          createdAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          stats: { enrolledCount: 0, completionRate: 0, averageScore: 0, reportsCount: 0 }
        }
      })

      pagination.value.total = contenus.value.length
      pagination.value.totalPages = Math.ceil(contenus.value.length / pagination.value.limit)

    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des contenus'
    } finally {
      isLoading.value = false
    }
  }

  // Action: Récupérer les détails d'un module (parcours + étapes)
  async function fetchModuleDetails(moduleId: string) {
    isLoading.value = true
    error.value = null
    const targetModuleId = String(moduleId).trim();
    // Reset avant chargement pour éviter les flashs de données précédentes
    selectedModuleDetails.value = { parcours: [], steps: {} }

    try {
      // 1. Trouver le module et sa hiérarchie (langue -> niveau -> module)
      const module = contenus.value.find(c => c.id === targetModuleId);
      console.log('Module trouvé pour détails:', module)
      
      if (!module) {
        throw new Error('Module non trouvé');
      }
      
      const languageId = module.language.id;
      const levelId = module.level.id;
      
      console.log('Récupération parcours pour:', { languageId, levelId, moduleId: targetModuleId })
      
      // 2. Récupérer les parcours associés au module avec l'endpoint hiérarchique
      const response: any = await apiService.getLearningPathsByModule(languageId, levelId, targetModuleId)
      
      console.log('Réponse parcours API:', response)
      
      const rawPaths = response?.data?.paths || (Array.isArray(response?.data) ? response?.data : [])
      console.log('Parcours bruts extraits:', rawPaths)
      
      if (rawPaths && rawPaths.length > 0) {
        console.log(`Traitement de ${rawPaths.length} parcours...`)
        
        // 3. Pour chaque parcours, récupérer ses étapes avec l'endpoint hiérarchique
        const pathCheckResults = await Promise.all(rawPaths.map(async (path: any) => {
          const pathId = String(path.id || path._id || '').trim();
          console.log(`Traitement parcours ${pathId}:`, path)
          
          if (!pathId) return null;
          
          try {
            const stepsRes: any = await apiService.getStepsByPath(languageId, levelId, targetModuleId, pathId)
            console.log(`Réponse étapes pour parcours ${pathId}:`, stepsRes)
            
            const stepsData = stepsRes?.data?.steps || (Array.isArray(stepsRes?.data) ? stepsRes?.data : [])
            console.log(`Étapes brutes pour parcours ${pathId}:`, stepsData)
            
            if (stepsData && stepsData.length > 0) {
              return {
                path: { ...path, id: pathId },
                steps: stepsData.map((s: any) => ({
                  ...s,
                  id: String(s.id || s._id || '').trim()
                }))
              };
            }
            console.log(`Aucune étape trouvée pour parcours ${pathId}`)
            return null;
          } catch (stepErr) {
            console.error(`Error fetching steps for path ${pathId}:`, stepErr)
            return null;
          }
        }))

        const validResults = pathCheckResults.filter((r): r is NonNullable<typeof r> => r !== null);
        console.log('Résultats valides (parcours avec étapes):', validResults)
        
        // 4. Mettre à jour le store avec les parcours filtrés et leurs étapes
        selectedModuleDetails.value.parcours = validResults.map(r => r.path);
        validResults.forEach(r => {
          selectedModuleDetails.value.steps[r.path.id] = r.steps;
        });
        
        console.log('Détails finaux du module:', selectedModuleDetails.value)
      } else {
        console.log('Aucun parcours trouvé pour ce module')
      }
    } catch (err: any) {
      error.value = "Erreur lors de la récupération des détails du module"
      console.error('fetchModuleDetails error:', err)
    } finally {
      isLoading.value = false
    }
  }

  function setSort(field: ContenuSortField, order: ContenuSortOrder) {
    sort.value = { field, order }
  }

  function setPage(page: number) {
    pagination.value.page = page
  }

  async function disableContenu(id: string, reason?: string) {
    try {
      // On suppose que désactiver un contenu = désactiver le module
      const res = await apiService.updateModule(id, { isActive: false } as any)
      if (res.success) {
        const c = contenus.value.find(item => item.id === id)
        if (c) {
          c.status = 'disabled'
          c.disabledByGestionnaire = true
          c.disabledReason = reason
        }
        return { success: true, message: 'Module désactivé' }
      }
      return { success: false, message: res.message || 'Erreur' }
    } catch (err) {
      return { success: false, message: 'Erreur lors de la désactivation' }
    }
  }

  async function enableContenu(id: string) {
    try {
      const res = await apiService.updateModule(id, { isActive: true } as any)
      if (res.success) {
        const c = contenus.value.find(item => item.id === id)
        if (c) {
          c.status = 'active'
          c.disabledByGestionnaire = false
          c.disabledReason = undefined
        }
        return { success: true, message: 'Module activé' }
      }
      return { success: false, message: res.message || 'Erreur' }
    } catch (err) {
      return { success: false, message: 'Erreur lors de l\'activation' }
    }
  }

  async function deleteContenu(id: string) {
    try {
      const res = await apiService.deleteModule(id)
      if (res.success) {
        contenus.value = contenus.value.filter(c => c.id !== id)
        return { success: true, message: 'Module supprimé' }
      }
      return { success: false, message: res.message || 'Erreur' }
    } catch (err) {
      return { success: false, message: 'Erreur lors de la suppression' }
    }
  }

  return {
    contenus,
    isLoading,
    error,
    filters,
    sort,
    pagination,
    filteredContenus,
    statsSummary,
    selectedModuleDetails,
    fetchContenus,
    fetchModuleDetails,
    setSort,
    setPage,
    disableContenu,
    enableContenu,
    deleteContenu
  }
})
