import MainLayout from "../layouts/MainLayout";
import { Search, MapPin, Briefcase, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";

function JobRecommendations() {
  const [expanded, setExpanded] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [sortOption, setSortOption] = useState("Relevance");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [appliedJobId, setAppliedJobId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleSubmitApplication = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    let resumeId = null;

    if (resumeFile) {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const resUpload = await fetch(
        `http://localhost:5000/api/resumes/${userId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const dataUpload = await resUpload.json();
      resumeId = dataUpload.resume_id;
    }

    await fetch("http://localhost:5000/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        job_id: selectedJob.id,
        user_id: userId,
        resume_id: resumeId,
        cover_letter: coverLetter,
        status: "applied",
      }),
    });

    setIsModalOpen(false);
    setCoverLetter("");
    setResumeFile(null);
    setAppliedJobId(selectedJob.id);
    setActionMessage("Application submitted successfully!");
  };

  const filteredJobs = jobs
    .filter(
      (job) =>
        (job.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.description ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (job.industry ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((job) => {
      if (!experienceFilter) return true;
      const exp = job.experience_required;
      if (experienceFilter === "Entry")
        return exp?.includes("0-1") || exp?.startsWith("1");
      if (experienceFilter === "Mid")
        return exp?.startsWith("2") || exp?.startsWith("3");
      if (experienceFilter === "Senior")
        return (
          exp?.startsWith("4") || exp?.startsWith("5") || exp?.startsWith("6")
        );
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "Newest")
        return new Date(b.posted_at) - new Date(a.posted_at);
      if (sortOption === "Highest Salary") return b.salary_max - a.salary_max;
      return 0;
    });

  useEffect(() => {
    const fetchJobs = async () => {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setJobs(data);
    };
    fetchJobs();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">All Jobs</h1>
          <p className="text-gray-500">Showing {jobs.length} jobs</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search job titles, skills, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <select
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl focus:outline-none"
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
            >
              <option value="">Experience Level</option>
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid-Senior</option>
              <option value="Senior">Senior</option>
            </select>

            <select
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl focus:outline-none"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="Relevance">Sort by: Relevance</option>
              <option value="Newest">Newest</option>
              <option value="Highest Salary">Highest Salary</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${
                expanded === job.id
                  ? "ring-2 ring-primary/30"
                  : "hover:shadow-md"
              }`}
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => toggleExpand(job.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">{job.title}</h2>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-gray-600">
                      <p className="text-sm font-medium">{job.company}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${job.salary_max}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock size={14} />
                        <span>
                          {new Date(job.posted_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {(job.skills?.split(",") || []).map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {expanded === job.id && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <p className="text-gray-700 mb-6">{job.description}</p>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span>Experience: {job.experience_required}</span>
                      <span>Education: {job.education_required}</span>
                      <span>Industry: {job.industry}</span>
                      <span>{job.remote === 1 ? "Remote" : "On-site"}</span>

                      <span>
                        Deadline:{" "}
                        {job.deadline
                          ? new Date(job.deadline).toLocaleDateString()
                          : "No deadline"}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        className={`px-5 py-2.5 rounded-xl text-sm transition ${
                          appliedJobId === job.id
                            ? "bg-green-500 text-white cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        disabled={appliedJobId === job.id}
                        onClick={async () => {
                          const userId = sessionStorage.getItem("userId");
                          const token = sessionStorage.getItem("token");
                          await fetch(
                            "http://localhost:5000/api/applications",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                job_id: job.id,
                                user_id: userId,
                                resume_id: null,
                                cover_letter: "",
                                status: "saved",
                              }),
                            }
                          );
                          setAppliedJobId(job.id);
                          setActionMessage("Saved successfully!");
                        }}
                      >
                        Save
                      </button>

                      <button
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm"
                        onClick={() => {
                          setSelectedJob(job);
                          setIsModalOpen(true);
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  {appliedJobId === job.id && actionMessage && (
                    <p className="text-green-600 text-sm mt-4">
                      {actionMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Apply to {selectedJob?.title}
            </Dialog.Title>
            <textarea
              rows={4}
              placeholder="Cover Letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full border rounded-xl p-3 mb-4"
            />
            <input
              type="file"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit Application
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </MainLayout>
  );
}

export default JobRecommendations;
