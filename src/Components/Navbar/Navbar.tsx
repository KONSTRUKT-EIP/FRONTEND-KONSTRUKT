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
        <Link to="/" aria-label="KONSTRUKT – Accueil">
          <img src="/assets/Konstrukt_logo-removebg-preview.png" alt="" className="h-17 w-auto" />
        </Link>
        <ul role="list" className="flex items-center gap-10 text-[1.08rem] font-semibold">
          {isLoggedIn ? (
            <>
              <NavLinkItem label="Dashboard" to="/dashboard" />
              <NavLinkItem label="Orders" to="/orders" />
              <NavLinkItem label="Weather & Alerts" to="/weather" />
              <NavLinkItem label="Worksites" to="/worksites" />
              <NavLinkItem label="Planning" to="/planning" />
              <NavLinkItem label="Settings" to="/settings" />
            </>
          ) : (
            <>
              <NavLinkItem label="About" to="/about" />
              <NavLinkItem label="Pricing" to="/pricing" />
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
            Log out
          </Link>
        ) : (
          <>
            <Link to="/signin" className="px-5 py-2 text-[1.08rem] font-medium text-gray-800 hover:text-orange-700 border border-gray-300 rounded-full hover:border-orange-400 transition">
              Sign in
            </Link>
            <Link to="/signup" className="px-5 py-2 text-[1.08rem] font-semibold text-white bg-orange-700 rounded-full hover:bg-orange-600 transition">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

