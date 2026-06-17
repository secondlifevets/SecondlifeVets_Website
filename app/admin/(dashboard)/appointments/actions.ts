"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function getPetDetailsAction(appointmentPetId: string | null) {
  if (!appointmentPetId) return { pet_id: null, dob: null, image_url: null, last_vaccination_date: null };

  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('pets')
    .select('id, name, type, date_of_birth, image_url, last_vaccination_date')
    .eq('id', appointmentPetId)
    .single();

  if (error) {
    console.error('Error fetching pet details in admin panel by ID:', error);
  }

  return {
    pet_id: data?.id || null,
    name: data?.name || null,
    type: data?.type || null,
    dob: data?.date_of_birth || null,
    image_url: data?.image_url || null,
    last_vaccination_date: data?.last_vaccination_date || null
  };
}

export async function markVaccinatedToday(petId: string, shotType?: string, notes?: string) {
  const supabase = await createAdminClient();
  const today = new Date().toISOString().split('T')[0];
  
  const { error } = await supabase
    .from('pets')
    .update({ last_vaccination_date: today })
    .eq('id', petId);

  if (error) {
    console.error('Error marking vaccinated:', error);
    return { success: false, error: error.message };
  }

  // Also record in vaccination history
  const { error: histError } = await supabase
    .from('vaccination_history')
    .insert({
      pet_id: petId,
      vaccination_date: today,
      shot_type: shotType || null,
      notes: notes || "Marked as vaccinated by admin."
    });

  if (histError) {
    console.error('Error inserting vaccination history:', histError);
    return { success: false, error: "Vaccination saved to pet, but history log failed: " + histError.message };
  }

  return { success: true, date: today };
}
