import type { Role } from "../core/entity";
import { roleData } from "./roleData";

const STORAGE_KEY = "controlstock_roles";

const loadRoles = (): Role[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [...roleData];
};

const saveRoles = (roles: Role[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
};

// inicializacion desde localStorage, sino usamos roleData
const roles: Role[] = loadRoles();

let nextId = Math.max(...roles.map((r) => r.id), 0) + 1;

// simula un GET /roles
export const getRoles = (): Role[] => {
  return [...roles];
};


// simula un POST /roles
export const addRole = (role: Omit<Role, "id">): Role => {
  const newRole: Role = {
    id: nextId++,
    ...role,
  };
  roles.push(newRole);
  saveRoles(roles);
  return newRole;
};


export const getRoleById = (id: number): Role | undefined => {
  return roles.find((r) => r.id === id);
};

export const updateRole = (id: number, updated: Omit<Role, "id">): Role | undefined => {
  const index = roles.findIndex((r) => r.id === id);
  if (index === -1) return undefined;

  roles[index] = { id, ...updated };
  saveRoles(roles);
  return roles[index];
};
