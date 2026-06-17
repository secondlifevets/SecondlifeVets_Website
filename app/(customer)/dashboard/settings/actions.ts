"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const full_name = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  
  // Emergency Contact
  const emergency_name = formData.get("emergency_name") as string | null;
  const emergency_relation = formData.get("emergency_relation") as string | null;
  const emergency_phone = formData.get("emergency_phone") as string | null;

  const pin_lat_val = formData.get("pin_lat") as string | null;
  const pin_lng_val = formData.get("pin_lng") as string | null;

  const pin_lat = pin_lat_val ? parseFloat(pin_lat_val) : null;
  const pin_lng = pin_lng_val ? parseFloat(pin_lng_val) : null;

  const { error } = await supabase.from("profiles").update({
    full_name,
    phone,
    whatsapp,
    address,
    city,
    emergency_name,
    emergency_relation,
    emergency_phone,
    pin_lat: (pin_lat !== null && !isNaN(pin_lat)) ? pin_lat : null,
    pin_lng: (pin_lng !== null && !isNaN(pin_lng)) ? pin_lng : null,
  }).eq("id", user.id);

  if (error) return { error: error.message };
  
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/book-vet-appointment-lahore");
  
  return { success: true };
}
