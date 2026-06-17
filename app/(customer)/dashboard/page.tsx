import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CalendarX, Cake, ShieldAlert, Clock } from "lucide-react";
import Link from "next/link";
import { parseISO, isThisWeek, setYear } from "date-fns";
import AppointmentCardClient from "@/components/customer/AppointmentCardClient";
import VaccinationAlertsClient from "@/components/customer/VaccinationAlertsClient";
import ProfileOnboardingClient from "@/components/customer/ProfileOnboardingClient";
import PWAInstallPromptClient from "@/components/customer/PWAInstallPromptClient";
import GoogleReviewBanner from "@/components/customer/GoogleReviewBanner";
import { getVaccinationStatus } from "@/lib/vaccinationSchedule";
import PetsClient from "./pets/PetsClient";

function isBirthdayThisWeek(dob: string) {
  if (!dob) return false;
  const birthDate = parseISO(dob);
  const thisYearBirthday = setYear(birthDate, new Date().getFullYear());
  return isThisWeek(thisYearBirthday);
}

export default async function DashboardOverview() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("customer_id", user?.id)
    .order("preferred_date", { ascending: false });

  const upcoming = appointments?.filter(a => new Date(`${a.preferred_date}T${a.preferred_time || '00:00:00'}`) >= new Date() && a.status !== 'cancelled' && a.status !== 'completed') || [];
  const past = appointments?.filter(a => new Date(`${a.preferred_date}T${a.preferred_time || '00:00:00'}`) < new Date() || a.status === 'cancelled' || a.status === 'completed') || [];

  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("customer_id", user?.id);

  // Fetch vaccination history for reminders
  const petIds = (pets || []).map((p: any) => p.id);
  let historyByPetId: Record<string, any[]> = {};
  if (petIds.length > 0) {
    const [{ data: allHistory }, { data: allVaccinations }] = await Promise.all([
      supabase.from("vaccination_history").select("pet_id, vaccination_date, shot_type").in("pet_id", petIds),
      supabase.from("vaccinations").select("pet_id, vaccination_date, valid_until, vaccine_type").in("pet_id", petIds)
    ]);
    if (allHistory) {
      for (const record of allHistory) {
        if (!historyByPetId[record.pet_id]) historyByPetId[record.pet_id] = [];
        historyByPetId[record.pet_id].push({ vaccination_date: record.vaccination_date, shot_type: record.shot_type });
      }
    }
    if (allVaccinations) {
      for (const record of allVaccinations) {
        if (!historyByPetId[record.pet_id]) historyByPetId[record.pet_id] = [];
        historyByPetId[record.pet_id].push({ 
          vaccination_date: record.vaccination_date, 
          valid_until: record.valid_until, 
          vaccine_type: record.vaccine_type 
        });
      }
    }
  }

  const reminders = (pets || []).flatMap((pet: any) => {
    const alerts: any[] = [];
    if (isBirthdayThisWeek(pet.date_of_birth)) alerts.push({ type: 'birthday', pet });
    const history = historyByPetId[pet.id] || [];
    const vaxStatus = getVaccinationStatus(pet.type, pet.date_of_birth, history);
    if (vaxStatus.state === 'due') alerts.push({ type: 'vaccine_due', pet, vaxStatus });
    if (vaxStatus.state === 'upcoming') alerts.push({ type: 'vaccine_upcoming', pet, vaxStatus });
    return alerts;
  });

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <ProfileOnboardingClient profile={profile} />
      <PWAInstallPromptClient hasPets={(pets?.length || 0) > 0} />
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark">Appointments Overview</h1>
          <p className="text-gray-500 font-sans mt-1">Manage your upcoming vet visits and view history.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-start sm:justify-end">
          {(pets?.length ?? 0) > 0 && <PetsClient />}
          <Link 
            href="/book-vet-appointment-lahore" 
            className="bg-white border-2 border-primary text-primary hover:bg-primary/5 font-bold py-2.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
          >
            Manual Book
          </Link>
        </div>
      </div>

      {(pets?.length ?? 0) === 0 ? (
        <PetsClient variant="emptyStateCTA" />
      ) : (
        <>
          {reminders.length > 0 && (
            <VaccinationAlertsClient 
              reminders={reminders} 
              profile={profile} 
              email={user?.email || ""} 
            />
          )}

          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-dark border-b border-gray-100 pb-2">Upcoming Visits</h2>
            
            {upcoming.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow group animate-fade-in-up">
                <div className="w-16 h-16 bg-primary-light/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary-light/50 transition-all duration-500 ease-out shadow-inner">
                  <CalendarX size={28} className="text-primary group-hover:animate-bounce-subtle" />
                </div>
                <h3 className="font-bold text-dark mb-1 text-lg">No upcoming appointments</h3>
                <p className="text-sm text-gray-500 max-w-sm leading-relaxed">You don't have any vet visits scheduled. Use the Manual Book button to schedule a visit.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {upcoming.map((appt: any) => (
                  <AppointmentCardClient key={appt.id} appt={appt} />
                ))}
              </div>
            )}
          </div>

          {past.length > 0 && (
            <div className="space-y-6 pt-6">
              <h2 className="font-display text-xl font-bold text-dark border-b border-gray-100 pb-2">History</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {past.map((appt: any) => (
                  <AppointmentCardClient key={appt.id} appt={appt} isPast />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <GoogleReviewBanner />
    </div>
  );
}
