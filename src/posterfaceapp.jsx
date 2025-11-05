import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/header';
import LoginStatus from '../components/loginstatus';
import UploadNewFace from '../components/uploadface';
import PhotoQualityTips from '../components/photoquality';
import { removeBgFromImage } from '../util/removeBg';
import TextControls from '../components/textcontrols';
import ManualCropModal from '../components/ManualCropModal';
import { initFaceDetection, detectFaces, extractFace, findOptimalFace } from '../components/initFaceDetection';
import BackTextControls from '../components/backtextcontrols';
import ActionButtons from '../components/actionsbuttons';
import StatusMessage from '../components/statusmessage';
import CanvasPreview from '../components/canvaspreview';
import DropZone from '../components/dropzone';
import DetectedFaces from '../components/detectedfaces';

const getFacePosition = (face, canvas, textConfig) => {
  if (!face || !canvas) return { x: canvas.width / 2, y: 50 };
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  
  // If this is a cropped image, use simple positioning
  if (face.isCropped) {
    switch (textConfig.position) {
      case 'bottom':
        return { x: canvasWidth / 2, y: canvasHeight - 50 };
      case 'top':
      default:
        return { x: canvasWidth / 2, y: 50 };
    }
  }
  
  // Original face detection positioning
  const { box } = face;
  
  switch (textConfig.position) {
    case 'above-head':
      return {
        x: canvasWidth / 2,
        y: Math.max(50, box.y - 20)
      };
    case 'top-left':
      return {
        x: Math.max(50, box.x - 20),
        y: Math.max(50, box.y + box.height / 2)
      };
    case 'top-right':
      return {
        x: Math.min(canvasWidth - 50, box.x + box.width + 20),
        y: Math.max(50, box.y + box.height / 2)
      };
    case 'bottom':
      return {
        x: canvasWidth / 2,
        y: canvasHeight - 50
      };
    case 'top':
    default:
      return { x: canvasWidth / 2, y: 50 };
  }
};

  const PosterCreatorApp = () => {
      const [currentStep, setCurrentStep] = useState(1);
      const [uploadedImage, setUploadedImage] = useState(null);
      const [detectedFaces, setDetectedFaces] = useState([]);
      const [selectedFace, setSelectedFace] = useState(null);
      const [statusMessage, setStatusMessage] = useState('🎯 Ready to create amazing posters! Click "📁 Upload Image" to start! 🚀');
      const [progress, setProgress] = useState(0);
      const [showDropZone, setShowDropZone] = useState(true);
      const [logoImage, setLogoImage] = useState(null);
const [showPreview, setShowPreview] = useState(false);
const [isRemovingBg, setIsRemovingBg] = useState(false);
const [originalImage, setOriginalImage] = useState(null);


const [isDragging, setIsDragging] = useState(false);
const logoInputRef = useRef(null);
const previewCanvasRef = useRef(null);  
      const [isFaceDetectionInitialized, setIsFaceDetectionInitialized] = useState(false);
      const [textConfig, setTextConfig] = useState({
        text: '',
        font: 'DroidSans',
        color: 'black',
        size: '125',
        position: 'top'
      });
      const [showManualCrop, setShowManualCrop] = useState(false);
      const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
      const [showTextConfirm, setShowTextConfirm] = useState(false);
    
      const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setLogoImage(e.target.result);
            setStatusMessage('✅ Logo uploaded for back side!');
          };
          reader.readAsDataURL(file);
        }
      };

      const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
      };
      
      const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
      };
      
      const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
          handleFileChange(file);
        }
      };

      const [backTextConfig, setBackTextConfig] = useState({
        text: '',
        color: 'black',
        position: 'middle',
        size: '24'  // Add size property
      });

      
      const fileInputRef = useRef(null);
      const page1CanvasRef = useRef(null);
      const page2CanvasRef = useRef(null);
      const imageElementRef = useRef(null);
    const imageRef=useRef(null)
      const handleUpload = () => {
        fileInputRef.current?.click();
      };
    

      useEffect(() => {
        const initialize = async () => {
          try {
            const loaded = await initFaceDetection();
            if (loaded) {
              setIsFaceDetectionInitialized(true);  // This will now work
              console.log('Face detection models loaded successfully');
            } else {
              console.error('Failed to load face detection models');
              setStatusMessage('⚠️ Failed to load face detection. Please refresh.');
            }
          } catch (error) {
            console.error('Error initializing:', error);
            setStatusMessage('⚠️ Error loading models. Please refresh.');
          }
        };
        
        initialize();
      }, []);
      
      

      const processFaceDetection = async (img) => {
        try {
          // Wait for model initialization if needed
          if (!isFaceDetectionInitialized) {
            setStatusMessage('📥 Loading face detection models...');
            const loaded = await initFaceDetection();
            if (!loaded) {
              throw new Error('Failed to load face detection models');
            }
            setIsFaceDetectionInitialized(true);
            setStatusMessage('✅ Models loaded! Detecting faces...');
          }
          
          // Run face detection
          const faces = await detectFaces(img);
          
          if (faces.length === 0) {
            setStatusMessage('⚠️ No faces detected. Click "✂️ Manual Crop" to select face area manually.');
            setDetectedFaces([]); // Make sure it's empty array
            setSelectedFace(null);
            setCurrentStep(2); // Stay at step 2 to show manual crop button
            return;
          }
          
          // Extract faces as thumbnails
          const faceThumbnails = await Promise.all(
            faces.map(async (face, index) => {
              const faceImage = await extractFace(img, face.box, 10);
              return {
                id: index + 1,
                preview: faceImage,
                box: face.box,
                landmarks: face.landmarks
              };
            })
          );
          
          // Set the optimal face as selected
          const optimalFace = findOptimalFace(faces);
          let optimalThumbnail = null;
          if (optimalFace) {
            const optimalFaceIndex = faces.indexOf(optimalFace);
            optimalThumbnail = faceThumbnails.find(f => f.id === optimalFaceIndex + 1);
          }
          
          setDetectedFaces(faceThumbnails);
          setSelectedFace(optimalThumbnail);
          setCurrentStep(3); // Move to step 3 after face is auto-selected
          setStatusMessage('🎨 Face detected! Now add text or click "👁️ Preview" to see your poster.');
        } catch (error) {
          console.error('Error in face detection:', error);
          setStatusMessage(`❌ Error: ${error.message}. Click "✂️ Manual Crop" to select face manually.`);
          setDetectedFaces([]);
          setSelectedFace(null);
          setCurrentStep(2); // Allow manual crop on error
        }
      };

      // const processFaceDetection = async (img) => {
      //   try {
      //     // Wait for model initialization if needed
      //     if (!isFaceDetectionInitialized) {
      //       setStatusMessage('📥 Loading face detection models...');
      //       const loaded = await initFaceDetection();
      //       if (!loaded) {
      //         throw new Error('Failed to load face detection models');
      //       }
      //       setIsFaceDetectionInitialized(true);
      //       setStatusMessage('✅ Models loaded! Detecting faces...');
      //     }
          
      //     // Run face detection
      //     const faces = await detectFaces(img);
          
      //     if (faces.length === 0) {
      //       setStatusMessage('⚠️ No faces detected. You can manually crop the face or try another image.');
      //       setCurrentStep(2); // Stay at step 2 to show manual crop option
      //       return;
      //     }
          
      //     // Extract faces as thumbnails
      //     const faceThumbnails = await Promise.all(
      //       faces.map(async (face, index) => {
      //         const faceImage = await extractFace(img, face.box, 10);
      //         return {
      //           id: index + 1,
      //           preview: faceImage,
      //           box: face.box,
      //           landmarks: face.landmarks
      //         };
      //       })
      //     );
          
      //     // Set the optimal face as selected
      //     const optimalFace = findOptimalFace(faces);
      //     if (optimalFace) {
      //       const optimalFaceIndex = faces.indexOf(optimalFace);
      //       const optimalThumbnail = faceThumbnails.find(f => f.id === optimalFaceIndex + 1);
      //       setSelectedFace(optimalThumbnail);
      //     }
          
      //     setDetectedFaces(faceThumbnails);
      //     setSelectedFace(optimalThumbnail);
      //     setCurrentStep(3); // Move to step 3 after face is auto-selected
      //     setStatusMessage('🎨 Face detected! Now add text or click "👁️ Preview" to see your poster.');
      //   } catch (error) {
      //     console.error('Error in face detection:', error);
      //     setStatusMessage(`❌ Error: ${error.message}`);
      //   }
      // };
   

      // ADD THIS NEW FUNCTION (around line 105, before handleFileChange)
      const createImage = (url) =>
        new Promise((resolve, reject) => {
          const image = new Image();
          image.addEventListener('load', () => resolve(image));
          image.addEventListener('error', (error) => reject(error));
          image.setAttribute('crossOrigin', 'anonymous');
          image.src = url;
        });
      
      const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
      
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
      
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
      
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              resolve(reader.result);
            };
          }, 'image/jpeg');
        });
      };


      const handleManualCrop = async (croppedAreaPixels) => {
        try {
          const croppedImage = await getCroppedImg(uploadedImage, croppedAreaPixels);
          
          // Load the cropped image as the new main image
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.src = croppedImage;
          
          img.onload = () => {
            // Update the main image reference to use cropped version
            imageElementRef.current = img;
            
            // Create a manual face object that covers the entire cropped image
            const manualFace = {
              id: 1,
              preview: croppedImage,
              box: {
                x: 0,
                y: 0,
                width: img.width,
                height: img.height
              },
              landmarks: null,
              isCropped: true
            };
            
            // Update uploaded image to cropped version
            setUploadedImage(croppedImage);
            setDetectedFaces([manualFace]);
            setSelectedFace(manualFace);
            setShowManualCrop(false);
            setCurrentStep(3);
            setStatusMessage('✅ Face manually cropped! Now add text or click "👁️ Preview".');
          };
          
          img.onerror = () => {
            setStatusMessage('❌ Error loading cropped image. Please try again.');
          };
        } catch (error) {
          console.error('Error cropping image:', error);
          setStatusMessage('❌ Error cropping image. Please try again.');
        }
      };

