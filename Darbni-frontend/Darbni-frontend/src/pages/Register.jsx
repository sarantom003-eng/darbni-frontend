import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authApi, saveSession } from "../api/client";

const UNIVERSITIES = [
  { name: "Palestine Technical University – Kadoorie", studentDomain: "@students.ptuk.edu.ps", staffDomain: "@ptuk.edu.ps", home: true },
  { name: "An-Najah National University",             studentDomain: "@students.najah.edu",    staffDomain: "@najah.edu" },
  { name: "Birzeit University",                       studentDomain: "@students.birzeit.edu",  staffDomain: "@birzeit.edu" },
  { name: "Bethlehem University",                     studentDomain: "@students.bethlehem.edu",staffDomain: "@bethlehem.edu" },
  { name: "Palestine Polytechnic University",         studentDomain: "@students.ppu.edu",      staffDomain: "@ppu.edu" },
  { name: "Hebron University",                        studentDomain: "@students.hebron.edu",   staffDomain: "@hebron.edu" },
  { name: "Al-Quds Open University",                  studentDomain: "@students.qou.edu",      staffDomain: "@qou.edu" },
  { name: "Arab American University",                 studentDomain: "@students.aaup.edu",     staffDomain: "@aaup.edu" },
  { name: "Al-Quds University",                       studentDomain: "@students.alquds.edu",   staffDomain: "@alquds.edu" },
  { name: "Al-Istiqlal University",                   studentDomain: "@students.pass.ps",      staffDomain: "@pass.ps" },
];

const detectRoleFromEmail = (email) => {
  const e = email.toLowerCase().trim();
  for (const uni of UNIVERSITIES) {
    if (e.endsWith(uni.staffDomain))   return { role: "supervisor", uni: uni.name };
    if (e.endsWith(uni.studentDomain)) return { role: "student",    uni: uni.name };
  }
  const hasAt  = e.includes("@");
  const hasDot = e.split("@")[1]?.includes(".");
  if (hasAt && hasDot) return { role: "company", uni: null };
  return { role: null, uni: null };
};

