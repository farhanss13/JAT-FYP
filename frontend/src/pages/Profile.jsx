import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

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
    try {
      const res = await API.put("/user/me", {
        fullName: name,
        careerPreferences: careerPreferences,
      });

      toast.success("Profile updated");

      // ✅ UPDATE LOCAL STORAGE
      const updatedUser = {
        ...user,
        fullName: res.data.fullName,
        careerPreferences: res.data.careerPreferences,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // ✅ TRIGGER GLOBAL UPDATE
      window.dispatchEvent(new Event("userUpdated"));

      fetchProfile();

    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-100px)] py-6 px-4">

      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
          My Profile
        </h1>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm text-slate-500">Email</label>

          <p className="mt-2 rounded-xl border border-slate-200 p-3 bg-slate-50 text-slate-700">
            {user.email}
          </p>
        </div>

        {/* NAME */}
        <div className="mb-4">
          <label className="text-sm text-slate-500">Name</label>

          <input
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500 focus:bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={user.role === "admin"}
          />
        </div>

        {/* CAREER */}
        <div className="mb-4">
          <label className="text-sm text-slate-500">
            Career Preferences
          </label>

          <textarea
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500 focus:bg-white"
            rows="3"
            value={careerPreferences}
            onChange={(e) => setCareerPreferences(e.target.value)}
            disabled={user.role === "admin"}
          />
        </div>

        {/* SAVE */}
        {user.role !== "admin" && (
          <button
            type="button"
            onClick={handleUpdate}
            className="w-full cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-4 py-3 font-semibold text-white shadow-md hover:opacity-95"
          >
            Save Changes
          </button>
        )}

      </div>
    </div>
  );
};

export default Profile;