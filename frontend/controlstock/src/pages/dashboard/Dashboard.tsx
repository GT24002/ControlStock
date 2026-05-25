import { useEffect, useState } from "react";
import { Package, AlertTriangle, FolderTree } from "lucide-react";
import { roleService } from "../../core/api/services/role-service";

const cards = [
  {
    label: "Total Products",
    value: "0",
    icon: Package,
    iconBg: "bg-[#7b5bf2]/10",
    iconColor: "text-[#7b5bf2]",
    valueColor: "text-[#2f2e2e]",
  },
  {
    label: "Low Stock",
    value: "0",
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    valueColor: "text-amber-600",
  },
  {
    label: "Categories",
    value: "0",
    icon: FolderTree,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-500",
    valueColor: "text-emerald-600",
  },
];

const Dashboard = () => {
  const [roles, setRoles] = useState<unknown[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    roleService
      .getAll()
      .then((res) => setRoles(res.data))
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido al obtener roles");
        }
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#2f2e2e] mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                  <Icon size={22} className={card.iconColor} />
                </div>
                <h2 className="text-xs font-semibold text-[#808085] uppercase tracking-wider">
                  {card.label}
                </h2>
              </div>
              <p className={`text-3xl font-bold ${card.valueColor}`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Respuesta de la API mostrada como JSON */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[#2f2e2e] mb-3">
          Respuesta de GET /api/roles
        </h2>
        {error ? (
          <pre className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 overflow-auto max-h-64">
            {error}
          </pre>
        ) : roles === null ? (
          <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-500">
            Cargando...
          </pre>
        ) : (
          <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 overflow-auto max-h-64">
            {JSON.stringify(roles, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Dashboard;