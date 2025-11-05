
import React, { useState, useRef, useEffect } from 'react';


const StatusMessage = ({ message, progress }) => (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg mb-4 text-center shadow-lg">
      <div className="text-sm font-semibold">{message}</div>
      {progress > 0 && (
        <div className="mt-3">
          <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-2 opacity-90">
            <span>{progress}%</span>
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );


  export default StatusMessage