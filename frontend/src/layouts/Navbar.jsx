import { Search, Bell, Settings, LogOut, ChevronDown, User, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <nav className="h-16 px-8 flex items-center justify-between z-[50] bg-white border-b border-slate-100 shadow-sm sticky top-0 font-sans tracking-normal uppercase-none">
      
      {/* 🏛️ 1. Welcome Greeting Unit (Left) */}
      <div className="flex items-center gap-6">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#1E40AF] uppercase tracking-[0.3em] leading-none mb-1 opacity-70">Institutional Node</span>
            <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none uppercase-none">
               Welcome, <span className="text-[#1E40AF]">{user.name.split(' ')[0]}</span>
            </h2>
         </div>
      </div>

      {/* ⚙️ 2. Identity Hub & Profile Control (Right) */}
      <div className="flex items-center gap-5">
        
        {/* Support Icons */}
        <div className="hidden sm:flex items-center gap-1 border-r border-slate-100 pr-5">
          <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-[#1E40AF] hover:bg-blue-50 rounded-[7px] transition-all relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white" />
          </button>
        </div>

        {/* Profile Dropdown Hub */}
        <div className="relative">
           <button 
             onClick={() => setShowDropdown(!showDropdown)}
             className="flex items-center gap-3 px-3 py-1.5 rounded-[7px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group shadow-sm bg-slate-50/50"
           >
              <div className="w-9 h-9 rounded-full bg-[#1E40AF] flex items-center justify-center text-white text-[13px] font-black shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform">
                 {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col text-left">
                 <span className="text-[13px] font-black text-slate-800 leading-none group-active:text-blue-700">{user.name}</span>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1.5 opacity-60">HUB {user.role?.toUpperCase()}</span>
              </div>
              <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
           </button>

           {/* Dropdown Menu Overlay */}
           <AnimatePresence>
              {showDropdown && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-[7px] shadow-2xl py-2 z-[200]"
                 >
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Verified Identity</p>
                       <p className="text-[12px] font-bold text-slate-800 truncate">{user.email}</p>
                    </div>
                    
                    <Link to="/profile" onClick={() => setShowDropdown(false)}>
                       <button className="w-full px-4 py-2.5 text-left text-[12px] font-bold text-slate-600 hover:bg-blue-50 hover:text-[#1E40AF] transition-all flex items-center gap-3">
                          <User size={16} /> Hub Profile
                       </button>
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-[12px] font-bold text-red-500 hover:bg-red-50 transition-all flex items-center gap-3 border-t border-slate-50 mt-1"
                    >
                       <LogOut size={16} /> Logout Hub
                    </button>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>

      {/* Global Background Click to Close Dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-[190]" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
}
