import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaEyeSlash, FaTrash, FaChevronRight, FaTimes, FaMapMarkerAlt, FaUsers, FaClock, FaPlus } from "react-icons/fa";
import { trainingApi } from "../api/client";

const statusConfig = {
  active: { label: "Active", bg: "#4a3fa0", color: "#fff" },
  full: { label: "Full", bg: "#f0eeff", color: "#4a3fa0" },
  hidden: { label: "Hidden", bg: "#f5f5f5", color: "#888" },
};

function StatusBadge({ status }) {
  const c = statusConfig[status] || { label: status, bg: "#eee", color: "#555" };
  return (
    <span className="mi-badge" style={{ background: c.bg, color: c.color }}>{c.label}</span>
  );
}

function ViewModal({ job, onClose, onEdit }) {
  const rows = [
    { label: "Field", value: job.field },
    { label: "Type", value: job.type },
    { label: "Location", value: job.location },
    { label: "Positions", value: `${job.filled}/${job.positions} filled` },
    { label: "Weekly Hours", value: `${job.hours}h` },
    { label: "Total Hours", value: `${job.totalHours || "N/A"}h` },
    { label: "Status", value: job.status.charAt(0).toUpperCase() + job.status.slice(1) },
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
        {job.description && (
          <div className="mi-view-description">
            <div className="mi-view-label">Description</div>
            <div className="mi-view-val">{job.description}</div>
          </div>
        )}
        {job.benefits && (
          <div className="mi-view-description">
            <div className="mi-view-label">Benefits</div>
            <div className="mi-view-val">{job.benefits}</div>
          </div>
        )}
        <div className="mi-modal-actions">
          <button className="mi-btn-cancel" onClick={onClose}>Close</button>
          <button className="mi-btn-primary" onClick={() => onEdit(job)}><FaEdit size={13} /> Edit</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ job, onClose, onSave }) {
  const [title, setTitle] = useState(job.title);
  const [field, setField] = useState(job.field);
  const [location, setLocation] = useState(job.location);
  const [type, setType] = useState(job.type);
  const [capacity, setCapacity] = useState(String(job.positions));
  const [hours, setHours] = useState(String(job.hours));
  const [totalHours, setTotalHours] = useState(String(job.totalHours || "160"));
  const [desc, setDesc] = useState(job.description || "");
  const [benefits, setBenefits] = useState(job.benefits || "");

  const handleSave = () => {
    if (!title.trim() || !field.trim()) return;
    if (Number(totalHours) < 160) {
      alert("Total hours must be at least 160");
      return;
    }
    onSave({ 
      ...job, 
      title, 
      field, 
      location, 
      type, 
      positions: Number(capacity), 
      hours: Number(hours),
      totalHours: Number(totalHours),
      description: desc, 
      benefits 
    });
  };

  return (
    <div className="mi-overlay" onClick={onClose}>
      <div className="mi-modal" onClick={e => e.stopPropagation()}>
        <button className="mi-modal-close" onClick={onClose}><FaTimes /></button>
        <h3 className="mi-modal-title">Edit: {job.title}</h3>
        <div className="mi-edit-grid">
          <div className="mi-edit-field"><label className="mi-edit-label">Title *</label><input className="mi-input" value={title} onChange={e => setTitle(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Field *</label><input className="mi-input" value={field} onChange={e => setField(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Location</label><input className="mi-input" value={location} onChange={e => setLocation(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Type</label>
            <select className="mi-input" value={type} onChange={e => setType(e.target.value)}>
              <option value="In-person">In-person</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="mi-edit-field"><label className="mi-edit-label">Capacity</label><input className="mi-input" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Weekly Hours</label><input className="mi-input" type="number" value={hours} onChange={e => setHours(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Total Hours (min 160)</label><input className="mi-input" type="number" value={totalHours} onChange={e => setTotalHours(e.target.value)} /></div>
        </div>
        <div className="mi-edit-field"><label className="mi-edit-label">Description</label><textarea className="mi-input mi-textarea" rows="3" value={desc} onChange={e => setDesc(e.target.value)} /></div>
        <div className="mi-edit-field"><label className="mi-edit-label">Benefits</label><textarea className="mi-input mi-textarea" rows="2" value={benefits} onChange={e => setBenefits(e.target.value)} /></div>
        <div className="mi-modal-actions">
          <button className="mi-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="mi-btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function AddModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [field, setField] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("In-person");
  const [capacity, setCapacity] = useState("5");
  const [hours, setHours] = useState("25");
  const [totalHours, setTotalHours] = useState("160");
  const [desc, setDesc] = useState("");
  const [benefits, setBenefits] = useState("");

  const handleSave = () => {
    if (!title.trim() || !field.trim()) {
      alert("Title and Field are required");
      return;
    }
    if (Number(totalHours) < 160) {
      alert("Total hours must be at least 160");
      return;
    }
    onSave({ title, field, location, type, positions: Number(capacity), hours: Number(hours), totalHours: Number(totalHours), description: desc, benefits });
  };

  return (
    <div className="mi-overlay" onClick={onClose}>
      <div className="mi-modal" onClick={e => e.stopPropagation()}>
        <button className="mi-modal-close" onClick={onClose}><FaTimes /></button>
        <h3 className="mi-modal-title">Add New Internship</h3>
        <div className="mi-edit-grid">
          <div className="mi-edit-field"><label className="mi-edit-label">Title *</label><input className="mi-input" value={title} onChange={e => setTitle(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Field *</label><input className="mi-input" value={field} onChange={e => setField(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Location</label><input className="mi-input" value={location} onChange={e => setLocation(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Type</label>
            <select className="mi-input" value={type} onChange={e => setType(e.target.value)}>
              <option value="In-person">In-person</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="mi-edit-field"><label className="mi-edit-label">Capacity</label><input className="mi-input" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Weekly Hours</label><input className="mi-input" type="number" value={hours} onChange={e => setHours(e.target.value)} /></div>
          <div className="mi-edit-field"><label className="mi-edit-label">Total Hours (min 160)</label><input className="mi-input" type="number" value={totalHours} onChange={e => setTotalHours(e.target.value)} /></div>
        </div>
        <div className="mi-edit-field"><label className="mi-edit-label">Description</label><textarea className="mi-input mi-textarea" rows="3" value={desc} onChange={e => setDesc(e.target.value)} /></div>
        <div className="mi-edit-field"><label className="mi-edit-label">Benefits</label><textarea className="mi-input mi-textarea" rows="2" value={benefits} onChange={e => setBenefits(e.target.value)} /></div>
        <div className="mi-modal-actions">
          <button className="mi-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="mi-btn-primary" onClick={handleSave}>Create</button>
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

// ✅ Mapping حسب Response من API
const mapJob = (t) => ({
  id: t._id,
  title: t.title,
  field: t.field,
  type: (t.training_type || "").replace("in-person", "In-person").replace("online", "Online").replace("hybrid", "Hybrid"),
  location: t.city || t.location || "",
  positions: t.capacity || 0,
  filled: t.acceptedCount || 0,
  hours: t.weeklyHours || 0,
  totalHours: t.totalHours || 0,
  status: t.isFull ? "full" : t.isActive ? "active" : "hidden",
  postedAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
  description: t.description || "",
  benefits: t.benefits || "",
});

export default function ManageInternships() {
  const [jobs, setJobs] = useState([]);
  const [viewJob, setViewJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [deleteJob, setDeleteJob] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ استخدام trainingApi.mine()
  const loadJobs = () => {
    setLoading(true);
    setError("");
    trainingApi.mine()
      .then(data => {
        const trainings = data.trainings || [];
        setJobs(trainings.map(mapJob));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadJobs(); }, []);

  // ✅ استخدام trainingApi.toggle()
  const toggleHide = async (id) => {
    try {
      await trainingApi.toggle(id);
      loadJobs();
    } catch (err) { setError(err.message); }
  };

  const toggleFull = (id) => {
    // Mark Full مش موجود في API، بس بنحتفظ فيه كـ UI فقط
    setJobs(js => js.map(j =>
      j.id === id ? { ...j, status: j.status === "full" ? "active" : "full" } : j
    ));
  };

  // ✅ استخدام trainingApi.remove()
  const confirmDelete = async () => {
    try {
      await trainingApi.remove(deleteJob.id);
      setJobs(js => js.filter(j => j.id !== deleteJob.id));
      setDeleteJob(null);
    } catch (err) { setError(err.message); }
  };

  // ✅ استخدام trainingApi.update()
  const saveEdit = async (updated) => {
    try {
      await trainingApi.update(updated.id, {
        title: updated.title,
        field: updated.field,
        city: updated.location,
        training_type: updated.type.toLowerCase(),
        capacity: Number(updated.positions),
        weeklyHours: Number(updated.hours),
        totalHours: Number(updated.totalHours),
        description: updated.description,
        benefits: updated.benefits,
      });
      setEditJob(null);
      setViewJob(null);
      loadJobs();
    } catch (err) { setError(err.message); }
  };

  // ✅ استخدام trainingApi.create()
  const addNewJob = async (newJob) => {
    try {
      await trainingApi.create({
        title: newJob.title,
        field: newJob.field,
        city: newJob.location,
        training_type: newJob.type.toLowerCase(),
        capacity: Number(newJob.positions),
        weeklyHours: Number(newJob.hours),
        totalHours: Number(newJob.totalHours),
        description: newJob.description,
        benefits: newJob.benefits,
      });
      setAddModalOpen(false);
      loadJobs();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="mi-page">
      <div className="mi-header">
        <h1 className="mi-title">Manage Internships</h1>
        <p className="mi-sub">View, edit, hide or remove posted opportunities</p>
      </div>

      {/* ✅ زر إضافة فرصة جديدة */}
      <div className="mi-add-bar">
        <button className="mi-add-btn" onClick={() => setAddModalOpen(true)}>
          <FaPlus /> Add New Internship
        </button>
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
                <span><FaMapMarkerAlt size={11} /> {job.location || "Remote"}</span>
                <span><FaUsers size={11} /> {job.filled}/{job.positions} filled</span>
                <span><FaClock size={11} /> {job.hours}h/week</span>
                <span>{job.type} · {job.field}</span>
                <span>Posted {job.postedAt}</span>
              </div>
            </div>
            <div className="mi-item-actions" onClick={e => e.stopPropagation()}>
              <button className="mi-icon-btn" onClick={() => setEditJob(job)}><FaEdit /></button>
              <button className="mi-icon-btn" onClick={() => toggleHide(job.id)}>
                {job.status === "hidden" ? <FaEye /> : <FaEyeSlash />}
              </button>
              <button className="mi-icon-btn mi-icon-red" onClick={() => setDeleteJob(job)}><FaTrash /></button>
              {job.status !== "full" && (
                <button className="mi-mark-full-btn" onClick={() => toggleFull(job.id)}>Mark Full</button>
              )}
              <FaChevronRight className="mi-chevron" />
            </div>
          </div>
        ))}
      </div>

      {viewJob && !editJob && <ViewModal job={viewJob} onClose={() => setViewJob(null)} onEdit={(j) => { setEditJob(j); setViewJob(null); }} />}
      {editJob && <EditModal job={editJob} onClose={() => setEditJob(null)} onSave={saveEdit} />}
      {deleteJob && <DeleteModal onClose={() => setDeleteJob(null)} onConfirm={confirmDelete} />}
      {addModalOpen && <AddModal onClose={() => setAddModalOpen(false)} onSave={addNewJob} />}
    </div>
  );
}