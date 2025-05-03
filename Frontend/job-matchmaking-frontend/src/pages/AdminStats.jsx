import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import MainLayout from "../layouts/MainLayout";
import { Loader2, RefreshCw, Info } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

function StatsDashboard() {
  const [topEmployers, setTopEmployers] = useState([]);
  const [topJobseekers, setTopJobseekers] = useState([]);
  const [jobStats, setJobStats] = useState([]);
  const [userDist, setUserDist] = useState({ jobseekers: 0, employers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activePeriod, setActivePeriod] = useState("6m");

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [eRes, jRes, mRes, uRes] = await Promise.all([
        fetch(`http://localhost:5000/api/admin/top-employers`, { headers }),
        fetch(`http://localhost:5000/api/admin/top-jobseekers`, { headers }),
        fetch(`http://localhost:5000/api/admin/jobs-monthly`, { headers }),
        fetch("http://localhost:5000/api/admin/user-distribution", { headers }),
      ]);
      
      if (!eRes.ok || !jRes.ok || !mRes.ok || !uRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      
      setTopEmployers(await eRes.json());
      setTopJobseekers(await jRes.json());
      setJobStats(await mRes.json());
      setUserDist(await uRes.json());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activePeriod]);

  const handleRefresh = () => {
    fetchData();
  };

  const handlePeriodChange = (period) => {
    setActivePeriod(period);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-lg text-gray-600">Loading dashboard data...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 p-6 bg-red-50 rounded-lg">
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
          </button>
        </div>
      </MainLayout>
    );
  }

  const chartColors = {
    primary: 'rgba(59, 130, 246, 0.8)',
    secondary: 'rgba(99, 102, 241, 0.8)',
    accent: 'rgba(139, 92, 246, 0.8)',
    background: 'rgba(219, 234, 254, 0.3)',
    border: 'rgba(59, 130, 246, 1)',
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Analytics</h1>
         
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Employers" 
            value={userDist.employers} 
            change={"+12%"} 
            positive={true} 
          />
          <StatCard 
            title="Total Jobseekers" 
            value={userDist.jobseekers} 
            change={"+8%"} 
            positive={true} 
          />
          <StatCard 
            title="Jobs Posted" 
            value={jobStats.reduce((sum, month) => sum + month.total, 0)} 
            change={"+5%"} 
            positive={true}
          />
          <StatCard 
            title="Applications" 
            value={topJobseekers.reduce((sum, js) => sum + js.total_applications, 0)} 
            change={"-2%"} 
            positive={false}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Jobs Posted Trend</h2>
              <div className="p-1 bg-blue-50 rounded-full">
                <Info className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="h-64">
              <Line
                data={{
                  labels: jobStats.map((e) => e.month),
                  datasets: [
                    {
                      label: "New Jobs",
                      data: jobStats.map((e) => e.total),
                      borderColor: chartColors.primary,
                      backgroundColor: chartColors.background,
                      borderWidth: 2,
                      tension: 0.3,
                      fill: true,
                      pointBackgroundColor: chartColors.border,
                      pointRadius: 3,
                      pointHoverRadius: 5,
                    },
                  ],
                }}
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.05)',
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">User Distribution</h2>
              <div className="p-1 bg-blue-50 rounded-full">
                <Info className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <Pie
                data={{
                  labels: ["Jobseekers", "Employers"],
                  datasets: [
                    {
                      data: [userDist.jobseekers, userDist.employers],
                      backgroundColor: [chartColors.primary, chartColors.accent],
                      borderColor: ['#fff', '#fff'],
                      borderWidth: 2,
                      hoverOffset: 15,
                    },
                  ],
                }}
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                          size: 12
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Top Performers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Top Employers</h2>
              <div className="text-sm text-gray-500">By Job Posts</div>
            </div>
            <div className="overflow-hidden">
              <Bar
                data={{
                  labels: topEmployers.map((e) => truncateString(e.name || "N/A", 12)),
                  datasets: [
                    {
                      label: "Job Posts",
                      data: topEmployers.map((e) => e.total_jobs),
                      backgroundColor: chartColors.primary,
                      borderRadius: 4,
                      barThickness: 20,
                      maxBarThickness: 30
                    },
                  ],
                }}
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  scales: {
                    x: {
                      beginAtZero: true,
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      grid: {
                        display: false
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
                height={200}
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Top Jobseekers</h2>
              <div className="text-sm text-gray-500">By Applications</div>
            </div>
            <div className="overflow-hidden">
              <Bar
                data={{
                  labels: topJobseekers.map((j) => truncateString(j.name || "N/A", 12)),
                  datasets: [
                    {
                      label: "Applications",
                      data: topJobseekers.map((j) => j.total_applications),
                      backgroundColor: chartColors.accent,
                      borderRadius: 4,
                      barThickness: 20,
                      maxBarThickness: 30
                    },
                  ],
                }}
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  scales: {
                    x: {
                      beginAtZero: true,
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      grid: {
                        display: false
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
                height={200}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Helper component for stat cards
const StatCard = ({ title, value, change, positive }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <div className="flex justify-between items-end mt-2">
      <p className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</p>
      <span className={`text-sm font-medium px-2 py-1 rounded-full ${positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {change}
      </span>
    </div>
  </div>
);

// Helper function to truncate string
const truncateString = (str, num) => {
  if (str.length <= num) return str;
  return str.slice(0, num) + '...';
};

export default StatsDashboard;