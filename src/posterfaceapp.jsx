import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/header';
import LoginStatus from '../components/loginstatus';
import UploadNewFace from '../components/uploadface';
import PhotoQualityTips from '../components/photoquality';
import TextControls from '../components/textcontrols';
import { initFaceDetection, detectFaces, extractFace, findOptimalFace } from '../components/initFaceDetection';
import BackTextControls from '../components/backtextcontrols';
import ActionButtons from '../components/actionsbuttons';
import StatusMessage from '../components/statusmessage';
import CanvasPreview from '../components/canvaspreview';
import DropZone from '../components/dropzone';
import DetectedFaces from '../components/detectedfaces';
const getFacePosition = (face, canvas, textConfig) => {
  if (!face || !canvas) return { x: canvas.width / 2, y: 50 };
  
  const { box } = face;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  
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
    const [isFaceDetectionInitialized, setIsFaceDetectionInitialized] = useState(false);
    const [textConfig, setTextConfig] = useState({
      text: '',
      font: 'DroidSans',
      color: 'black',
      size: '125',
      position: 'top'
    });
  
    const [backTextConfig, setBackTextConfig] = useState({
      text: '',
      color: 'black',
      position: 'middle'
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
          setStatusMessage('⚠️ No faces detected. Try another image.');
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
        if (optimalFace) {
          const optimalFaceIndex = faces.indexOf(optimalFace);
          const optimalThumbnail = faceThumbnails.find(f => f.id === optimalFaceIndex + 1);
          setSelectedFace(optimalThumbnail);
        }
        
        setDetectedFaces(faceThumbnails);
        setSelectedFace(optimalThumbnail);
        setCurrentStep(3); // Move to step 3 after face is auto-selected
        setStatusMessage('🎨 Face detected! Now add text or click "👁️ Preview" to see your poster.');
      } catch (error) {
        console.error('Error in face detection:', error);
        setStatusMessage(`❌ Error: ${error.message}`);
      }
    };
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
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
  
    // Update the canvas drawing effect
    useEffect(() => {
    
      if (uploadedImage && imageElementRef.current) {
        const canvas = page1CanvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw the full image first
          const img = imageElementRef.current;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Then apply text if exists (even without selectedFace)
          if (textConfig.text) {
            const { x, y } = selectedFace 
              ? getFacePosition(selectedFace, canvas, textConfig)
              : { x: canvas.width / 2, y: 50 };
            ctx.fillStyle = textConfig.color;
            ctx.font = `bold ${textConfig.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Draw shadow for better readability
            ctx.shadowColor = 'black';
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
      setDetectedFaces([]);
      setSelectedFace(null);
      setCurrentStep(1);
      setShowDropZone(true);
      setStatusMessage('🎯 Ready to create amazing posters! Click "📁 Upload Image" to start! 🚀');
      setTextConfig({ text: '', font: 'DroidSans', color: 'black', size: '125', position: 'top' });
    };


    const handleTextConfigChange = (newConfig) => {
      setTextConfig(newConfig);
      if (newConfig.text && currentStep < 4) {
        setCurrentStep(4); // Auto-advance to preview when text is added
      }
    };
  
    const handleDownloadPDF = async () => {
      try {
        setStatusMessage('📥 Generating PDF...');
        
        // You'll need to implement PDF generation here
        // For now, just download the canvas as image
        const canvas = page1CanvasRef.current;
        if (canvas) {
          const link = document.createElement('a');
          link.download = 'poster.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          setStatusMessage('✅ Download complete!');
        }
      } catch (error) {
        console.error('Error downloading:', error);
        setStatusMessage('❌ Error downloading. Please try again.');
      }
    };
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4">
        <div className="max-w-7xl mx-auto">
          <Header />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Sidebar */}
            <div className="lg:col-span-2 space-y-4">
              <LoginStatus />
              <UploadNewFace onUpload={handleUpload} onClear={handleClear} />
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
    setCurrentStep(5);
    setStatusMessage('👁️ Preview ready! Click "Download PDF" to save');
  }}
  onDownload={() => {
    setCurrentStep(5);
    handleDownloadPDF();
  }}
/>
              <StatusMessage message={statusMessage} progress={progress} />
              
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
                  <div className="relative w-full md:w-1/2">
                    <CanvasPreview  title="Face Canvas"
  imageRef={imageRef}     
  canvasRef={page1CanvasRef}    
  showExtractedFace={true} // Show extracted face instead of full image
  face={selectedFace}      // The face detection data
  isDraggable={false}      // Whether the canvas can be dragged
  showFaceBox={true}       // Show face bounding box
/>
                    <DropZone onFileSelect={handleUpload} isVisible={showDropZone} />
                  </div>
                  <div className="w-full md:w-1/2">
                    <CanvasPreview title="Page 2" canvasRef={page2CanvasRef} />
                  </div>
                </div>
              </div>
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
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
  
    
      </div>
    );
  };
  
  export default PosterCreatorApp;