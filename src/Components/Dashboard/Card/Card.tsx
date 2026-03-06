import React, { ReactNode } from 'react';

interface CardProps {
icon: ReactNode
iconBg: string
iconColor: string
name: string
percentage: number
spent: number
}

export function Card ({icon, iconBg, iconColor, name, percentage, spent}: CardProps){

    const formattedSpent = new Intl.NumberFormat("fr-FR").format(spent);
    return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Icon badge */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
          {name}
        </span>
        <span className="text-2xl font-bold text-gray-800 leading-tight">
          {percentage}%
        </span>
        <span className="text-xs text-gray-400 mt-0.5">
          {formattedSpent} € dépensés
        </span>
      </div>
    </div>
    )
}