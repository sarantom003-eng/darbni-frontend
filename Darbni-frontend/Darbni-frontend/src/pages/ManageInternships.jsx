import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaEyeSlash, FaTrash, FaChevronRight, FaTimes, FaMapMarkerAlt, FaUsers, FaClock } from "react-icons/fa";
import { trainingApi } from "../api/client";

const MOCK_JOBS = [
  { id: 1, title: "Frontend Development Intern", field: "Web Development", type: "In-person", location: "Ramallah", positions: 5,  filled: 3,  hours: 40, status: "active",  postedAt: "Mar 1, 2026"  },
  { id: 2, title: "Data Analysis Trainee",       field: "Data Science",    type: "Online",    location: "Remote",   positions: 10, filled: 10, hours: 30, status: "full",    postedAt: "Feb 20, 2026" },
  { id: 3, title: "Network Security Intern",     field: "Cybersecurity",   type: "Hybrid",    location: "Nablus",   positions: 3,  filled: 1,  hours: 35, status: "hidden",  postedAt: "Feb 15, 2026" },
];

const statusConfig = {
  active: { label: "Active",  bg: "#4a3fa0", color: "#fff"    },
  full:   { label: "Full",    bg: "#f0eeff", color: "#4a3fa0" },
  hidden: { label: "Hidden",  bg: "#f5f5f5", color: "#888"    },
};

function StatusBadge({ status }) {
  const c = statusConfig[status] || { label: status, bg: "#eee", color: "#555" };
  return (
    <span className="mi-badge" style={{ background: c.bg, color: c.color }}>{c.label}</span>
  );
}

