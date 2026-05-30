// ===== Autenticación =====
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  userId: number;
  role: string;
}

export interface AuthUser {
  token: string;
  username: string;
  userId: number;
  role: string;
}

// ===== Catálogo =====
export interface Category {
  categoryId: number;
  name: string;
  description: string;
}

export interface Supplier {
  supplierId: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
}

// ===== Producto =====
export interface Product {
  productId: number;
  sku: string;
  description: string;
  categoryId: number;
  categoryName: string;
  supplierId: number;
  supplierName: string;
  baseUnit: string;
  unitCost: number;
  salePrice: number;
  barcode: string;
  imageUrl: string;
}

export interface Presentation {
  presentationId: number;
  productId: number;
  productName: string;
  name: string;
  conversionFactor: number;
  baseUnit: string;
  barcode: string;
}

// ===== Almacén e Inventario =====
export interface Warehouse {
  warehouseId: number;
  name: string;
  location: string;
  phone1: string;
  phone2: string;
}

export interface Inventory {
  inventoryId: number;
  productId: number;
  productSku: string;
  productDescription: string;
  warehouseId: number;
  warehouseName: string;
  currentQuantity: number;
  minimum: number;
  maximum: number;
}

// ===== Movimientos =====
export interface Movement {
  movementId: number;
  productId: number;
  productDescription: string;
  warehouseId: number;
  warehouseName: string;
  type: 'entry' | 'exit' | 'transfer';
  quantity: number;
  unitCost: number;
  date: string;
  appUserId: number;
  username: string;
  reference: string;
}

// ===== Lotes =====
export interface Lot {
  lotId: number;
  productId: number;
  productDescription: string;
  lotCode: string;
  expirationDate: string;
  quantity: number;
}

// ===== Órdenes de Compra =====
export interface PurchaseOrder {
  poId: number;
  supplierId: number;
  supplierName: string;
  appUserId: number;
  username: string;
  orderDate: string;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  totalAmount: number;
}

// ===== Seguridad =====
export interface AppUser {
  userId: number;
  username: string;
  name: string;
  lastname: string;
  email: string;
  status: boolean;
}

export interface Role {
  roleId: number;
  roleName: string;
  description: string;
}

export interface Permission {
  permissionId: number;
  permissionName: string;
  description: string;
}