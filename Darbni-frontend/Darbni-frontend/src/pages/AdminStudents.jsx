import { useState, useEffect } from "react";
import { api } from "../api/client";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // جلب الطلاب من الباك إند
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("page", page);
      params.append("limit", 20);
      
      const res = await api(`/superadmin/all-students?${params.toString()}`);
      setStudents(res.students || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setHasMore(res.pagination?.hasMore || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, page]);

  // تنسيق التاريخ
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString();
  };

  // البحث (مع debounce اختياري)
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // إعادة تعيين الصفحة عند البحث
  };

  if (loading && students.length === 0) {
    return <div className="loading-state">Loading students...</div>;
  }

  return (
    <div className="au-page">
      <div className="au-header">
        <div>
          <h1 className="au-title">🎓 Students</h1>
          <p className="au-sub">All students registered across every university</p>
        </div>
      </div>

      <div className="au-search-wrap">
        <span className="au-search-icon">🔍</span>
        <input
          className="au-search-inp"
          placeholder="Search by name, student ID, or major..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="au-table-wrap">
        <table className="au-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Student ID</th>
              <th>Major</th>
              <th>University</th>
              <th>Credit Hours</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
                No students found
              </td></tr>
            ) : (
              students.map((s, i) => (
                <tr key={s._id || i}>
                  <td style={{ fontWeight: 600 }}>{s.firstName} {s.lastName}</td>
                  <td><span className="au-code-badge">{s.studentID}</span></td>
                  <td style={{ color: "#555" }}>{s.major}</td>
                  <td style={{ color: "#888", fontSize: 13 }}>{s.universityId?.name || s.university_name}</td>
                  <td style={{ textAlign: "center" }}>{s.completedCreditHours || 0}</td>
                  <td style={{ color: "#888" }}>{formatDate(s.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="au-pagination">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="au-page-btn"
          >
            Previous
          </button>
          <span className="au-page-info">Page {page} of {totalPages}</span>
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore}
            className="au-page-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}