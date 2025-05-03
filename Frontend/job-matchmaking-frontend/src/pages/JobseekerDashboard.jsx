import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import {
  Briefcase,
  CalendarDays,
  Bookmark,
  GaugeCircle,
  Sparkles,
  Building2,
} from "lucide-react";

function JobseekerDashboard() {
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    savedJobs: 0,
    profileComplete: "0%",
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);

  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  // --- Fetch Data and Set Lists ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const headers = { Authorization: `Bearer ${token}` };

        const appsRes = await fetch(
          `http://localhost:5000/api/applications/user/${userId}`,
          { headers }
        );
        if (!appsRes.ok)
          throw new Error(`Applications request failed: ${appsRes.status}`);
        const applications = await appsRes.json();

        const savedApplications = applications.filter(
          (app) => app.status === "saved"
        );
        setSavedJobs(savedApplications);

        // Track which jobs have been applied to (for quick lookup)
        setAppliedJobIds(
          applications
            .filter((app) => app.status === "applied")
            .map((a) => a.job_id)
        );

        const recRes = await fetch(
          `http://localhost:5000/api/recommendations/jobs`,
          { headers }
        );
        if (!recRes.ok)
          throw new Error(`Recommendations failed: ${recRes.status}`);
        const recommendations = await recRes.json();
        setRecommendedJobs(recommendations);

        const scheduledInterviews = applications.filter(
          (app) =>
            app.status === "interview_scheduled" ||
            app.status === "interview_accepted"
        );

        setStats({
          applications: applications.length,
          interviews: scheduledInterviews.length,
          savedJobs: savedApplications.length,
          profileComplete: "80%", // placeholder
        });

        const reminderRes = await fetch(
          `http://localhost:5000/api/interviewreminders/user/${userId}`,
          { headers }
        );
        if (!reminderRes.ok)
          throw new Error(`Interview reminders failed: ${reminderRes.status}`);
        const reminders = await reminderRes.json();
        setInterviews(reminders);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId && token) fetchData();
  }, [userId, token, saving, applying]); // refetch if saving/applying

  // --- Save Job Handler ---
  const handleSave = async (job) => {
    setSaving(true);
    try {
      // Check if application already exists for this job
      const checkRes = await fetch(
        `http://localhost:5000/api/applications/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            job_id: job.id || job.job_id,
            status: "saved",
          }),
        }
      );

      const checkData = await checkRes.json();

      if (checkRes.ok && checkData.exists) {
        // Application exists, update status
        const updateRes = await fetch(
          `http://localhost:5000/api/applications/${checkData.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: "saved",
            }),
          }
        );

        const updateData = await updateRes.json();
      } else {
        // Application doesn't exist, create new
        const createRes = await fetch(
          "http://localhost:5000/api/applications/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_id: userId,
              job_id: job.id || job.job_id,
              status: "saved",
            }),
          }
        );

        const createData = await createRes.json();
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong. Please try again.");
    }
    setSaving(false);
  };

  const handleApply = async (job) => {
    setApplying(true);
    try {
      const createRes = await fetch("http://localhost:5000/api/applications/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          job_id: job.id || job.job_id,
          status: "applied",
          // optionally resume_id, cover_letter if you use those
        }),
      });

      const createData = await createRes.json();
    } catch (error) {
      console.error("Apply error:", error);
      alert("Something went wrong. Please try again.");
    }
    setApplying(false);
  };

  // --- Utility to check if job is saved/applied
  const isJobSaved = (jobId) => savedJobs.some((job) => job.job_id === jobId);
  const isJobApplied = (jobId) => appliedJobIds.includes(jobId);

  // --- UI ---
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </MainLayout>
    );
  }
  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-96">
          <p className="text-red-500 mb-4">Failed to load dashboard data</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome, Jobseeker
        </h1>
        <p className="text-lg text-gray-500 mt-1">
          Here's your job hunt overview.
        </p>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch mb-12">
        <StatCard
          icon={<Briefcase className="text-indigo-600 w-6 h-6" />}
          label="Applications"
          value={stats.applications}
        />
        <StatCard
          icon={<CalendarDays className="text-green-600 w-6 h-6" />}
          label="Scheduled Interviews"
          value={interviews.length}
        />
        <StatCard
          icon={<Bookmark className="text-yellow-600 w-6 h-6" />}
          label="Saved Jobs"
          value={stats.savedJobs}
        />
      </section>
      {/* Recommended Jobs */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Recommended Jobs
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedJobs.length > 0 ? (
            recommendedJobs.map((job, i) => {
              const jobId = job.id || job.job_id;
              return (
                <div key={i} className="relative">
                  <JobCard
                    title={job.title}
                    company={job.reason}
                    onClick={() => setSelectedJob(job)}
                  />
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No recommended jobs available.</p>
          )}
        </div>
      </section>
      {/* Saved Jobs */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="w-5 h-5 text-yellow-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Saved Jobs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.length > 0 ? (
            savedJobs.map((job, i) => {
              const jobId = job.job_id || job.id;
              return (
                <div key={i} className="relative">
                  <JobCard
                    title={job.title}
                    company={job.industry || "Company"}
                    onClick={() => setSelectedJob(job)}
                  />
                  <div className="flex gap-2 mt-3">
                    {/* Only show Apply if not yet applied */}
                    <button
                      disabled={applying || isJobApplied(jobId)}
                      onClick={() => handleApply(job)}
                      className={`py-1 px-4 rounded-xl font-semibold text-white 
                        ${
                          isJobApplied(jobId)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                      {isJobApplied(jobId) ? "Applied" : "Apply"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">You have no saved jobs.</p>
          )}
        </div>
      </section>
      {/* Upcoming Interviews */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Upcoming Interviews
          </h2>
        </div>
        <ul className="space-y-4">
          {interviews.length > 0 ? (
            interviews.map((item, i) => (
              <InterviewItem
                key={i}
                title={item.title || "Interview"}
                company={item.company_name || "Company"}
                date={new Date(item.interview_date).toLocaleDateString()}
                time={new Date(item.interview_date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                onClick={() => setSelectedInterview(item)}
              />
            ))
          ) : (
            <p className="text-gray-500">No upcoming interviews.</p>
          )}
        </ul>
      </section>

      {/* Job Detail Modal (unchanged, just update button to use handleApply) */}
      {selectedJob && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              {selectedJob.title}
            </h2>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Reason:</span>{" "}
              {selectedJob.reason || "N/A"}
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Location:</span>{" "}
              {selectedJob.location}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              {selectedJob.recommended_at
                ? `Recommended on ${new Date(selectedJob.recommended_at).toLocaleDateString()}`
                : ""}
            </p>
            <button
              disabled={
                applying || isJobApplied(selectedJob.id || selectedJob.job_id)
              }
              onClick={() => handleApply(selectedJob)}
              className={`mt-6 w-full py-2 px-4 rounded-xl font-semibold text-white 
                ${
                  isJobApplied(selectedJob.id || selectedJob.job_id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isJobApplied(selectedJob.id || selectedJob.job_id)
                ? "Applied"
                : "Apply"}
            </button>
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 relative">
            <button
              onClick={() => setSelectedInterview(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Interview Details
            </h2>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Platform:</span>{" "}
              {selectedInterview.platform}
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Meeting Link:</span>{" "}
              <a
                href={selectedInterview.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline"
              >
                {selectedInterview.meeting_link}
              </a>
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(selectedInterview.interview_date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Time:</span>{" "}
              {new Date(selectedInterview.interview_date).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md hover:shadow-lg transition text-center">
    <div className="flex justify-center mb-3">{icon}</div>
    <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

const JobCard = ({ title, company, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-white p-6 rounded-3xl border border-gray-100 shadow-md hover:shadow-lg transition"
  >
    <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 flex items-center gap-1">
      <Building2 className="w-4 h-4" />
      {company}
    </p>
  </div>
);

const InterviewItem = ({ title, company, date, time, onClick }) => (
  <li
    onClick={onClick}
    className="cursor-pointer bg-white p-5 rounded-3xl border border-gray-100 shadow-md hover:shadow-lg transition"
  >
    <p className="text-gray-800 font-semibold">
      {title} <span className="text-gray-500 font-normal">@ {company}</span>
    </p>
    <p className="text-sm text-gray-500">
      {date}, {time}
    </p>
  </li>
);

export default JobseekerDashboard;
