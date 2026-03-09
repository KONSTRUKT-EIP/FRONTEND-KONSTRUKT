import React from 'react';

const Pricing: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <h1 className="text-6xl font-extrabold text-orange-500 mb-4">Des tarifs simples et transparents</h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Que vous soyez un entrepreneur indépendant ou une grande entreprise du BTP, KONSTRUKT a une offre pour vous.
          Sans frais cachés. Résiliable à tout moment.
        </p>
      </section>

      {/* Plans */}
      <section className="px-10 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-6xl mx-auto">

          {/* Starter */}
          <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-200 flex flex-col items-center hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <span className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">Starter</span>
            <p className="text-6xl font-extrabold text-gray-900 mb-1">Gratuit</p>
            <p className="text-gray-400 text-base mb-8">Idéal pour commencer</p>
            <ul className="text-gray-600 text-base space-y-3 mb-10 w-full">
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>1 chantier</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Planning de base</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Alertes météo</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Jusqu&apos;à 3 utilisateurs</li>
            </ul>
            <button className="w-full mt-auto py-3 text-lg bg-orange-100 text-orange-600 font-semibold rounded-full hover:bg-orange-200 transition">Commencer gratuitement</button>
          </div>

          {/* Pro */}
          <div className="bg-orange-500 rounded-3xl shadow-2xl p-10 border border-orange-400 flex flex-col items-center justify-between hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <span className="text-sm font-semibold text-white uppercase tracking-widest mb-3">Pro</span>
            <div className="flex items-end gap-1 mb-1">
              <p className="text-6xl font-extrabold text-white">€49</p>
              <span className="text-white text-lg mb-2">/mois</span>
            </div>
            <p className="text-orange-100 text-base mb-8">Idéal pour les équipes en croissance</p>
            <ul className="text-white text-base space-y-3 mb-10 w-full">
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>Chantiers illimités</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>Planning avancé</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>Alertes météo</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>Gestion des commandes</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>Jusqu&apos;à 20 utilisateurs</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>Support prioritaire</li>
            </ul>
            <button className="w-full py-3 text-lg bg-white text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition">Démarrer le plan Pro</button>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-200 flex flex-col items-center justify-between hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <span className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">Enterprise</span>
            <p className="text-6xl font-extrabold text-gray-900 mb-1">Sur mesure</p>
            <p className="text-gray-400 text-base mb-8">Adapté aux grandes entreprises</p>
            <ul className="text-gray-600 text-base space-y-3 mb-10 w-full">
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Tout ce qui est dans Pro</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Utilisateurs illimités</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Intégrations personnalisées</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Responsable de compte dédié</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Garantie SLA</li>
              <li className="flex items-center gap-3"><span aria-hidden="true" className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Formation sur site</li>
            </ul>
            <button className="w-full py-3 text-lg bg-orange-100 text-orange-600 font-semibold rounded-full hover:bg-orange-200 transition">Nous contacter</button>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="px-10 pb-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Questions fréquentes</h2>
        <div className="space-y-5">
          {[
            { q: "Puis-je changer de plan à tout moment ?", a: "Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment depuis la page Paramètres." },
            { q: "Y a-t-il un essai gratuit pour le plan Pro ?", a: "Oui, nous offrons 14 jours d'essai gratuit pour le plan Pro. Aucune carte bancaire requise." },
            { q: "Quels moyens de paiement sont acceptés ?", a: "Nous acceptons toutes les principales cartes bancaires, PayPal et les virements bancaires pour les plans Enterprise." },
            { q: "Que se passe-t-il si j'annule ?", a: "Vous conservez l'accès à votre plan jusqu'à la fin de la période de facturation. Aucun frais après cela." },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <p className="text-lg font-semibold text-gray-800 mb-1">{q}</p>
              <p className="text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
};

export default Pricing;

