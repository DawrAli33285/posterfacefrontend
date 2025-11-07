import React from 'react';
import { Upload } from 'lucide-react';

const UploadNewFace = ({ onUpload, onClear }) => (
  <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-5 rounded-xl mb-4 shadow-lg border border-gray-200">
  <button
    onClick={() => {
      onClear();
      onUpload();
    }}
    className="w-full p-4 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white border-none rounded-xl text-base font-bold cursor-pointer transition-all hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 shadow-md hover:shadow-xl flex items-center justify-center gap-3"
  >
    <Upload className="w-6 h-6" />
    <span>Upload New Face</span>
  </button>
  <p className="text-gray-600 text-sm mt-3 text-center font-medium">
    ✨ Start by uploading a photo
  </p>
</div>
);

export default UploadNewFace;