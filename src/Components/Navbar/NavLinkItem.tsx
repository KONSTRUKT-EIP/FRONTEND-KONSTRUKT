import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkItemProps {
  label: string;
  to: string;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({ label, to }) => {
  const location = useLocation();
  const active = location.pathname === to || (label === "Dashboard" && location.pathname.startsWith("/dashboard"));

  return (
    <li>
      <Link
        to={to}
        className={
          active
            ? 'bg-orange-500 text-white font-semibold rounded-full px-6 py-2 text-[1.08rem] hover:bg-orange-600 transition-colors'
            : 'text-gray-900 font-medium hover:text-orange-700 text-[1.08rem]'
        }
      >
        {label}
      </Link>
    </li>
  );
};

export default NavLinkItem;
