import React, { useEffect, useState } from 'react';
import { KeyRound, Palette, UserRound, type LucideIcon } from 'lucide-react';
import { accountService, CurrentUser } from '../../services/accountService';
import ProfileSection from './ProfileSection';
import SecuritySection from './SecuritySection';
import DisplaySection from './DisplaySection';
import { Feedback } from './SettingsUi';

type Tab = 'profil' | 'securite' | 'affichage';

const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'profil', label: 'Profil', icon: UserRound },
  { id: 'securite', label: 'Sécurité', icon: KeyRound },
  { id: 'affichage', label: 'Affichage', icon: Palette },
];

const initialTab = (): Tab => {
  const hash = window.location.hash.replace('#', '');
  return tabs.some((tab) => tab.id === hash) ? (hash as Tab) : 'profil';
};

const Settings: React.FC = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  useEffect(() => {
    let active = true;
    accountService
      .getMe()
      .then((me) => {
        if (active) setUser(me);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Impossible de charger vos informations.');
      });
    return () => {
      active = false;
    };
  }, []);

  // Un lien vers /settings#securite doit aussi changer d'onglet quand la page est déjà ouverte
  useEffect(() => {
    const handleHashChange = () => setActiveTab(initialTab());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const currentTab = activeTab;

  const selectTab = (tab: Tab) => {
    setActiveTab(tab);
    window.history.replaceState(null, '', `#${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Paramètres</h1>
          <p className="mt-1 text-gray-600">Gérez votre compte, votre sécurité et l'affichage.</p>
        </header>

        {error ? (
          <Feedback type="error">{error}</Feedback>
        ) : !user ? (
          <div className="grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-8">
            <div className="h-32 rounded-2xl bg-white/70 animate-pulse" />
            <div className="h-96 rounded-2xl bg-white/70 animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-8 items-start">
            <nav aria-label="Sections des paramètres" className="lg:sticky lg:top-6">
              <ul className="flex lg:flex-col gap-1 overflow-x-auto">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => selectTab(id)}
                      aria-current={currentTab === id ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                        currentTab === id
                          ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-200/70'
                          : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="min-w-0">
              {currentTab === 'profil' && (
                <ProfileSection user={user} onUpdated={setUser} />
              )}
              {currentTab === 'securite' && <SecuritySection />}
              {currentTab === 'affichage' && <DisplaySection />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
