import React from 'react';
import { Users, Scan, CheckCircle2 } from 'lucide-react';

const DetectedFaces = ({ faces, onSelectFace, selectedFaceId }) => {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Detected Faces</h3>
                <p className="text-xs text-gray-500">
                  {faces.length > 0 ? `${faces.length} face${faces.length > 1 ? 's' : ''} found` : 'Waiting for upload'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {faces.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Scan className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 text-center max-w-xs">
                Upload an image to automatically detect and extract faces
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
              {faces.map((face, index) => (
                <button
                  key={index}
                  onClick={() => onSelectFace(face)}
                  className={`relative group rounded-lg overflow-hidden transition-all duration-200 
                    ${selectedFaceId === face.id 
                      ? 'ring-2 ring-purple-500 shadow-lg scale-105' 
                      : 'ring-1 ring-gray-200 hover:ring-purple-300 hover:shadow-md'
                    }`}
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={face.preview}
                      alt={`Face ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Selected Indicator */}
                  {selectedFaceId === face.id && (
                    <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1 shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Label */}
                  <div className={`px-2 py-1.5 text-center transition-colors
                    ${selectedFaceId === face.id 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-gray-700 group-hover:bg-purple-50'
                    }`}>
                    <span className="text-xs font-medium">Face {index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetectedFaces;