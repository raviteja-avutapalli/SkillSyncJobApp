import MainLayout from "../layouts/MainLayout";
import {
  Briefcase,
  Users,
  CalendarCheck2,
  FileText,
  ClipboardList,
  UserCheck,
} from "lucide-react";

import { useEffect, useState } from "react";

function EmployerDashboard() {
  const [stats, setStats] = useState({
    active: 0,
    applications: 0,
    interviews: 0,
    drafts: 0,
  });

  const [recentApps, setRecentApps] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);

  const employerId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  const [selectedApp, setSelectedApp] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${token}` };

      const [jobsRes, appsRes, remindersRes] = await Promise.all([
        fetch(`http://localhost:5000/api/jobs/employer/${employerId}`, {
          headers,
        }),
        fetch(`http://localhost:5000/api/applications/employer/${employerId}`, {
          headers,
        }),
        fetch(`http://localhost:5000/api/reminders/employer/${employerId}`, {
          headers,
        }),
      ]);

      const jobs = await jobsRes.json();
      const apps = await appsRes.json();
      console.log("Fetched applications:", apps); // <--- Add this!
      setRecentApps(apps.slice(0, 4));

      const reminders = await remindersRes.json();

      setStats({
        active: jobs.length,
        applications: apps.length,
        interviews: reminders.length,
        drafts: jobs.filter((j) => j.status === "draft").length,
      });

      setRecentApps(apps.slice(0, 4)); // latest 4
      setUpcomingInterviews(reminders.slice(0, 4)); // latest 4
    };

    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          👋 Welcome, Employer
        </h1>
        <p className="text-lg text-gray-500 mt-1">
          Manage your postings, candidates, and interviews all in one place.
        </p>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<Briefcase className="text-indigo-600 w-6 h-6" />}
          label="Active Postings"
          value={stats.active}
        />
        <StatCard
          icon={<Users className="text-blue-600 w-6 h-6" />}
          label="Applications Received"
          value={stats.applications}
        />
        <StatCard
          icon={<CalendarCheck2 className="text-green-600 w-6 h-6" />}
          label="Scheduled Interviews"
          value={stats.interviews}
        />
        <StatCard
          icon={<FileText className="text-yellow-600 w-6 h-6" />}
          label="Drafts"
          value={stats.drafts}
        />
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-5 h-5 text-indigo-500" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Recent Applications
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentApps.map((app, i) => (
            <ApplicationCard
              key={i}
              name={app.applicant_name}
              position={app.job_title}
              onView={() => {
                setResumeError("");
                setSelectedApp(app);
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-5 h-5 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Interview Schedule
          </h2>
        </div>
        <ul className="space-y-4">
          {upcomingInterviews.map((i, index) => (
            <InterviewItem
              key={index}
              name={i.applicant_name}
              date={new Date(i.interview_date).toLocaleDateString()}
              time={new Date(i.interview_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              link={i.meeting_link}
            />
          ))}
        </ul>
      </section>
      {selectedApp && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Application Details</h2>
            <p>
              <strong>Applicant:</strong> {selectedApp.applicant_name}
            </p>
            <p>
              <strong>Job Title:</strong> {selectedApp.job_title}
            </p>
            <p>
              <strong>Status:</strong> {selectedApp.status}
            </p>
            <div className="mt-3">
              <h3 className="font-semibold text-gray-900">Cover Letter</h3>
              <div className="bg-gray-50 rounded-lg p-4 mt-1 text-gray-800 whitespace-pre-line text-sm max-h-52 overflow-auto border border-gray-100">
  {selectedApp.cover_letter
    ? selectedApp.cover_letter
    : "No cover letter provided."}
</div>

            </div>

            <div className="mt-4 flex gap-4">
              <button
                onClick={async () => {
                  setResumeError("");
                  const res = await fetch(
                    `http://localhost:5000/api/resumes/${selectedApp.user_id}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  const data = await res.json();
                  if (data?.file_path) {
                    const fileExists = await fetch(
                      `http://localhost:5000/${data.file_path}`
                    );
                    if (fileExists.ok) {
                      window.open(
                        `http://localhost:5000/${data.file_path}`,
                        "_blank"
                      );
                    } else {
                      setResumeError("Resume file is missing.");
                    }
                  } else {
                    setResumeError("Resume not found.");
                  }
                }}
                className="px-4 py-2 bg-gray-100 text-indigo-600 rounded-xl hover:bg-gray-200"
              >
                View Resume
              </button>

              <button
                onClick={async () => {
                  const res = await fetch(
                    "http://localhost:5000/api/screenings",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        application_id: selectedApp.id,
                        score: null,
                        remarks: null,
                        evaluation_criteria: null,
                        screened_by: employerId,
                      }),
                    }
                  );

                  if (res.ok) {
                    setLocalMessage(" Screening record created successfully.");
                  } else {
                    setLocalMessage(" Failed to create screening record.");
                  }

                  setTimeout(() => setLocalMessage(""), 3000); // hide after 3 sec
                }}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200"
              >
                Screen Now
              </button>
            </div>
            {localMessage && (
              <p className="text-sm text-green-600 mt-2">{localMessage}</p>
            )}

            {resumeError && (
              <p className="text-red-600 text-sm mt-2">{resumeError}</p>
            )}

            <div className="text-right mt-6">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
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

const ApplicationCard = ({ name, position, onView }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md hover:shadow-lg transition">
    <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
    <p className="text-sm text-gray-500">{position}</p>
    <button
      onClick={onView}
      className="mt-4 inline-block text-sm text-indigo-600 font-medium hover:underline"
    >
      View Application
    </button>
  </div>
);

const InterviewItem = ({ name, date, time, link }) => (
  <li className="bg-white p-5 rounded-3xl border border-gray-100 shadow-md hover:shadow-lg transition">
    <p className="text-gray-800 font-semibold">{name}</p>
    <p className="text-sm text-gray-500">
      {date}, {time}
    </p>
    {link && (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-indigo-600 hover:underline mt-1 block"
      >
        Join Interview
      </a>
    )}
  </li>
);

export default EmployerDashboard;
