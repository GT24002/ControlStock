import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProductsPage from './pages/ProductsPage'
import CategoriesPage from './pages/CategoriesPage'
import SuppliersPage from './pages/SuppliersPage'
import WarehousesPage from './pages/WarehousesPage'
import InventoryPage from './pages/InventoryPage'
import MovementsPage from './pages/MovementsPage'
import LotsPage from './pages/LotsPage'
import PurchaseOrdersPage from './pages/PurchaseOrdersPage'
import UsersPage from './pages/UsersPage'
import RolesPage from './pages/RolesPage'

// Protege rutas — redirige al login si no hay sesión activa
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

// Rutas solo para admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas privadas dentro del layout principal */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="warehouses" element={<WarehousesPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="movements" element={<MovementsPage />} />
          <Route path="lots" element={<LotsPage />} />
          <Route path="purchase-orders" element={<PurchaseOrdersPage />} />

          {/* Rutas exclusivas para admin */}
          <Route path="users" element={<AdminRoute><UsersPage /></AdminRoute>} />
          <Route path="roles" element={<AdminRoute><RolesPage /></AdminRoute>} />
        </Route>

        {/* Cualquier ruta desconocida redirige al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
