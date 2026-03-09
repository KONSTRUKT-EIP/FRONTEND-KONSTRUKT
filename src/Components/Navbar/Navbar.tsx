import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavLinkItem from './NavLinkItem';
import { useAuth } from '../../Context/AuthContext';

const Navbar: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav aria-label="Navigation principale" className="w-full flex items-center justify-between bg-gray-100 px-8 py-3.5 shadow-sm min-h-[66px]">
      <div className="flex items-center gap-8">
        <Link to="/">
          <img
            src="/assets/konstrukt_logo.svg"
            alt="Konstrukt Logo"
            width="93"
            height="55"
            className="h-[55px] w-[93px]"
            fetchPriority="high"
            loading="eager"
          />
        </Link>
        <ul role="list" className="flex items-center gap-10 text-[1.08rem] font-semibold">
          {isLoggedIn ? (
            <>
              <NavLinkItem label="Tableau de bord" to="/dashboard" />
              <NavLinkItem label="Commandes" to="/orders" />
              <NavLinkItem label="Météo & Alertes" to="/weather" />
              <NavLinkItem label="Chantiers" to="/worksites" />
              <NavLinkItem label="Planning" to="/planning" />
              <NavLinkItem label="Paramètres" to="/settings" />
            </>
          ) : (
            <>
              <NavLinkItem label="À propos" to="/about" />
              <NavLinkItem label="Tarifs" to="/pricing" />
            </>
          )}
        </ul>
      </div>
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <Link to='/'
            className="px-5 py-2 text-[1.08rem] font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Déconnexion
          </Link>
        ) : (
          <>
            <Link to="/signin" className="px-5 py-2 text-[1.08rem] font-medium text-gray-800 hover:text-orange-500 border border-gray-300 rounded-full hover:border-orange-400 transition">
              Se connecter
            </Link>
            <Link to="/signup" className="px-5 py-2 text-[1.08rem] font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition">
              S&apos;inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

