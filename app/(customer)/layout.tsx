import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import CustomerSidebar from "./CustomerSidebar";
import FloatingActionButton from "@/components/ui/FloatingActionButton";

export const metadata = {
  title: "Customer Dashboard | Vets On Door",
  description: "Manage your pet profiles and appointments",
};

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {}, // Server layout only reads
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="h-screen bg-gray-50 flex flex-col lg:flex-row font-sans text-dark overflow-hidden relative">
      <CustomerSidebar user={user} profile={profile} />
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
      <FloatingActionButton />
    </div>
  );
}
