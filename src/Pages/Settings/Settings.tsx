import React from 'react';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
        <Link
          to="/settings/invitations"
          className="mt-8 block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-orange-400"
        >
          <span className="text-lg font-semibold text-gray-900">Invitations organisation</span>
          <span className="mt-2 block text-sm text-gray-600">
            Consulter les invitations, suivre leur statut et gérer les relances.
          </span>
        </Link>
      </div>
    </main>
  );
};

export default Settings;
