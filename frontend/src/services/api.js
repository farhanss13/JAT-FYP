import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

let lastUpdate = 0;
const updateActivity = () => {
  const now = Date.now();
  if (now - lastUpdate > 10000) { // Throttle updates to localStorage to every 10 seconds
    localStorage.setItem("lastActivity", now);
    lastUpdate = now;
  }
};

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  updateActivity(); 
  return req;
});

// Redirect to login if a request returns 401 Unauthorized
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const checkSessionTimeout = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const last = localStorage.getItem("lastActivity");
  if (!last) {
    updateActivity();
    return;
  }

  const diff = Date.now() - parseInt(last);

  if (diff > 30 * 60 * 1000) { // 30 minutes of inactivity
    localStorage.clear();
    window.location.href = "/login";
  }
};

// Check immediately on load
checkSessionTimeout();

// Check periodically every 30 seconds
setInterval(checkSessionTimeout, 30000);

// Listen for user interaction events to prevent timeout while active
if (typeof window !== "undefined") {
  const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
  activityEvents.forEach((event) => {
    window.addEventListener(event, updateActivity);
  });
}

export default API;