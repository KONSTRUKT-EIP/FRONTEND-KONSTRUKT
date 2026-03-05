import React from 'react';

const Pricing: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-extrabold text-orange-500 mb-2">Pricing</h1>
      <p className="text-gray-500 mb-10 text-lg">Choose the plan that fits your team.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow p-8 border border-gray-200 flex flex-col items-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Starter</h2>
          <p className="text-4xl font-extrabold text-orange-500 mb-1">Free</p>
          <p className="text-gray-400 text-sm mb-6">Forever</p>
          <ul className="text-gray-600 text-sm space-y-2 mb-8 w-full">
            <li>✅ 1 worksite</li>
            <li>✅ Basic planning</li>
            <li>✅ Weather alerts</li>
          </ul>
          <button className="w-full py-2 bg-orange-100 text-orange-600 font-semibold rounded-full hover:bg-orange-200 transition">Get started</button>
        </div>
        <div className="bg-orange-500 rounded-2xl shadow p-8 border border-orange-400 flex flex-col items-center scale-105">
          <h2 className="text-xl font-bold text-white mb-2">Pro</h2>
          <p className="text-4xl font-extrabold text-white mb-1">€49</p>
          <p className="text-orange-100 text-sm mb-6">per month</p>
          <ul className="text-white text-sm space-y-2 mb-8 w-full">
            <li>✅ Unlimited worksites</li>
            <li>✅ Advanced planning</li>
            <li>✅ Order management</li>
            <li>✅ Priority support</li>
          </ul>
          <button className="w-full py-2 bg-white text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition">Get started</button>
        </div>
        <div className="bg-white rounded-2xl shadow p-8 border border-gray-200 flex flex-col items-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Enterprise</h2>
          <p className="text-4xl font-extrabold text-orange-500 mb-1">Custom</p>
          <p className="text-gray-400 text-sm mb-6">Contact us</p>
          <ul className="text-gray-600 text-sm space-y-2 mb-8 w-full">
            <li>✅ Everything in Pro</li>
            <li>✅ Custom integrations</li>
            <li>✅ Dedicated account manager</li>
          </ul>
          <button className="w-full py-2 bg-orange-100 text-orange-600 font-semibold rounded-full hover:bg-orange-200 transition">Contact us</button>
        </div>
      </div>
    </main>
  );
};

export default Pricing;
