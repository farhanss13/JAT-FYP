import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const updateActivity = () => {
  localStorage.setItem("lastActivity", Date.now());
};

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  updateActivity(); // 🔥 every request refreshes activity
  return req;
});

// 🔒 AUTO LOGOUT IF INACTIVE
setInterval(() => {
  const last = localStorage.getItem("lastActivity");

  if (!last) return;

  const diff = Date.now() - parseInt(last);

  // 30 minutes
  if (diff > 30 * 60 * 1000) {
    localStorage.clear();
    window.location.href = "/login";
  }
}, 60000); // check every minute

export default API;