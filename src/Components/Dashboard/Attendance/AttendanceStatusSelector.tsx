import React, { useState, useRef, useEffect } from 'react';
import { AttendanceStatus, attendanceConfig } from './AttendanceBadge';

interface AttendanceStatusSelectorProps {
  currentStatus: AttendanceStatus;
  onStatusChange: (status: AttendanceStatus) => void;
  disabled?: boolean;
}

const AttendanceStatusSelector: React.FC<AttendanceStatusSelectorProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleStatusClick = (status: AttendanceStatus) => {
    if (status !== currentStatus) {
      onStatusChange(status);
    }
    setIsOpen(false);
  };

  const { label, className } = attendanceConfig[currentStatus];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`px-4 py-1.5 rounded-full text-base font-semibold ${className} ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-80'
        } transition-opacity`}
      >
        {label}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {(Object.keys(attendanceConfig) as AttendanceStatus[]).map((status) => {
            const config = attendanceConfig[status];
            const isSelected = status === currentStatus;
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusClick(status)}
                className={`w-full text-left px-4 py-2.5 text-base font-semibold hover:bg-gray-50 transition ${
                  isSelected ? 'bg-gray-100' : ''
                }`}
              >
                <span className={`inline-block px-2 py-1 rounded-full ${config.className}`}>
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendanceStatusSelector;
