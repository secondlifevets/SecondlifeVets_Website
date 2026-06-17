import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createAdminClient();
    
    const todayStr = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    
    // Calculate first day of current week (assuming Monday as first day)
    const curr = new Date(); 
    const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
    const firstDayOfWeek = new Date(curr.setDate(first)).toISOString().split('T')[0];

    const [todayAppts, pendingAppts, weekAppts, monthAppts, emergencyPending] = await Promise.all([
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('preferred_date', todayStr),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('preferred_date', firstDayOfWeek),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('preferred_date', firstDayOfMonth),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('is_emergency', true).eq('status', 'pending')
    ]);

    return NextResponse.json({ 
      stats: {
        today_appointments: todayAppts.count || 0,
        pending_count: pendingAppts.count || 0,
        this_week: weekAppts.count || 0,
        this_month: monthAppts.count || 0,
        emergency_pending: emergencyPending.count || 0
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
