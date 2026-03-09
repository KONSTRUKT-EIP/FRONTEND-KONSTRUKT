import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-100 p-10">
        <h1 className="text-4xl font-extrabold text-orange-500 mb-2">Bon retour 👋</h1>
        <p className="text-gray-500 mb-10">Voici un aperçu rapide de votre espace de travail.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/orders" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">📦 Commandes</h2>
            <p className="text-gray-500 text-sm">Consultez et gérez vos commandes en cours.</p>
          </Link>
          <Link to="/worksites" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">🏗️ Chantiers</h2>
            <p className="text-gray-500 text-sm">Suivez vos chantiers actifs.</p>
          </Link>
          <Link to="/planning" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">📅 Planning</h2>
            <p className="text-gray-500 text-sm">Consultez votre planning et vos tâches à venir.</p>
          </Link>
          <Link to="/weather" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">🌤️ Météo</h2>
            <p className="text-gray-500 text-sm">Recevez des alertes météo pour vos chantiers.</p>
          </Link>
          <Link to="/settings" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">⚙️ Paramètres</h2>
            <p className="text-gray-500 text-sm">Gérez votre compte et vos préférences.</p>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-2xl w-full text-center p-10 bg-white/80 rounded-3xl shadow-2xl border border-orange-100">
        <h1 className="text-5xl font-extrabold text-orange-700 mb-4 drop-shadow-lg">Bienvenue sur KONSTRUKT</h1>
        <p className="text-lg text-gray-700 mb-8">
          La plateforme tout-en-un pour gérer vos chantiers, alertes météo, planning et bien plus.<br/>
          Commencez par vous connecter ou explorer le tableau de bord&nbsp;!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/signin" className="px-8 py-3 bg-orange-700 text-white rounded-full font-semibold text-lg shadow hover:bg-orange-600 transition">Se connecter</a>
          <a href="/signup" className="px-8 py-3 bg-white border border-orange-700 text-orange-700 rounded-full font-semibold text-lg shadow hover:bg-orange-50 transition">S&apos;inscrire</a>
        </div>
      </div>
    </main>
  );
};

export default HomePage;

