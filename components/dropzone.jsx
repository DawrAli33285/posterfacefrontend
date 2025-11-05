

import React, { useState, useRef, useEffect } from 'react';


const DropZone = ({ onFileSelect, isVisible }) => {
    if (!isVisible) return null;
  
    return (
      <div
        onClick={onFileSelect}
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-dashed border-purple-400 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
      >
        <div className="text-center p-6">
          <span className="text-6xl block mb-4">📁</span>
          <p className="text-gray-700 font-semibold">
            Drag & Drop your image here<br />
            or <strong className="text-purple-600">click here</strong> to select files
          </p>
        </div>
      </div>
    );
  };

  export default DropZone