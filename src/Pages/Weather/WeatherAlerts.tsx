import React from 'react';

interface WeatherAlert {
  title: string;
  description: string;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

const WeatherAlerts = ({ alerts }: WeatherAlertsProps) => {
  if (!alerts || alerts.length === 0) return null;
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Alertes météo</h2>
      <ul className="list-disc pl-6">
        {alerts.map((alert, idx) => (
          <li key={idx} className="text-red-600 font-medium">
            <span aria-label="Titre de l'alerte">{alert.title}</span> - <span aria-label="Description de l'alerte">{alert.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherAlerts;