export default function Register() {
  const navigate = useNavigate();

  const [email,                setEmail]                = useState("");
  const [firstName,            setFirstName]            = useState("");
  const [lastName,             setLastName]             = useState("");
  const [password,             setPassword]             = useState("");
  const [showPw,               setShowPw]               = useState(false);
  const [errors,               setErrors]               = useState({});
  const [loading,              setLoading]              = useState(false);
  const [apiError,             setApiError]             = useState("");
  const [apiInfo,              setApiInfo]              = useState("");

  const [studentID,            setStudentID]            = useState("");
  const [major,                setMajor]                = useState("");
  const [year_of_study,        setYearOfStudy]          = useState("");
  const [completedCreditHours, setCompletedCreditHours] = useState("");
  const [phone,                setPhone]                = useState("");

  const [companyName,          setCompanyName]          = useState("");
  const [industry,             setIndustry]             = useState("");
  const [city,                 setCity]                 = useState("");
  const [location,             setLocation]             = useState("");
  const [companyPhone,         setCompanyPhone]         = useState("");
  const [website,              setWebsite]              = useState("");
  const [about,                setAbout]                = useState("");

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const detected = useMemo(() => detectRoleFromEmail(email), [email]);
  const isStudent = detected.role === "student";
  const isCompany = detected.role === "company";

  const validate = () => {
    const e = {};
    if (!email.trim())             e.email     = "Email is required";
    else if (!isValidEmail(email)) e.email     = "Enter a valid email";
    else if (!detected.role)       e.email     = "Email domain not recognized";
    if (!password)                 e.password  = "Password is required";
    else if (password.length < 6)  e.password  = "Min 6 characters";

    if (!isCompany) {
      if (!firstName.trim()) e.firstName = "First name is required";
      if (!lastName.trim())  e.lastName  = "Last name is required";
    }

    if (isStudent) {
      if (!studentID.trim())            e.studentID            = "Student ID is required";
      if (!major.trim())                e.major                = "Major is required";
      if (!year_of_study)               e.year_of_study        = "Year of study is required";
      if (!completedCreditHours)        e.completedCreditHours = "Credit hours is required";
      if (!phone.trim())                e.phone                = "Phone is required";
    }

    if (isCompany) {
      if (!companyName.trim()) e.companyName = "Company name is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError("");
    setApiInfo("");

    try {
      let payload;

      if (isStudent) {
        payload = {
          email, password, firstName, lastName,
          studentID, major,
          year_of_study: Number(year_of_study),
          completedCreditHours: Number(completedCreditHours),
          phone,
        };
      } else if (isCompany) {
        payload = {
          email, password,
          name: companyName,
          industry,
          city,
          location,
          phone: companyPhone,
          website,
          about,
        };
      } else {
        payload = {
          email, password,
          name: `${firstName} ${lastName}`.trim(),
        };
      }

      const data = await authApi.signup(payload);

      if (data.token) {
        saveSession(data);
        const companyId = localStorage.getItem("selectedCompany");
        if (companyId && isStudent) {
          localStorage.removeItem("selectedCompany");
          navigate(`/student/internship/${companyId}`);
        } else if (isStudent) {
          navigate("/student/feed");
        } else {
          navigate("/login");
        }
      } else {
        setApiInfo(data.message || "Account submitted. Please wait for approval before signing in.");
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleInfo = () => {
    if (!email || !detected.role) return null;
    if (detected.role === "supervisor") return (
      <div className="reg-role-box supervisor">
        <span className="reg-role-icon">✓</span>
        <div>
          <strong>University Supervisor (Admin)</strong>
          <p>As a supervisor, you'll have full admin access to manage your university's training platform.</p>
        </div>
      </div>
    );
    if (detected.role === "student") return (
      <div className="reg-role-box student">
        <span className="reg-role-icon">🎓</span>
        <div>
          <strong>Student</strong>
          <p>You'll be registered as a student at {detected.uni}. Browse and apply for internships.</p>
        </div>
      </div>
    );
    if (detected.role === "company") return (
      <div className="reg-role-box company">
        <span className="reg-role-icon">🏢</span>
        <div>
          <strong>Company</strong>
          <p>You'll be registered as a company. Your account will need supervisor approval.</p>
        </div>
      </div>
    );
  };

  const uniHint = () => {
    if (!email || !isValidEmail(email)) return null;
    if (detected.role === "supervisor") return (
      <div className="reg-uni-hint">
        🏛 You'll be registered as a university supervisor (admin) at <strong>{detected.uni}</strong>
      </div>
    );
    if (detected.role === "student") return (
      <div className="reg-uni-hint">
        🎓 Detected as student at <strong>{detected.uni}</strong>
      </div>
    );
    return null;
  };

  return (
    <>
      <Navbar />
      <div className="reg-page">
        <div className="reg-card">
          <h1 className="reg-title">Create Account</h1>
          <p className="reg-sub">Enter your email — your role is detected automatically</p>
          {apiError && <div className="contact-success" style={{ background: "#ffecec", color: "#b00020" }}>{apiError}</div>}
          {apiInfo  && <div className="contact-success">{apiInfo}</div>}

          <form onSubmit={handleSubmit} noValidate autoComplete="off">

            {/* Email */}
            <div className="reg-field">
              <label>Email Address</label>
              <div className="reg-inp-wrap">
                <span className="reg-inp-icon">✉</span>
                <input
                  type="email"
                  placeholder="you@students.ptuk.edu.ps"
                  value={email}
                  autoComplete="off"
                  onChange={e => { setEmail(e.target.value); setErrors({}); }}
                  className={errors.email ? "reg-inp error" : "reg-inp"}
                />
              </div>
              {errors.email && <p className="reg-err">{errors.email}</p>}
              {uniHint()}
            </div>

            {/* Role Box */}
            {roleInfo()}

            {/* ✅ فيلدات الشركة */}
            {isCompany && (
              <div className="reg-role-box company" style={{ flexDirection: "column", gap: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span>🏢</span>
                  <strong>Company Information</strong>
                </div>

                {/* Company Name */}
                <div className="reg-field" style={{ marginBottom: 0 }}>
                  <label>Company Name</label>
                  <div className="reg-inp-wrap">
                    <input
                      type="text"
                      placeholder="Your company name"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className={errors.companyName ? "reg-inp error" : "reg-inp"}
                      style={{ paddingLeft: "14px" }}
                    />
                  </div>
                  {errors.companyName && <p className="reg-err">{errors.companyName}</p>}
                </div>

                {/* Password */}
                <div className="reg-field" style={{ marginBottom: 0 }}>
                  <label>Password</label>
                  <div className="reg-inp-wrap">
                    <span className="reg-inp-icon">🔒</span>
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      autoComplete="new-password"
                      onChange={e => setPassword(e.target.value)}
                      className={errors.password ? "reg-inp error" : "reg-inp"}
                    />
                    <button type="button" className="reg-eye" onClick={() => setShowPw(!showPw)}>
                      {showPw
                        ? <svg viewBox="0 0 24 24" width="16" height="16" stroke="#aaa" fill="none" strokeWidth="2" strokeLinecap="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        : <svg viewBox="0 0 24 24" width="16" height="16" stroke="#aaa" fill="none" strokeWidth="2" strokeLinecap="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                      }
                    </button>
                  </div>
                  {errors.password && <p className="reg-err">{errors.password}</p>}
                </div>

                {/* Industry + City */}
                <div className="reg-row">
                  <div className="reg-field" style={{ marginBottom: 0 }}>
                    <label>Industry</label>
                    <div className="reg-inp-wrap">
                      <input
                        type="text"
                        placeholder="Your industry"
                        value={industry}
                        onChange={e => setIndustry(e.target.value)}
                        className="reg-inp"
                        style={{ paddingLeft: "14px" }}
                      />
                    </div>
                  </div>
                  <div className="reg-field" style={{ marginBottom: 0 }}>
                    <label>City</label>
                    <div className="reg-inp-wrap">
                      <input
                        type="text"
                        placeholder="Your city"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="reg-inp"
                        style={{ paddingLeft: "14px" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="reg-field" style={{ marginBottom: 0 }}>
                  <label>Location / Address</label>
                  <div className="reg-inp-wrap">
                    <input
                      type="text"
                      placeholder="Your address"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="reg-inp"
                      style={{ paddingLeft: "14px" }}
                    />
                  </div>
                </div>

                {/* Phone + Website */}
                <div className="reg-row">
                  <div className="reg-field" style={{ marginBottom: 0 }}>
                    <label>Phone</label>
                    <div className="reg-inp-wrap">
                      <input
                        type="text"
                        placeholder="Your phone number"
                        value={companyPhone}
                        onChange={e => setCompanyPhone(e.target.value)}
                        className="reg-inp"
                        style={{ paddingLeft: "14px" }}
                      />
                    </div>
                  </div>
                  <div className="reg-field" style={{ marginBottom: 0 }}>
                    <label>Website</label>
                    <div className="reg-inp-wrap">
                      <input
                        type="text"
                        placeholder="Your website"
                        value={website}
                        onChange={e => setWebsite(e.target.value)}
                        className="reg-inp"
                        style={{ paddingLeft: "14px" }}
                      />
                    </div>
                  </div>
                </div>

                {/* About */}
                <div className="reg-field" style={{ marginBottom: 0 }}>
                  <label>About</label>
                  <textarea
                    placeholder="Brief description of your company..."
                    value={about}
                    onChange={e => setAbout(e.target.value)}
                    className="reg-inp"
                    rows={3}
                    style={{ paddingLeft: "14px", resize: "vertical" }}
                  />
                </div>

                <p style={{ fontSize: 12, color: "#b8860b", margin: 0 }}>
                  ⚠ Company accounts require approval from a university supervisor before full access.
                </p>
              </div>
            )}

            {/* Name + Password للطالب والسوبرفايزر */}
            {!isCompany && (
              <>
                <div className="reg-row">
                  <div className="reg-field">
                    <label>First Name</label>
                    <div className="reg-inp-wrap">
                      <span className="reg-inp-icon">👤</span>
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        autoComplete="off"
                        onChange={e => setFirstName(e.target.value)}
                        className={errors.firstName ? "reg-inp error" : "reg-inp"}
                      />
                    </div>
                    {errors.firstName && <p className="reg-err">{errors.firstName}</p>}
                  </div>
                  <div className="reg-field">
                    <label>Last Name</label>
                    <div className="reg-inp-wrap">
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        autoComplete="off"
                        onChange={e => setLastName(e.target.value)}
                        className={errors.lastName ? "reg-inp error" : "reg-inp"}
                        style={{ paddingLeft: "14px" }}
                      />
                    </div>
                    {errors.lastName && <p className="reg-err">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="reg-field">
                  <label>Password</label>
                  <div className="reg-inp-wrap">
                    <span className="reg-inp-icon">🔒</span>
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      autoComplete="new-password"
                      onChange={e => setPassword(e.target.value)}
                      className={errors.password ? "reg-inp error" : "reg-inp"}
                    />
                    <button type="button" className="reg-eye" onClick={() => setShowPw(!showPw)}>
                      {showPw
                        ? <svg viewBox="0 0 24 24" width="16" height="16" stroke="#aaa" fill="none" strokeWidth="2" strokeLinecap="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        : <svg viewBox="0 0 24 24" width="16" height="16" stroke="#aaa" fill="none" strokeWidth="2" strokeLinecap="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                      }
                    </button>
                  </div>
                  {errors.password && <p className="reg-err">{errors.password}</p>}
                </div>
              </>
            )}

            {/* fields الطالب */}
            {isStudent && (
              <>
                <div className="reg-row">
                  <div className="reg-field">
                    <label>Student ID</label>
                    <div className="reg-inp-wrap">
                      <input
                        type="text"
                        placeholder="1201001"
                        value={studentID}
                        onChange={e => setStudentID(e.target.value)}
                        className={errors.studentID ? "reg-inp error" : "reg-inp"}
                        style={{ paddingLeft: "14px" }}
                      />
                    </div>
                    {errors.studentID && <p className="reg-err">{errors.studentID}</p>}
                  </div>
                  <div className="reg-field">
                    <label>Phone</label>
                    <div className="reg-inp-wrap">
                      <input
                        type="text"
                        placeholder="05xxxxxxxx"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className={errors.phone ? "reg-inp error" : "reg-inp"}
                        style={{ paddingLeft: "14px" }}
                      />
                    </div>
                    {errors.phone && <p className="reg-err">{errors.phone}</p>}
                  </div>
                </div>

                <div className="reg-field">
                  <label>Major</label>
                  <div className="reg-inp-wrap">
                    <input
                      type="text"
                      placeholder="Computer Science"
                      value={major}
                      onChange={e => setMajor(e.target.value)}
                      className={errors.major ? "reg-inp error" : "reg-inp"}
                      style={{ paddingLeft: "14px" }}
                    />
                  </div>
                  {errors.major && <p className="reg-err">{errors.major}</p>}
                </div>

                <div className="reg-row">
                  <div className="reg-field">
                    <label>Year of Study</label>
                    <div className="reg-inp-wrap">
                      <select
                        value={year_of_study}
                        onChange={e => setYearOfStudy(e.target.value)}
                        className={errors.year_of_study ? "reg-inp error" : "reg-inp"}
                        style={{ paddingLeft: "14px" }}
                      >
                        <option value="">Select year</option>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                        <option value="5">Year 5</option>
                      </select>
                    </div>
                    {errors.year_of_study && <p className="reg-err">{errors.year_of_study}</p>}
                  </div>
                  <div className="reg-field">
                    <label>Completed Credit Hours</label>
                    <div className="reg-inp-wrap">
                      <input
                        type="number"
                        placeholder="90"
                        min="0"
                        value={completedCreditHours}
                        onChange={e => setCompletedCreditHours(e.target.value)}
                        className={errors.completedCreditHours ? "reg-inp error" : "reg-inp"}
                        style={{ paddingLeft: "14px" }}
                      />
                    </div>
                    {errors.completedCreditHours && <p className="reg-err">{errors.completedCreditHours}</p>}
                  </div>
                </div>
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`reg-btn${!detected.role && email ? " disabled" : ""}`}
              disabled={loading}
            >
              {loading ? "Creating..." : detected.role ? "Create Account" : "Enter your email to continue"}
            </button>

          </form>

         

          <div className="reg-signin">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
}