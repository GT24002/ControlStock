import { useState, useEffect } from 'react'
import { warehouseApi } from '../api/endpoints'
import type { Warehouse } from '../types'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import ConfirmModal from '../components/ConfirmModal'

export default function WarehousesPage() {
  // Estado del componente
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])    // Lista de almacenes
  const [loading, setLoading] = useState(true)                     // Indicador de carga
  const [showModal, setShowModal] = useState(false)                // Visibilidad del modal
  const [editing, setEditing] = useState<Warehouse | null>(null)  // Almacén en edición (null = nuevo)
  const [confirmData, setConfirmData] = useState<{
      message: string
      onConfirm: () => void
    } | null>(null)
  const [form, setForm] = useState({ name: '', location: '', phone1: '', phone2: '' }) // Datos del formulario

  // Obtiene todos los almacenes del backend
  const fetchWarehouses = async () => {
    try {
      setLoading(true)
      const data = await warehouseApi.getAll()
      setWarehouses(data)
    } finally {
      setLoading(false)
    }
  }

  // Se ejecuta al montar el componente — carga inicial de datos
  useEffect(() => { fetchWarehouses() }, [])

  // Abre el modal para crear un nuevo almacén
  const handleNew = () => {
    setEditing(null)
    setForm({ name: '', location: '', phone1: '', phone2: '' })
    setShowModal(true)
  }

  // Abre el modal con los datos del almacén a editar
  const handleEdit = (w: Warehouse) => {
    setEditing(w)
    setForm({ name: w.name, location: w.location, phone1: w.phone1, phone2: w.phone2 ?? '' })
    setShowModal(true)
  }

  // Elimina un almacén previa confirmación del usuario
  const handleDelete = (w: Warehouse) => {
    setConfirmData({
      message: `¿Eliminar "${w.name}"?`,
      onConfirm: async () => {
        await warehouseApi.delete(w.warehouseId)
        setConfirmData(null)
        fetchWarehouses()
      }
    })
  }

  // Guarda un almacén nuevo o actualiza uno existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      // Actualiza el almacén existente
      await warehouseApi.update(editing.warehouseId, form)
    } else {
      // Crea un nuevo almacén
      await warehouseApi.create(form)
    }
    setShowModal(false)
    fetchWarehouses()
  }

  // Definición de columnas de la tabla
  const columns = [
    { header: 'ID', accessor: 'warehouseId' as keyof Warehouse },
    { header: 'Nombre', accessor: 'name' as keyof Warehouse },
    { header: 'Ubicación', accessor: 'location' as keyof Warehouse },
    { header: 'Teléfono', accessor: 'phone1' as keyof Warehouse },
  ]

  return (
    <div>
      {/* Encabezado con título y botón de nuevo almacén */}
      <PageHeader
        title="Almacenes"
        action={{ label: '+ Nuevo almacén', onClick: handleNew }}
      />

      {/* Tabla de almacenes o indicador de carga */}
      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={warehouses}
          actions={(w) => (
            <div className="flex gap-2">
              {/* Botón editar */}
              <button
                onClick={() => handleEdit(w)}
                className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition"
              >
                Editar
              </button>
              {/* Botón eliminar */}
              <button
                onClick={() => handleDelete(w)}
                className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-100 transition"
              >
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {/* Modal para crear o editar almacén */}
      {showModal && (
        <Modal
          title={editing ? 'Editar almacén' : 'Nuevo almacén'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos del formulario */}
            <FormField label="Nombre" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormField label="Ubicación" value={form.location} onChange={v => setForm({ ...form, location: v })} />
            <FormField label="Teléfono 1" value={form.phone1} onChange={v => setForm({ ...form, phone1: v })} required />
            {/* Teléfono 2 es opcional */}
            <FormField label="Teléfono 2" value={form.phone2} onChange={v => setForm({ ...form, phone2: v })} />

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