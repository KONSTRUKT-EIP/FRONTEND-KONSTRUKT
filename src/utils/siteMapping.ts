// Mapping temporaire des IDs numériques vers les UUIDs des sites
// À remplacer par de vrais UUIDs depuis votre base de données

export const SITE_ID_MAP: Record<string, string> = {
  "1": "145ec198-2744-4ae2-b139-eaa309d293ca", // Tour Horizon
  "2": "2b5f8c3e-6d4a-4f1b-9e8c-7a6d5e4c3b2a", // Résidence Les Pins
  "3": "3c6f9d4e-7e5b-4a2c-8f9d-6b7e8f9a0b1c", // Pont Sud
  "4": "4d7a0e5f-8f6c-4b3d-9a0e-7c8f9a1b2c3d", // Centre Commercial
  "5": "5e8b1f6a-9a7d-4c4e-0b1f-8d9a0b2c3d4e", // Immeuble Lumière
  "6": "6f9c2a7b-0b8e-4d5f-1c2a-9e0b1c3d4e5f", // Stade Municipal
};

export const getSiteUUID = (numericId: string | undefined): string | null => {
  if (!numericId) return null;
  return SITE_ID_MAP[numericId] || null;
};
