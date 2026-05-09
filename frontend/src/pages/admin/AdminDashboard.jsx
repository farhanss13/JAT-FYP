import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { Users, Briefcase, FileText, Bell } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalDocuments: 0,
    totalReminders: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch {
      toast.error("Failed to load stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-slate-500">System-wide overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">

        {/* USERS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-2 text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-slate-500 text-sm">Total Users</h2>
          <p className="text-3xl font-bold text-slate-900">
            {stats.totalUsers}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-2 text-emerald-600">
            <Briefcase className="h-5 w-5" />
          </div>
          <h2 className="text-slate-500 text-sm">Total Applications</h2>
          <p className="text-3xl font-bold text-slate-900">
            {stats.totalJobs}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex rounded-xl bg-violet-50 p-2 text-violet-600">
            <FileText className="h-5 w-5" />
          </div>
          <h2 className="text-slate-500 text-sm">Total Documents</h2>
          <p className="text-3xl font-bold text-slate-900">
            {stats.totalDocuments}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex rounded-xl bg-rose-50 p-2 text-rose-600">
            <Bell className="h-5 w-5" />
          </div>
          <h2 className="text-slate-500 text-sm">Total Reminders</h2>
          <p className="text-3xl font-bold text-slate-900">
            {stats.totalReminders}
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;