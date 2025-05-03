import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import JobseekerDashboard from "./pages/JobseekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ResumeUpload from "./pages/ResumeUpload";
import JobRecommendations from "./pages/JobRecommendations";
import CourseRecommendations from "./pages/CourseRecommendations";
import ApplicationTracking from "./pages/ApplicationTracking";
import InterviewReminders from "./pages/InterviewReminders";
import MarketInsights from "./pages/MarketInsights";
import JobManagement from "./pages/JobManagement";
import CandidateScreening from "./pages/CandidateScreening";
import ForgotPassword from "./pages/ForgotPassword";
import StatsDashboard from "./pages/AdminStats";
import BlogPage from "./pages/BlogPage";

import { Navigate } from "react-router-dom";

function App() {
  const isLoggedIn = sessionStorage.getItem("user");
  const role = sessionStorage.getItem("userRole");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            role === "jobseeker" ? (
              <Navigate to="/dashboard/jobseeker" />
            ) : role === "employer" ? (
              <Navigate to="/dashboard/employer" />
            ) : role === "admin" ? (
              <Navigate to="/dashboard/admin" />
            ) : (
              <Home />
            )
          }
        />{" "}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/jobseeker" element={<JobseekerDashboard />} />
        <Route path="/dashboard/employer" element={<EmployerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
        <Route path="/job-recommendations" element={<JobRecommendations />} />
        <Route
          path="/course-recommendations"
          element={<CourseRecommendations />}
        />
        <Route path="/application-tracking" element={<ApplicationTracking />} />
        <Route path="/interview-reminders" element={<InterviewReminders />} />
        <Route path="/market-insights" element={<MarketInsights />} />
        <Route path="/job-management" element={<JobManagement />} />
        <Route path="/candidate-screening" element={<CandidateScreening />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/stats" element={<StatsDashboard />} />
        <Route path="/blogs" element={<BlogPage />} />
      </Routes>
    </Router>
  );
}

export default App;
