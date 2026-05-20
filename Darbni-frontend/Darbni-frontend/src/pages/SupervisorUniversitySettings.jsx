import React, { useState } from "react";
import { 
  FaIdCard, FaCog, FaAt, FaChartBar, FaSave, FaGlobe,
  FaUsers, FaBuilding, FaChartLine, FaCheckCircle 
} from "react-icons/fa";

export default function SupervisorUniversitySettings() {
  const [settings, setSettings] = useState({
    universityName: "Palestine Technical University - Kadoorie",
    abbreviation: "PTUK",
    website: "https://ptuk.edu.ps",
    description: "Palestine Technical University - Kadoorie is a leading university in Palestine offering programs in engineering, IT, and business.",
    studentDomains: "students.ptuk.edu.ps",
    staffDomains: "ptuk.edu.ps",
    requiredHours: 200,
    minWeeks: 8,
    autoCancelDays: 3,
  });
  const [toast, setToast] = useState(false);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save logic
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="sus-page">
      <div className="sus-header">
        <h1 className="sus-title">University Settings</h1>
        <p className="sus-sub">Configure your university's training platform</p>
      </div>

      <div className="sus-grid">
        {/* Left Column */}
        <div>
          {/* General Information */}
          <div className="sus-card" style={{ marginBottom: "24px" }}>
            <h2 className="sus-card-title">
              <FaIdCard color="#7c5cbf" /> General Information
            </h2>

            <div className="sus-field">
              <label className="sus-label">University Name</label>
              <input 
                type="text" 
                className="sus-input" 
                value={settings.universityName} 
                onChange={(e) => handleChange("universityName", e.target.value)} 
              />
            </div>

            <div className="sus-field-row sus-field">
              <div>
                <label className="sus-label">Abbreviation</label>
                <input 
                  type="text" 
                  className="sus-input" 
                  value={settings.abbreviation} 
                  onChange={(e) => handleChange("abbreviation", e.target.value)} 
                />
              </div>
              <div>
                <label className="sus-label">Website</label>
                <div className="sus-input-icon-wrapper">
                  <FaGlobe className="sus-input-icon" />
                  <input 
                    type="text" 
                    className="sus-input sus-input-with-icon" 
                    value={settings.website} 
                    onChange={(e) => handleChange("website", e.target.value)} 
                  />
                </div>
              </div>
            </div>

            <div className="sus-field">
              <label className="sus-label">Description</label>
              <textarea 
                className="sus-textarea" 
                value={settings.description} 
                onChange={(e) => handleChange("description", e.target.value)} 
              />
            </div>
          </div>

          {/* Email Domains */}
          <div className="sus-card">
            <h2 className="sus-card-title">
              <FaAt color="#7c5cbf" /> Email Domains
            </h2>

            <div className="sus-field">
              <label className="sus-label">Student Email Domains</label>
              <input 
                type="text" 
                className="sus-input" 
                value={settings.studentDomains} 
                onChange={(e) => handleChange("studentDomains", e.target.value)} 
              />
              <p className="sus-hint">Emails with this domain are auto-detected as students</p>
            </div>

            <div className="sus-field">
              <label className="sus-label">Staff/Supervisor Domains</label>
              <input 
                type="text" 
                className="sus-input" 
                value={settings.staffDomains} 
                onChange={(e) => handleChange("staffDomains", e.target.value)} 
              />
              <p className="sus-hint">Emails with this domain are auto-detected as supervisors (admins)</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Training Rules */}
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
                onChange={(e) => handleChange("requiredHours", e.target.value)} 
              />
              <p className="sus-hint">Total hours required to complete training</p>
            </div>

            <div className="sus-field">
              <label className="sus-label">Minimum Training Weeks</label>
              <input 
                type="number" 
                className="sus-input" 
                value={settings.minWeeks} 
                onChange={(e) => handleChange("minWeeks", e.target.value)} 
              />
            </div>

            <div className="sus-field">
              <label className="sus-label">Auto-Cancel Deadline (days)</label>
              <input 
                type="number" 
                className="sus-input" 
                value={settings.autoCancelDays} 
                onChange={(e) => handleChange("autoCancelDays", e.target.value)} 
              />
              <p className="sus-hint">Days before unapproved requests are automatically cancelled</p>
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
                <div className="sus-stat-num">47</div>
                <div className="sus-stat-lbl">Registered Students</div>
              </div>
              <div className="sus-stat-item">
                <FaBuilding className="sus-stat-icon" />
                <div className="sus-stat-num">12</div>
                <div className="sus-stat-lbl">Approved Companies</div>
              </div>
              <div className="sus-stat-item">
                <FaChartLine className="sus-stat-icon" />
                <div className="sus-stat-num">8</div>
                <div className="sus-stat-lbl">Active Trainings</div>
              </div>
              <div className="sus-stat-item">
                <FaCheckCircle className="sus-stat-icon" />
                <div className="sus-stat-num">24</div>
                <div className="sus-stat-lbl">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sus-actions">
        <button className="sus-btn-save" onClick={handleSave}>
          <FaSave /> Save Settings
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
