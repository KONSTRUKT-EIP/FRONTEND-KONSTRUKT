import { useState, useEffect, useCallback, useRef } from 'react';
import { siteService } from '../services/siteService';

interface SiteWithPhoto {
  id: string;
  hasPhoto?: boolean;
}

// Charge les photos de couverture des chantiers et permet d'en enregistrer une nouvelle
export function useSitePhotos(sites: SiteWithPhoto[]) {
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const createdUrlsRef = useRef<string[]>([]);

  const idsWithPhoto = sites
    .filter((site) => site.hasPhoto)
    .map((site) => site.id)
    .join(',');

  useEffect(() => {
    if (!idsWithPhoto) return;
    let active = true;

    idsWithPhoto.split(',').forEach((id) => {
      siteService
        .getPhotoUrl(id)
        .then((url) => {
          if (!url) return;
          createdUrlsRef.current.push(url);
          if (!active) return;
          // Ne pas écraser une photo envoyée entre-temps
          setPhotos((prev) => (prev[id] ? prev : { ...prev, [id]: url }));
        })
        .catch((err) => console.error('Erreur lors du chargement de la photo:', err));
    });

    return () => {
      active = false;
    };
  }, [idsWithPhoto]);

  useEffect(() => {
    const createdUrls = createdUrlsRef.current;
    return () => createdUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const uploadPhoto = useCallback(async (id: string, file: File) => {
    setUploading((prev) => ({ ...prev, [id]: true }));
    try {
      const image = await siteService.uploadPhoto(id, file);
      const url = URL.createObjectURL(image);
      createdUrlsRef.current.push(url);
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
