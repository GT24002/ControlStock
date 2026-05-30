interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => string | number | boolean)
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  actions?: (row: T) => React.ReactNode
}

export default function Table<T>({ columns, data, actions }: TableProps<T>) {
  // Garantiza que data siempre sea un array aunque el backend devuelva otra cosa
  const safeData = Array.isArray(data) ? data : []

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                {col.header}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
          {safeData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-8 text-center text-gray-400">
                Sin registros
              </td>
            </tr>
          ) : (
            safeData.map((row, i) => (
              <tr key={i} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                {columns.map((col, j) => (
                  <td key={j} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {typeof col.accessor === 'function'
                      ? String(col.accessor(row))
                      : String(row[col.accessor] ?? '')}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3">{actions(row)}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
