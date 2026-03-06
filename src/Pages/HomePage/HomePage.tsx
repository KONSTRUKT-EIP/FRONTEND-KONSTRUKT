import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-100 p-10">
        <h1 className="text-4xl font-extrabold text-orange-500 mb-2">Welcome back 👋</h1>
        <p className="text-gray-500 mb-10">Here&apos;s a quick overview of your workspace.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/orders" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">📦 Orders</h2>
            <p className="text-gray-500 text-sm">View and manage your current orders.</p>
          </Link>
          <Link to="/worksites" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">🏗️ Worksites</h2>
            <p className="text-gray-500 text-sm">Track your active construction sites.</p>
          </Link>
          <Link to="/planning" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">📅 Planning</h2>
            <p className="text-gray-500 text-sm">Check your upcoming schedule and tasks.</p>
          </Link>
          <Link to="/weather" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">🌤️ Weather</h2>
            <p className="text-gray-500 text-sm">Get weather alerts for your worksites.</p>
          </Link>
          <Link to="/settings" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">⚙️ Settings</h2>
            <p className="text-gray-500 text-sm">Manage your account and preferences.</p>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-2xl w-full text-center p-10 bg-white/80 rounded-3xl shadow-2xl border border-orange-100">
        <h1 className="text-5xl font-extrabold text-orange-500 mb-4 drop-shadow-lg">Welcome to KONSTRUKT</h1>
        <p className="text-lg text-gray-700 mb-8">
          Your all-in-one platform for managing construction projects, weather alerts, planning, and more.<br/>
          Get started by signing in or exploring the dashboard!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/signin" className="px-8 py-3 bg-orange-500 text-white rounded-full font-semibold text-lg shadow hover:bg-orange-600 transition">Sign in</a>
          <a href="/signup" className="px-8 py-3 bg-white border border-orange-400 text-orange-500 rounded-full font-semibold text-lg shadow hover:bg-orange-50 transition">Sign up</a>
        </div>
      </div>
      <div className="mt-12 text-gray-400 text-sm">© 2026 KONSTRUKT. All rights reserved.</div>
    </main>
  );
};

export default HomePage;

