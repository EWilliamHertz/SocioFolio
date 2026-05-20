"use client";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="text-sm font-medium px-4 py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors shadow-sm print:hidden"
    >
      Export to PDF
    </button>
  );
}