import MainLayout from "../layouts/MainLayout";
import {
  UserCircle2,
  ClipboardList,
  Star,
  FileText,
  CalendarCheck2,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";

function CandidateScreening() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusMessages, setStatusMessages] = useState({});

  const getDefaultPlatformInfo = () => {
    const platforms = [
      { name: "Google Meet", link: "   https://meet.google.com/yvd-afwj-uiy" },
    ];
    return platforms[Math.floor(Math.random() * platforms.length)];
  };

  const formatDateTime = (date) =>
    date.toISOString().slice(0, 19).replace("T", " ");

  const [message, setMessage] = useState("");

  const handleScheduleInterview = async (candidate) => {
    const token = sessionStorage.getItem("token");
    const interviewDate = new Date();
    const reminderTime = new Date(interviewDate);
    reminderTime.setDate(interviewDate.getDate() + 1);
    const { name: platform, link: meeting_link } = getDefaultPlatformInfo();

    try {
      const res = await fetch(`http://localhost:5000/api/interviewreminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          application_id: candidate.application_id,
          interview_date: formatDateTime(interviewDate),
          reminder_time: formatDateTime(reminderTime),
          platform,
          meeting_link,
          sent: 0,
        }),
      });

      if (!res.ok) throw new Error("Failed to schedule interview");

      setStatusMessages((prev) => ({
        ...prev,
        [candidate.id]: {
          type: "success",
          text: "Interview scheduled successfully.",
        },
      }));
    } catch (err) {
      setStatusMessages((prev) => ({
        ...prev,
        [candidate.id]: {
          type: "error",
          text: "Failed to schedule interview.",
        },
      }));
    }
  };

  useEffect(() => {
    const employerId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    const fetchScreenings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/screenings/employer/${employerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch screenings");
        }

        const data = await res.json();

        setCandidates(data);
      } catch (error) {
        console.error("Error fetching screenings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScreenings();
  }, []);

  const handleSaveFeedback = async () => {
    if (!selectedCandidate) return;

    const token = sessionStorage.getItem("token");

    try {
      // 1. Save feedback
      const res = await fetch(
        `http://localhost:5000/api/screenings/${selectedCandidate.id}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            remarks: notes,
            score: rating * 20, // Convert 1-5 scale to percentage
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save feedback");
      }

      // 2. Update status to Interviewed
      await fetch(
        `http://localhost:5000/api/applications/${selectedCandidate.application_id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Interviewed" }),
        }
      );

      // 3. Update frontend state
      setCandidates(
        candidates.map((candidate) =>
          candidate.id === selectedCandidate.id
            ? {
                ...candidate,
                remarks: notes,
                score: rating * 20,
                status: "Interviewed",
              }
            : candidate
        )
      );

      setNotes("");
      setRating(1);
      setSelectedCandidate(null);
    } catch (error) {
      console.error("Error saving feedback or updating status:", error);
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <MainLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <ClipboardList className="w-7 h-7 text-indigo-500" />
          Candidate Screening
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Review, rate, and manage applicants efficiently.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl text-center border border-gray-100 shadow-lg">
          <p className="text-gray-500 text-lg">
            No candidate screenings available.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300"
              onClick={() => setSelectedCandidate(candidate)}
            >
              <div className="flex items-center gap-4 mb-3">
                <UserCircle2 className="w-10 h-10 text-indigo-500" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {candidate.applicant_name ||
                      `Candidate #${candidate.application_id}`}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Test: {candidate.evaluation_criteria || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <p className="text-sm flex items-center gap-1">
                  <span className="font-medium text-gray-700">Score:</span>
                  <span
                    className={`font-semibold ${candidate.score >= 85 ? "text-green-600" : candidate.score >= 70 ? "text-yellow-600" : "text-gray-600"}`}
                  >
                    {candidate.score}%
                  </span>
                </p>

                <p className="text-sm flex items-center gap-1">
                  <span className="font-medium text-gray-700">Feedback:</span>
                  <span className="text-gray-600">
                    {candidate.remarks || "No feedback yet"}
                  </span>
                </p>

                <p className="text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">
                    Screened at: {formatDate(candidate.screened_at)}
                  </span>
                </p>

                <p className="text-sm flex items-center gap-1">
                  <UserCircle2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">
                    Screened by: {candidate.screened_by || "N/A"}
                  </span>
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
                  onClick={() => handleScheduleInterview(candidate)}
                >
                  <CalendarCheck2 className="w-4 h-4" />
                  Schedule Interview
                </button>
                <button
                  className="inline-flex items-center gap-1 px-4 py-2 border text-indigo-600 text-sm font-semibold rounded-xl hover:bg-indigo-50 transition"
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setShowModal(true);
                  }}
                >
                  <FileText className="w-4 h-4" />
                  View Details
                </button>
                {statusMessages[candidate.id] && (
                  <p
                    className={`text-sm mt-2 ${statusMessages[candidate.id].type === "error" ? "text-red-600" : "text-green-600"}`}
                  >
                    {statusMessages[candidate.id].text}
                  </p>
                )}

                {showModal && selectedCandidate && (
                  <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
                      <h2 className="text-xl font-bold mb-4">
                        {selectedCandidate.applicant_name ||
                          selectedCandidate.application_id}
                      </h2>
                      <p>
                        <strong>Evaluation:</strong>{" "}
                        {selectedCandidate.evaluation_criteria}
                      </p>
                      <p>
                        <strong>Score:</strong> {selectedCandidate.score}%
                      </p>
                      <p>
                        <strong>Remarks:</strong>{" "}
                        {selectedCandidate.remarks || "No feedback"}
                      </p>
                      <p>
                        <strong>Screened by:</strong>{" "}
                        {selectedCandidate.screened_by || "N/A"}
                      </p>
                      <p>
                        <strong>Screened at:</strong>{" "}
                        {formatDate(selectedCandidate.screened_at)}
                      </p>
                      <div className="mt-4 text-right">
                        <button
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Candidate Notes & Rating
        </h2>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selected Candidate:
            </label>
            <div className="p-3 bg-gray-50 rounded-xl">
              {selectedCandidate ? (
                <p className="text-gray-800">
                  Candidate #{selectedCandidate.application_id} -{" "}
                  {selectedCandidate.evaluation_criteria}
                </p>
              ) : (
                <p className="text-gray-500 italic">
                  Click on a candidate card to select
                </p>
              )}
            </div>
          </div>

          <textarea
            placeholder="Write your notes about the candidate..."
            className="w-full p-4 border border-gray-200 rounded-xl h-28 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={!selectedCandidate}
          />
          <div className="flex items-center gap-3 mt-4">
            <label className="text-sm font-medium text-gray-700">Rating:</label>
            <select
              className="p-2 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              disabled={!selectedCandidate}
            >
              <option value={1}>1 - Poor</option>
              <option value={2}>2 - Fair</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Great</option>
              <option value={5}>5 - Excellent</option>
            </select>
            <button
              className={`ml-auto px-5 py-2 ${selectedCandidate ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"} text-white text-sm font-semibold rounded-xl transition`}
              onClick={handleSaveFeedback}
              disabled={!selectedCandidate}
            >
              Save Feedback
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default CandidateScreening;
