import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  PlusCircle,
  FileText,
  User,
  Zap,
  Bot,
  LogOut,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🛡️ Data Isolation Logic: Only fetch data for THIS specific user
  useEffect(() => {
    const fetchMyHubData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/complaints", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setComplaints(data);
      } catch (err) {
        console.error("Hub Data Fetch Failed", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyHubData();
  }, [user]);

  const stats = [
    { label: "My Hub Registry", val: complaints.length, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Resolved Nodes", val: complaints.filter(c => c.status === 'Resolved').length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Desk", val: complaints.filter(c => c.status === 'Pending').length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  if (loading) return (
     <div className="flex items-center justify-center p-20 animate-pulse">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Synchronizing Master Registry...</p>
     </div>
  );

  return (
    <div className="space-y-4 pb-10 animate-in fade-in duration-700 font-sans w-full">
      
      {/* 📊 1. Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3 }}
            className="bg-white p-6 rounded-[7px] border border-slate-100 shadow-sm flex items-center justify-between transition-all"
          >
             <div>
                <p className="text-slate-500 font-medium text-[13px] uppercase tracking-wide mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-800 leading-none">{stat.val}</p>
             </div>
             <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-full flex items-center justify-center opacity-80`}>
                <stat.icon className="w-7 h-7" />
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
         
         {/* 📋 2. Main Activity Feed (Left - takes up 2 columns) */}
         <div className="lg:col-span-2 bg-white rounded-[7px] border border-slate-100 shadow-sm flex flex-col h-[480px]">
            <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center relative overflow-hidden">
               <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-[7px] flex items-center justify-center">
                     <Activity className="w-4 h-4" />
                  </div>
                  <h3 className="text-[16px] font-black text-slate-800 tracking-tight">Recent Complaints</h3>
               </div>
               <Link to="/complaints" className="text-[12px] font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
               </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
               {complaints.length > 0 ? (
                  complaints.slice(0, 5).map((complaint, i) => (
                     <div 
                       key={i} 
                       className="p-5 rounded-[7px] border border-slate-100 flex items-start sm:items-center gap-4 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all bg-slate-50/30 group"
                     >
                        <div className={`shrink-0 w-10 h-10 ${complaint.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} rounded-full flex items-center justify-center`}>
                           {complaint.status === 'Resolved' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1.5">
                              <h4 className="text-[15px] font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">{complaint.title}</h4>
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full w-fit ${complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                 {complaint.status}
                              </span>
                           </div>
                           <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
                              <span>ID: #{complaint._id.slice(-6).toUpperCase()}</span>
                              <span>•</span>
                              <span className="truncate">{complaint.description || "No description provided."}</span>
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-10 opacity-60">
                     <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                        <MessageSquare className="w-8 h-8" />
                     </div>
                     <div>
                        <p className="text-[14px] font-bold text-slate-600">No complaints yet</p>
                        <p className="text-[12px] text-slate-400 mt-1">If you have an issue, you can log it here.</p>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* 🛠️ 3. Side Action Panel (Right - takes up 1 column) */}
         <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-[7px] border border-slate-100 shadow-sm p-6">
               <h3 className="text-[14px] font-black text-slate-800 tracking-tight mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Quick Actions
               </h3>
               
               <Link to="/complaints" className="block">
                  <button className="w-full h-14 bg-[#1E40AF] text-white rounded-[7px] font-bold text-[14px] shadow-md shadow-blue-700/20 flex items-center justify-between px-5 hover:bg-blue-800 transition-all hover:scale-[1.02] active:scale-95">
                     <div className="flex items-center gap-3">
                        <PlusCircle className="w-5 h-5 opacity-90" />
                        Raise New Complaint
                     </div>
                     <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
               </Link>
            </div>

            {/* AI Assistant Card */}
            <div className="bg-[#0F172A] rounded-[7px] p-6 relative overflow-hidden group shadow-xl">
               <div className="relative z-10 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-300">
                     <Bot className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="text-[16px] font-black text-white tracking-tight mb-1">CIMAGE AI Assistant</h3>
                     <p className="text-[13px] text-slate-300 leading-relaxed">Have a question regarding college rules, notices, or need help categorizing your complaint? Ask the AI.</p>
                  </div>
                  <Link to="/assistant">
                     <button className="w-full h-11 bg-blue-600 text-white rounded-[7px] font-bold text-[13px] hover:bg-blue-500 transition-all shadow-md active:scale-95">
                        Start Chat
                     </button>
                  </Link>
               </div>
               
               {/* Decorative Background */}
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/30 transition-all duration-500"></div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-[7px] border border-slate-100 shadow-sm p-5 flex items-center gap-4 mb-4">
               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black text-lg">
                  {user.name?.charAt(0).toUpperCase()}
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-slate-800 leading-none truncate mb-1">{user.name}</h4>
                  <p className="text-[11px] font-bold text-slate-400 truncate">{user.email}</p>
               </div>
               <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase shrink-0">
                  {user.department || 'BCA'}
               </span>
            </div>

            {/* 🚪 Session Control Section */}
            <div className="bg-red-50/50 rounded-[7px] border border-red-100 p-6 flex flex-col gap-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-[7px] flex items-center justify-center">
                     <LogOut className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="text-[15px] font-black text-slate-800 tracking-tight">Session Control</h3>
                     <p className="text-[11px] font-bold text-red-600/60 uppercase tracking-widest">Secure Exit</p>
                  </div>
               </div>
               <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                  Finish your tasks? Log out to keep your portal secure and private.
               </p>
               <motion.button 
                 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                 onClick={logout}
                 className="w-full h-12 bg-red-600 text-white rounded-[7px] font-bold text-[14px] shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
               >
                  <LogOut size={18} /> Log Out Now
               </motion.button>
            </div>

         </div>
      </div>
    </div>
  );
}
