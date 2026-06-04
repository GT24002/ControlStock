import { useState, useEffect } from 'react'
import { purchaseOrderApi, supplierApi } from '../api/endpoints'
import type { PurchaseOrder, Supplier } from '../types'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../hooks/useAuth'

export default function PurchaseOrdersPage() {

  // Obtener usuario autenticado
  const { user } = useAuth()

  // Estados principales
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  // Control del modal
  const [showModal, setShowModal] = useState(false)

  // Orden que se está editando
  const [editing, setEditing] = useState<PurchaseOrder | null>(null)

  // Datos del modal de confirmación
  const [confirmData, setConfirmData] = useState<{
    message: string
    onConfirm: () => void
  } | null>(null)

  // Estado del formulario
  const [form, setForm] = useState({
    supplierId: '',
    status: 'pending' as PurchaseOrder['status'],
    totalAmount: ''
  })

  // Cargar órdenes y proveedores al iniciar
  useEffect(() => {
    Promise.all([purchaseOrderApi.getAll(), supplierApi.getAll()])
      .then(([o, s]) => {
        setOrders(o)
        setSuppliers(s)
      })
      .finally(() => setLoading(false))
  }, [])

  // Obtener nuevamente las órdenes
  const fetchOrders = async () => {
    const data = await purchaseOrderApi.getAll()
    setOrders(data)
  }

  // Preparar formulario para nueva orden
  const handleNew = () => {
    setEditing(null)
    setForm({
      supplierId: '',
      status: 'pending',
      totalAmount: ''
    })
    setShowModal(true)
  }

  // Cargar datos para editar una orden
  const handleEdit = (o: PurchaseOrder) => {
    setEditing(o)

    setForm({
      supplierId: String(o.supplierId),
      status: o.status,
      totalAmount: String(o.totalAmount)
    })

    setShowModal(true)
  }

  // Eliminar una orden previa confirmación del usuario
  const handleDelete = (o: PurchaseOrder) => {
    setConfirmData({
      message: '¿Eliminar esta orden?',
      onConfirm: async () => {
        await purchaseOrderApi.delete(o.poId)

        // Cerrar confirmación y actualizar tabla
        setConfirmData(null)
        fetchOrders()
      }
    })
  }

  // Crear o actualizar orden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      supplierId: Number(form.supplierId),
      status: form.status as PurchaseOrder['status'],
      totalAmount: Number(form.totalAmount),
      appUserId: user?.userId,
    }

    // Actualizar orden existente
    if (editing) {
      await purchaseOrderApi.update(editing.poId, payload)
    } else {
      // Crear nueva orden
      await purchaseOrderApi.create(payload)
    }

    // Cerrar modal y actualizar tabla
    setShowModal(false)
    fetchOrders()
  }

  // Badge visual según estado de la orden
  const statusBadge = (status: string) => {

    // Estilos para cada estado
    const styles: Record<string, string> = {
      pending: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600',
      approved: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600',
      received: 'bg-green-50 dark:bg-green-900/30 text-green-600',
      cancelled: 'bg-red-50 dark:bg-red-900/30 text-red-500',
    }

    // Etiquetas visibles
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      approved: 'Aprobada',
      received: 'Recibida',
      cancelled: 'Cancelada'
    }

    return (
      <span className={`px-2 py-0.5 text-xs rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  // Columnas de la tabla
  const columns = [
    { header: 'ID', accessor: 'poId' as keyof PurchaseOrder },

    { header: 'Proveedor', accessor: 'supplierName' as keyof PurchaseOrder },

    {
      header: 'Fecha',
      accessor: (o: PurchaseOrder) =>
        o.orderDate ? o.orderDate.substring(0, 10) : ''
    },

    { header: 'Total', accessor: 'totalAmount' as keyof PurchaseOrder },
  ]

  return (
    <div>

      {/* Encabezado de la página */}
      <PageHeader
        title="Órdenes de Compra"
        action={{
          label: '+ Nueva orden',
          onClick: handleNew
        }}
      />

      {/* Mostrar carga o tabla */}
      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={orders}

          // Acciones de cada fila
          actions={(o) => (
            <div className="flex items-center gap-2">

              {/* Estado de la orden */}
              {statusBadge(o.status)}

              {/* Botón editar */}
              <button
                onClick={() => handleEdit(o)}
                className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition"
              >
                Editar
              </button>

              {/* Botón eliminar */}
              <button
                onClick={() => handleDelete(o)}
                className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-100 transition"
              >
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {/* Modal para crear o editar órdenes */}
      {showModal && (
        <Modal
          title={editing ? 'Editar orden' : 'Nueva orden'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Selección de proveedor */}
            <FormField
              label="Proveedor"
              value={form.supplierId}
              onChange={v => setForm({ ...form, supplierId: v })}
              options={suppliers.map(s => ({
                value: s.supplierId,
                label: s.name
              }))}
              required
            />

            {/* Estado de la orden */}
            <FormField
              label="Estado"
              value={form.status}
              onChange={v =>
                setForm({
                  ...form,
                  status: v as PurchaseOrder['status']
                })
              }
              options={[
                { value: 'pending', label: 'Pendiente' },
                { value: 'approved', label: 'Aprobada' },
                { value: 'received', label: 'Recibida' },
                { value: 'cancelled', label: 'Cancelada' },
              ]}
              required
            />

            {/* Monto total */}
            <FormField
              label="Monto total"
              type="number"
              value={form.totalAmount}
              onChange={v => setForm({ ...form, totalAmount: v })}
              required
            />

            {/* Botones del formulario */}
            <div className="flex justify-end gap-3 pt-2">

              {/* Botón cancelar */}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                Cancelar
              </button>

              {/* Botón guardar */}
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

      {/* Modal de confirmación para eliminar */}
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
