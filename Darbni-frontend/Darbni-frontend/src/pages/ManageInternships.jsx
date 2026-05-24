import { useEffect, useState } from "react";
import {
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaChevronRight,
  FaTimes,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaPlus,
} from "react-icons/fa";
import { companyApi } from "../api/companyApi";

const statusConfig = {
  active: { label: "Active", bg: "#4a3fa0", color: "#fff" },
  full: { label: "Full", bg: "#f0eeff", color: "#4a3fa0" },
  hidden: { label: "Hidden", bg: "#f5f5f5", color: "#888" },
};

function StatusBadge({ status }) {
  const c = statusConfig[status] || { label: status, bg: "#eee", color: "#555" };
  return (
    <span className="mi-badge" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

function ViewModal({ job, onClose, onEdit }) {
  const rows = [
    { label: "Field", value: job.field },
    {
      label: "Type",
      value:
        job.training_type === "in-person"
          ? "In-person"
          : job.training_type === "online"
          ? "Online"
          : "Hybrid",
    },
    { label: "Location", value: job.city || job.location || "Remote" },
    { label: "Positions", value: `${job.acceptedCount || 0}/${job.capacity} filled` },
    { label: "Weekly Hours", value: `${job.weeklyHours}h` },
    { label: "Total Hours", value: `${job.totalHours}h` },
    {
      label: "Start Date",
      value: job.startDate ? new Date(job.startDate).toLocaleDateString() : "TBD",
    },
    {
      label: "Status",
      value: job.isFull ? "Full" : job.isActive ? "Active" : "Hidden",
    },
  ];

  return (
    <div className="mi-overlay" onClick={onClose}>
      <div className="mi-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mi-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="mi-modal-title">{job.title}</h3>
        <div className="mi-view-grid">
          {rows.map((r) => (
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
          <button className="mi-btn-cancel" onClick={onClose}>
            Close
          </button>
          <button className="mi-btn-primary" onClick={() => onEdit(job)}>
            <FaEdit size={13} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ job, onClose, onSave }) {
  const [title, setTitle] = useState(job.title);
  const [field, setField] = useState(job.field);
  const [city, setCity] = useState(job.city || job.location || "");
  const [training_type, setTrainingType] = useState(job.training_type || "in-person");
  const [capacity, setCapacity] = useState(String(job.capacity));
  const [weeklyHours, setWeeklyHours] = useState(String(job.weeklyHours));
  const [totalHours, setTotalHours] = useState(String(job.totalHours));
  const [description, setDescription] = useState(job.description || "");
  const [benefits, setBenefits] = useState(job.benefits || "");
  const [startDate, setStartDate] = useState(
    job.startDate ? job.startDate.split("T")[0] : ""
  );

  const handleSave = () => {
    if (!title.trim() || !field.trim()) return;
    onSave({
      ...job,
      title,
      field,
      city,
      training_type,
      capacity: Number(capacity),
      weeklyHours: Number(weeklyHours),
      totalHours: Number(totalHours),
      description,
      benefits,
      startDate: startDate || null,
    });
  };

  return (
    <div className="mi-overlay" onClick={onClose}>
      <div className="mi-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mi-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="mi-modal-title">Edit: {job.title}</h3>
        <div className="mi-edit-grid">
          <div className="mi-edit-field">
            <label className="mi-edit-label">Title *</label>
            <input
              className="mi-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">Field *</label>
            <input
              className="mi-input"
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">City</label>
            <input
              className="mi-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">Type</label>
            <select
              className="mi-input"
              value={training_type}
              onChange={(e) => setTrainingType(e.target.value)}
            >
              <option value="in-person">In-person</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">Capacity</label>
            <input
              className="mi-input"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">Weekly Hours</label>
            <input
              className="mi-input"
              type="number"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(e.target.value)}
            />
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">Total Hours (min 160)</label>
            <input
              className="mi-input"
              type="number"
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
            />
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">Start Date</label>
            <input
              className="mi-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mi-edit-field">
          <label className="mi-edit-label">Description</label>
          <textarea
            className="mi-input mi-textarea"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mi-edit-field">
          <label className="mi-edit-label">Benefits</label>
          <textarea
            className="mi-input mi-textarea"
            rows="2"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
          />
        </div>
        <div className="mi-modal-actions">
          <button className="mi-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="mi-btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function AddModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [field, setField] = useState("");
  const [city, setCity] = useState("");
  const [training_type, setTrainingType] = useState("in-person");
  const [capacity, setCapacity] = useState(5);
  const [weeklyHours, setWeeklyHours] = useState(25);
  const [totalHours, setTotalHours] = useState(160);
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleSave = () => {
    if (!title.trim() || !field.trim()) {
      alert("Title and Field are required");
      return;
    }
    if (totalHours < 160) {
      alert("Total hours must be at least 160");
      return;
    }
    onSave({
      title,
      field,
      city,
      training_type,
      capacity,
      weeklyHours,
      totalHours,
      description,
      benefits,
      startDate: startDate || null,
    });
  };

  return (
    <div className="mi-overlay" onClick={onClose}>
      <div className="mi-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mi-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="mi-modal-title">Add New Internship</h3>
        <div className="mi-edit-grid">
          <div className="mi-edit-field">
            <label className="mi-edit-label">Title *</label>
            <input
              className="mi-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">Field *</label>
            <input
              className="mi-input"
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">City</label>
            <input
              className="mi-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">Type</label>
            <select
              className="mi-input"
              value={training_type}
              onChange={(e) => setTrainingType(e.target.value)}
            >
              <option value="in-person">In-person</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">Capacity</label>
            <input
              className="mi-input"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">Weekly Hours</label>
            <input
              className="mi-input"
              type="number"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
            />
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">Total Hours (min 160)</label>
            <input
              className="mi-input"
              type="number"
              value={totalHours}
              onChange={(e) => setTotalHours(Number(e.target.value))}
            />
          </div>
          <div className="mi-edit-field">
            <label className="mi-edit-label">Start Date</label>
            <input
              className="mi-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mi-edit-field">
          <label className="mi-edit-label">Description</label>
          <textarea
            className="mi-input mi-textarea"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mi-edit-field">
          <label className="mi-edit-label">Benefits</label>
          <textarea
            className="mi-input mi-textarea"
            rows="2"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
          />
        </div>
        <div className="mi-modal-actions">
          <button className="mi-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="mi-btn-primary" onClick={handleSave}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ onClose, onConfirm }) {
  return (
    <div className="mi-overlay" onClick={onClose}>
      <div className="mi-modal mi-modal-sm" onClick={(e) => e.stopPropagation()}>
        <button className="mi-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="mi-modal-title">Delete Opportunity</h3>
        <p className="mi-delete-msg">
          Are you sure you want to delete this internship opportunity? This action
          cannot be undone.
        </p>
        <div className="mi-modal-actions">
          <button className="mi-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="mi-btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ Mapping حسب Response من API
const mapTraining = (t) => ({
  id: t._id,
  title: t.title,
  field: t.field,
  training_type: t.training_type,
  location: t.city || t.location,
  city: t.city,
  capacity: t.capacity,
  acceptedCount: t.acceptedCount || 0,
  weeklyHours: t.weeklyHours,
  totalHours: t.totalHours,
  description: t.description,
  benefits: t.benefits,
  startDate: t.startDate,
  isActive: t.isActive,
  isFull: t.isFull,
  status: t.isFull ? "full" : t.isActive ? "active" : "hidden",
  postedAt: t.createdAt
    ? new Date(t.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "",
});

export default function ManageInternships() {
  const [jobs, setJobs] = useState([]);
  const [viewJob, setViewJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [deleteJob, setDeleteJob] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await companyApi.getMyTrainings();
      // ✅ Response من API حسب الـ Docs: { count, trainings }
      const trainings = response.trainings || response.data?.trainings || [];
      setJobs(trainings.map(mapTraining));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const toggleHide = async (id) => {
    try {
      await companyApi.toggleTraining(id);
      loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const confirmDelete = async () => {
    try {
      await companyApi.deleteTraining(deleteJob.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteJob.id));
      setDeleteJob(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const saveEdit = async (updated) => {
    try {
      await companyApi.updateTraining(updated.id, {
        title: updated.title,
        field: updated.field,
        city: updated.city,
        training_type: updated.training_type,
        capacity: updated.capacity,
        weeklyHours: updated.weeklyHours,
        totalHours: updated.totalHours,
        description: updated.description,
        benefits: updated.benefits,
        startDate: updated.startDate,
      });
      setEditJob(null);
      setViewJob(null);
      loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const addNewJob = async (newJob) => {
    try {
      await companyApi.createTraining(newJob);
      setAddModalOpen(false);
      loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
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
        {error && (
          <div className="mi-empty" style={{ color: "#b00020" }}>
            {error}
          </div>
        )}
        {loading && <div className="mi-empty">Loading internships...</div>}
        {!loading && jobs.length === 0 && (
          <div className="mi-empty">No internships posted yet.</div>
        )}
        {jobs.map((job) => (
          <div key={job.id} className="mi-item" onClick={() => setViewJob(job)}>
            <div className="mi-item-left">
              <div className="mi-item-top">
                <span className="mi-item-title">{job.title}</span>
                <StatusBadge status={job.status} />
              </div>
              <div className="mi-item-meta">
                <span>
                  <FaMapMarkerAlt size={11} /> {job.location || "Remote"}
                </span>
                <span>
                  <FaUsers size={11} /> {job.acceptedCount}/{job.capacity} filled
                </span>
                <span>
                  <FaClock size={11} /> {job.weeklyHours}h/week
                </span>
                <span>
                  {job.training_type === "in-person"
                    ? "In-person"
                    : job.training_type === "online"
                    ? "Online"
                    : "Hybrid"}{" "}
                  · {job.field}
                </span>
                <span>Posted {job.postedAt}</span>
              </div>
            </div>
            <div className="mi-item-actions" onClick={(e) => e.stopPropagation()}>
              <button className="mi-icon-btn" onClick={() => setEditJob(job)}>
                <FaEdit />
              </button>
              <button className="mi-icon-btn" onClick={() => toggleHide(job.id)}>
                {job.status === "hidden" ? <FaEye /> : <FaEyeSlash />}
              </button>
              <button
                className="mi-icon-btn mi-icon-red"
                onClick={() => setDeleteJob(job)}
              >
                <FaTrash />
              </button>
              <FaChevronRight className="mi-chevron" />
            </div>
          </div>
        ))}
      </div>

      {viewJob && !editJob && (
        <ViewModal
          job={viewJob}
          onClose={() => setViewJob(null)}
          onEdit={(j) => {
            setEditJob(j);
            setViewJob(null);
          }}
        />
      )}
      {editJob && (
        <EditModal job={editJob} onClose={() => setEditJob(null)} onSave={saveEdit} />
      )}
      {deleteJob && (
        <DeleteModal
          onClose={() => setDeleteJob(null)}
          onConfirm={confirmDelete}
        />
      )}
      {addModalOpen && (
        <AddModal onClose={() => setAddModalOpen(false)} onSave={addNewJob} />
      )}
    </div>
  );
}