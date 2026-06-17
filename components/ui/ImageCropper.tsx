"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";
import getCroppedImg from "@/lib/cropImage";

interface ImageCropperProps {
  imageSrc: string;
  onClose: () => void;
  onCropCompleteAction: (croppedBlob: Blob) => void;
}

export default function ImageCropper({ imageSrc, onClose, onCropCompleteAction }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels as any,
        0 // rotation
      );
      if (croppedImageBlob) {
        onCropCompleteAction(croppedImageBlob);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col h-[80vh] sm:h-[600px] animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <h3 className="font-display font-bold text-xl text-dark">Position and Size</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 w-full bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            restrictPosition={false}
            minZoom={0.2}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Footer / Controls */}
        <div className="p-6 shrink-0 bg-white">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-500">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={0.2}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Photo
                </>
              )}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
