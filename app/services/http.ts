/**
 * Service HTTP client avec gestion d'erreurs, intercepteurs et retry logic
 */

import { API_CONFIG, API_TIMEOUTS } from "../config/api.config";
import type { ApiResponse } from "../types/api";

class HttpClient {
  private baseUrl: string;
  private headers: HeadersInit;
  private timeout: number;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
    };
    this.timeout = API_TIMEOUTS.MEDIUM;
  }

  /**
   * Ajoute un token d'authentification aux headers
   */
  setAuthToken(token: string) {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Retire le token d'authentification
   */
  clearAuthToken() {
    const headers = { ...this.headers };
    delete (headers as any).Authorization;
    this.headers = headers;
  }

  /**
   * Récupère les headers actuels
   */
  getHeaders(): HeadersInit {
    return { ...this.headers };
  }

  /**
   * Effectue une requête GET
   */
  async get<T>(
    endpoint: string,
    options?: { timeout?: number; params?: Record<string, string | number> },
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    return this.request<T>(url, {
      method: "GET",
      timeout: options?.timeout,
    });
  }

  /**
   * Effectue une requête POST
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: { timeout?: number },
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      timeout: options?.timeout,
    });
  }

  /**
   * Effectue une requête PUT
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: { timeout?: number },
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      timeout: options?.timeout,
    });
  }

  /**
   * Effectue une requête PATCH
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: { timeout?: number },
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      timeout: options?.timeout,
    });
  }

  /**
   * Effectue une requête DELETE
   */
  async delete<T>(
    endpoint: string,
    options?: { timeout?: number },
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: "DELETE",
      timeout: options?.timeout,
    });
  }

  /**
   * Effectue une requête avec retry automatique
   */
  async getWithRetry<T>(
    endpoint: string,
    options?: {
      timeout?: number;
      params?: Record<string, string | number>;
      retries?: number;
      retryDelay?: number;
    },
  ): Promise<ApiResponse<T>> {
    const maxRetries = options?.retries ?? 3;
    const retryDelay = options?.retryDelay ?? 1000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.get<T>(endpoint, {
          timeout: options?.timeout,
          params: options?.params,
        });
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // exponential backoff
        }
      }
    }

    throw lastError;
  }

  /**
   * Requête générique avec gestion complète
   */
  private async request<T>(
    url: string,
    options: {
      method: string;
      body?: string;
      timeout?: number;
    },
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeout = options.timeout ?? this.timeout;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: options.method,
        headers: this.getHeaders(),
        body: options.body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Traiter les réponses non-200
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error: any) {
  clearTimeout(timeoutId);

  // Si l'erreur vient déjà du backend (401, 403, etc)
  if (error?.statusCode) {
    throw error;
  }

  throw this.handleError(error);
}
  }

  /**
   * Gère les réponses d'erreur du serveur
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: any = {};

    try {
      errorData = await response.json();
    } catch {
      errorData = { error: { message: response.statusText } };
    }

    const error = {
      code: errorData.error?.code || `HTTP_${response.status}`,
      message: errorData.error?.message || response.statusText,
      details: errorData.error?.details,
    };

    throw {
      statusCode: response.status,
      ...error,
    };
  }

  /**
   * Gère les erreurs de requête
   */
  private handleError(error: unknown) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          statusCode: 0,
          code: "REQUEST_TIMEOUT",
          message: "La requête a dépassé le délai imparti",
        };
      }
      return {
        statusCode: 0,
        code: "NETWORK_ERROR",
        message: error.message,
      };
    }
    return {
      statusCode: 0,
      code: "UNKNOWN_ERROR",
      message: "Une erreur inconnue s'est produite",
    };
  }

  /**
   * Construit l'URL complète avec paramètres optionnels
   */
  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number>,
  ): string {
    const url = new URL(endpoint, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Utilitaire pour retarder l'exécution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Instance singleton
export const httpClient = new HttpClient();
