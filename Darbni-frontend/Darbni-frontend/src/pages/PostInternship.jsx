import { useState } from "react";
import { FaPaperPlane, FaFileAlt, FaTrash, FaCheck } from "react-icons/fa";
import { trainingApi } from "../api/client";

const EMPTY_FORM = {
  title: "", field: "", type: "In-person",
  location: "", positions: "", duration: "",
  hours: "40", startDate: "", description: "",
  requirements: "", benefits: "",
};

export default function PostInternship() {
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [errors,     setErrors]     = useState({});
  const [drafts,     setDrafts]     = useState(() => JSON.parse(localStorage.getItem("pi_drafts") || "[]"));
  const [showDrafts, setShowDrafts] = useState(false);
  const [posted,     setPosted]     = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [apiError,   setApiError]   = useState("");

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: false }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = true;
    if (!form.field.trim())       e.field       = true;
    if (!form.positions)          e.positions   = true;
    if (!form.description.trim()) e.description = true;
    return e;
  };

  const publish = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    setApiError("");
    try {
      await trainingApi.create({
        title: form.title,
        field: form.field,
        training_type: form.type.toLowerCase(),
        location: form.location,
        city: form.location,
        totalHours: Math.max(160, Number(form.hours || 40) * Number(form.duration || 4)),
        weeklyHours: Number(form.hours || 0),
        duration_weeks: Number(form.duration || 0),
        capacity: Number(form.positions),
        startDate: form.startDate || undefined,
        description: form.description,
        benefits: form.benefits,
        skills: form.requirements.split(/[\n,]/).map(s => s.trim()).filter(Boolean),
        publishStatus: "published",
      });
      setPosted(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    if (!form.title.trim()) { setErrors({ title: true }); return; }
    const d = [...drafts];
    d.push({
      id: Date.now(), ...form,
      savedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
    setDrafts(d);
    localStorage.setItem("pi_drafts", JSON.stringify(d));
  };

  const loadDraft = (draft) => {
    const { id, savedAt, ...rest } = draft;
    setForm(rest);
    setShowDrafts(false);
    setErrors({});
  };

  const deleteDraft = (id) => {
    const d = drafts.filter(x => x.id !== id);
    setDrafts(d);
    localStorage.setItem("pi_drafts", JSON.stringify(d));
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setPosted(false);
    setErrors({});
  };

  if (posted) return (
    <div className="pi-page">
      <div className="pi-success">
        <div className="pi-success-icon"><FaCheck /></div>
        <h2>Opportunity Posted!</h2>
        <p>Your internship opportunity has been published and students can now apply.</p>
        <button className="pi-btn-primary" onClick={reset}>Post Another</button>
      </div>
    </div>
  );

  return (
    <div className="pi-page">

      <div className="pi-header">
        <div>
          <h1 className="pi-title">Post Internship</h1>
          <p className="pi-sub">Create a new training opportunity for students</p>
        </div>
        <button className="pi-drafts-btn" onClick={() => setShowDrafts(!showDrafts)}>
          <FaFileAlt size={13} />
          Drafts {drafts.length > 0 && `(${drafts.length})`}
        </button>
      </div>

      {apiError && <div className="contact-success" style={{ background: "#ffecec", color: "#b00020", marginBottom: 16 }}>{apiError}</div>}

      {showDrafts && drafts.length > 0 && (
        <div className="pi-card" style={{ marginBottom: 20 }}>
          <div className="pi-card-title">Saved Drafts</div>
          {drafts.map(d => (
            <div key={d.id} className="pi-draft-item">
              <div>
                <div className="pi-draft-name">{d.title || "Untitled"}</div>
                <div className="pi-draft-meta">{d.field && `${d.field} · `}{d.type} · Saved {d.savedAt}</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="pi-btn-primary" onClick={() => loadDraft(d)}>Resume Editing</button>
                <button className="pi-btn-danger"  onClick={() => deleteDraft(d.id)}><FaTrash size={12} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pi-card">
        <div className="pi-card-title">Opportunity Details</div>

        <div className="pi-row-2">
          <div className="pi-field">
            <label className="pi-label">Internship Title <span className="pi-req">*</span></label>
            <input className={`pi-input${errors.title ? " pi-input-err" : ""}`}
              placeholder="e.g. Frontend Development Intern"
              value={form.title} onChange={e => set("title", e.target.value)} />
            {errors.title && <span className="pi-err">Required</span>}
          </div>
          <div className="pi-field">
            <label className="pi-label">Field / Specialization <span className="pi-req">*</span></label>
            <input className={`pi-input${errors.field ? " pi-input-err" : ""}`}
              placeholder="e.g. Web Development"
              value={form.field} onChange={e => set("field", e.target.value)} />
            {errors.field && <span className="pi-err">Required</span>}
          </div>
        </div>

        <div className="pi-field">
          <label className="pi-label">Training Type <span className="pi-req">*</span></label>
          <div className="pi-type-btns">
            {["In-person", "Online", "Hybrid"].map(t => (
              <button key={t} className={`pi-type-btn${form.type === t ? " active" : ""}`}
                onClick={() => set("type", t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="pi-row-3">
          <div className="pi-field">
            <label className="pi-label">Location / City</label>
            <input className="pi-input" placeholder="e.g. Ramallah"
              value={form.location} onChange={e => set("location", e.target.value)} />
          </div>
          <div className="pi-field">
            <label className="pi-label">Available Positions <span className="pi-req">*</span></label>
            <input className={`pi-input${errors.positions ? " pi-input-err" : ""}`}
              type="number" placeholder="5"
              value={form.positions} onChange={e => set("positions", e.target.value)} />
            {errors.positions && <span className="pi-err">Required</span>}
          </div>
          <div className="pi-field">
            <label className="pi-label">Duration (weeks)</label>
            <input className="pi-input" type="number" placeholder="12"
              value={form.duration} onChange={e => set("duration", e.target.value)} />
          </div>
        </div>

        <div className="pi-row-2">
          <div className="pi-field">
            <label className="pi-label">Weekly Hours</label>
            <input className="pi-input" type="number" placeholder="40"
              value={form.hours} onChange={e => set("hours", e.target.value)} />
          </div>
          <div className="pi-field">
            <label className="pi-label">Start Date</label>
            <input className="pi-input" type="date"
              value={form.startDate} onChange={e => set("startDate", e.target.value)} />
          </div>
        </div>

        <div className="pi-field">
          <label className="pi-label">Description <span className="pi-req">*</span></label>
          <textarea className={`pi-input pi-textarea${errors.description ? " pi-input-err" : ""}`}
            placeholder="Describe the internship role, responsibilities..."
            value={form.description} onChange={e => set("description", e.target.value)} />
          {errors.description && <span className="pi-err">Required</span>}
        </div>

        <div className="pi-field">
          <label className="pi-label">Requirements</label>
          <textarea className="pi-input pi-textarea"
            placeholder="List any prerequisites or skills required..."
            value={form.requirements} onChange={e => set("requirements", e.target.value)} />
        </div>

        <div className="pi-field">
          <label className="pi-label">Benefits & Perks</label>
          <textarea className="pi-input pi-textarea"
            placeholder="Describe what trainees will gain..."
            value={form.benefits} onChange={e => set("benefits", e.target.value)} />
        </div>

        {form.type && (
          <div className="pi-preview">
            <span className="pi-preview-label">Preview</span>
            <span className="pi-tag">{form.type}</span>
            {form.location && <span className="pi-tag">📍 {form.location}</span>}
            {form.duration  && <span className="pi-tag">⏱ {form.duration} weeks</span>}
          </div>
        )}

        <div className="pi-actions">
          <button className="pi-btn-primary"    onClick={publish} disabled={loading}>   <FaPaperPlane size={13} /> {loading ? "Publishing..." : "Publish Opportunity"}</button>
          <button className="pi-btn-secondary"  onClick={saveDraft}> <FaFileAlt    size={13} /> Save as Draft</button>
        </div>
      </div>
    </div>
  );
}