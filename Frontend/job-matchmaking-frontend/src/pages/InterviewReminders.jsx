import MainLayout from "../layouts/MainLayout";
import { CalendarCheck, Video, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

function InterviewReminders() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchReminders = async () => {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/reminders/jobseeker/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setReminders(data);
    };

    fetchReminders();
  }, []);

  return (
    <MainLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight ml-10">
          Interview Reminders
        </h1>
        <p className="text-lg text-gray-500 mt-2 ml-10">
          Be confident. Be prepared. You've got this.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reminders.map((reminder, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {reminder.title || "Interview"}
              </h2>
              <CalendarCheck className="w-5 h-5 text-blue-500" />
            </div>

            <p className="text-sm text-gray-500 mb-2">
              <strong>{reminder.company_name || "Company"}</strong> •{" "}
              {new Date(reminder.interview_date).toLocaleString()}
            </p>

            <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc list-inside">
              {(reminder.tasks?.split(",") || []).map((task, j) => (
                <li key={j}>{task}</li>
              ))}
            </ul>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Video className="w-4 h-4 text-indigo-500" />
                <span>{reminder.platform}</span>
              </div>

              <a
                href={reminder.meeting_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Join <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default InterviewReminders;
