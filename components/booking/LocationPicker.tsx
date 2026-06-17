"use client";

import { useState } from "react";
import { PAKISTANI_CITIES } from "@/lib/constants";
import { Select } from "@/components/ui/Input";

interface LocationPickerProps {
  city: string;
  address: string;
  onCityChange: (city: string) => void;
  onAddressChange: (address: string) => void;
  cityError?: string;
  addressError?: string;
}

export default function LocationPicker({
  city,
  address,
  onCityChange,
  onAddressChange,
  cityError,
  addressError,
}: LocationPickerProps) {
  return (
    <div className="space-y-4">
      <Select
        id="location-city"
        label="City"
        required
        placeholder="Select your city"
        options={PAKISTANI_CITIES.map((c) => ({ value: c, label: c }))}
        value={city}
        onChange={(e) => onCityChange(e.target.value)}
        error={cityError}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="location-address" className="text-sm font-medium text-dark/80">
          Full Home Address <span className="text-emergency">*</span>
        </label>
        <textarea
          id="location-address"
          rows={3}
          placeholder="House #, Street, Area, Landmark..."
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          className={`input-field resize-none ${addressError ? "border-emergency focus:ring-emergency/30 focus:border-emergency" : ""}`}
        />
        {addressError && (
          <p className="text-xs text-emergency flex items-center gap-1">
            <span>⚠</span> {addressError}
          </p>
        )}
        <p className="text-xs text-dark/50">
          💡 Include a nearby landmark for faster navigation
        </p>
      </div>
    </div>
  );
}
