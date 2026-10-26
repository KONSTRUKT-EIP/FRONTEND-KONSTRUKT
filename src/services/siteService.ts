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
  }[];
}

export const siteService = {
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

  // Renvoie une URL locale (blob:) utilisable dans un <img>, ou null si le chantier n'a pas de photo
  async getPhotoUrl(siteId: string): Promise<string | null> {
    const response = await fetch(`${API_BASE}/sites/${siteId}/photo`, {
      headers: getAuthHeader(),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch site photo');
    return URL.createObjectURL(await response.blob());
  },

  async uploadPhoto(siteId: string, file: File): Promise<Blob> {
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
    return image;
  },
};
