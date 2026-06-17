"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

// Helper function to extract and delete a public image URL from the pet-images bucket
async function deleteImageFromStorage(imageUrl: string | null) {
  if (!imageUrl) return;
  try {
    const adminSupabase = await createAdminClient();
    const filePath = imageUrl.split('/public/pet-images/')[1];
    if (filePath) {
      await adminSupabase.storage.from('pet-images').remove([filePath]);
    }
  } catch (err) {
    console.error("Failed to delete orphaned image:", err);
  }
}

export async function addPet(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const breed = formData.get("breed") as string;
  const date_of_birth = formData.get("date_of_birth") as string;
  const image_file = formData.get("image_file") as File | null;
  const color = formData.get("color") as string;
  const gender = formData.get("gender") as string;
  const microchip_no = formData.get("microchip_no") as string;

  let image_url = null;

  // Upload image to storage
  if (image_file && image_file.size > 0) {
    const fileName = `${user.id}/${Date.now()}.jpg`;
    const { data, error } = await supabase.storage.from('pet-images').upload(fileName, image_file, {
      contentType: 'image/jpeg'
    });
    
    if (error) {
      return { error: "Failed to upload image." };
    }
    
    if (data) {
      const { data: publicUrlData } = supabase.storage.from('pet-images').getPublicUrl(fileName);
      image_url = publicUrlData.publicUrl;
    }
  }

  const { data: petData, error } = await supabase.from("pets").insert({
    customer_id: user.id,
    name,
    type,
    breed,
    date_of_birth: date_of_birth || null,
    image_url: image_url,
    color,
    gender,
    microchip_no
  }).select().single();

  if (error) {
    // Rollback uploaded image if database insert fails
    if (image_url) {
      await deleteImageFromStorage(image_url);
    }
    return { error: error.message };
  }
  
  const last_vaccination_date = formData.get("last_vaccination_date") as string;
  const last_shot_type = formData.get("last_shot_type") as string;
  
  if (last_vaccination_date && petData) {
    await supabase.from("vaccination_history").insert({
      pet_id: petData.id,
      vaccination_date: last_vaccination_date,
      shot_type: last_shot_type || null,
      notes: "Added during pet creation"
    });
  }

  revalidatePath("/dashboard/pets");
  return { success: true };
}

export async function deletePet(id: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Fetch image URL before deleting
  const { data: pet } = await supabase.from("pets").select("image_url").eq("id", id).eq("customer_id", user.id).single();

  const { error } = await supabase.from("pets").delete().eq("id", id).eq("customer_id", user.id);
  
  if (error) return { error: error.message };

  // Clean up image from storage after successful delete
  if (pet?.image_url) {
    await deleteImageFromStorage(pet.image_url);
  }

  revalidatePath("/dashboard/pets");
  return { success: true };
}

export async function editPet(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const breed = formData.get("breed") as string;
  const date_of_birth = formData.get("date_of_birth") as string;
  const image_file = formData.get("image_file") as File | null;
  const color = formData.get("color") as string;
  const gender = formData.get("gender") as string;
  const microchip_no = formData.get("microchip_no") as string;

  // Fetch old image URL
  const { data: pet } = await supabase.from("pets").select("image_url").eq("id", id).eq("customer_id", user.id).single();
  const old_image_url = pet?.image_url;

  let image_url = old_image_url;

  // Upload new image to storage if provided
  if (image_file && image_file.size > 0) {
    const fileName = `${user.id}/${Date.now()}.jpg`;
    const { data, error } = await supabase.storage.from('pet-images').upload(fileName, image_file, {
      contentType: 'image/jpeg'
    });
    
    if (error) {
      return { error: "Failed to upload new image." };
    }
    
    if (data) {
      const { data: publicUrlData } = supabase.storage.from('pet-images').getPublicUrl(fileName);
      image_url = publicUrlData.publicUrl;
    }
  }

  const { error } = await supabase.from("pets").update({
    name,
    type,
    breed,
    date_of_birth: date_of_birth || null,
    image_url: image_url,
    color,
    gender,
    microchip_no
  }).eq("id", id).eq("customer_id", user.id);

  if (error) {
    // Rollback the newly uploaded image if database update fails
    if (image_file && image_url && image_url !== old_image_url) {
      await deleteImageFromStorage(image_url);
    }
    return { error: error.message };
  }
  
  if (image_file && image_url && old_image_url && image_url !== old_image_url) {
    await deleteImageFromStorage(old_image_url);
  }

  const last_vaccination_date = formData.get("last_vaccination_date") as string;
  const last_shot_type = formData.get("last_shot_type") as string;
  
  if (last_vaccination_date) {
    // Check if this exact date already exists to avoid duplicates
    const { data: existing } = await supabase.from("vaccination_history")
      .select("id")
      .eq("pet_id", id)
      .eq("vaccination_date", last_vaccination_date)
      .single();
      
    if (!existing) {
      await supabase.from("vaccination_history").insert({
        pet_id: id,
        vaccination_date: last_vaccination_date,
        shot_type: last_shot_type || null,
        notes: "Added during pet edit"
      });
    }
  }

  revalidatePath("/dashboard/pets");
  return { success: true };
}
export async function getVaccinationHistory(petId: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('vaccination_history')
    .select('*')
    .eq('pet_id', petId)
    .order('vaccination_date', { ascending: false });

  if (error) {
    console.error('Error fetching vaccination history:', error);
    return [];
  }
  return data;
}
