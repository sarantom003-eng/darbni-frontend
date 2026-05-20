import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome, FaUser, FaSearch, FaFileAlt,
  FaBook, FaStar, FaSignOutAlt, FaBell,
  FaChevronDown, FaUserEdit, FaKey
} from "react-icons/fa";
import { notificationApi, profileApi } from "../api/client";

// ── Change Password Modal ──────────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required"); return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters"); return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match"); return;
    }

    setLoading(true);
    try {
      // PUT /profile/change-password
      await profileApi.changePassword({ currentPassword, newPassword, confirmPassword });
      setSuccess("Password changed successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 32,
        width: "100%", maxWidth: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1729", marginBottom: 20 }}>
          Change Password
        </h2>

        {error && (
          <div style={{ background: "#fff0f0", color: "#e74c3c", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#f0fff4", color: "#27ae60", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            {success}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{ flex: 1, padding: "11px", borderRadius: 8, border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer", fontSize: 14 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ flex: 1, padding: "11px", borderRadius: 8, border: "none", background: "#4a3fa0", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Student Layout ─────────────────────────────────────────────
function StudentLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dropRef  = useRef(null);
  const notifRef = useRef(null);

  const [showDrop,       setShowDrop]       = useState(false);
  const [showNotif,      setShowNotif]      = useState(false);
  const [showPwModal,    setShowPwModal]    = useState(false);
  const [notifications,  setNotifications]  = useState([]);
  const [unreadCount,    setUnreadCount]    = useState(0);

  const fetchNotifications = async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        notificationApi.list(),
        notificationApi.unreadCount(),
      ]);
      setNotifications(listRes.notifications || []);
      setUnreadCount(countRes.unreadCount || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => {
    if (path === "/student") return location.pathname === "/student";
    return location.pathname.startsWith(path);
  };

  const email  = localStorage.getItem("email") || "";
  const name   = localStorage.getItem("firstName") || localStorage.getItem("name") || "Student";
  const getRoleLetter = () => name[0]?.toUpperCase() || "S";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const markAllRead = async () => {
    await notificationApi.markAllRead();
    await fetchNotifications();
  };

  const markRead = async (id) => {
    await notificationApi.markRead(id);
    await fetchNotifications();
  };

  const getNotificationLink = (type) => {
    if (["company_approved", "company_rejected"].includes(type)) return "/student/applications";
    if (["university_approved", "university_rejected"].includes(type)) return "/student/applications";
    if (type === "log_confirmed") return "/student/logbook";
    return "/student/applications";
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) await markRead(notif._id);
    navigate(getNotificationLink(notif.type));
    setShowNotif(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current  && !dropRef.current.contains(e.target))  setShowDrop(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const diffMs    = new Date() - new Date(dateStr);
    const diffMins  = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays  = Math.floor(diffMs / 86400000);
    if (diffMins  < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div>
          <div className="sidebar-logo-wrap" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <span style={{ fontSize: 20 }}>🎓</span>
            <div>
              <div className="sidebar-logo-name">Darbni</div>
              <div className="sidebar-logo-sub">Student Portal</div>
            </div>
          </div>
          <ul>
            <li className={isActive("/student") ? "active" : ""}            onClick={() => navigate("/student")}><FaHome /> Dashboard</li>
            <li className={isActive("/student/profile") ? "active" : ""}    onClick={() => navigate("/student/profile")}><FaUser /> My Profile</li>
            <li className={isActive("/student/feed") ? "active" : ""}       onClick={() => navigate("/student/feed")}><FaSearch /> Internship Feed</li>
            <li className={isActive("/student/applications") ? "active" : ""}onClick={() => navigate("/student/applications")}><FaFileAlt /> My Applications</li>
            <li className={isActive("/student/logbook") ? "active" : ""}    onClick={() => navigate("/student/logbook")}><FaBook /> Training Logbook</li>
            <li className={isActive("/student/rate") ? "active" : ""}       onClick={() => navigate("/student/rate")}><FaStar /> Rate Company</li>
          </ul>
        </div>
        <div className="signout" onClick={handleLogout}><FaSignOutAlt /> Sign Out</div>
      </div>

      <div className="main-content">
        <div className="topbar">

          {/* Notifications */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <div className="notif" style={{ cursor: "pointer" }}
              onClick={() => { setShowNotif(!showNotif); setShowDrop(false); fetchNotifications(); }}>
              <FaBell />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </div>
            {showNotif && (
              <div className="notif-dropdown">
                <div className="notif-drop-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="notif-drop-title">Notifications</span>
                    {unreadCount > 0 && <span className="notif-new-badge">{unreadCount} new</span>}
                  </div>
                  {unreadCount > 0 && (
                    <button className="notif-read-all" onClick={markAllRead}>✓ Read All</button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">No notifications yet.</div>
                  ) : (
                    notifications.slice(0, 5).map(n => (
                      <div key={n._id} className={`notif-item${n.isRead ? "" : " unread"}`} onClick={() => handleNotificationClick(n)}>
                        <div className="notif-item-title">{n.type?.replace(/_/g, " ").toUpperCase()}</div>
                        <div className="notif-item-msg">{n.message}</div>
                        <div className="notif-item-time">{formatTime(n.createdAt)}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="notif-view-all" onClick={() => { navigate("/student/notifications"); setShowNotif(false); }}>
                  View All Notifications
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div style={{ position: "relative" }} ref={dropRef}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
              onClick={() => { setShowDrop(!showDrop); setShowNotif(false); }}>
              <div className="profile-circle">{getRoleLetter()}</div>
              <FaChevronDown style={{ fontSize: 11, color: "#888" }} />
            </div>
            {showDrop && (
              <div className="profile-dropdown">
                <div className="profile-drop-info">
                  <div className="profile-drop-name">Student Account</div>
                  <div className="profile-drop-email">{email}</div>
                </div>
                <div className="profile-drop-item" onClick={() => { navigate("/student/profile"); setShowDrop(false); }}>
                  <FaUserEdit /> Edit Profile
                </div>
                <div className="profile-drop-item" onClick={() => { setShowPwModal(true); setShowDrop(false); }}>
                  <FaKey /> Change Password
                </div>
                <div className="profile-drop-item signout-item" onClick={handleLogout}>
                  <FaSignOutAlt /> Sign Out
                </div>
              </div>
            )}
          </div>

        </div>
        {children}
      </div>

      {showPwModal && <ChangePasswordModal onClose={() => setShowPwModal(false)} />}
    </div>
  );
}

export default StudentLayout;