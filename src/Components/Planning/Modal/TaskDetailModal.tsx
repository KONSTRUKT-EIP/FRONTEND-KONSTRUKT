import React, { useEffect, useState } from "react";

interface TaskDetail {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  priority: number;
  plannedEnd: string;
  time?: string;
  siteZone?: {
    id: string;
    name: string;
  };
  assignments?: Array<{
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  alerts?: Array<{
    id: string;
    type: string;
    severity: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }>;
  progress?: Array<{
    id: string;
    date: string;
    progressPercent: number;
    notes?: string;
    reportedBy?: {
      firstName: string;
      lastName: string;
    };
  }>;
}

interface TaskDetailModalProps {
  isOpen: boolean;
  taskId: string | null;
  onClose: () => void;
  onTaskUpdate?: () => void;
}

const TASK_TYPE_LABELS: Record<string, string> = {
  GROS_OEUVRE: "Gros Œuvre",
  SECOND_OEUVRE: "Second Œuvre",
  VRD: "VRD",
  ELECTRICITE: "Électricité",
  PLOMBERIE: "Plomberie",
  MENUISERIE: "Menuiserie",
  PEINTURE: "Peinture",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  EN_ATTENTE: { label: "En attente", color: "bg-gray-100 text-gray-700" },
  EN_COURS: { label: "En cours", color: "bg-blue-100 text-blue-700" },
  TERMINE: { label: "Terminé", color: "bg-green-100 text-green-700" },
  ANNULE: { label: "Annulé", color: "bg-red-100 text-red-700" },
};

const SEVERITY_COLORS: Record<string, string> = {
  INFO: "bg-blue-50 border-blue-200 text-blue-700",
  WARNING: "bg-yellow-50 border-yellow-200 text-yellow-700",
  CRITICAL: "bg-red-50 border-red-200 text-red-700",
};

export default function TaskDetailModal({ isOpen, taskId, onClose, onTaskUpdate }: TaskDetailModalProps) {
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: '',
    priority: 1,
    plannedEnd: '',
    time: ''
  });

  useEffect(() => {
    if (isOpen && taskId) {
      const fetchTaskDetails = async () => {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        try {
          const res = await fetch(`http://localhost:3000/planning/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          setTask(data);
          setEditForm({
            name: data.name || '',
            description: data.description || '',
            status: data.status || '',
            priority: data.priority || 1,
            plannedEnd: data.plannedEnd ? data.plannedEnd.split('T')[0] : '',
            time: data.time || ''
          });
        } catch (err) {
          console.error('Error fetching task details:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchTaskDetails();
    }
  }, [isOpen, taskId]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setEditForm((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!taskId) return;
    
    setLoading(true);
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`http://localhost:3000/planning/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description,
          status: editForm.status,
          priority: Number(editForm.priority),
          plannedEnd: new Date(editForm.plannedEnd).toISOString(),
          time: editForm.time || undefined
        })
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTask(updatedTask);
        setEditForm({
          name: updatedTask.name || '',
          description: updatedTask.description || '',
          status: updatedTask.status || '',
          priority: updatedTask.priority || 1,
          plannedEnd: updatedTask.plannedEnd ? updatedTask.plannedEnd.split('T')[0] : '',
          time: updatedTask.time || ''
        });
        setIsEditing(false);
        if (onTaskUpdate) {
          onTaskUpdate();
        }
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const statusInfo = task?.status ? STATUS_LABELS[task.status] || { label: task.status, color: "bg-gray-100" } : null;

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
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-7 max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-detail-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 id="task-detail-modal-title" className="text-2xl font-bold text-gray-900">Détails de la tâche</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
              aria-label="Fermer la modal"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Chargement...</div>
            </div>
          ) : task ? (
            <div className="flex flex-col gap-6">
              {/* Main Info */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="text-xl font-semibold text-gray-900 border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full pb-2"
                      />
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="text-gray-600 border border-gray-300 rounded-lg p-2 w-full min-h-[80px] focus:border-blue-500 outline-none"
                        placeholder="Description..."
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.name}</h3>
                      {task.description && (
                        <p className="text-gray-600 mb-3">{task.description}</p>
                      )}
                    </>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    {statusInfo && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                      {TASK_TYPE_LABELS[task.type] || task.type}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                      Priorité {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-6 p-5 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Zone du chantier</p>
                  <p className="text-base font-semibold text-gray-900">
                    {task.siteZone?.name || "Non définie"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Assigné à</p>
                  {task.assignments && task.assignments.length > 0 ? (
                    <div className="space-y-1">
                      {task.assignments.map((assignment, index) => (
                        <div key={index}>
                          <p className="text-base font-semibold text-gray-900">
                            {assignment.user.firstName} {assignment.user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{assignment.user.email}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base font-semibold text-gray-900">Non assigné</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Date de fin prévue</p>
                  {isEditing ? (
                    <input
                      type="date"
                      name="plannedEnd"
                      value={editForm.plannedEnd}
                      onChange={handleEditChange}
                      className="text-base font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-base font-semibold text-gray-900">
                      {formatDate(task.plannedEnd)}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Heure</p>
                  {isEditing ? (
                    <input
                      type="time"
                      name="time"
                      value={editForm.time}
                      onChange={handleEditChange}
                      className="text-base font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 focus:border-blue-500 outline-none w-full"
                    />
                  ) : task.time ? (
                    <p className="text-base font-semibold text-gray-900">{task.time}</p>
                  ) : (
                    <p className="text-base text-gray-400">Non définie</p>
                  )}
                </div>
                {isEditing && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Priorité (1-5)</p>
                      <input
                        type="number"
                        name="priority"
                        value={editForm.priority}
                        onChange={handleEditChange}
                        min={1}
                        max={5}
                        className="text-base font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 focus:border-blue-500 outline-none w-24"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Statut</p>
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        className="text-base font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 focus:border-blue-500 outline-none"
                      >
                        <option value="EN_ATTENTE">En attente</option>
                        <option value="EN_COURS">En cours</option>
                        <option value="TERMINE">Terminé</option>
                        <option value="ANNULE">Annulé</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Alerts */}
              {task.alerts && task.alerts.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Alertes ({task.alerts.length})
                  </h4>
                  <div className="flex flex-col gap-2">
                    {task.alerts.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${SEVERITY_COLORS[alert.severity] || "bg-gray-50 border-gray-200"}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-semibold mb-1">{alert.type}</p>
                            <p className="text-sm">{alert.message}</p>
                          </div>
                          {!alert.isRead && (
                            <span className="ml-2 w-2 h-2 rounded-full bg-red-500" />
                          )}
                        </div>
                        <p className="text-xs mt-2 opacity-75">
                          {new Date(alert.createdAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress */}
              {task.progress && task.progress.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Progression
                  </h4>
                  <div className="flex flex-col gap-3">
                    {task.progress.slice(0, 5).map((prog) => (
                      <div key={prog.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {prog.progressPercent}% complété
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(prog.date)}
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${prog.progressPercent}%` }}
                          />
                        </div>
                        {prog.notes && (
                          <p className="text-sm text-gray-600 mb-1">{prog.notes}</p>
                        )}
                        {prog.reportedBy && (
                          <p className="text-xs text-gray-500">
                            Rapporté par {prog.reportedBy.firstName} {prog.reportedBy.lastName}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center gap-3 pt-4 border-t">
                <div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Modifier la tâche
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form to original values
                          if (task) {
                            setEditForm({
                              name: task.name || '',
                              description: task.description || '',
                              status: task.status || '',
                              priority: task.priority || 1,
                              plannedEnd: task.plannedEnd ? task.plannedEnd.split('T')[0] : '',
                              time: task.time || ''
                            });
                          }
                        }}
                        className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={loading}
                        className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        {loading ? "Sauvegarde..." : "Sauvegarder"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Fermer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucune tâche trouvée
            </div>
          )}
        </div>
      </div>
    </>
  );
}
