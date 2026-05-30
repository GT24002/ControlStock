// Campo de formulario reutilizable con label y input/select
interface FormFieldProps {
  label: string
  type?: string
  value: string | number
  onChange: (value: string) => void
  required?: boolean
  options?: { value: string | number; label: string }[]
}

export default function FormField({
  label, type = 'text', value, onChange, required, options
}: FormFieldProps) {
  const base = "w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {options ? (
        // Select cuando se pasan opciones
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={base}
          required={required}
        >
          <option value="">Seleccionar...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        // Input normal
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={base}
          required={required}
        />
      )}
    </div>
  )
}
