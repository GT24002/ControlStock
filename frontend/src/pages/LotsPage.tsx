import { useState, useEffect } from 'react'
import { lotApi, productApi } from '../api/endpoints'
import type { Lot, Product } from '../types'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import ConfirmModal from '../components/ConfirmModal'

export default function LotsPage() {
  // Estado del componente
  const [lots, setLots] = useState<Lot[]>([])              // Lista de lotes
  const [products, setProducts] = useState<Product[]>([])  // Productos para el select
  const [loading, setLoading] = useState(true)             // Indicador de carga
  const [showModal, setShowModal] = useState(false)        // Visibilidad del modal
  const [editing, setEditing] = useState<Lot | null>(null) // Lote en edición (null = nuevo)

  // Datos del modal de confirmación de eliminación
  const [confirmData, setConfirmData] = useState<{
    message: string
    onConfirm: () => void
  } | null>(null)

  const [form, setForm] = useState({
    productId: '',
    lotCode: '',
    expirationDate: '',
    quantity: ''
  })

  // Carga lotes y productos en paralelo al montar el componente
  useEffect(() => {
    Promise.all([lotApi.getAll(), productApi.getAll()])
      .then(([l, p]) => {
        setLots(l)
        setProducts(p)
      })
      .finally(() => setLoading(false))
  }, [])

  // Recarga solo la lista de lotes
  const fetchLots = async () => {
    const data = await lotApi.getAll()
    setLots(data)
  }

  // Abre el modal para crear un nuevo lote
  const handleNew = () => {
    setEditing(null)
    setForm({ productId: '', lotCode: '', expirationDate: '', quantity: '' })
    setShowModal(true)
  }

  // Abre el modal con los datos del lote a editar
  const handleEdit = (l: Lot) => {
    setEditing(l)
    setForm({
      productId: String(l.productId),
      lotCode: l.lotCode,
      expirationDate: l.expirationDate,
      quantity: String(l.quantity)
    })
    setShowModal(true)
  }

  // Muestra el modal de confirmación antes de eliminar
  const handleDelete = (l: Lot) => {
    setConfirmData({
      message: `¿Eliminar lote "${l.lotCode}"?`,
      onConfirm: async () => {
        await lotApi.delete(l.lotId)
        setConfirmData(null)
        fetchLots()
      }
    })
  }

  // Guarda un lote nuevo o actualiza uno existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      productId: Number(form.productId),
      quantity: Number(form.quantity)
    }
    if (editing) {
      await lotApi.update(editing.lotId, payload)
    } else {
      await lotApi.create(payload)
    }
    setShowModal(false)
    fetchLots()
  }

  // Badge visual según el estado de vencimiento del lote
  const expirationBadge = (lot: Lot) => {
    const today = new Date()
    const exp = new Date(lot.expirationDate)
    const diff = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)

    if (diff < 0)
      return <span className="px-2 py-0.5 text-xs bg-red-50 dark:bg-red-900/30 text-red-500 rounded-full">Vencido</span>
    if (diff <= 30)
      return <span className="px-2 py-0.5 text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-full">Por vencer</span>
    return <span className="px-2 py-0.5 text-xs bg-green-50 dark:bg-green-900/30 text-green-500 rounded-full">Vigente</span>
  }

  // Definición de columnas de la tabla
  const columns = [
    { header: 'Código', accessor: 'lotCode' as keyof Lot },
    { header: 'Producto', accessor: 'productDescription' as keyof Lot },
    { header: 'Vencimiento', accessor: 'expirationDate' as keyof Lot },
    { header: 'Cantidad', accessor: 'quantity' as keyof Lot },
  ]

  return (
    <div>
      {/* Encabezado con título y botón de nuevo lote */}
      <PageHeader title="Lotes" action={{ label: '+ Nuevo lote', onClick: handleNew }} />

      {/* Tabla de lotes o indicador de carga */}
      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={lots}
          actions={(l) => (
            <div className="flex items-center gap-2">
              {/* Badge de vencimiento */}
              {expirationBadge(l)}
              {/* Botón editar */}
              <button
                onClick={() => handleEdit(l)}
                className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition"
              >
                Editar
              </button>
              {/* Botón eliminar */}
              <button
                onClick={() => handleDelete(l)}
                className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-100 transition"
              >
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {/* Modal para crear o editar lote */}
      {showModal && (
        <Modal title={editing ? 'Editar lote' : 'Nuevo lote'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Producto"
              value={form.productId}
              onChange={v => setForm({ ...form, productId: v })}
              options={products.map(p => ({ value: p.productId, label: `${p.sku} - ${p.description}` }))}
              required
            />
            <FormField label="Código de lote" value={form.lotCode} onChange={v => setForm({ ...form, lotCode: v })} required />
            <FormField label="Fecha de vencimiento" type="date" value={form.expirationDate} onChange={v => setForm({ ...form, expirationDate: v })} required />
            <FormField label="Cantidad" type="number" value={form.quantity} onChange={v => setForm({ ...form, quantity: v })} required />

            {/* Botones de acción del formulario */}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition">
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
