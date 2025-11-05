import React, { useEffect } from 'react';

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
    // Only draw if we have both imageRef and canvasRef
    if (imageRef?.current && canvasRef?.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (showExtractedFace && face) {
        // Draw extracted face
        const { box } = face;
        const padding = 10;
        const x = Math.max(0, box.x - padding);
        const y = Math.max(0, box.y - padding);
        const w = Math.min(img.width - x, box.width + (padding * 2));
        const h = Math.min(img.height - y, box.height + (padding * 2));
        
        ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
      } else {
        // Draw full image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    } else if (canvasRef?.current && !imageRef) {
      // If no imageRef, just clear the canvas (for page 2)
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [imageRef, canvasRef, showExtractedFace, face]);
  
  return (
    <div className="flex-1">
      <h4 className="text-center font-bold mb-2 text-gray-700">{title}</h4>
      <div className="relative inline-block">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border-2 border-gray-300 rounded-lg shadow-lg bg-white"
        />
        {isDraggable && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none" />
        )}
      </div>
      <button>
        
      </button>
    </div>
  );
};

export default CanvasPreview;