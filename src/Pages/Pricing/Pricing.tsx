import React from 'react';

const Pricing: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <h1 className="text-6xl font-extrabold text-orange-500 mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Whether you&apos;re a solo contractor or a large construction company, KONSTRUKT has a plan for you.
          No hidden fees. Cancel anytime.
        </p>
      </section>

      {/* Plans */}
      <section className="px-10 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-6xl mx-auto">

          {/* Starter */}
          <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-200 flex flex-col items-center">
            <span className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">Starter</span>
            <p className="text-6xl font-extrabold text-gray-900 mb-1">Free</p>
            <p className="text-gray-400 text-base mb-8">Perfect to get started</p>
            <ul className="text-gray-600 text-base space-y-3 mb-10 w-full">
              <li className="flex items-center gap-2">✅ 1 worksite</li>
              <li className="flex items-center gap-2">✅ Basic planning</li>
              <li className="flex items-center gap-2">✅ Weather alerts</li>
              <li className="flex items-center gap-2">✅ Up to 3 users</li>
              <li className="flex items-center gap-2 text-gray-300">❌ Order management</li>
              <li className="flex items-center gap-2 text-gray-300">❌ Priority support</li>
            </ul>
            <button className="w-full py-3 text-lg bg-orange-100 text-orange-600 font-semibold rounded-full hover:bg-orange-200 transition">Get started for free</button>
          </div>

          {/* Pro */}
          <div className="bg-orange-500 rounded-3xl shadow-2xl p-10 border border-orange-400 flex flex-col items-center scale-105">
            <span className="text-sm font-semibold text-white uppercase tracking-widest mb-3">Pro</span>
            <div className="flex items-end gap-1 mb-1">
              <p className="text-6xl font-extrabold text-white">€49</p>
              <span className="text-white text-lg mb-2">/mo</span>
            </div>
            <p className="text-orange-100 text-base mb-8">Best for growing teams</p>
            <ul className="text-white text-base space-y-3 mb-10 w-full">
              <li className="flex items-center gap-2">✅ Unlimited worksites</li>
              <li className="flex items-center gap-2">✅ Advanced planning</li>
              <li className="flex items-center gap-2">✅ Weather alerts</li>
              <li className="flex items-center gap-2">✅ Order management</li>
              <li className="flex items-center gap-2">✅ Up to 20 users</li>
              <li className="flex items-center gap-2">✅ Priority support</li>
            </ul>
            <button className="w-full py-3 text-lg bg-white text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition">Start Pro plan</button>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-200 flex flex-col items-center">
            <span className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">Enterprise</span>
            <p className="text-6xl font-extrabold text-gray-900 mb-1">Custom</p>
            <p className="text-gray-400 text-base mb-8">Tailored for large companies</p>
            <ul className="text-gray-600 text-base space-y-3 mb-10 w-full">
              <li className="flex items-center gap-2">✅ Everything in Pro</li>
              <li className="flex items-center gap-2">✅ Unlimited users</li>
              <li className="flex items-center gap-2">✅ Custom integrations</li>
              <li className="flex items-center gap-2">✅ Dedicated account manager</li>
              <li className="flex items-center gap-2">✅ SLA guarantee</li>
              <li className="flex items-center gap-2">✅ On-site training</li>
            </ul>
            <button className="w-full py-3 text-lg bg-orange-100 text-orange-600 font-semibold rounded-full hover:bg-orange-200 transition">Contact us</button>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="px-10 pb-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Frequently asked questions</h2>
        <div className="space-y-5">
          {[
            { q: "Can I change my plan at any time?", a: "Yes, you can upgrade or downgrade your plan at any time from the Settings page." },
            { q: "Is there a free trial for Pro?", a: "Yes, we offer a 14-day free trial for the Pro plan. No credit card required." },
            { q: "What payment methods are accepted?", a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans." },
            { q: "What happens when I cancel?", a: "You will retain access to your plan until the end of the billing period. No charges after that." },
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

