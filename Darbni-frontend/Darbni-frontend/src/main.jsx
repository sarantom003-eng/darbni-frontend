import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Forgot from "./pages/Forgot.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Register from "./pages/Register.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminUniversities from "./pages/AdminUniversities.jsx";
import AdminSupervisors from "./pages/AdminSupervisors.jsx";
import AdminStudents from "./pages/AdminStudents.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";
import SuperAdminLayout from "./components/SuperAdminLayout.jsx";
import StudentLayout from "./components/StudentLayout.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import InternshipFeed from "./pages/InternshipFeed.jsx";
import InternshipDetail from "./pages/InternshipDetail.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import TrainingLogbook from "./pages/TrainingLogbook.jsx";
import RateCompany from "./pages/RateCompany.jsx";
import Notifications from "./pages/Notifications.jsx";
import CompanyLayout from "./components/CompanyLayout.jsx";
import CompanyDashboard from "./pages/CompanyDashboard.jsx";
import CompanyProfile from "./pages/CompanyProfile.jsx";
import PostInternship from "./pages/PostInternship.jsx";
import ManageInternships from "./pages/ManageInternships.jsx";
import StudentRequests from "./pages/StudentRequests.jsx";
import UniversityRequests from "./pages/UniversityRequests.jsx";
import InternProgress from "./pages/InternProgress.jsx";
import CompletionReports from "./pages/CompletionReports.jsx";
import UniversityLayout from "./components/UniversityLayout.jsx";
import UniversityDashboard from "./pages/UniversityDashboard.jsx";
import UniversityProfile from "./pages/UniversityProfile.jsx";
import ManageStudents from "./pages/ManageStudents.jsx";
import ManageCompanies from "./pages/ManageCompanies.jsx";
import ReviewApplications from "./pages/ReviewApplications.jsx";
import SupervisorInternProgress from "./pages/SupervisorInternProgress.jsx";
import SupervisorFinalReports from "./pages/SupervisorFinalReports.jsx";
import SupervisorContactMessages from "./pages/SupervisorContactMessages.jsx";
import SupervisorUniversitySettings from "./pages/SupervisorUniversitySettings.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  // ✅ الصفحات العامة (خارج الـ Layout)
  { path: "/about",          element: <AboutPage /> },
  { path: "/contact",        element: <ContactPage /> },
  { path: "/login",          element: <Login /> },
  { path: "/forgot",         element: <Forgot /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  { path: "/register",       element: <Register /> },

  // ✅ Super Admin Layout (Landing Page داخل الـ Layout)
  {
    path: "/",
    element: <SuperAdminLayout />,
    children: [
      { index: true,          element: <App /> },  // ← Landing Page هنا
      { path: "superadmin",   element: <AdminDashboard /> },
      { path: "superadmin/universities", element: <AdminUniversities /> },
      { path: "superadmin/supervisors",  element: <AdminSupervisors /> },
      { path: "superadmin/students",     element: <AdminStudents /> },
      { path: "superadmin/settings",     element: <AdminSettings /> },
    ],
  },

  // ✅ Student Layout (Landing Page داخل الـ Layout)
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      { index: true,          element: <StudentDashboard /> },
      { path: "landing",      element: <App /> },  // ← Landing Page هنا
      { path: "profile",      element: <StudentProfile /> },
      { path: "feed",         element: <InternshipFeed /> },
      { path: "internship/:id", element: <InternshipDetail /> },
      { path: "applications", element: <MyApplications /> },
      { path: "logbook",      element: <TrainingLogbook /> },
      { path: "rate",         element: <RateCompany /> },
      { path: "notifications", element: <Notifications /> },
    ],
  },

  // ✅ Supervisor Layout (Landing Page داخل الـ Layout)
  {
    path: "/supervisor",
    element: <UniversityLayout />,
    children: [
      { index: true,          element: <UniversityDashboard /> },
      { path: "landing",      element: <App /> },  // ← Landing Page هنا
      { path: "profile",      element: <UniversityProfile /> },
      { path: "students",     element: <ManageStudents /> },
      { path: "companies",    element: <ManageCompanies /> },
      { path: "applications", element: <ReviewApplications /> },
      { path: "progress",     element: <SupervisorInternProgress /> },
      { path: "reports",      element: <SupervisorFinalReports /> },
      { path: "messages",     element: <SupervisorContactMessages /> },
      { path: "settings",     element: <SupervisorUniversitySettings /> },
    ],
  },

  // ✅ Company Layout (Landing Page داخل الـ Layout)
  {
    path: "/company",
    element: <CompanyLayout />,
    children: [
      { index: true,          element: <CompanyDashboard /> },
      { path: "landing",      element: <App /> },  // ← Landing Page هنا
      { path: "profile",      element: <CompanyProfile /> },
      { path: "post",         element: <PostInternship /> },
      { path: "internships",  element: <ManageInternships /> },
      { path: "students",     element: <StudentRequests /> },
      { path: "university",   element: <UniversityRequests /> },
      { path: "progress",     element: <InternProgress /> },
      { path: "reports",      element: <CompletionReports /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);