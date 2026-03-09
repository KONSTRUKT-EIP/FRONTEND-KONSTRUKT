import React from 'react';

interface ForecastDay {
  date: string;
  weatherDescription?: string;
  temperatureMax?: number;
  temperatureMin?: number;
  precipitationProbability?: number;
  windSpeedMax?: number;
  sunrise?: string;
  sunset?: string;
}

interface ForecastWeatherData {
  daily: ForecastDay[];
}

interface ForecastWeatherProps {
  data: ForecastWeatherData;
}

const ForecastWeather = ({ data }: ForecastWeatherProps) => {
  if (!data || !data.daily) return null;
  return (
    <div className="bg-white rounded-2xl p-10 shadow-sm">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Prévisions 7 jours</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        {data.daily.map((day, idx) => {
          const isToday = idx === 0;
          const formatTime = (timeString?: string) => {
            if (!timeString) return 'N/A';
            try {
              return new Date(timeString).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
            } catch {
              return 'N/A';
            }
          };

          return (
            <div 
              key={idx} 
              className={`rounded-2xl p-6 text-center transition-all duration-200 hover:shadow-xl cursor-pointer border-2 min-h-[360px] flex flex-col justify-between ${
                isToday 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-700 hover:scale-105' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 border-gray-200 hover:border-orange-400'
              }`}
            >
              <div>
                <div className={`font-bold text-lg mb-2 ${isToday ? 'text-white' : 'text-gray-700'}`}>
                  {isToday ? "Aujourd'hui" : new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}
                </div>
                <div className={`text-base mb-4 min-h-[3rem] flex items-center justify-center font-medium ${isToday ? 'text-blue-50' : 'text-gray-600'}`}>
                  {day.weatherDescription || 'N/A'}
                </div>
              </div>

              <div className="my-4">
                <div className="flex justify-center items-baseline gap-3 mb-4">
                  <div className={`text-4xl font-bold ${isToday ? 'text-yellow-300' : 'text-orange-600'}`}>
                    {day.temperatureMax ?? 'N/A'}°
                  </div>
                  <div className={`text-2xl font-semibold ${isToday ? 'text-blue-200' : 'text-blue-500'}`}>
                    {day.temperatureMin ?? 'N/A'}°
                  </div>
                </div>

                <div className="space-y-2">
                  <div className={`flex items-center justify-center gap-2 text-base ${isToday ? 'text-blue-100' : 'text-gray-700'}`}>
                    <span className="text-xl" aria-label="Humidité">💧</span>
                    <span className="font-semibold">{day.precipitationProbability ?? 0}%</span>
                  </div>
                  <div className={`flex items-center justify-center gap-2 text-base ${isToday ? 'text-blue-100' : 'text-gray-600'}`}>
                    <span className="text-xl" aria-label="Vent">🌬️</span>
                    <span className="font-semibold">{day.windSpeedMax ?? 'N/A'} km/h</span>
                  </div>
                </div>
              </div>

              <div className={`text-sm mt-4 pt-4 space-y-1 ${
                isToday 
                  ? 'border-t border-blue-400 text-blue-100' 
                  : 'border-t border-gray-300 text-gray-500'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg" aria-label="Lever du soleil">☀️</span>
                  <span className="font-medium">{formatTime(day.sunrise)}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg" aria-label="Coucher du soleil">🌙</span>
                  <span className="font-medium">{formatTime(day.sunset)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default ForecastWeather;
