
import React, { useState, useRef, useEffect } from 'react';


const PhotoQualityTips = () => (
    <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-3 rounded-lg mb-4 text-white shadow-lg">
      <div className="flex items-start gap-2">
        <div className="text-xl flex-shrink-0">💡</div>
        <div className="flex-1">
          <div className="font-bold text-sm mb-2">Photo Quality Tips</div>
          <div className="text-xs leading-relaxed opacity-95">
            <div className="mb-1">📸 <strong>2 people:</strong> 4MB+ file</div>
            <div className="mb-1">📸 <strong>3+ people:</strong> 5MB+ file</div>
            <div>✨ <strong>Phone photos work great!</strong></div>
          </div>
        </div>
      </div>
    </div>
  );

  
  export default PhotoQualityTips