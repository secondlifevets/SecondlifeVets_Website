import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import SettingsClient from "./SettingsClient";
import DeleteAccount from "./DeleteAccount";

export default async function SettingsPage({ searchParams }: { searchParams: { setup?: string } }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-dark">Profile Settings</h1>
        <p className="text-gray-500 font-sans mt-1">Manage your personal information and contact details.</p>
      </div>

      {searchParams.setup === 'booking' && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl animate-fade-in">
          <p className="text-amber-800 font-medium">
            <strong>Almost there!</strong> Please complete your profile details (Phone, Address, City) before booking an appointment.
          </p>
        </div>
      )}

      <SettingsClient profile={profile} email={user?.email || ""} />
      
      <DeleteAccount />
    </div>
  );
}
