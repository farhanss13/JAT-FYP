import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import logo from "../assets/Logo.png";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      toast.success("Registration successful");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white px-6 sm:px-8 py-7 shadow-xl"
      >

        {/* LOGO + HEADINGS */}
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
            Create Account
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Sign up to track your job applications
          </p>

        </div>

        {/* FULL NAME */}
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Full Name
        </label>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
          onChange={handleChange}
          required
        />

        {/* EMAIL */}
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Email
        </label>

        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
          onChange={handleChange}
          required
        />

        {/* PASSWORD */}
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Password
        </label>

        <div className="relative mb-5">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create your password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 outline-none transition focus:border-cyan-500 focus:bg-white"
            onChange={handleChange}
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

        {/* REGISTER BUTTON */}
        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-md transition hover:opacity-95"
        >
          Register
        </button>

        {/* LOGIN LINK */}
        <p className="mt-6 text-center text-sm sm:text-base text-slate-600">
          Already have an account?{" "}
          <span
            onClick={() => (window.location.href = "/login")}
            className="cursor-pointer font-semibold text-blue-600 hover:text-blue-500"
          >
            Sign In
          </span>
        </p>

      </form>
    </div>
  );
};

export default Register;