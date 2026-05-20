"use client";

import { useState } from "react";
import { updateResume } from "@/app/actions/resume";

export default function EditResumeForm({ resume }: { resume: any }) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(resume.imageUrl || "");
  
  // Parse the existing JSON custom sections safely
  let initialSections = [{ title: "", content: "" }];
  try {
    if (resume.content) initialSections = JSON.parse(resume.content);
  } catch (e) {}

  const [customSections, setCustomSections] = useState(initialSections);

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

  const addSection = () => setCustomSections([...customSections, { title: "", content: "" }]);
  
  const updateSection = (index: number, key: "title" | "content", value: string) => {
    const newSections = [...customSections];
    newSections[index][key] = value;
    setCustomSections(newSections);
  };

  return (
    <form action={updateResume} className="space-y-8">
      <input type="hidden" name="id" value={resume.id} />
      <input type="hidden" name="content" value={JSON.stringify(customSections)} />
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Portfolio Name / Job Title</label>
          <input type="text" name="title" defaultValue={resume.title} required className="mt-1 block w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700">Short Summary</label>
          <textarea name="summary" rows={3} defaultValue={resume.summary} required className="mt-1 block w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
      </div>

      <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200 space-y-4">
        <h3 className="font-semibold text-neutral-800">Media Integrations</h3>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700">Upload Cover Photo (ImgBB)</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {isUploading && <p className="text-sm text-blue-600 mt-2 animate-pulse">Uploading to ImgBB...</p>}
          {imageUrl && <img src={imageUrl} alt="Preview" className="mt-4 h-32 rounded-lg object-cover shadow-sm" />}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">YouTube Video URL</label>
          <input type="url" name="youtubeUrl" defaultValue={resume.youtubeUrl || ""} placeholder="https://youtube.com/watch?v=..." className="mt-1 block w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-neutral-800">Custom Sections</h3>
        {customSections.map((section, index) => (
          <div key={index} className="p-4 border border-neutral-200 rounded-md bg-white space-y-3 shadow-sm">
            <input 
              type="text" 
              placeholder="Section Name (e.g., Work Experience)" 
              value={section.title} 
              onChange={(e) => updateSection(index, "title", e.target.value)}
              className="block w-full px-3 py-2 text-sm border border-neutral-300 rounded-md font-semibold"
            />
            <textarea 
              rows={4} 
              placeholder="Details for this section..." 
              value={section.content}
              onChange={(e) => updateSection(index, "content", e.target.value)}
              className="block w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            ></textarea>
          </div>
        ))}
        <button type="button" onClick={addSection} className="text-sm font-medium text-blue-600 hover:text-blue-800">
          + Add another custom section
        </button>
      </div>
      
      <div className="flex items-center pt-4 border-t border-neutral-100">
        <input id="isHighlighted" name="isHighlighted" type="checkbox" defaultChecked={resume.isHighlighted} className="h-4 w-4 text-black border-neutral-300 rounded" />
        <label htmlFor="isHighlighted" className="ml-2 block text-sm text-neutral-900">Highlight this resume on the public feed</label>
      </div>
      
      <button type="submit" className="w-full bg-black text-white px-4 py-3 rounded-md hover:bg-neutral-800 font-bold transition-colors">
        Save Changes
      </button>
    </form>
  );
}