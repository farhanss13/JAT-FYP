import { useEffect, useState } from "react";
import API from "../services/api";
import Charts from "../components/Charts";
import { Briefcase, CalendarCheck2, BadgeCheck, XCircle, Plus } from "lucide-react";

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
        return "bg-yellow-100 text-yellow-700";
      case "Applied":
        return "bg-blue-100 text-blue-600";
      case "Offer":
        return "bg-green-100 text-green-600";
      case "Rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Welcome, {userName} 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Track your job applications efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-2 text-blue-600">
            <Briefcase className="h-5 w-5" />
          </div>
          <h2 className="text-sm text-slate-500">Total Applications</h2>
          <p className="text-3xl font-bold text-slate-900">{total}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-4 inline-flex rounded-xl bg-amber-50 p-2 text-amber-600">
            <CalendarCheck2 className="h-5 w-5" />
          </div>
          <h2 className="text-sm text-slate-500">Interviews Scheduled</h2>
          <p className="text-3xl font-bold text-slate-900">{interviews}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-2 text-emerald-600">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <h2 className="text-sm text-slate-500">Offers Received</h2>
          <p className="text-3xl font-bold text-slate-900">{offers}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-4 inline-flex rounded-xl bg-rose-50 p-2 text-rose-600">
            <XCircle className="h-5 w-5" />
          </div>
          <h2 className="text-sm text-slate-500">Rejected Applications</h2>
          <p className="text-3xl font-bold text-slate-900">{rejected}</p>
        </div>

      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center p-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Recent Applications</h2>
            <p className="text-sm text-slate-500">
              Track and manage your job applications
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = "/jobs"}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white sm:w-auto hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Add New Application
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto px-4 sm:px-5 pb-5">
          <table className="w-full min-w-160 text-left">

            <thead>
              <tr className="text-slate-500 text-xs border-b border-slate-100">
                <th className="py-3">COMPANY</th>
                <th className="py-3">POSITION</th>
                <th className="py-3">DATE APPLIED</th>
                <th className="py-3">STATUS</th>
              </tr>
            </thead>

            <tbody>
              {recentJobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => window.location.href = `/job/${job._id}`}
                >
                  <td className="py-3 font-semibold text-slate-900">
                    {job.company || "-"}
                  </td>

                  <td className="py-3 text-slate-700">
                    {job.positionTitle}
                  </td>

                  <td className="py-3 text-slate-600">
                    {job.dateApplied
                      ? new Date(job.dateApplied).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {recentJobs.length === 0 && (
            <p className="text-slate-500 text-center py-6">
              No applications yet
            </p>
          )}
        </div>

      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Charts jobs={jobs} />
      </div>

    </div>
  );
};

export default Dashboard;