import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Lock, 
  Fingerprint, 
  CheckCircle2
} from "lucide-react";
import logo from "../../assets/logo.png";
import img from "../../assets/illustration.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await register(name, email, password, role, department);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration Failed.");
      setIsLoading(false);
    }
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
                 <h2 className="text-xl font-black text-blue-900 tracking-tight leading-none uppercase-none">Join the Network</h2>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Establish your institutional identity securely.</p>
              </div>
           </div>
           <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
           <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-sm space-y-6 animate-in slide-in-from-right duration-700">
             <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-[7px]">
                   <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                   <span className="text-[9px] font-black tracking-widest text-blue-600 uppercase">Self-Registration</span>
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-slate-800 leading-none uppercase-none">Student <span className="text-blue-700">Register.</span></h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none">PLEASE FILL IN YOUR OFFICIAL DETAILS TO REGISTER.</p>
             </div>
             <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                      <input type="text" required placeholder="Vandana Kumari" className="w-full h-10 px-5 bg-slate-50/50 border border-slate-200 rounded-[7px] text-sm font-semibold text-slate-800 transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 placeholder:text-slate-400 outline-none shadow-sm" onChange={(e) => setName(e.target.value)} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Official ID</label>
                      <input type="email" required placeholder="vandana.kumari@cimage.in" className="w-full h-10 px-5 bg-slate-50/50 border border-slate-200 rounded-[7px] text-sm font-semibold text-slate-800 transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 placeholder:text-slate-400 outline-none shadow-sm" onChange={(e) => setEmail(e.target.value)} />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Secure PIN</label>
                   <div className="relative group">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 group-focus-within:text-blue-600 transition-colors" />
                      <input type="password" required placeholder="••••••••" className="w-full h-10 px-5 bg-slate-50/50 border border-slate-200 rounded-[7px] text-sm font-semibold text-slate-800 transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 placeholder:text-slate-400 outline-none shadow-sm" onChange={(e) => setPassword(e.target.value)} />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Dept. Hub</label>
                   <input type="text" required placeholder="BCA/BBA/IT" className="w-full h-10 px-5 bg-slate-50/50 border border-slate-200 rounded-[7px] text-sm font-semibold text-slate-800 transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 placeholder:text-slate-400 outline-none shadow-sm" onChange={(e) => setDepartment(e.target.value)} />
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

                <button type="submit" disabled={isLoading} className="w-full h-11 bg-[#1E40AF] hover:bg-blue-800 text-white font-bold text-[11px] uppercase tracking-[0.3em] rounded-[7px] shadow-lg shadow-blue-700/10 active:scale-[0.98] transition-all relative overflow-hidden group border-b-4 border-blue-900 active:border-b-0">
                   {isLoading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto" /> : <div className="flex items-center justify-center gap-2">Register <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>}
                </button>

                <div className="text-center pt-6 border-t border-slate-50">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Already have an identity? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-black border-b border-blue-100 transition-all pb-1 ml-2">Login</Link></p>
                </div>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
}
