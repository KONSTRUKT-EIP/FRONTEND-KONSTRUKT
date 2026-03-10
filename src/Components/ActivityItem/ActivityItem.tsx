import React from 'react';

interface ActivityItemProps {
  text: string;
  time: string;
  dot: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ text, time, dot }) => (
  <div className="flex items-center gap-5 px-6 py-5">
    <span className={`w-3 h-3 rounded-full shrink-0 ${dot}`} />
    <p className="flex-1 text-lg text-gray-700 truncate">{text}</p>
    <span className="text-base text-gray-400 shrink-0">{time}</span>
  </div>
);

export default ActivityItem;
