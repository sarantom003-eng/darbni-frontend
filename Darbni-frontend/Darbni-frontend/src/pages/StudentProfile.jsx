import { useState, useEffect, useRef, useCallback } from "react";
import { FaEdit, FaSave, FaCamera, FaUser } from "react-icons/fa";
import { profileApi, api } from "../api/client";

function StudentProfile() {
  const fileRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar,    setAvatar]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [profile, setProfile] = useState({
    firstName:   "",
    lastName:    "",
    email:       "",
    phone:       "",
    university:  "",
    studentId:   "",
    yearOfStudy: "",
    major:       "",
    interests:   "",
    skills:      "",
  });

  const [draft, setDraft] = useState({ ...profile });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // GET /profile/me
        // Response: { profile: { firstName, lastName, ... }, email, role }
        const data        = await profileApi.me();
        const profileData = data.profile || data;

        setProfile({
          firstName:   profileData.firstName   || "",
          lastName:    profileData.lastName    || "",
          email:       data.email              || "",
          phone:       profileData.phone       || "",
          university:  profileData.university_name || profileData.universityId?.name || "",
          studentId:   profileData.studentID   || "",
          yearOfStudy: profileData.year_of_study ? `${profileData.year_of_study}th Year` : "",
          major:       profileData.major       || "",
          interests:   Array.isArray(profileData.interests)
                         ? profileData.interests.join(", ")
                         : (profileData.interests || ""),
          skills:      Array.isArray(profileData.skills)
                         ? profileData.skills.join(", ")
                         : (profileData.skills || ""),
        });

        // avatar من الـ Response
        if (profileData.avatar) setAvatar(profileData.avatar);

      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const initials = `${profile.firstName[0] || ""}${profile.lastName[0] || ""}`.toUpperCase();

  const handleEdit = () => {
    setDraft({ ...profile });
    setIsEditing(true);
    setSaveError("");
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setIsEditing(false);
    setSaveError("");
  };

  const handleSave = async () => {
    if (!draft.firstName.trim() || !draft.lastName.trim()) {
      setSaveError("First and last name are required");
      return;
    }
    setSaveError("");
    try {
      // PUT /profile/me
      // Body: { firstName, lastName, phone, skills[], interests[] }
      await profileApi.update({
        firstName: draft.firstName,
        lastName:  draft.lastName,
        phone:     draft.phone,
        skills:    draft.skills.split(",").map(s => s.trim()).filter(s => s),
        interests: draft.interests.split(",").map(s => s.trim()).filter(s => s),
      });
      setProfile({ ...draft });
      setIsEditing(false);

      // تحديث الـ localStorage
      const stored = JSON.parse(localStorage.getItem("profile") || "{}");
      stored.firstName = draft.firstName;
      stored.lastName  = draft.lastName;
      stored.phone     = draft.phone;
      localStorage.setItem("profile", JSON.stringify(stored));
      localStorage.setItem("firstName", draft.firstName);

    } catch (err) {
      setSaveError(err.message || "Failed to save changes");
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Maximum 5MB allowed.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // POST /upload/avatar
      // Response: { message, avatarUrl }
      const res = await api("/upload/avatar", { method: "POST", body: formData });

      if (res.avatarUrl) {
        setAvatar(res.avatarUrl);

        // تحديث الـ localStorage بالصورة الجديدة
        const stored = JSON.parse(localStorage.getItem("profile") || "{}");
        stored.avatar = res.avatarUrl;
        localStorage.setItem("profile", JSON.stringify(stored));
      }
    } catch (err) {
      alert(err.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
      // reset input عشان تقدري ترفعي نفس الصورة مرة ثانية
      e.target.value = "";
    }
  };

  const handleDraftChange = useCallback((key, value) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  }, []);

  if (loading) {
    return <div className="loading-state">Loading profile...</div>;
  }

  return (
    <>
      <div className="profile-page-header">
        <div>
          <h1 className="profile-page-title">Academic Profile</h1>
          <p className="profile-page-sub">Manage your personal and academic information</p>
        </div>
        {!isEditing ? (
          <button className="profile-edit-btn" onClick={handleEdit}>
            <FaEdit /> Edit Profile
          </button>
        ) : (
          <div className="profile-action-buttons">
            <button className="profile-cancel-btn" onClick={handleCancel}>Cancel</button>
            <button className="profile-save-btn" onClick={handleSave}>
              <FaSave /> Save Changes
            </button>
          </div>
        )}
      </div>

      {saveError && (
        <div style={{ background: "#fff0f0", color: "#e74c3c", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          {saveError}
        </div>
      )}

      <div className="profile-banner-wrap">
        <div className="profile-banner" />
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            {avatar ? (
              <img src={avatar} alt="avatar" className="profile-avatar-img" />
            ) : (
              <span className="profile-avatar-initials">{initials}</span>
            )}
            <button
              className="profile-avatar-camera"
              onClick={() => fileRef.current.click()}
              disabled={uploading}
              title={uploading ? "Uploading..." : "Change photo"}
            >
              {uploading ? "..." : <FaCamera />}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
          </div>
          <div className="profile-banner-info">
            <div className="profile-banner-name">{profile.university}</div>
            <div className="profile-banner-tags">
              {profile.yearOfStudy && (
                <span className="profile-tag">🎓 {profile.yearOfStudy}</span>
              )}
              {profile.major && (
                <span className="profile-tag">💻 {profile.major}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-section-card">
          <div className="profile-section-title">
            <FaUser /> Personal Information
          </div>
          <div className="profile-row-2">
            <div className="profile-field">
              <label>First Name</label>
              <input
                type="text"
                value={isEditing ? draft.firstName : profile.firstName}
                onChange={e => handleDraftChange("firstName", e.target.value)}
                disabled={!isEditing}
                placeholder="First Name"
                className={`profile-inp${isEditing ? " active" : ""}`}
              />
            </div>
            <div className="profile-field">
              <label>Last Name</label>
              <input
                type="text"
                value={isEditing ? draft.lastName : profile.lastName}
                onChange={e => handleDraftChange("lastName", e.target.value)}
                disabled={!isEditing}
                placeholder="Last Name"
                className={`profile-inp${isEditing ? " active" : ""}`}
              />
            </div>
          </div>
          <div className="profile-field">
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="profile-inp"
            />
          </div>
          <div className="profile-field">
            <label>Phone</label>
            <input
              type="tel"
              value={isEditing ? draft.phone : profile.phone}
              onChange={e => handleDraftChange("phone", e.target.value)}
              disabled={!isEditing}
              placeholder="+970 5XX XXX XXX"
              className={`profile-inp${isEditing ? " active" : ""}`}
            />
          </div>
        </div>

        <div className="profile-section-card">
          <div className="profile-section-title">Academic Details</div>
          <div className="profile-field">
            <label>University</label>
            <input
              type="text"
              value={profile.university}
              disabled
              className="profile-inp"
            />
          </div>
          <div className="profile-row-2">
            <div className="profile-field">
              <label>Student ID</label>
              <input
                type="text"
                value={profile.studentId}
                disabled
                className="profile-inp"
              />
            </div>
            <div className="profile-field">
              <label>Year of Study</label>
              <input
                type="text"
                value={profile.yearOfStudy}
                disabled
                className="profile-inp"
              />
            </div>
          </div>
          <div className="profile-field">
            <label>Major</label>
            <input
              type="text"
              value={profile.major}
              disabled
              className="profile-inp"
            />
          </div>
        </div>
      </div>

      <div className="profile-section-card">
        <div className="profile-section-title">Interests & Skills</div>
        <div className="profile-sections">
          <div className="profile-field">
            <label>Areas of Interest (comma separated)</label>
            <textarea
              value={isEditing ? draft.interests : profile.interests}
              onChange={e => handleDraftChange("interests", e.target.value)}
              disabled={!isEditing}
              rows={4}
              placeholder="Web Development, UI/UX Design, Cloud Computing"
              className={`profile-inp profile-textarea${isEditing ? " active" : ""}`}
            />
          </div>
          <div className="profile-field">
            <label>Technical Skills (comma separated)</label>
            <textarea
              value={isEditing ? draft.skills : profile.skills}
              onChange={e => handleDraftChange("skills", e.target.value)}
              disabled={!isEditing}
              rows={4}
              placeholder="React, TypeScript, Node.js, PostgreSQL, Git"
              className={`profile-inp profile-textarea${isEditing ? " active" : ""}`}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentProfile;