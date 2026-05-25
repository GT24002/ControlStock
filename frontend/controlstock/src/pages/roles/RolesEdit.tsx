import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { getRoleById, updateRole } from "../../utils/roleCrud";

const RolesEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [errorDesc, setErrorDesc] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const roleId = Number(id);
    if (isNaN(roleId)) {
      setNotFound(true);
      return;
    }

    const role = getRoleById(roleId);
    if (!role) {
      setNotFound(true);
      return;
    }

    setRoleName(role.roleName);
    setDescription(role.description);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim() && !description.trim()) {
      setError("El nombre del rol es obligatorio");
      setErrorDesc("La descripción del rol es obligatoria");
      return;
    }

    if (!roleName.trim()) {
      setError("El nombre del rol es obligatorio");
      return;
    }

    if (!description.trim()) {
      setErrorDesc("La descripción del rol es obligatoria");
      return;
    }

    const roleId = Number(id);
    const result = updateRole(roleId, {
      roleName: roleName.trim(),
      description: description.trim(),
    });

    if (!result) {
      setNotFound(true);
      return;
    }

    navigate("/roles");
  };

  if (notFound) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/roles")}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold text-[#2f2e2e]">Editar Rol</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-lg">
          <p className="text-gray-500 text-center py-8">Rol no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/roles")}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-bold text-[#2f2e2e]">Editar Rol</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nombre del Rol <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => {
                setRoleName(e.target.value);
                setError("");
              }}
              placeholder="Ej: editor"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7b5bf2]/50 focus:border-[#7b5bf2] transition-colors ${
                error ? "border-red-400" : "border-gray-300"
              }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrorDesc("");
              }}
              placeholder="Breve descripción del rol"
              rows={3}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7b5bf2]/50 focus:border-[#7b5bf2] transition-colors ${
                errorDesc ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errorDesc && <p className="text-red-500 text-xs mt-1">{errorDesc}</p>}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#7b5bf2] text-white rounded-lg hover:bg-[#6a4de0] transition-colors text-sm font-medium"
            >
              <Save size={18} />
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => navigate("/roles")}
              className="px-5 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolesEdit;