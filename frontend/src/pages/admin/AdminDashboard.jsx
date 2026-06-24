import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { Users, Briefcase, FileText, Bell, Shield, ArrowRight, Settings, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div className="space-y-8 pb-10">

      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-red-300 uppercase border border-red-500/10">
            <Shield className="h-3.5 w-3.5" />
            Security Administrator
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            System Console
          </h1>

        </div>
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-linear-to-br from-indigo-500/20 to-purple-500/0 blur-2xl pointer-events-none"></div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* USERS */}
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Users</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                {stats.totalUsers}
              </p>
            </div>
            <div className="rounded-xl bg-indigo-50/80 p-3 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span>Registered candidates</span>
          </div>
        </div>

        {/* APPLICATIONS */}
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Applications</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                {stats.totalJobs}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50/80 p-3 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span>Logged system-wide</span>
          </div>
        </div>

        {/* DOCUMENTS */}
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-violet-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Documents</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-violet-600 transition-colors">
                {stats.totalDocuments}
              </p>
            </div>
            <div className="rounded-xl bg-violet-50/80 p-3 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span>Uploaded file attachments</span>
          </div>
        </div>

        {/* REMINDERS */}
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-rose-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reminders</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                {stats.totalReminders}
              </p>
            </div>
            <div className="rounded-xl bg-rose-50/80 p-3 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
              <Bell className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span>Scheduled Reminders</span>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS SECTOR */}
      <div>
        <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-4">Quick Management Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Link to="/admin/users" className="group p-5 rounded-2xl border border-slate-100 bg-white shadow-2xs hover:shadow-md hover:border-indigo-100 transition-all">
            <div className="rounded-xl bg-indigo-50 p-2.5 w-fit text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-800 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
              Manage Users <ArrowRight className="h-4 w-4" />
            </h4>
          </Link>

          <Link to="/admin/settings" className="group p-5 rounded-2xl border border-slate-100 bg-white shadow-2xs hover:shadow-md hover:border-indigo-100 transition-all">
            <div className="rounded-xl bg-indigo-50 p-2.5 w-fit text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
              <Settings className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-800 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
              System Settings <ArrowRight className="h-4 w-4" />
            </h4>
          </Link>

          <Link to="/admin/logs" className="group p-5 rounded-2xl border border-slate-100 bg-white shadow-2xs hover:shadow-md hover:border-indigo-100 transition-all">
            <div className="rounded-xl bg-indigo-50 p-2.5 w-fit text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
              <ScrollText className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-800 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
              System Logs <ArrowRight className="h-4 w-4" />
            </h4>
          </Link>

        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;