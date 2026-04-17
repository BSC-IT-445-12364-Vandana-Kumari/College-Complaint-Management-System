import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Bell,
  User,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  PlusSquare,
  Settings,
  HelpCircle
} from "lucide-react";

// Menu items are generated inside the component based on user role

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  // Dynamic menu items based on user role
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ...(!isAdmin ? [{ icon: PlusSquare, label: "New Complaint", path: "/complaints/new" }] : []),
    { icon: FileText, label: isAdmin ? "Manage Complaints" : "My Complaints", path: "/complaints" },
    { icon: Bell, label: isAdmin ? "Manage Notices" : "Notices", path: "/notices" },
    { icon: MessageSquare, label: "AI Assistant", path: "/assistant" },
    { icon: User, label: "My Profile", path: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.div
      animate={{ width: isCollapsed ? 70 : 250 }}
      className="h-screen bg-white border-r border-slate-200 flex flex-col relative z-[100] transition-all duration-300 font-sans tracking-normal uppercase-none"
    >
      {/* Header Logo Hub */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-100 shrink-0">
        <img src={logo} alt="CIMAGE" className="w-8 flex-shrink-0 h-auto filter drop-shadow-sm" />
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-[17px] font-black tracking-tighter leading-none text-blue-900 uppercase">
              <span className="text-red-600">C</span>IMAGE GROUP
            </span>
          </div>
        )}
      </div>

      {/* Menu Links */}
      <nav className="flex-1 px-3 mt-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          // Exact match for 'My Complaints' to prevent it from highlighting when 'New Complaint' (/complaints/new) is active
          const isActive = item.path === '/complaints'
            ? location.pathname === item.path
            : location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <Link key={index} to={item.path} className="block">
              <div
                className={`flex items-center gap-3 px-4 py-2.5 rounded-[7px] transition-all duration-200 group relative ${isActive
                    ? "bg-blue-50 text-[#1E40AF] font-bold"
                    : "text-slate-600 hover:text-[#1E40AF] hover:bg-slate-50"
                  }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-[#1E40AF]" : "text-slate-400 group-hover:text-[#1E40AF]"}`} />
                {!isCollapsed && (
                  <span className="text-[13px] tracking-normal font-medium">{item.label}</span>
                )}
                {isActive && (
                  <div className="absolute right-0 w-1 h-5 bg-[#1E40AF] rounded-l-full" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer Area */}
      <div className="p-4 border-t border-slate-100 flex flex-col gap-2 mt-auto">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-[7px] transition-all w-full group">
          <LogOut className="w-[18px] h-[18px]" />
          {!isCollapsed && <span className="text-[13px] font-medium">Log Out</span>}
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute bottom-20 -right-3.5 w-7 h-7 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-[#1E40AF] shadow-md z-[200] transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.div>
  );
}
