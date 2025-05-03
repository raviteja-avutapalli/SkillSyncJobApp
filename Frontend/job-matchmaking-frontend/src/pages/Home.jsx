import MainLayout from "../layouts/MainLayout";
import {
  Search,
  Briefcase,
  Building,
  User,
  Award,
  Clock,
  ArrowRight,
  Star,
} from "lucide-react";

import job from "../assets/images/Job.png";

import { ChevronRight, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      const res = await fetch("http://localhost:5000/api/jobs");
      const data = await res.json();
      setFeaturedJobs(data.slice(0, 6));
    };
    fetchFeatured();
  }, []);

  const scrollToExplore = () => {
    const target = document.getElementById("explore-section");
    if (!target) return;

    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let startTime = null;

    const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run =
        easeInOutQuad(timeElapsed / duration) * distance + startPosition;
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  };

  const scrollToJobs = () => {
    const target = document.getElementById("jobs-section");
    if (!target) return;

    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let startTime = null;

    const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run =
        easeInOutQuad(timeElapsed / duration) * distance + startPosition;
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute -bottom-16 right-1/3 w-80 h-80 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur-3xl opacity-10"></div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>
        {/* Hero Content - Now properly centered with container */}
        <div className="container mx-auto max-w-7xl px-6 pt-12 pb-24 md:pt-20 md:pb-32 z-10 relative">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 md:pr-12 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-amber-200">
                Welcome to <span className="text-amber-400">SkillSync!</span>
              </h1>

              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl">
                Connects talented candidates with the right employers, making
                job searching seamless and hiring effortless. Whether you're
                looking for the next opportunity or the perfect candidate, we've
                got you covered.
              </p>

              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <button
                  onClick={() => navigate("/login")}
                  className="bounce-slow flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium px-8 py-4 rounded-xl hover:from-amber-400 hover:to-amber-500 transition duration-300 shadow-lg shadow-amber-500/20 group"
                >
                  <span>Join Now</span>
                  <ChevronRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
                <button
                  onClick={scrollToExplore}
                  className="flex items-center justify-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition duration-300"
                >
                  <span>Explore Now</span>
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2 mt-12 md:mt-0 relative">
              <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                {/* Image container with gradient border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-1">
                  <div className="absolute inset-0 bg-gray-900 rounded-3xl overflow-hidden">
                    <img
                      src={job}
                      alt="Tech professional working"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/20 backdrop-blur-md rounded-2xl rotate-12 border border-amber-500/30"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-500/20 backdrop-blur-md rounded-2xl -rotate-12 border border-blue-500/30"></div>

                {/* Stats card */}
                <div className="absolute -right-10 bottom-20 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl">
                  <p className="text-amber-400 font-bold text-xl">93%</p>
                  <p className="text-xs text-white/70">Placement Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section - Now properly centered with container */}
      <section id="explore-section" className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Featured Jobs
            </h2>
            <span
              onClick={scrollToJobs}
              className="cursor-pointer text-blue-600 hover:text-blue-700 inline-flex items-center font-medium"
            >
              View all jobs <ArrowRight size={16} className="ml-1" />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden mr-4 flex-shrink-0">
                      <img
                        src={
                          job.logo || "https://placehold.co/600x400/000000/FFF"
                        }
                        alt={job.company || "Company"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 hover:text-blue-600 transition-colors duration-200">
                        {job.title}
                      </h3>
                      <p className="text-gray-600">{job.company_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-3 flex items-center">
                      <Building size={14} className="mr-1" /> {job.location}
                    </span>
                    <span className="flex items-center">
                      <Briefcase size={14} className="mr-1" /> {job.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-gray-800">
                      {job.salary_min && job.salary_max
                        ? `$${job.salary_min} - $${job.salary_max}     `
                        : "N/A"}
                    </span>
                    <span className="text-xs text-gray-500">{job.posted}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(job.tags?.split(",") || []).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={scrollToJobs}
                    className="w-full py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Stats Section - Now properly centered with container */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">
            Our Platform at a Glance
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="p-6 md:p-8 bg-blue-50 rounded-xl text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="text-blue-600" size={28} />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                10K+
              </h3>
              <p className="text-gray-600">Jobs Posted</p>
            </div>

            <div className="p-6 md:p-8 bg-green-50 rounded-xl text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-14 h-14 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <User className="text-green-600" size={28} />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
                5K+
              </h3>
              <p className="text-gray-600">Successful Hires</p>
            </div>

            <div className="p-6 md:p-8 bg-purple-50 rounded-xl text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-14 h-14 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Building className="text-purple-600" size={28} />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">
                100+
              </h3>
              <p className="text-gray-600">Business Partners</p>
            </div>

            <div className="p-6 md:p-8 bg-yellow-50 rounded-xl text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-14 h-14 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={28} />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-yellow-600 mb-1">
                24/7
              </h3>
              <p className="text-gray-600">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Now properly centered with container */}
      <section id="jobs-section" className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">
            Browse Jobs by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "Technology",
              "Marketing",
              "Design",
              "Healthcare",
              "Finance",
              "Education",
            ].map((category, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="text-blue-600" size={20} />
                </div>
                <h3 className="font-medium text-gray-800">{category}</h3>
                <p className="text-sm text-gray-500 mt-1">120+ Jobs</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Now properly centered with container */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to Take the Next Step in Your Career?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who found their dream jobs through
            our platform. Create your profile today and get discovered by top
            employers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bounce-slow px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition duration-200"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
