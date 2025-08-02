import React from 'react';
import { Loader2, Play } from 'lucide-react';

const ActorConfiguration = ({ 
  selectedActor, 
  actorSchema, 
  inputValues, 
  onInputChange, 
  onExecute, 
  isLoading, 
  isExecuting 
}) => {
  const renderInputField = (key, property) => {
    const value = inputValues[key] || '';

    if (property.type === 'boolean') {
      return (
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onInputChange(key, e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{property.title || key}</span>
        </label>
      );
    }

    if (property.enum) {
      return (
        <select
          value={value}
          onChange={(e) => onInputChange(key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select {property.title || key}</option>
          {property.enum.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (property.type === 'number' || property.type === 'integer') {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onInputChange(key, Number(e.target.value))}
          placeholder={property.description || `Enter ${key}`}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }

    if (property.type === 'array') {
      return (
        <textarea
          value={Array.isArray(value) ? value.join('\n') : value}
          onChange={(e) => onInputChange(key, e.target.value.split('\n').filter(line => line.trim()))}
          placeholder="Enter one item per line"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onInputChange(key, e.target.value)}
        placeholder={property.description || `Enter ${key}`}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };

  if (!selectedActor) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Configure: {selectedActor.name}
      </h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : actorSchema && actorSchema.properties ? (
        <div className="space-y-4">
          {Object.entries(actorSchema.properties).map(([key, property]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {property.title || key}
                {actorSchema.required?.includes(key) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              {property.description && (
                <p className="text-xs text-gray-500">{property.description}</p>
              )}
              {renderInputField(key, property)}
            </div>
          ))}
          
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Execute Actor</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No input schema available for this actor</p>
        </div>
      )}
    </div>
  );
};

export default ActorConfiguration;