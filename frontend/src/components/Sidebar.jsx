import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, AlertCircle, Bell, Settings, LogOut, MessageSquare } from "lucide-react";
import logo from "../assets/logo.png";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const { unreadNotices, resolvedComplaints } = useNotifications();
  const location = useLocation();

  if (!user) return null;

  const getLinks = () => {
    const baseLinks = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Complaints", href: "/complaints", icon: AlertCircle, badge: resolvedComplaints },
      { name: "Notices", href: "/notices", icon: Bell, badge: unreadNotices },
      { name: "AI Assistant", href: "/assistant", icon: MessageSquare },
      { name: "My Profile", href: "/profile", icon: Settings },
    ];
    return baseLinks;
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-full sticky top-0 md:relative">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <img src={logo} alt="Cimage Logo" className="h-8 w-auto" />
        <div className="flex flex-col">
          <span className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-tight">
            Cimage Group
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
            {user.role} Panel
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {getLinks().map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.name}
              to={link.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-[13px] transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={`${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                {link.name}
              </div>
              
              {link.badge > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-[13px] group"
        >
          <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
}
