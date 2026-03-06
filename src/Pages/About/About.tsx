import React from 'react';

const About: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <h1 className="text-6xl font-extrabold text-orange-500 mb-6">About KONSTRUKT</h1>
        <p className="text-xl text-gray-500 max-w-3xl leading-relaxed">
          KONSTRUKT is an all-in-one platform built for construction professionals.
          We help teams manage worksites, track orders, monitor weather, and plan projects — all from a single, intuitive interface.
        </p>
      </section>

      {/* Mission */}
      <section className="px-10 pb-16 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-12 border border-orange-100 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-xl text-gray-500 leading-relaxed">
            Our mission is to simplify the day-to-day operations of construction teams,
            helping them save time, reduce costs, and work more efficiently — on-site and off-site.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-10 pb-16 max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">What we stand for</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: "🏗️", title: "Built for the field", desc: "Designed with real construction professionals in mind. Every feature solves a real problem." },
            { icon: "⚡", title: "Fast & reliable", desc: "Real-time data and instant updates so your team is always on the same page." },
            { icon: "🔒", title: "Secure by default", desc: "Your data is encrypted and protected. We take security seriously so you don't have to." },
            { icon: "🌍", title: "Built to scale", desc: "From a single worksite to hundreds — KONSTRUKT grows with your business." },
            { icon: "🤝", title: "Customer first", desc: "We listen to our users and ship features that matter. Your feedback shapes our roadmap." },
            { icon: "📊", title: "Data-driven", desc: "Make smarter decisions with clear analytics and reports about your projects." },
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
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Built by a passionate team</h2>
        <p className="text-xl text-gray-500 leading-relaxed">
          KONSTRUKT was founded by engineers and construction experts who experienced first-hand the lack of proper tools in the industry.
          We are committed to building the best platform for construction professionals worldwide.
        </p>
      </section>

    </main>
  );
};

export default About;

