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
  <div className="flex flex-col gap-3 min-w-[140px]">
    <h2 className="text-lg font-bold text-gray-200 uppercase tracking-widest mb-1" id={`footer-col-${title}`}>{title}</h2>
    <nav aria-labelledby={`footer-col-${title}`}>
      <ul role="list" className="flex flex-col gap-3">
        {links.map(link => (
          <li key={link.to + '-' + link.label}>
            <Link
              to={link.to}
              className="text-lg text-gray-400 hover:text-orange-400 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </div>
);

export default FooterColumn;
