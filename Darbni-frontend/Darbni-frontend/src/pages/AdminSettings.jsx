import { useState, useEffect, useRef } from "react";
import { api } from "../api/client";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoSaved, setLogoSaved] = useState(false);
  const fileRef = useRef(null);

  // State للإعدادات
  const [platformName, setPlatformName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [allowStudent, setAllowStudent] = useState(true);
  const [allowCompany, setAllowCompany] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [maintMsg, setMaintMsg] = useState("");

  // جلب الإعدادات من الباك إند
  const fetchSettings = async () => {
    try {
      const res = await api("/superadmin/platform-settings");
      const settings = res.settings || res;
      setPlatformName(settings.platformName || "Darbni");
      setDescription(settings.platformDescription || "");
      setLogo(settings.platformLogo || null);
      setContactEmail(settings.contactEmail || "");
      setContactPhone(settings.contactPhone || "");
      setWhatsapp(settings.supportWhatsApp || "");
      setAllowStudent(settings.allowStudentSignup ?? true);
      setAllowCompany(settings.allowCompanySignup ?? true);
      setMaintenance(settings.maintenanceMode ?? false);
      setMaintMsg(settings.maintenanceMessage || "Platform is under maintenance. Please check back later.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // حفظ الإعدادات
  const handleSave = async () => {
    setSaving(true);
    try {
      await api("/superadmin/platform-settings", {
        method: "PUT",
        body: {
          platformName,
          platformDescription: description,
          contactEmail,
          contactPhone,
          supportWhatsApp: whatsapp,
          allowStudentSignup: allowStudent,
          allowCompanySignup: allowCompany,
          maintenanceMode: maintenance,
          maintenanceMessage: maintMsg,
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // رفع الشعار
  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("logo", file);
    
    try {
      const res = await api("/superadmin/upload-logo", { method: "POST", body: formData });
      setLogo(res.logoUrl);
      setLogoSaved(true);
      setTimeout(() => setLogoSaved(false), 2000);
      // تحديث الـ Layout
      window.dispatchEvent(new Event("adminLogoUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  // حذف الشعار
  const handleRemoveLogo = async () => {
    try {
      await api("/superadmin/logo", { method: "DELETE" });
      setLogo(null);
      window.dispatchEvent(new Event("adminLogoUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const Toggle = ({ value, onChange }) => (
    <div className={`as-toggle ${value ? "on" : "off"}`} onClick={() => onChange(!value)}>
      <div className="as-toggle-knob" />
    </div>
  );

  if (loading) return <div className="loading-state">Loading settings...</div>;

  return (
    <div className="au-page">
      <div style={{ marginBottom: 28 }}>
        <h1 className="au-title">⚙ Platform Settings</h1>
        <p className="au-sub">Configure global platform behavior</p>
      </div>

      {/* Platform Identity */}
      <div className="as-card">
        <h2 className="as-section-title">🌐 Platform Identity</h2>

        <div className="as-field">
          <label>Platform Name</label>
          <input className="as-inp" value={platformName} onChange={e => setPlatformName(e.target.value)} />
        </div>

        <div className="as-field">
          <label>Platform Description</label>
          <textarea className="as-inp" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="as-field">
          <label>Platform Logo</label>
          {logo ? (
            <div>
              <img src={logo} alt="logo" className="as-logo-preview" />
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button className="as-btn-outline" onClick={() => fileRef.current.click()}>↑ Change Logo</button>
                <button className="as-btn-purple" onClick={handleLogoChange}>
                  💾 {logoSaved ? "Saved!" : "Save Logo"}
                </button>
                <button className="as-btn-danger" onClick={handleRemoveLogo}>🗑 Remove Logo</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="as-logo-placeholder" onClick={() => fileRef.current.click()}>
                <span>📷</span>
              </div>
              <button className="as-btn-outline" style={{ marginTop: 10 }} onClick={() => fileRef.current.click()}>
                ↑ Upload Logo
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoChange} />
          <p className="as-hint">Recommended: square image (PNG, SVG, or JPG)</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="as-card">
        <h2 className="as-section-title">📞 Contact Information</h2>
        <div className="as-field">
          <label>Contact Email</label>
          <input className="as-inp" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
        </div>
        <div className="as-field">
          <label>Contact Phone</label>
          <input className="as-inp" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
        </div>
        <div className="as-field">
          <label>Support WhatsApp</label>
          <input className="as-inp" placeholder="+970599..." value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
        </div>
      </div>

      {/* Registration Control */}
      <div className="as-card">
        <h2 className="as-section-title">🎓 Registration Control</h2>
        <div className="as-toggle-row">
          <div>
            <strong>Allow Student Signup</strong>
            <p>Let students create accounts</p>
          </div>
          <Toggle value={allowStudent} onChange={setAllowStudent} />
        </div>
        <div className="as-toggle-row">
          <div>
            <strong>Allow Company Signup</strong>
            <p>Let companies register on the platform</p>
          </div>
          <Toggle value={allowCompany} onChange={setAllowCompany} />
        </div>
      </div>

      {/* System */}
      <div className="as-card" style={{ background: "#fff8f0", borderColor: "#fed7aa" }}>
        <h2 className="as-section-title">⚠ System</h2>
        <div className="as-toggle-row">
          <div>
            <strong>Maintenance Mode</strong>
            <p>Hide platform from non-admin users</p>
          </div>
          <Toggle value={maintenance} onChange={setMaintenance} />
        </div>
        <p className="as-warning">⚠ Enabling this will prevent all users except Super Admin from accessing the platform</p>

        {maintenance && (
          <div className="as-field" style={{ marginTop: 16 }}>
            <label>Maintenance Message</label>
            <textarea
              className="as-inp"
              rows={3}
              value={maintMsg}
              onChange={e => setMaintMsg(e.target.value)}
            />
            <p className="as-hint">This message will be shown to all users during maintenance</p>
          </div>
        )}
      </div>

      {saved && <div className="au-toast">✓ Settings saved successfully!</div>}

      <button className="as-save-all-btn" onClick={handleSave} disabled={saving}>
        💾 {saving ? "Saving..." : "Save All Settings"}
      </button>
    </div>
  );
}