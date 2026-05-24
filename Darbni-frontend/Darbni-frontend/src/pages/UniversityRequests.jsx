import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaEyeSlash, FaTrash, FaChevronRight, FaTimes, FaMapMarkerAlt, FaUsers, FaClock, FaPlus } from "react-icons/fa";
import { trainingApi } from "../api/client";

// ... باقي الكود (StatusBadge, ViewModal, EditModal, DeleteModal, mapJob)

// ✅ AddModal للتأكيد
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

export default function ManageInternships() {
  const [jobs, setJobs] = useState([]);
  const [viewJob, setViewJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [deleteJob, setDeleteJob] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const toggleFull = (id) => {
    setJobs(js => js.map(j => j.id === id ? { ...j, status: j.status === "full" ? "active" : "full" } : j));
  };

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
                <span><FaMapMarkerAlt size={11} /> {job.location}</span>
                <span><FaUsers size={11} /> {job.filled}/{job.positions} filled</span>
                <span><FaClock size={11} /> {job.hours}h/week</span>
                <span>{job.type} · {job.field}</span>
                <span>Posted {job.postedAt}</span>
              </div>
            </div>
            <div className="mi-item-actions" onClick={e => e.stopPropagation()}>
              <button className="mi-icon-btn" onClick={() => setEditJob(job)}><FaEdit /></button>
              <button className="mi-icon-btn" onClick={() => toggleHide(job.id)}>{job.status === "hidden" ? <FaEye /> : <FaEyeSlash />}</button>
              <button className="mi-icon-btn mi-icon-red" onClick={() => setDeleteJob(job)}><FaTrash /></button>
              {job.status !== "full" && <button className="mi-mark-full-btn" onClick={() => toggleFull(job.id)}>Mark Full</button>}
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