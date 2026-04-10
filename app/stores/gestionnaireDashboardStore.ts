import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiService } from "~/services/api";
import { useLanguageStore } from "./languageStore";
import { useModuleStore } from './moduleStore';
import { useParcoursStore } from './parcoursStore';
import { useStepStore } from './stepStore';
import type {
  GestionnaireDashboardData,
  DailyPublication,
  LanguageContent,

} from "~/types/gestionnaire-dashboard";
import type { StatTotalResponse } from "~/types/dashboard";

// Données de démonstration (à remplacer par de vraies données API)
const EMPTY_DATA: GestionnaireDashboardData = {
  trainers: { total: 0, active: 0 },
  languages: { total: 0, active: 0 },
  modules: { published: 0, disabled: 0, total: 0 },
  contents: { createdThisMonth: 0, total: 0 },
  reports: { pending: 0, resolved: 0 },
  charts: {
    publicationsLast30Days: [],
    contentsByLanguage: [],
  },
};

function generateLast30DaysData(): DailyPublication[] {
  const data: DailyPublication[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Générer des données aléatoires avec tendance
    const baseCount = 3 + Math.floor(Math.random() * 5);
    const dayOfWeek = date.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.5 : 1;

    data.push({
      date: date.toISOString().split("T")[0]!,
      count: Math.floor(baseCount * weekendFactor),
    });
  }

  return data;
}

// Helper pour parser la réponse API
const toTotal = (response?: StatTotalResponse) => {
  const data = response?.data;
  if (typeof data === "number") {
    return Number.isFinite(data) ? data : 0;
  }
  if (
    data &&
    typeof data === "object" &&
    "total" in data &&
    typeof data.total === "number"
  ) {
    return Number.isFinite(data.total) ? data.total : 0;
  }
  return 0;
};

const safeTotal = async (promise: Promise<StatTotalResponse>) => {
  try {
    const response = await promise;
    return response?.success ? toTotal(response) : 0;
  } catch {
    return 0;
  }
};

