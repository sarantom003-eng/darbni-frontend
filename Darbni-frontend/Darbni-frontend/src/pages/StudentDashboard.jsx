import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFileAlt, FaBook, FaStar, FaArrowRight, FaCheckCircle, FaClock } from "react-icons/fa";
import { applicationApi, trainingApi, profileApi } from "../api/client";

function StudentDashboard() {
  const navigate = useNavigate();

  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const studentName = profile.firstName || localStorage.getItem("firstName") || "Student";

  const [applications, setApplications] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [appsRes, trainingsRes, statsRes] = await Promise.allSettled([
          applicationApi.mine(),
          trainingApi.list(),
          profileApi.stats(),
        ]);

        if (appsRes.status === "fulfilled") {
          const data = appsRes.value;
          setApplications(Array.isArray(data) ? data : data.applications || []);
        }
        if (trainingsRes.status === "fulfilled") {
          const data = trainingsRes.value;
          setTrainings(Array.isArray(data) ? data : data.trainings || []);
        }
        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalApps = applications.length;
  const pendingApps = applications.filter(a =>
    ["awaiting_company_approval", "company_approved", "pending_university"].includes(a.status)
  ).length;
  const acceptedApps = applications.filter(a =>
    ["university_approved", "company_final_approved", "in_training", "completed"].includes(a.status)
  ).length;
  const totalTrainings = trainings.length;
  
  // ✅ هذين السطرين فقط اللي تغيروا:
  const totalLogs = stats?.totalProgressEntries || 0;
  const avgRating = stats?.averageRatingGiven || 0;

  const statsCards = [
    {
      label: "Available Trainings",
      value: loading ? "..." : totalTrainings,
      sub: "Matching your profile",
      icon: <FaSearch />,
      color: "#4a3fa0",
      bg: "#f0eff8",
      path: "/student/feed",
    },
    {
      label: "Applications",
      value: loading ? "..." : totalApps,
      sub: `${pendingApps} pending, ${acceptedApps} accepted`,
      icon: <FaFileAlt />,
      color: "#0ea5e9",
      bg: "#f0f9ff",
      path: "/student/applications",
    },
    {
      label: "Progress Entries",
      value: loading ? "..." : totalLogs,
      sub: "This month",
      icon: <FaBook />,
      color: "#10b981",
      bg: "#f0fdf4",
      path: "/student/logbook",
    },
    {
      label: "Company Rating",
      value: loading ? "..." : avgRating ? avgRating.toFixed(1) : "—",
      sub: "Average given",
      icon: <FaStar />,
      color: "#f59e0b",
      bg: "#fffbeb",
      path: "/student/rate",
    },
  ];

  const recentApps = applications.slice(0, 3);

  const statusStyle = (s) => {
    if (["university_approved", "company_final_approved", "in_training", "completed", "Confirmed"].includes(s))
      return { bg: "#4a3fa0", color: "#fff" };
    if (["awaiting_company_approval", "company_approved", "pending_university", "Pending"].includes(s))
      return { bg: "#f3f4f6", color: "#666" };
    if (["company_rejected", "university_rejected", "auto_cancelled"].includes(s))
      return { bg: "#e74c3c", color: "#fff" };
    return { bg: "#eee", color: "#333" };
  };

  const statusLabel = (s) => {
    const labels = {
      awaiting_company_approval: "Pending",
      company_approved: "Approved",
      company_rejected: "Rejected",
      pending_university: "Under Review",
      university_approved: "Accepted",
      university_rejected: "Rejected",
      company_final_approved: "Final Approved",
      in_training: "In Training",
      completed: "Completed",
      auto_cancelled: "Cancelled",
      draft: "Draft",
    };
    return labels[s] || s;
  };

  return (
    <div style={{ fontFamily: "'Poppins', Arial, sans-serif" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1729", marginBottom: 4 }}>
          Welcome back, {studentName} 👋
        </h1>
        <p style={{ fontSize: 14, color: "#999", margin: 0 }}>Here's your training overview</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {statsCards.map((s, i) => (
          <div
            key={i}
            onClick={() => navigate(s.path)}
            style={{
              background: "#fff", border: "1px solid #ebebef", borderRadius: 16,
              padding: "20px 20px 16px", cursor: "pointer",
              transition: "box-shadow 0.2s, transform 0.15s",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(74,63,160,0.10)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: s.bg, color: s.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, marginBottom: 14,
            }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#1a1729", lineHeight: 1, marginBottom: 6 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "#bbb" }}>{s.sub}</div>
            <div style={{
              position: "absolute", right: -16, top: -16,
              width: 72, height: 72, borderRadius: "50%",
              background: s.bg, opacity: 0.7,
            }} />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: "#fff", border: "1px solid #ebebef", borderRadius: 16, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a1729", margin: 0 }}>Recent Applications</h2>
            <span onClick={() => navigate("/student/applications")} style={{ fontSize: 12, color: "#4a3fa0", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
              View All <FaArrowRight style={{ fontSize: 10 }} />
            </span>
          </div>

          {loading ? (
            <div style={{ color: "#aaa", fontSize: 13 }}>Loading...</div>
          ) : recentApps.length === 0 ? (
            <div style={{ color: "#aaa", fontSize: 13 }}>No applications yet</div>
          ) : (
            recentApps.map((a, i) => {
              const companyName = a.companyId?.name || a.companyName || "Company";
              const field = a.trainingId?.field || a.field || "—";
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i < recentApps.length - 1 ? "1px solid #f2f2f4" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: "#f0eff8", color: "#4a3fa0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {companyName.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1729", marginBottom: 2 }}>{companyName}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{field}</div>
                    </div>
                  </div>
                  <span style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: statusStyle(a.status).bg,
                    color: statusStyle(a.status).color,
                  }}>
                    {statusLabel(a.status)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div style={{ background: "#fff", border: "1px solid #ebebef", borderRadius: 16, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a1729", margin: 0 }}>Training Progress</h2>
            <span onClick={() => navigate("/student/logbook")} style={{ fontSize: 12, color: "#4a3fa0", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
              View All <FaArrowRight style={{ fontSize: 10 }} />
            </span>
          </div>

          {loading ? (
            <div style={{ color: "#aaa", fontSize: 13 }}>Loading...</div>
          ) : applications.filter(a => a.status === "in_training" || a.status === "completed").length === 0 ? (
            <div style={{ color: "#aaa", fontSize: 13 }}>No active training yet</div>
          ) : (
            applications.filter(a => a.status === "in_training" || a.status === "completed").slice(0, 3).map((a, i, arr) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 0",
                borderBottom: i < arr.length - 1 ? "1px solid #f2f2f4" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ color: a.status === "completed" ? "#10b981" : "#f59e0b", fontSize: 15, flexShrink: 0 }}>
                    {a.status === "completed" ? <FaCheckCircle /> : <FaClock />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1729", marginBottom: 2 }}>
                      {a.companyId?.name || "Company"}
                    </div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>
                      {a.trainingId?.field || "Training"}
                    </div>
                  </div>
                </div>
                <span style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: statusStyle(a.status).bg,
                  color: statusStyle(a.status).color,
                  flexShrink: 0,
                }}>
                  {statusLabel(a.status)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;