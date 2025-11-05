

import React, { useState, useRef, useEffect } from 'react';



const CanvasPreview = ({ title, imageRef, canvasRef, showExtractedFace = false, face,isDraggable,showFaceBox}) =>{
  useEffect(()=>{
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
        const width = Math.min(canvas.width, box.width + (padding * 2));
        const height = Math.min(canvas.height, box.height + (padding * 2));
        
        ctx.drawImage(img, x, y, width, height, 0, 0, canvas.width, canvas.height);
      } else {
        // Draw full image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

    }
  },[imageRef, canvasRef, showExtractedFace, face])
  
  return(
    <div className="flex-1">
      <h4 className="text-center font-bold mb-2 text-gray-700">{title}</h4>
      <div className="relative inline-block">
        <canvas
          ref={canvasRef}
          width={300}
          height={464}
          className="border-2 border-gray-300 rounded-lg shadow-lg bg-white"
        />
        {isDraggable && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none" />
        )}
      </div>
    </div>
  )
}

  export default CanvasPreview