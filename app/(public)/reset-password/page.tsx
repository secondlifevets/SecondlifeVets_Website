import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ResetPasswordClient from "./ResetPasswordClient";

export const metadata = {
  title: "Reset Password | Vets On Door",
};

export default async function ResetPasswordPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // If there's no active session, they shouldn't be on the reset password page.
  // The magic link callback sets the session before redirecting here.
  if (!session) {
    redirect("/login?error=unauthorized-reset");
  }

  return <ResetPasswordClient />;
}
