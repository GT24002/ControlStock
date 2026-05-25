import type { AxiosRequestConfig, AxiosResponse } from "axios";
import apiClient from "./axios-instance";

/**
 * Capa de servicio HTTP genérica.
 * Proporciona metodos tipados para las operaciones CRUD basicas
 * usando la instancia centralizada de Axios.
 */
export const httpService = {
  /**
   * GET /{url}
   */
  get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return apiClient.get<T>(url, config);
  },

  /**
   * POST /{url}
   */
  post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return apiClient.post<T>(url, data, config);
  },

  /**
   * PUT /{url}
   */
  put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return apiClient.put<T>(url, data, config);
  },

  /**
   * PATCH /{url}
   */
  patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return apiClient.patch<T>(url, data, config);
  },

  /**
   * DELETE /{url}
   */
  delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return apiClient.delete<T>(url, config);
  },
};

export default httpService;