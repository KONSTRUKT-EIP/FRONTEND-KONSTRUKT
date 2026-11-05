import React, { useRef, useState } from "react";
import { Building2, CalendarCheck, CalendarDays, Camera, MapPin } from "lucide-react";

interface ChantierCardProps {
  id: string;
  name: string;
  location: string;
  startDate?: string;
  endDate?: string | null;
  // Avancement des travaux (moyenne des tâches), null si aucune tâche n'est suivie
  progressPct?: number | null;
  photo?: string;
  photoUploading?: boolean;
  onPhotoChange: (id: string, file: File) => void;
  onClick: () => void;
}

export default function ChantierCard({
  id,
  name,
  location,
  startDate,
  endDate,
  progressPct = null,
  photo,
  photoUploading = false,
  onPhotoChange,
  onClick,
}: ChantierCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const blockingRef = useRef(false);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  // Tant que le chantier n'a pas commencé, la date de début est une date prévue
  const [now] = useState(() => Date.now());
  const notStartedYet = startDate ? new Date(startDate).getTime() > now : false;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    onPhotoChange(id, file);

    e.target.value = '';
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    blockingRef.current = true;
    inputRef.current?.click();
  };

  const handleCardClick = () => {
    if (blockingRef.current) {
      blockingRef.current = false;
      return;
    }
    onClick();
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Picture zone */}
      <div className="relative h-70 bg-indigo-50 flex items-center justify-center">
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <Building2 className="w-14 h-14 text-indigo-300" strokeWidth={1.5} aria-hidden="true" />
        )}

        {photoUploading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-sm font-medium text-gray-700">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            Enregistrement…
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUploadClick}
          disabled={photoUploading}
          className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-xs text-gray-600 font-medium px-3 py-1.5 rounded-lg shadow hover:bg-white transition-colors flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-wait"
        >
          <Camera className="w-3.5 h-3.5" aria-hidden="true" /> {photo ? "Changer" : "Ajouter photo"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Infos */}
      <div className="px-6 py-6 flex flex-col gap-3 flex-1">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
          <p className="text-lg text-gray-900 flex items-center gap-1 mt-1 font-semibold">
            <MapPin className="w-5 h-5 text-gray-500 shrink-0" aria-hidden="true" /> {location}
          </p>
        </div>

        {/* Dates prévues et avancement des travaux */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
          {startDate && (
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-gray-600 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
                {notStartedYet ? "Début prévu" : "Début"}
              </span>
              <span className="font-semibold text-gray-900 whitespace-nowrap">{formatDate(startDate)}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium text-gray-600 flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" /> Fin prévue
            </span>
            <span className="font-semibold text-gray-900 whitespace-nowrap">
              {endDate ? formatDate(endDate) : "Non définie"}
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium text-gray-600">Avancement des travaux</span>
              <span className="font-bold text-gray-900">{progressPct === null ? "—" : `${progressPct} %`}</span>
            </div>
            <div
              className="h-2 rounded-full bg-gray-100 overflow-hidden"
              role="progressbar"
              aria-label="Avancement des travaux"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPct ?? undefined}
            >
              <div
                className={`h-full rounded-full ${progressPct === 100 ? "bg-green-500" : "bg-orange-500"}`}
                style={{ width: `${progressPct ?? 0}%`, transition: "width 0.6s ease" }}
              />
            </div>
            {progressPct === null && <p className="text-xs text-gray-400 mt-1">Aucune tâche suivie pour le moment</p>}
          </div>
        </div>
      </div>
    </div>
  );
}