
import React, { useState, useRef, useEffect } from 'react';


const UploadNewFace = ({ onUpload, onClear }) => (
    <div className="bg-gradient-to-br from-pink-400 to-red-500 p-4 rounded-xl mb-4 shadow-lg">
      <button
        onClick={() => {
          onClear();
          onUpload();
        }}
        className="w-full p-4 bg-white text-red-500 border-none rounded-lg text-base font-bold cursor-pointer transition-transform hover:scale-105 shadow-md"
      >
        📸 Upload New Face
      </button>
      <p className="text-white text-xs mt-2 text-center opacity-90">
        Start by uploading a photo
      </p>
    </div>
  );

  export default UploadNewFace;