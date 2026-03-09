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
          <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-200 flex flex-col items-center hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <span className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">Starter</span>
            <p className="text-6xl font-extrabold text-gray-900 mb-1">Free</p>
            <p className="text-gray-400 text-base mb-8">Perfect to get started</p>
            <ul className="text-gray-600 text-base space-y-3 mb-10 w-full">
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>1 worksite</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Basic planning</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Weather alerts</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Up to 3 users</li>
            </ul>
            <button className="w-full mt-auto py-3 text-lg bg-orange-100 text-orange-600 font-semibold rounded-full hover:bg-orange-200 transition">Get started for free</button>
          </div>

          {/* Pro */}
          <div className="bg-orange-500 rounded-3xl shadow-2xl p-10 border border-orange-400 flex flex-col items-center justify-between hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <span className="text-sm font-semibold text-white uppercase tracking-widest mb-3">Pro</span>
            <div className="flex items-end gap-1 mb-1">
              <p className="text-6xl font-extrabold text-white">€49</p>
              <span className="text-white text-lg mb-2">/mo</span>
            </div>
            <p className="text-orange-100 text-base mb-8">Best for growing teams</p>
            <ul className="text-white text-base space-y-3 mb-10 w-full">
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>Unlimited worksites</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>Advanced planning</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>Weather alerts</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>Order management</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>Up to 20 users</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>Priority support</li>
            </ul>
            <button className="w-full py-3 text-lg bg-white text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition">Start Pro plan</button>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-200 flex flex-col items-center justify-between hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <span className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">Enterprise</span>
            <p className="text-6xl font-extrabold text-gray-900 mb-1">Custom</p>
            <p className="text-gray-400 text-base mb-8">Tailored for large companies</p>
            <ul className="text-gray-600 text-base space-y-3 mb-10 w-full">
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Everything in Pro</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Unlimited users</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Custom integrations</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>Dedicated account manager</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>SLA guarantee</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>On-site training</li>
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

