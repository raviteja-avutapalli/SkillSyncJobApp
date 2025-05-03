import MainLayout from "../layouts/MainLayout";
import { Briefcase, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    location: "",
    salary_max: "",
    type: "Full-time",
    description: "",
  });

  const employerId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  const [expandedJob, setExpandedJob] = useState(null);
  const [applicants, setApplicants] = useState({});
  const formRef = useRef(null);
  const [formMessage, setFormMessage] = useState("");
  const [formMessageType, setFormMessageType] = useState("error");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch(
        `http://localhost:5000/api/jobs/employer/${employerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setJobs(data);
    };
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const requiredFields = ["title", "location", "salary_max", "description"];
    for (let field of requiredFields) {
      if (!form[field].trim()) {
        setFormMessage(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`
        );
        setFormMessageType("error"); 
        return false;
      }
    }
    return true;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const url = editingId
      ? `http://localhost:5000/api/jobs/${editingId}`
      : `http://localhost:5000/api/jobs`;
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, employer_id: employerId }),
    });

    if (res.ok) {
      setForm({
        title: "",
        location: "",
        salary_max: "",
        type: "Full-time",
        description: "",
      });
      setEditingId(null);
      const updated = await fetch(
        `http://localhost:5000/api/jobs/employer/${employerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(await updated.json());
      setFormMessage(
        editingId ? "Job updated successfully." : "Job posted successfully."
      );
      setFormMessageType("success"); // set to success!
      setTimeout(() => setFormMessage(""), 3000);
    } else {
      setFormMessage("Failed to submit job.");
      setFormMessageType("error"); // set to error!
      setTimeout(() => setFormMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setJobs(jobs.filter((j) => j.id !== id));
      setJobMessages((prev) => ({
        ...prev,
        [id]: " Job deleted successfully.",
      }));
      setTimeout(() => {
        setJobMessages((prev) => ({ ...prev, [id]: "" }));
      }, 3000);
    }
  };

  return (
    <MainLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 ml-10">
          <Briefcase className="w-8 h-8 text-blue-500" />
          Job Posting & Management
        </h1>
        <p className="text-lg text-gray-500 mt-2 ml-10">
          Manage your open roles and find top talent faster.
        </p>
      </div>

      <section className="mb-12" ref={formRef}>
        <div className="flex items-center gap-2 mb-4">
          <PlusCircle className="w-5 h-5 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Create New Job
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl"
        >
          <input
            name="title"
            value={form.title}
            type="text"
            placeholder="Job Title"
            className="p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          />
          <input
            name="location"
            value={form.location}
            type="text"
            placeholder="Location"
            className="p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          />
          <input
            name="salary_max"
            value={form.salary_max}
            type="text"
            placeholder="Max Salary"
            className="p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="p-4 border border-gray-200 rounded-xl text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
          </select>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="col-span-2 p-4 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
          <div className="col-span-2 text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {editingId ? "Update Job" : "Post Job"}
            </button>
          </div>
        </form>
        {formMessage && (
          <p
            className={`text-sm mt-4 ${
              formMessageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {formMessage}
          </p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Active Postings
        </h2>
        <div className="space-y-5">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {job.applicants_count || 0} Applicants • Posted on{" "}
                    {new Date(job.posted_at).toDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingId(job.id);
                      setForm({
                        title: job.title,
                        location: job.location,
                        salary_max: job.salary_max,
                        type: job.type,
                        description: job.description,
                      });
                      formRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-1 text-sm px-4 py-2 rounded-xl border text-blue-600 hover:bg-blue-50 transition"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="inline-flex items-center gap-1 text-sm px-4 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <button
                  className="text-blue-600 underline text-sm"
                  onClick={async () => {
                    if (expandedJob === job.id) {
                      setExpandedJob(null);
                      return;
                    }
                    const res = await fetch(
                      `http://localhost:5000/api/jobs/${job.id}/applicants`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    const data = await res.json();
                    setApplicants((prev) => ({ ...prev, [job.id]: data }));
                    setExpandedJob(job.id);
                  }}
                >
                  {expandedJob === job.id
                    ? "Hide Applicants"
                    : "View Applicants"}
                </button>

                {expandedJob === job.id && (
                  <div className="mt-3 space-y-2">
                    {applicants[job.id]?.length > 0 ? (
                      applicants[job.id].map((app, idx) => (
                        <div
                          key={idx}
                          className="border rounded-xl p-3 bg-gray-50"
                        >
                          <p className="font-semibold">{app.name}</p>
                          <p className="text-sm text-gray-600">{app.email}</p>
                          <p className="text-sm text-gray-600 italic">
                            Skills: {app.skills || "N/A"}
                          </p>
                          <p className="text-sm">
                            LinkedIn:{" "}
                            {app.linkedin ? (
                              <a
                                href={app.linkedin}
                                className="text-blue-500 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {app.linkedin}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm italic text-gray-500">
                        No applicants yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

export default JobManagement;
