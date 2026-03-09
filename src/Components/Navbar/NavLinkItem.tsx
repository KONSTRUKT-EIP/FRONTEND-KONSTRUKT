import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkItemProps {
  label: string;
  to: string;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({ label, to }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        aria-current={active ? 'page' : undefined}
        className={
          active
            ? 'bg-orange-700 text-white font-semibold rounded-full px-6 py-2 text-[1.08rem]'
            : 'text-gray-800 font-medium hover:text-orange-500 text-[1.08rem]'
        }
      >
        {label}
      </Link>
    </li>
  );
};

export default NavLinkItem;
