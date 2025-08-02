import React from 'react';
import { CheckCircle } from 'lucide-react';

const ExecutionResults = ({ executionResult }) => {
  if (!executionResult) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Execution Results</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Status</div>
          <div className="font-medium text-green-600">{executionResult.status}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Duration</div>
          <div className="font-medium">
            {executionResult.finishedAt && executionResult.startedAt
              ? `${Math.round((new Date(executionResult.finishedAt) - new Date(executionResult.startedAt)) / 1000)}s`
              : 'N/A'}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Items</div>
          <div className="font-medium">{executionResult.results?.length || 0}</div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
        <pre className="text-green-400 text-sm">
          {JSON.stringify(executionResult.results, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ExecutionResults;