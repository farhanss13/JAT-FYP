import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import logo from "../assets/Logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to email");
    } catch (err) {
      toast.error("Error sending email");
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
            Forgot Password
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* EMAIL */}
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Email Address
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="mb-6 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-md transition hover:opacity-95"
        >
          Send Reset Link
        </button>

        {/* GO BACK TO LOGIN */}
        <p className="mt-6 text-center text-sm sm:text-base text-slate-600">
          Remembered your password?{" "}
          <span
            onClick={() => (window.location.href = "/login")}
            className="cursor-pointer font-semibold text-blue-600 hover:text-blue-500"
          >
            Go Back
          </span>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;