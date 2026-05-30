import { useState, useEffect } from 'react'
import { categoryApi } from '../api/endpoints'
import type { Category } from '../types'

import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'
import Modal from '../components/Modal'

export default function CategoriesPage() {
  // Estados
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
  })

  // Estado para confirmación de eliminación
  const [confirmData, setConfirmData] = useState<{
    message: string
    onConfirm: () => void
  } | null>(null)

  // Obtener categorías
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryApi.getAll()
      setCategories(data)
    } finally {
      setLoading(false)
    }
  }

  // Carga inicial
  useEffect(() => {
    fetchCategories()
  }, [])

  // Nueva categoría
  const handleNew = () => {
    setEditing(null)
    setForm({
      name: '',
      description: '',
    })
    setShowModal(true)
  }

  // Editar categoría
  const handleEdit = (cat: Category) => {
    setEditing(cat)

    setForm({
      name: cat.name,
      description: cat.description,
    })

    setShowModal(true)
  }

  // Eliminar categoría
  const handleDelete = (cat: Category) => {
    setConfirmData({
      message: `¿Eliminar "${cat.name}"?`,
      onConfirm: async () => {
        await categoryApi.delete(cat.categoryId)

        setConfirmData(null)
        fetchCategories()
      },
    })
  }

  // Guardar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editing) {
      await categoryApi.update(editing.categoryId, form)
    } else {
      await categoryApi.create(form)
    }

    setShowModal(false)
    fetchCategories()
  }

  // Columnas de tabla
  const columns = [
    { header: 'ID', accessor: 'categoryId' as keyof Category },
    { header: 'Nombre', accessor: 'name' as keyof Category },
    { header: 'Descripción', accessor: 'description' as keyof Category },
  ]

  return (
    <div>
      <PageHeader
        title="Categorías"
        action={{
          label: '+ Nueva categoría',
          onClick: handleNew,
        }}
      />

      {loading ? (
        <p className="text-gray-400 text-sm">
          Cargando...
        </p>
      ) : (
        <Table
          columns={columns}
          data={categories}
          actions={(cat) => (
            <div className="flex gap-2">
              {/* Editar */}
              <button
                onClick={() => handleEdit(cat)}
                className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition"
              >
                Editar
              </button>

              {/* Eliminar */}
              <button
                onClick={() => handleDelete(cat)}
                className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-100 transition"
              >
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {/* Modal crear/editar */}
      {showModal && (
        <Modal
          title={
            editing
              ? 'Editar categoría'
              : 'Nueva categoría'
          }
          onClose={() => setShowModal(false)}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <FormField
              label="Nombre"
              value={form.name}
              onChange={(v) =>
                setForm({ ...form, name: v })
              }
              required
            />

            <FormField
              label="Descripción"
              value={form.description}
              onChange={(v) =>
                setForm({
                  ...form,
                  description: v,
                })
              }
            />

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
                {editing
                  ? 'Guardar cambios'
                  : 'Crear'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirmación eliminar */}
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