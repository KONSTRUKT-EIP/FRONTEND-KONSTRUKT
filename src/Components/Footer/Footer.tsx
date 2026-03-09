import React from 'react';
import { Link } from 'react-router-dom';
import FooterColumn from './FooterColumn';
import FooterSocials from './FooterSocials';

const columns = [
  {
    title: 'Produit',
    links: [
      { label: 'Dashboard',       to: '/dashboard'  },
      { label: 'Planification',   to: '/planning'   },
      { label: 'Météo & Alertes', to: '/weather'    },
      { label: 'Commandes',       to: '/orders'     },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos',  to: '/about'   },
      { label: 'Tarifs',    to: '/pricing' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Documentation', to: '#' },
      { label: 'Contact',       to: '#' },
      { label: 'Statut',        to: '#' },
    ],
  },
];

const Footer: React.FC = () => (
  <footer className="w-full bg-gray-900 text-white mt-auto">
    <div className="max-w-7xl mx-auto px-10 pt-14 pb-8">

      {/* Top row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

        {/* Brand */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Link to="/">
            <img
              src="/assets/Konstrukt_logo-removebg-preview.png"
              alt="Konstrukt Logo"
              className="h-20 w-auto brightness-0 invert"
            />
          </Link>
          <p className="text-lg text-gray-400 max-w-xs leading-relaxed">
            La plateforme tout-en-un pour gérer vos chantiers, équipes, commandes et plannings.
          </p>
          <FooterSocials />
        </div>

        {/* Columns */}
        {columns.map(col => (
          <FooterColumn key={col.title} title={col.title} links={col.links} />
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-base text-gray-500">© 2026 KONSTRUKT. Tous droits réservés.</p>
        <div className="flex gap-6 text-base text-gray-500">
          <a href="#" className="hover:text-orange-400 transition-colors">Politique de confidentialité</a>
          <a href="#" className="hover:text-orange-400 transition-colors">Conditions d&apos;utilisation</a>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;
