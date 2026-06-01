import { useState, useRef } from "react";
import {
  FaUserTie, FaUniversity, FaPencilAlt, FaCheck, FaTimes,
  FaCamera, FaEnvelope, FaPhone, FaGlobe, FaMapMarkerAlt
} from "react-icons/fa";

const DEFAULT_SUPERVISOR = {
  fullName:   "Dr. Mariam Al-Khatib",
  title:      "Training Coordinator",
  email:      "m.alkhatib@university.edu",
  phone:      "+962 79 123 4567",
  department: "Computer Science",
};

const DEFAULT_UNIVERSITY = {
  name:    "Jordan University of Science & Technology",
  address: "Irbid, Jordan",
  website: "https://just.edu.jo",
  about:   "Overseeing student internship programs and ensuring quality training experiences across partner companies.",
};

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
  const [toast,   setToast]   = useState(false);
  const [errors,  setErrors]  = useState({});

  const [supervisor,  setSupervisor]  = useState(DEFAULT_SUPERVISOR);
  const [supDraft,    setSupDraft]    = useState(DEFAULT_SUPERVISOR);
  const [university,  setUniversity]  = useState(DEFAULT_UNIVERSITY);
  const [uniDraft,    setUniDraft]    = useState(DEFAULT_UNIVERSITY);

  const [avatar,      setAvatar]      = useState(null);
  const [avatarDraft, setAvatarDraft] = useState(null);

  const avatarRef = useRef();

  const startEdit = () => {
    setSupDraft({ ...supervisor });
    setUniDraft({ ...university });
    setAvatarDraft(avatar);
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => { setEditing(false); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!supDraft.fullName.trim())  e.fullName = true;
    if (!supDraft.title.trim())     e.title    = true;
    if (!supDraft.email.trim())     e.email    = true;
    if (!uniDraft.name.trim())      e.uniName  = true;
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSupervisor({ ...supDraft });
    setUniversity({ ...uniDraft });
    setAvatar(avatarDraft);
    setEditing(false);
    setErrors({});
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    editing ? setAvatarDraft(url) : setAvatar(url);
  };

  const sup = editing ? supDraft   : supervisor;
  const uni = editing ? uniDraft   : university;
  const currentAvatar = editing ? avatarDraft : avatar;
  const initials = sup.fullName
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
              <button className="cp-btn-cancel" onClick={cancelEdit}>
                <FaTimes size={13} /> Cancel
              </button>
              <button className="cp-btn-save" onClick={save}>
                <FaCheck size={13} /> Save Changes
              </button>
            </div>
          )}
        </div>

        {/* ── Banner + Avatar ── */}
        <div style={{ position: "relative" }}>
          <div className="cp-hero" />
          <div className="cp-logo-wrap" onClick={() => avatarRef.current?.click()}>
            {currentAvatar
              ? <img src={currentAvatar} alt="avatar" className="cp-logo-img" />
              : <FaUserTie className="cp-logo-icon" />
            }
            <div className="cp-logo-overlay"><FaCamera /></div>
          </div>
        </div>

        <div className="cp-hero-bottom">
          <div className="cp-hero-company-name">{uni.name}</div>
          <div className="cp-hero-tags">
            <span className="cp-hero-tag">🎓 {sup.title}</span>
            <span className="cp-hero-tag">💻 {sup.department}</span>
            <span className="cp-hero-tag">📍 {uni.address}</span>
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
                  <ReadField label="Full Name" value={sup.fullName} />
                  <ReadField label="Title" value={sup.title} />
                </div>
                <div className="cp-row-2">
                  <ReadField label="Email" value={sup.email} icon={<FaEnvelope />} />
                  <ReadField label="Phone" value={sup.phone} icon={<FaPhone />} />
                </div>
                <ReadField label="Department" value={sup.department} />
              </>
            ) : (
              <>
                <div className="cp-row-2">
                  <EditField label="Full Name" value={supDraft.fullName} onChange={v => setSupDraft(p => ({ ...p, fullName: v }))} required hasErr={errors.fullName} />
                  <EditField label="Title" value={supDraft.title} onChange={v => setSupDraft(p => ({ ...p, title: v }))} required hasErr={errors.title} />
                </div>
                <div className="cp-row-2">
                  <EditField label="Email" type="email" value={supDraft.email} onChange={v => setSupDraft(p => ({ ...p, email: v }))} required hasErr={errors.email} icon={<FaEnvelope />} />
                  <EditField label="Phone" value={supDraft.phone} onChange={v => setSupDraft(p => ({ ...p, phone: v }))} icon={<FaPhone />} />
                </div>
                <EditField label="Department" value={supDraft.department} onChange={v => setSupDraft(p => ({ ...p, department: v }))} />
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
