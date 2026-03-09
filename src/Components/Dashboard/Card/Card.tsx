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
        <span className="text-lg text-gray-900 font-semibold tracking-wide uppercase">
          {name}
        </span>
        <span className="text-3xl font-bold text-orange-900 leading-tight">
          {percentage}%
        </span>
        <span className="text-md text-gray-800 mt-1 font-medium">
          {formattedSpent} € dépensés
        </span>
      </div>
    </div>
    )
}