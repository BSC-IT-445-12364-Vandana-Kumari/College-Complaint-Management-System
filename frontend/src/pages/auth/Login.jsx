import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  Fingerprint
} from "lucide-react";
import logo from "../../assets/logo.png";
import img from "../../assets/illustration.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="h-screen w-full bg-[#f8fafc] text-slate-700 font-sans selection:bg-blue-100 selection:text-blue-900 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-5xl bg-white rounded-[7px] shadow-[0_0_40px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col md:flex-row h-full max-h-[600px] animate-in fade-in duration-700">
        <div className="hidden lg:flex w-1/2 bg-blue-50/50 items-center justify-center p-10 relative overflow-hidden border-r border-slate-100/50">
           <div className="relative z-10 text-center space-y-6">
              <div className="bg-transparent p-4 inline-block">
                 <img src={logo} alt="CIMAGE" className="h-16 w-auto grayscale-0" />
              </div>
              <img src={img} alt="Illustration" className="w-full max-w-[280px] h-auto opacity-100 mx-auto" />
              <div className="space-y-1">
                 <h2 className="text-xl font-black text-blue-900 tracking-tight leading-none uppercase-none">Student Portal</h2>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Access your personalized institutional dashboard securely.</p>
              </div>
           </div>
           <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
           <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-sm space-y-6 animate-in slide-in-from-right duration-700">
             <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-[7px]">
                   <LogIn className="w-3.5 h-3.5 text-blue-600" />
                   <span className="text-[9px] font-black tracking-widest text-blue-600 uppercase">Identity Hub</span>
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-slate-800 leading-none uppercase-none">Student <span className="text-blue-700">Login.</span></h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none">ENTER YOUR OFFICIAL CREDENTIALS TO LOG IN.</p>
             </div>
             <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Official ID / Email</label>
                   <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 group-focus-within:text-blue-600 transition-colors" />
                      <input type="email" required placeholder="vandana.kumari@cimage.in" className="w-full h-11 px-11 bg-slate-50/50 border border-slate-200 rounded-[7px] text-sm font-semibold text-slate-800 transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 placeholder:text-slate-400 outline-none shadow-sm" onChange={(e) => setEmail(e.target.value)} />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Portal PIN</label>
                   <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 group-focus-within:text-blue-600 transition-colors" />
                      <input type={showPassword ? "text" : "password"} required placeholder="••••••••" className="w-full h-11 px-11 bg-slate-50/50 border border-slate-200 rounded-[7px] text-sm font-semibold text-slate-800 transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 placeholder:text-slate-400 outline-none shadow-sm" onChange={(e) => setPassword(e.target.value)} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                   </div>
                </div>
                <div className="flex items-center justify-between px-1 mb-2">
                   <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded-[4px] border-slate-200 bg-slate-50 text-blue-600 focus:ring-blue-500/20" />
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-tight">Stay Connected</span>
                   </label>
                   <Link to="#" className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-tight">Reset PIN?</Link>
                </div>
                <button type="submit" disabled={isLoading} className="w-full h-11 bg-[#1E40AF] hover:bg-blue-800 text-white font-bold text-[11px] uppercase tracking-[0.3em] rounded-[7px] shadow-lg shadow-blue-700/10 active:scale-[0.98] transition-all relative overflow-hidden group border-b-4 border-blue-900 active:border-b-0">
                   {isLoading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto" /> : <div className="flex items-center justify-center gap-2">Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>}
                </button>
                <div className="text-center pt-6 border-t border-slate-50">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">New Member? <Link to="/register" className="text-blue-600 hover:text-blue-800 font-black border-b border-blue-100 transition-all pb-1 ml-2">Register</Link></p>
                </div>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
}
