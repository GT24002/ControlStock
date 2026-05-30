// Modal de confirmación personalizado — reemplaza el confirm() nativo del navegador
interface ConfirmModalProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">

        {/* Icono de advertencia */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-xl">!</span>
          </div>
          <p className="text-gray-800 dark:text-white font-medium">{message}</p>
          <p className="text-gray-400 text-sm mt-1">Esta acción no se puede deshacer.</p>
        </div>

        {/* Botones */}
        <div className="flex border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancelar
          </button>
          <div className="w-px bg-gray-100 dark:bg-gray-800" />
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-sm text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}