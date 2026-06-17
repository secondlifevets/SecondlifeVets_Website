"use client";

import { useState, useRef } from "react";
import { Plus, X, Loader2, Dog, Cat, Bird, Rabbit, FileQuestion, Camera } from "lucide-react";
import clsx from "clsx";
import { addPet } from "./actions";
import { toast } from "sonner";
import ImageCropper from "@/components/ui/ImageCropper";

export default function PetsClient({ variant = "default" }: { variant?: "default" | "emptyStateCTA" }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [lastVaxDate, setLastVaxDate] = useState<string>("");
  
  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [croppedImagePreview, setCroppedImagePreview] = useState<string | null>(null);

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

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    
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

    const result = await addPet(formData);
    
    setIsPending(false);
    
    if (result.error) {
      toast.error(result.error || "Couldn't add pet. Please try again.");
    } else {
      toast.success("Pet added successfully!");
      // Reset form
      setCroppedImageBlob(null);
      setCroppedImagePreview(null);
      setSelectedType("");
      setIsAddModalOpen(false);
    }
  };

  return (
    <>
      {variant === "default" ? (
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary-mid text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 shrink-0"
        >
          <Plus size={20} />
          Add Pet
        </button>
      ) : (
        <div className="bg-gradient-to-br from-primary-light/20 to-primary/5 rounded-3xl p-8 sm:p-12 border border-primary-light/50 flex flex-col items-center justify-center text-center shadow-inner group animate-fade-in-up my-6 w-full max-w-3xl mx-auto">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:bg-primary-light/10 transition-all duration-500">
            <span className="text-5xl group-hover:animate-bounce-subtle">🐾</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-3">Welcome to Vets On Door!</h3>
          <p className="text-gray-600 max-w-md leading-relaxed mb-8 text-base sm:text-lg">Let's get started by adding your first furry friend to your profile. This helps us provide personalized care.</p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 text-lg w-full sm:w-auto"
          >
            <Plus size={24} /> Add Your First Pet
          </button>
        </div>
      )}

      {/* Add Pet Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-y-auto max-h-[90vh] animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-display text-xl font-bold text-dark">Add a New Pet</h2>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-dark transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
              
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
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary">Add Photo</span>
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
                <input required name="name" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="e.g. Max" />
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
                    <input name="other_type" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="e.g. Guinea Pig" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Breed (Optional)</label>
                  <input name="breed" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="e.g. Golden Retriever" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Date of Birth</label>
                <input required name="date_of_birth" type="date" max={new Date().toISOString().split('T')[0]} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-600" />
                <p className="text-xs text-gray-500 mt-1.5 ml-1">Helps vets calculate precise medication dosages.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Colour (Optional)</label>
                  <input name="color" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="e.g. Black & White" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Gender (Optional)</label>
                  <select name="gender" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-dark appearance-none">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Microchip No. (Optional)</label>
                <input name="microchip_no" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="e.g. 981020000000000" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Last Vaccination Date (Optional)</label>
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
                  <label className="block text-sm font-bold text-gray-700 mb-1">Last Shot Type</label>
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
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3.5 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isPending} className="flex-[2] bg-primary hover:bg-primary-mid text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2">
                  {isPending ? <Loader2 size={20} className="animate-spin" /> : "Save Pet"}
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
