import { useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { PlusCircle, CheckCircle2, AlertCircle, FileText, Image as ImageIcon, X, Loader2, ChevronDown } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categories = ["Academic", "Maintenance", "IT Support", "Library", "Fees / Admin", "Security", "Others"];

export default function NewComplaint() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    category: "Academic",
    priority: "Medium"
  });
  const [evidence, setEvidence] = useState(null);
  const [evidencePreview, setEvidencePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setEvidence(file);
      const reader = new FileReader();
      reader.onloadend = () => setEvidencePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setEvidence(null);
    setEvidencePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("priority", formData.priority);
      if (evidence) {
        submitData.append("evidence", evidence);
      }

      await axios.post(
        "http://localhost:5000/api/complaints",
        submitData,
        { 
           headers: { 
             Authorization: `Bearer ${user.token}`,
             "Content-Type": "multipart/form-data" 
           } 
        }
      );
      setSuccess(true);
      setTimeout(() => navigate("/complaints"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700 w-full font-sans pb-10">
      
      {/* 🌟 Header Section */}
      <div className="bg-white p-6 rounded-[7px] border border-slate-100 shadow-sm mb-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
               <FileText className="w-6 h-6 text-[#1E40AF]" />
            </div>
            <div>
               <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none mb-1">Submit New Complaint</h1>
               <p className="text-slate-500 text-[13px] font-medium">Log your issue with details and evidence for quick resolution.</p>
            </div>
         </div>
         
         <div className="absolute -right-20 -top-20 w-48 h-48 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto">
         <div className="bg-white p-6 md:p-8 rounded-[7px] border border-slate-100 shadow-sm relative overflow-hidden">
            
            {success && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
              >
                 <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                 </div>
                 <h2 className="text-xl font-bold text-slate-800 tracking-tight">Complaint Submitted!</h2>
                 <p className="text-slate-500 text-[13px] font-medium mt-1">Your issue has been logged securely. Redirecting to dashboard...</p>
              </motion.div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-[5px] bg-red-50 text-red-600 text-[13px] font-bold flex items-center gap-2 border border-red-100">
                 <AlertCircle className="w-4 h-4 shrink-0" />
                 {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Category & Priority Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select 
                          className="w-full h-11 bg-slate-50 border border-slate-200 text-slate-800 rounded-[7px] px-4 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                        Priority
                      </label>
                      <div className="relative">
                        <select 
                          className="w-full h-11 bg-slate-50 border border-slate-200 text-slate-800 rounded-[7px] px-4 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        >
                          {["Low", "Medium", "High", "Urgent"].map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                      Subject / Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., WiFi connection issue in Library"
                      className="w-full h-11 bg-slate-50 border border-slate-200 text-slate-800 rounded-[7px] px-4 font-bold text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                      Detailed Description <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      required
                      placeholder="Please explain the problem in detail..."
                      className="w-full min-h-[120px] bg-slate-50 border border-slate-200 text-slate-800 rounded-[7px] px-4 py-3 font-medium text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  {/* Evidence Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                      Evidence Image <span className="text-slate-400 font-medium normal-case tracking-normal text-[10px]">(Optional)</span>
                    </label>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 w-full flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-[7px] cursor-pointer transition-all ${evidencePreview ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                      >
                         <input 
                           type="file" 
                           ref={fileInputRef}
                           accept="image/*"
                           onChange={handleImageChange}
                           className="hidden"
                         />
                         <ImageIcon className={`w-8 h-8 mb-2 ${evidencePreview ? 'text-blue-500' : 'text-slate-300'}`} />
                         <span className="text-[12px] font-bold text-slate-500">
                            {evidence ? evidence.name : "Upload Evidence Photo"}
                         </span>
                         <span className="text-[10px] text-slate-400 mt-1">JPEG, PNG (Max 5MB)</span>
                      </div>

                      {evidencePreview && (
                        <div className="relative shrink-0 w-28 h-28 rounded-[7px] border border-slate-200 overflow-hidden shadow-sm">
                          <img src={evidencePreview} alt="Evidence" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={clearImage}
                            className="absolute top-1 right-1 w-6 h-6 bg-white text-red-600 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                             <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
               </div>

               <div className="pt-6 border-t border-slate-100">
                  <button 
                    type="submit" 
                    disabled={loading || success}
                    className="h-12 w-full bg-[#1E40AF] text-white rounded-[7px] font-bold text-[13px] shadow-lg shadow-blue-500/10 hover:bg-blue-800 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 uppercase tracking-widest"
                  >
                     {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                     ) : (
                        <>
                          <PlusCircle className="w-4 h-4" />
                          Submit Complaint
                        </>
                     )}
                  </button>
               </div>
            </form>
         </div>
      </div>
    </div>
  );
}
