import React, { useState, useEffect, useCallback } from 'react';
import { teamService, Team, User } from '../../../services/teamService';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId: string;
  onSuccess: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, siteId, onSuccess }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedRole, setSelectedRole] = useState('WORKER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, teamsData] = await Promise.all([
        teamService.getAvailableUsers(),
        teamService.getTeamsBySite(siteId),
      ]);
      setUsers(usersData);
      
      let finalTeams = teamsData;
      if (teamsData.length === 0) {
        try {
          const newTeam = await teamService.createTeam(siteId, 'Équipe principale');
          finalTeams = [newTeam];
        } catch (err) {
          console.error('Erreur lors de la création de l\'équipe:', err);
          setError('Impossible de créer une équipe pour ce chantier.');
          setLoading(false);
          return;
        }
      }
      
      setTeams(finalTeams);
      if (finalTeams.length > 0) {
        setSelectedTeamId(finalTeams[0].id);
      }
      
      if (usersData.length === 0) {
        setError('Aucun utilisateur disponible à ajouter.');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    } else {
      resetForm();
    }
  }, [isOpen, loadData]);

  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      setError('Veuillez sélectionner un utilisateur');
      return;
    }

    if (!selectedTeamId) {
      setError('Erreur : aucune équipe sélectionnée');
      return;
    }

    try {
      setLoading(true);
      await teamService.addMemberToTeam(selectedTeamId, selectedUserId, selectedRole);
      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de l\'ajout du membre');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedUserId('');
    setSelectedRole('WORKER');
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Ajouter un membre</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading && !users.length ? (
          <div className="py-8 text-center text-gray-500">Chargement...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* N'afficher le sélecteur d'équipe que s'il y a plusieurs équipes */}
            {teams.length > 1 ? (
              <div>
                <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                  Équipe
                </label>
                <select
                  id="team"
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Sélectionner une équipe</option>
                  {Array.isArray(teams) && teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : teams.length === 1 ? (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Équipe :</span> {teams[0].name}
                </p>
              </div>
            ) : null}

            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
                Utilisateur
              </label>
              <select
                id="user"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Sélectionner un utilisateur</option>
                {Array.isArray(users) && users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rôle dans l&apos;équipe
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="WORKER">Travailleur</option>
                <option value="CHEF_EQUIPE">Chef d&apos;équipe</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMemberModal;
