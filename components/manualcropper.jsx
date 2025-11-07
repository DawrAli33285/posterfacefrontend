import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Scissors } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-gray-200">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Manually Select Face Area
          </h3>
        </div>
        
        <div className="relative w-full h-96 bg-gray-100 rounded-xl mb-6 shadow-inner overflow-hidden">
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

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3 text-gray-700">Zoom:</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium">
            <span>1x</span>
            <span>2x</span>
            <span>3x</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            ✅ Confirm Selection
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-xl hover:from-gray-600 hover:to-slate-700 font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            ❌ Cancel
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-6 text-center font-medium bg-white/50 rounded-lg py-3 px-4">
          💡 Drag to move the crop area, use slider to zoom in/out. Select the face area you want to use.
        </p>
      </div>
    </div>
  );
};

export default ManualCropModal;