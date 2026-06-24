import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { Sliders, BellRing, Settings as SettingsIcon, ShieldCheck } from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    defaultJobStatus: "Applied",
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/settings");
      setSettings({
        emailNotifications: res.data.emailNotifications ?? true,
        defaultJobStatus: res.data.defaultJobStatus || "Applied",
      });
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600"></div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">Loading system settings...</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleToggle = () => {
    setSettings({
      ...settings,
      emailNotifications: !settings.emailNotifications,
    });
  };

  const saveSettings = async () => {
    try {
      await API.put("/settings", settings);
      toast.success("System configurations updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-100px)] py-6 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">

        {/* Header Block */}
        <div className="flex items-center gap-4 border-b border-slate-100 p-6 sm:p-8 bg-slate-50/50">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold border border-indigo-100 shrink-0">
            <SettingsIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Configuration</h1>
            <p className="text-sm text-slate-500">Manage global settings and mailing triggers</p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Notifications Toggle Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-3xs flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 mt-0.5">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Mailing & Reminders</h4>
                <p className="text-xs text-slate-500 mt-0.5">Toggle automated cron scheduler alerts and email delivery triggers globally.</p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <button
              type="button"
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none
              ${settings.emailNotifications ? "bg-indigo-600" : "bg-slate-200"}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out
                ${settings.emailNotifications ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          {/* Default Status Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <Sliders className="h-3.5 w-3.5 text-slate-400" />
              Default Application Status
            </label>
            <select
              name="defaultJobStatus"
              value={settings.defaultJobStatus}
              onChange={handleChange}
              className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <p className="text-[10px] text-slate-400 pl-1">Sets the pre-selected status when users add a new application.</p>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">


            <button
              type="button"
              onClick={saveSettings}
              className="cursor-pointer w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-md hover:opacity-95 active:scale-98 transition text-sm text-center"
            >
              Save Configurations
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Settings;