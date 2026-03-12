import React, { useState, useEffect } from "react";
import { Field } from "../../Tools/Input/Input";

export interface CreateTaskPayload {
  siteZoneId?: string;
  assignedToIds?: string[];
  name: string;
  description?: string;
  type: string;
  priority: number;
  plannedEnd: string;
  time?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface SiteZone {
  id: string;
  name: string;
  level: string;
  site: {
    name: string;
  };
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
}

const TASK_TYPES = [
  { value: "GROS_OEUVRE", label: "Gros Œuvre" },
  { value: "SECOND_OEUVRE", label: "Second Œuvre" },
  { value: "VRD", label: "VRD" },
  { value: "ELECTRICITE", label: "Électricité" },
  { value: "PLOMBERIE", label: "Plomberie" },
  { value: "MENUISERIE", label: "Menuiserie" },
  { value: "PEINTURE", label: "Peinture" },
];

const emptyForm = {
  siteZoneId: "",
  siteZoneName: "",
  assignedToIds: [] as string[],
  name: "",
  description: "",
  type: "GROS_OEUVRE",
  priority: 3,
  date: "",
  startTime: "08:00",
  endTime: "10:00",
};

export default function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [zones, setZones] = useState<SiteZone[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsersAndZones();
    }
  }, [isOpen]);

  const loadUsersAndZones = async () => {
    setLoadingData(true);
    try {
      const token = localStorage.getItem('access_token');
      
      // Load users
      try {
        const usersResponse = await fetch('http://localhost:3000/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(Array.isArray(usersData) ? usersData : []);
        } else {
          console.warn('Failed to load users:', usersResponse.status);
          setUsers([]);
        }
      } catch (err) {
        console.error('Error loading users:', err);
        setUsers([]);
      }
      
      // Load sites and zones
      try {
        const sitesResponse = await fetch('http://localhost:3000/sites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (sitesResponse.ok) {
          const sitesData = await sitesResponse.json();
          const allZones: SiteZone[] = [];
          for (const site of sitesData) {
            try {
              const siteDetailResponse = await fetch(`http://localhost:3000/sites/${site.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (siteDetailResponse.ok) {
                const siteDetail = await siteDetailResponse.json();
                if (siteDetail.zones && Array.isArray(siteDetail.zones)) {
                  allZones.push(...siteDetail.zones.map((z: SiteZone) => ({ ...z, site: { name: site.name } })));
                }
              }
            } catch (err) {
              console.error(`Error loading site ${site.id}:`, err);
            }
          }
          setZones(allZones);
        } else {
          console.warn('Failed to load sites:', sitesResponse.status);
          setZones([]);
        }
      } catch (err) {
        console.error('Error loading sites:', err);
        setZones([]);
      }
    } catch (error) {
      console.error('Error loading users and zones:', error);
      setUsers([]);
      setZones([]);
    } finally {
      setLoadingData(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
    setError(null);
  };
  const handleUserToggle = (userId: string) => {
    setForm((prev) => {
      const isSelected = prev.assignedToIds.includes(userId);
      return {
        ...prev,
        assignedToIds: isSelected
          ? prev.assignedToIds.filter(id => id !== userId)
          : [...prev.assignedToIds, userId]
      };
    });
    setError(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!form.name || !form.date || !form.startTime || !form.endTime) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      let zoneId = form.siteZoneId;
      if (form.siteZoneName && !zoneId && zones.length > 0) {
        const matchingZone = zones.find(z => z.name.toLowerCase() === form.siteZoneName.toLowerCase());
        if (matchingZone) {
          zoneId = matchingZone.id;
        } else {
          throw new Error(`Zone "${form.siteZoneName}" introuvable. Veuillez créer la zone d'abord ou utiliser une zone existante.`);
        }
      }

      const [endHours, endMinutes] = form.endTime.split(':').map(Number);
      const endDate = new Date(form.date);
      endDate.setHours(endHours, endMinutes, 0, 0);

      const payload: CreateTaskPayload = {
        ...(zoneId ? { siteZoneId: zoneId } : {}),
        ...(form.assignedToIds.length > 0 ? { assignedToIds: form.assignedToIds } : {}),
        name: form.name,
        description: form.description || undefined,
        type: form.type,
        priority: Number(form.priority),
        plannedEnd: endDate.toISOString(),
        time: form.startTime,
      };

      await onSubmit(payload);
      setForm(emptyForm);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la création de la tâche');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-7 max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-task-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 id="create-task-modal-title" className="text-xl font-semibold text-gray-900">Créer une tâche</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
              aria-label="Fermer la modal"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Field 
              label="Nom de la tâche" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              required 
              placeholder="Ex: Coulage dalle secteur A"
            />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Description <span className="text-gray-400">(optionnel)</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                placeholder="Description détaillée de la tâche..."
              />
            </div>

            {/* Calendrier: Date, Heure début, Heure fin */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">📅 Planification</h3>
              <div className="grid grid-cols-3 gap-4">
                <Field 
                  label="Date" 
                  name="date" 
                  type="date" 
                  value={form.date} 
                  onChange={handleChange} 
                  required 
                />

                <Field 
                  label="Heure de début" 
                  name="startTime" 
                  type="time"
                  value={form.startTime} 
                  onChange={handleChange}
                  required
                />

                <Field 
                  label="Heure de fin" 
                  name="endTime" 
                  type="time" 
                  value={form.endTime} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Zone et Assignation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Zone du chantier <span className="text-gray-400">(optionnel)</span>
                </label>
                {loadingData ? (
                  <div className="px-3 py-2 border border-gray-200 rounded-lg text-gray-400">
                    Chargement...
                  </div>
                ) : (
                  <input
                    list="zones-list"
                    name="siteZoneName"
                    value={form.siteZoneName}
                    onChange={(e) => {
                      handleChange(e);
                      const selectedZone = zones.find(z => z.name === e.target.value);
                      if (selectedZone) {
                        setForm(prev => ({ ...prev, siteZoneId: selectedZone.id }));
                      }
                    }}
                    placeholder="Ex: Secteur A, Zone 1... (optionnel)"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                <datalist id="zones-list">
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.name}>{zone.site.name} - {zone.name}</option>
                  ))}
                </datalist>
                <p className="text-xs text-gray-500">Commencez à taper pour voir les suggestions</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Assigné à (sélection multiple) <span className="text-gray-400">(optionnel)</span>
                </label>
                {loadingData ? (
                  <div className="px-3 py-2 border border-gray-200 rounded-lg text-gray-400">
                    Chargement...
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-2 max-h-48 overflow-y-auto">
                    {users.length === 0 ? (
                      <div className="text-gray-400 text-sm px-2 py-1">Aucun utilisateur disponible</div>
                    ) : (
                      users.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.assignedToIds.includes(user.id)}
                            onChange={() => handleUserToggle(user.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm">{user.firstName} {user.lastName}</span>
                        </label>
                      ))
                    )}
                  </div>
                )}
                <div className="text-xs text-gray-600">
                  {form.assignedToIds.length > 0 
                    ? `${form.assignedToIds.length} utilisateur${form.assignedToIds.length > 1 ? 's' : ''} sélectionné${form.assignedToIds.length > 1 ? 's' : ''}`
                    : 'Non attribué'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Type de tâche <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TASK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <Field 
                label="Priorité (1-5)" 
                name="priority" 
                type="number" 
                value={form.priority.toString()} 
                onChange={handleChange}
                required
                min="1"
                max="5"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Création..." : "Créer la tâche"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
