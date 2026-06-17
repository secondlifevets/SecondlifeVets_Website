import { createAdminClient } from "@/lib/supabase/server";
import AppointmentsClient from "@/app/admin/(dashboard)/appointments/AppointmentsClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: { search?: string; emergency?: string; status?: string; date?: string; page?: string; customer_id?: string; pet_id?: string }
}) {
  const supabase = await createAdminClient();
  
  // Default values
  const pageSize = 50;
  const page = searchParams.page ? parseInt(searchParams.page) : 0;
  const status = searchParams.status || "All";
  const emergency = searchParams.emergency === 'true';
  const date = searchParams.date || "";
  const search = searchParams.search || "";
  const customer_id = searchParams.customer_id || null;
  const pet_id = searchParams.pet_id || null;
  
  let query = supabase
    .from('appointments')
    .select('*', { count: 'exact' })
    .order('preferred_date', { ascending: false })
    .order('preferred_time', { ascending: false });

  if (status !== "All") query = query.eq('status', status.toLowerCase());
  if (emergency) query = query.eq('is_emergency', true);
  if (date) query = query.eq('preferred_date', date);
  if (customer_id) query = query.eq('customer_id', customer_id);
  if (pet_id) query = query.eq('pet_id', pet_id);
  if (search) query = query.or(`client_name.ilike.%${search}%,client_phone.ilike.%${search}%,booking_ref.ilike.%${search}%`);

  const from = page * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  
  const initialData = error ? { data: [], count: 0 } : { data, count: count || 0 };

  return <AppointmentsClient initialData={initialData} initialSearchParams={searchParams} />;
}

