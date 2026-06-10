import { useState, useEffect } from 'react'
import { inventoryApi, warehouseApi, productApi } from '../api/endpoints'
import type { Inventory, Warehouse, Product } from '../types'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import ConfirmModal from '../components/ConfirmModal'

export default function InventoryPage() {
  // Estado del componente
  const [inventory, setInventory] = useState<Inventory[]>([])    // Lista de inventario
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])  // Almacenes para el filtro y select
  const [products, setProducts] = useState<Product[]>([])        // Productos para el select
  const [selectedWarehouse, setSelectedWarehouse] = useState('')  // Almacén seleccionado en el filtro
  const [loading, setLoading] = useState(true)                   // Indicador de carga
  const [showModal, setShowModal] = useState(false)              // Visibilidad del modal
  const [editing, setEditing] = useState<Inventory | null>(null) // Registro en edición (null = nuevo)

  // Datos del modal de confirmación de eliminación
  const [confirmData, setConfirmData] = useState<{
    message: string
    onConfirm: () => void
  } | null>(null)

  const [form, setForm] = useState({
    productId: '',
    warehouseId: '',
    currentQuantity: '',
    minimum: '',
    maximum: ''
  })

  // Carga inventario, almacenes y productos en paralelo al montar el componente
  useEffect(() => {
    Promise.all([
      inventoryApi.getAll(),
      warehouseApi.getAll(),
      productApi.getAll()
    ]).then(([inv, wh, pr]) => {
      setInventory(inv)
      setWarehouses(wh)
      setProducts(pr)
    }).finally(() => setLoading(false))
  }, [])

  // Recarga solo la lista de inventario
  const fetchInventory = async () => {
    const data = await inventoryApi.getAll()
    setInventory(data)
  }

  // Abre el modal para crear un nuevo registro
  const handleNew = () => {
    setEditing(null)
    setForm({ productId: '', warehouseId: '', currentQuantity: '', minimum: '', maximum: '' })
    setShowModal(true)
  }

  // Abre el modal con los datos del registro a editar
  const handleEdit = (inv: Inventory) => {
    setEditing(inv)
    setForm({
      productId: String(inv.productId),
      warehouseId: String(inv.warehouseId),
      currentQuantity: String(inv.currentQuantity),
      minimum: String(inv.minimum),
      maximum: String(inv.maximum)
    })
    setShowModal(true)
  }

  // Muestra el modal de confirmación antes de eliminar
  const handleDelete = (inv: Inventory) => {
    setConfirmData({
      message: `¿Eliminar registro de "${inv.productDescription}" en ${inv.warehouseName}?`,
      onConfirm: async () => {
        await inventoryApi.delete(inv.inventoryId)
        setConfirmData(null)
        fetchInventory()
      }
    })
  }

  // Guarda un registro nuevo o actualiza uno existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      productId: Number(form.productId),
      warehouseId: Number(form.warehouseId),
      currentQuantity: Number(form.currentQuantity),
      minimum: Number(form.minimum),
      maximum: Number(form.maximum)
    }
    if (editing) {
      await inventoryApi.update(editing.inventoryId, payload)
    } else {
      await inventoryApi.create(payload)
    }
    setShowModal(false)
    fetchInventory()
  }

  // Filtra inventario por almacén seleccionado
  const filtered = selectedWarehouse
    ? inventory.filter(i => String(i.warehouseId) === selectedWarehouse)
    : inventory

  // Badge visual según nivel de stock
  const stockStatus = (inv: Inventory) => {
    if (inv.currentQuantity <= inv.minimum)
      return <span className="px-2 py-0.5 text-xs bg-red-50 dark:bg-red-900/30 text-red-500 rounded-full">Crítico</span>
    if (inv.currentQuantity >= inv.maximum)
      return <span className="px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full">Máximo</span>
    return <span className="px-2 py-0.5 text-xs bg-green-50 dark:bg-green-900/30 text-green-500 rounded-full">Normal</span>
  }

  // Definición de columnas de la tabla
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
      {/* Encabezado con título y botón de nuevo registro */}
      <PageHeader
        title="Inventario"
        action={{ label: '+ Nuevo registro', onClick: handleNew }}
      />

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

      {/* Tabla de inventario o indicador de carga */}
      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={filtered}
          actions={(inv) => (
            <div className="flex items-center gap-2">
              {/* Badge de estado de stock */}
              {stockStatus(inv)}
              {/* Botón editar */}
              <button
                onClick={() => handleEdit(inv)}
                className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition"
              >
                Editar
              </button>
              {/* Botón eliminar */}
              <button
                onClick={() => handleDelete(inv)}
                className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-100 transition"
              >
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {/* Modal para crear o editar registro de inventario */}
      {showModal && (
        <Modal
          title={editing ? 'Editar registro' : 'Nuevo registro de inventario'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Producto y almacén — solo visibles al crear */}
            {!editing && (
              <>
                <FormField
                  label="Producto"
                  value={form.productId}
                  onChange={v => setForm({ ...form, productId: v })}
                  options={products.map(p => ({ value: p.productId, label: `${p.sku} - ${p.description}` }))}
                  required
                />
                <FormField
                  label="Almacén"
                  value={form.warehouseId}
                  onChange={v => setForm({ ...form, warehouseId: v })}
                  options={warehouses.map(w => ({ value: w.warehouseId, label: w.name }))}
                  required
                />
              </>
            )}

            {/* Cantidad, mínimo y máximo */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                label="Cantidad actual"
                type="number"
                value={form.currentQuantity}
                onChange={v => setForm({ ...form, currentQuantity: v })}
                required
              />
              <FormField
                label="Mínimo"
                type="number"
                value={form.minimum}
                onChange={v => setForm({ ...form, minimum: v })}
                required
              />
              <FormField
                label="Máximo"
                type="number"
                value={form.maximum}
                onChange={v => setForm({ ...form, maximum: v })}
                required
              />
            </div>

            {/* Botones de acción del formulario */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
              >
                {editing ? 'Guardar cambios' : 'Crear'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      {confirmData && (
        <ConfirmModal
          message={confirmData.message}
          onConfirm={confirmData.onConfirm}
          onCancel={() => setConfirmData(null)}
        />
      )}
    </div>
  )
}