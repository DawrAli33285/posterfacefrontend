import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Crop, ZoomIn, Check, X, Info } from 'lucide-react';

const ManualCropModal = ({ image, onComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = () => {
    if (croppedAreaPixels) {
      onComplete(croppedAreaPixels);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white rounded-lg border border-blue-200 shadow-sm">
              <Crop className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Crop Face Area</h3>
              <p className="text-xs text-gray-600">Select the face region</p>
            </div>
          </div>
        </div>

        {/* Cropper Area */}
        <div className="p-4">
          <div className="relative w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 overflow-hidden shadow-inner mb-4">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={3 / 4}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          {/* Zoom Control */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 bg-white rounded border border-blue-200">
                <ZoomIn className="w-3 h-3 text-blue-600" />
              </div>
              <label className="text-xs font-semibold text-gray-900">Zoom Level</label>
            </div>
            
            <div className="relative">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-blue-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1 px-0.5">
                <span>1×</span>
                <span>2×</span>
                <span>3×</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-4">
            <div className="flex gap-1.5">
              <Info className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900">
                <span className="font-semibold">Tip:</span> Drag to reposition and zoom for perfect framing.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              disabled={!croppedAreaPixels}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-sm"
            >
              <Check className="w-3 h-3" />
              <span>Confirm</span>
            </button>
            <button
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-700 text-xs font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualCropModal;