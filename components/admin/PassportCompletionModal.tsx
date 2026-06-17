"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { 
  addVaccination, 
  addDeworming, 
  addTickFleaTreatment, 
  addHealthCheckup, 
  addSurgery 
} from "@/lib/actions/passport";

interface PassportCompletionModalProps {
  appointmentId: string;
  petId: string;
  defaultServiceType: string;
  onClose: () => void;
  onSuccess: () => void; // Called after appointment status is updated
}

import { getPetDetailsAction } from "@/app/admin/(dashboard)/appointments/actions";

const AutoExpandingTextarea = ({ value, onChange, placeholder = "", required = false, className = "" }: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <textarea
      ref={textareaRef}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={1}
      className={`input-field text-sm w-full py-2.5 resize-none overflow-hidden ${className}`}
    />
  );
};

export default function PassportCompletionModal({
  appointmentId,
  petId,
  defaultServiceType,
  onClose,
  onSuccess,
}: PassportCompletionModalProps) {
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [recordType, setRecordType] = useState("Health Checkup");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPets, setIsFetchingPets] = useState(true);

  // Form states
  const [date, setDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split("T")[0];
  });
  const [veterinarianName, setVeterinarianName] = useState("Dr. Muhammad Ahmad");
  
  // Specific fields
  const [vaccineType, setVaccineType] = useState("Other");
  const [vaccineName, setVaccineName] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [validUntil, setValidUntil] = useState("");
  
  const [medicine, setMedicine] = useState("");
  const [dewormer, setDewormer] = useState("");
  
  const [tpr, setTpr] = useState("");
  const [bodyWeight, setBodyWeight] = useState("");
  const [generalCondition, setGeneralCondition] = useState("");
  const [prescription, setPrescription] = useState("");
  
  const [surgeryDetails, setSurgeryDetails] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const fetchPet = async () => {
      setIsFetchingPets(true);
      const data = await getPetDetailsAction(petId);
      
      if (data && data.pet_id) {
        setPets([{ id: data.pet_id, name: data.name, type: data.type }]);
        setSelectedPetId(data.pet_id);
      }
      setIsFetchingPets(false);
    };

    if (petId) fetchPet();
  }, [petId]);

  useEffect(() => {
    const sType = defaultServiceType.toLowerCase();
    if (sType.includes("vaccinat")) setRecordType("Vaccination");
    else if (sType.includes("deworm")) setRecordType("Deworming");
    else if (sType.includes("surg")) setRecordType("Surgical Consultation");
    else if (sType.includes("dental")) setRecordType("Dental Cleaning");
    else if (sType.includes("emergency")) setRecordType("Emergency Care");
    else if (sType.includes("nutrition")) setRecordType("Pet Nutrition Consultation");
    else if (sType.includes("diagnostic") || sType.includes("lab")) setRecordType("Diagnostic & Lab Tests");
    else if (sType.includes("tick") || sType.includes("flea")) setRecordType("Tick & Flea Treatments");
    else setRecordType("General Checkup");
  }, [defaultServiceType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId) return toast.error("Please select a pet.");

    setIsLoading(true);

    try {
      let res: any = { error: null };

      if (recordType === "Vaccination") {
        res = await addVaccination({
          pet_id: selectedPetId,
          vaccine_type: vaccineType,
          vaccination_date: date,
          valid_until: validUntil || null,
          vaccine_name: vaccineName,
          batch_no: batchNo,
          is_vod_verified: true,
          veterinarian_name: veterinarianName,
        });
      } else if (recordType === "Deworming") {
        res = await addDeworming({
          pet_id: selectedPetId,
          date: date,
          dewormer: dewormer,
          veterinarian_name: veterinarianName,
        });
      } else if (recordType === "Surgical Consultation") {
        res = await addSurgery({
          pet_id: selectedPetId,
          date: date,
          surgery_details: `${defaultServiceType} - ${surgeryDetails}`,
          veterinarian_name: veterinarianName,
        });
      } else if (recordType === "Tick & Flea Treatments") {
        res = await addTickFleaTreatment({
          pet_id: selectedPetId,
          date: date,
          medicine: medicine,
          veterinarian_name: veterinarianName,
        });
      } else {
        // General Checkup, Dental, Emergency, Nutrition, Diagnostics
        res = await addHealthCheckup({
          pet_id: selectedPetId,
          date: date,
          tpr: tpr,
          body_weight: bodyWeight,
          general_body_condition: `${recordType} - ${generalCondition}`,
          prescription: prescription,
          veterinarian_name: veterinarianName,
        });
      }

      if (res.error) {
        toast.error(`Couldn't add record: ${res.error.message || "Unknown error"}`);
        setIsLoading(false);
        return;
      }

      // If passport is successfully added, complete the appointment
      const { error: updateError } = await supabase
        .from("appointments")
        .update({ status: 'completed' })
        .eq("id", appointmentId);

      if (updateError) {
        toast.error("Passport updated, but couldn't complete appointment.");
      } else {
        toast.success("Passport filled and appointment marked completed!");
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div>
            <h3 className="font-display font-bold text-xl text-dark">Complete Appointment</h3>
            <p className="text-sm text-gray-500 mt-1">Fill passport details for <span className="font-semibold text-primary">{defaultServiceType}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isFetchingPets ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-primary w-6 h-6" />
            </div>
          ) : pets.length === 0 ? (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm border border-amber-200 text-center">
              No registered pets found for this client. Please close and complete directly.
            </div>
          ) : (
            <form id="passport-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Pet</label>
                  <select 
                    value={selectedPetId} 
                    disabled
                    className="input-field text-sm w-full py-2.5 bg-gray-100 text-gray-700 cursor-not-allowed"
                    required
                  >
                    {pets.map(pet => (
                      <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Record Type</label>
                  <select 
                    value={recordType} 
                    onChange={e => setRecordType(e.target.value)}
                    className="input-field text-sm w-full py-2.5 bg-gray-50"
                  >
                    <option value="General Checkup">General Checkup</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Deworming">Deworming</option>
                    <option value="Surgical Consultation">Surgical Consultation</option>
                    <option value="Dental Cleaning">Dental Cleaning</option>
                    <option value="Emergency Care">Emergency Care</option>
                    <option value="Pet Nutrition Consultation">Pet Nutrition Consultation</option>
                    <option value="Diagnostic & Lab Tests">Diagnostic & Lab Tests</option>
                    <option value="Tick & Flea Treatments">Tick & Flea Treatments</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="input-field text-sm w-full py-2.5"
                  />
                </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Veterinarian Name</label>
                    <AutoExpandingTextarea 
                      required
                      value={veterinarianName}
                      onChange={(e: any) => setVeterinarianName(e.target.value)}
                    />
                  </div>
              </div>

              {recordType === "Deworming" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dewormer Used</label>
                  <AutoExpandingTextarea 
                    required
                    placeholder="e.g. Drontal, Panacur"
                    value={dewormer}
                    onChange={(e: any) => setDewormer(e.target.value)}
                  />
                </div>
              )}

              {recordType === "Vaccination" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vaccine Type</label>
                      <select 
                        value={vaccineType}
                        onChange={e => setVaccineType(e.target.value)}
                        className="input-field text-sm w-full py-2.5"
                      >
                        <option value="Rabies">Rabies</option>
                        <option value="Other">Other (e.g. FVRCP, DHLPP)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vaccine Name</label>
                      <AutoExpandingTextarea 
                        required
                        placeholder="e.g. Nobivac Tricat Trio"
                        value={vaccineName}
                        onChange={(e: any) => setVaccineName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch No.</label>
                      <AutoExpandingTextarea 
                        placeholder="e.g. RAB-99281"
                        value={batchNo}
                        onChange={(e: any) => setBatchNo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valid Until (Expiry)</label>
                    <input 
                      type="date" 
                      value={validUntil}
                      onChange={e => setValidUntil(e.target.value)}
                      className="input-field text-sm w-full py-2.5"
                    />
                  </div>
                </>
              )}

              {recordType === "Tick & Flea Treatments" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Medicine Used</label>
                  <AutoExpandingTextarea 
                    placeholder="e.g. Frontline, Bravecto"
                    value={medicine}
                    onChange={(e: any) => setMedicine(e.target.value)}
                  />
                </div>
              )}

              {["General Checkup", "Dental Cleaning", "Emergency Care", "Pet Nutrition Consultation", "Diagnostic & Lab Tests"].includes(recordType) && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">TPR</label>
                      <AutoExpandingTextarea 
                        placeholder="Temp/Pulse/Resp"
                        value={tpr}
                        onChange={(e: any) => setTpr(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Body Weight</label>
                      <AutoExpandingTextarea 
                        placeholder="e.g. 4.5 kg"
                        value={bodyWeight}
                        onChange={(e: any) => setBodyWeight(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">General Condition</label>
                      <AutoExpandingTextarea 
                        placeholder="e.g. Healthy"
                        value={generalCondition}
                        onChange={(e: any) => setGeneralCondition(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prescription</label>
                    <AutoExpandingTextarea 
                      placeholder="e.g. Amoxicillin 50mg BID for 7 days"
                      value={prescription}
                      onChange={(e: any) => setPrescription(e.target.value)}
                    />
                  </div>
                </>
              )}

              {recordType === "Surgical Consultation" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Surgery Details</label>
                  <AutoExpandingTextarea 
                    required
                    placeholder="Describe the surgery performed..."
                    value={surgeryDetails}
                    onChange={(e: any) => setSurgeryDetails(e.target.value)}
                  />
                </div>
              )}
            </form>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="passport-form"
            disabled={isLoading || pets.length === 0}
            className="flex-1 bg-primary hover:bg-primary-mid text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
            {isLoading ? "Saving..." : "Fill Passport & Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
