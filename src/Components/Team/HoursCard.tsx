import React from 'react';

interface HoursCard {
    title: string;
    hours: number;
    description: string;
}

const TeamHours: React.FC<HoursCard> = ({ title, hours, description }) => {
    return (
    <div className="flex-1 bg-gray-100 rounded-2xl mx-4 p-7">
        <div className="grid">
            <span className='gap-1.5 py-2'>
                {title}
            </span>
            <div className='flex text-xl font-bold'>
                <span>
                    {hours}
                </span>
                <p>H</p>
            </div>
            <span className='gap-1.5 py-2'>
                {description}
            </span>
        </div>
    </div>
)};

export default TeamHours