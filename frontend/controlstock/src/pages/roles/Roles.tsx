import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRoles } from "../../utils/roleCrud";

const Roles = () => {
  const navigate = useNavigate();
  const roles = getRoles();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#2f2e2e]">Roles</h1>
        <button
          onClick={() => navigate("/roles/agregar")}
          className="flex items-center gap-2 px-4 py-2 bg-[#7b5bf2] text-white rounded-lg hover:bg-[#6a4de0] transition-colors"
        >
          <Plus size={18} />
          Agregar Rol
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 font-semibold text-gray-600">ID</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Nombre del Rol</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Descripción</th>
              <th className="text-center px-6 py-3 font-semibold text-gray-600 w-48">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                  No hay roles registrados
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-800">{role.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{role.roleName}</td>
                  <td className="px-6 py-4 text-gray-600">{role.description}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/roles/editar/${role.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/roles/eliminar/${role.id}`)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roles;