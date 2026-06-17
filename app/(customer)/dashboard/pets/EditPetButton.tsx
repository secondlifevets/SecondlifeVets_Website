"use client";

import { useState, useRef } from "react";
import { Pencil, X, Loader2, Dog, Cat, Bird, Rabbit, FileQuestion, Camera } from "lucide-react";
import clsx from "clsx";
import { editPet } from "./actions";
import { toast } from "sonner";
import ImageCropper from "@/components/ui/ImageCropper";

export default function EditPetButton({ pet }: { pet: any }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const standardTypes = ["Dog", "Cat", "Bird", "Rabbit"];
  const initialIsOther = !standardTypes.includes(pet.type);
  const [selectedType, setSelectedType] = useState<string>(initialIsOther ? "Other" : pet.type);
  const [lastVaxDate, setLastVaxDate] = useState<string>("");

  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [croppedImagePreview, setCroppedImagePreview] = useState<string | null>(pet.image_url || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setSelectedImageSrc(reader.result?.toString() || null);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (blob: Blob) => {
    setCroppedImageBlob(blob);
    setCroppedImagePreview(URL.createObjectURL(blob));
    setSelectedImageSrc(null); // close cropper
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("id", pet.id);
    
    if (!selectedType) {
      toast.error("Please select a species.");
      setIsPending(false);
      return;
    }

    if (selectedType === "Other") {
      const otherType = formData.get("other_type") as string;
      if (!otherType || !otherType.trim()) {
        toast.error("Please specify the other species.");
        setIsPending(false);
        return;
      }
      formData.set("type", otherType.trim());
    } else {
      formData.set("type", selectedType);
    }

    // Append Image File
    if (croppedImageBlob) {
      formData.append("image_file", croppedImageBlob, "avatar.jpg");
    }

    const result = await editPet(formData);
    
    setIsPending(false);
    
    if (result.error) {
      toast.error(result.error || "Couldn't update pet profile. Please try again.");
    } else {
      toast.success("Pet updated successfully!");
      setIsEditModalOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsEditModalOpen(true)}
        className="absolute top-4 right-14 p-2 text-gray-400 hover:text-primary hover:bg-primary-light/50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Edit pet"
      >
        <Pencil size={18} />
      </button>

      {/* Edit Pet Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-y-auto max-h-[90vh] animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-display text-xl font-bold text-dark">Edit Pet</h2>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-dark transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5 text-left">
              
              {/* Image Upload Area */}
              <div className="flex flex-col items-center justify-center mb-6">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 hover:border-primary bg-gray-50 hover:bg-primary/5 flex flex-col items-center justify-center transition-all group overflow-hidden"
                >
                  {croppedImagePreview ? (
                    <img src={croppedImagePreview} alt="Pet Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6 text-gray-400 group-hover:text-primary mb-1" />
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary">Change Photo</span>
                    </>
                  )}
                  {croppedImagePreview && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  )}
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Pet Name</label>
                <input required name="name" defaultValue={pet.name} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="e.g. Max" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Species *</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { type: "Dog", icon: Dog },
                      { type: "Cat", icon: Cat },
                      { type: "Bird", icon: Bird },
                      { type: "Rabbit", icon: Rabbit },
                      { type: "Other", icon: FileQuestion }
                    ].map(p => (
                      <button
                        key={p.type}
                        type="button"
                        onClick={() => setSelectedType(p.type)}
                        className={clsx(
                          "flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border-2 transition-all gap-1.5",
                          selectedType === p.type ? "border-primary bg-primary-light text-primary shadow-sm" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                        )}
                      >
                        <p.icon size={20} />
                        <span className="text-[10px] sm:text-xs font-bold text-center">{p.type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedType === "Other" && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Please specify *</label>
                    <input name="other_type" defaultValue={initialIsOther ? pet.type : ""} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="e.g. Guinea Pig" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Breed (Optional)</label>
                  <input name="breed" defaultValue={pet.breed || ""} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="e.g. Golden Retriever" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Date of Birth</label>
                <input required name="date_of_birth" defaultValue={pet.date_of_birth || ""} type="date" max={new Date().toISOString().split('T')[0]} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-600" />
                <p className="text-xs text-gray-500 mt-1.5 ml-1">Helps vets calculate precise medication dosages.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Colour (Optional)</label>
                  <input name="color" defaultValue={pet.color || ""} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="e.g. Black & White" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Gender (Optional)</label>
                  <select name="gender" defaultValue={pet.gender || ""} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-dark appearance-none">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Microchip No. (Optional)</label>
                <input name="microchip_no" defaultValue={pet.microchip_no || ""} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="e.g. 981020000000000" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Add a New Vaccination (Optional)</label>
                <input 
                  name="last_vaccination_date" 
                  type="date" 
                  max={new Date().toISOString().split('T')[0]} 
                  onChange={(e) => setLastVaxDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-600" 
                />
              </div>

              {lastVaxDate && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Shot Type</label>
                  <select name="last_shot_type" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all">
                    <option value="unknown">Unknown</option>
                    <option value="shot_1">Shot 1</option>
                    <option value="shot_2">Shot 2</option>
                    <option value="shot_3">Shot 3</option>
                    <option value="shot_4">Shot 4 (Dogs only)</option>
                    <option value="annual_booster">Annual Booster</option>
                  </select>
                </div>
              )}
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3.5 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isPending} className="flex-[2] bg-primary hover:bg-primary-mid text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2">
                  {isPending ? <Loader2 size={20} className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedImageSrc && (
        <ImageCropper
          imageSrc={selectedImageSrc}
          onClose={() => setSelectedImageSrc(null)}
          onCropCompleteAction={handleCropComplete}
        />
      )}
    </>
  );
}
