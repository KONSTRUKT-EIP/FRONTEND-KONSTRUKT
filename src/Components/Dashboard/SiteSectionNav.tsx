import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SiteSectionNavProps {
  siteId: string;
}

export default function SiteSectionNav({ siteId }: SiteSectionNavProps) {
  const { pathname } = useLocation();
  const links = [
    { label: 'Vue d’ensemble', to: `/dashboard/${siteId}`, icon: '⌂' },
    { label: 'Réception des plans', to: `/dashboard/${siteId}/reception-plans`, icon: '▤' },
    { label: 'Équipe', to: `/dashboard/${siteId}/equipe`, icon: '♙' },
  ];

  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-5 lg:w-56 lg:self-start" aria-label="Navigation du chantier">
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Espace chantier</p>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {links.map(({ label, to, icon }) => {
            const active = pathname === to || (to.endsWith('/equipe') && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${active ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <span aria-hidden="true" className="w-4 text-center text-base">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}