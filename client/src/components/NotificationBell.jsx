import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const TYPE_CONFIG = {
  booking_requested: {
    icon: "🔔",
    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30",
    dot:  "bg-blue-500",
  },
  booking_confirmed: {
    icon: "✅",
    color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30",
    dot:  "bg-emerald-500",
  },
  booking_cancelled: {
    icon: "❌",
    color: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30",
    dot:  "bg-red-500",
  },
  booking_completed: {
    icon: "🏁",
    color: "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800",
    dot:  "bg-zinc-400",
  },
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const NotificationBell = () => {
  const { token, axios } = useAppContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const panelRef = useRef(null);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setNotifications(data.notifications);
        setUnread(data.unreadCount);
      }
    } catch (_) {}
  };

  // Poll every 5 seconds for near-instant notification updates
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [token]);

  // Also re-fetch instantly when user switches back to this tab
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchNotifications();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [token]);

  // Close panel on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = async () => {
    setOpen(prev => !prev);
    if (!open && unread > 0) {
      // Mark all as read when panel opens
      try {
        await axios.post("/api/notifications/mark-read");
        setUnread(0);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (_) {}
    }
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    try {
      await axios.delete("/api/notifications/clear");
      setNotifications([]);
      setUnread(0);
    } catch (_) {}
  };

  if (!token) return null;

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="relative p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition shadow-inner"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <p className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">Notifications</p>
            {notifications.length > 0 && (
              <button
                onClick={handleClear}
                className="text-[10px] font-bold text-zinc-400 hover:text-red-500 dark:hover:text-red-400 uppercase tracking-wider transition"
              >
                Clear all
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-800">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-3xl mb-2">🔕</p>
                <p className="text-sm font-medium text-zinc-400 dark:text-zinc-600">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.booking_requested;
                return (
                  <div
                    key={notif._id}
                    className={`flex items-start gap-3 px-4 py-3.5 transition-colors ${notif.isRead ? "opacity-60" : "bg-zinc-50/50 dark:bg-zinc-800/20"} hover:bg-zinc-50 dark:hover:bg-zinc-800/30`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-zinc-900 dark:text-white leading-tight">{notif.title}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-zinc-300 dark:text-zinc-600 mt-1.5 font-medium">{timeAgo(notif.createdAt)}</p>
                    </div>
                    {!notif.isRead && (
                      <div className={`w-2 h-2 rounded-full shrink-0 mt-2 ${cfg.dot}`} />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700">
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