const extractFaceFromCrop = (img, area) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = area.width;
  canvas.height = area.height;
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
  return canvas.toDataURL('image/jpeg');
};




// const handleFileChange = async (file) => {
//   if (file && file.type.startsWith('image/')) {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const imageUrl = event.target.result;
//       setUploadedImage(imageUrl);
//       setShowDropZone(false);
//       setCurrentStep(2);
//       setStatusMessage('✅ Image uploaded! Removing background...');
//       setIsRemovingBg(true);
      
//       try {
//         // First, remove the background
//         const bgRemovedUrl = await removeBgFromImage(imageUrl);
        
//         // Store the original image
//         setOriginalImage(imageUrl);
        
//         // Load the background-removed image
//         const img = new window.Image();
//         img.crossOrigin = "anonymous";
//         img.src = bgRemovedUrl;
        
//         img.onload = async () => {
//           imageElementRef.current = img;
//           setUploadedImage(bgRemovedUrl);
//           setIsRemovingBg(false);
//           setStatusMessage('✅ Background removed! Now processing face detection...');
          
//           // Then proceed with face detection
//           await processFaceDetection(img);
//         };
        
//         img.onerror = () => {
//           // If bg removal fails, use original image
//           setStatusMessage('⚠️ Background removal failed. Using original image...');
//           setIsRemovingBg(false);
//           loadOriginalImage(imageUrl);
//         };
        
