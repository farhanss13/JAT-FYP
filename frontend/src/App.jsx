import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Reminders from "./pages/Reminders";
import Documents from "./pages/Documents";
import Login from "./pages/Login";
import ApplicationDetails from "./pages/ApplicationDetails";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import Settings from "./pages/admin/Settings";
import Profile from "./pages/Profile"; // ✅ ADDED

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SystemLogs from "./pages/admin/SystemLogs";

function App() {
  const isAuthed = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/register"
          element={isAuthed ? <Navigate to="/dashboard" /> : <Register />}
        />

        <Route
          path="/"
          element={<Navigate to={isAuthed ? "/dashboard" : "/login"} />}
        />

        <Route
          path="/login"
          element={isAuthed ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            isAuthed ? (
              <Layout>
                {role === "admin" ? <AdminDashboard /> : <Dashboard />}
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ✅ PROFILE ROUTE */}
        <Route
          path="/profile"
          element={
            isAuthed ? (
              <Layout>
                <Profile />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* USER */}
        <Route path="/jobs" element={isAuthed ? <Layout><Jobs /></Layout> : <Navigate to="/login" />} />
        <Route path="/documents" element={isAuthed ? <Layout><Documents /></Layout> : <Navigate to="/login" />} />
        <Route path="/reminders" element={isAuthed ? <Layout><Reminders /></Layout> : <Navigate to="/login" />} />
        <Route path="/job/:id" element={isAuthed ? <Layout><ApplicationDetails /></Layout> : <Navigate to="/login" />} />

        {/* ADMIN */}
        <Route
          path="/admin/users"
          element={
            isAuthed && role === "admin" ? (
              <Layout><ManageUsers /></Layout>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/admin/settings"
          element={
            isAuthed && role === "admin" ? (
              <Layout><Settings /></Layout>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
  path="/admin/logs"
  element={
    isAuthed && role === "admin" ? (
      <Layout>
        <SystemLogs />
      </Layout>
    ) : (
      <Navigate to="/dashboard" />
    )
  }
/>

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;