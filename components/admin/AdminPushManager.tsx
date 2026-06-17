"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, BellOff, Loader2 } from "lucide-react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

// Utility to convert the base64 public key to a Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function AdminPushManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      setPermissionState(Notification.permission);
      
      // Register service worker and check existing subscription
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        registration.pushManager.getSubscription().then((sub) => {
          if (sub) {
            setSubscription(sub);
          }
        });
      }).catch(err => {
        console.error("Service Worker registration failed:", err);
      });
    }
  }, []);

  const subscribeUser = async () => {
    if (!isSupported) {
      toast.error("Push notifications are not supported in this browser.");
      return;
    }

    if (!VAPID_PUBLIC_KEY) {
      toast.error("VAPID public key is missing in environment variables.");
      return;
    }

    setIsSubscribing(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Request permission if not granted
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        setPermissionState(permission);
        if (permission !== "granted") {
          toast.error("Notification permission denied.");
          setIsSubscribing(false);
          return;
        }
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      setSubscription(sub);

      // Send to backend
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sub),
      });

      if (!res.ok) {
        throw new Error("Failed to save subscription to server");
      }

      toast.success("Successfully subscribed to push notifications!");
    } catch (error) {
      console.error("Failed to subscribe the user: ", error);
      toast.error("Couldn't subscribe to push notifications.");
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!isSupported) return null;

  // We can show a small button in the admin interface to manage subscriptions
  return (
    <button
      onClick={subscribeUser}
      disabled={isSubscribing || subscription !== null}
      className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
        subscription 
          ? "bg-success/10 text-success border border-success/20 cursor-default" 
          : "bg-dark text-white hover:bg-gray-800"
      }`}
    >
      {isSubscribing ? (
        <Loader2 className="animate-spin" size={16} />
      ) : subscription ? (
        <Bell size={16} />
      ) : (
        <BellOff size={16} />
      )}
      {subscription ? "Push Notifications Active" : "Enable Push Notifications"}
    </button>
  );
}
