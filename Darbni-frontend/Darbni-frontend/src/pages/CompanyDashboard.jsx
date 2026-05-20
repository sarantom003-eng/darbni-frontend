import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaUsers, FaGraduationCap, FaCheckCircle } from "react-icons/fa";
import { profileApi, applicationApi } from "../api/client";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // جلب الإحصائيات وأحدث الطلبات
  useEffect(() => {
    let alive = true;
    const fetchData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.allSettled([
          profileApi.stats(),
          applicationApi.company(),
        ]);

        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value);
        }
        if (appsRes.status === "fulfilled") {
          const data = appsRes.value;
          // جلب أول 3 طلبات pending (أو جميعها)
          const pendingApps = data.pending || [];
          setRecentApps(pendingApps.slice(0, 3));
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
    { label: "Active Opportunities", value: stats.activeOpportunities || 0, icon: <FaBriefcase />, to: "/company/internships" },
    { label: "Total Applicants",     value: stats.totalApplicants || 0,     icon: <FaUsers />,        to: "/company/students" },
    { label: "Active Trainees",      value: stats.activeTrainees || 0,      icon: <FaGraduationCap />, to: "/company/progress" },
    { label: "Completed Trainings",  value: stats.completedTrainings || 0,  icon: <FaCheckCircle />,  to: "/company/reports" },
  ] : [];

  const statusStyle = (status) => {
    if (status === "company_approved" || status === "university_approved") {
      return { background: "#6c47ff", color: "#fff", border: "none" };
    }
    return { background: "transparent", color: "#888", border: "1px solid #ddd" };
  };

  const getStatusLabel = (status) => {
    const labels = {
      awaiting_company_approval: "Pending",
      company_approved: "Approved",
      pending_university: "Under Review",
      university_approved: "Accepted",
    };
    return labels[status] || status;
  };

  if (loading) return <div className="loading-state">Loading dashboard...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="dash-content">

      {/* Header */}
      <div className="dash-title">
        <h1>Company Dashboard</h1>
        <p>Manage training programs and applications</p>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        {statsCards.map((s) => (
          <div
            key={s.label}
            className="dash-stat"
            onClick={() => navigate(s.to)}
            style={{ cursor: "pointer" }}
          >
            <div className="dash-stat-top">
              <span>{s.label}</span>
              <div className="dash-stat-icon">{s.icon}</div>
            </div>
            <div className="dash-stat-val">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Bottom Cards */}
      <div className="dash-bottom">

        {/* Recent Applications */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Recent Applications</h3>
            <span
              className="dash-view-link"
              onClick={() => navigate("/company/students")}
              style={{ cursor: "pointer" }}
            >
              View All →
            </span>
          </div>
          {recentApps.length === 0 ? (
            <div className="empty-state">No pending applications</div>
          ) : (
            recentApps.map((app, idx) => {
              const studentName = app.studentId?.firstName || "Student";
              const field = app.trainingId?.field || "Training";
              return (
                <div className="dash-app-item" key={idx}>
                  <div>
                    <div className="dash-app-name">{studentName}</div>
                    <div className="dash-app-field">{field}</div>
                  </div>
                  <span className="dash-status" style={statusStyle(app.status)}>
                    {getStatusLabel(app.status)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Training Progress - يحتاج API منفصل */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Training Progress</h3>
            <span
              className="dash-view-link"
              onClick={() => navigate("/company/progress")}
              style={{ cursor: "pointer" }}
            >
              View All →
            </span>
          </div>
          <div className="empty-state">Select a trainee to view progress</div>
        </div>
      </div>
    </div>
  );
}