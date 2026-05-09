import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bell,
  Shield,
  Users,
  Settings,
  ScrollText,
  Menu,
} from "lucide-react";

import logo from "../assets/Logo.png";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const role = localStorage.getItem("role") || "user";
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const navClass = (path) =>
    `flex cursor-pointer items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
      open ? "mx-3 gap-3 px-3 justify-start" : "mx-2 px-0 justify-center"
    } ${
      isActive(path)
        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      
      <div
        className={`h-full flex flex-col border-r border-slate-200 bg-white/95 backdrop-blur transition-all duration-300 ease-in-out shrink-0
        ${open ? "w-64" : "w-20"}`}
      >

        
        <div className={`py-5 flex items-center ${open ? "px-4 justify-between" : "px-2 justify-center"}`}>

          
          <div className={`flex items-center overflow-hidden ${open ? "w-auto" : "w-0"}`}>
            <img
              src={logo}
              alt="Logo"
              className={`h-9 object-contain transition-all duration-300 ${
                open ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
            />
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition"
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>

        </div>

        <nav className="flex flex-col gap-1 mt-3">

          {role === "user" && (
            <>
              <Link to="/dashboard" className={navClass("/dashboard")}>
                <LayoutDashboard className="h-5 w-5 shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-200 ${open ? "opacity-100 max-w-35" : "opacity-0 max-w-0 overflow-hidden"}`}>
                  Dashboard
                </span>
              </Link>

              <Link to="/jobs" className={navClass("/jobs")}>
                <Briefcase className="h-5 w-5 shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-200 ${open ? "opacity-100 max-w-35" : "opacity-0 max-w-0 overflow-hidden"}`}>
                  Applications
                </span>
              </Link>

              <Link to="/documents" className={navClass("/documents")}>
                <FileText className="h-5 w-5 shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-200 ${open ? "opacity-100 max-w-35" : "opacity-0 max-w-0 overflow-hidden"}`}>
                  Documents
                </span>
              </Link>

              <Link to="/reminders" className={navClass("/reminders")}>
                <Bell className="h-5 w-5 shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-200 ${open ? "opacity-100 max-w-35" : "opacity-0 max-w-0 overflow-hidden"}`}>
                  Reminders
                </span>
              </Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link to="/dashboard" className={navClass("/dashboard")}>
                <Shield className="h-5 w-5 shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-200 ${open ? "opacity-100 max-w-35" : "opacity-0 max-w-0 overflow-hidden"}`}>
                  Admin Dashboard
                </span>
              </Link>

              <Link to="/admin/users" className={navClass("/admin/users")}>
                <Users className="h-5 w-5 shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-200 ${open ? "opacity-100 max-w-35" : "opacity-0 max-w-0 overflow-hidden"}`}>
                  Manage Users
                </span>
              </Link>

              <Link to="/admin/settings" className={navClass("/admin/settings")}>
                <Settings className="h-5 w-5 shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-200 ${open ? "opacity-100 max-w-35" : "opacity-0 max-w-0 overflow-hidden"}`}>
                  System Settings
                </span>
              </Link>

              <Link to="/admin/logs" className={navClass("/admin/logs")}>
                <ScrollText className="h-5 w-5 shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-200 ${open ? "opacity-100 max-w-35" : "opacity-0 max-w-0 overflow-hidden"}`}>
                  System Logs
                </span>
              </Link>
            </>
          )}

        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="overflow-auto bg-slate-100 p-3 sm:p-4 md:p-6">
          {children}
        </div>
      </div>

    </div>
  );
};

export default Layout;