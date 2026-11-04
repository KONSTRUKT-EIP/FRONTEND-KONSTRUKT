import { useState, useEffect, useCallback } from 'react';
import { siteService } from '../services/siteService';

interface SiteWithPhoto {
  id: string;
  hasPhoto?: boolean;
  // Date de mise à jour de la photo : sert de version pour le cache
  photoVersion?: string;
}

// Charge les photos de couverture des chantiers et permet d'en enregistrer une nouvelle.
// Les photos sont mises en cache par siteService : passer d'une page à l'autre ne les retélécharge pas.
export function useSitePhotos(sites: SiteWithPhoto[]) {
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const photoKeys = sites
    .filter((site) => site.hasPhoto)
    .map((site) => `${site.id}|${site.photoVersion ?? ''}`)
    .join(',');

  useEffect(() => {
    if (!photoKeys) return;
    let active = true;

    photoKeys.split(',').forEach((key) => {
      const [id, version] = key.split('|');
      siteService
        .getPhotoUrl(id, version || undefined)
        .then((url) => {
          if (!url || !active) return;
          // Ne pas écraser une photo envoyée entre-temps
          setPhotos((prev) => (prev[id] ? prev : { ...prev, [id]: url }));
        })
        .catch((err) => console.error('Erreur lors du chargement de la photo:', err));
    });

    return () => {
      active = false;
    };
  }, [photoKeys]);

  const uploadPhoto = useCallback(async (id: string, file: File) => {
    setUploading((prev) => ({ ...prev, [id]: true }));
    try {
      const url = await siteService.uploadPhoto(id, file);
      setPhotos((prev) => ({ ...prev, [id]: url }));
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la photo:", err);
      alert(
        `Impossible d'enregistrer la photo${err instanceof Error ? ` : ${err.message}` : ''}`,
      );
    } finally {
      setUploading((prev) => ({ ...prev, [id]: false }));
    }
  }, []);

  return { photos, uploading, uploadPhoto };
}
