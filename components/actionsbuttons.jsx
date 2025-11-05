

import React, { useState, useRef, useEffect } from 'react';



const ActionButtons = ({ currentStep, 
  onUpload, 
  onExtract, 
  onAddText, 
  onPreview, 
  onDownload,
  onManualCrop,  
  showManualCropButton }) => (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      <button
        onClick={onUpload}
        className={`px-6 py-3 rounded-full font-bold transition-all ${
          currentStep === 1
            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
            : 'bg-gray-300 text-gray-600'
        }`}
      >
        📁 Upload
      </button>
      {showManualCropButton && (
        <button
          onClick={onManualCrop}
          className="px-6 py-3 rounded-full font-bold bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg hover:opacity-90 transition-all"
        >
          ✂️ Manual Crop
        </button>
      )}
      <button
        onClick={onExtract}
        disabled={currentStep < 2}
        className={`px-6 py-3 rounded-full font-bold transition-all ${
          currentStep === 2
            ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-lg'
            : 'bg-gray-300 text-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        ✂️ Pick Face
      </button>
      <button
        onClick={onAddText}
        disabled={currentStep < 3}
        className={`px-6 py-3 rounded-full font-bold transition-all ${
          currentStep === 3
            ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg'
            : 'bg-gray-300 text-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        📝 Add Text
      </button>
      <button
        onClick={onPreview}
        disabled={currentStep < 4}
        className={`px-6 py-3 rounded-full font-bold transition-all ${
          currentStep === 4
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
            : 'bg-gray-300 text-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        👁️ Preview
      </button>
      <button
        onClick={onDownload}
        disabled={currentStep < 5}
        className={`px-6 py-3 rounded-full font-bold transition-all ${
          currentStep === 5
            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
            : 'bg-gray-300 text-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        📥 Download PDF
      </button>
    </div>
  );
  

  export default ActionButtons