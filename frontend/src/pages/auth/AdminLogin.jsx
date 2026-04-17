import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  UserCheck
} from "lucide-react";
import logo from "../../assets/logo.png";
import img from "../../assets/illustration.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      
      // 🛡️ Exclusive Admin Role Security Check
      if (data.role !== 'admin') {
        setError("ACCESS DENIED: Required Administrative Privileges Not Found.");
        setIsLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid Admin Credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f8fafc] text-slate-700 font-sans selection:bg-blue-100 selection:text-blue-900 flex items-center justify-center p-4 overflow-hidden tracking-normal">
      
      {/* 🔮 Center Container with 4-way Shadow - Compact No-Scroll */}
      <div className="w-full max-w-5xl bg-white rounded-[7px] shadow-[0_0_50px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col md:flex-row h-full max-h-[600px] animate-in fade-in duration-700">
        
        {/* Left Side: Illustration Panel - Flat blend */}
        <div className="hidden lg:flex w-1/2 bg-slate-50 items-center justify-center p-10 relative overflow-hidden border-r border-slate-100/50">
           <div className="relative z-10 text-center space-y-6">
              <div className="bg-transparent p-4 inline-block">
                 <img src={logo} alt="CIMAGE" className="h-20 w-auto" />
              </div>
              <img src={img} alt="Illustration" className="w-full max-w-[300px] h-auto mx-auto opacity-100 drop-shadow-sm" />
              <div className="space-y-1">
                 <h2 className="text-2xl font-black text-blue-900 tracking-tight leading-none uppercase-none">Admin Control Hub</h2>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Institutional master command node access only.
                 </p>
              </div>
           </div>
           {/* Decorative Orb */}
           <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
           <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-red-50/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Right Side: Form Panel - Compact */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-14 bg-white">
          <div className="w-full max-w-sm space-y-7 animate-in slide-in-from-right duration-700">
             
             <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-[7px]">
                   <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                   <span className="text-[9px] font-black tracking-widest text-red-600 uppercase">Master Identity Gateway</span>
                </div>
                <h1 className="text-3xl font-black tracking-tighter text-slate-800 leading-none uppercase-none">Admin <span className="text-red-600">Login Platform.</span></h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none opacity-80">AUTHENTICATE MASTER CREDENTIALS FOR CONTROL ACCESS.</p>
             </div>

             <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Admin Identity Hub</label>
                   <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 group-focus-within:text-red-600 transition-colors" />
                      <input 
                        type="email" required placeholder="admin.hq@cimage.in"
                        className="w-full h-11 px-11 bg-slate-50/50 border border-slate-200 rounded-[7px] text-sm font-semibold text-slate-800 transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50 placeholder:text-slate-400 outline-none shadow-sm"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Master Portal PIN</label>
                   <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 group-focus-within:text-red-600 transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required placeholder="••••••••"
                        className="w-full h-11 px-11 bg-slate-50/50 border border-slate-200 rounded-[7px] text-sm font-semibold text-slate-800 transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50 placeholder:text-slate-400 outline-none shadow-sm"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                   </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-100 rounded-[7px] text-[10px] font-black text-red-600 uppercase tracking-widest text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-2">
                   <button 
                     type="submit" 
                     disabled={isLoading}
                     className="w-full h-12 bg-slate-900 hover:bg-black text-white font-black text-[12px] uppercase tracking-[0.4em] rounded-[7px] shadow-lg shadow-black/10 active:scale-[0.98] transition-all relative overflow-hidden group border-b-4 border-slate-800 active:border-b-0"
                   >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto" />
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                           Log In Administrative Hub
                           <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                   </button>
                </div>
                
                <div className="text-center pt-8 border-t border-slate-50">
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                      Go to Member Gateway? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-black border-b border-blue-100 transition-all pb-1 ml-2">Student Portal</Link>
                   </p>
                </div>
             </form>
          </div>
        </div>

      </div>

    </div>
  );
}
