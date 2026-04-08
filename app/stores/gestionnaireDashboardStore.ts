import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiService } from "~/services/api";
import type {
  GestionnaireDashboardData,
  DailyPublication,
  LanguageContent,
} from "~/types/gestionnaire-dashboard";
import type { StatTotalResponse } from "~/types/dashboard";

// Données de démonstration (à remplacer par de vraies données API)
const DEMO_DATA: GestionnaireDashboardData = {
  trainers: {
    total: 24,
    active: 18,
  },
  languages: {
    total: 12,
    active: 3,
  },
  modules: {
    published: 156,
    disabled: 12,
    total: 168,
  },
  contents: {
    createdThisMonth: 45,
    total: 892,
  },
  reports: {
    pending: 8,
    resolved: 47,
  },
  strategic: {
    mostActiveLanguage: "Wolof",
    mostActiveLevel: "Débutant",
    mostProductiveTrainer: "Moussa Diallo",
    publicationsLast7Days: 23,
  },
  charts: {
    publicationsLast30Days: generateLast30DaysData(),
    contentsByLanguage: [
      { languageId: "1", languageName: "Wolof", courseCount: 68 },
      { languageId: "2", languageName: "Serer", courseCount: 42 },
      { languageId: "3", languageName: "Pulaar", courseCount: 38 },
      { languageId: "4", languageName: "Diola", courseCount: 8 },
    ],
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

    const stats = ref<GestionnaireDashboardData | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Computed properties pour les indicateurs
    const trainersTotal = computed(() => stats.value?.trainers.total ?? 0);
    const coursesPublished = computed(
      () => stats.value?.modules.published ?? 0,
    );
    const coursesDisabled = computed(() => stats.value?.modules.disabled ?? 0);
    const contentsThisMonth = computed(
      () => stats.value?.contents.createdThisMonth ?? 0,
    );
    const reportsPending = computed(() => stats.value?.reports.pending ?? 0);

    const mostActiveLanguage = computed(
      () => stats.value?.strategic.mostActiveLanguage ?? "N/A",
    );
    const mostActiveLevel = computed(
      () => stats.value?.strategic.mostActiveLevel ?? "N/A",
    );
    const mostProductiveTrainer = computed(
      () => stats.value?.strategic.mostProductiveTrainer ?? "N/A",
    );
    const publicationsLast7Days = computed(
      () => stats.value?.strategic.publicationsLast7Days ?? 0,
    );

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

    const totalLanguages = computed(() => stats.value?.languages?.total ?? 0);

    // const disabledLanguages = computed(
    //   () => stats.value?.languages?.disabled ?? 0,
    // );
    const activeLanguages = computed(
      () => stats.value?.languages?.active ?? 0,
    );

    // Calcul des variations (demo)
    const contentsVariation = computed(() => {
      // Variation simulée pour le demo
      return 12; // +12% ce mois
    });

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

        // Simulation d'un appel API
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Utiliser les données de démo pour le reste, mais remplacer trainers par données réelles
        stats.value = {
          ...DEMO_DATA,
          trainers: {
            total: trainersTotal,
            active: trainersActive,
          },
        };
      } catch (err: any) {
        console.warn("Erreur lors du chargement des données:", err);
        error.value = err.message || "Erreur lors du chargement des données";
        // Fallback sur les données de démonstration
        stats.value = DEMO_DATA;
      } finally {
        isLoading.value = false;
      }
    }

    // Fonction pour formater les nombres
    const formatNumber = (num: number) => {
      return new Intl.NumberFormat("fr-FR").format(num);
    };

    // Fonction pour calculer le pourcentage de cours désactivés
    const disabledCoursesPercentage = computed(() => {
      if (!stats.value || stats.value.modules.total === 0) return 0;
      return Math.round(
        (stats.value.modules.disabled / stats.value.modules.total) * 100,
      );
    });

    return {
      // State
      stats,
      isLoading,
      error,

      // Computed - Statistiques principales
      trainersTotal,
      coursesPublished,
      coursesDisabled,
      contentsThisMonth,
      reportsPending,

      // Computed - Indicateurs stratégiques
      mostActiveLanguage,
      mostActiveLevel,
      mostProductiveTrainer,
      publicationsLast7Days,

      // Computed - Données graphiques
      publicationsLast30Days,
      contentsByLanguage,

      // Computed - Variations
      contentsVariation,
      reportsVariation,
      disabledCoursesPercentage,

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
