import type { SiteStatus } from '../services/siteService';

const DAY_MS = 24 * 60 * 60 * 1000;

export const siteStatusConfig: Record<SiteStatus, { label: string; className: string }> = {
  PLANIFIE: { label: 'Planifié', className: 'bg-sky-100 text-sky-700' },
  EN_COURS: { label: 'En cours', className: 'bg-green-100 text-green-700' },
  SUSPENDU: { label: 'Suspendu', className: 'bg-amber-100 text-amber-700' },
  TERMINE: { label: 'Terminé', className: 'bg-gray-200 text-gray-700' },
  ANNULE: { label: 'Annulé', className: 'bg-red-100 text-red-700' },
};

// Couleur de la barre d'avancement selon le statut du chantier
export const siteStatusBarColor: Record<SiteStatus, string> = {
  PLANIFIE: 'bg-sky-400',
  EN_COURS: 'bg-orange-400',
  SUSPENDU: 'bg-amber-400',
  TERMINE: 'bg-gray-400',
  ANNULE: 'bg-red-300',
};

// Avancement du chantier dans le temps, à partir des dates de début et de fin
export const getSiteSchedule = (startDate: string, endDate: string | null) => {
  const start = new Date(startDate).getTime();
  const now = Date.now();

  if (now < start) {
    const days = Math.ceil((start - now) / DAY_MS);
    return { percentage: 0, overdue: false, label: `Démarre dans ${days} jour${days > 1 ? 's' : ''}` };
  }
  if (!endDate) {
    const days = Math.floor((now - start) / DAY_MS) + 1;
    return { percentage: null, overdue: false, label: `Jour ${days} · fin non définie` };
  }

  const end = new Date(endDate).getTime();
  const totalDays = Math.max(1, Math.round((end - start) / DAY_MS));
  if (now > end) {
    const late = Math.floor((now - end) / DAY_MS);
    return {
      percentage: 100,
      overdue: late > 0,
      label: late > 0 ? `Date de fin dépassée de ${late} jour${late > 1 ? 's' : ''}` : 'Date de fin atteinte',
    };
  }

  const elapsed = Math.floor((now - start) / DAY_MS) + 1;
  const remaining = totalDays - elapsed;
  return {
    percentage: Math.round((elapsed / totalDays) * 100),
    overdue: false,
    label: `Jour ${elapsed} sur ${totalDays} · ${remaining} restant${remaining > 1 ? 's' : ''}`,
  };
};
