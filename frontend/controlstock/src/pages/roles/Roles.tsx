import { ShieldCheck, Plus, Pencil } from "lucide-react";
import { roleData } from "../../utils/roleData";

const Roles = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#2f2e2e] mb-6">Roles</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
        <code>{JSON.stringify(roleData, null, 2)}</code>
      </pre>
      </div>
    </div>
  );
};

export default Roles;