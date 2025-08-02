import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
      <AlertCircle className="w-5 h-5" />
      <span>{error}</span>
    </div>
  );
};

export default ErrorMessage;