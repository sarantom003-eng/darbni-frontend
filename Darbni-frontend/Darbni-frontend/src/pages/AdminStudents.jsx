import { useState } from "react";

const INIT_STUDENTS = [
  { name: "Sara Omar",       id: "PTUK20210002", major: "Civil Engineering",        university: "Palestine Technical University – Kadoorie", creditHours: 93,  joinedDate: "2024-02-02" },
  { name: "Tareq Adel",      id: "PTUK20210003", major: "Civil Engineering",        university: "Palestine Technical University – Kadoorie", creditHours: 99,  joinedDate: "2024-12-24" },
  { name: "Yara Adel",       id: "PTUK20210004", major: "Software Engineering",     university: "Palestine Technical University – Kadoorie", creditHours: 109, joinedDate: "2024-07-25" },
  { name: "Yousef Nasser",   id: "PTUK20210005", major: "Computer Science",         university: "Palestine Technical University – Kadoorie", creditHours: 139, joinedDate: "2024-04-06" },
  { name: "Mohammed Said",   id: "PTUK20210006", major: "Business Administration",  university: "Palestine Technical University – Kadoorie", creditHours: 112, joinedDate: "2024-03-18" },
  { name: "Dana Adel",       id: "PTUK20210007", major: "Information Systems",      university: "Palestine Technical University – Kadoorie", creditHours: 108, joinedDate: "2024-04-20" },
  { name: "Khaled Hadi",     id: "PTUK20210008", major: "Business Administration",  university: "Palestine Technical University – Kadoorie", creditHours: 72,  joinedDate: "2024-03-13" },
  { name: "Omar Saleh",      id: "PTUK20210009", major: "Business Administration",  university: "Palestine Technical University – Kadoorie", creditHours: 69,  joinedDate: "2024-07-11" },
  { name: "Layla Ali",       id: "PTUK20210010", major: "Marketing",               university: "Palestine Technical University – Kadoorie", creditHours: 130, joinedDate: "2024-09-07" },
  { name: "Mohammed Said",   id: "PTUK20210011", major: "Information Systems",      university: "Palestine Technical University – Kadoorie", creditHours: 101, joinedDate: "2024-12-21" },
  { name: "Mohammed Daher",  id: "PTUK20210012", major: "Marketing",               university: "Palestine Technical University – Kadoorie", creditHours: 81,  joinedDate: "2024-05-15" },
  { name: "Ahmad Nasser",    id: "NAJAH20210001", major: "Computer Science",        university: "An-Najah National University",             creditHours: 95,  joinedDate: "2024-03-10" },
  { name: "Layla Haddad",    id: "NAJAH20210002", major: "Software Engineering",    university: "An-Najah National University",             creditHours: 110, joinedDate: "2024-06-15" },
];

export default function AdminStudents() {
  const [search, setSearch] = useState("");

  const filtered = INIT_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.major.toLowerCase().includes(search.toLowerCase())
  );

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
          onChange={e => setSearch(e.target.value)}
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
            {filtered.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td><span className="au-code-badge">{s.id}</span></td>
                <td style={{ color: "#555" }}>{s.major}</td>
                <td style={{ color: "#888", fontSize: 13 }}>{s.university}</td>
                <td style={{ textAlign: "center" }}>{s.creditHours}</td>
                <td style={{ color: "#888" }}>{s.joinedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}