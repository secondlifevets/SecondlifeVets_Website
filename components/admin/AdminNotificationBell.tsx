"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminPushManager from "./AdminPushManager";

type Notification = {
  id: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export default function AdminNotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new notifications while tab is open
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (id: string, link: string | null) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (e) {}

    setIsOpen(false);
    if (link) {
      router.push(link);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
    } catch (e) {}
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-emergency text-white text-[10px] font-bold rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 lg:left-0 lg:right-auto mt-2 w-80 max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <h3 className="font-bold text-dark font-display">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
              >
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                No notifications yet.
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => markAsRead(notif.id, notif.link)}
                    className={`p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      !notif.is_read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.is_read ? "bg-primary" : "bg-transparent"}`} />
                      <div>
                        <h4 className={`text-sm font-bold ${!notif.is_read ? "text-dark" : "text-gray-600"}`}>
                          {notif.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-2 block font-medium">
                          {new Date(notif.created_at).toLocaleString('en-PK', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-col gap-2 text-center">
             <AdminPushManager />
             <span className="text-xs text-gray-400">Updates automatically</span>
          </div>
        </div>
      )}
    </div>
  );
}
