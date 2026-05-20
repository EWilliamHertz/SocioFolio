"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/settings";

export default function SettingsForm({ user }: { user: any }) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(user.image || "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("https://api.imgbb.com/1/upload?key=b2492f987920d3e2a7903861b72ae3a4", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form action={updateProfile} className="space-y-6">
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <div>
        <label className="block text-sm font-medium text-neutral-700">Profile Picture</label>
        <div className="mt-2 flex items-center space-x-4 border border-neutral-200 p-4 rounded-lg bg-neutral-50">
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover shadow-sm border border-neutral-200" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-bold text-xl border border-neutral-300">
              {user.name?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer" />
            {isUploading && <p className="text-sm text-blue-600 mt-2 animate-pulse">Uploading to ImgBB...</p>}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">Display Name</label>
        <input type="text" name="name" defaultValue={user.name || ""} required className="mt-1 block w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">Platform Language</label>
        <select name="language" defaultValue={user.language || "en"} className="mt-1 block w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="en">English (US)</option>
          <option value="sv">Svenska (Swedish)</option>
          <option value="es">Español (Spanish)</option>
          <option value="fr">Français (French)</option>
          <option value="de">Deutsch (German)</option>
        </select>
        <p className="text-xs text-neutral-500 mt-2">Note: Language localization engine will apply this setting globally in a future update.</p>
      </div>

      <div className="pt-6 border-t border-neutral-100">
        <button type="submit" className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-md hover:bg-neutral-800 font-bold transition-colors">
          Save Settings
        </button>
      </div>
    </form>
  );
}