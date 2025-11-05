import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

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
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <h3 className="text-xl font-bold mb-4">✂️ Manually Select Face Area</h3>
        
        <div className="relative w-full h-96 bg-gray-100 rounded-lg mb-4">
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

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Zoom:</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>1x</span>
            <span>2x</span>
            <span>3x</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition"
          >
            ✅ Confirm Selection
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition"
          >
            ❌ Cancel
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-4 text-center">
          💡 Drag to move the crop area, use slider to zoom in/out. Select the face area you want to use.
        </p>
      </div>
    </div>
  );
};

export default ManualCropModal;