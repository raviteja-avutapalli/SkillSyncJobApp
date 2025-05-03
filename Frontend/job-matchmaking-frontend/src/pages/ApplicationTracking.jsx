import MainLayout from "../layouts/MainLayout";
import { ListChecks, CalendarDays, Building2, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

function ApplicationTracking() {
  const [apps, setApps] = useState([]);
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await fetch(
        `http://localhost:5000/api/applications/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setApps(data);
    };
    fetchApplications();
  }, []);

  const [filter, setFilter] = useState("all");

  const filteredApps = apps.filter((app) =>
    filter === "all" ? true : app.status === filter
  );

  return (
    <MainLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <ListChecks className="w-7 h-7 text-indigo-500" />
          Application Tracker
        </h1>
        <p className="text-lg text-gray-500 mt-1">
          Track the status of your applications in real time.
        </p>
      </div>

      <div className="mb-8 flex gap-4">
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded-xl text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="saved">Saved</option>
            <option value="interviewed">Interviewed</option>
           
          </select>

          <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-5">
        {filteredApps.map((app, i) => {
          let color = "bg-gray-100 text-gray-600";
          if (app.status === "applied") color = "bg-blue-100 text-blue-700";
          else if (app.status === "interviewed")
            color = "bg-yellow-100 text-yellow-700";
          else if (app.status === "offered")
            color = "bg-green-100 text-green-700";
          else if (app.status === "rejected") color = "bg-red-100 text-red-700";

          return (
            <AppCard
              key={i}
              title={app.title}
              company={app.company_name}
              applied={new Date(app.applied_at).toLocaleDateString()}
              status={app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              statusColor={color}
              detail={
                app.interview_date
                  ? `Interview: ${new Date(app.interview_date).toLocaleString()} • ${app.platform}`
                  : "No interview scheduled"
              }
              resumeId={app.resume_id}
              userId={app.user_id}
              jobId={app.job_id}
              coverLetter={app.cover_letter}
              description={app.description}
              location={app.location}
              type={app.type}
            />
          );
        })}
      </div>
    </MainLayout>
  );
}

const AppCard = ({
  title,
  company,
  applied,
  status,
  statusColor,
  detail,
  resumeId,
  userId,
  jobId,
  coverLetter,
  description,
  location,
  type,
}) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md hover:shadow-lg transition">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <Building2 className="w-4 h-4" />
          {company} • Applied on {applied}
        </p>
      </div>
      <span
        className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor}`}
      >
        {status}
      </span>
    </div>

    <div className="text-sm text-gray-500 mt-4 space-y-1">
      <p className="flex items-center gap-1">
        <CalendarDays className="w-4 h-4" />
        {detail}
      </p>
      <p>
        <strong>Job ID:</strong> {jobId}
      </p>
      <p>
        <strong>Location:</strong> {location}
      </p>
      <p>
        <strong>Type:</strong> {type}
      </p>
      <p>
        <strong>Description:</strong> {description}
      </p>
      <p>
        <strong>Cover Letter:</strong> {coverLetter}
      </p>
    </div>
  </div>
);

export default ApplicationTracking;
