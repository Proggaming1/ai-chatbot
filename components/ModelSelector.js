import React from 'react';

export default function ModelSelector({ models, selected, onSelect, disabled }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="text-sm font-medium text-gray-300">Model:</label>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} - {model.speed}
          </option>
        ))}
      </select>
      {models.find((m) => m.id === selected) && (
        <div className="text-xs text-gray-400 max-w-xs">
          {models.find((m) => m.id === selected).description}
        </div>
      )}
    </div>
  );
}
