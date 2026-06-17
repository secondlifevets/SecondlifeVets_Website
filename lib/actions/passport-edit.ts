"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function savePassportData(petId: string, data: any) {
  try {
    const supabase = await createAdminClient();

    // 1. Update Pet Profile Details
    if (data.pet) {
      const petUpdate: any = {
        name: data.pet.name,
        species: data.pet.species,
        breed: data.pet.breed,
        color: data.pet.color,
        gender: data.pet.gender,
        date_of_birth: data.pet.date_of_birth === "" ? null : data.pet.date_of_birth,
        microchip_no: data.pet.microchip_no,
      };

      const { error: petError } = await supabase
        .from("pets")
        .update(petUpdate)
        .eq("id", petId);

      if (petError) throw new Error(`Failed to update pet: ${petError.message}`);
    }

    // Helper to replace table data
    const replaceTableData = async (tableName: string, records: any[]) => {
      // Delete existing
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq("pet_id", petId);

      if (deleteError) throw new Error(`Failed to clear ${tableName}: ${deleteError.message}`);

      if (records && records.length > 0) {
        // Prepare records for insertion with descending created_at to preserve order
        const now = Date.now();
        const recordsToInsert = records.map((record, index) => {
          // Remove 'id' if it exists to let DB generate a fresh one
          const { id, created_at, ...rest } = record;
          
          // Sanitize empty strings to null for date fields to prevent DB errors
          if (rest.valid_until === "") rest.valid_until = null;
          if (rest.vaccination_date === "") rest.vaccination_date = null;
          if (rest.date === "") rest.date = null;

          return {
            ...rest,
            pet_id: petId,
            // Top items in the array get slightly newer timestamps so they sort first when dates match
            created_at: new Date(now - index * 1000).toISOString()
          };
        });

        const { error: insertError } = await supabase
          .from(tableName)
          .insert(recordsToInsert);

        if (insertError) throw new Error(`Failed to insert ${tableName}: ${insertError.message}`);
      }
    };

    // 2. Replace all medical records
    if (data.vaccinations) await replaceTableData("vaccinations", data.vaccinations);
    if (data.deworming_records) await replaceTableData("deworming_records", data.deworming_records);
    if (data.tick_flea_treatments) await replaceTableData("tick_flea_treatments", data.tick_flea_treatments);
    if (data.health_checkups) await replaceTableData("health_checkups", data.health_checkups);
    if (data.surgeries) await replaceTableData("surgeries", data.surgeries);

    revalidatePath(`/admin/passport/${petId}`);
    revalidatePath(`/passport/${petId}`);
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
