import MainLayout from "../layouts/MainLayout";
import {
  Users,
  ShieldCheck,
  UserCheck2,
  AlertTriangle,
  Settings,
  Server,
  ActivitySquare,
  Gauge,
} from "lucide-react";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    employers: 0,
    jobseekers: 0,
    reports: 0,
  });

  const [jobseekers, setJobseekers] = useState([]);
  const [employers, setEmployers] = useState([]);
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const fetchStats = async () => {
      const res = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    };

    const fetchUsers = async () => {
      const res1 = await fetch("http://localhost:5000/api/admin/jobseekers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res2 = await fetch("http://localhost:5000/api/admin/employers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobseekers(await res1.json());
      setEmployers(await res2.json());
    };

    fetchStats();
    fetchUsers();
  }, []);

  return (
    <MainLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-500 mt-1">
          System overview and user management tools.
        </p>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<Users className="text-indigo-600 w-6 h-6" />}
          label="Total Users"
          value={stats.totalUsers}
        />
        <StatCard
          icon={<ShieldCheck className="text-blue-600 w-6 h-6" />}
          label="Employers"
          value={stats.employers}
        />
        <StatCard
          icon={<UserCheck2 className="text-green-600 w-6 h-6" />}
          label="Jobseekers"
          value={stats.jobseekers}
        />
        <StatCard
          icon={<AlertTriangle className="text-red-600 w-6 h-6" />}
          label="Reports Filed"
          value={stats.reports}
        />
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-indigo-500" />
          <h2 className="text-2xl font-semibold text-gray-800">
            User Management
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard
            title="Manage Jobseekers"
            users={jobseekers}
            setUsers={setJobseekers}
          />
          <AdminCard
            title="Manage Employers"
            users={employers}
            setUsers={setEmployers}
          />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-5 h-5 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-800">
            System Status
          </h2>
        </div>
        <ul className="space-y-4">
          <StatusItem
            label="Database"
            status="Online"
            icon={<Server className="w-4 h-4 text-green-500" />}
          />
          <StatusItem
            label="API Response"
            status="Healthy"
            icon={<ActivitySquare className="w-4 h-4 text-blue-500" />}
          />
          <StatusItem
            label="Moderation Queue"
            status="2 pending"
            icon={<AlertTriangle className="w-4 h-4 text-yellow-500" />}
          />
        </ul>
      </section>
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

const AdminCard = ({ title, users = [], setUsers }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = async (id) => {
    const token = sessionStorage.getItem("token");
    await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    // Update UI
    setUsers((prev) => prev.filter((u) => (u.user_id || u.employer_id) !== id));
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">Click to manage and review users.</p>
      <button
        onClick={() => setOpen(!open)}
        className="mt-4 inline-block text-sm text-indigo-600 font-medium hover:underline"
      >
        {open ? "Hide Panel" : "Go to Panel"}
      </button>

      {open && (
        <ul className="mt-4 list-disc list-inside text-sm text-gray-700 space-y-2 max-h-48 overflow-y-auto">
          {users.map((u, i) => (
            <li key={i}>
              <div className="flex flex-col">
                <span className="font-medium">{u.name}</span>
                {u.jobs_posted !== undefined && (
                  <span className="text-xs text-gray-500">
                    Jobs Posted: {u.jobs_posted}
                  </span>
                )}
                {u.applications_count !== undefined && (
                  <span className="text-xs text-gray-500">
                    Applications: {u.applications_count}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDelete(u.user_id || u.employer_id)}
                className="text-xs text-red-600 hover:underline self-start"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const StatusItem = ({ label, status, icon }) => (
  <li className="bg-white p-5 rounded-3xl border border-gray-100 shadow-md flex items-center gap-3 hover:shadow-lg transition">
    {icon}
    <p className="text-gray-800 font-medium">
      {label}: <span className="text-gray-500 font-normal">{status}</span>
    </p>
  </li>
);

export default AdminDashboard;
