import { ShieldCheck, Plus, Pencil } from "lucide-react";

const rolesData = [
  { role: "Admin", description: "Full system access", users: 2 },
  { role: "User", description: "Standard user access", users: 5 },
];

const Roles = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#2f2e2e] mb-6">Roles</h1>
    </div>
  );
};

export default Roles;