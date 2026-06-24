import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { Users, Trash2, Eye, Briefcase, Search, Calendar, ShieldAlert } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserJobs, setSelectedUserJobs] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600"></div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">Loading users list...</p>
      </div>
    );
  }

  const handleViewJobs = async (userId) => {
    // If clicking the already selected user, close the panel
    if (selectedUserId === userId) {
      setSelectedUserId(null);
      setSelectedUserJobs([]);
      return;
    }

    try {
      const res = await API.get(`/admin/users/${userId}/jobs`);
      setSelectedUserJobs(res.data);
      setSelectedUserId(userId);
    } catch {
      toast.error("Failed to fetch jobs");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user and all their records? This cannot be undone.")) return;

    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
      setSelectedUserId(null);
      setSelectedUserJobs([]);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job application?")) return;

    try {
      await API.delete(`/admin/jobs/${jobId}`);
      toast.success("Job deleted");
      // Refresh list
      const res = await API.get(`/admin/users/${selectedUserId}/jobs`);
      setSelectedUserJobs(res.data);
      fetchUsers(); // Refresh counts
    } catch {
      toast.error("Delete failed");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Interview":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Applied":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Offer":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Manage Users</h1>
          <p className="mt-1 text-slate-500 text-sm">Audit active platform candidates and inspect logged records</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500"
          />
        </div>
      </div>

      {/* USER LIST CARDS */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div 
            key={user._id} 
            className={`rounded-2xl border bg-white p-5 shadow-2xs transition-all duration-300 hover:shadow-sm
            ${selectedUserId === user._id ? "border-indigo-200 ring-2 ring-indigo-500/5" : "border-slate-200/80"}`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              
              {/* Profile Block */}
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100 shrink-0">
                  {getInitials(user.fullName)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight flex items-center gap-2">
                    {user.fullName}
                    {user.role === "admin" && (
                      <span className="inline-block px-2 py-0.5 rounded-full border border-red-200 bg-red-50 text-[10px] font-bold text-red-700 uppercase">
                        Admin
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
                  
                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-slate-500">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    {user.jobCount || 0} application{(user.jobCount !== 1) && "s"} tracked
                  </span>
                </div>
              </div>

              {/* Actions Button Panel */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2 pt-3 md:pt-0 border-t border-slate-50 md:border-none">
                <button
                  type="button"
                  onClick={() => handleViewJobs(user._id)}
                  className={`cursor-pointer flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold border transition duration-150
                  ${selectedUserId === user._id 
                    ? "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700" 
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"}`}
                >
                  <Eye className="h-4 w-4" />
                  {selectedUserId === user._id ? "Close Applications" : "View Applications"}
                </button>

                {user.role !== "admin" && (
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(user._id)}
                    className="cursor-pointer flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 border border-rose-100 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white transition duration-150"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete User
                  </button>
                )}
              </div>
            </div>

            {/* NESTED JOB APPLICATIONS AREA */}
            {selectedUserId === user._id && (
              <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50/50 -mx-5 -mb-5 px-5 pb-5 rounded-b-2xl">
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-sm">
                  <Briefcase className="h-4 w-4 text-indigo-500" />
                  <span>User Job Applications ({selectedUserJobs.length})</span>
                </div>

                {selectedUserJobs.length === 0 ? (
                  <div className="text-center py-6 bg-white border border-slate-200/60 rounded-xl">
                    <p className="text-sm text-slate-500 font-medium">No job applications logged by this user.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedUserJobs.map((job) => (
                      <div
                        key={job._id}
                        className="rounded-xl border border-slate-200/60 bg-white p-4 flex justify-between items-center group shadow-3xs"
                      >
                        <div className="space-y-0.5 truncate pr-2">
                          <h4 className="font-bold text-slate-900 truncate">{job.positionTitle}</h4>
                          <p className="text-xs font-semibold text-slate-700 truncate">{job.company || "No Company Specified"}</p>
                          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full border text-[9px] font-bold tracking-wide uppercase ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job._id)}
                          className="cursor-pointer p-2.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition duration-150 shrink-0"
                          title="Delete application"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/85 max-w-md mx-auto shadow-2xs">
            <ShieldAlert className="mx-auto h-10 w-10 text-slate-400 mb-2" />
            <p className="font-semibold text-slate-800">No users found</p>
            <p className="text-xs text-slate-500 mt-1">Try expanding search query parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;