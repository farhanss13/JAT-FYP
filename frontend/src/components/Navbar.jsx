import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import { Bell } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const wrapperRef = useRef(null);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
        setUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updateUser = () => {
      const updated = JSON.parse(localStorage.getItem("user"));
      setUser(updated || {});
    };

    window.addEventListener("userUpdated", updateUser);
    return () => window.removeEventListener("userUpdated", updateUser);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/reminders");

      const triggered = res.data.filter(
        (r) => r.status === "Triggered"
      );

      setNotifications(triggered);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8000);
    const onRemindersUpdated = () => fetchNotifications();
    window.addEventListener("jat:remindersUpdated", onRemindersUpdated);
    return () => {
      clearInterval(interval);
      window.removeEventListener("jat:remindersUpdated", onRemindersUpdated);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markRead = async (id) => {
    try {
      await API.put(`/reminders/read/${id}`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );

      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  const fullName = user?.fullName || "User";
  const firstLetter = fullName.charAt(0).toUpperCase();

  return (
    <div
      ref={wrapperRef}
      className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 px-3 sm:px-4 md:px-6 py-3 backdrop-blur flex justify-between items-center gap-2"
    >
      <div className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 truncate">
        Job Application Tracker
      </div>

      <div className="flex items-center gap-2 sm:gap-4">

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpen(!open);
              setUserOpen(false);
            }}
            className="relative cursor-pointer p-2 rounded-full hover:bg-slate-100 transition"
          >
            <Bell className="w-5 h-5 text-slate-700" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-xl border border-slate-200 z-50">
              <div className="p-3 font-semibold border-b border-slate-200">
                Notifications
              </div>

              {notifications.length === 0 ? (
                <p className="p-3 text-sm text-gray-500">
                  No notifications
                </p>
              ) : (
                <div
                  className="mx-h-54 overflow-y-auto overscroll-contain"
                  aria-label="Notification list"
                >
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => markRead(n._id)}
                      className="p-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 cursor-pointer shrink-0"
                    >
                      <p className="text-sm">
                        {n.reminderType} reminder
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setUserOpen(!userOpen);
              setOpen(false);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100 transition"
          >
            <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center rounded-full">
              {firstLetter}
            </div>

            <span className="hidden sm:inline text-sm font-medium text-slate-700">{fullName}</span>
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl border border-slate-200 z-50">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="block w-full cursor-pointer text-left px-4 py-2 hover:bg-slate-50"
              >
                Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="block w-full cursor-pointer text-left px-4 py-2 hover:bg-slate-50 text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;