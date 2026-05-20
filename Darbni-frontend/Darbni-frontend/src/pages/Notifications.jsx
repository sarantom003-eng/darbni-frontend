import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCheck, FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import { notificationApi } from "../api/client";

function getNotifLink(notif) {
  if (notif.type === "company_approved" || notif.type === "company_rejected") {
    return "/student/applications?tab=company";
  }
  if (notif.type === "university_approved" || notif.type === "university_rejected") {
    return "/student/applications?tab=university";
  }
  if (notif.type === "log_confirmed") return "/student/logbook";
  return "/student/applications";
}

function getNotifIcon(type) {
  switch (type) {
    case "company_approved": return "✅";
    case "company_rejected": return "❌";
    case "university_approved": return "🎓";
    case "university_rejected": return "❌";
    case "log_confirmed": return "📋";
    default: return "🔔";
  }
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.list();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = async () => {
    await notificationApi.markAllRead();
    await fetchNotifications();
  };

  const markRead = async (id) => {
    await notificationApi.markRead(id);
    await fetchNotifications();
  };

  const deleteNotif = async (id) => {
    // ملاحظة: التوثيق ما فيه DELETE للـ notifications
    // يمكن تحتاجي تطلبي من الباك إند إضافة هذي الميزة
    // حالياً رح نخفيها من الـ UI مؤقتاً
    console.log("Delete not implemented yet");
  };

  const handleOpen = async (notif) => {
    if (!notif.isRead) await markRead(notif._id);
    navigate(getNotifLink(notif));
  };

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}>Loading notifications...</div>;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", fontFamily: "'Poppins', Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "#4a3fa0", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>
            <FaBell />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1729", margin: 0 }}>Notifications</h1>
            <p style={{ fontSize: 13, color: "#999", margin: 0 }}>
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 18px", background: "#fff",
              border: "1.5px solid #dddbe8", borderRadius: 10,
              fontSize: 13, fontWeight: 600, color: "#4a3fa0", cursor: "pointer",
            }}
          >
            <FaCheck style={{ fontSize: 11 }} /> Mark All as Read
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notifications.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb", fontSize: 14 }}>
            No notifications yet.
          </div>
        )}
        {notifications.map(n => (
          <div
            key={n._id}
            style={{
              background: n.isRead ? "#fff" : "#faf9ff",
              border: n.isRead ? "1px solid #ebebef" : "1px solid #dddbe8",
              borderRadius: 14,
              padding: "18px 20px",
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: n.isRead ? "#f5f4f9" : "#ede9fb",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>
              {getNotifIcon(n.type)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1729" }}>
                  {n.type?.replace(/_/g, " ").toUpperCase()}
                </span>
                {!n.isRead && (
                  <span style={{
                    background: "#4a3fa0", color: "#fff",
                    fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700,
                  }}>New</span>
                )}
              </div>
              <p style={{ fontSize: 13, color: "#666", margin: "0 0 6px", lineHeight: 1.5 }}>{n.message}</p>
              <p style={{ fontSize: 11, color: "#bbb", margin: "0 0 10px" }}>{formatTime(n.createdAt)}</p>

              <div style={{ display: "flex", gap: 16 }}>
                {!n.isRead && (
                  <button
                    onClick={() => markRead(n._id)}
                    style={{ background: "none", border: "none", fontSize: 12, color: "#4a3fa0", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600, padding: 0 }}
                  >
                    <FaCheck style={{ fontSize: 10 }} /> Mark as Read
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => handleOpen(n)}
              style={{ background: "none", border: "none", color: "#bbb", cursor: "pointer", fontSize: 14, flexShrink: 0, padding: 4 }}
              title="Go to page"
            >
              <FaExternalLinkAlt />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}