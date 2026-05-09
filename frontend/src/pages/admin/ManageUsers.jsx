import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserJobs, setSelectedUserJobs] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewJobs = async (userId) => {
    try {
      const res = await API.get(`/admin/users/${userId}/jobs`);
      setSelectedUserJobs(res.data);
      setSelectedUserId(userId);
    } catch {
      toast.error("Failed to fetch jobs");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
      setSelectedUserJobs([]);
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await API.delete(`/admin/jobs/${jobId}`);
      toast.success("Job deleted");

      handleViewJobs(selectedUserId);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Users</h1>

      {/* USERS */}
      {users.map((user) => (
        <div key={user._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div>
              <p className="font-bold text-slate-900">{user.fullName}</p>
              <p className="text-slate-700">{user.email}</p>
              <p className="text-sm text-slate-500">
                Jobs: {user.jobCount}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => handleViewJobs(user._id)}
                className="cursor-pointer rounded-lg bg-blue-100 px-3 py-1.5 font-medium text-blue-700"
              >
                View Applications
              </button>

              <button
                type="button"
                onClick={() => handleDeleteUser(user._id)}
                className="cursor-pointer rounded-lg bg-rose-100 px-3 py-1.5 font-medium text-rose-700"
              >
                Delete User
              </button>
            </div>
          </div>

          {selectedUserId === user._id && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h3 className="font-semibold text-slate-900 mb-2">Applications:</h3>

              {selectedUserJobs.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No applications found
                </p>
              ) : (
                selectedUserJobs.map((job) => (
                  <div
                    key={job._id}
                    className="rounded-lg border border-slate-200 bg-white p-3 mb-2 flex flex-col gap-2 sm:flex-row sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {job.positionTitle}
                      </p>
                      <p className="text-slate-700">{job.company}</p>
                      <p className="text-sm text-slate-500">
                        {job.status}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteJob(job._id)}
                      className="cursor-pointer rounded-lg bg-rose-100 px-3 py-1.5 text-sm font-medium text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ManageUsers;