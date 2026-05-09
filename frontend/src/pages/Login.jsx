import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import logo from "../assets/Logo.png";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful");

      window.location.href = "/dashboard";

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
            Welcome Back
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Sign in to manage your job applications
          </p>

        </div>

        {/* EMAIL */}
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Email
        </label>

        <input
          type="email"
          placeholder="you@example.com"
          className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* FORGOT PASSWORD */}
        <div className="mb-5 text-right">
          <span
            onClick={() => (window.location.href = "/forgot-password")}
            className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot Password?
          </span>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-md transition hover:opacity-95"
        >
          Login
        </button>

        {/* SIGNUP */}
        <p className="mt-6 text-center text-sm sm:text-base text-slate-600">
          Don't have an account?{" "}
          <span
            onClick={() => (window.location.href = "/register")}
            className="cursor-pointer font-semibold text-blue-600 hover:text-blue-500"
          >
            Sign Up
          </span>
        </p>

      </form>
    </div>
  );
};

export default Login;