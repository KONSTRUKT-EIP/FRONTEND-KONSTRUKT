import React from 'react';
import AttendanceCalendar from './AttendanceCalendar';

interface AttendanceWeekNavigatorProps {
  weekMonday: Date;
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// "26 – 30 octobre 2026", "29 sept. – 3 oct. 2026" ou "29 déc. 2025 – 2 janv. 2026"
const formatWeekRange = (start: Date, end: Date) => {
  if (start.getFullYear() !== end.getFullYear()) {
    const format = (d: Date) =>
      d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${format(start)} – ${format(end)}`;
  }
  if (start.getMonth() !== end.getMonth()) {
    const format = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    return `${format(start)} – ${format(end)} ${end.getFullYear()}`;
  }
  const monthYear = end.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return `${start.getDate()} – ${end.getDate()} ${monthYear}`;
};

// Aujourd'hui, ou le vendredi précédent si on est le week-end
export const getDefaultAttendanceDate = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  while (date.getDay() === 0 || date.getDay() === 6) date.setDate(date.getDate() - 1);
  return date;
};

const AttendanceWeekNavigator: React.FC<AttendanceWeekNavigatorProps> = ({
  weekMonday,
  selectedDate,
  onSelect,
}) => {
  const today = new Date();
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekMonday, i));
  const selectedIndex = (selectedDate.getDay() + 6) % 7;
  const isCurrentWeek = weekDays.some((d) => isSameDay(d, today));

  const arrowClassName =
    'w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition text-xl font-bold';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelect(getDefaultAttendanceDate())}
          disabled={isSameDay(selectedDate, getDefaultAttendanceDate())}
          className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent"
        >
          Aujourd'hui
        </button>
        <button
          type="button"
          onClick={() => onSelect(addDays(selectedDate, -7))}
          className={arrowClassName}
          aria-label="Semaine précédente"
          title="Semaine précédente"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => onSelect(addDays(selectedDate, 7))}
          className={arrowClassName}
          aria-label="Semaine suivante"
          title="Semaine suivante"
        >
          ›
        </button>
        <AttendanceCalendar
          selectedDate={selectedDate}
          onSelect={onSelect}
          label={formatWeekRange(weekDays[0], weekDays[4])}
        />
        {isCurrentWeek && (
          <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">
            Cette semaine
          </span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {weekDays.map((date, i) => {
          const selected = i === selectedIndex;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toDateString()}
              type="button"
              onClick={() => onSelect(date)}
              aria-pressed={selected}
              aria-label={date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              className={`flex flex-col items-center py-2 rounded-xl transition ${
                selected
                  ? 'bg-orange-500 text-white shadow'
                  : isToday
                    ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span
                className={`text-xs font-semibold uppercase ${
                  selected ? 'text-orange-100' : 'text-gray-400'
                }`}
              >
                {date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')}
              </span>
              <span className="text-xl font-bold leading-tight">{date.getDate()}</span>
              <span className={`text-xs ${selected ? 'text-orange-100' : 'text-gray-500'}`}>
                {date.toLocaleDateString('fr-FR', { month: 'short' })}
              </span>
              {isToday && (
                <span
                  className={`mt-0.5 text-[10px] font-semibold uppercase ${
                    selected ? 'text-white' : 'text-orange-600'
                  }`}
                >
                  Aujourd'hui
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceWeekNavigator;
