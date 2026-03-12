import React from 'react';

const About: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <h1 className="text-6xl font-extrabold text-orange-500 mb-6">À propos de KONSTRUKT</h1>
        <p className="text-xl text-gray-500 max-w-3xl leading-relaxed">
          KONSTRUKT est une plateforme tout-en-un conçue pour les professionnels du bâtiment.
          Nous aidons les équipes à gérer les chantiers, suivre les commandes, surveiller la météo et planifier les projets — depuis une interface unique et intuitive.
        </p>
      </section>

      {/* Mission */}
      <section className="px-10 pb-16 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-12 border border-orange-100 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Notre Mission</h2>
          <p className="text-xl text-gray-500 leading-relaxed">
            Notre mission est de simplifier le quotidien des équipes de construction,
            en les aidant à gagner du temps, réduire les coûts et travailler plus efficacement — sur site et à distance.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-10 pb-16 max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">Nos valeurs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: "🏗️", title: "Conçu pour le terrain", desc: "Pensé avec de vrais professionnels du bâtiment. Chaque fonctionnalité résout un vrai problème." },
            { icon: "⚡", title: "Rapide & fiable", desc: "Données en temps réel et mises à jour instantanées pour que votre équipe soit toujours synchronisée." },
            { icon: "🔒", title: "Sécurisé par défaut", desc: "Vos données sont chiffrées et protégées. Nous prenons la sécurité au sérieux pour vous." },
            { icon: "🌍", title: "Conçu pour grandir", desc: "D'un chantier à des centaines — KONSTRUKT évolue avec votre entreprise." },
            { icon: "🤝", title: "Client avant tout", desc: "Nous écoutons nos utilisateurs et livrons les fonctionnalités qui comptent. Votre retour guide notre feuille de route." },
            { icon: "📊", title: "Orienté données", desc: "Prenez de meilleures décisions grâce à des analyses et rapports clairs sur vos projets." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl shadow p-8 border border-gray-100 flex flex-col gap-3">
              <span className="text-4xl">{icon}</span>
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <p className="text-gray-500 text-base">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="px-10 pb-20 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Construit par une équipe passionnée</h2>
        <p className="text-xl text-gray-500 leading-relaxed">
          KONSTRUKT a été fondé par des ingénieurs et experts du bâtiment qui ont vécu de près le manque d&apos;outils adaptés dans le secteur.
          Nous nous engageons à construire la meilleure plateforme pour les professionnels du BTP dans le monde entier.
        </p>
      </section>

    </main>
  );
};

export default About;