//       } catch (error) {
//         console.error('Background removal error:', error);
//         setStatusMessage('⚠️ Background removal failed. Using original image...');
//         setIsRemovingBg(false);
//         // Fallback to original image
//         loadOriginalImage(imageUrl);
//       }
//     };
//     reader.readAsDataURL(file);
//   }
// };

      const handleFileChange = (file) => {  // Remove 'e' parameter, accept file directly
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target.result;
            setUploadedImage(imageUrl);
            setShowDropZone(false);
            setCurrentStep(2);
            setStatusMessage('✅ Image uploaded! Now processing face detection...');
            
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.src = imageUrl;
            
            img.onload = async () => {
              imageElementRef.current = img;
              await processFaceDetection(img);
            };
            
            img.onerror = () => {
              setStatusMessage('❌ Error loading image. Please try another image.');
            };
          };
          reader.readAsDataURL(file);
        }
      };



      const generatePreview = () => {
        // Check if text is empty
        if (!textConfig.text || textConfig.text.trim() === '') {
          setShowTextConfirm(true);
          return;
        }
        
        proceedToPreview();
      };

      

      
      const proceedToPreview = () => {
        setShowTextConfirm(false);
        setStatusMessage('👁️ Generating preview...');
        
        // Show preview modal first so the canvas gets mounted
        setShowPreview(true);
        
        // Wait for the preview canvas to mount, then draw
        setTimeout(() => {
          // Make sure we have the necessary elements
          if (!imageElementRef.current) {
            console.error('No image loaded');
            setStatusMessage('❌ No image loaded. Please upload an image first.');
            return;
          }
          
          if (!page1CanvasRef.current) {
            console.error('Page 1 canvas not ready');
            setStatusMessage('❌ Canvas not ready. Please try again.');
            return;
          }
          
          // Draw to page1 canvas first to ensure it's up to date
          const canvas = page1CanvasRef.current;
          const ctx = canvas.getContext('2d');
          const img = imageElementRef.current;
          
          // Clear and redraw
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Add text if exists
          if (textConfig.text) {
            let x = canvas.width / 2;
            let y = 50;
            
            if (selectedFace && selectedFace.box) {
              const pos = getFacePosition(selectedFace, canvas, textConfig);
              x = pos.x;
              y = pos.y;
            } else {
              y = textConfig.position === 'bottom' ? canvas.height - 50 : 50;
            }
            
            ctx.fillStyle = textConfig.color;
            ctx.font = `bold ${textConfig.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(textConfig.text, x, y);
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }
          
          // Now draw preview
          if (previewCanvasRef.current) {
            const previewCanvas = previewCanvasRef.current;
            const previewCtx = previewCanvas.getContext('2d');
            
            // Clear and draw from page1 canvas
            previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            previewCtx.drawImage(canvas, 0, 0, previewCanvas.width, previewCanvas.height);
            
            setStatusMessage('👁️ Preview ready! Click Download to get high-res files.');
          } else {
            console.error('Preview canvas ref not available');
            setStatusMessage('❌ Preview canvas not ready. Please try again.');
          }
        }, 150);
      };

    
useEffect(() => {
  if (page2CanvasRef.current) {
    const canvas = page2CanvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw logo if uploaded
    if (logoImage) {
      const logo = new Image();
      logo.onload = () => {
        const logoWidth = 200;
        const logoHeight = (logo.height / logo.width) * logoWidth;
        const x = (canvas.width - logoWidth) / 2;
        const y = backTextConfig.position === 'top' ? 50 : (canvas.height - logoHeight) / 2 - 50;
        ctx.drawImage(logo, x, y, logoWidth, logoHeight);

        // Draw back text below logo
        if (backTextConfig.text) {
          ctx.fillStyle = backTextConfig.color;
          ctx.font = `${backTextConfig.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(backTextConfig.text, canvas.width / 2, y + logoHeight + 40);
        }
      };
      logo.src = logoImage;
    } else if (backTextConfig.text) {
      // Draw text only if no logo
      ctx.fillStyle = backTextConfig.color;
      ctx.font = `${backTextConfig.size}px Arial`;
      ctx.textAlign = 'center';
      const y = backTextConfig.position === 'top' ? 100 : canvas.height / 2;
      ctx.fillText(backTextConfig.text, canvas.width / 2, y);
    }
  }
}, [logoImage, backTextConfig]);


