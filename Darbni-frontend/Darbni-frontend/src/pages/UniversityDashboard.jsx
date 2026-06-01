import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaExclamationCircle, FaUserFriends, FaClipboardCheck,
  FaCheckCircle, FaBuilding, FaUserGraduate,
  FaSpinner, FaCog, FaArrowRight
} from "react-icons/fa";

const BASE_URL = "https://darbni.onrender.com/api";

const getToken = () => localStorage.getItem("token");

const apiFetch = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const barColor = (pct) =>
  pct >= 100 ? "#6c47ff" : pct >= 50 ? "#6c47ff" : "#e74c3c";

const statusPill = (s) => {
  if (s === "approved" || s === "university_approved" || s === "company_approved")
    return { background: "#6c47ff", color: "#fff", border: "none" };
  if (s === "pending" || s === "pending_university" || s === "awaiting_company_approval")
    return { background: "transparent", color: "#888", border: "1px solid #ddd" };
  if (s === "university_rejected" || s === "company_rejected")
    return { background: "#fff3f3", color: "#e74c3c", border: "1px solid #e74c3c" };
  return { background: "transparent", color: "#888", border: "1px solid #ddd" };
};

// نقرأ اسم الجامعة من profile اللي يُحفظ عند اللوجن
const getUniversityName = () => {
  try {
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");
    return (
      profile?.universityId?.name ||
      localStorage.getItem("university") ||
      "Palestine Technical University – Kadoorie"
    );
  } catch {
    return localStorage.getItem("university") || "Palestine Technical University – Kadoorie";
  }
};

