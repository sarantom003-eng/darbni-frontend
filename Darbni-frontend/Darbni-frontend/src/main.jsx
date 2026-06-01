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
// ✅ أضفنا ContactMessages للـ superadmin
import ContactMessages from "./pages/ContactMessages.jsx";
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
import SupervisorUniversitySettings from "./pages/SupervisorUniversitySettings.jsx";
// ✅ حذفنا import SupervisorContactMessages

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/",               element: <App /> },
  { path: "/about",          element: <AboutPage /> },
  { path: "/contact",        element: <ContactPage /> },
  { path: "/login",          element: <Login /> },
  { path: "/forgot",         element: <Forgot /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  { path: "/register",       element: <Register /> },

  {
    path: "/superadmin",
    element: <SuperAdminLayout />,
    children: [
      { index: true,          element: <AdminDashboard /> },
      { path: "universities", element: <AdminUniversities /> },
      { path: "supervisors",  element: <AdminSupervisors /> },
      { path: "students",     element: <AdminStudents /> },
      // ✅ أضفنا Contact Messages للـ superadmin
      { path: "messages",     element: <ContactMessages /> },
      { path: "settings",     element: <AdminSettings /> },
    ],
  },

  { path: "/student",                element: <StudentLayout><StudentDashboard /></StudentLayout> },
  { path: "/student/profile",        element: <StudentLayout><StudentProfile /></StudentLayout> },
  { path: "/student/feed",           element: <StudentLayout><InternshipFeed /></StudentLayout> },
  { path: "/student/internship/:id", element: <StudentLayout><InternshipDetail /></StudentLayout> },
  { path: "/student/applications",   element: <StudentLayout><MyApplications /></StudentLayout> },
  { path: "/student/logbook",        element: <StudentLayout><TrainingLogbook /></StudentLayout> },
  { path: "/student/rate",           element: <StudentLayout><RateCompany /></StudentLayout> },
  { path: "/student/notifications",  element: <StudentLayout><Notifications /></StudentLayout> },

  {
    path: "/supervisor",
    element: <UniversityLayout />,
    children: [
      { index: true,          element: <UniversityDashboard /> },
      { path: "profile",      element: <UniversityProfile /> },
      { path: "students",     element: <ManageStudents /> },
      { path: "companies",    element: <ManageCompanies /> },
      { path: "applications", element: <ReviewApplications /> },
      { path: "progress",     element: <SupervisorInternProgress /> },
      { path: "reports",      element: <SupervisorFinalReports /> },
      // ✅ حذفنا messages من هون
      { path: "settings",     element: <SupervisorUniversitySettings /> },
    ],
  },

  {
    path: "/company",
    element: <CompanyLayout />,
    children: [
      { index: true,          element: <CompanyDashboard /> },
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