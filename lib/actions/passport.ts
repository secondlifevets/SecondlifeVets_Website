"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { PetPassportData } from "@/lib/types";

export async function getPetPassportData(petId: string): Promise<PetPassportData | null> {
  const supabase = await createAdminClient();

  // Fetch pet
  const { data: pet, error: petError } = await supabase
    .from("pets")
    .select("*")
    .eq("id", petId)
    .single();

  if (petError || !pet) {
    console.error("Error fetching pet:", petError);
    return null;
  }

  // Fetch owner
  const { data: ownerProfile, error: ownerError } = await supabase
    .from("profiles")
    .select("full_name, phone, whatsapp_number, address, city, emergency_name, emergency_relation, emergency_phone")
    .eq("id", pet.customer_id)
    .single();

  const owner: any = ownerProfile || { full_name: "Unknown", address: "", city: "", phone: "", whatsapp: "", email: "" };
  if (ownerProfile) owner.whatsapp = ownerProfile.whatsapp_number;
  
  // Combine Address + City
  let fullAddress = owner.address || "";
  if (owner.city) {
    fullAddress = fullAddress ? `${fullAddress}, ${owner.city}` : owner.city;
  }
  owner.address = fullAddress;

  // Fetch email using Admin Auth Client
  try {
    const adminSupabase = await createAdminClient();
    const { data: authData } = await adminSupabase.auth.admin.getUserById(pet.customer_id);
    if (authData?.user?.email) {
      owner.email = authData.user.email;
    }
  } catch (err) {
    console.error("Error fetching owner email:", err);
  }

  // Fetch medical records
  const [vaxRes, dewormRes, tickRes, healthRes, surgRes] = await Promise.all([
    supabase.from("vaccinations").select("*").eq("pet_id", petId).order("vaccination_date", { ascending: false }).order("created_at", { ascending: false }),
    supabase.from("deworming_records").select("*").eq("pet_id", petId).order("date", { ascending: false }).order("created_at", { ascending: false }),
    supabase.from("tick_flea_treatments").select("*").eq("pet_id", petId).order("date", { ascending: false }).order("created_at", { ascending: false }),
    supabase.from("health_checkups").select("*").eq("pet_id", petId).order("date", { ascending: false }).order("created_at", { ascending: false }),
    supabase.from("surgeries").select("*").eq("pet_id", petId).order("date", { ascending: false }).order("created_at", { ascending: false })
  ]);

  return {
    pet,
    owner: owner,
    vaccinations: vaxRes.data || [],
    deworming_records: dewormRes.data || [],
    tick_flea_treatments: tickRes.data || [],
    health_checkups: healthRes.data || [],
    surgeries: surgRes.data || []
  };
}

// Admin Actions for adding records
export async function addVaccination(data: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("vaccinations").insert([data]);
  return { error };
}

export async function addDeworming(data: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("deworming_records").insert([data]);
  return { error };
}

export async function addTickFleaTreatment(data: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("tick_flea_treatments").insert([data]);
  return { error };
}

export async function addHealthCheckup(data: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("health_checkups").insert([data]);
  return { error };
}

export async function addSurgery(data: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("surgeries").insert([data]);
  return { error };
}

export async function updatePetPassportInfo(petId: string, data: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("pets").update(data).eq("id", petId);
  return { error };
}

export async function findPetIdByShortCode(shortCode: string): Promise<string | null> {
  if (!shortCode || shortCode.length !== 8) {
    return null;
  }
  
  const hexRegex = /^[0-9a-fA-F]{8}$/;
  if (!hexRegex.test(shortCode)) {
    return null;
  }

  const supabase = await createAdminClient();
  
  // Use UUID range to find matches to avoid casting issues
  const minUuid = `${shortCode.toLowerCase()}-0000-0000-0000-000000000000`;
  const maxUuid = `${shortCode.toLowerCase()}-ffff-ffff-ffff-ffffffffffff`;

  const { data, error } = await supabase
    .from("pets")
    .select("id")
    .gte("id", minUuid)
    .lte("id", maxUuid);

  if (error) {
    console.error("Supabase UUID search error:", error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  if (data.length > 1) {
    return null;
  }

  return data[0].id;
}
