/**
 * Service pour les appels API des langues
 */

import { httpClient } from "./http";
import { API_CONFIG } from "../config/api.config";
import type {
  Language,
  CreateLanguagePayload,
  UpdateLanguagePayload,
  ApiResponse,
} from "../types/api";

export const languageService = {
  /**
   * Récupère toutes les langues
   */
  async getAll(): Promise<ApiResponse<Language[]>> {
    return httpClient.get<Language[]>(API_CONFIG.LANGUAGES.GET_ALL);
  },

  /**
   * Récupère une langue par son ID
   */
  async getById(id: string): Promise<ApiResponse<Language>> {
    return httpClient.get<Language>(API_CONFIG.LANGUAGES.GET_BY_ID(id));
  },

  /**
   * Crée une nouvelle langue
   */
  async create(payload: CreateLanguagePayload): Promise<ApiResponse<Language>> {
    return httpClient.post<Language>(API_CONFIG.LANGUAGES.CREATE, payload);
  },

  /**
   * Met à jour une langue
   */
  async update(
    id: string,
    payload: UpdateLanguagePayload,
  ): Promise<ApiResponse<Language>> {
    return httpClient.put<Language>(API_CONFIG.LANGUAGES.UPDATE(id), payload);
  },

  /**
   * Supprime une langue
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(API_CONFIG.LANGUAGES.DELETE(id));
  },
};
