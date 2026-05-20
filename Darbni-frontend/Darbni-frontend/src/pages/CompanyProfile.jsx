import { useState, useEffect, useRef } from "react";
import { FaBuilding, FaUsers, FaPencilAlt, FaCheck, FaTimes, FaCamera } from "react-icons/fa";
import { profileApi, api } from "../api/client";

function ReadField({ label, value }) {
  return (
    <div className="cp-field-wrap">
      {label && <label className="cp-label">{label}</label>}
      <div className="cp-read-box">{value || <span style={{ color: "#bbb" }}>—</span>}</div>
    </div>
  );
}

function EditField({ label, value, onChange, type = "text", required, hasErr }) {
  return (
    <div className="cp-field-wrap">
      {label && (
        <label className="cp-label">
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

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(false);
  const [errors, setErrors] = useState({});

  const [company, setCompany] = useState({
    name: "", field: "", about: "", location: "", website: "", phone: "", email: "", size: "", city: ""
  });
  const [draft, setDraft] = useState({ ...company });

  const [trainer, setTrainer] = useState({
    firstName: "", lastName: "", jobTitle: "", email: "", specialization: "", bio: ""
  });
  const [trDraft, setTrDraft] = useState({ ...trainer });

  const [companyLogo, setCompanyLogo] = useState(null);
  const [trainerAvatar, setTrainerAvatar] = useState(null);
  const [logoDraft, setLogoDraft] = useState(null);
  const [avatarDraft, setAvatarDraft] = useState(null);

  const logoRef = useRef();
  const avatarRef = useRef();

  // جلب بيانات الشركة من الباك إند
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileApi.me();
        const profileData = data.profile || data;
        
        setCompany({
          name: profileData.name || "",
          field: profileData.industry || "",
          about: profileData.about || "",
          location: profileData.location || "",
          website: profileData.website || "",
          phone: profileData.phone || "",
          email: data.email || "",
          size: profileData.size || "",
          city: profileData.city || "",
        });
        
        setTrainer({
          firstName: profileData.trainer?.firstName || "",
          lastName: profileData.trainer?.lastName || "",
          jobTitle: profileData.trainer?.jobTitle || "",
          email: profileData.trainer?.email || "",
          specialization: profileData.trainer?.specialization || "",
          bio: profileData.trainer?.bio || "",
        });
        
        if (profileData.avatar) setCompanyLogo(profileData.avatar);
        if (profileData.trainer?.avatar) setTrainerAvatar(profileData.trainer.avatar);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const startEdit = () => {
    setDraft({ ...company });
    setTrDraft({ ...trainer });
    setLogoDraft(companyLogo);
    setAvatarDraft(trainerAvatar);
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => { setEditing(false); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!draft.name.trim()) e.name = true;
    if (!draft.field.trim()) e.field = true;
    if (!draft.location.trim()) e.location = true;
    if (!draft.phone.trim()) e.phone = true;
    if (!draft.email.trim()) e.email = true;
    if (!trDraft.firstName.trim()) e.firstName = true;
    if (!trDraft.lastName.trim()) e.lastName = true;
    if (!trDraft.jobTitle.trim()) e.jobTitle = true;
    if (!trDraft.email.trim()) e.trainerEmail = true;
    return e;
  };

  const save = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    
    try {
      await profileApi.update({
        name: draft.name,
        industry: draft.field,
        about: draft.about,
        location: draft.location,
        website: draft.website,
        phone: draft.phone,
        city: draft.city,
        size: draft.size,
        trainer: {
          firstName: trDraft.firstName,
          lastName: trDraft.lastName,
          jobTitle: trDraft.jobTitle,
          email: trDraft.email,
          specialization: trDraft.specialization,
          bio: trDraft.bio,
        }
      });
      
      setCompany({ ...draft });
      setTrainer({ ...trDraft });
      setCompanyLogo(logoDraft);
      setTrainerAvatar(avatarDraft);
      setEditing(false);
      setErrors({});
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await api("/upload/avatar", { method: "POST", body: formData });
      const newUrl = res.avatarUrl;
      if (editing) {
        setLogoDraft(newUrl);
      } else {
        setCompanyLogo(newUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await api("/upload/avatar", { method: "POST", body: formData });
      const newUrl = res.avatarUrl;
      if (editing) {
        setAvatarDraft(newUrl);
      } else {
        setTrainerAvatar(newUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const c = editing ? draft : company;
  const tr = editing ? trDraft : trainer;
  const currentLogo = editing ? logoDraft : companyLogo;
  const currentAvatar = editing ? avatarDraft : trainerAvatar;
  const trainerInitials = `${tr.firstName?.[0] || ""}${tr.lastName?.[0] || ""}`.toUpperCase();

  if (loading) return <div className="loading-state">Loading profile...</div>;

  return (
    <>
      <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoChange} />
      <input ref={avatarRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />

      <div className="cp-page">
        <div className="cp-page-header">
          <div>
            <div className="cp-page-title">Company Profile</div>
            <div className="cp-page-sub">Manage your company and trainer information</div>
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

        <div style={{ position: "relative" }}>
          <div className="cp-hero" />
          <div className="cp-logo-wrap" onClick={() => logoRef.current?.click()}>
            {currentLogo
              ? <img src={currentLogo} alt="logo" className="cp-logo-img" />
              : <FaBuilding className="cp-logo-icon" />
            }
            <div className="cp-logo-overlay"><FaCamera /></div>
          </div>
        </div>

        <div className="cp-hero-bottom">
          <div className="cp-hero-company-name">{c.name}</div>
          <div className="cp-hero-sub">{c.field} · {c.location}</div>
          <div className="cp-hero-tags">
            <span className="cp-hero-tag"><FaBuilding size={10} /> {c.field}</span>
            <span className="cp-hero-tag"><FaUsers size={10} /> {c.size}</span>
            <span className="cp-hero-tag">📍 {c.city}</span>
          </div>
        </div>

        <div className="cp-cards-row">
          <div className="cp-card">
            <div className="cp-card-title"><FaBuilding size={14} /> Company Information</div>
            {!editing ? (
              <>
                <ReadField label="Company Name" value={c.name} />
                <ReadField label="Industry / Field" value={c.field} />
                <ReadField label="About the Company" value={c.about} />
                <div className="cp-row-2">
                  <ReadField label="Location" value={c.location} />
                  <ReadField label="Website" value={c.website} />
                </div>
                <div className="cp-row-2">
                  <ReadField label="Phone" value={c.phone} />
                  <ReadField label="Email" value={c.email} />
                </div>
              </>
            ) : (
              <>
                <EditField label="Company Name" value={draft.name} onChange={v => setDraft(p => ({ ...p, name: v }))} required hasErr={errors.name} />
                <EditField label="Industry / Field" value={draft.field} onChange={v => setDraft(p => ({ ...p, field: v }))} required hasErr={errors.field} />
                <EditTextarea label="About the Company" value={draft.about} onChange={v => setDraft(p => ({ ...p, about: v }))} />
                <div className="cp-row-2">
                  <EditField label="Location" value={draft.location} onChange={v => setDraft(p => ({ ...p, location: v }))} required hasErr={errors.location} />
                  <EditField label="Website" value={draft.website} onChange={v => setDraft(p => ({ ...p, website: v }))} />
                </div>
                <div className="cp-row-2">
                  <EditField label="Phone" value={draft.phone} onChange={v => setDraft(p => ({ ...p, phone: v }))} required hasErr={errors.phone} />
                  <EditField label="Email" type="email" value={draft.email} onChange={v => setDraft(p => ({ ...p, email: v }))} required hasErr={errors.email} />
                </div>
              </>
            )}
          </div>

          <div className="cp-card">
            <div className="cp-card-title"><FaUsers size={14} /> Trainer Information</div>
            <div className="cp-trainer-head">
              <div className="cp-avatar-wrap" onClick={() => avatarRef.current?.click()}>
                {currentAvatar
                  ? <img src={currentAvatar} alt="trainer" className="cp-avatar-img" />
                  : trainerInitials
                }
                <div className="cp-logo-overlay"><FaCamera size={14} /></div>
              </div>
              <div>
                <div className="cp-trainer-name">{tr.firstName} {tr.lastName}</div>
                <div className="cp-trainer-title">{tr.jobTitle}</div>
              </div>
            </div>
            {!editing ? (
              <>
                <div className="cp-row-2">
                  <ReadField label="First Name" value={tr.firstName} />
                  <ReadField label="Last Name" value={tr.lastName} />
                </div>
                <ReadField label="Job Title" value={tr.jobTitle} />
                <ReadField label="Email" value={tr.email} />
                <ReadField label="Specialization" value={tr.specialization} />
                <ReadField label="Bio" value={tr.bio} />
              </>
            ) : (
              <>
                <div className="cp-row-2">
                  <EditField label="First Name" value={trDraft.firstName} onChange={v => setTrDraft(p => ({ ...p, firstName: v }))} required hasErr={errors.firstName} />
                  <EditField label="Last Name" value={trDraft.lastName} onChange={v => setTrDraft(p => ({ ...p, lastName: v }))} required hasErr={errors.lastName} />
                </div>
                <EditField label="Job Title" value={trDraft.jobTitle} onChange={v => setTrDraft(p => ({ ...p, jobTitle: v }))} required hasErr={errors.jobTitle} />
                <EditField label="Email" type="email" value={trDraft.email} onChange={v => setTrDraft(p => ({ ...p, email: v }))} required hasErr={errors.trainerEmail} />
                <EditField label="Specialization" value={trDraft.specialization} onChange={v => setTrDraft(p => ({ ...p, specialization: v }))} />
                <EditTextarea label="Bio" value={trDraft.bio} onChange={v => setTrDraft(p => ({ ...p, bio: v }))} rows={3} />
              </>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="cp-toast">
          <div className="cp-toast-title">✓ Profile Saved</div>
          <div className="cp-toast-sub">Company profile has been updated successfully.</div>
        </div>
      )}
    </>
  );
}