export const useGestionnaireDashboardStore = defineStore(
  "gestionnaireDashboard",
  () => {
    const apiService = useApiService();
    const languageStore = useLanguageStore();
    const moduleStore = useModuleStore();
    const parcoursStore = useParcoursStore();
    const stepStore = useStepStore();

    const stats = ref<GestionnaireDashboardData | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Computed properties pour les indicateurs
    const trainersTotal = computed(() => stats.value?.trainers.total ?? 0);
    const coursesPublished = computed(
      () => stats.value?.modules.published ?? 0,
    );
    // const coursesDisabled = computed(() => stats.value?.modules.disabled ?? 0);
    // const contentsThisMonth = computed(
    //   () => stats.value?.contents.createdThisMonth ?? 0,
    // );
    const reportsPending = computed(() => stats.value?.reports.pending ?? 0);

    const publicationsLast30Days = computed(
      () => stats.value?.charts.publicationsLast30Days ?? [],
    );
    const contentsByLanguage = computed(
      () => stats.value?.charts.contentsByLanguage ?? [],
    );

    const totalParcours = computed(() => stats.value?.modules.total ?? 0);

    const totalEtapes = computed(() => stats.value?.contents.total ?? 0);

    const totalModules = computed(() => stats.value?.modules.total ?? 0);

    // 👉 total global contenus (ce que tu veux maintenant)
    const contentsTotal = computed(
      () => totalParcours.value + totalEtapes.value,
    );

    const totalLanguages = computed(() => {
      if (languageStore.languages.length > 0) {
        return languageStore.languages.length;
      }
      return stats.value?.languages?.total ?? 0;
    });

    // const disabledLanguages = computed(
    //   () => stats.value?.languages?.disabled ?? 0,
    // );
    const activeLanguages = computed(() => {
      if (languageStore.languages.length > 0) {
        return languageStore.languages.filter((l: any) => l.isActive).length;
      }
      return stats.value?.languages?.active ?? 0;
    });

    // Calcul des variations (demo)
    // const contentsVariation = computed(() => {
    //   // Variation simulée pour le demo
    //   return 12; // +12% ce mois
    // });

    const reportsVariation = computed(() => {
      // Variation simulée pour le demo
      return -5; // -5% de signalements en attente
    });

    async function fetchDashboardData() {
      isLoading.value = true;
      error.value = null;

      try {
        // Récupération des données des formateurs via getFilterUsers (accessible aux gestionnaires)
        const totalResponse = await apiService.getFilterUsers({
          accountType: "teacher",
          limit: 1,
        });
        const trainersTotal =
          totalResponse.success && totalResponse.data
            ? totalResponse.data.pagination.total
            : 0;

        // Pour les actifs, récupérer tous les formateurs et filtrer (limit élevé pour couvrir la plupart des cas)
        const allTeachersResponse = await apiService.getFilterUsers({
          accountType: "teacher",
          limit: 10000,
        });
        const trainersActive =
          allTeachersResponse.success && allTeachersResponse.data
            ? allTeachersResponse.data.users.filter(
                (user: any) => user.isActive,
              ).length
            : 0;

// 👉 FETCH CONTENTS STATS FROM BACKEND API (async safeTotal)
        await moduleStore.fetchModule();
        await parcoursStore.fetchAll();
        await stepStore.fetchSteps();
        const realModulesTotal = moduleStore.module.length;
        const realParcoursTotal = parcoursStore.parcours.length;
        const realEtapesTotal = stepStore.steps.length;

        // 👉 FETCH ALL LANGUAGES FROM BACKEND AND COMPUTE STATS CLIENT-SIDE
        await languageStore.fetchLanguages();
        const totalLanguagesReal = languageStore.languages.length;
        const activeLanguagesReal = languageStore.languages.filter((l: any) => l.isActive).length;

        // Simulation d'un appel API
        await new Promise((resolve) => setTimeout(resolve, 800));

        
        stats.value = {
          trainers: {
            total: trainersTotal,
            active: trainersActive,
          },
          languages: {
            total: totalLanguagesReal,
            active: activeLanguagesReal,
          },
          modules: {
            published: 156,
            disabled: 12,
            total: realModulesTotal,
          },
          contents: {
            createdThisMonth: 45,
            total: realEtapesTotal,
          },
          reports: {
            pending: 8,
            resolved: 47,
          },
          
          charts: {
            publicationsLast30Days: generateLast30DaysData(),
            contentsByLanguage: [
              { languageId: '1', languageName: 'Wolof', courseCount: 68 },
              { languageId: '2', languageName: 'Serer', courseCount: 42 },
              { languageId: '3', languageName: 'Pulaar', courseCount: 38 },
              { languageId: '4', languageName: 'Diola', courseCount: 8 },
            ],
          },
        };
      } catch (err: any) {
        console.warn("Erreur lors du chargement des données:", err);
        error.value = err.message || "Erreur lors du chargement des données";
        // Fallback sur les données de démonstration
        stats.value = EMPTY_DATA;
      } finally {
        isLoading.value = false;
      }
    }

    // Fonction pour formater les nombres
    const formatNumber = (num: number) => {
      return new Intl.NumberFormat("fr-FR").format(num);
    };

    // Fonction pour calculer le pourcentage de cours désactivés
    // const disabledCoursesPercentage = computed(() => {
    //   if (!stats.value || stats.value.modules.total === 0) return 0;
    //   return Math.round(
    //     (stats.value.modules.disabled / stats.value.modules.total) * 100,
    //   );
    // });

    return {
      // State
      stats,
      isLoading,
      error,

      // Computed - Statistiques principales
      trainersTotal,
      coursesPublished,
      // coursesDisabled,
      // contentsThisMonth,
      reportsPending,

      

      // Computed - Données graphiques
      publicationsLast30Days,
      contentsByLanguage,

      // Computed - Variations
      // contentsVariation,
      reportsVariation,
      // disabledCoursesPercentage,

      totalParcours,
      totalEtapes,
      totalModules,
      contentsTotal,

      totalLanguages,
      activeLanguages,

      // Actions
      fetchDashboardData,
      formatNumber,
    };
  },
);
