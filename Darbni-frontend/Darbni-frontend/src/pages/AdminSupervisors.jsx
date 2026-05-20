import { useState } from "react";

const UNIVERSITIES_LIST = [
  "Palestine Technical University – Kadoorie",
  "An-Najah National University",
  "Birzeit University",
  "Bethlehem University",
  "Palestine Polytechnic University",
  "Hebron University",
  "Al-Quds Open University",
  "Arab American University",
  "Al-Quds University",
  "Al-Istiqlal University",
];

const INIT_SUPERVISORS = [
  { name: "Ahmad Yousef", email: "ahmad.yousef@ptuk.edu.ps",  university: "Palestine Technical University – Kadoorie", role: "Coordinator", createdAt: "2024-09-01", status: "active" },
  { name: "Lina Khalil",  email: "lina.k@najah.edu",          university: "An-Najah National University",             role: "Supervisor",  createdAt: "2024-10-12", status: "active" },
  { name: "Omar Nasser",  email: "o.nasser@birzeit.edu",      university: "Birzeit University",                       role: "Supervisor",  createdAt: "2024-08-05", status: "inactive" },
  { name: "Lina Saleh",   email: "l.saleh@bethlehem.edu",     university: "Bethlehem University",                     role: "Coordinator", createdAt: "2024-11-20", status: "active" },
  { name: "Yousef Ali",   email: "y.ali@ppu.edu",             university: "Palestine Polytechnic University",         role: "Supervisor",  createdAt: "2024-07-14", status: "active" },
];

function AddSupervisorModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "",
    university: "", title: "Training Coordinator", department: ""
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())  e.firstName  = "Required";
    if (!form.lastName.trim())   e.lastName   = "Required";
    if (!form.email.trim())      e.email      = "Required";
    if (!form.password.trim())   e.password   = "Required";
    if (!form.university)        e.university = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onAdd({
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      university: form.university,
      role: "Supervisor",
      createdAt: new Date().toISOString().slice(0, 10),
      status: "active",
    });
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="au-overlay" onClick={onClose}>
      <div className="au-add-modal" onClick={e => e.stopPropagation()}>
        <button className="au-modal-close" onClick={onClose}>✕</button>
        <h2 className="au-modal-title">Add New Supervisor</h2>
        {saved && <div className="au-saved-note">✓ Supervisor added successfully!</div>}

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
          <select value={form.university}
            onChange={e => setForm({ ...form, university: e.target.value })}
            className={errors.university ? "au-inp error" : "au-inp"}>
            <option value="">Select university</option>
            {UNIVERSITIES_LIST.map((u, i) => <option key={i} value={u}>{u}</option>)}
          </select>
          {errors.university && <span className="au-err">{errors.university}</span>}
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
          <button className="au-save-btn" onClick={handleSave}>Save Supervisor</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSupervisors() {
  const [supervisors, setSupervisors] = useState(INIT_SUPERVISORS);
  const [search,      setSearch]      = useState("");
  const [filterUni,   setFilterUni]   = useState("All universities");
  const [showAdd,     setShowAdd]     = useState(false);
  const [toast,       setToast]       = useState("");
  const [showDrop,    setShowDrop]    = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleAdd = (s) => {
    setSupervisors(prev => [...prev, s]);
    showToast(`${s.name} added successfully!`);
  };

  const filtered = supervisors.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.email.toLowerCase().includes(search.toLowerCase());
    const matchUni    = filterUni === "All universities" || s.university === filterUni;
    return matchSearch && matchUni;
  });

  return (
    <div className="au-page">
      <div className="au-header">
        <div>
          <h1 className="au-title">🛡 Supervisors</h1>
          <p className="au-sub">Manage university supervisors and coordinators</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {/* Filter Dropdown */}
          <div style={{ position: "relative" }}>
            <button className="au-filter-btn" onClick={() => setShowDrop(!showDrop)}>
              {filterUni} ▾
            </button>
            {showDrop && (
              <div className="au-filter-drop">
                {["All universities", ...UNIVERSITIES_LIST].map((u, i) => (
                  <div key={i}
                    className={`au-filter-item ${filterUni === u ? "selected" : ""}`}
                    onClick={() => { setFilterUni(u); setShowDrop(false); }}>
                    {filterUni === u && <span>✓ </span>}{u}
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
              <th>Role</th>
              <th>Created At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td style={{ color: "#888" }}>{s.email}</td>
                <td>{s.university}</td>
                <td><span className="au-role-badge">{s.role}</span></td>
                <td style={{ color: "#888" }}>{s.createdAt}</td>
                <td>
                  <span className={`au-status ${s.status}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <div className="au-toast">✓ {toast}</div>}
      {showAdd && <AddSupervisorModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
    </div>
  );
}