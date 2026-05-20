import { useState, useEffect } from "react";
import { api } from "../api/client";

function ViewModal({ uni, onClose }) {
  const [supervisors, setSupervisors] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api(`/superadmin/universities/${uni._id}/details`);
        setSupervisors(res.supervisors || []);
        setRecentStudents(res.recentStudents || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [uni._id]);

  if (loading) return <div className="au-overlay" onClick={onClose}><div className="au-modal">Loading...</div></div>;

  return (
    <div className="au-overlay" onClick={onClose}>
      <div className="au-modal" onClick={e => e.stopPropagation()}>
        <button className="au-modal-close" onClick={onClose}>✕</button>
        <h2 className="au-modal-title">🏛 {uni.name}</h2>

        <div className="au-modal-meta">
          <span>Code: <strong>{uni.code}</strong></span>
          <span>Supervisor domain: <strong>{uni.supervisorDomain}</strong></span>
          <span>Student domain: <strong>{uni.studentDomain}</strong></span>
        </div>

        <div className="au-modal-stats">
          <div className="au-modal-stat"><span>Supervisors</span><strong>{uni.supervisorsCount || supervisors.length}</strong></div>
          <div className="au-modal-stat"><span>Students</span><strong>{uni.studentsCount || 0}</strong></div>
        </div>

        <h3 className="au-modal-section">🛡 Supervisors</h3>
        <table className="au-modal-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {supervisors.map((s, i) => (
              <tr key={i}>
                <td>{s.firstName} {s.lastName}</td>
                <td style={{ color: "#888" }}>{s.userId?.email}</td>
                <td><span className="au-role-badge">{s.title || "Supervisor"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="au-modal-section">🎓 Recent Students</h3>
        <table className="au-modal-table">
          <thead><tr><th>Name</th><th>Major</th><th>Student ID</th></tr></thead>
          <tbody>
            {recentStudents.length ? recentStudents.map((s, i) => (
              <tr key={i}>
                <td>{s.firstName} {s.lastName}</td>
                <td style={{ color: "#888" }}>{s.major}</td>
                <td><span className="au-id-badge">{s.studentID}</span></td>
              </tr>
            )) : <tr><td colSpan={3} style={{ color: "#aaa", textAlign: "center" }}>No students yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", code: "", supervisorDomain: "", studentDomain: "", address: "", website: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.code.trim()) e.code = "Required";
    if (!form.supervisorDomain.trim()) e.supervisorDomain = "Required";
    if (!form.studentDomain.trim()) e.studentDomain = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await api("/superadmin/universities", {
        method: "POST",
        body: {
          name: form.name,
          code: form.code.toUpperCase(),
          supervisorDomain: form.supervisorDomain,
          studentDomain: form.studentDomain,
          address: form.address,
          website: form.website,
        }
      });
      onAdd(res.university);
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
        <h2 className="au-modal-title">Add New University</h2>

        <div className="au-add-field">
          <label>University Name *</label>
          <input placeholder="University Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={errors.name ? "au-inp error" : "au-inp"} />
          {errors.name && <span className="au-err">{errors.name}</span>}
        </div>

        <div className="au-add-field">
          <label>Code * (uppercase)</label>
          <input placeholder="PTUK" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className={errors.code ? "au-inp error" : "au-inp"} />
          {errors.code && <span className="au-err">{errors.code}</span>}
        </div>

        <div className="au-add-row">
          <div className="au-add-field">
            <label>Supervisor Email Domain *</label>
            <input placeholder="ptuk.edu.ps" value={form.supervisorDomain} onChange={e => setForm({ ...form, supervisorDomain: e.target.value })} className={errors.supervisorDomain ? "au-inp error" : "au-inp"} />
            {errors.supervisorDomain && <span className="au-err">{errors.supervisorDomain}</span>}
          </div>
          <div className="au-add-field">
            <label>Student Email Domain *</label>
            <input placeholder="students.ptuk.edu.ps" value={form.studentDomain} onChange={e => setForm({ ...form, studentDomain: e.target.value })} className={errors.studentDomain ? "au-inp error" : "au-inp"} />
            {errors.studentDomain && <span className="au-err">{errors.studentDomain}</span>}
          </div>
        </div>

        <div className="au-add-field">
          <label>Address</label>
          <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="au-inp" />
        </div>

        <div className="au-add-field">
          <label>Website</label>
          <input placeholder="https://" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="au-inp" />
        </div>

        <div className="au-add-actions">
          <button className="au-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="au-save-btn" onClick={handleSave} disabled={submitting}>
            {submitting ? "Saving..." : "Save University"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUniversities() {
  const [unis, setUnis] = useState([]);
  const [search, setSearch] = useState("");
  const [viewUni, setViewUni] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  // جلب الجامعات من الباك إند
  const fetchUniversities = async () => {
    try {
      const res = await api("/superadmin/universities");
      setUnis(res.universities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const toggleStatus = async (uni) => {
    try {
      await api(`/superadmin/universities/${uni._id}/toggle`, { method: "PATCH" });
      showToast(`${uni.name} ${uni.isActive ? "deactivated" : "activated"}`);
      fetchUniversities(); // إعادة تحميل القائمة
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAdd = (newUni) => {
    showToast(`${newUni.name} added successfully!`);
    fetchUniversities(); // إعادة تحميل القائمة
  };

  const filtered = unis.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.code?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-state">Loading universities...</div>;

  return (
    <div className="au-page">
      <div className="au-header">
        <div>
          <h1 className="au-title">🏛 Universities</h1>
          <p className="au-sub">Manage all universities registered on the platform</p>
        </div>
        <button className="au-add-btn" onClick={() => setShowAdd(true)}>+ Add University</button>
      </div>

      <input
        className="au-search"
        placeholder="Search universities..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="au-table-wrap">
        <table className="au-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Supervisor Domain</th>
              <th>Student Domain</th>
              <th>Supervisors</th>
              <th>Students</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((uni) => (
              <tr key={uni._id}>
                <td style={{ fontWeight: 600 }}>{uni.name}</td>
                <td><span className="au-code-badge">{uni.code}</span></td>
                <td style={{ color: "#666" }}>{uni.supervisorDomain}</td>
                <td style={{ color: "#666" }}>{uni.studentDomain}</td>
                <td style={{ textAlign: "center" }}>{uni.supervisorsCount || 0}</td>
                <td style={{ textAlign: "center" }}>{uni.studentsCount || 0}</td>
                <td>
                  <span className={`au-status ${uni.isActive ? "active" : "inactive"}`}>
                    {uni.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="au-view-btn" onClick={() => setViewUni(uni)}>👁 View</button>
                    <button
                      className={`au-toggle-btn ${uni.isActive ? "deactivate" : "activate"}`}
                      onClick={() => toggleStatus(uni)}
                    >
                      {uni.isActive ? "⏻ Deactivate" : "⏻ Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <div className="au-toast">✓ {toast}</div>}
      {viewUni && <ViewModal uni={viewUni} onClose={() => setViewUni(null)} />}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
    </div>
  );
}