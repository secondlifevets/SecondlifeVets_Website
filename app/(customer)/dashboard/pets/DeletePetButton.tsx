"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deletePet } from "./actions";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function DeletePetButton({ id, name }: { id: string; name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deletePet(id);
    setIsDeleting(false);
    setIsOpen(false);

    if (result.error) {
      toast.error(result.error || "Couldn't remove pet. Please try again.");
    } else {
      toast.success(`${name} was removed successfully.`);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-emergency hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Remove pet"
      >
        <Trash2 size={18} />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Remove Pet"
        message={`Are you sure you want to remove ${name} from your profile? This action cannot be undone.`}
        confirmText={isDeleting ? "Removing..." : "Yes, Remove"}
        isDestructive={true}
      />
    </>
  );
}
