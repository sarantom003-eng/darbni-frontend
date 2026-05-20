import { useState } from "react";

const INIT_UNIVERSITIES = [
  { name: "Palestine Technical University – Kadoorie", code: "PTUK",      supervisorDomain: "ptuk.edu.ps",         studentDomain: "students.ptuk.edu.ps",        supervisors: 3, students: 229, status: "active" },
  { name: "An-Najah National University",             code: "NAJAH",     supervisorDomain: "najah.edu",            studentDomain: "students.najah.edu",           supervisors: 4, students: 61,  status: "active" },
  { name: "Birzeit University",                       code: "BIRZEIT",   supervisorDomain: "birzeit.edu",          studentDomain: "students.birzeit.edu",         supervisors: 2, students: 239, status: "inactive" },
  { name: "Bethlehem University",                     code: "BETHLEHEM", supervisorDomain: "bethlehem.edu",        studentDomain: "students.bethlehem.edu",       supervisors: 9, students: 97,  status: "inactive" },
  { name: "Palestine Polytechnic University",         code: "PPU",       supervisorDomain: "ppu.edu",              studentDomain: "students.ppu.edu",             supervisors: 7, students: 91,  status: "active" },
  { name: "Hebron University",                        code: "HEBRON",    supervisorDomain: "hebron.edu",           studentDomain: "students.hebron.edu",          supervisors: 3, students: 98,  status: "active" },
  { name: "Al-Quds Open University",                  code: "QOU",       supervisorDomain: "qou.edu",              studentDomain: "students.qou.edu",             supervisors: 3, students: 165, status: "active" },
  { name: "Arab American University",                 code: "AAUP",      supervisorDomain: "aaup.edu",             studentDomain: "students.aaup.edu",            supervisors: 3, students: 220, status: "active" },
  { name: "Al-Quds University",                       code: "ALQUDS",    supervisorDomain: "alquds.edu",           studentDomain: "students.alquds.edu",          supervisors: 5, students: 179, status: "active" },
  { name: "Al-Istiqlal University",                   code: "PASS",      supervisorDomain: "pass.ps",              studentDomain: "students.pass.ps",             supervisors: 5, students: 170, status: "active" },
];

const UNI_SUPERVISORS = {
  PTUK:      [ { name: "Ahmad Yousef", email: "ahmad@ptuk.edu.ps",  role: "Coordinator" }, { name: "Lina Khalil", email: "lina@ptuk.edu.ps", role: "Supervisor" } ],
  NAJAH:     [ { name: "Sara Haddad",  email: "sara@najah.edu",     role: "Supervisor"  } ],
  BIRZEIT:   [ { name: "Omar Nasser",  email: "omar@birzeit.edu",   role: "Supervisor"  } ],
  BETHLEHEM: [ { name: "Lina Saleh",   email: "lina@bethlehem.edu", role: "Coordinator" } ],
  PPU:       [ { name: "Yousef Ali",   email: "yousef@ppu.edu",     role: "Supervisor"  } ],
  HEBRON:    [ { name: "Reem Abed",    email: "reem@hebron.edu",    role: "Supervisor"  } ],
  QOU:       [ { name: "Nour Majed",   email: "nour@qou.edu",       role: "Coordinator" } ],
  AAUP:      [ { name: "Kareem Saeed", email: "kareem@aaup.edu",    role: "Supervisor"  } ],
  ALQUDS:    [ { name: "Hana Issa",    email: "hana@alquds.edu",    role: "Supervisor"  } ],
  PASS:      [ { name: "Bilal Said",   email: "bilal@pass.ps",      role: "Coordinator" } ],
};

const UNI_STUDENTS = {
  PTUK: [
    { name: "Sara Ali",        major: "Computer Science",     id: "PTUK20210001" },
    { name: "Omar Hassan",     major: "Software Engineering", id: "PTUK20210002" },
    { name: "Yara Nasser",     major: "Information Systems",  id: "PTUK20210003" },
    { name: "Mohammed Saleh",  major: "Business Admin.",      id: "PTUK20210004" },
    { name: "Reem Adel",       major: "Civil Eng.",           id: "PTUK20210005" },
    { name: "Khaled Omar",     major: "Accounting",           id: "PTUK20210006" },
    { name: "Noor Said",       major: "Computer Science",     id: "PTUK20210007" },
    { name: "Tareq Issa",      major: "Software Engineering", id: "PTUK20210008" },
    { name: "Layla Hadi",      major: "Information Systems",  id: "PTUK20210009" },
    { name: "Anas Maher",      major: "Business Admin.",      id: "PTUK20210010" },
  ],
  NAJAH: [
    { name: "Ahmad Nasser",    major: "Computer Science",     id: "NAJAH20210001" },
    { name: "Layla Haddad",    major: "Software Engineering", id: "NAJAH20210002" },
  ],
};

