/**
 * Types et interfaces pour les requêtes/réponses API
 */

/* ===== RÉPONSES API ===== */
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

/* ===== LANGUES ===== */
export interface Language {
  id: string; // Obligatoire (toujours fourni par le backend)
  name: string;
  code: string;
  description?: string;
  nativeLanguage?: string; // Nom de la langue en sa propre langue
  iconUrl?: string; // au lieu de flag
  isActive: boolean;
  levels?: Level[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLanguagePayload {
  name: string;
  code: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
}

export interface UpdateLanguagePayload extends Partial<CreateLanguagePayload> {
  isActive?: boolean;
}

/* ===== NIVEAUX ===== */
export interface Level {
  id: string; // Obligatoire (fourni par le backend)
  languageId: string; // obligatoire
  code: string; // obligatoire
  name: string; // obligatoire
  description?: string; // optionnel
  index: number; // correspond à backend "index"
  isActive: boolean; // obligatoire
  stats?: {
    coursesCount: number;
    exercisesCount: number;
    stepsCount: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLevelPayload {
  languageId: string; // obligatoire pour lier le level à une langue
  code: string; // obligatoire
  name: string; // obligatoire
  description?: string; // optionnel
  index?: number;
}

export interface UpdateLevelPayload extends Partial<CreateLevelPayload> {
  isActive?: boolean;
}
