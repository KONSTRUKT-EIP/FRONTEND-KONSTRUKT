import React from 'react';
import { Link } from 'react-router-dom';

const Administration: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
          Organisation
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Administration</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Gérez les accès, les invitations et les ressources de votre organisation.
        </p>

        <section className="mt-8 grid gap-5 md:grid-cols-2" aria-label="Outils d’administration">
          <Link
            to="/administration/invitations"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-orange-400 hover:shadow-md"
          >
            <span className="text-lg font-semibold text-gray-900">Invitations</span>
            <span className="mt-2 block text-sm text-gray-600">
              Invitez des collaborateurs, suivez les statuts et relancez les invitations.
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
};

export default Administration;
