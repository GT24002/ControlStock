import { useState, useEffect } from 'react'
import { productApi, categoryApi, supplierApi } from '../api/endpoints'
import type { Product, Category, Supplier } from '../types'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import ConfirmModal from '../components/ConfirmModal'

export default function ProductsPage() {
  // Estado del componente
  const [products, setProducts] = useState<Product[]>([])      // Lista de productos
  const [categories, setCategories] = useState<Category[]>([]) // Categorías para el select
  const [suppliers, setSuppliers] = useState<Supplier[]>([])   // Proveedores para el select
  const [loading, setLoading] = useState(true)                 // Indicador de carga
  const [showModal, setShowModal] = useState(false)            // Visibilidad del modal
  const [editing, setEditing] = useState<Product | null>(null) // Producto en edición (null = nuevo)
  const [confirmData, setConfirmData] = useState<{
    message: string
    onConfirm: () => void
  } | null>(null)
  const [form, setForm] = useState({
    sku: '', description: '', categoryId: '', supplierId: '',
    baseUnit: '', unitCost: '', salePrice: '', barcode: ''
  })

  // Obtiene productos, categorías y proveedores en paralelo al montar el componente
  const fetchAll = async () => {
    try {
      setLoading(true)
      const [p, c, s] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
        supplierApi.getAll()
      ])
      setProducts(p)
      setCategories(c)
      setSuppliers(s)
    } finally {
      setLoading(false)
    }
  }

  // Se ejecuta al montar el componente — carga inicial de datos
  useEffect(() => { fetchAll() }, [])

  // Recarga solo la lista de productos
  const fetchProducts = async () => {
    const data = await productApi.getAll()
    setProducts(data)
  }

  // Abre el modal para crear un nuevo producto
  const handleNew = () => {
    setEditing(null)
    setForm({ sku: '', description: '', categoryId: '', supplierId: '', baseUnit: '', unitCost: '', salePrice: '', barcode: '' })
    setShowModal(true)
  }

  // Abre el modal con los datos del producto a editar
  const handleEdit = (p: Product) => {
    setEditing(p)
    setForm({
      sku: p.sku,
      description: p.description,
      categoryId: String(p.categoryId),
      supplierId: String(p.supplierId),
      baseUnit: p.baseUnit,
      unitCost: String(p.unitCost),
      salePrice: String(p.salePrice),
      barcode: p.barcode ?? ''
    })
    setShowModal(true)
  }

  // Elimina un producto previa confirmación del usuario
  const handleDelete = (p: Product) => {
    setConfirmData({
      message: `¿Eliminar "${p.description}"?`,
      onConfirm: async () => {
       await productApi.delete(p.productId)
       setConfirmData(null)
       fetchProducts()
      }
    })
  }

  // Guarda un producto nuevo o actualiza uno existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Convierte los campos numéricos antes de enviar al backend
    const payload = {
      ...form,
      categoryId: Number(form.categoryId),
      supplierId: Number(form.supplierId),
      unitCost: Number(form.unitCost),
      salePrice: Number(form.salePrice),
    }
    if (editing) {
      await productApi.update(editing.productId, payload)
    } else {
      await productApi.create(payload)
    }
    setShowModal(false)
    fetchProducts()
  }

  // Definición de columnas de la tabla
  const columns = [
    { header: 'SKU', accessor: 'sku' as keyof Product },
    { header: 'Descripción', accessor: 'description' as keyof Product },
    { header: 'Categoría', accessor: 'categoryName' as keyof Product },
    { header: 'Proveedor', accessor: 'supplierName' as keyof Product },
    { header: 'Unidad', accessor: 'baseUnit' as keyof Product },
    { header: 'Costo', accessor: 'unitCost' as keyof Product },
    { header: 'Precio', accessor: 'salePrice' as keyof Product },
  ]

  return (
    <div>
      {/* Encabezado con título y botón de nuevo producto */}
      <PageHeader
        title="Productos"
        action={{ label: '+ Nuevo producto', onClick: handleNew }}
      />

      {/* Tabla de productos o indicador de carga */}
      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={products}
          actions={(p) => (
            <div className="flex gap-2">
              {/* Botón editar */}
              <button
                onClick={() => handleEdit(p)}
                className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition"
              >
                Editar
              </button>
              {/* Botón eliminar */}
              <button
                onClick={() => handleDelete(p)}
                className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-100 transition"
              >
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {/* Modal para crear o editar producto */}
      {showModal && (
        <Modal
          title={editing ? 'Editar producto' : 'Nuevo producto'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SKU y código de barras en dos columnas */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="SKU" value={form.sku} onChange={v => setForm({ ...form, sku: v })} required />
              <FormField label="Código de barras" value={form.barcode} onChange={v => setForm({ ...form, barcode: v })} />
            </div>

            {/* Descripción del producto */}
            <FormField label="Descripción" value={form.description} onChange={v => setForm({ ...form, description: v })} required />

            {/* Categoría y proveedor en dos columnas */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Categoría"
                value={form.categoryId}
                onChange={v => setForm({ ...form, categoryId: v })}
                options={categories.map(c => ({ value: c.categoryId, label: c.name }))}
                required
              />
              <FormField
                label="Proveedor"
                value={form.supplierId}
                onChange={v => setForm({ ...form, supplierId: v })}
                options={suppliers.map(s => ({ value: s.supplierId, label: s.name }))}
                required
              />
            </div>

            {/* Unidad base, costo y precio en tres columnas */}
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Unidad base" value={form.baseUnit} onChange={v => setForm({ ...form, baseUnit: v })} required />
              <FormField label="Costo" type="number" value={form.unitCost} onChange={v => setForm({ ...form, unitCost: v })} required />
              <FormField label="Precio venta" type="number" value={form.salePrice} onChange={v => setForm({ ...form, salePrice: v })} required />
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
