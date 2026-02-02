/**
 * Service pour les appels API des niveaux
 */

import { httpClient } from "./http";
import { API_CONFIG } from "../config/api.config";
import type {
  Level,
  CreateLevelPayload,
  UpdateLevelPayload,
  ApiResponse,
} from "../types/api";

export const levelService = {
  /**
   * Récupère tous les niveaux d'une langue
   */
  async getByLanguage(languageId: string): Promise<ApiResponse<Level[]>> {
    return httpClient.get<Level[]>(
      API_CONFIG.LEVELS.GET_BY_LANGUAGE(languageId),
    );
  },

  /**
   * Récupère un niveau par son ID
   */
  async getById(
    languageId: string,
    levelId: string,
  ): Promise<ApiResponse<Level>> {
    return httpClient.get<Level>(
      API_CONFIG.LEVELS.GET_BY_ID(languageId, levelId),
    );
  },

  /**
   * Crée un nouveau niveau pour une langue
   */
  async create(
    languageId: string,
    payload: CreateLevelPayload,
  ): Promise<ApiResponse<Level>> {
    return httpClient.post<Level>(
      API_CONFIG.LEVELS.CREATE(languageId),
      payload,
    );
  },

  /**
   * Met à jour un niveau
   */
  async update(
    languageId: string,
    levelId: string,
    payload: UpdateLevelPayload,
  ): Promise<ApiResponse<Level>> {
    return httpClient.put<Level>(
      API_CONFIG.LEVELS.UPDATE(languageId, levelId),
      payload,
    );
  },

  /**
   * Supprime un niveau
   */
  async delete(
    languageId: string,
    levelId: string,
  ): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(
      API_CONFIG.LEVELS.DELETE(languageId, levelId),
    );
  },
};
