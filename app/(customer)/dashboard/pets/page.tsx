import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { differenceInYears, differenceInMonths, parseISO, isThisWeek, setYear } from "date-fns";
import PetsClient from "./PetsClient";
import DeletePetButton from "./DeletePetButton";
import EditPetButton from "./EditPetButton";
import CopyUID from "@/components/ui/CopyUID";
import Link from "next/link";
import { Cake, ShieldAlert, Clock } from "lucide-react";
import VaccinationHistoryButton from "./VaccinationHistoryButton";
import { getVaccinationStatus } from "@/lib/vaccinationSchedule";
import PetCardVaccinationAlertClient from "@/components/customer/PetCardVaccinationAlertClient";
import MedicalCertificateClient from "@/components/customer/MedicalCertificateClient";

function getPetAge(dob: string) {
  if (!dob) return "Unknown";
  const birthDate = parseISO(dob);
  const now = new Date();
  const years = differenceInYears(now, birthDate);
  const months = differenceInMonths(now, birthDate) % 12;
  
  if (years > 0) {
    return `${years} Year${years > 1 ? 's' : ''}${months > 0 ? `, ${months} Mo` : ''}`;
  }
  return `${months} Month${months !== 1 ? 's' : ''}`;
}

function isBirthdayThisWeek(dob: string) {
  if (!dob) return false;
  const birthDate = parseISO(dob);
  const thisYearBirthday = setYear(birthDate, new Date().getFullYear());
  return isThisWeek(thisYearBirthday);
}

export default async function PetsPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single();

  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("customer_id", user?.id)
    .order("created_at", { ascending: true });

  // Fetch all vaccination history for all of this user's pets in one query
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark flex items-center gap-3 flex-wrap">
            My Pets
            {user?.id && (
              <CopyUID uid={user.id} prefix="Account" />
            )}
          </h1>
          <p className="text-gray-500 font-sans mt-1">Manage your pet profiles and medical details.</p>
        </div>
        <PetsClient />
      </div>

      {!pets || pets.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow group animate-fade-in-up">
          <div className="w-20 h-20 bg-primary-light/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-light/50 transition-all duration-500 ease-out shadow-inner">
            <span className="text-4xl group-hover:animate-bounce-subtle">🐾</span>
          </div>
          <h3 className="font-display text-xl font-bold text-dark mb-2">No pets added yet</h3>
          <p className="text-gray-500 max-w-sm leading-relaxed">Add your furry friends to make booking appointments faster and keep track of their medical history.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet: any) => {
            const hasBirthday = isBirthdayThisWeek(pet.date_of_birth);
            const history = historyByPetId[pet.id] || [];
            const vaxStatus = getVaccinationStatus(pet.type, pet.date_of_birth, history);
            const isDue = vaxStatus.state === "due";
            const isUpcoming = vaxStatus.state === "upcoming";

            return (
            <div key={pet.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 relative overflow-hidden group flex flex-col h-full">
              <EditPetButton pet={pet} />
              <DeletePetButton id={pet.id} name={pet.name} />
              
              <div className="flex items-start gap-4 mb-6 pr-8">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-primary-light flex items-center justify-center bg-gradient-to-br from-primary-light to-primary/10">
                  {pet.image_url ? (
                    <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">
                      {pet.type === 'Dog' ? '🐶' : 
                       pet.type === 'Cat' ? '🐱' : 
                       pet.type === 'Bird' ? '🦜' : 
                       pet.type === 'Rabbit' ? '🐰' : '🐾'}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-dark mb-1">{pet.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
                      {pet.type}
                    </span>
                    <CopyUID uid={pet.id} prefix="ID" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500 font-medium">Breed</span>
                  <span className="text-sm font-bold text-dark">{pet.breed || "Mixed/Unknown"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500 font-medium">Age</span>
                  <span className="text-sm font-bold text-dark">{getPetAge(pet.date_of_birth)}</span>
                </div>
              </div>

              <div className="mt-auto pt-6 space-y-2">
                {hasBirthday && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 p-3 rounded-xl flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                      <Cake size={16} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Birthday Week!</p>
                      <p className="text-[10px] text-yellow-700">Time to celebrate {pet.name}!</p>
                    </div>
                  </div>
                )}

                {isDue || isUpcoming ? (
                  <PetCardVaccinationAlertClient 
                    pet={pet} 
                    vaxStatus={vaxStatus} 
                    profile={profile} 
                    email={user?.email || ""} 
                  />
                ) : (
                  <VaccinationHistoryButton petId={pet.id} petName={pet.name} lastDate={pet.last_vaccination_date} sublabel={(vaxStatus as any).sublabel} />
                )}

                <MedicalCertificateClient pet={pet} />
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}
