"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, CalendarHeart, RefreshCw, BellRing, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type CustomerNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function CustomerNotificationBell() {
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // Push Notification States
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [hasPushSubscription, setHasPushSubscription] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/customer/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    let channel: ReturnType<typeof supabase.channel>;

    // Set up Real-time Subscription (The Elite Way)
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        // Use a unique channel name per mount to prevent React 18 Strict Mode "already subscribed" errors
        .channel(`customer-notifs-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'customer_notifications',
            filter: `customer_id=eq.${user.id}`
          },
          (payload) => {
            // Instantly push the new notification to the top of the list!
            const newNotif = payload.new as CustomerNotification;
            setNotifications((prev) => [newNotif, ...prev]);
          }
        )
        .subscribe();
    };

    setupRealtime();

    // Check Push Support
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsPushSupported(true);
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        registration.pushManager.getSubscription().then((sub) => {
          if (sub) setHasPushSubscription(true);
        });
      }).catch(err => console.error("SW reg failed:", err));
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const subscribeToPush = async () => {
    if (!VAPID_PUBLIC_KEY || !isPushSupported) return;
    setIsSubscribing(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setIsSubscribing(false);
          return;
        }
      }
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      setHasPushSubscription(true);
    } catch (error) {
      console.error("Failed to subscribe:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

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
      await fetch("/api/customer/notifications", {
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
      await fetch("/api/customer/notifications", {
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
        className="relative p-2 text-gray-500 hover:text-primary hover:bg-primary-light/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Notifications"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm animate-pulse-subtle">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 md:right-auto md:-left-4 mt-2 w-80 max-w-[calc(100vw-32px)] max-h-[80vh] bg-white rounded-2xl shadow-2xl shadow-primary/10 border border-primary-light/50 overflow-hidden z-50 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-primary-light/10">
            <h3 className="font-bold text-dark font-display flex items-center gap-2">
              <Bell size={16} className="text-primary" /> Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
              >
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-gray-400">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <Bell size={20} className="text-gray-300" />
                </div>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => markAsRead(notif.id, notif.link)}
                    className={`p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors w-full ${
                      !notif.is_read ? "bg-primary-light/10" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!notif.is_read ? "bg-primary shadow-sm shadow-primary/30" : "bg-transparent"}`} />
                      <div className="flex-1">
                        <h4 className={`text-sm font-bold ${!notif.is_read ? "text-primary-dark" : "text-gray-700"}`}>
                          {notif.title}
                        </h4>
                        <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${!notif.is_read ? "text-gray-700 font-medium" : "text-gray-500"}`}>
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
          
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-1.5">
             <div className="flex items-center gap-1.5">
               <RefreshCw size={12} className="text-gray-400" />
               <span className="text-[11px] font-medium text-gray-400">Live updates connected</span>
             </div>
             
             {isPushSupported && !hasPushSubscription && (
               <button 
                 onClick={subscribeToPush}
                 disabled={isSubscribing}
                 className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-dark transition-colors"
               >
                 {isSubscribing ? <Loader2 size={12} className="animate-spin" /> : <BellRing size={12} />}
                 Enable Push Alerts
               </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
