// /**
//  * Types pour le Dashboard Gestionnaire
//  * Gère les statistiques et indicateurs pour la supervision de la plateforme
//  */

// export interface GestionnaireDashboardData {
//   // Statistiques principales
//   trainers: {
//     total: number;
//     active: number;
//   };
//   courses: {
//     published: number;
//     disabled: number;
//     total: number;
//   };
//   contents: {
//     createdThisMonth: number;
//     total: number;
//   };
//   reports: {
//     pending: number;
//     resolved: number;
//   };
  
//   // Indicateurs stratégiques
//   strategic: {
//     mostActiveLanguage: string | null;
//     mostActiveLevel: string | null;
//     mostProductiveTrainer: string | null;
//     publicationsLast7Days: number;
//   };
  
//   // Données pour graphiques
//   charts: {
//     publicationsLast30Days: DailyPublication[];
//     contentsByLanguage: LanguageContent[];
//   };
// }

// export interface DailyPublication {
//   date: string;
//   count: number;
// }

// export interface LanguageContent {
//   languageId: string;
//   languageName: string;
//   courseCount: number;
// }

// export interface StatTotalResponse {
//   success: boolean;
//   data: {
//     total: number;
//   } | number;
// }

// // Paramètres pour les requêtes
// export interface DashboardStatsParams {
//   startDate?: string;
//   endDate?: string;
// }


/**
 * Types pour le Dashboard Gestionnaire — adapté aux formateurs et modules
 */

export interface GestionnaireDashboardData {
  // Statistiques principales sur les formateurs
  trainers: {
    total: number;      // total formateurs (teachers)
    active: number;     // formateurs actifs
  };

  languages?: {
  total: number;
  active: number;
  // disabled: number;
};

  // Statistiques sur les modules
  modules: {
    published: number;  // modules publiés
    disabled: number;   // modules désactivés
    total: number;      // total modules
  };

  // Contenus (cours, étapes…) créés ce mois et au total
  contents: {
    createdThisMonth: number;
    total: number;
  };

  // Signalements / rapports
  reports: {
    pending: number;
    resolved: number;
  };

  // Indicateurs stratégiques
  // strategic: {
  //   mostActiveLanguage: string | null;
  //   mostActiveLevel: string | null;
  //   mostProductiveTrainer: string | null;
  //   publicationsLast7Days: number;
  // };

  // Données pour graphiques
  charts: {
    publicationsLast30Days: DailyPublication[];
    contentsByLanguage: LanguageContent[];
    
  };
}

/**
 * Publication quotidienne pour graphiques
 */
export interface DailyPublication {
  date: string;
  count: number;
}

/**
 * Contenus par langue pour graphiques
 */
export interface LanguageContent {
  languageId: string;
  languageName: string;
  courseCount: number;
}

/**
 * Typage minimal pour un formateur
 */
export interface FormateurMinimal {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  modules?: FormateurModule[];
}

/**
 * Typage minimal d’un module
 */
export interface FormateurModule {
  id: string;
  title: string;
  isActive: boolean;   // vrai si le module est actif
  isPublished: boolean; // vrai si le module est publié
  createdAt: string;
}

/**
 * Typage de la réponse API pour les formateurs
 */
export interface FormateursResponse {
  success: boolean;
  data: {
    formateurs: FormateurMinimal[];
  };
}