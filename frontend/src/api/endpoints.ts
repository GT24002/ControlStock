import api from './axios';
import type {
  Category, Supplier, Product, Presentation,
  Warehouse, Inventory, Movement, Lot,
  PurchaseOrder, AppUser, Role, Permission
} from '../types';

// Endpoints de categorías
export const categoryApi = {
  getAll: () => api.get<Category[]>('/api/categories').then(r => r.data),
  create: (data: Partial<Category>) => api.post<Category>('/api/categories', data).then(r => r.data),
  update: (id: number, data: Partial<Category>) => api.put<Category>(`/api/categories/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/categories/${id}`),
};

// Endpoints de proveedores
export const supplierApi = {
  getAll: () => api.get<Supplier[]>('/api/suppliers').then(r => r.data),
  create: (data: Partial<Supplier>) => api.post<Supplier>('/api/suppliers', data).then(r => r.data),
  update: (id: number, data: Partial<Supplier>) => api.put<Supplier>(`/api/suppliers/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/suppliers/${id}`),
};

// Endpoints de productos
export const productApi = {
  getAll: () => api.get<Product[]>('/api/products').then(r => r.data),
  create: (data: Partial<Product>) => api.post<Product>('/api/products', data).then(r => r.data),
  update: (id: number, data: Partial<Product>) => api.put<Product>(`/api/products/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/products/${id}`),
};

// Endpoints de presentaciones
export const presentationApi = {
  getAll: () => api.get<Presentation[]>('/api/presentations').then(r => r.data),
  getByProduct: (productId: number) => api.get<Presentation[]>(`/api/presentations/product/${productId}`).then(r => r.data),
  create: (data: Partial<Presentation>) => api.post<Presentation>('/api/presentations', data).then(r => r.data),
  update: (id: number, data: Partial<Presentation>) => api.put<Presentation>(`/api/presentations/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/presentations/${id}`),
};

// Endpoints de almacenes
export const warehouseApi = {
  getAll: () => api.get<Warehouse[]>('/api/warehouses').then(r => r.data),
  create: (data: Partial<Warehouse>) => api.post<Warehouse>('/api/warehouses', data).then(r => r.data),
  update: (id: number, data: Partial<Warehouse>) => api.put<Warehouse>(`/api/warehouses/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/warehouses/${id}`),
};

// Endpoints de inventario — incluye filtro por almacén
export const inventoryApi = {
  getAll: () => api.get<Inventory[]>('/api/inventory').then(r => r.data),
  getByWarehouse: (id: number) => api.get<Inventory[]>(`/api/inventory/warehouse/${id}`).then(r => r.data),
  create: (data: Partial<Inventory>) => api.post<Inventory>('/api/inventory', data).then(r => r.data),
  update: (id: number, data: Partial<Inventory>) => api.put<Inventory>(`/api/inventory/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/inventory/${id}`),
};

// Endpoints de movimientos — solo lectura y registro, sin edición ni eliminación
export const movementApi = {
  getAll: () => api.get<Movement[]>('/api/movements').then(r => r.data),
  create: (data: Partial<Movement>) => api.post<Movement>('/api/movements', data).then(r => r.data),
};

// Endpoints de lotes
export const lotApi = {
  getAll: () => api.get<Lot[]>('/api/lots').then(r => r.data),
  create: (data: Partial<Lot>) => api.post<Lot>('/api/lots', data).then(r => r.data),
  update: (id: number, data: Partial<Lot>) => api.put<Lot>(`/api/lots/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/lots/${id}`),
};

// Endpoints de órdenes de compra
export const purchaseOrderApi = {
  getAll: () => api.get<PurchaseOrder[]>('/api/purchase-orders').then(r => r.data),
  create: (data: Partial<PurchaseOrder>) => api.post<PurchaseOrder>('/api/purchase-orders', data).then(r => r.data),
  update: (id: number, data: Partial<PurchaseOrder>) => api.put<PurchaseOrder>(`/api/purchase-orders/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/purchase-orders/${id}`),
};

// Endpoints de usuarios — la contraseña se envía como parámetro en la URL al crear
export const userApi = {
  getAll: () => api.get<AppUser[]>('/api/users').then(r => r.data),
  create: (data: Partial<AppUser>, password: string) => api.post<AppUser>(`/api/users?password=${password}`, data).then(r => r.data),
  update: (id: number, data: Partial<AppUser>) => api.put<AppUser>(`/api/users/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/users/${id}`),
};

// Endpoints de roles — usa /roles sin prefijo /api por configuración del backend
export const roleApi = {
  getAll: () => api.get<Role[]>('/roles').then(r => r.data),
  create: (data: Partial<Role>) => api.post<Role>('/roles', data).then(r => r.data),
  update: (id: number, data: Partial<Role>) => api.put<Role>(`/roles/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/roles/${id}`),
};

// Endpoints de permisos
export const permissionApi = {
  getAll: () => api.get<Permission[]>('/api/permissions').then(r => r.data),
  create: (data: Partial<Permission>) => api.post<Permission>('/api/permissions', data).then(r => r.data),
  update: (id: number, data: Partial<Permission>) => api.put<Permission>(`/api/permissions/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/permissions/${id}`),
};
