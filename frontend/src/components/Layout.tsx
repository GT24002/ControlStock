import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'

// Menú según rol del usuario
const menuByRole: Record<string, { path: string; label: string }[]> = {
  admin: [
    { path: '/', label: 'Dashboard' },
    { path: '/products', label: 'Productos' },
    { path: '/categories', label: 'Categorías' },
    { path: '/suppliers', label: 'Proveedores' },
    { path: '/warehouses', label: 'Almacenes' },
    { path: '/inventory', label: 'Inventario' },
    { path: '/movements', label: 'Movimientos' },
    { path: '/lots', label: 'Lotes' },
    { path: '/purchase-orders', label: 'Órdenes de Compra' },
    { path: '/users', label: 'Usuarios' },
    { path: '/roles', label: 'Roles' },
  ],
  warehouse: [
    { path: '/', label: 'Dashboard' },
    { path: '/inventory', label: 'Inventario' },
    { path: '/movements', label: 'Movimientos' },
    { path: '/lots', label: 'Lotes' },
  ],
  supervisor: [
    { path: '/', label: 'Dashboard' },
    { path: '/inventory', label: 'Inventario' },
    { path: '/movements', label: 'Movimientos' },
    { path: '/purchase-orders', label: 'Órdenes de Compra' },
  ],
  auditor: [
    { path: '/', label: 'Dashboard' },
    { path: '/inventory', label: 'Inventario' },
    { path: '/movements', label: 'Movimientos' },
  ],
  basic: [
    { path: '/', label: 'Dashboard' },
    { path: '/inventory', label: 'Inventario' },
  ],
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Modo oscuro — persiste en localStorage
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Obtiene el menú según el rol del usuario actual
  const menu = menuByRole[user?.role ?? 'basic'] ?? menuByRole.basic

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <span className="text-lg font-bold text-blue-600 tracking-tight">ControlStock</span>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menu.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Info usuario + logout */}
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 truncate">{user?.username}</p>
          <p className="text-xs text-blue-500 capitalize mb-3">{user?.role}</p>
          <button
            onClick={handleLogout}
            className="w-full text-sm py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-14 flex items-center justify-between px-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm text-gray-400">
            Bienvenido, <span className="font-medium text-gray-700 dark:text-gray-200">{user?.username}</span>
          </span>

          {/* Botón modo oscuro/claro */}
          <button
            onClick={() => setDark(d => !d)}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            title={dark ? 'Modo claro' : 'Modo oscuro'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Página activa */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