function ViewModal({ uni, onClose }) {
  const supervisors = UNI_SUPERVISORS[uni.code] || [];
  const students    = UNI_STUDENTS[uni.code]    || [];

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
          <div className="au-modal-stat"><span>Supervisors</span><strong>{uni.supervisors}</strong></div>
          <div className="au-modal-stat"><span>Students</span><strong>{uni.students}</strong></div>
          <div className="au-modal-stat"><span>Companies</span><strong>28</strong></div>
          <div className="au-modal-stat"><span>Applications</span><strong>209</strong></div>
        </div>

        <h3 className="au-modal-section">🛡 Supervisors</h3>
        <table className="au-modal-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {supervisors.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td style={{ color: "#888" }}>{s.email}</td>
                <td><span className="au-role-badge">{s.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="au-modal-section">🎓 Recent Students</h3>
        <table className="au-modal-table">
          <thead><tr><th>Name</th><th>Major</th><th>Student ID</th></tr></thead>
          <tbody>
            {students.length ? students.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td style={{ color: "#888" }}>{s.major}</td>
                <td><span className="au-id-badge">{s.id}</span></td>
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
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())             e.name             = "Required";
    if (!form.code.trim())             e.code             = "Required";
    if (!form.supervisorDomain.trim()) e.supervisorDomain = "Required";
    if (!form.studentDomain.trim())    e.studentDomain    = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onAdd({ ...form, supervisors: 0, students: 0, status: "active" });
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="au-overlay" onClick={onClose}>
      <div className="au-add-modal" onClick={e => e.stopPropagation()}>
        <button className="au-modal-close" onClick={onClose}>✕</button>
        <h2 className="au-modal-title">Add New University</h2>

        {saved && <div className="au-saved-note">✓ University added successfully!</div>}

        <div className="au-add-field">
          <label>University Name *</label>
          <input
            placeholder="University Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className={errors.name ? "au-inp error" : "au-inp"}
          />
          {errors.name && <span className="au-err">{errors.name}</span>}
        </div>

        <div className="au-add-field">
          <label>Code * (uppercase)</label>
          <input
            placeholder="PTUK"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
            className={errors.code ? "au-inp error" : "au-inp"}
          />
          {errors.code && <span className="au-err">{errors.code}</span>}
        </div>

        <div className="au-add-row">
          <div className="au-add-field">
            <label>Supervisor Email Domain *</label>
            <input
              placeholder="ptuk.edu.ps"
              value={form.supervisorDomain}
              onChange={e => setForm({ ...form, supervisorDomain: e.target.value })}
              className={errors.supervisorDomain ? "au-inp error" : "au-inp"}
            />
            {errors.supervisorDomain && <span className="au-err">{errors.supervisorDomain}</span>}
          </div>
          <div className="au-add-field">
            <label>Student Email Domain *</label>
            <input
              placeholder="students.ptuk.edu.ps"
              value={form.studentDomain}
              onChange={e => setForm({ ...form, studentDomain: e.target.value })}
              className={errors.studentDomain ? "au-inp error" : "au-inp"}
            />
            {errors.studentDomain && <span className="au-err">{errors.studentDomain}</span>}
          </div>
        </div>

        <div className="au-add-field">
          <label>Address</label>
          <input
            placeholder="Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="au-inp"
          />
        </div>

        <div className="au-add-field">
          <label>Website</label>
          <input
            placeholder="https://"
            value={form.website}
            onChange={e => setForm({ ...form, website: e.target.value })}
            className="au-inp"
          />
        </div>

        <div className="au-add-actions">
          <button className="au-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="au-save-btn" onClick={handleSave}>Save University</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUniversities() {
  const [unis,       setUnis]       = useState(INIT_UNIVERSITIES);
  const [search,     setSearch]     = useState("");
  const [viewUni,    setViewUni]    = useState(null);
  const [showAdd,    setShowAdd]    = useState(false);
  const [toast,      setToast]      = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const toggleStatus = (code) => {
    setUnis(prev => prev.map(u => {
      if (u.code !== code) return u;
      const next = u.status === "active" ? "inactive" : "active";
      showToast(`${u.name} ${next === "active" ? "activated" : "deactivated"}`);
      return { ...u, status: next };
    }));
  };

  const handleAdd = (newUni) => {
    setUnis(prev => [...prev, newUni]);
    showToast(`${newUni.name} added successfully!`);
  };

  const filtered = unis.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.code.toLowerCase().includes(search.toLowerCase())
  );

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
            {filtered.map((uni, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{uni.name}</td>
                <td><span className="au-code-badge">{uni.code}</span></td>
                <td style={{ color: "#666" }}>{uni.supervisorDomain}</td>
                <td style={{ color: "#666" }}>{uni.studentDomain}</td>
                <td style={{ textAlign: "center" }}>{uni.supervisors}</td>
                <td style={{ textAlign: "center" }}>{uni.students}</td>
                <td>
                  <span className={`au-status ${uni.status}`}>
                    {uni.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="au-view-btn" onClick={() => setViewUni(uni)}>👁 View</button>
                    <button
                      className={`au-toggle-btn ${uni.status === "active" ? "deactivate" : "activate"}`}
                      onClick={() => toggleStatus(uni.code)}
                    >
                      {uni.status === "active" ? "⏻ Deactivate" : "⏻ Activate"}
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