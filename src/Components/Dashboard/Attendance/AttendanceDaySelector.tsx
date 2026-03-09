import React from 'react';

interface AttendanceDaySelectorProps {
  days: string[];
  selectedDay: number;
  onSelect: (index: number) => void;
}

const AttendanceDaySelector: React.FC<AttendanceDaySelectorProps> = ({ days, selectedDay, onSelect }) => (
  <div className="flex items-center gap-2">
    {days.map((day, i) => (
      <button
        key={day}
        onClick={() => onSelect(i)}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
          selectedDay === i
            ? 'bg-orange-500 text-white shadow'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        {day}
      </button>
    ))}
  </div>
);

export default AttendanceDaySelector;
