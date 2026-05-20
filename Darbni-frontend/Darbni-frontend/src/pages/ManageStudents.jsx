import { useState } from "react";
import {
  FaSearch, FaIdCard, FaUniversity, FaBookOpen, FaCalendarAlt,
  FaClock, FaEnvelope, FaPhone, FaGraduationCap, FaTimes
} from "react-icons/fa";

const STUDENTS = [
  {
    name: "Ahmad Nasser",
    email: "ahmad@students.ptuk.edu.ps",
    id: "20210145",
    major: "Information Systems",
    year: "4th",
    training: "In Progress",
    university: "Palestine Technical University - Khadoorie",
    semester: "Spring 2026",
    creditHours: 110,
    registered: "2024-09-12",
    mobile: "+970 599 111 222",
  },
  {
    name: "Sara Tomeh",
    email: "sara@students.ptuk.edu.ps",
    id: "20210289",
    major: "Computer Science",
    year: "4th",
    training: "Completed",
    university: "Palestine Technical University - Khadoorie",
    semester: "Spring 2026",
    creditHours: 120,
    registered: "2024-09-10",
    mobile: "+970 599 333 444",
  },
  {
    name: "Layla Haddad",
    email: "layla@students.ptuk.edu.ps",
    id: "20220033",
    major: "Software Engineering",
    year: "3rd",
    training: "In Progress",
    university: "Palestine Technical University - Khadoorie",
    semester: "Spring 2026",
    creditHours: 90,
    registered: "2024-09-15",
    mobile: "+970 599 555 666",
  },
  {
    name: "Omar Saleh",
    email: "omar@students.ptuk.edu.ps",
    id: "20230198",
    major: "Information Systems",
    year: "3rd",
    training: "Not Started",
    university: "Palestine Technical University - Khadoorie",
    semester: "Spring 2026",
    creditHours: 75,
    registered: "2025-01-20",
    mobile: "+970 599 777 888",
  },
  {
    name: "Nour Abed",
    email: "nour@students.ptuk.edu.ps",
    id: "20200412",
    major: "Computer Science",
    year: "4th",
    training: "Not Started",
    university: "Palestine Technical University - Khadoorie",
    semester: "Spring 2026",
    creditHours: 105,
    registered: "2024-09-08",
    mobile: "+970 599 999 000",
  },
];

const trainingColor = (t) => {
  if (t === "Completed")   return { bg: "#6c47ff", color: "#fff" };
  if (t === "In Progress") return { bg: "#f0eeff", color: "#6c47ff", border: "1px solid #d5ccff" };
  return { bg: "#f5f4f1", color: "#888", border: "1px solid #e8e6ef" };
};

function StudentModal({ student, onClose }) {
  if (!student) return null;
  const initials = student.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const tc = trainingColor(student.training);

  return (
    <div className="ms-overlay" onClick={onClose}>
      <div className="ms-modal" onClick={e => e.stopPropagation()}>
        <button className="ms-modal-close" onClick={onClose}><FaTimes /></button>

        <h3 className="ms-modal-title">Student Profile</h3>
        <p className="ms-modal-sub">Full details from the student record.</p>

        {/* Student header */}
        <div className="ms-modal-head">
          <div className="ms-modal-avatar">{initials}</div>
          <div>
            <div className="ms-modal-name">{student.name}</div>
            <span className="ms-modal-badge" style={{ background: tc.bg, color: tc.color, border: tc.border || "none" }}>
              {student.training}
            </span>
          </div>
        </div>

        {/* Info grid */}
        <div className="ms-modal-grid">
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaIdCard /> Student ID</div>
            <div className="ms-modal-field-val">{student.id}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaUniversity /> University</div>
            <div className="ms-modal-field-val">{student.university}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaBookOpen /> Major</div>
            <div className="ms-modal-field-val">{student.major}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaGraduationCap /> Year</div>
            <div className="ms-modal-field-val">{student.year}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaCalendarAlt /> Semester</div>
            <div className="ms-modal-field-val">{student.semester}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaClock /> Credit Hours</div>
            <div className="ms-modal-field-val">{student.creditHours}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaCalendarAlt /> Registered</div>
            <div className="ms-modal-field-val">{student.registered}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaEnvelope /> Email</div>
            <div className="ms-modal-field-val">{student.email}</div>
          </div>
          <div className="ms-modal-field ms-modal-field-full">
            <div className="ms-modal-field-label"><FaPhone /> Mobile</div>
            <div className="ms-modal-field-val">{student.mobile}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManageStudents() {
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.includes(search) ||
    s.major.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ms-page">

      {/* Header */}
      <div className="ms-header">
        <h1 className="ms-title">Manage Students</h1>
        <p className="ms-sub">View and manage all students registered at your university</p>
      </div>

      {/* Search + count */}
      <div className="ms-toolbar">
        <div className="ms-search-wrap">
          <FaSearch className="ms-search-icon" />
          <input
            className="ms-search-inp"
            placeholder="Search by name, ID, or major..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="ms-count">{filtered.length} student{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Major</th>
              <th>Year</th>
              <th>Training</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#bbb", padding: 40 }}>
                  No students found
                </td>
              </tr>
            )}
            {filtered.map((s, i) => {
              const tc = trainingColor(s.training);
              return (
                <tr key={i} onClick={() => setSelected(s)} className="ms-row">
                  <td>
                    <div className="ms-student-cell">
                      <div className="ms-student-name">{s.name}</div>
                      <div className="ms-student-email">{s.email}</div>
                    </div>
                  </td>
                  <td className="ms-cell-id">{s.id}</td>
                  <td>{s.major}</td>
                  <td>{s.year}</td>
                  <td>
                    <span className="ms-badge" style={{ background: tc.bg, color: tc.color, border: tc.border || "none" }}>
                      {s.training}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && <StudentModal student={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
