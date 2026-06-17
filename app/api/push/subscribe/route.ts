import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const subscription = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const supabaseClient = await createClient();
    
    // Check if a user is logged in
    const { data: { user } } = await supabaseClient.auth.getUser();

    // Fetch all to avoid complex JSONB querying issues in PostgREST
    const { data: allSubs } = await supabase
      .from('push_subscriptions')
      .select('id, subscription, user_id');

    const existingSub = allSubs?.find(
      (sub) => sub.subscription?.endpoint === subscription.endpoint
    );

    if (existingSub) {
      // If it exists but doesn't have a user_id, and we now have a user, update it!
      if (!existingSub.user_id && user) {
        await supabase
          .from('push_subscriptions')
          .update({ user_id: user.id })
          .eq('id', existingSub.id);
      }
      return NextResponse.json({ success: true, message: 'Subscription already exists' }, { status: 200 });
    }

    // Insert the new subscription
    const { error: insertError } = await supabase
      .from('push_subscriptions')
      .insert({
        subscription: subscription,
        user_id: user ? user.id : null
      });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to subscribe to push notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
