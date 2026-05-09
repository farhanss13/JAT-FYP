import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [form, setForm] = useState({
    jobApplicationId: "",
    reminderDate: "",
    reminderType: "Follow-up",
  });

  // 🔹 Fetch reminders
  const fetchReminders = async () => {
    try {
      const res = await API.get("/reminders");
      setReminders(res.data);
    } catch {
      toast.error("Failed to fetch reminders");
    }
  };

  // 🔹 Fetch jobs (for dropdown)
  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch {
      toast.error("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchReminders();
    const poll = setInterval(fetchReminders, 6000);
    const onVisible = () => {
      if (!document.hidden) fetchReminders();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Add Reminder
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.jobApplicationId || !form.reminderDate) {
      return toast.error("Please fill all fields");
    }

    try {
      await API.post("/reminders", form);

      toast.success("Reminder added");

      setForm({
        jobApplicationId: "",
        reminderDate: "",
        reminderType: "Follow-up",
      });

      await fetchReminders();
      window.dispatchEvent(new Event("jat:remindersUpdated"));
    } catch {
      toast.error("Failed to add reminder");
    }
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    try {
      await API.delete(`/reminders/${id}`);
      toast.success("Reminder deleted");
      await fetchReminders();
      window.dispatchEvent(new Event("jat:remindersUpdated"));
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Reminders</h1>
        <p className="mt-1 text-slate-500">Schedule and monitor follow-ups</p>
      </div>

      {/* FORM */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Set Reminder</h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* JOB SELECT */}
          <select
            name="jobApplicationId"
            value={form.jobApplicationId}
            onChange={handleChange}
            className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3 w-full outline-none focus:border-cyan-500 focus:bg-white"
          >
            <option value="">Select Job</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.positionTitle} ({job.company || "No company"})
              </option>
            ))}
          </select>

          {/* DATE */}
          <input
            type="datetime-local"
            name="reminderDate"
            value={form.reminderDate}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 w-full outline-none focus:border-cyan-500 focus:bg-white"
          />

          {/* TYPE */}
          <select
            name="reminderType"
            value={form.reminderType}
            onChange={handleChange}
            className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3 w-full outline-none focus:border-cyan-500 focus:bg-white"
          >
            <option value="Follow-up">Follow-up</option>
            <option value="Interview">Interview</option>
            <option value="Deadline">Deadline</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="submit"
            className="w-full cursor-pointer sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 font-semibold text-white shadow-md"
          >
            Add Reminder
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Reminders</h2>

        {reminders.length === 0 && (
          <p className="text-slate-500">No reminders yet</p>
        )}

        <div className="space-y-3">
          {reminders.map((rem) => (
            <div
              key={rem._id}
              className="rounded-xl border border-slate-200 p-4 flex flex-col gap-3 md:flex-row md:justify-between md:items-center"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {rem.reminderType} —{" "}
                  {rem.jobApplicationId?.positionTitle || "Job"}
                </p>

                <p className="text-sm text-slate-500">
                  {new Date(rem.reminderDate).toLocaleString()}
                </p>

                <p className="text-xs text-blue-600 font-medium">
                  Status: {rem.status}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(rem._id)}
                className="cursor-pointer rounded-lg bg-rose-100 px-3 py-1.5 font-medium text-rose-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Reminders;