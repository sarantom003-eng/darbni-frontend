const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const roleToFrontend = (role) => ({
  super_admin: "superadmin",
  university: "supervisor",
  student: "student",
  company: "company",
}[role] || role);

export const roleToBackend = (role) => ({
  superadmin: "super_admin",
  supervisor: "university",
  student: "student",
  company: "company",
}[role] || role);

export function getToken() {
  return localStorage.getItem("token");
}

export function saveSession(data) {
  if (!data) return;
  if (data.token) localStorage.setItem("token", data.token);
  if (data.userId) localStorage.setItem("userId", data.userId);
  if (data.role) localStorage.setItem("role", roleToFrontend(data.role));
  if (data.profile) {
    localStorage.setItem("profile", JSON.stringify(data.profile));
    const p = data.profile;
    if (p.email || data.email) localStorage.setItem("email", p.email || data.email);
    if (p.firstName) localStorage.setItem("firstName", p.firstName);
    if (p.lastName) localStorage.setItem("lastName", p.lastName);
    if (p.name) localStorage.setItem("name", p.name);
    else if (p.firstName) localStorage.setItem("name", p.firstName);
    if (p.university_name) localStorage.setItem("university", p.university_name);
    if (p.universityId?.name) localStorage.setItem("university", p.universityId.name);
    if (p.studentID) localStorage.setItem("studentId", p.studentID);
    if (p.major) localStorage.setItem("major", p.major);
    if (p.phone) localStorage.setItem("phone", p.phone);
  }
}

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const body = options.body;

  if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const message = typeof data === "object" ? data.message || data.error : data;
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  return data;
}

export const authApi = {
  login: (email, password) => api("/auth/login", { method: "POST", body: { email, password } }),
  signup: (payload) => api("/auth/signup", { method: "POST", body: payload }),
  forgotPassword: (email) => api("/password/forgot", { method: "POST", body: { email } }),
  resetPassword: (token, payload) => api(`/password/reset/${token}`, { method: "PUT", body: payload }),
};

export const profileApi = {
  me: () => api("/profile/me"),
  update: (payload) => api("/profile/me", { method: "PUT", body: payload }),
  stats: () => api("/profile/stats"),
  changePassword: (payload) => api("/profile/change-password", { method: "PUT", body: payload }),
};

export const trainingApi = {
  list: (params = {}) => api(`/trainings${toQuery(params)}`),
  mine: () => api("/trainings/my"),
  get: (id) => api(`/trainings/${id}`),
  create: (payload) => api("/trainings", { method: "POST", body: payload }),
  update: (id, payload) => api(`/trainings/${id}`, { method: "PUT", body: payload }),
  toggle: (id) => api(`/trainings/${id}/toggle`, { method: "PATCH" }),
  status: (id, publishStatus) => api(`/trainings/${id}/status`, { method: "PATCH", body: { publishStatus } }),
  remove: (id) => api(`/trainings/${id}`, { method: "DELETE" }),
};

export const applicationApi = {
  create: (trainingId, extra = {}) => api("/applications", { method: "POST", body: { trainingId, ...extra } }),
  mine: () => api("/applications/my"),
  company: () => api("/applications/company"),
  university: () => api("/applications/university"),
  companyResponse: (id, action, rejectionReason = "") => api(`/applications/${id}/company-response`, { method: "PATCH", body: { action, rejectionReason } }),
  submitToUniversity: (id, body = {}) => api(`/applications/${id}/submit-to-university`, { method: "PATCH", body }),
  universityResponse: (id, action, body = {}) => api(`/applications/${id}/university-response`, { method: "PATCH", body: { action, ...body } }),
  companyFinalResponse: (id, action = "approve", rejectionReason = "") => api(`/applications/${id}/company-final-response`, { method: "PATCH", body: { action, rejectionReason } }),
};

export const contactApi = {
  send: ({ name, email, subject, message }) => api("/contact", { method: "POST", body: { senderName: name, senderEmail: email, subject, message } }),
  list: (params = {}) => api(`/contact${toQuery(params)}`),
  reply: (id, reply) => api(`/contact/${id}/reply`, { method: "POST", body: { reply } }),
  status: (id, status) => api(`/contact/${id}/status`, { method: "PATCH", body: { status } }),
  remove: (id) => api(`/contact/${id}`, { method: "DELETE" }),
};

export const notificationApi = {
  list: () => api("/notifications"),
  unreadCount: () => api("/notifications/unread-count"),
  markAllRead: () => api("/notifications/mark-all-read", { method: "PATCH" }),
  markRead: (id) => api(`/notifications/${id}/read`, { method: "PATCH" }),
};

function toQuery(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "" && !String(v).startsWith("All ")) qs.set(k, v);
  });
  const str = qs.toString();
  return str ? `?${str}` : "";
}
