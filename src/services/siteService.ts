const API_BASE = 'http://localhost:3000';

// Taille max (en px) du plus grand côté de la photo envoyée au serveur
const PHOTO_MAX_DIMENSION = 1600;
const PHOTO_QUALITY = 0.85;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

// Redimensionne et compresse l'image en JPEG avant l'envoi, pour garder la base légère
const compressImage = async (file: File): Promise<Blob> => {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, PHOTO_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext('2d');
  if (!context) throw new Error("Impossible de traiter l'image");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Impossible de traiter l'image"))),
      'image/jpeg',
      PHOTO_QUALITY,
    );
  });
};

export type SiteStatus = 'PLANIFIE' | 'EN_COURS' | 'SUSPENDU' | 'TERMINE' | 'ANNULE';

export interface SiteDetails {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  startDate: string;
  endDate: string | null;
  status: SiteStatus;
  budget: string;
  organization?: { id: string; name: string };
  _count?: { deliveries: number; documents: number };
}

export interface SiteWeather {
  current: {
    temperature: number;
    windSpeed: number;
    weatherCode: number;
    weatherDescription: string;
  };
  daily: {
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    precipitationProbability: number;
    weatherCode: number;
  }[];
}

// Photos déjà chargées pendant la navigation, partagées par toutes les pages.
// La version (date de mise à jour) permet au navigateur de garder l'image en cache.
const photoCache = new Map<string, { version?: string; url: Promise<string | null> }>();

const releasePhoto = (siteId: string) => {
  const cached = photoCache.get(siteId);
  if (!cached) return;
  photoCache.delete(siteId);
  void cached.url.then((url) => url && URL.revokeObjectURL(url)).catch(() => undefined);
};

export type SiteListItem = SiteDetails & { photo?: { updatedAt: string } | null };

export const siteService = {
  async getSites(): Promise<SiteListItem[]> {
    const response = await fetch(`${API_BASE}/sites`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch sites');
    return response.json();
  },

  async getSite(siteId: string): Promise<SiteDetails> {
    const response = await fetch(`${API_BASE}/sites/${siteId}`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch site');
    return response.json();
  },

  async getWeather(siteId: string): Promise<SiteWeather> {
    const response = await fetch(`${API_BASE}/weather/by-site/${siteId}`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch site weather');
    return response.json();
  },

  // Renvoie une URL locale (blob:) de la photo, ou null si le chantier n'en a pas
  getPhotoUrl(siteId: string, version?: string): Promise<string | null> {
    const cached = photoCache.get(siteId);
    if (cached && (!version || !cached.version || cached.version === version)) {
      return cached.url;
    }
    releasePhoto(siteId);

    const query = version ? `?v=${encodeURIComponent(version)}` : '';
    const url = fetch(`${API_BASE}/sites/${siteId}/photo${query}`, { headers: getAuthHeader() }).then(
      async (response) => {
        if (response.status === 404) return null;
        if (!response.ok) throw new Error('Failed to fetch site photo');
        return URL.createObjectURL(await response.blob());
      },
    );
    // En cas d'erreur, on oublie l'entrée pour pouvoir réessayer plus tard
    url.catch(() => photoCache.delete(siteId));
    photoCache.set(siteId, { version, url });
    return url;
  },

  async uploadPhoto(siteId: string, file: File): Promise<string> {
    const image = await compressImage(file);
    const formData = new FormData();
    formData.append('photo', image, 'photo.jpg');

    const response = await fetch(`${API_BASE}/sites/${siteId}/photo`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to upload site photo');
    }

    // La nouvelle photo remplace l'ancienne dans le cache, sans la retélécharger
    const { updatedAt }: { updatedAt?: string } = await response.json().catch(() => ({}));
    releasePhoto(siteId);
    const url = URL.createObjectURL(image);
    photoCache.set(siteId, { version: updatedAt, url: Promise.resolve(url) });
    return url;
  },
};
