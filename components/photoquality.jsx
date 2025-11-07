import React from 'react';
import { Lightbulb } from 'lucide-react';

const PhotoQualityTips = () => (
  <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 rounded-xl mb-4 shadow-lg border border-gray-200">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md flex-shrink-0">
        <Lightbulb className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="font-bold text-base mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Photo Quality Tips
        </div>
        <div className="text-sm leading-relaxed text-gray-700">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-base">📸</span>
            <span><strong className="text-gray-800">2 people:</strong> 4MB+ file</span>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-base">📸</span>
            <span><strong className="text-gray-800">3+ people:</strong> 5MB+ file</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <span><strong className="text-gray-800">Phone photos work great!</strong></span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PhotoQualityTips;