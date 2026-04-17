import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Bell, 
  MessageSquare, 
  Bot, 
  Clock, 
  Lock,
  ChevronRight,
  PlusCircle,
  Database,
  Users,
  CheckCircle2,
  FileText,
  LifeBuoy,
  Target,
  BookOpen,
  Building2,
  CreditCard,
  Library
} from "lucide-react";
import logo from "../assets/logo.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  },
  viewport: { once: true }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#fdfeff] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* 🚀 Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
            <img src={logo} alt="CIMAGE" className="h-10 w-auto" />
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="flex flex-col select-none">
              <span className="text-xl font-bold text-[#1E40AF] tracking-tight leading-none uppercase">Complaint Hub</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Student Portal</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
             <a href="#help" className="hover:text-blue-600 transition-colors">Emergency Help</a>
             <a href="#how" className="hover:text-blue-600 transition-colors">Step-by-Step</a>
             <a href="#safe" className="hover:text-blue-600 transition-colors">Privacy</a>
          </nav>

          <div className="flex items-center gap-6">
            <Link to="/login">
              <span className="text-[14px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors px-2 underline decoration-2 underline-offset-4">Student Login</span>
            </Link>
            <Link to="/admin/login">
              <button className="h-11 px-8 bg-slate-900 text-white font-bold text-[12px] uppercase tracking-widest rounded-full hover:bg-black transition-all active:scale-95 shadow-md">
                Admin Login
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative pt-24">
        
        {/* 🎇 Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
              <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] opacity-30" />
              <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-indigo-100 rounded-full blur-[80px] opacity-20" />
           </div>

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-[48px] md:text-[80px] font-extrabold leading-[1.1] max-w-4xl mx-auto text-slate-900 tracking-tight"
           >
              We are here <br /> to <span className="text-[#1E40AF]">help you.</span>
           </motion.h1>

           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-8 mb-16 font-medium"
           >
              Facing a problem in college? <span className="font-bold text-slate-800">Don't worry.</span> Just register your problem here, and our team will fix it fast.
           </motion.p>

           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2 }}
             className="flex flex-col sm:flex-row items-center justify-center gap-6"
           >
              <Link to="/register">
                <button className="h-20 px-16 bg-[#1E40AF] text-white font-bold text-lg rounded-full shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-4 uppercase tracking-widest">
                   Register Problem <ChevronRight className="w-6 h-6" />
                </button>
              </Link>
              <Link to="/login">
                <button className="h-20 px-12 bg-white border-2 border-slate-100 text-slate-600 font-bold text-lg rounded-full transition-all hover:border-slate-300 active:scale-95 shadow-sm">
                   Check Progress
                </button>
              </Link>
           </motion.div>
        </section>

        {/* ⚡ Quick Help Grid */}
        <section id="help" className="py-24 max-w-6xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">What's wrong?</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Select a category to start</p>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Study", sub: "Exam, Syllabus", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Living", sub: "Hostel, Food", icon: Building2, color: "text-orange-600", bg: "bg-orange-50" },
                { label: "Fees", sub: "Refund, Payment", icon: CreditCard, color: "text-green-600", bg: "bg-green-50" },
                { label: "Books", sub: "Library, Access", icon: Library, color: "text-purple-600", bg: "bg-purple-50" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white p-10 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] text-center group cursor-pointer"
                >
                   <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-8 h-8 ${item.color}`} />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-800 mb-2">{item.label}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.sub}</p>
                </motion.div>
              ))}
           </div>
        </section>

        {/* 🔄 Simple Process */}
        <section id="how" className="py-32 bg-slate-50/50">
           <div className="max-auto max-w-6xl px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                 <div className="space-y-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">It's very <br /><span className="text-[#1E40AF]">Simple.</span></h2>
                    
                    {[
                      { step: "1", title: "Tell us what happened", desc: "Fill a small form and upload a photo if you have one." },
                      { step: "2", title: "We check it", desc: "Our college team looks into your problem immediately." },
                      { step: "3", title: "Problem Fixed!", desc: "You get a message when everything is sorted out." }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-8 group">
                         <div className="w-14 h-14 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-center text-xl font-bold text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {step.step}
                         </div>
                         <div>
                            <h4 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h4>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed">{step.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="relative">
                    <motion.div 
                       initial={{ x: 20, opacity: 0 }}
                       whileInView={{ x: 0, opacity: 1 }}
                       className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl relative z-10"
                    >
                       <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Work Status</span>
                          <span className="px-4 py-2 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full uppercase">Solving...</span>
                       </div>
                       <div className="space-y-8">
                          <div className="flex gap-6 items-center">
                             <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <FileText className="w-7 h-7 text-blue-600" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">My Complaint</p>
                                <p className="text-xl font-bold text-slate-800">Broken Chair in Lab</p>
                             </div>
                          </div>
                          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full w-2/3 bg-blue-600 rounded-full" />
                          </div>
                          <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest">Resolving in 48 hours</p>
                       </div>
                    </motion.div>
                 </div>
              </div>
           </div>
        </section>

        {/* 🏘️ Modern Footer */}
        <footer className="bg-white pt-32 pb-16 px-6 border-t border-slate-100">
           <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 mb-24 px-4">
              <div className="space-y-8">
                 <div className="flex items-center gap-4">
                    <img src={logo} alt="CIMAGE" className="h-10 w-auto" />
                    <span className="text-xl font-bold text-slate-800 tracking-tight leading-none uppercase">Complaint Hub</span>
                 </div>
                 <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Official Student Support platform for CIMAGE Group of Colleges. We listen, we solve.
                 </p>
              </div>

              <div className="space-y-8">
                 <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Location</h4>
                 <div className="text-lg font-bold text-slate-800 space-y-2">
                    <p>Boring Canal Road, Patna</p>
                    <p className="text-blue-600 underline">info@cimage.in</p>
                    <p>+91 98350 24444</p>
                 </div>
              </div>

              <div className="space-y-8">
                 <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Access</h4>
                 <div className="flex flex-col gap-4 text-lg font-bold text-slate-800">
                    <Link to="/login" className="hover:text-blue-600 transition-all">Student Login</Link>
                    <Link to="/admin/login" className="hover:text-blue-600 transition-all">Admin Area</Link>
                    <Link to="/register" className="hover:text-blue-600 transition-all">Register Problem</Link>
                 </div>
              </div>
           </div>

           <div className="max-w-6xl mx-auto pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
              <p>© {new Date().getFullYear()} CIMAGE Group. Professional & Secure.</p>
           </div>
        </footer>
      </main>
    </div>
  );
}
