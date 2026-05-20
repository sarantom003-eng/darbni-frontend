import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUniversity, FaUserGraduate, FaUserShield,
  FaBuilding, FaFileAlt, FaUsers, FaCheckCircle
} from "react-icons/fa";
import { api } from "../api/client";

export default function AdminPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.allSettled([
          api("/superadmin/stats"),
          api("/superadmin/recent-activity"),
        ]);

        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value);
        }
        if (activityRes.status === "fulfilled") {
          setActivities(activityRes.value.activities || []);
        }
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchData();
    return () => { alive = false; };
  }, []);

  const statsCards = stats ? [
    { label: "Total Universities",  value: stats.universities || 0,   icon: <FaUniversity />,  color: "#6c47ff", bg: "#f3efff" },
    { label: "Total Students",      value: stats.students || 0,       icon: <FaUserGraduate />, color: "#6c47ff", bg: "#f3efff" },
    { label: "Total Supervisors",   value: stats.supervisors || 0,    icon: <FaUserShield />,  color: "#6c47ff", bg: "#f3efff" },
    { label: "Approved Companies",  value: stats.approvedCompanies || 0, icon: <FaBuilding />, color: "#6c47ff", bg: "#f3efff" },
    { label: "Total Applications",  value: stats.totalApplications || 0, icon: <FaFileAlt />,  color: "#6c47ff", bg: "#f3efff" },
    { label: "Active Trainees",     value: stats.activeTraining || 0, icon: <FaUsers />,       color: "#6c47ff", bg: "#f3efff" },
    { label: "Completed Trainings", value: stats.completedTrainings || 0, icon: <FaCheckCircle />, color: "#27ae60", bg: "#f0fdf4" },
  ] : [];

  const getActivityColor = (type) => {
    switch (type) {
      case "student_registered": return "#27ae60";
      case "company_pending": return "#f39c12";
      case "training_completed": return "#3498db";
      default: return "#888";
    }
  };

  if (loading) return <div style={{ padding: 50, textAlign: "center" }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: 50, textAlign: "center", color: "#e74c3c" }}>{error}</div>;

  return (
    <div style={{ padding: "32px 36px", fontFamily: "'Segoe UI', sans-serif" }}>

      <div style={{ marginBottom: 32 }}>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 6 }}>Darbni</p>
        <h1 style={{ fontSize: "1.9rem", fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>
          Platform Overview
        </h1>
        <p style={{ color: "#888", fontSize: 14 }}>Live statistics across the entire Darbni platform</p>
      </div>

      <div className="admin-stats-grid">
        {statsCards.map((s, i) => (
          <div key={i} className="admin-stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p className="admin-stat-label">{s.label}</p>
                <p className="admin-stat-value">{s.value}</p>
              </div>
              <div className="admin-stat-icon" style={{ color: s.color, background: s.bg }}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-activity-card">
        <h2 className="admin-activity-title">
          <span style={{ color: "#6c47ff" }}>⚡</span> Recent Activity
        </h2>
        <div className="admin-activity-list">
          {activities.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#888" }}>No recent activity</div>
          ) : (
            activities.map((item, i) => (
              <div key={i} className="admin-activity-item">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="admin-activity-dot" style={{ background: getActivityColor(item.type) }} />
                  <div>
                    <div className="admin-activity-name">{item.message}</div>
                    <div className="admin-activity-sub">{item.time}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}