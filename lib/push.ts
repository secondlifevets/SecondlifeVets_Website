import webPush from 'web-push';
import { createAdminClient } from '@/lib/supabase/server';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

let isConfigured = false;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    'mailto:contact@vetsondoor.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
  isConfigured = true;
}

export async function sendPushToAdmins(payload: { title: string; body: string; url?: string }) {
  if (!isConfigured) {
    console.warn("Push notifications are not configured.");
    return;
  }

  try {
    const supabase = await createAdminClient();
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('subscription');

    if (!subscriptions || subscriptions.length === 0) return;

    const payloadString = JSON.stringify(payload);

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webPush.sendNotification(sub.subscription, payloadString);
        } catch (pushErr: any) {
          if (pushErr.statusCode === 404 || pushErr.statusCode === 410) {
            console.log('Subscription expired/invalid.');
            // Optionally: delete expired subscription from DB here
          } else {
            console.error('Error sending push notification:', pushErr);
          }
        }
      })
    );
  } catch (error) {
    console.error("Failed to fetch subscriptions or send push:", error);
  }
}

export async function sendPushToCustomer(customerId: string, payload: { title: string; body: string; url?: string }) {
  if (!isConfigured) {
    console.warn("Push notifications are not configured.");
    return;
  }

  try {
    const supabase = await createAdminClient();
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', customerId);

    if (!subscriptions || subscriptions.length === 0) return;

    const payloadString = JSON.stringify(payload);

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webPush.sendNotification(sub.subscription, payloadString);
        } catch (pushErr: any) {
          if (pushErr.statusCode === 404 || pushErr.statusCode === 410) {
            console.log('Subscription expired/invalid for customer.');
          } else {
            console.error('Error sending push notification to customer:', pushErr);
          }
        }
      })
    );
  } catch (error) {
    console.error("Failed to fetch customer subscriptions or send push:", error);
  }
}
