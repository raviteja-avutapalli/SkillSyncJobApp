import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const role = sessionStorage.getItem("role");

  if (!role) return null;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-black to-black shadow-lg"
          : "bg-gradient-to-r from-black to-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to={
            role === "employer"
              ? "/dashboard/employer"
              : role === "admin"
                ? "/dashboard/admin"
                : "/dashboard/jobseeker"
          }
          className="text-2xl font-bold text-white flex items-center"
        >
          <span className="mr-2">⚡</span> SkillSync
        </Link>

        {/* Left section */}
        {role === "jobseeker" && (
          <>
            <NavItem to="/job-recommendations" label="Jobs" />
            <NavItem to="/market-insights" label="Insight" />
            <NavItem to="/interview-reminders" label="Remind" />
            <NavItem to="/application-tracking" label="Track" />
            <NavItem to="/resume-upload" label="Upload" />
            <NavItem to="/profile" label="Profile" />
            <NavItem to="/course-recommendations" label="SkillBot" />
          </>
        )}

        {role === "employer" && (
          <>
            <NavItem to="/dashboard/employer" label="Employer" />
            <NavItem to="/job-management" label="Management" />
            <NavItem to="/candidate-screening" label="Screen" />
          </>
        )}

        {role === "admin" && (
          <>
            <NavItem to="/dashboard/admin" label="Admin" />
            <NavItem to="/admin/stats" label="Stats" />
          </>
        )}

        <NavItem to="/blogs" label="Blog" />

        {/* Right section */}
        <div className="flex gap-3 text-sm">
          <Link
            to="/"
            onClick={() => sessionStorage.clear()}
            className="px-5 py-2 rounded-xl bg-white text-blue-600 font-medium hover:shadow-lg hover:scale-105 transition-all"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}

const NavItem = ({ to, label }) => (
  <Link
    to={to}
    className="text-white opacity-90 hover:opacity-100 hover:underline underline-offset-4 transition-all"
  >
    {label}
  </Link>
);

export default Navbar;
