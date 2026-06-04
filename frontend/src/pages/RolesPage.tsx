import { useState, useEffect } from 'react'
import { roleApi } from '../api/endpoints'
import type { Role } from '../types'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import ConfirmModal from '../components/ConfirmModal'

export default function RolesPage() {
  // Estado del componente
  const [roles, setRoles] = useState<Role[]>([])              // Lista de roles
  const [loading, setLoading] = useState(true)                // Indicador de carga
  const [showModal, setShowModal] = useState(false)           // Visibilidad del modal
  const [editing, setEditing] = useState<Role | null>(null)  // Rol en edición (null = nuevo)
  const [confirmData, setConfirmData] = useState<{
      message: string
      onConfirm: () => void
    } | null>(null)
  const [form, setForm] = useState({ roleName: '', description: '' }) // Datos del formulario

  // Obtiene todos los roles del backend
  const fetchRoles = async () => {
    try {
      setLoading(true)
      const data = await roleApi.getAll()
      setRoles(data)
    } finally {
      setLoading(false)
    }
  }

  // Se ejecuta al montar el componente — carga inicial de datos
  useEffect(() => { fetchRoles() }, [])

  // Abre el modal para crear un nuevo rol
  const handleNew = () => {
    setEditing(null)
    setForm({ roleName: '', description: '' })
    setShowModal(true)
  }

  // Abre el modal con los datos del rol a editar
  const handleEdit = (r: Role) => {
    setEditing(r)
    setForm({ roleName: r.roleName, description: r.description })
    setShowModal(true)
  }

  // Elimina un rol previa confirmación del usuario
  const handleDelete = (r: Role) => {
    setConfirmData({
      message: `¿Eliminar rol "${r.roleName}"?`,
      onConfirm: async () => {
        await roleApi.delete(r.roleId)
        setConfirmData(null)
        fetchRoles()
      }
    })
  }

  // Guarda un rol nuevo o actualiza uno existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      // Actualiza el rol existente
      await roleApi.update(editing.roleId, form)
    } else {
      // Crea un nuevo rol
      await roleApi.create(form)
    }
    setShowModal(false)
    fetchRoles()
  }

  // Definición de columnas de la tabla
  const columns = [
    { header: 'ID', accessor: 'roleId' as keyof Role },
    { header: 'Nombre', accessor: 'roleName' as keyof Role },
    { header: 'Descripción', accessor: 'description' as keyof Role },
  ]

  return (
    <div>
      {/* Encabezado con título y botón de nuevo rol */}
      <PageHeader title="Roles" action={{ label: '+ Nuevo rol', onClick: handleNew }} />

      {/* Tabla de roles o indicador de carga */}
      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={roles}
          actions={(r) => (
            <div className="flex gap-2">
              {/* Botón editar */}
              <button
                onClick={() => handleEdit(r)}
                className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition"
              >
                Editar
              </button>
              {/* Botón eliminar */}
              <button
                onClick={() => handleDelete(r)}
                className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-100 transition"
              >
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {/* Modal para crear o editar rol */}
      {showModal && (
        <Modal
          title={editing ? 'Editar rol' : 'Nuevo rol'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo nombre del rol */}
            <FormField
              label="Nombre del rol"
              value={form.roleName}
              onChange={v => setForm({ ...form, roleName: v })}
              required
            />
            {/* Campo descripción */}
            <FormField
              label="Descripción"
              value={form.description}
              onChange={v => setForm({ ...form, description: v })}
            />
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