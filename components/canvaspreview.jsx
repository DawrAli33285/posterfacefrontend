import React, { useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

const CanvasPreview = ({ 
  title, 
  imageRef, 
  canvasRef, 
  showExtractedFace = false, 
  face,
  isDraggable = false,
  showFaceBox = false,
  width = 300,
  height = 464
}) => {
  
  useEffect(() => {
    if (imageRef?.current && canvasRef?.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (showExtractedFace && face) {
        const { box } = face;
        const padding = 10;
        const x = Math.max(0, box.x - padding);
        const y = Math.max(0, box.y - padding);
        const w = Math.min(img.width - x, box.width + (padding * 2));
        const h = Math.min(img.height - y, box.height + (padding * 2));
        
        ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    } else if (canvasRef?.current && !imageRef) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [imageRef, canvasRef, showExtractedFace, face]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 px-4 py-2 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-gray-600" />
          <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        </div>
      </div>
      
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
        
        <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 p-3">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="rounded-lg bg-gray-50"
            style={{ display: 'block' }}
          />
          
          {isDraggable && (
            <div className="absolute inset-3 pointer-events-none rounded-lg border-2 border-dashed border-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
        
        {isDraggable && (
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
              Interactive Preview
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasPreview;