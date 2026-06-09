import { useState, useEffect } from 'react'
import { inventoryApi, movementApi, lotApi, purchaseOrderApi } from '../api/endpoints'
import { useAuth } from '../hooks/useAuth'

interface StatCard {
  label: string
  value: number | string
  color: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carga métricas en paralelo
    Promise.all([
      inventoryApi.getAll(),
      movementApi.getAll(),
      lotApi.getAll(),
      purchaseOrderApi.getAll(),
    ]).then(([inventory, movements, lots, orders]) => {
      const today = new Date()

      // Stock crítico: productos bajo el mínimo
      const critical = inventory.filter(i => i.currentQuantity <= i.minimum).length

      // Lotes vencidos
      const expired = lots.filter(l => new Date(l.expirationDate) < today).length

      // Órdenes pendientes
      const pending = orders.filter(o => o.status === 'pending').length

      setStats([
        { label: 'Total productos en stock', value: inventory.length, color: 'text-blue-600' },
        { label: 'Movimientos registrados', value: movements.length, color: 'text-gray-700 dark:text-gray-200' },
        { label: 'Stock crítico', value: critical, color: 'text-red-500' },
        { label: 'Lotes vencidos', value: expired, color: 'text-amber-500' },
        { label: 'Órdenes pendientes', value: pending, color: 'text-blue-500' },
      ])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Saludo */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Bienvenido, <span className="text-blue-600">{user?.username}</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1 capitalize">Rol: {user?.role}</p>
      </div>

      {/* Tarjetas de métricas */}
      {loading ? (
        <p className="text-gray-400 text-sm">Cargando métricas...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
              <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
