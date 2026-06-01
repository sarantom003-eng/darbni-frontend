import { useState, useEffect } from "react";
import {
  FaSearch, FaIdCard, FaUniversity, FaBookOpen, FaCalendarAlt,
  FaClock, FaEnvelope, FaPhone, FaGraduationCap, FaTimes, FaSpinner
} from "react-icons/fa";
import { api } from "../api/client";

const trainingColor = (t) => {
  if (t === "completed")   return { bg: "#6c47ff", color: "#fff" };
  if (t === "in_training") return { bg: "#f0eeff", color: "#6c47ff", border: "1px solid #d5ccff" };
  return { bg: "#f5f4f1", color: "#888", border: "1px solid #e8e6ef" };
};

const trainingLabel = (t) => {
  if (t === "completed")   return "Completed";
  if (t === "in_training") return "In Progress";
  return "Not Started";
};

function StudentModal({ studentId, onClose }) {
  const [student, setStudent] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api(`/supervisor/students/${studentId}`);
        setStudent(res.student || {});
        setEmail(res.email || "");
      } catch (err) {
        console.error("Error fetching student detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [studentId]);

  if (loading) return (
    <div className="ms-overlay" onClick={onClose}>
      <div className="ms-modal" onClick={e => e.stopPropagation()}>
        <button className="ms-modal-close" onClick={onClose}><FaTimes /></button>
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <FaSpinner className="spinner" />
        </div>
      </div>
    </div>
  );

  if (!student) return null;

  const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim();
  const initials = fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const tc = trainingColor(student.trainingStatus);

  return (
    <div className="ms-overlay" onClick={onClose}>
      <div className="ms-modal" onClick={e => e.stopPropagation()}>
        <button className="ms-modal-close" onClick={onClose}><FaTimes /></button>

        <h3 className="ms-modal-title">Student Profile</h3>
        <p className="ms-modal-sub">Full details from the student record.</p>

        <div className="ms-modal-head">
          <div className="ms-modal-avatar">{initials}</div>
          <div>
            <div className="ms-modal-name">{fullName}</div>
            <span className="ms-modal-badge" style={{ background: tc.bg, color: tc.color, border: tc.border || "none" }}>
              {trainingLabel(student.trainingStatus)}
            </span>
          </div>
        </div>

        <div className="ms-modal-grid">
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaIdCard /> Student ID</div>
            <div className="ms-modal-field-val">{student.studentID || "N/A"}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaUniversity /> University</div>
            <div className="ms-modal-field-val">{student.university_name || student.universityId?.name || "N/A"}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaBookOpen /> Major</div>
            <div className="ms-modal-field-val">{student.major || "N/A"}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaGraduationCap /> Year</div>
            <div className="ms-modal-field-val">{student.year_of_study ? `${student.year_of_study}th Year` : "N/A"}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaClock /> Credit Hours</div>
            <div className="ms-modal-field-val">{student.completedCreditHours ?? "N/A"}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaCalendarAlt /> Registered</div>
            <div className="ms-modal-field-val">{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "N/A"}</div>
          </div>
          <div className="ms-modal-field">
            <div className="ms-modal-field-label"><FaEnvelope /> Email</div>
            <div className="ms-modal-field-val">{email || "N/A"}</div>
          </div>
          <div className="ms-modal-field ms-modal-field-full">
            <div className="ms-modal-field-label"><FaPhone /> Mobile</div>
            <div className="ms-modal-field-val">{student.phone || "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api("/supervisor/students");
        setStudents(res.students || []);
      } catch (err) {
        setError(err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s => {
    const fullName = `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase();
    const q = search.toLowerCase();
    return (
      fullName.includes(q) ||
      (s.studentID || "").includes(q) ||
      (s.major || "").toLowerCase().includes(q)
    );
  });

  if (loading) return (
    <div className="ms-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <FaSpinner className="spinner" />
    </div>
  );

  if (error) return (
    <div className="ms-page">
      <div style={{ color: "#e74c3c", padding: 20 }}>{error}</div>
    </div>
  );

  return (
    <div className="ms-page">
      <div className="ms-header">
        <h1 className="ms-title">Manage Students</h1>
        <p className="ms-sub">View and manage all students registered at your university</p>
      </div>

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

      <div className="ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Major</th>
              <th>Year</th>
              <th>Credit Hours</th>
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
            {filtered.map((s) => {
              const fullName = `${s.firstName || ""} ${s.lastName || ""}`.trim();
              return (
                <tr key={s._id} onClick={() => setSelectedId(s._id)} className="ms-row">
                  <td>
                    <div className="ms-student-cell">
                      <div className="ms-student-name">{fullName || "N/A"}</div>
                    </div>
                  </td>
                  <td className="ms-cell-id">{s.studentID || "N/A"}</td>
                  <td>{s.major || "N/A"}</td>
                  <td>{s.year_of_study ? `${s.year_of_study}th` : "N/A"}</td>
                  <td>{s.completedCreditHours ?? "N/A"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedId && (
        <StudentModal
          studentId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}