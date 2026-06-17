import { createAdminClient } from "@/lib/supabase/server";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from "date-fns";
import CalendarClient from "@/app/admin/(dashboard)/calendar/CalendarClient";

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const supabase = await createAdminClient();
  const currentDate = new Date();
  
  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));

  const monthStart = format(start, 'yyyy-MM-dd');
  const monthEnd = format(end, 'yyyy-MM-dd');

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .gte('preferred_date', monthStart)
    .lte('preferred_date', monthEnd);

  const initialData = error ? [] : (data || []);

  return <CalendarClient initialData={initialData} />;
}

