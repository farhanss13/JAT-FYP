import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    defaultJobStatus: "Applied",
  });

  const fetchSettings = async () => {
    try {
      const res = await API.get("/settings");

      setSettings({
        emailNotifications: res.data.emailNotifications ?? true,
        defaultJobStatus: res.data.defaultJobStatus || "Applied",
      });
    } catch {
      toast.error("Failed to load settings");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

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
      toast.success("Settings updated");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
          System Settings
        </h2>

        {/* Notifications */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="flex cursor-pointer items-center gap-2 text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={handleToggle}
              className="cursor-pointer"
            />
            Enable Notifications
          </label>
        </div>

        {/* Default Status */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Default Job Status
          </label>
          <select
            name="defaultJobStatus"
            value={settings.defaultJobStatus}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500 focus:bg-white"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button
          type="button"
          onClick={saveSettings}
          className="cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-2.5 font-semibold text-white shadow-md hover:opacity-95"
        >
          Save Settings
        </button>

      </div>
    </div>
  );
};

export default Settings;