import React from 'react';
import { Link } from 'react-router-dom';

export interface FooterLink {
  label: string;
  to: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => (
  <div className="flex flex-col gap-3">
    <h4 className="text-lg font-bold text-gray-200 uppercase tracking-widest mb-1">{title}</h4>
    {links.map(link => (
      <Link
        key={link.to}
        to={link.to}
        className="text-lg text-gray-400 hover:text-orange-400 transition-colors"
      >
        {link.label}
      </Link>
    ))}
  </div>
);

export default FooterColumn;
