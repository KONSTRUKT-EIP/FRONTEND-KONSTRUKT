
import ActionItem, { Action } from "./ActionItem";
import React from 'react';

interface ActionsPanelProps {
  actions: Action[];
}

export default function ActionsPanel({ actions = [] }: ActionsPanelProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Actions requises</h2>
      <div className="flex flex-col gap-3">
        {actions.map((action) => (
          <ActionItem key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
}
