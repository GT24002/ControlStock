import { useState, useEffect } from 'react'
import { supplierApi } from '../api/endpoints'
import type { Supplier } from '../types'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import ConfirmModal from '../components/ConfirmModal'

export default function SuppliersPage() {
  // Estado del componente
  const [suppliers, setSuppliers] = useState<Supplier[]>([])    // Lista de proveedores
  const [loading, setLoading] = useState(true)                  // Indicador de carga
  const [showModal, setShowModal] = useState(false)             // Visibilidad del modal
  const [editing, setEditing] = useState<Supplier | null>(null) // Proveedor en edición (null = nuevo)
  const [confirmData, setConfirmData] = useState<{
      message: string
      onConfirm: () => void
    } | null>(null)
  const [form, setForm] = useState({ name: '', contact: '', email: '', phone: '', address: '' }) // Datos del formulario

  // Obtiene todos los proveedores del backend
  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const data = await supplierApi.getAll()
      setSuppliers(data)
    } finally {
      setLoading(false)
    }
  }

  // Se ejecuta al montar el componente — carga inicial de datos
  useEffect(() => { fetchSuppliers() }, [])

  // Abre el modal para crear un nuevo proveedor
  const handleNew = () => {
    setEditing(null)
    setForm({ name: '', contact: '', email: '', phone: '', address: '' })
    setShowModal(true)
  }

  // Abre el modal con los datos del proveedor a editar
  const handleEdit = (s: Supplier) => {
    setEditing(s)
    setForm({ name: s.name, contact: s.contact, email: s.email, phone: s.phone, address: s.address })
    setShowModal(true)
  }

  // Elimina un rol previa confirmación del usuario
  const handleDelete = (s: Supplier) => {
    setConfirmData({
      message: `¿Eliminar proveedor "${s.name}"?`,
      onConfirm: async () => {
        await supplierApi.delete(s.supplierId)
        setConfirmData(null)
        fetchSuppliers()
      }
    })
  }

  // Guarda un proveedor nuevo o actualiza uno existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      // Actualiza el proveedor existente
      await supplierApi.update(editing.supplierId, form)
    } else {
      // Crea un nuevo proveedor
      await supplierApi.create(form)
    }
    setShowModal(false)
    fetchSuppliers()
  }

  // Definición de columnas de la tabla
  const columns = [
    { header: 'ID', accessor: 'supplierId' as keyof Supplier },
    { header: 'Nombre', accessor: 'name' as keyof Supplier },
    { header: 'Contacto', accessor: 'contact' as keyof Supplier },
    { header: 'Email', accessor: 'email' as keyof Supplier },
    { header: 'Teléfono', accessor: 'phone' as keyof Supplier },
  ]

  return (
    <div>
      {/* Encabezado con título y botón de nuevo proveedor */}
      <PageHeader
        title="Proveedores"
        action={{ label: '+ Nuevo proveedor', onClick: handleNew }}
      />

      {/* Tabla de proveedores o indicador de carga */}
      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={suppliers}
          actions={(s) => (
            <div className="flex gap-2">
              {/* Botón editar */}
              <button
                onClick={() => handleEdit(s)}
                className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition"
              >
                Editar
              </button>
              {/* Botón eliminar */}
              <button
                onClick={() => handleDelete(s)}
                className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-100 transition"
              >
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {/* Modal para crear o editar proveedor */}
      {showModal && (
        <Modal
          title={editing ? 'Editar proveedor' : 'Nuevo proveedor'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos del formulario */}
            <FormField label="Nombre" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormField label="Contacto" value={form.contact} onChange={v => setForm({ ...form, contact: v })} required />
            <FormField label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required />
            <FormField label="Teléfono" value={form.phone} onChange={v => setForm({ ...form, phone: v })} required />
            <FormField label="Dirección" value={form.address} onChange={v => setForm({ ...form, address: v })} />

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