import React from 'react';
import { Check, Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { ThemePreference, useDisplayPreferences } from '../../Context/DisplayPreferencesContext';
import { SettingsCard } from './SettingsUi';

const themeOptions: { value: ThemePreference; label: string; description: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Clair', description: 'Fond clair, idéal en journée', icon: Sun },
  { value: 'dark', label: 'Sombre', description: 'Repose les yeux le soir', icon: Moon },
  { value: 'system', label: 'Automatique', description: 'Suit le réglage de votre appareil', icon: Monitor },
];

// Miniature d'interface, toujours dessinée avec des couleurs fixes pour montrer le rendu de chaque thème
const ThemePreview: React.FC<{ variant: ThemePreference }> = ({ variant }) => {
  const half = (dark: boolean) => (
    <div className={`flex-1 p-2 flex flex-col gap-1.5 ${dark ? 'bg-[#0f141c]' : 'bg-[#f3f4f6]'}`}>
      <div className={`h-2 w-8 rounded-full ${dark ? 'bg-[#3b4659]' : 'bg-[#d1d5db]'}`} />
      <div className={`rounded-md p-1.5 flex flex-col gap-1 ${dark ? 'bg-[#171e2a]' : 'bg-[#ffffff]'}`}>
        <div className={`h-1.5 w-10 rounded-full ${dark ? 'bg-[#dce1e8]' : 'bg-[#374151]'}`} />
        <div className={`h-1.5 w-7 rounded-full ${dark ? 'bg-[#6c7789]' : 'bg-[#9ca3af]'}`} />
        <div className="h-1.5 w-5 rounded-full bg-[#f97316]" />
      </div>
    </div>
  );
  return (
    <div className="flex h-20 overflow-hidden rounded-lg ring-1 ring-black/10" aria-hidden="true">
      {variant === 'system' ? (
        <>
          {half(false)}
          {half(true)}
        </>
      ) : (
        half(variant === 'dark')
      )}
    </div>
  );
};

const DisplaySection: React.FC = () => {
  const { preferences, resolvedTheme, setTheme, setColorblind } = useDisplayPreferences();

  return (
    <div className="flex flex-col gap-6">
      <SettingsCard title="Thème" description="Choisissez l'apparence de KONSTRUKT sur cet appareil.">
        <div role="radiogroup" aria-label="Thème" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map(({ value, label, description, icon: Icon }) => {
            const selected = preferences.theme === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setTheme(value)}
                className={`relative flex flex-col gap-3 rounded-xl p-3 text-left transition ring-1 ${
                  selected ? 'ring-2 ring-orange-500 bg-orange-50/40' : 'ring-gray-200 hover:ring-gray-300'
                }`}
              >
                <ThemePreview variant={value} />
                <span className="flex items-center gap-2 font-semibold text-gray-900">
                  <Icon className="w-4 h-4 text-gray-500" aria-hidden="true" />
                  {label}
                  {selected && <Check className="w-4 h-4 ml-auto text-orange-600" aria-hidden="true" />}
                </span>
                <span className="text-xs text-gray-500 -mt-2">{description}</span>
              </button>
            );
          })}
        </div>
        {preferences.theme === 'system' && (
          <p className="text-sm text-gray-500">
            Votre appareil est actuellement en mode {resolvedTheme === 'dark' ? 'sombre' : 'clair'}.
          </p>
        )}
      </SettingsCard>

      <SettingsCard
        title="Accessibilité"
        description="Des réglages pour rendre l'information lisible par tous."
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p id="colorblind-label" className="font-semibold text-gray-900">
              Mode daltonien
            </p>
            <p id="colorblind-description" className="mt-1 text-sm text-gray-500 max-w-xl">
              Remplace le vert et le rouge, difficiles à distinguer pour les personnes daltoniennes, par du bleu et
              de l'orange : écarts, statuts, présences et alertes restent lisibles.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={preferences.colorblind}
            aria-labelledby="colorblind-label"
            aria-describedby="colorblind-description"
            onClick={() => setColorblind(!preferences.colorblind)}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
              preferences.colorblind ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-[#fff] shadow transition-transform ${
                preferences.colorblind ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Aperçu : ces classes suivent le mode daltonien, comme le reste de l'appli */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-gray-50 p-4 ring-1 ring-inset ring-gray-200">
          <span className="text-sm text-gray-500 mr-1">Aperçu :</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Présent</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">En retard</span>
          <span className="text-sm font-semibold text-green-600">−2,4 %</span>
          <span className="text-sm font-semibold text-red-600">+7,7 %</span>
        </div>
      </SettingsCard>
    </div>
  );
};

export default DisplaySection;
