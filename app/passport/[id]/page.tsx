import React from "react";
import DigitalPassport from "@/components/DigitalPassport";
import { getPetPassportData } from "@/lib/actions/passport";
import { redirect } from "next/navigation";

export default async function CustomerPetPassportPage({ params }: { params: { id: string } }) {
  const data = await getPetPassportData(params.id);

  if (!data || !data.pet) {
    redirect("/dashboard/pets");
  }

  return (
    <div>
      <DigitalPassport data={data} />
    </div>
  );
}
