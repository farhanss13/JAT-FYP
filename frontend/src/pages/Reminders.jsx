import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { 
  Bell, 
  Calendar, 
  Trash2, 
  Briefcase, 
  Clock, 
  Info,
  CheckCircle2, 
  Video, 
  PhoneCall, 
  AlertTriangle 
} from "lucide-react";

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

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("jat:remindersFormDraft");
    if (savedDraft) {
      try {
        setForm(JSON.parse(savedDraft));
        toast.info("Unsaved draft reminder restored");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const hasContent = Object.entries(form).some(([key, val]) => {
        if (key === "reminderType" && val === "Follow-up") return false;
        return val !== "";
      });
      if (hasContent) {
        localStorage.setItem("jat:remindersFormDraft", JSON.stringify(form));
        toast.info("Draft auto-saved");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [form]);

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
      await API.post("/reminders", {
        ...form,
        reminderDate: new Date(form.reminderDate).toISOString(),
      });

      toast.success("Reminder added successfully");

      setForm({
        jobApplicationId: "",
        reminderDate: "",
        reminderType: "Follow-up",
      });

      localStorage.removeItem("jat:remindersFormDraft");

      await fetchReminders();
      window.dispatchEvent(new Event("jat:remindersUpdated"));
    } catch {
      toast.error("Failed to add reminder");
    }
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this reminder?")) return;

    try {
      await API.delete(`/reminders/${id}`);
      toast.success("Reminder deleted");
      await fetchReminders();
      window.dispatchEvent(new Event("jat:remindersUpdated"));
    } catch {
      toast.error("Delete failed");
    }
  };

  // Helper to format reminder type visual styling
  const getReminderTypeDetails = (type) => {
    switch (type) {
      case "Interview":
        return {
          label: "Interview",
          colorClass: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <Video className="h-4 w-4" />,
          iconBg: "bg-purple-100/80 text-purple-600",
        };
      case "Follow-up":
        return {
          label: "Follow-up",
          colorClass: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <PhoneCall className="h-4 w-4" />,
          iconBg: "bg-blue-100/80 text-blue-600",
        };
      case "Deadline":
        return {
          label: "Deadline",
          colorClass: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <AlertTriangle className="h-4 w-4" />,
          iconBg: "bg-rose-100/80 text-rose-600",
        };
      default:
        return {
          label: type,
          colorClass: "bg-slate-50 text-slate-700 border-slate-200",
          icon: <Bell className="h-4 w-4" />,
          iconBg: "bg-slate-100/80 text-slate-600",
        };
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Reminders Hub</h1>
        <p className="mt-1 text-slate-500">Schedule automatic email follow-ups and track scheduled interview milestones</p>
      </div>

      {/* TWO COLUMN SIDE-BY-SIDE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: FORM (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Set New Reminder</h2>
              <p className="text-xs text-slate-500 mt-0.5">Select a linked job and choose when to be notified</p>
            </div>

            <div className="space-y-4">
              {/* JOB SELECT */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Linked Application</label>
                <select
                  name="jobApplicationId"
                  value={form.jobApplicationId}
                  onChange={handleChange}
                  className="cursor-pointer w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
                  required
                >
                  <option value="">Select Associated Job</option>
                  {jobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.positionTitle} ({job.company || "No company"})
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE PICKER */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Date & Time</label>
                <input
                  type="datetime-local"
                  name="reminderDate"
                  value={form.reminderDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white text-slate-600"
                  required
                />
              </div>

              {/* TYPE SELECT */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Reminder Category</label>
                <select
                  name="reminderType"
                  value={form.reminderType}
                  onChange={handleChange}
                  className="cursor-pointer w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
                >
                  <option value="Follow-up">Follow-up</option>
                  <option value="Interview">Interview</option>
                  <option value="Deadline">Deadline</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* SYSTEM INFORMATION NOTIFICATION BANNER */}
              <div className="rounded-xl bg-indigo-50/50 border border-indigo-100/50 p-3.5 text-xs text-indigo-800 flex gap-2.5 items-start">
                <Info className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                <p className="leading-normal">
                  <span className="font-bold">Dispatch Cycle:</span> In production, reminders are compiled and emailed in batches every 30 minutes (processed instantly in development).
                </p>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-md transition hover:opacity-95 text-sm"
            >
              Add Reminder
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIST (7 COLS) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4">Scheduled Reminders</h2>

          {reminders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 font-medium">No reminders scheduled yet</p>
              <p className="text-xs text-slate-400 mt-1">Set a reminder on the left to schedule email alerts.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {reminders.map((rem) => {
                const typeDetails = getReminderTypeDetails(rem.reminderType);
                const isTriggered = rem.status === "Triggered" || rem.status === "Done";
                return (
                  <div
                    key={rem._id}
                    className={`rounded-xl border p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between
                    ${isTriggered ? "bg-slate-50/40 border-slate-100" : "bg-white border-slate-200/60"}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Left icon branding based on Type */}
                      <div className={`rounded-lg p-2.5 shrink-0 mt-0.5 ${typeDetails.iconBg}`}>
                        {typeDetails.icon}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-800">
                            {typeDetails.label}
                          </h4>
                          <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wide uppercase ${typeDetails.colorClass}`}>
                            {rem.jobApplicationId?.positionTitle || "Job"}
                          </span>
                        </div>

                        {/* Date Applied */}
                        <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(rem.reminderDate).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short"
                          })}
                        </p>

                        {/* Status Checkbox/Indicator */}
                        <div className="flex items-center gap-1.5 mt-1">
                          {isTriggered ? (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              <CheckCircle2 className="h-3 w-3" /> Dispatched
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-amber-600 font-bold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                              Pending Dispatch
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(rem._id)}
                      className="cursor-pointer flex items-center justify-center p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-all self-end sm:self-center"
                      title="Cancel reminder"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Reminders;