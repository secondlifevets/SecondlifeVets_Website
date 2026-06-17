import React from "react";
import EditableDigitalPassport from "@/components/admin/EditableDigitalPassport";
import { getPetPassportData } from "@/lib/actions/passport";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function AdminEditablePassportPage({ params }: { params: { id: string } }) {
  const data = await getPetPassportData(params.id);

  if (!data || !data.pet) {
    redirect("/admin/pets");
  }

  return (
    <div>
      <EditableDigitalPassport initialData={data} petId={params.id} />
    </div>
  );
}
