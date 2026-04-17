import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Edit3, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Activity, 
  LogOut,
  Bell
} from "lucide-react";

export default function Profile() {
  const { user } = useContext(AuthContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+91 9876543210", // Dummy default since it wasn't in context
    location: "Patna, Bihar",
    department: "BCA"
  });

  // Update local form state if user context loads later
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleSave = () => {
    // Here you would make an API call to update the profile.
    // axios.put('/api/users/profile', formData) ...
    setIsEditing(false);
    // Add toast or success message here if needed
  };

  const personalInfoFields = [
    { label: "Full Name", key: "name", icon: User },
    { label: "Email Address", key: "email", icon: Mail, readOnly: true },
    { label: "Phone Number", key: "phone", icon: Activity },
    { label: "Location", key: "location", icon: MapPin },
    { label: "Department", key: "department", icon: FileText, readOnly: true },
    { label: "Account Status", key: "status", val: "Active", icon: CheckCircle2, color: "text-emerald-500", readOnly: true },
  ];

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500 w-full font-sans">
      
      {/* 🌟 Profile Header */}
      <div className="bg-white p-6 md:p-8 rounded-[7px] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6">
        
        {/* Avatar */}
        <div className="relative group shrink-0">
           <div className="w-24 h-24 bg-gradient-to-br from-[#1E40AF] to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/20 transition-transform duration-300">
              {formData.name.charAt(0).toUpperCase() || "U"}
           </div>
           {isEditing && (
             <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-[#1E40AF] hover:bg-blue-50 shadow-sm transition-all z-10 animate-in zoom-in">
                <Edit3 size={14} />
             </button>
           )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-3">
           <div>
              <div className="flex flex-col md:flex-row items-center gap-3">
                 <h1 className="text-2xl font-black tracking-tight text-slate-800 leading-none">{formData.name || "Student User"}</h1>
                 <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[4px] text-[10px] font-black tracking-widest uppercase">
                    Verified {user?.role || "Student"}
                 </span>
              </div>
              <p className="text-slate-500 font-medium text-[13px] mt-1.5">{formData.email}</p>
           </div>
           
           <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 pt-3 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-slate-500">
                 <ShieldCheck className="w-4 h-4 text-blue-500" />
                 <span className="text-[12px] font-bold">Standard Access</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                 <Calendar className="w-4 h-4 text-amber-500" />
                 <span className="text-[12px] font-bold">Joined 2024</span>
              </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row md:flex-col gap-3 shrink-0">
           {!isEditing ? (
             <button 
               onClick={() => setIsEditing(true)} 
               className="h-10 px-5 bg-[#1E40AF] text-white rounded-[7px] text-[12px] font-bold shadow-md shadow-blue-500/20 hover:bg-blue-800 transition-all active:scale-95 text-center flex items-center justify-center gap-2"
             >
                <Edit3 size={14} /> Edit Profile
             </button>
           ) : (
             <>
               <button 
                 onClick={handleSave} 
                 className="h-10 px-5 bg-emerald-600 text-white rounded-[7px] text-[12px] font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 text-center flex items-center justify-center gap-2 animate-in slide-in-from-right-4"
               >
                  <CheckCircle2 size={14} /> Save Changes
               </button>
               <button 
                 onClick={() => setIsEditing(false)} 
                 className="h-10 px-5 bg-slate-100 border border-slate-200 text-slate-600 rounded-[7px] text-[12px] font-bold hover:bg-slate-200 hover:text-slate-800 transition-all active:scale-95 text-center px-4 animate-in slide-in-from-right-2"
               >
                  Cancel
               </button>
             </>
           )}
        </div>
        
        {/* Subtle Decorative Gradient */}
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 📦 Profile Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Personal Info */}
        <div className="lg:col-span-2 space-y-6">
           
           <div className={`bg-white p-6 rounded-[7px] shadow-sm transition-all duration-300 border ${isEditing ? 'border-blue-300 shadow-blue-100' : 'border-slate-100'}`}>
              <h3 className="text-[15px] font-bold tracking-tight text-slate-800 border-b border-slate-50 pb-4 mb-4 flex items-center gap-2">
                 <User className="w-4 h-4 text-[#1E40AF]" /> Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {personalInfoFields.map((field, i) => (
                   <div key={i} className={`bg-slate-50/50 p-4 rounded-[7px] border flex items-start gap-3 transition-colors ${isEditing && !field.readOnly ? 'border-blue-100 bg-blue-50/20' : 'border-slate-100/50'}`}>
                      <div className="mt-0.5 shrink-0">
                         <field.icon className={`w-4 h-4 ${field.color || 'text-slate-400'}`} />
                      </div>
                      <div className="w-full">
                         <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">{field.label} {field.readOnly && isEditing && <span className="lowercase normal-case font-medium ml-1 opacity-60">(Locked)</span>}</span>
                         
                         {isEditing && !field.readOnly ? (
                           <input 
                             type="text"
                             value={formData[field.key] || ''}
                             onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                             className="w-full mt-1.5 h-9 bg-white border border-slate-200 rounded-[5px] px-3 text-[13px] font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all"
                           />
                         ) : (
                           <span className="block text-[14px] font-bold text-slate-700 mt-0.5">
                             {formData[field.key] || field.val || 'N/A'}
                           </span>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

        </div>

        {/* Right Side: Activity & Security */}
        <div className="lg:col-span-1 space-y-6">
           
           <div className={`bg-white p-6 rounded-[7px] shadow-sm transition-all duration-300 border ${isEditing ? 'opacity-50 pointer-events-none' : ''} border-slate-100`}>
              <h3 className="text-[15px] font-bold tracking-tight text-slate-800 border-b border-slate-50 pb-4 mb-4 flex items-center gap-2">
                 <Clock className="w-4 h-4 text-amber-500" /> Recent Activity
              </h3>

              <div className="space-y-5">
                 {[
                   { label: "Logged in", time: "Just Now", icon: CheckCircle2, color: "text-emerald-500" },
                   { label: "Viewed Dashboard", time: "5m ago", icon: Activity, color: "text-blue-500" },
                   { label: "Read Notice #01", time: "1h ago", icon: Bell, color: "text-amber-500" },
                   { label: "Profile Updated", time: "2d ago", icon: User, color: "text-slate-400" },
                 ].map((act, i) => (
                   <div key={i} className="flex gap-3">
                      <div className="mt-0.5">
                         <act.icon className={`w-4 h-4 ${act.color}`} />
                      </div>
                      <div className="space-y-0.5">
                         <span className="block text-[13px] font-bold text-slate-700">{act.label}</span>
                         <span className="block text-[11px] font-medium text-slate-400">{act.time}</span>
                      </div>
                   </div>
                 ))}
              </div>
              
              <button className="w-full mt-6 py-2 bg-slate-50 hover:bg-slate-100 text-[#1E40AF] font-bold text-[12px] rounded-[5px] transition-colors">
                 View Full Activity
              </button>
           </div>
           
           <div className={`bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-[7px] shadow-lg text-white transition-all duration-300 ${isEditing ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="text-[15px] font-bold tracking-tight border-b border-slate-700 pb-4 mb-4 flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-blue-400" /> Account Security
              </h3>
              <p className="text-[12px] font-medium text-slate-300 leading-relaxed mb-4">
                 Your account is secured with standard encryption. Ensure you do not share your credentials.
              </p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-[12px] rounded-[5px] transition-all flex items-center justify-center gap-2">
                 Change Password
              </button>
           </div>

        </div>

      </div>

    </div>
  );
}
