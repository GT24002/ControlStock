import { useState, useEffect } from 'react'
import { movementApi, productApi, warehouseApi } from '../api/endpoints'
import type { Movement, Product, Warehouse } from '../types'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import { useAuth } from '../hooks/useAuth'

export default function MovementsPage() {
  // Obtener usuario autenticado
  const { user } = useAuth()

  // Estados principales
  const [movements, setMovements] = useState<Movement[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)

  // Control del modal
  const [showModal, setShowModal] = useState(false)

  // Estado del formulario
  const [form, setForm] = useState({
    productId: '',
    warehouseId: '',
    type: '',
    quantity: '',
    unitCost: '',
    reference: ''
  })

  // Cargar movimientos, productos y almacenes al iniciar
  useEffect(() => {
    Promise.all([movementApi.getAll(), productApi.getAll(), warehouseApi.getAll()])
      .then(([m, p, w]) => {
        setMovements(m)
        setProducts(p)
        setWarehouses(w)
      })
      .finally(() => setLoading(false))
  }, [])

  // Obtener nuevamente la lista de movimientos
  const fetchMovements = async () => {
    const data = await movementApi.getAll()
    setMovements(data)
  }

  // Registrar nuevo movimiento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await movementApi.create({
      productId: Number(form.productId),
      warehouseId: Number(form.warehouseId),
      type: form.type as Movement['type'],
      quantity: Number(form.quantity),
      unitCost: Number(form.unitCost),
      reference: form.reference,
      appUserId: user?.userId,
    })

    // Cerrar modal y actualizar tabla
    setShowModal(false)
    fetchMovements()
  }

  // Columnas de la tabla
  const columns = [
    { header: 'Producto', accessor: 'productDescription' as keyof Movement },
    { header: 'Almacén', accessor: 'warehouseName' as keyof Movement },
    { header: 'Tipo', accessor: 'type' as keyof Movement },
    { header: 'Cantidad', accessor: 'quantity' as keyof Movement },
    { header: 'Costo', accessor: 'unitCost' as keyof Movement },
    { header: 'Referencia', accessor: 'reference' as keyof Movement },
    { header: 'Usuario', accessor: 'username' as keyof Movement },
  ]

  return (
    <div>
      {/* Encabezado de la página */}
      <PageHeader
        title="Movimientos"
        action={{ label: '+ Registrar movimiento', onClick: () => setShowModal(true) }}
      />

      {/* Mostrar carga o tabla */}
      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <Table columns={columns} data={movements} />
      )}

      {/* Modal para registrar movimientos */}
      {showModal && (
        <Modal title="Registrar movimiento" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Selección de producto */}
            <FormField
              label="Producto"
              value={form.productId}
              onChange={v => setForm({ ...form, productId: v })}
              options={products.map(p => ({
                value: p.productId,
                label: `${p.sku} - ${p.description}`
              }))}
              required
            />

            {/* Selección de almacén */}
            <FormField
              label="Almacén"
              value={form.warehouseId}
              onChange={v => setForm({ ...form, warehouseId: v })}
              options={warehouses.map(w => ({
                value: w.warehouseId,
                label: w.name
              }))}
              required
            />

            {/* Tipo de movimiento */}
            <FormField
              label="Tipo"
              value={form.type}
              onChange={v => setForm({ ...form, type: v })}
              options={[
                { value: 'entry', label: 'Entrada' },
                { value: 'exit', label: 'Salida' },
                { value: 'transfer', label: 'Transferencia' },
              ]}
              required
            />

            {/* Cantidad y costo */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Cantidad"
                type="number"
                value={form.quantity}
                onChange={v => setForm({ ...form, quantity: v })}
                required
              />

              <FormField
                label="Costo unitario"
                type="number"
                value={form.unitCost}
                onChange={v => setForm({ ...form, unitCost: v })}
              />
            </div>

            {/* Referencia del movimiento */}
            <FormField
              label="Referencia"
              value={form.reference}
              onChange={v => setForm({ ...form, reference: v })}
            />

            {/* Botones del formulario */}
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
                Registrar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}