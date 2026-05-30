// Encabezado reutilizable de cada página con título y botón de acción opcional
interface PageHeaderProps {
  title: string
  action?: { label: string; onClick: () => void }
}

export default function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h1>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}