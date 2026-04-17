import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Layers, 
  Activity, 
  Users, 
  User, 
  Bot, 
  AlertOctagon, 
  RefreshCw, 
  MoreHorizontal, 
  Loader2, 
  Search, 
  Zap,
  ShieldCheck,
  AlertTriangle,
  LogOut
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";

const API = "http://localhost:5000";

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const socket = useSocket();
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    urgent: 0
  });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateStats = (data) => {
    const total = data.length;
    const resolved = data.filter(c => c.status === 'Resolved').length;
    const pending = data.filter(c => c.status === 'Pending').length;
    const urgent = data.filter(c => c.priority === 'Urgent' || c.priority === 'High' || c.priority === 'critical').length;
    setStats({ total, resolved, pending, urgent });
  };

  useEffect(() => {
    fetchDashboardData();

    if (socket) {
      socket.on("new_complaint", (newC) => {
        setComplaints((prev) => {
          const updated = [newC, ...prev];
          calculateStats(updated);
          return updated;
        });
      });

      socket.on("complaint_updated", (updatedC) => {
        setComplaints((prev) => {
          const updated = prev.map(c => c._id === updatedC._id ? updatedC : c);
          calculateStats(updated);
          return updated;
        });
      });

      return () => {
        socket.off("new_complaint");
        socket.off("complaint_updated");
      };
    }
  }, [socket]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/complaints`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setComplaints(data);
      calculateStats(data);
    } catch (err) {
      console.error("Dashboard Fetch Failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-40 space-y-4">
       <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
       <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Synchronizing Master Registry...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500 w-full font-sans">
      
      {/* ── HEADER ── */}
      <div className="bg-slate-900 rounded-[10px] py-5 px-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-1.5 ml-1">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            Administrative Portal
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Status: <span className="text-blue-400">ONLINE</span></h1>
        </div>

        <div className="relative z-10 flex items-center gap-3">
           <button onClick={fetchDashboardData} className="h-10 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[7px] text-[13px] font-black tracking-widest uppercase transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
              <RefreshCw className="w-4 h-4" />
              Sync Data
           </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Complaints", val: stats.total, icon: FileText, change: "Real-time", colors: "bg-blue-50 text-blue-600 border-blue-100" },
          { label: "Resolved Cases", val: stats.resolved, icon: CheckCircle2, change: "Fixed", colors: "bg-emerald-50 text-emerald-600 border-emerald-100" },
          { label: "Pending Review", val: stats.pending, icon: Clock, change: "Awaiting", colors: "bg-amber-50 text-amber-600 border-amber-100" },
          { label: "Critical Issues", val: stats.urgent, icon: AlertOctagon, change: "Alert", colors: "bg-red-50 text-red-600 border-red-100" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm"
          >
             <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.colors.split(' ')[0]} ${stat.colors.split(' ')[1]}`}>
                   <stat.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${stat.label === 'Critical Issues' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                   {stat.change}
                </div>
             </div>
             <div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">{stat.val}</h3>
                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── FEED ── */}
        <div className="lg:col-span-2">
           <div className="bg-white p-6 rounded-[10px] border border-slate-200 shadow-sm flex flex-col h-[500px]">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-[16px] font-black text-slate-800 uppercase tracking-[0.1em]">Recent Logged Issues</h3>
                    <p className="text-[12px] text-slate-500 mt-1 font-medium">Verify evidence and assigned status</p>
                 </div>
                 <button onClick={() => navigate('/complaints')} className="text-[11px] font-black text-[#1E40AF] uppercase tracking-widest hover:underline">View All Registry</button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
                 {complaints.length > 0 ? complaints.slice(0, 10).map((c) => (
                   <div 
                     key={c._id} 
                     onClick={() => navigate(`/complaints/${c._id}`)}
                     className="p-5 rounded-[7px] border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition-all cursor-pointer group flex items-start sm:items-center gap-4"
                   >
                     <div className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center border-2 ${c.status === 'Resolved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-500'}`}>
                        {c.status === 'Resolved' ? <CheckCircle2 size={18} /> : <AlertOctagon size={18} />}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mb-1">
                           <h4 className="text-[14px] font-black text-slate-800 truncate group-hover:text-blue-700">{c.title}</h4>
                           <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-[0.15em] ${c.priority === 'Urgent' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{c.priority}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                           <span className="text-blue-600">{c.user?.name}</span>
                           <span>•</span>
                           <span className="text-slate-400">ID: #{c._id.slice(-5).toUpperCase()}</span>
                           {c.proofUrl && <span className="text-emerald-600 flex items-center gap-1"><Layers size={10} /> Has Evidence</span>}
                        </div>
                     </div>
                   </div>
                 )) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-40">
                      <Bot size={40} className="mb-4" />
                      <p className="font-black uppercase tracking-widest text-[13px]">No Active Complaints Found</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="space-y-6 lg:col-span-1">
           <div className="bg-slate-900 p-6 rounded-[10px] shadow-2xl h-full flex flex-col text-white">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                 <h3 className="text-[14px] font-black flex items-center gap-2 uppercase tracking-widest">
                    <Zap className="w-4 h-4 text-amber-500" /> Control Hub
                 </h3>
                 <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded animate-pulse tracking-widest">ACTIVE</span>
              </div>
              
              <div className="space-y-4">
                 {[
                   { label: "Post New Notice", desc: "Broadcast announcement", icon: Calendar, path: "/notices" },
                   { label: "Identity Check", desc: "Manage Student Base", icon: Users, path: "/profile" },
                   { label: "System Logs", desc: "Security Monitoring", icon: Activity, path: "#" },
                 ].map((act, i) => (
                   <button 
                    key={i} onClick={() => act.path !== '#' && navigate(act.path)}
                    className="w-full p-4 rounded-[7px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                           <act.icon size={18} />
                        </div>
                        <div>
                           <div className="text-[13px] font-black tracking-tight">{act.label}</div>
                           <div className="text-[11px] text-slate-500 group-hover:text-slate-400">{act.desc}</div>
                        </div>
                     </div>
                   </button>
                 ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
                 <div className="bg-gradient-to-br from-blue-600/20 to-transparent p-4 rounded-[7px] border border-blue-500/20">
                    <p className="text-[11px] font-black mb-1 text-blue-400 tracking-widest uppercase">Quick Support</p>
                    <p className="text-[12px] text-slate-400 leading-relaxed font-medium">Use the AI Assistant to automatically categorize incoming tickets.</p>
                 </div>

                 <button 
                   onClick={logout}
                   className="w-full h-12 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-[7px] font-bold text-[13px] transition-all flex items-center justify-center gap-2 group"
                 >
                    <LogOut size={16} className="group-hover:rotate-12 transition-transform" /> 
                    Sign Out System
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
