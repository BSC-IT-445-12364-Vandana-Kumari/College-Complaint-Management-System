import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/auth/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Complaints from "./pages/Complaints";
import Notices from "./pages/Notices";
import ComplaintDetail from "./pages/ComplaintDetail";
import NewComplaint from "./pages/NewComplaint";
import Assistant from "./pages/Assistant";
import Profile from "./pages/Profile";
import RootLayout from "./layouts/RootLayout";

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Immersive Public Portals */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Unified Institutional Hub (Protected) */}
        <Route element={<RootLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/complaints/new" element={<NewComplaint />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/complaints/:id" element={<ComplaintDetail />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/assistant" element={<Assistant />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AnimatePresence>
  );
}

import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}


export default App;
