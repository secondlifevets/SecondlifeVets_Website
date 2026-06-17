import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { parseWorkingHours } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // 0. Fetch business settings to get working hours
    const { data: settingsData } = await supabase
      .from('business_settings')
      .select('working_hours')
      .limit(1)
      .single();

    const workingHoursString = settingsData?.working_hours || "Monday – Saturday: 09:00 – 20:00";
    const { start, end } = parseWorkingHours(workingHoursString);
    
    // Generate TIME_SLOTS dynamically
    const TIME_SLOTS: string[] = [];
    let currentHour = parseInt(start.split(':')[0], 10);
    const endHour = parseInt(end.split(':')[0], 10);
    
    while (currentHour <= endHour) {
      TIME_SLOTS.push(`${currentHour.toString().padStart(2, '0')}:00:00`);
      currentHour++;
    }

    // 1. Get blocked slots from admin blocks
    const { data: blocks, error: blocksError } = await supabase
      .from('time_slot_blocks')
      .select('blocked_time')
      .eq('blocked_date', date);

    if (blocksError) throw blocksError;

    // 2. Get booked appointments
    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .select('preferred_time')
      .eq('preferred_date', date)
      .in('status', ['pending', 'confirmed', 'in-progress', 'completed']);

    if (apptError) throw apptError;

    const blockedTimes = new Set([
      ...(blocks || []).map(b => b.blocked_time),
      ...(appointments || []).map(a => a.preferred_time)
    ]);

    const slots = TIME_SLOTS.map(time => ({
      time,
      available: !blockedTimes.has(time)
    }));

    return NextResponse.json({ slots }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
