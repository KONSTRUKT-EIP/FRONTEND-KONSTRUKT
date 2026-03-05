import React from 'react';

const About: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-10">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl p-10 border border-orange-100">
        <h1 className="text-4xl font-extrabold text-orange-500 mb-4">About KONSTRUKT</h1>
        <p className="text-gray-600 text-lg mb-6">
          KONSTRUKT is an all-in-one platform designed for construction professionals.
          Manage your worksites, track orders, monitor weather alerts, and plan your projects — all in one place.
        </p>
        <p className="text-gray-500 text-base">
          Our mission is to simplify the day-to-day operations of construction teams, helping them save time and work more efficiently.
        </p>
      </div>
    </main>
  );
};

export default About;
