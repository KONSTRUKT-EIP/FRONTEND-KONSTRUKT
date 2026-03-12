// ViewFilters
import { useState } from "react";
import "./ViewFilters.css";
import React from 'react';

export interface Filter {
  id: string;
  label: string;
  color: string;
}

interface ViewFiltersProps {
  filters?: Filter[];
  onChange?: (id: string, checked: boolean) => void;
}


export default function ViewFilters({
  filters = [],
  onChange,
}: ViewFiltersProps) {

    const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(
      filters.map((f) => [f.id, f.id !== "superstructure"])
    )
  );

  const toggle = (id: string) => {
    const next = !checked[id];
    setChecked((prev) => ({ ...prev, [id]: next }));
    onChange?.(id, next);
  };

  return (
    <div className="vf-card">
      <div className="vf-header">
        <span className="vf-title">Filtres de vue</span>
      </div>

      <ul className="vf-list">
        {filters.map((filter) => {
          const isChecked = checked[filter.id] ?? false;
          return (
            <li key={filter.id}>
              <button onClick={() => toggle(filter.id)} className="vf-row">
                <span
                  className={`vf-checkbox${isChecked ? " vf-checkbox--checked" : ""}`}
                  style={
                    isChecked
                      ? {
                          background: filter.color,
                          boxShadow: `0 0 0 3px ${filter.color}22`,
                        }
                      : undefined
                  }
                >
                  {isChecked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                <span className={`vf-label${isChecked ? " vf-label--checked" : ""}`}>
                  {filter.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}