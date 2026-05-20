import { useState, useEffect } from "react";
import { api } from "../api/client";

function AddSupervisorModal({ onClose, onAdd, universities }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "",
    universityId: "", title: "Training Coordinator", department: ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())  e.firstName  = "Required";
    if (!form.lastName.trim())   e.lastName   = "Required";
    if (!form.email.trim())      e.email      = "Required";
    if (!form.password.trim())   e.password   = "Required";
    if (!form.universityId)      e.universityId = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await api("/superadmin/supervisors", {
        method: "POST",
        body: {
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          universityId: form.universityId,
          title: form.title,
          department: form.department,
        }
      });
      onAdd(res.supervisor);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="au-overlay" onClick={onClose}>
      <div className="au-add-modal" onClick={e => e.stopPropagation()}>
        <button className="au-modal-close" onClick={onClose}>✕</button>
        <h2 className="au-modal-title">Add New Supervisor</h2>

        <div className="au-add-row">
          <div className="au-add-field">
            <label>First Name *</label>
            <input placeholder="First Name" value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
              className={errors.firstName ? "au-inp error" : "au-inp"} />
            {errors.firstName && <span className="au-err">{errors.firstName}</span>}
          </div>
          <div className="au-add-field">
            <label>Last Name *</label>
            <input placeholder="Last Name" value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
              className={errors.lastName ? "au-inp error" : "au-inp"} />
            {errors.lastName && <span className="au-err">{errors.lastName}</span>}
          </div>
        </div>

        <div className="au-add-field">
          <label>Email *</label>
          <input type="email" placeholder="email@university.edu" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className={errors.email ? "au-inp error" : "au-inp"} />
          {errors.email && <span className="au-err">{errors.email}</span>}
        </div>

        <div className="au-add-field">
          <label>Password *</label>
          <input type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className={errors.password ? "au-inp error" : "au-inp"} />
          {errors.password && <span className="au-err">{errors.password}</span>}
        </div>

        <div className="au-add-field">
          <label>University *</label>
          <select value={form.universityId}
            onChange={e => setForm({ ...form, universityId: e.target.value })}
            className={errors.universityId ? "au-inp error" : "au-inp"}>
            <option value="">Select university</option>
            {universities.map((u) => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
          {errors.universityId && <span className="au-err">{errors.universityId}</span>}
        </div>

        <div className="au-add-row">
          <div className="au-add-field">
            <label>Title</label>
            <input placeholder="Training Coordinator" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="au-inp" />
          </div>
          <div className="au-add-field">
            <label>Department</label>
            <input placeholder="Department" value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
              className="au-inp" />
          </div>
        </div>

        <div className="au-add-actions">
          <button className="au-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="au-save-btn" onClick={handleSave} disabled={submitting}>
            {submitting ? "Saving..." : "Save Supervisor"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSupervisors() {
  const [supervisors, setSupervisors] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [search, setSearch] = useState("");
  const [filterUniId, setFilterUniId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");
  const [showDrop, setShowDrop] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  // جلب الجامعات
  const fetchUniversities = async () => {
    try {
      const res = await api("/superadmin/universities");
      setUniversities(res.universities || []);
    } catch (err) {
      console.error(err);
    }
  };

  // جلب المشرفين
  const fetchSupervisors = async () => {
    try {
      const params = filterUniId ? `?universityId=${filterUniId}` : "";
      const res = await api(`/superadmin/supervisors${params}`);
      setSupervisors(res.supervisors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    fetchSupervisors();
  }, [filterUniId]);

  const handleAdd = (newSupervisor) => {
    showToast(`${newSupervisor.firstName} ${newSupervisor.lastName} added successfully!`);
    fetchSupervisors(); // إعادة تحميل القائمة
  };

  // فلترة حسب البحث (الاسم أو الإيميل)
  const filtered = supervisors.filter(s => {
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) ||
                        s.userId?.email?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const getUniversityName = (uniId) => {
    const uni = universities.find(u => u._id === uniId);
    return uni?.name || "";
  };

  if (loading) return <div className="loading-state">Loading supervisors...</div>;

  return (
    <div className="au-page">
      <div className="au-header">
        <div>
          <h1 className="au-title">🛡 Supervisors</h1>
          <p className="au-sub">Manage university supervisors and coordinators</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {/* Search */}
          <input
            className="au-search"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 250 }}
          />
          {/* Filter Dropdown */}
          <div style={{ position: "relative" }}>
            <button className="au-filter-btn" onClick={() => setShowDrop(!showDrop)}>
              {filterUniId ? (universities.find(u => u._id === filterUniId)?.name || "All universities") : "All universities"} ▾
            </button>
            {showDrop && (
              <div className="au-filter-drop">
                <div className={`au-filter-item ${!filterUniId ? "selected" : ""}`}
                  onClick={() => { setFilterUniId(""); setShowDrop(false); }}>
                  {!filterUniId && <span>✓ </span>}All universities
                </div>
                {universities.map((u) => (
                  <div key={u._id}
                    className={`au-filter-item ${filterUniId === u._id ? "selected" : ""}`}
                    onClick={() => { setFilterUniId(u._id); setShowDrop(false); }}>
                    {filterUniId === u._id && <span>✓ </span>}{u.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="au-add-btn" onClick={() => setShowAdd(true)}>+ Add Supervisor</button>
        </div>
      </div>

      <div className="au-table-wrap">
        <table className="au-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>University</th>
              <th>Title</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#aaa" }}>No supervisors found</td></tr>
            ) : (
              filtered.map((s) => (
                <tr key={s._id}>
                  <td style={{ fontWeight: 600 }}>{s.firstName} {s.lastName}</td>
                  <td style={{ color: "#888" }}>{s.userId?.email}</td>
                  <td>{getUniversityName(s.universityId)}</td>
                  <td><span className="au-role-badge">{s.title || "Supervisor"}</span></td>
                  <td style={{ color: "#888" }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {toast && <div className="au-toast">✓ {toast}</div>}
      {showAdd && (
        <AddSupervisorModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
          universities={universities}
        />
      )}
    </div>
  );
}