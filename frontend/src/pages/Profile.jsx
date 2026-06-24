import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { User, Mail, Compass, ShieldAlert, Award } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [careerPreferences, setCareerPreferences] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await API.get("/user/me");
      setUser(res.data);
      setName(res.data.fullName || "");
      setCareerPreferences(res.data.careerPreferences || "");
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!name.trim()) {
      return toast.error("Name field cannot be empty");
    }

    try {
      const res = await API.put("/user/me", {
        fullName: name,
        careerPreferences: careerPreferences,
      });

      toast.success("Profile updated successfully");

      const updatedUser = {
        ...user,
        fullName: res.data.fullName,
        careerPreferences: res.data.careerPreferences,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));
      fetchProfile();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // Get initials for profile picture
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-100px)] py-6 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all">

        {/* Profile Header Row (Clean, no cover banner) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-100 pb-6 mb-6 text-center sm:text-left">
          <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold border border-indigo-100 shrink-0">
            {getInitials(user.fullName)}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Profile</h1>
            <p className="text-sm text-slate-500">{user.email || "Loading..."}</p>
          </div>
          {user.role && (
            <span className={`sm:ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider border
              ${user.role === "admin" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-indigo-50 text-indigo-700 border-indigo-200"}`}
            >
              {user.role}
            </span>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Email Field (Always Readonly) */}
          <div>
            <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              Email Address
            </label>
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-600 text-sm select-all">
              {user.email}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 pl-1">Your registered email address cannot be changed.</p>
          </div>

          {/* Name Input */}
          <div>
            <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <User className="h-3.5 w-3.5 text-slate-400" />
              Full Name
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white disabled:opacity-75 disabled:cursor-not-allowed text-slate-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={user.role === "admin"}
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Career Preferences TextArea */}
          <div>
            <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <Compass className="h-3.5 w-3.5 text-slate-400" />
              Career Preferences / Goals
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white disabled:opacity-75 disabled:cursor-not-allowed text-slate-800"
              rows="4"
              value={careerPreferences}
              onChange={(e) => setCareerPreferences(e.target.value)}
              disabled={user.role === "admin"}
              placeholder="e.g. Looking for Remote Frontend Developer roles, interested in React/Next.js frameworks..."
            />
          </div>



          {/* Save Button */}
          {user.role !== "admin" && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleUpdate}
                className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-md hover:opacity-95 active:scale-98 transition text-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;