

/* =====================================================
   RÉPONSES API GÉNÉRIQUES
===================================================== */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    path: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/* =====================================================
   LANGUES (TYPES API – BACKEND)
===================================================== */

export interface Language {
  id: string;                // fourni par le backend
  name: string;
  code: string;
  description?: string;
  nativeLanguage?: string;
  iconUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLanguagePayload {
  code: string;
  name: string;
  description?: string;
  iconUrl?: string | null;
  isActive?: boolean;
}

export interface UpdateLanguagePayload
  extends Partial<CreateLanguagePayload> {}

/* =====================================================
   NIVEAUX (TYPES API – BACKEND)
===================================================== */

export interface Level {
  id: string;                // fourni par le backend
  languageId: string;        // lien vers la langue
  code: string;
  name: string;
  description?: string;
  index: number;             // ordre du niveau
  isActive: boolean;
  stats?: {
    coursesCount: number;
    exercisesCount: number;
    stepsCount: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLevelPayload {
  languageId: string;        // obligatoire
  code: string;
  name: string;
  description?: string;
  index: number;             // obligatoire pour l’ordre
  isActive?: boolean;
}

export interface UpdateLevelPayload
  extends Partial<CreateLevelPayload> {}

/* =====================================================
   TYPES FRONTEND (STORE / UI)
===================================================== */

export interface LanguageWithLevels extends Language {
  levels: Level[];           // niveaux liés à la langue
  levelsLoaded: boolean;     // pour éviter les refetch inutiles
}
