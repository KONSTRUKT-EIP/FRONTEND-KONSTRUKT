import StatCard from "../../Components/Planning/Task/TaskResum";
import WeekCalendar from "../../Components/Planning/WeekCalendar/WeekCalendar";
import ActionsPanel from "../../Components/Planning/Action/ActionPanel";
import { Task } from "../../Components/Planning/WeekCalendar/TaskCard";
import { Action } from "../../Components/Planning/Action/ActionItem";
import CreateTaskModal, { CreateTaskPayload } from "../../Components/Planning/Modal/CreateTaskModal";
import TaskDetailModal from "../../Components/Planning/Modal/TaskDetailModal";
import React, { useState, useEffect } from 'react';

const today = new Date();
const getDateISO = (offset: number) => {
  const d = new Date(today);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  monday.setDate(monday.getDate() + offset);
  return monday.toISOString().split("T")[0];
};

// Données météo en dur (pourra être remplacé par un appel API plus tard)
const weather = [
  { date: getDateISO(0), label: "Beau",     icon: "☀️" },
  { date: getDateISO(1), label: "Variable", icon: "🌤️" },
  { date: getDateISO(2), label: "Nuageux",  icon: "☁️" },
  { date: getDateISO(3), label: "Pluie",    icon: "🌧️" },
  { date: getDateISO(4), label: "Variable", icon: "⛅" },
  { date: getDateISO(5), label: "Accalmie", icon: "🌥️" },
  { date: getDateISO(6), label: "Repos",    icon: "🌙" },
];

export default function Planning() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [stats, setStats] = useState([
    { icon: "📋", iconBg: "bg-gray-100",  label: "Tâches cette semaine", value: 0 },
    { icon: "⏰", iconBg: "bg-red-50",    label: "Tâches en retard",     value: 0 },
    { icon: "⚠️", iconBg: "bg-yellow-50", label: "À risque météo",       value: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeekPlanning();
  }, []);

  const loadWeekPlanning = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const monday = new Date();
      const day = monday.getDay();
      monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const startDate = monday.toISOString().split('T')[0];
      const endDate = sunday.toISOString().split('T')[0];
      
      const response = await fetch(
        `http://localhost:3000/planning/week?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load planning data');
      }

      const data = await response.json();
      
      setTasks(data.tasks || []);
      setActions(data.actions || []);
      
      if (data.stats) {
        setStats([
          { icon: "📋", iconBg: "bg-gray-100",  label: "Tâches cette semaine", value: data.stats.tasksThisWeek || 0 },
          { icon: "⏰", iconBg: "bg-red-50",    label: "Tâches en retard",     value: data.stats.tasksLate || 0 },
          { icon: "⚠️", iconBg: "bg-yellow-50", label: "À risque météo",       value: data.stats.tasksWeatherRisk || 0 },
        ]);
      }
    } catch (error) {
      console.error('Error loading planning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('http://localhost:3000/planning/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create task');
      }
      
      await loadWeekPlanning();
    } catch (error) {
      console.error('Error in handleCreateTask:', error);
      throw error;
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDetailModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Planning</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Chargement des données...</div>
        </div>
      ) : (
        <>
          {/* Stats & Actions */}
          <div className="flex gap-4 mb-6">
            {/* Stats - Left Side */}
            <div className="flex flex-col gap-4 flex-1">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

            {/* Actions Panel - Right Side */}
            <div className="flex-1">
              <ActionsPanel actions={actions} />
            </div>
          </div>

          {/* Planning Calendar */}
          <div>
            <WeekCalendar 
              tasks={tasks} 
              weather={weather} 
              onTaskClick={handleTaskClick}
              onCreateTask={() => setIsCreateModalOpen(true)}
            />
          </div>
        </>
      )}

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        taskId={selectedTaskId}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTaskId(null);
        }}
        onTaskUpdate={loadWeekPlanning}
      />
    </main>
  );
}