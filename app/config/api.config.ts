/**
 * Configuration des endpoints API du backend
 * Adaptez l'URL de base en fonction de votre environnement
 */

export const API_CONFIG = {
  // URL de base du backend
  BASE_URL : process.env.NUXT_PUBLIC_API_URL || 'http://213.32.120.11:4000',



  // Endpoints pour les langues
  LANGUAGES: {
    GET_ALL: "/v1/languages",
    GET_BY_ID: (id: string) => `/v1/languages/${id}`,
    CREATE: "/v1/languages",
    UPDATE: (id: string) => `/v1/languages/${id}`,
    DELETE: (id: string) => `/v1/languages/${id}`,
  },


  // Endpoints pour les niveaux
  LEVELS: {
    GET_BY_LANGUAGE: (languageId: string) => `/v1/languages/${languageId}/levels`,
    GET_BY_ID: (languageId: string, levelId: string) =>
      `/v1/languages/${languageId}/levels/${levelId}`,
    CREATE: (languageId: string) => `/v1/languages/${languageId}/levels`,
    UPDATE: (languageId: string, levelId: string) =>
      `/v1/languages/${languageId}/levels/${levelId}`,
    DELETE: (languageId: string, levelId: string) =>
      `/v1/languages/${languageId}/levels/${levelId}`,
  },
};

export const API_TIMEOUTS = {
  SHORT: 5000, // 5s pour les requêtes rapides
  MEDIUM: 10000, // 10s par défaut
  LONG: 30000, // 30s pour les uploads/téléchargements
};