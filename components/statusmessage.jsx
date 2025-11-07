import React from 'react';
import { Loader2 } from 'lucide-react';

const StatusMessage = ({ message, progress }) => (
  <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-5 rounded-xl mb-4 text-center shadow-lg border border-gray-200">
    <div className="flex items-center justify-center gap-3 mb-3">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
        <Loader2 className="w-5 h-5 text-white animate-spin" />
      </div>
      <div className="text-base font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
        {message}
      </div>
    </div>
    {progress > 0 && (
      <div className="mt-4">
        <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 h-full transition-all duration-300 rounded-full shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm mt-3 font-semibold text-gray-700">
          <span>{progress}%</span>
          <span>Processing...</span>
        </div>
      </div>
    )}
  </div>
);

export default StatusMessage;