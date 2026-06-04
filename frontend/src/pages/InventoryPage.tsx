import { useState, useEffect } from 'react'
import { inventoryApi, warehouseApi } from '../api/endpoints'
import type { Inventory, Warehouse } from '../types'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([inventoryApi.getAll(), warehouseApi.getAll()])
      .then(([inv, wh]) => { setInventory(inv); setWarehouses(wh) })
      .finally(() => setLoading(false))
  }, [])

  // Filtra inventario por almacén seleccionado
  const filtered = selectedWarehouse
    ? inventory.filter(i => String(i.warehouseId) === selectedWarehouse)
    : inventory

  // Indicador visual de stock según mínimo y máximo
  const stockStatus = (inv: Inventory) => {
    if (inv.currentQuantity <= inv.minimum)
      return <span className="px-2 py-0.5 text-xs bg-red-50 dark:bg-red-900/30 text-red-500 rounded-full">Crítico</span>
    if (inv.currentQuantity >= inv.maximum)
      return <span className="px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full">Máximo</span>
    return <span className="px-2 py-0.5 text-xs bg-green-50 dark:bg-green-900/30 text-green-500 rounded-full">Normal</span>
  }

  const columns = [
    { header: 'SKU', accessor: 'productSku' as keyof Inventory },
    { header: 'Producto', accessor: 'productDescription' as keyof Inventory },
    { header: 'Almacén', accessor: 'warehouseName' as keyof Inventory },
    { header: 'Cantidad', accessor: 'currentQuantity' as keyof Inventory },
    { header: 'Mínimo', accessor: 'minimum' as keyof Inventory },
    { header: 'Máximo', accessor: 'maximum' as keyof Inventory },
  ]

  return (
    <div>
      <PageHeader title="Inventario" />

      {/* Filtro por almacén */}
      <div className="mb-4">
        <select
          value={selectedWarehouse}
          onChange={e => setSelectedWarehouse(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los almacenes</option>
          {warehouses.map(w => (
            <option key={w.warehouseId} value={w.warehouseId}>{w.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={filtered}
          actions={stockStatus}
        />
      )}
    </div>
  )
}
