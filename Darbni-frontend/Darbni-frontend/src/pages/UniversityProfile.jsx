import { useState, useRef, useEffect } from "react";
import {
  FaUserTie, FaUniversity, FaPencilAlt, FaCheck, FaTimes,
  FaCamera, FaEnvelope, FaPhone, FaGlobe, FaMapMarkerAlt, FaSpinner
} from "react-icons/fa";
import { profileApi, api } from "../api/client";

function ReadField({ label, value, icon }) {
  return (
    <div className="cp-field-wrap">
      {label && (
        <label className="cp-label">
          {icon && <span style={{ fontSize: 11, color: "#6c47ff" }}>{icon}</span>}
          {label}
        </label>
      )}
      <div className="cp-read-box">{value || <span style={{ color: "#bbb" }}>—</span>}</div>
    </div>
  );
}

function EditField({ label, value, onChange, type = "text", required, hasErr, icon }) {
  return (
    <div className="cp-field-wrap">
      {label && (
        <label className="cp-label">
          {icon && <span style={{ fontSize: 11, color: "#6c47ff" }}>{icon}</span>}
          {label}{required && <span style={{ color: "#e74c3c" }}> *</span>}
        </label>
      )}
      <input
        type={type}
        className={`cp-input${hasErr ? " cp-input-err" : ""}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={label}
      />
      {hasErr && <span className="cp-err-msg">This field is required</span>}
    </div>
  );
}

function EditTextarea({ label, value, onChange, rows = 4 }) {
  return (
    <div className="cp-field-wrap">
      {label && <label className="cp-label">{label}</label>}
      <textarea
        className="cp-input cp-textarea"
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={label}
      />
    </div>
  );
}

export default function UniversityProfile() {
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ بيانات المشرف
  const [supervisor, setSupervisor] = useState({
    firstName: "", lastName: "", title: "",
    email: "", phone: "", department: "", avatar: "",
  });
  const [supDraft, setSupDraft] = useState({ ...supervisor });

  // ✅ بيانات الجامعة
  const [university, setUniversity] = useState({
    name: "", address: "", website: "", about: "",
  });
  const [uniDraft, setUniDraft] = useState({ ...university });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const avatarRef = useRef();

  // ✅ جلب البيانات
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, settingsRes] = await Promise.allSettled([
          profileApi.me(),
          api("/supervisor/settings"),
        ]);

        if (profileRes.status === "fulfilled") {
          const p = profileRes.value.profile || {};
          const email = profileRes.value.email || "";
          setSupervisor({
            firstName: p.firstName || "",
            lastName: p.lastName || "",
            title: p.title || "",
            email: email,
            phone: p.phone || "",
            department: p.department || "",
            avatar: p.avatar || "",
          });
          if (p.avatar) setAvatarPreview(p.avatar);
        }

        if (settingsRes.status === "fulfilled") {
          const u = settingsRes.value.university || {};
          setUniversity({
            name: u.name || "",
            address: u.address || "",
            website: u.website || "",
            about: u.about || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const startEdit = () => {
    setSupDraft({ ...supervisor });
    setUniDraft({ ...university });
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
    setAvatarFile(null);
  };

  const validate = () => {
    const e = {};
    if (!supDraft.firstName.trim()) e.firstName = true;
    if (!supDraft.title.trim()) e.title = true;
    if (!uniDraft.name.trim()) e.uniName = true;
    return e;
  };

  const save = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSaving(true);
    try {
      // ✅ رفع الصورة لو تغيرت
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        await api("/upload/avatar", { method: "POST", body: formData });
      }

      // ✅ تعديل بيانات المشرف
      await profileApi.update({
        firstName: supDraft.firstName,
        lastName: supDraft.lastName,
        title: supDraft.title,
        phone: supDraft.phone,
        department: supDraft.department,
      });

      // ✅ تعديل بيانات الجامعة
      await api("/supervisor/settings", {
        method: "PUT",
        body: {
          name: uniDraft.name,
          address: uniDraft.address,
          website: uniDraft.website,
          about: uniDraft.about,
        },
      });

      setSupervisor({ ...supDraft });
      setUniversity({ ...uniDraft });
      setEditing(false);
      setErrors({});
      setAvatarFile(null);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (err) {
      alert(`Error saving: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const sup = editing ? supDraft : supervisor;
  const uni = editing ? uniDraft : university;
  const fullName = `${sup.firstName} ${sup.lastName}`.trim();
  const initials = fullName
    ? fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  if (loading) return (
    <div className="cp-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <FaSpinner className="spinner" />
    </div>
  );

  return (
    <>
      <input ref={avatarRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />

      <div className="cp-page">
        {/* ── Page Header ── */}
        <div className="cp-page-header">
          <div>
            <div className="cp-page-title">University Profile</div>
            <div className="cp-page-sub">Manage your supervisor and university information</div>
          </div>
          {!editing ? (
            <button className="cp-btn-edit" onClick={startEdit}>
              <FaPencilAlt size={13} /> Edit Profile
            </button>
          ) : (
            <div className="cp-btn-group">
              <button className="cp-btn-cancel" onClick={cancelEdit} disabled={saving}>
                <FaTimes size={13} /> Cancel
              </button>
              <button className="cp-btn-save" onClick={save} disabled={saving}>
                {saving ? <FaSpinner className="spinner" /> : <FaCheck size={13} />} Save Changes
              </button>
            </div>
          )}
        </div>

        {/* ── Banner + Avatar ── */}
        <div style={{ position: "relative" }}>
          <div className="cp-hero" />
          <div className="cp-logo-wrap" onClick={() => editing && avatarRef.current?.click()}>
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" className="cp-logo-img" />
              : <div className="cp-logo-initials">{initials}</div>
            }
            {editing && <div className="cp-logo-overlay"><FaCamera /></div>}
          </div>
        </div>

        <div className="cp-hero-bottom">
          <div className="cp-hero-company-name">{uni.name}</div>
          <div className="cp-hero-tags">
            <span className="cp-hero-tag">🎓 {sup.title || "—"}</span>
            <span className="cp-hero-tag">💻 {sup.department || "—"}</span>
            <span className="cp-hero-tag">📍 {uni.address || "—"}</span>
          </div>
        </div>

        {/* ── Info Cards ── */}
        <div className="cp-cards-row">

          {/* Supervisor Information */}
          <div className="cp-card">
            <div className="cp-card-title"><FaUserTie size={14} /> Supervisor Information</div>
            {!editing ? (
              <>
                <div className="cp-row-2">
                  <ReadField label="First Name" value={sup.firstName} />
                  <ReadField label="Last Name" value={sup.lastName} />
                </div>
                <div className="cp-row-2">
                  <ReadField label="Title" value={sup.title} />
                  <ReadField label="Department" value={sup.department} />
                </div>
                <div className="cp-row-2">
                  <ReadField label="Email" value={sup.email} icon={<FaEnvelope />} />
                  <ReadField label="Phone" value={sup.phone} icon={<FaPhone />} />
                </div>
              </>
            ) : (
              <>
                <div className="cp-row-2">
                  <EditField label="First Name" value={supDraft.firstName} onChange={v => setSupDraft(p => ({ ...p, firstName: v }))} required hasErr={errors.firstName} />
                  <EditField label="Last Name" value={supDraft.lastName} onChange={v => setSupDraft(p => ({ ...p, lastName: v }))} />
                </div>
                <div className="cp-row-2">
                  <EditField label="Title" value={supDraft.title} onChange={v => setSupDraft(p => ({ ...p, title: v }))} required hasErr={errors.title} />
                  <EditField label="Department" value={supDraft.department} onChange={v => setSupDraft(p => ({ ...p, department: v }))} />
                </div>
                <div className="cp-row-2">
                  <ReadField label="Email" value={supDraft.email} icon={<FaEnvelope />} />
                  <EditField label="Phone" value={supDraft.phone} onChange={v => setSupDraft(p => ({ ...p, phone: v }))} icon={<FaPhone />} />
                </div>
              </>
            )}
          </div>

          {/* University Information */}
          <div className="cp-card">
            <div className="cp-card-title"><FaUniversity size={14} /> University Information</div>
            {!editing ? (
              <>
                <ReadField label="University Name" value={uni.name} />
                <div className="cp-row-2">
                  <ReadField label="Address" value={uni.address} icon={<FaMapMarkerAlt />} />
                  <ReadField label="Website" value={uni.website} icon={<FaGlobe />} />
                </div>
                <ReadField label="About" value={uni.about} />
              </>
            ) : (
              <>
                <EditField label="University Name" value={uniDraft.name} onChange={v => setUniDraft(p => ({ ...p, name: v }))} required hasErr={errors.uniName} />
                <div className="cp-row-2">
                  <EditField label="Address" value={uniDraft.address} onChange={v => setUniDraft(p => ({ ...p, address: v }))} icon={<FaMapMarkerAlt />} />
                  <EditField label="Website" value={uniDraft.website} onChange={v => setUniDraft(p => ({ ...p, website: v }))} icon={<FaGlobe />} />
                </div>
                <EditTextarea label="About" value={uniDraft.about} onChange={v => setUniDraft(p => ({ ...p, about: v }))} rows={4} />
              </>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="cp-toast">
          <div className="cp-toast-title">✓ Profile Saved</div>
          <div className="cp-toast-sub">University profile has been updated successfully.</div>
        </div>
      )}
    </>
  );
}