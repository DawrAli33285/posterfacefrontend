import React from 'react';
import { Upload, Image } from 'lucide-react';

const DropZone = ({ onFileSelect, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      onClick={onFileSelect}
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 
                 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer 
                 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100
                 transition-all duration-300 group"
    >
      <div className="text-center p-8 max-w-md">
        {/* Icon Container */}
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Upload className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1.5 shadow-lg">
            <Image className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Upload Your Image
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Drag and drop your image here, or{' '}
            <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
              click to browse
            </span>
          </p>
          <div className="pt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-white rounded-md border border-gray-200">JPG</span>
            <span className="px-2 py-1 bg-white rounded-md border border-gray-200">PNG</span>
            <span className="px-2 py-1 bg-white rounded-md border border-gray-200">WEBP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropZone;