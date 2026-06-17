"use client";

import React, { useState } from "react";
import { PetPassportData } from "@/lib/types";
import { addVaccination, addDeworming, addTickFleaTreatment, addHealthCheckup, addSurgery, updatePetPassportInfo } from "@/lib/actions/passport";
import DigitalPassport from "@/components/DigitalPassport";

export default function AdminPassportClient({ initialData, petId }: { initialData: PetPassportData, petId: string }) {
  const [data, setData] = useState<PetPassportData>(initialData);
  const [activeTab, setActiveTab] = useState("view");

  const handleAddVaccination = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRecord = {
      pet_id: petId,
      vaccine_type: formData.get("vaccine_type"),
      vaccination_date: formData.get("vaccination_date"),
      valid_until: formData.get("valid_until"),
      vaccine_name: formData.get("vaccine_name"),
      batch_no: formData.get("batch_no"),
      is_vod_verified: true,
      veterinarian_name: formData.get("veterinarian_name"),
    };
    await addVaccination(newRecord);
    alert("Vaccination added!");
    window.location.reload();
  };

  const handleAddDeworming = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRecord = {
      pet_id: petId,
      date: formData.get("date"),
      veterinarian_name: formData.get("veterinarian_name"),
    };
    await addDeworming(newRecord);
    alert("Deworming record added!");
    window.location.reload();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex gap-4 bg-white p-4 rounded-lg shadow">
        <button onClick={() => setActiveTab("view")} className={`px-4 py-2 rounded ${activeTab === 'view' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>View Passport</button>
        <button onClick={() => setActiveTab("add-vax")} className={`px-4 py-2 rounded ${activeTab === 'add-vax' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Add Vaccination</button>
        <button onClick={() => setActiveTab("add-deworm")} className={`px-4 py-2 rounded ${activeTab === 'add-deworm' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Add Deworming</button>
      </div>

      {activeTab === "view" && (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <DigitalPassport data={data} />
        </div>
      )}

      {activeTab === "add-vax" && (
        <div className="bg-white p-6 rounded-lg shadow max-w-md">
          <h2 className="text-xl font-bold mb-4">Add Vaccination</h2>
          <form onSubmit={handleAddVaccination} className="flex flex-col gap-4">
            <select name="vaccine_type" className="border p-2 rounded" required>
              <option value="Rabies">Rabies</option>
              <option value="Other">Other</option>
            </select>
            <input type="date" name="vaccination_date" className="border p-2 rounded" required title="Vaccination Date" />
            <input type="date" name="valid_until" className="border p-2 rounded" title="Valid Until" />
            <input type="text" name="vaccine_name" placeholder="Vaccine Name" className="border p-2 rounded" required />
            <input type="text" name="batch_no" placeholder="Batch No." className="border p-2 rounded" />
            <input type="text" name="veterinarian_name" placeholder="Veterinarian Name" className="border p-2 rounded" required />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded">Save Record</button>
          </form>
        </div>
      )}

      {activeTab === "add-deworm" && (
        <div className="bg-white p-6 rounded-lg shadow max-w-md">
          <h2 className="text-xl font-bold mb-4">Add Deworming</h2>
          <form onSubmit={handleAddDeworming} className="flex flex-col gap-4">
            <input type="date" name="date" className="border p-2 rounded" required title="Date" />
            <input type="text" name="veterinarian_name" placeholder="Veterinarian Name" className="border p-2 rounded" required />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded">Save Record</button>
          </form>
        </div>
      )}
    </div>
  );
}
