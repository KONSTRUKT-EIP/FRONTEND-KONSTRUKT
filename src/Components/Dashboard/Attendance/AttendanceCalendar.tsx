import React, { useState, useRef, useEffect } from 'react';

interface AttendanceCalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  label: string;
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

// Renvoie les jours affichés dans la grille du mois (semaines complètes, du lundi au dimanche)
const getMonthGrid = (year: number, month: number): Date[] => {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);
  const last = new Date(year, month + 1, 0);
  const totalDays = Math.ceil((offset + last.getDate()) / 7) * 7;

  return Array.from(
    { length: totalDays },
    (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  );
};

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ selectedDate, onSelect, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
    setIsOpen(!isOpen);
  };

  const changeMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const handleSelect = (date: Date) => {
    onSelect(date);
    setIsOpen(false);
  };

  const today = new Date();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-lg font-bold text-gray-800 hover:bg-gray-100 transition"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        title="Choisir une date"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {label}
        <span className="text-sm text-gray-400" aria-hidden="true">▾</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Choisir une date"
          className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 z-20"
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-600 font-bold"
              aria-label="Mois précédent"
            >
              ‹
            </button>
            <span className="text-base font-bold text-gray-800">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-600 font-bold"
              aria-label="Mois suivant"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((day) => (
              <span key={day} className="text-xs font-semibold text-gray-400 py-1">
                {day}
              </span>
            ))}

            {getMonthGrid(viewYear, viewMonth).map((date) => {
              const inMonth = date.getMonth() === viewMonth;
              const disabled = isWeekend(date);
              const selected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, today);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(date)}
                  className={`h-9 rounded-full text-sm font-semibold transition ${
                    selected
                      ? 'bg-orange-500 text-white shadow'
                      : disabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : isToday
                          ? 'text-orange-500 ring-1 ring-orange-500 hover:bg-orange-50'
                          : inMonth
                            ? 'text-gray-700 hover:bg-gray-100'
                            : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
