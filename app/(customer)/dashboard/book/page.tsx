import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BookClient from "./BookClient";

export default async function DashboardBookPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => { } } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: pets } = await supabase.from("pets").select("*").eq("customer_id", user.id);

  // Elite Pre-check: Ensure profile is complete
  if (!profile?.phone || !profile?.address || !profile?.city || !profile?.full_name) {
    redirect("/dashboard/settings?setup=booking");
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-dark">Book an Appointment</h1>
        <p className="text-gray-500 font-sans mt-1">Fast and secure booking using your saved details.</p>
      </div>

      <BookClient profile={profile} pets={pets || []} email={user.email || ""} />
    </div>
  );
}
