import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function RootLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full relative z-10 w-full overflow-hidden">
        
        {/* Top Sticky Header */}
        <Navbar />
        
        {/* Dynamic Inner Scrollable Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 relative bg-[#f8fafc]">
          <AnimatePresence mode="wait">
             <motion.div
               key={location.pathname}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3, ease: "easeOut" }}
               className="w-full h-full pb-8"
             >
                <Outlet />
             </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}
