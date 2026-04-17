import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "./admin/AdminDashboard";
import StudentDashboard from "./student/StudentDashboard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // 🛡️ Identity-Based Routing Logic
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚀 Render High-End Administrative Portal
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  // 📱 Render Mobile-Responsive Student Portal
  return <StudentDashboard />;
}
