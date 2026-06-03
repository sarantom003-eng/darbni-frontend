import { useState, useEffect } from "react";
import {
  FaIdCard, FaChartBar, FaSave, FaGlobe,
  FaUsers, FaBuilding, FaChartLine, FaCheckCircle,
  FaSpinner, FaExclamationTriangle, FaCog
} from "react-icons/fa";
import { api } from "../api/client";

export default function SupervisorUniversitySettings() {
  const [settings, setSettings] = useState({
    name:          "",
    address:       "",
    website:       "",
    about:         "",
    requiredHours: 160,
  });
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [toast, setToast]     = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [settingsRes, statsRes] = await Promise.allSettled([
        api("/supervisor/settings"),
        api("/supervisor/stats"),
      ]);

      if (settingsRes.status === "fulfilled") {
        const u = settingsRes.value.university || {};
        setSettings({
          name:          u.name    || "",
          address:       u.address || "",
          website:       u.website || "",
          about:         u.about   || "",
          requiredHours: u.trainingSettings?.requiredHours || 160,
        });
      }

      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value);
      }
    } catch (err) {
      setError(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api("/supervisor/settings", {
        method: "PUT",
        body: {
          name:    settings.name,
          address: settings.address,
          website: settings.website,
          about:   settings.about,
        },
      });
      if (settings.name) localStorage.setItem("university", settings.name);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="sus-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <FaSpinner className="spinner" />
    </div>
  );

  if (error) return (
    <div className="sus-page">
      <div style={{ textAlign: "center", color: "#e74c3c", padding: 40 }}>
        <FaExclamationTriangle size={24} />
        <p>{error}</p>
        <button onClick={fetchData} className="sus-btn-save" style={{ marginTop: 12 }}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="sus-page">
      <div className="sus-header">
        <h1 className="sus-title">University Settings</h1>
        <p className="sus-sub">Configure your university's training platform</p>
      </div>

      <div className="sus-grid">
        {/* Left Column */}
        <div>
          <div className="sus-card">
            <h2 className="sus-card-title">
              <FaIdCard color="#7c5cbf" /> General Information
            </h2>

            <div className="sus-field">
              <label className="sus-label">University Name</label>
              <input
                type="text"
                className="sus-input"
                value={settings.name}
                onChange={e => handleChange("name", e.target.value)}
              />
            </div>

            <div className="sus-field">
              <label className="sus-label">Website</label>
              <div className="sus-input-icon-wrapper">
                <FaGlobe className="sus-input-icon" />
                <input
                  type="text"
                  className="sus-input sus-input-with-icon"
                  value={settings.website}
                  onChange={e => handleChange("website", e.target.value)}
                />
              </div>
            </div>

            <div className="sus-field">
              <label className="sus-label">Address</label>
              <input
                type="text"
                className="sus-input"
                value={settings.address}
                onChange={e => handleChange("address", e.target.value)}
              />
            </div>

            <div className="sus-field">
              <label className="sus-label">About</label>
              <textarea
                className="sus-textarea"
                value={settings.about}
                onChange={e => handleChange("about", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Training Rules — read only */}
          <div className="sus-card" style={{ marginBottom: "24px" }}>
            <h2 className="sus-card-title">
              <FaCog color="#7c5cbf" /> Training Rules
            </h2>
            <div className="sus-field">
              <label className="sus-label">Required Training Hours</label>
              <input
                type="number"
                className="sus-input"
                value={settings.requiredHours}
                disabled
                style={{ background: "#f5f4f9", color: "#888", cursor: "not-allowed" }}
              />
              <p className="sus-hint">Total hours required to complete training</p>
            </div>
          </div>

          {/* Platform Statistics */}
          <div className="sus-card">
            <h2 className="sus-card-title">
              <FaChartBar color="#7c5cbf" /> Platform Statistics
            </h2>
            <div className="sus-stats-grid">
              <div className="sus-stat-item">
                <FaUsers className="sus-stat-icon" />
                <div className="sus-stat-num">{stats?.registeredStudents ?? "—"}</div>
                <div className="sus-stat-lbl">Registered Students</div>
              </div>
              <div className="sus-stat-item">
                <FaBuilding className="sus-stat-icon" />
                <div className="sus-stat-num">{stats?.approvedCompanies ?? "—"}</div>
                <div className="sus-stat-lbl">Approved Companies</div>
              </div>
              <div className="sus-stat-item">
                <FaChartLine className="sus-stat-icon" />
                <div className="sus-stat-num">{stats?.activeTrainees ?? "—"}</div>
                <div className="sus-stat-lbl">Active Trainings</div>
              </div>
              <div className="sus-stat-item">
                <FaCheckCircle className="sus-stat-icon" />
                <div className="sus-stat-num">{stats?.completedTrainings ?? "—"}</div>
                <div className="sus-stat-lbl">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sus-actions">
        <button className="sus-btn-save" onClick={handleSave} disabled={saving}>
          {saving ? <FaSpinner className="spinner" /> : <FaSave />} Save Settings
        </button>
      </div>

      {toast && (
        <div className="sus-toast">
          <FaCheckCircle color="#4caf50" /> Settings saved successfully!
        </div>
      )}
    </div>
  );
}