export default function UniversityDashboard() {
  const navigate = useNavigate();

  const [statsData, setStatsData]         = useState(null);
  const [recentApps, setRecentApps]       = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const universityName = getUniversityName();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        // 1. إحصائيات الجامعة — GET /supervisor/stats
        // Response: { registeredStudents, pendingReviews, activeTrainees,
        //             completedTrainings, approvedCompanies, pendingCompanies, inProgressTrainings }
        const statsRes = await apiFetch("/supervisor/stats");
        setStatsData(statsRes);

        // 2. آخر الطلبات — GET /applications/university
        // Response: { total, grouped, applications: [...] }
        const appsRes = await apiFetch("/applications/university");
        const allApps = appsRes.applications || [];

        // نعرض آخر 3 طلبات
        const recent = allApps.slice(0, 3).map((app) => ({
          name:
            app.studentId?.firstName && app.studentId?.lastName
              ? `${app.studentId.firstName} ${app.studentId.lastName}`
              : app.studentId?.firstName || "Student",
          company: app.companyId?.name || "—",
          status: app.status,
        }));
        setRecentApps(recent);

        // 3. تقدم الطلاب — نبني من الطلبات النشطة (in_training)
        const active = allApps
          .filter((a) => a.status === "in_training")
          .slice(0, 3);

        const progressList = await Promise.all(
          active.map(async (app) => {
            try {
              // GET /logs/:applicationId
              // Response: { stats: { totalHours, requiredHours, progressPercent }, logs: [...] }
              const logRes = await apiFetch(`/logs/${app._id}`);
              const requiredHours =
                app.trainingId?.totalHours ||
                logRes.stats?.requiredHours ||
                160;
              return {
                name:
                  app.studentId?.firstName && app.studentId?.lastName
                    ? `${app.studentId.firstName} ${app.studentId.lastName}`
                    : "Student",
                company: app.companyId?.name || "—",
                hours: logRes.stats?.totalHours || 0,
                total: requiredHours,
              };
            } catch {
              return null;
            }
          })
        );

        setStudentProgress(progressList.filter(Boolean));
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ── Stats cards — بيانات من /supervisor/stats ──
  const stats = [
    {
      label: "Companies Pending Approval",
      value: statsData ? String(statsData.pendingCompanies ?? 0) : "—",
      icon: <FaExclamationCircle />,
      color: "#e74c3c",
      bg: "#fff3f3",
      highlight: true,
      to: "/supervisor/companies",
    },
    {
      label: "Registered Students",
      value: statsData ? String(statsData.registeredStudents ?? 0) : "—",
      icon: <FaUserFriends />,
      color: "#6c47ff",
      bg: "#f3efff",
      to: "/supervisor/students",
    },
    {
      label: "Pending Reviews",
      value: statsData ? String(statsData.pendingReviews ?? 0) : "—",
      icon: <FaClipboardCheck />,
      color: "#6c47ff",
      bg: "#f3efff",
      to: "/supervisor/applications",
    },
    {
      label: "Completed Trainings",
      value: statsData ? String(statsData.completedTrainings ?? 0) : "—",
      icon: <FaCheckCircle />,
      color: "#27ae60",
      bg: "#f0fdf4",
      to: "/supervisor/reports",
    },
  ];

  const infoCards = [
    {
      label: "Approved Companies",
      value: statsData ? String(statsData.approvedCompanies ?? 0) : "—",
      icon: <FaBuilding />,
      color: "#6c47ff",
      bg: "#f3efff",
      to: "/supervisor/companies",
    },
    {
      label: "Active Trainees",
      value: statsData ? String(statsData.activeTrainees ?? 0) : "—",
      icon: <FaUserGraduate />,
      color: "#6c47ff",
      bg: "#f3efff",
      to: "/supervisor/students",
    },
    {
      label: "In Progress",
      value: statsData ? String(statsData.inProgressTrainings ?? 0) : "—",
      icon: <FaSpinner />,
      color: "#6c47ff",
      bg: "#f3efff",
      to: "/supervisor/progress",
    },
    {
      label: "Settings",
      value: "",
      icon: <FaCog />,
      color: "#6c47ff",
      bg: "#f3efff",
      to: "/supervisor/settings",
      isSettings: true,
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          flexDirection: "column",
          gap: 16,
          color: "#6c47ff",
          fontFamily: "'Poppins', Arial, sans-serif",
        }}
      >
        <FaSpinner style={{ fontSize: 40, animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#888" }}>Loading dashboard...</p>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: 32,
          textAlign: "center",
          color: "#e74c3c",
          fontFamily: "'Poppins', Arial, sans-serif",
        }}
      >
        <FaExclamationCircle style={{ fontSize: 36, marginBottom: 12 }} />
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 16,
            padding: "8px 24px",
            background: "#6c47ff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Poppins', Arial, sans-serif" }}>

      {/* ── Header ── */}
      <div className="uni-dash-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 className="uni-dash-title">University Admin Dashboard</h1>
            <span className="uni-dash-badge">👤 Admin</span>
          </div>
          <p className="uni-dash-sub">{universityName} — Full platform management</p>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="uni-stats-row">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`uni-stat-card${s.highlight ? " uni-stat-highlight" : ""}`}
            onClick={() => navigate(s.to)}
          >
            <div className="uni-stat-top">
              {s.highlight && (
                <div className="uni-stat-alert-icon" style={{ color: s.color }}>
                  {s.icon}
                </div>
              )}
              <div>
                <div className="uni-stat-val">{s.value}</div>
                <div className="uni-stat-label">{s.label}</div>
              </div>
              {!s.highlight && (
                <div className="uni-stat-icon" style={{ color: s.color, background: s.bg }}>
                  {s.icon}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Info Row ── */}
      <div className="uni-info-row">
        {infoCards.map((c, i) => (
          <div key={i} className="uni-info-card" onClick={() => navigate(c.to)}>
            <div className="uni-info-top">
              <span className="uni-info-label">{c.label}</span>
              <div className="uni-info-icon" style={{ color: c.color, background: c.bg }}>
                {c.icon}
              </div>
            </div>
            {c.isSettings ? (
              <div className="uni-info-settings">
                <FaCog style={{ fontSize: 28, color: "#6c47ff", opacity: 0.5 }} />
              </div>
            ) : (
              <div className="uni-info-val">{c.value}</div>
            )}
          </div>
        ))}
      </div>

      {/* ── Bottom Row ── */}
      <div className="uni-bottom-row">

        {/* Recent Applications */}
        <div className="uni-bottom-card">
          <div className="uni-card-head">
            <h3>Recent Applications</h3>
            <span
              className="uni-view-link"
              onClick={() => navigate("/supervisor/applications")}
            >
              View All <FaArrowRight style={{ fontSize: 10 }} />
            </span>
          </div>
          <div className="uni-app-list">
            {recentApps.length === 0 ? (
              <p style={{ color: "#aaa", fontSize: 14, padding: "12px 0" }}>
                No applications yet.
              </p>
            ) : (
              recentApps.map((app, i) => (
                <div className="uni-app-item" key={i}>
                  <div className="uni-app-info">
                    <div className="uni-app-name">{app.name}</div>
                    <div className="uni-app-company">{app.company}</div>
                  </div>
                  <span className="uni-app-status" style={statusPill(app.status)}>
                    {app.status.replace(/_/g, " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Student Progress */}
        <div className="uni-bottom-card">
          <div className="uni-card-head">
            <h3>Student Progress</h3>
            <span
              className="uni-view-link"
              onClick={() => navigate("/supervisor/progress")}
            >
              View All <FaArrowRight style={{ fontSize: 10 }} />
            </span>
          </div>
          <div className="uni-progress-list">
            {studentProgress.length === 0 ? (
              <p style={{ color: "#aaa", fontSize: 14, padding: "12px 0" }}>
                No active trainees right now.
              </p>
            ) : (
              studentProgress.map((s, i) => {
                const pct = Math.round((s.hours / s.total) * 100);
                return (
                  <div className="uni-progress-item" key={i}>
                    <div className="uni-progress-top">
                      <div>
                        <div className="uni-progress-name">{s.name}</div>
                        <div className="uni-progress-company">{s.company}</div>
                      </div>
                      <div className="uni-progress-hours">
                        {s.hours}/{s.total}h
                      </div>
                    </div>
                    <div className="uni-bar-bg">
                      <div
                        className="uni-bar-fill"
                        style={{
                          width: Math.min(pct, 100) + "%",
                          background: barColor(pct),
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}