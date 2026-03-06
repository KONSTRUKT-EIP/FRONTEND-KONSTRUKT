import React, { useRef } from "react";

interface ChantierCardProps {
  id: string;
  name: string;
  location: string;
  responsible: string;
  photo?: string;
  // onPhotoChange: (id: string, url: string) => void;
  onClick: () => void;
}

export default function ChantierCard({
  // id: _id,
  name,
  location,
  responsible,
  photo,
  // onPhotoChange,
  onClick,
}: ChantierCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file)
      return;
    // const url = URL.createObjectURL(file);
    // onPhotoChange(id, url);
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Picture zone */}
      <div className="relative h-70 bg-indigo-50 flex items-center justify-center">
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl opacity-30">🏗️</span>
        )}

        {/* Upload button */}
        <button
          onClick={handleUploadClick}
          className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-xs text-gray-600 font-medium px-3 py-1.5 rounded-lg shadow hover:bg-white transition-colors flex items-center gap-1.5"
        >
          <span>📷</span> {photo ? "Changer" : "Ajouter photo"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Infos */}
      <div className="p-20 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <span>📍</span> {location}
          </p>
        </div>

        {/* Responsible */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-indigo-600">
              {responsible.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
          </div>
          <span className="text-xs text-gray-500">{responsible}</span>
        </div>
      </div>
    </div>
  );
}