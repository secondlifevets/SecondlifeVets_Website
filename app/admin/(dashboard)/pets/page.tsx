import { createAdminClient } from "@/lib/supabase/server";
import PetsClient from "./PetsClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function PetsPage() {
  const supabase = await createAdminClient();
  
  // Fetch all pets and their owners using Service Role to bypass RLS
  const { data: pets, error } = await supabase
    .from('pets')
    .select(`
      *,
      profiles (
        id,
        full_name,
        phone,
        whatsapp
      )
    `)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Supabase Error fetching pets:", error);
  }

  return <PetsClient initialPets={pets || []} />;
}
