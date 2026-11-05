import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpDown, Check, Search } from 'lucide-react';

export type SiteSortKey =
  | 'name-asc'
  | 'name-desc'
  | 'end-asc'
  | 'end-desc'
  | 'start-desc'
  | 'start-asc'
  | 'progress-desc'
  | 'progress-asc';

const sortOptions: { key: SiteSortKey; label: string; group: string }[] = [
  { key: 'name-asc', label: 'A → Z', group: 'Nom' },
  { key: 'name-desc', label: 'Z → A', group: 'Nom' },
  { key: 'end-asc', label: 'La plus proche', group: 'Date de fin' },
  { key: 'end-desc', label: 'La plus lointaine', group: 'Date de fin' },
  { key: 'start-desc', label: 'La plus récente', group: 'Date de début' },
  { key: 'start-asc', label: 'La plus ancienne', group: 'Date de début' },
  { key: 'progress-desc', label: 'Plus avancés', group: 'Avancement' },
  { key: 'progress-asc', label: 'Moins avancés', group: 'Avancement' },
];

interface SortableSite {
  name: string;
  location: string;
  startDate?: string;
  endDate?: string | null;
  progressPct?: number | null;
}

const time = (value?: string | null) => (value ? new Date(value).getTime() : null);

// Compare deux valeurs en plaçant toujours les valeurs manquantes en dernier
const compareNullable = (a: number | null | undefined, b: number | null | undefined, direction: 1 | -1) => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return (a - b) * direction;
};

// Filtre par nom ou ville, puis trie selon le critère choisi
export function filterAndSortSites<T extends SortableSite>(sites: T[], search: string, sortKey: SiteSortKey): T[] {
  const query = search.trim().toLowerCase();
  const filtered = query
    ? sites.filter((s) => s.name.toLowerCase().includes(query) || s.location.toLowerCase().includes(query))
    : sites;

  return [...filtered].sort((a, b) => {
    switch (sortKey) {
      case 'name-asc':
        return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
      case 'name-desc':
        return b.name.localeCompare(a.name, 'fr', { sensitivity: 'base' });
      case 'end-asc':
        return compareNullable(time(a.endDate), time(b.endDate), 1);
      case 'end-desc':
        return compareNullable(time(a.endDate), time(b.endDate), -1);
      case 'start-desc':
        return compareNullable(time(a.startDate), time(b.startDate), -1);
      case 'start-asc':
        return compareNullable(time(a.startDate), time(b.startDate), 1);
      case 'progress-desc':
        return compareNullable(a.progressPct, b.progressPct, -1);
      case 'progress-asc':
        return compareNullable(a.progressPct, b.progressPct, 1);
    }
  });
}

interface SiteListToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortKey: SiteSortKey;
  onSortChange: (key: SiteSortKey) => void;
  resultCount?: number;
}

const SiteListToolbar: React.FC<SiteListToolbarProps> = ({
  search,
  onSearchChange,
  sortKey,
  onSortChange,
  resultCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const current = sortOptions.find((option) => option.key === sortKey) ?? sortOptions[0];

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const groups = [...new Set(sortOptions.map((option) => option.group))];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[16rem] max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
        <input
          type="search"
          placeholder="Rechercher un chantier ou une ville…"
          aria-label="Rechercher un chantier"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400"
        />
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowUpDown className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <span className="text-gray-500">Trier :</span>
          <span className="font-semibold text-gray-900">
            {current.group} · {current.label}
          </span>
        </button>

        {isOpen && (
          <div
            role="menu"
            className="absolute right-0 sm:left-0 sm:right-auto z-20 mt-2 w-64 rounded-xl bg-white shadow-lg ring-1 ring-gray-200 py-2"
          >
            {groups.map((group) => (
              <div key={group} className="py-1">
                <p className="px-4 pt-1 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">{group}</p>
                {sortOptions
                  .filter((option) => option.group === group)
                  .map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      role="menuitemradio"
                      aria-checked={option.key === sortKey}
                      onClick={() => {
                        onSortChange(option.key);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                        option.key === sortKey ? 'font-semibold text-orange-600' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                      {option.key === sortKey && <Check className="w-4 h-4" aria-hidden="true" />}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {resultCount !== undefined && (
        <span className="text-sm text-gray-500">
          {resultCount} chantier{resultCount > 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

export default SiteListToolbar;
