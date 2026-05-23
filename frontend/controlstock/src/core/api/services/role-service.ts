import type { Role } from "../../entity";
import { httpService } from "../http-service";

const ENDPOINT = "/roles";

/**
 * Servicio para operaciones CRUD de Roles contra la API REST.
 * Reemplaza la simulación en localStorage de utils/roleCrud.ts
 */
export const roleService = {
  /**
   * Obtiene todos los roles.
   * GET /api/roles
   */
  getAll() {
    return httpService.get<Role[]>(ENDPOINT);
  },

  /**
   * Obtiene un rol por su ID.
   * GET /api/roles/:id
   */
  getById(id: number) {
    return httpService.get<Role>(`${ENDPOINT}/${id}`);
  },

  /**
   * Crea un nuevo rol.
   * POST /api/roles
   */
  create(role: Omit<Role, "id">) {
    return httpService.post<Role>(ENDPOINT, role);
  },

  /**
   * Actualiza un rol existente.
   * PUT /api/roles/:id
   */
  update(id: number, role: Omit<Role, "id">) {
    return httpService.put<Role>(`${ENDPOINT}/${id}`, role);
  },

  /**
   * Elimina un rol.
   * DELETE /api/roles/:id
   */
  delete(id: number) {
    return httpService.delete<void>(`${ENDPOINT}/${id}`);
  },
};