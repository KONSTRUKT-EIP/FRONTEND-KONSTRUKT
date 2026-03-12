import React from 'react';
import { Link } from 'react-router-dom';
import FooterColumn from './FooterColumn';
import FooterSocials from './FooterSocials';
import { useAuth } from '../../Context/AuthContext';

const produitLinks = [
  { label: 'Tableau de bord', to: '/dashboard'  },
  { label: 'Planification',   to: '/planning'   },
  { label: 'Météo & Alertes', to: '/weather'    },
  { label: 'Commandes',       to: '/orders'     },
];

const columns = [
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

const Footer: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
  <footer className="w-full bg-gray-900 text-white mt-auto min-h-[220px]">
    <div className="max-w-7xl mx-auto px-10 pt-14 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-[120px]">
          <Link to="/" aria-label="KONSTRUKT – Accueil">
            <div style={{ width: 120, height: 80, minWidth: 120, minHeight: 80, display: 'block' }}>
              <img
                src="/assets/konstrukt_logo.svg"
                alt="Logo KONSTRUKT"
                className="h-20 w-auto brightness-0 invert"
                width="120"
                height="80"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                loading="eager"
                decoding="async"
              />
            </div>
          </Link>
          <p className="text-lg text-gray-400 max-w-xs leading-relaxed">
            La plateforme tout-en-un pour gérer vos chantiers, équipes, commandes et plannings.
          </p>
          <FooterSocials />
        </div>

        {isLoggedIn && (
          <FooterColumn title="Produit" links={produitLinks} />
        )}

        {columns.map(col => (
          <FooterColumn key={col.title} title={col.title} links={col.links} />
        ))}
      </div>

      <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-base text-gray-400">© 2026 KONSTRUKT. Tous droits réservés.</p>
        <nav aria-label="Liens légaux" className="flex gap-6 text-base text-gray-400">
          <a href="#" className="hover:text-orange-400 transition-colors">Politique de confidentialité</a>
          <a href="#" className="hover:text-orange-400 transition-colors">Conditions d&apos;utilisation</a>
        </nav>
      </div>

    </div>
  </footer>
  );
};

export default Footer;
