import React from 'react';

interface AttendanceHoursProps {
    hours: number;
    overtime: number;
}

const AttendanceHours: React.FC<AttendanceHoursProps> = ({ hours, overtime}) => {
    return (
        <div className="flex items-center">
            <p className='py-3 text-xs'>Nombre d'heure jour</p>
            <span className={`px-3 py-2 text-sm`}>
            {hours}
            </span>
            <p className='py-3 text-xs'>Nombre d'heure suplémentaire</p>
            <span className={`px-3 py-2 text-sm`}>
            {overtime}
            </span>
        </div>
    );
};

export default AttendanceHours