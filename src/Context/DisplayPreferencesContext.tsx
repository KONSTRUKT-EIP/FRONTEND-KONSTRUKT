import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface DisplayPreferences {
  theme: ThemePreference;
  colorblind: boolean;
}

interface DisplayPreferencesContextType {
  preferences: DisplayPreferences;
  // Thème réellement affiché (le mode « système » est résolu en clair ou sombre)
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemePreference) => void;
  setColorblind: (enabled: boolean) => void;
}

// Même clé que le script de index.html, qui applique les préférences avant le premier affichage
const STORAGE_KEY = 'konstrukt-display';
const DEFAULT_PREFERENCES: DisplayPreferences = { theme: 'light', colorblind: false };

const readPreferences = (): DisplayPreferences => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return {
      theme: ['light', 'dark', 'system'].includes(stored.theme) ? stored.theme : DEFAULT_PREFERENCES.theme,
      colorblind: stored.colorblind === true,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

const systemPrefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

const DisplayPreferencesContext = createContext<DisplayPreferencesContextType | undefined>(undefined);

export const DisplayPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<DisplayPreferences>(readPreferences);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  // Suit le thème du système d'exploitation quand l'utilisateur a choisi « Automatique »
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme = preferences.theme === 'system' ? (systemDark ? 'dark' : 'light') : preferences.theme;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-colorblind', preferences.colorblind ? 'on' : 'off');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Stockage indisponible (navigation privée) : les préférences ne durent que le temps de la session
    }
  }, [preferences, resolvedTheme]);

  return (
    <DisplayPreferencesContext.Provider
      value={{
        preferences,
        resolvedTheme,
        setTheme: (theme) => setPreferences((prev) => ({ ...prev, theme })),
        setColorblind: (colorblind) => setPreferences((prev) => ({ ...prev, colorblind })),
      }}
    >
      {children}
    </DisplayPreferencesContext.Provider>
  );
};

export const useDisplayPreferences = () => {
  const context = useContext(DisplayPreferencesContext);
  if (!context) throw new Error('useDisplayPreferences must be used within DisplayPreferencesProvider');
  return context;
};
