import { Menu, X, Bell } from "lucide-react";

interface NavbarHeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const NavbarHeader = ({ onToggleSidebar, sidebarOpen }: NavbarHeaderProps) => {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 md:px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl text-[#7b5bf2] hover:bg-[#7b5bf2]/10 transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <h2 className="text-lg font-semibold text-[#2f2e2e]">
          ControlStock
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-xl text-[#808085] hover:bg-[#7b5bf2]/10 hover:text-[#7b5bf2] transition-colors">
          <Bell size={20} />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#7b5bf2] flex items-center justify-center text-white text-sm font-semibold">
          A
        </div>
      </div>
    </header>
  );
};

export default NavbarHeader;