function ViewModal({ job, onClose, onEdit }) {
  const rows = [
    { label: "Field",        value: job.field },
    { label: "Type",         value: job.type },
    { label: "Location",     value: job.location },
    { label: "Positions",    value: `${job.filled}/${job.positions} filled` },
    { label: "Weekly Hours", value: `${job.hours}h` },
    { label: "Status",       value: job.status.charAt(0).toUpperCase() + job.status.slice(1) },
  ];
  return (
    <div className="mi-overlay" onClick={onClose}>
      <div className="mi-modal" onClick={e => e.stopPropagation()}>
        <button className="mi-modal-close" onClick={onClose}><FaTimes /></button>
        <h3 className="mi-modal-title">{job.title}</h3>
        <div className="mi-view-grid">
          {rows.map(r => (
            <div key={r.label} className="mi-view-field">
              <div className="mi-view-label">{r.label}</div>
              <div className="mi-view-val">{r.value}</div>
            </div>
          ))}
        </div>
        <div className="mi-modal-actions">
          <button className="mi-btn-cancel" onClick={onClose}>Close</button>
          <button className="mi-btn-primary" onClick={() => onEdit(job)}><FaEdit size={13} /> Edit</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ job, onClose, onSave }) {
  const [title,    setTitle]    = useState(job.title);
  const [field,    setField]    = useState(job.field);
  const [location, setLocation] = useState(job.location);
  const [type,     setType]     = useState(job.type);
  const [capacity, setCapacity] = useState(String(job.positions));
  const [hours,    setHours]    = useState(String(job.hours));
  const [desc,     setDesc]     = useState(job.description || "");

  const handleSave = () => {
    if (!title.trim() || !field.trim()) return;
    onSave({ ...job, title, field, location, type, positions: Number(capacity), hours: Number(hours), description: desc });
  };

  return (
    <div className="mi-overlay" onClick={onClose}>
      <div className="mi-modal" onClick={e => e.stopPropagation()}>
        <button className="mi-modal-close" onClick={onClose}><FaTimes /></button>
        <h3 className="mi-modal-title">Edit: {job.title}</h3>
        <div className="mi-edit-grid">
          <div className="mi-edit-field"><label className="mi-edit-label">Title</label>        <input className="mi-input" value={title}    onChange={e => setTitle(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Field</label>        <input className="mi-input" value={field}    onChange={e => setField(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Location</label>     <input className="mi-input" value={location} onChange={e => setLocation(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Type</label>         <input className="mi-input" value={type}     onChange={e => setType(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Capacity</label>     <input className="mi-input" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Weekly Hours</label> <input className="mi-input" type="number" value={hours}    onChange={e => setHours(e.target.value)} /></div>
        </div>
        <div className="mi-edit-field" style={{ marginTop: 4 }}>
          <label className="mi-edit-label">Description</label>
          <textarea className="mi-input mi-textarea" placeholder="Update description..." value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div className="mi-modal-actions">
          <button className="mi-btn-cancel"  onClick={onClose}>Cancel</button>
          <button className="mi-btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ onClose, onConfirm }) {
  return (
    <div className="mi-overlay" onClick={onClose}>
      <div className="mi-modal mi-modal-sm" onClick={e => e.stopPropagation()}>
        <button className="mi-modal-close" onClick={onClose}><FaTimes /></button>
        <h3 className="mi-modal-title">Delete Opportunity</h3>
        <p className="mi-delete-msg">Are you sure you want to delete this internship opportunity? This action cannot be undone.</p>
        <div className="mi-modal-actions">
          <button className="mi-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="mi-btn-delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const mapJob = (t) => ({
  id: t._id,
  title: t.title,
  field: t.field,
  type: (t.training_type || "").replace("in-person", "In-person").replace("online", "Online").replace("hybrid", "Hybrid"),
  location: t.city || t.location || "",
  positions: t.capacity || 0,
  filled: t.acceptedCount || 0,
  hours: t.weeklyHours || 0,
  status: t.isFull ? "full" : t.isActive ? "active" : "hidden",
  postedAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
  description: t.description || "",
});

export default function ManageInternships() {
  const [jobs,      setJobs]      = useState([]);
  const [viewJob,   setViewJob]   = useState(null);
  const [editJob,   setEditJob]   = useState(null);
  const [deleteJob, setDeleteJob] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  const loadJobs = () => {
    setLoading(true);
    setError("");
    trainingApi.mine()
      .then(data => setJobs((data.trainings || []).map(mapJob)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadJobs(); }, []);

  const toggleHide = async (id) => {
    try {
      await trainingApi.toggle(id);
      loadJobs();
    } catch (err) { setError(err.message); }
  };

  /* old local fallback kept for reference */
  const toggleHideLocal = (id) => setJobs(js => js.map(j =>
    j.id === id ? { ...j, status: j.status === "hidden" ? "active" : "hidden" } : j
  ));

  const toggleFull = (id) => setJobs(js => js.map(j =>
    j.id === id ? { ...j, status: j.status === "full" ? "active" : "full" } : j
  ));

  const confirmDelete = async () => {
    try {
      await trainingApi.remove(deleteJob.id);
      setJobs(js => js.filter(j => j.id !== deleteJob.id));
      setDeleteJob(null);
    } catch (err) { setError(err.message); }
  };

  const saveEdit = async (updated) => {
    try {
      await trainingApi.update(updated.id, {
        title: updated.title,
        field: updated.field,
        city: updated.location,
        location: updated.location,
        training_type: updated.type.toLowerCase(),
        capacity: Number(updated.positions),
        weeklyHours: Number(updated.hours),
        description: updated.description,
      });
      setEditJob(null);
      setViewJob(null);
      loadJobs();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="mi-page">
      <div className="mi-header">
        <h1 className="mi-title">Manage Internships</h1>
        <p className="mi-sub">View, edit, hide or remove posted opportunities</p>
      </div>

      <div className="mi-list">
        {error && <div className="mi-empty" style={{ color: "#b00020" }}>{error}</div>}
        {loading && <div className="mi-empty">Loading internships...</div>}
        {!loading && jobs.length === 0 && <div className="mi-empty">No internships posted yet.</div>}
        {jobs.map(job => (
          <div key={job.id} className="mi-item" onClick={() => setViewJob(job)}>
            <div className="mi-item-left">
              <div className="mi-item-top">
                <span className="mi-item-title">{job.title}</span>
                <StatusBadge status={job.status} />
              </div>
              <div className="mi-item-meta">
                <span><FaMapMarkerAlt size={11} /> {job.location}</span>
                <span><FaUsers size={11} /> {job.filled}/{job.positions} filled</span>
                <span><FaClock size={11} /> {job.hours}h/week</span>
                <span>{job.type} · {job.field}</span>
                <span>Posted {job.postedAt}</span>
              </div>
            </div>
            <div className="mi-item-actions" onClick={e => e.stopPropagation()}>
              <button className="mi-icon-btn"          onClick={() => setEditJob(job)}>    <FaEdit />    </button>
              <button className="mi-icon-btn"          onClick={() => toggleHide(job.id)}> {job.status === "hidden" ? <FaEye /> : <FaEyeSlash />} </button>
              <button className="mi-icon-btn mi-icon-red" onClick={() => setDeleteJob(job)}> <FaTrash /> </button>
              {job.status !== "full" && (
                <button className="mi-mark-full-btn" onClick={() => toggleFull(job.id)}>Mark Full</button>
              )}
              <FaChevronRight className="mi-chevron" />
            </div>
          </div>
        ))}
      </div>

      {viewJob && !editJob && <ViewModal job={viewJob} onClose={() => setViewJob(null)} onEdit={(j) => { setEditJob(j); setViewJob(null); }} />}
      {editJob  && <EditModal   job={editJob}   onClose={() => setEditJob(null)}   onSave={saveEdit} />}
      {deleteJob && <DeleteModal onClose={() => setDeleteJob(null)} onConfirm={confirmDelete} />}
    </div>
  );
}