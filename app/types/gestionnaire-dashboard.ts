/**
 * Types pour le Dashboard Gestionnaire
 * Gère les statistiques et indicateurs pour la supervision de la plateforme
 */

export interface GestionnaireDashboardData {
  // Statistiques principales
  trainers: {
    total: number;
    active: number;
  };
  courses: {
    published: number;
    disabled: number;
    total: number;
  };
  contents: {
    createdThisMonth: number;
    total: number;
  };
  reports: {
    pending: number;
    resolved: number;
  };
  
  // Indicateurs stratégiques
  strategic: {
    mostActiveLanguage: string | null;
    mostActiveLevel: string | null;
    mostProductiveTrainer: string | null;
    publicationsLast7Days: number;
  };
  
  // Données pour graphiques
  charts: {
    publicationsLast30Days: DailyPublication[];
    contentsByLanguage: LanguageContent[];
  };
}

export interface DailyPublication {
  date: string;
  count: number;
}

export interface LanguageContent {
  languageId: string;
  languageName: string;
  courseCount: number;
}

export interface StatTotalResponse {
  success: boolean;
  data: {
    total: number;
  } | number;
}

// Paramètres pour les requêtes
export interface DashboardStatsParams {
  startDate?: string;
  endDate?: string;
}

