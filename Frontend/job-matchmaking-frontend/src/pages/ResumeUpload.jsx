import MainLayout from "../layouts/MainLayout";
import { useState } from "react";
import { UploadCloud, FileCheck } from "lucide-react";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [insights, setInsights] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("No file selected");

    const formData = new FormData();
    formData.append("resume", file);

    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/resumes/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setInsights(data.insights);
      console.log(data.insights); //
    } else alert(data.error || "Upload failed");
  };

  return (
    <MainLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          📄 Upload Resume
        </h1>
        <p className="text-lg text-gray-500 mt-1">
          Showcase your experience by uploading your latest resume.
        </p>
      </div>

      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-lg text-center max-w-xl mx-auto">
        <label
          htmlFor="resume"
          className="block border-2 border-dashed border-indigo-500 rounded-2xl px-6 py-16 cursor-pointer hover:bg-indigo-50 transition"
        >
          <UploadCloud className="mx-auto w-10 h-10 text-indigo-500 mb-4" />
          <p className="text-lg text-gray-700 mb-1 font-medium">
            Drag & drop your resume here
          </p>
          <p className="text-sm text-gray-400">
            or click to browse — PDF, DOCX only (Max 5MB)
          </p>
        </label>
        <input
          type="file"
          id="resume"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        {fileName && (
          <div className="mt-6 flex items-center justify-center gap-2 text-green-600 font-medium">
            <FileCheck className="w-5 h-5" />
            Uploaded: {fileName}
          </div>
        )}

        {insights && (
          <div className="mt-10 text-left bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Resume Insights
            </h2>
            <p>
              <span className="font-semibold text-gray-600">Name:</span>{" "}
              {insights.name}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Email:</span>{" "}
              {insights.email}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Phone:</span>{" "}
              {insights.phone}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Experience:</span>{" "}
              {insights.experience} years
            </p>
            <p>
              <span className="font-semibold text-gray-600">Education:</span>{" "}
              {Array.isArray(insights.education) &&
              insights.education.length > 0 &&
              insights.education[0] !== "Not found"
                ? insights.education.join(", ")
                : "Not found"}
            </p>
           
          </div>
        )}

        <button
          onClick={handleUpload}
          className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
        >
          Save Resume
        </button>
      </div>
      

    </MainLayout>
  );
}

export default ResumeUpload;
