import React, { useEffect, useState } from 'react';
import CurrentWeather from './CurrentWeather';
import ForecastWeather from './ForecastWeather';

const API_BASE = 'http://localhost:3000/weather';


const chantierVille = "Paris";

const WeatherPage = () => {
  const [city, setCity] = useState(chantierVille);
  const [searchCity, setSearchCity] = useState(chantierVille);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city || city.trim() === '') {
      return;
    }
    let isMounted = true;
    
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/forecast?city=${encodeURIComponent(city.trim())}`);
        if (!res.ok) {
          throw new Error('Erreur réseau');
        }
        const data = await res.json();
        if (isMounted) {
          setWeatherData(data);
          setError(null);
        }
      } catch (err) {
        console.error('Erreur météo:', err);
        if (isMounted) {
          setError(`Impossible de récupérer la météo pour "${city}"`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWeatherData();

    return () => {
      isMounted = false;
    };
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity && searchCity.trim() !== '') {
      setCity(searchCity.trim());
      setError(null);
    }
  };

  if (loading && !weatherData) return (
    <div className="bg-gray-100">
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-5">
        <div className="max-w-full mx-auto px-4">
          <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-1">Konstrukt</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Météo & Alertes</h1>
        </div>
      </div>
      <div className="max-w-full mx-auto px-8 py-10">
        <div className="bg-white rounded-2xl p-12 shadow-sm flex items-center justify-center">
          <span aria-live="polite" className="text-2xl font-semibold text-gray-600">Chargement...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 pb-10">
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-5">
        <div className="max-w-full mx-auto px-4">
          <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-1">Konstrukt</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Météo & Alertes</h1>
          <p className="text-blue-200 text-sm mt-1">Prévisions météorologiques détaillées</p>
        </div>
      </div>

      {/* Content */}
      <main role="main" className="max-w-full mx-auto px-8 py-10" aria-label="Page météo et alertes">
        {/* Sélection de la ville */}
        <div className="mb-8 bg-white rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm" role="alert">
              {error}
            </div>
          )}
          <form
            className="flex flex-col sm:flex-row items-center gap-4"
            aria-label="Sélection de la ville"
            onSubmit={handleSearch}
          >
            <label htmlFor="city" className="font-bold text-xl text-gray-700" aria-label="Ville">
              Ville :
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={searchCity}
              onChange={e => setSearchCity(e.target.value)}
              placeholder={chantierVille}
              className="border border-gray-300 rounded-xl px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent w-full sm:w-auto flex-1 max-w-2xl"
              aria-label="Entrer le nom de la ville"
              autoComplete="address-level2"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Rechercher la météo"
            >
              Rechercher
            </button>
          </form>
          {loading && weatherData && (
            <div className="mt-4 text-center text-gray-600 text-sm">
              Mise à jour en cours...
            </div>
          )}
        </div>

        {weatherData && (
          <>
            {/* Conditions actuelles */}
            <section aria-label="Conditions météo actuelles" className="mb-8">
              <CurrentWeather data={weatherData} />
            </section>

            {/* Prévisions */}
            <section aria-label="Prévisions météo">
              <ForecastWeather data={weatherData} />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default WeatherPage;
