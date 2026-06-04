import { useState, useEffect } from 'react'
import { userApi } from '../api/endpoints'
import type { AppUser } from '../types'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import ConfirmModal from '../components/ConfirmModal'

export default function UsersPage() {
  // Estado del componente
  const [users, setUsers] = useState<AppUser[]>([])              // Lista de usuarios
  const [loading, setLoading] = useState(true)                   // Indicador de carga
  const [showModal, setShowModal] = useState(false)              // Visibilidad del modal
  const [editing, setEditing] = useState<AppUser | null>(null)  // Usuario en edición (null = nuevo)
  const [confirmData, setConfirmData] = useState<{
      message: string
      onConfirm: () => void
    } | null>(null)
  const [form, setForm] = useState({ username: '', name: '', lastname: '', email: '', password: '' }) // Datos del formulario

  // Obtiene todos los usuarios del backend
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userApi.getAll()
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  // Se ejecuta al montar el componente — carga inicial de datos
  useEffect(() => { fetchUsers() }, [])

  // Abre el modal para crear un nuevo usuario
  const handleNew = () => {
    setEditing(null)
    setForm({ username: '', name: '', lastname: '', email: '', password: '' })
    setShowModal(true)
  }

  // Abre el modal con los datos del usuario a editar
  const handleEdit = (u: AppUser) => {
    setEditing(u)
    setForm({ username: u.username, name: u.name, lastname: u.lastname, email: u.email, password: '' })
    setShowModal(true)
  }

  // Elimina un usuario previa confirmación del usuario
  const handleDelete = (u: AppUser) => {
    setConfirmData({
      message: `¿Eliminar usuario "${u.name}"?`,
      onConfirm: async () => {
        await userApi.delete(u.userId)
        setConfirmData(null)
        fetchUsers()
      }
    })
  }

  // Guarda un usuario nuevo o actualiza uno existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      // Al editar solo se actualizan nombre, apellido y email — no el username ni la contraseña
      await userApi.update(editing.userId, { name: form.name, lastname: form.lastname, email: form.email })
    } else {
      // Al crear se envía todos los datos incluyendo la contraseña
      await userApi.create({ username: form.username, name: form.name, lastname: form.lastname, email: form.email }, form.password)
    }
    setShowModal(false)
    fetchUsers()
  }

  // Definición de columnas de la tabla
  const columns = [
    { header: 'ID', accessor: 'userId' as keyof AppUser },
    { header: 'Usuario', accessor: 'username' as keyof AppUser },
    { header: 'Nombre', accessor: 'name' as keyof AppUser },
    { header: 'Apellido', accessor: 'lastname' as keyof AppUser },
    { header: 'Email', accessor: 'email' as keyof AppUser },
  ]

  return (
    <div>
      {/* Encabezado con título y botón de nuevo usuario */}
      <PageHeader title="Usuarios" action={{ label: '+ Nuevo usuario', onClick: handleNew }} />

      {/* Tabla de usuarios o indicador de carga */}
      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={users}
          actions={(u) => (
            <div className="flex gap-2">
              {/* Botón editar */}
              <button
                onClick={() => handleEdit(u)}
                className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition"
              >
                Editar
              </button>
              {/* Botón eliminar */}
              <button
                onClick={() => handleDelete(u)}
                className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-100 transition"
              >
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {/* Modal para crear o editar usuario */}
      {showModal && (
        <Modal
          title={editing ? 'Editar usuario' : 'Nuevo usuario'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo username — solo visible al crear */}
            {!editing && (
              <FormField
                label="Usuario"
                value={form.username}
                onChange={v => setForm({ ...form, username: v })}
                required
              />
            )}

            {/* Nombre y apellido en dos columnas */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nombre" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
              <FormField label="Apellido" value={form.lastname} onChange={v => setForm({ ...form, lastname: v })} required />
            </div>

            {/* Campo email */}
            <FormField label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required />

            {/* Campo contraseña — solo visible al crear */}
            {!editing && (
              <FormField
                label="Contraseña"
                type="password"
                value={form.password}
                onChange={v => setForm({ ...form, password: v })}
                required
              />
            )}

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