import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import logo from "../assets/Logo.png";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful! Redirecting to login...");
      
      // Auto-redirect to login after 1.5 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white px-6 sm:px-8 py-7 shadow-xl"
      >
        {/* LOGO + HEADING */}
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src={logo}
            alt="Logo"
            className="mb-3 h-16 w-16 rounded-2xl object-cover"
          />

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Job Application Tracker
          </h1>

          <h2 className="mt-3 text-xl font-semibold text-slate-900">
            Reset Password
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Please enter and confirm your new password below
          </p>
        </div>

        {/* NEW PASSWORD */}
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          New Password
        </label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* CONFIRM PASSWORD */}
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Confirm Password
        </label>
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-md transition hover:opacity-95"
        >
          Reset Password
        </button>

        {/* CANCEL / BACK LINK */}
        <p className="mt-6 text-center text-sm sm:text-base text-slate-600">
          Cancel and{" "}
          <span
            onClick={() => (window.location.href = "/login")}
            className="cursor-pointer font-semibold text-blue-600 hover:text-blue-500"
          >
            Go to Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;