useEffect(() => {
  console.log('Canvas draw effect triggered', { 
    hasUploadedImage: !!uploadedImage, 
    hasImageRef: !!imageElementRef.current,
    hasCanvas: !!page1CanvasRef.current,
    textConfigText: textConfig.text
  });
  
  if (uploadedImage && imageElementRef.current && page1CanvasRef.current) {
    const canvas = page1CanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image (will be cropped if manually cropped)
    const img = imageElementRef.current;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    console.log('Drew image to canvas', { width: canvas.width, height: canvas.height });
    
    // Then apply text if exists
    if (textConfig.text) {
      // Position text based on selectedFace or default to top
      let x = canvas.width / 2;
      let y = 50;
      
      if (selectedFace && selectedFace.box) {
        const pos = getFacePosition(selectedFace, canvas, textConfig);
        x = pos.x;
        y = pos.y;
      } else {
        // Default positioning based on textConfig.position
        if (textConfig.position === 'bottom') {
          y = canvas.height - 50;
        }
      }
      
      ctx.fillStyle = textConfig.color;
      ctx.font = `bold ${textConfig.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText(textConfig.text, x, y);
      
      console.log('Drew text to canvas', { text: textConfig.text, x, y });
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  }
}, [textConfig, uploadedImage, selectedFace]);
    
      const simulateFaceDetection = () => {
        setProgress(10);
        setTimeout(() => {
          setDetectedFaces([
            { id: 1, preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfmIA8L3RleHQ+PC9zdmc+' },
            { id: 2, preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfmIE8L3RleHQ+PC9zdmc+' }
          ]);
          setProgress(100);
          setTimeout(() => setProgress(0), 1000);
        }, 1500);
      };
    
      const handleSelectFace = (face) => {
        setSelectedFace(face);
        setCurrentStep(3);
        setStatusMessage('🎨 Face selected! Add text or click "👁️ Preview" to see your poster.');
      };
    
      const drawCanvas = () => {
        const canvas = page1CanvasRef.current;
        if (canvas && uploadedImage) {
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            if (textConfig.text) {
              ctx.fillStyle = textConfig.color;
              ctx.font = `bold ${textConfig.size}px Arial`;
              ctx.textAlign = 'center';
              const y = textConfig.position === 'top' ? 50 : canvas.height - 50;
              ctx.fillText(textConfig.text, canvas.width / 2, y);
            }
          };
          img.src = uploadedImage;
        }
      };
    
      useEffect(() => {
        if (uploadedImage && imageElementRef.current) {
          const canvas = page1CanvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw the image (will be cropped if manually cropped)
            const img = imageElementRef.current;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Then apply text if exists
            if (textConfig.text) {
              // Position text based on selectedFace or default to top
              let x = canvas.width / 2;
              let y = 50;
              
              if (selectedFace && selectedFace.box) {
                const pos = getFacePosition(selectedFace, canvas, textConfig);
                x = pos.x;
                y = pos.y;
              } else {
                // Default positioning based on textConfig.position
                if (textConfig.position === 'bottom') {
                  y = canvas.height - 50;
                }
              }
              
              ctx.fillStyle = textConfig.color;
              ctx.font = `bold ${textConfig.size}px Arial`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              // Draw shadow for better readability
              ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
              ctx.shadowBlur = 5;
              ctx.shadowOffsetX = 2;
              ctx.shadowOffsetY = 2;
              
              ctx.fillText(textConfig.text, x, y);
              
              // Reset shadow
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
            }
          }
        }
      }, [textConfig, uploadedImage, selectedFace]);


      const handleClear = () => {
        setUploadedImage(null);
        setLogoImage(null);  // Add this
        setDetectedFaces([]);
        setSelectedFace(null);
        setCurrentStep(1);
        setShowDropZone(true);
        setShowPreview(false);  // Add this
        setStatusMessage('🎯 Ready to create amazing posters! Click "📁 Upload Image" to start! 🚀');
        setTextConfig({ text: '', font: 'DroidSans', color: 'black', size: '125', position: 'top' });
        setBackTextConfig({ text: '', color: 'black', position: 'middle', size: '24' });  // Add this
      };


      const handleTextConfigChange = (newConfig) => {
        setTextConfig(newConfig);
        if (newConfig.text && currentStep < 4) {
          setCurrentStep(4); // Auto-advance to preview when text is added
        }
      };
    
      const handleDownloadPDF = async () => {
        setStatusMessage('📥 Generating high-resolution images...');
        
        // Create high-res canvases (2x size for print quality)
        const hiResCanvas1 = document.createElement('canvas');
        const hiResCanvas2 = document.createElement('canvas');
        hiResCanvas1.width = 2480; // 8.5" x 292 DPI
        hiResCanvas1.height = 3508; // 11" x 292 DPI
        hiResCanvas2.width = 2480;
        hiResCanvas2.height = 3508;
      
        const ctx1 = hiResCanvas1.getContext('2d');
        const ctx2 = hiResCanvas2.getContext('2d');
      
        // Draw high-res page 1
        if (imageElementRef.current) {
          ctx1.drawImage(imageElementRef.current, 0, 0, hiResCanvas1.width, hiResCanvas1.height);
          
          if (textConfig.text) {
            // Calculate position based on selectedFace or default
            let x = hiResCanvas1.width / 2;
            let y = 200;
            
            if (selectedFace && selectedFace.box && !selectedFace.isCropped) {
              // Scale the box position to high-res canvas
              const scaleX = hiResCanvas1.width / page1CanvasRef.current.width;
              const scaleY = hiResCanvas1.height / page1CanvasRef.current.height;
              const pos = getFacePosition(selectedFace, page1CanvasRef.current, textConfig);
              x = pos.x * scaleX;
              y = pos.y * scaleY;
            } else {
              // Simple positioning for cropped images
              y = textConfig.position === 'bottom' ? hiResCanvas1.height - 150 : 200;
            }
            
            ctx1.fillStyle = textConfig.color;
            ctx1.font = `bold ${parseInt(textConfig.size) * 4}px Arial`;
            ctx1.textAlign = 'center';
            ctx1.textBaseline = 'middle';
            ctx1.shadowColor = 'rgba(0,0,0,0.7)';
            ctx1.shadowBlur = 10;
            ctx1.shadowOffsetX = 3;
            ctx1.shadowOffsetY = 3;
            
            ctx1.fillText(textConfig.text, x, y);
            
            // Reset shadow
            ctx1.shadowColor = 'transparent';
            ctx1.shadowBlur = 0;
            ctx1.shadowOffsetX = 0;
            ctx1.shadowOffsetY = 0;
          }
        }
      
        // Draw high-res page 2
        ctx2.fillStyle = '#f8f9fa';
        ctx2.fillRect(0, 0, hiResCanvas2.width, hiResCanvas2.height);
        
        if (logoImage) {
          const logo = new Image();
          logo.onload = () => {
            const logoWidth = 600;
            const logoHeight = (logo.height / logo.width) * logoWidth;
            const x = (hiResCanvas2.width - logoWidth) / 2;
            const y = backTextConfig.position === 'top' ? 200 : (hiResCanvas2.height - logoHeight) / 2 - 200;
            ctx2.drawImage(logo, x, y, logoWidth, logoHeight);
      
            if (backTextConfig.text) {
              ctx2.fillStyle = backTextConfig.color;
              ctx2.font = `${parseInt(backTextConfig.size) * 4}px Arial`;
              ctx2.textAlign = 'center';
              ctx2.fillText(backTextConfig.text, hiResCanvas2.width / 2, y + logoHeight + 150);
            }
            
            downloadImages(hiResCanvas1, hiResCanvas2);
          };
          logo.src = logoImage;
        } else {
          // Draw back text only if no logo
          if (backTextConfig.text) {
            ctx2.fillStyle = backTextConfig.color;
            ctx2.font = `${parseInt(backTextConfig.size) * 4}px Arial`;
            ctx2.textAlign = 'center';
            const y = backTextConfig.position === 'top' ? 200 : hiResCanvas2.height / 2;
            ctx2.fillText(backTextConfig.text, hiResCanvas2.width / 2, y);
          }
          downloadImages(hiResCanvas1, hiResCanvas2);
        }
      };


      
      const downloadImages = (canvas1, canvas2) => {
        // Download page 1
        const link1 = document.createElement('a');
        link1.download = 'poster-front-highres.png';
        link1.href = canvas1.toDataURL('image/png');
        link1.click();
      
        // Download page 2
        setTimeout(() => {
          const link2 = document.createElement('a');
          link2.download = 'poster-back-highres.png';
          link2.href = canvas2.toDataURL('image/png');
          // link2.click();
          setStatusMessage('✅ High-resolution files downloaded! Ready for printing.');
        }, 500);
      };


      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4">
          <div className="max-w-7xl mx-auto">
            <Header />
            
            {showPreview && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">👁️ Preview</h3>
        <button
          onClick={() => setShowPreview(false)}
          className="p-2 hover:bg-gray-100 rounded text-2xl"
        >
          ✕
        </button>
      </div>
      <div className="flex justify-center">
        <canvas
          ref={previewCanvasRef}
          width={400}
          height={620}
          className="border-2 border-gray-300 rounded mx-auto max-w-full"
        />
      </div>
      
      {/* Three Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {
            setShowPreview(false);
            handleDownloadPDF();
          }}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          📥 Download High-Res PDF
        </button>
        
        <button
          onClick={() => {
            setShowPreview(false);
            setShowManualCrop(true);
          }}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          ✂️ Adjust Crop
        </button>
        
        <button
          onClick={() => {
            setShowPreview(false);
            document.querySelector('input[placeholder*="text"]')?.focus();
            setStatusMessage('✏️ Edit your text in the left sidebar');
          }}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          ✏️ Edit Text
        </button>
      </div>
      
      <p className="text-center text-sm text-gray-600 mt-4">
        Preview your poster before downloading high-resolution files for printing.
      </p>
    </div>
  </div>
)}  
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Sidebar */}
              <div className="lg:col-span-2 space-y-4">
                <LoginStatus />
                <UploadNewFace onUpload={handleUpload} onClear={handleClear} />
             {/* Logo Upload */}
<div className="bg-white p-4 rounded-lg shadow-lg">
  <h3 className="font-bold mb-3 flex items-center gap-2">
    <span>📷</span>
    Back Logo
  </h3>
  <button
    onClick={() => logoInputRef.current?.click()}
    className="w-full p-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-lg font-bold hover:opacity-90 transition"
  >
    📷 Upload Logo
  </button>
  {logoImage && (
    <div className="mt-2 text-sm text-green-600 text-center">✅ Logo uploaded</div>
  )}
</div>
                <PhotoQualityTips />
                <TextControls textConfig={textConfig} onTextChange={handleTextConfigChange} />
                <BackTextControls backTextConfig={backTextConfig} onBackTextChange={setBackTextConfig} />
              </div>
    
              {/* Main Content */}
              <div className="lg:col-span-8 space-y-4">
              <ActionButtons
  currentStep={currentStep}
  onUpload={handleUpload}
  onExtract={() => {
    setCurrentStep(3);
    setStatusMessage('✂️ Face selected! Now add text or click "Preview"');
  }}
  onAddText={() => {
    setCurrentStep(4);
    setStatusMessage('📝 Text added! Click "Preview" to see your poster');
  }}
  onPreview={() => {
    generatePreview();  // This checks for text and calls proceedToPreview
    if (textConfig.text && textConfig.text.trim() !== '') {
      setCurrentStep(5);  // Only advance if text exists
    }
  }}
  onDownload={() => {
    handleDownloadPDF();  // Don't change step here
  }}
  onManualCrop={() => setShowManualCrop(true)}
  showManualCropButton={uploadedImage && currentStep === 2 && detectedFaces.length === 0}
/>

                <StatusMessage message={statusMessage} progress={progress} />
                
                <div className="bg-white p-6 rounded-lg shadow-xl">
  <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
    {!uploadedImage ? (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-4 border-dashed rounded-lg p-12 text-center cursor-pointer transition w-full ${
          isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
        }`}
      >
        <span className="text-6xl block mb-4">📁</span>
        <p className="text-xl font-semibold text-gray-600">
          Drag & Drop your image here
        </p>
        <p className="text-gray-500 mt-2">or click to browse files</p>
      </div>
    ) : (
      <>
       <div className="relative w-full">
  <CanvasPreview  
    title="Page 1 - Front"
    imageRef={imageElementRef}     
    canvasRef={page1CanvasRef}    
    showExtractedFace={false}
    face={selectedFace}
    isDraggable={false}
    showFaceBox={false}
  />
</div>
  <div className="w-full">
    <CanvasPreview 
      title="Page 2 - Back" 
      canvasRef={page2CanvasRef}
      width={300}
      height={464}
    />
  </div>
      </>
    )}
  </div>
</div>




{showManualCrop && uploadedImage && (
  <ManualCropModal
    image={uploadedImage}
    onComplete={handleManualCrop}
    onCancel={() => setShowManualCrop(false)}
  />
)}

{showTextConfirm && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 max-w-md">
      <h3 className="text-xl font-bold mb-4">⚠️ No Text Added</h3>
      <p className="text-gray-700 mb-6">
        You haven't added any text to your poster. Do you want to continue without text?
      </p>
      <div className="flex gap-3">
        <button
          onClick={proceedToPreview}
          className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold"
        >
          ✅ Continue Without Text
        </button>
        <button
          onClick={() => setShowTextConfirm(false)}
          className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
        >
          ❌ Go Back & Add Text
        </button>
      </div>
    </div>
  </div>
)}


              </div>


    
              {/* Right Sidebar */}
              <div className="lg:col-span-2 space-y-4">
                <a
                  href="https://youtu.be/VT15VTKmB8o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-center rounded-lg font-semibold shadow-lg hover:-translate-y-1 transition-transform"
                >
                  📺 How To Use
                </a>
                <DetectedFaces faces={detectedFaces} onSelectFace={handleSelectFace} />
              </div>
            </div>
    
            <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={(e) => handleFileChange(e.target.files[0])}  // Pass file directly
  className="hidden"
/>

<input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="hidden"
        />
          </div>
    
      
        </div>
      );
    };
    
    export default PosterCreatorApp;