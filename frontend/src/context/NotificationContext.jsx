import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useSocket } from "./SocketContext";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const socket = useSocket();
  const [unreadNotices, setUnreadNotices] = useState(0);
  const [resolvedComplaints, setResolvedComplaints] = useState(0);

  const fetchNotices = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get("http://localhost:5000/api/notices", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const readIds = JSON.parse(localStorage.getItem("readNotices") || "[]");
      const unread = data.filter((n) => !readIds.includes(n._id)).length;
      setUnreadNotices(unread);
    } catch (err) {
      console.error("Failed to fetch notices for count", err);
    }
  };

  const fetchComplaints = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get("http://localhost:5000/api/complaints", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // For students, count 'Resolved' that they might not have seen yet
      // We'll use a simple logic: if status is resolved, and they haven't "dismissed" the alert
      // For now, let's just count total resolved for student, or pending for admin
      if (user.role === 'admin') {
         setResolvedComplaints(data.filter(c => c.status === 'Pending').length);
      } else {
         setResolvedComplaints(data.filter(c => c.status === 'Resolved').length);
      }
    } catch (err) {
      console.error("Failed to fetch complaints for count", err);
    }
  };

  useEffect(() => {
    fetchNotices();
    fetchComplaints();

    if (socket) {
      socket.on("new_complaint", () => fetchComplaints());
      socket.on("complaint_updated", () => fetchComplaints());
      socket.on("new_notice", () => fetchNotices());
      
      return () => {
        socket.off("new_complaint");
        socket.off("complaint_updated");
        socket.off("new_notice");
      };
    }
  }, [user, socket]);

  // Update count when user marks a notice as read
  const refreshCounts = () => {
    fetchNotices();
    fetchComplaints();
  };

  return (
    <NotificationContext.Provider value={{ unreadNotices, resolvedComplaints, refreshCounts }}>
      {children}
    </NotificationContext.Provider>
  );
};
