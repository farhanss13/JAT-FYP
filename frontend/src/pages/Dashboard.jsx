import { useEffect, useState } from "react";
import API from "../services/api";
import Charts from "../components/Charts";
import { Briefcase, CalendarCheck2, BadgeCheck, XCircle, Plus, ChevronRight } from "lucide-react";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [userName, setUserName] = useState("User");

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJobs();

    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.fullName) {
      setUserName(user.fullName);
    }
  }, []);

  const total = jobs.length;
  const interviews = jobs.filter(j => j.status === "Interview").length;
  const offers = jobs.filter(j => j.status === "Offer").length;
  const rejected = jobs.filter(j => j.status === "Rejected").length;

  const recentJobs = jobs.slice(-5).reverse();

  const getStatusStyle = (status) => {
    switch (status) {
      case "Interview":
        return "bg-amber-50 text-amber-700 border border-amber-200/60";
      case "Applied":
        return "bg-sky-50 text-sky-700 border border-sky-200/60";
      case "Offer":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border border-rose-200/60";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200/60";
    }
  };

  return (
    <div className="space-y-8 pb-10">

      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-xl">
          <span className="inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-300 uppercase">
            Overview Dashboard
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome, {userName} 👋
          </h1>
          <p className="mt-2 text-indigo-200 text-sm sm:text-base leading-relaxed">
            Manage your applications, check scheduled reminders, and keep pushing toward your next career milestone.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-linear-to-br from-indigo-500/20 to-purple-500/0 blur-2xl pointer-events-none"></div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Total Card */}
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Applications</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">{total}</p>
            </div>
            <div className="rounded-xl bg-indigo-50/80 p-3 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span>Overall Applications</span>
          </div>
        </div>

        {/* Interviews Card */}
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Interviews</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">{interviews}</p>
            </div>
            <div className="rounded-xl bg-amber-50/80 p-3 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
              <CalendarCheck2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span>Active schedules</span>
          </div>
        </div>

        {/* Offers Card */}
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Offers Received</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">{offers}</p>
            </div>
            <div className="rounded-xl bg-emerald-50/80 p-3 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <BadgeCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span>Success rate achievement</span>
          </div>
        </div>

        {/* Rejected Card */}
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-rose-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rejections</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">{rejected}</p>
            </div>
            <div className="rounded-xl bg-rose-50/80 p-3 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span>Rejected Applications</span>
          </div>
        </div>

      </div>

      {/* RECENT APPLICATIONS TABLE */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Recent Applications</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              The latest jobs you have added to your tracker
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = "/jobs"}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white sm:w-auto shadow-md transition-all duration-200 hover:opacity-95 active:scale-98"
          >
            <Plus className="h-4 w-4" />
            Add New Application
          </button>
        </div>

        {/* TABLE CONTAINER */}
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full min-w-160 text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="py-4 font-semibold">Company</th>
                <th className="py-4 font-semibold">Position</th>
                <th className="py-4 font-semibold">Date Applied</th>
                <th className="py-4 font-semibold">Status</th>
                <th className="py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {recentJobs.map((job) => (
                <tr
                  key={job._id}
                  className="hover:bg-slate-50/60 cursor-pointer group transition-colors duration-150"
                  onClick={() => window.location.href = `/job/${job._id}`}
                >
                  <td className="py-4 font-bold text-slate-900">
                    {job.company || "-"}
                  </td>

                  <td className="py-4 text-slate-600 font-medium">
                    {job.positionTitle}
                  </td>

                  <td className="py-4 text-slate-500 text-sm">
                    {job.dateApplied
                      ? new Date(job.dateApplied).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                      : "-"}
                  </td>

                  <td className="py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusStyle(job.status)}`}>
                      {job.status}
                    </span>
                  </td>

                  <td className="py-4 text-right">
                    <span className="inline-flex items-center text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                      Details <ChevronRight className="h-4 w-4 ml-0.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentJobs.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500 font-medium">No job applications logged yet.</p>
              <p className="text-xs text-slate-400 mt-1">Start by adding your first job tracker card.</p>
            </div>
          )}
        </div>

      </div>

      {/* CHARTS CONTAINER */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Application Performance Analytics</h3>
        <Charts jobs={jobs} />
      </div>

    </div>
  );
};

export default Dashboard;