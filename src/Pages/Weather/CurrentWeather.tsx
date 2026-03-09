import React from 'react';

interface CurrentWeatherData {
  current: {
    temperature: number | null;
    weatherDescription: string;
    feelsLike: number | null;
    humidity: number | null;
    windSpeed: number | null;
    precipitation: number;
    windDirection: number | null;
  };
  latitude: number;
  longitude: number;
  timezone: string;
}

interface CurrentWeatherProps {
  data: CurrentWeatherData;
}

const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  if (!data || !data.current) return null;
  const { current, latitude, longitude, timezone } = data;
  
  const getWeatherBackground = (description: string) => {
    const desc = description?.toLowerCase() || '';
    
    if (desc.includes('pluie') || desc.includes('averse') || desc.includes('pluvieux') || 
        desc.includes('bruine') || desc.includes('orage') || desc.includes('précipitation')) {
      return '/assets/pluie.jpg';
    } else if (desc.includes('soleil') || desc.includes('ensoleillé') || desc.includes('clair') || 
               desc.includes('dégagé') || desc.includes('beau')) {
      return '/assets/soleil.png';
    } else if (desc.includes('nuage') || desc.includes('nuageux') || desc.includes('couvert') || 
               desc.includes('brume') || desc.includes('brouillard')) {
      return '/assets/nuage.jpg';
    }
    return '/assets/nuage.jpg';
  };

  const backgroundImage = getWeatherBackground(current.weatherDescription);
  
  return (
    <div className="bg-white rounded-2xl p-10 shadow-sm">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Conditions actuelles</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Météo principale */}
        <div 
          className="flex-1 rounded-xl p-10 text-white min-h-[280px] flex flex-col justify-center relative overflow-hidden"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Contenu */}
          <div className="relative z-10">
            <div className="text-7xl font-bold mb-4">{current.temperature ?? 'N/A'}°C</div>
            <div className="text-3xl mb-2">{current.weatherDescription || 'N/A'}</div>
            <div className="text-white/90 text-xl">Ressenti {current.feelsLike ?? 'N/A'}°C</div>
          </div>
        </div>

        {/* Détails */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
            <div className="text-orange-600 text-4xl mb-2">💧</div>
            <div className="text-base text-gray-600 mb-2">Humidité</div>
            <div className="text-4xl font-bold text-gray-800">{current.humidity ?? 'N/A'}%</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="text-blue-600 text-4xl mb-2">🌬️</div>
            <div className="text-base text-gray-600 mb-2">Vent</div>
            <div className="text-4xl font-bold text-gray-800">{current.windSpeed ?? 'N/A'} km/h</div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6">
            <div className="text-cyan-600 text-4xl mb-2">🌧️</div>
            <div className="text-base text-gray-600 mb-2">Précipitations</div>
            <div className="text-4xl font-bold text-gray-800">{current.precipitation ?? 0} mm</div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6">
            <div className="text-indigo-600 text-4xl mb-2">🧭</div>
            <div className="text-base text-gray-600 mb-2">Direction</div>
            <div className="text-4xl font-bold text-gray-800">{current.windDirection ?? 'N/A'}°</div>
          </div>
        </div>
      </div>
      
      <div className="text-base text-gray-500 mt-6 pt-6 border-t border-gray-200">
        📍 {latitude.toFixed(2)}, {longitude.toFixed(2)} • {timezone}
      </div>
    </div>
  );
};

export default CurrentWeather;
