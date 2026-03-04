import React from 'react';
import { Link } from 'react-router-dom';
import NavLinkItem from './NavLinkItem';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between bg-gray-100 px-8 py-3.5 shadow-sm min-h-[66px]">
      <div className="flex items-center gap-8">
        <Link to="/">
          <img src="assets/Konstrukt_logo-removebg-preview.png" alt="Konstrukt Logo" className="h-14 w-auto" />
        </Link>
        <ul className="flex items-center gap-8 text-[1.08rem] font-semibold">
          <NavLinkItem label="Dashboard" to="/dashboard" />
          <NavLinkItem label="Orders" to="/orders" />
          <NavLinkItem label="Weather & Alerts" to="/weather" />
          <NavLinkItem label="Worksites" to="/worksites" />
          <NavLinkItem label="Planning" to="/planning" />
          <NavLinkItem label="Settings" to="/settings" />
        </ul>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/" className="px-5 py-2 text-[1.08rem] font-medium text-gray-800 hover:text-orange-500 border border-gray-300 rounded-full hover:border-orange-400 transition">
          Sign in
        </Link>
        <Link to="/signup" className="px-5 py-2 text-[1.08rem] font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition">
          Sign up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
